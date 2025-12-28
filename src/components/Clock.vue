<template>
    <div class="clock" :class="[{ fullscreen: isFullscreen }, `style-${clockStyle}`]">
        <div class="converter-header" v-if="!isFullscreen">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">数字时钟</h2>
            <div class="converter-actions">
                <button @click="toggleStyle" class="control-btn" title="切换风格">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5L19 7l-1.5 1.5M5 17l1.5-1.5L5 14"/>
                    </svg>
                </button>
                <button @click="toggle24Hour" class="control-btn" :title="is24Hour ? '切换到12小时制' : '切换到24小时制'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                        <text x="12" y="18" text-anchor="middle" font-size="6" fill="currentColor">{{ is24Hour ? '24' : '12' }}</text>
                    </svg>
                </button>
                <button @click="toggleMilliseconds" class="control-btn" :title="showMilliseconds ? '隐藏毫秒' : '显示毫秒'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 7v5l3 3"/>
                        <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    </svg>
                </button>
                <button @click="toggleLunar" class="control-btn" :title="showLunar ? '隐藏农历' : '显示农历'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                </button>
                <button @click="toggleFullscreen" class="control-btn" title="全屏显示">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                </button>
            </div>
        </div>

        <div class="converter-content">
            <div class="digital-display" :class="clockStyle" @dblclick="toggleFullscreen">
                <!-- 时间显示 -->
                <div class="time-display" v-if="clockStyle !== 'analog'">
                    <div class="time-digits">
                        <span class="digit-group">{{ timeHours }}</span>
                        <span class="separator" :class="{ blink: showSeconds }">:</span>
                        <span class="digit-group">{{ timeMinutes }}</span>
                        <span v-if="showSeconds" class="separator">:</span>
                        <span v-if="showSeconds" class="digit-group seconds">{{ timeSeconds }}</span>
                        <span v-if="showSeconds && showMilliseconds" class="separator milliseconds">.</span>
                        <span v-if="showSeconds && showMilliseconds" class="digit-group milliseconds">{{ timeMilliseconds }}</span>
                    </div>
                    <div class="ampm" v-if="!is24Hour">{{ ampm }}</div>
                </div>

                <!-- 模拟时钟 -->
                <div class="analog-clock" v-if="clockStyle === 'analog'">

                    <!-- 大刻度（12个小时刻度）带数字 -->
                    <div v-for="i in 12" :key="`hour-tick-${i}`" 
                         class="hour-tick" 
                         :style="{ transform: `rotate(${i * 30}deg)` }">
                        <div class="tick-number" :style="{ transform: `rotate(${-i * 30}deg)` }">
                            {{ i }}
                        </div>
                    </div>
                    
                    <!-- 小刻度（分钟刻度，排除与小时刻度重叠的） -->
                    <div v-for="i in 60" :key="`minute-tick-${i}`" 
                         v-show="i % 5 !== 0"
                         class="minute-tick" 
                         :style="{ transform: `rotate(${i * 6}deg)` }">
                    </div>
                    
                    <!-- 日期窗口 - 3点钟位置上方 -->
                    <div class="date-window">
                        <div class="date-number">{{ currentDateTime.getDate() }}</div>
                    </div>
                    
                    <!-- 星期窗口 - 3点钟位置左侧 -->
                    <div class="day-window">
                        <div class="day-text">{{ getWeekdayShort() }}</div>
                    </div>
                    
                    <!-- 时针 -->
                    <div class="clock-hour-hand" :style="{ transform: `rotate(${hourAngle}deg)` }"></div>
                    <!-- 分针 -->
                    <div class="clock-minute-hand" :style="{ transform: `rotate(${minuteAngle}deg)` }"></div>
                    <!-- 秒针 -->
                    <div class="clock-second-hand" v-if="showSeconds" :style="{ transform: `rotate(${secondAngle}deg)` }"></div>
                    <!-- 中心点 -->
                    <div class="clock-center"></div>
                </div>

                <!-- 日期显示 -->
                <div class="date-display" v-if="clockStyle !== 'analog'">
                    <div class="date-line">{{ currentDate }}</div>
                    <div class="lunar-line" v-if="showLunar">{{ currentLunarDate }}</div>
                    <div class="weekday-line" v-if="showWeekday">{{ currentWeekday }}</div>
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
import { Solar } from 'lunar-javascript'
import { useWakeLock } from '../composables/useWakeLock'

