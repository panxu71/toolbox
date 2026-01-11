<template>
    <div class="stopwatch">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton 
                    v-if="laps.length > 0" 
                    icon="download" 
                    tooltip="导出记录"
                    @click="exportLaps" 
                />
                <HeaderActionButton 
                    v-if="laps.length > 0" 
                    icon="clear" 
                    tooltip="清空记录"
                    @click="clearLaps" 
                />
            </template>
        </PageHeader>

        <div class="converter-content">
            <div class="stopwatch-container">
                <!-- 主秒表区域 -->
                <div class="main-stopwatch-area">
                    <!-- 时间显示和控制按钮的容器 -->
                    <div class="timer-display-card" ref="timerDisplayRef">
                        <!-- 时间显示 -->
                        <div class="time-display">
                            <div class="time-content">
                                <div class="main-time">{{ formatTime(currentTime) }}</div>
                                <div class="milliseconds">.{{ formatMilliseconds(currentTime) }}</div>
                            </div>
                        </div>

                        <!-- 控制按钮 -->
                        <div class="control-buttons">
                            <button v-if="!isRunning && currentTime === 0" class="control-btn start-btn" @click="start" @dblclick.stop>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                开始
                            </button>

                            <button v-if="isRunning" class="control-btn pause-btn" @click="pause" @dblclick.stop>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="6" y="4" width="4" height="16" />
                                    <rect x="14" y="4" width="4" height="16" />
                                </svg>
                                暂停
                            </button>

                            <button v-if="!isRunning && currentTime > 0" class="control-btn resume-btn" @click="resume" @dblclick.stop>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                继续
                            </button>

                            <button v-if="isRunning" class="control-btn lap-btn" @click="recordLap" @dblclick.stop>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12,6 12,12 16,14" />
                                </svg>
                                计次
                            </button>

                            <button v-if="currentTime > 0" class="control-btn reset-btn" @click="reset" @dblclick.stop>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                    <path d="M21 3v5h-5" />
                                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                    <path d="M3 21v-5h5" />
                                </svg>
                                重置
                            </button>

                            <button class="control-btn fullscreen-btn" @click="() => toggleFullscreen(timerDisplayRef)">
                                <svg v-if="!isFullscreen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                                </svg>
                                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                                </svg>
                                {{ isFullscreen ? '退出' : '全屏' }}
                            </button>
                        </div>
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
                            <span class="lap-timestamp">记录时间</span>
                        </div>
                        <div class="laps-list">
                            <div v-for="(lap, index) in reversedLaps" :key="lap.id"
                                :class="['lap-item', { 'fastest': lap.isFastest, 'slowest': lap.isSlowest }]">
                                <span class="lap-number">{{ laps.length - index }}</span>
                                <span class="lap-time">{{ formatTime(lap.lapTime) }}.{{ formatMilliseconds(lap.lapTime) }}</span>
                                <span class="lap-total">{{ formatTime(lap.totalTime) }}.{{ formatMilliseconds(lap.totalTime) }}</span>
                                <span class="lap-timestamp">{{ lap.timestamp }}</span>
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
                            <div class="stat-value">{{ formatTime(fastestLap) }}.{{ formatMilliseconds(fastestLap) }}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">最慢计次</div>
                            <div class="stat-value">{{ formatTime(slowestLap) }}.{{ formatMilliseconds(slowestLap) }}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">平均计次</div>
                            <div class="stat-value">{{ formatTime(averageLap) }}.{{ formatMilliseconds(averageLap) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useFullscreen } from '../composables/useFullscreen'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 根据卡片ID获取标题
function getCardTitle(cardId: string): string {
    // 遍历所有分类查找对应的卡片
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === cardId)
        if (card) {
            return card.title
        }
    }
    return cardId
}

// 状态管理
usePageTitle('stopwatch')
const cardTitle = getCardTitle('stopwatch')

const isRunning = ref(false)
const currentTime = ref(0)
const startTime = ref(0)
const pausedTime = ref(0)
const intervalId = ref<number | null>(null)

