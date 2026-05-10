import Activity from '../models/Activity.js';
import Stop from '../models/Stop.js';
import Trip from '../models/Trip.js';

const verifyOwnership = async (stopId, userId) => {
  const stop = await Stop.findById(stopId);
  if (!stop) return null;
  const trip = await Trip.findById(stop.tripId);
  if (!trip || trip.userId.toString() !== userId) return null;
  return stop;
};

export const createActivity = async (req, res) => {
  try {
    const { stopId, name, category, description, cost, duration, date, time, notes } = req.body;

    const stop = await verifyOwnership(stopId, req.userId);
    if (!stop) return res.status(403).json({ message: 'Unauthorized or stop not found' });

    const activity = new Activity({ stopId, name, category, description, cost, duration, date, time, notes });
    await activity.save();

    stop.activities.push(activity._id);
    await stop.save();

    res.status(201).json({ message: 'Activity created', activity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    const stop = await verifyOwnership(activity.stopId, req.userId);
    if (!stop) return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(activity, req.body);
    await activity.save();
    res.json({ message: 'Activity updated', activity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    const stop = await verifyOwnership(activity.stopId, req.userId);
    if (!stop) return res.status(403).json({ message: 'Unauthorized' });

    await Stop.findByIdAndUpdate(activity.stopId, { $pull: { activities: activity._id } });
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchActivities = async (req, res) => {
  try {
    const { q, category, maxCost, maxDuration } = req.query;
    const filter = {};

    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category && category !== 'all') filter.category = category;
    if (maxCost) filter.cost = { $lte: Number(maxCost) };
    if (maxDuration) filter.duration = { $lte: Number(maxDuration) };

    const activities = await Activity.find(filter).limit(60);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
