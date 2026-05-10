import Checklist from '../models/Checklist.js';
import Trip from '../models/Trip.js';
import mongoose from 'mongoose';

const verifyTripOwner = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);
  return trip && trip.userId.toString() === userId ? trip : null;
};

export const getChecklist = async (req, res) => {
  try {
    const { tripId } = req.params;
    if (!await verifyTripOwner(tripId, req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    let checklist = await Checklist.findOne({ tripId });
    if (!checklist) {
      checklist = new Checklist({ tripId, items: [] });
      await checklist.save();
    }
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { tripId } = req.params;
    if (!await verifyTripOwner(tripId, req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const { name, category } = req.body;
    let checklist = await Checklist.findOne({ tripId });
    if (!checklist) checklist = new Checklist({ tripId, items: [] });

    checklist.items.push({ _id: new mongoose.Types.ObjectId(), name, category: category || 'other', isPacked: false });
    await checklist.save();
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;
    if (!await verifyTripOwner(tripId, req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const checklist = await Checklist.findOne({ tripId });
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });

    const item = checklist.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.isPacked = !item.isPacked;
    await checklist.save();
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { tripId, itemId } = req.params;
    if (!await verifyTripOwner(tripId, req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const checklist = await Checklist.findOne({ tripId });
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });

    checklist.items = checklist.items.filter(item => item._id.toString() !== itemId);
    await checklist.save();
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetChecklist = async (req, res) => {
  try {
    const { tripId } = req.params;
    if (!await verifyTripOwner(tripId, req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const checklist = await Checklist.findOne({ tripId });
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });

    checklist.items.forEach(item => { item.isPacked = false; });
    await checklist.save();
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
