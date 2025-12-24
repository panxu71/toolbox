<template>
    <div class="mime-type-reference">
        <div class="reference-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="reference-title">MIME-Type 速查表</h2>
            <div class="reference-actions">
                <button class="action-btn" @click="exportData" title="导出数据">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7,10 12,15 17,10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="reference-content">
            <!-- 搜索和筛选 -->
            <div class="search-section">
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input v-model="searchQuery" type="text" placeholder="搜索文件扩展名或MIME类型..." class="search-input"
                            @input="filterMimeTypes" />
                        <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="category-filter">
                        <button v-for="category in categories" :key="category.key"
                            @click="setActiveCategory(category.key)"
                            :class="['category-btn', { active: activeCategory === category.key }]">
                            {{ category.name }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- MIME类型表格 -->
            <div class="mime-table-section">
                <div class="table-header">
                    <h3>{{ getCategoryTitle() }}</h3>
                    <div class="table-info">
                        <span class="info-text">共 {{ filteredMimeTypes.length }} 条记录</span>
                    </div>
                </div>

                <div class="table-container">
                    <table class="mime-table">
                        <thead>
                            <tr>
                                <th>文件扩展名</th>
                                <th>MIME类型</th>
                                <th>描述</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="mimeType in paginatedMimeTypes" :key="mimeType.extension" class="mime-row">
                                <td class="extension-cell">
                                    <span class="extension">{{ mimeType.extension }}</span>
                                </td>
                                <td class="mime-cell">
                                    <code class="mime-type">{{ mimeType.mimeType }}</code>
                                </td>
                                <td class="description-cell">
                                    <span class="description">{{ mimeType.description }}</span>
                                </td>
                                <td class="action-cell">
                                    <button @click="copyMimeType(mimeType.mimeType)" class="copy-btn" title="复制MIME类型">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 分页 -->
                <div class="pagination" v-if="totalPages > 1">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

defineEmits<{
    back: []
}>()

// 基本状态
const searchQuery = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const pageSize = 20

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 分类定义
const categories = [
    { key: 'all', name: '全部' },
    { key: 'text', name: '文本' },
    { key: 'image', name: '图片' },
    { key: 'video', name: '视频' },
    { key: 'audio', name: '音频' },
    { key: 'application', name: '应用程序' },
    { key: 'font', name: '字体' }
]

// MIME类型数据
const mimeTypes = ref([
    // 文本类型
    { extension: '.txt', mimeType: 'text/plain', description: '纯文本文件', category: 'text' },
    { extension: '.html', mimeType: 'text/html', description: 'HTML文档', category: 'text' },
    { extension: '.htm', mimeType: 'text/html', description: 'HTML文档', category: 'text' },
    { extension: '.css', mimeType: 'text/css', description: 'CSS样式表', category: 'text' },
    { extension: '.js', mimeType: 'text/javascript', description: 'JavaScript文件', category: 'text' },
    { extension: '.json', mimeType: 'application/json', description: 'JSON数据文件', category: 'text' },
    { extension: '.xml', mimeType: 'text/xml', description: 'XML文档', category: 'text' },
    { extension: '.csv', mimeType: 'text/csv', description: 'CSV数据文件', category: 'text' },
    { extension: '.md', mimeType: 'text/markdown', description: 'Markdown文档', category: 'text' },

    // 图片类型
    { extension: '.jpg', mimeType: 'image/jpeg', description: 'JPEG图片', category: 'image' },
    { extension: '.jpeg', mimeType: 'image/jpeg', description: 'JPEG图片', category: 'image' },
    { extension: '.png', mimeType: 'image/png', description: 'PNG图片', category: 'image' },
    { extension: '.gif', mimeType: 'image/gif', description: 'GIF动画', category: 'image' },
    { extension: '.bmp', mimeType: 'image/bmp', description: 'BMP位图', category: 'image' },
    { extension: '.webp', mimeType: 'image/webp', description: 'WebP图片', category: 'image' },
    { extension: '.svg', mimeType: 'image/svg+xml', description: 'SVG矢量图', category: 'image' },
    { extension: '.ico', mimeType: 'image/x-icon', description: '图标文件', category: 'image' },
    { extension: '.tiff', mimeType: 'image/tiff', description: 'TIFF图片', category: 'image' },

    // 视频类型
    { extension: '.mp4', mimeType: 'video/mp4', description: 'MP4视频', category: 'video' },
    { extension: '.avi', mimeType: 'video/x-msvideo', description: 'AVI视频', category: 'video' },
    { extension: '.mov', mimeType: 'video/quicktime', description: 'QuickTime视频', category: 'video' },
    { extension: '.wmv', mimeType: 'video/x-ms-wmv', description: 'Windows Media视频', category: 'video' },
    { extension: '.flv', mimeType: 'video/x-flv', description: 'Flash视频', category: 'video' },
    { extension: '.webm', mimeType: 'video/webm', description: 'WebM视频', category: 'video' },
    { extension: '.mkv', mimeType: 'video/x-matroska', description: 'Matroska视频', category: 'video' },
    { extension: '.3gp', mimeType: 'video/3gpp', description: '3GPP视频', category: 'video' },

    // 音频类型
    { extension: '.mp3', mimeType: 'audio/mpeg', description: 'MP3音频', category: 'audio' },
    { extension: '.wav', mimeType: 'audio/wav', description: 'WAV音频', category: 'audio' },
    { extension: '.ogg', mimeType: 'audio/ogg', description: 'OGG音频', category: 'audio' },
    { extension: '.aac', mimeType: 'audio/aac', description: 'AAC音频', category: 'audio' },
    { extension: '.flac', mimeType: 'audio/flac', description: 'FLAC无损音频', category: 'audio' },
    { extension: '.m4a', mimeType: 'audio/mp4', description: 'M4A音频', category: 'audio' },
    { extension: '.wma', mimeType: 'audio/x-ms-wma', description: 'Windows Media音频', category: 'audio' },

    // 应用程序类型
    { extension: '.pdf', mimeType: 'application/pdf', description: 'PDF文档', category: 'application' },
    { extension: '.doc', mimeType: 'application/msword', description: 'Word文档', category: 'application' },
    { extension: '.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', description: 'Word文档(新版)', category: 'application' },
    { extension: '.xls', mimeType: 'application/vnd.ms-excel', description: 'Excel表格', category: 'application' },
    { extension: '.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', description: 'Excel表格(新版)', category: 'application' },
    { extension: '.ppt', mimeType: 'application/vnd.ms-powerpoint', description: 'PowerPoint演示文稿', category: 'application' },
    { extension: '.pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', description: 'PowerPoint演示文稿(新版)', category: 'application' },
    { extension: '.zip', mimeType: 'application/zip', description: 'ZIP压缩包', category: 'application' },
    { extension: '.rar', mimeType: 'application/vnd.rar', description: 'RAR压缩包', category: 'application' },
    { extension: '.7z', mimeType: 'application/x-7z-compressed', description: '7-Zip压缩包', category: 'application' },
    { extension: '.tar', mimeType: 'application/x-tar', description: 'TAR归档文件', category: 'application' },
    { extension: '.gz', mimeType: 'application/gzip', description: 'GZIP压缩文件', category: 'application' },
    { extension: '.exe', mimeType: 'application/vnd.microsoft.portable-executable', description: 'Windows可执行文件', category: 'application' },
    { extension: '.dmg', mimeType: 'application/x-apple-diskimage', description: 'macOS磁盘映像', category: 'application' },
    { extension: '.deb', mimeType: 'application/vnd.debian.binary-package', description: 'Debian软件包', category: 'application' },
    { extension: '.rpm', mimeType: 'application/x-rpm', description: 'RPM软件包', category: 'application' },

    // 字体类型
    { extension: '.ttf', mimeType: 'font/ttf', description: 'TrueType字体', category: 'font' },
    { extension: '.otf', mimeType: 'font/otf', description: 'OpenType字体', category: 'font' },
    { extension: '.woff', mimeType: 'font/woff', description: 'Web字体格式', category: 'font' },
    { extension: '.woff2', mimeType: 'font/woff2', description: 'Web字体格式2', category: 'font' },
    { extension: '.eot', mimeType: 'application/vnd.ms-fontobject', description: 'Embedded OpenType字体', category: 'font' }
])

// 过滤后的MIME类型
const filteredMimeTypes = computed(() => {
    let filtered = mimeTypes.value

    // 按分类过滤
    if (activeCategory.value !== 'all') {
        filtered = filtered.filter(item => item.category === activeCategory.value)
    }

    // 按搜索关键词过滤
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item =>
            item.extension.toLowerCase().includes(query) ||
            item.mimeType.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        )
    }

    return filtered
})

