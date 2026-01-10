<template>
    <div class="string-counter">
        <PageHeader title="字符串长度统计" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
                <HeaderActionButton icon="copy" tooltip="复制统计结果" @click="copyStats" />
                <HeaderActionButton icon="download" tooltip="导出统计报告" @click="exportReport" />
            </template>
        </PageHeader>

        <div class="counter-content">
            <!-- 输入区域 -->
            <div class="input-section">
                <div class="section-header">
                    <h3>输入文本</h3>
                    <div class="quick-actions">
                        <button class="quick-btn" @click="loadSample" title="示例">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                            </svg>
                            示例
                        </button>
                        <input ref="fileInput" type="file" @change="handleFileUpload" accept=".txt,.md,.json,.xml,.html,.css,.js,.ts,.vue,.py,.java,.cpp,.c,.h" style="display: none" />
                        <button class="quick-btn" @click="fileInput?.click()" title="上传文件">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17,8 12,3 7,8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            上传
                        </button>
                    </div>
                </div>
                <div class="file-info" v-if="fileInfo">
                    <span class="file-name">{{ fileInfo.name }}</span>
                    <span class="file-size">{{ formatFileSize(fileInfo.size) }}</span>
                </div>
                <textarea v-model="inputText" class="text-input" placeholder="在此输入或粘贴文本..." @input="updateStats"></textarea>
            </div>

            <!-- 基础统计 -->
            <div class="stats-section">
                <div class="section-header">
                    <h3>基础统计</h3>
                </div>
                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-icon">📝</div>
                        <div class="stat-content">
                            <div class="stat-label">总字符数</div>
                            <div class="stat-value">{{ stats.totalChars }}</div>
                            <div class="stat-desc">包含所有字符</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔤</div>
                        <div class="stat-content">
                            <div class="stat-label">不含空格</div>
                            <div class="stat-value">{{ stats.charsNoSpace }}</div>
                            <div class="stat-desc">排除空白字符</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💾</div>
                        <div class="stat-content">
                            <div class="stat-label">字节数</div>
                            <div class="stat-value">{{ stats.bytes }}</div>
                            <div class="stat-desc">UTF-8编码</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📄</div>
                        <div class="stat-content">
                            <div class="stat-label">行数</div>
                            <div class="stat-value">{{ stats.lines }}</div>
                            <div class="stat-desc">换行符分隔</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📖</div>
                        <div class="stat-content">
                            <div class="stat-label">单词数</div>
                            <div class="stat-value">{{ stats.words }}</div>
                            <div class="stat-desc">空格分隔</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📑</div>
                        <div class="stat-content">
                            <div class="stat-label">段落数</div>
                            <div class="stat-value">{{ stats.paragraphs }}</div>
                            <div class="stat-desc">空行分隔</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 字符分析 -->
            <div class="analysis-section">
                <div class="section-header">
                    <h3>字符分析</h3>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🔢</div>
                        <div class="stat-content">
                            <div class="stat-label">数字字符</div>
                            <div class="stat-value">{{ stats.numbers }}</div>
                            <div class="stat-desc">{{ getPercentage(stats.numbers, stats.totalChars) }}%</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔠</div>
                        <div class="stat-content">
                            <div class="stat-label">字母字符</div>
                            <div class="stat-value">{{ stats.letters }}</div>
                            <div class="stat-desc">{{ getPercentage(stats.letters, stats.totalChars) }}%</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🈳</div>
                        <div class="stat-content">
                            <div class="stat-label">中文字符</div>
                            <div class="stat-value">{{ stats.chinese }}</div>
                            <div class="stat-desc">{{ getPercentage(stats.chinese, stats.totalChars) }}%</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔡</div>
                        <div class="stat-content">
                            <div class="stat-label">大写字母</div>
                            <div class="stat-value">{{ stats.uppercase }}</div>
                            <div class="stat-desc">{{ getPercentage(stats.uppercase, stats.totalChars) }}%</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🔡</div>
                        <div class="stat-content">
                            <div class="stat-label">小写字母</div>
                            <div class="stat-value">{{ stats.lowercase }}</div>
                            <div class="stat-desc">{{ getPercentage(stats.lowercase, stats.totalChars) }}%</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-content">
                            <div class="stat-label">特殊符号</div>
                            <div class="stat-value">{{ stats.symbols }}</div>
                            <div class="stat-desc">{{ getPercentage(stats.symbols, stats.totalChars) }}%</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⬜</div>
                        <div class="stat-content">
                            <div class="stat-label">空白字符</div>
                            <div class="stat-value">{{ stats.spaces }}</div>
                            <div class="stat-desc">{{ getPercentage(stats.spaces, stats.totalChars) }}%</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🌐</div>
                        <div class="stat-content">
                            <div class="stat-label">其他字符</div>
                            <div class="stat-value">{{ stats.others }}</div>
                            <div class="stat-desc">{{ getPercentage(stats.others, stats.totalChars) }}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 详细分析 -->
            <div class="detailed-analysis-section">
                <div class="section-header">
                    <h3>详细分析</h3>
                </div>
                <div class="analysis-grid">
                    <div class="analysis-card">
                        <h4>📊 字符密度</h4>
                        <div class="analysis-item">
                            <span class="analysis-label">字符密度:</span>
                            <span class="analysis-value">{{ getCharacterDensity() }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">平均行长:</span>
                            <span class="analysis-value">{{ getAverageLineLength() }} 字符</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">平均词长:</span>
                            <span class="analysis-value">{{ getAverageWordLength() }} 字符</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">最长行:</span>
                            <span class="analysis-value">{{ getLongestLine() }} 字符</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">最短行:</span>
                            <span class="analysis-value">{{ getShortestLine() }} 字符</span>
                        </div>
                    </div>

                    <div class="analysis-card">
                        <h4>📚 词汇丰富度</h4>
                        <div class="analysis-item">
                            <span class="analysis-label">唯一词汇:</span>
                            <span class="analysis-value">{{ stats.uniqueWords }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">词汇丰富度:</span>
                            <span class="analysis-value">{{ getVocabularyRichness() }}%</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">重复词汇:</span>
                            <span class="analysis-value">{{ stats.words - stats.uniqueWords }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">平均词频:</span>
                            <span class="analysis-value">{{ getAverageWordFrequency() }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">最高词频:</span>
                            <span class="analysis-value">{{ getMaxWordFrequency() }}</span>
                        </div>
                    </div>

                    <div class="analysis-card">
                        <h4>🎯 复杂度评分</h4>
                        <div class="analysis-item">
                            <span class="analysis-label">文本复杂度:</span>
                            <span class="analysis-value complexity-score" :class="getComplexityClass()">{{ getComplexityScore() }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">可读性等级:</span>
                            <span class="analysis-value">{{ getReadabilityLevel() }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">语言混合度:</span>
                            <span class="analysis-value">{{ getLanguageMixture() }}%</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">标点密度:</span>
                            <span class="analysis-value">{{ getPunctuationDensity() }}%</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">数字密度:</span>
                            <span class="analysis-value">{{ getNumberDensity() }}%</span>
                        </div>
                    </div>

                    <div class="analysis-card">
                        <h4>⏱️ 时间估算</h4>
                        <div class="analysis-item">
                            <span class="analysis-label">阅读时间:</span>
                            <span class="analysis-value">{{ getReadingTime() }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">打字时间:</span>
                            <span class="analysis-value">{{ getTypingTime() }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">语音时间:</span>
                            <span class="analysis-value">{{ getSpeakingTime() }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">手写时间:</span>
                            <span class="analysis-value">{{ getHandwritingTime() }}</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">翻译时间:</span>
                            <span class="analysis-value">{{ getTranslationTime() }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 使用说明 -->
            <div class="help-section">
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h4>全面统计</h4>
                        <p>提供字符、单词、行数、段落等多维度统计分析。</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔍</div>
                        <h4>深度分析</h4>
                        <p>字符密度、词汇丰富度、复杂度评分等高级分析功能。</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📁</div>
                        <h4>文件支持</h4>
                        <p>支持上传多种格式的文本文件进行批量分析。</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📋</div>
                        <h4>导出功能</h4>
                        <p>一键复制统计结果或导出详细的分析报告。</p>
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
import { ref, reactive, onMounted } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('string-counter')

// 使用通知系统
const { success: showSuccess, error: showError } = useNotification()

const inputText = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const fileInput = ref<HTMLInputElement>()
const fileInfo = ref<{ name: string; size: number } | null>(null)

const stats = reactive({
    totalChars: 0,
    charsNoSpace: 0,
    bytes: 0,
    lines: 0,
    words: 0,
    paragraphs: 0,
    numbers: 0,
    letters: 0,
    chinese: 0,
    symbols: 0,
    spaces: 0,
    uppercase: 0,
    lowercase: 0,
    others: 0,
    uniqueWords: 0,
    wordFrequencies: new Map<string, number>()
})

// 更新统计信息
const updateStats = () => {
    const text = inputText.value
    const previousLength = stats.totalChars

    // 基础统计
    stats.totalChars = text.length
    stats.charsNoSpace = text.replace(/\s/g, '').length
    stats.bytes = new Blob([text]).size
    stats.lines = text ? text.split('\n').length : 0
    stats.paragraphs = text ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0

    // 单词统计
    const words = text.trim() ? text.trim().split(/\s+/) : []
    stats.words = words.length
    
    // 词频统计
    stats.wordFrequencies.clear()
    words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^\w\u4e00-\u9fa5]/g, '')
        if (cleanWord) {
            stats.wordFrequencies.set(cleanWord, (stats.wordFrequencies.get(cleanWord) || 0) + 1)
        }
    })
    stats.uniqueWords = stats.wordFrequencies.size

    // 字符类型统计
    stats.numbers = (text.match(/\d/g) || []).length
    stats.letters = (text.match(/[a-zA-Z]/g) || []).length
    stats.chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    stats.uppercase = (text.match(/[A-Z]/g) || []).length
    stats.lowercase = (text.match(/[a-z]/g) || []).length
    stats.spaces = (text.match(/\s/g) || []).length
    
    // 特殊符号和其他字符
    const knownChars = stats.letters + stats.numbers + stats.chinese + stats.spaces
    const punctuation = (text.match(/[^\w\s\u4e00-\u9fa5]/g) || []).length
    stats.symbols = punctuation
    stats.others = stats.totalChars - knownChars - punctuation

    // 检测大量文本输入（可能是粘贴操作）
    if (previousLength === 0 && stats.totalChars > 50) {
        showMessage('文本已输入，统计完成', 'success')
    }
}

// 计算百分比
const getPercentage = (part: number, total: number): string => {
    if (total === 0) return '0.0'
    return ((part / total) * 100).toFixed(1)
}

// 字符密度分析
const getCharacterDensity = (): string => {
    if (stats.lines === 0) return '0'
    return (stats.totalChars / stats.lines).toFixed(1)
}

// 平均行长度
const getAverageLineLength = (): string => {
    if (stats.lines === 0) return '0'
    const lines = inputText.value.split('\n')
    const totalLength = lines.reduce((sum, line) => sum + line.length, 0)
    return (totalLength / stats.lines).toFixed(1)
}

// 平均词长度
const getAverageWordLength = (): string => {
    if (stats.words === 0) return '0'
    return (stats.charsNoSpace / stats.words).toFixed(1)
}

// 最长行
const getLongestLine = (): number => {
    if (!inputText.value) return 0
    const lines = inputText.value.split('\n')
    return Math.max(...lines.map(line => line.length))
}

// 最短行
const getShortestLine = (): number => {
    if (!inputText.value) return 0
    const lines = inputText.value.split('\n').filter(line => line.length > 0)
    if (lines.length === 0) return 0
    return Math.min(...lines.map(line => line.length))
}

// 词汇丰富度
const getVocabularyRichness = (): string => {
    if (stats.words === 0) return '0.0'
    return ((stats.uniqueWords / stats.words) * 100).toFixed(1)
}

// 平均词频
const getAverageWordFrequency = (): string => {
    if (stats.uniqueWords === 0) return '0.0'
    return (stats.words / stats.uniqueWords).toFixed(1)
}

// 最高词频
const getMaxWordFrequency = (): number => {
    if (stats.wordFrequencies.size === 0) return 0
    return Math.max(...Array.from(stats.wordFrequencies.values()))
}

// 复杂度评分
const getComplexityScore = (): string => {
    let score = 0
    
    // 词汇丰富度权重 (30%)
    const richness = parseFloat(getVocabularyRichness())
    score += richness * 0.3
    
    // 平均词长权重 (25%)
    const avgWordLength = parseFloat(getAverageWordLength())
    score += Math.min(avgWordLength * 10, 25) * 0.25
    
    // 语言混合度权重 (20%)
    const mixture = parseFloat(getLanguageMixture())
    score += mixture * 0.2
    
    // 标点密度权重 (15%)
    const punctuation = parseFloat(getPunctuationDensity())
    score += Math.min(punctuation * 5, 15) * 0.15
    
    // 行长度变化权重 (10%)
    const lineVariation = getLineVariation()
    score += lineVariation * 0.1
    
    return Math.min(score, 100).toFixed(1)
}

// 行长度变化度
const getLineVariation = (): number => {
    if (!inputText.value) return 0
    const lines = inputText.value.split('\n')
    if (lines.length < 2) return 0
    
    const lengths = lines.map(line => line.length)
    const avg = lengths.reduce((sum, len) => sum + len, 0) / lengths.length
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length
    const stdDev = Math.sqrt(variance)
    
    return Math.min((stdDev / avg) * 100, 100) || 0
}

// 复杂度等级样式
const getComplexityClass = (): string => {
    const score = parseFloat(getComplexityScore())
    if (score >= 80) return 'very-high'
    if (score >= 60) return 'high'
    if (score >= 40) return 'medium'
    if (score >= 20) return 'low'
    return 'very-low'
}

// 可读性等级
const getReadabilityLevel = (): string => {
    const score = parseFloat(getComplexityScore())
    if (score >= 80) return '专业级'
    if (score >= 60) return '高级'
    if (score >= 40) return '中级'
    if (score >= 20) return '初级'
    return '入门级'
}

// 语言混合度
const getLanguageMixture = (): string => {
    if (stats.totalChars === 0) return '0.0'
    const englishRatio = stats.letters / stats.totalChars
    const chineseRatio = stats.chinese / stats.totalChars
    const mixture = Math.min(englishRatio, chineseRatio) * 2 * 100
    return mixture.toFixed(1)
}

// 标点密度
const getPunctuationDensity = (): string => {
    return getPercentage(stats.symbols, stats.totalChars)
}

// 数字密度
const getNumberDensity = (): string => {
    return getPercentage(stats.numbers, stats.totalChars)
}

// 时间估算函数
const getReadingTime = (): string => {
    const wordsPerMinute = stats.chinese > stats.letters ? 300 : 200 // 中文阅读速度更快
    const minutes = stats.words / wordsPerMinute
    if (minutes < 1) return `${Math.round(minutes * 60)} 秒`
    return `${minutes.toFixed(1)} 分钟`
}

const getTypingTime = (): string => {
    const wordsPerMinute = stats.chinese > stats.letters ? 30 : 40 // 中文打字速度稍慢
    const minutes = stats.words / wordsPerMinute
    if (minutes < 1) return `${Math.round(minutes * 60)} 秒`
    return `${minutes.toFixed(1)} 分钟`
}

const getSpeakingTime = (): string => {
    const wordsPerMinute = stats.chinese > stats.letters ? 200 : 150 // 中文语速稍快
    const minutes = stats.words / wordsPerMinute
    if (minutes < 1) return `${Math.round(minutes * 60)} 秒`
    return `${minutes.toFixed(1)} 分钟`
}

const getHandwritingTime = (): string => {
    const wordsPerMinute = stats.chinese > stats.letters ? 15 : 20 // 中文手写更慢
    const minutes = stats.words / wordsPerMinute
    if (minutes < 1) return `${Math.round(minutes * 60)} 秒`
    return `${minutes.toFixed(1)} 分钟`
}

const getTranslationTime = (): string => {
    const wordsPerMinute = 10 // 翻译速度较慢
    const minutes = stats.words / wordsPerMinute
    if (minutes < 1) return `${Math.round(minutes * 60)} 秒`
    return `${minutes.toFixed(1)} 分钟`
}

// 文件处理
const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    // 检查文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
        showMessage('文件大小不能超过5MB', 'error')
        return
    }

    try {
        const text = await readFileAsText(file)
        inputText.value = text
        fileInfo.value = { name: file.name, size: file.size }
        updateStats()
        showMessage(`文件 ${file.name} 上传成功`, 'success')
    } catch (error) {
        showMessage('文件读取失败', 'error')
    }
}

// 读取文件内容
const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result
            if (typeof result === 'string') {
                resolve(result)
            } else {
                reject(new Error('文件读取失败'))
            }
        }
        reader.onerror = reject
        reader.readAsText(file, 'UTF-8')
    })
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 操作函数
const pasteText = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
        fileInfo.value = null
        updateStats()
        showMessage('已粘贴文本', 'success')
    } catch (error) {
        showMessage('粘贴失败，请手动粘贴', 'error')
    }
}

