<template>
    <div class="date-calculator">
        <!-- 使用通用头部组件 -->
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="calculator-content">
            <!-- 日期间隔计算 -->
            <div class="calculation-section">
                <div class="section-header">
                    <h3>日期间隔计算</h3>
                    <div class="section-info">
                        <span class="info-text">计算两个日期之间的时间间隔</span>
                    </div>
                </div>
                <div class="date-interval-container">
                    <!-- 日期输入区域 - 使用卡片式布局 -->
                    <div class="input-cards">
                        <div class="input-card">
                            <div class="card-header">
                                <label>开始日期</label>
                                <div class="quick-actions">
                                    <button class="quick-btn" @click="setToday('start')">今天</button>
                                    <button class="quick-btn" @click="setNow('start')">现在</button>
                                </div>
                            </div>
                            <div class="date-time-inputs">
                                <input v-model="startDate" type="date" @change="calculateInterval" class="date-input" />
                                <input v-model="startTime" type="time" step="1" @change="calculateInterval"
                                    class="time-input" />
                            </div>
                        </div>

                        <div class="separator">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </div>

                        <div class="input-card">
                            <div class="card-header">
                                <label>结束日期</label>
                                <div class="quick-actions">
                                    <button class="quick-btn" @click="setToday('end')">今天</button>
                                    <button class="quick-btn" @click="setNow('end')">现在</button>
                                </div>
                            </div>
                            <div class="date-time-inputs">
                                <input v-model="endDate" type="date" @change="calculateInterval" class="date-input" />
                                <input v-model="endTime" type="time" step="1" @change="calculateInterval"
                                    class="time-input" />
                            </div>
                        </div>
                    </div>

                    <!-- 结果显示区域 -->
                    <div v-if="intervalResult" class="interval-result">
                        <div class="result-summary">
                            <div class="summary-item primary">
                                <span class="summary-label">详细间隔</span>
                                <span class="summary-value">{{ intervalResult.detailed }}</span>
                            </div>
                        </div>
                        <div class="result-grid compact">
                            <div class="result-item">
                                <span class="result-label">总天数</span>
                                <span class="result-value">{{ intervalResult.totalDays }}</span>
                                <span class="result-unit">天</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">总小时</span>
                                <span class="result-value">{{ intervalResult.totalHours }}</span>
                                <span class="result-unit">小时</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">总分钟</span>
                                <span class="result-value">{{ intervalResult.totalMinutes }}</span>
                                <span class="result-unit">分钟</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">总秒数</span>
                                <span class="result-value">{{ intervalResult.totalSeconds }}</span>
                                <span class="result-unit">秒</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 日期加减计算 -->
            <div class="calculation-section">
                <div class="section-header">
                    <h3>日期加减计算</h3>
                    <div class="section-info">
                        <span class="info-text">在指定日期基础上增加或减少时间</span>
                    </div>
                </div>
                <div class="date-arithmetic-container">
                    <div class="base-date-group">
                        <label>基准日期</label>
                        <div class="date-input-wrapper">
                            <input v-model="baseDate" type="date" @change="calculateArithmetic" class="date-input" />
                            <input v-model="baseTime" type="time" step="1" @change="calculateArithmetic"
                                class="time-input" />
                            <button class="quick-btn" @click="setNowToBase">现在</button>
                        </div>
                    </div>

                    <div class="arithmetic-controls">
                        <div class="operation-group">
                            <label>操作</label>
                            <select v-model="operation" @change="calculateArithmetic" class="operation-select">
                                <option value="add">增加 (+)</option>
                                <option value="subtract">减少 (-)</option>
                            </select>
                        </div>

                        <div class="amount-group">
                            <label>数量</label>
                            <input v-model.number="amount" type="number" min="0" @input="calculateArithmetic"
                                class="amount-input" placeholder="0" />
                        </div>

                        <div class="unit-group">
                            <label>单位</label>
                            <select v-model="unit" @change="calculateArithmetic" class="unit-select">
                                <option value="years">年</option>
                                <option value="months">月</option>
                                <option value="days">天</option>
                                <option value="hours">小时</option>
                                <option value="minutes">分钟</option>
                                <option value="seconds">秒</option>
                            </select>
                        </div>
                    </div>

                    <div class="quick-arithmetic-buttons">
                        <button class="quick-btn" @click="quickArithmetic(1, 'days')">+1天</button>
                        <button class="quick-btn" @click="quickArithmetic(-1, 'days')">-1天</button>
                        <button class="quick-btn" @click="quickArithmetic(7, 'days')">+1周</button>
                        <button class="quick-btn" @click="quickArithmetic(-7, 'days')">-1周</button>
                        <button class="quick-btn" @click="quickArithmetic(1, 'months')">+1月</button>
                        <button class="quick-btn" @click="quickArithmetic(-1, 'months')">-1月</button>
                        <button class="quick-btn" @click="quickArithmetic(1, 'years')">+1年</button>
                        <button class="quick-btn" @click="quickArithmetic(-1, 'years')">-1年</button>
                    </div>

                    <div v-if="arithmeticResult" class="arithmetic-result">
                        <div class="result-item large">
                            <span class="result-label">计算结果</span>
                            <span class="result-value">{{ arithmeticResult.formatted }}</span>
                            <button class="copy-btn" @click="copyText(arithmeticResult.formatted)" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="result-details">
                            <div class="detail-item">
                                <span>星期：{{ arithmeticResult.weekday }}</span>
                            </div>
                            <div class="detail-item">
                                <span>时间戳：{{ arithmeticResult.timestamp }}</span>
                                <button class="copy-btn" @click="copyText(arithmeticResult.timestamp)" title="复制">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
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

            <!-- 特殊日期计算 -->
            <div class="calculation-section">
                <div class="section-header">
                    <h3>特殊日期计算</h3>
                    <div class="section-info">
                        <span class="info-text">计算生日、纪念日等特殊日期</span>
                    </div>
                </div>
                <div class="special-dates-container">
                    <div class="special-date-group">
                        <label>特殊日期</label>
                        <div class="date-input-wrapper">
                            <input v-model="specialDate" type="date" @change="calculateSpecialDates"
                                class="date-input" />
                            <select v-model="specialType" @change="calculateSpecialDates" class="special-type-select">
                                <option value="birthday">生日</option>
                                <option value="anniversary">纪念日</option>
                                <option value="custom">自定义</option>
                            </select>
                        </div>
                    </div>

                    <div v-if="specialResult" class="special-result">
                        <div class="result-grid">
                            <div class="result-item">
                                <span class="result-label">已过天数</span>
                                <span class="result-value">{{ specialResult.daysPassed }} 天</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">已过年数</span>
                                <span class="result-value">{{ specialResult.yearsPassed }} 年</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">下次日期</span>
                                <span class="result-value">{{ specialResult.nextDate }}</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">距离天数</span>
                                <span class="result-value">{{ specialResult.daysUntilNext }} 天</span>
                            </div>
                        </div>
                        <div v-if="specialType === 'birthday'" class="birthday-info">
                            <div class="result-item large">
                                <span class="result-label">年龄信息</span>
                                <span class="result-value">{{ specialResult.ageInfo }}</span>
                            </div>
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
import { useClipboard } from '../composables/useClipboard'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('date-calculator')

