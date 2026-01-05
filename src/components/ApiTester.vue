<template>
    <div class="api-tester">
        <div class="tester-header">
            <button class="back-btn" @click="$emit('back')" title="返回">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m12 19-7-7 7-7"></path>
                    <path d="m19 12H5"></path>
                </svg>
                返回
            </button>
            <h2 class="tester-title">API接口测试</h2>
            <div class="tester-actions">
                <button class="action-btn" @click="clearAll" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>

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
                    <div class="request-info">
                        <div class="example-buttons">
                            <button class="example-btn-small get" @click="loadExample('jsonplaceholder')"
                                title="JSONPlaceholder API">
                                <span class="method-badge-small">GET</span>
                                <span class="example-name-small">JSONPlaceholder</span>
                            </button>
                            <button class="example-btn-small get" @click="loadExample('httpbin-get')"
                                title="HTTPBin GET API">
                                <span class="method-badge-small">GET</span>
                                <span class="example-name-small">HTTPBin GET</span>
                            </button>
                            <button class="example-btn-small post" @click="loadExample('httpbin-post')"
                                title="HTTPBin POST API">
                                <span class="method-badge-small">POST</span>
                                <span class="example-name-small">HTTPBin POST</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="request-content">
                    <!-- 请求方法和URL -->
                    <div class="request-line">
                        <div class="method-wrapper">
                            <select v-model="request.method" class="method-select">
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                                <option value="PATCH">PATCH</option>
                                <option value="HEAD">HEAD</option>
                                <option value="OPTIONS">OPTIONS</option>
                            </select>
                        </div>
                        <div class="url-wrapper">
                            <input v-model="request.url" type="text" class="url-input"
                                placeholder="请输入API接口地址，如：https://jsonplaceholder.typicode.com/posts"
                                @keyup.enter="sendRequest" />
                            <div class="url-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                </svg>
                            </div>
                        </div>
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
                            <span>{{ loading ? '发送中...' : '发送请求' }}</span>
                        </button>
                    </div>

                    <!-- 请求头 -->
                    <div class="headers-section">
                        <div class="section-title">
                            <div class="title-content">
                                <div class="title-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14,2 14,8 20,8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10,9 9,9 8,9"></polyline>
                                    </svg>
                                </div>
                                <div class="title-text">
                                    <span class="title-main">请求头 (Headers)</span>
                                    <span class="title-sub">设置HTTP请求头信息</span>
                                </div>
                            </div>
                            <button class="add-btn" @click="addHeader">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>添加</span>
                            </button>
                        </div>
                        <div v-if="request.headers.length > 0" class="headers-container">
                            <div class="headers-list-compact">
                                <div v-for="(header, index) in request.headers" :key="index" class="header-row">
                                    <input v-model="header.key" type="text" placeholder="Header名称，如：Content-Type"
                                        class="header-key-compact" />
                                    <div class="input-separator">:</div>
                                    <input v-model="header.value" type="text" placeholder="Header值，如：application/json"
                                        class="header-value-compact" />
                                    <button class="remove-btn-compact" @click="removeHeader(index)" title="删除此请求头">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 请求参数 -->
                    <div class="params-section" v-if="request.method === 'GET'">
                        <div class="section-title">
                            <div class="title-content">
                                <div class="title-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M12 1v6m0 6v6"></path>
                                        <path d="m21 12-6-6m-6 6-6-6"></path>
                                    </svg>
                                </div>
                                <div class="title-text">
                                    <span class="title-main">查询参数 (Query Parameters)</span>
                                    <span class="title-sub">设置URL查询字符串参数</span>
                                </div>
                            </div>
                            <button class="add-btn" @click="addParam">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>添加</span>
                            </button>
                        </div>
                        <div v-if="request.params.length > 0" class="params-container">
                            <div class="params-list-compact">
                                <div v-for="(param, index) in request.params" :key="index" class="param-row">
                                    <input v-model="param.key" type="text" placeholder="参数名"
                                        class="param-key-compact" />
                                    <div class="input-separator">=</div>
                                    <input v-model="param.value" type="text" placeholder="参数值"
                                        class="param-value-compact" />
                                    <button class="remove-btn-compact" @click="removeParam(index)" title="删除此参数">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 请求体 -->
                    <div class="body-section" v-if="['POST', 'PUT', 'PATCH'].includes(request.method)">
                        <div class="section-title">
                            <div class="title-content">
                                <div class="title-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z">
                                        </path>
                                        <polyline points="14,2 14,8 20,8"></polyline>
                                    </svg>
                                </div>
                                <div class="title-text">
                                    <span class="title-main">请求体 (Request Body)</span>
                                    <span class="title-sub">选择数据格式并输入请求内容</span>
                                </div>
                            </div>
                            <div class="body-type-wrapper">
                                <select v-model="request.bodyType" class="body-type-select">
                                    <option value="json">📄 JSON</option>
                                    <option value="form-urlencoded">📝 x-www-form-urlencoded</option>
                                    <option value="form-data">📋 Form Data</option>
                                    <option value="xml">🏷️ XML</option>
                                    <option value="raw">📃 Raw Text</option>
                                    <option value="binary">📁 Binary File</option>
                                </select>
                            </div>
                        </div>

                        <!-- JSON Body -->
                        <div v-if="request.bodyType === 'json'" class="json-body">
                            <textarea v-model="request.jsonBody" class="json-textarea" placeholder='请输入JSON数据，例如：
{
  "title": "测试标题",
  "body": "测试内容",
  "userId": 1
}' rows="8"></textarea>
                            <div class="json-actions">
                                <button class="format-btn" @click="formatJson">格式化</button>
                                <button class="minify-btn" @click="minifyJson">压缩</button>
                            </div>
                        </div>

                        <!-- Form Data -->
                        <div v-if="request.bodyType === 'form-data'" class="form-body">
                            <div class="form-list">
                                <div v-for="(field, index) in request.formData" :key="index" class="form-item">
                                    <input v-model="field.key" type="text" placeholder="字段名" class="form-key" />
                                    <input v-model="field.value" type="text" placeholder="字段值" class="form-value" />
                                    <button class="remove-btn" @click="removeFormField(index)">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <button class="add-btn" @click="addFormField">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                添加字段
                            </button>
                        </div>

                        <!-- x-www-form-urlencoded -->
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
                                    <div class="form-list-compact">
                                        <div v-for="(field, index) in request.formUrlEncodedData" :key="index"
                                            class="form-row">
                                            <input v-model="field.key" type="text" placeholder="参数名"
                                                class="form-key-compact" />
                                            <div class="input-separator">=</div>
                                            <input v-model="field.value" type="text" placeholder="参数值"
                                                class="form-value-compact" />
                                            <button class="remove-btn-compact"
                                                @click="removeFormUrlEncodedField(index)">
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
                                <textarea v-model="formUrlEncodedBulkText" class="bulk-textarea" placeholder='批量编辑参数，每行一个参数，支持等号(=)或冒号(:)分割
