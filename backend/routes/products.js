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

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id))

  if (!product) {
    return res.status(404).json({ error: '商品不存在' })
  }

  res.json(product)
})

router.post('/', (req, res) => {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: req.body.name || '',
    brand: req.body.brand || '',
    model: req.body.model || '',
    category: req.body.category || '',
    price: req.body.price || 0,
    status: req.body.status || 'pending',
    images: req.body.images || [],
    video: req.body.video || '',
    freeShipping: req.body.freeShipping || false,
    stock: req.body.stock || 0
  }

  products.push(newProduct)
  res.status(201).json(newProduct)
})

router.put('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id))

  if (index === -1) {
    return res.status(404).json({ error: '商品不存在' })
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id
  }

  res.json(products[index])
})

router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id))

  if (index === -1) {
    return res.status(404).json({ error: '商品不存在' })
  }

  products.splice(index, 1)
  res.status(204).send()
})

export default router
