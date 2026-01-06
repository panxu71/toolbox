<template>
    <div class="text-replacer">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="copy" tooltip="复制结果" @click="copyResult" :disabled="!resultText" />
                <HeaderActionButton icon="download" tooltip="下载文件" @click="downloadResult" :disabled="!resultText" />
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="replacer-content">
            <!-- 替换设置 -->
            <div class="settings-section">
                <div class="settings-header">
                    <h3>🔧 替换设置</h3>
                </div>

                <div class="settings-grid">
                    <!-- 查找内容 -->
                    <div class="setting-group">
                        <label class="setting-label">查找内容</label>
                        <div class="input-wrapper">
                            <input v-model="searchText" type="text" class="search-input" placeholder="输入要查找的文本或正则表达式"
                                @input="updatePreview" />
                        </div>
                    </div>

                    <!-- 替换内容 -->
                    <div class="setting-group">
                        <label class="setting-label">替换为</label>
                        <div class="input-wrapper">
                            <input v-model="replaceText" type="text" class="replace-input"
                                placeholder="输入替换后的文本（支持$1, $2等捕获组）" @input="updatePreview" />
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
            </div>

            <!-- 文本处理区域 -->
            <div class="text-section">
                <div class="input-panel">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>📝 原始文本</h3>
                            <div class="panel-info">
                                <span class="char-count" v-if="inputText">{{ inputText.length }} 字符</span>
                                <span class="match-count" v-if="matchCount > 0">{{ matchCount }} 个匹配</span>
                            </div>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="inputText" class="text-input" placeholder="请输入要处理的文本..."
                            @input="updatePreview"></textarea>
                    </div>
                </div>

                <div class="output-panel">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>📄 替换结果</h3>
                            <div class="panel-info">
                                <span class="result-count" v-if="replaceCount > 0">替换了 {{ replaceCount }} 处</span>
                                <span class="no-change" v-else-if="inputText && resultText">无匹配项</span>
                            </div>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="resultText" class="text-output" placeholder="替换结果将显示在这里..."
                            readonly></textarea>
                    </div>
                </div>
            </div>

            <!-- 匹配详情 -->
            <div v-if="matchDetails.length > 0" class="matches-section">
                <div class="matches-header">
                    <h3>🎯 匹配详情 <span class="matches-subtitle">共找到 {{ matchDetails.length }} 个匹配项</span></h3>
                </div>
                <div class="matches-list">
                    <div v-for="(match, index) in matchDetails.slice(0, 20)" :key="index" class="match-item">
                        <span class="match-index">{{ index + 1 }}</span>
                        <span class="match-text">{{ match.text }}</span>
                        <span class="match-position">位置: {{ match.start }}-{{ match.end }}</span>
                    </div>
                </div>
                <div v-if="matchDetails.length > 20" class="more-matches">
                    还有 {{ matchDetails.length - 20 }} 个匹配项未显示...
                </div>
            </div>

            <!-- 快速示例 -->
            <div class="examples-section">
                <div class="examples-header">
                    <h3>📝 快速示例</h3>
                </div>
                <div class="examples-grid">
                    <button class="example-btn" @click="loadExample('email')">
                        <span class="example-title">邮箱提取</span>
                        <span class="example-preview">提取文本中的邮箱地址</span>
                    </button>
                    <button class="example-btn" @click="loadExample('phone')">
                        <span class="example-title">电话格式化</span>
                        <span class="example-preview">统一电话号码格式</span>
                    </button>
                    <button class="example-btn" @click="loadExample('space')">
                        <span class="example-title">空格清理</span>
                        <span class="example-preview">清理多余空格和换行</span>
                    </button>
                    <button class="example-btn" @click="loadExample('html')">
                        <span class="example-title">HTML标签</span>
                        <span class="example-preview">移除HTML标签</span>
                    </button>
                </div>
            </div>

            <!-- 使用说明 -->
            <div class="help-section">
                <div class="help-header">
                    <h3>💡 使用说明</h3>
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

        <NotificationContainer />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import NotificationContainer from './common/NotificationContainer.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import { useClipboard } from '../composables/useClipboard'
