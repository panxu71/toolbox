<template>
    <div class="unit-converter">
        <PageHeader :title="title" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="copy" tooltip="复制结果" @click="copyResult" />
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 单位类型选择 -->
            <div class="category-selector">
                <button class="scroll-btn scroll-left" @click="scrollLeft" :disabled="!canScrollLeft">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
                <div class="category-tabs-container">
                    <div class="category-tabs" ref="tabsContainer">
                        <button v-for="category in categories" :key="category.id" class="category-tab"
                            :class="{ active: selectedCategory === category.id }" @click="selectCategory(category.id)">
                            <span class="tab-icon">{{ category.icon }}</span>
                            <span class="tab-label">{{ category.name }}</span>
                        </button>
                    </div>
                </div>
                <button class="scroll-btn scroll-right" @click="scrollRight" :disabled="!canScrollRight">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </div>

            <!-- 快速示例 -->
            <div class="examples-section">
                <div class="section-header">
                    <h3>快速示例</h3>
                </div>
                <div class="conversions-grid">
                    <div v-for="conversion in getQuickConversions()" :key="conversion.id" class="conversion-item"
                        @click="applyQuickConversion(conversion)">
                        <div class="conversion-label">{{ conversion.label }}</div>
                        <div class="conversion-formula">{{ conversion.formula }}</div>
                    </div>
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
                        <HeaderActionButton icon="swap" tooltip="交换单位" @click="swapUnits" />
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
                            <div class="output-info">
                                <div class="unit-info">{{ getUnitInfo(toUnit) }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 转换公式说明 -->
                <div class="formula-section">
                    <div class="formula-header">
                        <h3>{{ getCurrentCategoryIcon() }} 转换公式</h3>
                    </div>
                    <div class="formula-content">
                        <div class="formula-info">
                            <div class="formula-text">{{ getConversionFormula() }}</div>
                            <div v-if="getFormulaExample()" class="formula-example">{{ getFormulaExample() }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import { useClipboard } from '../composables/useClipboard'

defineEmits<{
    back: []
}>()

// 使用 composables
usePageTitle('unit-convert')
const { success, error } = useNotification()
const { copy } = useClipboard()

// 页面标题
const title = ref('单位转换')

// 滑动相关
const tabsContainer = ref<HTMLElement>()
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

// 当前选择的类别
const selectedCategory = ref('length')
const inputValue = ref('')
const fromUnit = ref('')
const toUnit = ref('')
const outputValue = ref('')

// 单位类别定义
const categories = [
    { id: 'length', name: '长度', icon: '📏' },
    { id: 'weight', name: '重量', icon: '⚖️' },
    { id: 'temperature', name: '温度', icon: '🌡️' },
    { id: 'area', name: '面积', icon: '📐' },
    { id: 'volume', name: '体积', icon: '🥤' },
    { id: 'speed', name: '速度', icon: '🚗' },
    { id: 'pressure', name: '压力', icon: '💨' },
    { id: 'energy', name: '能量', icon: '⚡' },
    { id: 'power', name: '功率', icon: '🔌' },
    { id: 'frequency', name: '频率', icon: '📡' },
    { id: 'angle', name: '角度', icon: '📐' },
    { id: 'data', name: '数据', icon: '💾' }
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
    ],
    power: [
        { id: 'w', name: '瓦特', symbol: 'W', toW: 1, info: '国际标准功率单位' },
        { id: 'kw', name: '千瓦', symbol: 'kW', toW: 1000, info: '1千瓦 = 1000瓦特' },
        { id: 'mw', name: '兆瓦', symbol: 'MW', toW: 1000000, info: '1兆瓦 = 100万瓦特' },
        { id: 'hp', name: '马力', symbol: 'hp', toW: 745.7, info: '1马力 ≈ 745.7瓦特' },
        { id: 'ps', name: '公制马力', symbol: 'PS', toW: 735.5, info: '1公制马力 ≈ 735.5瓦特' },
        { id: 'btu_h', name: 'BTU/小时', symbol: 'BTU/h', toW: 0.293, info: '1BTU/h ≈ 0.293瓦特' }
    ],
    frequency: [
        { id: 'hz', name: '赫兹', symbol: 'Hz', toHz: 1, info: '国际标准频率单位' },
        { id: 'khz', name: '千赫', symbol: 'kHz', toHz: 1000, info: '1千赫 = 1000赫兹' },
        { id: 'mhz', name: '兆赫', symbol: 'MHz', toHz: 1000000, info: '1兆赫 = 100万赫兹' },
        { id: 'ghz', name: '吉赫', symbol: 'GHz', toHz: 1000000000, info: '1吉赫 = 10亿赫兹' },
        { id: 'rpm', name: '转/分', symbol: 'rpm', toHz: 0.0167, info: '1转/分 ≈ 0.0167赫兹' },
        { id: 'rps', name: '转/秒', symbol: 'rps', toHz: 1, info: '1转/秒 = 1赫兹' }
    ],
    angle: [
        { id: 'deg', name: '度', symbol: '°', toDeg: 1, info: '角度的常用单位' },
        { id: 'rad', name: '弧度', symbol: 'rad', toDeg: 57.2958, info: '1弧度 ≈ 57.296度' },
        { id: 'grad', name: '百分度', symbol: 'grad', toDeg: 0.9, info: '1百分度 = 0.9度' },
        { id: 'turn', name: '圈', symbol: 'turn', toDeg: 360, info: '1圈 = 360度' },
        { id: 'arcmin', name: '角分', symbol: "'", toDeg: 0.0167, info: '1角分 = 1/60度' },
        { id: 'arcsec', name: '角秒', symbol: '"', toDeg: 0.000278, info: '1角秒 = 1/3600度' }
    ],
    data: [
        { id: 'b', name: '字节', symbol: 'B', toByte: 1, info: '计算机存储基本单位' },
        { id: 'kb', name: '千字节', symbol: 'KB', toByte: 1024, info: '1KB = 1024字节' },
        { id: 'mb', name: '兆字节', symbol: 'MB', toByte: 1048576, info: '1MB = 1024KB' },
        { id: 'gb', name: '吉字节', symbol: 'GB', toByte: 1073741824, info: '1GB = 1024MB' },
        { id: 'tb', name: '太字节', symbol: 'TB', toByte: 1099511627776, info: '1TB = 1024GB' },
        { id: 'pb', name: '拍字节', symbol: 'PB', toByte: 1125899906842624, info: '1PB = 1024TB' },
        { id: 'bit', name: '比特', symbol: 'bit', toByte: 0.125, info: '1字节 = 8比特' }
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

    // 滚动到活跃标签
    nextTick(() => {
        scrollToActiveTab()
    })
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
        energy: 'toJ',
        power: 'toW',
        frequency: 'toHz',
        angle: 'toDeg',
        data: 'toByte'
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
        ],
        area: [
            { id: 1, label: '1平方米 → 平方厘米', formula: '1 m² = 10000 cm²', from: 'm2', to: 'cm2', value: 1 },
            { id: 2, label: '1公顷 → 平方米', formula: '1 ha = 10000 m²', from: 'hectare', to: 'm2', value: 1 },
            { id: 3, label: '1英亩 → 平方米', formula: '1 ac ≈ 4047 m²', from: 'acre', to: 'm2', value: 1 },
            { id: 4, label: '1平方千米 → 公顷', formula: '1 km² = 100 ha', from: 'km2', to: 'hectare', value: 1 }
        ],
        volume: [
            { id: 1, label: '1升 → 毫升', formula: '1 L = 1000 ml', from: 'l', to: 'ml', value: 1 },
            { id: 2, label: '1立方米 → 升', formula: '1 m³ = 1000 L', from: 'm3', to: 'l', value: 1 },
            { id: 3, label: '1加仑 → 升', formula: '1 gal ≈ 3.785 L', from: 'gallon', to: 'l', value: 1 },
            { id: 4, label: '1品脱 → 毫升', formula: '1 pt ≈ 473 ml', from: 'pint', to: 'ml', value: 1 }
        ],
        speed: [
            { id: 1, label: '1米/秒 → 千米/时', formula: '1 m/s = 3.6 km/h', from: 'ms', to: 'kmh', value: 1 },
            { id: 2, label: '100千米/时 → 英里/时', formula: '100 km/h ≈ 62.1 mph', from: 'kmh', to: 'mph', value: 100 },
            { id: 3, label: '1马赫 → 千米/时', formula: '1 Ma ≈ 1235 km/h', from: 'mach', to: 'kmh', value: 1 },
            { id: 4, label: '1节 → 千米/时', formula: '1 kn ≈ 1.852 km/h', from: 'knot', to: 'kmh', value: 1 }
        ],
        pressure: [
            { id: 1, label: '1大气压 → 千帕', formula: '1 atm ≈ 101.3 kPa', from: 'atm', to: 'kpa', value: 1 },
            { id: 2, label: '1巴 → 帕斯卡', formula: '1 bar = 100000 Pa', from: 'bar', to: 'pa', value: 1 },
            { id: 3, label: '1psi → 千帕', formula: '1 psi ≈ 6.895 kPa', from: 'psi', to: 'kpa', value: 1 },
            { id: 4, label: '760毫米汞柱 → 大气压', formula: '760 mmHg = 1 atm', from: 'mmhg', to: 'atm', value: 760 }
        ],
        energy: [
            { id: 1, label: '1千焦 → 焦耳', formula: '1 kJ = 1000 J', from: 'kj', to: 'j', value: 1 },
            { id: 2, label: '1千卡 → 焦耳', formula: '1 kcal = 4184 J', from: 'kcal', to: 'j', value: 1 },
            { id: 3, label: '1千瓦时 → 兆焦', formula: '1 kWh = 3.6 MJ', from: 'kwh', to: 'kj', value: 1 },
            { id: 4, label: '1BTU → 焦耳', formula: '1 BTU ≈ 1055 J', from: 'btu', to: 'j', value: 1 }
        ],
        power: [
            { id: 1, label: '1千瓦 → 瓦特', formula: '1 kW = 1000 W', from: 'kw', to: 'w', value: 1 },
            { id: 2, label: '1马力 → 瓦特', formula: '1 hp ≈ 745.7 W', from: 'hp', to: 'w', value: 1 },
            { id: 3, label: '1兆瓦 → 千瓦', formula: '1 MW = 1000 kW', from: 'mw', to: 'kw', value: 1 },
            { id: 4, label: '1公制马力 → 瓦特', formula: '1 PS ≈ 735.5 W', from: 'ps', to: 'w', value: 1 }
        ],
        frequency: [
            { id: 1, label: '1千赫 → 赫兹', formula: '1 kHz = 1000 Hz', from: 'khz', to: 'hz', value: 1 },
            { id: 2, label: '1兆赫 → 千赫', formula: '1 MHz = 1000 kHz', from: 'mhz', to: 'khz', value: 1 },
            { id: 3, label: '1吉赫 → 兆赫', formula: '1 GHz = 1000 MHz', from: 'ghz', to: 'mhz', value: 1 },
            { id: 4, label: '60转/分 → 赫兹', formula: '60 rpm = 1 Hz', from: 'rpm', to: 'hz', value: 60 }
        ],
        angle: [
            { id: 1, label: '180度 → 弧度', formula: '180° = π rad', from: 'deg', to: 'rad', value: 180 },
            { id: 2, label: '1弧度 → 度', formula: '1 rad ≈ 57.3°', from: 'rad', to: 'deg', value: 1 },
            { id: 3, label: '1圈 → 度', formula: '1 turn = 360°', from: 'turn', to: 'deg', value: 1 },
            { id: 4, label: '90度 → 百分度', formula: '90° = 100 grad', from: 'deg', to: 'grad', value: 90 }
        ],
        data: [
            { id: 1, label: '1KB → 字节', formula: '1 KB = 1024 B', from: 'kb', to: 'b', value: 1 },
            { id: 2, label: '1MB → KB', formula: '1 MB = 1024 KB', from: 'mb', to: 'kb', value: 1 },
            { id: 3, label: '1GB → MB', formula: '1 GB = 1024 MB', from: 'gb', to: 'mb', value: 1 },
            { id: 4, label: '1字节 → 比特', formula: '1 B = 8 bit', from: 'b', to: 'bit', value: 1 }
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
    success(`已应用转换: ${conversion.label}`)
}

// 获取当前类别图标
const getCurrentCategoryIcon = (): string => {
    const category = categories.find(c => c.id === selectedCategory.value)
    return category?.icon || '📐'
}

// 检查滑动状态
const checkScrollState = () => {
    if (!tabsContainer.value) return

    const container = tabsContainer.value
    const scrollLeft = container.scrollLeft
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth
    const maxScroll = scrollWidth - clientWidth

    canScrollLeft.value = scrollLeft > 5
    canScrollRight.value = maxScroll > 10 && scrollLeft < maxScroll - 5
}

// 向左滑动
const scrollLeft = () => {
    if (!tabsContainer.value) return

    const scrollAmount = 200
    tabsContainer.value.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    })

    setTimeout(checkScrollState, 300)
}

