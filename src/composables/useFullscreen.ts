import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 全屏和防睡眠功能 composable
 */
export const useFullscreen = (enableDoubleClick: boolean = false) => {
    const isFullscreen = ref(false)
    let wakeLock: any = null
    let doubleClickElement: HTMLElement | null = null
    let fullscreenTargetElement: HTMLElement | null = null

    // 请求防睡眠锁
    const requestWakeLock = async () => {
        try {
            if ('wakeLock' in navigator) {
                wakeLock = await (navigator as any).wakeLock.request('screen')
                console.log('防睡眠锁已激活')

                wakeLock.addEventListener('release', () => {
                    console.log('防睡眠锁已释放')
                })
            }
        } catch (error) {
            console.warn('无法获取防睡眠锁:', error)
        }
    }

    // 释放防睡眠锁
    const releaseWakeLock = async () => {
        if (wakeLock) {
            try {
                await wakeLock.release()
                wakeLock = null
                console.log('防睡眠锁已手动释放')
            } catch (error) {
                console.warn('释放防睡眠锁失败:', error)
            }
        }
    }

    // 进入全屏
    const enterFullscreen = async (element?: HTMLElement) => {
        try {
            const targetElement = element || fullscreenTargetElement || document.documentElement

            if (targetElement.requestFullscreen) {
                await targetElement.requestFullscreen()
            } else if ((targetElement as any).webkitRequestFullscreen) {
                await (targetElement as any).webkitRequestFullscreen()
            } else if ((targetElement as any).msRequestFullscreen) {
                await (targetElement as any).msRequestFullscreen()
            }

            isFullscreen.value = true
            await requestWakeLock()
        } catch (error) {
            console.warn('进入全屏失败:', error)
        }
    }

    // 退出全屏
    const exitFullscreen = async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen()
            } else if ((document as any).webkitExitFullscreen) {
                await (document as any).webkitExitFullscreen()
            } else if ((document as any).msExitFullscreen) {
                await (document as any).msExitFullscreen()
            }

            isFullscreen.value = false
            await releaseWakeLock()
        } catch (error) {
            console.warn('退出全屏失败:', error)
        }
    }

    // 切换全屏状态
    const toggleFullscreen = async (element?: HTMLElement) => {
        if (isFullscreen.value) {
            await exitFullscreen()
        } else {
            await enterFullscreen(element)
        }
    }

    // 双击处理函数
    const handleDoubleClick = (event: Event) => {
        event.preventDefault()
        // 使用设置的全屏目标元素
        toggleFullscreen(fullscreenTargetElement || undefined)
    }

    // 设置双击元素
    const setDoubleClickElement = (element: HTMLElement | null) => {
        // 移除之前的事件监听器
        if (doubleClickElement) {
            doubleClickElement.removeEventListener('dblclick', handleDoubleClick)
        }

        doubleClickElement = element

        // 添加新的事件监听器
        if (doubleClickElement && enableDoubleClick) {
            doubleClickElement.addEventListener('dblclick', handleDoubleClick)
        }
    }

    // 设置全屏目标元素
    const setFullscreenTarget = (element: HTMLElement | null) => {
        fullscreenTargetElement = element
    }

    // 监听全屏状态变化
    const handleFullscreenChange = () => {
        const isCurrentlyFullscreen = !!(
            document.fullscreenElement ||
            (document as any).webkitFullscreenElement ||
            (document as any).msFullscreenElement
        )

        isFullscreen.value = isCurrentlyFullscreen

        // 如果不是全屏状态，释放防睡眠锁
        if (!isCurrentlyFullscreen) {
            releaseWakeLock()
        }
    }

    // 页面可见性变化时重新请求防睡眠锁
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && isFullscreen.value && !wakeLock) {
            requestWakeLock()
        }
    }

    // 组件挂载时添加事件监听
    onMounted(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
        document.addEventListener('msfullscreenchange', handleFullscreenChange)
        document.addEventListener('visibilitychange', handleVisibilityChange)
    })

    // 组件卸载时清理
    onUnmounted(() => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
        document.removeEventListener('msfullscreenchange', handleFullscreenChange)
        document.removeEventListener('visibilitychange', handleVisibilityChange)

        // 移除双击事件监听器
        if (doubleClickElement) {
            doubleClickElement.removeEventListener('dblclick', handleDoubleClick)
        }

        // 清理防睡眠锁
        releaseWakeLock()
    })

    return {
        isFullscreen,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen,
        requestWakeLock,
        releaseWakeLock,
        setDoubleClickElement,
        setFullscreenTarget
    }
}