import { useDownload } from '../composables/useDownload'

defineEmits<{
    back: []
}>()

// 使用 composables
usePageTitle('text-replacer')
const { success, error: showError } = useNotification()
const { copyToClipboard } = useClipboard()
const { downloadText } = useDownload()

// 获取页面标题
const pageTitle = '全局文本替换'

// 状态管理
const inputText = ref('')
const searchText = ref('')
const replaceText = ref('')
const resultText = ref('')
const matchCount = ref(0)
const replaceCount = ref(0)
const matchDetails = ref<Array<{ text: string, start: number, end: number }>>([])

// 选项设置
const useRegex = ref(false)
const caseSensitive = ref(false)
const globalReplace = ref(true)
const multiline = ref(false)

// 执行替换和预览
const updatePreview = () => {
    if (!inputText.value || !searchText.value) {
        resultText.value = inputText.value
        matchCount.value = 0
        replaceCount.value = 0
        matchDetails.value = []
        return
    }

    try {
        let pattern: RegExp

        if (useRegex.value) {
            let flags = ''
            if (!caseSensitive.value) flags += 'i'
            if (globalReplace.value) flags += 'g'
            if (multiline.value) flags += 'm'

            pattern = new RegExp(searchText.value, flags)
        } else {
            const escapedSearch = searchText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            let flags = ''
            if (!caseSensitive.value) flags += 'i'
            if (globalReplace.value) flags += 'g'
            if (multiline.value) flags += 'm'

            pattern = new RegExp(escapedSearch, flags)
        }

        // 查找所有匹配项
        const matches = Array.from(inputText.value.matchAll(pattern))
        matchCount.value = matches.length

        // 记录匹配详情
        matchDetails.value = matches.map(match => ({
            text: match[0],
            start: match.index || 0,
            end: (match.index || 0) + match[0].length
        }))

        // 执行替换
        resultText.value = inputText.value.replace(pattern, replaceText.value)
        replaceCount.value = matches.length

    } catch (error) {
        console.error('替换错误:', error)
        resultText.value = inputText.value
        matchCount.value = 0
        replaceCount.value = 0
        matchDetails.value = []
    }
}

// 加载示例
const loadExample = (type: string) => {
    const examples = {
        email: {
            input: '联系我们：admin@example.com 或 support@test.org\n客服邮箱：service@company.com.cn',
            search: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
            replace: '【邮箱地址】',
            regex: true,
            caseSensitive: false,
            global: true
        },
        phone: {
            input: '电话：13812345678\n座机：010-12345678\n手机：+86 138-1234-5678',
            search: '(\\d{3})(\\d{4})(\\d{4})',
            replace: '$1-$2-$3',
            regex: true,
            caseSensitive: false,
            global: true
        },
        space: {
            input: '这是   一段    有很多\n\n\n空格和换行的\t\t文本',
            search: '\\s+',
            replace: ' ',
            regex: true,
            caseSensitive: false,
            global: true
        },
        html: {
            input: '<div class="content"><p>这是<strong>HTML</strong>文本</p><br/></div>',
            search: '<[^>]*>',
            replace: '',
            regex: true,
            caseSensitive: false,
            global: true
        }
    }

    const example = examples[type as keyof typeof examples]
    if (example) {
        inputText.value = example.input
        searchText.value = example.search
        replaceText.value = example.replace
        useRegex.value = example.regex
        caseSensitive.value = example.caseSensitive
        globalReplace.value = example.global
        updatePreview()
        success('已加载示例')
    }
}

// 复制结果
const copyResult = async () => {
    if (!resultText.value) {
        showError('没有可复制的内容')
        return
    }

    const result = await copyToClipboard(resultText.value)
    if (result) {
        success('替换结果已复制')
    } else {
        showError('复制失败')
    }
}

// 下载结果
const downloadResult = () => {
    if (!resultText.value) {
        showError('没有可下载的内容')
        return
    }

    const result = downloadText(resultText.value, 'replaced-text', 'txt')
    if (result) {
        success('文件已下载')
    } else {
        showError('下载失败')
    }
}

