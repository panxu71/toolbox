<template>
    <div class="json-formatter">
        <!-- 使用通用头部组件 -->
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空" @click="clearAll" />
                <HeaderActionButton icon="copy" tooltip="复制JSON" :disabled="!formattedJson" @click="copyResult" />
                <HeaderActionButton icon="download" tooltip="下载JSON文件" :disabled="!formattedJson"
                    @click="downloadJsonFile" />
            </template>
        </PageHeader>

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
                    <div class="result-controls">
                        <div class="view-mode-toggle">
                            <button class="mode-btn" :class="{ active: viewMode === 'tree' }"
                                @click="viewMode = 'tree'">
                                树视图
                            </button>
                            <button class="mode-btn" :class="{ active: viewMode === 'text' }"
                                @click="viewMode = 'text'">
                                文本
                            </button>
                        </div>
                        <div class="result-info" v-if="jsonStats">
                            <span class="stat-item">{{ jsonStats.lines }} 行</span>
                            <span class="stat-item">{{ jsonStats.size }} 字符</span>
                            <span class="stat-item">{{ jsonStats.keys }} 个键</span>
                            <span class="stat-item" v-if="jsonStats.depth > 1">深度 {{ jsonStats.depth }}</span>
                            <span class="stat-item" :class="jsonStats.complexity">{{ jsonStats.complexityText }}</span>
                        </div>
                    </div>
                </div>
                <div class="json-output-container">
                    <div v-if="formattedJson || parsedJsonForTree" class="json-output-wrapper">
                        <div class="line-numbers">
                            <div v-for="(_, index) in visibleLines" :key="index" class="line-number">
                                {{ index + 1 }}
                            </div>
                        </div>

                        <!-- 树视图 -->
                        <div v-if="viewMode === 'tree' && parsedJsonForTree" class="json-tree-container">
                            <JsonTreeNode :data="parsedJsonForTree" :level="0" @toggle="updateVisibleLines"
                                @copy="handleNodeCopy" @delete="handleNodeDelete" />
                        </div>

                        <!-- 文本视图 -->
                        <div v-else-if="viewMode === 'text' && formattedJson" class="json-output"
                            v-html="highlightedJson" />
                    </div>
                    <div v-else class="output-placeholder">
                        <p>格式化后的JSON将显示在这里</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 保持原有的消息提示样式 -->
        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useDownload } from '../composables/useDownload'
import { useClipboard } from '../composables/useClipboard'
import { useMessage } from '../composables/useMessage'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import JsonTreeNode from './common/JsonTreeNode.vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import cardsConfig from '../config/cards.json'

// 注册JSON语言
hljs.registerLanguage('json', json)

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('json-format')

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

const pageTitle = getCardTitle('json-format')

// 使用下载功能
const { downloadJson } = useDownload()

// 使用剪贴板功能
const { copyToClipboard } = useClipboard()

// 使用消息提示
const { message, messageType, showMessage } = useMessage()

const inputJson = ref('')
const formattedJson = ref('')
const inputError = ref('')
const isAutoFormatting = ref(false)
const viewMode = ref<'tree' | 'text'>('tree') // 新增：视图模式切换

// JSON统计信息
const jsonStats = computed(() => {
    if (!formattedJson.value || typeof formattedJson.value !== 'string') return null

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
    if (!formattedJson.value || typeof formattedJson.value !== 'string') return ''

    const result = hljs.highlight(formattedJson.value, { language: 'json' })
    return result.value
})

// 格式化后的JSON行数组
const formattedJsonLines = computed(() => {
    if (!formattedJson.value || typeof formattedJson.value !== 'string') return []
    return formattedJson.value.split('\n')
})

// 解析后的JSON对象（用于树视图）
const parsedJsonForTree = computed(() => {
    if (!inputJson.value.trim()) return null
    try {
        return JSON.parse(inputJson.value)
    } catch {
        return null
    }
})

// 可见行数（用于行号显示）
const visibleLines = computed(() => {
    if (viewMode.value === 'text') {
        return formattedJsonLines.value
    } else {
        // 树视图模式下，行数由树节点动态计算
        return Array.from({ length: calculateTreeLines() }, (_, i) => i)
    }
})