// 向右滑动
const scrollRight = () => {
    if (!tabsContainer.value) return

    const scrollAmount = 200
    tabsContainer.value.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    })

    setTimeout(checkScrollState, 300)
}

// 滚动到活跃标签
const scrollToActiveTab = () => {
    if (!tabsContainer.value || !tabsWrapper.value) return

    const activeTab = tabsWrapper.value.querySelector('.category-tab.active') as HTMLElement
    if (!activeTab) return

    const containerRect = tabsContainer.value.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()

    if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        const scrollLeft = activeTab.offsetLeft - (tabsContainer.value.clientWidth - activeTab.clientWidth) / 2
        tabsContainer.value.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        })
    }

    setTimeout(checkScrollState, 300)
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
        error('没有可复制的结果')
        return
    }

    const copySuccess = await copy(outputValue.value)
    if (copySuccess) {
        success('结果已复制到剪贴板')
    } else {
        error('复制失败')
    }
}

// 清空所有
const clearAll = () => {
    inputValue.value = ''
    outputValue.value = ''
    success('已清空所有内容')
}

// 初始化
// 初始化
onMounted(() => {
    selectCategory('length')

    // 初始化滑动状态，增加延迟确保DOM完全渲染
    setTimeout(() => {
        checkScrollState()

        // 监听容器滚动事件
        if (tabsContainer.value) {
            tabsContainer.value.addEventListener('scroll', checkScrollState)
        }

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            setTimeout(checkScrollState, 100)
        })
    }, 100)
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

