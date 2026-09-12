import fs from 'fs';
import path from 'path';
import Resume from '../models/Resume.js';
import { RESUME_UPLOAD_DIR } from '../middleware/upload.js';

// Helper function to safely delete physical resume file
const safeDeleteFile = (storedName) => {
  if (!storedName) return;
  // Guard against path traversal
  const safeBaseName = path.basename(storedName);
  const fullPath = path.resolve(RESUME_UPLOAD_DIR, safeBaseName);

  // Ensure target path is strictly inside the resumes upload directory
  if (fullPath.startsWith(RESUME_UPLOAD_DIR) && fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch (err) {
      console.error(`[Resume Storage] Failed to delete file ${safeBaseName}:`, err.message);
    }
  }
};

// @desc    Upload or replace student's resume
// @route   POST /api/resume/upload
// @access  Private
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please select a resume file to upload.',
      });
    }

    const userId = req.user._id || req.user.id;

    // Check if student already has an uploaded resume
    const existingResume = await Resume.findOne({ userId });

    if (existingResume) {
      // Clean up previous file from local server storage
      safeDeleteFile(existingResume.storedName);

      // Update existing record
      existingResume.originalName = req.file.originalname;
      existingResume.storedName = req.file.filename;
      existingResume.fileType = req.file.mimetype;
      existingResume.fileSize = req.file.size;
      existingResume.uploadedAt = new Date();

      await existingResume.save();

      return res.status(200).json({
        status: 'success',
        message: 'Resume replaced successfully.',
        resume: existingResume.toSafeObject(),
      });
    }

    // Create new resume record
    const newResume = await Resume.create({
      userId,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedAt: new Date(),
    });

    return res.status(201).json({
      status: 'success',
      message: 'Resume uploaded successfully.',
      resume: newResume.toSafeObject(),
    });
  } catch (error) {
    console.error('[Resume Upload Error]:', error);

    // Clean up uploaded file if database save failed
    if (req.file) {
      safeDeleteFile(req.file.filename);
    }

    return res.status(500).json({
      status: 'error',
      message: 'Failed to process resume upload.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get current student's resume metadata
// @route   GET /api/resume
// @access  Private
export const getResume = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const resume = await Resume.findOne({ userId });

    if (!resume) {
      return res.status(200).json({
        status: 'success',
        resume: null,
      });
    }

    return res.status(200).json({
      status: 'success',
      resume: resume.toSafeObject(),
    });
  } catch (error) {
    console.error('[Get Resume Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve resume information.',
    });
  }
};

// @desc    Delete student's resume
// @route   DELETE /api/resume
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const resume = await Resume.findOne({ userId });

    if (!resume) {
      return res.status(404).json({
        status: 'error',
        message: 'No resume found to delete.',
      });
    }

    // Delete stored file from server disk
    safeDeleteFile(resume.storedName);

    // Delete record from database
    await Resume.findOneAndDelete({ userId });

    return res.status(200).json({
      status: 'success',
      message: 'Resume deleted successfully.',
    });
  } catch (error) {
    console.error('[Delete Resume Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete resume.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
