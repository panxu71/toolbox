<template>
    <div class="php-json-converter">
        <!-- 使用通用头部组件 -->
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <div class="mode-toggle">
                    <button class="mode-btn" :class="{ active: mode === 'json-to-php' }"
                        @click="switchMode('json-to-php')">
                        JSON → PHP
                    </button>
                    <button class="mode-btn" :class="{ active: mode === 'php-to-json' }"
                        @click="switchMode('php-to-json')">
                        PHP → JSON
                    </button>
                </div>

                <!-- JSON转PHP模式的操作按钮 -->
                <template v-if="mode === 'json-to-php'">
                    <HeaderActionButton icon="copy" tooltip="复制PHP代码" :disabled="!phpOutput" @click="copyPhpResult" />
                    <HeaderActionButton icon="download" tooltip="下载PHP文件" :disabled="!phpOutput"
                        @click="downloadPhpResult" />
                    <HeaderActionButton icon="toggle" :tooltip="arrayStyle === 'short' ? '切换到长语法 array()' : '切换到短语法 []'"
                        @click="toggleArrayStyle" />
                </template>

                <!-- PHP转JSON模式的操作按钮 -->
                <template v-else>
                    <HeaderActionButton icon="copy" tooltip="复制JSON" :disabled="!jsonOutput" @click="copyJsonResult" />
                    <HeaderActionButton icon="download" tooltip="下载JSON文件" :disabled="!jsonOutput"
                        @click="downloadJsonResult" />
                </template>

                <HeaderActionButton icon="clear" tooltip="清空" @click="clearAll" />
            </template>
        </PageHeader>

        <!-- JSON转PHP模式 -->
        <div v-if="mode === 'json-to-php'" class="converter-layout">
            <!-- 左侧输入区域 -->
            <div class="input-section">
                <div class="section-header">
                    <h3>JSON输入</h3>
                    <div class="section-actions">
                        <div class="button-group">
                            <button @click="loadJsonExample" class="group-btn">示例数据</button>
                            <button @click="formatJsonInput" class="group-btn">格式化</button>
                            <button @click="validateJsonInput" class="group-btn">验证</button>
                        </div>
                    </div>
                </div>
                <textarea v-model="jsonInput" class="code-textarea" placeholder="请输入JSON数据..." @input="convertJsonToPhp"
                    @paste="onJsonPaste"></textarea>
                <div v-if="inputError" class="error-message">
                    {{ inputError }}
                </div>
            </div>

            <!-- 右侧输出区域 -->
            <div class="output-section">
                <div class="section-header">
                    <h3>PHP数组输出</h3>
                    <div class="result-info" v-if="phpStats">
                        <span class="stat-item">{{ phpStats.lines }} 行</span>
                        <span class="stat-item">{{ phpStats.size }} 字符</span>
                    </div>
                </div>
                <div class="output-container">
                    <pre v-if="phpOutput" class="code-output" v-html="highlightedPhp"></pre>
                    <div v-else class="output-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                        </svg>
                        <p>PHP数组代码将显示在这里</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- PHP转JSON模式 -->
        <div v-else class="converter-layout">
            <!-- 左侧输入区域 -->
            <div class="input-section">
                <div class="section-header">
                    <h3>PHP数组输入</h3>
                    <div class="section-actions">
                        <div class="button-group">
                            <button @click="loadPhpExample" class="group-btn">示例数据</button>
                            <button @click="validatePhpInput" class="group-btn">验证</button>
                            <button @click="convertPhpToJson(true)" class="group-btn">转换</button>
                        </div>
                    </div>
                </div>
                <textarea v-model="phpInput" class="code-textarea" placeholder="请输入PHP数组代码..." @input="onPhpInputChange"
                    @paste="onPhpPaste"></textarea>
                <div v-if="phpInputError" class="error-message">
                    {{ phpInputError }}
                </div>
            </div>

            <!-- 右侧输出区域 -->
            <div class="output-section">
                <div class="section-header">
                    <h3>JSON输出</h3>
                    <div class="result-info" v-if="jsonStats">
                        <span class="stat-item">{{ jsonStats.lines }} 行</span>
                        <span class="stat-item">{{ jsonStats.size }} 字符</span>
                    </div>
                </div>
                <div class="output-container">
                    <pre v-if="jsonOutput" class="code-output" v-html="highlightedJson"></pre>
                    <div v-else class="output-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1">
                            <polyline points="16,18 22,12 16,6" />
                            <polyline points="8,6 2,12 8,18" />
                        </svg>
                        <p>JSON数据将显示在这里</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 保持原有的消息提示样式 -->
        <div v-if="message" :class="['message', messageType]">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useDownload } from '../composables/useDownload'
