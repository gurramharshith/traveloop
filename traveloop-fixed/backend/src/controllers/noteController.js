import Note from '../models/Note.js';
import Trip from '../models/Trip.js';

const verifyTripOwner = async (tripId, userId) => {
  const trip = await Trip.findById(tripId);
  return trip && trip.userId.toString() === userId ? trip : null;
};

export const getNotes = async (req, res) => {
  try {
    const { tripId } = req.params;
    if (!await verifyTripOwner(tripId, req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const { stopId } = req.query;
    const filter = { tripId };
    if (stopId) filter.stopId = stopId;

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const { tripId } = req.params;
    if (!await verifyTripOwner(tripId, req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const { content, stopId } = req.body;
    const note = new Note({ tripId, content, stopId: stopId || null });
    await note.save();
    res.status(201).json({ message: 'Note created', note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { tripId, noteId } = req.params;
    if (!await verifyTripOwner(tripId, req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const note = await Note.findOneAndUpdate({ _id: noteId, tripId }, { content: req.body.content }, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note updated', note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { tripId, noteId } = req.params;
    if (!await verifyTripOwner(tripId, req.userId)) return res.status(403).json({ message: 'Unauthorized' });

    const note = await Note.findOneAndDelete({ _id: noteId, tripId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
