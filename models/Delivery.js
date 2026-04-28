const mongoose = require('mongoose')

const deliverySchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'Shop is required'],
    },
    salesman: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salesman',
      required: [true, 'Salesman is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    ratePerLitre: {
      type: Number,
      required: [true, 'Rate per litre is required'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending',
    },
    paymentReceived: {
      type: Number,
      default: 0,
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Delivery', deliverySchema)