<template>
    <div class="password-generator">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="generator-content">
            <!-- 密码生成设置 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>密码生成设置</h3>
                    <div class="section-info">
                        <span class="info-text">自定义密码长度和字符类型</span>
                    </div>
                </div>
                <div class="password-settings">
                    <div class="settings-grid">
                        <div class="setting-group">
                            <label class="setting-label">密码长度</label>
                            <div class="length-controls">
                                <input v-model.number="passwordLength" type="range" min="4" max="128"
                                    class="length-slider" @input="generatePassword" />
                                <input v-model.number="passwordLength" type="number" min="4" max="128"
                                    class="length-input" @input="generatePassword" />
                            </div>
                        </div>

                        <div class="setting-group">
                            <label class="setting-label">字符类型</label>
                            <div class="character-options">
                                <label class="checkbox-label">
                                    <input v-model="includeUppercase" type="checkbox" @change="generatePassword" />
                                    <div class="checkbox-content">
                                        <span class="checkbox-text">大写字母 (A-Z)</span>
                                        <span class="character-preview">ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
                                    </div>
                                </label>
                                <label class="checkbox-label">
                                    <input v-model="includeLowercase" type="checkbox" @change="generatePassword" />
                                    <div class="checkbox-content">
                                        <span class="checkbox-text">小写字母 (a-z)</span>
                                        <span class="character-preview">abcdefghijklmnopqrstuvwxyz</span>
                                    </div>
                                </label>
                                <label class="checkbox-label">
                                    <input v-model="includeNumbers" type="checkbox" @change="generatePassword" />
                                    <div class="checkbox-content">
                                        <span class="checkbox-text">数字 (0-9)</span>
                                        <span class="character-preview">0123456789</span>
                                    </div>
                                </label>
                                <label class="checkbox-label">
                                    <input v-model="includeSymbols" type="checkbox" @change="generatePassword" />
                                    <div class="checkbox-content">
                                        <span class="checkbox-text">特殊符号</span>
                                        <span class="character-preview">!@#$%^&*()_+-=[]{}|;:,.<>?</span>
                                    </div>
                                </label>
                                <label class="checkbox-label">
                                    <input v-model="excludeSimilar" type="checkbox" @change="generatePassword" />
                                    <div class="checkbox-content">
                                        <span class="checkbox-text">排除相似字符</span>
                                        <span class="character-preview">排除: 0oO, 1lI, 2Z, 5S, 8B</span>
                                    </div>
                                </label>
                                <label class="checkbox-label">
                                    <input v-model="excludeAmbiguous" type="checkbox" @change="generatePassword" />
                                    <div class="checkbox-content">
                                        <span class="checkbox-text">排除易混淆符号</span>
                                        <span class="character-preview">排除: {}[]()\/~,;.<></span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="quick-presets">
                        <h4>快速预设</h4>
                        <div class="preset-buttons">
                            <button class="preset-btn" @click="applyPreset('simple')">
                                <span class="preset-name">简单</span>
                                <span class="preset-desc">字母+数字</span>
                            </button>
                            <button class="preset-btn" @click="applyPreset('standard')">
                                <span class="preset-name">标准</span>
                                <span class="preset-desc">字母+数字+符号</span>
                            </button>
                            <button class="preset-btn" @click="applyPreset('secure')">
                                <span class="preset-name">安全</span>
                                <span class="preset-desc">全字符+长度</span>
                            </button>
                            <button class="preset-btn" @click="applyPreset('pin')">
                                <span class="preset-name">PIN码</span>
                                <span class="preset-desc">纯数字</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 生成的密码 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>生成的密码</h3>
                    <div class="section-info">
                        <div class="password-strength" :class="passwordStrength.level">
                            <div class="strength-indicator">
                                <div class="strength-bar" :style="{ width: passwordStrength.percentage + '%' }"></div>
                            </div>
                            <span class="strength-text">{{ passwordStrength.text }}</span>
                        </div>
                    </div>
                </div>
                <div class="password-result">
                    <div class="password-display">
                        <div class="password-value" :class="{ 'password-hidden': hidePassword }">
                            {{ hidePassword ? '•'.repeat(generatedPassword.length) : generatedPassword }}
                        </div>
                        <div class="password-actions">
                            <button class="password-action-btn" @click="togglePasswordVisibility"
                                :title="hidePassword ? '显示密码' : '隐藏密码'">
                                <svg v-if="hidePassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                            <button class="password-action-btn" @click="copyPassword" title="复制密码">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                            </button>
                            <button class="password-action-btn" @click="generatePassword(true)" title="重新生成">
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

                    <div class="password-info">
                        <div class="info-item">
                            <span class="info-label">长度:</span>
                            <span class="info-value">{{ generatedPassword.length }} 字符</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">熵值:</span>
                            <span class="info-value">{{ passwordEntropy.toFixed(1) }} 位</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">破解时间:</span>
                            <span class="info-value">{{ crackTime }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 批量生成 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>批量生成</h3>
                    <div class="section-info">
                        <span class="info-text">一次生成多个密码</span>
                    </div>
                </div>
                <div class="batch-generator">
                    <div class="batch-controls">
                        <div class="batch-input-group">
                            <label>生成数量</label>
                            <input v-model.number="batchCount" type="number" min="1" max="100"
                                class="batch-count-input" />
                        </div>
                        <button class="batch-generate-btn" @click="generateBatchPasswords">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                            批量生成
                        </button>
                        <button class="batch-export-btn" @click="exportPasswords"
                            :disabled="batchPasswords.length === 0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            导出
                        </button>
                    </div>

                    <div v-if="batchPasswords.length > 0" class="batch-results">
                        <div class="batch-header">
                            <h4>生成的密码 ({{ batchPasswords.length }})</h4>
                            <button class="clear-batch-btn" @click="clearBatch">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                清空
                            </button>
                        </div>
                        <div class="batch-password-list">
                            <div v-for="(password, index) in batchPasswords" :key="index" class="batch-password-item">
                                <span class="batch-password-index">{{ index + 1 }}.</span>
                                <span class="batch-password-value" :class="{ 'password-hidden': hideBatchPasswords }">
                                    {{ hideBatchPasswords ? '•'.repeat(password.length) : password }}
                                </span>
                                <button class="copy-batch-password-btn" @click="copyBatchPassword(password)" title="复制">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="batch-actions">
                            <button class="toggle-batch-visibility-btn" @click="toggleBatchVisibility">
                                <svg v-if="hideBatchPasswords" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                                {{ hideBatchPasswords ? '显示所有' : '隐藏所有' }}
                            </button>
                            <button class="copy-all-btn" @click="copyAllPasswords">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                                复制所有
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 密码安全提示 -->
            <div class="generator-section">
                <div class="section-header">
                    <h3>密码安全提示</h3>
                    <div class="section-info">
                        <span class="info-text">了解如何创建和管理安全密码</span>
                    </div>
                </div>
                <div class="security-tips">
                    <div class="tips-grid">
                        <div class="tip-card">
                            <div class="tip-icon">🔒</div>
                            <h4>长度很重要</h4>
                            <p>密码长度至少12位，越长越安全。每增加一位字符，破解难度呈指数级增长。</p>
                        </div>
                        <div class="tip-card">
                            <div class="tip-icon">🎲</div>
                            <h4>使用多种字符</h4>
                            <p>结合大小写字母、数字和特殊符号，增加密码的复杂性和不可预测性。</p>
                        </div>
                        <div class="tip-card">
                            <div class="tip-icon">🚫</div>
                            <h4>避免个人信息</h4>
                            <p>不要使用生日、姓名、电话号码等个人信息作为密码的一部分。</p>
                        </div>
                        <div class="tip-card">
                            <div class="tip-icon">🔄</div>
                            <h4>定期更换</h4>
                            <p>重要账户的密码应定期更换，特别是在发生安全事件后。</p>
                        </div>
                        <div class="tip-card">
                            <div class="tip-icon">📱</div>
                            <h4>使用密码管理器</h4>
                            <p>使用专业的密码管理器来生成、存储和管理所有密码。</p>
                        </div>
                        <div class="tip-card">
                            <div class="tip-icon">🔐</div>
                            <h4>启用双因素认证</h4>
                            <p>在支持的服务上启用2FA，为账户安全增加额外保护层。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import cardsData from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('password-generator')

// 使用公共通知系统
const { success, error } = useNotification()

// 获取卡片标题
const cardTitle = computed(() => {
    // 遍历所有分类的卡片
    for (const categoryCards of Object.values(cardsData.cards)) {
        const card = categoryCards.find((card: any) => card.id === 'password-generator')
        if (card) {
            return card.title
        }
    }
    return '密码生成器'
})

// 密码设置
const passwordLength = ref(16)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const excludeSimilar = ref(false)
const excludeAmbiguous = ref(false)

// 生成的密码
const generatedPassword = ref('')
const hidePassword = ref(true)

// 批量生成
const batchCount = ref(10)
const batchPasswords = ref<string[]>([])
const hideBatchPasswords = ref(true)

// 字符集定义
const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: '0oO1lI2Z5S8B',
    ambiguous: '{}[]()\/~,;.<>'
}

