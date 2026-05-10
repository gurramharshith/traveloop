import express from 'express';
import { protect } from '../middleware/auth.js';
import * as checklistController from '../controllers/checklistController.js';

const router = express.Router();

router.get('/:tripId', protect, checklistController.getChecklist);
router.post('/:tripId/items', protect, checklistController.addItem);
router.put('/:tripId/items/:itemId/toggle', protect, checklistController.toggleItem);
router.delete('/:tripId/items/:itemId', protect, checklistController.deleteItem);
router.post('/:tripId/reset', protect, checklistController.resetChecklist);

export default router;
