<template>
    <div class="settings-container">
        <div class="settings-content">
            <!-- 外观设置 -->
            <div class="settings-section">
                <h3 class="section-title">
                    <span class="section-icon">🎨</span>
                    外观设置
                </h3>
                <div class="setting-item">
                    <div class="setting-info">
                        <label class="setting-label">主题模式</label>
                        <span class="setting-desc">选择应用的主题外观</span>
                    </div>
                    <div class="setting-control">
                        <select v-model="settings.theme" @change="updateTheme" class="setting-select">
                            <option value="auto">跟随系统</option>
                            <option value="light">浅色模式</option>
                            <option value="dark">深色模式</option>
                        </select>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <label class="setting-label">语言</label>
                        <span class="setting-desc">选择界面显示语言</span>
                    </div>
                    <div class="setting-control">
                        <select v-model="settings.language" @change="saveSettings" class="setting-select">
                            <option value="zh-CN">简体中文</option>
                            <option value="zh-TW">繁體中文</option>
                            <option value="en-US">English</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- 功能设置 -->
            <div class="settings-section">
                <h3 class="section-title">
                    <span class="section-icon">⚙️</span>
                    功能设置
                </h3>
                <div class="setting-item">
                    <div class="setting-info">
                        <label class="setting-label">显示提示</label>
                        <span class="setting-desc">显示操作成功的提示消息</span>
                    </div>
                    <div class="setting-control">
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="settings.showToast" @change="saveSettings">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <label class="setting-label">自动格式化</label>
                        <span class="setting-desc">粘贴JSON时自动格式化</span>
                    </div>
                    <div class="setting-control">
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="settings.autoFormat" @change="saveSettings">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- 数据管理 -->
            <div class="settings-section">
                <h3 class="section-title">
                    <span class="section-icon">💾</span>
                    数据管理
                </h3>
                <div class="setting-item">
                    <div class="setting-info">
                        <label class="setting-label">导出设置</label>
                        <span class="setting-desc">导出当前设置配置</span>
                    </div>
                    <div class="setting-control">
                        <button @click="exportSettings" class="action-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7,10 12,15 17,10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            导出
                        </button>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <label class="setting-label">清除数据</label>
                        <span class="setting-desc">清除所有本地存储的数据</span>
                    </div>
                    <div class="setting-control">
                        <button @click="clearData" class="action-btn danger">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path
                                    d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2">
                                </path>
                            </svg>
                            清除
                        </button>
                    </div>
                </div>
            </div>

            <!-- 关于信息 -->
            <div class="settings-section">
                <h3 class="section-title">
                    <span class="section-icon">ℹ️</span>
                    关于
                </h3>
                <div class="about-info">
                    <div class="about-item">
                        <span class="about-label">版本</span>
                        <span class="about-value">v1.1.0</span>
                    </div>
                    <div class="about-item">
                        <span class="about-label">构建时间</span>
                        <span class="about-value">{{ buildTime }}</span>
                    </div>
                    <div class="about-item">
                        <span class="about-label">开源地址</span>
                        <a href="https://github.com/panxu71/toolbox" target="_blank" class="about-link">
                            GitHub
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15,3 21,3 21,9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                    <div class="about-item">
                        <span class="about-label">问题反馈</span>
                        <a href="https://github.com/panxu71/toolbox/issues" target="_blank" class="about-link">
                            Issues
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15,3 21,3 21,9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTheme } from '../composables/useTheme'

const { setTheme } = useTheme()

// 设置数据
const settings = ref({
    theme: 'auto',
    language: 'zh-CN',
    showToast: true,
    autoFormat: true
})

// 构建时间
const buildTime = ref('2024-12-29')

// 消息提示
const showMessage = (message: string) => {
    console.log('设置提示:', message)
    // TODO: 可以添加 toast 通知组件
}

// 加载设置
const loadSettings = () => {
    try {
        const saved = localStorage.getItem('toolbox_settings')
        if (saved) {
            const parsed = JSON.parse(saved)
            settings.value = { ...settings.value, ...parsed }
        }
    } catch (error) {
        console.error('加载设置失败:', error)
    }
}

// 保存设置
const saveSettings = () => {
    try {
        localStorage.setItem('toolbox_settings', JSON.stringify(settings.value))
        showMessage('设置已保存')
    } catch (error) {
        console.error('保存设置失败:', error)
        showMessage('保存设置失败')
    }
}

// 更新主题
const updateTheme = () => {
    setTheme(settings.value.theme)
    saveSettings()
}

// 导出设置
const exportSettings = () => {
    const data = {
        settings: settings.value,
        exportTime: new Date().toISOString(),
        version: '1.1.0'
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `toolbox-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    showMessage('设置已导出')
}

// 清除数据
const clearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
        try {
            localStorage.clear()
            settings.value = {
                theme: 'auto',
                language: 'zh-CN',
                showToast: true,
                autoFormat: true
            }
            showMessage('数据已清除')
        } catch (error) {
            console.error('清除数据失败:', error)
            showMessage('清除数据失败')
        }
    }
}

onMounted(() => {
    loadSettings()
})
</script>

<style scoped>
.settings-container {
    height: 100%;
    overflow-y: auto;
    background: var(--bg-primary);
}

.settings-content {
    padding: 24px;
    max-width: 800px;
    margin: 0 auto;
}

.settings-section {
    margin-bottom: 32px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 24px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.section-icon {
    font-size: 20px;
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.setting-info {
    flex: 1;
}

.setting-label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.setting-desc {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.4;
}

.setting-control {
    flex-shrink: 0;
    margin-left: 24px;
}

.setting-select {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 8px 12px;
    color: var(--text-primary);
    font-size: 14px;
    min-width: 120px;
    cursor: pointer;
    transition: var(--transition);
}

.setting-select:hover {
    border-color: var(--border-hover);
}

.setting-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
    cursor: pointer;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    transition: var(--transition);
    border-radius: 24px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background: white;
    transition: var(--transition);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input:checked+.toggle-slider {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

input:checked+.toggle-slider:before {
    transform: translateX(24px);
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.action-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.action-btn.danger {
    background: var(--danger-color);
}

.action-btn.danger:hover {
    background: var(--danger-hover);
}

.about-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.about-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color);
}

.about-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.about-label {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
}

.about-value {
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
}

.about-link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--primary-color);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: var(--transition);
}

.about-link:hover {
    color: var(--primary-hover);
    text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 640px) {
    .settings-content {
        padding: 16px;
    }

    .settings-section {
        padding: 16px;
        margin-bottom: 16px;
    }

    .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .setting-control {
        margin-left: 0;
        width: 100%;
    }

    .setting-select {
        width: 100%;
    }

    .about-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
</style>