<template>
    <div class="version-checker">
        <div class="version-info">
            <div class="current-version">
                <h4>当前版本</h4>
                <span class="version-number">v{{ currentVersion }}</span>
            </div>

            <div class="check-section">
                <button class="check-btn" @click="checkForUpdates" :disabled="isChecking"
                    :class="{ checking: isChecking }">
                    <svg v-if="!isChecking" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path
                            d="M21 12c0 1-.6 3-1 4s-1.5 3-2 3-1.5-1-3-1-2 1-3 1-1.5-1-2-3-.5-3-1-4 .6-3 1-4 1.5-3 2-3 1.5 1 3 1 2-1 3-1 1.5 1 2 3 .5 3 1 4z" />
                    </svg>
                    <svg v-else class="loading-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    {{ isChecking ? '检查中...' : '检查更新' }}
                </button>
            </div>
        </div>

        <!-- 更新状态显示 -->
        <div v-if="versionInfo" class="update-status">
            <div v-if="versionInfo.hasUpdate" class="update-available">
                <div class="status-icon success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                </div>
                <div class="status-content">
                    <h5>发现新版本 {{ versionInfo.latestVersion }}</h5>
                    <p>发布时间: {{ formatDate(versionInfo.publishedAt) }}</p>
                    <div class="update-actions">
                        <button class="action-btn primary" @click="goToRelease">
                            查看更新
                        </button>
                        <button class="action-btn secondary" @click="ignoreUpdate">
                            忽略
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="update-current">
                <div class="status-icon current">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                </div>
                <div class="status-content">
                    <h5>已是最新版本</h5>
                    <p>您使用的是最新版本 {{ versionInfo.currentVersion }}</p>
                </div>
            </div>
        </div>

        <!-- 错误状态 -->
        <div v-if="error" class="error-status">
            <div class="status-icon error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
            </div>
            <div class="status-content">
                <h5>检查更新失败</h5>
                <p>{{ error }}</p>
            </div>
        </div>

        <!-- 版本管理 -->
        <div class="version-management">
            <h4>版本管理</h4>
            <div class="management-actions">
                <button class="management-btn" @click="clearIgnoredVersions">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                    清除忽略的版本
                </button>
                <button class="management-btn" @click="clearRemindLater">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12,6 12,12 16,14" />
                    </svg>
                    清除延迟提醒
                </button>
                <button class="management-btn" @click="viewReleases">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15,3 21,3 21,9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    查看所有版本
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useVersionCheck } from '../composables/useVersionCheck'
import { PROJECT_INFO } from '../config/version'

const {
    isChecking,
    versionInfo,
    error,
    checkForUpdates,
    ignoreCurrentUpdate,
    clearIgnoredVersions: clearIgnored,
    clearRemindLater: clearRemind,
    getCurrentVersion
} = useVersionCheck()

const currentVersion = getCurrentVersion()

// 格式化日期
const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// 前往发布页面
const goToRelease = (): void => {
    if (versionInfo.value?.releaseUrl) {
        window.open(versionInfo.value.releaseUrl, '_blank')
    }
}

// 忽略更新
const ignoreUpdate = (): void => {
    ignoreCurrentUpdate()
}

// 清除忽略的版本
const clearIgnoredVersions = (): void => {
    clearIgnored()
    // 可以显示一个确认消息
}

// 清除延迟提醒
const clearRemindLater = (): void => {
    clearRemind()
    // 可以显示一个确认消息
}

// 查看所有版本
const viewReleases = (): void => {
    window.open(`https://github.com/${PROJECT_INFO.repository}/releases`, '_blank')
}
</script>

<style scoped>
.version-checker {
    background: white;
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #e2e8f0;
}

.version-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f1f5f9;
}

.current-version h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
}

.version-number {
    font-size: 18px;
    font-weight: 700;
    color: #10b981;
    font-family: 'Courier New', monospace;
}

.check-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.check-btn:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
}

.check-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.check-btn.checking {
    background: #6b7280;
}

.loading-icon {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.update-status {
    margin-bottom: 20px;
}

.update-available,
.update-current,
.error-status {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid;
}

.update-available {
    background: #ecfdf5;
    border-color: #10b981;
}

.update-current {
    background: #f0f9ff;
    border-color: #3b82f6;
}

.error-status {
    background: #fef2f2;
    border-color: #ef4444;
}

.status-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.status-icon.success {
    background: #10b981;
    color: white;
}

.status-icon.current {
    background: #3b82f6;
    color: white;
}

.status-icon.error {
    background: #ef4444;
    color: white;
}

.status-content {
    flex: 1;
}

.status-content h5 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
}

.status-content p {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #6b7280;
}

.update-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 12px;
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
}

.action-btn.secondary {
    background: #f3f4f6;
    color: #6b7280;
}

.action-btn.secondary:hover {
    background: #e5e7eb;
    color: #374151;
}

.version-management {
    border-top: 1px solid #f1f5f9;
    padding-top: 20px;
}

.version-management h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
}

.management-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.management-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    color: #64748b;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}

.management-btn:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .version-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .management-actions {
        flex-direction: column;
    }

    .management-btn {
        justify-content: center;
    }
}
</style>