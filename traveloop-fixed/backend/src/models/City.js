import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    country: String,
    region: String,
    costIndex: Number,
    popularity: Number,
    description: String,
    image: String,
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model('City', citySchema);
