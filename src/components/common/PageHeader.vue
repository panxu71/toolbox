<template>
    <div class="formatter-header">
        <button class="back-btn" @click="$emit('back')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6" />
            </svg>
            返回
        </button>
        <h2 class="formatter-title">{{ title }}</h2>
        <div class="formatter-actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
}>()

defineEmits<{
    back: []
}>()
</script>

<style scoped>
.formatter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

.back-btn {
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

.formatter-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.formatter-actions {
    display: flex;
    gap: 8px;
}
</style>