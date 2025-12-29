<template>
    <nav class="navigation">
        <div class="nav-content">
            <ul class="nav-list">
                <li v-for="item in navigationItems" :key="item.id"
                    :class="['nav-item', { active: item.id === activeNav }]" @click="$emit('navigate', item.id)">
                    <div class="nav-item-content">
                        <span class="nav-icon">{{ item.icon }}</span>
                        <span class="nav-name">{{ item.name }}</span>
                        <div v-if="item.id === activeNav" class="active-indicator"></div>
                    </div>
                </li>
            </ul>
        </div>

        <div class="nav-footer">
            <!-- 底部按钮组 -->
            <div class="footer-buttons">
                <!-- 反馈按钮 -->
                <button class="footer-btn" @click="$emit('openFeedback')" title="反馈">
                    <span class="footer-icon">💬</span>
                    <span class="footer-text">反馈</span>
                </button>

                <!-- 设置按钮 -->
                <button class="footer-btn" @click="$emit('openSettings')" title="设置">
                    <span class="footer-icon">⚙️</span>
                    <span class="footer-text">设置</span>
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
interface NavigationItem {
    id: string
    name: string
    icon: string
    active: boolean
}

defineProps<{
    navigationItems: NavigationItem[]
    activeNav: string
}>()

defineEmits<{
    navigate: [id: string]
    openSettings: []
    openFeedback: []
}>()
</script>

<style scoped>
.navigation {
    width: 240px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
}

.nav-content {
    flex: 1;
    padding: 24px 16px;
    overflow-y: auto;
}

.nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-item {
    /* 移除动画 */
}

.nav-item-content {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    cursor: pointer;
    border-radius: var(--radius-lg);
    position: relative;
    background: transparent;
    border: 1px solid transparent;
}

.nav-item:hover .nav-item-content {
    background: var(--bg-tertiary);
    border-color: var(--border-color);
}

.nav-item.active .nav-item-content {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
    border-color: var(--primary-light);
    box-shadow: var(--shadow-lg);
}

.nav-icon {
    font-size: 20px;
    margin-right: 16px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-item.active .nav-icon {
    /* 移除缩放动画 */
}

.nav-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-secondary);
    flex: 1;
}

.nav-item:hover .nav-name {
    color: var(--text-primary);
}

.nav-item.active .nav-name {
    color: white;
    font-weight: 700;
}

.active-indicator {
    position: absolute;
    right: 12px;
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.nav-footer {
    padding: 16px;
    border-top: 1px solid var(--border-color);
    background: var(--bg-tertiary);
}

.footer-buttons {
    display: flex;
    gap: 12px;
}

.footer-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 13px;
    min-height: 36px;
}

.footer-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.footer-icon {
    font-size: 14px;
}

.footer-text {
    font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .navigation {
        width: 200px;
    }

    .nav-item-content {
        padding: 12px 16px;
    }

    .nav-name {
        font-size: 14px;
    }

    .footer-btn {
        padding: 6px 8px;
        font-size: 12px;
        min-height: 32px;
    }

    .footer-icon {
        font-size: 13px;
    }
}

@media (max-width: 640px) {
    .navigation {
        width: 60px;
    }

    .nav-name {
        display: none;
    }

    .nav-item-content {
        justify-content: center;
        padding: 12px;
    }

    .nav-icon {
        margin-right: 0;
    }

    .footer-buttons {
        flex-direction: column;
        gap: 4px;
    }

    .footer-text {
        display: none;
    }

    .footer-btn {
        justify-content: center;
        padding: 6px;
        min-height: 28px;
    }
}
</style>