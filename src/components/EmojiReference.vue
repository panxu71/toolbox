<template>
    <div class="emoji-reference">
        <div class="emoji-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="emoji-title">Emoji符号大全</h2>
            <div class="emoji-actions">
                <button class="action-btn" @click="copyAllEmojis" title="复制所有表情">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="emoji-content">
            <!-- 搜索区域 -->
            <div class="search-section">
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input v-model="searchQuery" type="text" class="search-input" placeholder="搜索表情符号..." />
                        <button v-if="searchQuery" class="clear-search-btn" @click="clearSearch">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 分类导航 -->
            <div class="category-nav">
                <button v-for="category in categories" :key="category.key"
                    :class="['category-btn', { active: activeCategory === category.key }]"
                    @click="setActiveCategory(category.key)">
                    <span class="category-icon">{{ category.icon }}</span>
                    <span class="category-name">{{ category.name }}</span>
                </button>
            </div>

            <!-- 表情网格 -->
            <div class="emoji-grid-container">
                <div v-if="filteredEmojis.length > 0" class="emoji-grid">
                    <div v-for="emoji in filteredEmojis" :key="emoji.code" class="emoji-item" @click="copyEmoji(emoji)"
                        :title="emoji.name">
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

        <!-- 消息提示 -->
        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>

        <!-- 回到顶部按钮 -->
        <button v-if="showBackToTop" class="back-to-top-btn" @click="scrollToTop" title="回到顶部">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m18 15-6-6-6 6" />
            </svg>
        </button>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useEmojis, type Emoji } from '../composables/useEmojis'

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('emoji-reference')

// 使用表情符号组合式函数
const {
    searchQuery,
    activeCategory,
    filteredEmojis,
    setActiveCategory,
    clearSearch,
    emojiCategories: categories
} = useEmojis()

// 本地状态
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const showBackToTop = ref(false)

// 方法

const copyEmoji = async (emoji: Emoji) => {
    try {
        await navigator.clipboard.writeText(emoji.symbol)
        showMessage(`已复制 ${emoji.symbol} ${emoji.name}`)
    } catch (error) {
        console.error('复制失败:', error)
        showMessage('复制失败，请手动选择')
    }
}

const copyAllEmojis = async () => {
    try {
        const allEmojis = filteredEmojis.value.map(emoji => emoji.symbol).join('')
        await navigator.clipboard.writeText(allEmojis)
        showMessage(`已复制 ${filteredEmojis.value.length} 个表情符号`)
    } catch (error) {
        console.error('复制失败:', error)
        showMessage('复制失败，请手动选择')
    }
}

const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 回到顶部相关方法
const scrollToTop = () => {
    const emojiContent = document.querySelector('.emoji-content')
    if (emojiContent) {
        emojiContent.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
}

const handleScroll = () => {
    const emojiContent = document.querySelector('.emoji-content')
    if (emojiContent) {
        showBackToTop.value = emojiContent.scrollTop > 300
    }
}

onMounted(() => {// 组件挂载时的初始化
    const emojiContent = document.querySelector('.emoji-content')
    if (emojiContent) {
        emojiContent.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    const emojiContent = document.querySelector('.emoji-content')
    if (emojiContent) {
        emojiContent.removeEventListener('scroll', handleScroll)
    }
})
</script>
<style scoped>
.emoji-reference {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.emoji-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    flex-shrink: 0;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: none;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 14px;
    transition: var(--transition);
}

.back-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border-color: var(--border-hover);
}

.emoji-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.emoji-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    width: 36px;
    height: 36px;
    background: none;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.action-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border-color: var(--border-hover);
}

.emoji-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 0 4rem 0;
}

.search-section {
    margin-bottom: 1.5rem;
    padding: 0 1rem;
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
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

.category-nav {
    display: flex;
    gap: 0.375rem;
    flex-wrap: nowrap;
    max-width: 1000px;
    margin: 1.5rem auto 2rem auto;
    padding: 0;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.category-nav::-webkit-scrollbar {
    display: none;
}

.category-btn {
    padding: 0.5rem 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.8125rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    white-space: nowrap;
    flex-shrink: 0;
}

.category-btn:hover {
    background: var(--bg-hover);
}

.category-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.category-icon {
    font-size: 0.875rem;
}

.category-name {
    font-weight: 500;
}

.emoji-grid-container {
    padding: 0 1rem;
}

.emoji-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    max-width: 1000px;
    margin: 0 auto;
    padding-bottom: 4rem;
}

.emoji-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition);
    text-align: center;
}

.emoji-item:hover {
    background: var(--bg-tertiary);
    border-color: var(--border-hover);
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

.message-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 20px;
    background: var(--success-color);
    color: white;
    border-radius: var(--radius-lg);
    font-size: 14px;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    animation: slideInUp 0.3s ease-out;
}

.message-toast.error {
    background: var(--error-color);
}

@keyframes slideInUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* 回到顶部按钮 */
.back-to-top-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-lg);
    transition: all 0.3s ease;
    z-index: 999;
    animation: slideInUp 0.3s ease-out;
}

.back-to-top-btn:hover {
    background: var(--primary-color-hover, #0056b3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.back-to-top-btn:active {
    transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .emoji-header {
        padding: 12px 16px;
    }

    .emoji-title {
        font-size: 18px;
    }

    .search-container {
        padding: 0 1rem;
    }

    .category-nav {
        gap: 0.375rem;
        padding: 0 0.75rem;
    }

    .category-btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.8125rem;
        gap: 0.375rem;
    }

    .category-icon {
        font-size: 0.875rem;
    }

    .emoji-grid-container {
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

    /* 移动端回到顶部按钮调整 */
    .back-to-top-btn {
        bottom: 20px;
        right: 20px;
        width: 44px;
        height: 44px;
    }
}

@media (max-width: 480px) {
    .search-container {
        padding: 0 0.75rem;
    }

    .category-nav {
        gap: 0.25rem;
        padding: 0 0.5rem;
    }

    .category-btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        gap: 0.25rem;
    }

    .category-icon {
        font-size: 0.8125rem;
    }

    .emoji-grid {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }

    .emoji-symbol {
        font-size: 24px;
    }

    .emoji-name {
        font-size: 11px;
    }

    /* 小屏幕回到顶部按钮调整 */
    .back-to-top-btn {
        bottom: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
    }

    .back-to-top-btn svg {
        width: 18px;
        height: 18px;
    }
}
</style>