.converter-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    min-height: 0;
}

/* 类别选择器 */
.category-selector {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 12px;
}

.scroll-btn {
    width: 32px;
    height: 32px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
}

.scroll-btn:hover:not(:disabled) {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border-color: var(--primary-color);
}

.scroll-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.category-tabs-container {
    flex: 1;
    position: relative;
    min-width: 0;
}

.category-tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 2px 8px 2px 2px;
    width: 100%;
    box-sizing: border-box;
}

.category-tabs::-webkit-scrollbar {
    display: none;
}

.category-tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 8px;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    box-sizing: border-box;
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
    font-size: 20px;
    line-height: 1;
}

.tab-label {
    font-size: 10px;
    font-weight: 500;
    line-height: 1;
    text-align: center;
}

/* 快速示例 */
.examples-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    flex-shrink: 0;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
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

.conversions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
    padding: 16px;
}

.conversion-item {
    padding: 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    display: block;
    width: 100%;
    box-sizing: border-box;
}

.conversion-item:hover {
    border-color: var(--primary-color);
    background: var(--bg-tertiary);
}

.conversion-label {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2px;
    font-size: 13px;
}

.conversion-formula {
    font-size: 11px;
    color: var(--text-secondary);
    font-family: var(--font-mono);
}

.no-conversions {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px 20px;
    color: var(--text-secondary);
    font-style: italic;
}

