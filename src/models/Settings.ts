import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISignatureDish {
  name: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  badge: string;
}

export interface ISettings extends Document {
  restaurantName: string;
  address: string;
  mobileNumber: string;
  whatsappNumber: string;
  restaurantEmail: string;
  adminEmail: string;
  deliveryFee: number;
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  currency: string;
  reservationSettings: {
    reservationDurationMinutes: number;
    minNoticeHours: number;
    maxAdvanceDays: number;
  };
  heroImages?: string[];
  signatureDishes?: ISignatureDish[];
  storyMainImage?: string;
  storySecondaryImage?: string;
  galleryImages?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    restaurantName: { type: String, required: true, default: "Ceylon Curry" },
    address: { type: String, required: true, default: "44 Mayflower St, Plymouth PL1 1QX" },
    mobileNumber: { type: String, required: true, default: "01752 941504" },
    whatsappNumber: { type: String, required: true, default: "+447824110369" },
    restaurantEmail: { type: String, required: true, default: "info@ceyloncurry.co.uk" },
    adminEmail: { type: String, required: true, default: "apptronorders@gmail.com" },
    deliveryFee: { type: Number, default: 2.99 },
    openingHours: {
      monday: { type: String, default: "10:00 AM - 10:00 PM" },
      tuesday: { type: String, default: "10:00 AM - 10:00 PM" },
      wednesday: { type: String, default: "10:00 AM - 10:00 PM" },
      thursday: { type: String, default: "10:00 AM - 10:00 PM" },
      friday: { type: String, default: "10:00 AM - 10:00 PM" },
      saturday: { type: String, default: "10:00 AM - 10:00 PM" },
      sunday: { type: String, default: "10:00 AM - 10:00 PM" },
    },
    socialLinks: {
      facebook: { type: String, default: "https://www.facebook.com/ceyloncurrysl/" },
      instagram: { type: String, default: "https://www.instagram.com/ceyloncurrys/" },
      tiktok: { type: String, default: "https://www.tiktok.com/@ceylon.curry.plym" },
    },
    currency: { type: String, default: "£" },
    reservationSettings: {
      reservationDurationMinutes: { type: Number, default: 60 },
      minNoticeHours: { type: Number, default: 1 },
      maxAdvanceDays: { type: Number, default: 30 },
    },
    heroImages: { type: [String], default: [] },
    signatureDishes: {
      type: [
        {
          name: { type: String },
          subtitle: { type: String },
          description: { type: String },
          price: { type: String },
          image: { type: String },
          badge: { type: String },
        },
      ],
      default: [],
    },
    storyMainImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=80",
    },
    storySecondaryImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
    },
    galleryImages: {
      type: [String],
      default: [
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80",
        "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
      ],
    },
  },
  { timestamps: true }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
