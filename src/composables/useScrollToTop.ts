import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollToTop(options?: {
    threshold?: number
    behavior?: ScrollBehavior
    container?: string | HTMLElement
}) {
    const {
        threshold = 300,
        behavior = 'smooth',
        container
    } = options || {}

    const isVisible = ref(false)
    const isScrolling = ref(false)

    let scrollContainer: HTMLElement | Window

    /**
     * 滚动到顶部
     */
    const scrollToTop = () => {
        if (isScrolling.value) return

        isScrolling.value = true

        const targetElement = scrollContainer === window ? document.documentElement : scrollContainer as HTMLElement

        if (behavior === 'smooth' && 'scrollTo' in targetElement) {
            targetElement.scrollTo({
                top: 0,
                behavior: 'smooth'
            })

            // 监听滚动结束
            const checkScrollEnd = () => {
                if (getScrollTop() <= 10) {
                    isScrolling.value = false
                } else {
                    requestAnimationFrame(checkScrollEnd)
                }
            }
            requestAnimationFrame(checkScrollEnd)
        } else {
            // 降级方案：立即滚动
            if (scrollContainer === window) {
                window.scrollTo(0, 0)
            } else {
                (scrollContainer as HTMLElement).scrollTop = 0
            }
            isScrolling.value = false
        }
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
     * 初始化
     */
    const init = () => {
        // 确定滚动容器
        if (typeof container === 'string') {
            const element = document.querySelector(container)
            scrollContainer = element || window
        } else if (container instanceof HTMLElement) {
            scrollContainer = container
        } else {
            scrollContainer = window
        }

        // 添加滚动监听
        scrollContainer.addEventListener('scroll', throttledHandleScroll, { passive: true })

        // 初始检查
        handleScroll()
    }

    /**
     * 清理
     */
    const cleanup = () => {
        if (scrollContainer) {
            scrollContainer.removeEventListener('scroll', throttledHandleScroll)
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