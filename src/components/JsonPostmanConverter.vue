<template>
    <div class="postman-json-converter">
        <!-- 使用通用头部组件 -->
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <div class="mode-toggle">
                    <button class="mode-btn" :class="{ active: mode === 'json-to-postman' }"
                        @click="switchMode('json-to-postman')">
                        JSON → Postman
                    </button>
                    <button class="mode-btn" :class="{ active: mode === 'postman-to-json' }"
                        @click="switchMode('postman-to-json')">
                        Postman → JSON
                    </button>
                </div>

                <!-- JSON转Postman模式的操作按钮 -->
                <template v-if="mode === 'json-to-postman'">
                    <HeaderActionButton icon="copy" tooltip="复制参数" :disabled="!postmanOutput"
                        @click="copyPostmanResult" />
                    <HeaderActionButton icon="download" tooltip="下载参数文件" :disabled="!postmanOutput"
                        @click="downloadPostmanResult" />
                </template>

                <!-- Postman转JSON模式的操作按钮 -->
                <template v-else>
                    <HeaderActionButton icon="copy" tooltip="复制JSON" :disabled="!jsonOutput" @click="copyJsonResult" />
                    <HeaderActionButton icon="download" tooltip="下载JSON文件" :disabled="!jsonOutput"
                        @click="downloadJsonResult" />
                </template>

                <HeaderActionButton icon="clear" tooltip="清空" @click="clearAll" />
            </template>
        </PageHeader>

        <!-- JSON转Postman模式 -->
        <div v-if="mode === 'json-to-postman'" class="converter-content">
            <div class="input-section">
                <div class="section-header">
                    <h3>JSON数据输入</h3>
                    <div class="section-actions">
                        <div class="button-group">
                            <button @click="loadJsonExample(1)" class="group-btn">用户数据</button>
                            <button @click="loadJsonExample(2)" class="group-btn">商品数据</button>
                            <button @click="formatJsonInput" class="group-btn">格式化</button>
                        </div>
                    </div>
                </div>
                <textarea v-model="jsonInput" class="code-textarea" placeholder="请输入JSON数据..."
                    @input="onJsonInputChange" @paste="onJsonPaste"></textarea>
                <div v-if="jsonInputError" class="error-message">
                    {{ jsonInputError }}
                </div>
            </div>

            <div class="output-section">
                <div class="section-header">
                    <h3>Postman参数输出</h3>
                    <div class="result-info" v-if="postmanStats">
                        <span class="stat-item">{{ postmanStats.lines }} 行</span>
                        <span class="stat-item">{{ postmanStats.params }} 参数</span>
                    </div>
                </div>

                <div class="output-container">
                    <pre v-if="postmanOutput" class="code-output">{{ postmanOutput }}</pre>
                    <div v-else class="output-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1">
                            <path d="M8 3L4 7l4 4" />
                            <path d="M4 7h16" />
                            <path d="m16 21 4-4-4-4" />
                            <path d="M20 17H4" />
                        </svg>
                        <p>Postman参数将显示在这里</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Postman转JSON模式 -->
        <div v-else class="converter-content">
            <div class="input-section">
                <div class="section-header">
                    <h3>Postman参数输入</h3>
                    <div class="section-actions">
                        <div class="button-group">
                            <button @click="loadPostmanExample(1)" class="group-btn">用户参数</button>
                            <button @click="loadPostmanExample(2)" class="group-btn">商品参数</button>
                            <button @click="validatePostmanInput" class="group-btn">验证</button>
                        </div>
                    </div>
                </div>
                <textarea v-model="postmanInput" class="code-textarea" placeholder="请输入Postman参数格式..."
                    @input="onPostmanInputChange" @paste="onPostmanPaste"></textarea>
                <div v-if="postmanInputError" class="error-message">
                    {{ postmanInputError }}
                </div>
            </div>

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
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useDownload } from '../composables/useDownload'
import { useClipboard } from '../composables/useClipboard'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import cardsConfig from '../config/cards.json'

// 注册语言支持
hljs.registerLanguage('json', json)

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('json-postman-converter')

