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
                        <!-- <span v-else-if="inputJson && !inputError" class="format-hint">
                            粘贴内容将自动格式化
                        </span> -->
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
                        <!-- 树视图 -->
                        <div v-if="viewMode === 'tree' && parsedJsonForTree" class="json-tree-view">
                            <div class="line-numbers">
                                <div v-for="(_, index) in visibleLines" :key="index" class="line-number">
                                    {{ index + 1 }}
                                </div>
                            </div>
                            <div class="json-tree-container">
                                <JsonTreeNode :data="parsedJsonForTree" :level="0" @toggle="updateVisibleLines"
                                    @copy="handleNodeCopy" @delete="handleNodeDelete" />
                            </div>
                        </div>

                        <!-- 文本视图 -->
                        <div v-else-if="viewMode === 'text' && formattedJson" class="json-text-view">
                            <CodeViewer 
                                :code="formattedJson"
                                language="json"
                                :show-line-numbers="true"
                                :show-fullscreen-button="true"
                                :is-fullscreen="isFullscreen"
                                @toggle-fullscreen="toggleFullscreen"
                            />
                        </div>
                    </div>
                    <div v-else class="output-placeholder">
                        <p>格式化后的JSON将显示在这里</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useDownload } from '../composables/useDownload'
import { useClipboard } from '../composables/useClipboard'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import JsonTreeNode from './common/JsonTreeNode.vue'
import CodeViewer from './common/CodeViewer.vue'
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

// 使用公共通知系统
const { success: showSuccess, error: showError } = useNotification()

const inputJson = ref('')
const formattedJson = ref('')
const inputError = ref('')
const isAutoFormatting = ref(false)
const isFullscreen = ref(false)
const viewMode = ref<'tree' | 'text'>('text') // 默认使用文本视图，这样更容易看到行号同步效果

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
        // 树视图模式下，使用格式化后的JSON行数
        return formattedJsonLines.value
    }
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
            showSuccess(`已复制${copyType}到剪贴板`)
        } else {
            showError('复制失败')
        }
    } catch (error) {
        showError('复制失败')
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

        // 强制触发重新渲染
        nextTick(() => {
            updateVisibleLines()
        })

        showSuccess('节点已删除')
    } catch (error) {
        console.error('删除节点失败:', error)
        showError('删除失败')
    }
}

// 清空所有内容
const clearAll = () => {
    inputJson.value = ''
    formattedJson.value = ''
    inputError.value = ''
    showSuccess('已清空所有内容')
}

// 全屏功能
const toggleFullscreen = async () => {
    try {
        const outputSection = document.querySelector('.output-section')
        if (!outputSection) return
        
        if (!document.fullscreenElement) {
            // 进入全屏
            await outputSection.requestFullscreen()
            isFullscreen.value = true
        } else {
            // 退出全屏
            await document.exitFullscreen()
            isFullscreen.value = false
        }
    } catch (error) {
        console.error('全屏操作失败:', error)
        showError('全屏功能不支持或被阻止')
    }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
}

// 复制结果
const copyResult = async () => {
    if (!formattedJson.value) return

    const success = await copyToClipboard(formattedJson.value)
    if (success) {
        showSuccess('已复制到剪贴板')
    } else {
        showError('复制失败')
    }
}

// 下载JSON文件
const downloadJsonFile = () => {
    if (!formattedJson.value) return

    const success = downloadJson(formattedJson.value, 'json')
    if (success) {
        showSuccess('JSON文件已下载')
    } else {
        showError('下载失败')
    }
}

