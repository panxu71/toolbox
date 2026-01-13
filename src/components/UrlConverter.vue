<template>
    <div class="url-converter">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- URL编码解码 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>URL编码解码</h3>
                    <div class="section-info">
                        <span class="info-text">对URL进行编码和解码处理</span>
                    </div>
                </div>
                <div class="url-converter-container">
                    <div class="input-output-grid">
                        <div class="input-section">
                            <div class="section-title">
                                <span>原始文本/URL</span>
                                <div class="section-actions">
                                    <button class="action-btn-small" @click="pasteText" title="粘贴">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                            <path
                                                d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                        </svg>
                                    </button>
                                    <button class="action-btn-small" @click="clearInput" title="清空">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <textarea v-model="inputText" placeholder="请输入要编码的URL或文本..." class="text-input"
                                @input="autoEncode"></textarea>
                            <div class="input-info">
                                <span class="char-count">字符数: {{ inputText.length }}</span>
                                <span class="url-valid" :class="getUrlStatusClass(inputText)">
                                    {{ getUrlStatus(inputText) }}
                                </span>
                            </div>
                        </div>

                        <div class="output-section">
                            <div class="section-title">
                                <span>编码结果</span>
                                <div class="section-actions">
                                    <button class="action-btn-small" @click="copyEncoded" title="复制">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    </button>
                                    <button class="action-btn-small" @click="openUrl" title="打开URL"
                                        :disabled="!isValidUrl(encodedText)">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15,3 21,3 21,9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <textarea v-model="encodedText" placeholder="编码结果将显示在这里..." class="text-output"
                                readonly></textarea>
                            <div class="output-info">
                                <span class="char-count">字符数: {{ encodedText.length }}</span>
                                <span class="url-valid" :class="getUrlStatusClass(encodedText)">
                                    {{ getUrlStatus(encodedText) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="converter-actions">
                        <button class="convert-btn encode" @click="encodeUrl">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M7 16.5L12 12l5 4.5" />
                                <path d="M7 7.5L12 12l5-4.5" />
                            </svg>
                            编码
                        </button>
                        <button class="convert-btn decode" @click="decodeUrl">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M17 7.5L12 12l-5-4.5" />
                                <path d="M17 16.5L12 12l-5 4.5" />
                            </svg>
                            解码
                        </button>
                        <button class="swap-btn" @click="swapContent">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M8 3L4 7l4 4" />
                                <path d="M4 7h16" />
                                <path d="M16 21l4-4-4-4" />
                                <path d="M20 17H4" />
                            </svg>
                            交换
                        </button>
                    </div>
                </div>
            </div>

            <!-- URL解析 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>URL解析</h3>
                    <div class="section-info">
                        <span class="info-text">解析URL的各个组成部分</span>
                    </div>
                </div>
                <div class="url-parser-container">
                    <div class="parser-input">
                        <label>要解析的URL</label>
                        <div class="input-with-button">
                            <input v-model="parseUrl" type="text" placeholder="请输入完整的URL..." class="url-input"
                                @input="parseUrlComponents" />
                            <button class="parse-btn" @click="parseUrlComponents">解析</button>
                        </div>
                    </div>

                    <div v-if="urlComponents" class="url-components">
                        <div class="component-grid">
                            <div class="component-item">
                                <label>协议 (Protocol)</label>
                                <span class="component-value">{{ urlComponents.protocol }}</span>
                            </div>
                            <div class="component-item">
                                <label>主机 (Host)</label>
                                <span class="component-value">{{ urlComponents.host }}</span>
                            </div>
                            <div class="component-item">
                                <label>端口 (Port)</label>
                                <span class="component-value">{{ urlComponents.port || '默认' }}</span>
                            </div>
                            <div class="component-item">
                                <label>路径 (Path)</label>
                                <span class="component-value">{{ urlComponents.pathname }}</span>
                            </div>
                            <div class="component-item">
                                <label>查询字符串 (Search)</label>
                                <span class="component-value">{{ urlComponents.search || '无' }}</span>
                            </div>
                            <div class="component-item">
                                <label>锚点 (Hash)</label>
                                <span class="component-value">{{ urlComponents.hash || '无' }}</span>
                            </div>
                        </div>

                        <div v-if="urlParams.length > 0" class="url-params">
                            <div class="params-header">
                                <h4>查询参数</h4>
                                <button class="copy-params-btn" @click="copyParams">复制所有参数</button>
                            </div>
                            <div class="params-list">
                                <div v-for="param in urlParams" :key="param.key" class="param-item">
                                    <span class="param-key">{{ param.key }}</span>
                                    <span class="param-separator">=</span>
                                    <span class="param-value">{{ param.value }}</span>
                                    <button class="copy-param-btn" @click="copyParam(param)" title="复制此参数">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 常用字符编码 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>常用字符编码</h3>
                    <div class="section-info">
                        <span class="info-text">常见特殊字符的URL编码对照</span>
                    </div>
                </div>
                <div class="char-reference">
                    <div class="char-grid">
                        <div v-for="char in commonChars" :key="char.original" class="char-item"
                            @click="insertChar(char)">
                            <span class="char-original">{{ char.original }}</span>
                            <span class="char-encoded">{{ char.encoded }}</span>
                            <span class="char-description">{{ char.description }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 根据卡片ID获取标题
function getCardTitle(cardId: string): string {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === cardId)
        if (card) {
            return card.title
        }
    }
    return cardId
}

// 使用页面标题管理
usePageTitle('url-encode')
const cardTitle = getCardTitle('url-encode')

// 使用公共通知系统
const { success: showSuccess, error: showError } = useNotification()

// URL编码解码状态
const inputText = ref('')
const encodedText = ref('')

// URL解析状态
const parseUrl = ref('')
const urlComponents = ref<any>(null)
const urlParams = ref<Array<{ key: string; value: string }>>([])

// 常用字符编码对照
const commonChars = [
    { original: ' ', encoded: '%20', description: '空格' },
    { original: '!', encoded: '%21', description: '感叹号' },
    { original: '"', encoded: '%22', description: '双引号' },
    { original: '#', encoded: '%23', description: '井号' },
    { original: '$', encoded: '%24', description: '美元符号' },
    { original: '%', encoded: '%25', description: '百分号' },
    { original: '&', encoded: '%26', description: '和号' },
    { original: "'", encoded: '%27', description: '单引号' },
    { original: '(', encoded: '%28', description: '左括号' },
    { original: ')', encoded: '%29', description: '右括号' },
    { original: '*', encoded: '%2A', description: '星号' },
    { original: '+', encoded: '%2B', description: '加号' },
    { original: ',', encoded: '%2C', description: '逗号' },
    { original: '/', encoded: '%2F', description: '斜杠' },
    { original: ':', encoded: '%3A', description: '冒号' },
    { original: ';', encoded: '%3B', description: '分号' },
    { original: '<', encoded: '%3C', description: '小于号' },
    { original: '=', encoded: '%3D', description: '等号' },
    { original: '>', encoded: '%3E', description: '大于号' },
    { original: '?', encoded: '%3F', description: '问号' },
    { original: '@', encoded: '%40', description: 'at符号' },
    { original: '[', encoded: '%5B', description: '左方括号' },
    { original: '\\', encoded: '%5C', description: '反斜杠' },
    { original: ']', encoded: '%5D', description: '右方括号' },
    { original: '^', encoded: '%5E', description: '脱字符' },
    { original: '`', encoded: '%60', description: '反引号' },
    { original: '{', encoded: '%7B', description: '左花括号' },
    { original: '|', encoded: '%7C', description: '竖线' },
    { original: '}', encoded: '%7D', description: '右花括号' },
    { original: '~', encoded: '%7E', description: '波浪号' }
]

// 验证URL格式
const isValidUrl = (url: string): boolean => {
    if (!url) return false
    try {
        new URL(url)
        return true
    } catch {
        // 如果直接验证失败，尝试解码后再验证（可能是编码后的URL）
        try {
            const decoded = decodeURIComponent(url)
            new URL(decoded)
            return true
        } catch {
            return false
        }
    }
}

// 获取URL状态文本
const getUrlStatus = (url: string): string => {
    if (!url) return ''

    // 先检查是否是有效的URL
    try {
        new URL(url)
        return '有效URL'
    } catch {
        // 检查是否是编码后的URL
        try {
            const decoded = decodeURIComponent(url)
            new URL(decoded)
            return '编码后的有效URL'
        } catch {
            // 检查是否包含URL编码字符
            if (url.includes('%')) {
                return '包含编码字符'
            }
            return '文本内容'
        }
    }
}

// 获取URL状态样式类
const getUrlStatusClass = (url: string): string => {
    if (!url) return ''

    // 先检查是否是有效的URL
    try {
        new URL(url)
        return 'valid'
    } catch {
        // 检查是否是编码后的URL
        try {
            const decoded = decodeURIComponent(url)
            new URL(decoded)
            return 'valid'  // 编码后的有效URL也算有效
        } catch {
            // 检查是否包含URL编码字符但不是有效URL
            if (url.includes('%')) {
                return ''  // 包含编码字符但不是有效URL，使用默认样式
            }
            return url.length > 0 ? 'invalid' : ''  // 只有非空文本才标记为invalid
        }
    }
}

// 自动编码
const autoEncode = () => {
    if (inputText.value.trim()) {
        encodeUrl()
    } else {
        encodedText.value = ''
    }
}

// URL编码
const encodeUrl = () => {
    if (!inputText.value.trim()) {
        encodedText.value = ''
        return
    }

    try {
        encodedText.value = encodeURIComponent(inputText.value)
        showSuccess('URL编码成功')
    } catch (error) {
        showError('URL编码失败')
    }
}

// URL解码
const decodeUrl = () => {
    if (!inputText.value.trim()) {
        encodedText.value = ''
        return
    }

    try {
        encodedText.value = decodeURIComponent(inputText.value)
        showSuccess('URL解码成功')
    } catch (error) {
        showError('URL解码失败，请检查编码格式')
    }
}

// 交换内容
const swapContent = () => {
    const temp = inputText.value
    inputText.value = encodedText.value
    encodedText.value = temp
    showSuccess('内容已交换')
}

// 粘贴文本
const pasteText = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
        autoEncode()
        showSuccess('已粘贴文本')
    } catch (error) {
        showError('粘贴失败')
    }
}

