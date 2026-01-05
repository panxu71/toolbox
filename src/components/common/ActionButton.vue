<template>
    <button class="action-btn" :class="{
        'action-btn-small': size === 'small',
        'action-btn-primary': variant === 'primary',
        'action-btn-danger': variant === 'danger',
        'action-btn-success': variant === 'success'
    }" :disabled="disabled" :title="tooltip" @click="$emit('click')">
        <svg v-if="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <component :is="iconComponent" />
        </svg>
        <span v-if="$slots.default">
            <slot></slot>
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    icon?: string
    tooltip?: string
    disabled?: boolean
    size?: 'normal' | 'small'
    variant?: 'normal' | 'primary' | 'danger' | 'success'
}>()

defineEmits<{
    click: []
}>()

// 图标组件映射
const iconComponents = {
    'clear': () => `
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    `,
    'copy': () => `
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    `,
    'check': () => `
        <polyline points="20,6 9,17 4,12" />
    `,
    'download': () => `
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    `,
    'refresh': () => `
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
    `,
    'paste': () => `
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    `,
    'close': () => `
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    `,
    'clock': () => `
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
    `,
    'upload': () => `
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17,8 12,3 7,8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    `,
    'save': () => `
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17,21 17,13 7,13 7,21" />
        <polyline points="7,3 7,8 15,8" />
    `,
    'edit': () => `
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
    `,
    'search': () => `
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
    `,
    'settings': () => `
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m11-7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    `
}

const iconComponent = computed(() => {
    if (!props.icon || !iconComponents[props.icon as keyof typeof iconComponents]) {
        return null
    }
    return iconComponents[props.icon as keyof typeof iconComponents]()
})
</script>

<style scoped>
.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    min-width: 2.5rem;
    height: 2.5rem;
}

.action-btn:hover:not(:disabled) {
    background: var(--bg-hover);
    border-color: var(--border-hover);
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.action-btn-small {
    padding: 0.25rem 0.5rem;
    min-width: 2rem;
    height: 2rem;
    font-size: 0.8rem;
}

.action-btn-small svg {
    width: 14px;
    height: 14px;
}

.action-btn-primary {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.action-btn-primary:hover:not(:disabled) {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
}

.action-btn-danger {
    background: var(--danger-color);
    border-color: var(--danger-color);
    color: white;
}

.action-btn-success {
    background: var(--success-color);
    border-color: var(--success-color);
    color: white;
}

.action-btn-success:hover:not(:disabled) {
    background: #059669;
    border-color: #059669;
}
</style>