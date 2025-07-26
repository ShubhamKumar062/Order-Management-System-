const mongoose = require('mongoose');
const orderItemSchema = require('./orderItem');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: {
    type: [orderItemSchema],
    required: true
  },
  totalAmount: { type: Number, required: true },
  paymentReceived: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['Placed', 'Picked', 'Shipped', 'Delivered'],
    default: 'Placed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
