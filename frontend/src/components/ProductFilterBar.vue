<template>
  <div class="filter-bar">
    <div class="filter-content">
      <div class="filter-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['filter-tab', { active: activeTab === tab.key }]"
          @click="handleTabClick(tab.key)"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-count" v-if="showCount">{{ getCount(tab.key) }}</span>
        </button>
      </div>
      <div class="batch-actions">
        <button class="batch-btn" @click="handleBatchOperation">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          批量操作
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getProductStats } from '../api/product'

const emit = defineEmits(['filter-change'])

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'online', label: '上架中' },
  { key: 'pending', label: '待审核' },
  { key: 'rejected', label: '已驳回' },
  { key: 'offline', label: '已下架' }
]

const activeTab = ref('all')
const stats = ref({
  all: 0,
  online: 0,
  pending: 0,
  rejected: 0,
  offline: 0
})

const showCount = computed(() => {
  return Object.values(stats.value).some(count => count > 0)
})

const getCount = (key) => {
  return stats.value[key] || 0
}

const handleTabClick = (key) => {
  activeTab.value = key
  emit('filter-change', key)
}

const handleBatchOperation = () => {
  alert('批量操作功能开发中...')
  console.log('批量操作按钮被点击')
}

onMounted(async () => {
  try {
    const data = await getProductStats()
    stats.value = data
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
})
</script>

<style scoped>
.filter-bar {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.filter-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.batch-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.batch-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border: 2px solid #667eea;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.batch-btn:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.batch-btn svg {
  width: 16px;
  height: 16px;
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.filter-tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: white;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #595959;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.filter-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.filter-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  color: #667eea;
}

.filter-tab.active {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.filter-tab.active::before {
  opacity: 1;
}

.tab-label,
.tab-count {
  position: relative;
  z-index: 1;
}

.tab-label {
  font-weight: 600;
}

.tab-count {
  background: rgba(0, 0, 0, 0.08);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  min-width: 28px;
  text-align: center;
  transition: all 0.3s;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.filter-tab:not(.active):hover .tab-count {
  background: #667eea;
  color: white;
}

@media (max-width: 768px) {
  .filter-content {
    flex-direction: column;
    gap: 12px;
  }

  .batch-actions {
    width: 100%;
    order: -1;
  }

  .batch-btn {
    flex: 1;
    justify-content: center;
  }

  .filter-tabs {
    gap: 8px;
  }

  .filter-tab {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>
