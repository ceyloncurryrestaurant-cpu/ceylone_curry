import mongoose, { Schema, Document } from "mongoose";

export interface ITableImage {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface ITable extends Document {
  tableNumber: number;
  capacity: number;
  type: "Couple" | "Family";
  status: "Available" | "Reserved" | "Occupied" | "Maintenance";
  image?: ITableImage;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema: Schema = new Schema(
  {
    tableNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    type: {
      type: String,
      enum: ["Couple", "Family"],
      default: "Couple",
    },
    status: {
      type: String,
      enum: ["Available", "Reserved", "Occupied", "Maintenance"],
      default: "Available",
    },
    image: {
      url: { type: String },
      publicId: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Table || mongoose.model<ITable>("Table", TableSchema);
