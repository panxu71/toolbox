<template>
    <div class="php-serializer">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <div class="mode-toggle">
                    <button class="mode-btn" :class="{ active: activeMode === 'serialize' }"
                        @click="setMode('serialize')">
                        序列化
                    </button>
                    <button class="mode-btn" :class="{ active: activeMode === 'unserialize' }"
                        @click="setMode('unserialize')">
                        反序列化
                    </button>
                </div>
                <HeaderActionButton icon="copy" tooltip="复制结果" @click="copyOutput" :disabled="!outputData" />
                <HeaderActionButton icon="download" tooltip="下载文件" @click="downloadResult" :disabled="!outputData" />
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="serializer-content">
            <!-- 快速示例 -->
            <div class="examples-section">
                <div class="examples-header">
                    <h3>📝 快速示例</h3>
                </div>
                <div class="examples-grid">
                    <button class="example-btn" @click="loadExample('array')">
                        <span class="example-title">PHP数组</span>
                        <span class="example-preview">关联数组和索引数组</span>
                    </button>
                    <button class="example-btn" @click="loadExample('object')">
                        <span class="example-title">PHP对象</span>
                        <span class="example-preview">类实例和属性</span>
                    </button>
                    <button class="example-btn" @click="loadExample('complex')">
                        <span class="example-title">复杂结构</span>
                        <span class="example-preview">嵌套数组和对象</span>
                    </button>
                    <button class="example-btn" @click="loadExample('json')">
                        <span class="example-title">JSON数据</span>
                        <span class="example-preview">JSON转PHP序列化</span>
                    </button>
                </div>
            </div>

            <!-- 序列化模式 -->
            <div v-if="activeMode === 'serialize'" class="convert-section">
                <div class="input-panel">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>📝 输入数据</h3>
                            <div class="format-selector">
                                <button class="format-btn" :class="{ active: inputFormat === 'array' }"
                                    @click="setInputFormat('array')">
                                    PHP数组
                                </button>
                                <button class="format-btn" :class="{ active: inputFormat === 'json' }"
                                    @click="setInputFormat('json')">
                                    JSON
                                </button>
                                <button class="format-btn" :class="{ active: inputFormat === 'xml' }"
                                    @click="setInputFormat('xml')">
                                    XML
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="inputData" class="data-input" :placeholder="getInputPlaceholder()"
                            @input="handleSerialize"></textarea>
                    </div>
                </div>

                <div class="output-panel">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>🐘 PHP序列化结果</h3>
                            <div class="panel-info">
                                <span class="char-count" v-if="outputData">{{ outputData.length }} 字符</span>
                            </div>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="outputData" class="data-output" placeholder="序列化结果将显示在这里..."
                            readonly></textarea>
                    </div>
                </div>
            </div>

            <!-- 反序列化模式 -->
            <div v-if="activeMode === 'unserialize'" class="convert-section">
                <div class="input-panel">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>🐘 PHP序列化数据</h3>
                            <div class="panel-info">
                                <span class="input-hint">输入PHP序列化字符串</span>
                            </div>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="serializedInput" class="data-input" placeholder="请输入PHP序列化字符串..."
                            @input="handleUnserialize"></textarea>
                    </div>
                </div>

                <div class="output-panel">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>📄 反序列化结果</h3>
                            <div class="format-selector">
                                <button class="format-btn" :class="{ active: outputFormat === 'array' }"
                                    @click="setOutputFormat('array')">
                                    PHP数组
                                </button>
                                <button class="format-btn" :class="{ active: outputFormat === 'json' }"
                                    @click="setOutputFormat('json')">
                                    JSON
                                </button>
                                <button class="format-btn" :class="{ active: outputFormat === 'xml' }"
                                    @click="setOutputFormat('xml')">
                                    XML
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="outputData" class="data-output" placeholder="反序列化结果将显示在这里..."
                            readonly></textarea>
                    </div>
                </div>
            </div>

            <!-- 使用说明 -->
            <div class="help-section">
                <div class="help-header">
                    <h3>💡 使用说明</h3>
                </div>
                <div class="help-content">
                    <div class="help-grid">
                        <div class="help-card">
                            <div class="help-icon">🔄</div>
                            <h4>序列化</h4>
                            <p>将PHP数组、JSON或XML数据转换为PHP序列化字符串格式。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">📦</div>
                            <h4>反序列化</h4>
                            <p>将PHP序列化字符串还原为可读的数组、JSON或XML格式。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">🔀</div>
                            <h4>格式转换</h4>
                            <p>支持PHP数组、JSON、XML之间的相互转换和序列化。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">⚡</div>
                            <h4>实时预览</h4>
                            <p>输入数据后立即显示转换结果，支持错误提示和格式验证。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <NotificationContainer />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import NotificationContainer from './common/NotificationContainer.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import { useClipboard } from '../composables/useClipboard'
