<template>
    <div class="code-formatter">
        <div class="formatter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="formatter-title">JS/HTML格式化工具</h2>
            <div class="language-selector">
                <select v-model="selectedLanguage" class="language-select">
                    <option value="javascript">JavaScript</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                </select>
            </div>
        </div>

        <div class="formatter-content">
            <div class="main-workspace">
                <div class="input-section">
                    <div class="section-header">
                        <h3>代码输入</h3>
                        <div class="header-actions">
                            <button class="action-btn-small" @click="pasteCode" title="粘贴代码">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                    <path
                                        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="clearInput" title="清空输入">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="code-editor">
                        <textarea v-model="inputCode" :placeholder="getPlaceholder()" class="code-input"
                            @input="updateStats"></textarea>
                        <div class="line-numbers" v-if="inputCode">
                            <div v-for="(_, index) in inputCode.split('\n')" :key="index" class="line-number">
                                {{ index + 1 }}
                            </div>
                        </div>
                    </div>
                    <div class="section-footer">
                        <div class="stats-info">
                            <span class="stat-item">{{ codeStats.lines }} 行</span>
                            <span class="stat-item">{{ codeStats.characters }} 字符</span>
                            <span class="stat-item">{{ formatBytes(codeStats.bytes) }}</span>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>

                <div class="output-section">
                    <div class="section-header">
                        <h3>处理结果</h3>
                        <div class="header-actions">
                            <button class="action-btn-small" @click="copyOutput" title="复制结果" :disabled="!outputCode">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="clearOutput" title="清空结果" :disabled="!outputCode">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="downloadOutput" title="下载结果"
                                :disabled="!outputCode">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7,10 12,15 17,10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="code-editor">
                        <textarea v-if="outputCode" v-model="outputCode" class="code-output" readonly></textarea>
                        <div v-else class="empty-output">
                            <div class="empty-content">
                                <div class="empty-icon">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="1.5">
                                        <polyline points="16,18 22,12 16,6" />
                                        <polyline points="8,6 2,12 8,18" />
                                    </svg>
                                </div>
                                <h4>等待处理</h4>
                                <p>选择下方的操作按钮来处理代码</p>
                            </div>
                        </div>
                        <div class="line-numbers" v-if="outputCode">
                            <div v-for="(_, index) in outputCode.split('\n')" :key="index" class="line-number">
                                {{ index + 1 }}
                            </div>
                        </div>
                    </div>
                    <div class="section-footer" v-if="outputCode">
                        <div class="stats-info">
                            <span class="stat-item">{{ outputStats.lines }} 行</span>
                            <span class="stat-item">{{ outputStats.characters }} 字符</span>
                            <span class="stat-item compression" v-if="compressionRatio !== 0">
                                {{ compressionRatio > 0 ? '减少' : '增加' }} {{ Math.abs(compressionRatio) }}%
                            </span>
                        </div>
                    </div>
                    <div class="section-footer" v-else>
                        <div class="stats-info">
                            <span class="stat-item">等待处理结果</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="toolbar">
                <div class="config-section">
                    <label>缩进:</label>
                    <select v-model="formatConfig.indentType" class="config-select">
                        <option value="spaces">空格</option>
                        <option value="tabs">制表符</option>
                    </select>
                    <select v-model="formatConfig.indentSize" class="config-select">
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="8">8</option>
                    </select>
                </div>

                <div class="operation-buttons">
                    <button class="operation-btn format-btn" @click="formatCode" :disabled="!inputCode.trim()">
                        格式化
                    </button>
                    <button class="operation-btn minify-btn" @click="minifyCode" :disabled="!inputCode.trim()">
                        压缩
                    </button>
                    <button class="operation-btn encrypt-btn" @click="encryptCode" :disabled="!inputCode.trim()">
                        加密
                    </button>
                    <button class="operation-btn validate-btn" @click="validateCode" :disabled="!inputCode.trim()">
                        验证
                    </button>
                </div>
            </div>

            <div class="feature-description">
                <div class="description-content">
                    <div class="feature-item">
                        <strong>格式化：</strong>美化代码结构，统一缩进和换行
                    </div>
                    <div class="feature-item">
                        <strong>压缩：</strong>移除空格和注释，减小文件体积
                    </div>
                    <div class="feature-item">
                        <strong>加密：</strong>对代码进行Base64编码保护
                    </div>
                    <div class="feature-item">
                        <strong>验证：</strong>检查代码语法是否正确
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
import {  ref, computed, onMounted, onUnmounted  } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import * as prettier from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'
import parserHtml from 'prettier/parser-html'
import parserPostcss from 'prettier/parser-postcss'
import { html as beautifyHtml } from 'js-beautify'

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('code-formatter')

