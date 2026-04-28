const express = require('express')
const router = express.Router()

const {
  getDashboardSummary,
  getDashboardChart,
} = require('../controllers/dashboardController')

router.get('/summary', getDashboardSummary)
router.get('/chart', getDashboardChart)

module.exports = router