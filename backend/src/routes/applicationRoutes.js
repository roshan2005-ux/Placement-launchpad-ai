import express from 'express';
import {
  getApplications,
  getApplicationStats,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Stats route must be placed before :id route
router.get('/stats', protect, getApplicationStats);

router.get('/', protect, getApplications);
router.post('/', protect, createApplication);

router.put('/:id', protect, updateApplication);
router.patch('/:id/status', protect, updateApplicationStatus);
router.delete('/:id', protect, deleteApplication);

export default router;
