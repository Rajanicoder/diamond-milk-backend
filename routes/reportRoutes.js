const express = require('express')
const router = express.Router()

const {
  getReportsSummary,
  getShopWiseReport,
} = require('../controllers/reportController')

router.get('/summary', getReportsSummary)
router.get('/shop-wise', getShopWiseReport)

module.exports = router