// 计算可用字符集
const availableCharacters = computed(() => {
    let chars = ''

    if (includeUppercase.value) chars += characterSets.uppercase
    if (includeLowercase.value) chars += characterSets.lowercase
    if (includeNumbers.value) chars += characterSets.numbers
    if (includeSymbols.value) chars += characterSets.symbols

    if (excludeSimilar.value) {
        chars = chars.split('').filter(char => !characterSets.similar.includes(char)).join('')
    }

    if (excludeAmbiguous.value) {
        chars = chars.split('').filter(char => !characterSets.ambiguous.includes(char)).join('')
    }

    return chars
})

// 计算密码熵值
const passwordEntropy = computed(() => {
    const charsetSize = availableCharacters.value.length
    return passwordLength.value * Math.log2(charsetSize)
})

// 计算密码强度
const passwordStrength = computed(() => {
    const entropy = passwordEntropy.value

    if (entropy < 30) {
        return { level: 'very-weak', text: '非常弱', percentage: 20 }
    } else if (entropy < 50) {
        return { level: 'weak', text: '弱', percentage: 40 }
    } else if (entropy < 70) {
        return { level: 'medium', text: '中等', percentage: 60 }
    } else if (entropy < 90) {
        return { level: 'strong', text: '强', percentage: 80 }
    } else {
        return { level: 'very-strong', text: '非常强', percentage: 100 }
    }
})

