<template>
    <div class="teleprompter" :class="{ fullscreen: isFullscreen }">
        <PageHeader :title="pageTitle" @back="$emit('back')" v-if="!isFullscreen">
            <template #actions>
                <div class="formatter-actions">
                    <HeaderActionButton :icon="isPlaying ? 'pause' : 'play'" :tooltip="isPlaying ? '暂停滚动' : '开始播放（自动全屏）'" @click="togglePlay" />
                    <HeaderActionButton icon="reset" tooltip="重置位置" @click="resetScroll" />
                    <HeaderActionButton icon="fullscreen" tooltip="全屏显示" @click="toggleFullscreen" />
                    <HeaderActionButton icon="mirror" :tooltip="isMirrored ? '取消水平镜像' : '水平镜像显示'" @click="toggleMirror" />
                    <HeaderActionButton icon="flip" :tooltip="isVerticalFlipped ? '取消垂直反转' : '垂直反转显示'" @click="toggleVerticalFlip" />
                    <HeaderActionButton icon="copy" tooltip="复制文本内容" @click="copyText" :disabled="!scriptText" />
                    <HeaderActionButton icon="clear" tooltip="清空文本" @click="clearText" />
                </div>
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 控制面板 -->
            <div class="control-panel" v-if="!isFullscreen">
                <div class="control-group">
                    <label>滚动速度</label>
                    <input type="range" v-model="scrollSpeed" min="1" max="10" step="1" class="speed-slider">
                    <span class="speed-value">{{ scrollSpeed }}</span>
                </div>

                <div class="control-group">
                    <label>字体大小</label>
                    <input type="range" v-model="fontSize" min="16" max="72" step="2" class="font-slider">
                    <span class="font-value">{{ fontSize }}px</span>
                </div>

                <div class="control-group">
                    <label>文本颜色</label>
                    <input type="color" v-model="textColor" class="color-picker">
                </div>

                <div class="control-group">
                    <label>背景颜色</label>
                    <input type="color" v-model="backgroundColor" class="color-picker">
                </div>

                <div class="control-group">
                    <label>聚焦行数</label>
                    <input type="range" v-model="linesInFocus" min="1" max="5" step="1" class="font-slider">
                    <span class="font-value">{{ linesInFocus }}行</span>
                </div>

                <div class="control-group">
                    <button @click="loadSample" class="control-action-btn">示例文本</button>
                    <input type="file" @change="loadFile" accept=".txt" ref="fileInput" style="display: none">
                    <button @click="fileInput?.click()" class="control-action-btn">导入文件</button>
                </div>
            </div>

            <!-- 文本输入区域 -->
            <div class="text-input-area" v-if="!isFullscreen">
                <textarea v-model="scriptText" placeholder="请输入您的演讲稿或台词内容..." class="script-textarea"
                    rows="8"></textarea>
            </div>

            <!-- 提词器显示区域 -->
            <div class="teleprompter-display" :class="{
                mirrored: isMirrored,
                'vertical-flipped': isVerticalFlipped
            }" :style="{
                fontSize: fontSize + 'px',
                color: textColor,
                backgroundColor: backgroundColor
            }" ref="displayArea" @dblclick="toggleFullscreen">
                <!-- 聚焦蒙层 - 始终基于当前显示区域 -->
                <div v-if="scriptText" class="focus-overlay-local">
                    <div class="overlay-top"></div>
                    <div class="reading-zone" :style="{ height: focusZoneHeight + 'px' }"></div>
                    <div class="overlay-bottom"></div>
                </div>

                <div class="scrolling-text" :class="{ playing: isPlaying }" :style="{
                    transform: `translateY(${initialPosition + scrollPosition}px)`
                }">
                    <div class="text-content" v-html="formattedText"></div>
                    <div class="text-end">— 结束 —</div>
                </div>
            </div>
        </div>

        <!-- 全屏控制条 -->
        <div class="fullscreen-controls" v-if="isFullscreen">
            <button @click="togglePlay" class="fs-control-btn" :title="isPlaying ? '暂停' : '播放'">
                <svg v-if="!isPlaying" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
            </button>
            <button @click="resetScroll" class="fs-control-btn" title="重置">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                    <path d="M21 3v5h-5"/>
                </svg>
            </button>
            <button @click="toggleMirror" class="fs-control-btn" :title="isMirrored ? '关闭水平镜像' : '开启水平镜像'" :class="{ active: isMirrored }">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12h20"/>
                    <path d="M6 8v8"/>
                    <path d="M18 8v8"/>
                    <path d="M6 6l2 2"/>
                    <path d="M6 18l2-2"/>
                    <path d="M18 6l-2 2"/>
                    <path d="M18 18l-2-2"/>
                </svg>
            </button>
            <button @click="toggleVerticalFlip" class="fs-control-btn" :title="isVerticalFlipped ? '关闭垂直反转' : '开启垂直反转'" :class="{ active: isVerticalFlipped }">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20"/>
                    <path d="M8 6h8"/>
                    <path d="M8 18h8"/>
                    <path d="M6 6l2 2"/>
                    <path d="M18 6l-2 2"/>
                    <path d="M6 18l2-2"/>
                    <path d="M18 18l-2-2"/>
                </svg>
            </button>
            <button @click="adjustSpeed(-1)" class="fs-control-btn" title="减慢速度">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
            </button>
            <button @click="adjustSpeed(1)" class="fs-control-btn" title="加快速度">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
            </button>
            <button @click="toggleFullscreen" class="fs-control-btn" title="退出全屏">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useWakeLock } from '../composables/useWakeLock'
