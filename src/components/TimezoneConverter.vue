<template>
    <div class="timezone-converter">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 世界时钟 -->
            <div class="world-clock-section">
                <div class="section-header">
                    <div class="section-title">
                        <h3>🌍 世界时钟</h3>
                        <span class="section-subtitle">实时显示全球主要城市时间，点击卡片可复制时间信息</span>
                    </div>
                </div>
                <div class="world-clock-grid">
                    <div v-for="timezone in mainTimezones" :key="timezone.zone" class="clock-card"
                        @click="copyTimeInfo(timezone)">
                        <div class="clock-header">
                            <span class="city-name">{{ timezone.name }}</span>
                            <span class="timezone-code">{{ getCurrentUTCOffset(timezone.zone) }}</span>
                        </div>
                        <div class="time-display">
                            <div class="time-value">{{ getCurrentTime(timezone.zone) }}</div>
                            <div class="date-value">{{ getCurrentDate(timezone.zone) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 快速转换 -->
            <div class="quick-convert-section">
                <div class="section-header">
                    <div class="section-title">
                        <h3>⚡ 快速转换</h3>
                        <span class="section-subtitle">在不同时区之间快速转换时间</span>
                    </div>
                </div>
                <div class="quick-convert-container">
                    <div class="convert-card">
                        <div class="convert-inputs">
                            <div class="timezone-selector">
                                <label>从</label>
                                <div class="timezone-input-group">
                                    <select v-model="sourceTimezone" class="timezone-select">
                                        <option v-for="tz in allTimezones" :key="tz.zone" :value="tz.zone">
                                            {{ tz.name }} ({{ tz.code }})
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="convert-arrow">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </div>

                            <div class="timezone-selector">
                                <label>到</label>
                                <div class="timezone-input-group">
                                    <select v-model="targetTimezone" class="timezone-select">
                                        <option v-for="tz in allTimezones" :key="tz.zone" :value="tz.zone">
                                            {{ tz.name }} ({{ tz.code }})
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="datetime-inputs">
                            <div class="datetime-group">
                                <div class="input-wrapper">
                                    <label>日期</label>
                                    <input v-model="convertDate" type="date" class="date-input" />
                                </div>
                                <div class="input-wrapper">
                                    <label>时间</label>
                                    <input v-model="convertTime" type="time" step="1" class="time-input" />
                                </div>
                            </div>
                            <div class="convert-actions">
                                <button class="now-btn" @click="setCurrentTime">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12,6 12,12 16,14" />
                                    </svg>
                                    现在
                                </button>
                                <button class="convert-btn" @click="convertTimezone">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M7 16.5L12 12l5 4.5" />
                                        <path d="M7 7.5L12 12l5-4.5" />
                                    </svg>
                                    转换
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="conversionResult" class="conversion-result">
                        <div class="result-header">
                            <h4>转换结果</h4>
                            <button class="copy-btn" @click="copyResult" title="复制结果">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="result-items">
                            <div class="result-item source">
                                <div class="result-label">源时间</div>
                                <div class="result-value">{{ conversionResult.source }}</div>
                            </div>
                            <div class="result-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </svg>
                            </div>
                            <div class="result-item target">
                                <div class="result-label">目标时间</div>
                                <div class="result-value">{{ conversionResult.target }}</div>
                            </div>
                        </div>
                        <div class="time-difference">
                            <span class="diff-label">时差:</span>
                            <span class="diff-value">{{ conversionResult.difference }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 会议时间规划 -->
            <div class="meeting-planner-section">
                <div class="section-header">
                    <div class="section-title">
                        <h3>📅 会议时间规划</h3>
                        <span class="section-subtitle">为跨时区会议找到最佳时间</span>
                    </div>
                </div>
                <div class="meeting-planner-container">
                    <div class="meeting-setup">
                        <div class="meeting-basic-info">
                            <div class="meeting-datetime">
                                <div class="input-wrapper">
                                    <label>会议日期</label>
                                    <input v-model="meetingDate" type="date" class="date-input" />
                                </div>
                                <div class="input-wrapper">
                                    <label>会议时间</label>
                                    <input v-model="meetingTime" type="time" step="1" class="time-input" />
                                </div>
                                <div class="input-wrapper">
                                    <label>主办方时区</label>
                                    <select v-model="hostTimezone" class="timezone-select">
                                        <option v-for="tz in allTimezones" :key="tz.zone" :value="tz.zone">
                                            {{ tz.name }} ({{ tz.code }})
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="participants-section">
                            <div class="participants-header">
                                <label>参会者时区</label>
                                <button class="add-participant-btn" @click="addParticipant">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    添加参会者
                                </button>
                            </div>
                            <div class="participants-list">
                                <div v-for="(participant, index) in participants" :key="index" class="participant-item">
                                    <input v-model="participant.name" type="text" placeholder="参会者姓名"
                                        class="participant-name" />
                                    <select v-model="participant.timezone" class="timezone-select">
                                        <option v-for="tz in allTimezones" :key="tz.zone" :value="tz.zone">
                                            {{ tz.name }} ({{ tz.code }})
                                        </option>
                                    </select>
                                    <button class="remove-participant-btn" @click="removeParticipant(index)">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button class="plan-meeting-btn" @click="planMeeting">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            规划会议时间
                        </button>
                    </div>

                    <div v-if="meetingPlan.length > 0" class="meeting-plan">
                        <div class="plan-header">
                            <h4>会议时间安排</h4>
                            <button class="copy-plan-btn" @click="copyMeetingPlan" title="复制会议安排">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="plan-content">
                            <div v-for="item in meetingPlan" :key="item.name" class="plan-item" :class="item.status">
                                <div class="plan-participant">
                                    <div class="participant-info">
                                        <span class="participant-name">{{ item.name }}</span>
                                        <span class="participant-timezone">{{ item.timezoneName }}</span>
                                    </div>
                                    <div class="participant-status">
                                        <span class="status-badge" :class="item.status">{{ item.statusText }}</span>
                                    </div>
                                </div>
                                <div class="plan-time">
                                    <div class="plan-datetime">{{ item.localTime }}</div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useClipboard } from '../composables/useClipboard'
import { useNotification } from '../composables/useNotification'

defineEmits<{
    back: []
}>()

// 使用 composables
usePageTitle('timezone-convert')
const { copyToClipboard } = useClipboard()
const { success: showSuccess, error: showError } = useNotification()

// 获取页面标题
const pageTitle = '时区转换'
// 时区数据 - 按时间早晚固定排序（UTC偏移从大到小）
const mainTimezones = [
    { name: '奥克兰', code: 'UTC+12', zone: 'Pacific/Auckland' },
    { name: '悉尼', code: 'UTC+10', zone: 'Australia/Sydney' },
    { name: '东京', code: 'UTC+9', zone: 'Asia/Tokyo' },
    { name: '首尔', code: 'UTC+9', zone: 'Asia/Seoul' },
    { name: '北京', code: 'UTC+8', zone: 'Asia/Shanghai' },
    { name: '新加坡', code: 'UTC+8', zone: 'Asia/Singapore' },
    { name: '曼谷', code: 'UTC+7', zone: 'Asia/Bangkok' },
    { name: '孟买', code: 'UTC+5:30', zone: 'Asia/Kolkata' },
    { name: '迪拜', code: 'UTC+4', zone: 'Asia/Dubai' },
    { name: '莫斯科', code: 'UTC+3', zone: 'Europe/Moscow' },
    { name: '巴黎', code: 'UTC+1', zone: 'Europe/Paris' },
    { name: '伦敦', code: 'UTC+0', zone: 'Europe/London' },
    { name: '圣保罗', code: 'UTC-3', zone: 'America/Sao_Paulo' },
    { name: '纽约', code: 'UTC-5', zone: 'America/New_York' },
    { name: '芝加哥', code: 'UTC-6', zone: 'America/Chicago' },
    { name: '洛杉矶', code: 'UTC-8', zone: 'America/Los_Angeles' }
]

const allTimezones = [
    // 亚洲
    { name: '北京', code: 'CST', zone: 'Asia/Shanghai' },
    { name: '东京', code: 'JST', zone: 'Asia/Tokyo' },
    { name: '首尔', code: 'KST', zone: 'Asia/Seoul' },
    { name: '新加坡', code: 'SGT', zone: 'Asia/Singapore' },
    { name: '香港', code: 'HKT', zone: 'Asia/Hong_Kong' },
    { name: '台北', code: 'CST', zone: 'Asia/Taipei' },
    { name: '曼谷', code: 'ICT', zone: 'Asia/Bangkok' },
    { name: '雅加达', code: 'WIB', zone: 'Asia/Jakarta' },
    { name: '孟买', code: 'IST', zone: 'Asia/Kolkata' },
    { name: '迪拜', code: 'GST', zone: 'Asia/Dubai' },

    // 欧洲
    { name: '伦敦', code: 'GMT/BST', zone: 'Europe/London' },
    { name: '巴黎', code: 'CET/CEST', zone: 'Europe/Paris' },
    { name: '柏林', code: 'CET/CEST', zone: 'Europe/Berlin' },
    { name: '罗马', code: 'CET/CEST', zone: 'Europe/Rome' },
    { name: '马德里', code: 'CET/CEST', zone: 'Europe/Madrid' },
    { name: '阿姆斯特丹', code: 'CET/CEST', zone: 'Europe/Amsterdam' },
    { name: '莫斯科', code: 'MSK', zone: 'Europe/Moscow' },

    // 北美
    { name: '纽约', code: 'EST/EDT', zone: 'America/New_York' },
    { name: '洛杉矶', code: 'PST/PDT', zone: 'America/Los_Angeles' },
    { name: '芝加哥', code: 'CST/CDT', zone: 'America/Chicago' },
    { name: '丹佛', code: 'MST/MDT', zone: 'America/Denver' },
    { name: '多伦多', code: 'EST/EDT', zone: 'America/Toronto' },
    { name: '温哥华', code: 'PST/PDT', zone: 'America/Vancouver' },

    // 大洋洲
    { name: '悉尼', code: 'AEST/AEDT', zone: 'Australia/Sydney' },
    { name: '墨尔本', code: 'AEST/AEDT', zone: 'Australia/Melbourne' },
    { name: '奥克兰', code: 'NZST/NZDT', zone: 'Pacific/Auckland' },

    // 南美
    { name: '圣保罗', code: 'BRT/BRST', zone: 'America/Sao_Paulo' },
    { name: '布宜诺斯艾利斯', code: 'ART', zone: 'America/Argentina/Buenos_Aires' },

    // 非洲
    { name: '开罗', code: 'EET/EEST', zone: 'Africa/Cairo' },
    { name: '约翰内斯堡', code: 'SAST', zone: 'Africa/Johannesburg' }
]

// 转换相关状态
const sourceTimezone = ref('Asia/Shanghai')
const targetTimezone = ref('America/New_York')
const convertDate = ref('')
const convertTime = ref('')
const conversionResult = ref<{
    source: string
    target: string
    difference: string
} | null>(null)

// 会议规划相关状态
const meetingDate = ref('')
const meetingTime = ref('')
const hostTimezone = ref('Asia/Shanghai')
const participants = ref<Array<{ name: string; timezone: string }>>([])
const meetingPlan = ref<Array<{
    name: string
    timezoneName: string
    localTime: string
    status: string
    statusText: string
}>>([])

// 当前时间更新定时器
let timeUpdateInterval: NodeJS.Timeout | null = null

// 强制更新时间显示的响应式变量
const timeUpdateTrigger = ref(0)

// 组件挂载时初始化
onMounted(() => {
    const now = new Date()
    convertDate.value = now.toISOString().split('T')[0] || ''
    convertTime.value = (now.toTimeString().split(' ')[0] || '12:00:00').substring(0, 8)
    meetingDate.value = now.toISOString().split('T')[0] || ''
    meetingTime.value = '14:00:00'

    // 添加默认参会者
    participants.value = [
        { name: '参会者1', timezone: 'America/New_York' },
        { name: '参会者2', timezone: 'Europe/London' }
    ]

    // 开始更新当前时间
    startTimeUpdate()
})

// 组件卸载时清理定时器
onUnmounted(() => {
    if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval)
    }
})

