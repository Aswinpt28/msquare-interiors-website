import mongoose, { Schema } from 'mongoose';

const MediaSchema = new Schema({
  publicId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['photo','video','furniture'], required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  category: { type: String, default: '' },
  price: { type: Number, default: null },
  format: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const FurnitureSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Other furniture' },
  price: { type: Number, default: null },
  imageUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const EnquirySchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  projectType: { type: String, default: 'Other' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['New','Contacted','In Progress','Completed'], default: 'New' },
}, { timestamps: true });

const SettingsSchema = new Schema({
  key: { type: String, unique: true, default: 'website' },
  companyName: { type: String, default: 'M Square Interiors' },
  email: { type: String, default: 'hello@msquareinteriors.com' },
  phone: { type: String, default: '' },
  address: { type: String, default: ' #203, V V Centre, Palarivattom, Cochin - 682025' },
  instagram: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  homepageIntro: { type: String, default: '' },
}, { timestamps: true });

export const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);
export const Furniture = mongoose.models.Furniture || mongoose.model('Furniture', FurnitureSchema);
export const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
export const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SettingsSchema);
