<template>
    <div class="base64-converter">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">Base64编码解码</h2>
            <div class="converter-actions">
                <button class="action-btn" @click="clearAll" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="converter-content">
            <!-- 文本编码解码 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>文本编码解码</h3>
                    <div class="section-info">
                        <span class="info-text">对文本进行Base64编码和解码</span>
                    </div>
                </div>
                <div class="text-converter-container">
                    <div class="input-output-grid">
                        <div class="input-section">
                            <div class="section-title">
                                <span>原始文本</span>
                                <div class="section-actions">
                                    <button class="action-btn-small" @click="pasteText" title="粘贴">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                        </svg>
                                    </button>
                                    <button class="action-btn-small" @click="clearInput" title="清空">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <textarea 
                                v-model="inputText" 
                                placeholder="请输入要编码的文本..."
                                class="text-input"
                                @input="encodeText"
                            ></textarea>
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
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    </button>
                                    <button class="action-btn-small" @click="downloadEncoded" title="下载">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7,10 12,15 17,10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <textarea 
                                v-model="encodedText" 
                                placeholder="编码结果将显示在这里..."
                                class="text-output"
                                readonly
                            ></textarea>
                            <div class="output-info">
                                <span class="char-count">字符数: {{ encodedText.length }}</span>
                                <span class="compression-ratio" v-if="inputText && encodedText">
                                    压缩比: {{ getCompressionRatio() }}%
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="converter-actions">
                        <button class="convert-btn encode" @click="encodeText">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M7 16.5L12 12l5 4.5" />
                                <path d="M7 7.5L12 12l5-4.5" />
                            </svg>
                            编码
                        </button>
                        <button class="convert-btn decode" @click="decodeText">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 7.5L12 12l-5-4.5" />
                                <path d="M17 16.5L12 12l-5 4.5" />
                            </svg>
                            解码
                        </button>
                        <button class="swap-btn" @click="swapContent">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                        <input 
                            ref="fileInput" 
                            type="file" 
                            @change="handleFileSelect" 
                            class="file-input"
                            accept="*/*"
                        />
                        <div class="upload-content" @click="fileInput?.click()">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        
                        <div class="file-actions">
                            <button class="file-action-btn" @click="encodeFile" :disabled="isProcessing">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                                <button class="action-btn-small" @click="downloadFileResult" title="下载">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7,10 12,15 17,10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <textarea 
                            v-model="fileEncodedResult" 
                            class="file-result-text"
                            readonly
                        ></textarea>
                        <div class="result-info">
                            <span>原始大小: {{ formatFileSize(selectedFile?.size || 0) }}</span>
                            <span>编码后大小: {{ formatFileSize(getByteLength(fileEncodedResult)) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- URL安全编码 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>URL安全Base64</h3>
                    <div class="section-info">
                        <span class="info-text">URL安全的Base64编码，替换+/字符</span>
                    </div>
                </div>
                <div class="url-safe-container">
                    <div class="url-safe-grid">
                        <div class="input-group">
                            <label>输入文本</label>
                            <textarea 
                                v-model="urlSafeInput" 
                                placeholder="请输入要进行URL安全编码的文本..."
                                class="url-safe-input"
                                @input="encodeUrlSafe"
                            ></textarea>
                        </div>
                        <div class="output-group">
                            <label>URL安全Base64结果</label>
                            <textarea 
                                v-model="urlSafeOutput" 
                                placeholder="URL安全编码结果..."
                                class="url-safe-output"
                                readonly
                            ></textarea>
                            <button class="copy-url-safe-btn" @click="copyUrlSafe" title="复制结果">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="url-safe-actions">
                        <button class="url-safe-btn encode" @click="encodeUrlSafe">编码</button>
                        <button class="url-safe-btn decode" @click="decodeUrlSafe">解码</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {  ref, onMounted, onUnmounted  } from 'vue'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'

defineEmits<{
    back: []
}>()

// 文本编码解码状态
const inputText = ref('')
const encodedText = ref('')

// 文件编码状态
const selectedFile = ref<File | null>(null)
const fileEncodedResult = ref('')
const isProcessing = ref(false)
const fileInput = ref<HTMLInputElement>()

// URL安全编码状态
const urlSafeInput = ref('')
const urlSafeOutput = ref('')

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

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

// 文本编码
const encodeText = () => {
    if (!inputText.value.trim()) {
        encodedText.value = ''
        return
    }
    
    try {
        encodedText.value = btoa(unescape(encodeURIComponent(inputText.value)))
        showMessage('编码成功', 'success')
    } catch (error) {
        showMessage('编码失败，请检查输入内容', 'error')
    }
}

// 文本解码
const decodeText = () => {
    if (!inputText.value.trim()) {
        encodedText.value = ''
        return
    }
    
    try {
        encodedText.value = decodeURIComponent(escape(atob(inputText.value)))
        showMessage('解码成功', 'success')
    } catch (error) {
        showMessage('解码失败，请检查Base64格式', 'error')
    }
}

// 交换内容
const swapContent = () => {
    const temp = inputText.value
    inputText.value = encodedText.value
    encodedText.value = temp
    showMessage('内容已交换', 'success')
}

// 粘贴文本
const pasteText = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
        encodeText()
        showMessage('已粘贴文本', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

// 清空输入
const clearInput = () => {
    inputText.value = ''
    encodedText.value = ''
    showMessage('已清空输入', 'success')
}

// 复制编码结果
const copyEncoded = async () => {
    if (!encodedText.value) {
        showMessage('没有可复制的内容', 'error')
        return
    }
    
    try {
        await navigator.clipboard.writeText(encodedText.value)
        showMessage('编码结果已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 下载编码结果
const downloadEncoded = () => {
    if (!encodedText.value) {
        showMessage('没有可下载的内容', 'error')
        return
    }
    
    const blob = new Blob([encodedText.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'base64-encoded.txt'
    a.click()
    URL.revokeObjectURL(url)
    showMessage('编码结果已下载', 'success')
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB限制
            showMessage('文件大小不能超过10MB', 'error')
            return
        }
        selectedFile.value = file
        fileEncodedResult.value = ''
        showMessage('文件已选择', 'success')
    }
}

// 处理文件拖拽
const handleFileDrop = (event: DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            showMessage('文件大小不能超过10MB', 'error')
            return
        }
        selectedFile.value = file
        fileEncodedResult.value = ''
        showMessage('文件已选择', 'success')
    }
}

// 移除文件
const removeFile = () => {
    selectedFile.value = null
    fileEncodedResult.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    showMessage('文件已移除', 'success')
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
            showMessage('文件编码完成', 'success')
        } catch (error) {
            showMessage('文件编码失败', 'error')
        } finally {
            isProcessing.value = false
        }
    }
    
    reader.onerror = () => {
        showMessage('文件读取失败', 'error')
        isProcessing.value = false
    }
    
    reader.readAsDataURL(selectedFile.value)
}

// 复制文件编码结果
const copyFileResult = async () => {
    if (!fileEncodedResult.value) return
    
    try {
        await navigator.clipboard.writeText(fileEncodedResult.value)
        showMessage('文件编码结果已复制', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
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
    showMessage('文件编码结果已下载', 'success')
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// URL安全编码
const encodeUrlSafe = () => {
    if (!urlSafeInput.value.trim()) {
        urlSafeOutput.value = ''
        return
    }
    
    try {
        const base64 = btoa(unescape(encodeURIComponent(urlSafeInput.value)))
        urlSafeOutput.value = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
        showMessage('URL安全编码成功', 'success')
    } catch (error) {
        showMessage('URL安全编码失败', 'error')
    }
}

// URL安全解码
const decodeUrlSafe = () => {
    if (!urlSafeInput.value.trim()) {
        urlSafeOutput.value = ''
        return
    }
    
    try {
        let base64 = urlSafeInput.value.replace(/-/g, '+').replace(/_/g, '/')
        // 补充padding
        while (base64.length % 4) {
            base64 += '='
        }
        urlSafeOutput.value = decodeURIComponent(escape(atob(base64)))
        showMessage('URL安全解码成功', 'success')
    } catch (error) {
        showMessage('URL安全解码失败', 'error')
    }
}

// 复制URL安全编码结果
const copyUrlSafe = async () => {
    if (!urlSafeOutput.value) return
    
    try {
        await navigator.clipboard.writeText(urlSafeOutput.value)
        showMessage('URL安全编码结果已复制', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 清空所有
const clearAll = () => {
    inputText.value = ''
    encodedText.value = ''
    selectedFile.value = null
    fileEncodedResult.value = ''
    urlSafeInput.value = ''
    urlSafeOutput.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    showMessage('已清空所有内容', 'success')
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error') => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 页面标题管理
onMounted(() => {
    setPageTitle('base64-converter')
})

onUnmounted(() => {
    restoreDefaultTitle()
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

.converter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
}

.back-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.converter-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.converter-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.converter-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

.converter-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
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
}

/* 文本编码解码样式 */
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
    height: 250px;
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

.text-input:focus,
.text-output:focus {
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

.char-count,
.byte-count,
.compression-ratio {
    padding: 0.25rem 0.5rem;
    background: var(--bg-tertiary);
    border-radius: 0.25rem;
}

.converter-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.convert-btn,
.swap-btn {
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
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-weight: 500;
}

.swap-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

/* 文件编码样式 */
.file-converter-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.file-upload-area {
    position: relative;
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

.file-upload-area.dragover {
    border-color: var(--primary-color);
    background: var(--primary-color-alpha);
}

.file-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.upload-content svg {
    color: var(--text-secondary);
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
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.file-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
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
    font-weight: 600;
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

/* URL安全编码样式 */
.url-safe-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.url-safe-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.input-group,
.output-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    position: relative;
}

.input-group label,
.output-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.url-safe-input,
.url-safe-output {
    width: 100%;
    height: 150px;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    resize: vertical;
    min-height: 100px;
}

.url-safe-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.url-safe-output {
    background: var(--bg-quaternary);
}

.copy-url-safe-btn {
    position: absolute;
    top: 2rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-url-safe-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.url-safe-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
}

.url-safe-btn {
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

.url-safe-btn.encode {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.url-safe-btn.encode:hover {
    background: var(--success-color-dark);
    border-color: var(--success-color-dark);
}

.url-safe-btn.decode {
    background: var(--warning-color);
    color: white;
    border-color: var(--warning-color);
}

.url-safe-btn.decode:hover {
    background: var(--warning-color-dark);
    border-color: var(--warning-color-dark);
}

/* 消息提示样式 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.message-toast.success {
    background: var(--success-color);
}

.message-toast.error {
    background: var(--error-color);
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
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
    
    .input-output-grid,
    .url-safe-grid {
        grid-template-columns: 1fr;
    }
    
    .converter-actions,
    .url-safe-actions {
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
    
    .url-safe-input,
    .url-safe-output {
        height: 100px;
    }
}
</style>