格式1：参数名=参数值
格式2：参数名:参数值

例如：
name=张三
email:test@example.com
age=25
city:北京
token=abc123:def456' rows="8" @blur="parseBulkFormUrlEncoded"></textarea>
                                <div class="bulk-actions">
                                    <button class="format-btn" @click="formatBulkFormUrlEncoded">格式化</button>
                                    <button class="clear-btn" @click="clearBulkFormUrlEncoded">清空</button>
                                </div>
                            </div>
                        </div>

                        <!-- XML Body -->
                        <div v-if="request.bodyType === 'xml'" class="xml-body">
                            <textarea v-model="request.xmlBody" class="xml-textarea" placeholder='请输入XML数据，例如：
<?xml version="1.0" encoding="UTF-8"?>
<root>
    <name>测试用户</name>
    <email>test@example.com</email>
    <message>这是一个测试消息</message>
</root>' rows="8"></textarea>
                            <div class="xml-actions">
                                <button class="format-btn" @click="formatXml">格式化</button>
                                <button class="minify-btn" @click="minifyXml">压缩</button>
                            </div>
                        </div>

                        <!-- Raw Text -->
                        <div v-if="request.bodyType === 'raw'" class="raw-body">
                            <textarea v-model="request.rawBody" class="raw-textarea" placeholder="请输入原始文本数据，支持任意格式"
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
                        <div v-if="response.status" class="response-status">
                            <div class="status-badge" :class="getStatusClass(response.status)">
                                <div class="status-dot"></div>
                                <span class="status-code">{{ response.status }}</span>
                                <span class="status-text">{{ getStatusText(response.status) }}</span>
                            </div>
                            <div class="response-meta">
                                <div class="meta-item" v-if="response.time">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12,6 12,12 16,14"></polyline>
                                    </svg>
                                    <span>{{ response.time }}ms</span>
                                </div>
                                <div class="meta-item" v-if="response.size">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14,2 14,8 20,8"></polyline>
                                    </svg>
                                    <span>{{ formatSize(response.size) }}</span>
                                </div>
                            </div>
                        </div>
                        <div v-else class="response-placeholder">
                            <span class="placeholder-text">等待响应...</span>
                        </div>
                    </div>
                </div>

                <div class="response-content" v-if="response.data || response.error">
                    <!-- 响应头 -->
                    <div class="response-headers" v-if="response.headers">
                        <div class="response-tab-header">
                            <button class="tab-btn" :class="{ active: activeTab === 'body' }"
                                @click="activeTab = 'body'">
                                响应体
                            </button>
                            <button class="tab-btn" :class="{ active: activeTab === 'headers' }"
                                @click="activeTab = 'headers'">
                                响应头
                            </button>
                        </div>
                    </div>

                    <!-- 响应体 -->
                    <div v-if="activeTab === 'body'" class="response-body">
                        <!-- 复制按钮 -->
                        <button v-if="response.status && (response.data || response.error)" @click="copyResponse"
                            class="copy-response-btn-floating" title="复制响应结果">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                        </button>

                        <div v-if="response.error" class="error-message">
                            <div class="error-title">请求失败</div>
                            <div class="error-detail">{{ response.error }}</div>
                        </div>
                        <div v-else class="response-data">
                            <pre class="response-pre">{{ formatResponse(response.data) }}</pre>
                        </div>
                    </div>

                    <!-- 响应头 -->
                    <div v-if="activeTab === 'headers'" class="response-headers-content">
                        <div v-for="(value, key) in response.headers" :key="key" class="header-row">
                            <span class="header-name">{{ key }}:</span>
                            <span class="header-value">{{ value }}</span>
                        </div>
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

        <!-- 消息提示 -->
        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {  ref, reactive, onMounted, onUnmounted  } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'

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

