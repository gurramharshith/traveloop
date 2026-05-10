import express from 'express';
import { protect } from '../middleware/auth.js';
import * as userController from '../controllers/userController.js';

const router = express.Router();

router.put('/profile', protect, userController.updateProfile);
router.delete('/account', protect, userController.deleteAccount);
router.post('/save-destination', protect, userController.saveDestination);

export default router;
