<template>
    <div class="settings-container">
        <div class="settings-header">
            <h2 class="settings-title">设置</h2>
            <p class="settings-subtitle">个性化你的工具箱体验</p>
        </div>

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
                        <span class="setting-desc">选择浅色或深色主题</span>
                    </div>
                    <div class="setting-control">
                        <select v-model="settings.theme" @change="updateTheme" class="setting-select">
                            <option value="auto">跟随系统</option>
                            <option value="light">浅色模式</option>
                            <option value="dark">深色模式</option>
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
                        <label class="setting-label">自动保存</label>
                        <span class="setting-desc">自动保存输入内容到本地存储</span>
                    </div>
                    <div class="setting-control">
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="settings.autoSave" @change="saveSettings">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
                
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
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
                        <span class="about-value">v1.0.0</span>
                    </div>
                    <div class="about-item">
                        <span class="about-label">构建时间</span>
                        <span class="about-value">{{ buildTime }}</span>
                    </div>
                    <div class="about-item">
                        <span class="about-label">开源地址</span>
                        <a href="https://github.com/panxu71/toolbox" target="_blank" class="about-link">
                            GitHub
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
    autoSave: true,
    showToast: true,
    autoFormat: true
})

// 构建时间
const buildTime = new Date().toLocaleDateString('zh-CN')

// 加载设置
const loadSettings = () => {
    const saved = localStorage.getItem('toolbox-settings')
    if (saved) {
        try {
            const parsed = JSON.parse(saved)
            settings.value = { ...settings.value, ...parsed }
        } catch (e) {
            console.warn('Failed to load settings:', e)
        }
    }
}

// 保存设置
const saveSettings = () => {
    localStorage.setItem('toolbox-settings', JSON.stringify(settings.value))
    showMessage('设置已保存')
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
        version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `toolbox-settings-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showMessage('设置已导出')
}

// 清除数据
const clearData = () => {
    if (confirm('确定要清除所有本地数据吗？此操作不可恢复。')) {
        localStorage.clear()
        sessionStorage.clear()
        showMessage('数据已清除')
        // 重新加载默认设置
        settings.value = {
            theme: 'auto',
            autoSave: true,
            showToast: true,
            autoFormat: true
        }
    }
}

// 显示消息
const showMessage = (message: string) => {
    // 简单的消息提示
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `
    document.body.appendChild(toast)
    setTimeout(() => {
        document.body.removeChild(toast)
    }, 3000)
}

onMounted(() => {
    loadSettings()
})
</script>

<style scoped>
.settings-container {
    max-width: 100%;
    margin: 0;
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
}

.settings-header {
    margin-bottom: 24px;
    text-align: center;
}

.settings-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 6px 0;
}

.settings-subtitle {
    font-size: 14px;
    color: var(--text-muted);
    margin: 0;
}

.settings-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 20px;
}

.settings-section {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: var(--transition);
}

.settings-section:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-color: var(--primary-color-alpha);
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--primary-color-alpha);
}

.section-icon {
    font-size: 18px;
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border-color-light);
}

.setting-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.setting-info {
    flex: 1;
    margin-right: 16px;
}

.setting-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 2px;
}

.setting-desc {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.4;
}

.setting-control {
    flex-shrink: 0;
}

.setting-select {
    padding: 6px 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 13px;
    min-width: 110px;
    cursor: pointer;
    transition: var(--transition);
}

.setting-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.toggle-switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 22px;
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
    border-radius: 11px;
    transition: var(--transition);
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background: white;
    border-radius: 50%;
    transition: var(--transition);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

input:checked + .toggle-slider {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

input:checked + .toggle-slider:before {
    transform: translateX(18px);
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    min-width: 80px;
    justify-content: center;
}

.action-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.action-btn.danger {
    background: var(--error-color);
}

.action-btn.danger:hover {
    background: var(--error-color-dark);
}

.about-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.about-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
}

.about-label {
    font-size: 13px;
    color: var(--text-secondary);
}

.about-value {
    font-size: 13px;
    color: var(--text-primary);
    font-weight: 500;
}

.about-link {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--primary-color);
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    transition: var(--transition);
}

.about-link:hover {
    color: var(--primary-hover);
    transform: translateX(2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .settings-container {
        padding: 16px;
    }
    
    .settings-content {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    
    .settings-section {
        padding: 16px;
    }
    
    .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 10px 0;
    }
    
    .setting-info {
        margin-right: 0;
        margin-bottom: 4px;
    }
    
    .setting-control {
        align-self: flex-end;
    }
    
    .about-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
}

@media (max-width: 480px) {
    .settings-title {
        font-size: 20px;
    }
    
    .settings-content {
        gap: 12px;
    }
    
    .settings-section {
        padding: 12px;
    }
}
</style>