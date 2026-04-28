const mongoose = require('mongoose')
const Salesman = require('../models/Salesman')
const sendResponse = require('../utils/responseHandler')

const getAllSalesmen = async (req, res, next) => {
  try {
    const salesmen = await Salesman.find().sort({ createdAt: -1 })
    return sendResponse(res, 200, true, 'Salesmen fetched successfully', salesmen)
  } catch (error) {
    next(error)
  }
}

const getSingleSalesman = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid salesman id')
    }

    const salesman = await Salesman.findById(id)

    if (!salesman) {
      return sendResponse(res, 404, false, 'Salesman not found')
    }

    return sendResponse(res, 200, true, 'Salesman fetched successfully', salesman)
  } catch (error) {
    next(error)
  }
}

const createSalesman = async (req, res, next) => {
  try {
    const { name, phone, routeName, vehicleNumber, isActive } = req.body

    if (!name || !phone || !routeName || !vehicleNumber) {
      return sendResponse(res, 400, false, 'Please fill all required fields')
    }

    const existingSalesman = await Salesman.findOne({ phone })

    if (existingSalesman) {
      return sendResponse(res, 400, false, 'Salesman with this phone already exists')
    }

    const newSalesman = await Salesman.create({
      name,
      phone,
      routeName,
      vehicleNumber,
      isActive,
    })

    return sendResponse(res, 201, true, 'Salesman created successfully', newSalesman)
  } catch (error) {
    next(error)
  }
}

const updateSalesman = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, phone, routeName, vehicleNumber, isActive } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid salesman id')
    }

    const salesman = await Salesman.findById(id)

    if (!salesman) {
      return sendResponse(res, 404, false, 'Salesman not found')
    }

    if (phone && phone !== salesman.phone) {
      const existingPhone = await Salesman.findOne({ phone })
      if (existingPhone) {
        return sendResponse(res, 400, false, 'Another salesman already uses this phone')
      }
    }

    salesman.name = name ?? salesman.name
    salesman.phone = phone ?? salesman.phone
    salesman.routeName = routeName ?? salesman.routeName
    salesman.vehicleNumber = vehicleNumber ?? salesman.vehicleNumber
    salesman.isActive = isActive ?? salesman.isActive

    const updatedSalesman = await salesman.save()

    return sendResponse(res, 200, true, 'Salesman updated successfully', updatedSalesman)
  } catch (error) {
    next(error)
  }
}

const deleteSalesman = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, 'Invalid salesman id')
    }

    const salesman = await Salesman.findById(id)

    if (!salesman) {
      return sendResponse(res, 404, false, 'Salesman not found')
    }

    await Salesman.findByIdAndDelete(id)

    return sendResponse(res, 200, true, 'Salesman deleted successfully')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllSalesmen,
  getSingleSalesman,
  createSalesman,
  updateSalesman,
  deleteSalesman,
}