// 获取卡片标题
const getCardTitle = (cardId: string): string => {
    // 遍历所有分类查找对应的卡片
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === cardId)
        if (card) {
            return card.title
        }
    }
    return cardId
}

const pageTitle = getCardTitle('json-postman-converter')

// 使用下载功能
const { downloadText, downloadJson } = useDownload()

// 使用剪贴板功能
const { copyToClipboard } = useClipboard()

// 使用通知系统
const { success: showSuccess, error: showError } = useNotification()

const mode = ref<'json-to-postman' | 'postman-to-json'>('json-to-postman')

// JSON转Postman相关
const jsonInput = ref('')
const postmanOutput = ref('')
const jsonInputError = ref('')

// Postman转JSON相关
const postmanInput = ref('')
const jsonOutput = ref('')
const postmanInputError = ref('')

const convertTimer = ref<NodeJS.Timeout | undefined>(undefined)

// Postman统计信息
const postmanStats = computed(() => {
    if (!postmanOutput.value) return null
    const lines = postmanOutput.value.split('\n').filter(line => line.trim()).length
    const params = postmanOutput.value.split('\n').filter(line => line.includes('=')).length
    return { lines, params }
})

// JSON统计信息
const jsonStats = computed(() => {
    if (!jsonOutput.value) return null
    const lines = jsonOutput.value.split('\n').length
    const size = jsonOutput.value.length
    return { lines, size }
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
const switchMode = (newMode: 'json-to-postman' | 'postman-to-json') => {
    mode.value = newMode
    clearAll()
}

// JSON转Postman功能
const onJsonInputChange = () => {
    jsonInputError.value = ''

    if (!jsonInput.value.trim()) {
        postmanOutput.value = ''
        return
    }

    // 自动转换（添加防抖）
    clearTimeout(convertTimer.value)
    convertTimer.value = setTimeout(() => {
        convertJsonToPostman(false)
    }, 500)
}

// 粘贴时自动转换
const onJsonPaste = async () => {
    await new Promise(resolve => setTimeout(resolve, 10))

    if (jsonInput.value.trim()) {
        try {
            JSON.parse(jsonInput.value)
            convertJsonToPostman(false)
        } catch {
            // 如果不是有效JSON，不自动转换
        }
    }
}

const convertJsonToPostman = (showSuccessMessage = true) => {
    jsonInputError.value = ''

    if (!jsonInput.value.trim()) {
        if (showSuccessMessage) {
            showError('请先输入JSON数据')
        }
        return
    }

    try {
        const jsonData = JSON.parse(jsonInput.value)
        postmanOutput.value = jsonToPostman(jsonData)
        if (showSuccessMessage) {
            showSuccess('JSON转Postman参数成功')
        }
    } catch (error) {
        jsonInputError.value = `JSON格式错误: ${(error as Error).message}`
        postmanOutput.value = ''
        if (showSuccessMessage) {
            showError('JSON格式错误')
        }
    }
}

// JSON转Postman参数格式
const jsonToPostman = (jsonData: any): string => {
    const convertObject = (obj: any, prefix = ''): string[] => {
        const params: string[] = []

        for (const [key, value] of Object.entries(obj)) {
            const paramKey = prefix ? `${prefix}[${key}]` : key

            if (value === null || value === undefined) {
                params.push(`${paramKey}=`)
            } else if (typeof value === 'object' && !Array.isArray(value)) {
                params.push(...convertObject(value, paramKey))
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (typeof item === 'object') {
                        params.push(...convertObject(item, `${paramKey}[${index}]`))
                    } else {
                        params.push(`${paramKey}[${index}]=${encodeURIComponent(String(item))}`)
                    }
                })
            } else {
                params.push(`${paramKey}=${encodeURIComponent(String(value))}`)
            }
        }

        return params
    }

    if (Array.isArray(jsonData)) {
        const params: string[] = []
        jsonData.forEach((item, index) => {
            if (typeof item === 'object') {
                params.push(...convertObject(item, `[${index}]`))
            } else {
                params.push(`[${index}]=${encodeURIComponent(String(item))}`)
            }
        })
        return params.join('\n')
    } else if (typeof jsonData === 'object') {
        return convertObject(jsonData).join('\n')
    } else {
        return `value=${encodeURIComponent(String(jsonData))}`
    }
}

