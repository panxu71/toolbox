<template>
    <div class="php-serializer">
        <div class="serializer-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="serializer-title">PHP序列化转换</h2>
            <div class="serializer-actions">
                <button class="action-btn" @click="clearAll" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="serializer-content">
            <!-- 转换模式选择 -->
            <div class="mode-section">
                <div class="mode-tabs">
                    <button class="mode-tab" :class="{ active: activeMode === 'serialize' }"
                        @click="setMode('serialize')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                        </svg>
                        序列化
                    </button>
                    <button class="mode-tab" :class="{ active: activeMode === 'unserialize' }"
                        @click="setMode('unserialize')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                        </svg>
                        反序列化
                    </button>
                </div>
            </div>

            <!-- 序列化模式 -->
            <div v-if="activeMode === 'serialize'" class="convert-section">
                <div class="input-panel">
                    <div class="panel-header">
                        <div class="panel-title-info">
                            <h3>输入数据</h3>
                            <div class="input-format-tabs">
                                <button class="format-tab" :class="{ active: inputFormat === 'array' }"
                                    @click="setInputFormat('array')">
                                    PHP数组
                                </button>
                                <button class="format-tab" :class="{ active: inputFormat === 'json' }"
                                    @click="setInputFormat('json')">
                                    JSON
                                </button>
                                <button class="format-tab" :class="{ active: inputFormat === 'xml' }"
                                    @click="setInputFormat('xml')">
                                    XML
                                </button>
                            </div>
                        </div>
                        <div class="panel-actions">
                            <button class="action-btn-small" @click="pasteInput" title="粘贴">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                    <path
                                        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="clearInput" title="清空">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="inputData" class="data-input" :placeholder="getInputPlaceholder()"
                            @input="handleSerialize"></textarea>
                    </div>
                </div>

                <div class="output-panel">
                    <div class="panel-header">
                        <div class="panel-title-info">
                            <h3>PHP序列化结果</h3>
                            <div class="output-info">
                                <span class="info-badge" v-if="serializedData">
                                    {{ serializedData.length }} 字符
                                </span>
                            </div>
                        </div>
                        <div class="panel-actions">
                            <button class="action-btn-small" @click="copyOutput" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="downloadResult" title="下载">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7,10 12,15 17,10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="serializedData" class="data-output" placeholder="序列化结果将显示在这里..."
                            readonly></textarea>
                    </div>
                </div>
            </div>

            <!-- 反序列化模式 -->
            <div v-if="activeMode === 'unserialize'" class="convert-section">
                <div class="input-panel">
                    <div class="panel-header">
                        <div class="panel-title-info">
                            <h3>PHP序列化数据</h3>
                            <div class="input-info">
                                <span class="info-text">输入PHP序列化字符串</span>
                            </div>
                        </div>
                        <div class="panel-actions">
                            <button class="action-btn-small" @click="pasteSerializedInput" title="粘贴">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                    <path
                                        d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="loadSerializedSample" title="示例">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14,2 14,8 20,8" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="clearSerializedInput" title="清空">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="serializedInput" class="data-input"
                            placeholder="输入PHP序列化字符串，如：a:2:{s:4:&quot;name&quot;;s:4:&quot;John&quot;;s:3:&quot;age&quot;;i:30;}"
                            @input="handleUnserialize"></textarea>
                    </div>
                </div>

                <div class="output-panel">
                    <div class="panel-header">
                        <div class="panel-title-info">
                            <h3>转换结果</h3>
                            <div class="output-format-tabs">
                                <button class="format-tab" :class="{ active: outputFormat === 'array' }"
                                    @click="setOutputFormat('array')">
                                    PHP数组
                                </button>
                                <button class="format-tab" :class="{ active: outputFormat === 'json' }"
                                    @click="setOutputFormat('json')">
                                    JSON
                                </button>
                                <button class="format-tab" :class="{ active: outputFormat === 'xml' }"
                                    @click="setOutputFormat('xml')">
                                    XML
                                </button>
                            </div>
                        </div>
                        <div class="panel-actions">
                            <button class="action-btn-small" @click="copyUnserializedOutput" title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                            <button class="action-btn-small" @click="downloadUnserializedResult" title="下载">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7,10 12,15 17,10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="panel-content">
                        <textarea v-model="unserializedData" class="data-output" placeholder="反序列化结果将显示在这里..."
                            readonly></textarea>
                    </div>
                </div>
            </div>

            <!-- 使用说明 -->
            <div class="help-section">
                <div class="section-header">
                    <h3>使用说明</h3>
                </div>
                <div class="help-content">
                    <div class="help-grid">
                        <div class="help-card">
                            <div class="help-icon">📝</div>
                            <h4>序列化模式</h4>
                            <p>将PHP数组、JSON或XML数据转换为PHP序列化字符串。支持多维数组、对象和各种数据类型。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">🔄</div>
                            <h4>反序列化模式</h4>
                            <p>将PHP序列化字符串转换为可读的PHP数组、JSON或XML格式。自动检测数据类型。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">⚡</div>
                            <h4>支持格式</h4>
                            <p>PHP数组语法、标准JSON格式、XML文档。自动格式化和语法高亮显示。</p>
                        </div>
                        <div class="help-card">
                            <div class="help-icon">🛡️</div>
                            <h4>安全提示</h4>
                            <p>仅用于数据格式转换，不执行任何PHP代码。建议在生产环境中谨慎处理序列化数据。</p>
                        </div>
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
import {  ref, onMounted, onUnmounted  } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'

