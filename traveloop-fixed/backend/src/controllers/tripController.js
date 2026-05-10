import Trip from '../models/Trip.js';
import Stop from '../models/Stop.js';

export const createTrip = async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget, coverPhoto } =
      req.body;
    const userId = req.userId;

    const trip = new Trip({
      name,
      description,
      userId,
      startDate,
      endDate,
      budget,
      coverPhoto,
    });

    await trip.save();
    res.status(201).json({ message: 'Trip created', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await Trip.find({ userId }).populate('stops');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id)
      .populate({
        path: 'stops',
        populate: { path: 'activities' },
      });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    Object.assign(trip, req.body);
    await trip.save();

    res.json({ message: 'Trip updated', trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Stop.deleteMany({ tripId: id });
    await Trip.findByIdAndDelete(id);

    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id)
      .populate({
        path: 'stops',
        populate: { path: 'activities' },
      });

    if (!trip || !trip.isPublic) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
