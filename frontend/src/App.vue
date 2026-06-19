<template>
  <div class="app">
    <div class="container">
      <Transition name="page" mode="out-in">
        <ProductListPage
          v-if="currentPage === 'list'"
          @add-product="handleAddProduct"
          @edit-product="handleEditProduct"
          @refresh="loadProducts"
        />

        <ProductForm
          v-else-if="currentPage === 'add'"
          @back="handleBack"
          @save="handleSaveProduct"
        />

        <ProductForm
          v-else-if="currentPage === 'edit'"
          :edit-product="selectedProduct"
          @back="handleBack"
          @save="handleUpdateProduct"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductListPage from './components/ProductListPage.vue'
import ProductForm from './components/ProductForm.vue'
import { createProduct, updateProduct } from './api/product'

const currentPage = ref('list')
const selectedProduct = ref(null)

const handleAddProduct = () => {
  selectedProduct.value = null
  currentPage.value = 'add'
}

const handleEditProduct = (product) => {
  selectedProduct.value = product
  currentPage.value = 'edit'
}

const handleBack = () => {
  currentPage.value = 'list'
  selectedProduct.value = null
}

const handleSaveProduct = async (productData) => {
  try {
    await createProduct(productData)
    alert('商品创建成功！')
    handleBack()
  } catch (error) {
    console.error('创建商品失败:', error)
    alert('创建商品失败，请重试')
  }
}

const handleUpdateProduct = async (productData) => {
  try {
    await updateProduct(selectedProduct.value.id, productData)
    alert('商品更新成功！')
    handleBack()
  } catch (error) {
    console.error('更新商品失败:', error)
    alert('更新商品失败，请重试')
  }
}
</script>

<style scoped>
.app {
  width: 100%;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
