<template>
    <div class="search-section">
        <div class="search-container">
            <div class="search-input-wrapper">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <input 
                    :value="searchQuery" 
                    @input="$emit('update:searchQuery', $event.target.value)"
                    type="text" 
                    :placeholder="placeholder" 
                    class="search-input"
                />
                <button v-if="searchQuery" @click="$emit('update:searchQuery', '')" class="clear-search-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
            
            <!-- 筛选按钮 -->
            <div v-if="filters && filters.length > 0" class="category-filter">
                <button
                    v-for="filter in filters"
                    :key="filter.key"
                    class="category-btn"
                    :class="{ active: activeFilter === filter.key }"
                    @click="$emit('update:activeFilter', filter.key)"
                >
                    {{ filter.name }}
                    <span v-if="filter.count !== undefined" class="filter-count">({{ filter.count }})</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Filter {
    key: string
    name: string
    count?: number
}

defineProps<{
    searchQuery: string
    placeholder?: string
    filters?: Filter[]
    activeFilter?: string
}>()

defineEmits<{
    'update:searchQuery': [value: string]
    'update:activeFilter': [value: string]
}>()
</script>

<style scoped>
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.category-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.category-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.filter-count {
    font-size: 0.75rem;
    opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .search-section {
        padding: 1.5rem;
    }

    .search-container {
        gap: 1rem;
    }

    .search-input {
        padding: 0.875rem 0.875rem 0.875rem 2.25rem;
        font-size: 0.875rem;
    }

    .search-icon {
        left: 0.875rem;
    }

    .clear-search-btn {
        right: 0.875rem;
    }

    .category-btn {
        padding: 0.625rem 1rem;
        font-size: 0.8rem;
    }
}

@media (max-width: 480px) {
    .search-section {
        padding: 1rem;
    }

    .category-filter {
        gap: 0.375rem;
    }

    .category-btn {
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
    }
}
</style>