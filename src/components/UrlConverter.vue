<template>
    <div class="url-converter">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">URL编码解码</h2>
            <div class="converter-actions">
                <button class="action-btn" @click="clearAll" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

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
                                <span class="url-valid"
                                    :class="{ valid: isValidUrl(inputText), invalid: inputText && !isValidUrl(inputText) }">
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
                                <span class="url-valid"
                                    :class="{ valid: isValidUrl(encodedText), invalid: encodedText && !isValidUrl(encodedText) }">
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

            <!-- URL参数解析 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>URL参数解析</h3>
                    <div class="section-info">
                        <span class="info-text">解析URL中的各个组成部分和参数</span>
                    </div>
                </div>
                <div class="url-parser-container">
                    <div class="url-input-section">
                        <label>输入URL</label>
                        <div class="url-input-wrapper">
                            <input v-model="parseUrl" type="text"
                                placeholder="https://example.com/path?param1=value1&param2=value2" class="url-input"
                                @input="parseUrlComponents" />
                            <button class="parse-btn" @click="parseUrlComponents">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" />
                                </svg>
                                解析
                            </button>
                        </div>
                    </div>

                    <div v-if="urlComponents" class="url-components">
                        <div class="component-grid">
                            <div class="component-item">
                                <label>协议 (Protocol)</label>
                                <div class="component-value">{{ urlComponents.protocol || '-' }}</div>
                            </div>
                            <div class="component-item">
                                <label>主机 (Host)</label>
                                <div class="component-value">{{ urlComponents.host || '-' }}</div>
                            </div>
                            <div class="component-item">
                                <label>端口 (Port)</label>
                                <div class="component-value">{{ urlComponents.port || '-' }}</div>
                            </div>
                            <div class="component-item">
                                <label>路径 (Path)</label>
                                <div class="component-value">{{ urlComponents.pathname || '-' }}</div>
                            </div>
                            <div class="component-item">
                                <label>查询字符串 (Search)</label>
                                <div class="component-value">{{ urlComponents.search || '-' }}</div>
                            </div>
                            <div class="component-item">
                                <label>锚点 (Hash)</label>
                                <div class="component-value">{{ urlComponents.hash || '-' }}</div>
                            </div>
                        </div>

                        <div v-if="urlParams.length > 0" class="url-params">
                            <div class="params-header">
                                <h4>URL参数</h4>
                                <button class="copy-params-btn" @click="copyParams" title="复制参数">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                            <div class="params-table">
                                <div class="params-header-row">
                                    <div class="param-key">参数名</div>
                                    <div class="param-value">参数值</div>
                                    <div class="param-actions">操作</div>
                                </div>
                                <div v-for="(param, index) in urlParams" :key="index" class="param-row">
                                    <div class="param-key">{{ param.key }}</div>
                                    <div class="param-value">{{ param.value }}</div>
                                    <div class="param-actions">
                                        <button class="copy-param-btn" @click="copyParam(param)" title="复制">
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
            </div>

            <!-- 常用编码字符 -->
            <div class="converter-section">
                <div class="section-header">
                    <h3>常用编码字符</h3>
                    <div class="section-info">
                        <span class="info-text">常见字符的URL编码对照表</span>
                    </div>
                </div>
                <div class="encoding-reference">
                    <div class="reference-grid">
                        <div v-for="char in commonChars" :key="char.original" class="char-item"
                            @click="insertChar(char)">
                            <div class="char-original">{{ char.original }}</div>
                            <div class="char-encoded">{{ char.encoded }}</div>
                            <div class="char-description">{{ char.description }}</div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'

defineEmits<{
    back: []
}>()

// 基本编码解码状态
// 使用页面标题管理
usePageTitle('url-encode')

const inputText = ref('')
const encodedText = ref('')

// URL解析状态
const parseUrl = ref('')
const urlComponents = ref<{
    protocol: string
    host: string
    port: string
    pathname: string
    search: string
    hash: string
} | null>(null)

