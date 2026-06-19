<template>
  <div class="product-list-page">
    <div class="page-header">
      <div class="header-top">
        <div>
          <h1 class="page-title">销售商品管理</h1>
          <p class="page-subtitle">管理您的商品上下架和审核状态</p>
        </div>
        <button class="add-btn" @click="handleAddProduct">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          新增商品
        </button>
      </div>
    </div>

    <ProductFilterBar @filter-change="handleFilterChange" />

    <ProductList
      :products="products"
      :loading="loading"
      @edit="handleEditProduct"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductFilterBar from './ProductFilterBar.vue'
import ProductList from './ProductList.vue'
import { getProducts } from '../api/product'

const emit = defineEmits(['add-product', 'edit-product', 'refresh'])

const products = ref([])
const loading = ref(false)
const currentFilter = ref('all')

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

const handleAddProduct = () => {
  emit('add-product')
}

const handleEditProduct = (product) => {
  emit('edit-product', product)
}

onMounted(() => {
  loadProducts('all')
})

defineExpose({
  refresh: () => loadProducts(currentFilter.value)
})
</script>

<style scoped>
.product-list-page {
  width: 100%;
}

.page-header {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 24px;
  margin-bottom: 32px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 400;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.add-btn:active {
  transform: translateY(0);
}

.add-btn svg {
  width: 20px;
  height: 20px;
}

@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 20px;
  }

  .add-btn {
    width: 100%;
    justify-content: center;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>
