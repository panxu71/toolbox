<template>
    <div class="base64-converter">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 文本编码解码 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>文本编码解码</h3>
                    <div class="section-info">
                        <span class="info-text">对文本进行Base64编码和解码，支持URL安全格式</span>
                    </div>
                </div>
                <div class="text-converter-container">
                    <div class="input-output-grid">
                        <div class="input-section">
                            <div class="section-title">
                                <span>原始文本</span>
                                <div class="section-actions">
                                    <button class="action-btn-small" @click="pasteText" title="粘贴">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                            <path
                                                d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                        </svg>
                                    </button>
                                    <button class="action-btn-small" @click="clearInput" title="清空">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <textarea v-model="inputText" placeholder="请输入要编码的文本..." class="text-input"
                                @input="handleTextInput"></textarea>
                            <div class="input-info">
                                <span class="char-count">字符数: {{ inputText.length }}</span>
                                <span class="byte-count">字节数: {{ getByteLength(inputText) }}</span>
                            </div>
                        </div>

                        <div class="output-section">
                            <div class="section-title">
                                <span>Base64编码结果</span>
                                <div class="section-actions">
                                    <button class="action-btn-small" @click="copyEncoded" title="复制">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    </button>
                                    <button class="action-btn-small" @click="downloadEncoded" title="下载">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7,10 12,15 17,10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <textarea v-model="encodedText" placeholder="编码结果将显示在这里..." class="text-output"
                                readonly></textarea>
                            <div class="output-info">
                                <span class="char-count">字符数: {{ encodedText.length }}</span>
                                <span class="compression-ratio" v-if="inputText && encodedText">
                                    压缩比: {{ getCompressionRatio() }}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="converter-options">
                        <label class="option-checkbox">
                            <input type="checkbox" v-model="isUrlSafe" @change="handleTextInput">
                            <span class="checkmark"></span>
                            URL安全格式 (替换 +/= 字符)
                        </label>
                    </div>

                    <div class="converter-actions">
                        <button class="convert-btn encode" @click="encodeText">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M7 16.5L12 12l5 4.5" />
                                <path d="M7 7.5L12 12l5-4.5" />
                            </svg>
                            编码
                        </button>
                        <button class="convert-btn decode" @click="decodeText">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M17 7.5L12 12l-5-4.5" />
                                <path d="M17 16.5L12 12l-5 4.5" />
                            </svg>
                            解码
                        </button>
                        <button class="swap-btn" @click="swapContent">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M8 3L4 7l4 4" />
                                <path d="M4 7h16" />
                                <path d="M16 21l4-4-4-4" />
                                <path d="M20 17H4" />
                            </svg>
                            交换
                        </button>
                    </div>
                </div>
            </div>

            <!-- 文件编码解码 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>文件编码解码</h3>
                    <div class="section-info">
                        <span class="info-text">对文件进行Base64编码，支持图片、文档等</span>
                    </div>
                </div>
                <div class="file-converter-container">
                    <div class="file-upload-area" @drop="handleFileDrop" @dragover.prevent @dragenter.prevent>
                        <input ref="fileInput" type="file" @change="handleFileSelect" class="file-input" accept="*/*" />
                        <div class="upload-content" @click="fileInput?.click()">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17,8 12,3 7,8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <p class="upload-text">点击选择文件或拖拽文件到此处</p>
                            <p class="upload-hint">支持所有文件类型，最大10MB</p>
                        </div>
                    </div>

                    <div v-if="selectedFile" class="file-info">
                        <div class="file-details">
                            <div class="file-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14,2 14,8 20,8" />
                                </svg>
                            </div>
                            <div class="file-meta">
                                <div class="file-name">{{ selectedFile.name }}</div>
                                <div class="file-size">{{ formatFileSize(selectedFile.size) }}</div>
                                <div class="file-type">{{ selectedFile.type || '未知类型' }}</div>
                            </div>
                            <button class="remove-file-btn" @click="removeFile">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div class="file-actions">
                            <button class="file-action-btn" @click="encodeFile" :disabled="isProcessing">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M7 16.5L12 12l5 4.5" />
                                    <path d="M7 7.5L12 12l5-4.5" />
                                </svg>
                                {{ isProcessing ? '编码中...' : '编码文件' }}
                            </button>
                        </div>
                    </div>

                    <div v-if="fileEncodedResult" class="file-result">
                        <div class="result-header">
                            <h4>编码结果</h4>
                            <div class="result-actions">
                                <button class="action-btn-small" @click="copyFileResult" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                                <button class="action-btn-small" @click="downloadFileResult" title="下载">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7,10 12,15 17,10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <textarea v-model="fileEncodedResult" class="file-result-text" readonly></textarea>
                        <div class="result-info">
                            <span>原始大小: {{ formatFileSize(selectedFile?.size || 0) }}</span>
                            <span>编码后大小: {{ formatFileSize(getByteLength(fileEncodedResult)) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
    // 遍历所有分类查找对应的卡片
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
usePageTitle('base64-encode')
const cardTitle = getCardTitle('base64-encode')

// 使用公共通知系统
const { success: showSuccess, error: showError } = useNotification()

// 文本编码解码状态
const inputText = ref('')
const encodedText = ref('')
const isUrlSafe = ref(false)

// 文件编码状态
const selectedFile = ref<File | null>(null)
const fileEncodedResult = ref('')
const isProcessing = ref(false)
const fileInput = ref<HTMLInputElement>()

// 获取字符串字节长度
const getByteLength = (str: string): number => {
    return new Blob([str]).size
}

// 获取压缩比
const getCompressionRatio = (): string => {
    if (!inputText.value || !encodedText.value) return '0'
    const originalSize = getByteLength(inputText.value)
    const encodedSize = getByteLength(encodedText.value)
    const ratio = ((encodedSize - originalSize) / originalSize * 100).toFixed(1)
    return ratio
}

// 处理文本输入变化
const handleTextInput = () => {
    if (inputText.value.trim()) {
        encodeText()
    } else {
        encodedText.value = ''
    }
}

// 文本编码
const encodeText = () => {
    if (!inputText.value.trim()) {
        encodedText.value = ''
        return
    }

    try {
        let base64 = btoa(new TextEncoder().encode(inputText.value).reduce((data, byte) => data + String.fromCharCode(byte), ''))

        if (isUrlSafe.value) {
            // URL安全格式：替换 + 为 -，/ 为 _，移除 =
            base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
        }

        encodedText.value = base64
        showSuccess('编码成功')
    } catch (error) {
        showError('编码失败，请检查输入内容')
    }
}

// 文本解码
const decodeText = () => {
    if (!inputText.value.trim()) {
        encodedText.value = ''
        return
    }

    try {
        let base64 = inputText.value

        if (isUrlSafe.value) {
            // 还原URL安全格式
            base64 = base64.replace(/-/g, '+').replace(/_/g, '/')
            // 补充padding
            while (base64.length % 4) {
                base64 += '='
            }
        }

        const binaryString = atob(base64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        encodedText.value = new TextDecoder().decode(bytes)
        showSuccess('解码成功')
    } catch (error) {
        showError('解码失败，请检查Base64格式')
    }
}

// 交换内容
const swapContent = () => {
    const temp = inputText.value
    inputText.value = encodedText.value
    encodedText.value = temp
    showSuccess('内容已交换')
}

// 粘贴文本
const pasteText = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
        encodeText()
        showSuccess('已粘贴文本')
    } catch (error) {
        showError('粘贴失败')
    }
}

// 清空输入
const clearInput = () => {
    inputText.value = ''
    encodedText.value = ''
    showSuccess('已清空输入')
}

// 复制编码结果
const copyEncoded = async () => {
    if (!encodedText.value) {
        showError('没有可复制的内容')
        return
    }

    try {
        await navigator.clipboard.writeText(encodedText.value)
        showSuccess('编码结果已复制到剪贴板')
    } catch (error) {
        showError('复制失败')
    }
}

// 下载编码结果
const downloadEncoded = () => {
    if (!encodedText.value) {
        showError('没有可下载的内容')
        return
    }

    const blob = new Blob([encodedText.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'base64-encoded.txt'
    a.click()
    URL.revokeObjectURL(url)
    showSuccess('编码结果已下载')
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB限制
            showError('文件大小不能超过10MB')
            return
        }
        selectedFile.value = file
        fileEncodedResult.value = ''
        showSuccess('文件已选择')
    }
}

// 处理文件拖拽
const handleFileDrop = (event: DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            showError('文件大小不能超过10MB')
            return
        }
        selectedFile.value = file
        fileEncodedResult.value = ''
        showSuccess('文件已选择')
    }
}