// 尝试修复常见的JSON格式问题
const tryFixJsonFormat = (jsonString: string): string => {
    try {
        // 先尝试直接解析
        JSON.parse(jsonString)
        return jsonString
    } catch {
        // 如果解析失败，尝试修复常见问题
        let fixed = jsonString.trim()
        
        // 1. 修复属性名没有引号的问题
        // 匹配 {word: 或 ,word: 的模式，给word加上双引号
        fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
        
        // 2. 修复单引号为双引号
        fixed = fixed.replace(/'/g, '"')
        
        // 3. 尝试解析修复后的字符串
        try {
            JSON.parse(fixed)
            return fixed
        } catch {
            // 如果还是失败，返回原字符串
            return jsonString
        }
    }
}
const formatJson = () => {
    if (!inputJson.value.trim()) {
        showError('请输入JSON内容')
        return
    }

    try {
        // 尝试修复常见的JSON格式问题
        const fixedJson = tryFixJsonFormat(inputJson.value)
        
        // 如果修复后的JSON与原始不同，更新输入框
        if (fixedJson !== inputJson.value) {
            inputJson.value = fixedJson
            showSuccess('已自动修复JSON格式问题')
        }
        
        const parsed = JSON.parse(fixedJson)
        formattedJson.value = JSON.stringify(parsed, null, 2)
        inputError.value = ''
        showSuccess('格式化成功')
        
        // 设置滚动同步
        setupScrollSync()
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        showError('格式化失败')
    }
}

// 验证JSON
const validateJson = () => {
    if (!inputJson.value.trim()) {
        showError('请输入JSON内容')
        return
    }

    try {
        // 尝试修复常见的JSON格式问题
        const fixedJson = tryFixJsonFormat(inputJson.value)
        
        // 如果修复后的JSON与原始不同，更新输入框并提示
        if (fixedJson !== inputJson.value) {
            inputJson.value = fixedJson
            showSuccess('已自动修复JSON格式问题，格式正确')
        } else {
            showSuccess('JSON格式正确')
        }
        
        inputError.value = ''
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        showError('JSON格式错误')
    }
}

// 压缩JSON
const minifyJson = () => {
    if (!inputJson.value.trim()) {
        showError('请输入JSON内容')
        return
    }

    try {
        // 尝试修复常见的JSON格式问题
        const fixedJson = tryFixJsonFormat(inputJson.value)
        
        // 如果修复后的JSON与原始不同，更新输入框
        if (fixedJson !== inputJson.value) {
            inputJson.value = fixedJson
            showSuccess('已自动修复JSON格式问题')
        }
        
        const parsed = JSON.parse(fixedJson)
        formattedJson.value = JSON.stringify(parsed)
        inputError.value = ''
        showSuccess('压缩成功')
        
        // 设置滚动同步
        setupScrollSync()
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        showError('压缩失败')
    }
}

// 转义JSON
const escapeJson = () => {
    if (!inputJson.value.trim()) {
        showError('请输入JSON内容')
        return
    }

    formattedJson.value = JSON.stringify(inputJson.value)
    showSuccess('转义成功')
}

// 去转义JSON
const unescapeJson = () => {
    if (!inputJson.value.trim()) {
        showError('请输入JSON内容')
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
                showSuccess('去转义并格式化成功')
            } catch {
                // 如果不是有效的JSON，直接显示去转义的字符串
                formattedJson.value = unescaped
                showSuccess('去转义成功')
            }
        } else {
            // 如果解析结果不是字符串，格式化为JSON字符串
            formattedJson.value = JSON.stringify(unescaped, null, 2)
            showSuccess('去转义成功')
        }

        inputError.value = ''
    } catch (error) {
        // 如果输入的内容不是有效的转义JSON，检查是否是普通JSON
        try {
            JSON.parse(inputJson.value)
            showError('输入内容已经是有效的JSON，无需去转义')
        } catch {
            inputError.value = `去转义失败: ${(error as Error).message}`
            showError('去转义失败，请检查输入格式')
        }
    }
}

