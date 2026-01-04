<template>
    <div class="json-formatter">
        <div class="formatter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="formatter-title">JSON格式化</h2>
            <div class="formatter-actions">
                <button class="action-btn" @click="clearAll" title="清空">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
                <button class="action-btn" @click="copyResult" title="复制JSON" :disabled="!formattedJson">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2 2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                </button>
                <button class="action-btn" @click="downloadJson" title="下载JSON文件" :disabled="!formattedJson">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7,10 12,15 17,10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="formatter-content">
            <div class="input-section">
                <div class="section-header">
                    <h3>JSON输入</h3>
                    <div class="input-status">
                        <span v-if="isAutoFormatting" class="auto-format-indicator">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 12a9 9 0 11-6.219-8.56" />
                            </svg>
                            自动格式化中...
                        </span>
                        <span v-else-if="inputJson && !inputError" class="format-hint">
                            粘贴内容将自动格式化
                        </span>
                    </div>
                    <div class="section-actions">
                        <div class="button-group">
                            <button class="group-btn example-btn" @click="loadExample(1)">示例1</button>
                            <button class="group-btn example-btn" @click="loadExample(2)">示例2</button>
                            <button class="group-btn format-btn" @click="formatJson">格式化</button>
                            <button class="group-btn validate-btn" @click="validateJson">验证</button>
                            <button class="group-btn minify-btn" @click="minifyJson">压缩</button>
                            <button class="group-btn escape-btn" @click="escapeJson">转义</button>
                            <button class="group-btn unescape-btn" @click="unescapeJson">去转义</button>
                        </div>
                    </div>
                </div>
                <textarea v-model="inputJson" class="json-input"
                    placeholder="请输入或粘贴JSON字符串...&#10;&#10;支持功能：&#10;• 粘贴时自动格式化&#10;• 实时语法验证&#10;• 多种格式转换&#10;• 语法高亮显示"
                    @input="onInputChange" @paste="onPaste"></textarea>
                <div v-if="inputError" class="error-message">
                    {{ inputError }}
                </div>
            </div>

            <div class="output-section">
                <div class="section-header">
                    <h3>格式化结果</h3>
                    <div class="result-info" v-if="jsonStats">
                        <span class="stat-item">{{ jsonStats.lines }} 行</span>
                        <span class="stat-item">{{ jsonStats.size }} 字符</span>
                        <span class="stat-item">{{ jsonStats.keys }} 个键</span>
                        <span class="stat-item" v-if="jsonStats.depth > 1">深度 {{ jsonStats.depth }}</span>
                        <span class="stat-item" :class="jsonStats.complexity">{{ jsonStats.complexityText }}</span>
                    </div>
                </div>
                <div class="json-output-container">
                    <pre v-if="formattedJson" class="json-output" v-html="highlightedJson"></pre>
                    <div v-else class="output-placeholder">
                        <p>格式化后的JSON将显示在这里</p>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'

// 注册JSON语言
hljs.registerLanguage('json', json)

defineEmits<{
    back: []
}>()

const inputJson = ref('')
const formattedJson = ref('')
const inputError = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const isAutoFormatting = ref(false)

// JSON统计信息
const jsonStats = computed(() => {
    if (!formattedJson.value) return null

    const lines = formattedJson.value.split('\n').length
    const size = formattedJson.value.length

    let keys = 0
    let depth = 0
    let complexity = 'simple'
    let complexityText = '简单'

    try {
        const obj = JSON.parse(inputJson.value)
        keys = countKeys(obj)
        depth = getMaxDepth(obj)

        // 判断复杂度
        if (keys > 50 || depth > 5) {
            complexity = 'complex'
            complexityText = '复杂'
        } else if (keys > 20 || depth > 3) {
            complexity = 'medium'
            complexityText = '中等'
        }
    } catch (e) {
        keys = 0
        depth = 0
    }

    return { lines, size, keys, depth, complexity, complexityText }
})

// JSON语法高亮
const highlightedJson = computed(() => {
    if (!formattedJson.value) return ''

    const result = hljs.highlight(formattedJson.value, { language: 'json' })
    return result.value
})

// 递归统计对象中的键数量
const countKeys = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0

    let count = 0
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            count += countKeys(item)
        })
    } else {
        count += Object.keys(obj).length
        Object.values(obj).forEach(value => {
            count += countKeys(value)
        })
    }
    return count
}

