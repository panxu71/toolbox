import { ref, reactive } from 'vue'

export interface Notification {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title?: string
    message: string
    duration?: number
    persistent?: boolean
    actions?: Array<{
        label: string
        action: () => void
        style?: 'primary' | 'secondary'
    }>
}

const notifications = ref<Notification[]>([])
let notificationId = 0

export function useNotification() {
    /**
     * 显示通知
     */
    const notify = (options: Omit<Notification, 'id'>): string => {
        const id = `notification-${++notificationId}`
        const notification: Notification = {
            id,
            duration: 3000,
            ...options
        }

        notifications.value.push(notification)

        // 自动移除（除非是持久通知）
        if (!notification.persistent && notification.duration && notification.duration > 0) {
            setTimeout(() => {
                remove(id)
            }, notification.duration)
        }

        return id
    }

    /**
     * 成功通知
     */
    const success = (message: string, options?: Partial<Notification>): string => {
        return notify({
            type: 'success',
            message,
            ...options
        })
    }

    /**
     * 错误通知
     */
    const error = (message: string, options?: Partial<Notification>): string => {
        return notify({
            type: 'error',
            message,
            duration: 5000, // 错误通知显示更久
            ...options
        })
    }

    /**
     * 警告通知
     */
    const warning = (message: string, options?: Partial<Notification>): string => {
        return notify({
            type: 'warning',
            message,
            duration: 4000,
            ...options
        })
    }

    /**
     * 信息通知
     */
    const info = (message: string, options?: Partial<Notification>): string => {
        return notify({
            type: 'info',
            message,
            ...options
        })
    }

    /**
     * 移除通知
     */
    const remove = (id: string): void => {
        const index = notifications.value.findIndex(n => n.id === id)
        if (index > -1) {
            notifications.value.splice(index, 1)
        }
    }

    /**
     * 清空所有通知
     */
    const clear = (): void => {
        notifications.value = []
    }

    /**
     * 复制成功通知的快捷方法
     */
    const copySuccess = (content?: string): string => {
        return success(content ? `已复制: ${content.slice(0, 20)}${content.length > 20 ? '...' : ''}` : '已复制到剪贴板')
    }

    /**
     * 复制失败通知的快捷方法
     */
    const copyError = (reason?: string): string => {
        return error(reason || '复制失败，请手动复制')
    }

    return {
        notifications,
        notify,
        success,
        error,
        warning,
        info,
        remove,
        clear,
        copySuccess,
        copyError
    }
}