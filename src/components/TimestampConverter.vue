<template>
    <div class="timestamp-converter">
        <!-- 使用通用头部组件 -->
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="refresh" tooltip="获取当前时间戳" @click="getCurrentTimestamp" />
                <HeaderActionButton icon="clear" tooltip="清空" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 当前时间显示 -->
            <div class="current-time-section">
                <div class="section-header">
                    <h3>当前时间</h3>
                    <button class="refresh-btn" @click="refreshCurrentTime" title="刷新">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                        </svg>
                    </button>
                </div>
                <div class="current-time-display">
                    <div class="time-row">
                        <label>现在的当地时间为：</label>
                        <div class="time-value">
                            <input v-model="currentLocalTime" readonly class="time-input-readonly" />
                            <button class="copy-btn" @click="copyText(currentLocalTime)" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="timestamp-row">
                        <label>现在的Unix时间戳：</label>
                        <div class="timestamp-values">
                            <div class="timestamp-item">
                                <input v-model="currentTimestampSeconds" readonly class="timestamp-input-readonly" />
                                <span class="unit">秒</span>
                                <button class="copy-btn" @click="copyText(currentTimestampSeconds)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                            <div class="timestamp-item">
                                <input v-model="currentTimestampMillis" readonly class="timestamp-input-readonly" />
                                <span class="unit">毫秒</span>
                                <button class="copy-btn" @click="copyText(currentTimestampMillis)" title="复制">
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

            <!-- Unix时间戳 转 当地时间 -->
            <div class="conversion-section">
                <div class="section-header">
                    <h3>Unix时间戳 转 当地时间</h3>
                </div>
                <div class="conversion-row">
                    <div class="input-group">
                        <label>时间戳(eg:1388307215)</label>
                        <input v-model="timestampInput" type="text" placeholder="请输入时间戳" @input="convertTimestampToDate"
                            class="conversion-input" />
                    </div>
                    <div class="unit-select">
                        <select v-model="timestampUnit" @change="convertTimestampToDate" class="unit-dropdown">
                            <option value="seconds">秒(s)</option>
                            <option value="milliseconds">毫秒(ms)</option>
                        </select>
                    </div>
                    <button class="convert-btn" @click="convertTimestampToDate">转换</button>
                    <div class="result-display">
                        <div class="result-with-copy" v-if="timestampResult">
                            <input v-model="timestampResult.formatted" readonly class="result-input" />
                            <button class="copy-btn" @click="copyText(timestampResult.formatted)" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <input v-else value="请输入时间戳" readonly class="result-input placeholder" />
                    </div>
                </div>
            </div>

            <!-- 当地时间 转 Unix时间戳 -->
            <div class="conversion-section">
                <div class="section-header">
                    <h3>当地时间 转 Unix时间戳</h3>
                </div>
                <div class="conversion-row">
                    <div class="input-group">
                        <label>时间(eg:2015-04-01 10:01:01.620)</label>
                        <div class="datetime-input-wrapper">
                            <input v-model="dateTimeInput" type="text" placeholder="请输入日期时间"
                                @input="convertDateToTimestamp" class="conversion-input" />
                            <button class="datetime-picker-btn" @click="showDateTimePicker" title="选择日期时间"
                                type="button">
                                📅
                            </button>
                            <input ref="dateTimePickerRef" type="datetime-local" @change="handleDateTimePickerChange"
                                @blur="hideDateTimePicker" class="datetime-picker"
                                :class="{ 'picker-visible': showPicker }" />
                        </div>
                    </div>
                    <button class="convert-btn" @click="convertDateToTimestamp">转换</button>
                    <div class="unit-select">
                        <select v-model="outputUnit" @change="convertDateToTimestamp" class="unit-dropdown">
                            <option value="seconds">秒(s)</option>
                            <option value="milliseconds">毫秒(ms)</option>
                        </select>
                    </div>
                    <div class="result-display">
                        <div class="result-with-copy" v-if="dateResult">
                            <input v-model="dateResult.timestamp" readonly class="result-input" />
                            <button class="copy-btn" @click="copyText(dateResult.timestamp)" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <input v-else value="请输入日期时间" readonly class="result-input placeholder" />
                    </div>
                </div>
            </div>

            <!-- 快捷操作 -->
            <div class="quick-actions">
                <button class="quick-btn" @click="setCurrentDateTime">当前时间</button>
                <button class="quick-btn" @click="setTodayStart">今天开始</button>
                <button class="quick-btn" @click="setTodayEnd">今天结束</button>
                <button class="quick-btn" @click="setYesterdayStart">昨天开始</button>
                <button class="quick-btn" @click="setTomorrowStart">明天开始</button>
            </div>

            <!-- 世界时间 -->
            <div class="conversion-section world-time-section">
                <div class="section-header">
                    <h3>世界时间</h3>
                    <div class="section-info">
                        <span class="info-text">显示全球主要城市的当前时间</span>
                    </div>
                </div>
                <div class="world-time-container">
                    <div class="world-time-grid">
                        <div v-for="timezone in worldTimezones" :key="timezone.zone" class="world-time-item">
                            <div class="timezone-header">
                                <div class="city-info">
                                    <span class="city-name">{{ timezone.city }}</span>
                                    <span class="country-name">{{ timezone.country }}</span>
                                </div>
                                <span class="timezone-offset">{{ timezone.offset }}</span>
                            </div>
                            <div class="timezone-time">
                                <span class="time-display">{{ timezone.time }}</span>
                                <span class="date-display">{{ timezone.date }}</span>
                            </div>
                            <button class="copy-btn"
                                @click="copyText(`${timezone.city}: ${timezone.time} ${timezone.date}`)" title="复制时间">
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
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
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
usePageTitle('timestamp-convert')

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

