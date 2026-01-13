<template>
    <div class="number-converter">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 转换区域 -->
            <div class="convert-section">
                <div class="input-panel">
                    <div class="section-header">
                        <h3>数字输入</h3>
                        <div class="input-type-selector">
                            <button :class="['type-btn', { active: inputType === 'number' }]"
                                @click="setInputType('number')">
                                阿拉伯数字
                            </button>
                            <button :class="['type-btn', { active: inputType === 'chinese' }]"
                                @click="setInputType('chinese')">
                                中文数字
                            </button>
                            <button :class="['type-btn', { active: inputType === 'roman' }]"
                                @click="setInputType('roman')">
                                罗马数字
                            </button>
                        </div>
                    </div>
                    <div class="input-area">
                        <div class="input-container">
                            <input v-model="inputNumber" :type="inputType === 'number' ? 'number' : 'text'"
                                :step="inputType === 'number' ? '0.01' : undefined" class="number-input"
                                :placeholder="getPlaceholder()" @input="convertNumber" />
                        </div>
                        <div class="input-hint">{{ getInputHint() }}</div>
                    </div>

                    <!-- 快速示例 -->
                    <div class="examples-area">
                        <h4 class="examples-title">快速示例</h4>
                        <div class="examples-grid">
                            <div class="example-item" @click="setExample(1)">
                                <div class="example-number">1</div>
                                <div class="example-roman">I</div>
                            </div>
                            <div class="example-item" @click="setExample(10)">
                                <div class="example-number">10</div>
                                <div class="example-roman">X</div>
                            </div>
                            <div class="example-item" @click="setExample(100)">
                                <div class="example-number">100</div>
                                <div class="example-roman">C</div>
                            </div>
                            <div class="example-item" @click="setExample(500)">
                                <div class="example-number">500</div>
                                <div class="example-roman">D</div>
                            </div>
                            <div class="example-item" @click="setExample(1000)">
                                <div class="example-number">1000</div>
                                <div class="example-roman">M</div>
                            </div>
                            <div class="example-item" @click="setExample(2024)">
                                <div class="example-number">2024</div>
                                <div class="example-roman">MMXXIV</div>
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
                        <div class="result-row" @click="copyResult(results.chineseUpper)">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="result-icon">💰</span>
                                    <span class="result-name">大写金额</span>
                                </div>
                                <div class="result-desc">人民币大写，财务专用</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.chineseUpper || '-'" class="result-input" readonly />
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputType === 'number' }"
                            @click="copyResult(results.number)">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="result-icon">🔢</span>
                                    <span class="result-name">阿拉伯数字</span>
                                    <span v-if="inputType === 'number'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">标准数字格式，国际通用</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.number || '-'" class="result-input" readonly />
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputType === 'roman' }"
                            @click="copyResult(results.roman)">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="result-icon">🏛️</span>
                                    <span class="result-name">罗马数字</span>
                                    <span v-if="inputType === 'roman'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">古罗马数字系统，常用于序号</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.roman || '-'" class="result-input" readonly />
                            </div>
                        </div>

                        <div class="result-row" :class="{ active: inputType === 'chinese' }"
                            @click="copyResult(results.chinese)">
                            <div class="result-info">
                                <div class="result-label">
                                    <span class="result-icon">🀄</span>
                                    <span class="result-name">中文数字</span>
                                    <span v-if="inputType === 'chinese'" class="active-indicator">输入</span>
                                </div>
                                <div class="result-desc">中文小写数字，日常使用</div>
                            </div>
                            <div class="result-content">
                                <input :value="results.chinese || '-'" class="result-input" readonly />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 转换规则说明 -->
            <div class="help-section">
                <div class="help-header">
                    <h3>💡 转换规则说明</h3>
                </div>
                <div class="help-content">
                    <div class="help-grid">
                        <div class="help-card">
                            <div class="help-header-inline">
                                <div class="help-icon">🏛️</div>
                                <h4>罗马数字基本符号</h4>
                            </div>
                            <div class="symbols-list">
                                <div class="symbol-item">I = 1</div>
                                <div class="symbol-item">V = 5</div>
                                <div class="symbol-item">X = 10</div>
                                <div class="symbol-item">L = 50</div>
                                <div class="symbol-item">C = 100</div>
                                <div class="symbol-item">D = 500</div>
                                <div class="symbol-item">M = 1000</div>
                            </div>
                        </div>

                        <div class="help-card">
                            <div class="help-header-inline">
                                <div class="help-icon">🀄</div>
                                <h4>中文数字对照</h4>
                            </div>
                            <div class="symbols-list">
                                <div class="symbol-item">零 = 0</div>
                                <div class="symbol-item">一 = 1</div>
                                <div class="symbol-item">二 = 2</div>
                                <div class="symbol-item">三 = 3</div>
                                <div class="symbol-item">四 = 4</div>
                                <div class="symbol-item">五 = 5</div>
                                <div class="symbol-item">六 = 6</div>
                                <div class="symbol-item">七 = 7</div>
                                <div class="symbol-item">八 = 8</div>
                                <div class="symbol-item">九 = 9</div>
                            </div>
                        </div>

                        <div class="help-card">
                            <div class="help-header-inline">
                                <div class="help-icon">💰</div>
                                <h4>人民币大写汉字</h4>
                            </div>
                            <div class="symbols-list">
                                <div class="symbol-item">零 = 0</div>
                                <div class="symbol-item">壹 = 1</div>
                                <div class="symbol-item">贰 = 2</div>
                                <div class="symbol-item">叁 = 3</div>
                                <div class="symbol-item">肆 = 4</div>
                                <div class="symbol-item">伍 = 5</div>
                                <div class="symbol-item">陆 = 6</div>
                                <div class="symbol-item">柒 = 7</div>
                                <div class="symbol-item">捌 = 8</div>
                                <div class="symbol-item">玖 = 9</div>
                            </div>
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
usePageTitle('number-format-new')
const { success: showSuccess, error: showError } = useNotification()
const { copyToClipboard } = useClipboard()

