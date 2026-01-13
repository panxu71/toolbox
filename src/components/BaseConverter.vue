<template>
    <div class="base-converter">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="copy" tooltip="复制结果" @click="copyActiveResult" />
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 转换区域 -->
            <div class="convert-section">
                <div class="input-panel">
                    <div class="section-header">
                        <h3>数值输入</h3>
                        <div class="base-selector">
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
                    <div class="examples-area">
                        <div class="examples-header">
                            <h4>快速示例</h4>
                        </div>
                        <div class="examples-grid">
                            <div class="example-item" @click="setExample('255')">
                                <div class="example-label">255</div>
                                <div class="example-desc">8位最大值</div>
                            </div>
                            <div class="example-item" @click="setExample('1024')">
                                <div class="example-label">1024</div>
                                <div class="example-desc">1KB字节数</div>
                            </div>
                            <div class="example-item" @click="setExample('65535')">
                                <div class="example-label">65535</div>
                                <div class="example-desc">16位最大值</div>
                            </div>
                            <div class="example-item" @click="setExample('16777215')">
                                <div class="example-label">16777215</div>
                                <div class="example-desc">RGB最大值</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="results-panel">
                    <div class="section-header">
                        <h3>转换结果</h3>
                        <div class="click-tip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M9 12l2 2 4-4" />
                                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                            </svg>
                            <span>点击任意行复制内容</span>
                        </div>
                    </div>
                    <div class="results-list">
                        <div class="result-row" :class="{ active: inputBase === '2' }"
                            @click="copyResult(results.binary)">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">二进制</span>
                                    <span class="base-code">BIN</span>
                                    <span v-if="inputBase === '2'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">计算机基础，只用0和1</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.binary || '0'" class="result-input" readonly />
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputBase === '8' }"
                            @click="copyResult(results.octal)">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">八进制</span>
                                    <span class="base-code">OCT</span>
                                    <span v-if="inputBase === '8'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">Unix权限系统常用</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.octal || '0'" class="result-input" readonly />
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputBase === '10' }"
                            @click="copyResult(results.decimal)">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">十进制</span>
                                    <span class="base-code">DEC</span>
                                    <span v-if="inputBase === '10'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">日常使用的数字系统</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.decimal || '0'" class="result-input" readonly />
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputBase === '16' }"
                            @click="copyResult(results.hexadecimal)">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">十六进制</span>
                                    <span class="base-code">HEX</span>
                                    <span v-if="inputBase === '16'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">颜色代码、内存地址</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.hexadecimal || '0'" class="result-input" readonly />
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputBase === '32' }"
                            @click="copyResult(results.base32)">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="base-name">三十二进制</span>
                                    <span class="base-code">BASE32</span>
                                    <span v-if="inputBase === '32'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">数据编码、短链接</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.base32 || '0'" class="result-input" readonly />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 进制说明 -->
            <div class="help-section">
                <div class="help-header">
                    <h3>💡 进制说明</h3>
                </div>
                <div class="help-content">
                    <div class="help-grid">
                        <div class="help-card">
                            <div class="help-header-inline">
                                <div class="help-icon">🔢</div>
                                <h4>二进制 (Binary)</h4>
                            </div>
                            <p>基数：2，使用数字：0、1。计算机内部数据存储和处理的基础，每一位代表2的幂次。</p>
                        </div>

                        <div class="help-card">
                            <div class="help-header-inline">
                                <div class="help-icon">🔧</div>
                                <h4>八进制 (Octal)</h4>
                            </div>
                            <p>基数：8，使用数字：0-7。常用于Unix/Linux文件权限设置，如755表示rwxr-xr-x权限。</p>
                        </div>

                        <div class="help-card">
                            <div class="help-header-inline">
                                <div class="help-icon">📊</div>
                                <h4>十进制 (Decimal)</h4>
                            </div>
                            <p>基数：10，使用数字：0-9。日常生活中使用的标准数字系统，所有进制转换的基准。</p>
                        </div>

                        <div class="help-card">
                            <div class="help-header-inline">
                                <div class="help-icon">🎨</div>
                                <h4>十六进制 (Hexadecimal)</h4>
                            </div>
                            <p>基数：16，使用字符：0-9、A-F。广泛用于颜色代码(#FF0000)、内存地址、哈希值等。</p>
                        </div>

                        <div class="help-card">
                            <div class="help-header-inline">
                                <div class="help-icon">🔗</div>
                                <h4>三十二进制 (Base32)</h4>
                            </div>
                            <p>基数：32，使用字符：0-9、A-V。用于数据编码、短链接生成，避免易混淆字符。</p>
                        </div>

                        <div class="help-card">
                            <div class="help-header-inline">
                                <div class="help-icon">💡</div>
                                <h4>转换方法详解</h4>
                            </div>
                            <p><strong>十进制转其他进制（除法取余）：</strong><br>
                                以255转二进制为例：255÷2=127余1，127÷2=63余1，63÷2=31余1，31÷2=15余1，15÷2=7余1，7÷2=3余1，3÷2=1余1，1÷2=0余1。<br>
                                将余数从下往上排列：11111111，这就是255的二进制。<br><br>
                                <strong>其他进制转十进制（位权相加）：</strong><br>
                                以二进制1010转十进制为例：从右往左，每一位乘以对应的权重（2的幂次）。<br>
                                1010₂ = 0×2⁰ + 1×2¹ + 0×2² + 1×2³ = 0×1 + 1×2 + 0×4 + 1×8 = 0+2+0+8 = 10
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import { useClipboard } from '../composables/useClipboard'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 使用组合式函数
usePageTitle('number-base')
const { success: showSuccess, error: showError } = useNotification()
const { copyToClipboard } = useClipboard()

// 获取页面标题
const pageTitle = computed(() => {
    // 遍历所有分类查找对应的卡片
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'number-base')
        if (card) {
            return card.title
        }
    }
    return '进制转换'
})

