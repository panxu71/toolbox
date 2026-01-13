<template>
    <div class="text-compare">
        <PageHeader title="文本比对" @back="$emit('back')" />

        <div class="compare-content">
            <!-- 文本比对工具 -->
            <div class="compare-section">
                <div class="section-header">
                    <h3>文本比对</h3>
                    <div class="section-info">
                        <span class="info-text">比较两个文本的差异，支持文件上传</span>
                    </div>
                </div>
                <div class="compare-container">
                    <div class="text-panel">
                        <div class="panel-header">
                            <h4>文本A</h4>
                            <div class="panel-actions">
                                <input ref="fileInputA" type="file" @change="handleFileUpload($event, 'A')"
                                    accept=".txt,.md,.json,.xml,.html,.css,.js,.ts,.vue,.py,.java,.cpp,.c,.h"
                                    style="display: none" />
                                <button class="upload-btn" @click="fileInputA?.click()" title="上传文件">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17,8 12,3 7,8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </button>
                                <button class="paste-btn" @click="pasteText('A')" title="粘贴">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                        <path
                                            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    </svg>
                                </button>
                                <button class="clear-btn" @click="clearText('A')" title="清空">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="file-info" v-if="fileInfoA">
                            <span class="file-name">{{ fileInfoA.name }}</span>
                            <span class="file-size">{{ formatFileSize(fileInfoA.size) }}</span>
                        </div>
                        <textarea v-model="textA" placeholder="请输入或上传第一个文本..." class="text-input"
                            @input="compareTexts"></textarea>
                        <div class="text-stats">
                            <span>字符数: {{ textA.length }}</span>
                            <span>行数: {{ getLineCount(textA) }}</span>
                        </div>
                    </div>

                    <div class="text-panel">
                        <div class="panel-header">
                            <h4>文本B</h4>
                            <div class="panel-actions">
                                <input ref="fileInputB" type="file" @change="handleFileUpload($event, 'B')"
                                    accept=".txt,.md,.json,.xml,.html,.css,.js,.ts,.vue,.py,.java,.cpp,.c,.h"
                                    style="display: none" />
                                <button class="upload-btn" @click="fileInputB?.click()" title="上传文件">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17,8 12,3 7,8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </button>
                                <button class="paste-btn" @click="pasteText('B')" title="粘贴">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                        <path
                                            d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    </svg>
                                </button>
                                <button class="clear-btn" @click="clearText('B')" title="清空">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="file-info" v-if="fileInfoB">
                            <span class="file-name">{{ fileInfoB.name }}</span>
                            <span class="file-size">{{ formatFileSize(fileInfoB.size) }}</span>
                        </div>
                        <textarea v-model="textB" placeholder="请输入或上传第二个文本..." class="text-input"
                            @input="compareTexts"></textarea>
                        <div class="text-stats">
                            <span>字符数: {{ textB.length }}</span>
                            <span>行数: {{ getLineCount(textB) }}</span>
                        </div>
                    </div>
                </div>

                <!-- 比对选项 -->
                <div class="compare-options">
                    <div class="option-group">
                        <label class="checkbox-label">
                            <input v-model="options.ignoreCase" type="checkbox" @change="compareTexts" />
                            <span>忽略大小写</span>
                        </label>
                        <label class="checkbox-label">
                            <input v-model="options.ignoreWhitespace" type="checkbox" @change="compareTexts" />
                            <span>忽略空白字符</span>
                        </label>
                        <label class="checkbox-label">
                            <input v-model="options.ignoreLineBreaks" type="checkbox" @change="compareTexts" />
                            <span>忽略换行符</span>
                        </label>
                    </div>
                    <button class="compare-btn" @click="compareTexts" :disabled="!textA || !textB">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4" />
                            <path d="M15 11h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4" />
                            <path d="M12 2v20" />
                        </svg>
                        开始比对
                    </button>
                </div>
            </div>

            <!-- 比对结果 -->
            <div class="compare-section" v-if="compareResult">
                <div class="section-header">
                    <h3>比对结果</h3>
                    <div class="section-info">
                        <span class="info-text">文本差异分析结果</span>
                    </div>
                </div>
                <div class="result-container">
                    <div class="result-summary">
                        <div class="summary-item">
                            <span class="summary-label">相似度:</span>
                            <span class="summary-value" :class="getSimilarityClass(compareResult.similarity)">
                                {{ compareResult.similarity.toFixed(1) }}%
                            </span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">差异行数:</span>
                            <span class="summary-value">{{ compareResult.diffLines }}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">新增行数:</span>
                            <span class="summary-value added">{{ compareResult.addedLines }}</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">删除行数:</span>
                            <span class="summary-value removed">{{ compareResult.removedLines }}</span>
                        </div>
                    </div>

                    <div class="diff-view">
                        <div class="diff-header">
                            <h4>差异详情</h4>
                            <div class="view-options">
                                <button class="view-btn" :class="{ active: viewMode === 'unified' }"
                                    @click="viewMode = 'unified'">
                                    统一视图
                                </button>
                                <button class="view-btn" :class="{ active: viewMode === 'split' }"
                                    @click="viewMode = 'split'">
                                    并排视图
                                </button>
                            </div>
                            <div class="diff-legend">
                                <span class="legend-item added">+ 新增</span>
                                <span class="legend-item removed">- 删除</span>
                                <span class="legend-item modified">~ 修改</span>
                            </div>
                        </div>

                        <!-- 统一视图 -->
                        <div v-if="viewMode === 'unified'" class="diff-content unified">
                            <template v-for="(diff, diffIndex) in compareResult.diffs" :key="diffIndex">
                                <template v-for="(lineText, lineIndex) in diff.value.split('\n')"
                                    :key="`${diffIndex}-${lineIndex}`">
                                    <div v-if="lineText || diff.value.endsWith('\n')" class="diff-line"
                                        :class="diff.type">
                                        <span class="line-number">{{ lineIndex + 1 }}</span>
                                        <span class="line-prefix">{{ diff.type === 'added' ? '+' : diff.type ===
                                            'removed' ? '-' : ' ' }}</span>
                                        <span class="line-content"
                                            v-html="highlightDifferences(lineText, diff.type)"></span>
                                    </div>
                                </template>
                            </template>
                        </div>

                        <!-- 并排视图 -->
                        <div v-if="viewMode === 'split'" class="diff-content split">
                            <div class="split-header">
                                <div class="split-title">文本A</div>
                                <div class="split-title">文本B</div>
                            </div>
                            <div class="split-body">
                                <div v-for="(pair, index) in splitDiffs" :key="index" class="diff-pair">
                                    <div class="diff-side left" :class="pair.left?.type || 'empty'">
                                        <span class="line-number">{{ pair.left?.lineNumber || '' }}</span>
                                        <span class="line-content" v-if="pair.left"
                                            v-html="highlightDifferences(pair.left.content, pair.left.type)"></span>
                                        <span class="line-content empty" v-else></span>
                                    </div>
                                    <div class="diff-side right" :class="pair.right?.type || 'empty'">
                                        <span class="line-number">{{ pair.right?.lineNumber || '' }}</span>
                                        <span class="line-content" v-if="pair.right"
                                            v-html="highlightDifferences(pair.right.content, pair.right.type)"></span>
                                        <span class="line-content empty" v-else></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 使用说明 -->
            <div class="help-section">
                <!-- 功能特点 - 4个卡片横向布局 -->
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">📄</div>
                        <h4>支持文件上传</h4>
                        <p>支持手动输入文本或上传多种格式的文件进行比对。</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">⚙️</div>
                        <h4>灵活比对选项</h4>
                        <p>可选择忽略大小写、空白字符或换行符进行灵活比对。</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📊</div>
                        <h4>多种视图模式</h4>
                        <p>提供统一视图和并排视图两种方式展示文本差异。</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📈</div>
                        <h4>详细统计分析</h4>
                        <p>显示相似度、差异行数等统计信息，帮助分析文本差异。</p>
                    </div>
                </div>

                <!-- 技术说明框 -->
                <div class="diff-info">
                    <h4>⚡ 关于 Diff 算法</h4>
                    <p>基于专业的 <a href="https://www.npmjs.com/package/diff" target="_blank" rel="noopener">diff</a> 库，采用
                        Myers 差分算法，被
                        Git、GitHub、VS Code 等工具广泛使用。该算法能够高效地计算两个文本序列之间的最小编辑距离，提供精确的差异分析结果。</p>
                    <div class="tech-features">
                        <div class="feature-row">
                            <span class="feature-label">🔍 算法优势：</span>
                            <span class="feature-desc">时间复杂度 O(ND)，空间复杂度优化，适合大文件比对</span>
                        </div>
                        <div class="feature-row">
                            <span class="feature-label">🌟 应用场景：</span>
                            <span class="feature-desc">代码审查、版本控制、文档比较、数据同步等</span>
                        </div>
                        <div class="feature-row">
                            <span class="feature-label">🛠️ 技术特性：</span>
                            <span class="feature-desc">支持字符级、单词级、行级比对，可自定义比较规则</span>
                        </div>
                    </div>
                    <div class="tech-highlights">
                        <span class="tech-tag">Myers 算法</span>
                        <span class="tech-tag">高性能</span>
                        <span class="tech-tag">广泛应用</span>
                        <span class="tech-tag">开源可靠</span>
                        <span class="tech-tag">精确比对</span>
                        <span class="tech-tag">多级别支持</span>
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
import { ref, computed, onMounted } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import * as Diff from 'diff'

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('text-compare')

