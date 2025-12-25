<template>
    <div class="chinese-converter">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">简繁体转换</h2>
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
            <!-- 转换模式选择 -->
            <div class="mode-section">
                <div class="mode-tabs">
                    <button class="mode-tab" :class="{ active: conversionMode === 'toTraditional' }"
                        @click="setMode('toTraditional')">
                        <span class="mode-icon">简</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <polyline points="9,18 15,12 9,6" />
                        </svg>
                        <span class="mode-icon">繁</span>
                        <span class="mode-text">简转繁</span>
                    </button>
                    <button class="mode-tab" :class="{ active: conversionMode === 'toSimplified' }"
                        @click="setMode('toSimplified')">
                        <span class="mode-icon">繁</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <polyline points="9,18 15,12 9,6" />
                        </svg>
                        <span class="mode-icon">简</span>
                        <span class="mode-text">繁转简</span>
                    </button>
                    <button class="mode-tab" :class="{ active: conversionMode === 'auto' }" @click="setMode('auto')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                        </svg>
                        <span class="mode-text">智能转换</span>
                    </button>
                </div>

                <!-- 繁体标准选择 -->
                <div v-if="conversionMode === 'toTraditional' || conversionMode === 'auto'" class="standard-selection">
                    <span class="standard-label">繁体标准：</span>
                    <div class="standard-tabs">
                        <button class="standard-tab" :class="{ active: traditionalStandard === 'tw' }"
                            @click="setTraditionalStandard('tw')">
                            台湾标准
                        </button>
                        <button class="standard-tab" :class="{ active: traditionalStandard === 'hk' }"
                            @click="setTraditionalStandard('hk')">
                            香港标准
                        </button>
                    </div>
                </div>
            </div>

            <!-- 转换区域 -->
            <div class="convert-section">
                <div class="input-panel">
                    <div class="panel-header">
                        <div class="panel-title-info">
                            <h3>{{ getInputTitle() }}</h3>
                            <div class="panel-info">
                                <span class="char-count" v-if="inputText">{{ inputText.length }} 字符</span>
                                <span class="chinese-count" v-if="chineseCharCount > 0">{{ chineseCharCount }} 个中文字符</span>
                            </div>
                        </div>
                        <div class="panel-actions">
                            <button class="action-btn-small" @click="pasteText" title="粘贴">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                    <path
                                        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="loadSample" title="示例">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14,2 14,8 20,8" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="clearInput" title="清空">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="inputText" class="text-input" :placeholder="getInputPlaceholder()"
                            @input="handleConvert"></textarea>
                    </div>
                </div>

                <div class="output-panel">
                    <div class="panel-header">
                        <div class="panel-title-info">
                            <h3>{{ getOutputTitle() }}</h3>
                            <div class="panel-info">
                                <span class="conversion-count" v-if="conversionCount > 0">
                                    转换了 {{ conversionCount }} 个字符
                                </span>
                                <span class="no-conversion" v-else-if="inputText && outputText">
                                    无需转换
                                </span>
                            </div>
                        </div>
                        <div class="panel-actions">
                            <button class="action-btn-small" @click="copyOutput" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="downloadResult" title="下载">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7,10 12,15 17,10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                            <button class="action-btn-small primary" @click="swapText" title="交换文本">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M8 3L4 7l4 4" />
                                    <path d="M4 7h16" />
                                    <path d="M16 21l4-4-4-4" />
                                    <path d="M20 17H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="outputText" class="text-output" placeholder="转换结果将显示在这里..."
                            readonly></textarea>
                    </div>
                </div>
            </div>

            <!-- 转换详情 -->
            <div v-if="conversionDetails.length > 0" class="details-section">
                <div class="section-header">
                    <h3>转换详情</h3>
                    <span class="details-count">共 {{ conversionDetails.length }} 个字符被转换</span>
                </div>
                <div class="details-list">
                    <div v-for="(detail, index) in conversionDetails.slice(0, 20)" :key="index" class="detail-item">
                        <span class="original-char">{{ detail.original }}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <polyline points="9,18 15,12 9,6" />
                        </svg>
                        <span class="converted-char">{{ detail.converted }}</span>
                        <span class="char-count">{{ detail.count }}次</span>
                    </div>
                </div>
                <div v-if="conversionDetails.length > 20" class="more-details">
                    还有 {{ conversionDetails.length - 20 }} 个字符未显示...
                </div>
            </div>

            <!-- 快速示例 -->
            <div class="examples-section">
                <div class="section-header">
                    <h3>快速示例</h3>
                </div>
                <div class="examples-grid">
                    <button class="example-btn" @click="loadExample('tech')">
                        <span class="example-title">科技文本</span>
                        <span class="example-preview">计算机、网络、软件...</span>
                    </button>
                    <button class="example-btn" @click="loadExample('culture')">
                        <span class="example-title">文化内容</span>
                        <span class="example-preview">传统文化、历史...</span>
                    </button>
                    <button class="example-btn" @click="loadExample('business')">
                        <span class="example-title">商务用语</span>
                        <span class="example-preview">商业、贸易、合作...</span>
                    </button>
                    <button class="example-btn" @click="loadExample('daily')">
                        <span class="example-title">日常用语</span>
                        <span class="example-preview">生活、学习、工作...</span>
                    </button>
                </div>
            </div>

            <!-- 使用说明 -->
            <div class="help-section">
                <div class="section-header">
                    <h3>使用说明</h3>
                </div>
                <div class="help-content">
                    <div class="help-grid">
                        <div class="help-card">
                            <div class="help-icon">🔄</div>
                            <h4>转换模式</h4>
                            <p>支持简体转繁体、繁体转简体，以及智能识别自动转换模式。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">🌏</div>
                            <h4>地区标准</h4>
                            <p>支持台湾标准和香港标准的繁体中文转换，满足不同地区的用字习惯。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">⚡</div>
                            <h4>OpenCC 引擎</h4>
                            <p>基于 OpenCC 开源转换引擎，提供准确、全面的简繁体转换服务。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">📊</div>
                            <h4>详细统计</h4>
                            <p>显示转换字符数量、转换详情，帮助了解转换过程和结果。</p>
                        </div>
                    </div>

                    <div class="opencc-info">
                        <h4>🏛️ 关于 OpenCC</h4>
                        <p>OpenCC（Open Chinese Convert）是一个开源的中文简繁转换项目，具有以下特点：</p>
                        <ul>
                            <li><strong>权威性</strong> - 基于学术研究和实际使用数据构建转换词典</li>
                            <li><strong>准确性</strong> - 支持词汇级转换，避免单字转换的歧义问题</li>
                            <li><strong>标准化</strong> - 支持多种地区标准（大陆、台湾、香港等）</li>
                            <li><strong>开源性</strong> - 完全开源，持续更新和改进</li>
                        </ul>
                        <p class="notice-text">本工具使用 OpenCC 引擎，为您提供专业级的简繁体转换服务。</p>
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
import { ref, computed } from 'vue'