const pageTitle = getCardTitle('timestamp-convert')

// 使用剪贴板功能
const { copyToClipboard } = useClipboard()

// 使用通知系统
const { success: showSuccess, error: showError } = useNotification()

const timestampInput = ref('')
const timestampUnit = ref('seconds')
const timestampResult = ref<{
    formatted: string
} | null>(null)

const dateTimeInput = ref('')
const outputUnit = ref('seconds')
const dateResult = ref<{
    timestamp: string
} | null>(null)

// 当前时间显示
const currentLocalTime = ref('')
const currentTimestampSeconds = ref('')
const currentTimestampMillis = ref('')
let timeInterval: number | null = null

// 日期时间选择器
const showPicker = ref(false)
const dateTimePickerRef = ref<HTMLInputElement | null>(null)

// 世界时间数据
const worldTimezones = ref<Array<{
    city: string
    country: string
    zone: string
    offset: string
    time: string
    date: string
}>>([])

// 世界时区配置
const timezoneConfig = [
    { city: '北京', country: '中国', zone: 'Asia/Shanghai' },
    { city: '东京', country: '日本', zone: 'Asia/Tokyo' },
    { city: '首尔', country: '韩国', zone: 'Asia/Seoul' },
    { city: '新加坡', country: '新加坡', zone: 'Asia/Singapore' },
    { city: '悉尼', country: '澳大利亚', zone: 'Australia/Sydney' },
    { city: '伦敦', country: '英国', zone: 'Europe/London' },
    { city: '巴黎', country: '法国', zone: 'Europe/Paris' },
    { city: '柏林', country: '德国', zone: 'Europe/Berlin' },
    { city: '莫斯科', country: '俄罗斯', zone: 'Europe/Moscow' },
    { city: '纽约', country: '美国', zone: 'America/New_York' },
    { city: '洛杉矶', country: '美国', zone: 'America/Los_Angeles' },
    { city: '芝加哥', country: '美国', zone: 'America/Chicago' },
    { city: '多伦多', country: '加拿大', zone: 'America/Toronto' },
    { city: '圣保罗', country: '巴西', zone: 'America/Sao_Paulo' },
    { city: '迪拜', country: '阿联酋', zone: 'Asia/Dubai' },
    { city: '孟买', country: '印度', zone: 'Asia/Kolkata' }
]