// 加载示例
const loadExample = (exampleNumber: number) => {
    const examples = {
        1: {"message":"success感谢又拍云(upyun.com)提供CDN赞助","status":200,"date":"20260203","time":"2026-02-03 21:17:55","cityInfo":{"city":"天津市","citykey":"101030100","parent":"天津","updateTime":"19:06"},"data":{"shidu":"46%","pm25":122.0,"pm10":175.0,"quality":"中度","wendu":"3.3","ganmao":"儿童、老年人及心脏、呼吸系统疾病患者人群应减少长时间或高强度户外锻炼，一般人群适量减少户外运动","forecast":[{"date":"03","high":"高温 10℃","low":"低温 -3℃","ymd":"2026-02-03","week":"星期二","sunrise":"07:16","sunset":"17:33","aqi":187,"fx":"西南风","fl":"2级","type":"霾","notice":"雾霾来袭，戴好口罩再出门"},{"date":"04","high":"高温 10℃","low":"低温 -1℃","ymd":"2026-02-04","week":"星期三","sunrise":"07:15","sunset":"17:35","aqi":191,"fx":"西北风","fl":"1级","type":"霾","notice":"雾霾来袭，戴好口罩再出门"},{"date":"05","high":"高温 4℃","low":"低温 -2℃","ymd":"2026-02-05","week":"星期四","sunrise":"07:14","sunset":"17:36","aqi":93,"fx":"东南风","fl":"2级","type":"多云","notice":"阴晴之间，谨防紫外线侵扰"},{"date":"06","high":"高温 0℃","low":"低温 -5℃","ymd":"2026-02-06","week":"星期五","sunrise":"07:13","sunset":"17:37","aqi":37,"fx":"北风","fl":"2级","type":"阴","notice":"不要被阴云遮挡住好心情"},{"date":"07","high":"高温 2℃","low":"低温 -8℃","ymd":"2026-02-07","week":"星期六","sunrise":"07:12","sunset":"17:38","aqi":38,"fx":"西南风","fl":"2级","type":"多云","notice":"阴晴之间，谨防紫外线侵扰"},{"date":"08","high":"高温 4℃","low":"低温 -6℃","ymd":"2026-02-08","week":"星期日","sunrise":"07:10","sunset":"17:39","aqi":40,"fx":"东南风","fl":"2级","type":"晴","notice":"愿你拥有比阳光明媚的心情"},{"date":"09","high":"高温 4℃","low":"低温 -5℃","ymd":"2026-02-09","week":"星期一","sunrise":"07:09","sunset":"17:40","aqi":106,"fx":"东南风","fl":"2级","type":"霾","notice":"雾霾来袭，戴好口罩再出门"},{"date":"10","high":"高温 7℃","low":"低温 -2℃","ymd":"2026-02-10","week":"星期二","sunrise":"07:08","sunset":"17:42","aqi":133,"fx":"南风","fl":"2级","type":"霾","notice":"雾霾来袭，戴好口罩再出门"},{"date":"11","high":"高温 9℃","low":"低温 -2℃","ymd":"2026-02-11","week":"星期三","sunrise":"07:07","sunset":"17:43","aqi":55,"fx":"西北风","fl":"2级","type":"晴","notice":"愿你拥有比阳光明媚的心情"},{"date":"12","high":"高温 9℃","low":"低温 -1℃","ymd":"2026-02-12","week":"星期四","sunrise":"07:06","sunset":"17:44","aqi":92,"fx":"东南风","fl":"2级","type":"晴","notice":"愿你拥有比阳光明媚的心情"},{"date":"13","high":"高温 8℃","low":"低温 0℃","ymd":"2026-02-13","week":"星期五","sunrise":"07:05","sunset":"17:45","aqi":96,"fx":"东北风","fl":"3级","type":"晴","notice":"愿你拥有比阳光明媚的心情"},{"date":"14","high":"高温 9℃","low":"低温 -1℃","ymd":"2026-02-14","week":"星期六","sunrise":"07:04","sunset":"17:46","aqi":71,"fx":"北风","fl":"3级","type":"晴","notice":"愿你拥有比阳光明媚的心情"},{"date":"15","high":"高温 6℃","low":"低温 -1℃","ymd":"2026-02-15","week":"星期日","sunrise":"07:02","sunset":"17:47","aqi":39,"fx":"西北风","fl":"3级","type":"晴","notice":"愿你拥有比阳光明媚的心情"},{"date":"16","high":"高温 9℃","low":"低温 0℃","ymd":"2026-02-16","week":"星期一","sunrise":"07:01","sunset":"17:48","aqi":71,"fx":"南风","fl":"2级","type":"多云","notice":"阴晴之间，谨防紫外线侵扰"},{"date":"17","high":"高温 8℃","low":"低温 4℃","ymd":"2026-02-17","week":"星期二","sunrise":"07:00","sunset":"17:49","aqi":33,"fx":"东南风","fl":"2级","type":"阴","notice":"不要被阴云遮挡住好心情"}],"yesterday":{"date":"02","high":"高温 5℃","low":"低温 -4℃","ymd":"2026-02-02","week":"星期一","sunrise":"07:16","sunset":"17:32","aqi":60,"fx":"西北风","fl":"2级","type":"晴","notice":"愿你拥有比阳光明媚的心情"}}},
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
        showSuccess(`已加载${example.name}示例数据`)
        
        // 设置滚动同步
        setupScrollSync()
    }
}