// 获取页面标题
const pageTitle = computed(() => {
    // 遍历所有分类查找对应的卡片
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'number-format-new')
        if (card) {
            return card.title
        }
    }
    return '数字格式转换'
})

// 响应式数据
const inputNumber = ref('')
const inputType = ref<'number' | 'chinese' | 'roman'>('number')
const results = ref({
    number: '',
    roman: '',
    chinese: '',
    chineseUpper: ''
})

// 罗马数字转换
const toRoman = (num: number): string => {
    if (num < 1) return ''
    if (num > 999999) return '数字过大'

    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

    let result = ''
    let remaining = num

    for (let i = 0; i < values.length; i++) {
        const value = values[i]!
        const symbol = symbols[i]!
        while (remaining >= value) {
            result += symbol
            remaining -= value
        }
    }

    return result
}

// 中文数字转换
const toChinese = (num: number): string => {
    if (num < 0) return ''
    if (num === 0) return '零'

    const digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    const units = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿']

    const convertSection = (n: number): string => {
        if (n === 0) return ''

        const str = n.toString()
        let result = ''

        for (let i = 0; i < str.length; i++) {
            const digitChar = str[i]
            if (!digitChar) continue

            const digit = parseInt(digitChar)
            const unitIndex = str.length - i - 1

            if (digit !== 0) {
                const digitText = digits[digit]!
                const unitText = units[unitIndex]

                if (digit === 1 && unitIndex === 1 && str.length === 2) {
                    result += '十'
                } else {
                    result += digitText + (unitIndex > 0 && unitText ? unitText : '')
                }
            } else if (result && i < str.length - 1) {
                const nextNonZero = str.slice(i + 1).split('').some(d => d !== '0')
                if (nextNonZero && !result.endsWith('零')) {
                    result += '零'
                }
            }
        }

        return result
    }

    const integerPart = Math.floor(num)

    if (integerPart === 0) {
        return '零'
    } else if (integerPart < 10000) {
        return convertSection(integerPart)
    } else if (integerPart < 100000000) {
        const wan = Math.floor(integerPart / 10000)
        const remainder = integerPart % 10000
        let result = convertSection(wan) + '万'
        if (remainder > 0) {
            if (remainder < 1000) {
                result += '零' + convertSection(remainder)
            } else {
                result += convertSection(remainder)
            }
        }
        return result
    } else {
        const yi = Math.floor(integerPart / 100000000)
        const remainder = integerPart % 100000000
        let result = convertSection(yi) + '亿'
        if (remainder > 0) {
            if (remainder < 10000000) {
                result += '零'
            }
            if (remainder >= 10000) {
                const wan = Math.floor(remainder / 10000)
                const lastRemainder = remainder % 10000
                result += convertSection(wan) + '万'
                if (lastRemainder > 0) {
                    if (lastRemainder < 1000) {
                        result += '零'
                    }
                    result += convertSection(lastRemainder)
                }
            } else {
                result += convertSection(remainder)
            }
        }
        return result
    }
}

