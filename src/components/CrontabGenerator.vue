<template>
    <div class="crontab-generator">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <div class="mode-toggle">
                    <button class="mode-btn" :class="{ active: mode === 'visual' }" @click="setMode('visual')">
                        可视化
                    </button>
                    <button class="mode-btn" :class="{ active: mode === 'manual' }" @click="setMode('manual')">
                        手动输入
                    </button>
                </div>
                <HeaderActionButton icon="copy" tooltip="复制表达式" @click="copyCron" :disabled="!cronExpression" />
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="generator-content">
            <!-- 左侧配置区域 -->
            <div class="config-section">
                <div class="section-header">
                    <h3>定时配置</h3>
                </div>

                <!-- 可视化配置 -->
                <div v-if="mode === 'visual'" class="visual-config">
                    <!-- 详细配置 - 横向布局 -->
                    <div class="config-grid">
                        <div class="config-item">
                            <label class="config-label">分钟</label>
                            <select v-model="cronConfig.minute.type" class="config-select-compact" @change="updateCron">
                                <option value="*">每分钟</option>
                                <option value="specific">指定</option>
                                <option value="interval">间隔</option>
                                <option value="range">范围</option>
                            </select>
                            <input v-if="cronConfig.minute.type === 'specific'" v-model="cronConfig.minute.value"
                                type="number" min="0" max="59" class="config-input-compact" @input="updateCron"
                                placeholder="0-59" />
                            <div v-if="cronConfig.minute.type === 'interval'" class="interval-compact">
                                <span>每</span>
                                <input v-model="cronConfig.minute.interval" type="number" min="1" max="59"
                                    class="config-input-tiny" @input="updateCron" />
                                <span>分</span>
                            </div>
                            <div v-if="cronConfig.minute.type === 'range'" class="range-compact">
                                <input v-model="cronConfig.minute.start" type="number" min="0" max="59"
                                    class="config-input-tiny" @input="updateCron" />
                                <span>-</span>
                                <input v-model="cronConfig.minute.end" type="number" min="0" max="59"
                                    class="config-input-tiny" @input="updateCron" />
                            </div>
                        </div>

                        <div class="config-item">
                            <label class="config-label">小时</label>
                            <select v-model="cronConfig.hour.type" class="config-select-compact" @change="updateCron">
                                <option value="*">每小时</option>
                                <option value="specific">指定</option>
                                <option value="interval">间隔</option>
                                <option value="range">范围</option>
                            </select>
                            <input v-if="cronConfig.hour.type === 'specific'" v-model="cronConfig.hour.value"
                                type="number" min="0" max="23" class="config-input-compact" @input="updateCron"
                                placeholder="0-23" />
                            <div v-if="cronConfig.hour.type === 'interval'" class="interval-compact">
                                <span>每</span>
                                <input v-model="cronConfig.hour.interval" type="number" min="1" max="23"
                                    class="config-input-tiny" @input="updateCron" />
                                <span>时</span>
                            </div>
                            <div v-if="cronConfig.hour.type === 'range'" class="range-compact">
                                <input v-model="cronConfig.hour.start" type="number" min="0" max="23"
                                    class="config-input-tiny" @input="updateCron" />
                                <span>-</span>
                                <input v-model="cronConfig.hour.end" type="number" min="0" max="23"
                                    class="config-input-tiny" @input="updateCron" />
                            </div>
                        </div>

                        <div class="config-item">
                            <label class="config-label">日期</label>
                            <select v-model="cronConfig.day.type" class="config-select-compact" @change="updateCron">
                                <option value="*">每天</option>
                                <option value="specific">指定</option>
                                <option value="interval">间隔</option>
                                <option value="range">范围</option>
                            </select>
                            <input v-if="cronConfig.day.type === 'specific'" v-model="cronConfig.day.value"
                                type="number" min="1" max="31" class="config-input-compact" @input="updateCron"
                                placeholder="1-31" />
                            <div v-if="cronConfig.day.type === 'interval'" class="interval-compact">
                                <span>每</span>
                                <input v-model="cronConfig.day.interval" type="number" min="1" max="31"
                                    class="config-input-tiny" @input="updateCron" />
                                <span>天</span>
                            </div>
                            <div v-if="cronConfig.day.type === 'range'" class="range-compact">
                                <input v-model="cronConfig.day.start" type="number" min="1" max="31"
                                    class="config-input-tiny" @input="updateCron" />
                                <span>-</span>
                                <input v-model="cronConfig.day.end" type="number" min="1" max="31"
                                    class="config-input-tiny" @input="updateCron" />
                            </div>
                        </div>

                        <div class="config-item">
                            <label class="config-label">月份</label>
                            <select v-model="cronConfig.month.type" class="config-select-compact" @change="updateCron">
                                <option value="*">每月</option>
                                <option value="specific">指定</option>
                                <option value="interval">间隔</option>
                                <option value="range">范围</option>
                            </select>
                            <input v-if="cronConfig.month.type === 'specific'" v-model="cronConfig.month.value"
                                type="number" min="1" max="12" class="config-input-compact" @input="updateCron"
                                placeholder="1-12" />
                            <div v-if="cronConfig.month.type === 'interval'" class="interval-compact">
                                <span>每</span>
                                <input v-model="cronConfig.month.interval" type="number" min="1" max="12"
                                    class="config-input-tiny" @input="updateCron" />
                                <span>月</span>
                            </div>
                            <div v-if="cronConfig.month.type === 'range'" class="range-compact">
                                <input v-model="cronConfig.month.start" type="number" min="1" max="12"
                                    class="config-input-tiny" @input="updateCron" />
                                <span>-</span>
                                <input v-model="cronConfig.month.end" type="number" min="1" max="12"
                                    class="config-input-tiny" @input="updateCron" />
                            </div>
                        </div>

                        <div class="config-item">
                            <label class="config-label">星期</label>
                            <select v-model="cronConfig.weekday.type" class="config-select-compact"
                                @change="updateCron">
                                <option value="*">每天</option>
                                <option value="specific">指定</option>
                                <option value="range">范围</option>
                            </select>
                            <select v-if="cronConfig.weekday.type === 'specific'" v-model="cronConfig.weekday.value"
                                class="config-select-compact" @change="updateCron">
                                <option value="0">周日</option>
                                <option value="1">周一</option>
                                <option value="2">周二</option>
                                <option value="3">周三</option>
                                <option value="4">周四</option>
                                <option value="5">周五</option>
                                <option value="6">周六</option>
                            </select>
                            <div v-if="cronConfig.weekday.type === 'range'" class="range-compact">
                                <select v-model="cronConfig.weekday.start" class="config-select-tiny"
                                    @change="updateCron">
                                    <option value="0">日</option>
                                    <option value="1">一</option>
                                    <option value="2">二</option>
                                    <option value="3">三</option>
                                    <option value="4">四</option>
                                    <option value="5">五</option>
                                    <option value="6">六</option>
                                </select>
                                <span>-</span>
                                <select v-model="cronConfig.weekday.end" class="config-select-tiny"
                                    @change="updateCron">
                                    <option value="0">日</option>
                                    <option value="1">一</option>
                                    <option value="2">二</option>
                                    <option value="3">三</option>
                                    <option value="4">四</option>
                                    <option value="5">五</option>
                                    <option value="6">六</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- 常用预设 -->
                    <div class="presets-section">
                        <h4 class="presets-title">常用预设</h4>
                        <div class="presets-grid">
                            <button v-for="preset in commonPresets" :key="preset.name" class="preset-btn"
                                @click="applyPreset(preset.cron)">
                                <div class="preset-name">{{ preset.name }}</div>
                                <div class="preset-desc">{{ preset.desc }}</div>
                                <div class="preset-cron">{{ preset.cron }}</div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 手动输入 -->
                <div v-if="mode === 'manual'" class="manual-config">
                    <div class="manual-input-section">
                        <label class="section-label">Cron表达式</label>
                        <div class="cron-input-wrapper">
                            <input v-model="manualCron" type="text" class="cron-input" placeholder="* * * * *"
                                @input="parseCron" />
                            <HeaderActionButton icon="validate" tooltip="验证表达式" @click="validateCron" />
                        </div>
                        <div class="cron-format-help">
                            <span class="format-text">格式：分钟 小时 日期 月份 星期</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧结果区域 -->
            <div class="result-section">
                <div class="section-header">
                    <h3>生成结果</h3>
                </div>

                <div class="result-content">
                    <!-- Cron表达式显示 -->
                    <div class="cron-display">
                        <div class="cron-expression">
                            <span class="cron-label">Cron表达式：</span>
                            <code class="cron-code">{{ cronExpression || '* * * * *' }}</code>
                        </div>
                        <div class="cron-description">
                            <span class="desc-label">执行时间：</span>
                            <span class="desc-text">{{ cronDescription }}</span>
                        </div>
                    </div>

                    <!-- 字段说明 -->
                    <div class="field-explanation">
                        <h4>字段说明</h4>
                        <div class="field-grid">
                            <div class="field-item">
                                <span class="field-name">分钟</span>
                                <span class="field-value">{{ getFieldValue('minute') }}</span>
                                <span class="field-desc">0-59</span>
                            </div>
                            <div class="field-item">
                                <span class="field-name">小时</span>
                                <span class="field-value">{{ getFieldValue('hour') }}</span>
                                <span class="field-desc">0-23</span>
                            </div>
                            <div class="field-item">
                                <span class="field-name">日期</span>
                                <span class="field-value">{{ getFieldValue('day') }}</span>
                                <span class="field-desc">1-31</span>
                            </div>
                            <div class="field-item">
                                <span class="field-name">月份</span>
                                <span class="field-value">{{ getFieldValue('month') }}</span>
                                <span class="field-desc">1-12</span>
                            </div>
                            <div class="field-item">
                                <span class="field-name">星期</span>
                                <span class="field-value">{{ getFieldValue('weekday') }}</span>
                                <span class="field-desc">0-7</span>
                            </div>
                        </div>
                    </div>

                    <!-- 下次执行时间 -->
                    <div class="next-execution">
                        <h4>下次执行时间</h4>
                        <div class="execution-list">
                            <div v-for="(time, index) in nextExecutions" :key="index" class="execution-item">
                                <span class="execution-time">{{ time }}</span>
                            </div>
                        </div>
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
import { useClipboard } from '../composables/useClipboard'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 使用组合式函数
usePageTitle('crontab-generator')
const { success: showSuccess, error: showError } = useNotification()
const { copyToClipboard } = useClipboard()

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'crontab-generator')
        if (card) {
            return card.title
        }
    }
    return 'Crontab表达式生成器'
})

