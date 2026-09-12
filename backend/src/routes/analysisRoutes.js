import express from 'express';
import { analyzeResume, getLatestAnalysis } from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/resume', protect, analyzeResume);
router.get('/resume', protect, getLatestAnalysis);

export default router;