// 中文大写数字转换
const toChineseUpper = (num: number): string => {
    if (num < 0) return ''
    if (num === 0) return '零元整'

    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    const units = ['', '拾', '佰', '仟', '万', '拾万', '佰万', '仟万', '亿']

    // 分离整数和小数部分
    const parts = num.toString().split('.')
    const integerPart = parseInt(parts[0] || '0')
    const decimalPart = parts[1]

    const convertSection = (n: number): string => {
        if (n === 0) return ''

        const str = n.toString()
        let result = ''

        for (let i = 0; i < str.length; i++) {
            const digitChar = str[i]
            if (!digitChar) continue

            const digit = parseInt(digitChar)
            const unitIndex = str.length - i - 1

            if (digit !== 0) {
                const digitText = digits[digit]!
                const unitText = units[unitIndex]

                result += digitText + (unitIndex > 0 && unitText ? unitText : '')
            } else if (result && i < str.length - 1) {
                const nextNonZero = str.slice(i + 1).split('').some(d => d !== '0')
                if (nextNonZero && !result.endsWith('零')) {
                    result += '零'
                }
            }
        }

        return result
    }

    let result = ''

    // 处理整数部分
    if (integerPart === 0) {
        result = '零'
    } else if (integerPart < 10000) {
        result = convertSection(integerPart)
    } else if (integerPart < 100000000) {
        const wan = Math.floor(integerPart / 10000)
        const remainder = integerPart % 10000
        result = convertSection(wan) + '万'
        if (remainder > 0) {
            if (remainder < 1000) {
                result += '零' + convertSection(remainder)
            } else {
                result += convertSection(remainder)
            }
        }
    } else {
        const yi = Math.floor(integerPart / 100000000)
        const remainder = integerPart % 100000000
        result = convertSection(yi) + '亿'
        if (remainder > 0) {
            if (remainder < 10000000) {
                result += '零'
            }
            if (remainder >= 10000) {
                const wan = Math.floor(remainder / 10000)
                const lastRemainder = remainder % 10000
                result += convertSection(wan) + '万'
                if (lastRemainder > 0) {
                    if (lastRemainder < 1000) {
                        result += '零'
                    }
                    result += convertSection(lastRemainder)
                }
            } else {
                result += convertSection(remainder)
            }
        }
    }

    result += '元'

    // 处理小数部分
    if (decimalPart) {
        const jiao = decimalPart.length > 0 ? parseInt(decimalPart[0]!) : 0
        const fen = decimalPart.length > 1 ? parseInt(decimalPart[1]!) : 0

        if (jiao === 0 && fen === 0) {
            result += '整'
        } else {
            if (jiao > 0) {
                result += digits[jiao]! + '角'
            } else if (fen > 0) {
                result += '零'
            }
            if (fen > 0) {
                result += digits[fen]! + '分'
            }
        }
    } else {
        result += '整'
    }

    return result
}

// 罗马数字转阿拉伯数字
const fromRoman = (roman: string): number => {
    const romanMap: { [key: string]: number } = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    }

    let result = 0
    let prevValue = 0

    for (let i = roman.length - 1; i >= 0; i--) {
        const char = roman[i]
        if (!char) continue

        const currentValue = romanMap[char]
        if (!currentValue) return 0

        if (currentValue < prevValue) {
            result -= currentValue
        } else {
            result += currentValue
        }
        prevValue = currentValue
    }

    return result
}

// 中文数字转阿拉伯数字
const fromChinese = (chinese: string): number => {
    const digitMap: { [key: string]: number } = {
        '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
        '壹': 1, '贰': 2, '叁': 3, '肆': 4, '伍': 5, '陆': 6, '柒': 7, '捌': 8, '玖': 9
    }

    const unitMap: { [key: string]: number } = {
        '十': 10, '拾': 10, '百': 100, '佰': 100, '千': 1000, '仟': 1000,
        '万': 10000, '亿': 100000000
    }

    // 简单实现，处理基本情况
    let result = 0
    let temp = 0
    let unit = 1

    for (let i = chinese.length - 1; i >= 0; i--) {
        const char = chinese[i]
        if (!char) continue

        if (digitMap.hasOwnProperty(char)) {
            temp = digitMap[char]! * unit
            result += temp
        } else if (unitMap.hasOwnProperty(char)) {
            unit = unitMap[char]!
            if (char === '万' || char === '亿') {
                result = result + temp * unit
                temp = 0
                unit = 1
            }
        }
    }

    return result
}