const loadSample = () => {
    inputText.value = `这是一个功能强大的字符串长度统计工具示例文本。
This is a comprehensive text analysis tool that supports multiple languages!
支持中文、English、数字123、特殊符号!@#等各种字符的深度分析。

主要功能特点：
1. 基础统计：字符数、单词数、行数、段落数等
2. 字符分析：数字、字母、中文、符号等类型分布
3. 深度分析：字符密度、词汇丰富度、复杂度评分
4. 时间估算：阅读、打字、语音、手写、翻译时间
5. 文件支持：支持多种格式的文本文件上传
6. 导出功能：一键复制或导出详细分析报告

Try it out with your own text! 试试看吧！
这个工具可以帮助您深入了解文本的各种特征和属性。`
    fileInfo.value = null
    updateStats()
    showMessage('已加载示例文本', 'success')
}

const clearAll = () => {
    inputText.value = ''
    fileInfo.value = null
    if (fileInput.value) fileInput.value.value = ''
    updateStats()
    showMessage('已清空所有内容', 'success')
}

const copyStats = async () => {
    const statsText = generateStatsReport()
    try {
        await navigator.clipboard.writeText(statsText)
        showMessage('统计结果已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

const exportReport = () => {
    const report = generateDetailedReport()
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `文本分析报告_${new Date().toISOString().slice(0, 10)}.txt`
    link.click()
    URL.revokeObjectURL(url)
    showMessage('分析报告已导出', 'success')
}

// 生成统计报告
const generateStatsReport = (): string => {
    return `文本统计结果
================
总字符数: ${stats.totalChars}
不含空格: ${stats.charsNoSpace}
字节数: ${stats.bytes}
行数: ${stats.lines}
单词数: ${stats.words}
段落数: ${stats.paragraphs}

字符分析
========
数字字符: ${stats.numbers} (${getPercentage(stats.numbers, stats.totalChars)}%)
字母字符: ${stats.letters} (${getPercentage(stats.letters, stats.totalChars)}%)
中文字符: ${stats.chinese} (${getPercentage(stats.chinese, stats.totalChars)}%)
大写字母: ${stats.uppercase} (${getPercentage(stats.uppercase, stats.totalChars)}%)
小写字母: ${stats.lowercase} (${getPercentage(stats.lowercase, stats.totalChars)}%)
特殊符号: ${stats.symbols} (${getPercentage(stats.symbols, stats.totalChars)}%)
空白字符: ${stats.spaces} (${getPercentage(stats.spaces, stats.totalChars)}%)

复杂度分析
==========
文本复杂度: ${getComplexityScore()}
可读性等级: ${getReadabilityLevel()}
词汇丰富度: ${getVocabularyRichness()}%
语言混合度: ${getLanguageMixture()}%

时间估算
========
阅读时间: ${getReadingTime()}
打字时间: ${getTypingTime()}
语音时间: ${getSpeakingTime()}
手写时间: ${getHandwritingTime()}
翻译时间: ${getTranslationTime()}`
}

// 生成详细报告
const generateDetailedReport = (): string => {
    const basicReport = generateStatsReport()
    const detailedAnalysis = `

详细分析
========
字符密度: ${getCharacterDensity()}
平均行长: ${getAverageLineLength()} 字符
平均词长: ${getAverageWordLength()} 字符
最长行: ${getLongestLine()} 字符
最短行: ${getShortestLine()} 字符
唯一词汇: ${stats.uniqueWords}
重复词汇: ${stats.words - stats.uniqueWords}
平均词频: ${getAverageWordFrequency()}
最高词频: ${getMaxWordFrequency()}
标点密度: ${getPunctuationDensity()}%
数字密度: ${getNumberDensity()}%

生成时间: ${new Date().toLocaleString()}
工具版本: StringCounter v2.0`

    return basicReport + detailedAnalysis
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error') => {
    if (type === 'success') {
        showSuccess(text)
    } else {
        showError(text)
    }
    
    // 保留原有的toast消息系统作为备用
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 初始化
onMounted(() => {
    updateStats()
})
</script>
<style scoped>
.string-counter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.counter-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

/* 通用区域样式 */
.input-section,
.stats-section,
.analysis-section,
.detailed-analysis-section,
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

.quick-actions {
    display: flex;
    gap: 0.5rem;
}

.quick-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
}

.quick-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

/* 文件信息 */
.file-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    margin-bottom: 1rem;
}

.file-name {
    color: var(--text-primary);
    font-weight: 500;
}

.file-size {
    color: var(--text-secondary);
}

/* 输入区域 */
.text-input {
    width: 100%;
    min-height: 200px;
    padding: 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
    font-family: 'Courier New', monospace;
    transition: all 0.2s ease;
}

.text-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.text-input::placeholder {
    color: var(--text-secondary);
}

/* 统计网格 */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    transition: all 0.2s ease;
}

.stat-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
    transform: translateY(-2px);
}

