import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: String,
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
      },
    ],
    accommodation: {
      name: String,
      cost: Number,
      checkInDate: Date,
      checkOutDate: Date,
    },
    notes: String,
    estimatedCost: {
      type: Number,
      default: 0,
    },
    order: Number,
  },
  { timestamps: true }
);

export default mongoose.model('Stop', stopSchema);
