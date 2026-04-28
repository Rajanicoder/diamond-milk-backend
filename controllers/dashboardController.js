const Delivery = require('../models/Delivery')
const Salesman = require('../models/Salesman')
const sendResponse = require('../utils/responseHandler')

const getStartOfDay = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const getEndOfDay = (date) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

const getDashboardSummary = async (req, res, next) => {
  try {
    const now = new Date()
    const startOfToday = getStartOfDay(now)
    const endOfToday = getEndOfDay(now)

    const todayDeliveries = await Delivery.find({
      deliveryDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    })

    const allDeliveries = await Delivery.find()
    const activeSalesmen = await Salesman.countDocuments({ isActive: true })

    const todayDeliveryLitres = todayDeliveries.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    )

    const todayRevenue = todayDeliveries.reduce(
      (sum, item) => sum + Number(item.totalAmount || 0),
      0
    )

    const pendingAmount = allDeliveries.reduce((sum, item) => {
      const total = Number(item.totalAmount || 0)
      const received = Number(item.paymentReceived || 0)
      return sum + Math.max(total - received, 0)
    }, 0)

    return sendResponse(res, 200, true, 'Dashboard summary fetched successfully', {
      todayDeliveryLitres,
      todayRevenue,
      pendingAmount,
      activeSalesmen,
    })
  } catch (error) {
    next(error)
  }
}

const getDashboardChart = async (req, res, next) => {
  try {
    const today = new Date()
    const startDate = new Date()
    startDate.setDate(today.getDate() - 6)
    startDate.setHours(0, 0, 0, 0)

    const deliveries = await Delivery.find({
      deliveryDate: {
        $gte: startDate,
        $lte: today,
      },
    }).sort({ deliveryDate: 1 })

    const chartMap = {}

    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(today.getDate() - i)
      const key = date.toISOString().split('T')[0]
      chartMap[key] = {
        date: key,
        litres: 0,
        revenue: 0,
      }
    }

    deliveries.forEach((item) => {
      const key = new Date(item.deliveryDate).toISOString().split('T')[0]

      if (chartMap[key]) {
        chartMap[key].litres += Number(item.quantity || 0)
        chartMap[key].revenue += Number(item.totalAmount || 0)
      }
    })

    const chartData = Object.values(chartMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    )

    return sendResponse(res, 200, true, 'Dashboard chart fetched successfully', chartData)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDashboardSummary,
  getDashboardChart,
}