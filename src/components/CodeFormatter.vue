<template>
    <div class="code-formatter">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <div class="language-selector">
                    <select v-model="selectedLanguage" class="language-select">
                        <option value="javascript">JavaScript</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                    </select>
                </div>
                <HeaderActionButton icon="copy" tooltip="复制结果" @click="copyOutput" :disabled="!outputCode" />
                <HeaderActionButton icon="clear" tooltip="清空结果" @click="clearOutput" :disabled="!outputCode" />
                <HeaderActionButton icon="download" tooltip="下载结果" @click="downloadOutput" :disabled="!outputCode" />
            </template>
        </PageHeader>

        <div class="formatter-content">
            <div class="main-workspace">
                <div class="input-section">
                    <div class="section-header">
                        <h3>代码输入</h3>
                        <div class="header-right">
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
                                <button class="operation-btn format-btn" @click="formatCode"
                                    :disabled="!inputCode.trim()">
                                    格式化
                                </button>
                                <button class="operation-btn minify-btn" @click="minifyCode"
                                    :disabled="!inputCode.trim()">
                                    压缩
                                </button>
                                <button class="operation-btn validate-btn" @click="validateCode"
                                    :disabled="!inputCode.trim()">
                                    验证
                                </button>
                            </div>
                            <button class="import-btn" @click="importFile">
                                导入文件
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



            <div class="feature-description">
                <div class="description-content">
                    <div class="feature-item">
                        <strong>格式化：</strong>美化代码结构，统一缩进和换行
                    </div>
                    <div class="feature-item">
                        <strong>压缩：</strong>移除空格和注释，减小文件体积
                    </div>
                    <div class="feature-item">
                        <strong>验证：</strong>检查代码语法是否正确
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import { useClipboard } from '../composables/useClipboard'
import { useDownload } from '../composables/useDownload'
import cardsConfig from '../config/cards.json'
import * as prettier from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'
import parserHtml from 'prettier/parser-html'
import parserPostcss from 'prettier/parser-postcss'
import { html as beautifyHtml } from 'js-beautify'

defineEmits<{
    back: []
}>()

// 使用组合式函数
usePageTitle('code-formatter')
const { success: showSuccess, error: showError } = useNotification()
const { copyToClipboard } = useClipboard()
const { downloadText } = useDownload()

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'code-formatter')
        if (card) {
            return card.title
        }
    }
    return 'JS/HTML格式化工具'
})

// 响应式数据
const selectedLanguage = ref('html')
const inputCode = ref('')
const outputCode = ref('')

// 格式化配置
const formatConfig = ref({
    indentType: 'tabs',
    indentSize: '2'
})

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

// 压缩比例
const compressionRatio = computed(() => {
    if (!inputCode.value || !outputCode.value) return 0
    const inputSize = new Blob([inputCode.value]).size
    const outputSize = new Blob([outputCode.value]).size
    return Math.round(((inputSize - outputSize) / inputSize) * 100)
})

// 获取占位符
const getPlaceholder = () => {
    switch (selectedLanguage.value) {
        case 'javascript':
            return 'function hello() {\nconsole.log("Hello World!");\n}'
        case 'html':
            return '<!DOCTYPE html>\n<html>\n<head>\n<title>Title</title>\n</head>\n<body>\n<h1>Hello World!</h1>\n</body>\n</html>'
        case 'css':
            return 'body {\nmargin: 0;\npadding: 0;\nfont-family: Arial, sans-serif;\n}'
        default:
            return '请输入代码...'
    }
}

// 更新统计信息
const updateStats = () => {
    const text = inputCode.value
    codeStats.value = {
        lines: text ? text.split('\n').length : 0,
        characters: text.length,
        bytes: new Blob([text]).size
    }
}

// 更新输出统计
const updateOutputStats = () => {
    const text = outputCode.value
    outputStats.value = {
        lines: text ? text.split('\n').length : 0,
        characters: text.length,
        bytes: new Blob([text]).size
    }
}

// 格式化字节数
const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 清空输出
const clearOutput = () => {
    outputCode.value = ''
    updateOutputStats()
    showSuccess('已清空输出')
}

