const Delivery = require('../models/Delivery')
const Shop = require('../models/Shop')
const sendResponse = require('../utils/responseHandler')

const getMonthRange = (month, year) => {
  const currentDate = new Date()
  const selectedMonth = Number(month || currentDate.getMonth() + 1)
  const selectedYear = Number(year || currentDate.getFullYear())

  const startDate = new Date(selectedYear, selectedMonth - 1, 1)
  const endDate = new Date(selectedYear, selectedMonth, 1)

  return { startDate, endDate }
}

const getLedgerSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query
    const { startDate, endDate } = getMonthRange(month, year)

    const [monthDeliveries, pendingShopsData] = await Promise.all([
      Delivery.find({
        deliveryDate: {
          $gte: startDate,
          $lt: endDate,
        },
      }),
      Delivery.aggregate([
        {
          $match: {
            deliveryDate: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: '$shop',
            totalAmount: { $sum: '$totalAmount' },
            totalPaid: { $sum: '$paymentReceived' },
          },
        },
        {
          $project: {
            due: { $subtract: ['$totalAmount', '$totalPaid'] },
          },
        },
        {
          $match: {
            due: { $gt: 0 },
          },
        },
        {
          $count: 'pendingShops',
        },
      ]),
    ])

    const totalOutstanding = monthDeliveries.reduce(
      (sum, item) => sum + (Number(item.totalAmount || 0) - Number(item.paymentReceived || 0)),
      0
    )

    const collectedThisMonth = monthDeliveries.reduce(
      (sum, item) => sum + Number(item.paymentReceived || 0),
      0
    )

    const totalLedgerEntries = monthDeliveries.length

    return sendResponse(res, 200, true, 'Ledger summary fetched successfully', {
      totalOutstanding,
      collectedThisMonth,
      pendingShops: pendingShopsData[0]?.pendingShops || 0,
      totalLedgerEntries,
    })
  } catch (error) {
    next(error)
  }
}

const getLedgerTable = async (req, res, next) => {
  try {
    const { month, year } = req.query
    const { startDate, endDate } = getMonthRange(month, year)

    const [shops, deliveries] = await Promise.all([
      Shop.find({ isActive: true }).sort({ createdAt: -1 }),
      Delivery.find({
        deliveryDate: {
          $gte: startDate,
          $lt: endDate,
        },
      }).populate('shop', 'shopName'),
    ])

    const ledgerMap = {}

    shops.forEach((shop) => {
      ledgerMap[shop._id.toString()] = {
        shopId: shop._id.toString(),
        shop: shop.shopName,
        total: 0,
        paid: 0,
        due: 0,
        status: 'Paid',
      }
    })

    deliveries.forEach((item) => {
      const shopId = item.shop?._id?.toString()
      if (!shopId || !ledgerMap[shopId]) return

      ledgerMap[shopId].total += Number(item.totalAmount || 0)
      ledgerMap[shopId].paid += Number(item.paymentReceived || 0)
      ledgerMap[shopId].due = ledgerMap[shopId].total - ledgerMap[shopId].paid
      ledgerMap[shopId].status = ledgerMap[shopId].due > 0 ? 'Pending' : 'Paid'
    })

    const ledgerRows = Object.values(ledgerMap).sort((a, b) => b.due - a.due)

    return sendResponse(res, 200, true, 'Ledger table fetched successfully', ledgerRows)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getLedgerSummary,
  getLedgerTable,
}