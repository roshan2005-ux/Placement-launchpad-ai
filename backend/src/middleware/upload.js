import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
export const RESUME_UPLOAD_DIR = path.resolve(__dirname, '../../uploads/resumes');
if (!fs.existsSync(RESUME_UPLOAD_DIR)) {
  fs.mkdirSync(RESUME_UPLOAD_DIR, { recursive: true });
}

// Allowed extensions and MIME types
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Windows / some browsers send application/octet-stream for .docx
  'application/octet-stream',
]);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, RESUME_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXTENSIONS.has(rawExt) ? rawExt : '.pdf';
    const userId = req.user ? String(req.user._id || req.user.id) : 'guest';
    const cleanUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
    const uniqueFilename = `resume-${cleanUserId}-${uniqueSuffix}${safeExt}`;
    cb(null, uniqueFilename);
  },
});

// File filter for validating file types
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isExtAllowed = ALLOWED_EXTENSIONS.has(ext);
  const isMimeAllowed = ALLOWED_MIME_TYPES.has(mime);

  if (isExtAllowed && isMimeAllowed) {
    cb(null, true);
  } else {
    const err = new Error('Only PDF, DOC and DOCX files are allowed.');
    err.code = 'INVALID_FILE_TYPE';
    cb(err, false);
  }
};

// 5 MB limit
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes
    files: 1,
  },
  fileFilter,
}).single('resume');

// Middleware wrapper that intercepts Multer errors and returns user-friendly JSON
export const resumeUploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'Maximum file size is 5 MB.',
          });
        }
        return res.status(400).json({
          status: 'error',
          message: `Upload error: ${err.message}`,
        });
      }

      if (err.code === 'INVALID_FILE_TYPE' || err.message === 'Only PDF, DOC and DOCX files are allowed.') {
        return res.status(400).json({
          status: 'error',
          message: 'Only PDF, DOC and DOCX files are allowed.',
        });
      }

      return res.status(400).json({
        status: 'error',
        message: err.message || 'File upload failed.',
      });
    }

    next();
  });
};
