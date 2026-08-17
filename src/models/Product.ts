import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductImage {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId | string;
  shortDescription?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  ingredients: string[];
  allergens: string[];
  images: IProductImage[];
  isAvailable: boolean;
  isFeatured: boolean;
  isOffer: boolean;
  offerPrice?: number;
  discountPercentage?: number;
  offerStartDate?: Date;
  offerEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    shortDescription: { type: String },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    images: {
      type: [ProductImageSchema],
      validate: [
        (val: IProductImage[]) => val.length <= 4,
        "Product images cannot exceed 4 images",
      ],
      default: [],
    },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false },
    offerPrice: { type: Number, min: 0 },
    discountPercentage: { type: Number, min: 0, max: 100 },
    offerStartDate: { type: Date },
    offerEndDate: { type: Date },
  },
  { timestamps: true }
);

// MongoDB Indexes for fast catalog search & filter performance
ProductSchema.index({ categoryId: 1, isAvailable: 1 });
ProductSchema.index({ isOffer: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ name: "text", description: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
