const express = require('express')
const router = express.Router()

const {
  getInvoiceSummary,
  getInvoiceTable,
} = require('../controllers/invoiceController')

router.get('/summary', getInvoiceSummary)
router.get('/table', getInvoiceTable)

module.exports = router