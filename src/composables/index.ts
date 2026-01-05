/**
 * 通用 Composables 导出
 * 统一导出所有可复用的 composable 函数
 */

// 页面标题管理
export { usePageTitle } from './usePageTitle'

// 剪贴板功能
export { useClipboard } from './useClipboard'

// 下载功能
export { useDownload } from './useDownload'

// 消息提示
export { useMessage } from './useMessage'

// 全屏和防睡眠
export { useFullscreen } from './useFullscreen'

// 通知系统
export { useNotification } from './useNotification'

// 主题管理
export { useTheme } from './useTheme'

// 滚动到顶部
export { useScrollToTop } from './useScrollToTop'

/**
 * 通用工具组件 Hook
 * 为工具组件提供常用的功能组合
 */
export const useToolComponent = (toolId: string) => {
    const { usePageTitle } = require('./usePageTitle')
    const { useClipboard } = require('./useClipboard')
    const { useDownload } = require('./useDownload')
    const { useMessage } = require('./useMessage')

    // 使用页面标题管理
    usePageTitle(toolId)

    // 获取常用功能
    const clipboard = useClipboard()
    const download = useDownload()
    const message = useMessage()

    return {
        // 剪贴板功能
        ...clipboard,

        // 下载功能
        ...download,

        // 消息提示
        ...message,

        // 便捷方法
        copyWithMessage: async (text: string, successMsg = '已复制到剪贴板', errorMsg = '复制失败') => {
            const success = await clipboard.copyToClipboard(text)
            message.showMessage(success ? successMsg : errorMsg, success ? 'success' : 'error')
            return success
        },

        downloadWithMessage: (content: string, filename: string, extension: string, successMsg?: string, errorMsg?: string) => {
            const success = download.downloadText(content, filename, extension)
            const defaultSuccessMsg = `${filename}.${extension} 已下载`
            const defaultErrorMsg = '下载失败'
            message.showMessage(success ? (successMsg || defaultSuccessMsg) : (errorMsg || defaultErrorMsg), success ? 'success' : 'error')
            return success
        }
    }
}