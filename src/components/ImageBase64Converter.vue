<template>
    <div class="image-base64-converter">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">图片 ⇄ Base64 互转</h2>
            <!-- 模式选择移到标题栏 -->
            <div class="mode-selector">
                <button :class="['mode-btn', { active: mode === 'toBase64' }]" @click="setMode('toBase64')">
                    图片转Base64
                </button>
                <button :class="['mode-btn', { active: mode === 'fromBase64' }]" @click="setMode('fromBase64')">
                    Base64转图片
                </button>
            </div>
        </div>

        <div class="converter-content">
            <!-- 图片转Base64模式 - 左右布局 -->
            <div v-if="mode === 'toBase64'" class="to-base64-section">
                <div class="main-workspace">
                    <!-- 左侧：图片上传区域 -->
                    <div class="left-panel">
                        <div class="upload-section">
                            <div class="section-header">
                                <h3>选择图片</h3>
                                <div class="header-actions">
                                    <button class="action-btn-small" @click="clearImage" title="清空"
                                        :disabled="!selectedImage">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="upload-area" @click="triggerFileInput" @dragover.prevent
                                @drop.prevent="handleDrop">
                                <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect"
                                    style="display: none">

                                <div v-if="!selectedImage" class="upload-placeholder">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="9" cy="9" r="2" />
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                    </svg>
                                    <p>点击选择图片或拖拽到此处</p>
                                    <p class="upload-hint">支持 JPG、PNG、GIF、WebP 等格式</p>
                                </div>

                                <div v-else class="image-preview">
                                    <img :src="imagePreview" :alt="selectedImage.name" />
                                    <div class="image-info">
                                        <div class="info-item">
                                            <span class="label">文件名:</span>
                                            <span class="value">{{ selectedImage.name }}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">大小:</span>
                                            <span class="value">{{ formatFileSize(selectedImage.size) }}</span>
                                        </div>
                                        <div class="info-item">
                                            <span class="label">类型:</span>
                                            <span class="value">{{ selectedImage.type }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分隔线 -->
                    <div class="divider"></div>

                    <!-- 右侧：Base64结果区域 -->
                    <div class="right-panel">
                        <div v-if="base64Result" class="result-section">
                            <div class="section-header">
                                <h3>Base64 编码结果</h3>
                                <div class="header-actions">
                                    <button class="action-btn-small" @click="copyBase64" title="复制">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    </button>
                                    <button class="action-btn-small" @click="downloadBase64" title="下载为文本文件">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7,10 12,15 17,10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="base64-output">
                                <textarea :value="base64Result" readonly class="base64-textarea"
                                    placeholder="Base64编码结果将显示在这里..."></textarea>
                            </div>
                            <div class="result-stats">
                                <span class="stat-item">{{ base64Result.length }} 字符</span>
                                <span class="stat-item">{{ Math.round(base64Result.length / 1024) }} KB</span>
                                <span class="stat-item">压缩率: {{ compressionRatio }}%</span>
                            </div>
                        </div>
                        <div v-else class="result-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10,9 9,9 8,9" />
                            </svg>
                            <p>选择图片后，Base64编码结果将显示在这里</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Base64转图片模式 - 左右布局 -->
            <div v-if="mode === 'fromBase64'" class="from-base64-section">
                <div class="main-workspace">
                    <!-- 左侧：Base64输入区域 -->
                    <div class="left-panel">
                        <div class="input-section">
                            <div class="section-header">
                                <h3>Base64 编码输入</h3>
                                <div class="header-actions">
                                    <button class="action-btn-small" @click="pasteBase64" title="粘贴">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                            <path
                                                d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                        </svg>
                                    </button>
                                    <button class="action-btn-small" @click="clearBase64Input" title="清空"
                                        :disabled="!base64Input">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="base64-input-area">
                                <textarea v-model="base64Input" class="base64-input"
                                    placeholder="请粘贴Base64编码字符串...&#10;支持带data:image前缀的完整格式，也支持纯Base64编码"
                                    @input="decodeBase64"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- 分隔线 -->
                    <div class="divider"></div>

                    <!-- 右侧：图片结果区域 -->
                    <div class="right-panel">
                        <div v-if="decodedImage" class="decoded-result-section">
                            <div class="section-header">
                                <h3>解码结果</h3>
                                <div class="header-actions">
                                    <button class="action-btn-small" @click="downloadImage" title="下载图片">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7,10 12,15 17,10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="decoded-image-container">
                                <img :src="decodedImage" alt="解码后的图片" class="decoded-image" />
                                <div class="decoded-info">
                                    <div class="info-item">
                                        <span class="label">图片类型:</span>
                                        <span class="value">{{ imageType || '未知' }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="label">数据大小:</span>
                                        <span class="value">{{ formatFileSize(base64Input.length * 0.75) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="decodeError" class="error-section">
                            <div class="error-message">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                {{ decodeError }}
                            </div>
                        </div>
                        <div v-else class="result-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="9" cy="9" r="2" />
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                            <p>输入Base64编码后，解码图片将显示在这里</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 消息提示 -->
        <div v-if="message" :class="['message', messageType]">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineEmits<{
    back: []
}>()

// 模式
const mode = ref<'toBase64' | 'fromBase64'>('toBase64')

// 图片转Base64
const fileInput = ref<HTMLInputElement>()
const selectedImage = ref<File | null>(null)
const imagePreview = ref('')
const base64Result = ref('')

// Base64转图片
const base64Input = ref('')
const decodedImage = ref('')
const imageType = ref('')
const decodeError = ref('')

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 压缩率计算
const compressionRatio = computed(() => {
    if (!selectedImage.value || !base64Result.value) return 0
    const originalSize = selectedImage.value.size
    const base64Size = base64Result.value.length * 0.75 // Base64编码大约增加33%
    return Math.round(((base64Size - originalSize) / originalSize) * 100)
})

// 设置模式
const setMode = (newMode: 'toBase64' | 'fromBase64') => {
    mode.value = newMode
    clearAll()
}

// 触发文件选择
const triggerFileInput = () => {
    fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        processImage(file)
    }
}

// 处理拖拽
const handleDrop = (event: DragEvent) => {
    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
        const file = files[0]
        if (file && file.type.startsWith('image/')) {
            processImage(file)
        } else {
            showMessage('请选择图片文件', 'error')
        }
    }
}

// 处理图片
const processImage = (file: File) => {
    selectedImage.value = file

    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
        imagePreview.value = e.target?.result as string
        base64Result.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
}

// 清空图片
const clearImage = () => {
    selectedImage.value = null
    imagePreview.value = ''
    base64Result.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// 复制Base64
const copyBase64 = async () => {
    try {
        await navigator.clipboard.writeText(base64Result.value)
        showMessage('Base64编码已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 下载Base64为文本文件
const downloadBase64 = () => {
    const blob = new Blob([base64Result.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedImage.value?.name || 'image'}_base64.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showMessage('Base64文件已下载', 'success')
}

// 粘贴Base64
const pasteBase64 = async () => {
    try {
        const text = await navigator.clipboard.readText()
        base64Input.value = text
        decodeBase64()
        showMessage('Base64编码已粘贴', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

// 清空Base64输入
const clearBase64Input = () => {
    base64Input.value = ''
    decodedImage.value = ''
    imageType.value = ''
    decodeError.value = ''
}

// 解码Base64
const decodeBase64 = () => {
    if (!base64Input.value.trim()) {
        decodedImage.value = ''
        imageType.value = ''
        decodeError.value = ''
        return
    }

    try {
        let base64Data = base64Input.value.trim()

        // 检查是否包含data URL前缀
        if (base64Data.startsWith('data:image/')) {
            const matches = base64Data.match(/^data:image\/([^;]+);base64,(.+)$/)
            if (matches && matches[1] && matches[2]) {
                imageType.value = matches[1].toUpperCase()
                base64Data = matches[2]
            } else {
                throw new Error('无效的data URL格式')
            }
        } else {
            // 纯Base64，尝试检测图片类型
            imageType.value = detectImageType(base64Data)
        }

        // 验证Base64格式
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
            throw new Error('无效的Base64编码格式')
        }

        // 创建完整的data URL
        const mimeType = getMimeType(imageType.value)
        decodedImage.value = `data:${mimeType};base64,${base64Data}`
        decodeError.value = ''

        showMessage('Base64解码成功', 'success')
    } catch (error) {
        decodedImage.value = ''
        decodeError.value = '解码失败: ' + (error as Error).message
    }
}

// 检测图片类型
const detectImageType = (base64: string): string => {
    // 通过Base64开头的字符来检测图片类型
    const signatures: Record<string, string> = {
        '/9j/': 'JPEG',
        'iVBORw0KGgo': 'PNG',
        'R0lGODlh': 'GIF',
        'UklGR': 'WebP'
    }

    for (const [signature, type] of Object.entries(signatures)) {
        if (base64.startsWith(signature)) {
            return type
        }
    }

    return 'Unknown'
}

// 获取MIME类型
const getMimeType = (imageType: string): string => {
    const mimeTypes: Record<string, string> = {
        'JPEG': 'image/jpeg',
        'JPG': 'image/jpeg',
        'PNG': 'image/png',
        'GIF': 'image/gif',
        'WebP': 'image/webp',
        'BMP': 'image/bmp',
        'SVG': 'image/svg+xml'
    }

    return mimeTypes[imageType.toUpperCase()] || 'image/png'
}

// 下载图片
const downloadImage = () => {
    if (!decodedImage.value) return

    const a = document.createElement('a')
    a.href = decodedImage.value
    a.download = `decoded_image.${imageType.value?.toLowerCase() || 'png'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    showMessage('图片已下载', 'success')
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 清空所有
const clearAll = () => {
    clearImage()
    clearBase64Input()
}

// 显示消息
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}
</script>

<style scoped>
.image-base64-converter {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.converter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.back-btn:hover {
    background: #e2e8f0;
    color: #334155;
}

.converter-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
}

/* 模式选择器 */
.mode-selector {
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem;
    background: #f1f5f9;
    border-radius: 0.75rem;
}

.mode-btn {
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    white-space: nowrap;
}

.mode-btn:hover {
    color: #475569;
    background: rgba(255, 255, 255, 0.5);
}

.mode-btn.active {
    background: white;
    color: #3b82f6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.converter-content {
    flex: 1;
    padding: 2rem;
    padding-bottom: 4rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* 主工作区 - 左右布局 */
.main-workspace {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: 2rem;
    overflow: hidden;
    min-height: 0;
}

.left-panel,
.right-panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
}

.divider {
    background: #e2e8f0;
    width: 1px;
}

/* 通用区域样式 */
.upload-section,
.input-section,
.result-section,
.decoded-result-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f1f5f9;
    flex-shrink: 0;
}

.section-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
}

.header-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
}

.action-btn-small:hover:not(:disabled) {
    background: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;
}

.action-btn-small:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* 上传区域 */
.upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
}

.upload-area:hover {
    border-color: #3b82f6;
    background: #f8fafc;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #6b7280;
}

.upload-placeholder svg {
    color: #9ca3af;
}

.upload-placeholder p {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
}

.upload-hint {
    font-size: 0.875rem !important;
    color: #9ca3af !important;
}

/* 图片预览 */
.image-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
}

.image-preview img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    font-size: 0.875rem;
}

.label {
    font-weight: 600;
    color: #374151;
}

.value {
    color: #6b7280;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* Base64输入输出 */
.base64-input-area,
.base64-output {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.base64-input,
.base64-textarea {
    width: 100%;
    flex: 1;
    padding: 1rem;
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    color: #1f2937;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
    resize: none;
    transition: all 0.2s;
    box-sizing: border-box;
    line-height: 1.5;
    min-height: 300px;
}

.base64-input:focus,
.base64-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: white;
}

/* 解码图片 */
.decoded-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    flex: 1;
}

.decoded-image {
    max-width: 100%;
    max-height: 400px;
    border-radius: 0.75rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.decoded-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
}

/* 统计信息 */
.result-stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    flex-wrap: wrap;
    flex-shrink: 0;
}

.stat-item {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
}

/* 占位符 */
.result-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: #9ca3af;
    text-align: center;
    flex: 1;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.result-placeholder svg {
    color: #d1d5db;
}

.result-placeholder p {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
}

/* 错误信息 */
.error-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    color: #dc2626;
    font-size: 0.875rem;
}

/* 消息提示 */
.message {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 9998;
    animation: slideUp 0.3s ease-out;
}

.message.success {
    background: #10b981;
    color: white;
}

.message.error {
    background: #ef4444;
    color: white;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .main-workspace {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1px 1fr;
        gap: 1rem;
    }

    .divider {
        height: 1px;
        width: 100%;
    }

    .converter-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .mode-selector {
        align-self: center;
    }
}

@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 3rem;
    }

    .upload-section,
    .input-section,
    .result-section,
    .decoded-result-section {
        padding: 1.5rem;
    }

    .upload-area {
        padding: 1.5rem;
        min-height: 200px;
    }

    .image-info,
    .decoded-info {
        flex-direction: column;
        align-items: center;
    }

    .result-stats {
        flex-direction: column;
        gap: 0.5rem;
    }

    .mode-btn {
        font-size: 0.8125rem;
        padding: 0.625rem 0.875rem;
    }
}
</style>