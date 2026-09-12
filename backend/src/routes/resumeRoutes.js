import express from 'express';
import {
  uploadResume,
  getResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { resumeUploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, resumeUploadMiddleware, uploadResume);
router.get('/', protect, getResume);
router.delete('/', protect, deleteResume);

export default router;