// 模式
const mode = ref<'visual' | 'manual'>('visual')

// Cron配置
const cronConfig = ref({
    minute: { type: '*', value: 0, interval: 1, start: 0, end: 59 },
    hour: { type: '*', value: 0, interval: 1, start: 0, end: 23 },
    day: { type: '*', value: 1, interval: 1, start: 1, end: 31 },
    month: { type: '*', value: 1, interval: 1, start: 1, end: 12 },
    weekday: { type: '*', value: 0, start: 0, end: 6 }
})

// 手动输入的cron表达式
const manualCron = ref('* * * * *')

// 常用预设配置
const commonPresets = [
    { name: '每分钟', desc: '每分钟执行一次', cron: '* * * * *' },
    { name: '每5分钟', desc: '每5分钟执行一次', cron: '*/5 * * * *' },
    { name: '每10分钟', desc: '每10分钟执行一次', cron: '*/10 * * * *' },
    { name: '每15分钟', desc: '每15分钟执行一次', cron: '*/15 * * * *' },
    { name: '每30分钟', desc: '每30分钟执行一次', cron: '*/30 * * * *' },
    { name: '每小时', desc: '每小时整点执行', cron: '0 * * * *' },
    { name: '每2小时', desc: '每2小时执行一次', cron: '0 */2 * * *' },
    { name: '每3小时', desc: '每3小时执行一次', cron: '0 */3 * * *' },
    { name: '每4小时', desc: '每4小时执行一次', cron: '0 */4 * * *' },
    { name: '每6小时', desc: '每6小时执行一次', cron: '0 */6 * * *' },
    { name: '每12小时', desc: '每12小时执行一次', cron: '0 */12 * * *' },
    { name: '每天午夜', desc: '每天0点执行', cron: '0 0 * * *' },
    { name: '每天凌晨2点', desc: '每天凌晨2点执行', cron: '0 2 * * *' },
    { name: '每天早上6点', desc: '每天早上6点执行', cron: '0 6 * * *' },
    { name: '每天早上9点', desc: '每天上午9点执行', cron: '0 9 * * *' },
    { name: '每天中午', desc: '每天12点执行', cron: '0 12 * * *' },
    { name: '每天晚上6点', desc: '每天下午6点执行', cron: '0 18 * * *' },
    { name: '每天晚上10点', desc: '每天晚上10点执行', cron: '0 22 * * *' },
    { name: '工作日9点', desc: '周一到周五9点执行', cron: '0 9 * * 1-5' },
    { name: '工作日下班', desc: '周一到周五18点执行', cron: '0 18 * * 1-5' },
    { name: '工作日午休', desc: '周一到周五12点执行', cron: '0 12 * * 1-5' },
    { name: '每周一', desc: '每周一0点执行', cron: '0 0 * * 1' },
    { name: '每周五', desc: '每周五0点执行', cron: '0 0 * * 5' },
    { name: '每周日', desc: '每周日0点执行', cron: '0 0 * * 0' },
    { name: '周末', desc: '每周六日0点执行', cron: '0 0 * * 0,6' },
    { name: '每月1号', desc: '每月1号0点执行', cron: '0 0 1 * *' },
    { name: '每月15号', desc: '每月15号0点执行', cron: '0 0 15 * *' },
    { name: '每月最后一天', desc: '每月最后一天0点执行', cron: '0 0 L * *' },
    { name: '每季度', desc: '每季度第一天执行', cron: '0 0 1 */3 *' },
    { name: '每半年', desc: '每半年第一天执行', cron: '0 0 1 */6 *' },
    { name: '每年元旦', desc: '每年1月1日执行', cron: '0 0 1 1 *' }
]