// 清空所有
const clearAll = () => {
    inputText.value = ''
    searchText.value = ''
    replaceText.value = ''
    resultText.value = ''
    matchCount.value = 0
    replaceCount.value = 0
    matchDetails.value = []
    useRegex.value = false
    caseSensitive.value = false
    globalReplace.value = true
    multiline.value = false
    success('已清空所有内容')
}
</script>

<style scoped>
.text-replacer {
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.replacer-content {
    flex: 1;
    padding: 1.5rem;
    padding-bottom: 3rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    min-height: 0;
}

/* 设置区域 */
.settings-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.settings-header {
    margin-bottom: 1rem;
}

.settings-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

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
    font-weight: 500;
    color: var(--text-primary);
}

.input-wrapper {
    position: relative;
}

.search-input,
.replace-input {
    width: 100%;
    padding: 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    box-sizing: border-box;
}

.search-input:focus,
.replace-input:focus {
    outline: none;
    border-color: var(--primary-color);
}

.search-input::placeholder,
.replace-input::placeholder {
    color: var(--text-secondary);
}

/* 选项设置 */
.options-section {
    border-top: 1px solid var(--border-color);
    padding-top: 1.5rem;
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
    cursor: pointer;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
}

.option-item:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
}

.option-item input[type="checkbox"] {
    margin: 0;
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
    line-height: 1.3;
}

/* 文本处理区域 */
.text-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.input-panel,
.output-panel {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
}

.section-header {
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 1.5rem;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex: 1;
    width: 100%;
}

.section-title h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
}

.panel-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.char-count,
.match-count {
    padding: 0.25rem 0.6rem;
    background: var(--primary-color-alpha);
    color: var(--primary-color);
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
}

.result-count {
    padding: 0.25rem 0.6rem;
    background: var(--success-color);
    color: white;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
}

.no-change {
    padding: 0.25rem 0.6rem;
    background: var(--warning-color);
    color: white;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
}

.panel-content {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.text-input,
.text-output {
    width: 100%;
    min-height: 240px;
    padding: 1.5rem;
    background: var(--bg-primary);
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.6;
    resize: vertical;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    box-sizing: border-box;
    flex: 1;
}

.text-input:focus,
.text-output:focus {
    outline: none;
}

.text-input::placeholder,
.text-output::placeholder {
    color: var(--text-secondary);
}

/* 匹配详情 */
.matches-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.matches-header {
    margin-bottom: 1rem;
}

.matches-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.matches-subtitle {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 400;
    margin-left: 0.5rem;
}

.matches-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 0.75rem;
}

.match-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    font-size: 0.875rem;
}

.match-index {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 24px;
    text-align: center;
}

.match-text {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    background: var(--bg-primary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    flex: 1;
    word-break: break-all;
}

.match-position {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.more-matches {
    text-align: center;
    padding: 1rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    background: var(--bg-tertiary);
    border-radius: 0.5rem;
    margin-top: 1rem;
}

/* 示例区域 */
.examples-section,
.help-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.examples-header,
.help-header {
    margin-bottom: 1rem;
}

.examples-header h3,
.help-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.example-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    padding: 0.875rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

.example-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.example-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.example-preview {
    font-size: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.3;
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
    grid-template-columns: repeat(4, 1fr);
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

/* 响应式设计 */
@media (max-width: 1024px) {
    .text-section {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .settings-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .replacer-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }

    .settings-section,
    .matches-section,
    .examples-section,
    .help-section {
        padding: 1.25rem;
    }

    .section-title {
        flex-wrap: wrap;
        min-width: 0;
        gap: 0.5rem;
    }

    .section-title h3 {
        font-size: 1rem;
    }

    .text-input,
    .text-output {
        min-height: 180px;
        padding: 1rem;
        font-size: 0.875rem;
    }

    .matches-list {
        grid-template-columns: 1fr;
    }

    .examples-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .help-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .options-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    .examples-grid {
        grid-template-columns: 1fr;
    }

    .help-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}
</style>