<template>
    <div class="card-grid">
        <div class="grid-header">
            <div class="header-content">
                <h2 class="grid-title">{{ title }}</h2>
                <p class="grid-subtitle">{{ subtitle }}</p>
            </div>
            
            <!-- 居中的全局搜索框 -->
            <div class="search-container">
                <div class="search-box">
                    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input 
                        type="text" 
                        class="search-input" 
                        placeholder="搜索工具..." 
                        v-model="searchQuery"
                        @input="onSearchInput"
                        @focus="showSearchResults = true"
                        @blur="hideSearchResults"
                        @keydown.enter="selectFirstResult"
                        @keydown.down.prevent="navigateResults(1)"
                        @keydown.up.prevent="navigateResults(-1)"
                        @keydown.escape="clearSearch"
                    />
                    <button v-if="searchQuery" class="clear-search" @click="clearSearch">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                
                <!-- 搜索结果下拉框 -->
                <div v-if="showSearchResults && filteredResults.length > 0" class="search-results">
                    <div 
                        v-for="(result, index) in filteredResults.slice(0, 8)" 
                        :key="result.id"
                        class="search-result-item"
                        :class="{ active: selectedIndex === index }"
                        @mousedown.prevent="selectResult(result)"
                        @mouseenter="selectedIndex = index"
                    >
                        <div class="result-icon">{{ result.icon }}</div>
                        <div class="result-content">
                            <div class="result-title">{{ result.title }}</div>
                            <div class="result-description">{{ result.description }}</div>
                        </div>
                        <div class="result-category">{{ getCategoryName(result.category) }}</div>
                    </div>
                    <div v-if="filteredResults.length > 8" class="search-more">
                        还有 {{ filteredResults.length - 8 }} 个结果...
                    </div>
                </div>
            </div>
            
            <div class="header-spacer">
                <!-- 右侧占位，保持布局平衡 -->
            </div>
        </div>

        <div class="cards-container" :class="{ loading: isLoading }">
            <div class="cards-grid">
                <FunctionCard v-for="(card, index) in cards" :key="card.id" :card="card"
                    :style="{ animationDelay: `${index * 0.1}s` }" @execute="$emit('execute', $event)" />
            </div>

            <div v-if="isLoading" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p class="loading-text">执行中...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FunctionCard from './FunctionCard.vue'

interface Card {
    id: string
    title: string
    description: string
    icon: string
    action: string
    color: string
}

defineProps<{
    title: string
    subtitle?: string
    cards: Card[]
    isLoading?: boolean
}>()

const emit = defineEmits<{
    execute: [action: string]
    selectTool: [toolId: string, action: string]
}>()

// 搜索相关状态
const searchQuery = ref('')
const showSearchResults = ref(false)
const selectedIndex = ref(-1)
const allTools = ref<any[]>([])

// 加载所有工具数据
onMounted(async () => {
    try {
        // 动态导入配置文件
        const cardsModule = await import('../config/cards.json')
        const cards = cardsModule.default.cards
        
        // 扁平化所有工具
        allTools.value = Object.entries(cards).flatMap(([category, tools]: [string, any[]]) => 
            tools.map(tool => ({ ...tool, category }))
        )
    } catch (error) {
        console.error('加载工具配置失败:', error)
    }
})

// 过滤搜索结果
const filteredResults = computed(() => {
    if (!searchQuery.value.trim()) return []
    
    const query = searchQuery.value.toLowerCase().trim()
    return allTools.value.filter(tool => 
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.id.toLowerCase().includes(query)
    ).sort((a, b) => {
        // 标题匹配优先级更高
        const aTitle = a.title.toLowerCase().includes(query)
        const bTitle = b.title.toLowerCase().includes(query)
        if (aTitle && !bTitle) return -1
        if (!aTitle && bTitle) return 1
        return 0
    })
})

// 获取分类名称
const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
        json: 'JSON工具',
        time: '时间工具', 
        crypto: '加密工具',
        convert: '转换工具',
        create: '创建工具',
        query: '查询工具',
        navigation: '导航工具',
        settings: '设置'
    }
    return categoryNames[category] || category
}

// 搜索输入处理
const onSearchInput = () => {
    selectedIndex.value = -1
    showSearchResults.value = true
}

// 键盘导航
const navigateResults = (direction: number) => {
    if (filteredResults.value.length === 0) return
    
    const maxIndex = Math.min(filteredResults.value.length - 1, 7) // 最多显示8个
    selectedIndex.value = Math.max(0, Math.min(maxIndex, selectedIndex.value + direction))
}

// 选择第一个结果
const selectFirstResult = () => {
    if (filteredResults.value.length > 0) {
        selectResult(filteredResults.value[0])
    }
}

// 选择搜索结果
const selectResult = (result: any) => {
    emit('selectTool', result.id, result.action)
    clearSearch()
}

// 清空搜索
const clearSearch = () => {
    searchQuery.value = ''
    showSearchResults.value = false
    selectedIndex.value = -1
}

// 隐藏搜索结果（延迟以允许点击）
const hideSearchResults = () => {
    setTimeout(() => {
        showSearchResults.value = false
    }, 150)
}
</script>