// 使用页面标题管理
usePageTitle('api-tester')

const loading = ref(false)
const activeTab = ref('body')
const formUrlEncodedMode = ref('form') // 'form' 或 'bulk'
const formUrlEncodedBulkText = ref('')

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

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
    xmlBody: '',
    rawBody: '',
    binaryFile: null as File | null,
    textBody: ''
})

const response = reactive({
    status: null as number | null,
    data: null as any,
    headers: null as Record<string, string> | null,
    error: null as string | null,
    time: null as number | null,
    size: null as number | null
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

// 添加表单字段
const addFormField = () => {
    request.formData.push({ key: '', value: '' })
}

// 移除表单字段
const removeFormField = (index: number) => {
    request.formData.splice(index, 1)
}

// 添加form-urlencoded字段
const addFormUrlEncodedField = () => {
    request.formUrlEncodedData.push({ key: '', value: '' })
    syncFormUrlEncodedToBulk()
}

// 移除form-urlencoded字段
const removeFormUrlEncodedField = (index: number) => {
    request.formUrlEncodedData.splice(index, 1)
    syncFormUrlEncodedToBulk()
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
}

// 清空批量编辑文本
const clearBulkFormUrlEncoded = () => {
    formUrlEncodedBulkText.value = ''
    request.formUrlEncodedData = []
}

// 格式化JSON
const formatJson = () => {
    try {
        const parsed = JSON.parse(request.jsonBody)
        request.jsonBody = JSON.stringify(parsed, null, 2)
    } catch (error) {
        alert('JSON格式错误，无法格式化')
    }
}

// 压缩JSON
const minifyJson = () => {
    try {
        const parsed = JSON.parse(request.jsonBody)
        request.jsonBody = JSON.stringify(parsed)
    } catch (error) {
        alert('JSON格式错误，无法压缩')
    }
}

// 格式化XML
const formatXml = () => {
    try {
        // 简单的XML格式化
        const formatted = request.xmlBody
            .replace(/></g, '>\n<')
            .replace(/^\s*\n/gm, '')
        request.xmlBody = formatted
    } catch (error) {
        alert('XML格式化失败')
    }
}

// 压缩XML
const minifyXml = () => {
    try {
        request.xmlBody = request.xmlBody
            .replace(/>\s+</g, '><')
            .replace(/^\s+|\s+$/g, '')
    } catch (error) {
        alert('XML压缩失败')
    }
}

// 处理文件选择
const fileInput = ref<HTMLInputElement>()
const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        request.binaryFile = file
    }
}