import { useNotification } from '../composables/useNotification'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 使用组合式函数
usePageTitle('teleprompter')
const { requestWakeLock, releaseWakeLock } = useWakeLock()
const { success: showSuccess, error: showError } = useNotification()

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'teleprompter')
        if (card) {
            return card.title
        }
    }
    return '在线提词器'
})

// 状态管理
const isFullscreen = ref(false)
const isPlaying = ref(false)
const isMirrored = ref(false)
const isVerticalFlipped = ref(false)
const scrollSpeed = ref(3)
const fontSize = ref(32)
const textColor = ref('#ffffff')
const backgroundColor = ref('#000000')
const scrollPosition = ref(0)
const linesInFocus = ref(1)

// 文本内容
const scriptText = ref('')

// 引用
const displayArea = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

// 滚动控制
const scrollInterval = ref<number | null>(null)

// 计算属性
const formattedText = computed(() => {
    if (!scriptText.value) return '<p>请输入文本内容</p>'

    return scriptText.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<p>${line}</p>`)
        .join('')
})

// 计算聚焦区域高度（基于字体大小和行数）
const focusZoneHeight = computed(() => {
    const lineHeight = fontSize.value * 1.8
    return lineHeight * linesInFocus.value
})

// 添加一个响应式的高度值
const displayHeight = ref(0)

// 计算内容初始位置
const initialPosition = computed(() => {
    const viewportHeight = displayHeight.value || (displayArea.value?.clientHeight || 0)

    if (viewportHeight === 0) return 0

    const focusZoneTop = (viewportHeight - focusZoneHeight.value) / 2
    const focusZoneCenter = focusZoneTop + (focusZoneHeight.value / 2)
    const adjustment = fontSize.value * 0.8
    const finalPosition = focusZoneCenter - adjustment

    return finalPosition
})

// 滚动控制
const startScrolling = () => {
    if (scrollInterval.value) return

    scrollInterval.value = window.setInterval(() => {
        scrollPosition.value -= scrollSpeed.value

        if (displayArea.value) {
            const viewportHeight = displayArea.value.clientHeight
            const focusZoneTop = (viewportHeight - focusZoneHeight.value) / 2

            const scrollingTextElement = displayArea.value.querySelector('.scrolling-text')
            const contentHeight = scrollingTextElement ? scrollingTextElement.scrollHeight : 0

            const currentContentBottom = initialPosition.value + scrollPosition.value + contentHeight

            if (currentContentBottom < focusZoneTop) {
                stopScrolling()
                releaseWakeLock()
                showSuccess('滚动完成')
            }
        }
    }, 100)
}

const stopScrolling = () => {
    if (scrollInterval.value) {
        clearInterval(scrollInterval.value)
        scrollInterval.value = null
    }
}

// 功能函数
const togglePlay = () => {
    isPlaying.value = !isPlaying.value

    if (isPlaying.value) {
        startScrolling()
        requestWakeLock()
        showSuccess('开始滚动')
    } else {
        stopScrolling()
        releaseWakeLock()
        showSuccess('暂停滚动')
    }
}

const resetScroll = () => {
    stopScrolling()
    isPlaying.value = false
    scrollPosition.value = 0
    showSuccess('重置位置')
}

const toggleMirror = () => {
    isMirrored.value = !isMirrored.value
    showSuccess(`${isMirrored.value ? '开启' : '关闭'}水平镜像`)
}

const toggleVerticalFlip = () => {
    isVerticalFlipped.value = !isVerticalFlipped.value
    showSuccess(`${isVerticalFlipped.value ? '开启' : '关闭'}垂直反转`)
}

const toggleFullscreen = async () => {
    try {
        if (isFullscreen.value) {
            if (document.fullscreenElement) {
                await document.exitFullscreen()
            }
            isFullscreen.value = false
            showSuccess('已退出全屏模式')
        } else {
            await document.documentElement.requestFullscreen()
            isFullscreen.value = true
            showSuccess('进入全屏模式，按ESC退出')
        }
    } catch (error) {
        isFullscreen.value = !isFullscreen.value
        if (isFullscreen.value) {
            showSuccess('进入全屏模式，双击退出')
        } else {
            showSuccess('已退出全屏模式')
        }
    }
}

// 全屏模式下的速度调节
const adjustSpeed = (delta: number) => {
    scrollSpeed.value = Math.max(1, Math.min(10, scrollSpeed.value + delta))
    showSuccess(`滚动速度: ${scrollSpeed.value}`)
}

// 文本操作
const copyText = async () => {
    if (!scriptText.value) {
        showError('没有可复制的内容')
        return
    }

    try {
        await navigator.clipboard.writeText(scriptText.value)
        showSuccess('文本已复制到剪贴板')
    } catch (error) {
        // 如果 Clipboard API 不可用，使用传统方法
        try {
            const textArea = document.createElement('textarea')
            textArea.value = scriptText.value
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            const success = document.execCommand('copy')
            document.body.removeChild(textArea)
            if (success) {
                showSuccess('文本已复制到剪贴板')
            } else {
                showError('复制失败，请手动复制')
            }
        } catch (fallbackError) {
            showError('复制失败，请手动复制')
        }
    }
}

const clearText = () => {
    scriptText.value = ''
    resetScroll()
    showSuccess('文本已清空')
}

const loadSample = () => {
    scriptText.value = `欢迎使用在线提词器！

这是一个专业的提词器工具，适用于：
• 演讲和发言
• 视频录制
• 直播主持
• 新闻播报

主要功能：
• 可调节滚动速度
• 支持全屏显示
• 镜像显示功能
• 自定义字体大小和颜色
• 支持文本文件导入

使用方法：
1. 输入或导入您的文本内容
2. 调整字体大小和颜色
3. 点击播放按钮开始滚动
4. 双击进入全屏模式

祝您使用愉快！`

    resetScroll()
    showSuccess('示例文本已加载')
}

const loadFile = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    if (file.type !== 'text/plain') {
        showError('请选择文本文件(.txt)')
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        scriptText.value = e.target?.result as string
        resetScroll()
        showSuccess('文件导入成功')
    }
    reader.onerror = () => {
        showError('文件读取失败')
    }
    reader.readAsText(file, 'UTF-8')
}

// 键盘控制
const handleKeyPress = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
        event.preventDefault()
        togglePlay()
    } else if (event.code === 'Escape') {
        event.preventDefault()
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else if (isFullscreen.value) {
            isFullscreen.value = false
        }
    } else if (event.code === 'KeyR') {
        event.preventDefault()
        resetScroll()
    } else if (event.code === 'KeyF' || event.code === 'F11') {
        event.preventDefault()
        toggleFullscreen()
    } else if (event.code === 'ArrowUp') {
        event.preventDefault()
        scrollSpeed.value = Math.min(10, scrollSpeed.value + 1)
    } else if (event.code === 'ArrowDown') {
        event.preventDefault()
        scrollSpeed.value = Math.max(1, scrollSpeed.value - 1)
    } else if (event.code === 'ArrowRight') {
        event.preventDefault()
        fontSize.value = Math.min(80, fontSize.value + 2)
        showSuccess(`字体大小: ${fontSize.value}px`)
    } else if (event.code === 'ArrowLeft') {
        event.preventDefault()
        fontSize.value = Math.max(24, fontSize.value - 2)
        showSuccess(`字体大小: ${fontSize.value}px`)
    } else if (event.code === 'Equal' || event.code === 'NumpadAdd') {
        event.preventDefault()
        linesInFocus.value = Math.min(5, linesInFocus.value + 1)
        showSuccess(`聚焦行数: ${linesInFocus.value}行`)
    } else if (event.code === 'Minus' || event.code === 'NumpadSubtract') {
        event.preventDefault()
        linesInFocus.value = Math.max(1, linesInFocus.value - 1)
        showSuccess(`聚焦行数: ${linesInFocus.value}行`)
    } else if (event.code === 'KeyH') {
        event.preventDefault()
        toggleMirror()
    } else if (event.code === 'KeyM') {
        event.preventDefault()
        toggleVerticalFlip()
    }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement

    setTimeout(() => {
        scrollPosition.value = 0
    }, 150)
}

// 监听影响布局的参数变化
watch([fontSize, linesInFocus], () => {
    scrollPosition.value = 0
})

// 处理窗口大小变化
const handleResize = () => {
    setTimeout(() => {
        scrollPosition.value = 0
    }, 100)
}

// 生命周期
onMounted(() => {
    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.addEventListener('resize', handleResize)

    nextTick(() => {
        if (displayArea.value) {
            displayHeight.value = displayArea.value.clientHeight

            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const newHeight = entry.contentRect.height
                    displayHeight.value = newHeight
                    scrollPosition.value = 0
                }
            })

            resizeObserver.observe(displayArea.value)

            // 将 resizeObserver 存储到组件实例中，以便在 onUnmounted 中访问
            ;(displayArea.value as any)._resizeObserver = resizeObserver
        }
    })

    showSuccess('提词器已就绪，空格播放，方向键调节')
})

onUnmounted(() => {
    stopScrolling()
    releaseWakeLock()
    document.removeEventListener('keydown', handleKeyPress)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    window.removeEventListener('resize', handleResize)
    
    // 清理 ResizeObserver
    if (displayArea.value && (displayArea.value as any)._resizeObserver) {
        ;(displayArea.value as any)._resizeObserver.disconnect()
    }
})
</script>
<style scoped>
.teleprompter {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    position: relative;
    overflow: hidden;
    background: var(--bg-primary);
}

.teleprompter.fullscreen,
.teleprompter:fullscreen {
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
    overflow: hidden;
    min-height: 0;
}

.formatter-actions {
    display: flex;
    gap: 0.5rem;
}

.control-panel {
    padding: 20px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    gap: 30px;
    align-items: center;
    flex-wrap: wrap;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.control-group label {
    font-size: 14px;
    color: var(--text-secondary);
    min-width: 60px;
}

.control-action-btn {
    padding: 4px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 12px;
    margin-right: 8px;
}

.control-action-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.speed-slider,
.font-slider {
    width: 100px;
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

.speed-value,
.font-value {
    font-size: 12px;
    color: var(--text-secondary);
    min-width: 30px;
    text-align: center;
}

.color-picker {
    width: 40px;
    height: 30px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    cursor: pointer;
    background: none;
}

.text-input-area {
    padding: 20px;
    background: var(--bg-primary);
}

.script-textarea {
    width: 100%;
    min-height: 150px;
    padding: 16px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    font-family: inherit;
}

.script-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.teleprompter-display {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #000000;
    color: #ffffff;
    cursor: pointer;
    min-height: 400px;
    height: 100%;
}

.teleprompter-display.mirrored {
    transform: scaleX(-1);
}

.teleprompter-display.vertical-flipped {
    transform: scaleY(-1);
}

.teleprompter-display.mirrored.vertical-flipped {
    transform: scaleX(-1) scaleY(-1);
}

.scrolling-text {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    transition: none;
    padding: 0 40px;
    width: 100%;
    box-sizing: border-box;
}

.scrolling-text.playing {
    transition: transform 0.05s linear;
}

.text-content {
    text-align: center;
    line-height: 1.8;
    word-wrap: break-word;
}

.text-content p {
    margin: 0 0 1.5em 0;
    padding: 0;
}

.text-end {
    text-align: center;
    margin-top: 100px;
    opacity: 0.7;
    font-style: italic;
}

.focus-overlay-local {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 100;
    display: flex;
    flex-direction: column;
}

.overlay-top {
    flex: 1;
    background: linear-gradient(to bottom,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.6) 60%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.2) 95%,
            rgba(0, 0, 0, 0) 100%);
}

.reading-zone {
    background: transparent;
    position: relative;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow:
        inset 0 1px 4px rgba(255, 255, 255, 0.1),
        inset 0 -1px 4px rgba(255, 255, 255, 0.1),
        0 0 15px rgba(255, 255, 255, 0.1);
}

.reading-zone::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%);
}

.reading-zone::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 100%);
}

.overlay-bottom {
    flex: 1;
    background: linear-gradient(to top,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.6) 60%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.2) 95%,
            rgba(0, 0, 0, 0) 100%);
}

.fullscreen-controls {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(0, 0, 0, 0.85);
    padding: 12px 20px;
    border-radius: 50px;
    backdrop-filter: blur(10px);
    z-index: 10001;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.fs-control-btn {
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
}

.fs-control-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
}

.fs-control-btn.active {
    background: rgba(59, 130, 246, 0.3);
    border-color: rgba(59, 130, 246, 0.5);
    color: #60a5fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .control-panel {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
    }

    .control-group {
        justify-content: space-between;
    }

    .input-actions {
        flex-wrap: wrap;
    }

    .scrolling-text {
        padding: 0 20px;
    }

    .fullscreen-controls {
        flex-wrap: wrap;
        gap: 10px;
    }
}

/* 全屏模式优化 */
.teleprompter.fullscreen .converter-content,
.teleprompter:fullscreen .converter-content {
    height: 100vh;
}

.teleprompter.fullscreen .teleprompter-display,
.teleprompter:fullscreen .teleprompter-display {
    height: 100vh;
}
</style>