// 清空输入
const clearInput = () => {
    inputText.value = ''
    encodedText.value = ''
    showSuccess('已清空输入')
}

// 复制编码结果
const copyEncoded = async () => {
    if (!encodedText.value) {
        showError('没有可复制的内容')
        return
    }

    try {
        await navigator.clipboard.writeText(encodedText.value)
        showSuccess('编码结果已复制到剪贴板')
    } catch (error) {
        showError('复制失败')
    }
}

// 打开URL
const openUrl = () => {
    if (!isValidUrl(encodedText.value)) {
        showError('不是有效的URL')
        return
    }

    let urlToOpen = encodedText.value

    // 如果是编码后的URL，先解码再打开
    try {
        new URL(encodedText.value)
        // 直接是有效URL，直接打开
    } catch {
        // 可能是编码后的URL，尝试解码
        try {
            const decoded = decodeURIComponent(encodedText.value)
            new URL(decoded)
            urlToOpen = decoded
        } catch {
            showError('无法解析URL')
            return
        }
    }

    window.open(urlToOpen, '_blank')
    showSuccess('已在新窗口打开URL')
}

// 解析URL组件
const parseUrlComponents = () => {
    if (!parseUrl.value.trim()) {
        urlComponents.value = null
        urlParams.value = []
        return
    }

    try {
        const url = new URL(parseUrl.value)
        urlComponents.value = {
            protocol: url.protocol,
            host: url.host,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash
        }

        // 解析查询参数
        urlParams.value = Array.from(url.searchParams.entries()).map(([key, value]) => ({
            key,
            value
        }))

        showSuccess('URL解析完成')
    } catch (error) {
        showError('URL解析失败，请检查URL格式')
        urlComponents.value = null
        urlParams.value = []
    }
}