defineEmits<{
    back: []
}>()

// 状态管理
const isFullscreen = ref(false)
const showSeconds = ref(true)
const showMilliseconds = ref(true)
const showLunar = ref(true)
const showWeekday = ref(true)
const is24Hour = ref(true)
const clockStyle = ref<'minimal' | 'digital' | 'analog' | 'card' | 'immersive'>('digital')

// 防止息屏
const { requestWakeLock, releaseWakeLock } = useWakeLock()

// 时间状态
const currentDateTime = ref(new Date())
const intervalId = ref<number | null>(null)

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 计算属性
const timeHours = computed(() => {
    const now = currentDateTime.value
    if (is24Hour.value) {
        return now.getHours().toString().padStart(2, '0')
    } else {
        const hours = now.getHours()
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
        return displayHours.toString().padStart(2, '0')
    }
})

const timeMinutes = computed(() => {
    return currentDateTime.value.getMinutes().toString().padStart(2, '0')
})

const timeSeconds = computed(() => {
    return currentDateTime.value.getSeconds().toString().padStart(2, '0')
})

const timeMilliseconds = computed(() => {
    return currentDateTime.value.getMilliseconds().toString().padStart(3, '0')
})

const ampm = computed(() => {
    if (is24Hour.value) return ''
    return currentDateTime.value.getHours() >= 12 ? 'PM' : 'AM'
})

const currentDate = computed(() => {
    const now = currentDateTime.value
    return now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
})

const currentLunarDate = computed(() => {
    if (!showLunar.value) return ''
    
    const now = currentDateTime.value
    return getLunarDate(now)
})

const currentWeekday = computed(() => {
    if (!showWeekday.value) return ''
    
    const now = currentDateTime.value
    return now.toLocaleDateString('zh-CN', {
        weekday: 'long'
    })
})

// 获取星期简写
const getWeekdayShort = (): string => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    return days[currentDateTime.value.getDay()]
}

// 获取农历日期
const getLunarDay = (): string => {
    try {
        const now = currentDateTime.value
        const solar = Solar.fromDate(now)
        const lunar = solar.getLunar()
        
        // 直接使用库提供的中文日期
        return lunar.getDayInChinese()
    } catch (error) {
        console.error('农历日期计算错误:', error)
        return '初一'
    }
}

// 罗马数字转换函数
const getRomanNumeral = (num: number): string => {
    const romanNumerals: Record<number, string> = {
        1: 'I',
        2: 'II', 
        3: 'III',
        4: 'IV',
        5: 'V',
        6: 'VI',
        7: 'VII',
        8: 'VIII',
        9: 'IX',
        10: 'X',
        11: 'XI',
        12: 'XII'
    }
    return romanNumerals[num] || num.toString()
}

// 模拟时钟指针角度计算
const hourAngle = computed(() => {
    const now = currentDateTime.value
    const hours = now.getHours() % 12
    const minutes = now.getMinutes()
    // 每小时30度，数字1在30度位置，所以1点时指针应该指向30度
    return (hours * 30 + minutes * 0.5)
})

const minuteAngle = computed(() => {
    const now = currentDateTime.value
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    // 每分钟6度，数字1在30度位置，所以16分钟时指针应该指向96度(16*6)
    return (minutes * 6 + seconds * 0.1)
})

const secondAngle = computed(() => {
    const now = currentDateTime.value
    const seconds = now.getSeconds()
    // 每秒6度
    return (seconds * 6)
})

