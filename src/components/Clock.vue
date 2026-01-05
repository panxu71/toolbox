<template>
    <div class="clock" :class="[{ fullscreen: isFullscreen }, `style-${clockStyle}`]">
        <PageHeader :title="cardTitle" @back="$emit('back')" v-if="!isFullscreen">
            <template #actions>
                <HeaderActionButton 
                    icon="settings" 
                    tooltip="切换风格"
                    @click="toggleStyle" 
                />
                <HeaderActionButton 
                    icon="clock" 
                    :tooltip="is24Hour ? '切换到12小时制' : '切换到24小时制'"
                    @click="toggle24Hour" 
                />
                <HeaderActionButton 
                    icon="eye" 
                    :tooltip="showMilliseconds ? '隐藏毫秒' : '显示毫秒'"
                    @click="toggleMilliseconds" 
                />
                <HeaderActionButton 
                    icon="moon" 
                    :tooltip="showLunar ? '隐藏农历' : '显示农历'"
                    @click="toggleLunar" 
                />
                <HeaderActionButton 
                    icon="fullscreen" 
                    tooltip="全屏显示"
                    @click="toggleFullscreen" 
                />
            </template>
        </PageHeader>

        <div class="converter-content">
            <div class="digital-display" :class="clockStyle" ref="digitalDisplayRef">
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
    </div>
</template>

<script setup lang="ts">
import {  ref, computed, onMounted, onUnmounted, nextTick  } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { Solar } from 'lunar-javascript'
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
usePageTitle('clock')
const cardTitle = getCardTitle('clock')

const showSeconds = ref(true)
const showMilliseconds = ref(true)
const showLunar = ref(true)
const showWeekday = ref(true)
const is24Hour = ref(true)
const clockStyle = ref<'minimal' | 'digital' | 'analog' | 'card' | 'immersive'>('digital')

// 全屏功能（对整个页面进行全屏，而不是时钟元素）
const { isFullscreen, toggleFullscreen, setDoubleClickElement } = useFullscreen(true)

// 时间状态
const currentDateTime = ref(new Date())
const intervalId = ref<number | null>(null)
const digitalDisplayRef = ref<HTMLElement | null>(null)

import { useNotification } from '../composables/useNotification'

// 使用通知系统
const { success: showSuccess } = useNotification()
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
    return days[currentDateTime.value.getDay()] || 'SUN'
}

// 模拟时钟指针角度计算
const hourAngle = computed(() => {
    const now = currentDateTime.value
    const hours = now.getHours() % 12
    const minutes = now.getMinutes()
    return (hours * 30 + minutes * 0.5)
})

const minuteAngle = computed(() => {
    const now = currentDateTime.value
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    return (minutes * 6 + seconds * 0.1)
})

const secondAngle = computed(() => {
    const now = currentDateTime.value
    const seconds = now.getSeconds()
    return (seconds * 6)
})

// 农历计算函数
const getLunarDate = (date: Date): string => {
    try {
        const solar = Solar.fromDate(date)
        const lunar = solar.getLunar()
        const ganZhi = lunar.getYearInGanZhi()
        const shengXiao = lunar.getYearShengXiao()
        const monthNum = lunar.getMonth()
        const monthNames = ['正月', '二月', '三月', '四月', '五月', '六月', 
                           '七月', '八月', '九月', '十月', '十一月', '腊月']
        const monthName = monthNames[monthNum - 1] || '未知月'
        const dayName = lunar.getDayInChinese()
        
        return `农历${ganZhi}年 (${shengXiao}年) ${monthName}${dayName}`
    } catch (error) {
        console.error('农历计算错误:', error)
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
    
    showSuccess(`切换到${styleNames[clockStyle.value]}`)
}

const toggle24Hour = () => {
    is24Hour.value = !is24Hour.value
    showSuccess(`切换到${is24Hour.value ? '24' : '12'}小时制`)
}

const toggleLunar = () => {
    showLunar.value = !showLunar.value
    showSuccess(`${showLunar.value ? '显示' : '隐藏'}农历`)
}

const toggleMilliseconds = () => {
    showMilliseconds.value = !showMilliseconds.value
    showSuccess(`${showMilliseconds.value ? '显示' : '隐藏'}毫秒`)
}

// 键盘快捷键
const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'Escape') {
        event.preventDefault()
        if (isFullscreen.value) {
            toggleFullscreen()
        }
    } else if (event.code === 'KeyF' || event.code === 'F11') {
        event.preventDefault()
        toggleFullscreen()
    }
}

// 生命周期
onMounted(() => {
    updateTime()
    intervalId.value = window.setInterval(updateTime, 10)
    
    document.addEventListener('keydown', handleKeyPress)
    
    // 使用 nextTick 确保 DOM 元素已经渲染
    nextTick(() => {
        // 设置双击元素，但全屏目标设置为整个页面
        if (digitalDisplayRef.value) {
            setDoubleClickElement(digitalDisplayRef.value)
            // 不设置fullscreenTarget，让它使用默认的document.documentElement
        }
    })
    
    showSuccess('双击时钟进入全屏模式')
})

onUnmounted(() => {
    if (intervalId.value) {
        clearInterval(intervalId.value)
    }
    document.removeEventListener('keydown', handleKeyPress)
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
    background: #000000;
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
    min-height: 60vh;
}

/* 简约白色风格 */
.digital-display.minimal {
    background: #ffffff;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: fit-content;
    min-width: 0;
}

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

/* 数字显示屏风格 */
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

/* 模拟时钟风格 */
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
    min-height: auto;
}

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

/* 日期窗口 */
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

/* 星期窗口 */
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

