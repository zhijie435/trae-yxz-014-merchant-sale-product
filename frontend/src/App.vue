<template>
  <div class="app">
    <div class="container">
      <div class="header">
        <h1 class="title">销售商品管理</h1>
        <p class="subtitle">管理您的商品上下架和审核状态</p>
      </div>

      <ProductFilterBar @filter-change="handleFilterChange" />

      <ProductList
        :products="products"
        :loading="loading"
        @edit="handleEditProduct"
      />

      <EditProductModal
        :visible="showEditModal"
        :product="selectedProduct"
        @close="handleCloseModal"
        @save="handleSaveProduct"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductFilterBar from './components/ProductFilterBar.vue'
import ProductList from './components/ProductList.vue'
import EditProductModal from './components/EditProductModal.vue'
import { getProducts } from './api/product'

const products = ref([])
const loading = ref(false)
const currentFilter = ref('all')
const showEditModal = ref(false)
const selectedProduct = ref(null)

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

const handleEditProduct = (product) => {
  selectedProduct.value = product
  showEditModal.value = true
}

const handleCloseModal = () => {
  showEditModal.value = false
  selectedProduct.value = null
}

const handleSaveProduct = (updatedProduct) => {
  console.log('保存商品:', updatedProduct)
  handleCloseModal()
  loadProducts(currentFilter.value)
}

onMounted(() => {
  loadProducts('all')
})
</script>

<style scoped>
.app {
  width: 100%;
}
</style>