// 农历计算函数 - 使用专业的lunar-javascript库
const getLunarDate = (date: Date): string => {
    try {
        // 使用Solar类创建公历日期对象
        const solar = Solar.fromDate(date)
        
        // 转换为农历
        const lunar = solar.getLunar()
        
        // 获取天干地支年份
        const ganZhi = lunar.getYearInGanZhi()
        
        // 获取生肖
        const shengXiao = lunar.getYearShengXiao()
        
        // 获取农历月份数字
        const monthNum = lunar.getMonth()
        
        // 手动处理月份名称，确保显示正确
        const monthNames = ['正月', '二月', '三月', '四月', '五月', '六月', 
                           '七月', '八月', '九月', '十月', '十一月', '腊月']
        const monthName = monthNames[monthNum - 1] || '未知月'
        
        // 获取农历日期名称
        const dayName = lunar.getDayInChinese()
        
        return `农历${ganZhi}年 (${shengXiao}年) ${monthName}${dayName}`
    } catch (error) {
        console.error('农历计算错误:', error)
        // 如果出错，返回基本信息
        const year = date.getFullYear()
        const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
        const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
        const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
        
        const ganIndex = (year - 4) % 10
        const zhiIndex = (year - 4) % 12
        const animalIndex = (year - 4) % 12
        
        return `农历${gan[ganIndex]}${zhi[zhiIndex]}年 (${animals[animalIndex]}年)`
    }
}

// 更新时间
const updateTime = () => {
    currentDateTime.value = new Date()
}

// 切换功能
const toggleStyle = () => {
    const styles: Array<'minimal' | 'digital' | 'analog' | 'card' | 'immersive'> = ['minimal', 'digital', 'analog', 'card', 'immersive']
    const currentIndex = styles.indexOf(clockStyle.value)
    const nextIndex = (currentIndex + 1) % styles.length
    const nextStyle = styles[nextIndex]
    if (nextStyle) {
        clockStyle.value = nextStyle
    }
    
    const styleNames: Record<'minimal' | 'digital' | 'analog' | 'card' | 'immersive', string> = {
        'minimal': '简约白色风格',
        'digital': '数字显示屏风格',
        'analog': '模拟时钟风格',
        'card': '卡片式设计',
        'immersive': '全屏沉浸式'
    }
    
    showMessage(`切换到${styleNames[clockStyle.value]}`, 'success')
}

const toggle24Hour = () => {
    is24Hour.value = !is24Hour.value
    showMessage(`切换到${is24Hour.value ? '24' : '12'}小时制`, 'success')
}

const toggleLunar = () => {
    showLunar.value = !showLunar.value
    showMessage(`${showLunar.value ? '显示' : '隐藏'}农历`, 'success')
}

const toggleMilliseconds = () => {
    showMilliseconds.value = !showMilliseconds.value
    showMessage(`${showMilliseconds.value ? '显示' : '隐藏'}毫秒`, 'success')
}