// 复制所有参数
const copyParams = async () => {
    const paramsText = urlParams.value.map(param => `${param.key}=${param.value}`).join('&')

    try {
        await navigator.clipboard.writeText(paramsText)
        showSuccess('参数已复制到剪贴板')
    } catch (error) {
        showError('复制失败')
    }
}

// 复制单个参数
const copyParam = async (param: { key: string; value: string }) => {
    try {
        await navigator.clipboard.writeText(`${param.key}=${param.value}`)
        showSuccess(`参数 ${param.key} 已复制`)
    } catch (error) {
        showError('复制失败')
    }
}

// 插入字符
const insertChar = (char: { original: string; encoded: string; description: string }) => {
    inputText.value += char.original
    autoEncode()
    showSuccess(`已插入字符: ${char.original}`)
}

// 清空所有
const clearAll = () => {
    inputText.value = ''
    encodedText.value = ''
    parseUrl.value = ''
    urlComponents.value = null
    urlParams.value = []
    showSuccess('已清空所有内容')
}
</script>
<style scoped>
.url-converter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.converter-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    /* 隐藏滚动条但保持滚动功能 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.converter-content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.converter-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.section-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.section-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    background: var(--bg-tertiary);
    border-radius: 0.375rem;
}

/* URL转换器样式 */
.url-converter-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.input-output-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.input-section,
.output-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.section-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn-small:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.action-btn-small:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.text-input,
.text-output {
    width: 100%;
    height: 200px;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    resize: vertical;
    min-height: 150px;
}

