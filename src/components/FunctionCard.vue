<template>
    <div class="function-card" @click="$emit('execute', card.action)">
        <!-- 状态徽章 -->
        <div v-if="card.badge" class="status-badge" :style="{ backgroundColor: card.badge.color }">
            {{ card.badge.text }}
        </div>

        <div class="card-content">
            <!-- 圆形图标 -->
            <div class="icon-circle" :style="{ backgroundColor: card.color + '20' }">
                <div class="card-icon" :style="{ color: card.color }">
                    {{ card.icon }}
                </div>
            </div>

            <!-- 内容区域 -->
            <div class="content-area">
                <h3 class="card-title">{{ card.title }}</h3>
                <p class="card-description">{{ card.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


interface FunctionCard {
    id: string
    title: string
    description: string
    icon: string
    action: string
    color: string
    badge?: {
        text: string
        color: string
    }
}

const props = defineProps<{
    card: FunctionCard
}>()

defineEmits<{
    execute: [action: string]
}>()
</script>

<style scoped>
.function-card {
    position: relative;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
    height: 100px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.function-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    border-color: var(--border-hover);
}

.function-card:active {
    transform: translateY(-1px);
}

/* 状态徽章 - 使用JSON配置的颜色 */
.status-badge {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    padding: 6px 12px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: white;
    border-top-right-radius: 16px;
    border-bottom-left-radius: 12px;
    transform-origin: top right;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1;
    min-width: 40px;
    height: 24px;
}

.card-content {
    padding: 20px;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
}

/* 圆形图标容器 - 参考图片左侧圆形设计 */
.icon-circle {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.card-icon {
    font-size: 24px;
    transition: all 0.3s ease;
}

.function-card:hover .icon-circle {
    transform: scale(1.05);
}

/* 内容区域 */
.content-area {
    flex: 1;
    min-width: 0;
}

.card-title {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
}

.card-description {
    margin: 0;
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .function-card {
        height: 90px;
    }

    .card-content {
        padding: 16px;
        gap: 12px;
    }

    .icon-circle {
        width: 44px;
        height: 44px;
    }

    .card-icon {
        font-size: 20px;
    }

    .card-title {
        font-size: 14px;
    }

    .card-description {
        font-size: 12px;
    }

    .status-badge {
        padding: 4px 8px;
        font-size: 9px;
        min-width: 32px;
        height: 20px;
        border-bottom-left-radius: 10px;
    }
}
</style>