// 计算生成的cron表达式
const cronExpression = computed(() => {
    if (mode.value === 'manual') {
        return manualCron.value
    }

    const parts = []

    // 分钟
    parts.push(buildCronPart(cronConfig.value.minute))
    // 小时
    parts.push(buildCronPart(cronConfig.value.hour))
    // 日期
    parts.push(buildCronPart(cronConfig.value.day))
    // 月份
    parts.push(buildCronPart(cronConfig.value.month))
    // 星期
    parts.push(buildCronPart(cronConfig.value.weekday))

    return parts.join(' ')
})

// 计算cron描述
const cronDescription = computed(() => {
    return describeCron(cronExpression.value)
})

// 计算下次执行时间
const nextExecutions = computed(() => {
    return getNextExecutions(cronExpression.value, 5)
})

// 设置模式
const setMode = (newMode: 'visual' | 'manual') => {
    mode.value = newMode
    if (newMode === 'manual') {
        manualCron.value = cronExpression.value
    }
}

// 应用预设
const applyPreset = (cronExpr: string) => {
    const parts = cronExpr.split(' ')
    if (parts.length !== 5) return

    // 解析并应用到配置
    const [minute, hour, day, month, weekday] = parts

    // 解析分钟
    if (minute) cronConfig.value.minute = parseCronField(minute, 0, 59)
    // 解析小时
    if (hour) cronConfig.value.hour = parseCronField(hour, 0, 23)
    // 解析日期
    if (day) cronConfig.value.day = parseCronField(day, 1, 31)
    // 解析月份
    if (month) cronConfig.value.month = parseCronField(month, 1, 12)
    // 解析星期
    if (weekday) cronConfig.value.weekday = parseCronField(weekday, 0, 6)

    mode.value = 'visual'
    updateCron()
    showSuccess('已应用预设配置')
}

