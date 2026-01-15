<template>
    <div class="api-tester">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <div class="formatter-actions">
                    <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
                    <HeaderActionButton icon="copy" tooltip="复制响应" @click="copyResponse"
                        :disabled="!response.data && !response.error" />
                </div>
            </template>
        </PageHeader>

        <div class="tester-content">
            <div class="request-section">
                <div class="request-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <div class="header-text">
                            <h3>请求配置</h3>
                            <p>配置API请求参数和选项</p>
                        </div>
                    </div>
                    <div class="example-buttons">
                        <ButtonGroup>
                            <button class="group-btn" @click="loadExample('jsonplaceholder')">
                                <span class="method-badge get">GET</span>
                                JSONPlaceholder
                            </button>
                            <button class="group-btn" @click="loadExample('httpbin-get')">
                                <span class="method-badge get">GET</span>
                                HTTPBin GET
                            </button>
                            <button class="group-btn" @click="loadExample('httpbin-post')">
                                <span class="method-badge post">POST</span>
                                HTTPBin POST
                            </button>
                        </ButtonGroup>
                    </div>
                </div>

                <div class="request-content">
                    <!-- 请求方法和URL -->
                    <div class="request-line">
                        <select v-model="request.method" class="method-select">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                            <option value="PATCH">PATCH</option>
                            <option value="HEAD">HEAD</option>
                            <option value="OPTIONS">OPTIONS</option>
                        </select>
                        <input v-model="request.url" type="text" class="url-input"
                            placeholder="请输入API接口地址，如：https://jsonplaceholder.typicode.com/posts"
                            @keyup.enter="sendRequest" />
                        <button class="send-btn" @click="sendRequest" :disabled="loading || !request.url.trim()"
                            :class="{ loading, [request.method.toLowerCase()]: true }">
                            <svg v-if="loading" class="loading-icon" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 12a9 9 0 11-6.219-8.56" />
                            </svg>
                            <svg v-else class="send-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                            </svg>
                            {{ loading ? '发送中...' : '发送请求' }}
                        </button>
                    </div>

                    <!-- 请求头 -->
                    <div class="config-section">
                        <div class="section-header">
                            <h4>请求头 (Headers)</h4>
                            <button class="add-btn" @click="addHeader">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                添加
                            </button>
                        </div>
                        <div v-if="request.headers.length > 0" class="headers-list">
                            <div v-for="(header, index) in request.headers" :key="index" class="header-row">
                                <input v-model="header.key" type="text" placeholder="Header名称" class="header-key" />
                                <span class="separator">:</span>
                                <input v-model="header.value" type="text" placeholder="Header值" class="header-value" />
                                <button class="remove-btn" @click="removeHeader(index)">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 查询参数 (仅GET请求) -->
                    <div v-if="request.method === 'GET'" class="config-section">
                        <div class="section-header">
                            <h4>查询参数 (Query Parameters)</h4>
                            <button class="add-btn" @click="addParam">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                添加
                            </button>
                        </div>
                        <div v-if="request.params.length > 0" class="params-list">
                            <div v-for="(param, index) in request.params" :key="index" class="param-row">
                                <input v-model="param.key" type="text" placeholder="参数名" class="param-key" />
                                <span class="separator">=</span>
                                <input v-model="param.value" type="text" placeholder="参数值" class="param-value" />
                                <button class="remove-btn" @click="removeParam(index)">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 请求体 (POST/PUT/PATCH) -->
                    <div v-if="['POST', 'PUT', 'PATCH'].includes(request.method)" class="config-section">
                        <div class="section-header">
                            <h4>请求体 (Request Body)</h4>
                            <select v-model="request.bodyType" class="body-type-select">
                                <option value="json">📄 JSON</option>
                                <option value="form-urlencoded">📝 x-www-form-urlencoded</option>
                                <option value="form-data">📋 Form Data</option>
                                <option value="xml">🏷️ XML</option>
                                <option value="raw">📃 Raw Text</option>
                                <option value="binary">📁 Binary File</option>
                            </select>
                        </div>

                        <!-- JSON Body -->
                        <div v-if="request.bodyType === 'json'" class="json-body">
                            <textarea v-model="request.jsonBody" class="json-textarea"
                                placeholder='请输入JSON数据，例如：&#10;{&#10;  "title": "测试标题",&#10;  "body": "测试内容",&#10;  "userId": 1&#10;}'
                                rows="8"></textarea>
                            <div class="json-actions">
                                <button class="format-btn" @click="formatJson">格式化</button>
                                <button class="minify-btn" @click="minifyJson">压缩</button>
                            </div>
                        </div>

                        <!-- Form URL Encoded -->
                        <div v-if="request.bodyType === 'form-urlencoded'" class="form-body">
                            <div class="form-mode-toggle">
                                <button class="mode-btn" :class="{ active: formUrlEncodedMode === 'form' }"
                                    @click="formUrlEncodedMode = 'form'">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="9" y1="9" x2="15" y2="9"></line>
                                        <line x1="9" y1="15" x2="15" y2="15"></line>
                                    </svg>
                                    表单模式
                                </button>
                                <button class="mode-btn" :class="{ active: formUrlEncodedMode === 'bulk' }"
                                    @click="formUrlEncodedMode = 'bulk'">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14,2 14,8 20,8"></polyline>
                                    </svg>
                                    批量编辑
                                </button>
                            </div>

                            <!-- 表单模式 -->
                            <div v-if="formUrlEncodedMode === 'form'" class="form-mode">
                                <div v-if="request.formUrlEncodedData.length > 0" class="form-container">
                                    <div class="form-list">
                                        <div v-for="(field, index) in request.formUrlEncodedData" :key="index"
                                            class="form-row">
                                            <input v-model="field.key" type="text" placeholder="参数名" class="form-key" />
                                            <span class="separator">=</span>
                                            <input v-model="field.value" type="text" placeholder="参数值"
                                                class="form-value" />
                                            <button class="remove-btn" @click="removeFormUrlEncodedField(index)">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button class="add-btn" @click="addFormUrlEncodedField">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    添加参数
                                </button>
                            </div>

                            <!-- 批量编辑模式 -->
                            <div v-if="formUrlEncodedMode === 'bulk'" class="bulk-mode">
                                <textarea v-model="formUrlEncodedBulkText" class="bulk-textarea"
                                    placeholder='批量编辑参数，每行一个参数，支持等号(=)或冒号(:)分割&#10;格式1：参数名=参数值&#10;格式2：参数名:参数值&#10;&#10;例如：&#10;name=张三&#10;email:test@example.com&#10;age=25&#10;city:北京&#10;token=abc123:def456'
                                    rows="8" @blur="parseBulkFormUrlEncoded"></textarea>
                                <div class="bulk-actions">
                                    <button class="format-btn" @click="formatBulkFormUrlEncoded">格式化</button>
                                    <button class="clear-btn" @click="clearBulkFormUrlEncoded">清空</button>
                                </div>
                            </div>
                        </div>

                        <!-- Form Data -->
                        <div v-if="request.bodyType === 'form-data'" class="form-body">
                            <div v-if="request.formDataFields.length > 0" class="form-list">
                                <div v-for="(field, index) in request.formDataFields" :key="index" class="form-row">
                                    <input v-model="field.key" type="text" placeholder="字段名" class="form-key" />
                                    <span class="separator">=</span>
                                    <input v-model="field.value" type="text" placeholder="字段值" class="form-value" />
                                    <button class="remove-btn" @click="removeFormDataField(index)">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button class="add-btn" @click="addFormDataField">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                添加字段
                            </button>
                        </div>

                        <!-- XML Body -->
                        <div v-if="request.bodyType === 'xml'" class="xml-body">
                            <textarea v-model="request.xmlBody" class="xml-textarea"
                                placeholder='请输入XML数据，例如：&#10;<?xml version="1.0" encoding="UTF-8"?>&#10;<root>&#10;    <name>测试用户</name>&#10;    <email>test@example.com</email>&#10;    <message>这是一个测试消息</message>&#10;</root>'
                                rows="8"></textarea>
                            <div class="xml-actions">
                                <button class="format-btn" @click="formatXml">格式化</button>
                                <button class="minify-btn" @click="minifyXml">压缩</button>
                            </div>
                        </div>

                        <!-- Raw Text -->
                        <div v-if="request.bodyType === 'raw'" class="raw-body">
                            <textarea v-model="request.rawBody" class="raw-textarea" placeholder="请输入原始文本数据"
                                rows="8"></textarea>
                        </div>

                        <!-- Binary File -->
                        <div v-if="request.bodyType === 'binary'" class="binary-body">
                            <div class="file-upload">
                                <input type="file" ref="fileInput" @change="handleFileSelect" class="file-input"
                                    id="binary-file" />
                                <label for="binary-file" class="file-label">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7,10 12,15 17,10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    {{ request.binaryFile ? request.binaryFile.name : '选择文件' }}
                                </label>
                            </div>
                            <div v-if="request.binaryFile" class="file-info">
                                <div class="file-details">
                                    <span class="file-name">{{ request.binaryFile.name }}</span>
                                    <span class="file-size">{{ formatFileSize(request.binaryFile.size) }}</span>
                                    <span class="file-type">{{ request.binaryFile.type || '未知类型' }}</span>
                                </div>
                                <button class="remove-file-btn" @click="removeBinaryFile">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 响应区域 -->
            <div class="response-section">
                <div class="response-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z">
                                </path>
                            </svg>
                        </div>
                        <div class="header-text">
                            <h3>响应结果</h3>
                            <p>API请求的返回数据和状态信息</p>
                        </div>
                    </div>
                    <div class="response-info">
                        <div v-if="response.status" class="status-badge" :class="getStatusClass(response.status)">
                            <span class="status-code">{{ response.status }}</span>
                            <span class="status-text">{{ getStatusText(response.status) }}</span>
                        </div>
                        <div v-if="response.time" class="meta-info">
                            <span>{{ response.time }}ms</span>
                        </div>
                    </div>
                </div>

                <div class="response-content">
                    <div v-if="response.data || response.error" class="response-body">
                        <div v-if="response.error" class="error-message">
                            <div class="error-title">请求失败</div>
                            <div class="error-detail">{{ response.error }}</div>
                        </div>
                        <div v-else class="response-data">
                            <pre class="response-pre">{{ formatResponse(response.data) }}</pre>
                        </div>
                    </div>
                    <div v-else class="empty-response">
                        <div class="empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M12 6v6l4 2"></path>
                            </svg>
                        </div>
                        <div class="empty-text">配置请求参数后点击发送按钮</div>
                        <div class="empty-hint">💡 提示：可以先试试上面的示例API</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import ButtonGroup from './common/ButtonGroup.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

