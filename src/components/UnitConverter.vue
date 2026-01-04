<template>
    <div class="unit-converter">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">单位转换工具</h2>
        </div>

        <div class="converter-content">
            <!-- 单位类型选择 -->
            <div class="category-selector">
                <div class="category-tabs">
                    <button v-for="category in categories" :key="category.id" class="category-tab"
                        :class="{ active: selectedCategory === category.id }" @click="selectCategory(category.id)">
                        <span class="tab-icon">{{ category.icon }}</span>
                        <span class="tab-label">{{ category.name }}</span>
                    </button>
                </div>
            </div>

            <!-- 转换器主体 -->
            <div class="converter-main">
                <div class="conversion-panel">
                    <!-- 输入区域 -->
                    <div class="input-section">
                        <div class="section-header">
                            <h3>输入值</h3>
                            <div class="unit-selector">
                                <select v-model="fromUnit" class="unit-select" @change="convert">
                                    <option v-for="unit in currentUnits" :key="unit.id" :value="unit.id">
                                        {{ unit.name }} ({{ unit.symbol }})
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="input-area">
                            <input v-model="inputValue" type="number" class="value-input" placeholder="请输入数值"
                                @input="convert" step="any" />
                            <div class="input-info">
                                <div class="unit-info">{{ getUnitInfo(fromUnit) }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 转换箭头 -->
                    <div class="conversion-arrow">
                        <button class="swap-btn" @click="swapUnits" title="交换单位">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M8 3L4 7l4 4" />
                                <path d="M4 7h16" />
                                <path d="m16 21 4-4-4-4" />
                                <path d="M20 17H4" />
                            </svg>
                        </button>
                    </div>

                    <!-- 输出区域 -->
                    <div class="output-section">
                        <div class="section-header">
                            <h3>转换结果</h3>
                            <div class="unit-selector">
                                <select v-model="toUnit" class="unit-select" @change="convert">
                                    <option v-for="unit in currentUnits" :key="unit.id" :value="unit.id">
                                        {{ unit.name }} ({{ unit.symbol }})
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="output-area">
                            <input :value="outputValue" class="value-output" readonly />
                            <button class="copy-btn" @click="copyResult" title="复制结果">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <div class="output-info">
                            <div class="unit-info">{{ getUnitInfo(toUnit) }}</div>
                        </div>
                    </div>
                </div>

                <!-- 常用转换 -->
                <div class="quick-conversions">
                    <h3>常用转换</h3>
                    <div class="conversions-grid">
                        <div v-for="conversion in getQuickConversions()" :key="conversion.id" class="conversion-item"
                            @click="applyQuickConversion(conversion)">
                            <div class="conversion-label">{{ conversion.label }}</div>
                            <div class="conversion-formula">{{ conversion.formula }}</div>
                        </div>
                    </div>
                </div>

                <!-- 转换公式说明 -->
                <div class="formula-section">
                    <h3>转换公式</h3>
                    <div class="formula-info">
                        <div class="formula-text">{{ getConversionFormula() }}</div>
                        <div class="formula-example">{{ getFormulaExample() }}</div>
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
import {  ref, computed, onMounted, onUnmounted  } from 'vue'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'

defineEmits<{
    back: []
}>()

// 当前选择的类别
const selectedCategory = ref('length')
const inputValue = ref('')
const fromUnit = ref('')
const toUnit = ref('')
const outputValue = ref('')

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 单位类别定义
const categories = [
    { id: 'length', name: '长度', icon: '📏' },
    { id: 'weight', name: '重量', icon: '⚖️' },
    { id: 'temperature', name: '温度', icon: '🌡️' },
    { id: 'area', name: '面积', icon: '📐' },
    { id: 'volume', name: '体积', icon: '🥤' },
    { id: 'speed', name: '速度', icon: '🚗' },
    { id: 'pressure', name: '压力', icon: '💨' },
    { id: 'energy', name: '能量', icon: '⚡' }
]

// 单位定义
const units = {
    length: [
        { id: 'mm', name: '毫米', symbol: 'mm', toMeter: 0.001, info: '1毫米 = 0.001米' },
        { id: 'cm', name: '厘米', symbol: 'cm', toMeter: 0.01, info: '1厘米 = 0.01米' },
        { id: 'm', name: '米', symbol: 'm', toMeter: 1, info: '国际标准长度单位' },
        { id: 'km', name: '千米', symbol: 'km', toMeter: 1000, info: '1千米 = 1000米' },
        { id: 'inch', name: '英寸', symbol: 'in', toMeter: 0.0254, info: '1英寸 = 2.54厘米' },
        { id: 'ft', name: '英尺', symbol: 'ft', toMeter: 0.3048, info: '1英尺 = 12英寸' },
        { id: 'yard', name: '码', symbol: 'yd', toMeter: 0.9144, info: '1码 = 3英尺' },
        { id: 'mile', name: '英里', symbol: 'mi', toMeter: 1609.344, info: '1英里 = 1.609千米' }
    ],
    weight: [
        { id: 'mg', name: '毫克', symbol: 'mg', toKg: 0.000001, info: '1毫克 = 0.001克' },
        { id: 'g', name: '克', symbol: 'g', toKg: 0.001, info: '1克 = 0.001千克' },
        { id: 'kg', name: '千克', symbol: 'kg', toKg: 1, info: '国际标准质量单位' },
        { id: 't', name: '吨', symbol: 't', toKg: 1000, info: '1吨 = 1000千克' },
        { id: 'oz', name: '盎司', symbol: 'oz', toKg: 0.0283495, info: '1盎司 ≈ 28.35克' },
        { id: 'lb', name: '磅', symbol: 'lb', toKg: 0.453592, info: '1磅 ≈ 0.454千克' },
        { id: 'stone', name: '英石', symbol: 'st', toKg: 6.35029, info: '1英石 = 14磅' }
    ],
    temperature: [
        { id: 'c', name: '摄氏度', symbol: '°C', info: '水的冰点0°C，沸点100°C' },
        { id: 'f', name: '华氏度', symbol: '°F', info: '水的冰点32°F，沸点212°F' },
        { id: 'k', name: '开尔文', symbol: 'K', info: '绝对温度，0K = -273.15°C' },
        { id: 'r', name: '兰氏度', symbol: '°R', info: '华氏度的绝对温标' }
    ],
    area: [
        { id: 'mm2', name: '平方毫米', symbol: 'mm²', toM2: 0.000001, info: '1平方毫米 = 0.000001平方米' },
        { id: 'cm2', name: '平方厘米', symbol: 'cm²', toM2: 0.0001, info: '1平方厘米 = 0.0001平方米' },
        { id: 'm2', name: '平方米', symbol: 'm²', toM2: 1, info: '国际标准面积单位' },
        { id: 'km2', name: '平方千米', symbol: 'km²', toM2: 1000000, info: '1平方千米 = 100万平方米' },
        { id: 'hectare', name: '公顷', symbol: 'ha', toM2: 10000, info: '1公顷 = 10000平方米' },
        { id: 'acre', name: '英亩', symbol: 'ac', toM2: 4046.86, info: '1英亩 ≈ 4047平方米' }
    ],
    volume: [
        { id: 'ml', name: '毫升', symbol: 'ml', toLiter: 0.001, info: '1毫升 = 0.001升' },
        { id: 'l', name: '升', symbol: 'L', toLiter: 1, info: '国际标准体积单位' },
        { id: 'm3', name: '立方米', symbol: 'm³', toLiter: 1000, info: '1立方米 = 1000升' },
        { id: 'gallon', name: '加仑', symbol: 'gal', toLiter: 3.78541, info: '1美制加仑 ≈ 3.785升' },
        { id: 'quart', name: '夸脱', symbol: 'qt', toLiter: 0.946353, info: '1夸脱 ≈ 0.946升' },
        { id: 'pint', name: '品脱', symbol: 'pt', toLiter: 0.473176, info: '1品脱 ≈ 0.473升' }
    ],
    speed: [
        { id: 'ms', name: '米/秒', symbol: 'm/s', toMs: 1, info: '国际标准速度单位' },
        { id: 'kmh', name: '千米/时', symbol: 'km/h', toMs: 0.277778, info: '1千米/时 ≈ 0.278米/秒' },
        { id: 'mph', name: '英里/时', symbol: 'mph', toMs: 0.44704, info: '1英里/时 ≈ 0.447米/秒' },
        { id: 'knot', name: '节', symbol: 'kn', toMs: 0.514444, info: '1节 ≈ 0.514米/秒' },
        { id: 'mach', name: '马赫', symbol: 'Ma', toMs: 343, info: '1马赫 ≈ 343米/秒（音速）' }
    ],
    pressure: [
        { id: 'pa', name: '帕斯卡', symbol: 'Pa', toPa: 1, info: '国际标准压力单位' },
        { id: 'kpa', name: '千帕', symbol: 'kPa', toPa: 1000, info: '1千帕 = 1000帕斯卡' },
        { id: 'bar', name: '巴', symbol: 'bar', toPa: 100000, info: '1巴 = 100000帕斯卡' },
        { id: 'atm', name: '标准大气压', symbol: 'atm', toPa: 101325, info: '1标准大气压 = 101325帕斯卡' },
        { id: 'psi', name: '磅/平方英寸', symbol: 'psi', toPa: 6894.76, info: '1psi ≈ 6895帕斯卡' },
        { id: 'mmhg', name: '毫米汞柱', symbol: 'mmHg', toPa: 133.322, info: '1毫米汞柱 ≈ 133帕斯卡' }
    ],
    energy: [
        { id: 'j', name: '焦耳', symbol: 'J', toJ: 1, info: '国际标准能量单位' },
        { id: 'kj', name: '千焦', symbol: 'kJ', toJ: 1000, info: '1千焦 = 1000焦耳' },
        { id: 'cal', name: '卡路里', symbol: 'cal', toJ: 4.184, info: '1卡路里 ≈ 4.184焦耳' },
        { id: 'kcal', name: '千卡', symbol: 'kcal', toJ: 4184, info: '1千卡 = 1000卡路里' },
        { id: 'kwh', name: '千瓦时', symbol: 'kWh', toJ: 3600000, info: '1千瓦时 = 3.6兆焦' },
        { id: 'btu', name: '英热单位', symbol: 'BTU', toJ: 1055.06, info: '1BTU ≈ 1055焦耳' }
    ]
}

// 当前类别的单位
const currentUnits = computed(() => {
    return units[selectedCategory.value as keyof typeof units] || []
})

// 选择类别
const selectCategory = (categoryId: string) => {
    selectedCategory.value = categoryId
    const firstUnit = currentUnits.value[0]
    const secondUnit = currentUnits.value[1] || firstUnit
    fromUnit.value = firstUnit?.id || ''
    toUnit.value = secondUnit?.id || ''
    convert()
}

// 交换单位
const swapUnits = () => {
    const temp = fromUnit.value
    fromUnit.value = toUnit.value
    toUnit.value = temp
    convert()
}

// 转换计算
const convert = () => {
    if (!inputValue.value || !fromUnit.value || !toUnit.value) {
        outputValue.value = ''
        return
    }

    const input = parseFloat(inputValue.value)
    if (isNaN(input)) {
        outputValue.value = ''
        return
    }

    let result = 0

    if (selectedCategory.value === 'temperature') {
        result = convertTemperature(input, fromUnit.value, toUnit.value)
    } else {
        result = convertStandardUnit(input, fromUnit.value, toUnit.value)
    }

    // 格式化结果
    if (Math.abs(result) >= 1000000 || (Math.abs(result) < 0.001 && result !== 0)) {
        outputValue.value = result.toExponential(6)
    } else {
        outputValue.value = parseFloat(result.toFixed(10)).toString()
    }
}

// 标准单位转换
const convertStandardUnit = (value: number, from: string, to: string): number => {
    const fromUnitData = currentUnits.value.find(u => u.id === from)
    const toUnitData = currentUnits.value.find(u => u.id === to)

    if (!fromUnitData || !toUnitData) return 0

    // 获取转换系数的属性名
    const conversionKey = getConversionKey()
    if (!conversionKey) return 0

    const fromFactor = (fromUnitData as any)[conversionKey]
    const toFactor = (toUnitData as any)[conversionKey]

    if (fromFactor === undefined || toFactor === undefined) return 0

    // 先转换到基准单位，再转换到目标单位
    return (value * fromFactor) / toFactor
}

// 获取转换系数属性名
const getConversionKey = (): string => {
    const keyMap: Record<string, string> = {
        length: 'toMeter',
        weight: 'toKg',
        area: 'toM2',
        volume: 'toLiter',
        speed: 'toMs',
        pressure: 'toPa',
        energy: 'toJ'
    }
    return keyMap[selectedCategory.value] || ''
}

// 温度转换
const convertTemperature = (value: number, from: string, to: string): number => {
    // 先转换到摄氏度
    let celsius = value
    switch (from) {
        case 'f':
            celsius = (value - 32) * 5 / 9
            break
        case 'k':
            celsius = value - 273.15
            break
        case 'r':
            celsius = (value - 491.67) * 5 / 9
            break
    }

    // 再从摄氏度转换到目标单位
    switch (to) {
        case 'c':
            return celsius
        case 'f':
            return celsius * 9 / 5 + 32
        case 'k':
            return celsius + 273.15
        case 'r':
            return celsius * 9 / 5 + 491.67
        default:
            return celsius
    }
}

// 获取单位信息
const getUnitInfo = (unitId: string): string => {
    const unit = currentUnits.value.find(u => u.id === unitId)
    return unit?.info || ''
}

// 获取常用转换
const getQuickConversions = () => {
    const conversions: Record<string, any[]> = {
        length: [
            { id: 1, label: '1米 → 厘米', formula: '1 m = 100 cm', from: 'm', to: 'cm', value: 1 },
            { id: 2, label: '1千米 → 英里', formula: '1 km ≈ 0.621 mi', from: 'km', to: 'mile', value: 1 },
            { id: 3, label: '1英寸 → 厘米', formula: '1 in = 2.54 cm', from: 'inch', to: 'cm', value: 1 },
            { id: 4, label: '1英尺 → 米', formula: '1 ft ≈ 0.305 m', from: 'ft', to: 'm', value: 1 }
        ],
        weight: [
            { id: 1, label: '1千克 → 磅', formula: '1 kg ≈ 2.205 lb', from: 'kg', to: 'lb', value: 1 },
            { id: 2, label: '1磅 → 千克', formula: '1 lb ≈ 0.454 kg', from: 'lb', to: 'kg', value: 1 },
            { id: 3, label: '1吨 → 磅', formula: '1 t ≈ 2205 lb', from: 't', to: 'lb', value: 1 },
            { id: 4, label: '1盎司 → 克', formula: '1 oz ≈ 28.35 g', from: 'oz', to: 'g', value: 1 }
        ],
        temperature: [
            { id: 1, label: '0°C → 华氏度', formula: '0°C = 32°F', from: 'c', to: 'f', value: 0 },
            { id: 2, label: '100°C → 华氏度', formula: '100°C = 212°F', from: 'c', to: 'f', value: 100 },
            { id: 3, label: '0°C → 开尔文', formula: '0°C = 273.15K', from: 'c', to: 'k', value: 0 },
            { id: 4, label: '室温 → 各单位', formula: '20°C = 68°F = 293K', from: 'c', to: 'f', value: 20 }
        ]
    }
    return conversions[selectedCategory.value] || []
}

// 应用快速转换
const applyQuickConversion = (conversion: any) => {
    fromUnit.value = conversion.from
    toUnit.value = conversion.to
    inputValue.value = conversion.value.toString()
    convert()
    showMessage(`已应用转换: ${conversion.label}`, 'success')
}

// 获取转换公式
const getConversionFormula = (): string => {
    if (!fromUnit.value || !toUnit.value) return ''

    const fromUnitData = currentUnits.value.find(u => u.id === fromUnit.value)
    const toUnitData = currentUnits.value.find(u => u.id === toUnit.value)

    if (!fromUnitData || !toUnitData) return ''

    if (selectedCategory.value === 'temperature') {
        return getTemperatureFormula(fromUnit.value, toUnit.value)
    }

    const conversionKey = getConversionKey()
    if (!conversionKey) return ''

    const fromFactor = (fromUnitData as any)[conversionKey]
    const toFactor = (toUnitData as any)[conversionKey]
    const ratio = fromFactor / toFactor

    return `1 ${fromUnitData.symbol} = ${parseFloat(ratio.toFixed(8))} ${toUnitData.symbol}`
}

// 获取温度转换公式
const getTemperatureFormula = (from: string, to: string): string => {
    const formulas: Record<string, Record<string, string>> = {
        c: {
            f: '°F = °C × 9/5 + 32',
            k: 'K = °C + 273.15',
            r: '°R = °C × 9/5 + 491.67'
        },
        f: {
            c: '°C = (°F - 32) × 5/9',
            k: 'K = (°F - 32) × 5/9 + 273.15',
            r: '°R = °F + 459.67'
        },
        k: {
            c: '°C = K - 273.15',
            f: '°F = (K - 273.15) × 9/5 + 32',
            r: '°R = K × 9/5'
        }
    }
    return formulas[from]?.[to] || `${from} → ${to}`
}

// 获取公式示例
const getFormulaExample = (): string => {
    if (!inputValue.value || !outputValue.value) return ''

    const fromUnitData = currentUnits.value.find(u => u.id === fromUnit.value)
    const toUnitData = currentUnits.value.find(u => u.id === toUnit.value)

    if (!fromUnitData || !toUnitData) return ''

    return `${inputValue.value} ${fromUnitData.symbol} = ${outputValue.value} ${toUnitData.symbol}`
}

// 复制结果
const copyResult = async () => {
    if (!outputValue.value) {
        showMessage('没有可复制的结果', 'error')
        return
    }

    try {
        await navigator.clipboard.writeText(outputValue.value)
        showMessage('结果已复制到剪贴板', 'success')
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
onMounted(() => {
    setPageTitle('unit-converter')
    selectCategory('length')
})

onUnmounted(() => {
    restoreDefaultTitle()
})
</script>

<style scoped>
.unit-converter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.converter-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
}

.back-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.converter-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
}

.converter-content {
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

/* 类别选择器 */
.category-selector {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1rem;
}

.category-tabs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
}

.category-tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0.75rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.category-tab:hover {
    border-color: var(--primary-color);
    background: var(--bg-tertiary);
}

.category-tab.active {
    border-color: var(--primary-color);
    background: var(--primary-color);
    color: white;
}

.tab-icon {
    font-size: 1.5rem;
}

.tab-label {
    font-size: 0.875rem;
    font-weight: 500;
}

/* 转换器主体 */
.converter-main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.conversion-panel {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: start;
}

.input-section,
.output-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
}