// 解析cron字段
const parseCronField = (field: string, min: number, max: number): any => {
    if (field === '*') {
        return { type: '*', value: min, interval: 1, start: min, end: max }
    } else if (field.includes('/')) {
        const interval = parseInt(field.split('/')[1] || '1')
        return { type: 'interval', value: min, interval, start: min, end: max }
    } else if (field.includes('-')) {
        const [start, end] = field.split('-')
        return { type: 'range', value: min, interval: 1, start: parseInt(start || min.toString()), end: parseInt(end || max.toString()) }
    } else {
        return { type: 'specific', value: parseInt(field), interval: 1, start: min, end: max }
    }
}

// 构建cron部分
const buildCronPart = (config: any): string => {
    switch (config.type) {
        case '*':
            return '*'
        case 'specific':
            return config.value.toString()
        case 'interval':
            return `*/${config.interval}`
        case 'range':
            return `${config.start}-${config.end}`
        default:
            return '*'
    }
}

// 更新cron表达式
const updateCron = () => {
    // 触发计算属性更新
}

// 解析cron表达式
const parseCron = () => {
    try {
        validateCronExpression(manualCron.value)
        showSuccess('Cron表达式格式正确')
    } catch (error) {
        showError(`Cron表达式格式错误: ${(error as Error).message}`)
    }
}

