<template>
    <div class="number-converter">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">数字格式转换</h2>
        </div>

        <div class="converter-content">
            <!-- 输入区域 -->
            <div class="input-section">
                <h3 class="section-title">数字输入</h3>

                <!-- 输入类型选择 -->
                <div class="input-type-selector">
                    <button :class="['type-btn', { active: inputType === 'number' }]" @click="setInputType('number')">
                        阿拉伯数字
                    </button>
                    <button :class="['type-btn', { active: inputType === 'chinese' }]" @click="setInputType('chinese')">
                        中文数字
                    </button>
                    <button :class="['type-btn', { active: inputType === 'roman' }]" @click="setInputType('roman')">
                        罗马数字
                    </button>
                </div>

                <div class="input-wrapper">
                    <div class="input-container">
                        <input v-model="inputNumber" :type="inputType === 'number' ? 'number' : 'text'"
                            :step="inputType === 'number' ? '0.01' : undefined" class="number-input"
                            :placeholder="getPlaceholder()" @input="convertNumber" />
                        <button v-if="inputNumber" class="clear-btn" @click="clearInput" title="清空">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="input-hint">{{ getInputHint() }}</div>
                </div>

                <!-- 快速示例 -->
                <div class="examples-section">
                    <h4 class="examples-title">快速示例</h4>
                    <div class="examples-grid">
                        <button class="example-btn" @click="setExample(1)">
                            <div class="example-number">1</div>
                            <div class="example-roman">I</div>
                        </button>
                        <button class="example-btn" @click="setExample(10)">
                            <div class="example-number">10</div>
                            <div class="example-roman">X</div>
                        </button>
                        <button class="example-btn" @click="setExample(100)">
                            <div class="example-number">100</div>
                            <div class="example-roman">C</div>
                        </button>
                        <button class="example-btn" @click="setExample(500)">
                            <div class="example-number">500</div>
                            <div class="example-roman">D</div>
                        </button>
                        <button class="example-btn" @click="setExample(1000)">
                            <div class="example-number">1000</div>
                            <div class="example-roman">M</div>
                        </button>
                        <button class="example-btn" @click="setExample(2024)">
                            <div class="example-number">2024</div>
                            <div class="example-roman">MMXXIV</div>
                        </button>
                        <button class="example-btn" @click="setExample(11111)">
                            <div class="example-number">11111</div>
                            <div class="example-roman">大数字</div>
                        </button>
                        <button class="example-btn" @click="setExample(99999)">
                            <div class="example-number">99999</div>
                            <div class="example-roman">大数字</div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- 转换结果 -->
            <div class="results-section">
                <h3 class="section-title">转换结果</h3>
                <div class="results-grid">
                    <!-- 第一个结果卡片 -->
                    <div class="result-card primary">
                        <div class="result-header">
                            <span class="result-icon">{{ getFirstResultIcon() }}</span>
                            <span class="result-name">{{ getFirstResultName() }}</span>
                            <button class="copy-btn" @click="copyResult(getFirstResultValue())" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="result-body">
                            <div :class="['result-value', getFirstResultClass()]">{{ getFirstResultValue() || '-' }}
                            </div>
                            <div class="result-desc">{{ getFirstResultDesc() }}</div>
                        </div>
                    </div>

                    <!-- 第二个结果卡片 -->
                    <div class="result-card">
                        <div class="result-header">
                            <span class="result-icon">{{ getSecondResultIcon() }}</span>
                            <span class="result-name">{{ getSecondResultName() }}</span>
                            <button class="copy-btn" @click="copyResult(getSecondResultValue())" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="result-body">
                            <div :class="['result-value', getSecondResultClass()]">{{ getSecondResultValue() || '-' }}
                            </div>
                            <div class="result-desc">{{ getSecondResultDesc() }}</div>
                        </div>
                    </div>

                    <!-- 第三个结果卡片 -->
                    <div class="result-card">
                        <div class="result-header">
                            <span class="result-icon">{{ getThirdResultIcon() }}</span>
                            <span class="result-name">{{ getThirdResultName() }}</span>
                            <button class="copy-btn" @click="copyResult(getThirdResultValue())" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="result-body">
                            <div class="result-value">{{ getThirdResultValue() || '-' }}</div>
                            <div class="result-desc">{{ getThirdResultDesc() }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 规则说明 -->
            <div class="rules-section">
                <h3 class="section-title">转换规则说明</h3>
                <div class="rules-content">
                    <!-- 罗马数字规则 -->
                    <div class="rule-group">
                        <h4>罗马数字基本符号</h4>
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

                    <!-- 人民币大写汉字 -->
                    <div class="rule-group">
                        <h4>人民币大写汉字</h4>
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
                        <div class="symbols-list" style="margin-top: 1rem;">
                            <div class="symbol-item">拾 = 十</div>
                            <div class="symbol-item">佰 = 百</div>
                            <div class="symbol-item">仟 = 千</div>
                            <div class="symbol-item">万 = 万</div>
                            <div class="symbol-item">亿 = 亿</div>
                            <div class="symbol-item">元 = 元</div>
                            <div class="symbol-item">角 = 角</div>
                            <div class="symbol-item">分 = 分</div>
                        </div>
                    </div>
                </div>

                <div class="rules-content" style="margin-top: 1.5rem;">
                    <!-- 罗马数字组合规则 -->
                    <div class="rule-group">
                        <h4>罗马数字组合规则</h4>
                        <div class="rules-list">
                            <div class="rule-item">相同符号连续出现表示相加：III = 3</div>
                            <div class="rule-item">小符号在大符号前表示相减：IV = 4, IX = 9</div>
                            <div class="rule-item">小符号在大符号后表示相加：VI = 6, XI = 11</div>
                            <div class="rule-item">同一符号最多连续出现3次</div>
                        </div>
                    </div>

                    <!-- 人民币大写规则 -->
                    <div class="rule-group">
                        <h4>人民币大写规则</h4>
                        <div class="rules-list">
                            <div class="rule-item">整数部分用"元"结尾，小数部分用"角"、"分"</div>
                            <div class="rule-item">没有小数时在末尾加"整"字</div>
                            <div class="rule-item">零在中间时需要写出，如：壹万零壹元</div>
                            <div class="rule-item">适用于财务、法律等正式场合</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 消息提示 -->
        <div v-if="message" :class="['message', messageType]">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineEmits<{
    back: []
}>()

// 输入数字
const inputNumber = ref('')

// 输入类型
const inputType = ref<'number' | 'chinese' | 'roman'>('number')

// 转换结果
const results = ref({
    number: '',
    roman: '',
    chinese: '',
    chineseUpper: ''
})

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 罗马数字转换
const toRoman = (num: number): string => {
    if (num < 1) return ''
    if (num > 999999) return '数字过大'

    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

    let result = ''
    let remaining = num

    for (let i = 0; i < values.length; i++) {
        const value = values[i]
        const symbol = symbols[i]
        if (value && symbol) {
            while (remaining >= value) {
                result += symbol
                remaining -= value
            }
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

    // 分离整数和小数部分
    const parts = num.toString().split('.')
    const integerPart = parseInt(parts[0])
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
                const digitText = digits[digit]
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
                result += '零' + toChinese(remainder)
            } else {
                result += toChinese(remainder)
            }
        }
    }

    // 处理小数部分
    if (decimalPart && decimalPart !== '0') {
        result += '点'
        for (let i = 0; i < decimalPart.length; i++) {
            const digit = parseInt(decimalPart[i])
            result += digits[digit] || '零'
        }
    }

    return result
}

