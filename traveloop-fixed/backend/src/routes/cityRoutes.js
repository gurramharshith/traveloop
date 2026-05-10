import express from 'express';
import { protect } from '../middleware/auth.js';
import * as cityController from '../controllers/cityController.js';

const router = express.Router();

router.get('/search', cityController.searchCities);
router.get('/popular', cityController.getPopularCities);
router.post('/seed', cityController.seedCities);
router.get('/:id', cityController.getCity);

export default router;
