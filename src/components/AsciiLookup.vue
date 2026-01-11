<template>
    <div class="ascii-lookup-wrapper">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton 
                    icon="copy" 
                    tooltip="复制结果" 
                    @click="copyResult"
                    :disabled="!queryResult"
                />
                <HeaderActionButton 
                    icon="clear" 
                    tooltip="清空" 
                    @click="clearAll"
                />
            </template>
        </PageHeader>

        <div class="content-wrapper">
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

            <!-- 功能说明 -->
            <div class="help-section">
                <h3>功能说明</h3>
                <div class="help-grid">
                    <div class="help-card">
                        <div class="help-icon">🔍</div>
                        <h4>字符查询</h4>
                        <p>输入字符获取对应的ASCII码和详细信息</p>
                    </div>
                    <div class="help-card">
                        <div class="help-icon">🔢</div>
                        <h4>编码查询</h4>
                        <p>输入ASCII码获取对应的字符和详细信息</p>
                    </div>
                    <div class="help-card">
                        <div class="help-icon">📊</div>
                        <h4>字符表浏览</h4>
                        <p>浏览完整的ASCII字符表，支持分类筛选</p>
                    </div>
                    <div class="help-card">
                        <div class="help-icon">📋</div>
                        <h4>快速复制</h4>
                        <p>一键复制查询结果到剪贴板</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 根据卡片ID获取标题
function getCardTitle(cardId: string): string {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((c: any) => c.id === cardId)
        if (card) {
            return card.title
        }
    }
    return 'ASCII字符查询'
}

// 使用页面标题管理
usePageTitle('ascii-lookup')
const cardTitle = getCardTitle('ascii-lookup')

const { success, error } = useNotification()

interface AsciiInfo {
    code: number
    char: string
    hex: string
    binary: string
    description: string
}

// 查询模式
const queryMode = ref<'char' | 'code'>('char')
const inputChar = ref('')
const inputCode = ref<number | null>(null)
const queryResult = ref<AsciiInfo | null>(null)

// 表格筛选
const tableFilter = ref('all')

// 常用字符和编码
const commonChars = ['A', 'a', '0', ' ', '!', '@', '#', '$', '%']
const commonCodes = [32, 48, 65, 97, 33, 64, 35, 36, 37]

// ASCII表数据
const asciiTable = ref<AsciiInfo[]>([])

// 计算属性
const filteredAsciiTable = computed(() => {
    if (tableFilter.value === 'all') return asciiTable.value
    if (tableFilter.value === 'printable') {
        return asciiTable.value.filter(item => item.code >= 32 && item.code <= 126)
    }
    if (tableFilter.value === 'control') {
        return asciiTable.value.filter(item => item.code < 32 || item.code === 127)
    }
    return asciiTable.value
})

// 初始化ASCII表
const initAsciiTable = () => {
    const controlChars = [
        'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL',
        'BS', 'TAB', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI',
        'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB',
        'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US'
    ]

    const controlDescriptions = [
        '空字符 (Null)', '标题开始 (Start of Heading)', '正文开始 (Start of Text)', '正文结束 (End of Text)', 
        '传输结束 (End of Transmission)', '询问 (Enquiry)', '确认 (Acknowledge)', '响铃 (Bell)',
        '退格 (Backspace)', '水平制表 (Horizontal Tab)', '换行 (Line Feed)', '垂直制表 (Vertical Tab)', 
        '换页 (Form Feed)', '回车 (Carriage Return)', '移出 (Shift Out)', '移入 (Shift In)',
        '数据链路转义 (Data Link Escape)', '设备控制1 (Device Control 1)', '设备控制2 (Device Control 2)', 
        '设备控制3 (Device Control 3)', '设备控制4 (Device Control 4)', '否定确认 (Negative Acknowledge)', 
        '同步空闲 (Synchronous Idle)', '传输块结束 (End of Transmission Block)',
        '取消 (Cancel)', '媒介结束 (End of Medium)', '替换 (Substitute)', '转义 (Escape)', 
        '文件分隔符 (File Separator)', '组分隔符 (Group Separator)', '记录分隔符 (Record Separator)', 
        '单元分隔符 (Unit Separator)'
    ]

    for (let i = 0; i <= 127; i++) {
        let char = String.fromCharCode(i)
        let description = ''

        if (i < 32) {
            char = controlChars[i] || ''
            description = controlDescriptions[i] || ''
        } else if (i === 32) {
            char = 'SPACE'
            description = '空格 (Space)'
        } else if (i === 127) {
            char = 'DEL'
            description = '删除 (Delete)'
        } else if (i >= 48 && i <= 57) {
            description = '数字'
        } else if (i >= 65 && i <= 90) {
            description = '大写字母'
        } else if (i >= 97 && i <= 122) {
            description = '小写字母'
        } else {
            description = '特殊字符'
        }

        asciiTable.value.push({
            code: i,
            char: char,
            hex: i.toString(16).toUpperCase().padStart(2, '0'),
            binary: i.toString(2).padStart(8, '0'),
            description
        })
    }
}

