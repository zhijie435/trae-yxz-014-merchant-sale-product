import request from 'supertest'
import express from 'express'
import cors from 'cors'
import productRoutes from '../routes/products.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/products', productRoutes)

describe('销售商品管理 API', () => {
  let createdProductId

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        name: '测试商品',
        brand: '测试品牌',
        price: 999,
        stock: 50,
        minOrderQty: 1,
        status: 'pending'
      })
    createdProductId = response.body.id
  })

  describe('销售商品编辑', () => {
    test('应该能够编辑商品基本信息', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          name: '更新后的测试商品',
          price: 1299,
          brand: '更新后的品牌'
        })

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('更新后的测试商品')
      expect(response.body.price).toBe(1299)
      expect(response.body.brand).toBe('更新后的品牌')
    })

    test('应该能够编辑商品价格', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          price: 1599
        })

      expect(response.status).toBe(200)
      expect(response.body.price).toBe(1599)
    })

    test('应该能够编辑商品库存', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          stock: 100
        })

      expect(response.status).toBe(200)
      expect(response.body.stock).toBe(100)
    })

    test('编辑不存在的商品应返回404', async () => {
      const response = await request(app)
        .put('/api/products/99999')
        .send({
          name: '不存在的商品'
        })

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('商品不存在')
    })
  })

  describe('库存扣减', () => {
    let testProductId

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: '库存测试商品',
          price: 299,
          stock: 10,
          soldQty: 0,
          status: 'online'
        })
      testProductId = response.body.id
    })

    test('付款成功后应扣减库存并增加已售数量', async () => {
      const response = await request(app)
        .post(`/api/products/${testProductId}/payment-success`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.product.stock).toBe(9)
      expect(response.body.product.soldQty).toBe(1)
    })

    test('多次购买应正确累计库存扣减', async () => {
      const initialResponse = await request(app)
        .post('/api/products')
        .send({
          name: '累计测试商品',
          price: 299,
          stock: 15,
          soldQty: 5,
          status: 'online'
        })

      const productId = initialResponse.body.id

      const response1 = await request(app)
        .post(`/api/products/${productId}/payment-success`)

      expect(response1.status).toBe(200)
      expect(response1.body.product.stock).toBe(14)
      expect(response1.body.product.soldQty).toBe(6)

      const response2 = await request(app)
        .post(`/api/products/${productId}/payment-success`)

      expect(response2.status).toBe(200)
      expect(response2.body.product.stock).toBe(13)
      expect(response2.body.product.soldQty).toBe(7)
    })

    test('库存不足时应返回失败', async () => {
      await request(app)
        .post('/api/products')
        .send({
          name: '零库存商品',
          price: 99,
          stock: 1,
          soldQty: 0,
          status: 'online'
        })
        .then(async (res) => {
          const zeroStockProductId = res.body.id

          await request(app)
            .post(`/api/products/${zeroStockProductId}/payment-success`)

          const response = await request(app)
            .post(`/api/products/${zeroStockProductId}/payment-success`)

          expect(response.status).toBe(200)
          expect(response.body.success).toBe(false)
          expect(response.body.message).toBe('库存不足，无法完成购买')
        })
    })

    test('库存扣减不存在的商品应返回404', async () => {
      const response = await request(app)
        .post('/api/products/99999/payment-success')

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('商品不存在')
    })
  })

  describe('起售台数 (minOrderQty)', () => {
    test('应该能够设置最小订购数量', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          minOrderQty: 5
        })

      expect(response.status).toBe(200)
      expect(response.body.minOrderQty).toBe(5)
    })

    test('应该能够设置起售台数为多台', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          minOrderQty: 10
        })

      expect(response.status).toBe(200)
      expect(response.body.minOrderQty).toBe(10)
    })

    test('默认起售台数应为1', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: '默认起售测试',
          price: 199
        })

      expect(response.status).toBe(201)
      expect(response.body.minOrderQty).toBe(1)
    })
  })

  describe('标签管理', () => {
    test('应该能够添加商品规格标签', async () => {
      const specs = [
        { label: '颜色', value: '红色/蓝色/绿色' },
        { label: '尺寸', value: 'S/M/L/XL' }
      ]

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          specs: specs
        })

      expect(response.status).toBe(200)
      expect(response.body.specs).toEqual(specs)
    })

    test('应该能够更新商品规格标签', async () => {
      const newSpecs = [
        { label: '颜色', value: '黑色/白色' },
        { label: '容量', value: '128GB/256GB' }
      ]

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          specs: newSpecs
        })

      expect(response.status).toBe(200)
      expect(response.body.specs).toHaveLength(2)
      expect(response.body.specs[0].label).toBe('颜色')
      expect(response.body.specs[0].value).toBe('黑色/白色')
    })

    test('应该能够编辑标签配置', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          specConfig: '颜色,尺寸,容量'
        })

      expect(response.status).toBe(200)
      expect(response.body.specConfig).toBe('颜色,尺寸,容量')
    })

    test('应该能够清空商品规格标签', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          specs: []
        })

      expect(response.status).toBe(200)
      expect(response.body.specs).toEqual([])
    })
  })

  describe('审核通过', () => {
    test('应该能够将商品状态改为online', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          status: 'online'
        })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('online')
    })

    test('应该能够将商品状态改为pending', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          status: 'pending'
        })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('pending')
    })

    test('应该能够将商品状态改为rejected', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          status: 'rejected'
        })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('rejected')
    })

    test('应该能够将商品状态改为offline', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          status: 'offline'
        })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('offline')
    })

    test('审核通过后商品应该能够上架销售', async () => {
      await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          status: 'pending'
        })

      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          status: 'online'
        })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('online')
    })

    test('审核拒绝后商品不应该上架', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          status: 'rejected'
        })

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('rejected')
    })
  })

  describe('综合功能测试', () => {
    test('编辑商品时应保留原有字段', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          name: '综合测试商品',
          status: 'online'
        })

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(createdProductId)
      expect(response.body.name).toBe('综合测试商品')
      expect(response.body.status).toBe('online')
      expect(response.body.price).toBeDefined()
      expect(response.body.brand).toBeDefined()
    })

    test('批量编辑多个字段', async () => {
      const response = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send({
          name: '批量编辑商品',
          price: 1999,
          stock: 200,
          minOrderQty: 5,
          status: 'online',
          specs: [
            { label: '颜色', value: '黑/白/金' }
          ]
        })

      expect(response.status).toBe(200)
      expect(response.body.name).toBe('批量编辑商品')
      expect(response.body.price).toBe(1999)
      expect(response.body.stock).toBe(200)
      expect(response.body.minOrderQty).toBe(5)
      expect(response.body.status).toBe('online')
      expect(response.body.specs).toHaveLength(1)
    })
  })

  describe('商品状态统计', () => {
    test('应该能够获取商品统计信息', async () => {
      const response = await request(app)
        .get('/api/products/stats')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('all')
      expect(response.body).toHaveProperty('online')
      expect(response.body).toHaveProperty('pending')
      expect(response.body).toHaveProperty('rejected')
      expect(response.body).toHaveProperty('offline')
      expect(typeof response.body.all).toBe('number')
      expect(typeof response.body.online).toBe('number')
    })
  })
})
