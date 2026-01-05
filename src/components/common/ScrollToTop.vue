<template>
    <Teleport to="body">
        <Transition name="scroll-to-top">
            <button v-if="isVisible" class="scroll-to-top-btn" :class="{ 'scrolling': isScrolling }"
                @click="scrollToTop" :title="tooltip">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    :class="{ 'rotating': isScrolling }">
                    <path v-if="!isScrolling" d="m18 15-6-6-6 6" />
                    <path v-else d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                <span v-if="showText" class="scroll-text">{{ text }}</span>
            </button>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { useScrollToTop } from '../../composables/useScrollToTop'

const props = withDefaults(defineProps<{
    threshold?: number
    behavior?: ScrollBehavior
    container?: string | HTMLElement
    tooltip?: string
    text?: string
    showText?: boolean
    position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
}>(), {
    threshold: 300,
    behavior: 'smooth',
    tooltip: '回到顶部',
    text: '顶部',
    showText: false,
    position: 'bottom-right'
})

const { isVisible, isScrolling, scrollToTop } = useScrollToTop({
    threshold: props.threshold,
    behavior: props.behavior,
    container: props.container
})
</script>

<style scoped>
.scroll-to-top-btn {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    min-width: 3rem;
    min-height: 3rem;
    justify-content: center;
}

.scroll-to-top-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.scroll-to-top-btn.scrolling {
    pointer-events: none;
    opacity: 0.8;
}

.scroll-to-top-btn[data-position="bottom-left"] {
    left: 2rem;
    right: auto;
}

.scroll-to-top-btn[data-position="bottom-center"] {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
}

.scroll-text {
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
}

.scroll-to-top-btn:has(.scroll-text) {
    border-radius: 2rem;
    padding: 0.75rem 1rem;
}

.rotating {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* 进入/离开动画 */
.scroll-to-top-enter-active,
.scroll-to-top-leave-active {
    transition: all 0.3s ease;
}

.scroll-to-top-enter-from {
    opacity: 0;
    transform: translateY(100%) scale(0.8);
}

.scroll-to-top-leave-to {
    opacity: 0;
    transform: translateY(100%) scale(0.8);
}

/* 移动端适配 */
@media (max-width: 768px) {
    .scroll-to-top-btn {
        bottom: 1rem;
        right: 1rem;
        min-width: 2.5rem;
        min-height: 2.5rem;
        padding: 0.5rem;
    }

    .scroll-to-top-btn svg {
        width: 18px;
        height: 18px;
    }

    .scroll-text {
        font-size: 0.7rem;
    }
}

/* 暗色主题适配 */
[data-theme="dark"] .scroll-to-top-btn {
    background: var(--bg-secondary);
    color: var(--text-color);
    border: 1px solid var(--border-color);
}

[data-theme="dark"] .scroll-to-top-btn:hover {
    background: var(--bg-hover);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}
</style>