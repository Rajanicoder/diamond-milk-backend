const mongoose = require('mongoose')

const salesmanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Salesman name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    routeName: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle number is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Salesman', salesmanSchema)