// 组件挂载时开始实时更新时间
onMounted(() => {
    updateCurrentTime()
    timeInterval = setInterval(updateCurrentTime, 1000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
    if (timeInterval) {
        clearInterval(timeInterval)
    }
})

// 格式化日期时间为短横线格式
const formatDateTime = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 更新当前时间
const updateCurrentTime = () => {
    const now = new Date()
    currentLocalTime.value = formatDateTime(now)
    currentTimestampSeconds.value = Math.floor(now.getTime() / 1000).toString()
    currentTimestampMillis.value = now.getTime().toString()

    // 同时更新世界时间
    updateWorldTimes()
}

// 更新世界时间
const updateWorldTimes = () => {
    const now = new Date()

    worldTimezones.value = timezoneConfig.map(config => {
        try {
            // 使用 Intl.DateTimeFormat 获取时区时间
            const timeFormatter = new Intl.DateTimeFormat('zh-CN', {
                timeZone: config.zone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })

            const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
                timeZone: config.zone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })

            // 获取时区偏移
            const offsetFormatter = new Intl.DateTimeFormat('en', {
                timeZone: config.zone,
                timeZoneName: 'longOffset'
            })

            const offsetParts = offsetFormatter.formatToParts(now)
            const offsetPart = offsetParts.find(part => part.type === 'timeZoneName')
            const offset = offsetPart ? offsetPart.value : 'UTC'

            return {
                city: config.city,
                country: config.country,
                zone: config.zone,
                offset: offset,
                time: timeFormatter.format(now),
                date: dateFormatter.format(now).replace(/\//g, '-')
            }
        } catch (error) {
            // 如果时区不支持，使用 UTC 时间
            return {
                city: config.city,
                country: config.country,
                zone: config.zone,
                offset: 'UTC',
                time: now.toISOString().slice(11, 19),
                date: now.toISOString().slice(0, 10)
            }
        }
    })
}

// 刷新当前时间
const refreshCurrentTime = () => {
    updateCurrentTime()
    showSuccess('时间已刷新')
}

// 时间戳转日期
const convertTimestampToDate = () => {
    if (!timestampInput.value.trim()) {
        timestampResult.value = null
        return
    }

    try {
        let timestamp = parseInt(timestampInput.value.trim())

        if (isNaN(timestamp)) {
            throw new Error('请输入有效的数字')
        }

        // 根据选择的单位处理时间戳
        if (timestampUnit.value === 'seconds') {
            timestamp = timestamp * 1000
        }

        const date = new Date(timestamp)

        if (isNaN(date.getTime())) {
            throw new Error('无效的时间戳')
        }

        timestampResult.value = {
            formatted: formatDateTime(date)
        }
    } catch (error) {
        timestampResult.value = null
        showError(`转换失败: ${(error as Error).message}`)
    }
}

// 日期转时间戳
const convertDateToTimestamp = () => {
    if (!dateTimeInput.value.trim()) {
        dateResult.value = null
        return
    }

    try {
        // 尝试解析多种日期格式
        let date: Date
        const input = dateTimeInput.value.trim()

        // 支持多种格式
        if (input.includes('T')) {
            date = new Date(input)
        } else if (input.includes('-') && input.includes(':')) {
            date = new Date(input.replace(' ', 'T'))
        } else if (input.includes('/')) {
            date = new Date(input)
        } else {
            date = new Date(input)
        }

        if (isNaN(date.getTime())) {
            throw new Error('无效的日期时间格式')
        }

        const timestamp = date.getTime()

        dateResult.value = {
            timestamp: outputUnit.value === 'seconds'
                ? Math.floor(timestamp / 1000).toString()
                : timestamp.toString()
        }
    } catch (error) {
        dateResult.value = null
        showError(`转换失败: ${(error as Error).message}`)
    }
}

// 获取当前时间戳
const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000)
    timestampInput.value = now.toString()
    convertTimestampToDate()
    showSuccess('已获取当前时间戳')
}

