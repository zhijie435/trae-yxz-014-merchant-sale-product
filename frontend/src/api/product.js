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