/* 转换器主体 */
.converter-main {
    display: flex;
    flex-direction: column;
    gap: 24px;
    flex-shrink: 0;
}

.conversion-panel {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 24px;
    align-items: start;
}

.input-section,
.output-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.unit-selector {
    display: flex;
    align-items: center;
    gap: 8px;
}

.unit-select {
    padding: 8px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 14px;
    cursor: pointer;
    min-width: 180px;
}

.input-area,
.output-area {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.value-input,
.value-output {
    padding: 16px 20px;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-size: 18px;
    font-family: var(--font-mono);
    font-weight: 500;
    transition: var(--transition);
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

.input-info,
.output-info {
    margin-top: 8px;
    padding: 8px 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    height: 32px;
}

.unit-info {
    font-size: 12px;
    color: var(--text-secondary);
    font-style: italic;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: center;
    line-height: 1.2;
}

/* 转换箭头 */
.conversion-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 60px;
}

/* 公式说明 */
.formula-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 20px;
    flex-shrink: 0;
}

.formula-header {
    margin-bottom: 16px;
}

.formula-header h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.formula-content {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 20px;
}

.formula-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.formula-text {
    font-family: var(--font-mono);
    font-size: 16px;
    color: var(--text-primary);
    background: var(--bg-primary);
    padding: 12px 16px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.formula-example {
    font-size: 14px;
    color: var(--text-secondary);
    font-style: italic;
    word-wrap: break-word;
    overflow-wrap: break-word;
    text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .conversion-panel {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .conversion-arrow {
        padding-top: 0;
        order: 2;
    }

    .output-section {
        order: 3;
    }
}

@media (max-width: 768px) {
    .converter-content {
        padding: 16px;
        gap: 20px;
    }

    .category-tab {
        width: 56px;
        height: 56px;
        padding: 6px;
        gap: 2px;
    }

    .tab-icon {
        font-size: 18px;
    }

    .tab-label {
        font-size: 9px;
    }

    .conversions-grid {
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        padding: 12px;
        gap: 6px;
    }

    .conversion-item {
        padding: 10px;
    }

    .conversion-label {
        font-size: 12px;
    }

    .conversion-formula {
        font-size: 10px;
    }

    .unit-select {
        min-width: 150px;
        font-size: 12px;
    }

    .value-input,
    .value-output {
        font-size: 16px;
        padding: 12px 16px;
    }
}
</style>