// 计算树视图的行数
const calculateTreeLines = (): number => {
    // 这里简化处理，实际应该根据展开状态计算
    if (!parsedJsonForTree.value) return 0
    return JSON.stringify(parsedJsonForTree.value, null, 2).split('\n').length
}

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
}

// 粘贴时自动格式化
const onPaste = async () => {
    await new Promise(resolve => setTimeout(resolve, 10))

    if (inputJson.value.trim()) {
        isAutoFormatting.value = true
        try {
            formatJson()
        } finally {
            isAutoFormatting.value = false
        }
    }
}

// 显示消息（保持原有样式）
// 现在使用 useMessage composable，不需要重复定义

// 更新可见行数（树视图折叠时调用）
const updateVisibleLines = () => {
    // 这里可以添加更复杂的行数计算逻辑
    // 暂时简化处理
}

// 处理节点复制
const handleNodeCopy = async (nodeInfo: { key: string | number | null, value: any, path: string }) => {
    try {
        let textToCopy: string

        if (nodeInfo.key !== null) {
            // 有键名的情况，复制完整的键值对
            if (typeof nodeInfo.value === 'object') {
                // 对象或数组，创建包含键名的完整结构
                const keyValuePair = { [nodeInfo.key]: nodeInfo.value }
                textToCopy = JSON.stringify(keyValuePair, null, 2)
            } else {
                // 基本类型，创建键值对格式
                const keyValuePair = { [nodeInfo.key]: nodeInfo.value }
                textToCopy = JSON.stringify(keyValuePair, null, 2)
            }
        } else {
            // 根节点或无键名的情况，只复制值
            if (typeof nodeInfo.value === 'object') {
                textToCopy = JSON.stringify(nodeInfo.value, null, 2)
            } else {
                textToCopy = String(nodeInfo.value)
            }
        }

        const success = await copyToClipboard(textToCopy)
        if (success) {
            const copyType = nodeInfo.key !== null ? '键值对' : (typeof nodeInfo.value === 'object' ? '节点' : '值')
            showMessage(`已复制${copyType}到剪贴板`, 'success')
        } else {
            showMessage('复制失败', 'error')
        }
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 处理节点删除
const handleNodeDelete = (nodeInfo: { key: string | number | null, path: string }) => {
    try {
        if (!parsedJsonForTree.value) return

        // 创建新的 JSON 对象，删除指定节点
        const newJsonData = JSON.parse(JSON.stringify(parsedJsonForTree.value))

        // 如果是根级删除且只有一个根属性，清空整个JSON
        if (nodeInfo.key !== null) {
            if (Array.isArray(newJsonData)) {
                const index = parseInt(nodeInfo.key.toString())
                if (!isNaN(index) && index >= 0 && index < newJsonData.length) {
                    newJsonData.splice(index, 1)
                }
            } else if (typeof newJsonData === 'object') {
                delete newJsonData[nodeInfo.key]
            }
        } else {
            // 如果删除的是根节点本身，清空所有内容
            clearAll()
            return
        }

        // 更新输入和输出
        const newJsonString = JSON.stringify(newJsonData, null, 2)
        inputJson.value = newJsonString
        formattedJson.value = newJsonString

        showMessage('节点已删除', 'success')
    } catch (error) {
        showMessage('删除失败', 'error')
    }
}

// 清空所有内容
const clearAll = () => {
    inputJson.value = ''
    formattedJson.value = ''
    inputError.value = ''
    showMessage('已清空所有内容', 'success')
}

// 复制结果
const copyResult = async () => {
    if (!formattedJson.value) return

    const success = await copyToClipboard(formattedJson.value)
    if (success) {
        showMessage('已复制到剪贴板', 'success')
    } else {
        showMessage('复制失败', 'error')
    }
}

// 下载JSON文件
const downloadJsonFile = () => {
    if (!formattedJson.value) return

    const success = downloadJson(formattedJson.value, 'json')
    if (success) {
        showMessage('JSON文件已下载', 'success')
    } else {
        showMessage('下载失败', 'error')
    }
}

// 格式化JSON
const formatJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请输入JSON内容', 'error')
        return
    }

    try {
        const parsed = JSON.parse(inputJson.value)
        formattedJson.value = JSON.stringify(parsed, null, 2)
        inputError.value = ''
        showMessage('格式化成功', 'success')
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        showMessage('格式化失败', 'error')
    }
}

