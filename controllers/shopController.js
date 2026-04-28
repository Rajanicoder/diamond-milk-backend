const mongoose = require('mongoose')
const Shop = require('../models/Shop')
const sendResponse = require('../utils/responseHandler')

const getAllShops = async (req, res, next) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 })
    return sendResponse(res, 200, true, 'Shops fetched successfully', shops)
  } catch (error) {
    next(error)
  }
}

const getSingleShop = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid shop id')
    }

    const shop = await Shop.findById(id)

    if (!shop) {
      return sendResponse(res, 404, false, 'Shop not found')
    }

    return sendResponse(res, 200, true, 'Shop fetched successfully', shop)
  } catch (error) {
    next(error)
  }
}

const createShop = async (req, res, next) => {
  try {
    const { shopName, ownerName, phone, ratePerLitre, address } = req.body

    if (!shopName || !ownerName || !phone || !ratePerLitre) {
      return sendResponse(res, 400, false, 'Please fill all required fields')
    }

    const newShop = await Shop.create({
      shopName,
      ownerName,
      phone,
      ratePerLitre,
      address,
    })

    return sendResponse(res, 201, true, 'Shop created successfully', newShop)
  } catch (error) {
    next(error)
  }
}

const updateShop = async (req, res, next) => {
  try {
    const { id } = req.params
    const { shopName, ownerName, phone, ratePerLitre, address, isActive } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid shop id')
    }

    const existingShop = await Shop.findById(id)

    if (!existingShop) {
      return sendResponse(res, 404, false, 'Shop not found')
    }

    existingShop.shopName = shopName ?? existingShop.shopName
    existingShop.ownerName = ownerName ?? existingShop.ownerName
    existingShop.phone = phone ?? existingShop.phone
    existingShop.ratePerLitre = ratePerLitre ?? existingShop.ratePerLitre
    existingShop.address = address ?? existingShop.address
    existingShop.isActive = isActive ?? existingShop.isActive

    const updatedShop = await existingShop.save()

    return sendResponse(res, 200, true, 'Shop updated successfully', updatedShop)
  } catch (error) {
    next(error)
  }
}

const deleteShop = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid shop id')
    }

    const shop = await Shop.findById(id)

    if (!shop) {
      return sendResponse(res, 404, false, 'Shop not found')
    }

    await Shop.findByIdAndDelete(id)

    return sendResponse(res, 200, true, 'Shop deleted successfully')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllShops,
  getSingleShop,
  createShop,
  updateShop,
  deleteShop,
}