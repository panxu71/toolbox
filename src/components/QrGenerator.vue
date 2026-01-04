<template>
    <div class="qr-generator">
        <div class="tool-header">
            <div class="header-left">
                <button @click="$emit('back')" class="back-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    返回
                </button>
                <div class="title-section">
                    <h2>二维码生成器</h2>
                    <p>生成自定义二维码，支持文本、链接、WiFi等多种类型</p>
                </div>
            </div>
            <div class="header-actions">
                <button @click="clearAll" class="action-btn" title="清空所有">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="generator-content">
            <!-- 左侧输入区域 -->
            <div class="input-section">
                <div class="section-header">
                    <h3>内容设置</h3>
                    <div class="type-button-group">
                        <button 
                            v-for="type in qrTypes" 
                            :key="type.id"
                            class="type-button"
                            :class="{ active: selectedType === type.id }"
                            @click="selectType(type.id)"
                            :title="type.name"
                        >
                            <span class="type-name">{{ type.name }}</span>
                        </button>
                    </div>
                </div>

                <!-- 类型选择 -->
                <!-- 类型选择已移至标题栏 -->

                <!-- 内容输入区域 -->
                <div class="content-input">
                    <!-- 文本类型 -->
                    <div v-if="selectedType === 'text'" class="input-form">
                        <label class="section-label">文本内容</label>
                        <textarea 
                            v-model="textContent" 
                            class="content-textarea" 
                            placeholder="请输入要生成二维码的文本内容..."
                            @input="generateQR"
                        ></textarea>
                    </div>

                    <!-- URL类型 -->
                    <div v-if="selectedType === 'url'" class="input-form">
                        <label class="section-label">网址链接</label>
                        <input 
                            v-model="urlContent" 
                            type="url" 
                            class="content-input-field" 
                            placeholder="https://example.com"
                            @input="generateQR"
                        />
                    </div>

                    <!-- WiFi类型 -->
                    <div v-if="selectedType === 'wifi'" class="input-form">
                        <div class="form-field">
                            <label class="field-label">WiFi网络名称</label>
                            <input 
                                v-model="wifiSSID" 
                                type="text" 
                                class="content-input-field" 
                                placeholder="WiFi名称"
                                @input="generateQR"
                            />
                        </div>
                        
                        <div class="form-field">
                            <label class="field-label">WiFi密码</label>
                            <input 
                                v-model="wifiPassword" 
                                type="password" 
                                class="content-input-field" 
                                placeholder="WiFi密码"
                                @input="generateQR"
                            />
                        </div>
                        
                        <div class="form-field">
                            <label class="field-label">加密类型</label>
                            <select v-model="wifiSecurity" class="content-select" @change="generateQR">
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">无密码</option>
                            </select>
                        </div>
                    </div>

                    <!-- 联系人类型 -->
                    <div v-if="selectedType === 'contact'" class="input-form">
                        <div class="form-field">
                            <label class="field-label">姓名</label>
                            <input 
                                v-model="contactName" 
                                type="text" 
                                class="content-input-field" 
                                placeholder="联系人姓名"
                                @input="generateQR"
                            />
                        </div>
                        
                        <div class="form-field">
                            <label class="field-label">电话</label>
                            <input 
                                v-model="contactPhone" 
                                type="tel" 
                                class="content-input-field" 
                                placeholder="电话号码"
                                @input="generateQR"
                            />
                        </div>
                        
                        <div class="form-field">
                            <label class="field-label">邮箱</label>
                            <input 
                                v-model="contactEmail" 
                                type="email" 
                                class="content-input-field" 
                                placeholder="邮箱地址"
                                @input="generateQR"
                            />
                        </div>
                    </div>
                </div>

                <!-- 样式设置 -->
                <div class="style-panel">
                    <label class="section-label">样式设置</label>
                    
                    <div class="settings-grid">
                        <div class="setting-item">
                            <label class="setting-label">容错率</label>
                            <select v-model="errorCorrectionLevel" class="setting-control" @change="generateQR">
                                <option value="L">低 (7%)</option>
                                <option value="M">中 (15%)</option>
                                <option value="Q">较高 (25%)</option>
                                <option value="H">高 (30%)</option>
                            </select>
                        </div>

                        <div class="setting-item">
                            <label class="setting-label">尺寸大小</label>
                            <select v-model="qrSize" class="setting-control" @change="generateQR">
                                <option value="200">小 (200x200)</option>
                                <option value="300">中 (300x300)</option>
                                <option value="400">大 (400x400)</option>
                                <option value="500">超大 (500x500)</option>
                            </select>
                        </div>

                        <div class="setting-item">
                            <label class="setting-label">前景色</label>
                            <input 
                                v-model="foregroundColor" 
                                type="color" 
                                class="color-picker"
                                @change="generateQR"
                            />
                        </div>

                        <div class="setting-item">
                            <label class="setting-label">背景色</label>
                            <input 
                                v-model="backgroundColor" 
                                type="color" 
                                class="color-picker"
                                @change="generateQR"
                            />
                        </div>
                    </div>

                    <!-- Logo上传 -->
                    <div class="logo-section">
                        <label class="setting-label">中心Logo</label>
                        <div class="logo-controls">
                            <input 
                                ref="logoInput"
                                type="file" 
                                accept="image/*" 
                                @change="handleLogoUpload"
                                style="display: none"
                            />
                            <button 
                                v-if="!logoImage" 
                                @click="triggerLogoUpload" 
                                class="logo-upload-btn"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17,8 12,3 7,8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                上传Logo
                            </button>
                            <div v-else class="logo-preview">
                                <img :src="logoImage" alt="Logo" class="logo-img" />
                                <button @click="removeLogo" class="logo-remove-btn" title="移除Logo">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div v-if="logoImage" class="logo-size-control">
                            <label class="logo-size-label">Logo大小: {{ logoSize }}%</label>
                            <input 
                                v-model="logoSize" 
                                type="range" 
                                min="10" 
                                max="30" 
                                step="1"
                                class="logo-slider"
                                @input="generateQR"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧预览区域 -->
            <div class="preview-section">
                <div class="section-header">
                    <h3>二维码预览</h3>
                    <div class="preview-actions">
                        <button @click="downloadQR" class="download-btn" :disabled="!qrDataURL">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            下载
                        </button>
                        <button @click="copyQR" class="copy-btn" :disabled="!qrDataURL">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                            复制
                        </button>
                    </div>
                </div>

                <div class="preview-container">
                    <div v-if="qrDataURL" class="qr-preview">
                        <img :src="qrDataURL" :alt="'二维码: ' + getCurrentContent()" class="qr-image" />
                        <div class="qr-info">
                            <p class="qr-content">{{ getCurrentContent() }}</p>
                            <p class="qr-size">{{ qrSize }}x{{ qrSize }} 像素</p>
                        </div>
                    </div>
                    
                    <div v-else class="preview-placeholder">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                            <polyline points="14,17 17,17 17,20"/>
                            <polyline points="21,17 21,20 18,20"/>
                        </svg>
                        <h4>二维码预览</h4>
                        <p>输入内容后将显示二维码</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 状态提示 -->
        <div v-if="message" :class="['message', messageType]">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import QRCode from 'qrcode'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'