interface Header {
    key: string
    value: string
}

interface Param {
    key: string
    value: string
}

interface FormField {
    key: string
    value: string
}

// 根据卡片ID获取标题
function getCardTitle(cardId: string): string {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === cardId)
        if (card) {
            return card.title
        }
    }
    return cardId
}

// 使用页面标题管理
usePageTitle('api-tester')
const cardTitle = getCardTitle('api-tester')

// 使用公共通知系统
const { success: showSuccess, error: showError } = useNotification()

const loading = ref(false)
const formUrlEncodedMode = ref('form') // 'form' 或 'bulk'
const formUrlEncodedBulkText = ref('')

const request = reactive({
    method: 'GET',
    url: '',
    headers: [
        { key: 'Content-Type', value: 'application/json' }
    ] as Header[],
    params: [] as Param[],
    bodyType: 'json',
    jsonBody: '',
    formData: [] as FormField[],
    formUrlEncodedData: [] as FormField[],
    formDataFields: [] as FormField[],
    xmlBody: '',
    rawBody: '',
    binaryFile: null as File | null
})

const response = reactive({
    status: null as number | null,
    data: null as any,
    headers: null as Record<string, string> | null,
    error: null as string | null,
    time: null as number | null
})
// 加载示例API
const loadExample = (type: string) => {
    switch (type) {
        case 'jsonplaceholder':
            request.method = 'GET'
            request.url = 'https://jsonplaceholder.typicode.com/posts/1'
            request.headers = [{ key: 'Content-Type', value: 'application/json' }]
            request.params = []
            break
        case 'httpbin-get':
            request.method = 'GET'
            request.url = 'https://httpbin.org/get'
            request.headers = [{ key: 'User-Agent', value: 'Toolbox-API-Tester' }]
            request.params = [
                { key: 'param1', value: 'value1' },
                { key: 'param2', value: 'value2' }
            ]
            break
        case 'httpbin-post':
            request.method = 'POST'
            request.url = 'https://httpbin.org/post'
            request.headers = [{ key: 'Content-Type', value: 'application/json' }]
            request.bodyType = 'json'
            request.jsonBody = JSON.stringify({
                name: '测试用户',
                email: 'test@example.com',
                message: '这是一个测试消息'
            }, null, 2)
            break
    }
    showSuccess('已加载示例API')
}