// 计算破解时间
const crackTime = computed(() => {
    const entropy = passwordEntropy.value
    const guessesPerSecond = 1e9 // 假设每秒10亿次猜测
    const totalGuesses = Math.pow(2, entropy) / 2 // 平均需要尝试一半的可能性
    const seconds = totalGuesses / guessesPerSecond

    if (seconds < 1) return '瞬间'
    if (seconds < 60) return `${Math.round(seconds)} 秒`
    if (seconds < 3600) return `${Math.round(seconds / 60)} 分钟`
    if (seconds < 86400) return `${Math.round(seconds / 3600)} 小时`
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} 天`
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} 年`
    return '数千年'
})

// 生成密码
const generatePassword = (showNotification = false) => {
    const chars = availableCharacters.value

    if (chars.length === 0) {
        error('请至少选择一种字符类型')
        return
    }

    let password = ''

    // 确保至少包含每种选中的字符类型
    const requiredChars = []
    if (includeUppercase.value) requiredChars.push(getRandomChar(characterSets.uppercase))
    if (includeLowercase.value) requiredChars.push(getRandomChar(characterSets.lowercase))
    if (includeNumbers.value) requiredChars.push(getRandomChar(characterSets.numbers))
    if (includeSymbols.value) requiredChars.push(getRandomChar(characterSets.symbols))

    // 添加必需字符
    for (const char of requiredChars) {
        if (password.length < passwordLength.value) {
            password += char
        }
    }

    // 填充剩余长度
    while (password.length < passwordLength.value) {
        password += getRandomChar(chars)
    }

    // 打乱密码字符顺序
    generatedPassword.value = shuffleString(password)
    
    // 如果是手动重新生成，显示通知
    if (showNotification) {
        success('密码已重新生成')
    }
}