defineEmits<{
    back: []
}>()

// 二维码类型
const qrTypes = [
    { id: 'text', name: '文本', icon: '📝' },
    { id: 'url', name: '链接', icon: '🔗' },
    { id: 'wifi', name: 'WiFi', icon: '📶' },
    { id: 'contact', name: '联系人', icon: '👤' }
]

// 当前选择的类型
const selectedType = ref('text')

// 各种类型的内容
const textContent = ref('')
const urlContent = ref('')
const wifiSSID = ref('')
const wifiPassword = ref('')
const wifiSecurity = ref('WPA')
const contactName = ref('')
const contactPhone = ref('')
const contactEmail = ref('')

// 样式设置
const qrSize = ref('300')
const foregroundColor = ref('#000000')
const backgroundColor = ref('#ffffff')
const errorCorrectionLevel = ref('M')

// Logo相关
const logoImage = ref('')
const logoSize = ref(20)

// 二维码数据
const qrDataURL = ref('')

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 选择类型
const selectType = (type: string) => {
    selectedType.value = type
    generateQR()
}

// 获取当前内容
const getCurrentContent = (): string => {
    switch (selectedType.value) {
        case 'text':
            return textContent.value
        case 'url':
            return urlContent.value
        case 'wifi':
            return `WIFI:T:${wifiSecurity.value};S:${wifiSSID.value};P:${wifiPassword.value};;`
        case 'contact':
            return `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName.value}\nTEL:${contactPhone.value}\nEMAIL:${contactEmail.value}\nEND:VCARD`
        default:
            return ''
    }
}