.section-header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.unit-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.unit-select {
    padding: 0.5rem 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    cursor: pointer;
    min-width: 200px;
}

.input-area,
.output-area {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.value-input,
.value-output {
    flex: 1;
    padding: 1rem 1.25rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 1.25rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-weight: 500;
    transition: all 0.2s ease;
}

.value-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.value-output {
    background: var(--bg-tertiary);
    cursor: default;
}

.copy-btn {
    padding: 0.75rem;
    background: var(--primary-color);
    border: none;
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-btn:hover {
    background: var(--primary-color-dark, #4f46e5);
}

.input-info,
.output-info {
    padding: 0 1.5rem 1rem 1.5rem;
}

.unit-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-style: italic;
}

/* 转换箭头 */
.conversion-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 4rem;
}

.swap-btn {
    padding: 1rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 50%;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.swap-btn:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
    transform: rotate(180deg);
}

/* 常用转换 */
.quick-conversions {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
}

.quick-conversions h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
}

.conversions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.conversion-item {
    padding: 1rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.conversion-item:hover {
    border-color: var(--primary-color);
    background: var(--bg-tertiary);
}

.conversion-label {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.conversion-formula {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-family: monospace;
}

/* 公式说明 */
.formula-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
}

.formula-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
}

.formula-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.formula-text {
    font-family: monospace;
    font-size: 1rem;
    color: var(--text-primary);
    background: var(--bg-primary);
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
}

.formula-example {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-style: italic;
}

/* 消息提示 */
.message {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
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
@media (max-width: 1024px) {
    .conversion-panel {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .conversion-arrow {
        padding-top: 0;
        order: 2;
    }

    .output-section {
        order: 3;
    }

    .swap-btn:hover {
        transform: rotate(90deg);
    }
}

@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        gap: 1.5rem;
    }

    .category-tabs {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    }

    .category-tab {
        padding: 0.75rem 0.5rem;
    }

    .tab-icon {
        font-size: 1.25rem;
    }

    .tab-label {
        font-size: 0.75rem;
    }

    .conversions-grid {
        grid-template-columns: 1fr;
    }

    .unit-select {
        min-width: 150px;
        font-size: 0.75rem;
    }
}

@media (max-width: 480px) {
    .converter-header {
        padding: 1rem;
    }

    .converter-title {
        font-size: 1.25rem;
    }

    .section-header {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
    }

    .input-area,
    .output-area {
        flex-direction: column;
        align-items: stretch;
    }

    .copy-btn {
        align-self: flex-end;
        margin-top: 0.5rem;
    }
}
</style>