// Postman转JSON功能
const onPostmanInputChange = () => {
    postmanInputError.value = ''

    if (!postmanInput.value.trim()) {
        jsonOutput.value = ''
        return
    }

    // 自动转换（添加防抖）
    clearTimeout(convertTimer.value)
    convertTimer.value = setTimeout(() => {
        convertPostmanToJson(false)
    }, 500)
}

// 粘贴时自动转换
const onPostmanPaste = async () => {
    await new Promise(resolve => setTimeout(resolve, 10))

    if (postmanInput.value.trim()) {
        convertPostmanToJson(false)
    }
}

const convertPostmanToJson = (showSuccessMessage = true) => {
    postmanInputError.value = ''

    if (!postmanInput.value.trim()) {
        if (showSuccessMessage) {
            showError('请先输入Postman参数')
        }
        return
    }

    try {
        const jsonResult = postmanToJson(postmanInput.value)
        // 始终使用格式化输出
        jsonOutput.value = JSON.stringify(jsonResult, null, 2)
        if (showSuccessMessage) {
            showSuccess('Postman参数转JSON成功')
        }
    } catch (error) {
        postmanInputError.value = `转换失败: ${(error as Error).message}`
        jsonOutput.value = ''
        if (showSuccessMessage) {
            showError('转换失败')
        }
    }
}

// Postman参数格式转JSON
const postmanToJson = (postmanData: string): any => {
    const lines = postmanData.trim().split('\n')
    const result: any = {}

    lines.forEach(line => {
        const trimmedLine = line.trim()
        if (!trimmedLine || !trimmedLine.includes('=')) return

        const [fullKey, ...valueParts] = trimmedLine.split('=')
        if (!fullKey) return

        const value = valueParts.join('=') // 处理值中包含=的情况
        const decodedValue = decodeURIComponent(value || '')

        // 解析嵌套键名
        const keys = fullKey.split(/[\[\]]+/).filter(k => k && k !== '')
        if (keys.length === 0) return

        let current = result
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i]
            const nextKey = keys[i + 1]
            if (!key || !nextKey) continue

            if (!current[key]) {
                // 判断下一个键是否为数字，决定创建对象还是数组
                current[key] = /^\d+$/.test(nextKey) ? [] : {}
            }
            current = current[key]
        }

        const lastKey = keys[keys.length - 1]
        if (!lastKey) return

        // 尝试解析值的类型
        let parsedValue: any = decodedValue
        if (decodedValue === 'true') parsedValue = true
        else if (decodedValue === 'false') parsedValue = false
        else if (decodedValue === 'null') parsedValue = null
        else if (decodedValue === '') parsedValue = null
        else if (/^\d+$/.test(decodedValue)) parsedValue = parseInt(decodedValue)
        else if (/^\d+\.\d+$/.test(decodedValue)) parsedValue = parseFloat(decodedValue)

        if (Array.isArray(current)) {
            const index = parseInt(lastKey)
            current[index] = parsedValue
        } else {
            current[lastKey] = parsedValue
        }
    })

    return result
}

const validatePostmanInput = () => {
    if (!postmanInput.value.trim()) {
        showError('请先输入Postman参数')
        return
    }

    try {
        postmanToJson(postmanInput.value)
        postmanInputError.value = ''
        showSuccess('Postman参数格式正确 ✅')
    } catch (error) {
        postmanInputError.value = `参数格式错误: ${(error as Error).message}`
        showError('参数格式错误 ❌')
    }
}

const formatJsonInput = () => {
    if (!jsonInput.value.trim()) return

    try {
        const parsed = JSON.parse(jsonInput.value)
        jsonInput.value = JSON.stringify(parsed, null, 2)
        convertJsonToPostman(false)
        showSuccess('JSON格式化成功！')
    } catch (error) {
        showError('JSON格式错误，无法格式化')
    }
}



// 复制功能
const copyPostmanResult = async () => {
    if (!postmanOutput.value) {
        showError('没有可复制的内容')
        return
    }

    const success = await copyToClipboard(postmanOutput.value)
    if (success) {
        showSuccess('Postman参数已复制到剪贴板')
    } else {
        showError('复制失败')
    }
}