// 防止息屏功能
const toggleFullscreen = async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen()
            isFullscreen.value = true
            // 全屏时启用防息屏
            requestWakeLock(showMessage)
            showMessage('双击时钟可退出全屏', 'success')
        } else {
            await document.exitFullscreen()
            isFullscreen.value = false
            // 退出全屏时释放防息屏
            releaseWakeLock(showMessage)
        }
    } catch (error) {
        isFullscreen.value = !isFullscreen.value
        if (isFullscreen.value) {
            // 组件全屏时也启用防息屏
            requestWakeLock(showMessage)
            showMessage('双击时钟可退出全屏', 'success')
        } else {
            // 退出组件全屏时释放防息屏
            releaseWakeLock(showMessage)
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
    if (event.code === 'Escape') {
        event.preventDefault()
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else if (isFullscreen.value) {
            isFullscreen.value = false
        }
    } else if (event.code === 'KeyF' || event.code === 'F11') {
        event.preventDefault()
        toggleFullscreen()
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

// 生命周期
onMounted(() => {
    // 开始时间更新
    updateTime()
    intervalId.value = window.setInterval(updateTime, 1) // 1ms更新一次以显示完整毫秒
    
    // 添加事件监听
    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    showMessage('双击时钟进入全屏模式', 'success')
})

onUnmounted(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value)
    }
    // 组件卸载时释放防息屏
    releaseWakeLock()
    document.removeEventListener('keydown', handleKeyPress)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.clock {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: 'Courier New', 'SF Mono', 'Monaco', monospace;
    position: relative;
    overflow: hidden;
    background: #000000; /* 默认背景 */
}

/* 不同风格的背景 */
.clock.style-minimal {
    background: #f5f5f7;
}

.clock.style-digital {
    background: #000000;
}

.clock.style-analog {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.clock.style-card {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.clock.style-immersive {
    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
}

.clock.fullscreen,
.clock:fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
}

.converter-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    position: relative;
}

.clock.fullscreen .converter-header,
.clock:fullscreen .converter-header {
    display: none;
}

.back-btn {
    position: absolute;
    left: 24px;
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

.converter-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.converter-actions {
    position: absolute;
    right: 24px;
    display: flex;
    gap: 8px;
}

.converter-actions .control-btn {
    padding: 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 12px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
}

.converter-actions .control-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.converter-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    position: relative;
}

/* 基础数字显示样式 */
.digital-display {
    border-radius: 1rem;
    padding: 2rem;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

/* 简约白色风格 - 类似苹果风格 */
.digital-display.minimal {
    background: #ffffff;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: fit-content;
    min-width: 0;
}

/* 简约白色风格

.digital-display.minimal .time-digits {
    color: #1d1d1f;
    text-shadow: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 300;
}

.digital-display.minimal .digit-group {
    background: transparent;
    border: none;
}

.digital-display.minimal .separator {
    color: #1d1d1f;
    text-shadow: none;
}

.digital-display.minimal .ampm {
    color: #86868b;
    text-shadow: none;
    background: transparent;
    border: none;
}

.digital-display.minimal .date-display {
    color: #86868b;
}

.digital-display.minimal .date-line,
.digital-display.minimal .lunar-line,
.digital-display.minimal .weekday-line {
    color: #86868b;
    text-shadow: none;
    background: transparent;
    border: none;
}

/* 数字显示屏风格 - LED效果 */
.digital-display.digital {
    background: #0a0a0a;
    border: 3px solid #333;
    box-shadow: 
        inset 0 0 20px rgba(0, 0, 0, 0.8),
        0 0 30px rgba(0, 255, 0, 0.1);
    width: fit-content;
    min-width: 0;
}

.digital-display.digital:hover {
    box-shadow: 
        inset 0 0 20px rgba(0, 0, 0, 0.8),
        0 0 40px rgba(0, 255, 0, 0.2);
}

.digital-display.digital::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 49%, rgba(0, 255, 0, 0.03) 50%, transparent 51%);
    pointer-events: none;
    border-radius: 0.7rem;
}

.digital-display.digital .time-digits {
    color: #00ff00;
    text-shadow: 
        0 0 10px #00ff00,
        0 0 20px #00ff00,
        0 0 30px #00ff00;
    font-family: 'Courier New', 'SF Mono', monospace;
}

.digital-display.digital .digit-group {
    background: rgba(0, 255, 0, 0.05);
    border: 1px solid rgba(0, 255, 0, 0.2);
}

.digital-display.digital .separator {
    color: #00ff00;
    text-shadow: 
        0 0 10px #00ff00,
        0 0 20px #00ff00;
}

.digital-display.digital .ampm {
    color: #00cc00;
    text-shadow: 
        0 0 8px #00cc00,
        0 0 16px #00cc00;
    background: rgba(0, 255, 0, 0.05);
    border: 1px solid rgba(0, 255, 0, 0.2);
}

.digital-display.digital .date-display {
    color: #00aa00;
}

.digital-display.digital .date-line {
    text-shadow: 0 0 8px #00aa00;
}

.digital-display.digital .lunar-line {
    color: #008800;
    text-shadow: 0 0 6px #008800;
    background: rgba(0, 255, 0, 0.03);
    border: 1px solid rgba(0, 255, 0, 0.1);
}

.digital-display.digital .weekday-line {
    color: #006600;
    text-shadow: 0 0 6px #006600;
}

/* 模拟时钟风格 - 真实时钟设计 */
.digital-display.analog {
    background: 
        radial-gradient(circle at center, #ffffff 0%, #f8f9fa 60%, #e9ecef 85%, #dee2e6 100%);
    border: 20px solid #2c3e50;
    border-radius: 50%;
    width: 600px;
    height: 600px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    box-shadow: 
        0 0 0 8px #34495e,
        0 0 0 12px #2c3e50,
        0 20px 60px rgba(0, 0, 0, 0.3),
        inset 0 0 100px rgba(0, 0, 0, 0.05);
}

/* 外圈装饰 */
.digital-display.analog::before {
    content: '';
    position: absolute;
    top: -30px;
    left: -30px;
    right: -30px;
    bottom: -30px;
    border: 4px solid #1a252f;
    border-radius: 50%;
    box-shadow: 
        0 0 0 2px #34495e,
        0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 内圈装饰 */
.digital-display.analog::after {
    content: '';
    position: absolute;
    top: 40px;
    left: 40px;
    right: 40px;
    bottom: 40px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
}





/* 大刻度（小时刻度） */
.hour-tick {
    position: absolute;
    top: 0;
    left: 50%;
    width: 0;
    height: 50%;
    transform-origin: center bottom;
}

.hour-tick::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    width: 6px;
    height: 25px;
    background: #2c3e50;
    transform: translateX(-50%);
    border-radius: 3px;
}



.tick-number {
    position: absolute;
    top: 40px;
    left: 50%;
    width: 35px;
    height: 35px;
    text-align: center;
    line-height: 35px;
    font-size: 32px;
    font-weight: bold;
    color: #2c3e50;
    font-family: 'Times New Roman', serif;
    transform: translateX(-50%);
    margin-left: -17.5px;
}

/* 小刻度（分钟刻度） */
.minute-tick {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 50%;
    transform-origin: center bottom;
}

.minute-tick::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    width: 2px;
    height: 12px;
    background: #7f8c8d;
    transform: translateX(-50%);
}

/* 刻度系统 */
.clock-ticks {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.tick {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 50%;
    transform-origin: center bottom;
}

.tick span {
    display: block;
    width: 4px;
    height: 20px;
    background: #343a40;
    margin-left: -1px;
    border-radius: 2px;
}

/* 刻度容器 */
.tick-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 50%;
    transform-origin: center bottom;
}

/* 刻度线 */
.tick-mark {
    position: absolute;
    top: 0;
    left: 50%;
    width: 3px;
    height: 15px;
    background: #343a40;
    transform: translateX(-50%);
}

/* 刻度 */
.clock-tick {
    position: absolute;
    background: #343a40;
}

/* 日期窗口 - 真实手表样式 */
.date-window {
    position: absolute;
    right: 120px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 20px;
    background: #ffffff;
    border: 1px solid #666;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
        inset 0 0 0 1px rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.3);
    z-index: 1;
}

