import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  isbn: string;
  title: string;
  author: string;
  publicationYear: string;
  publisher: string;
  imageUrl: string;
  averageRating: number;
  totalRatings: number;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publicationYear: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    genre: {
      type: String,
      default: 'General Fiction',
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ totalRatings: -1 });
bookSchema.index({ publisher: 1 });
bookSchema.index({ genre: 1 });

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;
