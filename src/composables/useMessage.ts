import { ref } from 'vue'

/**
 * 简单消息提示 composable
 * 为了保持与现有组件的兼容性，提供简单的消息提示功能
 */
export const useMessage = () => {
    const message = ref('')
    const messageType = ref<'success' | 'error'>('success')

    /**
     * 显示消息
     * @param text 消息内容
     * @param type 消息类型
     * @param duration 显示时长（毫秒），默认 3000
     */
    const showMessage = (
        text: string,
        type: 'success' | 'error' = 'success',
        duration: number = 3000
    ) => {
        message.value = text
        messageType.value = type

        setTimeout(() => {
            message.value = ''
        }, duration)
    }

    /**
     * 显示成功消息
     * @param text 消息内容
     * @param duration 显示时长（毫秒）
     */
    const showSuccess = (text: string, duration?: number) => {
        showMessage(text, 'success', duration)
    }

    /**
     * 显示错误消息
     * @param text 消息内容
     * @param duration 显示时长（毫秒）
     */
    const showError = (text: string, duration?: number) => {
        showMessage(text, 'error', duration)
    }

    /**
     * 清空消息
     */
    const clearMessage = () => {
        message.value = ''
    }

    return {
        message,
        messageType,
        showMessage,
        showSuccess,
        showError,
        clearMessage
    }
}