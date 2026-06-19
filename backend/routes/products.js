import express from 'express'
import cors from 'cors'
import products from '../data/products.js'

const router = express.Router()

router.get('/stats', (req, res) => {
  const stats = {
    all: products.length,
    online: 0,
    pending: 0,
    rejected: 0,
    offline: 0
  }

  products.forEach(product => {
    if (stats.hasOwnProperty(product.status)) {
      stats[product.status]++
    }
  })

  res.json(stats)
})

router.get('/', (req, res) => {
  const { status } = req.query

  if (!status || status === 'all') {
    return res.json(products)
  }

  const filteredProducts = products.filter(product => product.status === status)
  res.json(filteredProducts)
})

export default router