// 设置当前日期时间
const setCurrentDateTime = () => {
    const now = new Date()
    dateTimeInput.value = formatDateTime(now)

    convertDateToTimestamp()
    showSuccess('已设置当前日期时间')
}

// 设置今天开始时间
const setTodayStart = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dateTimeInput.value = formatDateTime(today)

    convertDateToTimestamp()
    showSuccess('已设置今天开始时间')
}

// 设置今天结束时间
const setTodayEnd = () => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    dateTimeInput.value = formatDateTime(today)

    convertDateToTimestamp()
    showSuccess('已设置今天结束时间')
}

// 设置昨天开始时间
const setYesterdayStart = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    dateTimeInput.value = formatDateTime(yesterday)

    convertDateToTimestamp()
    showSuccess('已设置昨天开始时间')
}

// 设置明天开始时间
const setTomorrowStart = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    dateTimeInput.value = formatDateTime(tomorrow)

    convertDateToTimestamp()
    showSuccess('已设置明天开始时间')
}

// 显示日期时间选择器
const showDateTimePicker = () => {
    showPicker.value = true
    // 设置当前值到选择器
    if (dateTimeInput.value) {
        try {
            const date = new Date(dateTimeInput.value.replace(' ', 'T'))
            if (!isNaN(date.getTime()) && dateTimePickerRef.value) {
                // 转换为 datetime-local 格式
                const year = date.getFullYear()
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                const hours = String(date.getHours()).padStart(2, '0')
                const minutes = String(date.getMinutes()).padStart(2, '0')
                dateTimePickerRef.value.value = `${year}-${month}-${day}T${hours}:${minutes}`
            }
        } catch (error) {
            // 忽略解析错误
        }
    }

    // 聚焦到选择器
    setTimeout(() => {
        if (dateTimePickerRef.value) {
            dateTimePickerRef.value.focus()
            dateTimePickerRef.value.showPicker?.()
        }
    }, 100)
}

// 隐藏日期时间选择器
const hideDateTimePicker = () => {
    setTimeout(() => {
        showPicker.value = false
    }, 200)
}

// 处理日期时间选择器变化
const handleDateTimePickerChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.value) {
        // datetime-local 格式: 2015-04-01T10:01:01
        const date = new Date(target.value)
        dateTimeInput.value = formatDateTime(date)
        convertDateToTimestamp()
        showSuccess('已选择日期时间')
    }
    hideDateTimePicker()
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
    timestampInput.value = ''
    timestampResult.value = null
    dateTimeInput.value = ''
    dateResult.value = null
    showSuccess('已清空所有内容')
}
</script>
<style scoped>
/* 保持原有的所有样式，只是移除了 converter-header 部分 */
.timestamp-converter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.converter-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}