// 添加请求头
const addHeader = () => {
    request.headers.push({ key: '', value: '' })
}

// 移除请求头
const removeHeader = (index: number) => {
    request.headers.splice(index, 1)
}

// 添加查询参数
const addParam = () => {
    request.params.push({ key: '', value: '' })
}

// 移除查询参数
const removeParam = (index: number) => {
    request.params.splice(index, 1)
}

// 添加Form Data字段
const addFormDataField = () => {
    request.formDataFields.push({ key: '', value: '' })
}

// 移除Form Data字段
const removeFormDataField = (index: number) => {
    request.formDataFields.splice(index, 1)
}

// 添加Form URL Encoded字段
const addFormUrlEncodedField = () => {
    request.formUrlEncodedData.push({ key: '', value: '' })
}

// 移除Form URL Encoded字段
const removeFormUrlEncodedField = (index: number) => {
    request.formUrlEncodedData.splice(index, 1)
}

// 解析批量编辑的form-urlencoded文本
const parseBulkFormUrlEncoded = () => {
    const lines = formUrlEncodedBulkText.value.split('\n')
    const newData: FormField[] = []

    lines.forEach(line => {
        const trimmedLine = line.trim()
        if (trimmedLine) {
            let key = ''
            let value = ''

            // 优先使用等号分割，如果没有等号则使用冒号分割
            if (trimmedLine.includes('=')) {
                const parts = trimmedLine.split('=')
                key = parts[0] || ''
                value = parts.slice(1).join('=') // 处理值中包含=的情况
            } else if (trimmedLine.includes(':')) {
                const parts = trimmedLine.split(':')
                key = parts[0] || ''
                value = parts.slice(1).join(':') // 处理值中包含:的情况
            } else {
                // 如果既没有等号也没有冒号，将整行作为key，value为空
                key = trimmedLine
                value = ''
            }

            if (key && key.trim()) {
                newData.push({ key: key.trim(), value: value.trim() })
            }
        }
    })

    request.formUrlEncodedData = newData
}