// 导入文件
const importFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.js,.html,.css,.txt,.json,.xml,.vue,.ts,.jsx,.tsx'

    input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) return

        // 根据文件扩展名自动选择语言
        const extension = file.name.split('.').pop()?.toLowerCase()
        if (extension) {
            switch (extension) {
                case 'js':
                case 'jsx':
                case 'ts':
                case 'tsx':
                case 'json':
                    selectedLanguage.value = 'javascript'
                    break
                case 'html':
                case 'htm':
                case 'vue':
                case 'xml':
                    selectedLanguage.value = 'html'
                    break
                case 'css':
                case 'scss':
                case 'sass':
                case 'less':
                    selectedLanguage.value = 'css'
                    break
            }
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const content = e.target?.result as string
            inputCode.value = content
            updateStats()
            showSuccess(`已导入文件: ${file.name}`)
        }
        reader.onerror = () => {
            showError('文件读取失败')
        }
        reader.readAsText(file)
    }

    input.click()
}

// 复制输出
const copyOutput = async () => {
    if (!outputCode.value) {
        showError('没有可复制的内容')
        return
    }

    const success = await copyToClipboard(outputCode.value)
    if (success) {
        showSuccess('已复制到剪贴板')
    } else {
        showError('复制失败')
    }
}

// 下载输出
const downloadOutput = () => {
    if (!outputCode.value) {
        showError('没有可下载的内容')
        return
    }

    const extension = selectedLanguage.value === 'javascript' ? 'js' : selectedLanguage.value
    const filename = 'formatted_code'

    downloadText(outputCode.value, filename, extension)
    showSuccess('文件下载已开始')
}

// 格式化代码
const formatCode = async () => {
    if (!inputCode.value.trim()) {
        showError('请输入代码')
        return
    }

    try {
        let formatted = ''
        const indentSize = parseInt(formatConfig.value.indentSize)
        const useTabs = formatConfig.value.indentType === 'tabs'

        if (selectedLanguage.value === 'html') {
            try {
                // 使用 js-beautify 格式化 HTML
                formatted = beautifyHtml(inputCode.value, {
                    indent_size: useTabs ? 1 : indentSize,
                    indent_char: useTabs ? '\t' : ' ',
                    max_preserve_newlines: 2,
                    preserve_newlines: true,
                    wrap_line_length: 120,
                    indent_inner_html: true,
                    indent_scripts: 'keep',
                    end_with_newline: false,
                    extra_liners: ['head', 'body', '/html']
                })
            } catch (error) {
                // 如果 js-beautify 失败，使用简单的格式化
                formatted = simpleHtmlFormat(inputCode.value, indentSize, useTabs)
            }
        } else if (selectedLanguage.value === 'css') {
            try {
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
            } catch (error) {
                // 如果 Prettier 失败，使用简单的格式化
                formatted = simpleCssFormat(inputCode.value, indentSize, useTabs)
            }
        } else {
            try {
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
            } catch (error) {
                // 如果 Prettier 失败，使用简单的格式化
                formatted = simpleJsFormat(inputCode.value, indentSize, useTabs)
            }
        }

        outputCode.value = formatted
        updateOutputStats()
        showSuccess('代码格式化完成')
    } catch (error) {
        console.error('格式化错误:', error)
        const errorMsg = (error as Error).message
        if (errorMsg.includes('languages')) {
            showError('格式化失败: 代码格式化器初始化错误，请刷新页面重试')
        } else {
            showError(`格式化失败: ${errorMsg}`)
        }
    }
}

// 简单的 HTML 格式化函数
const simpleHtmlFormat = (code: string, indentSize: number, useTabs: boolean): string => {
    const indent = useTabs ? '\t' : ' '.repeat(indentSize)
    let formatted = ''
    let level = 0
    const lines = code.split(/>\s*</)
    
    lines.forEach((line, index) => {
        if (index > 0) line = '<' + line
        if (index < lines.length - 1) line = line + '>'
        
        if (line.includes('</')) level--
        formatted += indent.repeat(Math.max(0, level)) + line.trim() + '\n'
        if (line.includes('<') && !line.includes('</') && !line.includes('/>')) level++
    })
    
    return formatted.trim()
}

// 简单的 CSS 格式化函数
const simpleCssFormat = (code: string, indentSize: number, useTabs: boolean): string => {
    const indent = useTabs ? '\t' : ' '.repeat(indentSize)
    return code
        .replace(/\s*{\s*/g, ' {\n' + indent)
        .replace(/;\s*/g, ';\n' + indent)
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/,\s*/g, ',\n')
        .trim()
}

