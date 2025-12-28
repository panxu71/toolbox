<template>
    <div class="stopwatch" :class="{ fullscreen: isFullscreen }">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">在线秒表</h2>

            <div class="header-actions">
                <button v-if="laps.length > 0" class="header-export-btn" @click="exportLaps">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7,10 12,15 17,10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    导出记录
                </button>

                <button v-if="laps.length > 0" class="header-clear-btn" @click="clearLaps">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
                    </svg>
                    清空记录
                </button>
            </div>
        </div>

        <div class="converter-content">
            <div class="stopwatch-container">
                <!-- 主秒表区域 - 始终居中 -->
                <div class="main-stopwatch-area">
                    <!-- 主显示区域 -->
                    <div class="time-display">
                        <div class="time-content">
                            <div class="main-time">{{ formatTime(currentTime) }}</div>
                            <div class="milliseconds">.{{ formatMilliseconds(currentTime) }}</div>
                        </div>
                    </div>

                    <!-- 控制按钮 -->
                    <div class="control-buttons">
                        <button v-if="!isRunning && currentTime === 0" class="start-btn" @click="start">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            开始
                        </button>

                        <button v-if="isRunning" class="pause-btn" @click="pause">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                            暂停
                        </button>

                        <button v-if="!isRunning && currentTime > 0" class="resume-btn" @click="resume">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            继续
                        </button>

                        <button v-if="isRunning" class="lap-btn" @click="recordLap">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12,6 12,12 16,14" />
                            </svg>
                            计次
                        </button>

                        <button v-if="currentTime > 0" class="reset-btn" @click="reset">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                <path d="M3 21v-5h5" />
                            </svg>
                            重置
                        </button>

                        <button class="fullscreen-btn" @click="toggleFullscreen">
                            <svg v-if="!isFullscreen" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <path d="m15 3 6 6m-6-6v6m6-6h-6M9 21l-6-6m6 6v-6m-6 6h6" />
                            </svg>
                            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                            </svg>
                            {{ isFullscreen ? '退出全屏' : '全屏' }}
                        </button>
                    </div>
                </div>

                <!-- 计次记录 -->
                <div v-if="laps.length > 0" class="laps-section">
                    <h3 class="section-title">计次记录</h3>
                    <div class="laps-container">
                        <div class="laps-header">
                            <span class="lap-number">次数</span>
                            <span class="lap-time">计次时间</span>
                            <span class="lap-total">总时间</span>
                        </div>
                        <div class="laps-list">
                            <div v-for="(lap, index) in reversedLaps" :key="lap.id"
                                :class="['lap-item', { 'fastest': lap.isFastest, 'slowest': lap.isSlowest }]">
                                <span class="lap-number">{{ laps.length - index }}</span>
                                <span class="lap-time">{{ formatTime(lap.lapTime) }}.{{
                                    formatMilliseconds(lap.lapTime)
                                }}</span>
                                <span class="lap-total">{{ formatTime(lap.totalTime) }}.{{
                                    formatMilliseconds(lap.totalTime) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 统计信息 -->
                <div v-if="laps.length > 0" class="stats-section">
                    <h3 class="section-title">统计信息</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-label">总计次数</div>
                            <div class="stat-value">{{ laps.length }}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">最快计次</div>
                            <div class="stat-value">{{ formatTime(fastestLap) }}.{{ formatMilliseconds(fastestLap)
                            }}
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">最慢计次</div>
                            <div class="stat-value">{{ formatTime(slowestLap) }}.{{ formatMilliseconds(slowestLap)
                            }}
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">平均计次</div>
                            <div class="stat-value">{{ formatTime(averageLap) }}.{{ formatMilliseconds(averageLap)
                            }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 消息提示 -->
        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWakeLock } from '../composables/useWakeLock'

defineEmits<{
    back: []
}>()

// 状态管理
const isRunning = ref(false)
const currentTime = ref(0)
const startTime = ref(0)
const pausedTime = ref(0)
const intervalId = ref<number | null>(null)
const isFullscreen = ref(false)

// 防止息屏
const { requestWakeLock, releaseWakeLock } = useWakeLock()

// 计次记录
interface Lap {
    id: number
    lapTime: number
    totalTime: number
    isFastest?: boolean
    isSlowest?: boolean
}

const laps = ref<Lap[]>([])
const lapCounter = ref(0)

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 计算属性
const reversedLaps = computed(() => [...laps.value].reverse())

const fastestLap = computed(() => {
    if (laps.value.length === 0) return 0
    return Math.min(...laps.value.map(lap => lap.lapTime))
})

const slowestLap = computed(() => {
    if (laps.value.length === 0) return 0
    return Math.max(...laps.value.map(lap => lap.lapTime))
})

const averageLap = computed(() => {
    if (laps.value.length === 0) return 0
    const total = laps.value.reduce((sum, lap) => sum + lap.lapTime, 0)
    return Math.round(total / laps.value.length)
})

// 格式化时间显示
const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    // 始终显示时分秒格式
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const formatMilliseconds = (milliseconds: number): string => {
    return (milliseconds % 1000).toString().padStart(3, '0')
}

// 秒表控制
const start = () => {
    isRunning.value = true
    startTime.value = Date.now() - pausedTime.value

    intervalId.value = window.setInterval(() => {
        currentTime.value = Date.now() - startTime.value
    }, 10)

    showMessage('秒表已开始', 'success')
}

const pause = () => {
    isRunning.value = false
    pausedTime.value = currentTime.value

    if (intervalId.value) {
        clearInterval(intervalId.value)
        intervalId.value = null
    }

    showMessage('秒表已暂停', 'success')
}

const resume = () => {
    start()
    showMessage('秒表已继续', 'success')
}

const reset = () => {
    isRunning.value = false
    currentTime.value = 0
    startTime.value = 0
    pausedTime.value = 0

    if (intervalId.value) {
        clearInterval(intervalId.value)
        intervalId.value = null
    }

    showMessage('秒表已重置', 'success')
}

// 计次功能
const recordLap = () => {
    if (!isRunning.value) return

    const previousTotalTime = laps.value.length > 0 ? (laps.value[laps.value.length - 1]?.totalTime || 0) : 0
    const lapTime = currentTime.value - previousTotalTime

    lapCounter.value++
    const newLap: Lap = {
        id: lapCounter.value,
        lapTime,
        totalTime: currentTime.value
    }

    laps.value.push(newLap)
    updateLapStats()
    showMessage(`第 ${laps.value.length} 次计次已记录`, 'success')
}

const updateLapStats = () => {
    if (laps.value.length <= 1) return

    const fastest = fastestLap.value
    const slowest = slowestLap.value

    laps.value.forEach(lap => {
        lap.isFastest = lap.lapTime === fastest && fastest !== slowest
        lap.isSlowest = lap.lapTime === slowest && fastest !== slowest
    })
}

const clearLaps = () => {
    laps.value = []
    lapCounter.value = 0
    showMessage('计次记录已清空', 'success')
}

// 导出功能
const exportLaps = () => {
    if (laps.value.length === 0) {
        showMessage('没有计次记录可导出', 'error')
        return
    }

    const data = [
        ['次数', '计次时间', '总时间'],
        ...laps.value.map((lap, index) => [
            (index + 1).toString(),
            `${formatTime(lap.lapTime)}.${formatMilliseconds(lap.lapTime)}`,
            `${formatTime(lap.totalTime)}.${formatMilliseconds(lap.totalTime)}`
        ])
    ]

    const csvContent = data.map(row => row.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `秒表记录_${new Date().toISOString().slice(0, 10)}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        showMessage('计次记录已导出', 'success')
    }
}

// 显示消息
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 全屏功能
const toggleFullscreen = async () => {
    try {
        if (!document.fullscreenElement) {
            // 进入全屏
            await document.documentElement.requestFullscreen()
            isFullscreen.value = true
            // 全屏时启用防息屏
            requestWakeLock(showMessage)
            showMessage('已进入全屏模式，按F11或ESC键退出', 'success')
        } else {
            // 退出全屏
            await document.exitFullscreen()
            isFullscreen.value = false
            // 退出全屏时释放防息屏
            releaseWakeLock(showMessage)
            showMessage('已退出全屏模式', 'success')
        }
    } catch (error) {
        // 如果浏览器不支持全屏API，回退到CSS全屏
        isFullscreen.value = !isFullscreen.value
        if (isFullscreen.value) {
            // 组件全屏时也启用防息屏
            requestWakeLock(showMessage)
            showMessage('已进入全屏模式（CSS模式），按ESC键退出', 'success')
        } else {
            // 退出组件全屏时释放防息屏
            releaseWakeLock(showMessage)
            showMessage('已退出全屏模式', 'success')
        }
    }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
    const wasFullscreen = isFullscreen.value
    isFullscreen.value = !!document.fullscreenElement
    
    // 如果从全屏退出，释放防息屏
    if (wasFullscreen && !isFullscreen.value) {
        releaseWakeLock(showMessage)
    }
}

// 键盘快捷键
const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
        event.preventDefault()
        if (isRunning.value) {
            pause()
        } else if (currentTime.value === 0) {
            start()
        } else {
            resume()
        }
    } else if (event.code === 'KeyL' && isRunning.value) {
        event.preventDefault()
        recordLap()
    } else if (event.code === 'KeyR' && !isRunning.value) {
        event.preventDefault()
        reset()
    } else if (event.code === 'Escape') {
        event.preventDefault()
        if (document.fullscreenElement) {
            // 如果是浏览器全屏，退出浏览器全屏
            document.exitFullscreen()
        } else if (isFullscreen.value) {
            // 如果是CSS全屏，退出CSS全屏
            isFullscreen.value = false
            showMessage('已退出全屏模式', 'success')
        }
    } else if (event.code === 'KeyF' || event.code === 'F11') {
        event.preventDefault()
        toggleFullscreen()
    }
}

// 生命周期
onMounted(() => {
    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    showMessage('快捷键：空格键 开始/暂停，L键 计次，R键 重置，F键/F11键 全屏', 'success')
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    if (intervalId.value) {
        clearInterval(intervalId.value)
    }
    // 组件卸载时释放防息屏
    releaseWakeLock()
})
</script>

<style scoped>
.stopwatch {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 全屏模式样式 */
.stopwatch.fullscreen,
.stopwatch:fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: #2d3748;
}

.stopwatch.fullscreen .converter-header,
.stopwatch:fullscreen .converter-header {
    display: none;
}

.stopwatch.fullscreen .converter-content,
.stopwatch:fullscreen .converter-content {
    padding: 0;
    justify-content: center;
    align-items: center;
}

.stopwatch.fullscreen .main-stopwatch-area,
.stopwatch:fullscreen .main-stopwatch-area {
    min-height: 100vh;
    justify-content: center;
}

.stopwatch.fullscreen .time-display,
.stopwatch:fullscreen .time-display {
    background: transparent;
    box-shadow: none;
    padding: 4rem 2rem;
    border-radius: 0;
}

.stopwatch.fullscreen .main-time,
.stopwatch:fullscreen .main-time {
    font-size: 12rem;
    color: #ffffff;
}

.stopwatch.fullscreen .milliseconds,
.stopwatch:fullscreen .milliseconds {
    font-size: 6rem;
    color: #a0aec0;
}

.stopwatch.fullscreen .control-buttons button,
.stopwatch:fullscreen .control-buttons button {
    background: #4a5568;
    color: white;
    border: none;
}

.stopwatch.fullscreen .control-buttons button:hover,
.stopwatch:fullscreen .control-buttons button:hover {
    background: #718096;
    transform: translateY(-2px);
}

.stopwatch.fullscreen .laps-section,
.stopwatch.fullscreen .stats-section,
.stopwatch.fullscreen .action-buttons,
.stopwatch:fullscreen .laps-section,
.stopwatch:fullscreen .stats-section,
.stopwatch:fullscreen .action-buttons {
    display: none;
}

.converter-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-actions {
    display: flex;
    gap: 0.75rem;
    margin-left: auto;
}

.header-export-btn,
.header-clear-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.header-export-btn {
    background: #6366f1;
    color: white;
}

.header-export-btn:hover {
    background: #5b21b6;
}

.header-clear-btn {
    background: #64748b;
    color: white;
}

.header-clear-btn:hover {
    background: #475569;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.back-btn:hover {
    background: #e2e8f0;
    color: #334155;
}

.converter-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
}

.converter-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    padding-bottom: 4rem;
    overflow-y: auto;
    min-height: 0;
}

.stopwatch-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
}

.main-stopwatch-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    margin-bottom: 2rem;
}

.main-stopwatch-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
    margin-bottom: 2rem;
    position: relative;
}

.time-display {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 3rem;
    padding: 6rem 5rem;
    background: white;
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    min-height: 300px;
}

.time-content {
    display: flex;
    align-items: baseline;
    justify-content: center;
}

.main-time {
    font-size: 7.2rem;
    font-weight: 300;
    color: #1e293b;
    font-family: 'Courier New', monospace;
    line-height: 1;
}

.milliseconds {
    font-size: 3.6rem;
    font-weight: 300;
    color: #64748b;
    font-family: 'Courier New', monospace;
    margin-left: 0.6rem;
}

.control-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.control-buttons button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 120px;
    justify-content: center;
}

.start-btn,
.resume-btn {
    background: #10b981;
    color: white;
}

.start-btn:hover,
.resume-btn:hover {
    background: #059669;
    transform: translateY(-1px);
}

.pause-btn {
    background: #f59e0b;
    color: white;
}

.pause-btn:hover {
    background: #d97706;
    transform: translateY(-1px);
}

.lap-btn {
    background: #3b82f6;
    color: white;
}

.lap-btn:hover {
    background: #2563eb;
    transform: translateY(-1px);
}

.reset-btn {
    background: #ef4444;
    color: white;
}

.reset-btn:hover {
    background: #dc2626;
    transform: translateY(-1px);
}

.fullscreen-btn {
    background: #8b5cf6;
    color: white;
}

.fullscreen-btn:hover {
    background: #7c3aed;
    transform: translateY(-1px);
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1.5rem 0;
}

.laps-section {
    margin-bottom: 3rem;
}

.laps-container {
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.laps-header {
    display: grid;
    grid-template-columns: 80px 1fr 1fr;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    font-weight: 600;
    color: #475569;
    font-size: 0.875rem;
}

.laps-list {
    max-height: 300px;
    overflow-y: auto;
}

.lap-item {
    display: grid;
    grid-template-columns: 80px 1fr 1fr;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    font-family: 'Courier New', monospace;
    transition: background-color 0.2s;
}

.lap-item:hover {
    background: #f8fafc;
}

.lap-item:last-child {
    border-bottom: none;
}

.lap-item.fastest {
    background: #ecfdf5;
    color: #059669;
}

.lap-item.slowest {
    background: #fef2f2;
    color: #dc2626;
}

.lap-number {
    font-weight: 600;
    color: #64748b;
}

.stats-section {
    margin-bottom: 3rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.stat-item {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.stat-label {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 0.5rem;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    font-family: 'Courier New', monospace;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 3rem;
}

.export-btn,
.clear-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.export-btn {
    background: #6366f1;
    color: white;
}

.export-btn:hover {
    background: #5b21b6;
}

.clear-btn {
    background: #64748b;
    color: white;
}

.clear-btn:hover {
    background: #475569;
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

@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 3rem;
    }

    .main-stopwatch-area {
        min-height: 60vh;
    }

    .time-display {
        padding: 4.8rem 3rem;
        min-height: 240px;
    }

    .main-time {
        font-size: 4.8rem;
    }

    .milliseconds {
        font-size: 2.6rem;
    }

    .control-buttons {
        gap: 0.5rem;
    }

    .control-buttons button {
        padding: 0.75rem 1rem;
        min-width: 100px;
        font-size: 0.875rem;
    }

    .laps-header,
    .lap-item {
        grid-template-columns: 60px 1fr 1fr;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .action-buttons {
        margin-bottom: 2rem;
    }
}
</style>