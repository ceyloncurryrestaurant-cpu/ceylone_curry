import mongoose, { Schema, Document, Model } from "mongoose";

export type ReservationStatus = "Pending" | "Accepted" | "Cancelled" | "Completed" | "No Show";

export interface IReservation extends Document {
  reservationNumber: string;
  customerName: string;
  email: string;
  mobile: string;
  tableId: mongoose.Types.ObjectId | string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  guestCount: number;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    reservationNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    tableId: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    startTime: { type: String, required: true }, // Format: HH:mm (24-hour)
    endTime: { type: String, required: true }, // Format: HH:mm (24-hour)
    guestCount: { type: Number, required: true, min: 1 },
    specialRequest: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Cancelled", "Completed", "No Show"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// MongoDB Indexes for fast availability checking and reservation search
ReservationSchema.index({ reservationNumber: 1 });
ReservationSchema.index({ date: 1, tableId: 1 });
ReservationSchema.index({ status: 1 });
ReservationSchema.index({ email: 1 });

const Reservation: Model<IReservation> =
  mongoose.models.Reservation || mongoose.model<IReservation>("Reservation", ReservationSchema);

export default Reservation;