// 获取随机字符
const getRandomChar = (charset: string): string => {
    const randomIndex = Math.floor(Math.random() * charset.length)
    return charset[randomIndex] || ''
}

// 打乱字符串
const shuffleString = (str: string): string => {
    const array = str.split('')
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = array[i] || ''
        array[i] = array[j] || ''
        array[j] = temp
    }
    return array.join('')
}

// 应用预设
const applyPreset = (preset: string) => {
    switch (preset) {
        case 'simple':
            passwordLength.value = 12
            includeUppercase.value = true
            includeLowercase.value = true
            includeNumbers.value = true
            includeSymbols.value = false
            excludeSimilar.value = true
            excludeAmbiguous.value = false
            break
        case 'standard':
            passwordLength.value = 16
            includeUppercase.value = true
            includeLowercase.value = true
            includeNumbers.value = true
            includeSymbols.value = true
            excludeSimilar.value = false
            excludeAmbiguous.value = true
            break
        case 'secure':
            passwordLength.value = 24
            includeUppercase.value = true
            includeLowercase.value = true
            includeNumbers.value = true
            includeSymbols.value = true
            excludeSimilar.value = false
            excludeAmbiguous.value = false
            break
        case 'pin':
            passwordLength.value = 6
            includeUppercase.value = false
            includeLowercase.value = false
            includeNumbers.value = true
            includeSymbols.value = false
            excludeSimilar.value = false
            excludeAmbiguous.value = false
            break
    }
    generatePassword()
    const presetNames = {
        simple: '简单',
        standard: '标准', 
        secure: '安全',
        pin: 'PIN码'
    }
    success(`已应用${presetNames[preset as keyof typeof presetNames]}预设`)
}

// 切换密码可见性
const togglePasswordVisibility = () => {
    hidePassword.value = !hidePassword.value
}

// 复制密码
const copyPassword = async () => {
    if (!generatedPassword.value) {
        error('没有可复制的密码')
        return
    }

    try {
        await navigator.clipboard.writeText(generatedPassword.value)
        success('密码已复制到剪贴板')
    } catch (err) {
        error('复制失败')
    }
}

// 批量生成密码
const generateBatchPasswords = () => {
    if (batchCount.value < 1 || batchCount.value > 100) {
        error('生成数量必须在1-100之间')
        return
    }

    const chars = availableCharacters.value
    if (chars.length === 0) {
        error('请至少选择一种字符类型')
        return
    }

    batchPasswords.value = []

    for (let i = 0; i < batchCount.value; i++) {
        let password = ''

        // 确保至少包含每种选中的字符类型
        const requiredChars = []
        if (includeUppercase.value) requiredChars.push(getRandomChar(characterSets.uppercase))
        if (includeLowercase.value) requiredChars.push(getRandomChar(characterSets.lowercase))
        if (includeNumbers.value) requiredChars.push(getRandomChar(characterSets.numbers))
        if (includeSymbols.value) requiredChars.push(getRandomChar(characterSets.symbols))

        // 添加必需字符
        for (const char of requiredChars) {
            if (password.length < passwordLength.value) {
                password += char
            }
        }

        // 填充剩余长度
        while (password.length < passwordLength.value) {
            password += getRandomChar(chars)
        }

        // 打乱密码字符顺序
        batchPasswords.value.push(shuffleString(password))
    }

    success(`已生成 ${batchCount.value} 个密码`)
}

