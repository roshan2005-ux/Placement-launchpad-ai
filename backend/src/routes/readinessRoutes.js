import express from 'express';
import {
  getPlacementReadiness,
  getRecommendations,
} from '../controllers/readinessController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getPlacementReadiness);
router.get('/recommendations', protect, getRecommendations);

export default router;
