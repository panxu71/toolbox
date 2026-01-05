/**
 * 通用剪贴板功能 composable
 */
export const useClipboard = () => {
    /**
     * 复制文本到剪贴板
     * @param text 要复制的文本
     * @param successMessage 成功提示消息（可选）
     * @param errorMessage 失败提示消息（可选）
     * @returns Promise<boolean> 是否复制成功
     */
    const copyToClipboard = async (
        text: string,
        successMessage?: string,
        errorMessage?: string
    ): Promise<boolean> => {
        if (!text) {
            return false
        }

        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch (error) {
            console.error('复制失败:', error)

            // 降级方案：使用传统的 document.execCommand
            try {
                const textArea = document.createElement('textarea')
                textArea.value = text
                textArea.style.position = 'fixed'
                textArea.style.left = '-999999px'
                textArea.style.top = '-999999px'
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()

                const successful = document.execCommand('copy')
                document.body.removeChild(textArea)

                return successful
            } catch (fallbackError) {
                console.error('降级复制方案也失败:', fallbackError)
                return false
            }
        }
    }

    /**
     * 复制 JSON 数据
     * @param data JSON 数据（对象或字符串）
     * @param formatted 是否格式化（默认 true）
     * @returns Promise<boolean> 是否复制成功
     */
    const copyJson = async (
        data: any,
        formatted: boolean = true
    ): Promise<boolean> => {
        try {
            let text: string

            if (typeof data === 'string') {
                // 如果是字符串，先解析再格式化（验证格式）
                const parsed = JSON.parse(data)
                text = formatted ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed)
            } else {
                // 如果是对象，直接序列化
                text = formatted ? JSON.stringify(data, null, 2) : JSON.stringify(data)
            }

            return await copyToClipboard(text)
        } catch (error) {
            console.error('JSON 复制失败:', error)
            return false
        }
    }

    /**
     * 复制数组为文本（每行一个元素）
     * @param items 数组项
     * @param separator 分隔符（默认换行符）
     * @returns Promise<boolean> 是否复制成功
     */
    const copyArray = async (
        items: string[],
        separator: string = '\n'
    ): Promise<boolean> => {
        const text = items.join(separator)
        return await copyToClipboard(text)
    }

    /**
     * 复制对象的键值对
     * @param obj 对象
     * @param format 格式：'json' | 'keyvalue' | 'url'
     * @returns Promise<boolean> 是否复制成功
     */
    const copyObject = async (
        obj: Record<string, any>,
        format: 'json' | 'keyvalue' | 'url' = 'json'
    ): Promise<boolean> => {
        try {
            let text: string

            switch (format) {
                case 'json':
                    text = JSON.stringify(obj, null, 2)
                    break
                case 'keyvalue':
                    text = Object.entries(obj)
                        .map(([key, value]) => `${key}=${value}`)
                        .join('\n')
                    break
                case 'url':
                    text = Object.entries(obj)
                        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                        .join('&')
                    break
                default:
                    text = JSON.stringify(obj, null, 2)
            }

            return await copyToClipboard(text)
        } catch (error) {
            console.error('对象复制失败:', error)
            return false
        }
    }

    /**
     * 检查浏览器是否支持剪贴板 API
     * @returns boolean 是否支持
     */
    const isClipboardSupported = (): boolean => {
        return !!(navigator.clipboard && navigator.clipboard.writeText)
    }

    return {
        copyToClipboard,
        copyJson,
        copyArray,
        copyObject,
        isClipboardSupported
    }
}