.stat-card.primary {
    border-color: var(--primary-color);
    background: var(--primary-color-alpha);
}

.stat-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
}

.stat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.stat-value {
    font-size: 1.5rem;
    color: var(--text-primary);
    font-weight: 700;
}

.stat-desc {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

/* 分析区域 */
.analysis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.analysis-card {
    padding: 1.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    transition: all 0.2s ease;
}

.analysis-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 2px 8px var(--primary-color-alpha);
}

.analysis-card h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.analysis-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-color);
}

.analysis-item:last-child {
    border-bottom: none;
}

.analysis-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.analysis-value {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-weight: 600;
}

/* 复杂度评分样式 */
.complexity-score.very-high {
    color: #dc2626;
    font-weight: 700;
}

.complexity-score.high {
    color: #ea580c;
    font-weight: 700;
}

.complexity-score.medium {
    color: #d97706;
    font-weight: 700;
}

.complexity-score.low {
    color: #65a30d;
    font-weight: 700;
}

.complexity-score.very-low {
    color: #16a34a;
    font-weight: 700;
}

/* 功能特点网格 */
.features-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.feature-card {
    text-align: center;
    padding: 1.25rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    transition: all 0.2s ease;
}

.feature-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--primary-color);
}

.feature-icon {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
    display: block;
}

.feature-card h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
}

.feature-card p {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.4;
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
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .analysis-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
    
    .features-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .counter-content {
        padding: 1rem;
        gap: 1.5rem;
    }

    .input-section,
    .stats-section,
    .analysis-section,
    .detailed-analysis-section,
    .help-section {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }

    .stat-card {
        padding: 1rem;
        flex-direction: column;
        text-align: center;
        gap: 0.75rem;
    }

    .stat-content {
        align-items: center;
    }

    .analysis-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .analysis-card {
        padding: 1rem;
    }

    .quick-actions {
        flex-direction: column;
        gap: 0.25rem;
    }

    .quick-btn {
        padding: 0.375rem 0.5rem;
        font-size: 0.75rem;
    }

    .features-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .feature-card {
        padding: 1rem;
    }

    .feature-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    .message-toast {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
    }
}

@media (max-width: 480px) {
    .counter-content {
        padding: 0.75rem;
        gap: 1rem;
    }

    .input-section,
    .stats-section,
    .analysis-section,
    .detailed-analysis-section,
    .help-section {
        padding: 0.75rem;
    }

    .text-input {
        min-height: 150px;
        padding: 0.75rem;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .stat-value {
        font-size: 1.25rem;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }

    .quick-actions {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
}
</style>