/* 指针 */
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

/* 卡片式设计 */
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

/* 全屏沉浸式 */
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
    width: 100%;
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
    width: 0.5ch;
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
    margin-top: 2rem;
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
    padding: 0 !important;
    justify-content: center !important;
    align-items: center !important;
    width: 100vw !important;
    height: 100vh !important;
    display: flex !important;
    flex-direction: column !important;
}

.clock.fullscreen .digital-display,
.clock:fullscreen .digital-display {
    padding: 0 !important;
    width: auto !important;
    height: auto !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    min-height: auto !important;
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    border-radius: initial !important;
    background: transparent !important;
    box-shadow: none !important;
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
    background: 
        radial-gradient(circle at center, #ffffff 0%, #f8f9fa 60%, #e9ecef 85%, #dee2e6 100%) !important;
    border: 30px solid #2c3e50 !important;
    border-radius: 50% !important;
    width: 800px !important;
    height: 800px !important;
    min-width: 800px !important;
    min-height: 800px !important;
    max-width: 800px !important;
    max-height: 800px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    position: relative !important;
    box-shadow: 
        0 0 0 10px #34495e,
        0 0 0 15px #2c3e50,
        0 30px 80px rgba(0, 0, 0, 0.3),
        inset 0 0 120px rgba(0, 0, 0, 0.05) !important;
    min-height: auto !important;
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
    transform: none !important;
    box-sizing: content-box !important;
}

.clock.fullscreen .digital-display.analog::before,
.clock:fullscreen .digital-display.analog::before {
    content: '' !important;
    position: absolute !important;
    top: -40px !important;
    left: -40px !important;
    right: -40px !important;
    bottom: -40px !important;
    border: 5px solid #1a252f !important;
    border-radius: 50% !important;
    box-shadow: 
        0 0 0 3px #34495e,
        0 15px 40px rgba(0, 0, 0, 0.2) !important;
}

.clock.fullscreen .digital-display.analog::after,
.clock:fullscreen .digital-display.analog::after {
    content: '' !important;
    position: absolute !important;
    top: 50px !important;
    left: 50px !important;
    right: 50px !important;
    bottom: 50px !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    border-radius: 50% !important;
}

.clock.fullscreen .digital-display.analog .tick-number,
.clock:fullscreen .digital-display.analog .tick-number {
    font-size: 42px !important;
    width: 50px !important;
    height: 50px !important;
    line-height: 50px !important;
    top: 53px !important;
    margin-left: -25px !important;
}

.clock.fullscreen .digital-display.analog .hour-tick::before,
.clock:fullscreen .digital-display.analog .hour-tick::before {
    top: 13px !important;
    width: 8px !important;
    height: 33px !important;
    border-radius: 4px !important;
}

.clock.fullscreen .digital-display.analog .minute-tick::before,
.clock:fullscreen .digital-display.analog .minute-tick::before {
    top: 13px !important;
    width: 3px !important;
    height: 16px !important;
}

.clock.fullscreen .digital-display.analog .date-window,
.clock:fullscreen .digital-display.analog .date-window {
    right: 160px !important;
    width: 42px !important;
    height: 26px !important;
    border-radius: 3px !important;
}

.clock.fullscreen .digital-display.analog .day-window,
.clock:fullscreen .digital-display.analog .day-window {
    right: 213px !important;
    width: 42px !important;
    height: 26px !important;
    border-radius: 3px !important;
}

.clock.fullscreen .digital-display.analog .date-number,
.clock:fullscreen .digital-display.analog .date-number {
    font-size: 18px !important;
}

.clock.fullscreen .digital-display.analog .day-text,
.clock:fullscreen .digital-display.analog .day-text {
    font-size: 13px !important;
}

.clock.fullscreen .digital-display.analog .clock-hour-hand,
.clock:fullscreen .digital-display.analog .clock-hour-hand {
    width: 11px !important;
    height: 200px !important;
    margin-left: -5.5px !important;
    margin-top: -200px !important;
    border-radius: 5.5px !important;
}

.clock.fullscreen .digital-display.analog .clock-minute-hand,
.clock:fullscreen .digital-display.analog .clock-minute-hand {
    width: 5px !important;
    height: 267px !important;
    margin-left: -2.5px !important;
    margin-top: -267px !important;
    border-radius: 2.5px !important;
}

.clock.fullscreen .digital-display.analog .clock-second-hand,
.clock:fullscreen .digital-display.analog .clock-second-hand {
    width: 3px !important;
    height: 293px !important;
    margin-left: -1.5px !important;
    margin-top: -293px !important;
    border-radius: 1.5px !important;
}

.clock.fullscreen .digital-display.analog .clock-center,
.clock:fullscreen .digital-display.analog .clock-center {
    width: 18px !important;
    height: 18px !important;
}

.clock.fullscreen .time-digits,
.clock:fullscreen .time-digits {
    font-size: clamp(6rem, 15vw, 12rem);
    white-space: nowrap;
    overflow: visible;
}

.clock.fullscreen .ampm,
.clock:fullscreen .ampm {
    font-size: clamp(2rem, 6vw, 4rem);
}

.clock.fullscreen .date-display,
.clock:fullscreen .date-display {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    margin-top: 2rem;
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

    .time-digits {
        font-size: clamp(2.5rem, 12vw, 5rem);
    }
}

@media (max-width: 480px) {
    .digital-display {
        padding: 1.5rem 0.5rem;
    }

    .digital-display.analog {
        width: 250px;
        height: 250px;
        border-width: 4px;
    }

    .time-digits {
        font-size: clamp(2rem, 10vw, 4rem);
    }
}
</style>