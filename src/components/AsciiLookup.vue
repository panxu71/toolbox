<template>
    <div class="ascii-lookup">
        <div class="tool-header">
            <div class="header-left">
                <button @click="$emit('back')" class="back-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    返回
                </button>
                <div class="title-section">
                    <h2>ASCII编码查询</h2>
                    <p>查询字符的ASCII编码值和ASCII表</p>
                </div>
            </div>
            <div class="header-actions">
                <button @click="clearAll" class="action-btn" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="lookup-content">
            <!-- 主要内容区域 -->
            <div class="main-content">
                <!-- 查询区域 -->
                <div class="query-section">
                    <div class="section-header">
                        <h3>字符查询</h3>
                        <div class="mode-toggle">
                            <button 
                                class="mode-btn"
                                :class="{ active: queryMode === 'char' }"
                                @click="setQueryMode('char')"
                            >
                                字符→编码
                            </button>
                            <button 
                                class="mode-btn"
                                :class="{ active: queryMode === 'code' }"
                                @click="setQueryMode('code')"
                            >
                                编码→字符
                            </button>
                        </div>
                    </div>

                    <div class="query-content">
                        <!-- 字符查询模式 -->
                        <div v-if="queryMode === 'char'" class="char-query">
                            <div class="input-section">
                                <label class="input-label">输入字符</label>
                                <div class="input-wrapper">
                                    <input 
                                        v-model="inputChar" 
                                        type="text" 
                                        class="char-input" 
                                        placeholder="输入单个字符"
                                        maxlength="1"
                                        @input="handleCharInput"
                                    />
                                    <button v-if="inputChar" @click="clearInput" class="clear-btn" title="清空">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="quick-chars">
                                <span class="quick-label">常用字符：</span>
                                <div class="char-buttons">
                                    <button 
                                        v-for="char in commonChars" 
                                        :key="char"
                                        class="char-btn"
                                        @click="selectChar(char)"
                                    >
                                        {{ char }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 编码查询模式 -->
                        <div v-if="queryMode === 'code'" class="code-query">
                            <div class="input-section">
                                <label class="input-label">输入ASCII编码</label>
                                <div class="input-wrapper">
                                    <input 
                                        v-model="inputCode" 
                                        type="number" 
                                        class="code-input" 
                                        placeholder="0-127"
                                        min="0"
                                        max="127"
                                        @input="handleCodeInput"
                                    />
                                    <button v-if="inputCode" @click="clearInput" class="clear-btn" title="清空">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div class="quick-codes">
                                <span class="quick-label">常用编码：</span>
                                <div class="code-buttons">
                                    <button 
                                        v-for="code in commonCodes" 
                                        :key="code"
                                        class="code-btn"
                                        @click="selectCode(code)"
                                    >
                                        {{ code }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 查询结果 -->
                <div v-if="queryResult" class="result-section">
                    <div class="result-card">
                        <div class="result-header">
                            <h4>查询结果</h4>
                            <button @click="copyResult" class="copy-result-btn" title="复制结果">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="result-content">
                            <div class="result-grid">
                                <div class="result-item">
                                    <span class="result-label">字符</span>
                                    <span class="result-value char-value">{{ queryResult.char }}</span>
                                </div>
                                <div class="result-item">
                                    <span class="result-label">ASCII</span>
                                    <span class="result-value code-value">{{ queryResult.code }}</span>
                                </div>
                                <div class="result-item">
                                    <span class="result-label">十六进制</span>
                                    <span class="result-value hex-value">0x{{ queryResult.hex }}</span>
                                </div>
                                <div class="result-item">
                                    <span class="result-label">二进制</span>
                                    <span class="result-value binary-value">{{ queryResult.binary }}</span>
                                </div>
                            </div>
                            <div class="result-description">
                                <span class="desc-label">描述：</span>
                                <span class="desc-value">{{ queryResult.description }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ASCII表格 -->
            <div class="ascii-table-section">
                <div class="section-header">
                    <h3>ASCII编码表</h3>
                    <div class="table-controls">
                        <button 
                            class="filter-btn"
                            :class="{ active: tableFilter === 'all' }"
                            @click="setTableFilter('all')"
                        >
                            全部 (128)
                        </button>
                        <button 
                            class="filter-btn"
                            :class="{ active: tableFilter === 'printable' }"
                            @click="setTableFilter('printable')"
                        >
                            可打印 (95)
                        </button>
                        <button 
                            class="filter-btn"
                            :class="{ active: tableFilter === 'control' }"
                            @click="setTableFilter('control')"
                        >
                            控制字符 (33)
                        </button>
                    </div>
                </div>

                <div class="ascii-table">
                    <div class="table-header">
                        <div class="header-cell">编码</div>
                        <div class="header-cell">字符</div>
                        <div class="header-cell">十六进制</div>
                        <div class="header-cell">描述</div>
                    </div>
                    <div class="table-body">
                        <div 
                            v-for="ascii in filteredAsciiTable" 
                            :key="ascii.code"
                            class="table-row"
                            :class="{ 
                                highlighted: queryResult && queryResult.code === ascii.code,
                                control: ascii.code < 32 || ascii.code === 127
                            }"
                            @click="selectFromTable(ascii)"
                        >
                            <div class="table-cell code-cell">{{ ascii.code }}</div>
                            <div class="table-cell char-cell">
                                <span class="char-display">{{ ascii.char }}</span>
                            </div>
                            <div class="table-cell hex-cell">0x{{ ascii.hex }}</div>
                            <div class="table-cell desc-cell">{{ ascii.description }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 状态提示 -->
        <div v-if="message" :class="['message', messageType]">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {  ref, computed, onMounted, onUnmounted  } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'

defineEmits<{
    back: []
}>()

interface AsciiInfo {
    code: number
    char: string
    hex: string
    binary: string
    description: string
}

// 查询模式
// 使用页面标题管理
usePageTitle('ascii-lookup')

const queryMode = ref<'char' | 'code'>('char')

// 输入值
const inputChar = ref('')
const inputCode = ref('')

// 查询结果
const queryResult = ref<AsciiInfo | null>(null)

// 表格过滤
const tableFilter = ref<'all' | 'printable' | 'control'>('all')

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 常用字符
const commonChars = ['A', 'a', '0', ' ', '!', '@', '#', '$', '%', '&', '*', '+', '-', '=', '?']

// 常用编码
const commonCodes = [32, 48, 65, 97, 33, 64, 35, 36, 37, 38, 42, 43, 45, 61, 63]

// ASCII表数据
const asciiTable = ref<AsciiInfo[]>([])

// 生成ASCII表
const generateAsciiTable = (): AsciiInfo[] => {
    const table: AsciiInfo[] = []
    
    // 控制字符描述
    const controlChars: Record<number, { name: string, desc: string }> = {
        0: { name: 'NUL', desc: '空字符 (Null)' },
        1: { name: 'SOH', desc: '标题开始 (Start of Heading)' },
        2: { name: 'STX', desc: '正文开始 (Start of Text)' },
        3: { name: 'ETX', desc: '正文结束 (End of Text)' },
        4: { name: 'EOT', desc: '传输结束 (End of Transmission)' },
        5: { name: 'ENQ', desc: '询问字符 (Enquiry)' },
        6: { name: 'ACK', desc: '确认字符 (Acknowledge)' },
        7: { name: 'BEL', desc: '响铃 (Bell)' },
        8: { name: 'BS', desc: '退格 (Backspace)' },
        9: { name: 'HT', desc: '水平制表 (Horizontal Tab)' },
        10: { name: 'LF', desc: '换行 (Line Feed)' },
        11: { name: 'VT', desc: '垂直制表 (Vertical Tab)' },
        12: { name: 'FF', desc: '换页 (Form Feed)' },
        13: { name: 'CR', desc: '回车 (Carriage Return)' },
        14: { name: 'SO', desc: '移出 (Shift Out)' },
        15: { name: 'SI', desc: '移入 (Shift In)' },
        16: { name: 'DLE', desc: '数据链路转义 (Data Link Escape)' },
        17: { name: 'DC1', desc: '设备控制1 (Device Control 1)' },
        18: { name: 'DC2', desc: '设备控制2 (Device Control 2)' },
        19: { name: 'DC3', desc: '设备控制3 (Device Control 3)' },
        20: { name: 'DC4', desc: '设备控制4 (Device Control 4)' },
        21: { name: 'NAK', desc: '否定确认 (Negative Acknowledge)' },
        22: { name: 'SYN', desc: '同步空闲 (Synchronous Idle)' },
        23: { name: 'ETB', desc: '传输块结束 (End of Transmission Block)' },
        24: { name: 'CAN', desc: '取消 (Cancel)' },
        25: { name: 'EM', desc: '媒介结束 (End of Medium)' },
        26: { name: 'SUB', desc: '替换 (Substitute)' },
        27: { name: 'ESC', desc: '转义 (Escape)' },
        28: { name: 'FS', desc: '文件分隔符 (File Separator)' },
        29: { name: 'GS', desc: '组分隔符 (Group Separator)' },
        30: { name: 'RS', desc: '记录分隔符 (Record Separator)' },
        31: { name: 'US', desc: '单元分隔符 (Unit Separator)' },
        127: { name: 'DEL', desc: '删除 (Delete)' }
    }
    
    for (let i = 0; i <= 127; i++) {
        let char = ''
        let description = ''
        
        if (i < 32 || i === 127) {
            // 控制字符
            const control = controlChars[i]
            if (control) {
                char = control.name
                description = control.desc
            } else {
                char = `C${i}`
                description = `控制字符 ${i}`
            }
        } else if (i === 32) {
            // 空格字符
            char = 'SP'
            description = '空格 (Space)'
        } else {
            // 可打印字符
            char = String.fromCharCode(i)
            if (i >= 48 && i <= 57) {
                description = `数字 ${char}`
            } else if (i >= 65 && i <= 90) {
                description = `大写字母 ${char}`
            } else if (i >= 97 && i <= 122) {
                description = `小写字母 ${char}`
            } else {
                description = `符号 ${char}`
            }
        }
        
        table.push({
            code: i,
            char,
            hex: i.toString(16).toUpperCase().padStart(2, '0'),
            binary: i.toString(2).padStart(8, '0'),
            description
        })
    }
    
    return table
}

// 过滤后的ASCII表
const filteredAsciiTable = computed(() => {
    switch (tableFilter.value) {
        case 'printable':
            return asciiTable.value.filter(item => item.code >= 32 && item.code <= 126)
        case 'control':
            return asciiTable.value.filter(item => item.code < 32 || item.code === 127)
        default:
            return asciiTable.value
    }
})

// 设置查询模式
const setQueryMode = (mode: 'char' | 'code') => {
    queryMode.value = mode
    clearInput()
}

// 设置表格过滤
const setTableFilter = (filter: 'all' | 'printable' | 'control') => {
    tableFilter.value = filter
}

// 处理字符输入
const handleCharInput = () => {
    if (inputChar.value) {
        const code = inputChar.value.charCodeAt(0)
        if (code <= 127) {
            const ascii = asciiTable.value.find(item => item.code === code)
            if (ascii) {
                queryResult.value = ascii
                showMessage(`查询到字符 "${inputChar.value}" 的ASCII编码`, 'success')
            }
        } else {
            queryResult.value = null
            showMessage('输入的字符不在ASCII范围内（0-127）', 'error')
        }
    } else {
        queryResult.value = null
    }
}

// 处理编码输入
const handleCodeInput = () => {
    const code = parseInt(inputCode.value)
    if (!isNaN(code) && code >= 0 && code <= 127) {
        const ascii = asciiTable.value.find(item => item.code === code)
        if (ascii) {
            queryResult.value = ascii
            showMessage(`查询到编码 ${code} 对应的字符`, 'success')
        }
    } else if (inputCode.value) {
        queryResult.value = null
        showMessage('请输入0-127之间的数字', 'error')
    } else {
        queryResult.value = null
    }
}

// 选择字符
const selectChar = (char: string) => {
    inputChar.value = char
    handleCharInput()
}

// 选择编码
const selectCode = (code: number) => {
    inputCode.value = code.toString()
    handleCodeInput()
}

// 从表格选择
const selectFromTable = (ascii: AsciiInfo) => {
    queryResult.value = ascii
    if (queryMode.value === 'char') {
        // 对于控制字符，不设置输入框的值
        if (ascii.code < 32 || ascii.code === 127) {
            inputChar.value = ''
        } else {
            inputChar.value = ascii.code === 32 ? ' ' : ascii.char
        }
    } else {
        inputCode.value = ascii.code.toString()
    }
    showMessage(`已选择 ${ascii.description}`, 'success')
}

// 清空输入
const clearInput = () => {
    inputChar.value = ''
    inputCode.value = ''
    queryResult.value = null
}

// 清空所有
const clearAll = () => {
    clearInput()
    queryMode.value = 'char'
    tableFilter.value = 'all'
    showMessage('已清空所有内容', 'success')
}

// 复制结果
const copyResult = async () => {
    if (!queryResult.value) return
    
    const result = `字符: ${queryResult.value.char}
ASCII编码: ${queryResult.value.code}
十六进制: 0x${queryResult.value.hex}
二进制: ${queryResult.value.binary}
描述: ${queryResult.value.description}`
    
    try {
        await navigator.clipboard.writeText(result)
        showMessage('查询结果已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 显示消息
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 初始化
onMounted(() => {asciiTable.value = generateAsciiTable()
    showMessage('ASCII编码查询工具已加载', 'success')
})

</script>
<style scoped>
.ascii-lookup {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.tool-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.back-button {
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

.back-button:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.title-section h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.title-section p {
    margin: 4px 0 0 0;
    color: var(--text-secondary);
    font-size: 14px;
}

.header-actions {
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

.action-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.lookup-content {
    flex: 1;
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 24px;
    padding: 24px;
    overflow: hidden;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

.main-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
}

/* 查询区域 */
.query-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    flex-shrink: 0;
}

.result-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-tertiary);
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.mode-toggle,
.table-controls {
    display: flex;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.mode-btn,
.filter-btn {
    padding: 6px 12px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 12px;
    font-weight: 500;
    border-right: 1px solid var(--border-color);
}

.mode-btn:last-child,
.filter-btn:last-child {
    border-right: none;
}

.mode-btn:hover,
.filter-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.mode-btn.active,
.filter-btn.active {
    background: var(--primary-color);
    color: white;
}

.query-content {
    padding: 20px;
}

.input-section {
    margin-bottom: 16px;
}

.input-label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.char-input,
.code-input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
}

.char-input {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    padding: 12px 14px;
}

.char-input:focus,
.code-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.clear-btn {
    position: absolute;
    right: 8px;
    width: 28px;
    height: 28px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.clear-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.quick-chars,
.quick-codes {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.quick-label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
}

.char-buttons,
.code-buttons {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
}

.char-btn,
.code-btn {
    padding: 6px 8px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 11px;
    font-weight: 500;
    text-align: center;
}

.char-btn:hover,
.code-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* 查询结果 */
.result-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
}

.result-header h4 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
}

.copy-result-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: var(--primary-color);
    color: white;
    border: 1px solid var(--primary-color);
    border-radius: var(--radius-sm);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.copy-result-btn:hover {
    background: var(--primary-color-dark, #4f46e5);
}

.result-content {
    padding: 16px;
}

.result-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
}

.result-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    text-align: center;
}

.result-label {
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 500;
}

.result-value {
    font-size: 13px;
    color: var(--text-primary);
    font-weight: 600;
}

.char-value {
    font-size: 16px;
    padding: 4px 6px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-family: monospace;
    min-width: 40px;
    text-align: center;
}

.code-value,
.hex-value,
.binary-value {
    font-family: monospace;
    font-size: 12px;
}

.result-description {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
}

.desc-label {
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 500;
}

.desc-value {
    font-size: 12px;
    color: var(--primary-color);
    font-weight: 500;
}

/* ASCII表格 */
.ascii-table-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.ascii-table {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.table-header {
    display: grid;
    grid-template-columns: 70px 70px 90px 1fr;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 1;
}

.header-cell {
    padding: 10px 12px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    border-right: 1px solid var(--border-color);
}

.header-cell:last-child {
    border-right: none;
}

.table-body {
    display: flex;
    flex-direction: column;
}

.table-row {
    display: grid;
    grid-template-columns: 70px 70px 90px 1fr;
    cursor: pointer;
    transition: var(--transition);
    border-bottom: 1px solid var(--border-color);
}

.table-row:hover {
    background: var(--bg-tertiary);
}

.table-row.highlighted {
    background: rgba(99, 102, 241, 0.1);
    border-color: var(--primary-color);
}

.table-row.control {
    background: rgba(239, 68, 68, 0.05);
}

.table-row.control:hover {
    background: rgba(239, 68, 68, 0.1);
}

.table-cell {
    padding: 8px 12px;
    font-size: 12px;
    border-right: 1px solid var(--border-color);
    display: flex;
    align-items: center;
}

.table-cell:last-child {
    border-right: none;
}

.code-cell,
.hex-cell {
    font-family: monospace;
    font-weight: 600;
    color: var(--primary-color);
    justify-content: center;
}

.char-cell {
    justify-content: center;
}

.char-display {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 4px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    min-width: 20px;
    text-align: center;
    font-family: monospace;
}

.table-row.control .char-display {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: #dc2626;
    font-size: 10px;
}

.desc-cell {
    color: var(--text-secondary);
    font-size: 11px;
}

.message {
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

.message.success {
    background: #10b981;
    color: white;
}

.message.error {
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

/* 响应式设计 */
@media (max-width: 1024px) {
    .lookup-content {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        gap: 16px;
        padding: 16px;
    }
    
    .main-content {
        order: 1;
    }
    
    .ascii-table-section {
        order: 2;
        min-height: 400px;
    }
}

@media (max-width: 768px) {
    .section-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
        padding: 16px;
    }
    
    .query-content {
        padding: 16px;
    }
    
    .char-buttons,
    .code-buttons {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .result-grid {
        grid-template-columns: 1fr;
        gap: 8px;
    }
    
    .table-header,
    .table-row {
        grid-template-columns: 50px 50px 70px 1fr;
    }
    
    .table-cell {
        padding: 6px 8px;
        font-size: 11px;
    }
    
    .char-input {
        font-size: 16px;
    }
}

@media (max-width: 480px) {
    .lookup-content {
        padding: 12px;
        gap: 12px;
    }
    
    .char-buttons,
    .code-buttons {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .table-header,
    .table-row {
        grid-template-columns: 45px 45px 60px 1fr;
    }
    
    .table-cell {
        padding: 4px 6px;
        font-size: 10px;
    }
    
    .header-cell {
        padding: 8px 6px;
        font-size: 11px;
    }
}
</style>