// 响应式数据
const inputValue = ref('')
const inputBase = ref('10')
const results = ref({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: '',
    base32: ''
})

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
    showSuccess('已清空所有内容')
}

// 复制结果
const copyResult = async (value: string) => {
    if (!value || value === '错误') return

    const success = await copyToClipboard(value)
    if (success) {
        showSuccess('已复制到剪贴板')
    } else {
        showError('复制失败')
    }
}

// 复制当前激活的结果
const copyActiveResult = async () => {
    const activeResults = {
        '2': results.value.binary,
        '8': results.value.octal,
        '10': results.value.decimal,
        '16': results.value.hexadecimal,
        '32': results.value.base32
    }

    const activeValue = activeResults[inputBase.value as keyof typeof activeResults]
    if (activeValue && activeValue !== '错误') {
        await copyResult(activeValue)
    }
}

// 设置示例值
const setExample = (value: string) => {
    inputValue.value = value
    inputBase.value = '10' // 示例都是十进制
    convertNumber()
    showSuccess(`已设置示例值: ${value}`)
}

// 初始化
convertNumber()
</script>

<style scoped>
.base-converter {
    width: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
}

.converter-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    padding-bottom: 80px;
    gap: 24px;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 80px);
    overflow-y: auto;
    /* Hide scrollbars */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.converter-content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

/* 转换区域 */
.convert-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    flex-shrink: 0;
}

.input-panel,
.results-panel {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    height: 48px;
    box-sizing: border-box;
}

.section-header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.click-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: var(--primary-color-light);
    border: 1px solid var(--primary-color);
    border-radius: var(--radius-sm);
    color: var(--primary-color);
    font-size: 12px;
    font-weight: 500;
}

.click-tip svg {
    flex-shrink: 0;
}

.base-selector {
    display: flex;
    align-items: center;
    gap: 8px;
}

.base-select {
    padding: 6px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 12px;
    min-width: 140px;
}

.input-area {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.number-input {
    width: 100%;
    padding: 12px 16px;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 16px;
    font-family: var(--font-mono);
    font-weight: 500;
    transition: var(--transition);
}

.number-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-light);
}

.input-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.input-hint {
    font-size: 12px;
    color: var(--text-secondary);
    font-style: italic;
}

.base-info {
    font-size: 12px;
    color: var(--primary-color);
    font-weight: 500;
    font-family: var(--font-mono);
}

/* 快速示例区域 */
.examples-area {
    padding: 20px;
    border-top: 1px solid var(--border-color);
}

.examples-header {
    margin-bottom: 12px;
}

.examples-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.examples-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.example-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
}

.example-item:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.example-label {
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font-mono);
    color: var(--primary-color);
}

.example-desc {
    font-size: 10px;
    color: var(--text-secondary);
    font-weight: 500;
}

/* 结果列表 */
.results-list {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.result-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    transition: var(--transition);
    cursor: pointer;
}

.result-row:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
}

.result-row.active {
    border-color: var(--primary-color);
    background: var(--primary-color-light);
}

.result-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 100px;
    flex-shrink: 0;
}

.result-label {
    display: flex;
    align-items: center;
    gap: 8px;
}

.base-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.base-code {
    font-size: 10px;
    font-weight: 500;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
}

.active-indicator {
    font-size: 10px;
    font-weight: 600;
    color: white;
    background: var(--primary-color);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
}

.result-desc {
    font-size: 10px;
    color: var(--text-secondary);
    line-height: 1.3;
}

.result-content {
    flex: 1;
    display: flex;
    align-items: center;
}

.result-input {
    flex: 1;
    width: 100%;
    padding: 8px 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.result-input:hover {
    border-color: var(--primary-color);
}

.result-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-light);
}

/* 帮助说明 */
.help-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    flex-shrink: 0;
}

.help-header {
    padding: 12px 20px;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    height: 48px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

.help-header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.help-content {
    padding: 20px;
}

.help-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

/* 让转换方法卡片单独占一行 */
.help-card:last-child {
    grid-column: 1 / -1;
}

.help-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 16px;
    transition: var(--transition);
}

.help-card:hover {
    background: var(--bg-tertiary);
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-color);
}

.help-icon {
    font-size: 20px;
    margin-bottom: 8px;
    flex-shrink: 0;
}

/* 图标和标题的内联容器 */
.help-header-inline {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.help-header-inline .help-icon {
    margin-bottom: 0;
}

.help-header-inline h4 {
    margin: 0;
}

.help-card h4 {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
    flex: 1;
}

.help-card p {
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .converter-content {
        padding: 16px;
        padding-bottom: 80px;
        gap: 16px;
    }

    .convert-section {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .examples-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }

    .help-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .result-row {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .result-info {
        min-width: auto;
    }

    .section-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
        height: auto;
        padding: 16px 20px;
    }

    .base-selector {
        justify-content: space-between;
    }
}
</style>