const selectedLanguage = ref('javascript')
const inputCode = ref('')
const outputCode = ref('')

const formatConfig = ref({
    indentType: 'spaces',
    indentSize: '2'
})

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 代码统计
const codeStats = ref({
    lines: 0,
    characters: 0,
    bytes: 0
})

const outputStats = ref({
    lines: 0,
    characters: 0,
    bytes: 0
})

// 计算压缩率
const compressionRatio = computed(() => {
    if (!codeStats.value.characters || !outputStats.value.characters) return 0
    const ratio = ((codeStats.value.characters - outputStats.value.characters) / codeStats.value.characters) * 100
    return Math.round(ratio)
})

const formatCode = async () => {
    if (!inputCode.value.trim()) return

    try {
        let formatted = ''
        const indentSize = parseInt(formatConfig.value.indentSize)
        const useTabs = formatConfig.value.indentType === 'tabs'

        if (selectedLanguage.value === 'html') {
            // 使用 js-beautify 格式化 HTML
            formatted = beautifyHtml(inputCode.value, {
                indent_size: indentSize,
                indent_char: useTabs ? '\t' : ' ',
                max_preserve_newlines: 2,
                preserve_newlines: true,
                wrap_line_length: 120,
                indent_inner_html: true,
                indent_scripts: 'keep',
                end_with_newline: false,
                extra_liners: ['head', 'body', '/html']
            })
        } else if (selectedLanguage.value === 'css') {
            // 使用 Prettier 格式化 CSS
            formatted = await prettier.format(inputCode.value, {
                parser: 'css',
                plugins: [parserPostcss],
                tabWidth: indentSize,
                useTabs: useTabs,
                semi: true,
                singleQuote: false,
                printWidth: 120
            })
        } else {
            // 使用 Prettier 格式化 JavaScript
            formatted = await prettier.format(inputCode.value, {
                parser: 'babel',
                plugins: [parserBabel],
                tabWidth: indentSize,
                useTabs: useTabs,
                semi: true,
                singleQuote: true,
                trailingComma: 'es5',
                bracketSpacing: true,
                arrowParens: 'avoid',
                printWidth: 120
            })
        }

        outputCode.value = formatted
        updateOutputStats(outputCode.value)
        showMessage('代码格式化完成', 'success')
    } catch (error) {
        console.error('格式化错误:', error)
        showMessage(`格式化失败: ${(error as Error).message}`, 'error')
    }
}

const minifyCode = () => {
    if (!inputCode.value.trim()) return

    try {
        let minified = ''

        if (selectedLanguage.value === 'html') {
            minified = inputCode.value
                .replace(/<!--[\s\S]*?-->/g, '')
                .replace(/\s+/g, ' ')
                .replace(/>\s+</g, '><')
                .trim()
        } else if (selectedLanguage.value === 'css') {
            minified = inputCode.value
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/\s+/g, ' ')
                .replace(/\s*{\s*/g, '{')
                .replace(/\s*}\s*/g, '}')
                .replace(/\s*;\s*/g, ';')
                .replace(/\s*:\s*/g, ':')
                .replace(/\s*,\s*/g, ',')
                .trim()
        } else {
            minified = inputCode.value
                .replace(/\/\/.*$/gm, '')
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/\s+/g, ' ')
                .replace(/\s*{\s*/g, '{')
                .replace(/\s*}\s*/g, '}')
                .replace(/\s*,\s*/g, ',')
                .replace(/\s*;\s*/g, ';')
                .replace(/\s*\(\s*/g, '(')
                .replace(/\s*\)\s*/g, ')')
                .trim()
        }

        outputCode.value = minified
        updateOutputStats(outputCode.value)
        showMessage('代码压缩完成', 'success')
    } catch (error) {
        showMessage('压缩失败', 'error')
    }
}

