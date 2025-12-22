<template>
    <div class="base-converter">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">进制转换工具</h2>
        </div>

        <div class="converter-content">
            <!-- 主要转换区域 -->
            <div class="main-workspace">
                <div class="input-panel">
                    <div class="panel-header">
                        <h3>数值输入</h3>
                        <div class="base-selector">
                            <label>输入进制:</label>
                            <select v-model="inputBase" class="base-select" @change="convertNumber">
                                <option value="2">二进制 (BIN)</option>
                                <option value="8">八进制 (OCT)</option>
                                <option value="10">十进制 (DEC)</option>
                                <option value="16">十六进制 (HEX)</option>
                                <option value="32">三十二进制 (BASE32)</option>
                            </select>
                        </div>
                    </div>
                    <div class="input-area">
                        <input v-model="inputValue" type="text" class="number-input"
                            :placeholder="getNumberPlaceholder()" @input="convertNumber" />
                        <div class="input-info">
                            <div class="input-hint">{{ getInputHint() }}</div>
                            <div class="base-info">{{ getBaseInfo() }}</div>
                        </div>
                    </div>

                    <!-- 快速示例 -->
                    <div class="quick-examples">
                        <h4>快速示例</h4>
                        <div class="examples-grid">
                            <button class="example-btn" @click="setExample('255')" title="8位最大值">
                                <span class="example-label">255</span>
                                <span class="example-desc">8位最大</span>
                            </button>
                            <button class="example-btn" @click="setExample('1024')" title="1KB字节数">
                                <span class="example-label">1024</span>
                                <span class="example-desc">1KB</span>
                            </button>
                            <button class="example-btn" @click="setExample('65535')" title="16位最大值">
                                <span class="example-label">65535</span>
                                <span class="example-desc">16位最大</span>
                            </button>
                            <button class="example-btn" @click="setExample('16777215')" title="RGB颜色最大值">
                                <span class="example-label">16777215</span>
                                <span class="example-desc">RGB最大</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="results-panel">
                    <div class="panel-header">
                        <h3>转换结果</h3>
                        <div class="clear-actions">
                            <button class="action-btn" @click="clearAll" title="清空所有">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                清空
                            </button>
                        </div>
                    </div>
                    <div class="results-list">
                        <div class="result-row" :class="{ active: inputBase === '2' }">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">二进制</span>
                                    <span class="base-code">BIN</span>
                                    <span v-if="inputBase === '2'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">计算机基础，只用0和1</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.binary || '0'" class="result-input" readonly
                                    @click="selectAll" />
                                <button class="copy-btn" @click="copyResult(results.binary)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputBase === '8' }">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">八进制</span>
                                    <span class="base-code">OCT</span>
                                    <span v-if="inputBase === '8'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">Unix权限系统常用</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.octal || '0'" class="result-input" readonly @click="selectAll" />
                                <button class="copy-btn" @click="copyResult(results.octal)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputBase === '10' }">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">十进制</span>
                                    <span class="base-code">DEC</span>
                                    <span v-if="inputBase === '10'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">日常使用的数字系统</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.decimal || '0'" class="result-input" readonly
                                    @click="selectAll" />
                                <button class="copy-btn" @click="copyResult(results.decimal)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputBase === '16' }">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">十六进制</span>
                                    <span class="base-code">HEX</span>
                                    <span v-if="inputBase === '16'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">颜色代码、内存地址</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.hexadecimal || '0'" class="result-input" readonly
                                    @click="selectAll" />
                                <button class="copy-btn" @click="copyResult(results.hexadecimal)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputBase === '32' }">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">三十二进制</span>
                                    <span class="base-code">BASE32</span>
                                    <span v-if="inputBase === '32'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">数据编码、短链接</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.base32 || '0'" class="result-input" readonly
                                    @click="selectAll" />
                                <button class="copy-btn" @click="copyResult(results.base32)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 进制说明 -->
            <div class="knowledge-section">
                <h3>进制说明</h3>
                <div class="knowledge-grid">
                    <div class="knowledge-card">
                        <div class="knowledge-header">
                            <span class="knowledge-icon">🔢</span>
                            <h4>二进制 (Binary)</h4>
                        </div>
                        <p>基数：2，使用数字：0、1。计算机内部数据存储和处理的基础，每一位代表2的幂次。</p>
                    </div>

                    <div class="knowledge-card">
                        <div class="knowledge-header">
                            <span class="knowledge-icon">🔧</span>
                            <h4>八进制 (Octal)</h4>
                        </div>
                        <p>基数：8，使用数字：0-7。常用于Unix/Linux文件权限设置，如755表示rwxr-xr-x权限。</p>
                    </div>

                    <div class="knowledge-card">
                        <div class="knowledge-header">
                            <span class="knowledge-icon">📊</span>
                            <h4>十进制 (Decimal)</h4>
                        </div>
                        <p>基数：10，使用数字：0-9。日常生活中使用的标准数字系统，所有进制转换的基准。</p>
                    </div>

                    <div class="knowledge-card">
                        <div class="knowledge-header">
                            <span class="knowledge-icon">🎨</span>
                            <h4>十六进制 (Hexadecimal)</h4>
                        </div>
                        <p>基数：16，使用字符：0-9、A-F。广泛用于颜色代码(#FF0000)、内存地址、哈希值等。</p>
                    </div>

                    <div class="knowledge-card">
                        <div class="knowledge-header">
                            <span class="knowledge-icon">🔗</span>
                            <h4>三十二进制 (Base32)</h4>
                        </div>
                        <p>基数：32，使用字符：0-9、A-V。用于数据编码、短链接生成，避免易混淆字符。</p>
                    </div>

                    <div class="knowledge-card">
                        <div class="knowledge-header">
                            <span class="knowledge-icon">💡</span>
                            <h4>转换方法</h4>
                        </div>
                        <p>任意进制转十进制：按位权展开求和。十进制转任意进制：连续除法取余数。</p>
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

// 数字进制转换
const inputValue = ref('')
const inputBase = ref('10')
const results = ref({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: '',
    base32: ''
})

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 数字进制转换函数
const convertNumber = () => {
    if (!inputValue.value.trim()) {
        results.value = {
            binary: '',
            octal: '',
            decimal: '',
            hexadecimal: '',
            base32: ''
        }
        return
    }

    try {
        // 验证输入是否符合当前进制
        const base = parseInt(inputBase.value)
        const value = inputValue.value.trim().toUpperCase()

        // 验证字符是否合法
        if (!isValidForBase(value, base)) {
            throw new Error('输入包含无效字符')
        }

        // 转换为十进制
        const decimalValue = parseInt(value, base)

        if (isNaN(decimalValue)) {
            throw new Error('无效的数值')
        }

        // 转换到各个进制
        results.value = {
            binary: decimalValue.toString(2),
            octal: decimalValue.toString(8),
            decimal: decimalValue.toString(10),
            hexadecimal: decimalValue.toString(16).toUpperCase(),
            base32: decimalValue.toString(32).toUpperCase()
        }
    } catch (error) {
        results.value = {
            binary: '错误',
            octal: '错误',
            decimal: '错误',
            hexadecimal: '错误',
            base32: '错误'
        }
    }
}

// 验证输入字符是否符合进制要求
const isValidForBase = (value: string, base: number): boolean => {
    const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUV'.slice(0, base)
    return value.split('').every(char => validChars.includes(char))
}

// 获取数字输入提示
const getNumberPlaceholder = () => {
    const placeholders = {
        '2': '例如: 1010',
        '8': '例如: 755',
        '10': '例如: 255',
        '16': '例如: FF',
        '32': '例如: 7V'
    }
    return placeholders[inputBase.value as keyof typeof placeholders] || '输入数值'
}

// 获取输入提示
const getInputHint = () => {
    const hints = {
        '2': '只能包含 0 和 1',
        '8': '只能包含 0-7',
        '10': '只能包含 0-9',
        '16': '只能包含 0-9 和 A-F',
        '32': '只能包含 0-9 和 A-V'
    }
    return hints[inputBase.value as keyof typeof hints] || ''
}

// 获取进制信息
const getBaseInfo = () => {
    const infos = {
        '2': '基数: 2 | 符号: 0,1',
        '8': '基数: 8 | 符号: 0-7',
        '10': '基数: 10 | 符号: 0-9',
        '16': '基数: 16 | 符号: 0-9,A-F',
        '32': '基数: 32 | 符号: 0-9,A-V'
    }
    return infos[inputBase.value as keyof typeof infos] || ''
}

// 清空所有
const clearAll = () => {
    inputValue.value = ''
    results.value = {
        binary: '',
        octal: '',
        decimal: '',
        hexadecimal: '',
        base32: ''
    }
    showMessage('已清空所有内容', 'success')
}

// 复制结果
const copyResult = async (value: string) => {
    if (!value || value === '错误') return

    try {
        await navigator.clipboard.writeText(value)
        showMessage('已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 选中全部文本
const selectAll = (event: Event) => {
    const input = event.target as HTMLInputElement
    input.select()
}

// 设置示例值
const setExample = (value: string) => {
    inputValue.value = value
    inputBase.value = '10' // 示例都是十进制
    convertNumber()
    showMessage(`已设置示例值: ${value}`, 'success')
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
convertNumber()
</script>
<style scoped>
.base-converter {
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
}

.back-btn:hover {
    background: var(--bg-hover);
}

.converter-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
}

.converter-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    padding-bottom: 3rem;
    overflow-y: auto;
    gap: 1.5rem;
    min-height: 0;
}

.main-workspace {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
}

.input-panel,
.results-panel {
    display: flex;
    flex-direction: column;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
}

.panel-header h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
}

.base-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.base-selector label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
}

.base-select {
    padding: 0.375rem 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    min-width: 140px;
}

.clear-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.input-area {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.number-input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 1.125rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    font-weight: 500;
    transition: all 0.2s ease;
}

.number-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-light, rgba(99, 102, 241, 0.1));
}