import { useClipboard } from '../composables/useClipboard'
import { useMessage } from '../composables/useMessage'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import hljs from 'highlight.js/lib/core'
import php from 'highlight.js/lib/languages/php'
import json from 'highlight.js/lib/languages/json'
import cardsConfig from '../config/cards.json'

// 注册语言支持
hljs.registerLanguage('php', php)
hljs.registerLanguage('json', json)

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('json-to-php')

// 获取卡片标题
const getCardTitle = (cardId: string): string => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === cardId)
        if (card) {
            return card.title
        }
    }
    return cardId
}

const pageTitle = getCardTitle('json-to-php')

// 使用下载功能
const { downloadText, downloadJson } = useDownload()

// 使用剪贴板功能
const { copyToClipboard } = useClipboard()

// 使用消息提示
const { message, messageType, showMessage } = useMessage()

const mode = ref<'json-to-php' | 'php-to-json'>('json-to-php')

// JSON转PHP相关
const jsonInput = ref('')
const phpOutput = ref('')
const inputError = ref('')
const arrayStyle = ref<'short' | 'long'>('short') // short: [], long: array()

// PHP转JSON相关
const phpInput = ref('')
const jsonOutput = ref('')
const phpInputError = ref('')

// 添加防抖定时器
const phpConvertTimer = ref<NodeJS.Timeout | undefined>(undefined)

// PHP统计信息
const phpStats = computed(() => {
    if (!phpOutput.value) return null
    const lines = phpOutput.value.split('\n').length
    const size = phpOutput.value.length
    return { lines, size }
})

// JSON统计信息
const jsonStats = computed(() => {
    if (!jsonOutput.value) return null
    const lines = jsonOutput.value.split('\n').length
    const size = jsonOutput.value.length
    return { lines, size }
})

const highlightedPhp = computed(() => {
    if (!phpOutput.value) return ''
    try {
        return hljs.highlight(phpOutput.value, { language: 'php' }).value
    } catch {
        return phpOutput.value
    }
})

const highlightedJson = computed(() => {
    if (!jsonOutput.value) return ''
    try {
        return hljs.highlight(jsonOutput.value, { language: 'json' }).value
    } catch {
        return jsonOutput.value
    }
})

// 切换模式
const switchMode = (newMode: 'json-to-php' | 'php-to-json') => {
    mode.value = newMode
    clearAll()
}

// JSON转PHP功能
const convertJsonToPhp = () => {
    inputError.value = ''

    if (!jsonInput.value.trim()) {
        phpOutput.value = ''
        return
    }

    try {
        const parsed = JSON.parse(jsonInput.value)
        phpOutput.value = jsonToPhpArray(parsed, 0)
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        phpOutput.value = '// JSON格式错误，请检查输入'
    }
}

// 粘贴时自动转换
const onJsonPaste = async () => {
    await new Promise(resolve => setTimeout(resolve, 10))

    if (jsonInput.value.trim()) {
        try {
            JSON.parse(jsonInput.value)
            convertJsonToPhp()
        } catch {
            // 如果不是有效JSON，不自动转换
        }
    }
}

const validateJsonInput = () => {
    if (!jsonInput.value.trim()) {
        showMessage('请先输入JSON数据', 'error')
        return
    }

    try {
        JSON.parse(jsonInput.value)
        inputError.value = ''
        showMessage('JSON格式正确 ✅', 'success')
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        showMessage('JSON格式错误 ❌', 'error')
    }
}

