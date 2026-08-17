import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  name: string;
  rating: number;
  comment: string;
  favoriteDish?: string;
  isApproved: boolean;
  createdAt: Date;
}

const ReviewSchema: Schema<IReview> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    favoriteDish: { type: String, default: "" },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
