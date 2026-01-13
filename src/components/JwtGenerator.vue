<template>
    <div class="jwt-generator">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <div class="mode-toggle">
                    <button class="mode-btn" :class="{ active: mode === 'generate' }" @click="setMode('generate')">
                        生成 JWT
                    </button>
                    <button class="mode-btn" :class="{ active: mode === 'decode' }" @click="setMode('decode')">
                        解析 JWT
                    </button>
                </div>
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="converter-content">

            <!-- 生成模式 -->
            <div v-if="mode === 'generate'" class="generate-section">
                <!-- Header 配置 -->
                <div class="config-section">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>📋 Header 配置</h3>
                            <span class="section-subtitle">设置 JWT 头部信息</span>
                        </div>
                    </div>
                    <div class="config-grid">
                        <div class="config-item">
                            <label>算法 (alg)</label>
                            <select v-model="header.alg" class="config-select">
                                <option value="HS256">HS256</option>
                                <option value="HS384">HS384</option>
                                <option value="HS512">HS512</option>
                                <option value="RS256">RS256</option>
                                <option value="RS384">RS384</option>
                                <option value="RS512">RS512</option>
                            </select>
                        </div>
                        <div class="config-item">
                            <label>类型 (typ)</label>
                            <select v-model="header.typ" class="config-select">
                                <option value="JWT">JWT</option>
                                <option value="JWS">JWS</option>
                                <option value="JWE">JWE</option>
                                <option value="custom">自定义...</option>
                            </select>
                            <input v-if="header.typ === 'custom'" v-model="customTyp" class="config-input"
                                placeholder="请输入自定义类型" />
                        </div>
                    </div>
                </div>

                <!-- Payload 配置 -->
                <div class="config-section">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>📦 Payload 配置</h3>
                            <span class="section-subtitle">设置 JWT 载荷信息</span>
                        </div>
                    </div>
                    <div class="config-grid">
                        <div class="config-item">
                            <label>发行者 (iss)</label>
                            <input v-model="payload.iss" class="config-input" placeholder="签发者" />
                        </div>
                        <div class="config-item">
                            <label>主题 (sub)</label>
                            <input v-model="payload.sub" class="config-input" placeholder="主题" />
                        </div>
                        <div class="config-item">
                            <label>受众 (aud)</label>
                            <input v-model="payload.aud" class="config-input" placeholder="受众" />
                        </div>
                        <div class="config-item">
                            <label>过期时间 (exp)</label>
                            <input v-model="expireTime" type="datetime-local" class="config-input" />
                        </div>
                        <div class="config-item">
                            <label>生效时间 (nbf)</label>
                            <input v-model="notBeforeTime" type="datetime-local" class="config-input" />
                        </div>
                        <div class="config-item">
                            <label>签发时间 (iat)</label>
                            <input v-model="issuedAtTime" type="datetime-local" class="config-input" />
                        </div>
                    </div>

                    <!-- 自定义载荷 -->
                    <div class="custom-payload">
                        <label>自定义载荷 (JSON格式)</label>
                        <textarea v-model="customPayload" class="payload-textarea"
                            placeholder='{"userId": 123, "role": "admin", "permissions": ["read", "write"]}' rows="6">
                </textarea>
                    </div>
                </div>

                <!-- 密钥配置 -->
                <div class="config-section">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>🔐 密钥配置</h3>
                            <span class="section-subtitle">设置签名密钥</span>
                        </div>
                    </div>
                    <div class="secret-input-wrapper">
                        <input v-model="secret" :type="showSecret ? 'text' : 'password'" class="secret-input"
                            placeholder="请输入密钥" />
                        <button class="toggle-secret-btn" @click="showSecret = !showSecret" title="显示/隐藏密钥">
                            <svg v-if="showSecret" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                        <button class="generate-secret-btn" @click="generateRandomSecret" title="生成随机密钥">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                <path d="M3 21v-5h5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- 生成按钮 -->
                <div class="generate-actions">
                    <button class="generate-btn" @click="generateJWT" :disabled="!secret">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        生成 JWT Token
                    </button>
                </div>

                <!-- 生成结果 -->
                <div v-if="generatedJWT" class="result-section">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>✅ 生成结果</h3>
                            <span class="section-subtitle">JWT Token 已生成</span>
                        </div>
                        <HeaderActionButton icon="copy" tooltip="复制完整Token" @click="copyJWT" />
                    </div>
                    <div class="jwt-result">
                        <div class="jwt-parts">
                            <div class="jwt-part header-part">
                                <div class="part-label">Header</div>
                                <div class="part-content">{{ jwtParts.header }}</div>
                            </div>
                            <div class="jwt-separator">.</div>
                            <div class="jwt-part payload-part">
                                <div class="part-label">Payload</div>
                                <div class="part-content">{{ jwtParts.payload }}</div>
                            </div>
                            <div class="jwt-separator">.</div>
                            <div class="jwt-part signature-part">
                                <div class="part-label">Signature</div>
                                <div class="part-content">{{ jwtParts.signature }}</div>
                            </div>
                        </div>

                        <div class="jwt-full">
                            <label>完整 JWT Token</label>
                            <div class="jwt-output">
                                <textarea :value="generatedJWT" readonly class="jwt-textarea"></textarea>
                                <button class="copy-btn" @click="copyJWT" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 解析模式 -->
            <div v-if="mode === 'decode'" class="decode-section">
                <div class="input-section">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>📥 JWT Token 输入</h3>
                            <span class="section-subtitle">粘贴要解析的 JWT Token</span>
                        </div>
                        <HeaderActionButton v-if="inputJWT" icon="clear" tooltip="清空输入" @click="clearInput" />
                    </div>
                    <div class="jwt-input-wrapper">
                        <textarea v-model="inputJWT" class="jwt-input" placeholder="请粘贴 JWT Token..." rows="4"
                            @input="decodeJWT">
                </textarea>
                    </div>
                </div>

                <!-- 解析结果 -->
                <div v-if="decodedJWT" class="decode-result-section">
                    <div class="section-header">
                        <div class="section-title">
                            <h3>📊 解析结果</h3>
                            <span class="section-subtitle">JWT Token 解析详情</span>
                        </div>
                    </div>

                    <!-- Header -->
                    <div class="decode-result-card">
                        <div class="card-header">
                            <span class="card-title">Header</span>
                            <button class="copy-btn" @click="copyText(JSON.stringify(decodedJWT.header, null, 2))"
                                title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <pre class="json-content">{{ JSON.stringify(decodedJWT.header, null, 2) }}</pre>
                    </div>

                    <!-- Payload -->
                    <div class="decode-result-card">
                        <div class="card-header">
                            <span class="card-title">Payload</span>
                            <button class="copy-btn" @click="copyText(JSON.stringify(decodedJWT.payload, null, 2))"
                                title="复制">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                        </div>
                        <pre class="json-content">{{ JSON.stringify(decodedJWT.payload, null, 2) }}</pre>
                    </div>

                    <!-- Token 信息 -->
                    <div class="token-info">
                        <h4>Token 信息</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">算法:</span>
                                <span class="info-value">{{ decodedJWT.header.alg || 'N/A' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">类型:</span>
                                <span class="info-value">{{ decodedJWT.header.typ || 'N/A' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">发行者:</span>
                                <span class="info-value">{{ decodedJWT.payload.iss || 'N/A' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">主题:</span>
                                <span class="info-value">{{ decodedJWT.payload.sub || 'N/A' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">受众:</span>
                                <span class="info-value">{{ decodedJWT.payload.aud || 'N/A' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">过期时间:</span>
                                <span class="info-value" :class="{ expired: isExpired }">
                                    {{ formatTimestamp(decodedJWT.payload.exp) }}
                                </span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">生效时间:</span>
                                <span class="info-value">{{ formatTimestamp(decodedJWT.payload.nbf) }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">签发时间:</span>
                                <span class="info-value">{{ formatTimestamp(decodedJWT.payload.iat) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 错误信息 -->
                <div v-if="decodeError" class="error-section">
                    <div class="error-message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        {{ decodeError }}
                    </div>
                </div>
            </div>
        </div>

        <!-- 通知容器 -->
        <NotificationContainer />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import NotificationContainer from './common/NotificationContainer.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import { useClipboard } from '../composables/useClipboard'

defineEmits<{
    back: []
}>()

// 使用 composables
usePageTitle('jwt-generator')
const { success, error: showError } = useNotification()
const { copyToClipboard } = useClipboard()

// 获取页面标题
const pageTitle = 'JWT 生成器'

// 模式
const mode = ref<'generate' | 'decode'>('generate')

// 生成模式数据
const header = ref({
    alg: 'HS256',
    typ: 'JWT'
})

const customTyp = ref('')

const payload = ref({
    iss: '',
    sub: '',
    aud: '',
    exp: null as number | null,
    nbf: null as number | null,
    iat: null as number | null
})

const customPayload = ref('')
const secret = ref('')
const showSecret = ref(false)
const generatedJWT = ref('')

// 时间输入
const expireTime = ref('')
const notBeforeTime = ref('')
const issuedAtTime = ref('')

// 解析模式数据
const inputJWT = ref('')
const decodedJWT = ref<any>(null)
const decodeError = ref('')

// JWT 部分
const jwtParts = computed(() => {
    if (!generatedJWT.value) return { header: '', payload: '', signature: '' }
    const parts = generatedJWT.value.split('.')
    return {
        header: parts[0] || '',
        payload: parts[1] || '',
        signature: parts[2] || ''
    }
})

// 是否过期
const isExpired = computed(() => {
    if (!decodedJWT.value?.payload?.exp) return false
    return Date.now() / 1000 > decodedJWT.value.payload.exp
})

// Base64 URL 编码
const base64UrlEncode = (str: string): string => {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
}

// Base64 URL 解码
const base64UrlDecode = (str: string): string => {
    str += '='.repeat((4 - str.length % 4) % 4)
    return atob(str.replace(/-/g, '+').replace(/_/g, '/'))
}

// 简单的 HMAC-SHA256 实现（仅用于演示）
const hmacSha256 = async (message: string, secret: string): Promise<string> => {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(message)

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const signatureArray = new Uint8Array(signature)
    const signatureString = String.fromCharCode(...signatureArray)

    return base64UrlEncode(signatureString)
}

// 设置模式
const setMode = (newMode: 'generate' | 'decode') => {
    mode.value = newMode
    generatedJWT.value = ''
    decodedJWT.value = null
    decodeError.value = ''
}

// 生成随机密钥
const generateRandomSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    secret.value = result
    success('已生成随机密钥')
}

// 生成 JWT
const generateJWT = async () => {
    try {
        // 构建 payload
        const finalPayload: any = { ...payload.value }

        // 处理时间字段
        if (expireTime.value) {
            finalPayload.exp = Math.floor(new Date(expireTime.value).getTime() / 1000)
        }
        if (notBeforeTime.value) {
            finalPayload.nbf = Math.floor(new Date(notBeforeTime.value).getTime() / 1000)
        }
        if (issuedAtTime.value) {
            finalPayload.iat = Math.floor(new Date(issuedAtTime.value).getTime() / 1000)
        }

        // 合并自定义载荷
        if (customPayload.value.trim()) {
            try {
                const custom = JSON.parse(customPayload.value)
                Object.assign(finalPayload, custom)
            } catch (error) {
                showError('自定义载荷 JSON 格式错误')
                return
            }
        }

        // 清理空值
        Object.keys(finalPayload).forEach(key => {
            if (finalPayload[key] === '' || finalPayload[key] === null) {
                delete finalPayload[key]
            }
        })

        // 编码 header 和 payload
        const encodedHeader = base64UrlEncode(JSON.stringify(header.value))
        const encodedPayload = base64UrlEncode(JSON.stringify(finalPayload))

        // 生成签名
        const data = `${encodedHeader}.${encodedPayload}`
        const signature = await hmacSha256(data, secret.value)

        // 生成完整 JWT
        generatedJWT.value = `${data}.${signature}`

        success('JWT 生成成功')
    } catch (err) {
        showError('JWT 生成失败: ' + (err as Error).message)
    }
}

// 解析 JWT
const decodeJWT = () => {
    if (!inputJWT.value.trim()) {
        decodedJWT.value = null
        decodeError.value = ''
        return
    }

    try {
        const parts = inputJWT.value.trim().split('.')
        if (parts.length !== 3) {
            throw new Error('JWT 格式错误，应该包含三个部分')
        }

        const header = JSON.parse(base64UrlDecode(parts[0] || ''))
        const payload = JSON.parse(base64UrlDecode(parts[1] || ''))

        decodedJWT.value = { header, payload, signature: parts[2] }
        decodeError.value = ''
    } catch (error) {
        decodedJWT.value = null
        decodeError.value = '解析失败: ' + (error as Error).message
    }
}

// 格式化时间戳
const formatTimestamp = (timestamp: number | undefined): string => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp * 1000).toLocaleString('zh-CN')
}

// 复制 JWT
const copyJWT = async () => {
    const result = await copyToClipboard(generatedJWT.value)
    if (result) {
        success('JWT Token 已复制到剪贴板')
    } else {
        showError('复制失败，请手动复制')
    }
}

// 复制文本
const copyText = async (text: string) => {
    const result = await copyToClipboard(text)
    if (result) {
        success('已复制到剪贴板')
    } else {
        showError('复制失败，请手动复制')
    }
}

// 清空输入
const clearInput = () => {
    inputJWT.value = ''
    decodedJWT.value = null
    decodeError.value = ''
}

// 清空所有
const clearAll = () => {
    // 重置生成模式数据
    header.value = {
        alg: 'HS256',
        typ: 'JWT'
    }
    customTyp.value = ''
    payload.value = {
        iss: '',
        sub: '',
        aud: '',
        exp: null,
        nbf: null,
        iat: null
    }
    customPayload.value = ''
    secret.value = ''
    generatedJWT.value = ''
    expireTime.value = ''
    notBeforeTime.value = ''
    issuedAtTime.value = ''

    // 重置解析模式数据
    inputJWT.value = ''
    decodedJWT.value = null
    decodeError.value = ''

    // 初始化当前时间
    initCurrentTime()
    success('已清空所有数据')
}

// 监听时间输入变化
watch([expireTime, notBeforeTime, issuedAtTime], () => {
    if (expireTime.value) {
        payload.value.exp = Math.floor(new Date(expireTime.value).getTime() / 1000)
    }
    if (notBeforeTime.value) {
        payload.value.nbf = Math.floor(new Date(notBeforeTime.value).getTime() / 1000)
    }
    if (issuedAtTime.value) {
        payload.value.iat = Math.floor(new Date(issuedAtTime.value).getTime() / 1000)
    }
})

// 监听自定义类型变化
watch(customTyp, (newValue) => {
    if (header.value.typ === 'custom' && newValue) {
        header.value.typ = newValue
    }
})

// 监听类型选择变化
watch(() => header.value.typ, (newValue) => {
    if (newValue !== 'custom' && newValue !== customTyp.value) {
        customTyp.value = ''
    }
})

// 初始化当前时间
const initCurrentTime = () => {
    const now = new Date()
    const currentTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
    issuedAtTime.value = currentTime

    // 默认1小时后过期
    const expireDate = new Date(now.getTime() + 60 * 60 * 1000 - now.getTimezoneOffset() * 60000)
    expireTime.value = expireDate.toISOString().slice(0, 16)
}

// 初始化
initCurrentTime()
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

.jwt-generator {
    width: 100%;
    height: 100dvh;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.converter-content {
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

/* 通用区域样式 */
.mode-section,
.config-section,
.input-section,
.result-section,
.decode-result-section,
.error-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
    margin-bottom: 1.5rem;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-title h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.section-subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
}

/* 生成和解析模式 */
.generate-section,
.decode-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.config-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1rem;
}

.config-item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.config-item label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.config-input,
.config-select {
    padding: 0.875rem 1rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.2s;
}

.config-input:focus,
.config-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.custom-payload {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
}

.custom-payload label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
}

.payload-textarea {
    width: 100%;
    padding: 1rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    resize: vertical;
    transition: all 0.2s;
    box-sizing: border-box;
    line-height: 1.5;
}

.payload-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

/* 密钥输入 */
.secret-input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

.secret-input {
    flex: 1;
    padding: 0.875rem 1rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    transition: all 0.2s;
}

.secret-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.toggle-secret-btn,
.generate-secret-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    padding: 0;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
}

.toggle-secret-btn:hover,
.generate-secret-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--primary-color);
}

/* 生成按钮 */
.generate-actions {
    display: flex;
    justify-content: center;
    margin: 2.5rem 0;
    padding: 1.5rem 0;
}

.generate-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 2.5rem;
    background: var(--primary-color);
    border: none;
    border-radius: 1rem;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px var(--primary-color-alpha);
}

.generate-btn:hover:not(:disabled) {
    background: var(--primary-color-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px var(--primary-color-alpha);
}

.generate-btn:disabled {
    background: var(--text-disabled);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* JWT 结果 */
.jwt-parts {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2.5rem;
    padding: 1.5rem;
    background: var(--bg-tertiary);
    border-radius: 1rem;
    overflow-x: auto;
    border: 1px solid var(--border-color);
}

.jwt-part {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    min-width: 140px;
}

.part-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.part-content {
    padding: 0.75rem 1rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 0.5rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.75rem;
    color: var(--text-primary);
    word-break: break-all;
    text-align: center;
    max-width: 140px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-part .part-content {
    border-color: var(--error-color);
    background: var(--error-color-alpha);
    color: var(--error-color);
}

.payload-part .part-content {
    border-color: var(--warning-color);
    background: var(--warning-color-alpha);
    color: var(--warning-color);
}

.signature-part .part-content {
    border-color: var(--success-color);
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.jwt-separator {
    font-size: 1.75rem;
    font-weight: bold;
    color: var(--text-secondary);
    margin: 0 0.5rem;
}

.jwt-full {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
}

.jwt-full label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
}

.jwt-output {
    position: relative;
}

.jwt-textarea {
    width: 100%;
    height: 140px;
    padding: 1.25rem;
    padding-right: 3.5rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    resize: vertical;
    box-sizing: border-box;
    line-height: 1.5;
}

.copy-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.copy-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
    border-color: var(--primary-color);
}

/* 解析区域 */
.jwt-input-wrapper {
    position: relative;
    margin-top: 0.5rem;
}

.jwt-input {
    width: 100%;
    padding: 1.25rem;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    resize: vertical;
    transition: all 0.2s;
    box-sizing: border-box;
    line-height: 1.5;
}

.jwt-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

/* 解析结果 */
.decode-result-card {
    margin-bottom: 1.5rem;
    border: 2px solid var(--border-color);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.decode-result-card:last-child {
    margin-bottom: 0;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.75rem;
    background: var(--bg-tertiary);
    border-bottom: 2px solid var(--border-color);
}

.card-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.json-content {
    padding: 1.75rem;
    margin: 0;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    overflow-x: auto;
}

.token-info {
    margin-top: 2.5rem;
    padding: 2rem;
    background: var(--bg-tertiary);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
}

.token-info h4 {
    margin: 0 0 1.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--border-color);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background: var(--bg-primary);
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.info-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
}

.info-value {
    font-size: 0.875rem;
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    text-align: right;
    max-width: 150px;
    word-break: break-all;
}

.info-value.expired {
    color: var(--error-color);
    font-weight: 600;
}

/* 错误信息 */
.error-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: var(--error-color-alpha);
    border: 1px solid var(--error-color);
    border-radius: 0.75rem;
    color: var(--error-color);
    font-size: 0.875rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }

    .mode-section,
    .config-section,
    .input-section,
    .result-section,
    .decode-result-section,
    .error-section {
        padding: 1.5rem;
    }

    .config-grid {
        grid-template-columns: 1fr;
    }

    .jwt-parts {
        flex-direction: column;
        align-items: stretch;
    }

    .jwt-part {
        min-width: auto;
    }

    .part-content {
        max-width: none;
    }

    .jwt-separator {
        align-self: center;
        transform: rotate(90deg);
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .secret-input-wrapper {
        flex-direction: column;
        align-items: stretch;
    }

    .toggle-secret-btn,
    .generate-secret-btn {
        width: 100%;
        height: 2.5rem;
    }
}
</style>