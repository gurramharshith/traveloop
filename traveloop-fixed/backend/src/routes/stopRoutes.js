import express from 'express';
import { protect } from '../middleware/auth.js';
import * as stopController from '../controllers/stopController.js';

const router = express.Router();

router.post('/', protect, stopController.createStop);
router.get('/:id', protect, stopController.getStop);
router.put('/:id', protect, stopController.updateStop);
router.delete('/:id', protect, stopController.deleteStop);
router.post('/reorder', protect, stopController.reorderStops);

export default router;
