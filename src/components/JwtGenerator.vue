<template>
    <div class="jwt-generator">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">JWT 生成器</h2>
        </div>

        <div class="converter-content">
            <!-- 模式选择 -->
            <div class="mode-section">
                <div class="mode-selector">
                    <button :class="['mode-btn', { active: mode === 'generate' }]" @click="setMode('generate')">
                        生成 JWT
                    </button>
                    <button :class="['mode-btn', { active: mode === 'decode' }]" @click="setMode('decode')">
                        解析 JWT
                    </button>
                </div>
            </div>

            <!-- 生成模式 -->
            <div v-if="mode === 'generate'" class="generate-section">
                <!-- Header 配置 -->
                <div class="config-section">
                    <h3 class="section-title">Header 配置</h3>
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
                            <input v-model="header.typ" class="config-input" placeholder="JWT" />
                        </div>
                    </div>
                </div>

                <!-- Payload 配置 -->
                <div class="config-section">
                    <h3 class="section-title">Payload 配置</h3>
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
                    <h3 class="section-title">密钥配置</h3>
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
                                <path d="M8 16H3v5" />
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
                    <h3 class="section-title">生成结果</h3>
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
                    <h3 class="section-title">JWT Token 输入</h3>
                    <div class="jwt-input-wrapper">
                        <textarea v-model="inputJWT" class="jwt-input" placeholder="请粘贴 JWT Token..." rows="4"
                            @input="decodeJWT">
                        </textarea>
                        <button v-if="inputJWT" class="clear-btn" @click="clearInput" title="清空">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- 解析结果 -->
                <div v-if="decodedJWT" class="decode-result-section">
                    <h3 class="section-title">解析结果</h3>

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

        <!-- 消息提示 -->
        <div v-if="message" :class="['message', messageType]">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'

defineEmits<{
    back: []
}>()

// 模式
const mode = ref<'generate' | 'decode'>('generate')

// 生成模式数据
const header = ref({
    alg: 'HS256',
    typ: 'JWT'
})

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

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

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
    showMessage('已生成随机密钥', 'success')
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
                showMessage('自定义载荷 JSON 格式错误', 'error')
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

        showMessage('JWT 生成成功', 'success')
    } catch (error) {
        showMessage('JWT 生成失败: ' + (error as Error).message, 'error')
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
    await copyText(generatedJWT.value)
}

// 复制文本
const copyText = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        showMessage('已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 清空输入
const clearInput = () => {
    inputJWT.value = ''
    decodedJWT.value = null
    decodeError.value = ''
}

// 显示消息
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
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

// 页面标题管理
onMounted(() => {
    setPageTitle('jwt-generator')
})

onUnmounted(() => {
    restoreDefaultTitle()
})
</script>

<style scoped>
.jwt-generator {
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
}

/* 模式选择 */
.mode-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mode-selector {
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem;
    background: #f1f5f9;
    border-radius: 0.75rem;
}

.mode-btn {
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

.mode-btn:hover {
    color: #475569;
    background: rgba(255, 255, 255, 0.5);
}

.mode-btn.active {
    background: white;
    color: #3b82f6;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 配置区域 */
.config-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: #1e293b;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f1f5f9;
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
    color: #374151;
}

.config-input,
.config-select {
    padding: 0.875rem 1rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    color: #1f2937;
    font-size: 0.875rem;
    transition: all 0.2s;
}

.config-input:focus,
.config-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.custom-payload {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

.custom-payload label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
}

.payload-textarea {
    width: 100%;
    padding: 1rem;
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    color: #1f2937;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
    resize: vertical;
    transition: all 0.2s;
    box-sizing: border-box;
    line-height: 1.5;
}

.payload-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: white;
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
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    color: #1f2937;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
    transition: all 0.2s;
}

.secret-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.toggle-secret-btn,
.generate-secret-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    padding: 0;
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
}

.toggle-secret-btn:hover,
.generate-secret-btn:hover {
    background: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;
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
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    border-radius: 1rem;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.generate-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.generate-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

/* JWT 结果 */
.result-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-top: 1.5rem;
}

.jwt-parts {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2.5rem;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 1rem;
    overflow-x: auto;
    border: 1px solid #e2e8f0;
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
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.part-content {
    padding: 0.75rem 1rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    color: #374151;
    word-break: break-all;
    text-align: center;
    max-width: 140px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-part .part-content {
    border-color: #ef4444;
    background: #fef2f2;
    color: #dc2626;
}

.payload-part .part-content {
    border-color: #8b5cf6;
    background: #f5f3ff;
    color: #7c3aed;
}

.signature-part .part-content {
    border-color: #06b6d4;
    background: #ecfeff;
    color: #0891b2;
}

.jwt-separator {
    font-size: 1.75rem;
    font-weight: bold;
    color: #9ca3af;
    margin: 0 0.5rem;
}

.jwt-full {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

.jwt-full label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
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
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    color: #1f2937;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
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
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.copy-btn:hover {
    background: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;
}

/* 解析区域 */
.input-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
}

.jwt-input-wrapper {
    position: relative;
    margin-top: 0.5rem;
}

.jwt-input {
    width: 100%;
    padding: 1.25rem;
    padding-right: 3.5rem;
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    color: #1f2937;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
    resize: vertical;
    transition: all 0.2s;
    box-sizing: border-box;
    line-height: 1.5;
}

.jwt-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: white;
}

.clear-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.clear-btn:hover {
    background: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;
}

/* 解析结果 */
.decode-result-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.decode-result-card {
    margin-bottom: 2rem;
    border: 2px solid #e5e7eb;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.75rem;
    background: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
}

.card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
}

.json-content {
    padding: 1.75rem;
    margin: 0;
    background: white;
    color: #1f2937;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    overflow-x: auto;
}

.token-info {
    margin-top: 2.5rem;
    padding: 2rem;
    background: #f8fafc;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
}

.token-info h4 {
    margin: 0 0 1.5rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e2e8f0;
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
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.info-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
}

.info-value {
    font-size: 0.875rem;
    color: #1f2937;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    text-align: right;
    max-width: 150px;
    word-break: break-all;
}

.info-value.expired {
    color: #ef4444;
    font-weight: 600;
}

/* 错误信息 */
.error-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 0.75rem;
    color: #dc2626;
    font-size: 0.875rem;
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
    z-index: 9998;
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

    .config-section,
    .input-section,
    .result-section,
    .decode-result-section {
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
}
</style>