// 使用通知系统
const { success: showSuccess, error: showError } = useNotification()

const textA = ref('')
const textB = ref('')
const fileInputA = ref<HTMLInputElement>()
const fileInputB = ref<HTMLInputElement>()
const fileInfoA = ref<{ name: string; size: number } | null>(null)
const fileInfoB = ref<{ name: string; size: number } | null>(null)

// 视图模式
const viewMode = ref<'unified' | 'split'>('split')

// 比对选项
const options = ref({
    ignoreCase: false,
    ignoreWhitespace: false,
    ignoreLineBreaks: false
})

// 比对结果
const compareResult = ref<{
    similarity: number
    diffLines: number
    addedLines: number
    removedLines: number
    diffs: Array<{
        type: 'added' | 'removed' | 'unchanged'
        value: string
        count?: number
    }>
} | null>(null)

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 处理文件上传
const handleFileUpload = async (event: Event, target: 'A' | 'B') => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    // 检查文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
        showMessage('文件大小不能超过10MB', 'error')
        return
    }

    try {
        const text = await readFileAsText(file)
        if (target === 'A') {
            textA.value = text
            fileInfoA.value = { name: file.name, size: file.size }
        } else {
            textB.value = text
            fileInfoB.value = { name: file.name, size: file.size }
        }
        compareTexts()
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

// 粘贴文本
const pasteText = async (target: 'A' | 'B') => {
    try {
        const text = await navigator.clipboard.readText()
        if (target === 'A') {
            textA.value = text
            fileInfoA.value = null
        } else {
            textB.value = text
            fileInfoB.value = null
        }
        compareTexts()
        showMessage('文本已粘贴', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

// 清空文本
const clearText = (target: 'A' | 'B') => {
    if (target === 'A') {
        textA.value = ''
        fileInfoA.value = null
        if (fileInputA.value) fileInputA.value.value = ''
    } else {
        textB.value = ''
        fileInfoB.value = null
        if (fileInputB.value) fileInputB.value.value = ''
    }
    compareTexts()
    showMessage(`文本${target}已清空`, 'success')
}

// 清空所有
const clearAll = () => {
    textA.value = ''
    textB.value = ''
    fileInfoA.value = null
    fileInfoB.value = null
    compareResult.value = null
    if (fileInputA.value) fileInputA.value.value = ''
    if (fileInputB.value) fileInputB.value.value = ''
    showMessage('已清空所有内容', 'success')
}

// 获取行数
const getLineCount = (text: string): number => {
    return text ? text.split('\n').length : 0
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 预处理文本
const preprocessText = (text: string): string => {
    let processed = text

    if (options.value.ignoreCase) {
        processed = processed.toLowerCase()
    }

    if (options.value.ignoreWhitespace) {
        processed = processed.replace(/\s+/g, ' ').trim()
    }

    if (options.value.ignoreLineBreaks) {
        processed = processed.replace(/\n/g, ' ')
    }

    return processed
}

// 计算文本相似度（使用 Levenshtein 距离）
const calculateSimilarity = (text1: string, text2: string): number => {
    if (text1 === text2) return 100
    if (!text1 || !text2) return 0

    const longer = text1.length > text2.length ? text1 : text2
    const shorter = text1.length > text2.length ? text2 : text1

    if (longer.length === 0) return 100

    const editDistance = getEditDistance(longer, shorter)
    return ((longer.length - editDistance) / longer.length) * 100
}

// 计算编辑距离（保留作为备用）
const getEditDistance = (str1: string, str2: string): number => {
    const len1 = str1.length
    const len2 = str2.length

    const dp: number[][] = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0))

    for (let i = 0; i <= len1; i++) {
        dp[0]![i] = i
    }
    for (let i = 0; i <= len2; i++) {
        dp[i]![0] = i
    }

    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (str2[i - 1] === str1[j - 1]) {
                dp[i]![j] = dp[i - 1]![j - 1]!
            } else {
                dp[i]![j] = Math.min(
                    dp[i - 1]![j]! + 1,
                    dp[i]![j - 1]! + 1,
                    dp[i - 1]![j - 1]! + 1
                )
            }
        }
    }

    return dp[len2]![len1]!
}

// 比对文本（使用 diff 库）
const compareTexts = () => {
    if (!textA.value && !textB.value) {
        compareResult.value = null
        return
    }

    if (!textA.value || !textB.value) {
        compareResult.value = null
        return
    }

    const processedA = preprocessText(textA.value)
    const processedB = preprocessText(textB.value)

    // 使用 diff 库进行比对
    const diffs = Diff.diffLines(processedA, processedB)

    // 计算统计信息
    let addedLines = 0
    let removedLines = 0
    let diffLines = 0

    diffs.forEach(diff => {
        if (diff.added) {
            addedLines += diff.count || 0
        } else if (diff.removed) {
            removedLines += diff.count || 0
        }
        if (diff.added || diff.removed) {
            diffLines += diff.count || 0
        }
    })

    // 计算相似度
    const similarity = calculateSimilarity(processedA, processedB)

    // 转换为我们的格式
    const formattedDiffs = diffs.map(diff => ({
        type: diff.added ? 'added' as const : diff.removed ? 'removed' as const : 'unchanged' as const,
        value: diff.value,
        count: diff.count
    }))

    compareResult.value = {
        similarity,
        diffLines,
        addedLines,
        removedLines,
        diffs: formattedDiffs
    }
}

// 获取相似度样式类
const getSimilarityClass = (similarity: number): string => {
    if (similarity >= 90) return 'high'
    if (similarity >= 70) return 'medium'
    if (similarity >= 50) return 'low'
    return 'very-low'
}

// 计算并排视图数据
const splitDiffs = computed(() => {
    if (!compareResult.value) return []

    const pairs: Array<{
        left?: { type: string; content: string; lineNumber: number }
        right?: { type: string; content: string; lineNumber: number }
    }> = []

    let leftLineNumber = 1
    let rightLineNumber = 1

    compareResult.value.diffs.forEach(diff => {
        const lines = diff.value.split('\n').filter(line => line !== '' || diff.value.endsWith('\n'))

        lines.forEach((line) => {
            if (diff.type === 'unchanged') {
                pairs.push({
                    left: { type: 'unchanged', content: line, lineNumber: leftLineNumber++ },
                    right: { type: 'unchanged', content: line, lineNumber: rightLineNumber++ }
                })
            } else if (diff.type === 'removed') {
                pairs.push({
                    left: { type: 'removed', content: line, lineNumber: leftLineNumber++ },
                    right: undefined
                })
            } else if (diff.type === 'added') {
                pairs.push({
                    left: undefined,
                    right: { type: 'added', content: line, lineNumber: rightLineNumber++ }
                })
            }
        })
    })

    return pairs
})

// 高亮差异
const highlightDifferences = (content: string, type: string): string => {
    if (type === 'unchanged') return escapeHtml(content)

    return `<span class="highlight-${type}">${escapeHtml(content)}</span>`
}

// HTML转义
const escapeHtml = (text: string): string => {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
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

// 生命周期钩子
onMounted(() => {
    // 页面初始化逻辑
})
</script>
<style scoped>
.text-compare {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.compare-content {
    flex: 1;
    padding: 1.5rem;
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

.compare-content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

.compare-section {
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

.section-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* 文本面板样式 */
.compare-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.text-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.panel-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.panel-actions {
    display: flex;
    gap: 0.5rem;
}

.upload-btn,
.paste-btn,
.clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.upload-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.paste-btn:hover {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.clear-btn:hover {
    background: var(--error-color);
    color: white;
    border-color: var(--error-color);
}

.file-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    font-size: 0.875rem;
}

.file-name {
    color: var(--text-primary);
    font-weight: 500;
}

.file-size {
    color: var(--text-secondary);
}

.text-input {
    width: 100%;
    height: 300px;
    padding: 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'Courier New', monospace;
    resize: vertical;
    min-height: 200px;
    transition: all 0.2s ease;
}

.text-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.text-stats {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-secondary);
}

/* 比对选项样式 */
.compare-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
}

.option-group {
    display: flex;
    gap: 1.5rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
}

.checkbox-label input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: var(--primary-color);
}

.compare-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.compare-btn:hover:not(:disabled) {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.compare-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* 结果样式 */
.result-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.result-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
}

.summary-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.summary-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.summary-value {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
}

.summary-value.high {
    color: var(--success-color);
}

.summary-value.medium {
    color: var(--warning-color);
}

.summary-value.low {
    color: var(--error-color);
}

.summary-value.very-low {
    color: var(--error-color-dark);
}

.summary-value.added {
    color: var(--success-color);
}

.summary-value.removed {
    color: var(--error-color);
}

.diff-view {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    overflow: hidden;
}

.diff-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;
    gap: 1rem;
}

.diff-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.view-options {
    display: flex;
    gap: 0.25rem;
    background: var(--bg-primary);
    border-radius: 0.375rem;
    padding: 0.25rem;
}

.view-btn {
    padding: 0.375rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 0.25rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
    font-weight: 500;
}

.view-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.view-btn.active {
    background: var(--primary-color);
    color: white;
}

.diff-legend {
    display: flex;
    gap: 1rem;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.legend-item.added {
    color: var(--success-color);
}

.legend-item.removed {
    color: var(--error-color);
}

.legend-item.modified {
    color: var(--warning-color);
}

.diff-content {
    max-height: 400px;
    overflow-y: auto;
}

/* 统一视图 */
.diff-content.unified .diff-line {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    border-bottom: 1px solid var(--border-color);
    position: relative;
}

/* 并排视图 */
.diff-content.split {
    display: flex;
    flex-direction: column;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
}

.split-header {
    display: flex;
    background: var(--bg-tertiary);
    border-bottom: 2px solid var(--border-color);
}

.split-title {
    flex: 1;
    padding: 0.75rem 1rem;
    font-weight: 600;
    color: var(--text-primary);
    text-align: center;
    border-right: 1px solid var(--border-color);
}

.split-title:last-child {
    border-right: none;
}

.split-body {
    flex: 1;
    overflow-y: auto;
}

.diff-pair {
    display: flex;
    border-bottom: 1px solid var(--border-color);
}

.diff-side {
    flex: 1;
    display: flex;
    align-items: flex-start;
    padding: 0.25rem 0.5rem;
    min-height: 1.5rem;
    border-right: 1px solid var(--border-color);
}

.diff-side:last-child {
    border-right: none;
}

.diff-side.added {
    background: rgba(34, 197, 94, 0.1);
    border-left: 3px solid var(--success-color);
}

.diff-side.removed {
    background: rgba(239, 68, 68, 0.1);
    border-left: 3px solid var(--error-color);
}

.diff-side.unchanged {
    background: transparent;
}

.diff-side.empty {
    background: var(--bg-secondary);
}

.diff-side .line-number {
    width: 2.5rem;
    margin-right: 0.5rem;
    text-align: right;
    color: var(--text-secondary);
    font-size: 0.75rem;
    flex-shrink: 0;
}

.diff-side .line-content {
    flex: 1;
    white-space: pre-wrap;
    word-break: break-all;
}

.diff-side .line-content.empty {
    height: 1.2rem;
}

.diff-line {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    border-bottom: 1px solid var(--border-color);
    position: relative;
}

.diff-line.added {
    background: rgba(34, 197, 94, 0.1);
    border-left: 3px solid var(--success-color);
}

.diff-line.removed {
    background: rgba(239, 68, 68, 0.1);
    border-left: 3px solid var(--error-color);
}

.diff-line.modified {
    background: rgba(245, 158, 11, 0.1);
    border-left: 3px solid var(--warning-color);
}

.line-number {
    min-width: 3rem;
    color: var(--text-secondary);
    font-size: 0.75rem;
}

.line-prefix {
    min-width: 1.5rem;
    font-weight: 700;
    font-size: 1rem;
}

.diff-line.added .line-prefix {
    color: #28a745;
}

.diff-line.removed .line-prefix {
    color: #dc3545;
}

.diff-line.modified .line-prefix {
    color: #ffc107;
}

.line-content {
    flex: 1;
    word-break: break-all;
}

/* 使用说明区域 */
.help-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* 功能特点 - 4个卡片横向布局 */
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

/* 技术说明框 */
.diff-info {
    padding: 1.5rem;
    background: var(--primary-color-alpha);
    border: 1px solid var(--primary-color);
    border-radius: 0.5rem;
}

.diff-info h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.diff-info p {
    font-size: 0.875rem;
    color: var(--text-primary);
    line-height: 1.5;
    margin: 0 0 1.25rem 0;
}

.diff-info a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
}

.diff-info a:hover {
    text-decoration: underline;
}

.tech-features {
    margin-bottom: 1.25rem;
}

.feature-row {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.4;
}

.feature-row:last-child {
    margin-bottom: 0;
}

.feature-label {
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
    min-width: fit-content;
}

.feature-desc {
    color: var(--text-primary);
    flex: 1;
}

.tech-highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.tech-tag {
    padding: 0.25rem 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .features-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }

    .feature-card {
        padding: 1rem;
    }

    .feature-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
}

@media (max-width: 480px) {
    .features-grid {
        grid-template-columns: 1fr;
    }
}

/* 消息提示样式 */
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

/* 响应式设计 */
@media (max-width: 1024px) {
    .compare-container {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .result-summary {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .compare-content {
        padding: 1rem;
        gap: 1.5rem;
    }

    .compare-section {
        padding: 1rem;
    }

    .option-group {
        flex-direction: column;
        gap: 0.75rem;
    }

    .compare-options {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    .result-summary {
        grid-template-columns: 1fr;
    }

    .diff-legend {
        flex-direction: column;
        gap: 0.5rem;
    }
}

@media (max-width: 480px) {
    .compare-content {
        padding: 0.75rem;
        gap: 1rem;
    }

    .compare-section {
        padding: 0.75rem;
    }

    .text-input {
        height: 200px;
        min-height: 150px;
    }
}
</style>