/* 星期窗口 - 真实手表样式 */
.day-window {
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 20px;
    background: #ffffff;
    border: 1px solid #666;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
        inset 0 0 0 1px rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.3);
    z-index: 1;
}

.date-number {
    font-size: 14px;
    font-weight: bold;
    color: #000000;
    font-family: 'Arial', 'Helvetica', sans-serif;
    line-height: 1;
}

.day-text {
    font-size: 10px;
    font-weight: bold;
    color: #000000;
    font-family: 'Arial', 'Helvetica', sans-serif;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.2px;
}

/* 指针 - 真实时钟样式 */
.clock-hour-hand, .clock-minute-hand, .clock-second-hand {
    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: center bottom;
}

.clock-hour-hand {
    width: 8px;
    height: 150px;
    background: #2c3e50;
    margin-left: -4px;
    margin-top: -150px;
    z-index: 3;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.clock-minute-hand {
    width: 4px;
    height: 200px;
    background: #2c3e50;
    margin-left: -2px;
    margin-top: -200px;
    z-index: 2;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.clock-second-hand {
    width: 2px;
    height: 220px;
    background: #e74c3c;
    margin-left: -1px;
    margin-top: -220px;
    z-index: 4;
    border-radius: 1px;
}

.clock-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 14px;
    height: 14px;
    background: #2c3e50;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.digital-display.analog .time-digits {
    color: #212529;
    text-shadow: none;
    font-family: 'Times New Roman', serif;
    font-weight: bold;
    font-size: clamp(2rem, 8vw, 3rem);
}

.digital-display.analog .digit-group {
    background: transparent;
    border: none;
}

.digital-display.analog .separator {
    color: #212529;
    text-shadow: none;
}

.digital-display.analog .ampm {
    color: #6c757d;
    text-shadow: none;
    background: transparent;
    border: none;
    font-size: clamp(1rem, 3vw, 1.5rem);
}

.digital-display.analog .date-display {
    color: #495057;
    font-size: clamp(0.8rem, 2vw, 1rem);
    position: absolute;
    bottom: 80px;
}

.digital-display.analog .date-line,
.digital-display.analog .lunar-line,
.digital-display.analog .weekday-line {
    color: #6c757d;
    text-shadow: none;
    background: transparent;
    border: none;
    font-size: 0.8em;
}



/* 卡片式设计 - 现代简约风格 */
.digital-display.card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 24px;
    box-shadow: 
        0 20px 60px rgba(102, 126, 234, 0.4),
        0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(20px);
    position: relative;
    overflow: hidden;
    width: fit-content;
    min-width: 0;
    will-change: auto;
    transform: translateZ(0);
}