const timerDisplayRef = ref<HTMLElement | null>(null)

// 全屏功能
const { isFullscreen, toggleFullscreen, setDoubleClickElement, setFullscreenTarget } = useFullscreen(true)

// 计次记录
interface Lap {
    id: number
    lapTime: number
    totalTime: number
    timestamp: string // 添加时间戳字段
    isFastest?: boolean
    isSlowest?: boolean
}

const laps = ref<Lap[]>([])
const lapCounter = ref(0)

import { useNotification } from '../composables/useNotification'

// 使用通知系统
const { success: showSuccess, error: showError } = useNotification()
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

    showSuccess('秒表已开始')
}

const pause = () => {
    isRunning.value = false
    pausedTime.value = currentTime.value

    if (intervalId.value) {
        clearInterval(intervalId.value)
        intervalId.value = null
    }

    showSuccess('秒表已暂停')
}

const resume = () => {
    start()
    showSuccess('秒表已继续')
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

    showSuccess('秒表已重置')
}

// 计次功能
const recordLap = () => {
    if (!isRunning.value) return

    const previousTotalTime = laps.value.length > 0 ? (laps.value[laps.value.length - 1]?.totalTime || 0) : 0
    const lapTime = currentTime.value - previousTotalTime

    lapCounter.value++
    const now = new Date()
    const newLap: Lap = {
        id: lapCounter.value,
        lapTime,
        totalTime: currentTime.value,
        timestamp: now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }) + '.' + now.getMilliseconds().toString().padStart(3, '0')
    }

    laps.value.push(newLap)
    updateLapStats()
    showSuccess(`第 ${laps.value.length} 次计次已记录`)
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
    showSuccess('计次记录已清空')
}

// 导出功能
const exportLaps = () => {
    if (laps.value.length === 0) {
        showError('没有计次记录可导出')
        return
    }

    const data = [
        ['次数', '计次时间', '总时间', '记录时间'],
        ...laps.value.map((lap, index) => [
            (index + 1).toString(),
            `${formatTime(lap.lapTime)}.${formatMilliseconds(lap.lapTime)}`,
            `${formatTime(lap.totalTime)}.${formatMilliseconds(lap.totalTime)}`,
            lap.timestamp
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
        showSuccess('计次记录已导出')
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
    }
}

// 生命周期
// 生命周期
onMounted(() => {
    document.addEventListener('keydown', handleKeyPress)
    
    // 使用 nextTick 确保 DOM 元素已经渲染
    nextTick(() => {
        // 设置双击元素和全屏目标元素
        if (timerDisplayRef.value) {
            setDoubleClickElement(timerDisplayRef.value)
            setFullscreenTarget(timerDisplayRef.value)
        }
    })
    
    showSuccess('快捷键：空格键 开始/暂停，L键 计次，R键 重置，双击计时器进入全屏')
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress)
    if (intervalId.value) {
        clearInterval(intervalId.value)
    }
})
</script>

<style scoped>
.stopwatch {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.converter-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
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
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    cursor: pointer;
    transition: var(--transition);
}

.header-export-btn {
    background: var(--primary-color);
    color: white;
}

.header-export-btn:hover {
    background: var(--primary-hover);
}

.header-clear-btn {
    background: var(--error-color);
    color: white;
}

.header-clear-btn:hover {
    background: var(--error-color-dark);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.875rem;
}

.back-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.converter-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
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

.timer-display-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3rem;
}

.time-display {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6rem 5rem;
    background: var(--bg-card);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-color);
    min-height: 300px;
    margin-bottom: 3rem;
}

.control-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* 全屏模式样式 */
.timer-display-card:fullscreen {
    background: var(--bg-primary);
    border: none;
    border-radius: 0;
    padding: 2rem;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 4rem;
}

.timer-display-card:fullscreen .time-display {
    background: transparent;
    box-shadow: none;
    border: none;
    margin-bottom: 0;
    padding: 2rem;
}

.timer-display-card:fullscreen .time-content {
    display: flex;
    justify-content: center;
    align-items: center;
}

