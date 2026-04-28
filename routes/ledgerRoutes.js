const express = require('express')
const router = express.Router()

const {
  getLedgerSummary,
  getLedgerTable,
} = require('../controllers/ledgerController')

router.get('/summary', getLedgerSummary)
router.get('/table', getLedgerTable)

module.exports = router