// 分页后的MIME类型
const paginatedMimeTypes = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return filteredMimeTypes.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
    return Math.ceil(filteredMimeTypes.value.length / pageSize)
})

// 过滤MIME类型
const filterMimeTypes = () => {
    currentPage.value = 1
}

// 清空搜索
const clearSearch = () => {
    searchQuery.value = ''
    filterMimeTypes()
}

// 设置活动分类
const setActiveCategory = (category: string) => {
    activeCategory.value = category
    currentPage.value = 1
}

// 获取分类标题
const getCategoryTitle = () => {
    const category = categories.find(c => c.key === activeCategory.value)
    return category ? `${category.name}类型` : 'MIME类型'
}

// 跳转到指定页面
const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

// 复制MIME类型
const copyMimeType = async (mimeType: string) => {
    try {
        await navigator.clipboard.writeText(mimeType)
        showMessage('MIME类型已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 导出数据
const exportData = () => {
    const data = filteredMimeTypes.value.map(item => ({
        扩展名: item.extension,
        MIME类型: item.mimeType,
        描述: item.description,
        分类: item.category
    }))

    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'mime-types.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showMessage('数据已导出', 'success')
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error') => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

onMounted(() => {
    // 组件挂载时的初始化逻辑
})
</script>

<style scoped>
.mime-type-reference {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.reference-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.back-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.reference-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.reference-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.reference-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

/* 搜索区域样式 */
.search-section {
    margin-bottom: 2rem;
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: var(--text-secondary);
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.clear-search-btn {
    position: absolute;
    right: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--bg-tertiary);
    border: none;
    border-radius: 0.25rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.clear-search-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.category-filter {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.category-btn {
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.category-btn:hover {
    background: var(--bg-hover);
}

.category-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* 表格区域样式 */
.mime-table-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
}

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.table-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.table-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.table-container {
    overflow-x: auto;
}

.mime-table {
    width: 100%;
    border-collapse: collapse;
}

.mime-table th {
    background: var(--bg-tertiary);
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    font-size: 0.875rem;
}

.mime-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.875rem;
}

.mime-row:hover {
    background: var(--bg-tertiary);
}

.extension-cell .extension {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    background: var(--primary-color-alpha);
    color: var(--primary-color);
    border-radius: 0.25rem;
    font-weight: 500;
    font-family: 'Courier New', monospace;
}

.mime-cell .mime-type {
    background: var(--bg-tertiary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    color: var(--text-primary);
}

.description-cell .description {
    color: var(--text-secondary);
}

.action-cell {
    text-align: center;
}

.copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
}

/* 分页样式 */
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
}

.page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* 消息提示样式 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.message-toast.success {
    background: var(--success-color);
}

.message-toast.error {
    background: var(--error-color);
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* 响应式设计 */
@media (max-width: 1024px) {

    .mime-table th,
    .mime-table td {
        padding: 0.75rem;
    }
}

@media (max-width: 768px) {
    .reference-content {
        padding: 1rem;
    }

    .table-header {
        padding: 1rem;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .category-filter {
        justify-content: center;
    }

    .mime-table {
        font-size: 0.8rem;
    }

    .mime-table th,
    .mime-table td {
        padding: 0.5rem;
    }
}

@media (max-width: 480px) {
    .reference-header {
        padding: 0.75rem 1rem;
    }

    .reference-title {
        font-size: 1.125rem;
    }

    .reference-content {
        padding: 0.75rem;
    }

    .search-container {
        gap: 0.75rem;
    }

    .category-btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.8rem;
    }
}
</style>