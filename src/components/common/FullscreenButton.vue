<template>
    <button class="fullscreen-btn" @click="handleClick" :title="isFullscreen ? '退出全屏' : '全屏显示'">
        <svg v-if="!isFullscreen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
    </button>
</template>

<script setup lang="ts">
import { useFullscreen } from '../../composables/useFullscreen'

const props = defineProps<{
    targetElement?: HTMLElement
}>()

const { isFullscreen, toggleFullscreen } = useFullscreen()

const handleClick = () => {
    toggleFullscreen(props.targetElement)
}
</script>

<style scoped>
.fullscreen-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.fullscreen-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
}
</style>