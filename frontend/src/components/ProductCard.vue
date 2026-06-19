<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="primaryImage" :alt="product.name" />
      <span class="product-category">{{ product.category }}</span>
      <div class="image-count" v-if="imageCount > 1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        {{ imageCount }}
      </div>
    </div>

    <div class="product-content">
      <div class="product-brand" v-if="product.brand">
        {{ product.brand }}
        <span v-if="product.model" class="product-model">{{ product.model }}</span>
      </div>

      <h3 class="product-name">{{ product.name }}</h3>

      <div class="product-price-row">
        <div class="price-info">
          <span class="price-label">销售价</span>
          <span class="price-value">¥{{ product.price }}</span>
        </div>
        <span v-if="product.freeShipping" class="free-shipping-badge">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 8h14l-1.5 8H6.5L5 8z"/>
            <path d="M5 8l-2 4h4"/>
            <path d="M19 8l2 4h-4"/>
          </svg>
          包邮
        </span>
      </div>

      <div class="product-meta">
        <div class="meta-item">
          <span class="meta-label">库存</span>
          <span class="meta-value" :class="{ low: product.stock < 10 }">
            {{ product.stock }}
          </span>
        </div>
        <button class="edit-btn" @click="handleEdit">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          编辑
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit'])

const primaryImage = computed(() => {
  if (props.product.images && props.product.images.length > 0) {
    return props.product.images[0]
  }
  return 'https://via.placeholder.com/400x400?text=No+Image'
})

const imageCount = computed(() => {
  return props.product.images?.length || 0
})

const handleEdit = () => {
  emit('edit', props.product)
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  border-color: #667eea;
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-category {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.image-count {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.image-count svg {
  width: 14px;
  height: 14px;
}

.product-content {
  padding: 16px;
}

.product-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.product-model {
  font-weight: 400;
  color: #8c8c8c;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 44px;
}

.product-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e8e8e8;
}

.price-info {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 12px;
  color: #8c8c8c;
  margin-bottom: 2px;
}

.price-value {
  font-size: 24px;
  font-weight: 700;
  color: #ff4d4f;
  letter-spacing: -0.5px;
}

.free-shipping-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #e6f7ff;
  color: #1890ff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.free-shipping-badge .icon {
  width: 16px;
  height: 16px;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-label {
  font-size: 13px;
  color: #8c8c8c;
}

.meta-value {
  font-size: 14px;
  font-weight: 600;
  color: #52c41a;
}

.meta-value.low {
  color: #ff4d4f;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.edit-btn:active {
  transform: translateY(0);
}

.edit-btn .icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .product-image {
    height: 160px;
  }

  .product-name {
    font-size: 14px;
    min-height: 40px;
  }

  .price-value {
    font-size: 20px;
  }

  .product-content {
    padding: 12px;
  }
}
</style>