// 验证JSON
const validateJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请输入JSON内容', 'error')
        return
    }

    try {
        JSON.parse(inputJson.value)
        inputError.value = ''
        showMessage('JSON格式正确', 'success')
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        showMessage('JSON格式错误', 'error')
    }
}

// 压缩JSON
const minifyJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请输入JSON内容', 'error')
        return
    }

    try {
        const parsed = JSON.parse(inputJson.value)
        formattedJson.value = JSON.stringify(parsed)
        inputError.value = ''
        showMessage('压缩成功', 'success')
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        showMessage('压缩失败', 'error')
    }
}

// 转义JSON
const escapeJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请输入JSON内容', 'error')
        return
    }

    formattedJson.value = JSON.stringify(inputJson.value)
    showMessage('转义成功', 'success')
}

// 去转义JSON
const unescapeJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请输入JSON内容', 'error')
        return
    }

    try {
        // 尝试解析输入的内容
        const unescaped = JSON.parse(inputJson.value)

        // 如果解析成功，将结果格式化为字符串
        if (typeof unescaped === 'string') {
            // 如果解析结果是字符串，尝试再次解析为JSON对象并格式化
            try {
                const parsed = JSON.parse(unescaped)
                formattedJson.value = JSON.stringify(parsed, null, 2)
                showMessage('去转义并格式化成功', 'success')
            } catch {
                // 如果不是有效的JSON，直接显示去转义的字符串
                formattedJson.value = unescaped
                showMessage('去转义成功', 'success')
            }
        } else {
            // 如果解析结果不是字符串，格式化为JSON字符串
            formattedJson.value = JSON.stringify(unescaped, null, 2)
            showMessage('去转义成功', 'success')
        }

        inputError.value = ''
    } catch (error) {
        // 如果输入的内容不是有效的转义JSON，检查是否是普通JSON
        try {
            JSON.parse(inputJson.value)
            showMessage('输入内容已经是有效的JSON，无需去转义', 'error')
        } catch {
            inputError.value = `去转义失败: ${(error as Error).message}`
            showMessage('去转义失败，请检查输入格式', 'error')
        }
    }
}

// 加载示例
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
</script>

<style scoped>
/* 保持原有的所有样式，只是移除了 formatter-header 部分 */
.json-formatter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
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

.result-controls {
    display: flex;
    align-items: center;
    gap: 16px;
}

.view-mode-toggle {
    display: flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
}

.mode-btn {
    padding: 4px 12px;
    background: var(--bg-primary);
    border: none;
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: var(--transition);
}

.mode-btn:first-child {
    border-right: 1px solid var(--border-color);
}

.mode-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.mode-btn.active {
    background: var(--primary-color);
    color: white;
}

.result-info {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: var(--text-muted);
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

.json-output-wrapper {
    display: flex;
    height: 100%;
}

.line-numbers {
    background: var(--bg-tertiary);
    border-right: 1px solid var(--border-color);
    padding: 20px 8px 20px 12px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-muted);
    user-select: none;
    min-width: 40px;
    text-align: right;
}

.line-number {
    height: 21px;
    /* 匹配代码行高 */
}

.json-tree-container {
    flex: 1;
    padding: 20px;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: auto;
}

.json-output {
    flex: 1;
    width: 100%;
    padding: 20px;
    margin: 0;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-all;
    overflow: auto;
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
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* JSON语法高亮 */
:deep(.hljs-attr) {
    color: #0969da;
}

:deep(.hljs-string) {
    color: #032f62;
}

:deep(.hljs-number) {
    color: #0550ae;
}

:deep(.hljs-literal) {
    color: #8250df;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .formatter-content {
        grid-template-columns: 1fr;
    }

    .button-group {
        flex-wrap: wrap;
    }
}
</style>