<template>
    <div class="string-counter">
        <div class="counter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="counter-title">字符串长度统计</h2>
            <div class="counter-actions">
                <button class="action-btn" @click="clearText" title="清空">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="counter-content">
            <!-- 输入区域 -->
            <div class="input-section">
                <div class="section-header">
                    <h3>输入文本</h3>
                    <div class="quick-actions">
                        <button class="quick-btn" @click="pasteText" title="粘贴">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            </svg>
                            粘贴
                        </button>
                        <button class="quick-btn" @click="loadSample" title="示例">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                            </svg>
                            示例
                        </button>
                    </div>
                </div>
                <textarea v-model="inputText" class="text-input" placeholder="在此输入或粘贴文本..."
                    @input="updateStats"></textarea>
            </div>

            <!-- 统计结果 -->
            <div class="stats-section">
                <div class="section-header">
                    <h3>统计结果</h3>
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
                        <div class="stat-icon">🔢</div>
                        <div class="stat-content">
                            <div class="stat-label">数字字符</div>
                            <div class="stat-value">{{ stats.numbers }}</div>
                            <div class="stat-desc">0-9数字</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🔠</div>
                        <div class="stat-content">
                            <div class="stat-label">字母字符</div>
                            <div class="stat-value">{{ stats.letters }}</div>
                            <div class="stat-desc">A-Z a-z</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🈳</div>
                        <div class="stat-content">
                            <div class="stat-label">中文字符</div>
                            <div class="stat-value">{{ stats.chinese }}</div>
                            <div class="stat-desc">汉字字符</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">⚡</div>
                        <div class="stat-content">
                            <div class="stat-label">特殊符号</div>
                            <div class="stat-value">{{ stats.symbols }}</div>
                            <div class="stat-desc">标点符号等</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">⬜</div>
                        <div class="stat-content">
                            <div class="stat-label">空白字符</div>
                            <div class="stat-value">{{ stats.spaces }}</div>
                            <div class="stat-desc">空格、制表符</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🔡</div>
                        <div class="stat-content">
                            <div class="stat-label">大写字母</div>
                            <div class="stat-value">{{ stats.uppercase }}</div>
                            <div class="stat-desc">A-Z</div>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🔡</div>
                        <div class="stat-content">
                            <div class="stat-label">小写字母</div>
                            <div class="stat-value">{{ stats.lowercase }}</div>
                            <div class="stat-desc">a-z</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 详细分析 -->
            <div class="analysis-section">
                <div class="section-header">
                    <h3>详细分析</h3>
                </div>

                <div class="analysis-grid">
                    <div class="analysis-card">
                        <h4>📊 字符分布</h4>
                        <div class="analysis-item">
                            <span class="analysis-label">字母占比:</span>
                            <span class="analysis-value">{{ getPercentage(stats.letters, stats.totalChars) }}%</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">数字占比:</span>
                            <span class="analysis-value">{{ getPercentage(stats.numbers, stats.totalChars) }}%</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">中文占比:</span>
                            <span class="analysis-value">{{ getPercentage(stats.chinese, stats.totalChars) }}%</span>
                        </div>
                        <div class="analysis-item">
                            <span class="analysis-label">符号占比:</span>
                            <span class="analysis-value">{{ getPercentage(stats.symbols, stats.totalChars) }}%</span>
                        </div>
                    </div>

                    <div class="analysis-card">
                        <h4>📏 长度信息</h4>
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
                        <h4>⏱️ 阅读时间</h4>
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

defineEmits<{
    back: []
}>()

const inputText = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const stats = reactive({
    totalChars: 0,
    charsNoSpace: 0,
    bytes: 0,
    lines: 0,
    words: 0,
    numbers: 0,
    letters: 0,
    chinese: 0,
    symbols: 0,
    spaces: 0,
    uppercase: 0,
    lowercase: 0
})

// 更新统计信息
const updateStats = () => {
    const text = inputText.value

    // 总字符数
    stats.totalChars = text.length

    // 不含空格字符数
    stats.charsNoSpace = text.replace(/\s/g, '').length

    // 字节数 (UTF-8)
    stats.bytes = new Blob([text]).size

    // 行数
    stats.lines = text ? text.split('\n').length : 0

    // 单词数
    stats.words = text.trim() ? text.trim().split(/\s+/).length : 0

    // 数字字符
    stats.numbers = (text.match(/\d/g) || []).length

    // 字母字符
    stats.letters = (text.match(/[a-zA-Z]/g) || []).length

    // 中文字符
    stats.chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length

    // 大写字母
    stats.uppercase = (text.match(/[A-Z]/g) || []).length

    // 小写字母
    stats.lowercase = (text.match(/[a-z]/g) || []).length

    // 空白字符
    stats.spaces = (text.match(/\s/g) || []).length

    // 特殊符号
    stats.symbols = text.length - stats.letters - stats.numbers - stats.chinese - stats.spaces
}

// 计算百分比
const getPercentage = (part: number, total: number): string => {
    if (total === 0) return '0.0'
    return ((part / total) * 100).toFixed(1)
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

// 阅读时间 (假设每分钟200字)
const getReadingTime = (): string => {
    const wordsPerMinute = 200
    const minutes = stats.words / wordsPerMinute
    if (minutes < 1) return `${Math.round(minutes * 60)} 秒`
    return `${minutes.toFixed(1)} 分钟`
}

// 打字时间 (假设每分钟40字)
const getTypingTime = (): string => {
    const wordsPerMinute = 40
    const minutes = stats.words / wordsPerMinute
    if (minutes < 1) return `${Math.round(minutes * 60)} 秒`
    return `${minutes.toFixed(1)} 分钟`
}

// 语音时间 (假设每分钟150字)
const getSpeakingTime = (): string => {
    const wordsPerMinute = 150
    const minutes = stats.words / wordsPerMinute
    if (minutes < 1) return `${Math.round(minutes * 60)} 秒`
    return `${minutes.toFixed(1)} 分钟`
}

// 粘贴文本
const pasteText = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
        updateStats()
        showMessage('已粘贴文本', 'success')
    } catch (error) {
        showMessage('粘贴失败，请手动粘贴', 'error')
    }
}

// 加载示例
const loadSample = () => {
    inputText.value = `这是一个字符串长度统计工具的示例文本。
It can count characters, words, lines, and more!
支持中文、English、数字123、特殊符号!@#等各种字符。

功能特点：
1. 统计总字符数和不含空格的字符数
2. 计算字节数（UTF-8编码）
3. 统计行数和单词数
4. 分析字符类型分布
5. 估算阅读和打字时间

Try it out with your own text! 试试看吧！`
    updateStats()
    showMessage('已加载示例文本', 'success')
}

// 清空文本
const clearText = () => {
    inputText.value = ''
    updateStats()
    showMessage('已清空文本', 'success')
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error') => {
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
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
}

.counter-header {
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

.counter-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.counter-actions {
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

.counter-content {
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
.input-section,
.stats-section,
.analysis-section {
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
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
@media (max-width: 768px) {
    .counter-content {
        padding: 1rem 1rem 4rem 1rem;
        gap: 1.5rem;
    }

    .input-section,
    .stats-section,
    .analysis-section {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
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
    }

    .quick-actions {
        flex-direction: column;
        gap: 0.25rem;
    }

    .quick-btn {
        padding: 0.375rem 0.5rem;
        font-size: 0.75rem;
    }

    .message-toast {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
    }
}

@media (max-width: 480px) {
    .counter-header {
        padding: 0.75rem 1rem;
    }

    .counter-title {
        font-size: 1.125rem;
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
}
</style>