const copyJsonResult = async () => {
    if (!jsonOutput.value) {
        showError('没有可复制的内容')
        return
    }

    const success = await copyToClipboard(jsonOutput.value)
    if (success) {
        showSuccess('JSON数据已复制到剪贴板')
    } else {
        showError('复制失败')
    }
}

// 下载功能
const downloadPostmanResult = () => {
    if (!postmanOutput.value) {
        showError('没有可下载的内容')
        return
    }

    const success = downloadText(postmanOutput.value, 'postman-params', 'txt')
    if (success) {
        showSuccess('Postman参数文件已下载')
    } else {
        showError('下载失败')
    }
}

const downloadJsonResult = () => {
    if (!jsonOutput.value) {
        showError('没有可下载的内容')
        return
    }

    const success = downloadJson(jsonOutput.value, 'converted-data')
    if (success) {
        showSuccess('JSON文件已下载')
    } else {
        showError('下载失败')
    }
}

// 示例数据
const loadJsonExample = (exampleNumber: number) => {
    const examples = {
        1: {
            name: "用户登录数据",
            data: {
                "username": "admin",
                "password": "123456",
                "remember": true,
                "user_info": {
                    "name": "管理员",
                    "email": "admin@example.com",
                    "roles": ["admin", "user"]
                },
                "settings": {
                    "theme": "dark",
                    "language": "zh-CN",
                    "notifications": {
                        "email": true,
                        "sms": false
                    }
                }
            }
        },
        2: {
            name: "商品数据",
            data: {
                "product_id": 12345,
                "name": "MacBook Pro",
                "price": 12999.99,
                "in_stock": true,
                "categories": ["电脑", "苹果", "笔记本"],
                "specifications": {
                    "cpu": "M3 Pro",
                    "memory": "16GB",
                    "storage": "512GB SSD"
                },
                "reviews": [
                    {
                        "user": "张三",
                        "rating": 5,
                        "comment": "很好用"
                    },
                    {
                        "user": "李四",
                        "rating": 4,
                        "comment": "性价比不错"
                    }
                ]
            }
        }
    }

    const example = examples[exampleNumber as keyof typeof examples]
    if (example) {
        jsonInput.value = JSON.stringify(example.data, null, 2)
        convertJsonToPostman(false)
        showSuccess(`已加载${example.name}示例`)
    }
}

const loadPostmanExample = (exampleNumber: number) => {
    const examples = {
        1: {
            name: "用户登录参数",
            data: `username=admin
password=123456
remember=true
user_info[name]=管理员
user_info[email]=admin@example.com
user_info[roles][0]=admin
user_info[roles][1]=user
settings[theme]=dark
settings[language]=zh-CN
settings[notifications][email]=true
settings[notifications][sms]=false`
        },
        2: {
            name: "商品参数",
            data: `product_id=12345
name=MacBook Pro
price=12999.99
in_stock=true
categories[0]=电脑
categories[1]=苹果
categories[2]=笔记本
specifications[cpu]=M3 Pro
specifications[memory]=16GB
specifications[storage]=512GB SSD
reviews[0][user]=张三
reviews[0][rating]=5
reviews[0][comment]=很好用
reviews[1][user]=李四
reviews[1][rating]=4
reviews[1][comment]=性价比不错`
        }
    }

    const example = examples[exampleNumber as keyof typeof examples]
    if (example) {
        postmanInput.value = example.data
        convertPostmanToJson(false)
        showSuccess(`已加载${example.name}示例`)
    }
}

const clearAll = () => {
    jsonInput.value = ''
    postmanOutput.value = ''
    postmanInput.value = ''
    jsonOutput.value = ''
    jsonInputError.value = ''
    postmanInputError.value = ''
    showSuccess('已清空所有内容')
}
</script>

<style scoped>
/* 保持原有的所有样式，只是移除了 converter-header 部分 */
.postman-json-converter {
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

.converter-content {
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

.postman-json-converter .section-header {
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
    height: 32px;
    flex-wrap: nowrap;
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

@media (max-width: 768px) {
    .converter-content {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }
}
</style>