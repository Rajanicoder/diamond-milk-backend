// const express = require('express')
// const cors = require('cors')
// const morgan = require('morgan')
// const cookieParser = require('cookie-parser')
// const errorHandler = require('./middlewares/errorMiddleware')

// const shopRoutes = require('./routes/shopRoutes')
// const salesmanRoutes = require('./routes/salesmanRoutes')
// const deliveryRoutes = require('./routes/deliveryRoutes')
// const reportRoutes = require('./routes/reportRoutes')
// const ledgerRoutes = require('./routes/ledgerRoutes')
// const invoiceRoutes = require('./routes/invoiceRoutes')
// const settingRoutes = require('./routes/settingRoutes')
// const dashboardRoutes = require('./routes/dashboardRoutes')
// const authRoutes = require('./routes/authRoutes')

// const app = express()

// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   })
// )

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(cookieParser())
// app.use(morgan('dev'))

// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Diamond Milk Agency Backend Running',
//   })
// })

// app.use('/api/auth', authRoutes)
// app.use('/api/shops', shopRoutes)
// app.use('/api/salesmen', salesmanRoutes)
// app.use('/api/deliveries', deliveryRoutes)
// app.use('/api/reports', reportRoutes)
// app.use('/api/ledger', ledgerRoutes)
// app.use('/api/invoices', invoiceRoutes)
// app.use('/api/settings', settingRoutes)
// app.use('/api/dashboard', dashboardRoutes)

// app.use(errorHandler)

// module.exports = app


const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middlewares/errorMiddleware')

const shopRoutes = require('./routes/shopRoutes')
const salesmanRoutes = require('./routes/salesmanRoutes')
const deliveryRoutes = require('./routes/deliveryRoutes')
const reportRoutes = require('./routes/reportRoutes')
const ledgerRoutes = require('./routes/ledgerRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const settingRoutes = require('./routes/settingRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'https://diamond-milk-frontend.vercel.app',
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Diamond Milk Agency Backend Running',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/shops', shopRoutes)
app.use('/api/salesmen', salesmanRoutes)
app.use('/api/deliveries', deliveryRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/ledger', ledgerRoutes)
app.use('/api/invoices', invoiceRoutes)
app.use('/api/settings', settingRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use(errorHandler)

module.exports = app