<template>
  <div class="product-form-page">
    <div class="page-header">
      <div class="header-content">
        <button class="back-btn" @click="handleBack">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          返回
        </button>
        <h1>{{ isEdit ? '编辑商品' : '新增商品' }}</h1>
      </div>
      <p class="header-subtitle">填写商品基础信息，完善商品详情</p>
    </div>

    <div class="form-container">
      <div class="form-section">
        <h2 class="section-title">
          <span class="section-icon">📦</span>
          基础信息
        </h2>

        <div class="form-grid">
          <div class="form-group full-width">
            <label class="required">商品名称</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="请输入商品名称，最多100个字符"
              maxlength="100"
              class="input-field"
            />
            <span class="char-count">{{ formData.name.length }}/100</span>
          </div>

          <div class="form-group">
            <label class="required">品牌</label>
            <select v-model="formData.brand" class="input-field">
              <option value="">请选择品牌</option>
              <option value="Apple">Apple</option>
              <option value="Samsung">Samsung</option>
              <option value="Sony">Sony</option>
              <option value="Xiaomi">小米</option>
              <option value="Huawei">华为</option>
              <option value="OPPO">OPPO</option>
              <option value="Vivo">Vivo</option>
              <option value="Nintendo">Nintendo</option>
              <option value="DJI">大疆</option>
              <option value="Other">其他</option>
            </select>
          </div>

          <div class="form-group">
            <label>型号</label>
            <input
              v-model="formData.model"
              type="text"
              placeholder="请输入产品型号"
              class="input-field"
            />
          </div>

          <div class="form-group full-width">
            <label class="required">产品分类</label>
            <div class="category-selector">
              <select v-model="formData.category" class="input-field">
                <option value="">请选择一级分类</option>
                <option value="手机通讯">手机通讯</option>
                <option value="电脑办公">电脑办公</option>
                <option value="数码配件">数码配件</option>
                <option value="平板电脑">平板电脑</option>
                <option value="智能手表">智能手表</option>
                <option value="音频设备">音频设备</option>
                <option value="游戏设备">游戏设备</option>
                <option value="智能穿戴">智能穿戴</option>
                <option value="摄影器材">摄影器材</option>
                <option value="充电设备">充电设备</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2 class="section-title">
          <span class="section-icon">🖼️</span>
          商品主图
          <span class="section-hint">（最多上传6张，第一张为主图）</span>
        </h2>

        <div class="image-upload-grid">
          <div
            v-for="(image, index) in formData.images"
            :key="index"
            class="image-upload-item"
            :class="{ 'is-main': index === 0 }"
          >
            <div v-if="image.url" class="image-preview-wrapper">
              <img :src="image.url" :alt="`商品图片 ${index + 1}`" />
              <div class="image-overlay">
                <button class="overlay-btn" @click="removeImage(index)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                  </svg>
                </button>
                <button v-if="index > 0" class="overlay-btn" @click="setMainImage(index)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
              </div>
              <span v-if="index === 0" class="main-badge">主图</span>
            </div>
            <div v-else class="upload-placeholder" @click="triggerUpload(index)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>点击上传</span>
              <span class="upload-hint">{{ index === 0 ? '主图' : `图片${index + 1}` }}</span>
            </div>
            <input
              :ref="el => setImageInputRef(el, index)"
              type="file"
              accept="image/*"
              style="display: none"
              @change="handleImageUpload($event, index)"
            />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h2 class="section-title">
          <span class="section-icon">🎬</span>
          商品视频
          <span class="section-hint">（上传1个视频，建议时长15-60秒）</span>
        </h2>

        <div class="video-upload-area">
          <div v-if="formData.video.url" class="video-preview">
            <video :src="formData.video.url" controls></video>
            <div class="video-overlay">
              <button class="remove-video-btn" @click="removeVideo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                </svg>
                删除视频
              </button>
            </div>
          </div>
          <div v-else class="upload-placeholder video" @click="triggerVideoUpload">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <span>点击上传视频</span>
            <span class="upload-hint">支持 MP4、MOV 格式，最大 100MB</span>
          </div>
          <input
            ref="videoInput"
            type="file"
            accept="video/*"
            style="display: none"
            @change="handleVideoUpload"
          />
        </div>
      </div>

      <div class="form-actions">
        <button class="btn btn-cancel" @click="handleBack">
          取消
        </button>
        <button class="btn btn-save" @click="handleSave">
          {{ isEdit ? '保存修改' : '创建商品' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  editProduct: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['back', 'save'])

const isEdit = ref(false)
const imageInputRefs = ref([])

const formData = reactive({
  name: '',
  brand: '',
  model: '',
  category: '',
  images: [
    { url: '', file: null },
    { url: '', file: null },
    { url: '', file: null },
    { url: '', file: null },
    { url: '', file: null },
    { url: '', file: null }
  ],
  video: {
    url: '',
    file: null
  }
})

const setImageInputRef = (el, index) => {
  if (el) {
    imageInputRefs.value[index] = el
  }
}

const triggerUpload = (index) => {
  if (imageInputRefs.value[index]) {
    imageInputRefs.value[index].click()
  }
}

const handleImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      formData.images[index] = {
        url: e.target.result,
        file: file
      }
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = (index) => {
  formData.images[index] = { url: '', file: null }
}

const setMainImage = (index) => {
  const [mainImage] = formData.images.splice(index, 1)
  formData.images.unshift(mainImage)
}

const triggerVideoUpload = () => {
  if (videoInput.value) {
    videoInput.value.click()
  }
}

const videoInput = ref(null)

const handleVideoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const validTypes = ['video/mp4', 'video/quicktime']
    if (!validTypes.includes(file.type)) {
      alert('请上传 MP4 或 MOV 格式的视频')
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('视频文件大小不能超过 100MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      formData.video = {
        url: e.target.result,
        file: file
      }
    }
    reader.readAsDataURL(file)
  }
}