// 动态导入 OpenCC
let Converter: any = null

// 异步加载 OpenCC
const loadOpenCC = async () => {
    try {
        const opencc = await import('opencc-js')
        Converter = opencc.Converter
        return true
    } catch (error) {
        console.error('OpenCC 加载失败:', error)
        return false
    }
}

defineEmits<{
    back: []
}>()

// 状态管理
const conversionMode = ref<'toTraditional' | 'toSimplified' | 'auto'>('toTraditional')
const traditionalStandard = ref<'tw' | 'hk'>('tw') // 繁体标准：台湾或香港
const inputText = ref('')
const outputText = ref('')
const conversionCount = ref(0)
const conversionDetails = ref<Array<{ original: string, converted: string, count: number }>>([])

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// OpenCC 转换器实例
let converters: {
    s2t: any, // 简体转繁体（台湾标准）
    s2hk: any, // 简体转繁体（香港标准）
    t2s: any, // 繁体转简体（台湾标准）
    hk2s: any // 繁体转简体（香港标准）
} | null = null

// 初始化 OpenCC 转换器
const initConverters = async () => {
    const loaded = await loadOpenCC()
    if (!loaded || !Converter) {
        showMessage('OpenCC 加载失败，将使用基础转换功能', 'error')
        return
    }

    try {
        converters = {
            s2t: Converter({ from: 'cn', to: 'tw' }), // 简体转繁体（台湾）
            s2hk: Converter({ from: 'cn', to: 'hk' }), // 简体转繁体（香港）
            t2s: Converter({ from: 'tw', to: 'cn' }), // 繁体转简体（台湾）
            hk2s: Converter({ from: 'hk', to: 'cn' }) // 繁体转简体（香港）
        }
    } catch (error) {
        console.error('OpenCC 初始化失败:', error)
        showMessage('转换器初始化失败', 'error')
    }
}

// 组件挂载时初始化转换器
initConverters()

// 计算中文字符数
const chineseCharCount = computed(() => {
    if (!inputText.value) return 0
    const chineseChars = inputText.value.match(/[\u4e00-\u9fa5]/g)
    return chineseChars ? chineseChars.length : 0
})