.text-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.text-output {
    background: var(--bg-quaternary);
}

.input-info,
.output-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.char-count {
    padding: 0.25rem 0.5rem;
    background: var(--bg-tertiary);
    border-radius: 0.25rem;
}

.url-valid {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 500;
}

.url-valid.valid {
    background: var(--success-color);
    color: white;
}

.url-valid.invalid {
    background: var(--error-color);
    color: white;
}

.url-valid:not(.valid):not(.invalid) {
    background: var(--warning-color);
    color: white;
}

.converter-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
}

.convert-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.convert-btn.encode {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.convert-btn.encode:hover {
    background: var(--success-color-dark);
    border-color: var(--success-color-dark);
}

.convert-btn.decode {
    background: var(--warning-color);
    color: white;
    border-color: var(--warning-color);
}

.convert-btn.decode:hover {
    background: var(--warning-color-dark);
    border-color: var(--warning-color-dark);
}

.swap-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.swap-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* URL解析器样式 */
.url-parser-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.parser-input {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.parser-input label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.input-with-button {
    display: flex;
    gap: 0.75rem;
}

.url-input {
    flex: 1;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.url-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.parse-btn {
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.parse-btn:hover {
    background: var(--primary-color-dark);
}

.url-components {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.component-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.component-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
}

.component-item label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.component-value {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-family: 'Courier New', monospace;
    word-break: break-all;
}

.url-params {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.params-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.params-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.copy-params-btn {
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
}

.copy-params-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.params-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.param-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
}

.param-key {
    font-weight: 500;
    color: var(--primary-color);
    font-family: 'Courier New', monospace;
}

.param-separator {
    color: var(--text-secondary);
}

.param-value {
    flex: 1;
    color: var(--text-primary);
    font-family: 'Courier New', monospace;
    word-break: break-all;
}

.copy-param-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-param-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* 字符编码对照样式 */
.char-reference {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.char-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
}

.char-item {
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
}

.char-item:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
}

.char-original {
    font-size: 1.25rem;
    font-weight: 600;
    font-family: 'Courier New', monospace;
}

.char-encoded {
    font-size: 0.75rem;
    font-family: 'Courier New', monospace;
    color: var(--text-secondary);
}

.char-item:hover .char-encoded {
    color: rgba(255, 255, 255, 0.8);
}

.char-description {
    font-size: 0.625rem;
    color: var(--text-tertiary);
    text-align: center;
}

.char-item:hover .char-description {
    color: rgba(255, 255, 255, 0.7);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        gap: 1.5rem;
    }

    .converter-section {
        padding: 1rem;
    }

    .input-output-grid {
        grid-template-columns: 1fr;
    }

    .converter-actions {
        flex-direction: column;
    }

    .input-with-button {
        flex-direction: column;
    }

    .component-grid {
        grid-template-columns: 1fr;
    }

    .char-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }

    .params-header {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
    }

    .text-input,
    .text-output {
        height: 150px;
    }
}
</style>