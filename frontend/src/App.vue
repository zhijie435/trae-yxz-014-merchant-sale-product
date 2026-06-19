<template>
  <div class="app">
    <div class="container">
      <div class="header">
        <h1 class="title">销售商品管理</h1>
        <p class="subtitle">管理您的商品上下架和审核状态</p>
      </div>

      <ProductFilterBar @filter-change="handleFilterChange" />

      <div class="product-list">
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="products.length === 0" class="empty-state">
          <p>暂无商品</p>
        </div>

        <div v-else class="products">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card"
          >
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-price">¥{{ product.price }}</p>
            </div>
            <span :class="['product-status', product.status]">
              {{ getStatusText(product.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductFilterBar from './components/ProductFilterBar.vue'
import { getProducts } from './api/product'

const products = ref([])
const loading = ref(false)
const currentFilter = ref('all')

const statusMap = {
  online: '上架中',
  pending: '待审核',
  rejected: '已驳回',
  offline: '已下架'
}

const getStatusText = (status) => {
  return statusMap[status] || status
}

const handleFilterChange = async (filter) => {
  currentFilter.value = filter
  await loadProducts(filter)
}

const loadProducts = async (filter) => {
  loading.value = true
  try {
    products.value = await getProducts(filter)
  } catch (error) {
    console.error('加载商品失败:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts('all')
})
</script>

<style scoped>
.app {
  width: 100%;
}

.product-list {
  min-height: 300px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #8c8c8c;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #8c8c8c;
  font-size: 16px;
}

.products {
  display: grid;
  gap: 16px;
}

.product-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  transition: all 0.3s;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.product-info h3 {
  font-size: 16px;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #ff4d4f;
}

.product-status {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.product-status.online {
  background: #e6f7ff;
  color: #1890ff;
}

.product-status.pending {
  background: #fff7e6;
  color: #faad14;
}

.product-status.rejected {
  background: #fff1f0;
  color: #ff4d4f;
}

.product-status.offline {
  background: #f5f5f5;
  color: #8c8c8c;
}
</style>