// 递归计算对象的最大深度
const getMaxDepth = (obj: any, currentDepth: number = 1): number => {
    if (typeof obj !== 'object' || obj === null) return currentDepth

    let maxDepth = currentDepth

    if (Array.isArray(obj)) {
        obj.forEach(item => {
            const depth = getMaxDepth(item, currentDepth + 1)
            maxDepth = Math.max(maxDepth, depth)
        })
    } else {
        Object.values(obj).forEach(value => {
            const depth = getMaxDepth(value, currentDepth + 1)
            maxDepth = Math.max(maxDepth, depth)
        })
    }

    return maxDepth
}

// 输入变化时的处理
const onInputChange = () => {
    inputError.value = ''
    if (!inputJson.value.trim()) {
        formattedJson.value = ''
        return
    }

    // 自动尝试格式化（延迟执行，避免频繁触发）
    clearTimeout(autoFormatTimer.value)
    autoFormatTimer.value = setTimeout(() => {
        tryAutoFormat()
    }, 500)
}

// 粘贴事件处理
const onPaste = (event: ClipboardEvent) => {
    // 获取粘贴的内容
    const pastedText = event.clipboardData?.getData('text') || ''

    // 延迟执行，等待 v-model 更新
    setTimeout(() => {
        if (pastedText.trim()) {
            tryAutoFormat()
            showMessage('已粘贴内容并自动格式化', 'success')
        }
    }, 50)
}

// 自动格式化定时器
const autoFormatTimer = ref<ReturnType<typeof setTimeout> | undefined>(undefined)

// 尝试自动格式化
const tryAutoFormat = () => {
    if (!inputJson.value.trim()) return

    isAutoFormatting.value = true

    try {
        const parsed = JSON.parse(inputJson.value)
        formattedJson.value = JSON.stringify(parsed, null, 2)
        inputError.value = ''
    } catch (error) {
        // 静默失败，不显示错误信息（用户可能还在输入）
        formattedJson.value = ''
    } finally {
        setTimeout(() => {
            isAutoFormatting.value = false
        }, 300)
    }
}

// 格式化JSON
const formatJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请先输入JSON字符串', 'error')
        return
    }

    try {
        const parsed = JSON.parse(inputJson.value)
        formattedJson.value = JSON.stringify(parsed, null, 2)
        inputError.value = ''
        showMessage('JSON格式化成功', 'success')
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        formattedJson.value = ''
        showMessage('JSON格式错误', 'error')
    }
}

// 验证JSON
const validateJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请先输入JSON字符串', 'error')
        return
    }

    try {
        JSON.parse(inputJson.value)
        inputError.value = ''
        showMessage('JSON格式正确 ✅', 'success')
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        showMessage('JSON格式错误 ❌', 'error')
    }
}

// 压缩JSON
const minifyJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请先输入JSON字符串', 'error')
        return
    }

    try {
        const parsed = JSON.parse(inputJson.value)
        formattedJson.value = JSON.stringify(parsed)
        inputError.value = ''
        showMessage('JSON压缩成功', 'success')
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        formattedJson.value = ''
        showMessage('JSON格式错误', 'error')
    }
}

// 转义JSON
const escapeJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请先输入JSON字符串', 'error')
        return
    }

    try {
        // 先验证JSON格式
        JSON.parse(inputJson.value)

        // 转义JSON字符串
        const escaped = JSON.stringify(inputJson.value)
        formattedJson.value = escaped
        inputError.value = ''
        showMessage('JSON转义成功', 'success')
    } catch (error) {
        // 如果不是有效的JSON，直接转义字符串
        const escaped = JSON.stringify(inputJson.value)
        formattedJson.value = escaped
        inputError.value = ''
        showMessage('字符串转义成功', 'success')
    }
}

// 去转义JSON
const unescapeJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请先输入转义的JSON字符串', 'error')
        return
    }

    try {
        // 尝试解析转义的字符串
        const unescaped = JSON.parse(inputJson.value)

        if (typeof unescaped === 'string') {
            // 如果解析结果是字符串，尝试再次解析为JSON
            try {
                const parsed = JSON.parse(unescaped)
                formattedJson.value = JSON.stringify(parsed, null, 2)
                inputError.value = ''
                showMessage('JSON去转义并格式化成功', 'success')
            } catch {
                // 如果不是JSON，直接显示去转义的字符串
                formattedJson.value = unescaped
                inputError.value = ''
                showMessage('字符串去转义成功', 'success')
            }
        } else {
            // 如果解析结果不是字符串，格式化显示
            formattedJson.value = JSON.stringify(unescaped, null, 2)
            inputError.value = ''
            showMessage('JSON去转义成功', 'success')
        }
    } catch (error) {
        inputError.value = `去转义失败: ${(error as Error).message}`
        formattedJson.value = ''
        showMessage('去转义失败', 'error')
    }
}

