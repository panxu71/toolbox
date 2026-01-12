<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
                <div class="modal" :class="modalClass" @click.stop>
                    <!-- 头部 -->
                    <div v-if="showHeader" class="modal-header">
                        <slot name="header">
                            <h3 class="modal-title">{{ title }}</h3>
                        </slot>
                        <button v-if="showCloseButton" class="close-btn" @click="handleClose" :title="closeButtonTitle">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <!-- 内容 -->
                    <div class="modal-content" :class="contentClass">
                        <slot></slot>
                    </div>

                    <!-- 底部 -->
                    <div v-if="$slots.footer" class="modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">

const props = withDefaults(defineProps<{
    visible: boolean
    title?: string
    width?: string
    maxWidth?: string
    maxHeight?: string
    showHeader?: boolean
    showCloseButton?: boolean
    closeOnOverlay?: boolean
    closeButtonTitle?: string
    modalClass?: string
    contentClass?: string
}>(), {
    title: '',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '70vh',
    showHeader: true,
    showCloseButton: true,
    closeOnOverlay: true,
    closeButtonTitle: '关闭',
    modalClass: '',
    contentClass: ''
})

const emit = defineEmits<{
    close: []
    'update:visible': [value: boolean]
}>()

const handleClose = () => {
    emit('update:visible', false)
    emit('close')
}

const handleOverlayClick = () => {
    if (props.closeOnOverlay) {
        handleClose()
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    width: v-bind('props.width');
    max-width: v-bind('props.maxWidth');
    max-height: v-bind('props.maxHeight');
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-primary);
    flex-shrink: 0;
}

.modal-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
}

.close-btn {
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.close-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.modal-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--border-color);
    background: var(--bg-primary);
    flex-shrink: 0;
}

/* 动画效果 */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
    transform: translateY(20px) scale(0.95);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .modal {
        width: 95% !important;
        max-height: 85vh !important;
    }

    .modal-header {
        padding: 1rem 1.5rem;
    }

    .modal-content {
        padding: 1.5rem;
    }

    .modal-footer {
        padding: 1rem 1.5rem;
    }
}
</style>