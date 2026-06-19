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
          :is-headquarters-admin="isHeadquartersAdmin"
          @back="handleBack"
          @save="handleSaveProduct"
        />

        <ProductForm
          v-else-if="currentPage === 'edit'"
          :edit-product="selectedProduct"
          :is-headquarters-admin="isHeadquartersAdmin"
          @back="handleBack"
          @save="handleUpdateProduct"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ProductListPage from './components/ProductListPage.vue'
import ProductForm from './components/ProductForm.vue'
import { createProduct, updateProduct } from './api/product'

const currentPage = ref('list')
const selectedProduct = ref(null)

const currentUserRole = ref('admin')

const isHeadquartersAdmin = computed(() => {
  return currentUserRole.value === 'super_admin' || currentUserRole.value === 'headquarters_admin'
})

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
    if (isHeadquartersAdmin.value && productData.status === 'online') {
      productData.status = 'online'
    } else {
      productData.status = 'pending'
    }
    
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
    if (isHeadquartersAdmin.value && productData.status === 'online') {
      productData.status = 'online'
    } else if (productData.status === 'online') {
      productData.status = 'pending'
    }
    
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
