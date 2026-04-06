const mongoose = require('mongoose');

const CATEGORIES = ['Packaging', 'Bottles', 'Apparel', 'Beverage', 'Electronics', 'Other'];

const mockupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mockup name is required'],
      trim: true,
      maxlength: [150, 'Name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    designerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      enum: ['PREMIUM', 'UPDATED', 'NEW', null],
      default: null,
    },
  },
  { timestamps: true }
);

mockupSchema.index({ category: 1, createdAt: -1 });
mockupSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Mockup', mockupSchema);
