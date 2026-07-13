import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  recommendedBooks: mongoose.Types.ObjectId[];
  generatedAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    recommendedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const Recommendation = mongoose.model<IRecommendation>('Recommendation', recommendationSchema);

export default Recommendation;