// 获取卡片标题
const getCardTitle = (cardId: string): string => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === cardId)
        if (card) {
            return card.title
        }
    }
    return cardId
}

const pageTitle = getCardTitle('date-calculator')

// 使用剪贴板功能
const { copyToClipboard } = useClipboard()

// 使用通知系统
const { success: showSuccess, error: showError } = useNotification()

// 日期间隔计算
const startDate = ref('')
const startTime = ref('00:00:00')
const endDate = ref('')
const endTime = ref('00:00:00')
const intervalResult = ref<{
    totalDays: number
    totalHours: number
    totalMinutes: number
    totalSeconds: number
    detailed: string
} | null>(null)

// 日期加减计算
const baseDate = ref('')
const baseTime = ref('00:00:00')
const operation = ref('add')
const amount = ref(0)
const unit = ref('days')
const arithmeticResult = ref<{
    formatted: string
    weekday: string
    timestamp: string
} | null>(null)

// 特殊日期计算
const specialDate = ref('')
const specialType = ref('birthday')
const specialResult = ref<{
    daysPassed: number
    yearsPassed: number
    nextDate: string
    daysUntilNext: number
    ageInfo?: string
} | null>(null)

// 组件挂载时设置默认值
onMounted(() => {
    const now = new Date()
    const today = formatDate(now)
    const currentTime = formatTime(now)

    startDate.value = today
    endDate.value = today
    baseDate.value = today
    startTime.value = currentTime
    endTime.value = currentTime
    baseTime.value = currentTime
})