// 移除二进制文件
const removeBinaryFile = () => {
    request.binaryFile = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// 格式化文件大小
const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 清空所有
const clearAll = () => {
    if (confirm('确定要清空所有配置吗？')) {
        request.method = 'GET'
        request.url = ''
        request.headers = [{ key: 'Content-Type', value: 'application/json' }]
        request.params = []
        request.bodyType = 'json'
        request.jsonBody = ''
        request.formData = []
        request.formUrlEncodedData = []
        request.xmlBody = ''
        request.rawBody = ''
        request.binaryFile = null
        request.textBody = ''

        response.status = null
        response.data = null
        response.headers = null
        response.error = null
        response.time = null
        response.size = null

        if (fileInput.value) {
            fileInput.value.value = ''
        }
    }
}

// 发送请求
const sendRequest = async () => {
    if (!request.url.trim()) {
        alert('请输入API接口地址')
        return
    }

    loading.value = true
    response.error = null
    response.data = null
    response.headers = null
    response.status = null
    response.time = null
    response.size = null

    const startTime = Date.now()

    try {
        // 构建URL
        let url = request.url.trim()

        // 如果URL不包含协议，自动添加https://
        if (!url.match(/^https?:\/\//)) {
            url = 'https://' + url
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
                url += (url.includes('?') ? '&' : '?') + queryString
            }
        }

        // 构建请求头
        const headers: Record<string, string> = {}
        request.headers.forEach(header => {
            if (header.key && header.value) {
                headers[header.key] = header.value
            }
        })

        // 构建请求配置
        const config: RequestInit = {
            method: request.method,
            headers,
            mode: 'cors'
        }

        // 构建请求体
        if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
            if (request.bodyType === 'json' && request.jsonBody) {
                try {
                    // 验证JSON格式
                    JSON.parse(request.jsonBody)
                    config.body = request.jsonBody
                    if (!headers['Content-Type']) {
                        headers['Content-Type'] = 'application/json'
                    }
                } catch (error) {
                    throw new Error('JSON格式错误，请检查请求体')
                }
            } else if (request.bodyType === 'form-data' && request.formData.length > 0) {
                const formData = new FormData()
                request.formData.forEach(field => {
                    if (field.key && field.value) {
                        formData.append(field.key, field.value)
                    }
                })
                config.body = formData
                // 删除Content-Type，让浏览器自动设置
                delete headers['Content-Type']
            } else if (request.bodyType === 'form-urlencoded' && request.formUrlEncodedData.length > 0) {
                const params = new URLSearchParams()
                request.formUrlEncodedData.forEach(field => {
                    if (field.key && field.value) {
                        params.append(field.key, field.value)
                    }
                })
                config.body = params.toString()
                headers['Content-Type'] = 'application/x-www-form-urlencoded'
            } else if (request.bodyType === 'xml' && request.xmlBody) {
                config.body = request.xmlBody
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'application/xml'
                }
            } else if (request.bodyType === 'raw' && request.rawBody) {
                config.body = request.rawBody
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'text/plain'
                }
            } else if (request.bodyType === 'binary' && request.binaryFile) {
                config.body = request.binaryFile
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = request.binaryFile.type || 'application/octet-stream'
                }
            } else if (request.bodyType === 'text' && request.textBody) {
                config.body = request.textBody
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'text/plain'
                }
            }
        }

        // 发送请求
        const fetchResponse = await fetch(url, config)
        const endTime = Date.now()

        response.status = fetchResponse.status
        response.time = endTime - startTime

        // 获取响应头
        const responseHeaders: Record<string, string> = {}
        fetchResponse.headers.forEach((value, key) => {
            responseHeaders[key] = value
        })
        response.headers = responseHeaders

        // 获取响应体
        const contentType = fetchResponse.headers.get('content-type')
        let responseData: any

        if (contentType && contentType.includes('application/json')) {
            try {
                responseData = await fetchResponse.json()
            } catch (error) {
                // 如果JSON解析失败，尝试作为文本处理
                responseData = await fetchResponse.text()
            }
        } else {
            responseData = await fetchResponse.text()
        }

        response.data = responseData
        response.size = new Blob([JSON.stringify(responseData)]).size

        // 如果状态码不是2xx，显示为错误
        if (!fetchResponse.ok) {
            response.error = `HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`
        }

    } catch (error: any) {
        const endTime = Date.now()
        response.time = endTime - startTime

        // 处理不同类型的错误
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            response.error = 'CORS跨域错误或网络连接失败。\n\n可能的原因：\n1. 目标API不支持跨域请求\n2. 网络连接问题\n3. API地址错误\n\n💡 建议：先试试上面的示例API'
        } else if (error.message.includes('JSON格式错误')) {
            response.error = error.message
        } else {
            response.error = error.message || '请求失败'
        }
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
        301: 'Moved Permanently',
        302: 'Found',
        304: 'Not Modified',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout'
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

