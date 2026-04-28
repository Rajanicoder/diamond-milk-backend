const express = require('express')
const router = express.Router()

const {
  getAllDeliveries,
  getSingleDelivery,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} = require('../controllers/deliveryController')

router.get('/', getAllDeliveries)
router.get('/:id', getSingleDelivery)
router.post('/', createDelivery)
router.put('/:id', updateDelivery)
router.delete('/:id', deleteDelivery)

module.exports = router