// 开始时间更新
const startTimeUpdate = () => {
    if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval)
    }

    // 每秒更新时间显示
    timeUpdateInterval = setInterval(() => {
        timeUpdateTrigger.value++
    }, 1000)
}

// 获取指定时区的当前UTC偏移
const getCurrentUTCOffset = (timezone: string): string => {
    try {
        const now = new Date()
        const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
        const target = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
        const offsetMinutes = (target.getTime() - utc.getTime()) / (1000 * 60)
        const offsetHours = offsetMinutes / 60

        if (offsetMinutes === 0) return 'UTC+0'

        const sign = offsetHours >= 0 ? '+' : ''
        if (offsetMinutes % 60 === 0) {
            return `UTC${sign}${Math.floor(offsetHours)}`
        } else {
            const hours = Math.floor(Math.abs(offsetHours))
            const minutes = Math.abs(offsetMinutes) % 60
            return `UTC${sign}${offsetHours < 0 ? '-' : ''}${hours}:${minutes.toString().padStart(2, '0')}`
        }
    } catch (error) {
        return 'UTC'
    }
}

// 获取指定时区的当前时间
const getCurrentTime = (timezone: string): string => {
    // 使用timeUpdateTrigger来触发重新计算
    timeUpdateTrigger.value
    try {
        const now = new Date()
        return now.toLocaleTimeString('zh-CN', {
            timeZone: timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    } catch (error) {
        return '--:--:--'
    }
}

// 获取指定时区的当前日期
const getCurrentDate = (timezone: string): string => {
    // 使用timeUpdateTrigger来触发重新计算
    timeUpdateTrigger.value
    try {
        const now = new Date()
        return now.toLocaleDateString('zh-CN', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        })
    } catch (error) {
        return '----/--/--'
    }
}

// 设置当前时间
const setCurrentTime = () => {
    const now = new Date()
    convertDate.value = now.toISOString().split('T')[0] || ''
    convertTime.value = (now.toTimeString().split(' ')[0] || '12:00:00').substring(0, 8)
    showSuccess('已设置为当前时间')
}

// 时区转换
const convertTimezone = () => {
    if (!convertDate.value || !convertTime.value) {
        showError('请输入完整的日期和时间')
        return
    }

    try {
        // 创建源时区的日期时间
        const sourceDateTime = new Date(`${convertDate.value}T${convertTime.value}`)

        // 获取源时区名称
        const sourceTimezoneInfo = allTimezones.find(tz => tz.zone === sourceTimezone.value)
        const targetTimezoneInfo = allTimezones.find(tz => tz.zone === targetTimezone.value)

        // 格式化源时间
        const sourceFormatted = sourceDateTime.toLocaleString('zh-CN', {
            timeZone: sourceTimezone.value,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })

        // 格式化目标时间
        const targetFormatted = sourceDateTime.toLocaleString('zh-CN', {
            timeZone: targetTimezone.value,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })

        // 计算时差
        const sourceOffset = getTimezoneOffset(sourceTimezone.value)
        const targetOffset = getTimezoneOffset(targetTimezone.value)
        const diffHours = (targetOffset - sourceOffset) / 60
        const diffText = diffHours >= 0 ? `+${diffHours}小时` : `${diffHours}小时`

        conversionResult.value = {
            source: `${sourceFormatted} (${sourceTimezoneInfo?.name})`,
            target: `${targetFormatted} (${targetTimezoneInfo?.name})`,
            difference: diffText
        }

        showSuccess('时区转换完成')
    } catch (error) {
        showError('转换失败，请检查输入')
    }
}

// 获取时区偏移量（分钟）
const getTimezoneOffset = (timezone: string): number => {
    try {
        return getTimezoneOffsetMinutes(timezone)
    } catch (error) {
        return 0
    }
}

// 获取时区偏移分钟数的辅助函数
const getTimezoneOffsetMinutes = (timezone: string): number => {
    const now = new Date()
    const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
    const target = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    return (target.getTime() - utc.getTime()) / (1000 * 60)
}

// 复制时间信息
const copyTimeInfo = async (timezone: any) => {
    const time = getCurrentTime(timezone.zone)
    const date = getCurrentDate(timezone.zone)
    const text = `${timezone.name} (${timezone.code}): ${date} ${time}`

    const success = await copyToClipboard(text)
    if (success) {
        showSuccess(`已复制 ${timezone.name} 时间`)
    } else {
        showError('复制失败')
    }
}

const copyResult = async () => {
    if (!conversionResult.value) return

    const text = `时区转换结果：
源时间: ${conversionResult.value.source}
目标时间: ${conversionResult.value.target}
时差: ${conversionResult.value.difference}`

    const success = await copyToClipboard(text)
    if (success) {
        showSuccess('转换结果已复制到剪贴板')
    } else {
        showError('复制失败')
    }
}

// 添加参会者
const addParticipant = () => {
    participants.value.push({
        name: `参会者${participants.value.length + 1}`,
        timezone: 'Asia/Shanghai'
    })
}

// 移除参会者
const removeParticipant = (index: number) => {
    participants.value.splice(index, 1)
}

// 规划会议时间
const planMeeting = () => {
    if (!meetingDate.value || !meetingTime.value) {
        showError('请输入会议日期和时间')
        return
    }

    try {
        const meetingDateTime = new Date(`${meetingDate.value}T${meetingTime.value}`)
        const hostTimezoneInfo = allTimezones.find(tz => tz.zone === hostTimezone.value)

        const plan = []

        // 添加主办方
        plan.push({
            name: '主办方',
            timezoneName: hostTimezoneInfo?.name || '未知',
            localTime: meetingDateTime.toLocaleString('zh-CN', {
                timeZone: hostTimezone.value,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }),
            status: 'host',
            statusText: '主办方'
        })

        // 添加参会者
        participants.value.forEach(participant => {
            const participantTimezoneInfo = allTimezones.find(tz => tz.zone === participant.timezone)
            const localTime = meetingDateTime.toLocaleString('zh-CN', {
                timeZone: participant.timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })

            // 判断时间是否合适
            const timePart = localTime.split(' ')[1] || '12:00'
            const hour = parseInt(timePart.split(':')[0] || '12')
            let status = 'good'
            let statusText = '合适'

            if (hour < 6 || hour > 22) {
                status = 'bad'
                statusText = '不合适'
            } else if (hour < 8 || hour > 20) {
                status = 'warning'
                statusText = '一般'
            }

            plan.push({
                name: participant.name,
                timezoneName: participantTimezoneInfo?.name || '未知',
                localTime,
                status,
                statusText
            })
        })

        meetingPlan.value = plan
        showSuccess('会议时间规划完成')
    } catch (error) {
        showError('规划失败，请检查输入')
    }
}

// 复制会议安排
const copyMeetingPlan = async () => {
    if (meetingPlan.value.length === 0) return

    let text = '会议时间安排：\n\n'
    meetingPlan.value.forEach(item => {
        text += `${item.name} (${item.timezoneName}): ${item.localTime} - ${item.statusText}\n`
    })

    const success = await copyToClipboard(text)
    if (success) {
        showSuccess('会议安排已复制到剪贴板')
    } else {
        showError('复制失败')
    }
}

// 清空所有
const clearAll = () => {
    conversionResult.value = null
    meetingPlan.value = []
    participants.value = [
        { name: '参会者1', timezone: 'America/New_York' },
        { name: '参会者2', timezone: 'Europe/London' }
    ]
    showSuccess('已清空所有数据')
}
</script>
<style scoped>
.timezone-converter {
    width: 100%;
    height: 100dvh;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.converter-content {
    flex: 1;
    padding: 1.5rem;
    padding-bottom: 3rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    min-height: 0;
}

/* 通用区域样式 */
.world-clock-section,
.quick-convert-section,
.meeting-planner-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
    margin-bottom: 1.5rem;
    height: 48px;
    display: flex;
    align-items: center;
}

.section-title h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
}