// 移除文件
const removeFile = () => {
    selectedFile.value = null
    fileEncodedResult.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    showSuccess('文件已移除')
}

// 编码文件
const encodeFile = () => {
    if (!selectedFile.value) return

    isProcessing.value = true
    const reader = new FileReader()

    reader.onload = (e) => {
        try {
            const result = e.target?.result as string
            const base64Data = result.split(',')[1]
            fileEncodedResult.value = base64Data || '' // 移除data:前缀
            showSuccess('文件编码完成')
        } catch (error) {
            showError('文件编码失败')
        } finally {
            isProcessing.value = false
        }
    }

    reader.onerror = () => {
        showError('文件读取失败')
        isProcessing.value = false
    }

    reader.readAsDataURL(selectedFile.value)
}

// 复制文件编码结果
const copyFileResult = async () => {
    if (!fileEncodedResult.value) return

    try {
        await navigator.clipboard.writeText(fileEncodedResult.value)
        showSuccess('文件编码结果已复制')
    } catch (error) {
        showError('复制失败')
    }
}

// 下载文件编码结果
const downloadFileResult = () => {
    if (!fileEncodedResult.value) return

    const blob = new Blob([fileEncodedResult.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedFile.value?.name || 'file'}-base64.txt`
    a.click()
    URL.revokeObjectURL(url)
    showSuccess('文件编码结果已下载')
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
    inputText.value = ''
    encodedText.value = ''
    selectedFile.value = null
    fileEncodedResult.value = ''
    isUrlSafe.value = false
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    showSuccess('已清空所有内容')
}

onMounted(() => {
    // 页面初始化逻辑
})
</script>
<style scoped>
.base64-converter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.converter-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    /* 隐藏滚动条但保持滚动功能 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.converter-content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.converter-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.section-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.section-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    background: var(--bg-tertiary);
    border-radius: 0.375rem;
}

/* 文本转换器样式 */
.text-converter-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.input-output-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.input-section,
.output-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.section-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn-small:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.text-input,
.text-output {
    width: 100%;
    height: 200px;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    resize: vertical;
    min-height: 150px;
}

.text-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.text-output {
    background: var(--bg-quaternary);
}

.input-info,
.output-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.input-info span,
.output-info span {
    padding: 0.25rem 0.5rem;
    background: var(--bg-tertiary);
    border-radius: 0.25rem;
}

.converter-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
}

.converter-options {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
}

.option-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text-primary);
}

.option-checkbox input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: var(--primary-color);
    cursor: pointer;
}

.option-checkbox .checkmark {
    user-select: none;
}

.convert-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.convert-btn.encode {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.convert-btn.encode:hover {
    background: var(--success-color-dark);
    border-color: var(--success-color-dark);
}

.convert-btn.decode {
    background: var(--warning-color);
    color: white;
    border-color: var(--warning-color);
}

.convert-btn.decode:hover {
    background: var(--warning-color-dark);
    border-color: var(--warning-color-dark);
}

.swap-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.swap-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* 文件转换器样式 */
.file-converter-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.file-upload-area {
    border: 2px dashed var(--border-color);
    border-radius: 0.75rem;
    padding: 2rem;
    text-align: center;
    transition: all 0.2s ease;
    cursor: pointer;
}

.file-upload-area:hover {
    border-color: var(--primary-color);
    background: var(--primary-color-alpha);
}

.file-input {
    display: none;
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--text-secondary);
}

.upload-content svg {
    color: var(--text-tertiary);
}

.upload-text {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-primary);
    margin: 0;
}

.upload-hint {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
}

.file-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
}

.file-details {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.file-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background: var(--primary-color-alpha);
    border-radius: 0.5rem;
    color: var(--primary-color);
}

.file-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.file-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.file-size,
.file-type {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.remove-file-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.remove-file-btn:hover {
    background: var(--error-color-dark);
}

.file-actions {
    display: flex;
    gap: 0.75rem;
}

.file-action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.file-action-btn:hover:not(:disabled) {
    background: var(--primary-color-dark);
}

.file-action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.file-result {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.result-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.result-actions {
    display: flex;
    gap: 0.5rem;
}

.file-result-text {
    width: 100%;
    height: 150px;
    padding: 0.75rem;
    background: var(--bg-quaternary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.75rem;
    font-family: 'Courier New', monospace;
    resize: vertical;
    min-height: 100px;
}

.result-info {
    display: flex;
    justify-content: space-between;
    margin-top: 0.75rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.result-info span {
    padding: 0.25rem 0.5rem;
    background: var(--bg-secondary);
    border-radius: 0.25rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        gap: 1.5rem;
    }

    .converter-section {
        padding: 1rem;
    }

    .input-output-grid {
        grid-template-columns: 1fr;
    }

    .converter-actions {
        flex-direction: column;
    }

    .file-details {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .file-actions {
        flex-direction: column;
    }

    .text-input,
    .text-output,
    .file-result-text {
        height: 150px;
    }
}
</style>