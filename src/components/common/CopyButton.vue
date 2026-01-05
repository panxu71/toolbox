<template>
    <ActionButton :icon="copied ? 'check' : 'copy'" :tooltip="copied ? '已复制' : tooltip"
        :disabled="disabled || isLoading" :size="size" :variant="copied ? 'success' : variant" @click="handleCopy">
        <slot v-if="$slots.default"></slot>
        <span v-else-if="text">{{ text }}</span>
    </ActionButton>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useClipboard } from '../../composables/useClipboard'
import { useNotification } from '../../composables/useNotification'
import ActionButton from './ActionButton.vue'

const props = withDefaults(defineProps<{
    text?: string
    content: string
    tooltip?: string
    disabled?: boolean
    size?: 'normal' | 'small'
    variant?: 'normal' | 'primary' | 'danger'
    showNotification?: boolean
    notificationMessage?: string
    resetDelay?: number
}>(), {
    tooltip: '复制',
    showNotification: true,
    resetDelay: 2000
})

const { copy, isLoading, error } = useClipboard()
const { copySuccess, copyError } = useNotification()

const copied = ref(false)
let resetTimer: number | null = null

const handleCopy = async () => {
    if (props.disabled || isLoading.value || !props.content) return

    const success = await copy(props.content)

    if (success) {
        copied.value = true

        if (props.showNotification) {
            copySuccess(props.notificationMessage || props.content)
        }

        // 重置状态
        if (resetTimer) {
            clearTimeout(resetTimer)
        }
        resetTimer = window.setTimeout(() => {
            copied.value = false
        }, props.resetDelay)
    } else {
        if (props.showNotification) {
            copyError(error.value || undefined)
        }
    }
}
</script>

<style scoped>
/* ActionButton 的成功状态样式 */
:deep(.action-btn.action-btn-success) {
    background: var(--success-color);
    border-color: var(--success-color);
    color: white;
}

:deep(.action-btn.action-btn-success:hover:not(:disabled)) {
    background: #059669;
    border-color: #059669;
}
</style>