// 生成二维码
const generateQR = async () => {
    const content = getCurrentContent()
    if (!content.trim()) {
        qrDataURL.value = ''
        return
    }

    try {
        const options = {
            width: parseInt(qrSize.value),
            margin: 2,
            errorCorrectionLevel: errorCorrectionLevel.value,
            color: {
                dark: foregroundColor.value,
                light: backgroundColor.value
            }
        }

        // 生成基础二维码
        const baseQR = await QRCode.toDataURL(content, options)
        
        // 如果有Logo，则合成Logo到二维码中心
        if (logoImage.value) {
            qrDataURL.value = await addLogoToQR(baseQR)
        } else {
            qrDataURL.value = baseQR
        }
    } catch (error) {
        console.error('生成二维码失败:', error)
        showMessage('生成二维码失败', 'error')
    }
}

// 添加Logo到二维码
const addLogoToQR = async (qrDataURL: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            reject(new Error('无法获取canvas上下文'))
            return
        }

        const qrImage = new Image()
        qrImage.onload = () => {
            const size = parseInt(qrSize.value)
            canvas.width = size
            canvas.height = size

            // 绘制二维码
            ctx.drawImage(qrImage, 0, 0, size, size)

            // 绘制Logo
            const logo = new Image()
            logo.onload = () => {
                const logoSizePixels = (size * logoSize.value) / 100
                const x = (size - logoSizePixels) / 2
                const y = (size - logoSizePixels) / 2

                // 绘制白色背景（增加对比度）
                const padding = logoSizePixels * 0.1
                ctx.fillStyle = backgroundColor.value
                ctx.fillRect(
                    x - padding,
                    y - padding,
                    logoSizePixels + padding * 2,
                    logoSizePixels + padding * 2
                )

                // 绘制Logo
                ctx.drawImage(logo, x, y, logoSizePixels, logoSizePixels)

                resolve(canvas.toDataURL('image/png'))
            }
            logo.onerror = () => reject(new Error('Logo加载失败'))
            logo.src = logoImage.value
        }
        qrImage.onerror = () => reject(new Error('二维码加载失败'))
        qrImage.src = qrDataURL
    })
}

// 触发Logo上传
const logoInput = ref<HTMLInputElement | null>(null)

const triggerLogoUpload = () => {
    logoInput.value?.click()
}

// 处理Logo上传
const handleLogoUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        showMessage('请上传图片文件', 'error')
        return
    }

    // 检查文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
        showMessage('图片文件不能超过5MB', 'error')
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        logoImage.value = e.target?.result as string
        generateQR()
        showMessage('Logo已上传', 'success')
    }
    reader.onerror = () => {
        showMessage('Logo上传失败', 'error')
    }
    reader.readAsDataURL(file)
}

// 移除Logo
const removeLogo = () => {
    logoImage.value = ''
    if (logoInput.value) {
        logoInput.value.value = ''
    }
    generateQR()
    showMessage('Logo已移除', 'success')
}

// 下载二维码
const downloadQR = () => {
    if (!qrDataURL.value) return

    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = qrDataURL.value
    link.click()
    
    showMessage('二维码已下载', 'success')
}

// 复制二维码
const copyQR = async () => {
    if (!qrDataURL.value) return

    try {
        // 将 data URL 转换为 Blob
        const response = await fetch(qrDataURL.value)
        const blob = await response.blob()
        
        // 复制到剪贴板
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ])
        
        showMessage('二维码已复制到剪贴板', 'success')
    } catch (error) {
        console.error('复制失败:', error)
        showMessage('复制失败，请手动保存', 'error')
    }
}

// 清空所有
const clearAll = () => {
    textContent.value = ''
    urlContent.value = ''
    wifiSSID.value = ''
    wifiPassword.value = ''
    contactName.value = ''
    contactPhone.value = ''
    contactEmail.value = ''
    logoImage.value = ''
    qrDataURL.value = ''
    selectedType.value = 'text'
    errorCorrectionLevel.value = 'M'
    logoSize.value = 20
    if (logoInput.value) {
        logoInput.value.value = ''
    }
    showMessage('已清空所有内容', 'success')
}

// 显示消息
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 初始化
onMounted(() => {
    setPageTitle('qr-generator')
    // 加载示例内容
    textContent.value = '欢迎使用二维码生成器！'
    generateQR()
})

onUnmounted(() => {
    restoreDefaultTitle()
})
</script>

