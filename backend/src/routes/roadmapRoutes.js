import express from 'express';
import {
  generateRoadmap,
  getLatestRoadmap,
  toggleWeekMilestone,
} from '../controllers/roadmapController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.get('/', protect, getLatestRoadmap);
router.put('/week/:weekNumber/toggle', protect, toggleWeekMilestone);

export default router;
