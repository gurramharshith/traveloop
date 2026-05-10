import User from '../models/User.js';
import Trip from '../models/Trip.js';
import Stop from '../models/Stop.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, profilePicture, language } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (language) user.language = language;

    await user.save();
    res.json({ message: 'Profile updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId });
    const tripIds = trips.map(t => t._id);
    await Stop.deleteMany({ tripId: { $in: tripIds } });
    await Trip.deleteMany({ userId: req.userId });
    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveDestination = async (req, res) => {
  try {
    const { cityId } = req.body;
    const user = await User.findById(req.userId);
    if (!user.savedDestinations.includes(cityId)) {
      user.savedDestinations.push(cityId);
      await user.save();
    }
    res.json({ message: 'Destination saved', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
