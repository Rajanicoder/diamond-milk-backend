const express = require('express')
const router = express.Router()

const {
  getAllSalesmen,
  getSingleSalesman,
  createSalesman,
  updateSalesman,
  deleteSalesman,
} = require('../controllers/salesmanController')

router.get('/', getAllSalesmen)
router.get('/:id', getSingleSalesman)
router.post('/', createSalesman)
router.put('/:id', updateSalesman)
router.delete('/:id', deleteSalesman)

module.exports = router