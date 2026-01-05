<template>
    <Teleport to="body">
        <div class="notification-container">
            <TransitionGroup name="notification" tag="div">
                <div v-for="notification in notifications" :key="notification.id" class="notification"
                    :class="`notification-${notification.type}`">
                    <div class="notification-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <component :is="getIcon(notification.type)" />
                        </svg>
                    </div>

                    <div class="notification-content">
                        <div v-if="notification.title" class="notification-title">
                            {{ notification.title }}
                        </div>
                        <div class="notification-message">
                            {{ notification.message }}
                        </div>

                        <div v-if="notification.actions" class="notification-actions">
                            <button v-for="action in notification.actions" :key="action.label"
                                class="notification-action" :class="`action-${action.style || 'secondary'}`"
                                @click="action.action">
                                {{ action.label }}
                            </button>
                        </div>
                    </div>

                    <button class="notification-close" @click="remove(notification.id)" title="关闭">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useNotification } from '../../composables/useNotification'

const { notifications, remove } = useNotification()

const getIcon = (type: string) => {
    const icons = {
        success: () => `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" />`,
        error: () => `<circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />`,
        warning: () => `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="m12 17 .01 0" />`,
        info: () => `<circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />`
    }
    return icons[type as keyof typeof icons] || icons.info
}
</script>

<style scoped>
.notification-container {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 400px;
    pointer-events: none;
}

.notification {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--bg-color);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    box-shadow: var(--shadow-lg);
    pointer-events: auto;
    min-width: 300px;
    backdrop-filter: blur(10px);
}

.notification-success {
    /* 移除左侧边框线 */
}

.notification-success .notification-icon {
    color: var(--success-color);
}

.notification-error {
    /* 移除左侧边框线 */
}

.notification-error .notification-icon {
    color: var(--danger-color);
}

.notification-warning {
    /* 移除左侧边框线 */
}

.notification-warning .notification-icon {
    color: var(--warning-color);
}

.notification-info {
    /* 移除左侧边框线 */
}

.notification-info .notification-icon {
    color: var(--primary-color);
}

.notification-icon {
    flex-shrink: 0;
    margin-top: 0.125rem;
}

.notification-content {
    flex: 1;
    min-width: 0;
}

.notification-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-color);
    margin-bottom: 0.25rem;
}

.notification-message {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.4;
    word-break: break-word;
}

.notification-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.notification-action {
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.action-primary {
    background: var(--primary-color);
    color: white;
}

.action-primary:hover {
    background: var(--primary-hover);
}

.action-secondary {
    background: var(--bg-secondary);
    color: var(--text-color);
    border-color: var(--border-color);
}

.action-secondary:hover {
    background: var(--bg-hover);
}

.notification-close {
    flex-shrink: 0;
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
}

.notification-close:hover {
    background: var(--bg-secondary);
    color: var(--text-color);
}

/* 动画 */
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.notification-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.notification-move {
    transition: transform 0.3s ease;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .notification-container {
        left: 1rem;
        right: 1rem;
        max-width: none;
    }

    .notification {
        min-width: auto;
    }
}
</style>