// 转换数字
const convertNumber = () => {
    try {
        console.log('=== START convertNumber ===')
        console.log('convertNumber called, inputNumber:', inputNumber.value, 'inputType:', inputType.value)

        // 将输入值转换为字符串并trim
        const inputValue = String(inputNumber.value || '').trim()
        console.log('inputValue after string conversion and trim:', `"${inputValue}"`)
        console.log('trim length:', inputValue.length)

        if (!inputValue) {
            console.log('input is empty after trim, returning')
            results.value = {
                number: '',
                roman: '',
                chinese: '',
                chineseUpper: ''
            }
            return
        }

        console.log('proceeding with conversion...')

        let num = 0

        if (inputType.value === 'number') {
            console.log('parsing number:', inputValue)
            num = parseFloat(inputValue)
            console.log('parsed number:', num)
            if (isNaN(num)) {
                console.log('number is NaN')
                throw new Error('无效数字')
            }
        } else if (inputType.value === 'roman') {
            num = fromRoman(inputValue.toUpperCase())
            if (num === 0) throw new Error('无效罗马数字')
        } else if (inputType.value === 'chinese') {
            num = fromChinese(inputValue)
            if (num === 0 && inputValue !== '零') throw new Error('无效中文数字')
        }

        console.log('calling conversion functions...')
        const romanResult = toRoman(Math.floor(num))
        console.log('toRoman result:', romanResult)

        const chineseResult = toChinese(Math.floor(num))
        console.log('toChinese result:', chineseResult)

        const chineseUpperResult = toChineseUpper(num)
        console.log('toChineseUpper result:', chineseUpperResult)

        const convertedResults = {
            number: num.toString(),
            roman: romanResult,
            chinese: chineseResult,
            chineseUpper: chineseUpperResult
        }

        console.log('converted results:', convertedResults)
        results.value = convertedResults
        console.log('=== END convertNumber ===')
    } catch (error) {
        console.error('=== ERROR in convertNumber ===', error)
        results.value = {
            number: '错误',
            roman: '错误',
            chinese: '错误',
            chineseUpper: '错误'
        }
    }
}

// 设置输入类型
const setInputType = (type: 'number' | 'chinese' | 'roman') => {
    inputType.value = type
    inputNumber.value = ''
    results.value = {
        number: '',
        roman: '',
        chinese: '',
        chineseUpper: ''
    }
}

// 获取占位符
const getPlaceholder = () => {
    switch (inputType.value) {
        case 'number':
            return '请输入阿拉伯数字，如：123'
        case 'chinese':
            return '请输入中文数字，如：一百二十三'
        case 'roman':
            return '请输入罗马数字，如：CXXIII'
        default:
            return '请输入数字'
    }
}

// 获取输入提示
const getInputHint = () => {
    switch (inputType.value) {
        case 'number':
            return '支持整数和小数，范围：0-999999'
        case 'chinese':
            return '支持中文数字，如：一、二、三、十、百、千、万'
        case 'roman':
            return '支持罗马数字，如：I、V、X、L、C、D、M'
        default:
            return ''
    }
}

// 清空输入
const clearInput = () => {
    inputNumber.value = ''
    results.value = {
        number: '',
        roman: '',
        chinese: '',
        chineseUpper: ''
    }
}

// 清空所有
const clearAll = () => {
    clearInput()
    showSuccess('已清空所有内容')
}

// 复制结果
const copyResult = async (value: string) => {
    if (!value || value === '-' || value === '错误') return

    const success = await copyToClipboard(value)
    if (success) {
        showSuccess('已复制到剪贴板')
    } else {
        showError('复制失败')
    }
}

// 设置示例值
const setExample = (value: number) => {
    inputType.value = 'number'
    inputNumber.value = value.toString()
    convertNumber()
    showSuccess(`已设置示例值: ${value}`)
}

// 初始化
convertNumber()
</script>
<style scoped>
.number-converter {
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
    /* 隐藏滚动条但保持滚动功能 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.converter-content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

/* 快速示例 - 已合并到input-panel */

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

.examples-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding: 0;
}

.example-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 8px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    min-height: 60px;
    text-align: center;
    transition: var(--transition);
}

.example-item:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.example-number {
    font-size: 14px;
    font-weight: 600;
    font-family: var(--font-mono);
    color: var(--primary-color);
    line-height: 1.2;
}

.example-roman {
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 500;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
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

.input-type-selector {
    display: flex;
    gap: 4px;
}

.type-btn {
    padding: 6px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: var(--transition);
    min-width: 60px;
    text-transform: uppercase;
}

.type-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.type-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.input-area {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.input-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.number-input {
    flex: 1;
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

.input-hint {
    font-size: 12px;
    color: var(--text-secondary);
    font-style: italic;
}

/* 快速示例区域 */
.examples-area {
    padding: 20px;
    border-top: 1px solid var(--border-color);
}

.examples-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
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
    min-width: 120px;
    flex-shrink: 0;
}

.result-label {
    display: flex;
    align-items: center;
    gap: 8px;
}

.result-icon {
    font-size: 16px;
}

.result-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
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

.symbols-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
    margin-top: 8px;
}

.symbol-item {
    font-size: 11px;
    color: var(--text-secondary);
    font-family: var(--font-mono);
    padding: 2px 4px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
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

    .input-type-selector {
        justify-content: space-between;
    }

    .symbols-list {
        grid-template-columns: 1fr;
    }
}
</style>