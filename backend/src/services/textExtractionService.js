import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import { RESUME_UPLOAD_DIR } from '../middleware/upload.js';

// Text cleaning and sanitization utility
export const cleanText = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return '';

  return rawText
    // Normalize newlines
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove null bytes and non-printable control characters (except newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ')
    // Collapse horizontal whitespace
    .replace(/[ \t]+/g, ' ')
    // Trim spaces around newlines
    .replace(/[ \t]*\n[ \t]*/g, '\n')
    // Collapse excessive newlines (max 2 consecutive)
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
};

/**
 * Fallback parser for extracting text from PDF buffers when PDFParse encounters malformed objects
 */
const fallbackPdfExtract = (buffer) => {
  const binaryString = buffer.toString('binary');
  const textPieces = [];

  // 1. Try to find raw stream chunks
  const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
  let match;
  while ((match = streamRegex.exec(binaryString)) !== null) {
    const rawChunk = match[1];
    const chunkBuffer = Buffer.from(rawChunk, 'binary');

    // Attempt zlib inflation if compressed
    try {
      const decompressed = zlib.inflateSync(chunkBuffer);
      const decStr = decompressed.toString('utf-8');
      const printable = decStr.match(/[\x20-\x7E\s]{4,}/g);
      if (printable) textPieces.push(printable.join(' '));
    } catch {
      // Chunk was not deflated or was raw text
      const printable = rawChunk.match(/[\x20-\x7E\s]{4,}/g);
      if (printable) textPieces.push(printable.join(' '));
    }
  }

  // 2. Also extract text operators like (Text) Tj or [(Text)] TJ
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  while ((match = tjRegex.exec(binaryString)) !== null) {
    textPieces.push(match[1]);
  }

  // 3. Fallback to extracting all printable character sequences
  if (textPieces.length === 0) {
    const generalPrintable = binaryString.match(/[\x20-\x7E\s]{4,}/g);
    if (generalPrintable) textPieces.push(generalPrintable.join(' '));
  }

  return textPieces.join(' ');
};

/**
 * Extracts raw, cleaned text from a stored resume file on server disk
 * @param {string} storedName - The unique stored filename in backend/uploads/resumes/
 * @returns {Promise<string>} Cleaned text extracted from the document
 */
export const extractTextFromFile = async (storedName) => {
  if (!storedName) {
    throw new Error('Stored filename is required for text extraction.');
  }

  // Guard against path traversal
  const safeBaseName = path.basename(storedName);
  const fullPath = path.resolve(RESUME_UPLOAD_DIR, safeBaseName);

  if (!fullPath.startsWith(RESUME_UPLOAD_DIR) || !fs.existsSync(fullPath)) {
    throw new Error('Resume file not found on server storage.');
  }

  const ext = path.extname(safeBaseName).toLowerCase();
  const fileBuffer = await fs.promises.readFile(fullPath);

  let rawExtracted = '';

  try {
    if (ext === '.pdf') {
      try {
        const parser = new PDFParse({ data: fileBuffer });
        const textResult = await parser.getText();
        if (typeof textResult === 'string') {
          rawExtracted = textResult;
        } else if (textResult && typeof textResult.text === 'string') {
          rawExtracted = textResult.text;
        }
        await parser.destroy();
      } catch (pdfErr) {
        console.warn(`[PDF Parse Fallback] Standard parser notice for ${safeBaseName}: ${pdfErr.message}. Using binary stream extractor.`);
        rawExtracted = fallbackPdfExtract(fileBuffer);
      }

      if (!rawExtracted || rawExtracted.trim().length < 10) {
        rawExtracted = fallbackPdfExtract(fileBuffer);
      }
    } else if (ext === '.docx') {
      const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
      rawExtracted = docxData.value || '';
    } else if (ext === '.doc') {
      try {
        const docData = await mammoth.extractRawText({ buffer: fileBuffer });
        rawExtracted = docData.value || '';
      } catch {
        const textChunk = fileBuffer.toString('binary');
        const printableMatches = textChunk.match(/[\x20-\x7E\s]{4,}/g);
        rawExtracted = printableMatches ? printableMatches.join(' ') : '';
      }
    } else {
      throw new Error(`Unsupported document extension: ${ext}`);
    }
  } catch (extractionErr) {
    console.error(`[Extraction Error] Failed parsing ${safeBaseName}:`, extractionErr.message);
    throw new Error(`Failed to extract text from ${ext.toUpperCase()} resume: ${extractionErr.message}`);
  }

  const cleaned = cleanText(rawExtracted);

  // Validate extracted content quality
  if (!cleaned || cleaned.length < 20) {
    throw new Error(
      'Resume appears empty or contains scanned images without extractable text. Please upload a text-based resume (PDF or DOCX).'
    );
  }

  return cleaned;
};
