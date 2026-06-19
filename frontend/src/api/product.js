const API_BASE = '/api'

export const getProductStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/products/stats`)
    if (!response.ok) {
      throw new Error('获取统计数据失败')
    }
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getProducts = async (status = 'all') => {
  try {
    const response = await fetch(`${API_BASE}/products?status=${status}`)
    if (!response.ok) {
      throw new Error('获取商品列表失败')
    }
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`)
    if (!response.ok) {
      throw new Error('获取商品详情失败')
    }
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })

    if (!response.ok) {
      throw new Error('创建商品失败')
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    })

    if (!response.ok) {
      throw new Error('更新商品失败')
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('删除商品失败')
    }

    return true
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