// 格式化日期
const formatDate = (date: Date): string => {
    const dateString = date.toISOString().split('T')[0]
    return dateString || ''
}

// 格式化时间
const formatTime = (date: Date): string => {
    const timeString = date.toTimeString().split(' ')[0]
    return timeString || '00:00:00'
}

// 格式化日期时间显示
const formatDateTime = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 获取星期几
const getWeekday = (date: Date): string => {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    return weekdays[date.getDay()] || '星期日'
}

// 设置今天日期
const setToday = (type: 'start' | 'end') => {
    const today = formatDate(new Date())
    if (type === 'start') {
        startDate.value = today
        startTime.value = '00:00:00'
    } else {
        endDate.value = today
        endTime.value = '23:59:59'
    }
    calculateInterval()
}

// 设置现在时间
const setNow = (type: 'start' | 'end') => {
    const now = new Date()
    const today = formatDate(now)
    const currentTime = formatTime(now)

    if (type === 'start') {
        startDate.value = today
        startTime.value = currentTime
    } else {
        endDate.value = today
        endTime.value = currentTime
    }
    calculateInterval()
}

// 设置基准日期为现在
const setNowToBase = () => {
    const now = new Date()
    baseDate.value = formatDate(now)
    baseTime.value = formatTime(now)
    calculateArithmetic()
}

// 计算日期间隔
const calculateInterval = () => {
    if (!startDate.value || !endDate.value) {
        intervalResult.value = null
        return
    }

    try {
        const start = new Date(`${startDate.value}T${startTime.value}`)
        const end = new Date(`${endDate.value}T${endTime.value}`)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('无效的日期时间')
        }

        const diffMs = Math.abs(end.getTime() - start.getTime())

        const totalSeconds = Math.floor(diffMs / 1000)
        const totalMinutes = Math.floor(totalSeconds / 60)
        const totalHours = Math.floor(totalMinutes / 60)
        const totalDays = Math.floor(totalHours / 24)

        // 计算详细间隔
        const years = Math.floor(totalDays / 365)
        const months = Math.floor((totalDays % 365) / 30)
        const days = Math.floor((totalDays % 365) % 30)
        const hours = totalHours % 24
        const minutes = totalMinutes % 60
        const seconds = totalSeconds % 60

        let detailed = ''
        if (years > 0) detailed += `${years}年 `
        if (months > 0) detailed += `${months}个月 `
        if (days > 0) detailed += `${days}天 `
        if (hours > 0) detailed += `${hours}小时 `
        if (minutes > 0) detailed += `${minutes}分钟 `
        if (seconds > 0) detailed += `${seconds}秒`

        if (!detailed) detailed = '0秒'

        intervalResult.value = {
            totalDays,
            totalHours,
            totalMinutes,
            totalSeconds,
            detailed: detailed.trim()
        }
    } catch (error) {
        intervalResult.value = null
        showError(`计算失败: ${(error as Error).message}`)
    }
}

// 计算日期加减
const calculateArithmetic = () => {
    if (!baseDate.value || amount.value === undefined) {
        arithmeticResult.value = null
        return
    }

    try {
        const base = new Date(`${baseDate.value}T${baseTime.value}`)

        if (isNaN(base.getTime())) {
            throw new Error('无效的基准日期时间')
        }

        let result = new Date(base)
        const operationAmount = operation.value === 'add' ? amount.value : -amount.value

        switch (unit.value) {
            case 'years':
                result.setFullYear(result.getFullYear() + operationAmount)
                break
            case 'months':
                result.setMonth(result.getMonth() + operationAmount)
                break
            case 'days':
                result.setDate(result.getDate() + operationAmount)
                break
            case 'hours':
                result.setHours(result.getHours() + operationAmount)
                break
            case 'minutes':
                result.setMinutes(result.getMinutes() + operationAmount)
                break
            case 'seconds':
                result.setSeconds(result.getSeconds() + operationAmount)
                break
        }

        arithmeticResult.value = {
            formatted: formatDateTime(result),
            weekday: getWeekday(result),
            timestamp: Math.floor(result.getTime() / 1000).toString()
        }
    } catch (error) {
        arithmeticResult.value = null
        showError(`计算失败: ${(error as Error).message}`)
    }
}

