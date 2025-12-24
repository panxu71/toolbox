<template>
    <div class="uuid-generator">
        <div class="generator-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="generator-title">UUID生成器</h2>
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
            <!-- UUID生成器 -->
            <div class="generator-section">
                <div class="uuid-container">
                    <div class="uuid-controls">
                        <div class="section-header">
                            <h3>UUID生成器</h3>
                            <div class="section-info">
                                <span class="info-text">生成各种版本的UUID（通用唯一标识符）</span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>UUID版本</label>
                            <select v-model="selectedVersion" @change="generateUuid" class="version-select">
                                <option value="v1">UUID v1 (时间戳)</option>
                                <option value="v4">UUID v4 (随机)</option>
                                <option value="v7">UUID v7 (时间戳+随机)</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>生成数量</label>
                            <div class="quantity-controls">
                                <input v-model.number="quantity" type="number" min="1" max="1000"
                                    class="quantity-input" />
                                <div class="quantity-buttons">
                                    <button @click="setQuantity(1)" :class="{ active: quantity === 1 }">1</button>
                                    <button @click="setQuantity(10)" :class="{ active: quantity === 10 }">10</button>
                                    <button @click="setQuantity(50)" :class="{ active: quantity === 50 }">50</button>
                                    <button @click="setQuantity(100)" :class="{ active: quantity === 100 }">100</button>
                                </div>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>格式选项</label>
                            <div class="format-options">
                                <label class="checkbox-label">
                                    <input v-model="options.uppercase" type="checkbox" @change="updateFormat" />
                                    <span>大写</span>
                                </label>
                                <label class="checkbox-label">
                                    <input v-model="options.withHyphens" type="checkbox" @change="updateFormat" />
                                    <span>包含连字符</span>
                                </label>
                                <label class="checkbox-label">
                                    <input v-model="options.withBraces" type="checkbox" @change="updateFormat" />
                                    <span>包含大括号</span>
                                </label>
                            </div>
                        </div>
                        <div class="generate-actions">
                            <button class="generate-btn" @click="generateUuid">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                                生成UUID
                            </button>
                            <div class="copy-actions">
                                <button class="copy-all-btn" @click="copyAllUuids" :disabled="uuids.length === 0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                    复制全部
                                </button>
                                <button class="copy-json-btn" @click="copyAllAsJson" :disabled="uuids.length === 0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14,2 14,8 20,8" />
                                        <path d="M16 13H8" />
                                        <path d="M16 17H8" />
                                        <path d="M10 9H8" />
                                    </svg>
                                    复制JSON
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="uuid-results">
                        <div class="section-header">
                            <h3>生成结果</h3>
                            <div class="section-info">
                                <span class="count-info">共 {{ uuids.length }} 个UUID</span>
                                <button v-if="uuids.length > 0" class="export-btn" @click="exportUuids" title="导出为文件">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7,10 12,15 17,10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div v-if="uuids.length === 0" class="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            <p>点击"生成UUID"按钮开始生成</p>
                        </div>
                        <div v-else class="uuid-list">
                            <div v-for="(uuid, index) in uuids" :key="index" class="uuid-item">
                                <div class="uuid-index">{{ index + 1 }}</div>
                                <div class="uuid-value">{{ uuid }}</div>
                                <button class="copy-uuid-btn" @click="copyUuid(uuid)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- UUID验证器 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>UUID验证器</h3>
                    <div class="section-info">
                        <span class="info-text">验证UUID格式和版本信息</span>
                    </div>
                </div>
                <div class="uuid-validator">
                    <div class="validator-input">
                        <label>输入UUID</label>
                        <textarea v-model="validateInput" placeholder="请输入要验证的UUID..." class="validate-textarea"
                            @input="validateUuid"></textarea>
                    </div>
                    <div v-if="validationResult" class="validation-result">
                        <div class="validation-header">
                            <h4>验证结果</h4>
                            <div class="validation-status" :class="validationResult.isValid ? 'valid' : 'invalid'">
                                <svg v-if="validationResult.isValid" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                {{ validationResult.isValid ? '有效' : '无效' }}
                            </div>
                        </div>
                        <div class="validation-details">
                            <div class="detail-item">
                                <span class="detail-label">格式:</span>
                                <span class="detail-value">{{ validationResult.format }}</span>
                            </div>
                            <div v-if="validationResult.version" class="detail-item">
                                <span class="detail-label">版本:</span>
                                <span class="detail-value">{{ validationResult.version }}</span>
                            </div>
                            <div v-if="validationResult.variant" class="detail-item">
                                <span class="detail-label">变体:</span>
                                <span class="detail-value">{{ validationResult.variant }}</span>
                            </div>
                            <div v-if="validationResult.timestamp" class="detail-item">
                                <span class="detail-label">时间戳:</span>
                                <span class="detail-value">{{ validationResult.timestamp }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- UUID信息说明 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>UUID版本说明</h3>
                    <div class="section-info">
                        <span class="info-text">了解不同UUID版本的特点和用途</span>
                    </div>
                </div>
                <div class="uuid-info">
                    <div class="info-grid">
                        <div v-for="info in uuidVersionInfo" :key="info.version" class="info-card">
                            <div class="info-header">
                                <h4>{{ info.version }}</h4>
                                <span class="info-badge" :class="info.status">{{ info.statusText }}</span>
                            </div>
                            <div class="info-description">{{ info.description }}</div>
                            <div class="info-features">
                                <div class="feature-item">
                                    <span class="feature-label">唯一性:</span>
                                    <div class="feature-level" :class="info.uniqueness">
                                        <div class="feature-bar"></div>
                                        <span>{{ info.uniquenessText }}</span>
                                    </div>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-label">性能:</span>
                                    <div class="feature-level" :class="info.performance">
                                        <div class="feature-bar"></div>
                                        <span>{{ info.performanceText }}</span>
                                    </div>
                                </div>
                                <div class="feature-item">
                                    <span class="feature-label">用途:</span>
                                    <span class="feature-value">{{ info.usage }}</span>
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
const selectedVersion = ref<'v1' | 'v4' | 'v7'>('v4')
const quantity = ref(10)
const uuids = ref<string[]>([])
const validateInput = ref('')
const validationResult = ref<{
    isValid: boolean
    format: string
    version?: string
    variant?: string
    timestamp?: string
} | null>(null)

// 格式选项
const options = ref({
    uppercase: false,
    withHyphens: true,
    withBraces: false
})

// UUID版本信息
const uuidVersionInfo = [
    {
        version: 'UUID v1',
        description: '基于时间戳和MAC地址生成，保证时间顺序性，但可能泄露MAC地址信息。',
        status: 'legacy',
        statusText: '传统',
        uniqueness: 'high',
        uniquenessText: '高',
        performance: 'medium',
        performanceText: '中',
        usage: '需要时间顺序的场景'
    },
    {
        version: 'UUID v4',
        description: '基于随机数生成，最常用的版本，提供良好的唯一性和隐私保护。',
        status: 'recommended',
        statusText: '推荐',
        uniqueness: 'very-high',
        uniquenessText: '很高',
        performance: 'high',
        performanceText: '高',
        usage: '通用场景、数据库主键'
    },
    {
        version: 'UUID v7',
        description: '基于时间戳和随机数，结合了v1的时间顺序性和v4的随机性，是最新标准。',
        status: 'modern',
        statusText: '现代',
        uniqueness: 'very-high',
        uniquenessText: '很高',
        performance: 'high',
        performanceText: '高',
        usage: '现代应用、分布式系统'
    }
]

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 生成UUID v4
const generateUuidV4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

// 生成UUID v1
const generateUuidV1 = (): string => {
    const timestamp = Date.now()
    const timeHex = timestamp.toString(16).padStart(12, '0')
    const clockSeq = Math.floor(Math.random() * 0x4000)
    const node = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('')

    const timeLow = timeHex.slice(-8)
    const timeMid = timeHex.slice(-12, -8)
    const timeHigh = '1' + timeHex.slice(-15, -12).padStart(3, '0')
    const clockSeqHex = (clockSeq | 0x8000).toString(16)

    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeqHex}-${node}`
}

// 生成UUID v7
const generateUuidV7 = (): string => {
    const timestamp = Date.now()
    const timeHex = timestamp.toString(16).padStart(12, '0')
    const randomA = Math.floor(Math.random() * 0x1000).toString(16).padStart(3, '0')
    const randomB = Math.floor(Math.random() * 0x40000000000000).toString(16).padStart(14, '0')

    return `${timeHex.slice(0, 8)}-${timeHex.slice(8)}-7${randomA}-${(parseInt(randomB.slice(0, 1), 16) | 0x8).toString(16)}${randomB.slice(1, 4)}-${randomB.slice(4)}`
}

// 格式化UUID
const formatUuid = (uuid: string): string => {
    let formatted = uuid

    if (!options.value.withHyphens) {
        formatted = formatted.replace(/-/g, '')
    }

    if (options.value.uppercase) {
        formatted = formatted.toUpperCase()
    } else {
        formatted = formatted.toLowerCase()
    }

    if (options.value.withBraces) {
        formatted = `{${formatted}}`
    }

    return formatted
}

// 生成UUID
const generateUuid = () => {
    const newUuids: string[] = []

    for (let i = 0; i < quantity.value; i++) {
        let uuid: string

        switch (selectedVersion.value) {
            case 'v1':
                uuid = generateUuidV1()
                break
            case 'v7':
                uuid = generateUuidV7()
                break
            default:
                uuid = generateUuidV4()
        }

        newUuids.push(formatUuid(uuid))
    }

    uuids.value = newUuids
    showMessage(`已生成 ${quantity.value} 个 ${selectedVersion.value.toUpperCase()} UUID`, 'success')
}

// 设置数量
const setQuantity = (num: number) => {
    quantity.value = num
}

// 更新格式
const updateFormat = () => {
    if (uuids.value.length > 0) {
        // 重新格式化现有的UUID
        const rawUuids = uuids.value.map(uuid => {
            // 移除格式化，恢复标准格式
            let raw = uuid.replace(/[{}]/g, '')
            if (raw.length === 32) {
                // 添加连字符
                raw = `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`
            }
            return raw
        })

        uuids.value = rawUuids.map(uuid => formatUuid(uuid))
    }
}

// 复制单个UUID
const copyUuid = async (uuid: string) => {
    try {
        await navigator.clipboard.writeText(uuid)
        showMessage('UUID已复制', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 复制所有UUID为JSON格式
const copyAllAsJson = async () => {
    if (uuids.value.length === 0) return

    try {
        const jsonData = JSON.stringify(uuids.value, null, 2)
        await navigator.clipboard.writeText(jsonData)
        showMessage(`已复制 ${uuids.value.length} 个UUID为JSON格式`, 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 复制所有UUID
const copyAllUuids = async () => {
    if (uuids.value.length === 0) return

    try {
        const text = uuids.value.join('\n')
        await navigator.clipboard.writeText(text)
        showMessage(`已复制 ${uuids.value.length} 个UUID`, 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 导出UUID
const exportUuids = () => {
    if (uuids.value.length === 0) return

    const content = [
        `UUID生成结果`,
        `版本: ${selectedVersion.value.toUpperCase()}`,
        `数量: ${uuids.value.length}`,
        `生成时间: ${new Date().toLocaleString()}`,
        `格式选项: ${options.value.uppercase ? '大写' : '小写'}, ${options.value.withHyphens ? '包含连字符' : '无连字符'}, ${options.value.withBraces ? '包含大括号' : '无大括号'}`,
        '',
        ...uuids.value.map((uuid, index) => `${index + 1}. ${uuid}`)
    ].join('\n')

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `uuids-${selectedVersion.value}-${timestamp}.txt`
    a.click()
    URL.revokeObjectURL(url)

    showMessage('UUID列表已导出', 'success')
}

// 验证UUID
const validateUuid = () => {
    const input = validateInput.value.trim()
    if (!input) {
        validationResult.value = null
        return
    }

    // 移除可能的大括号和空格
    const cleanInput = input.replace(/[{}\s]/g, '')

    // UUID正则表达式
    const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[1-7][0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i
    const uuidWithoutHyphens = /^[0-9a-f]{32}$/i

    let isValid = false
    let format = '无效格式'
    let version: string | undefined
    let variant: string | undefined
    let timestamp: string | undefined

    if (uuidRegex.test(cleanInput) || uuidWithoutHyphens.test(cleanInput)) {
        isValid = true
        format = cleanInput.includes('-') ? '标准格式' : '紧凑格式'

        // 提取版本信息
        const versionChar = cleanInput.replace(/-/g, '')[12]
        switch (versionChar) {
            case '1':
                version = 'UUID v1 (时间戳)'
                break
            case '4':
                version = 'UUID v4 (随机)'
                break
            case '7':
                version = 'UUID v7 (时间戳+随机)'
                break
            default:
                version = `UUID v${versionChar} (其他版本)`
        }

        // 提取变体信息
        const variantChar = cleanInput.replace(/-/g, '')[16]
        if (variantChar) {
            const variantBits = parseInt(variantChar, 16)
            if ((variantBits & 0x8) === 0x8) {
                variant = 'RFC 4122'
            } else {
                variant = '其他变体'
            }
        }

        // 如果是v1或v7，尝试提取时间戳
        if (versionChar === '1' || versionChar === '7') {
            try {
                if (versionChar === '7') {
                    const timeHex = cleanInput.replace(/-/g, '').slice(0, 12)
                    const time = parseInt(timeHex, 16)
                    timestamp = new Date(time).toLocaleString()
                }
            } catch (error) {
                // 忽略时间戳解析错误
            }
        }
    }

    validationResult.value = {
        isValid,
        format,
        version,
        variant,
        timestamp
    }
}

// 清空所有
const clearAll = () => {
    uuids.value = []
    validateInput.value = ''
    validationResult.value = null
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

// 初始化生成一些UUID
generateUuid()
</script>

<style scoped>
.uuid-generator {
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
    gap: 1rem;
}

.count-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    padding: 0.25rem 0.75rem;
    border-radius: 0.375rem;
    border: 1px solid var(--border-color);
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* UUID生成器样式 */
.uuid-container {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2rem;
    align-items: start;
}

.uuid-controls {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    position: sticky;
    top: 0;
}

.uuid-controls .control-group:first-of-type {
    margin-top: 0;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.control-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.version-select {
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.version-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.quantity-controls {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.quantity-input {
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.quantity-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.quantity-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
}

.quantity-buttons button {
    padding: 0.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
}

.quantity-buttons button:hover {
    background: var(--bg-hover);
}

.quantity-buttons button.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.format-options {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
}

.checkbox-label input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: var(--primary-color);
}

.generate-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.copy-actions {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
}

.copy-actions .copy-all-btn,
.copy-actions .copy-json-btn {
    flex: 1;
}

.generate-btn,
.copy-all-btn,
.copy-json-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.generate-btn {
    background: var(--primary-color);
    color: white;
}

.generate-btn:hover {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.copy-all-btn,
.copy-json-btn {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.copy-all-btn:hover:not(:disabled) {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.copy-json-btn:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.copy-all-btn:disabled,
.copy-json-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.uuid-results {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.uuid-results .empty-state,
.uuid-results .uuid-list {
    margin-top: 0;
}



.export-btn {
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

.export-btn:hover {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    color: var(--text-secondary);
}

.empty-state svg {
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-state p {
    margin: 0;
    font-size: 0.875rem;
}

.uuid-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
}

.uuid-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    transition: all 0.2s ease;
}

.uuid-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px var(--primary-color-alpha);
}

.uuid-index {
    font-size: 0.75rem;
    color: var(--text-secondary);
    min-width: 2rem;
    text-align: center;
    background: var(--bg-secondary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
}

.uuid-value {
    flex: 1;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: var(--text-primary);
    word-break: break-all;
}

.copy-uuid-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.copy-uuid-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* UUID验证器样式 */
.uuid-validator {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.validator-input {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.validator-input label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.validate-textarea {
    height: 120px;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    resize: vertical;
    min-height: 80px;
}

.validate-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.validation-result {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.validation-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.validation-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.validation-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.validation-status.valid {
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.validation-status.invalid {
    background: var(--error-color-alpha);
    color: var(--error-color);
}

.validation-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.detail-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    min-width: 5rem;
}

.detail-value {
    flex: 1;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-family: 'Courier New', monospace;
}

/* UUID信息样式 */
.uuid-info {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
}

.info-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: all 0.2s ease;
}

.info-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
    transform: translateY(-2px);
}

.info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.info-header h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.info-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
}

.info-badge.legacy {
    background: var(--warning-color-alpha);
    color: var(--warning-color);
}

.info-badge.recommended {
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.info-badge.modern {
    background: var(--primary-color-alpha);
    color: var(--primary-color);
}

.info-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 1rem;
}

.info-features {
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
    min-width: 4rem;
}

.feature-level {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
}

.feature-bar {
    height: 0.25rem;
    border-radius: 0.125rem;
    flex: 1;
    max-width: 4rem;
}

.feature-level.high .feature-bar {
    background: var(--success-color);
}

.feature-level.very-high .feature-bar {
    background: var(--primary-color);
}

.feature-level.medium .feature-bar {
    background: var(--warning-color);
}

.feature-level span {
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
    .uuid-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .uuid-controls {
        position: static;
    }

    .info-grid {
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

    .quantity-buttons {
        grid-template-columns: repeat(2, 1fr);
    }

    .generate-actions {
        flex-direction: row;
        gap: 0.5rem;
    }

    .generate-btn,
    .copy-all-btn {
        flex: 1;
    }

    .export-menu {
        right: auto;
        left: 0;
        min-width: 120px;
    }
}

@media (max-width: 480px) {
    .generator-header {
        padding: 0.75rem 1rem;
    }

    .generator-title {
        font-size: 1.125rem;
    }

    .generator-content {
        padding: 0.75rem;
        gap: 1rem;
    }

    .generator-section {
        padding: 0.75rem;
    }

    .uuid-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .uuid-index {
        align-self: flex-start;
    }

    .copy-uuid-btn {
        align-self: flex-end;
    }
}
</style>