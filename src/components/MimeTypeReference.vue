<template>
    <div class="mime-type-reference">
        <PageHeader :title="pageTitle" @back="handleBack">
            <template #actions>
                <HeaderActionButton icon="download" tooltip="导出数据" @click="exportData" />
                <HeaderActionButton icon="refresh" tooltip="重置筛选" @click="resetFilters" />
            </template>
        </PageHeader>

        <div class="converter-content">
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
                                    <HeaderActionButton icon="copy" tooltip="复制MIME类型"
                                        @click="copyMimeType(mimeType.mimeType)" class="copy-btn-table" />
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

        <!-- 回到顶部按钮 -->
        <ScrollToTop :threshold="200" container=".converter-content" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import ScrollToTop from './common/ScrollToTop.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import cardsConfig from '../config/cards.json'

const emit = defineEmits<{
    back: []
}>()

interface MimeTypeInfo {
    extension: string
    mimeType: string
    description: string
    category: string
}

// 使用页面标题管理
usePageTitle('mime-type-reference')
const { success, error } = useNotification()

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'mime-type-reference')
        if (card) {
            return card.title
        }
    }
    return 'MIME-Type 速查表'
})

// 基本状态
const searchQuery = ref('')
const activeCategory = ref('all')
const currentPage = ref(1)
const pageSize = 20

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
const mimeTypes = ref<MimeTypeInfo[]>([
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

// 重置筛选
const resetFilters = () => {
    searchQuery.value = ''
    activeCategory.value = 'all'
    currentPage.value = 1
    success('已重置筛选条件')
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
        success(`已复制MIME类型: ${mimeType}`)
    } catch (err) {
        console.error('复制失败:', err)
        error('复制失败，请手动复制')
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

    success('数据已导出为 mime-types.json')
}

// 处理返回事件
const handleBack = () => {
    emit('back')
}

// 初始化
onMounted(() => {
    success(`共收录 ${mimeTypes.value.length} 种文件类型`)
})
</script>
<style scoped>
.mime-type-reference {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.converter-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

/* 搜索区域样式 */
.search-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-sm);
    margin-bottom: 2rem;
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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
    padding: 1rem 1rem 1rem 2.5rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 1rem;
    transition: var(--transition);
    box-sizing: border-box;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-search-btn {
    position: absolute;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--bg-tertiary);
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
}

.clear-search-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.category-filter {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.category-btn {
    padding: 0.75rem 1.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.875rem;
    font-weight: 500;
}

.category-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
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
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-primary);
}

.table-header h3 {
    font-size: 1.25rem;
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
    font-weight: 500;
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
    padding: 1rem 1.5rem;
    text-align: left;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    font-size: 0.875rem;
    white-space: nowrap;
}

.mime-table td {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.875rem;
    vertical-align: middle;
}

.mime-row:hover {
    background: var(--bg-tertiary);
}

.extension-cell .extension {
    display: inline-block;
    padding: 0.375rem 0.75rem;
    background: var(--primary-color);
    color: white;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.8rem;
}

.mime-cell .mime-type {
    background: var(--bg-tertiary);
    padding: 0.375rem 0.75rem;
    border-radius: var(--radius-md);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.8rem;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.description-cell .description {
    color: var(--text-secondary);
    line-height: 1.4;
}

.action-cell {
    text-align: center;
}

.copy-btn-table {
    width: 32px !important;
    height: 32px !important;
}

/* 分页样式 */
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--border-color);
    background: var(--bg-primary);
}

.page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
}

.page-btn:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--bg-tertiary);
}

.page-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
    padding: 0 1rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .converter-content {
        padding: 1.5rem;
        padding-bottom: 5rem;
    }

    .mime-table th,
    .mime-table td {
        padding: 0.75rem 1rem;
    }

    .table-header {
        padding: 1.25rem 1.5rem;
    }
}

@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }

    .search-section {
        padding: 1.5rem;
    }

    .table-header {
        padding: 1rem;
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
    }

    .category-filter {
        justify-content: center;
    }

    .category-btn {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }

    .mime-table {
        font-size: 0.8rem;
    }

    .mime-table th,
    .mime-table td {
        padding: 0.75rem;
    }

    .extension-cell .extension {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
    }

    .mime-cell .mime-type {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
    }

    .pagination {
        padding: 1rem;
    }
}

@media (max-width: 480px) {
    .converter-content {
        padding: 0.75rem;
        padding-bottom: 3rem;
    }

    .search-section {
        padding: 1rem;
    }

    .search-container {
        gap: 1rem;
    }

    .category-btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
    }

    .table-header h3 {
        font-size: 1.125rem;
    }

    .mime-table th,
    .mime-table td {
        padding: 0.5rem;
    }

    /* 在小屏幕上隐藏描述列 */
    .mime-table th:nth-child(3),
    .mime-table td:nth-child(3) {
        display: none;
    }
}
</style>