// 复制批量密码
const copyBatchPassword = async (password: string) => {
    try {
        await navigator.clipboard.writeText(password)
        success('密码已复制')
    } catch (err) {
        error('复制失败')
    }
}

// 切换批量密码可见性
const toggleBatchVisibility = () => {
    hideBatchPasswords.value = !hideBatchPasswords.value
}

// 复制所有密码
const copyAllPasswords = async () => {
    if (batchPasswords.value.length === 0) return

    const allPasswords = batchPasswords.value.join('\n')
    try {
        await navigator.clipboard.writeText(allPasswords)
        success('所有密码已复制')
    } catch (err) {
        error('复制失败')
    }
}

// 清空批量密码
const clearBatch = () => {
    batchPasswords.value = []
    success('已清空批量密码')
}

// 导出密码
const exportPasswords = () => {
    if (batchPasswords.value.length === 0) return

    const content = [
        `密码生成报告`,
        `生成时间: ${new Date().toLocaleString()}`,
        `密码长度: ${passwordLength.value}`,
        `字符类型: ${[
            includeUppercase.value && '大写字母',
            includeLowercase.value && '小写字母',
            includeNumbers.value && '数字',
            includeSymbols.value && '特殊符号'
        ].filter(Boolean).join(', ')}`,
        `生成数量: ${batchPasswords.value.length}`,
        '',
        '生成的密码:',
        ...batchPasswords.value.map((pwd, index) => `${index + 1}. ${pwd}`)
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `passwords-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    success('密码已导出')
}

// 清空所有
const clearAll = () => {
    generatedPassword.value = ''
    batchPasswords.value = []
    success('已清空所有内容')
}

// 组件挂载时生成初始密码
onMounted(() => {
    generatePassword()
})
</script>
<style scoped>
.password-generator {
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
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

.generator-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.section-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.section-info {
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-text {
    font-size: 14px;
    color: var(--text-secondary);
}

/* 密码强度指示器 */
.password-strength {
    display: flex;
    align-items: center;
    gap: 12px;
}

.strength-indicator {
    width: 100px;
    height: 8px;
    background: var(--bg-tertiary);
    border-radius: 4px;
    overflow: hidden;
}

.strength-bar {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 4px;
}

.password-strength.very-weak .strength-bar {
    background: var(--error-color);
}

.password-strength.weak .strength-bar {
    background: #ff6b35;
}

.password-strength.medium .strength-bar {
    background: var(--warning-color);
}

.password-strength.strong .strength-bar {
    background: #4ade80;
}

.password-strength.very-strong .strength-bar {
    background: var(--success-color);
}

.strength-text {
    font-size: 14px;
    font-weight: 500;
}

.password-strength.very-weak .strength-text {
    color: var(--error-color);
}

.password-strength.weak .strength-text {
    color: #ff6b35;
}

.password-strength.medium .strength-text {
    color: var(--warning-color);
}

.password-strength.strong .strength-text {
    color: #4ade80;
}

.password-strength.very-strong .strength-text {
    color: var(--success-color);
}

/* 密码设置样式 */
.password-settings {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.settings-grid {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.setting-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.setting-label {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.length-controls {
    display: flex;
    align-items: center;
    gap: 16px;
}

.length-slider {
    flex: 1;
    height: 6px;
    background: var(--bg-tertiary);
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.length-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
}

.length-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

.length-input {
    width: 80px;
    padding: 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    text-align: center;
    font-size: 14px;
}

.length-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.character-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 8px;
}

.checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    cursor: pointer;
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    transition: all 0.2s ease;
}

.checkbox-label:hover {
    border-color: var(--primary-color);
    background: var(--primary-color-alpha);
}

.checkbox-label input[type="checkbox"] {
    margin: 0;
    transform: scale(1.2);
    flex-shrink: 0;
}

.checkbox-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
}

.checkbox-text {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
}

.character-preview {
    font-size: 11px;
    color: var(--text-secondary);
    font-family: 'Courier New', monospace;
    word-break: break-all;
    line-height: 1.2;
}

.quick-presets h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 16px 0;
}

.preset-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
}

.preset-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 16px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
}

.preset-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.preset-name {
    font-size: 14px;
    font-weight: 600;
}

.preset-desc {
    font-size: 12px;
    opacity: 0.8;
}

/* 密码结果样式 */
.password-result {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.password-display {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--bg-tertiary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
    transition: all 0.2s ease;
}

.password-display:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
}

.password-value {
    flex: 1;
    font-family: 'Courier New', monospace;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
    word-break: break-all;
    line-height: 1.5;
    min-height: 1.5em;
}

.password-value.password-hidden {
    letter-spacing: 0.2em;
}

.password-actions {
    display: flex;
    gap: 8px;
}

.password-action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.password-action-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.password-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    text-align: center;
}

.info-label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
}

.info-value {
    font-size: 16px;
    color: var(--text-primary);
    font-weight: 600;
}

/* 批量生成样式 */
.batch-generator {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.batch-controls {
    display: flex;
    align-items: end;
    gap: 16px;
}

.batch-input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.batch-input-group label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.batch-count-input {
    width: 100px;
    padding: 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    text-align: center;
    font-size: 14px;
}

.batch-count-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.batch-generate-btn,
.batch-export-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
}

.batch-generate-btn {
    background: var(--primary-color);
    color: white;
}

.batch-generate-btn:hover {
    background: var(--primary-color-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.batch-export-btn {
    background: var(--success-color);
    color: white;
}

.batch-export-btn:hover:not(:disabled) {
    background: var(--success-color-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.batch-export-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.batch-results {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
}

.batch-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.batch-header h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.clear-batch-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}

.clear-batch-btn:hover {
    background: var(--error-color-dark);
}

.batch-password-list {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 16px;
}

.batch-password-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 8px;
}

.batch-password-index {
    font-size: 14px;
    color: var(--text-secondary);
    font-weight: 500;
    min-width: 32px;
}

.batch-password-value {
    flex: 1;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: var(--text-primary);
    word-break: break-all;
}

.batch-password-value.password-hidden {
    letter-spacing: 0.1em;
}

.copy-batch-password-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-batch-password-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.batch-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.toggle-batch-visibility-btn,
.copy-all-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
}

.toggle-batch-visibility-btn:hover,
.copy-all-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

/* 安全提示样式 */
.security-tips {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
}

.tips-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.tip-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    transition: all 0.2s ease;
}

.tip-card:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px var(--primary-color-alpha);
    transform: translateY(-2px);
}

.tip-icon {
    font-size: 32px;
    margin-bottom: 12px;
}

.tip-card h4 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 12px 0;
}

.tip-card p {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .generator-content {
        padding: 16px;
        gap: 24px;
    }

    .generator-section {
        padding: 16px;
    }

    .character-options {
        grid-template-columns: 1fr;
    }

    .settings-grid {
        flex-direction: column;
    }

    .length-controls {
        flex-direction: column;
        align-items: stretch;
    }

    .preset-buttons {
        grid-template-columns: repeat(2, 1fr);
    }

    .password-display {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }

    .password-actions {
        justify-content: center;
    }

    .batch-controls {
        flex-direction: column;
        align-items: stretch;
    }

    .batch-actions {
        flex-direction: column;
    }

    .tips-grid {
        grid-template-columns: 1fr;
    }
}
</style>