import { useDownload } from '../composables/useDownload'

defineEmits<{
    back: []
}>()

// 使用 composables
usePageTitle('php-serializer')
const { success, error: showError } = useNotification()
const { copyToClipboard } = useClipboard()
const { downloadText } = useDownload()

// 获取页面标题
const pageTitle = 'PHP序列化转换'

// 状态管理
const activeMode = ref<'serialize' | 'unserialize'>('serialize')
const inputFormat = ref<'array' | 'json' | 'xml'>('array')
const outputFormat = ref<'array' | 'json' | 'xml'>('json')
const inputData = ref('')
const serializedInput = ref('')
const outputData = ref('')

// 设置模式
const setMode = (mode: 'serialize' | 'unserialize') => {
    activeMode.value = mode
    clearAll()
}

// 设置输入格式
const setInputFormat = (format: 'array' | 'json' | 'xml') => {
    inputFormat.value = format
    handleSerialize()
}

// 设置输出格式
const setOutputFormat = (format: 'array' | 'json' | 'xml') => {
    outputFormat.value = format
    handleUnserialize()
}

// 获取输入占位符
const getInputPlaceholder = (): string => {
    switch (inputFormat.value) {
        case 'array':
            return `请输入PHP数组格式，例如：
array(
    'name' => 'John',
    'age' => 30,
    'city' => 'New York'
)`
        case 'json':
            return `请输入JSON格式，例如：
{
    "name": "John",
    "age": 30,
    "city": "New York"
}`
        case 'xml':
            return `请输入XML格式，例如：
<root>
    <name>John</name>
    <age>30</age>
    <city>New York</city>
</root>`
        default:
            return '请输入要序列化的数据...'
    }
}

