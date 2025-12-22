<template>
    <div class="timezone-converter">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">时区转换</h2>
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
            <!-- 当前时间显示 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>当前时间</h3>
                    <div class="section-info">
                        <span class="info-text">实时显示各时区当前时间</span>
                    </div>
                </div>
                <div class="current-time-grid">
                    <div v-for="timezone in mainTimezones" :key="timezone.zone" class="time-card">
                        <div class="time-card-header">
                            <span class="timezone-name">{{ timezone.name }}</span>
                            <span class="timezone-code">{{ timezone.code }}</span>
                        </div>
                        <div class="time-display">
                            <span class="time-value">{{ getCurrentTime(timezone.zone) }}</span>
                        </div>
                        <div class="time-info">
                            <span class="date-value">{{ getCurrentDate(timezone.zone) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 时区转换器 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>时区转换</h3>
                    <div class="section-info">
                        <span class="info-text">在不同时区之间转换时间</span>
                    </div>
                </div>
                <div class="timezone-converter-container">
                    <div class="converter-form">
                        <div class="form-row">
                            <div class="input-group">
                                <label>源时区</label>
                                <select v-model="sourceTimezone" class="timezone-select">
                                    <option v-for="tz in allTimezones" :key="tz.zone" :value="tz.zone">
                                        {{ tz.name }} ({{ tz.code }})
                                    </option>
                                </select>
                            </div>
                            <div class="input-group">
                                <label>目标时区</label>
                                <select v-model="targetTimezone" class="timezone-select">
                                    <option v-for="tz in allTimezones" :key="tz.zone" :value="tz.zone">
                                        {{ tz.name }} ({{ tz.code }})
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="input-group">
                                <label>日期</label>
                                <input 
                                    v-model="convertDate" 
                                    type="date" 
                                    class="date-input"
                                />
                            </div>
                            <div class="input-group">
                                <label>时间</label>
                                <input 
                                    v-model="convertTime" 
                                    type="time" 
                                    step="1"
                                    class="time-input"
                                />
                            </div>
                        </div>
                        <div class="form-actions">
                            <button class="convert-btn" @click="convertTimezone">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M7 16.5L12 12l5 4.5" />
                                    <path d="M7 7.5L12 12l5-4.5" />
                                </svg>
                                转换
                            </button>
                            <button class="now-btn" @click="setCurrentTime">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12,6 12,12 16,14" />
                                </svg>
                                当前时间
                            </button>
                        </div>
                    </div>
                    
                    <div v-if="conversionResult" class="conversion-result">
                        <div class="result-header">
                            <h4>转换结果</h4>
                            <button class="copy-btn" @click="copyResult" title="复制结果">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="result-content">
                            <div class="result-item">
                                <span class="result-label">源时间:</span>
                                <span class="result-value">{{ conversionResult.source }}</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">目标时间:</span>
                                <span class="result-value">{{ conversionResult.target }}</span>
                            </div>
                            <div class="result-item">
                                <span class="result-label">时差:</span>
                                <span class="result-value">{{ conversionResult.difference }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 会议时间规划 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>会议时间规划</h3>
                    <div class="section-info">
                        <span class="info-text">为跨时区会议找到合适的时间</span>
                    </div>
                </div>
                <div class="meeting-planner-container">
                    <div class="meeting-form">
                        <div class="form-row">
                            <div class="input-group">
                                <label>会议日期</label>
                                <input 
                                    v-model="meetingDate" 
                                    type="date" 
                                    class="date-input"
                                />
                            </div>
                            <div class="input-group">
                                <label>会议时间</label>
                                <input 
                                    v-model="meetingTime" 
                                    type="time" 
                                    step="1"
                                    class="time-input"
                                />
                            </div>
                            <div class="input-group">
                                <label>主办方时区</label>
                                <select v-model="hostTimezone" class="timezone-select">
                                    <option v-for="tz in allTimezones" :key="tz.zone" :value="tz.zone">
                                        {{ tz.name }} ({{ tz.code }})
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="participants-section">
                            <div class="participants-header">
                                <label>参会者时区</label>
                                <button class="add-participant-btn" @click="addParticipant">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    添加参会者
                                </button>
                            </div>
                            <div class="participants-list">
                                <div v-for="(participant, index) in participants" :key="index" class="participant-item">
                                    <input 
                                        v-model="participant.name" 
                                        type="text" 
                                        placeholder="参会者姓名"
                                        class="participant-name"
                                    />
                                    <select v-model="participant.timezone" class="timezone-select">
                                        <option v-for="tz in allTimezones" :key="tz.zone" :value="tz.zone">
                                            {{ tz.name }} ({{ tz.code }})
                                        </option>
                                    </select>
                                    <button class="remove-participant-btn" @click="removeParticipant(index)">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button class="plan-meeting-btn" @click="planMeeting">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="plan-content">
                            <div v-for="item in meetingPlan" :key="item.name" class="plan-item">
                                <div class="plan-participant">
                                    <span class="participant-name">{{ item.name }}</span>
                                    <span class="participant-timezone">{{ item.timezoneName }}</span>
                                </div>
                                <div class="plan-time">
                                    <span class="plan-datetime">{{ item.localTime }}</span>
                                    <span class="plan-status" :class="item.status">{{ item.statusText }}</span>
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
import { ref, onMounted, onUnmounted } from 'vue'

defineEmits<{
    back: []
}>()

// 时区数据
const mainTimezones = [
    { name: '北京', code: 'CST', zone: 'Asia/Shanghai' },
    { name: '纽约', code: 'EST/EDT', zone: 'America/New_York' },
    { name: '伦敦', code: 'GMT/BST', zone: 'Europe/London' },
    { name: '东京', code: 'JST', zone: 'Asia/Tokyo' },
    { name: '悉尼', code: 'AEST/AEDT', zone: 'Australia/Sydney' },
    { name: '洛杉矶', code: 'PST/PDT', zone: 'America/Los_Angeles' }
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

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 当前时间更新定时器
let timeUpdateInterval: number | null = null

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
    timeUpdateInterval = setInterval(() => {
        // 触发重新渲染以更新时间显示
    }, 1000)
}

// 获取指定时区的当前时间
const getCurrentTime = (timezone: string): string => {
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
    showMessage('已设置为当前时间', 'success')
}

// 时区转换
const convertTimezone = () => {
    if (!convertDate.value || !convertTime.value) {
        showMessage('请输入完整的日期和时间', 'error')
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
        
        showMessage('时区转换完成', 'success')
    } catch (error) {
        showMessage('转换失败，请检查输入', 'error')
    }
}

// 获取时区偏移量（分钟）
const getTimezoneOffset = (timezone: string): number => {
    try {
        // const now = new Date()
        // const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
        // const targetTime = new Date(utc + (getTimezoneOffsetMinutes(timezone) * 60000))
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

// 复制转换结果
const copyResult = async () => {
    if (!conversionResult.value) return
    
    const text = `时区转换结果：
源时间: ${conversionResult.value.source}
目标时间: ${conversionResult.value.target}
时差: ${conversionResult.value.difference}`
    
    try {
        await navigator.clipboard.writeText(text)
        showMessage('转换结果已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
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
        showMessage('请输入会议日期和时间', 'error')
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
        showMessage('会议时间规划完成', 'success')
    } catch (error) {
        showMessage('规划失败，请检查输入', 'error')
    }
}

// 复制会议安排
const copyMeetingPlan = async () => {
    if (meetingPlan.value.length === 0) return
    
    let text = '会议时间安排：\n\n'
    meetingPlan.value.forEach(item => {
        text += `${item.name} (${item.timezoneName}): ${item.localTime} - ${item.statusText}\n`
    })
    
    try {
        await navigator.clipboard.writeText(text)
        showMessage('会议安排已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
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
    showMessage('已清空所有数据', 'success')
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
.timezone-converter {
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
    max-width: 1200px;
    margin: 0 auto;
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

/* 当前时间网格 */
.current-time-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
}

.time-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.25rem;
    text-align: center;
    transition: all 0.2s ease;
}

.time-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
}

.time-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.timezone-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.timezone-code {
    font-size: 0.75rem;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
}

.time-display {
    margin-bottom: 0.75rem;
}

.time-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-color);
    font-family: 'Courier New', monospace;
}

.time-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.date-value {
    font-family: 'Courier New', monospace;
}

/* 时区转换器样式 */
.timezone-converter-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.converter-form {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.form-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.form-row:last-child {
    margin-bottom: 0;
}

.input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.timezone-select,
.date-input,
.time-input {
    padding: 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.timezone-select:focus,
.date-input:focus,
.time-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.form-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    margin-top: 1rem;
}

.convert-btn,
.now-btn {
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

.convert-btn {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.convert-btn:hover {
    background: var(--primary-color-dark);
    border-color: var(--primary-color-dark);
}

.now-btn {
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-weight: 500;
}

.now-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

/* 转换结果样式 */
.conversion-result {
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

.copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.result-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--bg-secondary);
    border-radius: 0.5rem;
}

.result-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.result-value {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-family: 'Courier New', monospace;
}

/* 会议规划样式 */
.meeting-planner-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.meeting-form {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.participants-section {
    margin-top: 1rem;
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
}

.participants-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.participant-item {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.participant-name {
    flex: 1;
    padding: 0.75rem;
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
    width: 2.5rem;
    height: 2.5rem;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.remove-participant-btn:hover {
    background: var(--error-color-dark);
}

.plan-meeting-btn {
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
    margin-top: 1rem;
    align-self: center;
}

.plan-meeting-btn:hover {
    background: var(--primary-color-dark);
}

/* 会议计划结果 */
.meeting-plan {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.plan-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.plan-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.copy-plan-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-plan-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.plan-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.plan-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 0.5rem;
    border-left: 4px solid var(--border-color);
}

.plan-item.host {
    border-left-color: var(--primary-color);
}

.plan-participant {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.plan-participant .participant-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    background: none;
    border: none;
    padding: 0;
}

.plan-participant .participant-timezone {
    font-size: 0.75rem;
    color: var(--text-secondary);
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
    font-family: 'Courier New', monospace;
}

.plan-status {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
}

.plan-status.good {
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.plan-status.warning {
    background: var(--warning-color-alpha);
    color: var(--warning-color);
}

.plan-status.bad {
    background: var(--error-color-alpha);
    color: var(--error-color);
}

.plan-status.host {
    background: var(--primary-color-alpha);
    color: var(--primary-color);
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
    
    .current-time-grid {
        grid-template-columns: 1fr;
    }
    
    .form-row {
        flex-direction: column;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .participant-item {
        flex-direction: column;
        align-items: stretch;
    }
    
    .plan-item {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
    }
    
    .plan-time {
        align-items: flex-start;
    }
    
    .time-value {
        font-size: 1.5rem;
    }
}
</style>