const jsonToPhpArray = (obj: any, indent: number = 0): string => {
    const spaces = '    '.repeat(indent)
    const nextSpaces = '    '.repeat(indent + 1)

    if (obj === null) {
        return 'null'
    }

    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false'
    }

    if (typeof obj === 'number') {
        return obj.toString()
    }

    if (typeof obj === 'string') {
        return `'${obj.replace(/'/g, "\\'")}'`
    }

    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return arrayStyle.value === 'short' ? '[]' : 'array()'
        }

        const items = obj.map(item =>
            `${nextSpaces}${jsonToPhpArray(item, indent + 1)}`
        ).join(',\n')

        if (arrayStyle.value === 'short') {
            return `[\n${items}\n${spaces}]`
        } else {
            return `array(\n${items}\n${spaces})`
        }
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj)
        if (keys.length === 0) {
            return arrayStyle.value === 'short' ? '[]' : 'array()'
        }

        const items = keys.map(key => {
            const value = jsonToPhpArray(obj[key], indent + 1)
            return `${nextSpaces}'${key}' => ${value}`
        }).join(',\n')

        if (arrayStyle.value === 'short') {
            return `[\n${items}\n${spaces}]`
        } else {
            return `array(\n${items}\n${spaces})`
        }
    }

    return 'null'
}

// PHP转JSON功能
const onPhpInputChange = () => {
    phpInputError.value = ''

    if (!phpInput.value.trim()) {
        jsonOutput.value = ''
        return
    }

    // 自动转换（添加防抖，避免频繁转换）
    clearTimeout(phpConvertTimer.value)
    phpConvertTimer.value = setTimeout(() => {
        convertPhpToJson(false)
    }, 500)
}

// 粘贴时自动转换
const onPhpPaste = async () => {
    await new Promise(resolve => setTimeout(resolve, 10))

    if (phpInput.value.trim()) {
        convertPhpToJson(false)
    }
}

const convertPhpToJson = (showSuccessMessage = true) => {
    phpInputError.value = ''

    if (!phpInput.value.trim()) {
        if (showSuccessMessage) {
            showMessage('请先输入PHP数组代码', 'error')
        }
        return
    }

    try {
        const result = parsePhpArray(phpInput.value)
        // 始终使用格式化输出
        jsonOutput.value = JSON.stringify(result, null, 2)
        if (showSuccessMessage) {
            showMessage('转换成功！', 'success')
        }
    } catch (error) {
        phpInputError.value = `PHP数组解析错误: ${(error as Error).message}`
        jsonOutput.value = ''
        if (showSuccessMessage) {
            showMessage('PHP数组解析错误', 'error')
        }
    }
}

const validatePhpInput = () => {
    if (!phpInput.value.trim()) {
        showMessage('请先输入PHP数组代码', 'error')
        return
    }

    try {
        parsePhpArray(phpInput.value)
        phpInputError.value = ''
        showMessage('PHP数组格式正确 ✅', 'success')
    } catch (error) {
        phpInputError.value = `PHP数组格式错误: ${(error as Error).message}`
        showMessage('PHP数组格式错误 ❌', 'error')
    }
}