.input-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.input-hint {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-style: italic;
}

.base-info {
    font-size: 0.75rem;
    color: var(--primary-color);
    font-weight: 500;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}

.quick-examples {
    padding: 1.5rem;
    border-top: 1px solid var(--border-color);
}

.quick-examples h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
    color: var(--text-primary);
}

.examples-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
}

.example-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
    padding: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.example-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.example-label {
    font-size: 0.75rem;
    font-weight: 600;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    color: var(--primary-color);
}

.example-desc {
    font-size: 0.625rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.results-list {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.result-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 0.5rem;
    transition: all 0.2s ease;
}

.result-row:hover {
    background: var(--bg-hover);
}

.result-row.active {
    border-color: var(--primary-color);
    background: var(--primary-color-light, rgba(99, 102, 241, 0.05));
}

.result-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 100px;
    flex-shrink: 0;
}

.result-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.base-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.base-code {
    font-size: 0.625rem;
    font-weight: 500;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}

.active-indicator {
    font-size: 0.625rem;
    font-weight: 600;
    color: white;
    background: var(--primary-color);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}

.result-desc {
    font-size: 0.625rem;
    color: var(--text-secondary);
    line-height: 1.3;
}

.result-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.result-input {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.result-input:hover {
    border-color: var(--primary-color);
}

.result-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-light, rgba(99, 102, 241, 0.1));
}

.copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.copy-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.knowledge-section {
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
    margin-bottom: 3rem;
}

.knowledge-section h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: var(--text-primary);
    text-align: center;
}

.knowledge-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.knowledge-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: all 0.2s ease;
}

.knowledge-card:hover {
    background: var(--bg-tertiary);
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color, rgba(0, 0, 0, 0.1));
}

.knowledge-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.knowledge-icon {
    font-size: 1.25rem;
}

.knowledge-header h4 {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
}

.knowledge-card p {
    font-size: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

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

@media (max-width: 1024px) {
    .main-workspace {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .knowledge-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }

    .examples-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 768px) {
    .converter-content {
        padding: 0.75rem;
        padding-bottom: 3rem;
        gap: 1rem;
    }

    .converter-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
        padding: 1rem;
    }

    .main-workspace {
        gap: 1rem;
    }

    .panel-header {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
    }

    .base-selector {
        justify-content: space-between;
    }

    .knowledge-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .examples-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .result-row {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
    }

    .result-info {
        min-width: auto;
    }

    .knowledge-card {
        padding: 1rem;
    }

    .knowledge-header h4 {
        font-size: 0.8125rem;
    }

    .knowledge-card p {
        font-size: 0.6875rem;
    }
}
</style>