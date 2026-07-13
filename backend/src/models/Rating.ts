import mongoose, { Document, Schema } from 'mongoose';
import Book from './Book';

export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

ratingSchema.index({ userId: 1, bookId: 1 }, { unique: true });

ratingSchema.statics.getAverageRating = async function (bookId: mongoose.Types.ObjectId) {
  const obj = await this.aggregate([
    {
      $match: { bookId },
    },
    {
      $group: {
        _id: '$bookId',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj[0]) {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10,
        totalRatings: obj[0].totalRatings,
      });
    } else {
      await Book.findByIdAndUpdate(bookId, {
        averageRating: 0,
        totalRatings: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

ratingSchema.post('save', function () {
  (this.constructor as any).getAverageRating(this.bookId);
});

ratingSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await (doc.constructor as any).getAverageRating(doc.bookId);
  }
});

ratingSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await (doc.constructor as any).getAverageRating(doc.bookId);
  }
});

const Rating = mongoose.model<IRating>('Rating', ratingSchema);

export default Rating;