// 查询方法
const setQueryMode = (mode: 'char' | 'code') => {
    queryMode.value = mode
    clearInput()
}

const handleCharInput = () => {
    if (!inputChar.value) {
        queryResult.value = null
        return
    }

    const code = inputChar.value.charCodeAt(0)
    if (code > 127) {
        error('只支持ASCII字符 (0-127)')
        return
    }

    const item = asciiTable.value.find(item => item.code === code)
    if (item) {
        queryResult.value = item
        success('查询成功')
    }
}

const handleCodeInput = () => {
    if (inputCode.value === null || inputCode.value < 0 || inputCode.value > 127) {
        queryResult.value = null
        return
    }

    const item = asciiTable.value.find(item => item.code === inputCode.value)
    if (item) {
        queryResult.value = item
        success('查询成功')
    }
}

const selectChar = (char: string) => {
    inputChar.value = char
    handleCharInput()
}

const selectCode = (code: number) => {
    inputCode.value = code
    handleCodeInput()
}

const selectFromTable = (item: AsciiInfo) => {
    queryResult.value = item
    if (queryMode.value === 'char') {
        inputChar.value = item.code < 32 || item.code === 127 ? '' : String.fromCharCode(item.code)
    } else {
        inputCode.value = item.code
    }
    
    // 显示选中的字符信息
    const charDisplay = item.code < 32 || item.code === 127 ? item.char : String.fromCharCode(item.code)
    success(`已选择: ${charDisplay} (ASCII: ${item.code})`)
}

const setTableFilter = (filter: string) => {
    tableFilter.value = filter
}

const clearInput = () => {
    inputChar.value = ''
    inputCode.value = null
    queryResult.value = null
}

const clearAll = () => {
    clearInput()
    success('已清空')
}

const copyResult = async () => {
    if (!queryResult.value) return

    const result = `字符: ${queryResult.value.char}
ASCII码: ${queryResult.value.code}
十六进制: 0x${queryResult.value.hex}
二进制: ${queryResult.value.binary}
描述: ${queryResult.value.description}`

    try {
        await navigator.clipboard.writeText(result)
        success('结果已复制到剪贴板')
    } catch (err) {
        error('复制失败')
    }
}

onMounted(() => {
    initAsciiTable()
})
</script>

<style scoped>
.ascii-lookup-wrapper {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.content-wrapper {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 60px;
}

.lookup-content {
    flex: 1;
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 24px;
    padding: 24px;
    overflow: hidden;
    max-width: 1000px;
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
    height: 600px;
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

/* 功能说明 */
.help-section {
    max-width: 1000px;
    margin: 32px auto 32px;
    padding: 0 24px;
}

.help-section h3 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.help-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
}

.help-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: 20px;
    border: 1px solid var(--border-color);
    text-align: center;
    transition: var(--transition);
}

.help-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.help-icon {
    font-size: 32px;
    margin-bottom: 12px;
}

.help-card h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.help-card p {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
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
    
    .help-section {
        padding: 0 16px;
        margin: 32px auto 32px;
    }
    
    .help-grid {
        grid-template-columns: 1fr;
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
    
    .help-section {
        padding: 0 12px;
        margin: 32px auto 32px;
    }
}
</style>