const removeVideo = () => {
  formData.video = { url: '', file: null }
}

const validateForm = () => {
  if (!formData.name.trim()) {
    alert('请输入商品名称')
    return false
  }
  if (!formData.brand) {
    alert('请选择品牌')
    return false
  }
  if (!formData.category) {
    alert('请选择产品分类')
    return false
  }
  return true
}

const handleBack = () => {
  emit('back')
}

const handleSave = () => {
  if (!validateForm()) {
    return
  }

  const productData = {
    name: formData.name,
    brand: formData.brand,
    model: formData.model,
    category: formData.category,
    images: formData.images.filter(img => img.url).map(img => img.url),
    video: formData.video.url
  }

  emit('save', productData)
}

onMounted(() => {
  if (props.editProduct) {
    isEdit.value = true
    Object.assign(formData, {
      name: props.editProduct.name || '',
      brand: props.editProduct.brand || '',
      model: props.editProduct.model || '',
      category: props.editProduct.category || '',
      images: [
        ...props.editProduct.images?.map(url => ({ url, file: null })) || [],
        ...Array(6 - (props.editProduct.images?.length || 0)).fill({ url: '', file: null })
      ].slice(0, 6),
      video: {
        url: props.editProduct.video || '',
        file: null
      }
    })
  }
})
</script>

<style scoped>
.product-form-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 8px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #595959;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #e0e0e0;
  transform: translateX(-4px);
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.header-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin-left: 68px;
}

.form-container {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.form-section {
  margin-bottom: 40px;
  padding-bottom: 40px;
  border-bottom: 2px solid #f0f0f0;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 32px;
  padding-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.section-icon {
  font-size: 24px;
}

.section-hint {
  font-size: 13px;
  font-weight: 400;
  color: #8c8c8c;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  position: relative;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.form-group label.required::after {
  content: '*';
  color: #ff4d4f;
  margin-left: 4px;
}

.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s;
  background: white;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-field::placeholder {
  color: #bfbfbf;
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 14px;
  font-size: 12px;
  color: #8c8c8c;
}

.image-upload-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.image-upload-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
}

.image-upload-item.is-main {
  border: 3px solid #667eea;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
}

.upload-placeholder:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.upload-placeholder svg {
  width: 32px;
  height: 32px;
  color: #8c8c8c;
}

.upload-placeholder span {
  font-size: 12px;
  color: #8c8c8c;
}

.upload-placeholder .upload-hint {
  font-size: 11px;
}

.image-preview-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-upload-item:hover .image-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: white;
  color: #595959;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.overlay-btn:hover {
  background: #667eea;
  color: white;
}

.overlay-btn svg {
  width: 18px;
  height: 18px;
}

.main-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: #667eea;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.video-upload-area {
  max-width: 600px;
}

.upload-placeholder.video {
  height: 240px;
  border-radius: 12px;
}

.upload-placeholder.video svg {
  width: 48px;
  height: 48px;
}

.upload-placeholder.video span {
  font-size: 14px;
}

.video-preview {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.video-preview video {
  width: 100%;
  height: 360px;
  object-fit: cover;
  background: #000;
}

.video-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  justify-content: flex-end;
}

.remove-video-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-video-btn:hover {
  background: rgba(255, 77, 77, 0.8);
  border-color: #ff4d4f;
}

.remove-video-btn svg {
  width: 16px;
  height: 16px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding-top: 32px;
  border-top: 2px solid #f0f0f0;
  margin-top: 32px;
}

.btn {
  padding: 14px 40px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f0f0f0;
  color: #595959;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

@media (max-width: 1024px) {
  .image-upload-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .image-upload-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .page-header h1 {
    font-size: 24px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .image-upload-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-form-page {
    padding: 16px;
  }

  .form-container {
    padding: 20px;
  }

  .page-header {
    padding: 20px;
  }
}
</style>
