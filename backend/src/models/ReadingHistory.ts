import mongoose, { Document, Schema } from 'mongoose';

export interface IReadingHistory extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  viewedAt: Date;
}

const readingHistorySchema = new Schema<IReadingHistory>(
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
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

readingHistorySchema.index({ userId: 1, viewedAt: -1 });

const ReadingHistory = mongoose.model<IReadingHistory>('ReadingHistory', readingHistorySchema);

export default ReadingHistory;