// 将表单数据同步到批量编辑文本
const syncFormUrlEncodedToBulk = () => {
    const lines = request.formUrlEncodedData
        .filter(field => field.key || field.value)
        .map(field => `${field.key}=${field.value}`)
    formUrlEncodedBulkText.value = lines.join('\n')
}

// 格式化批量编辑文本
const formatBulkFormUrlEncoded = () => {
    parseBulkFormUrlEncoded()
    syncFormUrlEncodedToBulk()
    showSuccess('批量参数格式化成功')
}

// 清空批量编辑文本
const clearBulkFormUrlEncoded = () => {
    formUrlEncodedBulkText.value = ''
    request.formUrlEncodedData = []
    showSuccess('已清空批量参数')
}

// 格式化JSON
const formatJson = () => {
    try {
        const parsed = JSON.parse(request.jsonBody)
        request.jsonBody = JSON.stringify(parsed, null, 2)
        showSuccess('JSON格式化成功')
    } catch (error) {
        showError('JSON格式错误，无法格式化')
    }
}

// 压缩JSON
const minifyJson = () => {
    try {
        const parsed = JSON.parse(request.jsonBody)
        request.jsonBody = JSON.stringify(parsed)
        showSuccess('JSON压缩成功')
    } catch (error) {
        showError('JSON格式错误，无法压缩')
    }
}

// 格式化XML
const formatXml = () => {
    try {
        // 简单的XML格式化
        let formatted = request.xmlBody
            .replace(/></g, '>\n<')
            .replace(/^\s*\n/gm, '')

        // 添加缩进
        const lines = formatted.split('\n')
        let indent = 0
        const indentSize = 2

        formatted = lines.map(line => {
            const trimmed = line.trim()
            if (trimmed.startsWith('</')) {
                indent -= indentSize
            }
            const result = ' '.repeat(Math.max(0, indent)) + trimmed
            if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
                indent += indentSize
            }
            return result
        }).join('\n')

        request.xmlBody = formatted
        showSuccess('XML格式化成功')
    } catch (error) {
        showError('XML格式化失败')
    }
}