// 设置滚动同步
const setupScrollSync = () => {
    // 等待DOM更新完成
    nextTick(() => {
        // 文本视图的滚动同步
        const textView = document.querySelector('.json-text-view')
        if (textView) {
            const lineNumbers = textView.querySelector('.line-numbers')
            const jsonOutput = textView.querySelector('.json-output')
            
            if (lineNumbers && jsonOutput) {
                // 移除之前的事件监听器（如果存在）
                const existingHandler = (jsonOutput as any)._scrollHandler
                if (existingHandler) {
                    jsonOutput.removeEventListener('scroll', existingHandler)
                }
                
                // 创建新的滚动处理函数
                const handleTextScroll = () => {
                    if (lineNumbers && jsonOutput) {
                        lineNumbers.scrollTop = jsonOutput.scrollTop
                    }
                }
                
                // 保存处理函数引用，便于后续移除
                ;(jsonOutput as any)._scrollHandler = handleTextScroll
                
                // 添加滚动事件监听器
                jsonOutput.addEventListener('scroll', handleTextScroll)
            }
        }
        
        // 树视图的滚动同步
        const treeView = document.querySelector('.json-tree-view')
        if (treeView) {
            const lineNumbers = treeView.querySelector('.line-numbers')
            const treeContainer = treeView.querySelector('.json-tree-container')
            
            if (lineNumbers && treeContainer) {
                // 移除之前的事件监听器（如果存在）
                const existingHandler = (treeContainer as any)._scrollHandler
                if (existingHandler) {
                    treeContainer.removeEventListener('scroll', existingHandler)
                }
                
                // 创建新的滚动处理函数
                const handleTreeScroll = () => {
                    if (lineNumbers && treeContainer) {
                        lineNumbers.scrollTop = treeContainer.scrollTop
                    }
                }
                
                // 保存处理函数引用，便于后续移除
                ;(treeContainer as any)._scrollHandler = handleTreeScroll
                
                // 添加滚动事件监听器
                treeContainer.addEventListener('scroll', handleTreeScroll)
            }
        }
    })
}

// 组件挂载后设置滚动同步
onMounted(() => {
    setupScrollSync()
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', handleFullscreenChange)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

// 监听视图模式变化，重新设置滚动同步
watch(viewMode, () => {
    setupScrollSync()
})
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
    grid-template-columns: 45fr 55fr;
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
    flex-direction: column;
    height: 100%;
}

.json-tree-view {
    display: flex;
    height: 100%;
    overflow: hidden;
}

.json-text-view {
    position: relative;
    display: flex;
    height: 100%;
    overflow: hidden;
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
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;
    /* 确保行号容器可以滚动 */
    max-height: 100%;
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

/* 全屏模式样式 */
.output-section:fullscreen {
    background: var(--bg-primary);
    padding: 0;
    display: flex;
    flex-direction: column;
}

.output-section:fullscreen .section-header {
    display: none;
}

.output-section:fullscreen .json-output-container {
    flex: 1;
    height: 100vh;
}

.output-section:fullscreen .json-text-view {
    height: 100%;
}
</style>