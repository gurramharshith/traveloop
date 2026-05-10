import express from 'express';
import { protect } from '../middleware/auth.js';
import * as tripController from '../controllers/tripController.js';

const router = express.Router();

// Trip routes
router.post('/', protect, tripController.createTrip);
router.get('/', protect, tripController.getUserTrips);
router.get('/:id', protect, tripController.getTrip);
router.put('/:id', protect, tripController.updateTrip);
router.delete('/:id', protect, tripController.deleteTrip);

// Public trip routes
router.get('/public/:id', tripController.getPublicTrip);

export default router;
