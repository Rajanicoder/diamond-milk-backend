const Delivery = require('../models/Delivery')
const Shop = require('../models/Shop')
const sendResponse = require('../utils/responseHandler')

const getMonthRange = (month, year) => {
  const currentDate = new Date()
  const selectedMonth = Number(month || currentDate.getMonth() + 1)
  const selectedYear = Number(year || currentDate.getFullYear())

  const startDate = new Date(selectedYear, selectedMonth - 1, 1)
  const endDate = new Date(selectedYear, selectedMonth, 1)

  return { startDate, endDate, selectedMonth, selectedYear }
}

const getInvoiceSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query
    const { startDate, endDate } = getMonthRange(month, year)

    const deliveries = await Delivery.find({
      deliveryDate: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate('shop', 'shopName')

    const shopMap = {}

    deliveries.forEach((item) => {
      const shopId = item.shop?._id?.toString()
      if (!shopId) return

      if (!shopMap[shopId]) {
        shopMap[shopId] = {
          totalAmount: 0,
          paidAmount: 0,
        }
      }

      shopMap[shopId].totalAmount += Number(item.totalAmount || 0)
      shopMap[shopId].paidAmount += Number(item.paymentReceived || 0)
    })

    const invoiceRows = Object.values(shopMap)

    const totalInvoices = invoiceRows.length
    const paidInvoices = invoiceRows.filter(
      (item) => item.totalAmount > 0 && item.totalAmount - item.paidAmount <= 0
    ).length
    const pendingInvoices = invoiceRows.filter(
      (item) => item.totalAmount - item.paidAmount > 0
    ).length
    const invoiceAmount = invoiceRows.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0
    )

    return sendResponse(res, 200, true, 'Invoice summary fetched successfully', {
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      invoiceAmount,
    })
  } catch (error) {
    next(error)
  }
}

const getInvoiceTable = async (req, res, next) => {
  try {
    const { month, year } = req.query
    const { startDate, endDate, selectedMonth, selectedYear } = getMonthRange(month, year)

    const [shops, deliveries] = await Promise.all([
      Shop.find({ isActive: true }).sort({ createdAt: -1 }),
      Delivery.find({
        deliveryDate: {
          $gte: startDate,
          $lt: endDate,
        },
      }).populate('shop', 'shopName'),
    ])

    const invoiceMap = {}

    shops.forEach((shop, index) => {
      const shopId = shop._id.toString()
      const paddedMonth = String(selectedMonth).padStart(2, '0')

      invoiceMap[shopId] = {
        invoiceId: shopId,
        invoiceNo: `INV-${selectedYear}${paddedMonth}-${String(index + 1).padStart(3, '0')}`,
        shop: shop.shopName,
        date: startDate,
        amount: 0,
        paidAmount: 0,
        dueAmount: 0,
        status: 'Pending',
      }
    })

    deliveries.forEach((item) => {
      const shopId = item.shop?._id?.toString()
      if (!shopId || !invoiceMap[shopId]) return

      invoiceMap[shopId].amount += Number(item.totalAmount || 0)
      invoiceMap[shopId].paidAmount += Number(item.paymentReceived || 0)
      invoiceMap[shopId].dueAmount =
        invoiceMap[shopId].amount - invoiceMap[shopId].paidAmount
      invoiceMap[shopId].status =
        invoiceMap[shopId].amount > 0 && invoiceMap[shopId].dueAmount <= 0
          ? 'Paid'
          : 'Pending'
    })

    const invoiceRows = Object.values(invoiceMap)
      .filter((item) => item.amount > 0)
      .sort((a, b) => b.amount - a.amount)

    return sendResponse(res, 200, true, 'Invoice table fetched successfully', invoiceRows)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getInvoiceSummary,
  getInvoiceTable,
}