// 设置转换模式
const setMode = (mode: 'toTraditional' | 'toSimplified' | 'auto') => {
    conversionMode.value = mode
    handleConvert()
}

// 设置繁体标准
const setTraditionalStandard = (standard: 'tw' | 'hk') => {
    traditionalStandard.value = standard
    handleConvert()
}

// 获取输入标题
const getInputTitle = (): string => {
    switch (conversionMode.value) {
        case 'toTraditional': return '简体中文'
        case 'toSimplified': return '繁体中文'
        case 'auto': return '输入文本'
        default: return '输入文本'
    }
}

// 获取输出标题
const getOutputTitle = (): string => {
    switch (conversionMode.value) {
        case 'toTraditional':
            return traditionalStandard.value === 'tw' ? '繁体中文（台湾）' : '繁体中文（香港）'
        case 'toSimplified': return '简体中文'
        case 'auto': return '转换结果'
        default: return '转换结果'
    }
}

// 获取输入占位符
const getInputPlaceholder = (): string => {
    switch (conversionMode.value) {
        case 'toTraditional': return '请输入简体中文文本...'
        case 'toSimplified': return '请输入繁体中文文本...'
        case 'auto': return '请输入中文文本，将自动识别并转换...'
        default: return '请输入中文文本...'
    }
}

// 检测文本类型（简体或繁体为主）
const detectTextType = (text: string): 'simplified' | 'traditional' | 'mixed' => {
    if (!converters) {
        // 如果 OpenCC 未加载，使用简单的字符检测
        const simplifiedChars = /[国产发现实际]/g
        const traditionalChars = /[國產發現實際]/g

        const simplifiedMatches = text.match(simplifiedChars)?.length || 0
        const traditionalMatches = text.match(traditionalChars)?.length || 0

        if (simplifiedMatches > traditionalMatches) return 'simplified'
        if (traditionalMatches > simplifiedMatches) return 'traditional'
        return 'mixed'
    }

    // 使用 OpenCC 进行双向转换来检测文本类型
    if (converters.s2t && converters.t2s) {
        try {
            const toTraditional = converters.s2t(text)
            const toSimplified = converters.t2s(text)

            // 计算转换后的差异
            let simplifiedDiff = 0
            let traditionalDiff = 0

            for (let i = 0; i < text.length; i++) {
                if (text[i] !== toTraditional[i]) simplifiedDiff++
                if (text[i] !== toSimplified[i]) traditionalDiff++
            }

            if (simplifiedDiff > traditionalDiff) return 'simplified'
            if (traditionalDiff > simplifiedDiff) return 'traditional'
            return 'mixed'
        } catch (error) {
            console.error('OpenCC 检测失败:', error)
            return 'mixed'
        }
    } else {
        return 'mixed'
    }
}

// 基础转换映射（当 OpenCC 不可用时使用）
const basicMapping: Record<string, Record<string, string>> = {
    s2t: {
        '国': '國', '产': '產', '发': '發', '现': '現', '实': '實', '际': '際',
        '学': '學', '习': '習', '电': '電', '脑': '腦', '网': '網', '络': '絡',
        '软': '軟', '件': '件', '开': '開', '程': '程', '序': '序',
        '计': '計', '算': '算', '机': '機', '技': '技', '术': '術', '公': '公',
        '司': '司', '企': '企', '业': '業', '管': '管', '理': '理', '系': '系',
        '统': '統', '数': '數', '据': '據', '库': '庫', '服': '服', '务': '務',
        '应': '應', '用': '用', '设': '設', '测': '測', '试': '試', '维': '維', '护': '護'
    },
    t2s: {}
}

// 生成繁转简映射
if (basicMapping.s2t) {
    Object.entries(basicMapping.s2t).forEach(([s, t]) => {
        if (basicMapping.t2s) {
            basicMapping.t2s[t] = s
        }
    })
}

