import express from 'express'
import cors from 'cors'
import productRoutes from './routes/products.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服务器运行正常' })
})

app.listen(PORT, () => {
  console.log(`🚀 服务器已启动: http://localhost:${PORT}`)
  console.log(`📊 API 端点: http://localhost:${PORT}/api/products`)
})