defineEmits<{
    back: []
}>()

// 状态管理
// 使用页面标题管理
usePageTitle('php-serializer')

const activeMode = ref<'serialize' | 'unserialize'>('serialize')
const inputFormat = ref<'array' | 'json' | 'xml'>('json')
const outputFormat = ref<'array' | 'json' | 'xml'>('json')

// 数据
const inputData = ref('')
const serializedData = ref('')
const serializedInput = ref('')
const unserializedData = ref('')

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 设置模式
const setMode = (mode: 'serialize' | 'unserialize') => {
    activeMode.value = mode
    clearAll()
}

// 设置输入格式
const setInputFormat = (format: 'array' | 'json' | 'xml') => {
    inputFormat.value = format
    // 直接加载对应格式的示例数据
    loadSampleForFormat(format)
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
            return `array(
    'name' => 'John',
    'age' => 30,
    'city' => 'New York'
)`
        case 'json':
            return `{
    "name": "John",
    "age": 30,
    "city": "New York"
}`
        case 'xml':
            return `<?xml version="1.0"?>
<root>
    <name>John</name>
    <age>30</age>
    <city>New York</city>
</root>`
        default:
            return ''
    }
}

// 序列化处理
const handleSerialize = () => {
    if (!inputData.value.trim()) {
        serializedData.value = ''
        return
    }

    try {
        let data: any

        switch (inputFormat.value) {
            case 'json':
                data = JSON.parse(inputData.value)
                break
            case 'array':
                data = parsePhpArray(inputData.value)
                break
            case 'xml':
                data = parseXml(inputData.value)
                break
        }

        serializedData.value = phpSerialize(data)
    } catch (error) {
        showMessage(`${inputFormat.value.toUpperCase()}格式错误`, 'error')
        serializedData.value = ''
    }
}

// 反序列化处理
const handleUnserialize = () => {
    if (!serializedInput.value.trim()) {
        unserializedData.value = ''
        return
    }

    try {
        const data = phpUnserialize(serializedInput.value)

        switch (outputFormat.value) {
            case 'json':
                unserializedData.value = JSON.stringify(data, null, 2)
                break
            case 'array':
                unserializedData.value = formatPhpArray(data)
                break
            case 'xml':
                unserializedData.value = formatXml(data)
                break
        }
    } catch (error) {
        showMessage('PHP序列化数据格式错误', 'error')
        unserializedData.value = ''
    }
}