<style scoped>
.qr-generator {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.tool-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.back-button {
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

.back-button:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.title-section h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.title-section p {
    margin: 4px 0 0 0;
    color: var(--text-secondary);
    font-size: 14px;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.type-button-group {
    display: flex;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
}

.type-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 11px;
    border-right: 1px solid var(--border-color);
    min-width: 40px;
    height: 28px;
}

.type-button:last-child {
    border-right: none;
}

.type-button:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.type-button.active {
    background: var(--primary-color);
    color: white;
}

.type-button .type-name {
    font-size: 10px;
    font-weight: 500;
}

.action-divider {
    width: 1px;
    height: 24px;
    background: var(--border-color);
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

.generator-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border-color);
    min-height: 500px;
    height: calc(100vh - 100px);
}

.input-section,
.preview-section {
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 500px;
    overflow: hidden;
}

/* 通用样式 */
.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    min-height: 60px;
    box-sizing: border-box;
    flex-shrink: 0;
}

.section-header h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
}

.header-spacer {
    width: 0;
    height: 32px;
    display: flex;
    align-items: center;
}

.preview-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    height: 32px;
}

.download-btn,
.copy-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: var(--primary-color);
    color: white;
    border: 1px solid var(--primary-color);
    border-radius: var(--radius-sm);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    height: 26px;
}

.download-btn:hover:not(:disabled) {
    background: var(--primary-color-dark, #4f46e5);
}

.copy-btn {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border-color: var(--border-color);
}

.copy-btn:hover:not(:disabled) {
    background: var(--border-color);
}

.download-btn:disabled,
.copy-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* 内容输入区域 */
.content-input {
    flex: 1;
    padding: 16px 20px;
    overflow-y: auto;
    min-height: 200px;
    max-height: calc(100vh - 400px);
}

.section-label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
}

.input-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 200px;
}

.content-textarea {
    flex: 1;
    min-height: 120px;
    max-height: 200px;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 14px;
    font-family: inherit;
    line-height: 1.5;
    resize: vertical;
    transition: var(--transition);
    box-sizing: border-box;
}

.content-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.content-input-field,
.content-select {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
    box-sizing: border-box;
}

.content-input-field:focus,
.content-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-field {
    margin-bottom: 10px;
    width: 100%;
}

.field-label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
}

/* 样式设置区域 */
.style-panel {
    padding: 12px 20px;
    border-top: 1px solid var(--border-color);
    background: var(--bg-secondary);
    flex-shrink: 0;
    max-height: 200px;
    overflow-y: auto;
}

.settings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 12px;
}

.setting-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.setting-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-secondary);
}

.setting-control {
    padding: 4px 6px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 11px;
    cursor: pointer;
    height: 26px;
}

.color-picker {
    width: 100%;
    height: 26px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    cursor: pointer;
}

/* Logo区域 */
.logo-section {
    border-top: 1px solid var(--border-color);
    padding-top: 10px;
}

.logo-controls {
    margin-top: 4px;
}

.logo-upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    padding: 6px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 10px;
    height: 28px;
}

.logo-upload-btn:hover {
    background: var(--border-color);
}

.logo-preview {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    height: 28px;
}

.logo-img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    border-radius: var(--radius-sm);
    background: white;
}

.logo-remove-btn {
    background: var(--error-color, #ef4444);
    border: none;
    color: white;
    cursor: pointer;
    padding: 2px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    margin-left: auto;
    width: 16px;
    height: 16px;
}

.logo-remove-btn:hover {
    background: #dc2626;
}

.logo-size-control {
    margin-top: 8px;
}

.logo-size-label {
    display: block;
    font-size: 10px;
    color: var(--text-secondary);
    margin-bottom: 4px;
}

.logo-slider {
    width: 100%;
    height: 3px;
    background: var(--bg-tertiary);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

.logo-slider::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
}

.logo-slider::-moz-range-thumb {
    width: 10px;
    height: 10px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    border: none;
}

.preview-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    min-height: 0;
}

.qr-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.qr-image {
    max-width: 100%;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
}

.qr-info {
    text-align: center;
}

.qr-content {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: var(--text-primary);
    font-weight: 500;
    word-break: break-all;
    max-width: 300px;
}

.qr-size {
    margin: 0;
    font-size: 12px;
    color: var(--text-muted);
}

.preview-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: var(--text-muted);
    text-align: center;
}

.preview-placeholder svg {
    opacity: 0.5;
}

.preview-placeholder h4 {
    margin: 0;
    font-size: 16px;
    color: var(--text-secondary);
}

.preview-placeholder p {
    margin: 0;
    font-size: 14px;
}

.message {
    position: absolute;
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    z-index: 100;
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
    .generator-content {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
    }
    
    .tool-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
        padding: 16px;
    }
    
    .type-tabs {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .section-header {
        padding: 16px 20px;
    }
    
    .input-group,
    .form-container,
    .style-settings {
        padding: 16px 20px;
    }
}
</style>