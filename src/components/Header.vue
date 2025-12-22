<template>
    <header class="header">
        <div class="header-left">
            <div class="logo">
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
            <ThemeToggle />

            <button class="refresh-btn" @click="$emit('refresh')" title="刷新页面信息">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    gap: 12px;
}

.logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
        0 4px 12px rgba(99, 102, 241, 0.2),
        0 2px 4px rgba(99, 102, 241, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    padding: 8px;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.logo-icon::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.25) 0%, 
        rgba(255, 255, 255, 0.1) 50%, 
        rgba(255, 255, 255, 0.05) 100%);
    border-radius: var(--radius-lg);
    pointer-events: none;
}

.logo-icon:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
        0 8px 20px rgba(99, 102, 241, 0.3),
        0 4px 8px rgba(99, 102, 241, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.logo-icon img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    filter: brightness(0) invert(1);
    z-index: 1;
    position: relative;
}

.logo-text {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
    transition: var(--transition);
}

.logo:hover .logo-text {
    text-shadow: 0 0 25px rgba(99, 102, 241, 0.4);
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
    gap: 12px;
    min-width: 0;
    flex-shrink: 0;
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
    width: 36px;
    height: 36px;
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

.refresh-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
    transform: rotate(90deg);
}

.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
}

.status-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

.status-text {
    font-size: 12px;
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