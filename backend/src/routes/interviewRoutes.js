import express from 'express';
import {
  startInterview,
  submitAnswer,
  getLatestInterview,
  getInterviewById,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', protect, startInterview);
router.get('/latest', protect, getLatestInterview);
router.post('/:id/answer', protect, submitAnswer);
router.get('/:id', protect, getInterviewById);

export default router;
