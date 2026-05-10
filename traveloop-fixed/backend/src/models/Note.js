import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    stopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stop',
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Note', noteSchema);
