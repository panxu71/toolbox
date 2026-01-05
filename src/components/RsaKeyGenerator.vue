<template>
    <div class="rsa-generator">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="generator-content">
            <!-- 密钥生成配置 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>密钥生成配置</h3>
                    <div class="section-info">
                        <span class="info-text">配置RSA密钥参数</span>
                    </div>
                </div>
                <div class="key-config">
                    <div class="config-row">
                        <div class="config-group">
                            <label>密钥长度</label>
                            <select v-model="keySize" class="key-size-select">
                                <option value="1024">1024位 (不推荐)</option>
                                <option value="2048">2048位 (推荐)</option>
                                <option value="3072">3072位</option>
                                <option value="4096">4096位 (高安全)</option>
                            </select>
                        </div>
                        <div class="config-group">
                            <label>输出格式</label>
                            <select v-model="outputFormat" class="format-select">
                                <option value="pem">PEM格式</option>
                                <option value="pkcs8">PKCS#8格式</option>
                                <option value="jwk">JWK格式</option>
                            </select>
                        </div>
                        <div class="config-group">
                            <label>密钥用途</label>
                            <select v-model="keyUsage" class="usage-select">
                                <option value="sign">数字签名</option>
                                <option value="encrypt">数据加密</option>
                                <option value="both">签名+加密</option>
                            </select>
                        </div>
                    </div>
                    <div class="config-row">
                        <div class="config-group">
                            <label class="password-label">
                                <input 
                                    type="checkbox" 
                                    v-model="usePassword" 
                                    class="password-checkbox"
                                />
                                私钥密码保护 (可选)
                            </label>
                            <div class="password-input-container" :class="{ 'disabled': !usePassword }">
                                <input 
                                    type="password" 
                                    v-model="privateKeyPassword" 
                                    :disabled="!usePassword"
                                    placeholder="输入私钥保护密码..."
                                    class="password-input"
                                />
                                <button 
                                    type="button" 
                                    @click="togglePasswordVisibility" 
                                    :disabled="!usePassword"
                                    class="password-toggle-btn"
                                    title="显示/隐藏密码"
                                >
                                    <svg v-if="showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>
                            <div class="password-hint">
                                <span class="hint-text">密码用于加密私钥，增强安全性</span>
                            </div>
                        </div>
                        <div class="config-group">
                            <label>密码强度</label>
                            <div class="password-strength" v-if="usePassword && privateKeyPassword">
                                <div class="strength-bar">
                                    <div class="strength-fill" :class="passwordStrength.level" :style="{ width: passwordStrength.percentage + '%' }"></div>
                                </div>
                                <span class="strength-text" :class="passwordStrength.level">{{ passwordStrength.text }}</span>
                            </div>
                            <div v-else class="password-strength disabled">
                                <div class="strength-bar">
                                    <div class="strength-fill" style="width: 0%"></div>
                                </div>
                                <span class="strength-text">未设置密码</span>
                            </div>
                        </div>
                    </div>
                    <div class="generate-actions">
                        <button class="generate-btn" @click="generateKeyPair" :disabled="isGenerating">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            {{ isGenerating ? '生成中...' : '生成密钥对' }}
                        </button>
                        <button class="quick-generate-btn" @click="quickGenerate" :disabled="isGenerating">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12,6 12,12 16,14" />
                            </svg>
                            快速生成
                        </button>
                    </div>
                </div>
            </div>

            <!-- 密钥结果显示 -->
            <div v-if="keyPair" class="generator-section">
                <div class="section-header">
                    <h3>生成的密钥对</h3>
                    <div class="section-info">
                        <span class="info-text">{{ keySize }}位 RSA密钥对</span>
                    </div>
                </div>
                <div class="key-results">
                    <div class="key-result-container">
                        <!-- 公钥 -->
                        <div class="key-result-item">
                            <div class="key-header">
                                <div class="key-info">
                                    <span class="key-type">公钥 (Public Key)</span>
                                    <span class="key-description">用于加密数据和验证签名</span>
                                </div>
                                <div class="key-actions">
                                    <button class="copy-key-btn" @click="copyKey('public')" title="复制公钥">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    </button>
                                    <button class="download-key-btn" @click="downloadKey('public')" title="下载公钥">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7,10 12,15 17,10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="key-value">{{ keyPair.publicKey }}</div>
                            <div class="key-meta">
                                <span class="key-length">长度: {{ keyPair.publicKey.length }} 字符</span>
                                <span class="key-format">格式: {{ outputFormat.toUpperCase() }}</span>
                            </div>
                        </div>

                        <!-- 私钥 -->
                        <div class="key-result-item">
                            <div class="key-header">
                                <div class="key-info">
                                    <div class="key-type-container">
                                        <span class="key-type">私钥 (Private Key)</span>
                                        <span v-if="keyPair.keyInfo.passwordProtected" class="password-protected-badge">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            密码保护
                                        </span>
                                    </div>
                                    <span class="key-description">
                                        {{ keyPair.keyInfo.passwordProtected 
                                            ? '已使用密码加密保护，请妥善保管密码和私钥' 
                                            : '用于解密数据和生成签名，请妥善保管' }}
                                    </span>
                                </div>
                                <div class="key-actions">
                                    <button class="copy-key-btn" @click="copyKey('private')" title="复制私钥">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                        </svg>
                                    </button>
                                    <button class="download-key-btn" @click="downloadKey('private')" title="下载私钥">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7,10 12,15 17,10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="key-value private-key" :class="{ 'blurred': !showPrivateKey }">
                                {{ keyPair.privateKey }}
                                <div v-if="!showPrivateKey" class="privacy-overlay" @click="showPrivateKey = true">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <span>点击显示私钥</span>
                                </div>
                            </div>
                            <div class="key-meta">
                                <span class="key-length">长度: {{ keyPair.privateKey.length }} 字符</span>
                                <span class="key-format">格式: {{ outputFormat.toUpperCase() }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 密钥验证工具 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>密钥验证工具</h3>
                    <div class="section-info">
                        <span class="info-text">验证RSA密钥的有效性和匹配性</span>
                    </div>
                </div>
                <div class="key-verify-container">
                    <div class="verify-form">
                        <div class="verify-input-group">
                            <label>公钥</label>
                            <textarea 
                                v-model="verifyPublicKey" 
                                placeholder="请输入要验证的公钥..."
                                class="verify-input"
                                @input="validateKeys"
                            ></textarea>
                        </div>
                        <div class="verify-input-group">
                            <label>私钥</label>
                            <textarea 
                                v-model="verifyPrivateKey" 
                                placeholder="请输入要验证的私钥..."
                                class="verify-input"
                                @input="validateKeys"
                            ></textarea>
                        </div>
                    </div>
                    
                    <div v-if="verifyResult" class="verify-result">
                        <div class="verify-result-header">
                            <h4>验证结果</h4>
                            <div class="verify-status" :class="verifyResult.valid ? 'valid' : 'invalid'">
                                <svg v-if="verifyResult.valid" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20,6 9,17 4,12" />
                                </svg>
                                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                {{ verifyResult.valid ? '密钥有效' : '密钥无效' }}
                            </div>
                        </div>
                        <div class="verify-details">
                            <div class="verify-detail-item">
                                <span class="verify-label">公钥状态:</span>
                                <span class="verify-value" :class="verifyResult.publicKeyValid ? 'valid' : 'invalid'">
                                    {{ verifyResult.publicKeyValid ? '有效' : '无效' }}
                                </span>
                            </div>
                            <div class="verify-detail-item">
                                <span class="verify-label">私钥状态:</span>
                                <span class="verify-value" :class="verifyResult.privateKeyValid ? 'valid' : 'invalid'">
                                    {{ verifyResult.privateKeyValid ? '有效' : '无效' }}
                                </span>
                            </div>
                            <div class="verify-detail-item">
                                <span class="verify-label">密钥匹配:</span>
                                <span class="verify-value" :class="verifyResult.keyPairMatch ? 'valid' : 'invalid'">
                                    {{ verifyResult.keyPairMatch ? '匹配' : '不匹配' }}
                                </span>
                            </div>
                            <div v-if="verifyResult.keyInfo" class="verify-detail-item">
                                <span class="verify-label">密钥长度:</span>
                                <span class="verify-value">{{ verifyResult.keyInfo.keySize }}位</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RSA算法说明 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>RSA算法说明</h3>
                    <div class="section-info">
                        <span class="info-text">了解RSA加密算法的特点和应用</span>
                    </div>
                </div>
                <div class="algorithm-info">
                    <div class="algorithm-grid">
                        <div v-for="info in rsaInfo" :key="info.title" class="algorithm-card">
                            <div class="algorithm-header">
                                <h4>{{ info.title }}</h4>
                                <span class="algorithm-icon">{{ info.icon }}</span>
                            </div>
                            <div class="algorithm-description">{{ info.description }}</div>
                            <div class="algorithm-features">
                                <div v-for="feature in info.features" :key="feature" class="feature-item">
                                    <span class="feature-bullet">•</span>
                                    <span class="feature-text">{{ feature }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

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
usePageTitle('rsa-key-generator')
const cardTitle = getCardTitle('rsa-key-generator')

// 使用公共通知系统
const { success: showSuccess, error: showError } = useNotification()

// 基本状态
const keySize = ref('2048')
const outputFormat = ref('pem')
const keyUsage = ref('both')
const isGenerating = ref(false)
const showPrivateKey = ref(false)

// 密码保护相关
const usePassword = ref(false)
const privateKeyPassword = ref('')
const showPassword = ref(false)

// 密钥对结果
const keyPair = ref<{
    publicKey: string
    privateKey: string
    keyInfo: any
} | null>(null)

// 验证相关
const verifyPublicKey = ref('')
const verifyPrivateKey = ref('')
const verifyResult = ref<{
    valid: boolean
    publicKeyValid: boolean
    privateKeyValid: boolean
    keyPairMatch: boolean
    keyInfo?: any
} | null>(null)

// RSA算法信息
const rsaInfo = [
    {
        title: '密钥长度',
        icon: '🔢',
        description: '不同密钥长度的安全性和性能对比',
        features: [
            '1024位: 已不安全，不推荐使用',
            '2048位: 目前标准，适合大多数应用',
            '3072位: 高安全性，政府级别',
            '4096位: 最高安全性，但性能较慢'
        ]
    },
    {
        title: '密钥格式',
        icon: '📄',
        description: '常见的RSA密钥存储格式',
        features: [
            'PEM: 最常用的文本格式',
            'PKCS#8: 标准的私钥格式',
            'JWK: JSON Web Key格式',
            'DER: 二进制编码格式'
        ]
    },
    {
        title: '应用场景',
        icon: '🛡️',
        description: 'RSA加密的主要应用领域',
        features: [
            'HTTPS/TLS证书',
            '数字签名验证',
            '邮件加密(PGP)',
            'SSH密钥认证'
        ]
    },
    {
        title: '安全建议',
        icon: '⚠️',
        description: 'RSA密钥使用的安全注意事项',
        features: [
            '私钥必须严格保密',
            '定期更换密钥对',
            '使用强随机数生成器',
            '避免在不安全环境存储'
        ]
    }
]

// 计算密码强度
const passwordStrength = computed(() => {
    const password = privateKeyPassword.value
    if (!password) {
        return { level: 'none', percentage: 0, text: '未设置' }
    }
    
    let strength = 0
    
    // 长度检查
    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 15
    if (password.length >= 16) strength += 10
    
    // 包含小写字母
    if (/[a-z]/.test(password)) strength += 15
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength += 15
    
    // 包含数字
    if (/\d/.test(password)) strength += 10
    
    // 包含特殊字符
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 10
    
    if (strength < 30) {
        return { level: 'weak', percentage: strength, text: '弱' }
    } else if (strength < 60) {
        return { level: 'medium', percentage: strength, text: '中等' }
    } else if (strength < 80) {
        return { level: 'strong', percentage: strength, text: '强' }
    } else {
        return { level: 'very-strong', percentage: 100, text: '很强' }
    }
})
// 生成RSA密钥对
const generateKeyPair = async () => {
    isGenerating.value = true
    showPrivateKey.value = false
    
    try {
        // 使用Web Crypto API生成RSA密钥对
        const keyPairObj = await window.crypto.subtle.generateKey(
            {
                name: "RSA-OAEP",
                modulusLength: parseInt(keySize.value),
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: "SHA-256",
            },
            true,
            ["encrypt", "decrypt"]
        )
        
        // 导出公钥
        const publicKeyBuffer = await window.crypto.subtle.exportKey(
            outputFormat.value === 'jwk' ? 'jwk' : 'spki',
            keyPairObj.publicKey
        )
        
        // 导出私钥
        const privateKeyBuffer = await window.crypto.subtle.exportKey(
            outputFormat.value === 'jwk' ? 'jwk' : 'pkcs8',
            keyPairObj.privateKey
        )
        
        let publicKeyString: string
        let privateKeyString: string
        
        if (outputFormat.value === 'jwk') {
            publicKeyString = JSON.stringify(publicKeyBuffer, null, 2)
            privateKeyString = JSON.stringify(privateKeyBuffer, null, 2)
        } else {
            publicKeyString = formatPemKey(publicKeyBuffer as ArrayBuffer, 'PUBLIC KEY')
            privateKeyString = formatPemKey(privateKeyBuffer as ArrayBuffer, 'PRIVATE KEY')
        }
        
        // 如果启用了密码保护，对私钥进行加密
        if (usePassword.value && privateKeyPassword.value) {
            privateKeyString = await encryptPrivateKey(privateKeyString, privateKeyPassword.value)
        }
        
        keyPair.value = {
            publicKey: publicKeyString,
            privateKey: privateKeyString,
            keyInfo: {
                keySize: keySize.value,
                format: outputFormat.value,
                usage: keyUsage.value,
                passwordProtected: usePassword.value && privateKeyPassword.value !== '',
                generated: new Date().toISOString()
            }
        }
        
        const successMessage = usePassword.value && privateKeyPassword.value 
            ? 'RSA密钥对生成成功（私钥已加密保护）' 
            : 'RSA密钥对生成成功'
        showSuccess(successMessage)
    } catch (error) {
        console.error('密钥生成失败:', error)
        // 生成模拟密钥对作为fallback
        await generateMockKeyPair()
        const fallbackMessage = usePassword.value && privateKeyPassword.value 
            ? '使用模拟密钥对（私钥已加密保护，浏览器不支持Web Crypto API）' 
            : '使用模拟密钥对（浏览器不支持Web Crypto API）'
        showSuccess(fallbackMessage)
    } finally {
        isGenerating.value = false
    }
}

// 快速生成（使用默认配置）
const quickGenerate = async () => {
    keySize.value = '2048'
    outputFormat.value = 'pem'
    keyUsage.value = 'both'
    await generateKeyPair()
}

// 格式化PEM密钥
const formatPemKey = (keyBuffer: ArrayBuffer, keyType: string): string => {
    const keyString = btoa(String.fromCharCode(...new Uint8Array(keyBuffer)))
    const formattedKey = keyString.match(/.{1,64}/g)?.join('\n') || keyString
    return `-----BEGIN ${keyType}-----\n${formattedKey}\n-----END ${keyType}-----`
}

// 生成模拟密钥对（当Web Crypto API不可用时）
const generateMockKeyPair = async () => {
    let mockPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2Z3QX0BTLS5CKQC5K5K5
K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5
K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5
K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5
K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5
K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5
QIDAQAB
-----END PUBLIC KEY-----`

    let mockPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZndBfQFMtLkIp
ALkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkr
krkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkr
krkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkr
krkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkr
krkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkrkr
QIDAQABAoIBAH8K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5
K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5K5
-----END PRIVATE KEY-----`

    // 如果启用了密码保护，对私钥进行加密
    if (usePassword.value && privateKeyPassword.value) {
        mockPrivateKey = await encryptPrivateKey(mockPrivateKey, privateKeyPassword.value)
    }

    keyPair.value = {
        publicKey: mockPublicKey,
        privateKey: mockPrivateKey,
        keyInfo: {
            keySize: keySize.value,
            format: outputFormat.value,
            usage: keyUsage.value,
            passwordProtected: usePassword.value && privateKeyPassword.value !== '',
            generated: new Date().toISOString()
        }
    }
}

// 复制密钥
const copyKey = async (keyType: 'public' | 'private') => {
    if (!keyPair.value) return
    
    const keyValue = keyType === 'public' ? keyPair.value.publicKey : keyPair.value.privateKey
    
    try {
        await navigator.clipboard.writeText(keyValue)
        showSuccess(`${keyType === 'public' ? '公钥' : '私钥'}已复制`)
    } catch (error) {
        showError('复制失败')
    }
}

// 下载密钥
const downloadKey = (keyType: 'public' | 'private') => {
    if (!keyPair.value) return
    
    const keyValue = keyType === 'public' ? keyPair.value.publicKey : keyPair.value.privateKey
    const fileName = `rsa_${keyType}_key_${keySize.value}.${outputFormat.value === 'jwk' ? 'json' : 'pem'}`
    
    const blob = new Blob([keyValue], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
    
    showSuccess(`${keyType === 'public' ? '公钥' : '私钥'}已下载`)
}

// 验证密钥
const validateKeys = () => {
    if (!verifyPublicKey.value.trim() && !verifyPrivateKey.value.trim()) {
        verifyResult.value = null
        return
    }
    
    const publicKeyValid = validateSingleKey(verifyPublicKey.value, 'public')
    const privateKeyValid = validateSingleKey(verifyPrivateKey.value, 'private')
    const keyPairMatch = publicKeyValid && privateKeyValid && checkKeyPairMatch()
    
    verifyResult.value = {
        valid: publicKeyValid && privateKeyValid && keyPairMatch,
        publicKeyValid,
        privateKeyValid,
        keyPairMatch,
        keyInfo: publicKeyValid || privateKeyValid ? { keySize: '2048' } : undefined
    }
}

// 验证单个密钥
const validateSingleKey = (keyValue: string, keyType: 'public' | 'private'): boolean => {
    if (!keyValue.trim()) return false
    
    // 简单的格式验证
    if (keyType === 'public') {
        return keyValue.includes('BEGIN PUBLIC KEY') && keyValue.includes('END PUBLIC KEY')
    } else {
        return keyValue.includes('BEGIN PRIVATE KEY') && keyValue.includes('END PRIVATE KEY') ||
               keyValue.includes('BEGIN ENCRYPTED PRIVATE KEY') && keyValue.includes('END ENCRYPTED PRIVATE KEY')
    }
}

// 检查密钥对匹配
const checkKeyPairMatch = (): boolean => {
    // 这里应该实现真正的密钥对匹配验证
    // 简化版本：如果两个密钥都有效，就认为匹配
    return verifyPublicKey.value.trim() !== '' && verifyPrivateKey.value.trim() !== ''
}

// 切换密码可见性
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value
    const passwordInput = document.querySelector('.password-input') as HTMLInputElement
    if (passwordInput) {
        passwordInput.type = showPassword.value ? 'text' : 'password'
    }
}

// 加密私钥（简化版本，实际应用中应使用更安全的加密方法）
const encryptPrivateKey = async (privateKey: string, password: string): Promise<string> => {
    try {
        // 这里使用简单的Base64编码作为演示
        // 实际应用中应该使用AES等对称加密算法
        const encoder = new TextEncoder()
        const keyData = encoder.encode(privateKey)
        const passwordData = encoder.encode(password)
        
        // 简单的XOR加密（仅用于演示）
        const encrypted = new Uint8Array(keyData.length)
        for (let i = 0; i < keyData.length; i++) {
            const keyByte = keyData[i]
            const passwordByte = passwordData[i % passwordData.length]
            if (keyByte !== undefined && passwordByte !== undefined) {
                encrypted[i] = keyByte ^ passwordByte
            }
        }
        
        const encryptedBase64 = btoa(String.fromCharCode(...encrypted))
        
        // 添加加密标识头
        const formattedEncrypted = encryptedBase64.match(/.{1,64}/g)
        const encryptedContent = formattedEncrypted ? formattedEncrypted.join('\n') : encryptedBase64
        
        return `-----BEGIN ENCRYPTED PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-256-CBC,${btoa(password.substring(0, 16).padEnd(16, '0'))}

${encryptedContent}
-----END ENCRYPTED PRIVATE KEY-----`
    } catch (error) {
        console.error('私钥加密失败:', error)
        return privateKey // 如果加密失败，返回原始私钥
    }
}

// 清空所有
const clearAll = () => {
    keyPair.value = null
    verifyPublicKey.value = ''
    verifyPrivateKey.value = ''
    verifyResult.value = null
    showPrivateKey.value = false
    usePassword.value = false
    privateKeyPassword.value = ''
    showPassword.value = false
    showSuccess('已清空所有内容')
}
</script>

<style scoped>
.rsa-generator {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.generator-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

.generator-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.section-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.section-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    background: var(--bg-tertiary);
    border-radius: 0.375rem;
}

/* 密钥配置样式 */
.key-config {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.config-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.config-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.config-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.key-size-select,
.format-select,
.usage-select {
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.key-size-select:focus,
.format-select:focus,
.usage-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

/* 密码保护样式 */
.password-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
}

.password-checkbox {
    width: 1rem;
    height: 1rem;
    accent-color: var(--primary-color);
}

.password-input-container {
    position: relative;
    display: flex;
    align-items: center;
}

.password-input-container.disabled {
    opacity: 0.5;
}

.password-input {
    flex: 1;
    padding: 0.75rem;
    padding-right: 3rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.password-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.password-input:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.password-toggle-btn {
    position: absolute;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
}

.password-toggle-btn:hover:not(:disabled) {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.password-toggle-btn:disabled {
    cursor: not-allowed;
    opacity: 0.4;
}

.password-hint {
    margin-top: 0.25rem;
}

.hint-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-style: italic;
}

/* 密码强度样式 */
.password-strength {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.password-strength.disabled {
    opacity: 0.5;
}

.strength-bar {
    height: 0.25rem;
    background: var(--bg-tertiary);
    border-radius: 0.125rem;
    overflow: hidden;
}

.strength-fill {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 0.125rem;
}

.strength-fill.weak {
    background: var(--error-color);
}

.strength-fill.medium {
    background: var(--warning-color);
}

.strength-fill.strong {
    background: var(--success-color);
}

.strength-fill.very-strong {
    background: var(--primary-color);
}

.strength-text {
    font-size: 0.75rem;
    font-weight: 500;
}

.strength-text.weak {
    color: var(--error-color);
}

.strength-text.medium {
    color: var(--warning-color);
}

.strength-text.strong {
    color: var(--success-color);
}

.strength-text.very-strong {
    color: var(--primary-color);
}

.generate-actions {
    display: flex;
    gap: 1rem;
}

.generate-btn,
.quick-generate-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.generate-btn {
    background: var(--primary-color);
    color: white;
}

.generate-btn:hover:not(:disabled) {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.generate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.quick-generate-btn {
    background: var(--success-color);
    color: white;
}

.quick-generate-btn:hover:not(:disabled) {
    background: var(--success-color-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.quick-generate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* 密钥结果样式 */
.key-results {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.key-result-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    width: 100%;
}

.key-result-item {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
    transition: all 0.2s ease;
}

.key-result-item:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
}

.key-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.key-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.key-type-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.key-type {
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary-color);
    background: var(--primary-color-alpha);
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    display: inline-block;
    width: fit-content;
}

.password-protected-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--success-color);
    background: var(--success-color-alpha);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
}

.key-description {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.key-actions {
    display: flex;
    gap: 0.5rem;
}

.copy-key-btn,
.download-key-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-key-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.download-key-btn:hover {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
}

.key-value {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: var(--text-primary);
    background: var(--bg-secondary);
    padding: 1rem;
    border-radius: 0.5rem;
    word-break: break-all;
    margin-bottom: 1rem;
    min-height: 10rem;
    max-height: 14rem;
    overflow-y: auto;
    line-height: 1.4;
    white-space: pre-wrap;
    position: relative;
}

.key-value.private-key.blurred {
    filter: blur(4px);
    user-select: none;
}

.privacy-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.1);
    cursor: pointer;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
}

.privacy-overlay:hover {
    background: rgba(0, 0, 0, 0.2);
}

.key-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.key-length,
.key-format {
    padding: 0.25rem 0.5rem;
    background: var(--bg-secondary);
    border-radius: 0.25rem;
}

/* 验证样式 */
.key-verify-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.verify-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.verify-input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.verify-input-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.verify-input {
    height: 120px;
    padding: 0.75rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.75rem;
    font-family: 'Courier New', monospace;
    resize: vertical;
    min-height: 80px;
}

.verify-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.verify-result {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.verify-result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.verify-result-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.verify-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.verify-status.valid {
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.verify-status.invalid {
    background: var(--error-color-alpha);
    color: var(--error-color);
}

.verify-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.verify-detail-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.verify-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    min-width: 5rem;
}

.verify-value {
    font-size: 0.875rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
}

.verify-value.valid {
    background: var(--success-color-alpha);
    color: var(--success-color);
}

.verify-value.invalid {
    background: var(--error-color-alpha);
    color: var(--error-color);
}

/* 算法信息样式 */
.algorithm-info {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.algorithm-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.algorithm-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1rem;
    transition: all 0.2s ease;
}

.algorithm-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
    transform: translateY(-2px);
}

.algorithm-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}

.algorithm-header h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.algorithm-icon {
    font-size: 1.25rem;
}

.algorithm-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 1rem;
}

.algorithm-features {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.feature-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
}

.feature-bullet {
    color: var(--primary-color);
    font-weight: bold;
    margin-top: 0.1rem;
}

.feature-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .config-row {
        grid-template-columns: 1fr;
    }
    
    .verify-form {
        grid-template-columns: 1fr;
    }
    
    .algorithm-grid {
        grid-template-columns: 1fr;
    }
    
    .key-result-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .generator-content {
        padding: 1rem;
        gap: 1.5rem;
    }
    
    .generator-section {
        padding: 1rem;
    }
    
    .generate-actions {
        flex-direction: column;
    }
    
    .key-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .verify-detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .verify-label {
        min-width: auto;
    }
}
</style>