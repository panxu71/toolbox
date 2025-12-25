<template>
    <header class="header">
        <div class="header-left">
            <div class="logo" @click="$emit('goHome')" role="button" tabindex="0">
                <div class="logo-icon">
                    <img src="/src/assets/icons/icon48.png" alt="Toolbox" />
                </div>
                <h1 class="logo-text">Toolbox</h1>
            </div>
            <div class="breadcrumb">
                <span class="breadcrumb-text">现代化工具箱</span>
            </div>
        </div>

        <div class="header-center">
            <!-- 中间区域保持空白 -->
        </div>

        <div class="header-right">
            <!-- GitHub Star 按钮 -->
            <a href="https://github.com/panxu71/toolbox" target="_blank" class="github-star-btn"
                title="在GitHub上给我们一个Star">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon
                        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26">
                    </polygon>
                </svg>
                <span class="star-text">Star</span>
                <img src="https://img.shields.io/github/stars/panxu71/toolbox?style=social&label=" alt="GitHub stars"
                    class="star-badge" />
            </a>

            <ThemeToggle />

            <button class="refresh-btn" @click="$emit('refresh')" title="刷新页面信息">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="m20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                </svg>
            </button>

            <div class="status-indicator">
                <div class="status-dot"></div>
                <span class="status-text">已连接</span>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'

defineProps<{
    currentTab?: any
    pageInfo?: any
}>()

defineEmits<{
    refresh: []
    goHome: []
}>()
</script>

<style scoped>
.header {
    height: 64px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    backdrop-filter: blur(10px);
    position: relative;
    z-index: 10;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 24px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: var(--radius-sm);
}

.logo-icon {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
}

.logo-icon img {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.logo-text {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.breadcrumb {
    display: flex;
    align-items: center;
}

.breadcrumb-text {
    font-size: 14px;
    color: var(--text-muted);
    font-weight: 500;
}

.header-center {
    flex: 1;
    display: flex;
    justify-content: center;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex-shrink: 0;
}

.github-star-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
}

.github-star-btn svg {
    width: 12px;
    height: 12px;
}

.star-badge {
    height: 20px;
    border-radius: var(--radius-sm);
}

.tab-info {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 8px 16px;
    text-align: center;
    min-width: 200px;
    max-width: 100%;
}

.tab-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tab-url {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.refresh-btn {
    width: 28px;
    height: 28px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.refresh-btn svg {
    width: 14px;
    height: 14px;
}

.refresh-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
    transform: rotate(90deg);
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
}

.status-dot {
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.status-text {
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 500;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>