// 快速日期加减
const quickArithmetic = (quickAmount: number, quickUnit: string) => {
    amount.value = Math.abs(quickAmount)
    unit.value = quickUnit
    operation.value = quickAmount >= 0 ? 'add' : 'subtract'
    calculateArithmetic()
}

// 计算特殊日期
const calculateSpecialDates = () => {
    if (!specialDate.value) {
        specialResult.value = null
        return
    }

    try {
        const special = new Date(specialDate.value)
        const now = new Date()

        if (isNaN(special.getTime())) {
            throw new Error('无效的特殊日期')
        }

        // 计算已过天数
        const diffMs = now.getTime() - special.getTime()
        const daysPassed = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        // 计算已过年数
        const yearsPassed = Math.floor(daysPassed / 365.25)

        // 计算下次日期
        const nextYear = now.getFullYear() + (special.getMonth() < now.getMonth() ||
            (special.getMonth() === now.getMonth() && special.getDate() <= now.getDate()) ? 1 : 0)
        const nextDate = new Date(nextYear, special.getMonth(), special.getDate())

        // 计算距离下次的天数
        const daysUntilNext = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        let ageInfo = ''
        if (specialType.value === 'birthday') {
            const age = Math.floor((now.getTime() - special.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
            const totalDays = Math.floor((now.getTime() - special.getTime()) / (1000 * 60 * 60 * 24))
            const totalHours = Math.floor((now.getTime() - special.getTime()) / (1000 * 60 * 60))
            ageInfo = `${age}岁 (${totalDays}天, ${totalHours}小时)`
        }

        specialResult.value = {
            daysPassed: Math.max(0, daysPassed),
            yearsPassed: Math.max(0, yearsPassed),
            nextDate: formatDateTime(nextDate).split(' ')[0] || '',
            daysUntilNext: Math.max(0, daysUntilNext),
            ageInfo
        }
    } catch (error) {
        specialResult.value = null
        showError(`计算失败: ${(error as Error).message}`)
    }
}

// 复制文本
const copyText = async (text: string) => {
    const success = await copyToClipboard(text)
    if (success) {
        showSuccess('已复制到剪贴板')
    } else {
        showError('复制失败')
    }
}

// 清空所有内容
const clearAll = () => {
    const now = new Date()
    const today = formatDate(now)
    const currentTime = formatTime(now)

    startDate.value = today
    endDate.value = today
    baseDate.value = today
    specialDate.value = ''
    startTime.value = currentTime
    endTime.value = currentTime
    baseTime.value = currentTime
    amount.value = 0

    intervalResult.value = null
    arithmeticResult.value = null
    specialResult.value = null

    showSuccess('已清空所有内容')
}
</script>
<style scoped>
/* 保持原有的所有样式，只是移除了 calculator-header 部分 */
.date-calculator {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.calculator-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

/* 计算区域 */
.calculation-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    margin-bottom: 20px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    min-height: 48px;
    box-sizing: border-box;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
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

/* 日期间隔计算 */
.date-interval-container {
    padding: 20px;
}

/* 卡片式输入布局 */
.input-cards {
    display: flex;
    gap: 16px;
    align-items: stretch;
    margin-bottom: 20px;
}

.input-card {
    flex: 1;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 16px;
    transition: var(--transition);
}

.input-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.card-header label {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.quick-actions {
    display: flex;
    gap: 4px;
}

/* 输入框样式 */
.date-input,
.time-input {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
    height: 36px;
    box-sizing: border-box;
}

.date-input:focus,
.time-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

.date-input:hover,
.time-input:hover {
    border-color: var(--primary-color);
}

/* 快速操作按钮样式 */
.quick-btn {
    padding: 4px 8px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: var(--transition);
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quick-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* 数量输入框样式 */
.amount-input {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
    height: 36px;
    box-sizing: border-box;
    width: 100%;
}

.amount-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

.amount-input:hover {
    border-color: var(--primary-color);
}

/* 快速操作按钮组样式 */
.quick-operations {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 16px;
}

.quick-op-btn {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 12px;
    cursor: pointer;
    transition: var(--transition);
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
}

.quick-op-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.2);
}

.quick-op-btn.add {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border-color: #10b981;
}

.quick-op-btn.subtract {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    border-color: #ef4444;
}

.quick-op-btn.add:hover,
.quick-op-btn.subtract:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.date-time-inputs {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.separator {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    min-width: 40px;
}

/* 结果摘要 */
.result-summary {
    margin-bottom: 16px;
}

.summary-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    background: linear-gradient(135deg, var(--primary-color), #667eea);
    border-radius: var(--radius-md);
    color: white;
    text-align: center;
}

.summary-label {
    font-size: 12px;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.summary-value {
    font-size: 18px;
    font-weight: 700;
    font-family: var(--font-mono);
}

/* 紧凑型结果网格 */
.result-grid.compact {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
}

.result-grid.compact .result-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    text-align: center;
    transition: var(--transition);
}

.result-grid.compact .result-item:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.15);
}

.result-unit {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
}

/* 结果显示 */
.interval-result,
.arithmetic-result,
.special-result {
    margin-top: 16px;
    padding: 16px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
}

.result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-bottom: 12px;
}

.result-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    position: relative;
    transition: var(--transition);
}