// 压缩XML
const minifyXml = () => {
    try {
        request.xmlBody = request.xmlBody
            .replace(/>\s+</g, '><')
            .replace(/^\s+|\s+$/g, '')
        showSuccess('XML压缩成功')
    } catch (error) {
        showError('XML压缩失败')
    }
}

// 处理文件选择
const fileInput = ref<HTMLInputElement>()
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        request.binaryFile = file
        showSuccess(`已选择文件: ${file.name}`)
    }
}

// 移除二进制文件
const removeBinaryFile = () => {
    request.binaryFile = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
    showSuccess('已移除文件')
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 清空所有
const clearAll = () => {
    request.method = 'GET'
    request.url = ''
    request.headers = [{ key: 'Content-Type', value: 'application/json' }]
    request.params = []
    request.bodyType = 'json'
    request.jsonBody = ''
    request.formData = []
    request.formUrlEncodedData = []
    request.formDataFields = []
    request.xmlBody = ''
    request.rawBody = ''
    request.binaryFile = null

    formUrlEncodedMode.value = 'form'
    formUrlEncodedBulkText.value = ''

    if (fileInput.value) {
        fileInput.value.value = ''
    }

    response.status = null
    response.data = null
    response.headers = null
    response.error = null
    response.time = null

    showSuccess('已清空所有配置')
}

// 发送请求
// 发送请求
const sendRequest = async () => {
    if (!request.url.trim()) {
        showError('请输入API接口地址')
        return
    }

    loading.value = true
    response.error = null
    response.data = null
    response.headers = null
    response.status = null
    response.time = null

    const startTime = Date.now()

    try {
        // 构建目标URL
        let targetUrl = request.url.trim()
        if (!targetUrl.match(/^https?:\/\//)) {
            targetUrl = 'https://' + targetUrl
        }

        if (request.method === 'GET' && request.params.length > 0) {
            const params = new URLSearchParams()
            request.params.forEach(param => {
                if (param.key && param.value) {
                    params.append(param.key, param.value)
                }
            })
            const queryString = params.toString()
            if (queryString) {
                targetUrl += (targetUrl.includes('?') ? '&' : '?') + queryString
            }
        }

        // 构建请求头
        const headers: Record<string, string> = {}
        request.headers.forEach(header => {
            if (header.key && header.value) {
                headers[header.key] = header.value
            }
        })

        // 代理 API URL
        const proxyUrl = 'https://difficult-ape-32.panxu71.deno.net'

        // 构建代理请求配置
        const config: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // 构建代理请求体
        const proxyBody: any = {
            url: targetUrl,
            method: request.method,
            headers: headers
        }

        // 构建请求体
        if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
            if (request.bodyType === 'json' && request.jsonBody) {
                try {
                    proxyBody.body = JSON.parse(request.jsonBody)
                    if (!headers['Content-Type']) {
                        proxyBody.headers['Content-Type'] = 'application/json'
                    }
                } catch (error) {
                    throw new Error('JSON格式错误，请检查请求体')
                }
            } else if (request.bodyType === 'form-urlencoded' && request.formUrlEncodedData.length > 0) {
                const params = new URLSearchParams()
                request.formUrlEncodedData.forEach(field => {
                    if (field.key && field.value) {
                        params.append(field.key, field.value)
                    }
                })
                proxyBody.body = params.toString()
                proxyBody.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            } else if (request.bodyType === 'form-data' && request.formDataFields.length > 0) {
                const formData: Record<string, string> = {}
                request.formDataFields.forEach(field => {
                    if (field.key && field.value) {
                        formData[field.key] = field.value
                    }
                })
                proxyBody.body = formData
                proxyBody.headers['Content-Type'] = 'multipart/form-data'
            } else if (request.bodyType === 'xml' && request.xmlBody) {
                proxyBody.body = request.xmlBody
                proxyBody.headers['Content-Type'] = 'application/xml'
            } else if (request.bodyType === 'raw' && request.rawBody) {
                proxyBody.body = request.rawBody
                if (!proxyBody.headers['Content-Type']) {
                    proxyBody.headers['Content-Type'] = 'text/plain'
                }
            } else if (request.bodyType === 'binary' && request.binaryFile) {
                // Binary 文件暂不支持通过代理
                throw new Error('二进制文件上传暂不支持代理模式')
            }
        }

        config.body = JSON.stringify(proxyBody)

        // 发送请求到代理
        const fetchResponse = await fetch(proxyUrl, config)
        const endTime = Date.now()

        response.time = endTime - startTime

        // 获取代理响应
        const proxyResponse = await fetchResponse.json()

        response.status = proxyResponse.status || fetchResponse.status
        response.headers = proxyResponse.headers || {}
        response.data = proxyResponse.data || proxyResponse.body

        if (proxyResponse.error) {
            response.error = proxyResponse.error
            showError('请求失败')
        } else if (!fetchResponse.ok) {
            response.error = `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`
            showError('请求失败')
        } else {
            showSuccess('请求发送成功')
        }

    } catch (error: any) {
        const endTime = Date.now()
        response.time = endTime - startTime

        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            response.error = '代理服务连接失败或网络错误'
        } else if (error.message.includes('JSON格式错误')) {
            response.error = error.message
        } else {
            response.error = error.message || '请求失败'
        }
        showError('请求失败')
    } finally {
        loading.value = false
    }
}