// 中文大写数字转换（人民币格式）
const toChineseUpper = (num: number): string => {
    if (num < 0) return ''
    if (num === 0) return '零元整'

    const digits = ['', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    const units = ['', '拾', '佰', '仟', '万', '拾万', '佰万', '仟万', '亿']

    // 分离整数和小数部分
    const parts = num.toString().split('.')
    const integerPart = parseInt(parts[0])
    const decimalPart = parts[1] || '00'

    // 处理小数部分（角分）
    const jiao = parseInt(decimalPart.charAt(0) || '0')
    const fen = parseInt(decimalPart.charAt(1) || '0')

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
                const digitText = digits[digit]
                const unitText = units[unitIndex]

                if (digit === 1 && unitIndex === 1 && str.length === 2) {
                    result += '拾'
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

    let result = ''

    // 处理整数部分
    if (integerPart === 0) {
        result = '零元'
    } else if (integerPart < 10000) {
        result = convertSection(integerPart) + '元'
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
        result += '元'
    } else {
        const yi = Math.floor(integerPart / 100000000)
        const remainder = integerPart % 100000000
        result = convertSection(yi) + '亿'
        if (remainder > 0) {
            if (remainder < 10000000) {
                result += '零' + toChineseUpper(remainder).replace(/元.*$/, '')
            } else {
                result += toChineseUpper(remainder).replace(/元.*$/, '')
            }
        }
        result += '元'
    }

    // 处理小数部分
    if (jiao === 0 && fen === 0) {
        result += '整'
    } else {
        if (jiao > 0) {
            result += digits[jiao] + '角'
        }
        if (fen > 0) {
            if (jiao === 0 && integerPart > 0) {
                result += '零'
            }
            result += digits[fen] + '分'
        }
    }

    return result
}

// 中文数字转阿拉伯数字
const fromChinese = (chineseNum: string): number => {
    if (!chineseNum) return 0

    const digitMap: { [key: string]: number } = {
        '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
        '壹': 1, '贰': 2, '叁': 3, '肆': 4, '伍': 5, '陆': 6, '柒': 7, '捌': 8, '玖': 9,
        '十': 10, '拾': 10, '百': 100, '佰': 100, '千': 1000, '仟': 1000,
        '万': 10000, '亿': 100000000
    }

    let result = 0
    let current = 0
    let temp = 0

    // 处理小数点
    const parts = chineseNum.split('点')
    const integerPart = parts[0]
    const decimalPart = parts[1]

    // 处理整数部分
    for (let i = 0; i < integerPart.length; i++) {
        const char = integerPart[i]
        const num = digitMap[char]

        if (num !== undefined) {
            if (num < 10) {
                temp = num
            } else if (num < 10000) {
                if (temp === 0) temp = 1
                current += temp * num
                temp = 0
            } else {
                if (temp === 0) temp = 1
                result += (current + temp) * num
                current = 0
                temp = 0
            }
        }
    }

    result += current + temp

    // 处理小数部分
    if (decimalPart) {
        let decimal = 0
        for (let i = 0; i < decimalPart.length; i++) {
            const char = decimalPart[i]
            const num = digitMap[char]
            if (num !== undefined && num < 10) {
                decimal = decimal * 10 + num
            }
        }
        result += decimal / Math.pow(10, decimalPart.length)
    }

    return result
}

// 罗马数字转阿拉伯数字
const fromRoman = (romanNum: string): number => {
    if (!romanNum) return 0

    const romanMap: { [key: string]: number } = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    }

    let result = 0
    const upper = romanNum.toUpperCase()

    for (let i = 0; i < upper.length; i++) {
        const current = romanMap[upper[i]]
        const next = romanMap[upper[i + 1]]

        if (current && next && current < next) {
            result += next - current
            i++ // 跳过下一个字符
        } else if (current) {
            result += current
        }
    }

    return result
}

// 转换数字
const convertNumber = () => {
    if (!inputNumber.value) {
        results.value = {
            number: '',
            roman: '',
            chinese: '',
            chineseUpper: ''
        }
        return
    }

    let num = 0

    // 根据输入类型解析数字
    if (inputType.value === 'number') {
        num = parseFloat(inputNumber.value)
        if (isNaN(num) || num < 0) {
            results.value = { number: '', roman: '', chinese: '', chineseUpper: '' }
            return
        }
    } else if (inputType.value === 'chinese') {
        num = fromChinese(inputNumber.value)
        if (num === 0 && inputNumber.value !== '零') {
            results.value = { number: '', roman: '', chinese: '', chineseUpper: '' }
            return
        }
    } else if (inputType.value === 'roman') {
        num = fromRoman(inputNumber.value)
        if (num === 0 && inputNumber.value.toUpperCase() !== 'N') {
            results.value = { number: '', roman: '', chinese: '', chineseUpper: '' }
            return
        }
    }

    results.value = {
        number: num.toString(),
        roman: toRoman(Math.floor(num)), // 罗马数字只支持整数
        chinese: toChinese(num),
        chineseUpper: toChineseUpper(num)
    }
}

// 设置输入类型
const setInputType = (type: 'number' | 'chinese' | 'roman') => {
    inputType.value = type
    inputNumber.value = ''
    convertNumber()
    showMessage(`已切换到${type === 'number' ? '阿拉伯数字' : type === 'chinese' ? '中文数字' : '罗马数字'}输入模式`, 'success')
}

// 获取占位符文本
const getPlaceholder = (): string => {
    switch (inputType.value) {
        case 'number':
            return '请输入阿拉伯数字，如：123.45'
        case 'chinese':
            return '请输入中文数字，如：一百二十三点四五'
        case 'roman':
            return '请输入罗马数字，如：CXXIII'
        default:
            return '请输入数字'
    }
}

// 获取输入提示
const getInputHint = (): string => {
    switch (inputType.value) {
        case 'number':
            return '支持正数和小数（中文数字支持到亿级别）'
        case 'chinese':
            return '支持中文数字，如：一、十、一百、一千万、三点一四'
        case 'roman':
            return '支持罗马数字，如：I、V、X、L、C、D、M及其组合'
        default:
            return ''
    }
}

// 动态显示函数
const getFirstResultIcon = (): string => {
    switch (inputType.value) {
        case 'number': return '💰'
        case 'chinese': return '🔢'
        case 'roman': return '🔢'
        default: return '🏛️'
    }
}

const getFirstResultName = (): string => {
    switch (inputType.value) {
        case 'number': return '人民币大写'
        case 'chinese': return '阿拉伯数字'
        case 'roman': return '阿拉伯数字'
        default: return '罗马数字'
    }
}

const getFirstResultValue = (): string => {
    switch (inputType.value) {
        case 'number': return results.value.chineseUpper
        case 'chinese': return results.value.number
        case 'roman': return results.value.number
        default: return results.value.roman
    }
}

const getFirstResultClass = (): string => {
    switch (inputType.value) {
        case 'number': return ''
        case 'chinese': return 'number'
        case 'roman': return 'number'
        default: return 'roman'
    }
}

const getFirstResultDesc = (): string => {
    switch (inputType.value) {
        case 'number': return '人民币金额大写（元角分）'
        case 'chinese': return '阿拉伯数字表示法'
        case 'roman': return '阿拉伯数字表示法'
        default: return '古罗马数字表示法'
    }
}

const getSecondResultIcon = (): string => {
    switch (inputType.value) {
        case 'number': return '🏛️'
        case 'chinese': return '🏛️'
        case 'roman': return '🈳'
        default: return '🈳'
    }
}

const getSecondResultName = (): string => {
    switch (inputType.value) {
        case 'number': return '罗马数字'
        case 'chinese': return '罗马数字'
        case 'roman': return '中文数字'
        default: return '中文数字'
    }
}

const getSecondResultValue = (): string => {
    switch (inputType.value) {
        case 'number': return results.value.roman
        case 'chinese': return results.value.roman
        case 'roman': return results.value.chinese
        default: return results.value.chinese
    }
}

const getSecondResultClass = (): string => {
    switch (inputType.value) {
        case 'number': return 'roman'
        case 'chinese': return 'roman'
        case 'roman': return ''
        default: return ''
    }
}

const getSecondResultDesc = (): string => {
    switch (inputType.value) {
        case 'number': return '古罗马数字表示法'
        case 'chinese': return '古罗马数字表示法'
        case 'roman': return '中文小写数字'
        default: return '中文小写数字'
    }
}

const getThirdResultIcon = (): string => {
    switch (inputType.value) {
        case 'number': return '🈳'
        case 'chinese': return '💰'
        case 'roman': return '💰'
        default: return '💰'
    }
}

const getThirdResultName = (): string => {
    switch (inputType.value) {
        case 'number': return '中文数字'
        case 'chinese': return '人民币大写'
        case 'roman': return '人民币大写'
        default: return '人民币大写'
    }
}

const getThirdResultValue = (): string => {
    switch (inputType.value) {
        case 'number': return results.value.chinese
        case 'chinese': return results.value.chineseUpper
        case 'roman': return results.value.chineseUpper
        default: return results.value.chineseUpper
    }
}

const getThirdResultDesc = (): string => {
    switch (inputType.value) {
        case 'number': return '中文小写数字'
        case 'chinese': return '人民币金额大写（元角分）'
        case 'roman': return '人民币金额大写（元角分）'
        default: return '人民币金额大写（元角分）'
    }
}

// 设置示例
const setExample = (num: number) => {
    inputNumber.value = num.toString()
    convertNumber()
    showMessage(`已设置示例数字: ${num}`, 'success')
}

// 清空输入
const clearInput = () => {
    inputNumber.value = ''
    convertNumber()
    showMessage('已清空输入', 'success')
}

// 复制结果
const copyResult = async (text: string) => {
    if (!text) {
        showMessage('没有可复制的内容', 'error')
        return
    }

    try {
        await navigator.clipboard.writeText(text)
        showMessage('已复制到剪贴板', 'success')
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

// 监听输入变化
watch(inputNumber, convertNumber)
</script>

<style scoped>
.number-converter {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.converter-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.back-btn:hover {
    background: #e2e8f0;
    color: #334155;
}

.converter-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
}

.converter-content {
    flex: 1;
    padding: 2rem;
    padding-bottom: 6rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 120px);
}

/* 输入区域 */
.input-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: #1e293b;
}

/* 输入类型选择器 */
.input-type-selector {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0.25rem;
    background: #f1f5f9;
    border-radius: 0.75rem;
}

.type-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    color: #64748b;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
}

