/**
 * 通用下载功能 composable
 */
export const useDownload = () => {
    /**
     * 下载文本内容为文件
     * @param content 文件内容
     * @param filename 文件名（不包含扩展名）
     * @param extension 文件扩展名（如 'json', 'txt', 'csv' 等）
     * @param mimeType MIME 类型（可选，会根据扩展名自动推断）
     */
    const downloadText = (
        content: string,
        filename: string,
        extension: string,
        mimeType?: string
    ): boolean => {
        try {
            // 根据扩展名推断 MIME 类型
            const defaultMimeTypes: Record<string, string> = {
                'json': 'application/json',
                'txt': 'text/plain',
                'csv': 'text/csv',
                'xml': 'application/xml',
                'html': 'text/html',
                'css': 'text/css',
                'js': 'application/javascript',
                'ts': 'application/typescript',
                'md': 'text/markdown',
                'yaml': 'application/x-yaml',
                'yml': 'application/x-yaml'
            }

            const finalMimeType = mimeType || defaultMimeTypes[extension] || 'text/plain'

            // 创建 Blob
            const blob = new Blob([content], { type: finalMimeType })
            const url = URL.createObjectURL(blob)

            // 创建下载链接
            const link = document.createElement('a')
            link.href = url

            // 生成带时间戳的文件名
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
            link.download = `${filename}-${timestamp}.${extension}`

            // 执行下载
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // 清理 URL
            URL.revokeObjectURL(url)

            return true
        } catch (error) {
            console.error('下载失败:', error)
            return false
        }
    }

    /**
     * 下载 JSON 数据
     * @param data JSON 数据（对象或字符串）
     * @param filename 文件名（不包含扩展名）
     * @param formatted 是否格式化（默认 true）
     */
    const downloadJson = (
        data: any,
        filename: string = 'data',
        formatted: boolean = true
    ): boolean => {
        try {
            let content: string

            if (typeof data === 'string') {
                // 如果是字符串，先解析再格式化（验证格式）
                const parsed = JSON.parse(data)
                content = formatted ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed)
            } else {
                // 如果是对象，直接序列化
                content = formatted ? JSON.stringify(data, null, 2) : JSON.stringify(data)
            }

            return downloadText(content, filename, 'json')
        } catch (error) {
            console.error('JSON 下载失败:', error)
            return false
        }
    }

    /**
     * 下载 CSV 数据
     * @param data CSV 内容字符串或二维数组
     * @param filename 文件名（不包含扩展名）
     */
    const downloadCsv = (
        data: string | string[][],
        filename: string = 'data'
    ): boolean => {
        try {
            let content: string

            if (typeof data === 'string') {
                content = data
            } else {
                // 将二维数组转换为 CSV 格式
                content = data.map(row =>
                    row.map(cell =>
                        // 处理包含逗号、引号或换行符的单元格
                        typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
                            ? `"${cell.replace(/"/g, '""')}"`
                            : cell
                    ).join(',')
                ).join('\n')
            }

            return downloadText(content, filename, 'csv')
        } catch (error) {
            console.error('CSV 下载失败:', error)
            return false
        }
    }

    /**
     * 下载文本文件
     * @param content 文本内容
     * @param filename 文件名（不包含扩展名）
     */
    const downloadTxt = (
        content: string,
        filename: string = 'text'
    ): boolean => {
        return downloadText(content, filename, 'txt')
    }

    /**
     * 下载 XML 文件
     * @param content XML 内容
     * @param filename 文件名（不包含扩展名）
     */
    const downloadXml = (
        content: string,
        filename: string = 'data'
    ): boolean => {
        return downloadText(content, filename, 'xml')
    }

    /**
     * 下载 Markdown 文件
     * @param content Markdown 内容
     * @param filename 文件名（不包含扩展名）
     */
    const downloadMarkdown = (
        content: string,
        filename: string = 'document'
    ): boolean => {
        return downloadText(content, filename, 'md')
    }

    return {
        downloadText,
        downloadJson,
        downloadCsv,
        downloadTxt,
        downloadXml,
        downloadMarkdown
    }
}