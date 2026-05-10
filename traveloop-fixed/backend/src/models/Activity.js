import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    stopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'sightseeing',
        'food',
        'adventure',
        'culture',
        'relaxation',
        'shopping',
        'nightlife',
        'other',
      ],
      default: 'other',
    },
    description: String,
    cost: Number,
    duration: Number, // in hours
    date: Date,
    time: String,
    images: [String],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
