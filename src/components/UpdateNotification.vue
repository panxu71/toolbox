<template>
    <Teleport to="body">
        <div v-if="showNotification" class="update-notification-overlay" @click="handleOverlayClick">
            <div class="update-notification" @click.stop>
                <div class="notification-header">
                    <div class="notification-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path
                                d="M21 12c0 1-.6 3-1 4s-1.5 3-2 3-1.5-1-3-1-2 1-3 1-1.5-1-2-3-.5-3-1-4 .6-3 1-4 1.5-3 2-3 1.5 1 3 1 2-1 3-1 1.5 1 2 3 .5 3 1 4z" />
                            <path d="M11 15l2 2 4-4" />
                        </svg>
                    </div>
                    <div class="notification-title">
                        <h3>发现新版本</h3>
                        <p>Toolbox {{ versionInfo?.latestVersion }} 已发布</p>
                    </div>
                    <button class="close-btn" @click="closeNotification" title="关闭">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div class="notification-content">
                    <div class="version-info">
                        <div class="version-item">
                            <span class="version-label">当前版本:</span>
                            <span class="version-current">{{ versionInfo?.currentVersion }}</span>
                        </div>
                        <div class="version-arrow">→</div>
                        <div class="version-item">
                            <span class="version-label">最新版本:</span>
                            <span class="version-latest">{{ versionInfo?.latestVersion }}</span>
                        </div>
                    </div>

                    <div v-if="versionInfo?.publishedAt" class="publish-date">
                        发布时间: {{ formatDate(versionInfo.publishedAt) }}
                    </div>

                    <div v-if="versionInfo?.releaseNotes" class="release-notes">
                        <h4>更新内容:</h4>
                        <div class="notes-content" v-html="formatReleaseNotes(versionInfo.releaseNotes)"></div>
                    </div>
                </div>

                <div class="notification-actions">
                    <button class="action-btn secondary" @click="ignoreUpdate">
                        忽略此版本
                    </button>
                    <div class="remind-later-group">
                        <button class="action-btn secondary dropdown-btn" @click="toggleRemindLaterMenu">
                            稍后提醒
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="6,9 12,15 18,9" />
                            </svg>
                        </button>
                        <div v-if="showRemindLaterMenu" class="remind-later-menu">
                            <button @click="remindLater(1)" class="remind-option">1小时后</button>
                            <button @click="remindLater(4)" class="remind-option">4小时后</button>
                            <button @click="remindLater(24)" class="remind-option">1天后</button>
                            <button @click="remindLater(72)" class="remind-option">3天后</button>
                            <button @click="remindLater(168)" class="remind-option">1周后</button>
                        </div>
                    </div>
                    <button class="action-btn primary" @click="goToUpdate">
                        立即更新
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVersionCheck } from '../composables/useVersionCheck'

const { versionInfo, ignoreCurrentUpdate, setRemindLater } = useVersionCheck()

// 稍后提醒菜单状态
const showRemindLaterMenu = ref(false)

// 控制显示状态
const showNotification = computed(() => {
    return versionInfo.value?.hasUpdate || false
})

// 格式化日期
const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 格式化更新说明（简单的Markdown转HTML）
const formatReleaseNotes = (notes: string): string => {
    return notes
        .replace(/### (.*)/g, '<h5>$1</h5>')
        .replace(/## (.*)/g, '<h4>$1</h4>')
        .replace(/# (.*)/g, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/- (.*)/g, '• $1')
        .replace(/\n/g, '<br>')
        .substring(0, 500) + (notes.length > 500 ? '...' : '') // 限制长度
}

// 关闭通知
const closeNotification = (): void => {
    versionInfo.value = null
}

// 点击遮罩层关闭
const handleOverlayClick = (): void => {
    closeNotification()
}

// 忽略更新
const ignoreUpdate = (): void => {
    ignoreCurrentUpdate()
    closeNotification()
}

// 稍后提醒
const remindLater = (hours: number): void => {
    setRemindLater(hours)
    closeNotification()
}

// 切换稍后提醒菜单
const toggleRemindLaterMenu = (): void => {
    showRemindLaterMenu.value = !showRemindLaterMenu.value
}

// 前往更新
const goToUpdate = (): void => {
    if (versionInfo.value?.releaseUrl) {
        window.open(versionInfo.value.releaseUrl, '_blank')
    }
    closeNotification()
}
</script>

<style scoped>
.update-notification-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.update-notification {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    animation: slideIn 0.3s ease;
}

.notification-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 24px 24px 16px;
    border-bottom: 1px solid #f1f5f9;
}

.notification-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #10b981, #059669);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.notification-title {
    flex: 1;
}

.notification-title h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
}

.notification-title p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
}

.close-btn {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border: none;
    background: #f8fafc;
    border-radius: 6px;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.close-btn:hover {
    background: #e2e8f0;
    color: #475569;
}

.notification-content {
    padding: 16px 24px;
    max-height: 300px;
    overflow-y: auto;
}

.version-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
}

.version-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.version-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
}

.version-current {
    font-size: 16px;
    font-weight: 600;
    color: #64748b;
    font-family: 'Courier New', monospace;
}

.version-latest {
    font-size: 16px;
    font-weight: 600;
    color: #10b981;
    font-family: 'Courier New', monospace;
}

.version-arrow {
    font-size: 18px;
    color: #10b981;
    font-weight: bold;
}

.publish-date {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 16px;
    text-align: center;
}

.release-notes {
    border-top: 1px solid #f1f5f9;
    padding-top: 16px;
}

.release-notes h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
}

.notes-content {
    font-size: 13px;
    line-height: 1.6;
    color: #4b5563;
    background: #f9fafb;
    padding: 12px;
    border-radius: 6px;
    border-left: 3px solid #10b981;
}

.notes-content :deep(h3),
.notes-content :deep(h4),
.notes-content :deep(h5) {
    margin: 8px 0 4px 0;
    color: #374151;
}

.notes-content :deep(strong) {
    color: #1f2937;
}

.notification-actions {
    display: flex;
    gap: 8px;
    padding: 16px 24px 24px;
    border-top: 1px solid #f1f5f9;
}

.remind-later-group {
    position: relative;
}

.dropdown-btn {
    display: flex;
    align-items: center;
    gap: 4px;
}

.remind-later-menu {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-bottom: 4px;
    z-index: 10;
    overflow: hidden;
}

.remind-option {
    display: block;
    width: 100%;
    padding: 8px 12px;
    background: white;
    border: none;
    text-align: left;
    font-size: 13px;
    color: #374151;
    cursor: pointer;
    transition: background-color 0.2s;
}

.remind-option:hover {
    background: #f3f4f6;
}

.remind-option:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
}

.action-btn {
    flex: 1;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.action-btn.primary {
    background: #10b981;
    color: white;
}

.action-btn.primary:hover {
    background: #059669;
    transform: translateY(-1px);
}

.action-btn.secondary {
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
    background: #f1f5f9;
    color: #475569;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* 响应式设计 */
@media (max-width: 640px) {
    .update-notification {
        width: 95%;
        margin: 20px;
    }

    .notification-header {
        padding: 20px 16px 12px;
    }

    .notification-content {
        padding: 12px 16px;
    }

    .notification-actions {
        padding: 12px 16px 20px;
        flex-direction: column;
    }

    .version-info {
        flex-direction: column;
        gap: 8px;
    }

    .version-arrow {
        transform: rotate(90deg);
    }
}
</style>