// 验证cron表达式
const validateCron = () => {
    try {
        validateCronExpression(manualCron.value)
        showSuccess('Cron表达式验证通过')
    } catch (error) {
        showError(`验证失败: ${(error as Error).message}`)
    }
}

// 验证cron表达式格式
const validateCronExpression = (cron: string) => {
    const parts = cron.trim().split(/\s+/)
    if (parts.length !== 5) {
        throw new Error('Cron表达式必须包含5个字段')
    }

    const ranges = [
        { min: 0, max: 59, name: '分钟' },
        { min: 0, max: 23, name: '小时' },
        { min: 1, max: 31, name: '日期' },
        { min: 1, max: 12, name: '月份' },
        { min: 0, max: 7, name: '星期' }
    ]

    parts.forEach((part, index) => {
        if (part === '*') return

        const range = ranges[index]

        // 处理间隔 */n
        if (part.includes('/')) {
            const [base, interval] = part.split('/')
            if (base !== '*' && range && !isValidRange(base || '*', range)) {
                throw new Error(`${range?.name || '字段'}格式错误: ${part}`)
            }
            const intervalNum = parseInt(interval || '0')
            if (isNaN(intervalNum) || intervalNum <= 0) {
                throw new Error(`${range?.name || '字段'}间隔值无效: ${interval ?? 'undefined'}`)
            }
            return
        }

        // 处理范围 n-m
        if (part.includes('-')) {
            const [start, end] = part.split('-')
            const startNum = parseInt(start || '0')
            const endNum = parseInt(end || '0')
            if (isNaN(startNum) || isNaN(endNum) ||
                (range && (startNum < range.min || startNum > range.max ||
                    endNum < range.min || endNum > range.max)) ||
                startNum >= endNum) {
                throw new Error(`${range?.name || '字段'}范围无效: ${part}`)
            }
            return
        }

        // 处理列表 n,m,o
        if (part.includes(',')) {
            const values = part.split(',')
            for (const value of values) {
                const num = parseInt(value)
                if (isNaN(num) || (range && (num < range.min || num > range.max))) {
                    throw new Error(`${range?.name || '字段'}值无效: ${value}`)
                }
            }
            return
        }

        // 处理单个数字
        const num = parseInt(part)
        if (isNaN(num) || (range && (num < range.min || num > range.max))) {
            throw new Error(`${range?.name || '字段'}值无效: ${part}`)
        }
    })
}

// 验证范围
const isValidRange = (value: string, range: any): boolean => {
    if (value === '*') return true
    const num = parseInt(value)
    return !isNaN(num) && num >= range.min && num <= range.max
}