// PHP序列化函数
const phpSerialize = (data: any): string => {
    if (data === null || data === undefined) return 'N;'
    if (typeof data === 'boolean') return data ? 'b:1;' : 'b:0;'
    if (typeof data === 'number') {
        return Number.isInteger(data) ? `i:${data};` : `d:${data};`
    }
    if (typeof data === 'string') {
        // 确保字符串长度计算正确（支持UTF-8）
        const byteLength = new TextEncoder().encode(data).length
        return `s:${byteLength}:"${data}";`
    }

    if (Array.isArray(data)) {
        let result = `a:${data.length}:{`
        data.forEach((item, index) => {
            result += `i:${index};${phpSerialize(item)}`
        })
        result += '}'
        return result
    }

    if (typeof data === 'object' && data !== null) {
        const keys = Object.keys(data)
        let result = `a:${keys.length}:{`
        keys.forEach(key => {
            const keyBytes = new TextEncoder().encode(key).length
            result += `s:${keyBytes}:"${key}";${phpSerialize(data[key])}`
        })
        result += '}'
        return result
    }

    return 'N;'
}

// PHP反序列化函数
const phpUnserialize = (str: string): any => {
    let pos = 0

    const parseValue = (): any => {
        if (pos >= str.length) {
            throw new Error('Unexpected end of serialized data')
        }

        const type = str[pos++]
        
        if (pos >= str.length || str[pos] !== ':') {
            throw new Error('Invalid serialized data format')
        }
        pos++ // skip ':'

        switch (type) {
            case 'N':
                if (pos >= str.length || str[pos] !== ';') {
                    throw new Error('Invalid null format')
                }
                pos++ // skip ';'
                return null
                
            case 'b':
                if (pos >= str.length) {
                    throw new Error('Invalid boolean format')
                }
                const boolVal = str[pos++] === '1'
                if (pos >= str.length || str[pos] !== ';') {
                    throw new Error('Invalid boolean format')
                }
                pos++ // skip ';'
                return boolVal
                
            case 'i':
                const intEnd = str.indexOf(';', pos)
                if (intEnd === -1) {
                    throw new Error('Invalid integer format')
                }
                const intVal = parseInt(str.substring(pos, intEnd))
                if (isNaN(intVal)) {
                    throw new Error('Invalid integer value')
                }
                pos = intEnd + 1
                return intVal
                
            case 'd':
                const doubleEnd = str.indexOf(';', pos)
                if (doubleEnd === -1) {
                    throw new Error('Invalid double format')
                }
                const doubleVal = parseFloat(str.substring(pos, doubleEnd))
                if (isNaN(doubleVal)) {
                    throw new Error('Invalid double value')
                }
                pos = doubleEnd + 1
                return doubleVal
                
            case 's':
                const lenEnd = str.indexOf(':', pos)
                if (lenEnd === -1) {
                    throw new Error('Invalid string length format')
                }
                const len = parseInt(str.substring(pos, lenEnd))
                if (isNaN(len) || len < 0) {
                    throw new Error('Invalid string length')
                }
                pos = lenEnd + 1
                
                if (pos >= str.length || str[pos] !== '"') {
                    throw new Error('Invalid string format - missing opening quote')
                }
                pos++ // skip '"'
                
                if (pos + len > str.length) {
                    throw new Error('String length exceeds available data')
                }
                const strVal = str.substring(pos, pos + len)
                pos += len
                
                if (pos >= str.length || str[pos] !== '"') {
                    throw new Error('Invalid string format - missing closing quote')
                }
                pos++ // skip '"'
                
                if (pos >= str.length || str[pos] !== ';') {
                    throw new Error('Invalid string format - missing semicolon')
                }
                pos++ // skip ';'
                return strVal
                
            case 'a':
                const arrLenEnd = str.indexOf(':', pos)
                if (arrLenEnd === -1) {
                    throw new Error('Invalid array length format')
                }
                const arrLen = parseInt(str.substring(pos, arrLenEnd))
                if (isNaN(arrLen) || arrLen < 0) {
                    throw new Error('Invalid array length')
                }
                pos = arrLenEnd + 1
                
                if (pos >= str.length || str[pos] !== '{') {
                    throw new Error('Invalid array format - missing opening brace')
                }
                pos++ // skip '{'

                const result: any = {}
                for (let i = 0; i < arrLen; i++) {
                    const key = parseValue()
                    const value = parseValue()
                    result[key] = value
                }
                
                if (pos >= str.length || str[pos] !== '}') {
                    throw new Error('Invalid array format - missing closing brace')
                }
                pos++ // skip '}'
                return result
                
            default:
                throw new Error(`Unknown serialized data type: ${type}`)
        }
    }

    try {
        const result = parseValue()
        // 检查是否还有未处理的数据
        if (pos < str.length) {
            console.warn('Warning: Extra data found after parsing')
        }
        return result
    } catch (error) {
        throw new Error(`PHP unserialize error: ${error.message}`)
    }
}

