const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema(
  {
    agencyName: {
      type: String,
      default: 'Diamond Milk Agency',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    gstNumber: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },

    fullCreamRate: {
      type: Number,
      default: 0,
    },
    tonedMilkRate: {
      type: Number,
      default: 0,
    },
    cowMilkRate: {
      type: Number,
      default: 0,
    },
    buffaloMilkRate: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    language: {
      type: String,
      default: 'English',
      trim: true,
    },

    primaryColor: {
      type: String,
      default: '#06b6d4',
      trim: true,
    },
    backgroundColor: {
      type: String,
      default: '#020617',
      trim: true,
    },
    textColor: {
      type: String,
      default: '#ffffff',
      trim: true,
    },
    cardColor: {
      type: String,
      default: '#0f172a',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Setting', settingSchema)