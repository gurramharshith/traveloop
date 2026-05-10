import Stop from '../models/Stop.js';
import Trip from '../models/Trip.js';

export const createStop = async (req, res) => {
  try {
    const { tripId, city, country, startDate, endDate, accommodation, estimatedCost, order } = req.body;
    const userId = req.userId;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });

    const stop = new Stop({ tripId, city, country, startDate, endDate, accommodation, estimatedCost, order });
    await stop.save();

    trip.stops.push(stop._id);
    await trip.save();

    res.status(201).json({ message: 'Stop created', stop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStop = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id).populate('activities');
    if (!stop) return res.status(404).json({ message: 'Stop not found' });
    res.json(stop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStop = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (!stop) return res.status(404).json({ message: 'Stop not found' });

    const trip = await Trip.findById(stop.tripId);
    if (trip.userId.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(stop, req.body);
    await stop.save();
    res.json({ message: 'Stop updated', stop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);
    if (!stop) return res.status(404).json({ message: 'Stop not found' });

    const trip = await Trip.findById(stop.tripId);
    if (trip.userId.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    await Trip.findByIdAndUpdate(stop.tripId, { $pull: { stops: stop._id } });
    await Stop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stop deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderStops = async (req, res) => {
  try {
    const { tripId, stopIds } = req.body;
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.userId.toString() !== req.userId) return res.status(403).json({ message: 'Unauthorized' });

    await Promise.all(stopIds.map((id, index) => Stop.findByIdAndUpdate(id, { order: index })));
    trip.stops = stopIds;
    await trip.save();
    res.json({ message: 'Stops reordered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
