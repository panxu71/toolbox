<template>
    <div class="chinese-converter">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <div class="mode-toggle">
                    <button class="mode-btn" :class="{ active: conversionMode === 'toTraditional' }"
                        @click="setMode('toTraditional')">
                        简→繁
                    </button>
                    <button class="mode-btn" :class="{ active: conversionMode === 'toSimplified' }"
                        @click="setMode('toSimplified')">
                        繁→简
                    </button>
                    <button class="mode-btn" :class="{ active: conversionMode === 'auto' }" @click="setMode('auto')">
                        智能
                    </button>
                </div>
                <HeaderActionButton icon="copy" tooltip="复制结果" @click="copyOutput" :disabled="!outputText" />
                <HeaderActionButton icon="download" tooltip="下载文件" @click="downloadResult" :disabled="!outputText" />
                <HeaderActionButton icon="swap" tooltip="交换输入输出" @click="swapText" :disabled="!outputText" />
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 快速示例 -->
            <div class="examples-section">
                <div class="examples-header">
                    <h3>📝 快速示例</h3>
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

            <!-- 转换区域 -->
            <div class="convert-section">
                <div class="input-panel">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>{{ getInputTitle() }}</h3>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="inputText" class="text-input" :placeholder="getInputPlaceholder()"
                            @input="handleConvert"></textarea>
                    </div>
                </div>

                <div class="output-panel">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>{{ getOutputTitle() }}</h3>
                            <div v-if="conversionMode === 'toTraditional' || conversionMode === 'auto'"
                                class="standard-selector">
                                <button class="standard-btn" :class="{ active: traditionalStandard === 'tw' }"
                                    @click="setTraditionalStandard('tw')">
                                    台湾
                                </button>
                                <button class="standard-btn" :class="{ active: traditionalStandard === 'hk' }"
                                    @click="setTraditionalStandard('hk')">
                                    香港
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="outputText" class="text-output" placeholder="转换结果将显示在这里..."
                            readonly></textarea>
                    </div>
                </div>
            </div>

            <!-- 转换详情 -->
            <div v-if="inputText || conversionDetails.length > 0" class="details-section">
                <div class="details-header">
                    <h3>📊 转换统计 <span class="details-subtitle">文本分析和转换详情</span></h3>
                </div>

                <!-- 统计信息 -->
                <div class="stats-info">
                    <div class="stat-item" v-if="inputText">
                        <span class="stat-label">总字符数</span>
                        <span class="stat-value">{{ inputText.length }}</span>
                    </div>
                    <div class="stat-item" v-if="chineseCharCount > 0">
                        <span class="stat-label">中文字符</span>
                        <span class="stat-value">{{ chineseCharCount }}</span>
                    </div>
                    <div class="stat-item" v-if="conversionCount > 0">
                        <span class="stat-label">转换字符</span>
                        <span class="stat-value">{{ conversionCount }}</span>
                    </div>
                    <div class="stat-item" v-else-if="inputText && outputText">
                        <span class="stat-label">转换状态</span>
                        <span class="stat-value no-conversion">无需转换</span>
                    </div>
                </div>

                <!-- 转换详情列表 -->
                <div v-if="conversionDetails.length > 0" class="conversion-details">
                    <h4>转换详情（共 {{ conversionDetails.length }} 个字符）</h4>
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
            </div>

            <!-- 使用说明 -->
            <div class="help-section">
                <div class="help-header">
                    <h3>💡 使用说明</h3>
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

        <!-- 通知容器 -->
        <NotificationContainer />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import NotificationContainer from './common/NotificationContainer.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import { useClipboard } from '../composables/useClipboard'
import { useDownload } from '../composables/useDownload'

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

// 使用 composables
usePageTitle('chinese-converter')
const { success, error: showError } = useNotification()
const { copyToClipboard } = useClipboard()
const { downloadText } = useDownload()

// 获取页面标题
const pageTitle = '简繁体转换'

// 状态管理
const conversionMode = ref<'toTraditional' | 'toSimplified' | 'auto'>('toTraditional')
const traditionalStandard = ref<'tw' | 'hk'>('tw') // 繁体标准：台湾或香港
const inputText = ref('')
const outputText = ref('')
const conversionCount = ref(0)
const conversionDetails = ref<Array<{ original: string, converted: string, count: number }>>([])

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
        showError('OpenCC 加载失败，将使用基础转换功能')
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
        showError('转换器初始化失败')
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
        case 'toTraditional': return '📝 简体中文输入'
        case 'toSimplified': return '📝 繁体中文输入'
        case 'auto': return '📝 智能识别输入'
        default: return '📝 文本输入'
    }
}

