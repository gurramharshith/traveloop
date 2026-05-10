import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Trip from '../models/Trip.js';

const router = express.Router();

// Middleware to restrict to admins
const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all users (admin)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user (admin)
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Trip.deleteMany({ userId: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all trips (admin)
router.get('/trips', protect, adminOnly, async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 }).limit(200);
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
