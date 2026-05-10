import express from 'express';
import { protect } from '../middleware/auth.js';
import * as activityController from '../controllers/activityController.js';

const router = express.Router();

router.post('/', protect, activityController.createActivity);
router.get('/search', protect, activityController.searchActivities);
router.get('/:id', protect, activityController.getActivity);
router.put('/:id', protect, activityController.updateActivity);
router.delete('/:id', protect, activityController.deleteActivity);

export default router;
