<template>
    <div class="date-calculator">
        <div class="calculator-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="calculator-title">日期计算器</h2>
            <div class="calculator-actions">
                <button class="action-btn" @click="clearAll" title="清空">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

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
                    <div class="date-input-group">
                        <label>开始日期</label>
                        <div class="date-input-wrapper">
                            <input 
                                v-model="startDate" 
                                type="date" 
                                @change="calculateInterval"
                                class="date-input"
                            />
                            <input 
                                v-model="startTime" 
                                type="time" 
                                step="1"
                                @change="calculateInterval"
                                class="time-input"
                            />
                        </div>
                    </div>
                    
                    <div class="date-input-group">
                        <label>结束日期</label>
                        <div class="date-input-wrapper">
                            <input 
                                v-model="endDate" 
                                type="date" 
                                @change="calculateInterval"
                                class="date-input"
                            />
                            <input 
                                v-model="endTime" 
                                type="time" 
                                step="1"
                                @change="calculateInterval"
                                class="time-input"
                            />
                        </div>
                    </div>
                    
                    <div class="quick-date-buttons">
                        <button class="quick-btn" @click="setToday('start')">今天</button>
                        <button class="quick-btn" @click="setNow('start')">现在</button>
                        <button class="quick-btn" @click="setToday('end')">今天</button>
                        <button class="quick-btn" @click="setNow('end')">现在</button>
                    </div>
                    
                    <div v-if="intervalResult" class="interval-result">
                        <div class="result-grid">
                            <div class="result-item">
                                <span class="result-label">总天数</span>
                                <span class="result-value">{{ intervalResult.totalDays }} 天</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">总小时</span>
                                <span class="result-value">{{ intervalResult.totalHours }} 小时</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">总分钟</span>
                                <span class="result-value">{{ intervalResult.totalMinutes }} 分钟</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">总秒数</span>
                                <span class="result-value">{{ intervalResult.totalSeconds }} 秒</span>
                            </div>
                        </div>
                        <div class="detailed-result">
                            <div class="result-item large">
                                <span class="result-label">详细间隔</span>
                                <span class="result-value">{{ intervalResult.detailed }}</span>
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
                            <input 
                                v-model="baseDate" 
                                type="date" 
                                @change="calculateArithmetic"
                                class="date-input"
                            />
                            <input 
                                v-model="baseTime" 
                                type="time" 
                                step="1"
                                @change="calculateArithmetic"
                                class="time-input"
                            />
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
                            <input 
                                v-model.number="amount" 
                                type="number" 
                                min="0"
                                @input="calculateArithmetic"
                                class="amount-input"
                                placeholder="0"
                            />
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
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                            <input 
                                v-model="specialDate" 
                                type="date" 
                                @change="calculateSpecialDates"
                                class="date-input"
                            />
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

        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'

defineEmits<{
    back: []
}>()

// 日期间隔计算
// 使用页面标题管理
usePageTitle('date-calculator')

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

const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 组件挂载时设置默认值
onMounted(() => {const now = new Date()
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
        showMessage(`计算失败: ${(error as Error).message}`, 'error')
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
        showMessage(`计算失败: ${(error as Error).message}`, 'error')
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
        showMessage(`计算失败: ${(error as Error).message}`, 'error')
    }
}

// 复制文本
const copyText = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        showMessage('已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
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
.date-calculator {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.calculator-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 14px;
}

.back-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.calculator-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.calculator-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    width: 36px;
    height: 36px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.action-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
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
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    margin-bottom: 24px;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: #fff;
    border-bottom: 1px solid #e9ecef;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.section-info {
    font-size: 12px;
    color: #666;
}

/* 日期间隔计算 */
.date-interval-container {
    padding: 24px;
}

.date-input-group {
    margin-bottom: 20px;
}

.date-input-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.date-input-wrapper {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.date-input,
.time-input {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    color: #333;
    font-size: 14px;
    transition: border-color 0.2s;
}

.date-input:focus,
.time-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.quick-date-buttons {
    display: flex;
    gap: 8px;
    margin: 16px 0;
    flex-wrap: wrap;
}

.quick-btn {
    padding: 6px 12px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    color: #333;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.quick-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
}

/* 结果显示 */
.interval-result,
.arithmetic-result,
.special-result {
    margin-top: 20px;
    padding: 20px;
    background: #fff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
}

.result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
}

.result-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    position: relative;
}

.result-item.large {
    grid-column: 1 / -1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.result-label {
    font-size: 12px;
    color: #666;
    font-weight: 500;
}

.result-value {
    font-size: 16px;
    color: #333;
    font-weight: 600;
    font-family: 'Courier New', monospace;
}

.detailed-result {
    margin-top: 16px;
}

.copy-btn {
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
    margin-left: 8px;
}

.copy-btn:hover {
    background: #f5f5f5;
    color: #333;
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
    color: #333;
}

.arithmetic-controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
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
    color: #333;
}

.operation-select,
.unit-select,
.special-type-select {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    color: #333;
    font-size: 14px;
    cursor: pointer;
}

.amount-input {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
    color: #333;
    font-size: 14px;
    transition: border-color 0.2s;
}

.amount-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.quick-arithmetic-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 8px;
    margin-bottom: 20px;
}

.result-details {
    display: flex;
    gap: 16px;
    margin-top: 12px;
    flex-wrap: wrap;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 13px;
    color: #666;
}

/* 特殊日期计算 */
.special-dates-container {
    padding: 24px;
}

.special-date-group {
    margin-bottom: 20px;
}

.special-date-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.birthday-info {
    margin-top: 16px;
}

.message-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    animation: slideUp 0.3s ease-out;
}

.message-toast.success {
    background: #28a745;
    color: white;
}

.message-toast.error {
    background: #dc3545;
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

@media (max-width: 768px) {
    .calculator-content {
        padding: 16px;
    }
    
    .date-interval-container,
    .date-arithmetic-container,
    .special-dates-container {
        padding: 16px;
    }
    
    .arithmetic-controls {
        grid-template-columns: 1fr;
        gap: 12px;
    }
    
    .result-grid {
        grid-template-columns: 1fr;
    }
    
    .quick-arithmetic-buttons {
        grid-template-columns: repeat(2, 1fr);
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