// 描述cron表达式
const describeCron = (cron: string): string => {
    try {
        const parts = cron.split(' ')
        if (parts.length !== 5) return '无效的Cron表达式'

        const [minute, hour, day, month, weekday] = parts

        let desc = ''

        // 月份描述（最大时间单位）
        if (month && month !== '*') {
            if (month.includes('/')) {
                const interval = month.split('/')[1]
                desc += `每${interval}个月`
            } else if (month.includes('-')) {
                const [start, end] = month.split('-')
                desc += `${start}月到${end}月`
            } else {
                desc += `${month}月`
            }
        }

        // 日期和星期描述
        if (day === '*' && weekday === '*') {
            desc += desc ? '的每天' : '每天'
        } else if (day && day !== '*' && weekday === '*') {
            if (day.includes('/')) {
                const interval = day.split('/')[1]
                desc += desc ? `的每${interval}天` : `每${interval}天`
            } else if (day.includes('-')) {
                const [start, end] = day.split('-')
                desc += desc ? `的${start}号到${end}号` : `每月${start}号到${end}号`
            } else {
                desc += desc ? `的${day}号` : `每月${day}号`
            }
        } else if (day === '*' && weekday && weekday !== '*') {
            const weekNames = ['日', '一', '二', '三', '四', '五', '六', '日']
            if (weekday.includes('-')) {
                const [start, end] = weekday.split('-')
                const startIdx = parseInt(start || '0')
                const endIdx = parseInt(end || '0')
                desc += desc ? `的每周${weekNames[startIdx]}到周${weekNames[endIdx]}` : `每周${weekNames[startIdx]}到周${weekNames[endIdx]}`
            } else {
                const weekIdx = parseInt(weekday)
                desc += desc ? `的每周${weekNames[weekIdx]}` : `每周${weekNames[weekIdx]}`
            }
        }

        // 小时描述
        if (hour && hour === '*') {
            desc += '的每小时'
        } else if (hour && hour.includes('/')) {
            const interval = hour.split('/')[1]
            desc += `的每${interval}小时`
        } else if (hour && hour.includes('-')) {
            const [start, end] = hour.split('-')
            desc += `的${start}点到${end}点`
        } else if (hour) {
            desc += `的${hour}点`
        }

        // 分钟描述（最小时间单位）
        if (minute && minute === '*') {
            desc += '每分钟'
        } else if (minute && minute.includes('/')) {
            const interval = minute.split('/')[1]
            desc += `每${interval}分钟`
        } else if (minute) {
            desc += `${minute}分`
        }

        return desc + '执行'
    } catch (error) {
        return '无法解析Cron表达式'
    }
}

// 获取字段值显示
const getFieldValue = (field: string): string => {
    const parts = cronExpression.value.split(' ')
    const fieldMap = {
        minute: 0,
        hour: 1,
        day: 2,
        month: 3,
        weekday: 4
    }

    const index = fieldMap[field as keyof typeof fieldMap]
    return parts[index] || '*'
}

// 获取下次执行时间
const getNextExecutions = (cron: string, count: number): string[] => {
    try {
        if (!cron || cron === '* * * * *') {
            // 对于每分钟执行的情况，显示接下来几分钟
            const executions = []
            const now = new Date()
            for (let i = 0; i < count; i++) {
                const nextTime = new Date(now.getTime() + (i + 1) * 60000)
                executions.push(nextTime.toLocaleString('zh-CN'))
            }
            return executions
        }

        validateCronExpression(cron)
        const executions = []
        let currentTime = new Date()

        // 计算接下来的执行时间
        for (let i = 0; i < count && i < 50; i++) { // 限制最多计算50次，防止无限循环
            const nextTime = getNextCronExecution(cron, currentTime)
            if (nextTime) {
                executions.push(nextTime.toLocaleString('zh-CN'))
                currentTime = new Date(nextTime.getTime() + 60000) // 下次计算从这个时间+1分钟开始
            } else {
                break
            }
        }

        return executions.length > 0 ? executions : ['无法计算执行时间']
    } catch (error) {
        return ['无法计算执行时间']
    }
}

