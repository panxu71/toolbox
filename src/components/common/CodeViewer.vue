<template>
    <div class="code-viewer" :class="{ 
        'fullscreen-mode': isFullscreen,
        'show-line-numbers': showLineNumbers 
    }">
        <div class="code-container" ref="codeContainer">
            <div v-if="showLineNumbers" class="line-numbers" ref="lineNumbers">
                <div v-for="(_, index) in codeLines" :key="index" class="line-number">
                    {{ index + 1 }}
                </div>
            </div>
            <div 
                class="code-content" 
                ref="codeContent"
                v-html="highlightedCode"
                @scroll="handleScroll"
            ></div>
        </div>
        
        <!-- 悬浮的全屏按钮 -->
        <div v-if="showFullscreenButton" class="floating-fullscreen-btn" @click="emit('toggleFullscreen')">
            <svg v-if="!isFullscreen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
        </div>
        
        <!-- 全屏模式下的回到顶部按钮 -->
        <div v-if="isFullscreen && code && showScrollToTop" class="scroll-to-top-btn" @click="scrollToTop">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m18 15-6-6-6 6" />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml' // 用于HTML
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github-dark.css'

// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)

interface Props {
    code: string
    language?: string
    showLineNumbers?: boolean
    readonly?: boolean
    isFullscreen?: boolean
    showFullscreenButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    code: '',
    language: 'javascript',
    showLineNumbers: true,
    readonly: true,
    isFullscreen: false,
    showFullscreenButton: false
})

const emit = defineEmits<{
    toggleFullscreen: []
}>()

const codeContainer = ref<HTMLElement>()
const lineNumbers = ref<HTMLElement>()
const codeContent = ref<HTMLElement>()
const showScrollToTop = ref(false)

// 代码行数组
const codeLines = computed(() => {
    if (!props.code) return []
    return props.code.split('\n')
})

// 代码高亮
const highlightedCode = computed(() => {
    if (!props.code) return ''
    
    try {
        const language = props.language === 'html' ? 'html' : props.language
        const result = hljs.highlight(props.code, { language })
        return result.value
    } catch (error) {
        console.warn('代码高亮失败:', error)
        return props.code
    }
})

// 滚动同步
const handleScroll = () => {
    if (props.showLineNumbers && lineNumbers.value && codeContent.value) {
        lineNumbers.value.scrollTop = codeContent.value.scrollTop
    }
    
    // 检查是否显示回到顶部按钮
    if (props.isFullscreen && codeContent.value) {
        showScrollToTop.value = codeContent.value.scrollTop > 200
    }
}

// 回到顶部
const scrollToTop = () => {
    if (codeContent.value) {
        codeContent.value.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
}

// 监听代码变化，重新设置滚动位置
watch(() => props.code, () => {
    nextTick(() => {
        if (codeContent.value) {
            codeContent.value.scrollTop = 0
        }
        if (props.showLineNumbers && lineNumbers.value) {
            lineNumbers.value.scrollTop = 0
        }
    })
})

onMounted(() => {
    // 确保滚动同步正常工作
    nextTick(() => {
        handleScroll()
    })
})
</script>

<style scoped>
.code-viewer {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    overflow: hidden;
}

.code-container {
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
}

.line-numbers {
    width: 3rem;
    background: var(--bg-tertiary);
    border-right: 1px solid var(--border-color);
    padding: 1rem 0.5rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--text-secondary);
    user-select: none;
    overflow: hidden;
    flex-shrink: 0;
}

.line-number {
    text-align: right;
    padding-right: 0.5rem;
    height: 1.3em;
    white-space: nowrap;
}

.code-content {
    flex: 1;
    padding: 1rem;
    background: transparent;
    color: var(--text-primary);
    font-size: 0.75rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    line-height: 1.5;
    overflow: auto;
    white-space: pre;
    tab-size: 4;
}

/* 全屏模式样式 */
.fullscreen-mode {
    border-radius: 0;
    height: 100vh;
}

.fullscreen-mode .line-numbers {
    width: 4rem;
    font-size: 0.875rem;
    padding: 1.5rem 0.75rem;
}

.fullscreen-mode .code-content {
    font-size: 0.875rem;
    padding: 1.5rem;
}

/* 滚动条样式 */
.code-content::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.code-content::-webkit-scrollbar-track {
    background: var(--bg-tertiary);
}

.code-content::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 4px;
}

.code-content::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
}

/* 全屏模式下的滚动条 */
.fullscreen-mode .code-content::-webkit-scrollbar {
    width: 12px;
    height: 12px;
}

.fullscreen-mode .code-content::-webkit-scrollbar-track {
    background: var(--bg-tertiary);
    border-radius: 6px;
}

.fullscreen-mode .code-content::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 6px;
}

.fullscreen-mode .code-content::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
}

/* 隐藏行号模式 */
.code-viewer:not(.show-line-numbers) .line-numbers {
    display: none;
}

.code-viewer:not(.show-line-numbers) .code-content {
    padding-left: 1rem;
}

/* 悬浮全屏按钮 */
.floating-fullscreen-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 2rem;
    height: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.2s ease;
    z-index: 10;
    opacity: 0.7;
}

.floating-fullscreen-btn:hover {
    opacity: 1;
    background: var(--bg-primary);
    color: var(--text-primary);
    border-color: var(--primary-color);
}

/* 全屏模式下的悬浮按钮 */
.fullscreen-mode .floating-fullscreen-btn {
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.2);
    color: white;
}

.fullscreen-mode .floating-fullscreen-btn:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.4);
}

/* 回到顶部按钮 */
.scroll-to-top-btn {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 3rem;
    height: 3rem;
    background: var(--primary-color);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.3s ease;
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.scroll-to-top-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.scroll-to-top-btn svg {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
}

.scroll-to-top-btn:hover svg {
    transform: translateY(-1px);
}
</style>