<template>
    <div class="text-compare">
        <div class="compare-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="compare-title">文本比对</h2>
            <div class="compare-actions">
                <button class="action-btn" @click="clearAll" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

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
                            <div class="diff-legend">
                                <span class="legend-item added">+ 新增</span>
                                <span class="legend-item removed">- 删除</span>
                                <span class="legend-item modified">~ 修改</span>
                            </div>
                        </div>
                        <div class="diff-content">
                            <div v-for="(diff, index) in compareResult.diffs" :key="index" class="diff-line"
                                :class="diff.type">
                                <span class="line-number">{{ diff.lineNumber }}</span>
                                <span class="line-prefix">{{ diff.prefix }}</span>
                                <span class="line-content">{{ diff.content }}</span>
                            </div>
                        </div>
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
import { ref } from 'vue'

defineEmits<{
    back: []
}>()

// 基本状态
const textA = ref('')
const textB = ref('')
const fileInputA = ref<HTMLInputElement>()
const fileInputB = ref<HTMLInputElement>()
const fileInfoA = ref<{ name: string; size: number } | null>(null)
const fileInfoB = ref<{ name: string; size: number } | null>(null)

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
        type: 'added' | 'removed' | 'modified' | 'unchanged'
        lineNumber: number
        prefix: string
        content: string
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

// 计算文本相似度
const calculateSimilarity = (text1: string, text2: string): number => {
    if (text1 === text2) return 100
    if (!text1 || !text2) return 0

    const longer = text1.length > text2.length ? text1 : text2
    const shorter = text1.length > text2.length ? text2 : text1

    if (longer.length === 0) return 100

    const editDistance = getEditDistance(longer, shorter)
    return ((longer.length - editDistance) / longer.length) * 100
}

// 计算编辑距离
const getEditDistance = (str1: string, str2: string): number => {
    const len1 = str1.length
    const len2 = str2.length

    // 创建二维数组
    const dp: number[][] = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0))

    // 初始化第一行和第一列
    for (let i = 0; i <= len1; i++) {
        dp[0]![i] = i
    }
    for (let i = 0; i <= len2; i++) {
        dp[i]![0] = i
    }

    // 填充dp表
    for (let i = 1; i <= len2; i++) {
        for (let j = 1; j <= len1; j++) {
            if (str2[i - 1] === str1[j - 1]) {
                dp[i]![j] = dp[i - 1]![j - 1]!
            } else {
                dp[i]![j] = Math.min(
                    dp[i - 1]![j]! + 1,     // 删除
                    dp[i]![j - 1]! + 1,     // 插入
                    dp[i - 1]![j - 1]! + 1  // 替换
                )
            }
        }
    }

    return dp[len2]![len1]!
}

// 比对文本
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

    const linesA = processedA.split('\n')
    const linesB = processedB.split('\n')

    const similarity = calculateSimilarity(processedA, processedB)
    const diffs = generateDiff(linesA, linesB)

    let addedLines = 0
    let removedLines = 0
    let diffLines = 0

    diffs.forEach(diff => {
        if (diff.type === 'added') addedLines++
        else if (diff.type === 'removed') removedLines++
        else if (diff.type === 'modified') diffLines++
    })

    compareResult.value = {
        similarity,
        diffLines,
        addedLines,
        removedLines,
        diffs
    }
}

// 生成差异
const generateDiff = (linesA: string[], linesB: string[]) => {
    const diffs: Array<{
        type: 'added' | 'removed' | 'modified' | 'unchanged'
        lineNumber: number
        prefix: string
        content: string
    }> = []

    const maxLines = Math.max(linesA.length, linesB.length)

    for (let i = 0; i < maxLines; i++) {
        const lineA = linesA[i]
        const lineB = linesB[i]

        if (lineA === undefined && lineB !== undefined) {
            diffs.push({
                type: 'added',
                lineNumber: i + 1,
                prefix: '+',
                content: lineB
            })
        } else if (lineB === undefined && lineA !== undefined) {
            diffs.push({
                type: 'removed',
                lineNumber: i + 1,
                prefix: '-',
                content: lineA
            })
        } else if (lineA !== undefined && lineB !== undefined && lineA !== lineB) {
            diffs.push({
                type: 'removed',
                lineNumber: i + 1,
                prefix: '-',
                content: lineA
            })
            diffs.push({
                type: 'added',
                lineNumber: i + 1,
                prefix: '+',
                content: lineB
            })
        } else if (lineA !== undefined && lineB !== undefined && lineA === lineB) {
            diffs.push({
                type: 'unchanged',
                lineNumber: i + 1,
                prefix: ' ',
                content: lineA
            })
        }
    }

    return diffs.filter(diff => diff.type !== 'unchanged')
}

// 获取相似度样式类
const getSimilarityClass = (similarity: number): string => {
    if (similarity >= 90) return 'high'
    if (similarity >= 70) return 'medium'
    if (similarity >= 50) return 'low'
    return 'very-low'
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
.text-compare {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.compare-header {
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
    box-shadow: var(--shadow-md);
}

.compare-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.compare-actions {
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
    box-shadow: var(--shadow-md);
}

.compare-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
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
}

.diff-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.diff-legend {
    display: flex;
    gap: 1rem;
}

.legend-item {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-weight: 500;
    border-left: 3px solid;
}

.legend-item.added {
    background: #e6ffed;
    color: #28a745;
    border-left-color: #28a745;
}

.legend-item.removed {
    background: #ffeef0;
    color: #dc3545;
    border-left-color: #dc3545;
}

.legend-item.modified {
    background: #fff3cd;
    color: #856404;
    border-left-color: #ffc107;
}

/* 深色模式下的图例配色 */
@media (prefers-color-scheme: dark) {
    .legend-item.added {
        background: #0d4427;
        color: #28a745;
    }

    .legend-item.removed {
        background: #5a1e1e;
        color: #dc3545;
    }

    .legend-item.modified {
        background: #4a3728;
        color: #ffc107;
    }
}

.diff-content {
    max-height: 400px;
    overflow-y: auto;
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
    background: #e6ffed;
    border-left: 3px solid #28a745;
}

.diff-line.removed {
    background: #ffeef0;
    border-left: 3px solid #dc3545;
}

.diff-line.modified {
    background: #fff3cd;
    border-left: 3px solid #ffc107;
}

/* 深色模式下的配色 */
@media (prefers-color-scheme: dark) {
    .diff-line.added {
        background: #0d4427;
        border-left-color: #28a745;
    }

    .diff-line.removed {
        background: #5a1e1e;
        border-left-color: #dc3545;
    }

    .diff-line.modified {
        background: #4a3728;
        border-left-color: #ffc107;
    }
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
    .compare-header {
        padding: 0.75rem 1rem;
    }

    .compare-title {
        font-size: 1.125rem;
    }

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