// 转换文本
const convertText = (text: string, mode: 'toTraditional' | 'toSimplified' | 'auto'): { result: string, details: Array<{ original: string, converted: string, count: number }> } => {
    let actualMode = mode
    let result = ''

    // 自动模式：检测文本类型
    if (mode === 'auto') {
        const textType = detectTextType(text)
        actualMode = textType === 'simplified' ? 'toTraditional' : 'toSimplified'
    }

    // 使用 OpenCC 进行转换
    if (converters && converters.s2t && converters.s2hk && converters.t2s && converters.hk2s) {
        try {
            if (actualMode === 'toTraditional') {
                result = traditionalStandard.value === 'tw' ? converters.s2t(text) : converters.s2hk(text)
            } else {
                result = traditionalStandard.value === 'tw' ? converters.t2s(text) : converters.hk2s(text)
            }
        } catch (error) {
            console.error('OpenCC 转换失败:', error)
            result = text
        }
    } else {
        // 使用基础映射进行转换
        const mapping = actualMode === 'toTraditional' ? basicMapping.s2t : basicMapping.t2s
        if (mapping) {
            result = text.split('').map(char => mapping[char] || char).join('')
        } else {
            result = text
        }
    }

    // 计算转换详情
    const charCounts: Record<string, { converted: string, count: number }> = {}

    for (let i = 0; i < text.length; i++) {
        const original = text[i]
        const converted = result[i] || original

        if (original && converted && original !== converted && /[\u4e00-\u9fa5]/.test(original)) {
            if (charCounts[original]) {
                charCounts[original].count++
            } else {
                charCounts[original] = { converted, count: 1 }
            }
        }
    }

    const details = Object.entries(charCounts).map(([original, { converted, count }]) => ({
        original,
        converted,
        count
    }))

    return { result, details }
}

// 处理转换
const handleConvert = () => {
    if (!inputText.value) {
        outputText.value = ''
        conversionCount.value = 0
        conversionDetails.value = []
        return
    }

    const { result, details } = convertText(inputText.value, conversionMode.value)
    outputText.value = result
    conversionCount.value = details.reduce((sum, detail) => sum + detail.count, 0)
    conversionDetails.value = details.sort((a, b) => b.count - a.count)
}

