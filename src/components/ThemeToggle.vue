<template>
    <div class="theme-toggle-wrapper">
        <button class="theme-toggle" @click="toggleTheme" @contextmenu="handleContextMenu" :title="getTooltip()">
            <!-- 自动模式图标 -->
            <svg v-if="isAuto()" class="icon auto-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="m12 2 3 10h-6l3-10z"></path>
                <path d="m12 22-3-10h6l-3 10z"></path>
                <path d="m17 16 10-3v6l-10-3z"></path>
                <path d="m7 8-10 3v-6l10 3z"></path>
            </svg>
            <!-- 夜间模式图标 -->
            <svg v-else-if="isDark()" class="icon moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <!-- 白天模式图标 -->
            <svg v-else class="icon sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        </button>
        
        <!-- 右键菜单 -->
        <div v-if="showMenu" class="theme-menu" @click.stop>
            <div class="menu-item" @click="setTheme('auto')" :class="{ active: isAuto() }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="m12 2 3 10h-6l3-10z"></path>
                </svg>
                <span>智能切换</span>
                <small>21:00-07:00</small>
            </div>
            <div class="menu-item" @click="setTheme('light')" :class="{ active: !isAuto() && isLight() }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                </svg>
                <span>白天模式</span>
            </div>
            <div class="menu-item" @click="setTheme('dark')" :class="{ active: !isAuto() && isDark() }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                <span>夜间模式</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const { toggleTheme, setTheme, isDark, isLight, isAuto } = useTheme()

const showMenu = ref(false)

const getTooltip = () => {
    if (isAuto()) {
        return '智能切换模式 (右键查看选项)'
    } else if (isDark()) {
        return '夜间模式 (右键查看选项)'
    } else {
        return '白天模式 (右键查看选项)'
    }
}

const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    showMenu.value = !showMenu.value
}

const handleClickOutside = (e: MouseEvent) => {
    if (showMenu.value) {
        showMenu.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.theme-toggle-wrapper {
    position: relative;
}

.theme-toggle {
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

.theme-toggle:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.icon {
    color: var(--text-secondary);
    transition: var(--transition);
}

.theme-toggle:hover .icon {
    color: var(--text-primary);
}

.auto-icon {
    color: #f59e0b;
}

.sun-icon {
    color: #f59e0b;
}

.moon-icon {
    color: #e2e8f0;
}

.theme-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    min-width: 160px;
    z-index: 1000;
    overflow: hidden;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    cursor: pointer;
    transition: var(--transition);
    font-size: 14px;
    color: var(--text-secondary);
}

.menu-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.menu-item.active {
    background: var(--primary-color-alpha);
    color: var(--primary-color);
}

.menu-item svg {
    flex-shrink: 0;
}

.menu-item span {
    flex: 1;
    font-weight: 500;
}

.menu-item small {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: normal;
}

.menu-item.active small {
    color: var(--primary-color);
    opacity: 0.8;
}
</style>