/* 当前时间显示区域 */
.current-time-section {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    min-height: 48px;
    box-sizing: border-box;
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

.refresh-btn {
    width: 32px;
    height: 32px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.refresh-btn:hover {
    background: #f5f5f5;
    color: #333;
}

.current-time-display {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.time-row,
.timestamp-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.time-row label,
.timestamp-row label {
    min-width: 140px;
    font-size: 14px;
    color: #333;
    margin: 0;
}

.time-value {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
}

.timestamp-values {
    display: flex;
    gap: 20px;
    flex: 1;
}

.timestamp-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.time-input-readonly,
.timestamp-input-readonly {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    color: #333;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    min-width: 160px;
}

.unit {
    font-size: 12px;
    color: #666;
    min-width: 24px;
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
}

.copy-btn:hover {
    background: #f5f5f5;
    color: #333;
}

/* 转换区域 */
.conversion-section {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
}

.conversion-section .section-header {
    background: #fff;
    border-bottom: 1px solid #e9ecef;
    padding: 12px 20px;
    margin: 0;
}

.conversion-section .section-header h3 {
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.conversion-row {
    padding: 20px;
    display: grid;
    grid-template-columns: 1fr auto auto 1fr;
    gap: 12px;
    align-items: end;
    min-height: 70px;
}

.input-group {
    display: flex;
    flex-direction: column;
}

.input-group label {
    margin-bottom: 6px;
    font-size: 12px;
    color: #666;
    white-space: nowrap;
}

.datetime-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.conversion-input {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    color: #333;
    font-size: 14px;
    transition: border-color 0.2s;
    height: 40px;
    box-sizing: border-box;
    flex: 1;
}

.conversion-input:focus {
    outline: none;
    border-color: #007bff;
}

.datetime-picker-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
    z-index: 3;
}

.datetime-picker-btn:hover {
    background: rgba(0, 123, 255, 0.1);
}

.datetime-picker {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    opacity: 0;
    pointer-events: none;
    z-index: 1;
}

.datetime-picker.picker-visible {
    opacity: 1;
    pointer-events: auto;
    width: 200px;
    height: 40px;
    right: 40px;
    background: white;
    border: 1px solid #007bff;
    border-radius: 4px;
    padding: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.unit-select {
    display: flex;
    align-items: end;
}

.unit-dropdown {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    color: #333;
    font-size: 14px;
    cursor: pointer;
    min-width: 80px;
    height: 40px;
    box-sizing: border-box;
}

.convert-btn {
    padding: 10px 20px;
    background: #007bff;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    height: 40px;
    box-sizing: border-box;
    align-self: end;
}

.convert-btn:hover {
    background: #0056b3;
}

.result-display {
    display: flex;
    flex-direction: column;
}

.result-with-copy {
    display: flex;
    align-items: center;
    gap: 8px;
}

.result-with-copy .result-input {
    flex: 1;
}

.result-input {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f8f9fa;
    color: #333;
    font-family: 'Courier New', monospace;
    font-size: 13px;
    height: 40px;
    box-sizing: border-box;
}

.result-input.placeholder {
    color: #999;
    font-style: italic;
    font-family: inherit;
}

/* 快捷操作 */
.quick-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    padding: 16px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    margin-bottom: 20px;
}

.quick-btn {
    padding: 6px 12px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #333;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
}

.quick-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
}

/* 世界时间 */
.world-time-section {
    margin-top: 8px;
}

.world-time-container {
    padding: 24px;
    background: #f8f9fa;
}

.world-time-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    align-items: start;
}

.world-time-item {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 18px;
    position: relative;
    transition: all 0.2s;
    min-height: 130px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}

.world-time-item:hover {
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.timezone-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    padding-right: 32px;
    /* 为复制按钮留出空间 */
}

.city-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.city-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.country-name {
    font-size: 12px;
    color: #666;
}

.timezone-offset {
    font-size: 11px;
    color: #999;
    background: #f8f9fa;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    border: 1px solid #e9ecef;
    white-space: nowrap;
    max-width: 80px;
    text-align: center;
}

.timezone-time {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
}

.time-display {
    font-size: 26px;
    font-weight: 700;
    color: #007bff;
    font-family: 'Courier New', monospace;
    line-height: 1.2;
}

.date-display {
    font-size: 14px;
    color: #666;
    font-family: 'Courier New', monospace;
    line-height: 1.2;
}

.world-time-item .copy-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 28px;
    height: 28px;
    opacity: 0;
    transition: all 0.2s;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.world-time-item:hover .copy-btn {
    opacity: 1;
    transform: scale(1.05);
}

.world-time-item .copy-btn:hover {
    background: #f0f8ff;
    border-color: #007bff;
    box-shadow: 0 2px 6px rgba(0, 123, 255, 0.2);
}

@media (max-width: 1200px) {
    .world-time-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
}

@media (max-width: 768px) {
    .world-time-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .world-time-item {
        min-height: 100px;
    }

    .conversion-row {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .unit-select {
        justify-self: start;
    }

    .convert-btn {
        justify-self: start;
        width: fit-content;
    }

    .timestamp-values {
        flex-direction: column;
        gap: 12px;
    }

    .quick-actions {
        justify-content: flex-start;
    }

    .converter-content {
        padding: 16px;
    }
}
</style>