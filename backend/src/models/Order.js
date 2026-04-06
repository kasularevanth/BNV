const mongoose = require('mongoose');

const ORDER_STATUSES = ['pending', 'active', 'completed', 'cancelled'];

const orderSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mockupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mockup',
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

orderSchema.index({ clientId: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