// 解析PHP数组字符串
const parsePhpArray = (str: string): any => {
    // 更健壮的PHP数组解析
    try {
        // 移除多余的空白字符
        let cleanStr = str.trim()
        
        // 检查是否以array(开头
        if (!cleanStr.startsWith('array(')) {
            throw new Error('Invalid PHP array format')
        }
        
        // 移除array(和最后的)
        cleanStr = cleanStr.slice(6, -1).trim()
        
        // 简单的键值对解析
        const result: any = {}
        const pairs = cleanStr.split(',')
        
        for (let pair of pairs) {
            pair = pair.trim()
            if (!pair) continue
            
            const arrowIndex = pair.indexOf('=>')
            if (arrowIndex === -1) continue
            
            let key = pair.substring(0, arrowIndex).trim()
            let value = pair.substring(arrowIndex + 2).trim()
            
            // 移除引号
            key = key.replace(/^['"]|['"]$/g, '')
            
            // 解析值
            if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1)
            } else if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1)
            } else if (value === 'true') {
                value = true
            } else if (value === 'false') {
                value = false
            } else if (value === 'null') {
                value = null
            } else if (!isNaN(Number(value))) {
                value = Number(value)
            }
            
            result[key] = value
        }
        
        return result
    } catch (error) {
        // 如果PHP数组解析失败，尝试作为JSON解析
        try {
            return JSON.parse(str)
        } catch {
            throw new Error('Invalid PHP array or JSON format')
        }
    }
}

// 解析XML
const parseXml = (xmlStr: string): any => {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlStr, 'text/xml')

    const parseNode = (node: Element): any => {
        const result: any = {}

        // 处理属性
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i]
            if (attr && attr.name && attr.value !== undefined) {
                result[`@${attr.name}`] = attr.value
            }
        }

        // 处理子节点
        const children = Array.from(node.children)
        if (children.length === 0) {
            return node.textContent || ''
        }

        children.forEach(child => {
            const name = child.tagName
            const value = parseNode(child)

            if (result[name]) {
                if (!Array.isArray(result[name])) {
                    result[name] = [result[name]]
                }
                result[name].push(value)
            } else {
                result[name] = value
            }
        })

        return result
    }

    return parseNode(xmlDoc.documentElement)
}

// 格式化PHP数组
const formatPhpArray = (data: any, indent = 0): string => {
    const spaces = '    '.repeat(indent)

    if (data === null) return 'null'
    if (typeof data === 'boolean') return data ? 'true' : 'false'
    if (typeof data === 'number') return data.toString()
    if (typeof data === 'string') return `'${data}'`

    if (Array.isArray(data)) {
        if (data.length === 0) return 'array()'

        let result = 'array(\n'
        data.forEach((item, index) => {
            result += `${spaces}    ${index} => ${formatPhpArray(item, indent + 1)},\n`
        })
        result += `${spaces})`
        return result
    }

    if (typeof data === 'object') {
        const keys = Object.keys(data)
        if (keys.length === 0) return 'array()'

        let result = 'array(\n'
        keys.forEach(key => {
            const quotedKey = /^\d+$/.test(key) ? key : `'${key}'`
            result += `${spaces}    ${quotedKey} => ${formatPhpArray(data[key], indent + 1)},\n`
        })
        result += `${spaces})`
        return result
    }

    return 'null'
}