// 简单的PHP数组解析器
const parsePhpArray = (phpString: string): any => {
    try {
        // 移除 array( 和最后的 )
        let cleaned = phpString.trim()
        if (cleaned.startsWith('array(')) {
            cleaned = cleaned.substring(6, cleaned.length - 1)
        }

        // 简单的键值对解析
        const result: any = {}
        const pairs = cleaned.split(',')

        for (const pair of pairs) {
            const trimmed = pair.trim()
            if (!trimmed) continue

            const arrowIndex = trimmed.indexOf('=>')
            if (arrowIndex > -1) {
                let key = trimmed.substring(0, arrowIndex).trim()
                let value = trimmed.substring(arrowIndex + 2).trim()

                // 移除引号
                key = key.replace(/^['"]|['"]$/g, '')
                value = value.replace(/^['"]|['"]$/g, '')

                // 尝试转换数字
                if (/^\d+$/.test(value)) {
                    result[key] = parseInt(value)
                } else {
                    result[key] = value
                }
            }
        }

        return result
    } catch (error) {
        throw new Error('PHP数组格式错误')
    }
}

// 简单的PHP序列化实现
const phpSerialize = (data: any): string => {
    if (data === null) return 'N;'
    if (typeof data === 'boolean') return data ? 'b:1;' : 'b:0;'
    if (typeof data === 'number') {
        return Number.isInteger(data) ? `i:${data};` : `d:${data};`
    }
    if (typeof data === 'string') {
        return `s:${data.length}:"${data}";`
    }
    if (Array.isArray(data)) {
        let result = `a:${data.length}:{`
        data.forEach((item, index) => {
            result += phpSerialize(index) + phpSerialize(item)
        })
        result += '}'
        return result
    }
    if (typeof data === 'object') {
        const keys = Object.keys(data)
        let result = `a:${keys.length}:{`
        keys.forEach(key => {
            result += phpSerialize(key) + phpSerialize(data[key])
        })
        result += '}'
        return result
    }
    return 'N;'
}

// 简单的PHP反序列化实现
const phpUnserialize = (serialized: string): any => {
    let pos = 0

    const parseValue = (): any => {
        const type = serialized[pos]
        pos += 2 // 跳过类型和冒号

        switch (type) {
            case 'N':
                pos++ // 跳过分号
                return null
            case 'b':
                const boolValue = serialized[pos] === '1'
                pos += 2 // 跳过值和分号
                return boolValue
            case 'i':
                const intEnd = serialized.indexOf(';', pos)
                const intValue = parseInt(serialized.substring(pos, intEnd))
                pos = intEnd + 1
                return intValue
            case 'd':
                const doubleEnd = serialized.indexOf(';', pos)
                const doubleValue = parseFloat(serialized.substring(pos, doubleEnd))
                pos = doubleEnd + 1
                return doubleValue
            case 's':
                const lengthEnd = serialized.indexOf(':', pos)
                const length = parseInt(serialized.substring(pos, lengthEnd))
                pos = lengthEnd + 2 // 跳过冒号和引号
                const stringValue = serialized.substring(pos, pos + length)
                pos += length + 2 // 跳过字符串和引号分号
                return stringValue
            case 'a':
                const arrayLengthEnd = serialized.indexOf(':', pos)
                const arrayLength = parseInt(serialized.substring(pos, arrayLengthEnd))
                pos = arrayLengthEnd + 2 // 跳过冒号和左大括号

                const result: any = {}
                for (let i = 0; i < arrayLength; i++) {
                    const key = parseValue()
                    const value = parseValue()
                    result[key] = value
                }
                pos++ // 跳过右大括号
                return result
            default:
                throw new Error('不支持的序列化类型')
        }
    }

    return parseValue()
}

// 处理序列化
const handleSerialize = () => {
    if (!inputData.value.trim()) {
        outputData.value = ''
        return
    }

    try {
        let data: any

        switch (inputFormat.value) {
            case 'array':
                data = parsePhpArray(inputData.value)
                break
            case 'json':
                data = JSON.parse(inputData.value)
                break
            case 'xml':
                // 简单的XML解析（实际项目中应使用专业的XML解析器）
                showError('XML解析功能开发中...')
                return
            default:
                throw new Error('不支持的输入格式')
        }

        outputData.value = phpSerialize(data)
    } catch (error) {
        showError(`序列化失败: ${error instanceof Error ? error.message : '未知错误'}`)
        outputData.value = ''
    }
}

// 处理反序列化
const handleUnserialize = () => {
    if (!serializedInput.value.trim()) {
        outputData.value = ''
        return
    }

    try {
        const data = phpUnserialize(serializedInput.value)

        switch (outputFormat.value) {
            case 'array':
                outputData.value = formatAsPhpArray(data)
                break
            case 'json':
                outputData.value = JSON.stringify(data, null, 2)
                break
            case 'xml':
                outputData.value = formatAsXml(data)
                break
        }
    } catch (error) {
        showError(`反序列化失败: ${error instanceof Error ? error.message : '未知错误'}`)
        outputData.value = ''
    }
}

// 格式化为PHP数组字符串
const formatAsPhpArray = (data: any, indent = 0): string => {
    const spaces = '    '.repeat(indent)

    if (data === null) return 'null'
    if (typeof data === 'boolean') return data ? 'true' : 'false'
    if (typeof data === 'number') return data.toString()
    if (typeof data === 'string') return `'${data}'`

    if (typeof data === 'object') {
        const entries = Object.entries(data)
        if (entries.length === 0) return 'array()'

        let result = 'array(\n'
        entries.forEach(([key, value], index) => {
            const keyStr = /^\d+$/.test(key) ? key : `'${key}'`
            const valueStr = formatAsPhpArray(value, indent + 1)
            result += `${spaces}    ${keyStr} => ${valueStr}`
            if (index < entries.length - 1) result += ','
            result += '\n'
        })
        result += `${spaces})`
        return result
    }

    return 'null'
}

// 格式化为XML字符串
const formatAsXml = (data: any, rootName = 'root'): string => {
    const formatValue = (value: any, key: string): string => {
        if (value === null) return `<${key}></${key}>`
        if (typeof value === 'object') {
            let xml = `<${key}>\n`
            Object.entries(value).forEach(([k, v]) => {
                xml += '  ' + formatValue(v, k) + '\n'
            })
            xml += `</${key}>`
            return xml
        }
        return `<${key}>${value}</${key}>`
    }

    return `<?xml version="1.0" encoding="UTF-8"?>\n${formatValue(data, rootName)}`
}

// 加载示例
const loadExample = (type: string) => {
    const examples = {
        array: {
            mode: 'serialize',
            format: 'array',
            data: `array(
    'name' => 'John Doe',
    'age' => 30,
    'email' => 'john@example.com',
    'skills' => array('PHP', 'JavaScript', 'Python'),
    'active' => true
)`
        },
        object: {
            mode: 'serialize',
            format: 'json',
            data: `{
    "user": {
        "id": 123,
        "profile": {
            "name": "Alice",
            "settings": {
                "theme": "dark",
                "notifications": true
            }
        }
    }
}`
        },
        complex: {
            mode: 'serialize',
            format: 'array',
            data: `array(
    'users' => array(
        array('id' => 1, 'name' => 'John'),
        array('id' => 2, 'name' => 'Jane')
    ),
    'config' => array(
        'debug' => true,
        'version' => '1.0.0'
    )
)`
        },
        json: {
            mode: 'serialize',
            format: 'json',
            data: `{
    "products": [
        {"id": 1, "name": "Laptop", "price": 999.99},
        {"id": 2, "name": "Mouse", "price": 29.99}
    ],
    "total": 1029.98,
    "currency": "USD"
}`
        }
    }

    const example = examples[type as keyof typeof examples]
    if (example) {
        activeMode.value = example.mode as 'serialize' | 'unserialize'
        inputFormat.value = example.format as 'array' | 'json' | 'xml'
        inputData.value = example.data
        serializedInput.value = ''
        outputData.value = ''
        handleSerialize()
        success('已加载示例')
    }
}

// 复制输出
const copyOutput = async () => {
    if (!outputData.value) {
        showError('没有可复制的内容')
        return
    }

    const result = await copyToClipboard(outputData.value)
    if (result) {
        success('结果已复制')
    } else {
        showError('复制失败')
    }
}

// 下载结果
const downloadResult = () => {
    if (!outputData.value) {
        showError('没有可下载的内容')
        return
    }

    const extension = activeMode.value === 'serialize' ? 'txt' :
        outputFormat.value === 'json' ? 'json' :
            outputFormat.value === 'xml' ? 'xml' : 'txt'

    const result = downloadText(outputData.value, `php-${activeMode.value}-result`, extension)
    if (result) {
        success('文件已下载')
    } else {
        showError('下载失败')
    }
}

// 清空所有
const clearAll = () => {
    inputData.value = ''
    serializedInput.value = ''
    outputData.value = ''
    success('已清空所有内容')
}
</script>

<style scoped>
/* 模式切换 */
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

.mode-btn.active {
    background: var(--primary-color);
    color: white;
}

.mode-btn:hover:not(.active) {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.php-serializer {
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.serializer-content {
    flex: 1;
    padding: 1.5rem;
    padding-bottom: 3rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    min-height: 0;
}

/* 转换区域 */
.convert-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.input-panel,
.output-panel {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
}

.section-header {
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 1.5rem;
    height: auto;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
}

.section-title h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
}

.panel-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.char-count {
    padding: 0.25rem 0.6rem;
    background: var(--primary-color-alpha);
    color: var(--primary-color);
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
}

.input-hint {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

/* 格式选择器 */
.format-selector {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--bg-primary);
}

.format-btn {
    padding: 0.375rem 0.75rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border-right: 1px solid var(--border-color);
    height: 28px;
    box-sizing: border-box;
}

.format-btn:last-child {
    border-right: none;
}

.format-btn.active {
    background: var(--primary-color);
    color: white;
}

.format-btn:hover:not(.active) {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.panel-content {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
}

.data-input,
.data-output {
    width: 100%;
    min-height: 280px;
    padding: 1.5rem;
    background: var(--bg-primary);
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.6;
    resize: vertical;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    box-sizing: border-box;
    flex: 1;
}

.data-input:focus,
.data-output:focus {
    outline: none;
}

.data-input::placeholder,
.data-output::placeholder {
    color: var(--text-secondary);
}

/* 示例区域 */
.examples-section,
.help-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.examples-header,
.help-header {
    margin-bottom: 1rem;
}

.examples-header h3,
.help-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.examples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.example-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    padding: 0.875rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

.example-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.example-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.example-preview {
    font-size: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.3;
}

/* 帮助区域 */
.help-content {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1.5rem;
}

.help-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.help-card {
    text-align: center;
    padding: 1rem;
}

.help-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
}

.help-card h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
}

.help-card p {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .convert-section {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .serializer-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }

    .examples-section,
    .help-section {
        padding: 1.25rem;
    }

    .section-header {
        padding: 1rem;
        min-height: 70px;
    }

    .section-title {
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .section-title h3 {
        font-size: 1rem;
    }

    .data-input,
    .data-output {
        min-height: 200px;
        padding: 1rem;
        font-size: 0.875rem;
    }

    .examples-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .help-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .examples-grid {
        grid-template-columns: 1fr;
    }

    .help-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}
</style>