const encryptCode = () => {
    if (!inputCode.value.trim()) return

    try {
        minifyCode()
        const encoded = btoa(outputCode.value)
        outputCode.value = `/* Encrypted Code */\neval(atob("${encoded}"))`
        updateOutputStats(outputCode.value)
        showMessage('代码加密完成', 'success')
    } catch (error) {
        showMessage('加密失败', 'error')
    }
}

const validateCode = async () => {
    if (!inputCode.value.trim()) return

    try {
        let isValid = false
        let errorMessage = ''

        if (selectedLanguage.value === 'javascript') {
            try {
                // 使用 Prettier 来验证 JavaScript 语法
                await prettier.format(inputCode.value, {
                    parser: 'babel',
                    plugins: [parserBabel]
                })
                isValid = true
            } catch (error) {
                errorMessage = (error as Error).message
            }
        } else if (selectedLanguage.value === 'html') {
            try {
                // 使用 Prettier 来验证 HTML 语法
                await prettier.format(inputCode.value, {
                    parser: 'html',
                    plugins: [parserHtml]
                })
                isValid = true
            } catch (error) {
                errorMessage = (error as Error).message
            }
        } else if (selectedLanguage.value === 'css') {
            try {
                // 使用 Prettier 来验证 CSS 语法
                await prettier.format(inputCode.value, {
                    parser: 'css',
                    plugins: [parserPostcss]
                })
                isValid = true
            } catch (error) {
                errorMessage = (error as Error).message
            }
        }

        if (isValid) {
            showMessage('代码验证通过', 'success')
        } else {
            showMessage(`代码验证失败: ${errorMessage}`, 'error')
        }
    } catch (error) {
        showMessage('代码验证失败', 'error')
    }
}

const copyOutput = async () => {
    if (!outputCode.value) return

    try {
        await navigator.clipboard.writeText(outputCode.value)
        showMessage('结果已复制到剪贴板', 'success')
    } catch (error) {
        // Fallback for older browsers
        showMessage('复制失败，请手动复制', 'error')
    }
}

const clearOutput = () => {
    outputCode.value = ''
    updateOutputStats('')
    showMessage('输出已清空', 'success')
}

const showMessage = (text: string, type: 'success' | 'error') => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const getPlaceholder = () => {
    const placeholders = {
        javascript: 'function hello() {\n    console.log("Hello, World!");\n}',
        html: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>',
        css: '.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}'
    }
    return placeholders[selectedLanguage.value as keyof typeof placeholders] || '请输入代码...'
}

const updateStats = () => {
    const code = inputCode.value
    codeStats.value = {
        lines: code.split('\n').length,
        characters: code.length,
        bytes: new Blob([code]).size
    }
}

const updateOutputStats = (code: string) => {
    outputStats.value = {
        lines: code.split('\n').length,
        characters: code.length,
        bytes: new Blob([code]).size
    }
}