.digital-display.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    border-radius: 24px;
    pointer-events: none;
}

.digital-display.card .time-digits {
    color: #ffffff;
    text-shadow: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 200;
    letter-spacing: -0.02em;
}

.digital-display.card .digit-group {
    background: transparent;
    border: none;
}

.digital-display.card .separator {
    color: rgba(255, 255, 255, 0.8);
    text-shadow: none;
}

.digital-display.card .ampm {
    color: rgba(255, 255, 255, 0.7);
    text-shadow: none;
    background: transparent;
    border: none;
    font-weight: 300;
}

.digital-display.card .date-display {
    color: rgba(255, 255, 255, 0.8);
    margin-top: 1rem;
}

.digital-display.card .date-line {
    text-shadow: none;
    font-weight: 300;
    font-size: 1.1em;
}

.digital-display.card .lunar-line {
    color: rgba(255, 255, 255, 0.6);
    text-shadow: none;
    background: transparent;
    border: none;
    font-weight: 300;
    font-size: 0.9em;
    margin-top: 0.5rem;
}

.digital-display.card .weekday-line {
    color: rgba(255, 255, 255, 0.6);
    text-shadow: none;
    font-weight: 300;
    text-transform: capitalize;
}

/* 全屏沉浸式 - 专注大字体显示 */
.digital-display.immersive {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 1rem;
}

.digital-display.immersive .time-digits {
    color: #ffffff;
    text-shadow: 
        0 0 20px rgba(255, 255, 255, 0.5),
        0 0 40px rgba(255, 255, 255, 0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 100;
    font-size: clamp(6rem, 15vw, 12rem);
}

.digital-display.immersive .digit-group {
    background: transparent;
    border: none;
}

.digital-display.immersive .separator {
    color: #ffffff;
    text-shadow: 
        0 0 20px rgba(255, 255, 255, 0.5),
        0 0 40px rgba(255, 255, 255, 0.3);
}

.digital-display.immersive .ampm {
    color: rgba(255, 255, 255, 0.7);
    text-shadow: 
        0 0 15px rgba(255, 255, 255, 0.4);
    background: transparent;
    border: none;
    font-size: clamp(2rem, 5vw, 4rem);
}

.digital-display.immersive .date-display {
    color: rgba(255, 255, 255, 0.6);
    font-size: clamp(1.2rem, 3vw, 2rem);
}

.digital-display.immersive .date-line,
.digital-display.immersive .lunar-line,
.digital-display.immersive .weekday-line {
    color: rgba(255, 255, 255, 0.6);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    background: transparent;
    border: none;
}

.time-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    width: 100%;
    min-height: 120px;
    padding: 0 2rem;
}

.time-digits {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(4rem, 12vw, 8rem);
    font-weight: bold;
    letter-spacing: 0.1em;
    font-family: 'Courier New', 'SF Mono', 'Monaco', 'Consolas', monospace;
    white-space: nowrap;
    flex-wrap: nowrap;
    will-change: auto;
    transform: translateZ(0);
    line-height: 1;
    height: 100%;
}