// 清空所有内容
const clearAll = () => {
    inputJson.value = ''
    formattedJson.value = ''
    inputError.value = ''
    showMessage('已清空', 'success')
}

// 复制结果
const copyResult = async () => {
    if (!formattedJson.value) return

    try {
        await navigator.clipboard.writeText(formattedJson.value)
        showMessage('已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 下载JSON文件
const downloadJson = () => {
    if (!formattedJson.value) return

    try {
        const blob = new Blob([formattedJson.value], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        link.download = `json-${timestamp}.json`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        showMessage('JSON文件已下载', 'success')
    } catch (error) {
        showMessage('下载失败', 'error')
    }
}

// 加载示例数据
const loadExample = (exampleNumber: number) => {
    const examples = {
        1: {
            name: "用户信息",
            data: {
                "id": 1001,
                "name": "张三",
                "email": "zhangsan@example.com",
                "age": 28,
                "isActive": true,
                "address": {
                    "street": "中山路123号",
                    "city": "北京",
                    "zipCode": "100000",
                    "country": "中国"
                },
                "hobbies": ["阅读", "游泳", "编程"],
                "profile": {
                    "avatar": "https://example.com/avatar.jpg",
                    "bio": "热爱技术的软件工程师"
                }
            }
        },
        2: {
            name: "商品列表",
            data: {
                "products": [
                    {
                        "id": "P001",
                        "name": "MacBook Pro",
                        "category": "电脑",
                        "price": 12999.00,
                        "inStock": true,
                        "specifications": {
                            "processor": "M3 Pro",
                            "memory": "16GB",
                            "storage": "512GB SSD"
                        }
                    },
                    {
                        "id": "P002",
                        "name": "iPhone 15 Pro",
                        "category": "手机",
                        "price": 7999.00,
                        "inStock": false,
                        "specifications": {
                            "processor": "A17 Pro",
                            "memory": "128GB"
                        }
                    }
                ]
            }
        }
    }

    const example = examples[exampleNumber as keyof typeof examples]
    if (example) {
        inputJson.value = JSON.stringify(example.data)
        formattedJson.value = JSON.stringify(example.data, null, 2)
        inputError.value = ''
        showMessage(`已加载${example.name}示例数据`, 'success')
    }
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error') => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 页面标题管理
onMounted(() => {
    setPageTitle('json-formatter')
})

onUnmounted(() => {
    restoreDefaultTitle()
})
</script>

<style scoped>
.json-formatter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.formatter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 14px;
}

.back-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.formatter-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.formatter-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    width: 36px;
    height: 36px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.action-btn:hover:not(:disabled) {
    background: var(--border-color);
    color: var(--text-primary);
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.formatter-content {
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
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    min-height: 72px;
    box-sizing: border-box;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.input-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}

.auto-format-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--primary-color);
    font-weight: 500;
}

.auto-format-indicator svg {
    animation: spin 1s linear infinite;
}

.format-hint {
    color: var(--text-muted);
    font-style: italic;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.section-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.divider {
    width: 1px;
    height: 20px;
    background: var(--border-color);
    margin: 0 4px;
}

.format-btn,
.validate-btn,
.minify-btn {
    padding: 6px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
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
}

.group-btn:first-child {
    border-top-left-radius: var(--radius-sm);
    border-bottom-left-radius: var(--radius-sm);
}

.group-btn:last-child {
    border-top-right-radius: var(--radius-sm);
    border-bottom-right-radius: var(--radius-sm);
}

.group-btn:last-child {
    border-right: none;
}

.group-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.group-btn:active {
    background: var(--bg-tertiary);
}



.json-input {
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

.json-input::placeholder {
    color: var(--text-muted);
}

.error-message {
    padding: 12px 20px;
    background: rgba(239, 68, 68, 0.1);
    border-top: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    font-size: 14px;
}

.json-output-container {
    flex: 1;
    overflow: auto;
}

.json-output {
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
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted);
    text-align: center;
}

.result-info {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: var(--text-muted);
}

.stat-item {
    padding: 2px 6px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
}

.stat-item.simple {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
}

.stat-item.medium {
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
}

.stat-item.complex {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.message-toast {
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

.message-toast.success {
    background: #10b981;
    color: white;
}

.message-toast.error {
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

@media (max-width: 768px) {
    .formatter-content {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }
}
</style>