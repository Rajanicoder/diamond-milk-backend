const Delivery = require('../models/Delivery')
const Shop = require('../models/Shop')
const sendResponse = require('../utils/responseHandler')

const getDateRange = (month, year) => {
  const selectedMonth = Number(month)
  const selectedYear = Number(year)

  const startDate = new Date(selectedYear, selectedMonth - 1, 1)
  const endDate = new Date(selectedYear, selectedMonth, 1)

  return { startDate, endDate }
}

const getReportsSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query

    if (!month || !year) {
      return sendResponse(res, 400, false, 'Month and year are required')
    }

    const { startDate, endDate } = getDateRange(month, year)

    const deliveries = await Delivery.find({
      deliveryDate: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate('shop', 'shopName isActive')

    const totalRevenue = deliveries.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0
    )

    const totalMilkDelivered = deliveries.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    )

    const totalReceived = deliveries.reduce(
      (sum, item) => sum + Number(item.paymentReceived || 0),
      0
    )

    const pendingPayments = totalRevenue - totalReceived

    const uniqueShops = new Set(
      deliveries
        .filter((item) => item.shop?._id)
        .map((item) => item.shop._id.toString())
    )

    return sendResponse(res, 200, true, 'Reports summary fetched successfully', {
      totalRevenue,
      totalMilkDelivered,
      pendingPayments,
      activeShops: uniqueShops.size,
    })
  } catch (error) {
    next(error)
  }
}

const getShopWiseReport = async (req, res, next) => {
  try {
    const { month, year } = req.query

    if (!month || !year) {
      return sendResponse(res, 400, false, 'Month and year are required')
    }

    const { startDate, endDate } = getDateRange(month, year)

    const [shops, deliveries] = await Promise.all([
      Shop.find({ isActive: true }).sort({ createdAt: -1 }),
      Delivery.find({
        deliveryDate: {
          $gte: startDate,
          $lt: endDate,
        },
      }).populate('shop', 'shopName'),
    ])

    const shopMap = {}

    shops.forEach((shop) => {
      shopMap[shop._id.toString()] = {
        shopId: shop._id.toString(),
        shop: shop.shopName,
        supplied: 0,
        amount: 0,
        paid: 0,
        pending: 0,
      }
    })

    deliveries.forEach((item) => {
      const shopId = item.shop?._id?.toString()
      if (!shopId || !shopMap[shopId]) return

      shopMap[shopId].supplied += Number(item.quantity || 0)
      shopMap[shopId].amount += Number(item.totalAmount || 0)
      shopMap[shopId].paid += Number(item.paymentReceived || 0)
      shopMap[shopId].pending =
        shopMap[shopId].amount - shopMap[shopId].paid
    })

    const reportRows = Object.values(shopMap).sort((a, b) => b.amount - a.amount)

    return sendResponse(
      res,
      200,
      true,
      'Shop-wise report fetched successfully',
      reportRows
    )
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getReportsSummary,
  getShopWiseReport,
}