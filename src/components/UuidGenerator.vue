<template>
    <div class="uuid-generator">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <div class="formatter-actions">
                    <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
                    <HeaderActionButton icon="copy" tooltip="复制全部" @click="copyAllUuids"
                        :disabled="uuids.length === 0" />
                    <HeaderActionButton icon="format" tooltip="复制JSON" @click="copyAllAsJson"
                        :disabled="uuids.length === 0" />
                    <HeaderActionButton icon="download" tooltip="导出文件" @click="exportUuids"
                        :disabled="uuids.length === 0" />
                </div>
            </template>
        </PageHeader>

        <div class="generator-content">
            <!-- UUID生成器 -->
            <div class="generator-section">
                <div class="section-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <div class="header-text">
                            <h3>UUID生成器</h3>
                            <p>生成各种版本的UUID（通用唯一标识符）</p>
                        </div>
                    </div>
                </div>

                <div class="uuid-container">
                    <div class="uuid-controls">
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
                                    <button class="quantity-btn" @click="setQuantity(1)"
                                        :class="{ active: quantity === 1 }">1</button>
                                    <button class="quantity-btn" @click="setQuantity(10)"
                                        :class="{ active: quantity === 10 }">10</button>
                                    <button class="quantity-btn" @click="setQuantity(50)"
                                        :class="{ active: quantity === 50 }">50</button>
                                    <button class="quantity-btn" @click="setQuantity(100)"
                                        :class="{ active: quantity === 100 }">100</button>
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
                        </div>
                    </div>

                    <div class="uuid-results">
                        <div class="results-header">
                            <h4>生成结果</h4>
                            <span class="count-info">共 {{ uuids.length }} 个UUID</span>
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
                    <div class="header-content">
                        <div class="header-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="20,6 9,17 4,12" />
                            </svg>
                        </div>
                        <div class="header-text">
                            <h3>UUID验证器</h3>
                            <p>验证UUID格式和版本信息</p>
                        </div>
                    </div>
                </div>

                <div class="uuid-validator">
                    <div class="validator-input">
                        <label>输入UUID</label>
                        <input v-model="validateInput" placeholder="请输入要验证的UUID..." class="validate-input"
                            @input="validateUuid" />
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

            <!-- UUID版本说明 -->
            <div class="generator-section">
                <div class="section-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </div>
                        <div class="header-text">
                            <h3>UUID版本说明</h3>
                            <p>了解不同UUID版本的特点和用途</p>
                        </div>
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
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import ButtonGroup from './common/ButtonGroup.vue'
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
usePageTitle('uuid-generator')
const cardTitle = getCardTitle('uuid-generator')

// 使用公共通知系统
const { success: showSuccess, error: showError } = useNotification()

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
    showSuccess(`已生成 ${quantity.value} 个 ${selectedVersion.value.toUpperCase()} UUID`)
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
        showSuccess('UUID已复制')
    } catch (error) {
        showError('复制失败')
    }
}

// 复制所有UUID为JSON格式
const copyAllAsJson = async () => {
    if (uuids.value.length === 0) return

    try {
        const jsonData = JSON.stringify(uuids.value, null, 2)
        await navigator.clipboard.writeText(jsonData)
        showSuccess(`已复制 ${uuids.value.length} 个UUID为JSON格式`)
    } catch (error) {
        showError('复制失败')
    }
}

// 复制所有UUID
const copyAllUuids = async () => {
    if (uuids.value.length === 0) return

    try {
        const text = uuids.value.join('\n')
        await navigator.clipboard.writeText(text)
        showSuccess(`已复制 ${uuids.value.length} 个UUID`)
    } catch (error) {
        showError('复制失败')
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

    showSuccess('UUID列表已导出')
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
    showSuccess('已清空所有内容')
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

.formatter-actions {
    display: flex;
    gap: 0.5rem;
}

.generator-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    /* 隐藏滚动条但保持滚动功能 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.generator-content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.generator-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
}

.header-icon {
    width: 40px;
    height: 40px;
    background: var(--primary-color-alpha);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    flex-shrink: 0;
}

.header-text h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
}

.header-text p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-muted);
}

/* UUID生成器样式 */
.uuid-container {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 2rem;
    align-items: start;
}

.uuid-controls {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.uuid-results {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-self: start;
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
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: var(--transition);
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

.quantity-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
}

.quantity-btn {
    padding: 0.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.875rem;
}

.quantity-btn:hover {
    background: var(--bg-hover);
}

.quantity-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.quantity-input {
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: var(--transition);
}

.quantity-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.format-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
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

.generate-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.875rem;
    font-weight: 500;
    background: var(--primary-color);
    color: white;
}

.generate-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.results-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.results-header h4 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.count-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    color: var(--text-muted);
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
    max-height: 380px;
    overflow-y: auto;
    /* 隐藏滚动条但保持滚动功能 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.uuid-list::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.uuid-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.4375rem 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    transition: var(--transition);
}

.uuid-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px var(--primary-color-alpha);
}

.uuid-index {
    font-size: 0.75rem;
    color: var(--text-muted);
    min-width: 2rem;
    text-align: center;
    background: var(--bg-secondary);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
}

.uuid-value {
    flex: 1;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
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
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
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

.validate-input {
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    transition: var(--transition);
}

.validate-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.validation-result {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
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
    border-radius: var(--radius-md);
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
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* UUID信息样式 */
.uuid-info {
    margin-top: 0;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.info-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 1.25rem;
    transition: var(--transition);
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
    border-radius: var(--radius-sm);
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
    border-radius: var(--radius-sm);
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

/* 响应式设计 */
@media (max-width: 1024px) {
    .uuid-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
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

    .copy-actions {
        flex-direction: column;
    }

    .copy-all-btn,
    .copy-json-btn {
        flex: none;
    }
}

@media (max-width: 480px) {
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

    .format-options {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>