// 计算下一次cron执行时间
const getNextCronExecution = (cron: string, fromTime: Date): Date | null => {
    try {
        const parts = cron.split(' ')
        if (parts.length !== 5) return null

        const minutePart = parts[0] || '*'
        const hourPart = parts[1] || '*'
        const dayPart = parts[2] || '*'
        const monthPart = parts[3] || '*'
        const weekdayPart = parts[4] || '*'

        // 从当前时间的下一分钟开始计算
        let nextTime = new Date(fromTime)
        nextTime.setSeconds(0, 0)
        nextTime.setMinutes(nextTime.getMinutes() + 1)

        // 最多向前查找一年
        const maxTime = new Date(fromTime.getTime() + 365 * 24 * 60 * 60 * 1000)

        while (nextTime <= maxTime) {
            if (matchesCronExpression(nextTime, minutePart, hourPart, dayPart, monthPart, weekdayPart)) {
                return nextTime
            }
            nextTime.setMinutes(nextTime.getMinutes() + 1)
        }

        return null
    } catch (error) {
        return null
    }
}

// 检查时间是否匹配cron表达式
const matchesCronExpression = (
    time: Date,
    minutePart: string,
    hourPart: string,
    dayPart: string,
    monthPart: string,
    weekdayPart: string
): boolean => {
    const minute = time.getMinutes()
    const hour = time.getHours()
    const day = time.getDate()
    const month = time.getMonth() + 1 // JavaScript月份从0开始
    const weekday = time.getDay() // 0=周日, 1=周一, ...

    return (
        matchesCronField(minute, minutePart, 0, 59) &&
        matchesCronField(hour, hourPart, 0, 23) &&
        matchesCronField(day, dayPart, 1, 31) &&
        matchesCronField(month, monthPart, 1, 12) &&
        matchesCronField(weekday, weekdayPart, 0, 7) // 支持0-7，其中0和7都表示周日
    )
}

// 检查值是否匹配cron字段
const matchesCronField = (value: number, cronField: string, min: number, max: number): boolean => {
    if (cronField === '*') return true

    // 处理间隔 */n
    if (cronField.includes('/')) {
        const parts = cronField.split('/')
        const base = parts[0] || '*'
        const intervalStr = parts[1] || '1'
        const interval = parseInt(intervalStr)
        if (base === '*') {
            return value % interval === 0
        } else {
            const baseValue = parseInt(base)
            return value >= baseValue && (value - baseValue) % interval === 0
        }
    }

    // 处理范围 n-m
    if (cronField.includes('-')) {
        const parts = cronField.split('-')
        const start = parts[0] || min.toString()
        const end = parts[1] || max.toString()
        const startValue = parseInt(start)
        const endValue = parseInt(end)
        return value >= startValue && value <= endValue
    }

    // 处理列表 n,m,o
    if (cronField.includes(',')) {
        const values = cronField.split(',').map(v => parseInt(v.trim()))
        return values.includes(value)
    }

    // 处理单个值
    const cronValue = parseInt(cronField || '0')

    // 特殊处理星期字段：0和7都表示周日
    if (min === 0 && max === 7) { // 这是星期字段
        if (cronValue === 7 && value === 0) return true // 7表示周日，对应JavaScript的0
        if (cronValue === 0 && value === 0) return true // 0表示周日
    }

    return value === cronValue
}

// 复制cron表达式
const copyCron = async () => {
    if (!cronExpression.value) {
        showError('没有可复制的内容')
        return
    }

    try {
        await copyToClipboard(cronExpression.value)
        showSuccess('Cron表达式已复制到剪贴板')
    } catch (error) {
        showError('复制失败')
    }
}

// 清空所有
const clearAll = () => {
    cronConfig.value = {
        minute: { type: '*', value: 0, interval: 1, start: 0, end: 59 },
        hour: { type: '*', value: 0, interval: 1, start: 0, end: 23 },
        day: { type: '*', value: 1, interval: 1, start: 1, end: 31 },
        month: { type: '*', value: 1, interval: 1, start: 1, end: 12 },
        weekday: { type: '*', value: 0, start: 0, end: 6 }
    }
    manualCron.value = '* * * * *'
    mode.value = 'visual'
    showSuccess('已清空所有配置')
}

