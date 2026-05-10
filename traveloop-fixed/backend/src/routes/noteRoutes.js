import express from 'express';
import { protect } from '../middleware/auth.js';
import * as noteController from '../controllers/noteController.js';

const router = express.Router();

router.get('/:tripId', protect, noteController.getNotes);
router.post('/:tripId', protect, noteController.createNote);
router.put('/:tripId/:noteId', protect, noteController.updateNote);
router.delete('/:tripId/:noteId', protect, noteController.deleteNote);

export default router;
