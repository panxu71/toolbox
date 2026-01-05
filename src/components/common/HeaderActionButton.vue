<template>
    <button class="action-btn" :disabled="disabled" :title="tooltip" @click="$emit('click')">
        <!-- 清空图标 -->
        <svg v-if="icon === 'clear'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
        <!-- 复制图标 -->
        <svg v-else-if="icon === 'copy'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <!-- 下载图标 -->
        <svg v-else-if="icon === 'download'" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <!-- 切换图标 -->
        <svg v-else-if="icon === 'toggle'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M16 3h5v5" />
            <path d="M8 3H3v5" />
            <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
            <path d="M9 21h6" />
        </svg>
        <!-- 刷新图标 -->
        <svg v-else-if="icon === 'refresh'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
        <!-- 默认图标 -->
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9,9h6v6H9z" />
        </svg>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    icon: string
    tooltip?: string
    disabled?: boolean
}>()

defineEmits<{
    click: []
}>()
</script>

<style scoped>
.action-btn {
    width: 36px;
    height: 36px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.action-btn:hover:not(:disabled) {
    background: var(--border-color);
    color: var(--text-primary);
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>