<style scoped>
.card-grid {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg-primary);
}

.grid-header {
    padding: 32px 32px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 24px;
}

.header-content {
    justify-self: start;
}

.header-spacer {
    justify-self: end;
    width: 0;
}

.search-container {
    justify-self: center;
    width: 480px;
    position: relative;
}

.search-box {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--bg-primary);
    border: 2px solid transparent;
    border-radius: 24px;
    padding: 0 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.1),
        0 1px 2px rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(8px);
}

.search-box:hover {
    box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
}

.search-box:focus-within {
    border-color: var(--primary-color);
    box-shadow: 
        0 0 0 4px rgba(99, 102, 241, 0.1),
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);
}

.search-icon {
    color: var(--text-muted);
    margin-right: 16px;
    flex-shrink: 0;
    transition: color 0.2s ease;
}

.search-box:focus-within .search-icon {
    color: var(--primary-color);
}

.search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 16px 0;
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 400;
    width: 100%;
    letter-spacing: 0.01em;
}

.search-input::placeholder {
    color: var(--text-muted);
    font-weight: 400;
    transition: color 0.2s ease;
}

.search-box:focus-within .search-input::placeholder {
    color: rgba(99, 102, 241, 0.6);
}

.clear-search {
    background: var(--bg-tertiary);
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    margin-left: 12px;
    opacity: 0.7;
}

.clear-search:hover {
    background: var(--border-color);
    color: var(--text-primary);
    opacity: 1;
    transform: scale(1.05);
}

.search-results {
    position: absolute;
    top: calc(100% + 16px);
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    box-shadow: 
        0 20px 25px -5px rgba(0, 0, 0, 0.1),
        0 10px 10px -5px rgba(0, 0, 0, 0.04);
    z-index: 1000;
    max-height: 420px;
    overflow: hidden;
    backdrop-filter: blur(12px);
    animation: searchResultsIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes searchResultsIn {
    from {
        opacity: 0;
        transform: translateY(-8px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.search-result-item {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    cursor: pointer;
    transition: all 0.15s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    position: relative;
}

.search-result-item:last-child {
    border-bottom: none;
}

.search-result-item:hover,
.search-result-item.active {
    background: linear-gradient(135deg, 
        rgba(99, 102, 241, 0.08) 0%, 
        rgba(99, 102, 241, 0.04) 100%);
    transform: translateX(4px);
}

.search-result-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    border-radius: 0 2px 2px 0;
}

.result-icon {
    font-size: 20px;
    margin-right: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--bg-secondary);
    border-radius: 12px;
    transition: all 0.2s ease;
}

.search-result-item:hover .result-icon,
.search-result-item.active .result-icon {
    background: rgba(99, 102, 241, 0.1);
    transform: scale(1.05);
}

.result-content {
    flex: 1;
    min-width: 0;
}

.result-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
    line-height: 1.4;
}

.result-description {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.4;
    opacity: 0.8;
}

.result-category {
    font-size: 11px;
    color: var(--primary-color);
    background: rgba(99, 102, 241, 0.1);
    padding: 4px 8px;
    border-radius: 8px;
    flex-shrink: 0;
    margin-left: 12px;
    font-weight: 500;
    letter-spacing: 0.02em;
}

.search-more {
    padding: 16px 20px;
    text-align: center;
    font-size: 13px;
    color: var(--text-muted);
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    font-weight: 500;
}

.grid-title {
    margin: 0 0 8px 0;
    font-size: 28px;
    color: var(--text-primary);
    font-weight: 700;
    background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.grid-subtitle {
    margin: 0;
    font-size: 16px;
    color: var(--text-muted);
    font-weight: 500;
}

.cards-container {
    flex: 1;
    padding: 32px;
    overflow-y: auto;
    position: relative;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

.loading-text {
    color: var(--text-secondary);
    font-size: 16px;
    font-weight: 500;
    margin: 0;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .cards-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
    }

    .cards-container {
        padding: 24px;
    }

    .grid-header {
        padding: 24px;
        grid-template-columns: 1fr;
        gap: 24px;
        text-align: center;
    }

    .header-content {
        justify-self: center;
    }

    .header-spacer {
        display: none;
    }

    .search-container {
        width: 100%;
        max-width: 480px;
        justify-self: center;
    }
}

@media (max-width: 640px) {
    .search-container {
        width: 100%;
        max-width: none;
        padding: 0 8px;
    }

    .search-box {
        padding: 0 20px;
    }

    .search-input {
        padding: 14px 0;
        font-size: 16px;
    }

    .search-results {
        border-radius: 16px;
        margin: 0 8px;
        left: -8px;
        right: -8px;
    }

    .result-icon {
        width: 36px;
        height: 36px;
        font-size: 18px;
    }
}

@media (max-width: 640px) {
    .cards-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .cards-container {
        padding: 16px;
    }

    .grid-header {
        padding: 16px;
    }

    .grid-title {
        font-size: 24px;
    }

    .grid-subtitle {
        font-size: 14px;
    }
}
</style>