// 格式化文件大小
const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 显示消息提示
const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
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
        showMessage('响应结果已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败，请手动选择复制', 'error')
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
}

.tester-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 14px;
}

.back-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.tester-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.tester-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    width: 36px;
    height: 36px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.action-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
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
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
    margin-bottom: 0;
    min-height: 88px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
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

.header-text {
    flex: 1;
}

.header-text h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.2;
}

.header-text p {
    margin: 0;
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.3;
}

.header-placeholder {
    width: 1px;
    height: 1px;
    opacity: 0;
}

.request-info,
.response-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    min-height: 40px;
}

.request-placeholder,
.response-placeholder {
    display: flex;
    align-items: center;
    height: 40px;
}

.placeholder-text {
    font-size: 13px;
    color: var(--text-muted);
    font-style: italic;
}

/* 统一status-badge样式，让左右两边完全一致 */
.example-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
}

.example-btn-small {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    font-size: 12px;
}

.example-btn-small:hover {
    border-color: var(--primary-color);
    background: var(--primary-color-alpha);
    transform: translateY(-1px);
}

.method-badge-small {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 4px;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.example-btn-small.get .method-badge-small {
    background: #10b981;
    color: white;
}

.example-btn-small.post .method-badge-small {
    background: #3b82f6;
    color: white;
}

.example-name-small {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-primary);
}

.status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: var(--radius-lg);
    font-weight: 600;
    font-size: 13px;
    white-space: nowrap;
    border: 1px solid;
}

/* HTTP方法的颜色样式 */
.status-badge.get {
    background: var(--success-color-alpha);
    color: var(--success-color);
    border-color: var(--success-color);
}

.status-badge.post {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border-color: #3b82f6;
}

.status-badge.put {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border-color: #f59e0b;
}

.status-badge.delete {
    background: var(--error-color-alpha);
    color: var(--error-color);
    border-color: var(--error-color);
}

.status-badge.patch {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
    border-color: #8b5cf6;
}

.status-badge.head,
.status-badge.options {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    border-color: var(--border-color);
}

/* HTTP状态码的颜色样式 */
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

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
}

.status-code {
    font-weight: 700;
}

.status-text {
    opacity: 0.8;
}



.response-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    min-height: 40px;
}

.response-status {
    display: flex;
    align-items: center;
    gap: 16px;
}

.response-placeholder {
    display: flex;
    align-items: center;
    height: 40px;
}

.placeholder-text {
    font-size: 13px;
    color: var(--text-muted);
    font-style: italic;
}



.response-meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--text-muted);
    background: var(--bg-tertiary);
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    white-space: nowrap;
}

.request-section {
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.request-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.request-line {
    display: flex;
    gap: 12px;
    margin: 24px 0;
    align-items: stretch;
}

.method-wrapper {
    position: relative;
}

.method-select {
    width: 120px;
    padding: 14px 16px;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 12px center;
    background-repeat: no-repeat;
    background-size: 16px;
    padding-right: 40px;
}

.method-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.url-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.url-input {
    flex: 1;
    padding: 14px 16px 14px 48px;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
}

.url-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
    background: var(--bg-primary);
}