// 初始化
onMounted(() => {
    updateCron()
})
</script>

<style scoped>
.crontab-generator {
    width: 100%;
    height: 100dvh;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    overflow: hidden;
}

.generator-content {
    flex: 1;
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 1px;
    background: var(--border-color);
    min-height: 600px;
    overflow: hidden;
}

.config-section,
.result-section {
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    min-height: 44px;
    box-sizing: border-box;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.mode-toggle {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--bg-primary);
}

.mode-btn {
    padding: 8px 16px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border-right: 1px solid var(--border-color);
    height: 36px;
    box-sizing: border-box;
}

.mode-btn:last-child {
    border-right: none;
}

.mode-btn:hover:not(.active) {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.mode-btn.active {
    background: var(--primary-color);
    color: white;
}

.visual-config {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
    padding: 16px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
}

.config-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.config-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 4px;
}

.config-select-compact {
    padding: 6px 8px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 11px;
    cursor: pointer;
    width: 100%;
}

.config-input-compact {
    padding: 6px 8px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 11px;
    width: 100%;
}

.config-input-tiny {
    padding: 4px 6px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 11px;
    width: 50px;
}

.interval-compact,
.range-compact {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: var(--text-secondary);
}

.config-select-tiny {
    padding: 4px 6px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 10px;
    cursor: pointer;
    width: 50px;
}

/* 预设区域 */
.presets-section {
    margin-bottom: 24px;
}

.presets-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.presets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
}

.preset-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 8px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    text-align: center;
}

.preset-btn:hover {
    background: var(--bg-tertiary);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.preset-name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
}

.preset-desc {
    font-size: 10px;
    color: var(--text-secondary);
    line-height: 1.3;
}

.preset-cron {
    font-size: 9px;
    color: var(--text-muted);
    font-family: monospace;
    background: var(--bg-tertiary);
    padding: 2px 4px;
    border-radius: var(--radius-sm);
    margin-top: 2px;
}

/* 手动输入 */
.manual-config {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.manual-input-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.cron-input-wrapper {
    display: flex;
    gap: 8px;
    align-items: center;
}

.cron-input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 14px;
    font-family: monospace;
    transition: var(--transition);
}

.cron-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.cron-format-help {
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
}

.format-text {
    font-size: 11px;
    color: var(--text-secondary);
}

/* 结果区域 */
.result-section {
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.result-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.result-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.cron-display {
    padding: 16px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
}

.cron-expression {
    margin-bottom: 12px;
}

.cron-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
}

.cron-code {
    display: inline-block;
    margin-left: 8px;
    padding: 4px 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-family: monospace;
    font-size: 14px;
    color: var(--primary-color);
    font-weight: 600;
}

.cron-description {
    display: flex;
    align-items: flex-start;
    gap: 8px;
}

.desc-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    flex-shrink: 0;
}

.desc-text {
    font-size: 13px;
    color: var(--text-primary);
    line-height: 1.4;
}

.field-explanation h4,
.next-execution h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.field-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
}

.field-item {
    display: grid;
    grid-template-columns: 60px 80px 1fr;
    gap: 12px;
    align-items: center;
    padding: 8px 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
}

.field-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
}

.field-value {
    font-size: 12px;
    font-family: monospace;
    color: var(--primary-color);
    font-weight: 600;
}

.field-desc {
    font-size: 11px;
    color: var(--text-muted);
}

.execution-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.execution-item {
    padding: 8px 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
}

.execution-time {
    font-size: 12px;
    color: var(--text-primary);
    font-family: monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .generator-content {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }

    .config-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .presets-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .field-item {
        grid-template-columns: 1fr;
        gap: 4px;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .config-grid {
        padding: 12px;
    }

    .presets-grid {
        grid-template-columns: 1fr 1fr;
    }

    .preset-btn {
        padding: 8px 6px;
    }

    .preset-name {
        font-size: 11px;
    }

    .preset-desc {
        font-size: 9px;
    }

    .preset-cron {
        font-size: 8px;
    }
}
</style>