.result-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.1);
}

.result-item.large {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
}

.result-label {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.result-value {
    font-size: 16px;
    color: var(--text-primary);
    font-weight: 600;
    font-family: var(--font-mono);
}

.detailed-result {
    margin-top: 12px;
}

.copy-btn {
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    transition: var(--transition);
    margin-left: 8px;
}

.copy-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

/* 日期加减计算 */
.date-arithmetic-container {
    padding: 24px;
}

.base-date-group {
    margin-bottom: 20px;
}

.base-date-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.date-input-wrapper {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.date-input-wrapper .date-input,
.date-input-wrapper .time-input {
    flex: 1;
    min-width: 140px;
}

.date-input-wrapper .quick-btn {
    flex-shrink: 0;
    padding: 8px 16px;
    height: 36px;
    font-size: 14px;
}

.arithmetic-controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

.operation-group,
.amount-group,
.unit-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.operation-group label,
.amount-group label,
.unit-group label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

/* 快速操作按钮组 - 改为更宽松的布局 */
.quick-arithmetic-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
}

.quick-arithmetic-buttons .quick-btn {
    padding: 10px 16px;
    height: 40px;
    font-size: 14px;
    font-weight: 500;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
}

.quick-arithmetic-buttons .quick-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
}

.operation-select,
.unit-select,
.special-type-select {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
    height: 36px;
    box-sizing: border-box;
    transition: var(--transition);
}

.operation-select:focus,
.unit-select:focus,
.special-type-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

.amount-input {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
    height: 36px;
    box-sizing: border-box;
}

.amount-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

.quick-arithmetic-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 6px;
    margin-bottom: 16px;
}

.result-details {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-size: 13px;
    color: var(--text-secondary);
}

/* 特殊日期计算 */
.special-dates-container {
    padding: 20px;
}

.special-date-group {
    margin-bottom: 16px;
}

.special-date-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.birthday-info {
    margin-top: 12px;
}

@media (max-width: 768px) {
    .calculator-content {
        padding: 16px;
    }

    .date-interval-container,
    .date-arithmetic-container,
    .special-dates-container {
        padding: 16px;
    }

    .input-cards {
        flex-direction: column;
        gap: 12px;
    }

    .separator {
        transform: rotate(90deg);
        min-height: 20px;
        min-width: auto;
    }

    .arithmetic-controls {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .result-grid {
        grid-template-columns: 1fr;
    }

    .result-grid.compact {
        grid-template-columns: repeat(2, 1fr);
    }

    .date-arithmetic-container {
        padding: 20px 16px;
    }

    .quick-arithmetic-buttons {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        padding: 12px;
    }

    .quick-arithmetic-buttons .quick-btn {
        padding: 12px 8px;
        font-size: 13px;
    }

    .date-input-wrapper {
        flex-direction: column;
        align-items: stretch;
    }

    .result-item.large {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .result-details {
        flex-direction: column;
    }
}
</style>