<template>
    <div class="countdown-timer">
        <div class="timer-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="timer-title">倒计时器</h2>
            <div class="timer-actions">
                <button class="action-btn" @click="clearAll" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="timer-content">
            <!-- 快速定时器 -->
            <div class="quick-timer-section">
                <div class="section-header">
                    <div class="section-title">
                        <h3>⏱️ 快速定时器</h3>
                        <span class="section-subtitle">设置倒计时时长，到时提醒</span>
                    </div>
                </div>
                <div class="quick-timer-container">
                    <div class="timer-setup">
                        <div class="time-inputs-row">
                            <div class="time-input-group">
                                <label>小时</label>
                                <input 
                                    v-model.number="simpleHours" 
                                    type="number" 
                                    min="0" 
                                    max="23"
                                    class="time-number-input"
                                />
                            </div>
                            <div class="time-separator">:</div>
                            <div class="time-input-group">
                                <label>分钟</label>
                                <input 
                                    v-model.number="simpleMinutes" 
                                    type="number" 
                                    min="0" 
                                    max="59"
                                    class="time-number-input"
                                />
                            </div>
                            <div class="time-separator">:</div>
                            <div class="time-input-group">
                                <label>秒钟</label>
                                <input 
                                    v-model.number="simpleSeconds" 
                                    type="number" 
                                    min="0" 
                                    max="59"
                                    class="time-number-input"
                                />
                            </div>
                        </div>
                        
                        <div class="quick-presets">
                            <button class="preset-btn" @click="setQuickTimer(0, 1, 0)">1分钟</button>
                            <button class="preset-btn" @click="setQuickTimer(0, 5, 0)">5分钟</button>
                            <button class="preset-btn" @click="setQuickTimer(0, 10, 0)">10分钟</button>
                            <button class="preset-btn" @click="setQuickTimer(0, 15, 0)">15分钟</button>
                            <button class="preset-btn" @click="setQuickTimer(0, 30, 0)">30分钟</button>
                            <button class="preset-btn" @click="setQuickTimer(1, 0, 0)">1小时</button>
                        </div>
                    </div>
                    
                    <div class="timer-display-card">
                        <div class="countdown-display">
                            <div class="time-units">
                                <div class="time-unit">
                                    <span class="time-value">{{ simpleTimer.display?.hours || '00' }}</span>
                                    <span class="time-label">时</span>
                                </div>
                                <div class="time-unit">
                                    <span class="time-value">{{ simpleTimer.display?.minutes || '00' }}</span>
                                    <span class="time-label">分</span>
                                </div>
                                <div class="time-unit">
                                    <span class="time-value">{{ simpleTimer.display?.seconds || '00' }}</span>
                                    <span class="time-label">秒</span>
                                </div>
                                <div class="time-unit">
                                    <span class="time-value milliseconds">{{ simpleTimer.display?.milliseconds || '000' }}</span>
                                    <span class="time-label">毫秒</span>
                                </div>
                            </div>
                            <div class="timer-status" :class="{ 'expired': simpleTimer.isExpired, 'running': simpleTimer.isRunning }">
                                {{ simpleTimer.status }}
                            </div>
                        </div>
                        
                        <div class="timer-controls">
                            <button 
                                class="control-btn start" 
                                @click="startSimpleTimer"
                                :disabled="simpleTimer.isRunning"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                                开始
                            </button>
                            <button 
                                class="control-btn pause" 
                                @click="pauseSimpleTimer"
                                :disabled="!simpleTimer.isRunning"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="6" y="4" width="4" height="16" />
                                    <rect x="14" y="4" width="4" height="16" />
                                </svg>
                                暂停
                            </button>
                            <button 
                                class="control-btn reset" 
                                @click="resetSimpleTimer"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                    <path d="M21 3v5h-5" />
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                    <path d="M3 21v-5h5" />
                                </svg>
                                重置
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 目标日期倒计时 -->
            <div class="target-timer-section">
                <div class="section-header">
                    <div class="section-title">
                        <h3>📅 目标日期倒计时</h3>
                        <span class="section-subtitle">设置目标日期，实时显示倒计时</span>
                    </div>
                </div>
                <div class="target-timer-container">
                    <div class="target-setup">
                        <div class="datetime-inputs">
                            <div class="input-group">
                                <label>目标日期</label>
                                <input 
                                    v-model="targetDate" 
                                    type="date" 
                                    @change="startTargetCountdown"
                                    class="date-input"
                                />
                            </div>
                            <div class="input-group">
                                <label>目标时间</label>
                                <input 
                                    v-model="targetTime" 
                                    type="time" 
                                    step="1"
                                    @change="startTargetCountdown"
                                    class="time-input"
                                />
                            </div>
                        </div>
                        
                        <input 
                            v-model="targetTitle" 
                            type="text" 
                            placeholder="倒计时标题（可选）"
                            class="timer-title-input"
                        />
                        
                        <div class="quick-targets">
                            <button class="preset-btn" @click="setQuickTarget(1, 'hours')">1小时后</button>
                            <button class="preset-btn" @click="setQuickTarget(1, 'days')">1天后</button>
                            <button class="preset-btn" @click="setQuickTarget(7, 'days')">1周后</button>
                            <button class="preset-btn" @click="setQuickTarget(30, 'days')">1月后</button>
                        </div>
                    </div>
                    
                    <div v-if="targetCountdown" class="target-display-card">
                        <div v-if="targetTitle" class="display-title">{{ targetTitle }}</div>
                        <div class="countdown-display large">
                            <div class="time-units">
                                <div class="time-unit">
                                    <span class="time-value">{{ targetCountdown.days }}</span>
                                    <span class="time-label">天</span>
                                </div>
                                <div class="time-unit">
                                    <span class="time-value">{{ targetCountdown.hours }}</span>
                                    <span class="time-label">时</span>
                                </div>
                                <div class="time-unit">
                                    <span class="time-value">{{ targetCountdown.minutes }}</span>
                                    <span class="time-label">分</span>
                                </div>
                                <div class="time-unit">
                                    <span class="time-value">{{ targetCountdown.seconds }}</span>
                                    <span class="time-label">秒</span>
                                </div>
                            </div>
                            <div class="timer-status" :class="{ 'expired': targetCountdown.isExpired }">
                                {{ targetCountdown.status }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 多个倒计时 -->
            <div class="multiple-timers-section">
                <div class="section-header">
                    <div class="section-title">
                        <h3>📋 多个倒计时</h3>
                        <span class="section-subtitle">同时管理多个倒计时器</span>
                    </div>
                </div>
                <div class="multiple-timers-container">
                    <div class="add-timer-card">
                        <div class="add-timer-inputs">
                            <input 
                                v-model="newTimerTitle" 
                                type="text" 
                                placeholder="倒计时标题"
                                class="timer-title-input"
                            />
                            <div class="datetime-inputs">
                                <input 
                                    v-model="newTimerDate" 
                                    type="date" 
                                    class="date-input"
                                />
                                <input 
                                    v-model="newTimerTime" 
                                    type="time" 
                                    step="1"
                                    class="time-input"
                                />
                            </div>
                        </div>
                        <button class="add-timer-btn" @click="addTimer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            添加倒计时
                        </button>
                    </div>
                    
                    <div v-if="multipleTimers.length > 0" class="timers-grid">
                        <div v-for="timer in multipleTimers" :key="timer.id" class="timer-card">
                            <div class="timer-card-header">
                                <h4>{{ timer.title || '未命名倒计时' }}</h4>
                                <button class="remove-btn" @click="removeTimer(timer.id)">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                            <div class="countdown-display compact">
                                <div class="time-units">
                                    <div class="time-unit">
                                        <span class="time-value">{{ timer.countdown.days }}</span>
                                        <span class="time-label">天</span>
                                    </div>
                                    <div class="time-unit">
                                        <span class="time-value">{{ timer.countdown.hours }}</span>
                                        <span class="time-label">时</span>
                                    </div>
                                    <div class="time-unit">
                                        <span class="time-value">{{ timer.countdown.minutes }}</span>
                                        <span class="time-label">分</span>
                                    </div>
                                    <div class="time-unit">
                                        <span class="time-value">{{ timer.countdown.seconds }}</span>
                                        <span class="time-label">秒</span>
                                    </div>
                                </div>
                                <div class="timer-status" :class="{ 'expired': timer.countdown.isExpired }">
                                    {{ timer.countdown.status }}
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
import {  ref, onMounted, onUnmounted  } from 'vue'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'

defineEmits<{
    back: []
}>()

// 目标日期倒计时
const targetDate = ref('')
const targetTime = ref('')
const targetTitle = ref('')
const targetCountdown = ref<{
    days: string
    hours: string
    minutes: string
    seconds: string
    status: string
    isExpired: boolean
} | null>(null)

// 简单定时器
const simpleHours = ref(0)
const simpleMinutes = ref(5)
const simpleSeconds = ref(0)
const simpleTimer = ref({
    isRunning: false,
    isExpired: false,
    remainingTime: 0,
    totalTime: 0,
    status: '准备就绪',
    display: null as {
        hours: string
        minutes: string
        seconds: string
        milliseconds: string
    } | null
})

// 多个倒计时
const newTimerTitle = ref('')
const newTimerDate = ref('')
const newTimerTime = ref('')
const multipleTimers = ref<Array<{
    id: number
    title: string
    targetDate: Date
    countdown: {
        days: string
        hours: string
        minutes: string
        seconds: string
        status: string
        isExpired: boolean
    }
}>>([])

const message = ref('')
const messageType = ref<'success' | 'error'>('success')

let targetInterval: number | null = null
let simpleInterval: number | null = null
let multipleInterval: number | null = null

// 组件挂载时设置默认值
onMounted(() => {
    setPageTitle('countdown-timer')
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    
    targetDate.value = tomorrow.toISOString().split('T')[0] || ''
    targetTime.value = '12:00:00'
    newTimerDate.value = tomorrow.toISOString().split('T')[0] || ''
    newTimerTime.value = '12:00:00'
    
    startTargetCountdown()
    updateSimpleTimerDisplay()
})

// 组件卸载时清除定时器
onUnmounted(() => {
    restoreDefaultTitle()
    if (targetInterval) clearInterval(targetInterval)
    if (simpleInterval) clearInterval(simpleInterval)
    if (multipleInterval) clearInterval(multipleInterval)
})

// 格式化数字为两位数
const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0')
}