// 获取输出标题
const getOutputTitle = (): string => {
    switch (conversionMode.value) {
        case 'toTraditional':
            return traditionalStandard.value === 'tw' ? '📄 繁体中文（台湾）' : '📄 繁体中文（香港）'
        case 'toSimplified': return '📄 简体中文输出'
        case 'auto': return '📄 智能转换结果'
        default: return '📄 转换结果'
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

// 加载示例
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
    success('已加载示例文本')
}

// 复制输出
const copyOutput = async () => {
    if (!outputText.value) {
        showError('没有可复制的内容')
        return
    }

    const result = await copyToClipboard(outputText.value)
    if (result) {
        success('转换结果已复制')
    } else {
        showError('复制失败')
    }
}

// 下载结果
const downloadResult = () => {
    if (!outputText.value) {
        showError('没有可下载的内容')
        return
    }

    const result = downloadText(outputText.value, 'converted-text', 'txt')
    if (result) {
        success('文件已下载')
    } else {
        showError('下载失败')
    }
}

// 交换文本
const swapText = () => {
    if (!outputText.value) {
        showError('没有可交换的内容')
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
    success('已交换文本')
}

// 清空所有
const clearAll = () => {
    inputText.value = ''
    outputText.value = ''
    conversionCount.value = 0
    conversionDetails.value = []
    success('已清空所有内容')
}
</script>
<style scoped>
/* 模式切换 */
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

.chinese-converter {
    width: 100%;
    height: 100dvh;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.converter-content {
    flex: 1;
    padding: 1.5rem;
    padding-bottom: 3rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1000px;
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
    min-height: 0;
}

/* 通用区域样式 */
.convert-section,
.details-section,
.examples-section,
.help-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
    margin-bottom: 1.5rem;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.help-header {
    margin-bottom: 1rem;
}

.help-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.details-header {
    margin-bottom: 1rem;
}

.details-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.details-subtitle {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 400;
    margin-left: 0.5rem;
}

.section-title h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
}

.section-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
}

/* 转换区域 */
.convert-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
}

.input-panel,
.output-panel {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
}

.input-panel .section-header,
.output-panel .section-header {
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 1.5rem;
    margin-bottom: 0;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex: 1;
    width: 100%;
}

.section-title h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
}

/* 标准选择器 */
.standard-selector {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--bg-primary);
}

.standard-btn {
    padding: 0.375rem 0.75rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border-right: 1px solid var(--border-color);
    height: 28px;
    box-sizing: border-box;
}

.standard-btn:last-child {
    border-right: none;
}

.standard-btn.active {
    background: var(--primary-color);
    color: white;
}

.standard-btn:hover:not(.active) {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.panel-content {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.text-input,
.text-output {
    width: 100%;
    min-height: 240px;
    padding: 1.5rem;
    background: var(--bg-primary);
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.6;
    resize: vertical;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    box-sizing: border-box;
    flex: 1;
}

.text-input:focus,
.text-output:focus {
    outline: none;
    background: var(--bg-primary);
}

.text-input::placeholder,
.text-output::placeholder {
    color: var(--text-secondary);
}

.text-output {
    background: var(--bg-primary);
    color: var(--text-primary);
}

/* 转换详情 */
.stats-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.25rem;
}

.stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.stat-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
}

.stat-value.no-conversion {
    color: var(--warning-color);
    font-size: 0.875rem;
}

.conversion-details h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
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
.examples-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.examples-header {
    margin-bottom: 1rem;
}

.examples-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.example-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    padding: 0.875rem;
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
    line-height: 1.3;
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
    grid-template-columns: repeat(4, 1fr);
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

/* 响应式设计 */
@media (max-width: 1024px) {
    .convert-section {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }

    .details-section,
    .examples-section,
    .help-section {
        padding: 1.25rem;
    }

    .input-panel .section-header,
    .output-panel .section-header {
        padding: 1rem;
        height: auto;
        min-height: 48px;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .section-title {
        flex-wrap: wrap;
        min-width: 0;
        gap: 0.5rem;
    }

    .section-title h3 {
        font-size: 1rem;
    }

    .standard-selector {
        order: 2;
        width: 100%;
        justify-content: center;
    }

    .text-input,
    .text-output {
        min-height: 180px;
        padding: 1rem;
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
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .examples-grid {
        grid-template-columns: 1fr;
    }

    .details-list {
        grid-template-columns: 1fr;
    }

    .help-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}
</style>