// 获取状态码样式
const getStatusClass = (status: number) => {
    if (status >= 200 && status < 300) return 'success'
    if (status >= 300 && status < 400) return 'redirect'
    if (status >= 400 && status < 500) return 'client-error'
    if (status >= 500) return 'server-error'
    return ''
}

// 获取状态码文本
const getStatusText = (status: number) => {
    const statusTexts: Record<number, string> = {
        200: 'OK',
        201: 'Created',
        204: 'No Content',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable'
    }
    return statusTexts[status] || 'Unknown'
}

// 格式化响应数据
const formatResponse = (data: any) => {
    if (typeof data === 'string') {
        try {
            return JSON.stringify(JSON.parse(data), null, 2)
        } catch {
            return data
        }
    }
    return JSON.stringify(data, null, 2)
}

// 复制响应结果
const copyResponse = async () => {
    try {
        let responseText = ''
        if (response.error) {
            responseText = response.error
        } else if (response.data) {
            responseText = formatResponse(response.data)
        } else {
            responseText = '无响应数据'
        }

        await navigator.clipboard.writeText(responseText)
        showSuccess('响应结果已复制到剪贴板')
    } catch (error) {
        showError('复制失败')
    }
}
</script>
<style scoped>
.api-tester {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.formatter-actions {
    display: flex;
    gap: 0.5rem;
}

.tester-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border-color);
    overflow: hidden;
}

.request-section,
.response-section {
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.request-header,
.response-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 88px;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
}

.header-icon {
    width: 40px;
    height: 40px;
    background: var(--primary-color-alpha);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    flex-shrink: 0;
}

.header-text h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
}

.header-text p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--text-muted);
}

.example-buttons {
    display: flex;
    align-items: center;
}

.method-badge {
    font-size: 0.625rem;
    font-weight: 700;
    padding: 0.125rem 0.25rem;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-right: 0.375rem;
}

.method-badge.get {
    background: var(--success-color);
    color: white;
}

.method-badge.post {
    background: #3b82f6;
    color: white;
}

.request-content {
    flex: 1;
    padding: 1.25rem;
    overflow-y: auto;
}

.request-line {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    align-items: stretch;
}

.method-select {
    width: 120px;
    padding: 0.875rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.method-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.url-input {
    flex: 1;
    padding: 0.875rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: var(--transition);
}

.url-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
    background: var(--bg-primary);
}

.send-btn {
    padding: 0.875rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 140px;
    justify-content: center;
}

.send-btn:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.send-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.send-btn.get {
    background: var(--success-color);
}

.send-btn.post {
    background: #3b82f6;
}

.send-btn.put {
    background: #f59e0b;
}

.send-btn.delete {
    background: var(--error-color);
}

.loading-icon {
    animation: spin 1s linear infinite;
}

.config-section {
    margin-bottom: 1.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1rem;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.section-header h4 {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
}

.add-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.875rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.add-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

.body-type-select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 0.8125rem;
    cursor: pointer;
}

.headers-list,
.params-list,
.form-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.header-row,
.param-row,
.form-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header-key,
.header-value,
.param-key,
.param-value,
.form-key,
.form-value {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.8125rem;
    transition: var(--transition);
}

