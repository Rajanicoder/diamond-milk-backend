const mongoose = require('mongoose')
const Delivery = require('../models/Delivery')
const Shop = require('../models/Shop')
const Salesman = require('../models/Salesman')
const sendResponse = require('../utils/responseHandler')

const getAllDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find()
      .populate('shop', 'shopName ownerName phone ratePerLitre')
      .populate('salesman', 'name phone routeName vehicleNumber')
      .sort({ createdAt: -1 })

    return sendResponse(res, 200, true, 'Deliveries fetched successfully', deliveries)
  } catch (error) {
    next(error)
  }
}

const getSingleDelivery = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid delivery id')
    }

    const delivery = await Delivery.findById(id)
      .populate('shop', 'shopName ownerName phone ratePerLitre')
      .populate('salesman', 'name phone routeName vehicleNumber')

    if (!delivery) {
      return sendResponse(res, 404, false, 'Delivery not found')
    }

    return sendResponse(res, 200, true, 'Delivery fetched successfully', delivery)
  } catch (error) {
    next(error)
  }
}

const createDelivery = async (req, res, next) => {
  try {
    const {
      shop,
      salesman,
      quantity,
      ratePerLitre,
      paymentReceived,
      deliveryDate,
    } = req.body

    if (!shop || !salesman || !quantity || !ratePerLitre || !deliveryDate) {
      return sendResponse(res, 400, false, 'Please fill all required fields')
    }

    if (!mongoose.Types.ObjectId.isValid(shop)) {
      return sendResponse(res, 400, false, 'Invalid shop id')
    }

    if (!mongoose.Types.ObjectId.isValid(salesman)) {
      return sendResponse(res, 400, false, 'Invalid salesman id')
    }

    const existingShop = await Shop.findById(shop)
    if (!existingShop) {
      return sendResponse(res, 404, false, 'Shop not found')
    }

    const existingSalesman = await Salesman.findById(salesman)
    if (!existingSalesman) {
      return sendResponse(res, 404, false, 'Salesman not found')
    }

    const parsedQuantity = Number(quantity)
    const parsedRatePerLitre = Number(ratePerLitre)
    const parsedPaymentReceived = Number(paymentReceived || 0)

    const totalAmount = parsedQuantity * parsedRatePerLitre
    const paymentStatus = parsedPaymentReceived >= totalAmount ? 'Paid' : 'Pending'

    const newDelivery = await Delivery.create({
      shop,
      salesman,
      quantity: parsedQuantity,
      ratePerLitre: parsedRatePerLitre,
      totalAmount,
      paymentStatus,
      paymentReceived: parsedPaymentReceived,
      deliveryDate,
    })

    const populatedDelivery = await Delivery.findById(newDelivery._id)
      .populate('shop', 'shopName ownerName phone ratePerLitre')
      .populate('salesman', 'name phone routeName vehicleNumber')

    return sendResponse(res, 201, true, 'Delivery created successfully', populatedDelivery)
  } catch (error) {
    next(error)
  }
}

const updateDelivery = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      shop,
      salesman,
      quantity,
      ratePerLitre,
      paymentReceived,
      deliveryDate,
    } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid delivery id')
    }

    const delivery = await Delivery.findById(id)
    if (!delivery) {
      return sendResponse(res, 404, false, 'Delivery not found')
    }

    if (shop) {
      if (!mongoose.Types.ObjectId.isValid(shop)) {
        return sendResponse(res, 400, false, 'Invalid shop id')
      }

      const shopExists = await Shop.findById(shop)
      if (!shopExists) {
        return sendResponse(res, 404, false, 'Shop not found')
      }

      delivery.shop = shop
    }

    if (salesman) {
      if (!mongoose.Types.ObjectId.isValid(salesman)) {
        return sendResponse(res, 400, false, 'Invalid salesman id')
      }

      const salesmanExists = await Salesman.findById(salesman)
      if (!salesmanExists) {
        return sendResponse(res, 404, false, 'Salesman not found')
      }

      delivery.salesman = salesman
    }

    delivery.quantity = quantity ?? delivery.quantity
    delivery.ratePerLitre = ratePerLitre ?? delivery.ratePerLitre
    delivery.paymentReceived = paymentReceived ?? delivery.paymentReceived
    delivery.deliveryDate = deliveryDate ?? delivery.deliveryDate

    delivery.totalAmount =
      Number(delivery.quantity || 0) * Number(delivery.ratePerLitre || 0)

    delivery.paymentStatus =
      Number(delivery.paymentReceived || 0) >= Number(delivery.totalAmount || 0)
        ? 'Paid'
        : 'Pending'

    const updatedDelivery = await delivery.save()

    const populatedDelivery = await Delivery.findById(updatedDelivery._id)
      .populate('shop', 'shopName ownerName phone ratePerLitre')
      .populate('salesman', 'name phone routeName vehicleNumber')

    return sendResponse(res, 200, true, 'Delivery updated successfully', populatedDelivery)
  } catch (error) {
    next(error)
  }
}

const deleteDelivery = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid delivery id')
    }

    const delivery = await Delivery.findById(id)
    if (!delivery) {
      return sendResponse(res, 404, false, 'Delivery not found')
    }

    await Delivery.findByIdAndDelete(id)

    return sendResponse(res, 200, true, 'Delivery deleted successfully')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllDeliveries,
  getSingleDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
}