// 粘贴文本
const pasteText = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
        handleConvert()
        showMessage('已粘贴文本', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

// 加载示例
const loadSample = () => {
    const samples = [
        '这是一个简体中文转换繁体中文的示例。我们可以看到汉字的转换效果。',
        '這是一個繁體中文轉換簡體中文的示例。我們可以看到漢字的轉換效果。'
    ]

    const randomIndex = Math.floor(Math.random() * samples.length)
    const randomSample = samples[randomIndex] || samples[0] || ''
    inputText.value = randomSample
    handleConvert()
    showMessage('已加载示例文本', 'success')
}

// 加载特定示例
const loadExample = (type: string) => {
    const examples = {
        tech: '计算机技术发展迅速，人工智能、大数据、云计算等新兴技术不断涌现。软件开发、网络安全、移动应用等领域都在快速发展。',
        culture: '中华文化源远流长，传统节日如春节、中秋节承载着深厚的历史文化内涵。书法、绘画、诗词等艺术形式体现了中华民族的智慧。',
        business: '商业合作需要诚信为本，双方应该建立长期稳定的合作关系。市场营销、品牌建设、客户服务都是企业发展的重要环节。',
        daily: '今天天气很好，我们一起去公园散步吧。学习新知识很重要，要保持终身学习的习惯。健康的生活方式包括合理饮食和适量运动。'
    }

    inputText.value = examples[type as keyof typeof examples] || examples.daily
    handleConvert()
    showMessage('已加载示例文本', 'success')
}

// 复制输出
const copyOutput = async () => {
    if (!outputText.value) {
        showMessage('没有可复制的内容', 'error')
        return
    }

    try {
        await navigator.clipboard.writeText(outputText.value)
        showMessage('已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 下载结果
const downloadResult = () => {
    if (!outputText.value) {
        showMessage('没有可下载的内容', 'error')
        return
    }

    const blob = new Blob([outputText.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-text-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showMessage('文件已下载', 'success')
}

// 交换文本
const swapText = () => {
    if (!outputText.value) {
        showMessage('没有可交换的内容', 'error')
        return
    }

    inputText.value = outputText.value

    // 自动切换转换模式
    if (conversionMode.value === 'toTraditional') {
        conversionMode.value = 'toSimplified'
    } else if (conversionMode.value === 'toSimplified') {
        conversionMode.value = 'toTraditional'
    }

    handleConvert()
    showMessage('已交换文本', 'success')
}

// 清空输入
const clearInput = () => {
    inputText.value = ''
    outputText.value = ''
    conversionCount.value = 0
    conversionDetails.value = []
}

// 清空所有
const clearAll = () => {
    inputText.value = ''
    outputText.value = ''
    conversionCount.value = 0
    conversionDetails.value = []
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
.chinese-converter {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
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
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.back-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
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
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
}

.converter-content {
    flex: 1;
    padding: 1.5rem 1.5rem 6rem 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

/* 通用区域样式 */
.mode-section,
.convert-section,
.details-section,
.examples-section,
.help-section {
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

/* 模式选择 */
.mode-tabs {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.mode-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.mode-tab:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.mode-tab.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.mode-icon {
    font-size: 1.125rem;
    font-weight: 600;
}

.mode-text {
    font-size: 0.875rem;
}

/* 繁体标准选择 */
.standard-selection {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.standard-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
}

.standard-tabs {
    display: flex;
    gap: 0.5rem;
}

.standard-tab {
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.8125rem;
    font-weight: 500;
}

.standard-tab:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.standard-tab.active {
    background: var(--primary-color-alpha);
    color: var(--primary-color);
    border-color: var(--primary-color);
}

/* 转换区域 */
.convert-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 1.5rem;
}

.input-panel,
.output-panel {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    gap: 1rem;
}

.panel-title-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.panel-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    white-space: nowrap;
}

.panel-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.panel-actions {
    display: flex;
    gap: 0.375rem;
    flex-shrink: 0;
}

.char-count,
.chinese-count {
    padding: 0.25rem 0.5rem;
    background: var(--primary-color-alpha);
    color: var(--primary-color);
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.conversion-count {
    padding: 0.25rem 0.5rem;
    background: var(--success-color);
    color: white;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.no-conversion {
    padding: 0.25rem 0.5rem;
    background: var(--warning-color);
    color: white;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.panel-content {
    position: relative;
    display: flex;
    flex-direction: column;
}

.text-input,
.text-output {
    width: 100%;
    min-height: 300px;
    padding: 1rem;
    background: var(--bg-primary);
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.6;
    resize: vertical;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.text-input:focus,
.text-output:focus {
    outline: none;
}

.text-input::placeholder,
.text-output::placeholder {
    color: var(--text-secondary);
}

.text-output {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
}

.action-btn-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn-small:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.action-btn-small.primary {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.action-btn-small.primary:hover {
    background: var(--primary-hover);
    border-color: var(--primary-hover);
    transform: translateY(-1px);
}

/* 转换详情 */
.details-count {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.details-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    font-size: 0.875rem;
}

.original-char,
.converted-char {
    font-size: 1.125rem;
    font-weight: 600;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.original-char {
    color: var(--warning-color);
}

.converted-char {
    color: var(--success-color);
}

.char-count {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-left: auto;
}

.more-details {
    text-align: center;
    padding: 1rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    background: var(--bg-tertiary);
    border-radius: 0.5rem;
    margin-top: 1rem;
}

/* 示例区域 */
.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.example-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
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
    line-height: 1.4;
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
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

/* OpenCC 信息说明 */
.opencc-info {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--success-color-alpha);
    border: 1px solid var(--success-color);
    border-radius: 0.5rem;
}

.opencc-info h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.opencc-info p {
    font-size: 0.875rem;
    color: var(--text-primary);
    line-height: 1.5;
    margin: 0 0 1rem 0;
}

.opencc-info ul {
    margin: 0 0 1rem 1.5rem;
    padding: 0;
}

.opencc-info li {
    font-size: 0.875rem;
    color: var(--text-primary);
    line-height: 1.5;
    margin-bottom: 0.5rem;
}

.opencc-info strong {
    color: var(--success-color);
    font-weight: 600;
}

.notice-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-style: italic;
    margin: 0;
}

/* 消息提示 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.message-toast.success {
    background: var(--success-color);
    color: white;
}

.message-toast.error {
    background: var(--error-color);
    color: white;
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
@media (max-width: 1024px) {
    .convert-section {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .converter-content {
        padding: 1rem 1rem 4rem 1rem;
        gap: 1.5rem;
    }

    .mode-section,
    .details-section,
    .examples-section,
    .help-section {
        padding: 1rem;
    }

    .mode-tabs {
        flex-direction: column;
    }

    .mode-tab {
        justify-content: center;
    }

    .text-input,
    .text-output {
        min-height: 200px;
        font-size: 0.875rem;
    }

    .details-list {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 0.5rem;
    }

    .examples-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .help-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .message-toast {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
    }
}

@media (max-width: 480px) {
    .converter-header {
        padding: 0.75rem 1rem;
    }

    .converter-title {
        font-size: 1.125rem;
    }

    .mode-tab {
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
    }

    .mode-icon {
        font-size: 1rem;
    }

    .examples-grid {
        grid-template-columns: 1fr;
    }

    .panel-header {
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .panel-title-info {
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .panel-actions {
        justify-content: center;
        order: 3;
        width: 100%;
    }

    .details-list {
        grid-template-columns: 1fr;
    }
}
</style>