.type-btn:hover {
    color: #475569;
    background: rgba(255, 255, 255, 0.5);
}

.type-btn.active {
    background: white;
    color: #3b82f6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input-wrapper {
    margin-bottom: 2rem;
}

.input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.number-input {
    width: 100%;
    padding: 1rem 1.5rem;
    padding-right: 3rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    color: #1e293b;
    font-size: 1.25rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-weight: 500;
    transition: all 0.2s;
    box-sizing: border-box;
}

.number-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-btn {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: 0.375rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
}

.clear-btn:hover {
    background: #f1f5f9;
    color: #475569;
}

.input-hint {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #64748b;
}

/* 快速示例 */
.examples-section {
    border-top: 1px solid #e2e8f0;
    padding-top: 2rem;
}

.examples-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: #1e293b;
}

.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
}

.example-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
}

.example-btn:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: translateY(-1px);
}

.example-number {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
}

.example-roman {
    font-size: 0.75rem;
    color: #64748b;
    font-family: serif;
}

/* 结果区域 */
.results-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.result-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    overflow: hidden;
    transition: all 0.2s;
}

.result-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.result-card.primary {
    border-color: #3b82f6;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.result-icon {
    font-size: 1.25rem;
}

.result-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin-left: 0.5rem;
    flex: 1;
}

.copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
}

.copy-btn:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
}

.result-body {
    padding: 1.5rem;
}

.result-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
    word-break: break-all;
    min-height: 1.5rem;
    line-height: 1.4;
}

.result-value.roman {
    font-family: serif;
    font-size: 1.5rem;
    letter-spacing: 0.05em;
}

.result-value.number {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1.25rem;
    font-weight: 600;
}

.result-value.binary,
.result-value.hex {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1rem;
}

.result-desc {
    font-size: 0.75rem;
    color: #64748b;
}

/* 规则说明 */
.rules-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.rules-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.rule-group h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: #1e293b;
}

.symbols-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;
}

.symbol-item {
    padding: 0.5rem;
    background: #f1f5f9;
    border-radius: 0.375rem;
    text-align: center;
    font-family: monospace;
    font-size: 0.875rem;
    color: #475569;
}

.rules-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.rule-item {
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #475569;
    line-height: 1.4;
}

/* 消息提示 */
.message {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 1000;
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
@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }

    .input-section,
    .results-section,
    .rules-section {
        padding: 1.5rem;
    }

    .rules-section {
        margin-bottom: 1.5rem;
    }

    .examples-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .results-grid {
        grid-template-columns: 1fr;
    }

    .rules-content {
        grid-template-columns: 1fr;
    }
}
</style>