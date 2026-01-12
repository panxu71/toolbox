import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

export function useScrollToTop(options?: {
    threshold?: number
    behavior?: ScrollBehavior
    container?: string | HTMLElement | { value: HTMLElement | null }
}) {
    const {
        threshold = 300,
        behavior = 'smooth',
        container
    } = options || {}

    const isVisible = ref(false)
    const isScrolling = ref(false)

    let scrollContainer: HTMLElement | Window = window
    let cleanupFn: (() => void) | null = null

    /**
     * 滚动到顶部
     */
    const scrollToTop = () => {
        if (isScrolling.value) return

        isScrolling.value = true

        if (scrollContainer === window) {
            window.scrollTo({
                top: 0,
                behavior: behavior
            })
        } else {
            (scrollContainer as HTMLElement).scrollTo({
                top: 0,
                behavior: behavior
            })
        }

        // 监听滚动结束
        const checkScrollEnd = () => {
            if (getScrollTop() <= 10) {
                isScrolling.value = false
            } else {
                requestAnimationFrame(checkScrollEnd)
            }
        }
        requestAnimationFrame(checkScrollEnd)
    }

    /**
     * 获取滚动距离
     */
    const getScrollTop = (): number => {
        if (scrollContainer === window) {
            return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        } else {
            return (scrollContainer as HTMLElement).scrollTop || 0
        }
    }

    /**
     * 处理滚动事件
     */
    const handleScroll = () => {
        const scrollTop = getScrollTop()
        isVisible.value = scrollTop > threshold
    }

    /**
     * 节流函数
     */
    const throttle = (func: Function, delay: number) => {
        let timeoutId: number | null = null
        let lastExecTime = 0

        return function (this: any, ...args: any[]) {
            const currentTime = Date.now()

            if (currentTime - lastExecTime > delay) {
                func.apply(this, args)
                lastExecTime = currentTime
            } else {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
                timeoutId = window.setTimeout(() => {
                    func.apply(this, args)
                    lastExecTime = Date.now()
                }, delay - (currentTime - lastExecTime))
            }
        }
    }

    const throttledHandleScroll = throttle(handleScroll, 100)

    /**
     * 设置滚动容器
     */
    const setupScrollContainer = () => {
        // 清理之前的监听
        if (cleanupFn) {
            cleanupFn()
            cleanupFn = null
        }

        // 确定滚动容器 - 默认使用window
        scrollContainer = window

        if (container) {
            if (typeof container === 'string') {
                const element = document.querySelector(container) as HTMLElement
                if (element) {
                    scrollContainer = element
                }
            } else if (container && 'value' in container) {
                // 处理 Vue ref 对象
                if (container.value) {
                    scrollContainer = container.value
                }
            } else if (container instanceof HTMLElement) {
                scrollContainer = container
            }
        }

        // 添加滚动监听
        scrollContainer.addEventListener('scroll', throttledHandleScroll, { passive: true })

        // 初始检查
        handleScroll()

        // 返回清理函数
        cleanupFn = () => {
            scrollContainer.removeEventListener('scroll', throttledHandleScroll)
        }
    }

    /**
     * 初始化
     */
    const init = () => {
        nextTick(() => {
            setupScrollContainer()

            // 如果容器是 ref，监听其变化
            if (container && typeof container === 'object' && 'value' in container) {
                watch(() => (container as any).value, () => {
                    nextTick(setupScrollContainer)
                })
            }
        })
    }

    /**
     * 清理
     */
    const cleanup = () => {
        if (cleanupFn) {
            cleanupFn()
        }
    }

    onMounted(init)
    onUnmounted(cleanup)

    return {
        isVisible,
        isScrolling,
        scrollToTop
    }
}