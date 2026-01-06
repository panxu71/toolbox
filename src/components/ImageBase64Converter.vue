<template>
    <div class="image-base64-converter">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <div class="mode-toggle">
                    <button class="mode-btn" :class="{ active: mode === 'toBase64' }" @click="setMode('toBase64')">
                        图片转Base64
                    </button>
                    <button class="mode-btn" :class="{ active: mode === 'fromBase64' }" @click="setMode('fromBase64')">
                        Base64转图片
                    </button>
                </div>
                <div class="formatter-actions">
                    <!-- 图片转Base64模式的操作 -->
                    <template v-if="mode === 'toBase64'">
                        <HeaderActionButton icon="clear" tooltip="清空图片" @click="clearImage" :disabled="!selectedImage" />
                        <HeaderActionButton icon="copy" tooltip="复制Base64" @click="copyBase64" :disabled="!base64Result" />
                        <HeaderActionButton icon="download" tooltip="下载Base64文件" @click="downloadBase64" :disabled="!base64Result" />
                    </template>
                    <!-- Base64转图片模式的操作 -->
                    <template v-if="mode === 'fromBase64'">
                        <HeaderActionButton icon="paste" tooltip="粘贴Base64" @click="pasteBase64" />
                        <HeaderActionButton icon="clear" tooltip="清空输入" @click="clearBase64Input" :disabled="!base64Input" />
                        <HeaderActionButton icon="download" tooltip="下载图片" @click="downloadImage" :disabled="!decodedImage" />
                    </template>
                </div>
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 图片转Base64模式 -->
            <div v-if="mode === 'toBase64'" class="to-base64-section">
                <div class="main-workspace">
                    <!-- 左侧：图片上传区域 -->
                    <div class="left-panel">
                        <div class="upload-section">
                            <div class="section-header">
                                <h3>选择图片</h3>
                            </div>

                            <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
                                <input ref="fileInput" type="file" accept="image/*" @change="handleFileSelect" style="display: none">

                                <div v-if="!selectedImage" class="upload-placeholder">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                            </div>
                            <div class="base64-output">
                                <textarea :value="base64Result" readonly class="base64-textarea" placeholder="Base64编码结果将显示在这里..."></textarea>
                            </div>
                            <div class="result-stats">
                                <span class="stat-item">{{ base64Result.length }} 字符</span>
                                <span class="stat-item">{{ Math.round(base64Result.length / 1024) }} KB</span>
                                <span class="stat-item">压缩率: {{ compressionRatio }}%</span>
                            </div>
                        </div>
                        <div v-else class="result-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

            <!-- Base64转图片模式 -->
            <div v-if="mode === 'fromBase64'" class="from-base64-section">
                <div class="main-workspace">
                    <!-- 左侧：Base64输入区域 -->
                    <div class="left-panel">
                        <div class="input-section">
                            <div class="section-header">
                                <h3>Base64 编码输入</h3>
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
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                {{ decodeError }}
                            </div>
                        </div>
                        <div v-else class="result-placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 根据卡片ID获取标题
function getCardTitle(cardId: string): string {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === cardId)
        if (card) {
            return card.title
        }
    }
    return cardId
}

// 使用页面标题管理
usePageTitle('image-base64')
const cardTitle = getCardTitle('image-base64')

// 使用公共通知系统
const { success: showSuccess, error: showError } = useNotification()

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
            showError('请选择图片文件')
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
        showSuccess('图片已加载')
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
    showSuccess('已清空图片')
}

// 复制Base64
const copyBase64 = async () => {
    try {
        await navigator.clipboard.writeText(base64Result.value)
        showSuccess('Base64编码已复制到剪贴板')
    } catch (error) {
        showError('复制失败')
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
    showSuccess('Base64文件已下载')
}

// 粘贴Base64
const pasteBase64 = async () => {
    try {
        const text = await navigator.clipboard.readText()
        base64Input.value = text
        decodeBase64()
        showSuccess('Base64编码已粘贴')
    } catch (error) {
        showError('粘贴失败')
    }
}

// 清空Base64输入
const clearBase64Input = () => {
    base64Input.value = ''
    decodedImage.value = ''
    imageType.value = ''
    decodeError.value = ''
    showSuccess('已清空输入')
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

        showSuccess('Base64解码成功')
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
    showSuccess('图片已下载')
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
</script>

<style scoped>
.image-base64-converter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

/* 模式切换 */
.mode-toggle {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--bg-primary);
}

.mode-btn {
    padding: 8px 16px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border-right: 1px solid var(--border-color);
    height: 36px;
    box-sizing: border-box;
}

.mode-btn:last-child {
    border-right: none;
}

.mode-btn.active {
    background: var(--primary-color);
    color: white;
}

.mode-btn:hover:not(.active) {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

/* 格式化操作按钮 */
.formatter-actions {
    display: flex;
    gap: 0.5rem;
}

.converter-content {
    flex: 1;
    padding: 1.5rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* 主工作区 - 左右布局 */
.main-workspace {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: 1.5rem;
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
    background: var(--border-color);
    width: 1px;
}

/* 通用区域样式 */
.upload-section,
.input-section,
.result-section,
.decoded-result-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
}

.section-header h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
}

/* 上传区域 */
.upload-area {
    border: 2px dashed var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    background: var(--bg-primary);
}

.upload-area:hover {
    border-color: var(--primary-color);
    background: var(--bg-tertiary);
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--text-secondary);
}

.upload-placeholder svg {
    color: var(--text-muted);
}

.upload-placeholder p {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
}

.upload-hint {
    font-size: 0.875rem !important;
    color: var(--text-muted) !important;
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
    gap: 0.75rem;
    justify-content: center;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--bg-tertiary);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    border: 1px solid var(--border-color);
}

.label {
    font-weight: 600;
    color: var(--text-primary);
}

.value {
    color: var(--text-secondary);
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
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
    resize: none;
    transition: all 0.2s;
    box-sizing: border-box;
    line-height: 1.5;
    min-height: 300px;
    outline: none;
}

.base64-input:focus,
.base64-textarea:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

/* 解码图片 */
.decoded-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.decoded-image {
    max-width: 100%;
    max-height: 400px;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.decoded-info {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
}

/* 统计信息 */
.result-stats {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
    flex-wrap: wrap;
    flex-shrink: 0;
}

.stat-item {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* 占位符 */
.result-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    color: var(--text-muted);
    text-align: center;
    flex: 1;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 2rem;
}

.result-placeholder svg {
    color: var(--text-muted);
}

.result-placeholder p {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
}

/* 错误信息 */
.error-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: var(--error-bg);
    border: 1px solid var(--error-border);
    border-radius: 0.5rem;
    color: var(--error-color);
    font-size: 0.875rem;
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
}

@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
    }

    .upload-section,
    .input-section,
    .result-section,
    .decoded-result-section {
        padding: 1rem;
    }

    .upload-area {
        padding: 1rem;
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