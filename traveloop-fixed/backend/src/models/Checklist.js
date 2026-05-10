import mongoose from 'mongoose';

const checklistSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    items: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        category: {
          type: String,
          enum: ['clothing', 'documents', 'electronics', 'toiletries', 'other'],
          default: 'other',
        },
        isPacked: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Checklist', checklistSchema);