.header-key:focus,
.header-value:focus,
.param-key:focus,
.param-value:focus,
.form-key:focus,
.form-value:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
}

.separator {
    color: var(--text-muted);
    font-weight: 600;
    font-size: 0.875rem;
}

.remove-btn {
    width: 24px;
    height: 24px;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
}

.remove-btn:hover {
    background: var(--error-color-dark);
    transform: scale(1.1);
}

.json-textarea,
.xml-textarea,
.raw-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.8125rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    resize: vertical;
    min-height: 120px;
    line-height: 1.5;
}

.json-textarea:focus,
.xml-textarea:focus,
.raw-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
}

.json-actions,
.xml-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.format-btn,
.minify-btn {
    padding: 0.375rem 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 0.75rem;
    cursor: pointer;
    transition: var(--transition);
}

.format-btn:hover,
.minify-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.response-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.8125rem;
    border: 1px solid;
}

.status-badge.success {
    background: var(--success-color-alpha);
    color: var(--success-color);
    border-color: var(--success-color);
}

.status-badge.redirect {
    background: var(--warning-color-alpha);
    color: var(--warning-color);
    border-color: var(--warning-color);
}

.status-badge.client-error,
.status-badge.server-error {
    background: var(--error-color-alpha);
    color: var(--error-color);
    border-color: var(--error-color);
}

.status-code {
    font-weight: 700;
}

.meta-info {
    font-size: 0.75rem;
    color: var(--text-muted);
    background: var(--bg-tertiary);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
}

.response-content {
    flex: 1;
    overflow: hidden;
}

.response-body {
    padding: 1.25rem;
    height: 100%;
    overflow-y: auto;
}

.error-message {
    background: var(--error-color-alpha);
    border: 1px solid var(--error-color);
    border-radius: var(--radius-md);
    padding: 1rem;
}

.error-title {
    font-weight: 600;
    color: var(--error-color);
    margin-bottom: 0.5rem;
}

.error-detail {
    color: var(--error-color);
    font-size: 0.875rem;
    white-space: pre-line;
}

.response-pre {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 1rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.8125rem;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-break: break-all;
    margin: 0;
    overflow-x: auto;
    line-height: 1.5;
}

.empty-response {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    padding: 2.5rem;
    text-align: center;
}

.empty-icon {
    margin-bottom: 1rem;
    opacity: 0.5;
}

.empty-text {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.empty-hint {
    font-size: 0.75rem;
    opacity: 0.8;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.file-upload {
    margin-bottom: 1rem;
}

.file-input {
    display: none;
}

.file-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border: 2px dashed var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.875rem;
}

.file-label:hover {
    border-color: var(--primary-color);
    background: var(--primary-color-alpha);
    color: var(--primary-color);
}

.file-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    margin-top: 0.5rem;
}

.file-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.file-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.file-size,
.file-type {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.remove-file-btn {
    width: 32px;
    height: 32px;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.remove-file-btn:hover {
    background: var(--error-color-dark);
    transform: scale(1.1);
}

.form-mode-toggle {
    display: flex;
    gap: 4px;
    margin-bottom: 1rem;
    background: var(--bg-tertiary);
    padding: 4px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
}

.mode-btn {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
}

.mode-btn:hover {
    background: var(--bg-primary);
    color: var(--text-primary);
}

.mode-btn.active {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.form-mode,
.bulk-mode {
    margin-top: 0.5rem;
}

.bulk-textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.8125rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    resize: vertical;
    min-height: 120px;
    line-height: 1.5;
}

.bulk-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
}

.bulk-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.clear-btn {
    padding: 0.375rem 0.75rem;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    cursor: pointer;
    transition: var(--transition);
}

.clear-btn:hover {
    background: var(--error-color-dark);
    transform: translateY(-1px);
}

@media (max-width: 1024px) {
    .tester-content {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }

    .request-section {
        max-height: 50vh;
    }
}

@media (max-width: 640px) {
    .request-line {
        flex-direction: column;
    }

    .method-select {
        width: 100%;
    }

    .header-row,
    .param-row,
    .form-row {
        flex-direction: column;
        align-items: stretch;
        gap: 0.25rem;
    }

    .separator {
        display: none;
    }

    .remove-btn {
        align-self: flex-end;
        width: 100%;
        margin-top: 0.25rem;
    }
}
</style>