const pasteCode = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputCode.value = text
        updateStats()
        showMessage('代码已粘贴', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

const clearInput = () => {
    inputCode.value = ''
    updateStats()
    showMessage('输入已清空', 'success')
}

const downloadOutput = () => {
    if (!outputCode.value) return

    const extensions = {
        javascript: 'js',
        html: 'html',
        css: 'css'
    }

    const extension = extensions[selectedLanguage.value as keyof typeof extensions] || 'txt'
    const filename = `formatted-code.${extension}`

    const blob = new Blob([outputCode.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    showMessage('文件已下载', 'success')
}

updateStats()

</script>

<style scoped>
.code-formatter {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.formatter-header {
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
}

.back-btn:hover {
    background: var(--bg-hover);
}

.formatter-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.language-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.language-select {
    padding: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.formatter-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    overflow: hidden;
    min-height: 0;
}

.main-workspace {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
    overflow: hidden;
    min-height: 400px;
}

.input-section,
.output-section {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.divider {
    background: var(--border-color);
}

.input-section,
.output-section {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 0.5rem;
    flex-shrink: 0;
}

.section-header h3 {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
}

.header-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn-small:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.code-editor {
    flex: 1;
    position: relative;
    background: var(--bg-primary);
    border: none;
    border-radius: 0;
    overflow: hidden;
}

.code-input,
.code-output {
    width: 100%;
    height: 100%;
    padding: 1rem 1rem 1rem 3rem;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    line-height: 1.5;
    resize: none;
    outline: none;
    tab-size: 4;
}

.line-numbers {
    position: absolute;
    top: 0;
    left: 0;
    width: 2.5rem;
    height: 100%;
    background: var(--bg-tertiary);
    border-right: 1px solid var(--border-color);
    padding: 1rem 0.5rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--text-secondary);
    user-select: none;
    overflow: hidden;
}

.line-number {
    text-align: right;
    padding-right: 0.5rem;
    height: 1.3em;
}

.empty-output {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
}

.empty-content {
    text-align: center;
    padding: 2rem;
    max-width: 280px;
}

.empty-icon {
    margin-bottom: 1rem;
    opacity: 0.5;
    color: var(--text-secondary);
}

.empty-content h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
}

.empty-content p {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.4;
}

.section-footer {
    padding: 0.5rem 0;
    border-top: 1px solid var(--border-color);
    margin-top: 0.5rem;
    flex-shrink: 0;
}

.stats-info {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.stat-item {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.stat-item.compression {
    color: var(--success-color);
    font-weight: 600;
}

.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    gap: 2rem;
    flex-shrink: 0;
}

.config-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
}

.config-section label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
}

.config-select {
    padding: 0.375rem 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.operation-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.operation-btn {
    padding: 0.625rem 1.25rem;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    min-width: 80px;
    transition: all 0.2s ease;
}

.operation-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.format-btn {
    background: var(--primary-color);
    color: white;
}

.format-btn:hover:not(:disabled) {
    background: var(--primary-color-dark, #4f46e5);
}

.minify-btn {
    background: var(--success-color);
    color: white;
}

.minify-btn:hover:not(:disabled) {
    background: var(--success-color-dark, #059669);
}

.encrypt-btn {
    background: var(--warning-color);
    color: white;
}

.encrypt-btn:hover:not(:disabled) {
    background: var(--warning-color-dark, #d97706);
}

.validate-btn {
    background: var(--error-color);
    color: white;
}

.validate-btn:hover:not(:disabled) {
    background: var(--error-color-dark, #dc2626);
}

.feature-description {
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    flex-shrink: 0;
}

.description-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.feature-item {
    font-size: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.4;
}

.feature-item strong {
    color: var(--text-primary);
    font-weight: 600;
}

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

@media (max-width: 1024px) {
    .main-workspace {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1px 1fr;
        gap: 0.5rem;
        min-height: 300px;
    }

    .divider {
        height: 1px;
        width: 100%;
    }

    .toolbar {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    .operation-buttons {
        justify-content: center;
    }

    .description-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }
}

@media (max-width: 768px) {
    .formatter-content {
        padding: 0.5rem;
    }

    .formatter-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
        padding: 1rem;
    }

    .main-workspace {
        min-height: 250px;
    }

    .operation-buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem;
    }

    .config-section {
        justify-content: center;
        flex-wrap: wrap;
    }

    .description-content {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
}
</style>