.url-icon {
    position: absolute;
    left: 16px;
    color: var(--text-muted);
    pointer-events: none;
    z-index: 1;
}

.send-btn {
    padding: 14px 24px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 140px;
    justify-content: center;
    box-shadow: 0 2px 4px var(--primary-color-alpha);
}

.send-btn:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px var(--primary-color-alpha);
}

.send-btn:active:not(:disabled) {
    transform: translateY(0);
}

.send-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.send-btn.get {
    background: #10b981;
}

.send-btn.post {
    background: #3b82f6;
}

.send-btn.put {
    background: #f59e0b;
}

.send-btn.delete {
    background: #ef4444;
}

.send-btn.patch {
    background: #8b5cf6;
}

.loading-icon {
    animation: spin 1s linear infinite;
}

.example-apis {
    margin-bottom: 32px;
    padding: 20px;
    background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
}

.example-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}

.example-icon {
    color: var(--primary-color);
}

.example-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.example-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
}

.example-btn {
    padding: 12px 16px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    text-align: left;
}

.example-btn:hover {
    border-color: var(--primary-color);
    background: var(--primary-color-alpha);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.method-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.example-btn.get .method-badge {
    background: #10b981;
    color: white;
}

.example-btn.post .method-badge {
    background: #3b82f6;
    color: white;
}

.example-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
}

.example-desc {
    font-size: 11px;
    color: var(--text-muted);
}

.headers-list,
.params-list,
.form-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 0;
}

.headers-section,
.params-section,
.body-section {
    margin-bottom: 32px;
}

.section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding: 10px 20px;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
}

.title-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.title-icon {
    width: 32px;
    height: 32px;
    background: var(--primary-color-alpha);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
}

.title-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.title-main {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
}

.title-sub {
    font-size: 12px;
    color: var(--text-muted);
}

.add-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    margin-top: 16px;
}

.add-btn:hover {
    background: var(--primary-hover);
    transform: translateY(-1px);
}

/* 重置标题栏中添加按钮的margin */
.section-title .add-btn {
    margin-top: 0;
}

.body-type-wrapper {
    display: flex;
    align-items: center;
}

.body-type-select {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    min-width: 180px;
}

.body-type-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
}

.header-item,
.param-item,
.form-item {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    align-items: center;
    padding: 16px;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    transition: var(--transition);
}

/* 紧凑的表单项样式 - 用于form-urlencoded */
.form-item.compact {
    padding: 8px 12px;
    margin-bottom: 6px;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
}

.form-item.compact:hover {
    border-color: var(--primary-color-alpha);
    background: var(--bg-tertiary);
}

.header-item:hover,
.param-item:hover,
.form-item:hover:not(.compact) {
    border-color: var(--primary-color-alpha);
    background: var(--bg-tertiary);
}

.input-group {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
}

.input-separator {
    color: var(--text-muted);
    font-weight: 600;
    font-size: 14px;
    padding: 0 4px;
}

.header-key,
.header-value,
.param-key,
.param-value,
.form-key,
.form-value {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
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
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
    background: var(--bg-primary);
}

/* 紧凑模式下的输入框样式 */
.form-item.compact .form-key,
.form-item.compact .form-value {
    padding: 6px 10px;
    font-size: 13px;
    border-radius: var(--radius-sm);
}

.form-item.compact .input-separator {
    color: var(--text-muted);
    font-weight: 600;
    font-size: 12px;
    padding: 0 2px;
}

.remove-btn {
    width: 36px;
    height: 36px;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
}

.remove-btn:hover {
    background: var(--error-color-dark);
    transform: scale(1.05);
}

.remove-btn.compact {
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

.remove-btn.compact:hover {
    background: var(--error-color-dark);
    transform: scale(1.1);
}

.body-type-select {
    padding: 6px 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 12px;
}

.json-textarea,
.text-textarea,
.xml-textarea,
.raw-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 13px;
    font-family: 'Consolas', 'Monaco', monospace;
    resize: vertical;
    min-height: 120px;
}

.json-actions,
.xml-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.format-btn,
.minify-btn {
    padding: 6px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 12px;
    cursor: pointer;
    transition: var(--transition);
}

.format-btn:hover,
.minify-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.form-mode-toggle {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    background: var(--bg-tertiary);
    padding: 4px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
}

