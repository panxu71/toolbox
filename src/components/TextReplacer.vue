<template>
    <div class="text-replacer">
        <div class="replacer-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="replacer-title">全局文本替换</h2>
            <div class="replacer-actions">
                <button class="action-btn" @click="clearAll" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="replacer-content">
            <!-- 替换设置 -->
            <div class="settings-section">
                <div class="section-header">
                    <h3>替换设置</h3>
                </div>

                <div class="settings-grid">
                    <!-- 查找内容 -->
                    <div class="setting-group">
                        <label class="setting-label">查找内容</label>
                        <div class="input-wrapper">
                            <input v-model="searchText" type="text" class="search-input" placeholder="输入要查找的文本或正则表达式"
                                @input="updatePreview" />
                            <div class="input-actions">
                                <button class="input-action-btn" @click="pasteSearch" title="粘贴">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                        <path
                                            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 替换内容 -->
                    <div class="setting-group">
                        <label class="setting-label">替换为</label>
                        <div class="input-wrapper">
                            <input v-model="replaceText" type="text" class="replace-input"
                                placeholder="输入替换后的文本（支持$1, $2等捕获组）" @input="updatePreview" />
                            <div class="input-actions">
                                <button class="input-action-btn" @click="pasteReplace" title="粘贴">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                        <path
                                            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 选项设置 -->
                <div class="options-section">
                    <div class="options-grid">
                        <label class="option-item">
                            <input v-model="useRegex" type="checkbox" @change="updatePreview" />
                            <div class="option-content">
                                <span class="option-title">正则表达式</span>
                                <span class="option-desc">启用正则表达式模式</span>
                            </div>
                        </label>

                        <label class="option-item">
                            <input v-model="caseSensitive" type="checkbox" @change="updatePreview" />
                            <div class="option-content">
                                <span class="option-title">区分大小写</span>
                                <span class="option-desc">匹配时区分大小写</span>
                            </div>
                        </label>

                        <label class="option-item">
                            <input v-model="globalReplace" type="checkbox" @change="updatePreview" />
                            <div class="option-content">
                                <span class="option-title">全局替换</span>
                                <span class="option-desc">替换所有匹配项</span>
                            </div>
                        </label>

                        <label class="option-item">
                            <input v-model="multiline" type="checkbox" @change="updatePreview" />
                            <div class="option-content">
                                <span class="option-title">多行模式</span>
                                <span class="option-desc">^和$匹配行首行尾</span>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- 快速模板 -->
                <div class="templates-section">
                    <div class="templates-header">
                        <h4>常用模板</h4>
                    </div>
                    <div class="templates-grid">
                        <button class="template-btn" @click="applyTemplate('email')">
                            <span class="template-name">邮箱提取</span>
                            <span class="template-desc">提取所有邮箱地址</span>
                        </button>
                        <button class="template-btn" @click="applyTemplate('phone')">
                            <span class="template-name">手机号提取</span>
                            <span class="template-desc">提取手机号码</span>
                        </button>
                        <button class="template-btn" @click="applyTemplate('url')">
                            <span class="template-name">URL提取</span>
                            <span class="template-desc">提取网址链接</span>
                        </button>
                        <button class="template-btn" @click="applyTemplate('space')">
                            <span class="template-name">空格清理</span>
                            <span class="template-desc">清理多余空格</span>
                        </button>
                        <button class="template-btn" @click="applyTemplate('line')">
                            <span class="template-name">空行清理</span>
                            <span class="template-desc">删除空白行</span>
                        </button>
                        <button class="template-btn" @click="applyTemplate('html')">
                            <span class="template-name">HTML标签</span>
                            <span class="template-desc">移除HTML标签</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 文本处理区域 -->
            <div class="text-section">
                <div class="text-panels">
                    <!-- 原始文本 -->
                    <div class="text-panel">
                        <div class="panel-header">
                            <h3>原始文本</h3>
                            <div class="panel-actions">
                                <button class="panel-action-btn" @click="pasteOriginalText" title="粘贴">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                        <path
                                            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    </svg>
                                </button>
                                <button class="panel-action-btn" @click="loadSampleText" title="示例">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14,2 14,8 20,8" />
                                    </svg>
                                </button>
                                <button class="panel-action-btn" @click="clearOriginalText" title="清空">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <textarea v-model="originalText" class="text-area original-text" placeholder="在此输入或粘贴要处理的文本..."
                            @input="updatePreview"></textarea>
                        <div class="panel-footer">
                            <span class="text-stats">{{ originalText.length }} 字符，{{ originalText.split('\n').length }}
                                行</span>
                        </div>
                    </div>

                    <!-- 处理结果 -->
                    <div class="text-panel">
                        <div class="panel-header">
                            <h3>处理结果</h3>
                            <div class="panel-info">
                                <span class="match-count" v-if="matchCount > 0">
                                    找到 {{ matchCount }} 个匹配项
                                </span>
                                <span class="no-match" v-else-if="searchText && originalText">
                                    未找到匹配项
                                </span>
                            </div>
                            <div class="panel-actions">
                                <button class="panel-action-btn" @click="copyResult" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                                <button class="panel-action-btn" @click="downloadResult" title="下载">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7,10 12,15 17,10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                </button>
                                <button class="panel-action-btn primary" @click="executeReplace" title="执行替换">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                        <path d="M21 3v5h-5" />
                                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                        <path d="M3 21v-5h5" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <textarea v-model="resultText" class="text-area result-text" placeholder="替换结果将显示在这里..."
                            readonly></textarea>
                        <div class="panel-footer">
                            <span class="text-stats">{{ resultText.length }} 字符，{{ resultText.split('\n').length }}
                                行</span>
                            <span class="change-stats" v-if="changeCount > 0">
                                已替换 {{ changeCount }} 处
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 匹配预览 -->
            <div v-if="matchCount > 0" class="preview-section">
                <div class="section-header">
                    <h3>匹配预览</h3>
                    <span class="preview-count">显示前 {{ Math.min(matchCount, 10) }} 个匹配项</span>
                </div>
                <div class="preview-list">
                    <div v-for="(match, index) in previewMatches.slice(0, 10)" :key="index" class="preview-item">
                        <div class="match-info">
                            <span class="match-index">{{ index + 1 }}</span>
                            <span class="match-position">行 {{ match.line }}，列 {{ match.column }}</span>
                        </div>
                        <div class="match-content">
                            <span class="match-before">{{ match.before }}</span>
                            <span class="match-text">{{ match.text }}</span>
                            <span class="match-after">{{ match.after }}</span>
                        </div>
                        <div class="match-replacement" v-if="replaceText">
                            <span class="replacement-arrow">→</span>
                            <span class="replacement-text">{{ match.replacement }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 使用说明 -->
            <div class="help-section">
                <div class="section-header">
                    <h3>使用说明</h3>
                </div>
                <div class="help-content">
                    <div class="help-grid">
                        <div class="help-card">
                            <div class="help-icon">🔍</div>
                            <h4>基础搜索</h4>
                            <p>输入要查找的文本，支持普通文本和正则表达式两种模式。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">🔄</div>
                            <h4>替换功能</h4>
                            <p>支持简单替换和正则捕获组替换，使用$1、$2等引用捕获的内容。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">⚙️</div>
                            <h4>高级选项</h4>
                            <p>支持大小写敏感、全局替换、多行模式等多种匹配选项。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">📝</div>
                            <h4>常用模板</h4>
                            <p>提供邮箱、手机号、URL提取等常用正则表达式模板。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {  ref, watch, onMounted, onUnmounted  } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'

defineEmits<{
    back: []
}>()

// 状态管理
// 使用页面标题管理
usePageTitle('text-replacer')

const searchText = ref('')
const replaceText = ref('')
const originalText = ref('')
const resultText = ref('')

// 选项设置
const useRegex = ref(false)
const caseSensitive = ref(false)
const globalReplace = ref(true)
const multiline = ref(false)

// 统计信息
const matchCount = ref(0)
const changeCount = ref(0)
const previewMatches = ref<Array<{
    text: string
    line: number
    column: number
    before: string
    after: string
    replacement: string
}>>([])

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 构建正则表达式
const buildRegex = (): RegExp | null => {
    if (!searchText.value) return null

    try {
        let pattern = searchText.value
        let flags = ''

        if (!useRegex.value) {
            // 转义特殊字符
            pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        }

        if (!caseSensitive.value) flags += 'i'
        if (globalReplace.value) flags += 'g'
        if (multiline.value) flags += 'm'

        return new RegExp(pattern, flags)
    } catch (error) {
        return null
    }
}

// 更新预览
const updatePreview = () => {
    if (!originalText.value || !searchText.value) {
        resultText.value = originalText.value
        matchCount.value = 0
        previewMatches.value = []
        return
    }

    const regex = buildRegex()
    if (!regex) {
        resultText.value = originalText.value
        matchCount.value = 0
        previewMatches.value = []
        showMessage('正则表达式语法错误', 'error')
        return
    }

    // 查找所有匹配项
    const matches = Array.from(originalText.value.matchAll(regex))
    matchCount.value = matches.length

    // 生成预览
    previewMatches.value = matches.map(match => {
        const index = match.index || 0
        const text = match[0]
        const before = originalText.value.substring(Math.max(0, index - 20), index)
        const after = originalText.value.substring(index + text.length, Math.min(originalText.value.length, index + text.length + 20))

        // 计算行号和列号
        const beforeMatch = originalText.value.substring(0, index)
        const lines = beforeMatch.split('\n')
        const line = lines.length
        const lastLine = lines[lines.length - 1]
        const column = (lastLine ? lastLine.length : 0) + 1

        // 计算替换后的文本
        let replacement = replaceText.value
        if (useRegex.value && replacement) {
            replacement = text.replace(regex, replaceText.value)
        }

        return {
            text,
            line,
            column,
            before,
            after,
            replacement
        }
    })

    // 生成结果预览
    if (replaceText.value !== undefined) {
        try {
            resultText.value = originalText.value.replace(regex, replaceText.value)
        } catch (error) {
            resultText.value = originalText.value
            showMessage('替换表达式错误', 'error')
        }
    } else {
        resultText.value = originalText.value
    }
}

// 执行替换
const executeReplace = () => {
    if (!originalText.value || !searchText.value) {
        showMessage('请输入原始文本和查找内容', 'error')
        return
    }

    const regex = buildRegex()
    if (!regex) {
        showMessage('正则表达式语法错误', 'error')
        return
    }

    try {
        const oldText = originalText.value
        const newText = oldText.replace(regex, replaceText.value || '')

        originalText.value = newText
        resultText.value = newText

        // 计算替换次数
        const matches = Array.from(oldText.matchAll(regex))
        changeCount.value = matches.length

        showMessage(`成功替换 ${changeCount.value} 处`, 'success')
        updatePreview()
    } catch (error) {
        showMessage('替换失败', 'error')
    }
}

// 应用模板
const applyTemplate = (template: string) => {
    switch (template) {
        case 'email':
            searchText.value = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
            replaceText.value = '$&'
            useRegex.value = true
            globalReplace.value = true
            break
        case 'phone':
            searchText.value = '1[3-9]\\d{9}'
            replaceText.value = '$&'
            useRegex.value = true
            globalReplace.value = true
            break
        case 'url':
            searchText.value = 'https?://[^\\s]+'
            replaceText.value = '$&'
            useRegex.value = true
            globalReplace.value = true
            break
        case 'space':
            searchText.value = '\\s+'
            replaceText.value = ' '
            useRegex.value = true
            globalReplace.value = true
            break
        case 'line':
            searchText.value = '^\\s*$'
            replaceText.value = ''
            useRegex.value = true
            globalReplace.value = true
            multiline.value = true
            break
        case 'html':
            searchText.value = '<[^>]*>'
            replaceText.value = ''
            useRegex.value = true
            globalReplace.value = true
            break
    }
    updatePreview()
    showMessage('已应用模板', 'success')
}

// 粘贴功能
const pasteSearch = async () => {
    try {
        const text = await navigator.clipboard.readText()
        searchText.value = text
        updatePreview()
        showMessage('已粘贴查找内容', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

const pasteReplace = async () => {
    try {
        const text = await navigator.clipboard.readText()
        replaceText.value = text
        updatePreview()
        showMessage('已粘贴替换内容', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

const pasteOriginalText = async () => {
    try {
        const text = await navigator.clipboard.readText()
        originalText.value = text
        updatePreview()
        showMessage('已粘贴文本', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

// 加载示例
const loadSampleText = () => {
    originalText.value = `联系我们：
邮箱：john.doe@example.com, support@company.org
电话：13812345678, 13987654321
网站：https://www.example.com, http://blog.example.org

用户信息：
姓名：张三    年龄：25
姓名：李四    年龄：30
姓名：王五    年龄：28

HTML内容：
<div class="container">
    <h1>标题</h1>
    <p>这是一段文本。</p>
    <a href="https://example.com">链接</a>
</div>

多余的空格和    空行：


这里有多个     空格。
`
    updatePreview()
    showMessage('已加载示例文本', 'success')
}

// 复制结果
const copyResult = async () => {
    if (!resultText.value) {
        showMessage('没有可复制的内容', 'error')
        return
    }

    try {
        await navigator.clipboard.writeText(resultText.value)
        showMessage('已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 下载结果
const downloadResult = () => {
    if (!resultText.value) {
        showMessage('没有可下载的内容', 'error')
        return
    }

    const blob = new Blob([resultText.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `replaced-text-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showMessage('文件已下载', 'success')
}

// 清空功能
const clearOriginalText = () => {
    originalText.value = ''
    resultText.value = ''
    updatePreview()
}

const clearAll = () => {
    searchText.value = ''
    replaceText.value = ''
    originalText.value = ''
    resultText.value = ''
    matchCount.value = 0
    changeCount.value = 0
    previewMatches.value = []
    showMessage('已清空所有内容', 'success')
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error') => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 生命周期钩子
onMounted(() => {
    // 页面初始化逻辑
})

// 监听变化
watch([searchText, replaceText, originalText, useRegex, caseSensitive, globalReplace, multiline], () => {
    updatePreview()
}, { deep: true })
</script>
<style scoped>
.text-replacer {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
}

.replacer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.back-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
}

.replacer-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.replacer-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
}

.replacer-content {
    flex: 1;
    padding: 1.5rem 1.5rem 6rem 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

/* 通用区域样式 */
.settings-section,
.text-section,
.preview-section,
.help-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.section-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

/* 设置区域 */
.settings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.setting-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.setting-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input,
.replace-input {
    flex: 1;
    padding: 0.75rem 3rem 0.75rem 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.search-input:focus,
.replace-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.search-input::placeholder,
.replace-input::placeholder {
    color: var(--text-secondary);
}

.input-actions {
    position: absolute;
    right: 0.5rem;
    display: flex;
    gap: 0.25rem;
}

.input-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.input-action-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

/* 选项设置 */
.options-section {
    margin-bottom: 1.5rem;
}

.options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.option-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.option-item:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
}

.option-item input[type="checkbox"] {
    margin: 0;
    transform: scale(1.2);
    accent-color: var(--primary-color);
}

.option-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.option-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.option-desc {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

/* 模板区域 */
.templates-section {
    margin-bottom: 0;
}

.templates-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
}

.templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
}

.template-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

.template-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.template-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.template-desc {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

/* 文本处理区域 */
.text-panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.text-panel {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
}

.panel-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.panel-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.match-count {
    padding: 0.25rem 0.5rem;
    background: var(--success-color);
    color: white;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.no-match {
    padding: 0.25rem 0.5rem;
    background: var(--warning-color);
    color: white;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.panel-actions {
    display: flex;
    gap: 0.5rem;
}

.panel-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.panel-action-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--primary-color);
}

.panel-action-btn.primary {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.panel-action-btn.primary:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
}

.text-area {
    width: 100%;
    min-height: 300px;
    padding: 1rem;
    background: var(--bg-primary);
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
    font-family: 'Courier New', monospace;
}

.text-area:focus {
    outline: none;
}

.text-area::placeholder {
    color: var(--text-secondary);
}

.result-text {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
}

.panel-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
}

.text-stats,
.change-stats {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.change-stats {
    color: var(--success-color);
    font-weight: 500;
}

/* 预览区域 */
.preview-count {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.preview-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.preview-item {
    padding: 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
}

.match-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.match-index {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 600;
}

.match-position {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.match-content {
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.match-before,
.match-after {
    color: var(--text-secondary);
}

.match-text {
    background: var(--warning-color-alpha);
    color: var(--warning-color);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-weight: 600;
}

.match-replacement {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
}

.replacement-arrow {
    color: var(--primary-color);
    font-weight: 600;
}

.replacement-text {
    background: var(--success-color-alpha);
    color: var(--success-color);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-weight: 600;
}

/* 帮助区域 */
.help-content {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1.5rem;
}

.help-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.help-card {
    text-align: center;
    padding: 1rem;
}

.help-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
}

.help-card h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
}

.help-card p {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

/* 消息提示 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.message-toast.success {
    background: var(--success-color);
    color: white;
}

.message-toast.error {
    background: var(--error-color);
    color: white;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .text-panels {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .replacer-content {
        padding: 1rem 1rem 4rem 1rem;
        gap: 1.5rem;
    }

    .settings-section,
    .text-section,
    .preview-section,
    .help-section {
        padding: 1rem;
    }

    .settings-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .options-grid {
        grid-template-columns: 1fr;
    }

    .templates-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .text-area {
        min-height: 200px;
        font-size: 0.75rem;
    }

    .help-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .message-toast {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
    }
}

@media (max-width: 480px) {
    .replacer-header {
        padding: 0.75rem 1rem;
    }

    .replacer-title {
        font-size: 1.125rem;
    }

    .templates-grid {
        grid-template-columns: 1fr;
    }

    .panel-header {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
    }

    .panel-actions {
        justify-content: center;
    }

    .match-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
}
</style>