// 计算倒计时
const calculateCountdown = (targetDate: Date) => {
    const now = new Date()
    const diff = targetDate.getTime() - now.getTime()
    
    if (diff <= 0) {
        return {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
            status: '时间已到！',
            isExpired: true
        }
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return {
        days: formatNumber(days),
        hours: formatNumber(hours),
        minutes: formatNumber(minutes),
        seconds: formatNumber(seconds),
        status: `还有 ${days} 天 ${hours} 小时 ${minutes} 分钟`,
        isExpired: false
    }
}

// 开始目标日期倒计时
const startTargetCountdown = () => {
    if (!targetDate.value || !targetTime.value) {
        targetCountdown.value = null
        if (targetInterval) {
            clearInterval(targetInterval)
            targetInterval = null
        }
        return
    }
    
    const target = new Date(`${targetDate.value}T${targetTime.value}`)
    
    if (isNaN(target.getTime())) {
        showMessage('无效的目标日期时间', 'error')
        return
    }
    
    // 立即更新一次
    targetCountdown.value = calculateCountdown(target)
    
    // 清除之前的定时器
    if (targetInterval) {
        clearInterval(targetInterval)
    }
    
    // 每秒更新
    targetInterval = setInterval(() => {
        if (targetCountdown.value) {
            targetCountdown.value = calculateCountdown(target)
            
            // 如果时间到了，播放提醒音（如果浏览器支持）
            if (targetCountdown.value.isExpired && targetTitle.value) {
                showMessage(`${targetTitle.value} 时间到了！`, 'success')
            }
        }
    }, 1000)
}

// 设置快速目标时间
const setQuickTarget = (amount: number, unit: string) => {
    const now = new Date()
    let target = new Date(now)
    
    switch (unit) {
        case 'hours':
            target.setHours(target.getHours() + amount)
            break
        case 'days':
            target.setDate(target.getDate() + amount)
            break
    }
    
    targetDate.value = target.toISOString().split('T')[0] || ''
    targetTime.value = target.toTimeString().split(' ')[0] || ''
    startTargetCountdown()
}

// 更新简单定时器显示
const updateSimpleTimerDisplay = () => {
    const totalSeconds = simpleHours.value * 3600 + simpleMinutes.value * 60 + simpleSeconds.value
    
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    simpleTimer.value.display = {
        hours: formatNumber(hours),
        minutes: formatNumber(minutes),
        seconds: formatNumber(seconds),
        milliseconds: '000'
    }
    
    simpleTimer.value.totalTime = totalSeconds * 1000 // 转换为毫秒
    simpleTimer.value.remainingTime = totalSeconds * 1000
}

// 开始简单定时器
const startSimpleTimer = () => {
    const totalMilliseconds = (simpleHours.value * 3600 + simpleMinutes.value * 60 + simpleSeconds.value) * 1000
    
    if (totalMilliseconds <= 0) {
        showMessage('请设置有效的时间', 'error')
        return
    }
    
    simpleTimer.value.isRunning = true
    simpleTimer.value.isExpired = false
    simpleTimer.value.status = '计时中...'
    simpleTimer.value.remainingTime = totalMilliseconds
    
    if (simpleInterval) {
        clearInterval(simpleInterval)
    }
    
    simpleInterval = setInterval(() => {
        simpleTimer.value.remainingTime -= 10 // 每10毫秒减少
        
        if (simpleTimer.value.remainingTime <= 0) {
            // 时间到了
            simpleTimer.value.isRunning = false
            simpleTimer.value.isExpired = true
            simpleTimer.value.status = '时间到了！'
            simpleTimer.value.remainingTime = 0
            
            if (simpleInterval) {
                clearInterval(simpleInterval)
                simpleInterval = null
            }
            
            showMessage('定时器时间到了！', 'success')
        } else {
            // 更新显示
            const totalMs = simpleTimer.value.remainingTime
            const hours = Math.floor(totalMs / (1000 * 60 * 60))
            const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((totalMs % (1000 * 60)) / 1000)
            const milliseconds = Math.floor((totalMs % 1000) / 10) * 10 // 精确到10毫秒
            
            simpleTimer.value.display = {
                hours: formatNumber(hours),
                minutes: formatNumber(minutes),
                seconds: formatNumber(seconds),
                milliseconds: milliseconds.toString().padStart(3, '0')
            }
        }
    }, 10) // 每10毫秒更新一次
}

// 暂停简单定时器
const pauseSimpleTimer = () => {
    simpleTimer.value.isRunning = false
    simpleTimer.value.status = '已暂停'
    
    if (simpleInterval) {
        clearInterval(simpleInterval)
        simpleInterval = null
    }
}

// 重置简单定时器
const resetSimpleTimer = () => {
    simpleTimer.value.isRunning = false
    simpleTimer.value.isExpired = false
    simpleTimer.value.status = '准备就绪'
    
    if (simpleInterval) {
        clearInterval(simpleInterval)
        simpleInterval = null
    }
    
    updateSimpleTimerDisplay()
}

// 设置快速定时器时间
const setQuickTimer = (hours: number, minutes: number, seconds: number) => {
    simpleHours.value = hours
    simpleMinutes.value = minutes
    simpleSeconds.value = seconds
    updateSimpleTimerDisplay()
}

// 添加多个倒计时
const addTimer = () => {
    if (!newTimerDate.value || !newTimerTime.value) {
        showMessage('请设置目标日期和时间', 'error')
        return
    }
    
    const target = new Date(`${newTimerDate.value}T${newTimerTime.value}`)
    
    if (isNaN(target.getTime())) {
        showMessage('无效的日期时间', 'error')
        return
    }
    
    const newTimer = {
        id: Date.now(),
        title: newTimerTitle.value || '未命名倒计时',
        targetDate: target,
        countdown: calculateCountdown(target)
    }
    
    multipleTimers.value.push(newTimer)
    
    // 清空输入
    newTimerTitle.value = ''
    
    // 开始更新多个倒计时
    if (!multipleInterval) {
        multipleInterval = setInterval(updateMultipleTimers, 1000)
    }
    
    showMessage('倒计时已添加', 'success')
}

// 移除倒计时
const removeTimer = (id: number) => {
    multipleTimers.value = multipleTimers.value.filter(timer => timer.id !== id)
    
    if (multipleTimers.value.length === 0 && multipleInterval) {
        clearInterval(multipleInterval)
        multipleInterval = null
    }
    
    showMessage('倒计时已移除', 'success')
}

// 更新多个倒计时
const updateMultipleTimers = () => {
    multipleTimers.value.forEach(timer => {
        timer.countdown = calculateCountdown(timer.targetDate)
        
        // 如果时间到了，显示提醒
        if (timer.countdown.isExpired) {
            showMessage(`${timer.title} 时间到了！`, 'success')
        }
    })
}

// 清空所有
const clearAll = () => {
    // 清除所有定时器
    if (targetInterval) {
        clearInterval(targetInterval)
        targetInterval = null
    }
    if (simpleInterval) {
        clearInterval(simpleInterval)
        simpleInterval = null
    }
    if (multipleInterval) {
        clearInterval(multipleInterval)
        multipleInterval = null
    }
    
    // 重置所有数据
    targetCountdown.value = null
    targetTitle.value = ''
    
    simpleTimer.value = {
        isRunning: false,
        isExpired: false,
        remainingTime: 0,
        totalTime: 0,
        status: '准备就绪',
        display: null
    }
    simpleHours.value = 0
    simpleMinutes.value = 5
    simpleSeconds.value = 0
    
    multipleTimers.value = []
    newTimerTitle.value = ''
    
    updateSimpleTimerDisplay()
    showMessage('已清空所有倒计时', 'success')
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
.countdown-timer {
    width: 100%;
    height: 100dvh;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.timer-header {
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
}

.timer-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.timer-actions {
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
}

.timer-content {
    flex: 1;
    padding: 1.5rem;
    padding-bottom: 3rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    min-height: 0;
}

/* 通用区域样式 */
.quick-timer-section,
.target-timer-section,
.multiple-timers-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
    margin-bottom: 1.5rem;
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

/* 快速定时器样式 */
.quick-timer-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
}

.timer-setup {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.time-inputs-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
}

.time-input-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.time-input-group label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.time-number-input {
    width: 4rem;
    padding: 0.75rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 1.125rem;
    font-weight: 600;
    text-align: center;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    transition: all 0.2s ease;
}

.time-number-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.time-separator {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0 0.5rem;
}

.quick-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
}

.preset-btn {
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

.preset-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.timer-title-input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.timer-title-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.timer-display-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.countdown-display {
    text-align: center;
}

.time-units {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.time-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 4rem;
}

.time-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary-color);
    line-height: 1;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.time-value.milliseconds {
    font-size: 1.5rem;
    color: var(--text-secondary);
}

.countdown-display.large .time-value {
    font-size: 3rem;
}

.countdown-display.compact .time-value {
    font-size: 1.5rem;
}

.time-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 0.25rem;
    font-weight: 500;
}