/* 世界时钟样式 */
.world-clock-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
}

.clock-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 0.75rem;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.clock-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg,
            #ff6b6b 0%,
            #4ecdc4 25%,
            #45b7d1 50%,
            #96ceb4 75%,
            #feca57 100%);
    opacity: 0;
    transition: opacity 0.2s ease;
}

.clock-card:nth-child(4n+1)::before {
    background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
}

.clock-card:nth-child(4n+2)::before {
    background: linear-gradient(90deg, #4ecdc4, #6ed3d0);
}

.clock-card:nth-child(4n+3)::before {
    background: linear-gradient(90deg, #45b7d1, #6bc5d8);
}

.clock-card:nth-child(4n+4)::before {
    background: linear-gradient(90deg, #96ceb4, #a8d5c4);
}

.clock-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.city-name {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--primary-color);
}

.timezone-code {
    font-size: 0.6875rem;
    color: var(--success-color);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-weight: 600;
}

.time-display {
    text-align: center;
}

.time-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    margin-bottom: 0.125rem;
    display: block;
}

.date-value {
    font-size: 0.6875rem;
    color: var(--text-secondary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 快速转换样式 */
.quick-convert-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.convert-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.convert-inputs {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    justify-content: center;
}

.timezone-selector {
    flex: 1;
    max-width: 300px;
}

.timezone-selector label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.timezone-input-group {
    position: relative;
}

.timezone-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.timezone-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.convert-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    flex-shrink: 0;
}

.datetime-inputs {
    display: flex;
    align-items: end;
    gap: 1.5rem;
    justify-content: center;
}

.datetime-group {
    display: flex;
    gap: 1rem;
}

.input-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-wrapper label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.date-input,
.time-input {
    padding: 0.5rem 0.75rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    transition: all 0.2s ease;
    min-width: 140px;
}

.date-input:focus,
.time-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.convert-actions {
    display: flex;
    gap: 0.75rem;
}

.now-btn,
.convert-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
    border: 2px solid transparent;
}

.now-btn {
    background: var(--bg-primary);
    color: var(--text-primary);
    border-color: var(--border-color);
}

.now-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.convert-btn {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.convert-btn:hover {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
}

/* 转换结果样式 */
.conversion-result {
    background: linear-gradient(135deg, var(--success-color-alpha) 0%, var(--primary-color-alpha) 100%);
    border: 1px solid var(--success-color);
    border-radius: 1rem;
    padding: 2rem;
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.result-header h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.result-items {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
}

.result-item {
    flex: 1;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.25rem;
    text-align: center;
}

.result-item.source {
    border-left: 4px solid var(--warning-color);
}

.result-item.target {
    border-left: 4px solid var(--success-color);
}

.result-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.result-value {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-weight: 500;
}

.result-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
}

.time-difference {
    text-align: center;
    padding: 1rem;
    background: var(--bg-primary);
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
}

.diff-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-right: 0.5rem;
}

.diff-value {
    font-size: 1rem;
    color: var(--primary-color);
    font-weight: 600;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 会议规划样式 */
.meeting-planner-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.meeting-setup {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.meeting-basic-info {
    margin-bottom: 1rem;
}

.meeting-datetime {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.participants-section {
    border-top: 1px solid var(--border-color);
    padding-top: 1.5rem;
}

.participants-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.participants-header label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.add-participant-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--success-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.add-participant-btn:hover {
    background: var(--success-color-dark);
    transform: translateY(-1px);
}

.participants-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.participant-item {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    padding: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
}

.participant-name {
    flex: 1;
    min-width: 120px;
    padding: 0.5rem 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.participant-name:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.remove-participant-btn {
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
    flex-shrink: 0;
}

.remove-participant-btn:hover {
    background: var(--error-color-dark);
    transform: translateY(-1px);
}

.plan-meeting-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
    align-self: center;
}

.plan-meeting-btn:hover {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
}

/* 会议计划结果 */
.meeting-plan {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
}

.plan-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.plan-header h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.copy-plan-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-plan-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.plan-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.plan-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
    background: var(--bg-primary);
    border-radius: 0.75rem;
    border-left: 4px solid var(--border-color);
    transition: all 0.2s ease;
}

.plan-item.host {
    border-left-color: var(--primary-color);
    background: var(--primary-color-alpha);
}

.plan-item.good {
    border-left-color: var(--success-color);
}

.plan-item.warning {
    border-left-color: var(--warning-color);
}

.plan-item.bad {
    border-left-color: var(--error-color);
}

.plan-participant {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.participant-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.participant-info .participant-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    background: none;
    border: none;
    padding: 0;
}

.participant-timezone {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.participant-status {
    margin-left: auto;
}

.status-badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
}

.status-badge.good {
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.status-badge.warning {
    background: var(--warning-color-alpha);
    color: var(--warning-color);
}

.status-badge.bad {
    background: var(--error-color-alpha);
    color: var(--error-color);
}

.status-badge.host {
    background: var(--primary-color-alpha);
    color: var(--primary-color);
}

.plan-time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
}

.plan-datetime {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .convert-inputs {
        flex-direction: column;
        gap: 1rem;
    }

    .convert-arrow {
        transform: rotate(90deg);
    }

    .datetime-inputs {
        flex-direction: column;
        align-items: stretch;
    }

    .datetime-group {
        justify-content: center;
    }

    .result-items {
        flex-direction: column;
    }

    .result-arrow {
        transform: rotate(90deg);
    }

    .meeting-datetime {
        flex-direction: column;
    }
}

@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }

    .world-clock-section,
    .quick-convert-section,
    .meeting-planner-section {
        padding: 1.5rem;
    }

    .world-clock-grid {
        grid-template-columns: 1fr;
    }

    .convert-card,
    .meeting-setup {
        padding: 1.5rem;
    }

    .participant-item {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
    }

    .plan-item {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .plan-participant {
        justify-content: space-between;
    }

    .plan-time {
        align-items: flex-start;
    }

    .time-value {
        font-size: 1.75rem;
    }

    .datetime-group {
        flex-direction: column;
    }

    .convert-actions {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 5rem;
    }

    .section-title h3 {
        font-size: 1.125rem;
    }

    .clock-card {
        padding: 1.25rem;
    }

    .time-value {
        font-size: 1.5rem;
    }

    .message-toast {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
    }
}
</style>