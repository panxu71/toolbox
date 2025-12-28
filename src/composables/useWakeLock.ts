import { ref } from 'vue'

/**
 * Wake Lock API composable - 防止屏幕息屏
 * 用于需要保持屏幕常亮的场景，如全屏时钟、秒表、提词器等
 */
export function useWakeLock() {
    const isWakeLockActive = ref(false)
    let wakeLock: WakeLockSentinel | null = null

    /**
     * 请求屏幕保持唤醒
     * @param showMessage 可选的消息显示函数
     */
    const requestWakeLock = async (showMessage?: (msg: string, type?: 'success' | 'error') => void) => {
        try {
            if ('wakeLock' in navigator && !wakeLock) {
                wakeLock = await navigator.wakeLock.request('screen')
                isWakeLockActive.value = true
                console.log('防息屏已启用')
                showMessage?.('已启用防息屏功能', 'success')
                
                // 监听 Wake Lock 释放事件
                wakeLock.addEventListener('release', () => {
                    console.log('防息屏已自动释放')
                    isWakeLockActive.value = false
                    wakeLock = null
                })
            } else if (!('wakeLock' in navigator)) {
                console.log('浏览器不支持 Wake Lock API')
                showMessage?.('浏览器不支持防息屏功能', 'error')
            }
        } catch (err) {
            console.error('防息屏启用失败:', err)
            showMessage?.('防息屏功能启用失败', 'error')
            isWakeLockActive.value = false
            wakeLock = null
        }
    }

    /**
     * 释放屏幕保持唤醒
     * @param showMessage 可选的消息显示函数
     */
    const releaseWakeLock = (showMessage?: (msg: string, type?: 'success' | 'error') => void) => {
        if (wakeLock) {
            wakeLock.release()
            wakeLock = null
            isWakeLockActive.value = false
            console.log('防息屏已释放')
            showMessage?.('已关闭防息屏功能', 'success')
        }
    }

    /**
     * 切换 Wake Lock 状态
     * @param showMessage 可选的消息显示函数
     */
    const toggleWakeLock = async (showMessage?: (msg: string, type?: 'success' | 'error') => void) => {
        if (isWakeLockActive.value) {
            releaseWakeLock(showMessage)
        } else {
            await requestWakeLock(showMessage)
        }
    }

    /**
     * 检查浏览器是否支持 Wake Lock API
     */
    const isWakeLockSupported = () => {
        return 'wakeLock' in navigator
    }

    return {
        isWakeLockActive,
        requestWakeLock,
        releaseWakeLock,
        toggleWakeLock,
        isWakeLockSupported
    }
}