.digit-group {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5ch;
    height: 1.2em;
    text-align: center;
    border-radius: 0.2em;
    padding: 0;
    flex-shrink: 0;
    line-height: 1;
}

.digit-group.milliseconds {
    font-size: 0.8em;
    opacity: 0.8;
    width: 4ch;
    height: 1.2em;
    flex-shrink: 0;
}

.separator {
    margin: 0;
    flex-shrink: 0;
    width: 0.6ch;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.separator.milliseconds {
    font-size: 0.8em;
    opacity: 0.8;
    width: 0.4ch;
}

.separator.milliseconds {
    font-size: 0.8em;
    opacity: 0.8;
    width: 0.5ch;
}

.separator {
    margin: 0 0.2em;
}

.separator.blink {
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0.3; }
}

.ampm {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: bold;
    margin-left: 1rem;
    padding: 0.2em 0.4em;
    border-radius: 0.3em;
}

.date-display {
    text-align: center;
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    margin-top: 3rem;
}

.date-line {
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.lunar-line {
    margin-bottom: 0.5rem;
    font-size: 0.9em;
    padding: 0.3em 0.8em;
    border-radius: 1em;
    display: inline-block;
}

.weekday-line {
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 0.2em;
}


/* 全屏模式样式 */
.clock.fullscreen .converter-content,
.clock:fullscreen .converter-content {
    padding: 0;
}

.clock.fullscreen .digital-display,
.clock:fullscreen .digital-display {
    padding: 1rem;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.clock.fullscreen .digital-display.digital,
.clock:fullscreen .digital-display.digital {
    border: none;
    background: transparent;
    box-shadow: none;
}

.clock.fullscreen .digital-display.digital::before,
.clock:fullscreen .digital-display.digital::before {
    display: none;
}

.clock.fullscreen .digital-display.analog,
.clock:fullscreen .digital-display.analog {
    width: 80vmin;
    height: 80vmin;
    border-width: 3vmin;
}

.clock.fullscreen .digital-display.analog::before,
.clock:fullscreen .digital-display.analog::before {
    top: -4vmin;
    left: -4vmin;
    right: -4vmin;
    bottom: -4vmin;
    border-width: 0.5vmin;
}

.clock.fullscreen .digital-display.analog::after,
.clock:fullscreen .digital-display.analog::after {
    top: 6vmin;
    left: 6vmin;
    right: 6vmin;
    bottom: 6vmin;
}

.clock.fullscreen .hour-tick::before,
.clock:fullscreen .hour-tick::before {
    top: 1.5vmin;
    width: 0.8vmin;
    height: 4vmin;
}

.clock.fullscreen .minute-tick::before,
.clock:fullscreen .minute-tick::before {
    top: 1.5vmin;
    width: 0.3vmin;
    height: 2vmin;
}

.clock.fullscreen .tick-number,
.clock:fullscreen .tick-number {
    top: 6vmin;
    width: 5vmin;
    height: 5vmin;
    line-height: 5vmin;
    font-size: 4vmin;
    margin-left: -2.5vmin;
}

.clock.fullscreen .clock-hour-hand,
.clock:fullscreen .clock-hour-hand {
    width: 1.2vmin;
    height: 20vmin;
    margin-left: -0.6vmin;
    margin-top: -20vmin;
}

.clock.fullscreen .clock-minute-hand,
.clock:fullscreen .clock-minute-hand {
    width: 0.6vmin;
    height: 26vmin;
    margin-left: -0.3vmin;
    margin-top: -26vmin;
}

.clock.fullscreen .clock-second-hand,
.clock:fullscreen .clock-second-hand {
    width: 0.3vmin;
    height: 28vmin;
    margin-left: -0.15vmin;
    margin-top: -28vmin;
}

.clock.fullscreen .clock-center,
.clock:fullscreen .clock-center {
    width: 2vmin;
    height: 2vmin;
}

.clock.fullscreen .date-window,
.clock:fullscreen .date-window {
    right: 15vmin;
    width: 4.5vmin;
    height: 2.8vmin;
    border-width: 0.15vmin;
    border-radius: 0.3vmin;
}

.clock.fullscreen .date-number,
.clock:fullscreen .date-number {
    font-size: 2vmin;
}

.clock.fullscreen .day-window,
.clock:fullscreen .day-window {
    right: 21vmin;
    width: 4.5vmin;
    height: 2.8vmin;
    border-width: 0.15vmin;
    border-radius: 0.3vmin;
}

.clock.fullscreen .day-text,
.clock:fullscreen .day-text {
    font-size: 1.4vmin;
}



.clock.fullscreen .time-display,
.clock:fullscreen .time-display {
    width: 100%;
    height: auto;
    margin: 0;
    padding: 0 2rem;
}


.clock.fullscreen .time-digits,
.clock:fullscreen .time-digits {
    font-size: clamp(4rem, 15vw, 10rem);
    white-space: nowrap;
    overflow: visible;
}

.clock.fullscreen .digital-display.analog .time-digits,
.clock:fullscreen .digital-display.analog .time-digits {
    font-size: clamp(3rem, 10vw, 6rem);
}

.clock.fullscreen .ampm,
.clock:fullscreen .ampm {
    font-size: clamp(2rem, 6vw, 4rem);
}

.clock.fullscreen .digital-display.analog .ampm,
.clock:fullscreen .digital-display.analog .ampm {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
}

.clock.fullscreen .date-display,
.clock:fullscreen .date-display {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
}

.clock.fullscreen .digital-display.analog .date-display,
.clock:fullscreen .digital-display.analog .date-display {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    bottom: 10vmin;
}

.clock.fullscreen .controls,
.clock:fullscreen .controls {
    display: none;
}

/* 消息提示 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-family: inherit;
}

.message-toast.success {
    border-color: #22c55e;
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
}

.message-toast.error {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
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
    }

    .digital-display {
        padding: 2rem 1rem;
    }

    .digital-display.analog {
        width: 300px;
        height: 300px;
        border-width: 6px;
    }

    .digital-display.analog div[class^="number-"] {
        font-size: 18px;
        width: 24px;
        height: 24px;
        line-height: 24px;
    }

    .digital-display.analog .hour-hand {
        height: 60px;
        margin-top: -60px;
    }

    .digital-display.analog .minute-hand {
        height: 85px;
        margin-top: -85px;
    }

    .digital-display.analog .second-hand {
        height: 100px;
        margin-top: -100px;
    }

    .digital-display.analog .center-dot {
        width: 10px;
        height: 10px;
    }

    .controls {
        gap: 0.5rem;
    }

    .control-btn {
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
    }
}

@media (max-width: 480px) {
    .converter-header {
        padding: 0.75rem 1rem;
    }

    .digital-display {
        padding: 1.5rem 0.5rem;
    }

    .digital-display.analog {
        width: 250px;
        height: 250px;
        border-width: 4px;
    }

    .digital-display.analog div[class^="number-"] {
        font-size: 14px;
        width: 20px;
        height: 20px;
        line-height: 20px;
    }

    .digital-display.analog .hour-hand {
        height: 50px;
        margin-top: -50px;
    }

    .digital-display.analog .minute-hand {
        height: 70px;
        margin-top: -70px;
    }

    .digital-display.analog .second-hand {
        height: 80px;
        margin-top: -80px;
    }

    .digital-display.analog .center-dot {
        width: 8px;
        height: 8px;
    }

    .time-digits {
        font-size: clamp(2.5rem, 12vw, 5rem);
    }

    .digital-display.analog .time-digits {
        font-size: clamp(1.5rem, 6vw, 2.5rem);
    }

    .controls {
        flex-direction: column;
        align-items: center;
    }

    .control-btn {
        width: 100%;
        max-width: 200px;
    }
}

/* 扫描线效果 - 仅用于数字显示屏风格 */
.digital-display.digital::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    animation: scan 3s linear infinite;
    opacity: 0.3;
}

@keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(400px); }
}
</style>