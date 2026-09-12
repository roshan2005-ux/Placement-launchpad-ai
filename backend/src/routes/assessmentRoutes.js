import express from 'express';
import {
  getAssessmentQuestions,
  submitAssessment,
  getLatestAssessment,
} from '../controllers/assessmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/questions', protect, getAssessmentQuestions);
router.post('/submit', protect, submitAssessment);
router.get('/latest', protect, getLatestAssessment);

export default router;