.timer-display-card:fullscreen .main-time {
    font-size: 12rem !important;
    font-weight: 300 !important;
    color: var(--text-primary);
}

.timer-display-card:fullscreen .milliseconds {
    font-size: 6rem !important;
    font-weight: 300 !important;
    color: var(--text-secondary);
}

.timer-display-card:fullscreen .control-buttons {
    gap: 2rem;
}

.timer-display-card:fullscreen .control-btn {
    padding: 1.5rem 3rem;
    font-size: 1.2rem;
    min-width: 150px;
}

.time-content {
    display: flex;
    align-items: baseline;
    justify-content: center;
}

.main-time {
    font-size: 7.2rem;
    font-weight: 300;
    color: var(--text-primary);
    font-family: 'Courier New', monospace;
    line-height: 1;
}

.milliseconds {
    font-size: 3.6rem;
    font-weight: 300;
    color: var(--text-secondary);
    font-family: 'Courier New', monospace;
    margin-left: 0.6rem;
}

.control-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.control-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: var(--radius-lg);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    min-width: 120px;
    justify-content: center;
}

.start-btn,
.resume-btn {
    background: var(--success-color);
    color: white;
}

.start-btn:hover,
.resume-btn:hover {
    background: var(--success-color-dark);
    transform: translateY(-1px);
}

.pause-btn {
    background: var(--warning-color);
    color: white;
}

.pause-btn:hover {
    background: var(--warning-color-dark);
    transform: translateY(-1px);
}

.lap-btn {
    background: var(--primary-color);
    color: white;
}

.lap-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.reset-btn {
    background: var(--error-color);
    color: white;
}

.reset-btn:hover {
    background: var(--error-color-dark);
    transform: translateY(-1px);
}

.fullscreen-btn {
    background: var(--primary-color);
    color: white;
}

.fullscreen-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1.5rem 0;
}

.laps-section {
    margin-bottom: 3rem;
}

.laps-container {
    background: var(--bg-card);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
}

.laps-header {
    display: grid;
    grid-template-columns: 80px 1fr 1fr 1.2fr;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.laps-list {
    max-height: 300px;
    overflow-y: auto;
}

.lap-item {
    display: grid;
    grid-template-columns: 80px 1fr 1fr 1.2fr;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    font-family: 'Courier New', monospace;
    transition: var(--transition);
}

.lap-item:hover {
    background: var(--bg-hover);
}

.lap-item:last-child {
    border-bottom: none;
}

.lap-item.fastest {
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.lap-item.slowest {
    background: var(--error-color-alpha);
    color: var(--error-color);
}

.lap-number {
    font-weight: 600;
    color: var(--text-secondary);
}

.lap-timestamp {
    font-size: 0.8rem;
    color: var(--text-tertiary);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
    background: var(--bg-card);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    text-align: center;
}

.stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    font-family: 'Courier New', monospace;
}

@media (max-width: 1024px) and (min-width: 769px) {
    .lap-timestamp {
        font-size: 0.75rem;
    }
    
    .laps-header,
    .lap-item {
        grid-template-columns: 70px 1fr 1fr 1fr;
        gap: 0.75rem;
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

    .timer-display-card .time-display {
        padding: 4.8rem 3rem;
        min-height: 240px;
    }

    .timer-display-card:fullscreen {
        gap: 3rem;
    }

    .timer-display-card:fullscreen .main-time {
        font-size: 8rem !important;
    }

    .timer-display-card:fullscreen .milliseconds {
        font-size: 4rem !important;
    }

    .timer-display-card:fullscreen .control-buttons {
        gap: 1rem;
        flex-wrap: wrap;
    }

    .timer-display-card:fullscreen .control-btn {
        padding: 1rem 2rem;
        font-size: 1rem;
        min-width: 120px;
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

    .control-btn {
        padding: 0.75rem 1rem;
        min-width: 100px;
        font-size: 0.875rem;
    }

    .laps-header,
    .lap-item {
        grid-template-columns: 50px 1fr 1fr;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
    }

    .lap-timestamp {
        display: none;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>