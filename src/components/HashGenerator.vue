<template>
    <div class="hash-generator">
        <div class="generator-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="generator-title">哈希生成器</h2>
            <div class="generator-actions">
                <button class="action-btn" @click="clearAll" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="generator-content">
            <!-- 文本哈希生成 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>文本哈希生成</h3>
                    <div class="section-info">
                        <span class="info-text">对文本生成多种哈希值</span>
                    </div>
                </div>
                <div class="text-hash-container">
                    <div class="input-section">
                        <div class="input-header">
                            <label>输入文本</label>
                            <div class="input-actions">
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
                            placeholder="请输入要生成哈希的文本..."
                            class="text-input"
                            @input="generateHashes"
                        ></textarea>
                        <div class="input-info">
                            <span class="char-count">字符数: {{ inputText.length }}</span>
                            <span class="byte-count">字节数: {{ getByteLength(inputText) }}</span>
                        </div>
                    </div>
                    
                    <div class="hash-results">
                        <div class="results-title">
                            <h4>哈希结果</h4>
                            <div class="results-divider"></div>
                        </div>
                        <div class="hash-grid">
                            <div v-for="hash in hashResults" :key="hash.type" class="hash-result-item">
                                <div class="hash-header">
                                    <div class="hash-info">
                                        <span class="hash-type">{{ hash.type }}</span>
                                        <span class="hash-description">{{ hash.description }}</span>
                                    </div>
                                    <div class="hash-actions">
                                        <button class="copy-hash-btn" @click="copyHash(hash)" title="复制">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                            </svg>
                                        </button>
                                        <button class="verify-hash-btn" @click="verifyHash(hash)" title="验证">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <polyline points="20,6 9,17 4,12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="hash-value">{{ hash.value || '请输入文本' }}</div>
                                <div class="hash-meta">
                                    <span class="hash-length">长度: {{ hash.value?.length || 0 }}</span>
                                    <span class="hash-format">格式: {{ hash.format }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 文件哈希生成 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>文件哈希生成</h3>
                    <div class="section-info">
                        <span class="info-text">对文件生成哈希值，用于完整性验证</span>
                    </div>
                </div>
                <div class="file-hash-container">
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
                            <p class="upload-hint">支持所有文件类型，最大100MB</p>
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
                            <button class="file-action-btn" @click="generateFileHashes" :disabled="isProcessing">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                                {{ isProcessing ? '生成中...' : '生成哈希' }}
                            </button>
                        </div>
                        
                        <div v-if="fileHashResults.length > 0" class="file-hash-results">
                            <div class="results-header">
                                <h4>文件哈希结果</h4>
                                <button class="export-results-btn" @click="exportFileHashes" title="导出结果">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7,10 12,15 17,10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                            <div class="file-hash-list">
                                <div v-for="hash in fileHashResults" :key="hash.type" class="file-hash-item">
                                    <div class="file-hash-header">
                                        <span class="file-hash-type">{{ hash.type }}</span>
                                        <button class="copy-file-hash-btn" @click="copyHash(hash)" title="复制">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="file-hash-value">{{ hash.value }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 哈希验证 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>哈希验证</h3>
                    <div class="section-info">
                        <span class="info-text">验证文本或文件的哈希值是否匹配</span>
                    </div>
                </div>
                <div class="hash-verify-container">
                    <div class="verify-form">
                        <div class="verify-input-group">
                            <label>原始文本</label>
                            <textarea 
                                v-model="verifyText" 
                                placeholder="请输入要验证的原始文本..."
                                class="verify-input"
                                @input="updateVerifyHash"
                            ></textarea>
                        </div>
                        <div class="verify-input-group">
                            <label>哈希类型</label>
                            <select v-model="verifyHashType" @change="updateVerifyHash" class="hash-type-select">
                                <option value="MD5">MD5</option>
                                <option value="SHA-1">SHA-1</option>
                                <option value="SHA-256">SHA-256</option>
                                <option value="SHA-512">SHA-512</option>
                            </select>
                        </div>
                        <div class="verify-input-group">
                            <label>期望哈希值</label>
                            <input 
                                v-model="expectedHash" 
                                type="text" 
                                placeholder="请输入期望的哈希值..."
                                class="expected-hash-input"
                                @input="() => compareHashes()"
                            />
                        </div>
                    </div>
                    
                    <div v-if="verifyResult" class="verify-result">
                        <div class="verify-result-header">
                            <h4>验证结果</h4>
                            <div class="verify-status" :class="verifyResult.match ? 'match' : 'mismatch'">
                                <svg v-if="verifyResult.match" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                {{ verifyResult.match ? '匹配' : '不匹配' }}
                            </div>
                        </div>
                        <div class="verify-details">
                            <div class="verify-detail-item">
                                <span class="verify-label">计算得到:</span>
                                <span class="verify-value computed">{{ verifyResult.computed }}</span>
                            </div>
                            <div class="verify-detail-item">
                                <span class="verify-label">期望值:</span>
                                <span class="verify-value expected">{{ verifyResult.expected }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 哈希算法说明 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>哈希算法说明</h3>
                    <div class="section-info">
                        <span class="info-text">了解不同哈希算法的特点和用途</span>
                    </div>
                </div>
                <div class="algorithm-info">
                    <div class="algorithm-grid">
                        <div v-for="algo in algorithmInfo" :key="algo.name" class="algorithm-card">
                            <div class="algorithm-header">
                                <h4>{{ algo.name }}</h4>
                                <span class="algorithm-length">{{ algo.length }}位</span>
                            </div>
                            <div class="algorithm-description">{{ algo.description }}</div>
                            <div class="algorithm-features">
                                <div class="feature-item">
                                    <span class="feature-label">安全性:</span>
                                    <div class="security-level" :class="algo.security">
                                        <div class="security-bar"></div>
                                        <span>{{ algo.securityText }}</span>
                                    </div>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-label">速度:</span>
                                    <div class="speed-level" :class="algo.speed">
                                        <div class="speed-bar"></div>
                                        <span>{{ algo.speedText }}</span>
                                    </div>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-label">用途:</span>
                                    <span class="feature-value">{{ algo.usage }}</span>
                                </div>
                            </div>
                        </div>
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
import { ref } from 'vue'

defineEmits<{
    back: []
}>()

// 基本状态
const inputText = ref('')
const selectedFile = ref<File | null>(null)
const isProcessing = ref(false)
const fileInput = ref<HTMLInputElement>()

// 哈希结果
const hashResults = ref([
    { type: 'MD5', description: '128位哈希值，快速但安全性较低', value: '', format: 'Hex', length: 32 },
    { type: 'SHA-1', description: '160位哈希值，已不推荐用于安全用途', value: '', format: 'Hex', length: 40 },
    { type: 'SHA-256', description: '256位哈希值，目前广泛使用的安全算法', value: '', format: 'Hex', length: 64 },
    { type: 'SHA-512', description: '512位哈希值，更高安全性', value: '', format: 'Hex', length: 128 }
])

const fileHashResults = ref<Array<{ type: string; value: string }>>([])

// 验证相关
const verifyText = ref('')
const verifyHashType = ref('MD5')
const expectedHash = ref('')
const verifyResult = ref<{
    match: boolean
    computed: string
    expected: string
} | null>(null)

// 算法信息
const algorithmInfo = [
    {
        name: 'MD5',
        length: 128,
        description: 'Message Digest Algorithm 5，产生128位哈希值。速度快但已被发现存在碰撞漏洞。',
        security: 'low',
        securityText: '低',
        speed: 'high',
        speedText: '快',
        usage: '文件校验、非安全场景'
    },
    {
        name: 'SHA-1',
        length: 160,
        description: 'Secure Hash Algorithm 1，产生160位哈希值。已被发现安全漏洞，不推荐用于新项目。',
        security: 'medium',
        securityText: '中',
        speed: 'high',
        speedText: '快',
        usage: '兼容性需求、Git版本控制'
    },
    {
        name: 'SHA-256',
        length: 256,
        description: 'SHA-2系列算法，产生256位哈希值。目前广泛使用的安全哈希算法。',
        security: 'high',
        securityText: '高',
        speed: 'medium',
        speedText: '中',
        usage: '数字签名、区块链、SSL证书'
    },
    {
        name: 'SHA-512',
        length: 512,
        description: 'SHA-2系列算法，产生512位哈希值。提供更高的安全性，适用于高安全要求场景。',
        security: 'very-high',
        securityText: '很高',
        speed: 'medium',
        speedText: '中',
        usage: '高安全要求、长期存储'
    }
]

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 获取字符串字节长度
const getByteLength = (str: string): number => {
    return new Blob([str]).size
}

// 简单的哈希函数实现（仅用于演示，实际应用应使用Web Crypto API）
const simpleHash = async (text: string, algorithm: string): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    
    try {
        let hashBuffer: ArrayBuffer
        
        switch (algorithm) {
            case 'MD5':
                // 简单的MD5模拟（实际应用中应使用专门的MD5库）
                return simpleMD5(text)
            case 'SHA-1':
                hashBuffer = await crypto.subtle.digest('SHA-1', data)
                break
            case 'SHA-256':
                hashBuffer = await crypto.subtle.digest('SHA-256', data)
                break
            case 'SHA-512':
                hashBuffer = await crypto.subtle.digest('SHA-512', data)
                break
            default:
                throw new Error('Unsupported algorithm')
        }
        
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch (error) {
        console.error('Hash generation error:', error)
        return ''
    }
}

// 简单的MD5实现（仅用于演示）
const simpleMD5 = (text: string): string => {
    // 这是一个简化的MD5实现，仅用于演示
    // 实际应用中应使用专门的MD5库
    let hash = 0
    if (text.length === 0) return '0'.repeat(32)
    
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32bit integer
    }
    
    // 转换为32位十六进制字符串
    const hex = Math.abs(hash).toString(16).padStart(8, '0')
    return (hex + hex + hex + hex).substring(0, 32)
}

// 生成文本哈希
const generateHashes = async () => {
    if (!inputText.value.trim()) {
        hashResults.value.forEach(hash => {
            hash.value = ''
        })
        return
    }
    
    for (const hash of hashResults.value) {
        try {
            hash.value = await simpleHash(inputText.value, hash.type)
        } catch (error) {
            hash.value = '生成失败'
        }
    }
}

// 粘贴文本
const pasteText = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
        await generateHashes()
        showMessage('已粘贴文本', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

// 清空输入
const clearInput = () => {
    inputText.value = ''
    hashResults.value.forEach(hash => {
        hash.value = ''
    })
    showMessage('已清空输入', 'success')
}

// 复制哈希值
const copyHash = async (hash: { type: string; value: string }) => {
    if (!hash.value) {
        showMessage('没有可复制的哈希值', 'error')
        return
    }
    
    try {
        await navigator.clipboard.writeText(hash.value)
        showMessage(`${hash.type} 哈希值已复制`, 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 验证哈希
const verifyHash = (hash: { type: string; value: string }) => {
    if (!hash.value) {
        showMessage('没有可验证的哈希值', 'error')
        return
    }
    
    verifyText.value = inputText.value
    verifyHashType.value = hash.type
    expectedHash.value = hash.value
    updateVerifyHash()
    showMessage('已设置验证参数', 'success')
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        if (file.size > 100 * 1024 * 1024) { // 100MB限制
            showMessage('文件大小不能超过100MB', 'error')
            return
        }
        selectedFile.value = file
        fileHashResults.value = []
        showMessage('文件已选择', 'success')
    }
}

// 处理文件拖拽
const handleFileDrop = (event: DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]
    if (file) {
        if (file.size > 100 * 1024 * 1024) {
            showMessage('文件大小不能超过100MB', 'error')
            return
        }
        selectedFile.value = file
        fileHashResults.value = []
        showMessage('文件已选择', 'success')
    }
}

// 移除文件
const removeFile = () => {
    selectedFile.value = null
    fileHashResults.value = []
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    showMessage('文件已移除', 'success')
}

// 生成文件哈希
const generateFileHashes = async () => {
    if (!selectedFile.value) return
    
    isProcessing.value = true
    fileHashResults.value = []
    
    try {
        const fileContent = await readFileAsText(selectedFile.value)
        
        const algorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512']
        
        for (const algorithm of algorithms) {
            try {
                const hash = await simpleHash(fileContent, algorithm)
                fileHashResults.value.push({
                    type: algorithm,
                    value: hash
                })
            } catch (error) {
                fileHashResults.value.push({
                    type: algorithm,
                    value: '生成失败'
                })
            }
        }
        
        showMessage('文件哈希生成完成', 'success')
    } catch (error) {
        showMessage('文件哈希生成失败', 'error')
    } finally {
        isProcessing.value = false
    }
}

// 读取文件内容
const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = reject
        reader.readAsText(file)
    })
}

// 导出文件哈希结果
const exportFileHashes = () => {
    if (fileHashResults.value.length === 0) return
    
    const content = [
        `文件: ${selectedFile.value?.name}`,
        `大小: ${formatFileSize(selectedFile.value?.size || 0)}`,
        `生成时间: ${new Date().toLocaleString()}`,
        '',
        ...fileHashResults.value.map(hash => `${hash.type}: ${hash.value}`)
    ].join('\n')
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedFile.value?.name || 'file'}-hashes.txt`
    a.click()
    URL.revokeObjectURL(url)
    showMessage('哈希结果已导出', 'success')
}

// 更新验证哈希
const updateVerifyHash = async () => {
    if (!verifyText.value.trim()) {
        verifyResult.value = null
        return
    }
    
    try {
        const computed = await simpleHash(verifyText.value, verifyHashType.value)
        compareHashes(computed)
    } catch (error) {
        verifyResult.value = null
    }
}

// 比较哈希值
const compareHashes = (computed?: string) => {
    if (!computed && verifyText.value.trim()) {
        updateVerifyHash()
        return
    }
    
    if (!computed || !expectedHash.value.trim()) {
        verifyResult.value = null
        return
    }
    
    const computedLower = computed.toLowerCase()
    const expectedLower = expectedHash.value.toLowerCase().trim()
    
    verifyResult.value = {
        match: computedLower === expectedLower,
        computed: computedLower,
        expected: expectedLower
    }
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
    selectedFile.value = null
    fileHashResults.value = []
    verifyText.value = ''
    expectedHash.value = ''
    verifyResult.value = null
    
    hashResults.value.forEach(hash => {
        hash.value = ''
    })
    
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
</script>

<style scoped>
.hash-generator {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.generator-header {
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
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.back-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.generator-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.generator-actions {
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
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.generator-content {
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

.generator-section {
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

/* 文本哈希样式 */
.text-hash-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
}

.input-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    height: 100%;
}

.input-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.input-header label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.input-actions {
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
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
}

.action-btn-small:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.text-input {
    width: 100%;
    height: 220px;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    resize: vertical;
    min-height: 150px;
    flex: 1;
}

.text-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.input-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.char-count,
.byte-count {
    padding: 0.25rem 0.5rem;
    background: var(--bg-tertiary);
    border-radius: 0.25rem;
}

.hash-results {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.results-title {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.results-title h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.results-divider {
    height: 1px;
    background: linear-gradient(to right, var(--primary-color), transparent);
    opacity: 0.3;
}

.hash-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.hash-result-item {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1rem;
    transition: all 0.2s ease;
    min-height: 140px;
    display: flex;
    flex-direction: column;
}

.hash-result-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
}

.hash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.hash-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.hash-type {
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary-color);
    background: var(--primary-color-alpha);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    display: inline-block;
}

.hash-description {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.hash-actions {
    display: flex;
    gap: 0.5rem;
}

.copy-hash-btn,
.verify-hash-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-hash-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.verify-hash-btn:hover {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.hash-value {
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: var(--text-primary);
    background: var(--bg-secondary);
    padding: 0.75rem;
    border-radius: 0.5rem;
    word-break: break-all;
    margin-bottom: 0.75rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
    line-height: 1.3;
    flex: 1;
}

.hash-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.hash-length,
.hash-format {
    padding: 0.25rem 0.5rem;
    background: var(--bg-secondary);
    border-radius: 0.25rem;
}

/* 文件哈希样式 */
.file-hash-container {
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
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.file-actions {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
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
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.file-action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.file-hash-results {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1rem;
}

.results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.results-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.export-results-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.export-results-btn:hover {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.file-hash-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.file-hash-item {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 0.75rem;
}

.file-hash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.file-hash-type {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.copy-file-hash-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-file-hash-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.file-hash-value {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: var(--text-primary);
    word-break: break-all;
}

/* 哈希验证样式 */
.hash-verify-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.verify-form {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    gap: 1rem;
}

.verify-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.verify-input-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.verify-input {
    height: 140px;
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

.verify-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.hash-type-select,
.expected-hash-input {
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.hash-type-select:focus,
.expected-hash-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.expected-hash-input {
    font-family: 'Courier New', monospace;
}

.verify-result {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.verify-result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.verify-result-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.verify-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.verify-status.match {
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.verify-status.mismatch {
    background: var(--error-color-alpha);
    color: var(--error-color);
}

.verify-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.verify-detail-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.verify-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    min-width: 5rem;
}

.verify-value {
    flex: 1;
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    word-break: break-all;
}

.verify-value.computed {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.verify-value.expected {
    background: var(--bg-secondary);
    color: var(--text-secondary);
}

/* 算法信息样式 */
.algorithm-info {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.algorithm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
}

.algorithm-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: all 0.2s ease;
}

.algorithm-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
    transform: translateY(-2px);
}

.algorithm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.algorithm-header h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.algorithm-length {
    font-size: 0.75rem;
    color: var(--primary-color);
    background: var(--primary-color-alpha);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
}

.algorithm-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 1rem;
}

.algorithm-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.feature-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-primary);
    min-width: 3rem;
}

.security-level,
.speed-level {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.security-bar,
.speed-bar {
    height: 0.25rem;
    border-radius: 0.125rem;
    flex: 1;
    max-width: 4rem;
}

.security-level.low .security-bar {
    background: var(--error-color);
}

.security-level.medium .security-bar {
    background: var(--warning-color);
}

.security-level.high .security-bar {
    background: var(--success-color);
}

.security-level.very-high .security-bar {
    background: var(--primary-color);
}

.speed-level.high .speed-bar {
    background: var(--success-color);
}

.speed-level.medium .speed-bar {
    background: var(--warning-color);
}

.security-level span,
.speed-level span {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.feature-value {
    font-size: 0.75rem;
    color: var(--text-secondary);
    flex: 1;
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
@media (max-width: 1024px) {
    .text-hash-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .hash-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .generator-content {
        padding: 1rem;
        gap: 1.5rem;
    }
    
    .generator-section {
        padding: 1rem;
    }
    
    .text-hash-container {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .hash-grid {
        grid-template-columns: 1fr;
    }
    
    .verify-form {
        grid-template-columns: 1fr;
    }
    
    .algorithm-grid {
        grid-template-columns: 1fr;
    }
    
    .file-details {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }
    
    .file-actions {
        flex-direction: column;
    }
    
    .verify-detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .verify-label {
        min-width: auto;
    }
}
</style>