.timer-status {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.timer-status.expired {
    color: var(--error-color);
    font-weight: 600;
}

.timer-status.running {
    color: var(--success-color);
    font-weight: 600;
}

.timer-controls {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
}

.control-btn {
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

.control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.control-btn.start {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.control-btn.start:hover:not(:disabled) {
    background: var(--success-color-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--success-color-alpha);
}

.control-btn.pause {
    background: var(--warning-color);
    color: white;
    border-color: var(--warning-color);
}

.control-btn.pause:hover:not(:disabled) {
    background: var(--warning-color-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--warning-color-alpha);
}

.control-btn.reset {
    background: var(--bg-primary);
    color: var(--text-primary);
    border-color: var(--border-color);
}

.control-btn.reset:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 目标日期倒计时样式 */
.target-timer-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.target-setup {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.datetime-inputs {
    display: flex;
    gap: 1rem;
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

.date-input,
.time-input {
    padding: 0.875rem 1rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    transition: all 0.2s ease;
}

.date-input:focus,
.time-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.quick-targets {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
}

.target-display-card {
    background: linear-gradient(135deg, var(--primary-color-alpha) 0%, var(--success-color-alpha) 100%);
    border: 1px solid var(--primary-color);
    border-radius: 1rem;
    padding: 2rem;
}

/* 多个倒计时样式 */
.multiple-timers-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.add-timer-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.add-timer-inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.add-timer-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
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

.add-timer-btn:hover {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
}

.timers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
}

.timer-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    transition: all 0.2s ease;
}

.timer-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color);
}

.timer-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.timer-card-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.remove-btn:hover {
    background: var(--error-color-dark);
    transform: translateY(-1px);
}

/* 消息提示样式 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    .quick-timer-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .datetime-inputs {
        flex-direction: column;
    }
}

@media (max-width: 768px) {
    .timer-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }
    
    .quick-timer-section,
    .target-timer-section,
    .multiple-timers-section {
        padding: 1.5rem;
    }
    
    .time-inputs-row {
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
    }
    
    .time-separator {
        display: none;
    }
    
    .timer-display-card {
        padding: 1.5rem;
    }
    
    .time-units {
        gap: 0.5rem;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .time-value {
        font-size: 2rem;
    }
    
    .time-value.milliseconds {
        font-size: 1.25rem;
    }
    
    .countdown-display.large .time-value {
        font-size: 2.5rem;
    }
    
    .timer-controls {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .timers-grid {
        grid-template-columns: 1fr;
    }
    
    .quick-presets,
    .quick-targets {
        justify-content: flex-start;
    }
}

@media (max-width: 480px) {
    .timer-header {
        padding: 0.75rem 1rem;
    }
    
    .timer-title {
        font-size: 1.125rem;
    }
    
    .time-number-input {
        width: 3rem;
        font-size: 1rem;
    }
    
    .time-value {
        font-size: 1.5rem;
    }
    
    .time-value.milliseconds {
        font-size: 1rem;
    }
    
    .countdown-display.large .time-value {
        font-size: 2rem;
    }
    
    .time-units {
        gap: 0.25rem;
    }
    
    .message-toast {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
    }
}
</style>