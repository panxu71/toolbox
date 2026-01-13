<template>
    <div class="emoji-reference">
        <!-- 使用公共组件PageHeader -->
        <PageHeader :title="pageTitle" @back="$emit('back')" />

        <div class="converter-content">
            <div class="content-wrapper">
                <!-- 使用公共搜索组件 -->
                <SearchSection v-model:searchQuery="searchQuery" placeholder="搜索表情符号..." :filters="categoryFilters"
                    v-model:activeFilter="activeCategory" />

                <!-- 表情网格 -->
                <div class="emoji-grid-container">
                    <div v-if="filteredEmojis.length > 0" class="emoji-grid">
                        <div v-for="emoji in filteredEmojis" :key="emoji.code" class="emoji-item"
                            @click="copyEmoji(emoji)" :title="emoji.name">
                            <span class="emoji-symbol">{{ emoji.symbol }}</span>
                            <span class="emoji-name">{{ emoji.name }}</span>
                        </div>
                    </div>
                    <div v-else class="no-results">
                        <div class="no-results-icon">😅</div>
                        <p>没有找到匹配的表情符号</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 使用公共组件ScrollToTop，指定滚动容器 -->
        <ScrollToTop container=".converter-content" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useEmojis, type Emoji } from '../composables/useEmojis'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import ScrollToTop from './common/ScrollToTop.vue'
import SearchSection from './common/SearchSection.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('emoji-reference')

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'emoji-reference')
        if (card) {
            return card.title
        }
    }
    return 'Emoji符号大全'
})

// 使用表情符号组合式函数
const {
    searchQuery,
    activeCategory,
    filteredEmojis,
    emojiCategories: categories
} = useEmojis()

// 将分类转换为SearchSection组件需要的格式
const categoryFilters = computed(() => {
    return categories.map(category => ({
        key: category.key,
        name: category.name
    }))
})

// 使用通知系统
const { copySuccess, copyError } = useNotification()

// 方法
const copyEmoji = async (emoji: Emoji) => {
    try {
        await navigator.clipboard.writeText(emoji.symbol)
        copySuccess(`${emoji.symbol} ${emoji.name}`)
    } catch (error) {
        console.error('复制失败:', error)
        copyError('复制失败，请手动选择')
    }
}
</script>

<style scoped>
.emoji-reference {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.converter-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 0 4rem 0;
}

/* 内容容器 - 限制宽度并居中 */
.content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 表情网格 */
.emoji-grid-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 20px;
    box-shadow: var(--shadow-sm);
    margin-bottom: 2rem;
}

.emoji-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
}

.emoji-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    text-align: center;
}

.emoji-item:hover {
    background: var(--bg-tertiary);
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.emoji-symbol {
    font-size: 32px;
    line-height: 1;
}

.emoji-name {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
    word-break: break-all;
}

.no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 60px 20px;
    text-align: center;
}

.no-results-icon {
    font-size: 48px;
    opacity: 0.5;
}

.no-results p {
    margin: 0;
    color: var(--text-secondary);
    font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .converter-content {
        padding: 16px;
    }

    .emoji-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 8px;
    }

    .emoji-item {
        padding: 12px 6px;
    }

    .emoji-symbol {
        font-size: 28px;
    }
}

@media (max-width: 480px) {
    .emoji-grid {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }

    .emoji-symbol {
        font-size: 24px;
    }

    .emoji-name {
        font-size: 11px;
    }
}

/* 自定义分类筛选样式 - 优化为一行显示 */
:deep(.category-filter) {
    display: flex;
    gap: 0.375rem;
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 0.25rem;
}

:deep(.category-filter)::-webkit-scrollbar {
    display: none;
}

:deep(.category-btn) {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: fit-content;
}

/* 移动端进一步优化分类按钮 */
@media (max-width: 768px) {
    :deep(.category-btn) {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
    }
}

@media (max-width: 480px) {
    :deep(.category-btn) {
        padding: 0.25rem 0.5rem;
        font-size: 0.7rem;
    }
}
</style>