.mode-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.mode-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.mode-btn.active {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.bulk-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-tertiary);
    color: var(--text-primary);
    font-size: 13px;
    font-family: 'Consolas', 'Monaco', monospace;
    resize: vertical;
    min-height: 120px;
}

.bulk-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.bulk-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

.clear-btn {
    padding: 6px 12px;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 12px;
    cursor: pointer;
    transition: var(--transition);
}

.clear-btn:hover {
    background: var(--error-color-dark);
}

/* 表单容器样式 - 单个大卡片 */
.form-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 16px;
}

.form-container .add-btn {
    margin-top: 16px;
}

.form-list-compact {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-key-compact,
.form-value-compact {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 13px;
    transition: var(--transition);
}

.form-key-compact:focus,
.form-value-compact:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
}

.remove-btn-compact {
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

.remove-btn-compact:hover {
    background: var(--error-color-dark);
    transform: scale(1.1);
}

/* 请求头容器样式 - 单个大卡片 */
.headers-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 16px;
}

.headers-container .add-btn {
    margin-top: 16px;
}

.headers-list-compact {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.header-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-key-compact,
.header-value-compact {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 13px;
    transition: var(--transition);
}

.header-key-compact:focus,
.header-value-compact:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
}

/* 查询参数容器样式 - 单个大卡片 */
.params-container {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 16px;
}

.params-container .add-btn {
    margin-top: 16px;
}

.params-list-compact {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.param-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.param-key-compact,
.param-value-compact {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 13px;
    transition: var(--transition);
}

.param-key-compact:focus,
.param-value-compact:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha);
}

.file-upload {
    position: relative;
    display: inline-block;
    width: 100%;
}

.file-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.file-label {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--bg-tertiary);
    border: 2px dashed var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 14px;
    min-height: 60px;
    justify-content: center;
}

.file-label:hover {
    border-color: var(--primary-color);
    background: var(--primary-color-alpha);
    color: var(--primary-color);
}

.file-info {
    margin-top: 12px;
    padding: 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.file-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.file-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
}

.file-size,
.file-type {
    font-size: 12px;
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
}

.response-section {
    overflow: hidden;
}

.response-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.response-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    position: relative;
}

.copy-response-btn-floating {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    opacity: 0;
    transform: translateY(-4px);
    z-index: 10;
    backdrop-filter: blur(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.response-body:hover .copy-response-btn-floating {
    opacity: 1;
    transform: translateY(0);
}

.copy-response-btn-floating:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--primary-color-alpha);
}

.response-tab-header {
    display: flex;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
}

.tab-btn {
    padding: 12px 20px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 13px;
    cursor: pointer;
    transition: var(--transition);
    border-bottom: 2px solid transparent;
}

.tab-btn.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
}

.tab-btn:hover {
    color: var(--text-primary);
}

.response-body,
.response-headers-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}

.error-message {
    background: var(--error-color-alpha);
    border: 1px solid var(--error-color);
    border-radius: var(--radius-md);
    padding: 16px;
}

.error-title {
    font-weight: 600;
    color: var(--error-color);
    margin-bottom: 8px;
}

.error-detail {
    color: var(--error-color);
    font-size: 14px;
    white-space: pre-line;
}

.response-pre {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 16px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-break: break-all;
    margin: 0;
    overflow-x: auto;
}

.header-row {
    display: flex;
    margin-bottom: 8px;
    font-size: 13px;
}

.header-name {
    font-weight: 600;
    color: var(--text-primary);
    min-width: 150px;
    margin-right: 12px;
}

.header-value {
    color: var(--text-secondary);
    word-break: break-all;
}

.empty-response {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    padding: 40px;
}

.empty-icon {
    margin-bottom: 16px;
    opacity: 0.5;
}

.empty-text {
    font-size: 14px;
    margin-bottom: 8px;
}

.empty-hint {
    font-size: 12px;
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

    .header-item,
    .param-item,
    .form-item {
        flex-direction: column;
        align-items: stretch;
    }

    .remove-btn {
        align-self: flex-end;
        width: 100%;
        margin-top: 4px;
    }

    .example-list {
        flex-direction: column;
    }

    .example-btn {
        width: 100%;
    }
}

/* 消息提示样式 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message-toast.success {
    background: var(--success-color);
}

.message-toast.error {
    background: var(--error-color);
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
</style>