// 简单的PHP数组解析器
const parsePhpArray = (phpCode: string): any => {
    // 移除PHP标签和变量赋值
    let code = phpCode.trim()
    code = code.replace(/^<\?php\s*/i, '')
    code = code.replace(/^\$\w+\s*=\s*/, '')
    code = code.replace(/;?\s*$/, '')

    // 如果代码为空，返回空对象
    if (!code) {
        throw new Error('输入为空')
    }

    try {
        // 替换PHP语法为JSON语法
        let jsonCode = code

        // 替换 array( 为 [
        jsonCode = jsonCode.replace(/array\s*\(/g, '[')

        // 替换对应的 ) 为 ]
        // 这里需要更智能的括号匹配，但为了简单起见，直接替换
        jsonCode = jsonCode.replace(/\)/g, ']')

        // 替换 => 为 :
        jsonCode = jsonCode.replace(/\s*=>\s*/g, ':')

        // 替换单引号为双引号（但要注意转义）
        jsonCode = jsonCode.replace(/'/g, '"')

        // 替换PHP布尔值
        jsonCode = jsonCode.replace(/\btrue\b/g, 'true')
        jsonCode = jsonCode.replace(/\bfalse\b/g, 'false')
        jsonCode = jsonCode.replace(/\bnull\b/g, 'null')

        // 尝试解析为JSON
        return JSON.parse(jsonCode)
    } catch (error) {
        // 如果解析失败，尝试更宽松的解析
        try {
            // 移除所有注释
            let cleanCode = code.replace(/\/\*[\s\S]*?\*\//g, '')
            cleanCode = cleanCode.replace(/\/\/.*$/gm, '')

            // 简单的键值对解析
            const result: any = {}
            const lines = cleanCode.split('\n')

            for (const line of lines) {
                const trimmed = line.trim()
                if (trimmed && trimmed.includes('=>')) {
                    const parts = trimmed.split('=>', 2)
                    const key = parts[0]
                    const value = parts[1]

                    if (!key || !value) continue

                    const cleanKey = key.trim().replace(/['"]/g, '').replace(/,$/, '')
                    let cleanValue = value.trim().replace(/,$/, '')

                    // 处理不同类型的值
                    if (cleanValue === 'true') {
                        result[cleanKey] = true
                    } else if (cleanValue === 'false') {
                        result[cleanKey] = false
                    } else if (cleanValue === 'null') {
                        result[cleanKey] = null
                    } else if (/^\d+$/.test(cleanValue)) {
                        result[cleanKey] = parseInt(cleanValue)
                    } else if (/^\d+\.\d+$/.test(cleanValue)) {
                        result[cleanKey] = parseFloat(cleanValue)
                    } else {
                        result[cleanKey] = cleanValue.replace(/['"]/g, '')
                    }
                }
            }

            return Object.keys(result).length > 0 ? result : { error: '无法解析PHP数组' }
        } catch (fallbackError) {
            throw new Error('无法解析PHP数组格式，请检查语法')
        }
    }
}

const loadJsonExample = () => {
    jsonInput.value = JSON.stringify({
        "name": "张三",
        "age": 30,
        "email": "zhangsan@example.com",
        "skills": ["PHP", "JavaScript", "MySQL"],
        "address": {
            "city": "北京",
            "district": "朝阳区",
            "zipcode": "100000"
        },
        "active": true,
        "salary": null
    }, null, 2)
    convertJsonToPhp()
}

const loadPhpExample = () => {
    phpInput.value = `[
    'name' => '张三',
    'age' => 30,
    'email' => 'zhangsan@example.com',
    'skills' => ['PHP', 'JavaScript', 'MySQL'],
    'address' => [
        'city' => '北京',
        'district' => '朝阳区',
        'zipcode' => '100000'
    ],
    'active' => true,
    'salary' => null
]`
    convertPhpToJson(false)
}

const formatJsonInput = () => {
    if (!jsonInput.value.trim()) return

    try {
        const parsed = JSON.parse(jsonInput.value)
        jsonInput.value = JSON.stringify(parsed, null, 2)
        convertJsonToPhp()
        showMessage('JSON格式化成功！', 'success')
    } catch (error) {
        showMessage('JSON格式错误，无法格式化', 'error')
    }
}

const toggleArrayStyle = () => {
    arrayStyle.value = arrayStyle.value === 'short' ? 'long' : 'short'
    convertJsonToPhp()
}

const toggleJsonFormat = () => {
    jsonFormat.value = jsonFormat.value === 'pretty' ? 'compact' : 'pretty'
    convertPhpToJson(false)
}

const copyPhpResult = async () => {
    if (!phpOutput.value) {
        showMessage('没有可复制的内容', 'error')
        return
    }

    const success = await copyToClipboard(phpOutput.value)
    if (success) {
        showMessage('PHP代码已复制到剪贴板！', 'success')
    } else {
        showMessage('复制失败，请手动复制', 'error')
    }
}

const copyJsonResult = async () => {
    if (!jsonOutput.value) {
        showMessage('没有可复制的内容', 'error')
        return
    }

    const success = await copyToClipboard(jsonOutput.value)
    if (success) {
        showMessage('JSON数据已复制到剪贴板！', 'success')
    } else {
        showMessage('复制失败，请手动复制', 'error')
    }
}

const downloadPhpResult = () => {
    if (!phpOutput.value) {
        showMessage('没有可下载的内容', 'error')
        return
    }

    const content = `<?php\n\n$data = ${phpOutput.value};\n`
    const success = downloadText(content, 'converted_array', 'php')
    if (success) {
        showMessage('PHP文件下载成功！', 'success')
    } else {
        showMessage('下载失败', 'error')
    }
}

const downloadJsonResult = () => {
    if (!jsonOutput.value) {
        showMessage('没有可下载的内容', 'error')
        return
    }

    const success = downloadJson(jsonOutput.value, 'converted_data')
    if (success) {
        showMessage('JSON文件下载成功！', 'success')
    } else {
        showMessage('下载失败', 'error')
    }
}

const clearAll = () => {
    jsonInput.value = ''
    phpOutput.value = ''
    phpInput.value = ''
    jsonOutput.value = ''
    inputError.value = ''
    phpInputError.value = ''
    showMessage('已清空所有内容', 'success')
}

onMounted(() => {
    loadJsonExample()
})

</script>

<style scoped>
/* 保持原有的所有样式，只是移除了 tool-header 部分 */
.php-json-converter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.mode-toggle {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--bg-primary);
}

.mode-btn {
    padding: 8px 16px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border-right: 1px solid var(--border-color);
    height: 36px;
    box-sizing: border-box;
}

.mode-btn:last-child {
    border-right: none;
}

.mode-btn.active {
    background: var(--primary-color);
    color: white;
}

.mode-btn:hover:not(.active) {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.converter-layout {
    flex: 1;
    display: grid;
    grid-template-columns: 4fr 6fr;
    gap: 1px;
    background: var(--border-color);
    min-height: 0;
}

.input-section,
.output-section {
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 20px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    min-height: 48px;
    box-sizing: border-box;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.section-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.result-info {
    display: flex;
    gap: 6px;
    font-size: 11px;
    color: var(--text-muted);
    white-space: nowrap;
}

.stat-item {
    padding: 1px 4px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    font-size: 11px;
    line-height: 1.2;
}

.button-group {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
}

.group-btn {
    padding: 6px 12px;
    background: var(--bg-primary);
    border: none;
    border-right: 1px solid var(--border-color);
    border-radius: 0;
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    min-width: 60px;
    text-align: center;
}

.group-btn:first-child {
    border-top-left-radius: var(--radius-sm);
    border-bottom-left-radius: var(--radius-sm);
}

.group-btn:last-child {
    border-top-right-radius: var(--radius-sm);
    border-bottom-right-radius: var(--radius-sm);
    border-right: none;
}

.group-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.group-btn:active {
    background: var(--bg-tertiary);
}

.code-textarea {
    flex: 1;
    padding: 20px;
    border: none;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    outline: none;
}

.code-textarea::placeholder {
    color: var(--text-muted);
}

.error-message {
    padding: 12px 20px;
    background: rgba(239, 68, 68, 0.1);
    border-top: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    font-size: 14px;
}

.output-container {
    flex: 1;
    overflow: auto;
}

.output-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted);
    text-align: center;
    padding: 40px 20px;
}

.output-placeholder svg {
    margin-bottom: 16px;
    opacity: 0.5;
}

.code-output {
    width: 100%;
    height: 100%;
    padding: 20px;
    margin: 0;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-all;
}

.code-output code {
    background: none !important;
    padding: 0 !important;
}

.message {
    position: absolute;
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    z-index: 100;
    animation: slideUp 0.3s ease-out;
}

.message.success {
    background: #10b981;
    color: white;
}

.message.error {
    background: #ef4444;
    color: white;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .converter-layout {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }

    .tool-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
        padding: 16px;
    }

    .mode-toggle {
        justify-content: center;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        min-height: auto;
        padding: 12px 16px;
    }
}
</style>