// URL参数
const urlParams = ref<Array<{ key: string; value: string }>>([])

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 常用编码字符
const commonChars = [
    { original: ' ', encoded: '%20', description: '空格' },
    { original: '!', encoded: '%21', description: '感叹号' },
    { original: '"', encoded: '%22', description: '双引号' },
    { original: '#', encoded: '%23', description: '井号' },
    { original: '$', encoded: '%24', description: '美元符' },
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
    { original: '@', encoded: '%40', description: '@符号' },
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

// 自动编码
const autoEncode = () => {
    if (!inputText.value.trim()) {
        encodedText.value = ''
        return
    }
    encodeUrl()
}

// URL编码
const encodeUrl = () => {
    if (!inputText.value.trim()) {
        encodedText.value = ''
        return
    }

    try {
        encodedText.value = encodeURIComponent(inputText.value)
        showMessage('URL编码成功', 'success')
    } catch (error) {
        showMessage('URL编码失败', 'error')
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
        showMessage('URL解码成功', 'success')
    } catch (error) {
        showMessage('URL解码失败，请检查编码格式', 'error')
    }
}

// 交换内容
const swapContent = () => {
    const temp = inputText.value
    inputText.value = encodedText.value
    encodedText.value = temp
    showMessage('内容已交换', 'success')
}

// 粘贴文本
const pasteText = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
        autoEncode()
        showMessage('已粘贴文本', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

// 清空输入
const clearInput = () => {
    inputText.value = ''
    encodedText.value = ''
    showMessage('已清空输入', 'success')
}

// 复制编码结果
const copyEncoded = async () => {
    if (!encodedText.value) {
        showMessage('没有可复制的内容', 'error')
        return
    }

    try {
        await navigator.clipboard.writeText(encodedText.value)
        showMessage('编码结果已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 打开URL
const openUrl = () => {
    if (!isValidUrl(encodedText.value)) {
        showMessage('不是有效的URL', 'error')
        return
    }

    window.open(encodedText.value, '_blank')
    showMessage('已在新窗口打开URL', 'success')
}

// 验证URL
const isValidUrl = (url: string): boolean => {
    if (!url) return false
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

// 获取URL状态
const getUrlStatus = (url: string): string => {
    if (!url) return ''
    return isValidUrl(url) ? '有效URL' : '无效URL'
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
            port: url.port,
            pathname: url.pathname,
            search: url.search,
            hash: url.hash
        }

        // 解析URL参数
        urlParams.value = []
        url.searchParams.forEach((value, key) => {
            urlParams.value.push({ key, value })
        })

        showMessage('URL解析完成', 'success')
    } catch (error) {
        showMessage('URL解析失败，请检查URL格式', 'error')
        urlComponents.value = null
        urlParams.value = []
    }
}

// 复制参数
const copyParams = async () => {
    if (urlParams.value.length === 0) return

    const paramsText = urlParams.value
        .map(param => `${param.key}=${param.value}`)
        .join('\n')

    try {
        await navigator.clipboard.writeText(paramsText)
        showMessage('参数已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 复制单个参数
const copyParam = async (param: { key: string; value: string }) => {
    try {
        await navigator.clipboard.writeText(`${param.key}=${param.value}`)
        showMessage(`参数 ${param.key} 已复制`, 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 插入字符
const insertChar = (char: { original: string; encoded: string }) => {
    inputText.value += char.original
    autoEncode()
    showMessage(`已插入字符: ${char.original}`, 'success')
}

// 清空所有
const clearAll = () => {
    inputText.value = ''
    encodedText.value = ''
    parseUrl.value = ''
    urlComponents.value = null
    urlParams.value = []
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

.converter-header {
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
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
}

.back-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.converter-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.converter-actions {
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
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.converter-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

.converter-section {
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

.section-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* URL编码解码样式 */
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
    min-height: 120px;
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
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.url-valid.invalid {
    background: var(--error-color-alpha);
    color: var(--error-color);
}

.converter-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.convert-btn,
.swap-btn {
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
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-weight: 500;
}

.swap-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

/* URL解析样式 */
.url-parser-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.url-input-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.url-input-section label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.url-input-wrapper {
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
}

.parse-btn:hover {
    background: var(--primary-color-dark);
}

.url-components {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.component-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.component-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.component-item label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
    text-transform: uppercase;
}

.component-value {
    padding: 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    word-break: break-all;
}

.url-params {
    border-top: 1px solid var(--border-color);
    padding-top: 1.5rem;
}

.params-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.params-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.copy-params-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-params-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.params-table {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    overflow: hidden;
}

.params-header-row {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.param-row {
    display: grid;
    grid-template-columns: 1fr 2fr auto;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.875rem;
}

.param-row:last-child {
    border-bottom: none;
}

.param-key {
    font-family: 'Courier New', monospace;
    color: var(--text-primary);
    font-weight: 500;
}

.param-value {
    font-family: 'Courier New', monospace;
    color: var(--text-secondary);
    word-break: break-all;
}

.param-actions {
    display: flex;
    justify-content: center;
}

.copy-param-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--bg-tertiary);
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

/* 编码字符参考样式 */
.encoding-reference {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.reference-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
}

.char-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

.char-item:hover {
    background: var(--primary-color-alpha);
    border-color: var(--primary-color);
    transform: translateY(-2px);
}

.char-original {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    font-family: 'Courier New', monospace;
}

.char-encoded {
    font-size: 0.75rem;
    color: var(--primary-color);
    font-family: 'Courier New', monospace;
    margin-bottom: 0.25rem;
}

.char-description {
    font-size: 0.625rem;
    color: var(--text-secondary);
}

/* 消息提示样式 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.message-toast.success {
    background: var(--success-color);
}

.message-toast.error {
    background: var(--error-color);
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

    .url-input-wrapper {
        flex-direction: column;
    }

    .component-grid {
        grid-template-columns: 1fr;
    }

    .params-header-row,
    .param-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .param-actions {
        justify-content: flex-start;
    }

    .reference-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }

    .text-input,
    .text-output {
        height: 150px;
    }
}
</style>