// 简单的 JavaScript 格式化函数
const simpleJsFormat = (code: string, indentSize: number, useTabs: boolean): string => {
    const indent = useTabs ? '\t' : ' '.repeat(indentSize)
    let formatted = ''
    let level = 0
    
    for (let i = 0; i < code.length; i++) {
        const char = code[i]
        const nextChar = code[i + 1]
        
        if (char === '{') {
            formatted += char + '\n'
            level++
            formatted += indent.repeat(level)
        } else if (char === '}') {
            level--
            formatted += '\n' + indent.repeat(level) + char
            if (nextChar && nextChar !== ';' && nextChar !== ',') {
                formatted += '\n' + indent.repeat(level)
            }
        } else if (char === ';' && nextChar !== ' ' && nextChar !== '\n') {
            formatted += char + '\n' + indent.repeat(level)
        } else {
            formatted += char
        }
    }
    
    return formatted.trim()
}

// 压缩代码
const minifyCode = () => {
    if (!inputCode.value.trim()) {
        showError('请输入代码')
        return
    }

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
        updateOutputStats()
        showSuccess('代码压缩完成')
    } catch (error) {
        showError('压缩失败')
    }
}


// 验证语法
const validateCode = async () => {
    if (!inputCode.value.trim()) {
        showError('请输入代码')
        return
    }

    try {
        let isValid = false
        let errorMessage = ''

        // 先尝试基本的语法检查
        if (selectedLanguage.value === 'javascript') {
            try {
                // 基本的 JavaScript 语法检查
                new Function(inputCode.value)
                isValid = true
            } catch (basicError) {
                try {
                    // 如果基本检查失败，尝试使用 Prettier
                    await prettier.format(inputCode.value, {
                        parser: 'babel',
                        plugins: [parserBabel],
                        printWidth: 80,
                        tabWidth: 2,
                        useTabs: false,
                        semi: true,
                        singleQuote: true
                    })
                    isValid = true
                } catch (prettierError) {
                    errorMessage = (basicError as Error).message
                }
            }
        } else if (selectedLanguage.value === 'html') {
            try {
                // 基本的 HTML 检查 - 检查标签是否匹配
                const parser = new DOMParser()
                const doc = parser.parseFromString(inputCode.value, 'text/html')
                const parserErrors = doc.querySelectorAll('parsererror')
                
                if (parserErrors.length === 0) {
                    isValid = true
                } else {
                    errorMessage = 'HTML 语法错误'
                }
            } catch (error) {
                errorMessage = (error as Error).message
            }
        } else if (selectedLanguage.value === 'css') {
            try {
                // 基本的 CSS 检查
                const style = document.createElement('style')
                style.textContent = inputCode.value
                document.head.appendChild(style)
                document.head.removeChild(style)
                isValid = true
            } catch (error) {
                errorMessage = (error as Error).message
            }
        }

        if (isValid) {
            showSuccess('代码验证通过')
        } else {
            showError(`代码验证失败: ${errorMessage}`)
        }
    } catch (error) {
        console.error('验证错误:', error)
        showError('代码验证失败: 验证器错误')
    }
}

// 监听输入变化
inputCode.value && updateStats()
outputCode.value && updateOutputStats()
</script>

<style scoped>
.code-formatter {
    width: 100%;
    height: 100dvh;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
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
    padding: 0 1rem 1rem 1rem;
    overflow-y: auto;
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

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 0.5rem;
    flex-shrink: 0;
    height: 48px;
}

.section-header h3 {
    font-size: 0.75rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
}

.header-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.operation-buttons {
    display: flex;
    align-items: center;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    overflow: hidden;
    height: 32px;
}

.operation-btn {
    padding: 0 0.75rem;
    border: none;
    background: var(--bg-primary);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border-right: 1px solid var(--border-color);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.operation-btn:last-child {
    border-right: none;
}

.operation-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.operation-btn:hover:not(:disabled) {
    background: var(--bg-secondary);
}

.format-btn:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
}

.minify-btn:hover:not(:disabled) {
    background: var(--success-color);
    color: white;
}

.validate-btn:hover:not(:disabled) {
    background: var(--error-color);
    color: white;
}

.import-btn {
    padding: 0 0.75rem;
    height: 32px;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.import-btn:hover {
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


.config-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.config-section label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
}

.config-select {
    padding: 0.25rem 0.375rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    color: var(--text-primary);
    font-size: 0.75rem;
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
    grid-template-columns: repeat(3, 1fr);
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