// 格式化XML
const formatXml = (data: any, rootName = 'root'): string => {
    const formatNode = (obj: any, nodeName: string, indent = 0): string => {
        const spaces = '  '.repeat(indent)

        if (obj === null || obj === undefined) {
            return `${spaces}<${nodeName}></${nodeName}>`
        }

        if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
            return `${spaces}<${nodeName}>${obj}</${nodeName}>`
        }

        if (Array.isArray(obj)) {
            return obj.map(item => formatNode(item, nodeName, indent)).join('\n')
        }

        if (typeof obj === 'object') {
            let result = `${spaces}<${nodeName}>`
            const keys = Object.keys(obj)

            if (keys.length === 0) {
                result += `</${nodeName}>`
            } else {
                result += '\n'
                keys.forEach(key => {
                    if (key.startsWith('@')) {
                        // 属性处理（简化）
                        return
                    }
                    result += formatNode(obj[key], key, indent + 1) + '\n'
                })
                result += `${spaces}</${nodeName}>`
            }

            return result
        }

        return `${spaces}<${nodeName}></${nodeName}>`
    }

    return `<?xml version="1.0" encoding="UTF-8"?>\n${formatNode(data, rootName)}`
}

// 粘贴功能
const pasteInput = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputData.value = text
        handleSerialize()
        showMessage('已粘贴内容', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

const pasteSerializedInput = async () => {
    try {
        const text = await navigator.clipboard.readText()
        serializedInput.value = text
        handleUnserialize()
        showMessage('已粘贴内容', 'success')
    } catch (error) {
        showMessage('粘贴失败', 'error')
    }
}

// 加载特定格式的示例数据
const loadSampleForFormat = (format: 'array' | 'json' | 'xml') => {
    switch (format) {
        case 'json':
            inputData.value = `{
    "name": "John Doe",
    "age": 30,
    "city": "New York",
    "hobbies": ["reading", "swimming", "coding"],
    "address": {
        "street": "123 Main St",
        "zipcode": "10001"
    }
}`
            break
        case 'array':
            inputData.value = `array(
    'name' => 'John Doe',
    'age' => 30,
    'city' => 'New York',
    'hobbies' => array('reading', 'swimming', 'coding'),
    'address' => array(
        'street' => '123 Main St',
        'zipcode' => '10001'
    )
)`
            break
        case 'xml':
            inputData.value = `<?xml version="1.0" encoding="UTF-8"?>
<person>
    <name>John Doe</name>
    <age>30</age>
    <city>New York</city>
    <hobbies>
        <hobby>reading</hobby>
        <hobby>swimming</hobby>
        <hobby>coding</hobby>
    </hobbies>
    <address>
        <street>123 Main St</street>
        <zipcode>10001</zipcode>
    </address>
</person>`
            break
    }
    handleSerialize()
    showMessage(`已加载${format.toUpperCase()}示例数据`, 'success')
}

// 加载示例
const loadSample = () => {
    loadSampleForFormat(inputFormat.value)
}

const loadSerializedSample = () => {
    serializedInput.value = 'a:5:{s:4:"name";s:8:"John Doe";s:3:"age";i:30;s:4:"city";s:8:"New York";s:7:"hobbies";a:3:{i:0;s:7:"reading";i:1;s:8:"swimming";i:2;s:6:"coding";}s:7:"address";a:2:{s:6:"street";s:11:"123 Main St";s:7:"zipcode";s:5:"10001";}}'
    handleUnserialize()
    showMessage('已加载示例数据', 'success')
}

// 复制功能
const copyOutput = async () => {
    if (!serializedData.value) {
        showMessage('没有可复制的内容', 'error')
        return
    }

    try {
        await navigator.clipboard.writeText(serializedData.value)
        showMessage('已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

const copyUnserializedOutput = async () => {
    if (!unserializedData.value) {
        showMessage('没有可复制的内容', 'error')
        return
    }

    try {
        await navigator.clipboard.writeText(unserializedData.value)
        showMessage('已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 下载功能
const downloadResult = () => {
    if (!serializedData.value) {
        showMessage('没有可下载的内容', 'error')
        return
    }

    const blob = new Blob([serializedData.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `serialized-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    showMessage('文件已下载', 'success')
}

const downloadUnserializedResult = () => {
    if (!unserializedData.value) {
        showMessage('没有可下载的内容', 'error')
        return
    }

    const extension = outputFormat.value === 'json' ? 'json' : outputFormat.value === 'xml' ? 'xml' : 'php'
    const blob = new Blob([unserializedData.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `unserialized-${Date.now()}.${extension}`
    a.click()
    URL.revokeObjectURL(url)
    showMessage('文件已下载', 'success')
}

// 清空功能
const clearInput = () => {
    inputData.value = ''
    serializedData.value = ''
}

const clearSerializedInput = () => {
    serializedInput.value = ''
    unserializedData.value = ''
}

const clearAll = () => {
    inputData.value = ''
    serializedData.value = ''
    serializedInput.value = ''
    unserializedData.value = ''
    showMessage('已清空所有内容', 'success')
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error') => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 生命周期钩子
onMounted(() => {
    // 页面初始化逻辑
})

</script>
<style scoped>
.php-serializer {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
}

.serializer-header {
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
    font-size: 0.875rem;
    font-weight: 500;
}

.back-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
}

.serializer-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.serializer-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
}

.serializer-content {
    flex: 1;
    padding: 1.5rem 1.5rem 6rem 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

/* 模式选择 */
.mode-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1rem;
}

.mode-tabs {
    display: flex;
    gap: 0.5rem;
}

.mode-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.mode-tab:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.mode-tab.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* 转换区域 */
.convert-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.input-panel,
.output-panel {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-color);
    gap: 1rem;
}

.panel-title-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.panel-header h3 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    white-space: nowrap;
}

.panel-actions {
    display: flex;
    gap: 0.375rem;
    flex-shrink: 0;
}

.input-format-tabs,
.output-format-tabs {
    display: flex;
    gap: 0.25rem;
}

.format-tab {
    padding: 0.375rem 0.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
    font-weight: 500;
}

.format-tab:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.format-tab.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.input-info,
.output-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.info-badge {
    padding: 0.25rem 0.5rem;
    background: var(--primary-color-alpha);
    color: var(--primary-color);
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.panel-content {
    position: relative;
    display: flex;
    flex-direction: column;
}

.data-input,
.data-output {
    width: 100%;
    min-height: 300px;
    padding: 1rem;
    background: var(--bg-primary);
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    line-height: 1.5;
    resize: vertical;
    font-family: 'Courier New', monospace;
}

.data-input:focus,
.data-output:focus {
    outline: none;
}

.data-input::placeholder,
.data-output::placeholder {
    color: var(--text-secondary);
}

.data-output {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
}

.action-btn-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn-small:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

/* 帮助区域 */
.help-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.section-header {
    margin-bottom: 1.5rem;
}

.section-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.help-content {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1.5rem;
}

.help-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

/* 消息提示 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.message-toast.success {
    background: var(--success-color);
    color: white;
}

.message-toast.error {
    background: var(--error-color);
    color: white;
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

/* 响应式设计 */
@media (max-width: 1024px) {
    .convert-section {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
}

@media (max-width: 768px) {
    .serializer-content {
        padding: 1rem 1rem 4rem 1rem;
        gap: 1.5rem;
    }

    .help-section,
    .mode-section,
    .input-panel,
    .output-panel {
        padding: 1rem;
    }

    .mode-tabs {
        flex-direction: column;
    }

    .mode-tab {
        justify-content: center;
    }

    .panel-header {
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .panel-title-info {
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .panel-actions {
        justify-content: center;
        order: 3;
        width: 100%;
    }

    .data-input,
    .data-output {
        min-height: 200px;
        font-size: 0.75rem;
    }

    .help-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .message-toast {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
    }
}

@media (max-width: 480px) {
    .serializer-header {
        padding: 0.75rem 1rem;
    }

    .serializer-title {
        font-size: 1.125rem;
    }

    .format-tab {
        padding: 0.25rem 0.5rem;
        font-size: 0.625rem;
    }
}
</style>