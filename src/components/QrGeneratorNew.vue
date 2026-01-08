<template>
    <div class="qr-generator">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="download" tooltip="下载二维码" @click="downloadQR" :disabled="!qrDataURL" />
                <HeaderActionButton icon="copy" tooltip="复制二维码" @click="copyQR" :disabled="!qrDataURL" />
                <HeaderActionButton icon="clear" tooltip="清空所有" @click="clearAll" />
            </template>
        </PageHeader>

        <div class="generator-content">
            <!-- 左侧输入区域 -->
            <div class="input-section">
                <div class="section-header">
                    <h3>内容设置</h3>
                    <div class="type-selector">
                        <button 
                            v-for="type in qrTypes" 
                            :key="type.id"
                            class="type-btn"
                            :class="{ active: selectedType === type.id }"
                            @click="selectType(type.id)"
                        >
                            <span class="type-icon">{{ type.icon }}</span>
                            <span class="type-name">{{ type.name }}</span>
                        </button>
                    </div>
                </div>

                <div class="content-area">
                    <!-- 文本类型 -->
                    <div v-if="selectedType === 'text'" class="input-form">
                        <label class="form-label">文本内容</label>
                        <textarea 
                            v-model="textContent" 
                            class="form-textarea" 
                            placeholder="请输入要生成二维码的文本内容..."
                            @input="generateQR"
                        ></textarea>
                    </div>

                    <!-- URL类型 -->
                    <div v-if="selectedType === 'url'" class="input-form">
                        <label class="form-label">网址链接</label>
                        <input 
                            v-model="urlContent" 
                            type="url" 
                            class="form-input" 
                            placeholder="https://example.com"
                            @input="generateQR"
                        />
                    </div>

                    <!-- WiFi类型 -->
                    <div v-if="selectedType === 'wifi'" class="input-form">
                        <div class="form-group">
                            <label class="form-label">网络名称</label>
                            <input 
                                v-model="wifiSSID" 
                                type="text" 
                                class="form-input" 
                                placeholder="WiFi名称"
                                @input="generateQR"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">WiFi密码</label>
                            <input 
                                v-model="wifiPassword" 
                                type="password" 
                                class="form-input" 
                                placeholder="WiFi密码"
                                @input="generateQR"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">加密类型</label>
                            <select v-model="wifiSecurity" class="form-select" @change="generateQR">
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">无密码</option>
                            </select>
                        </div>
                    </div>

                    <!-- 联系人类型 -->
                    <div v-if="selectedType === 'contact'" class="input-form">
                        <div class="form-group">
                            <label class="form-label">姓名</label>
                            <input 
                                v-model="contactName" 
                                type="text" 
                                class="form-input" 
                                placeholder="联系人姓名"
                                @input="generateQR"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">电话</label>
                            <input 
                                v-model="contactPhone" 
                                type="tel" 
                                class="form-input" 
                                placeholder="电话号码"
                                @input="generateQR"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">邮箱</label>
                            <input 
                                v-model="contactEmail" 
                                type="email" 
                                class="form-input" 
                                placeholder="邮箱地址"
                                @input="generateQR"
                            />
                        </div>
                    </div>

                    <!-- 邮件类型 -->
                    <div v-if="selectedType === 'email'" class="input-form">
                        <div class="form-group">
                            <label class="form-label">收件人</label>
                            <input 
                                v-model="emailTo" 
                                type="email" 
                                class="form-input" 
                                placeholder="收件人邮箱地址"
                                @input="generateQR"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">主题</label>
                            <input 
                                v-model="emailSubject" 
                                type="text" 
                                class="form-input" 
                                placeholder="邮件主题"
                                @input="generateQR"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">内容</label>
                            <textarea 
                                v-model="emailBody" 
                                class="form-textarea" 
                                placeholder="邮件内容..."
                                @input="generateQR"
                            ></textarea>
                        </div>
                    </div>

                    <!-- 电话类型 -->
                    <div v-if="selectedType === 'phone'" class="input-form">
                        <div class="form-group">
                            <label class="form-label">电话号码</label>
                            <input 
                                v-model="phoneNumber" 
                                type="tel" 
                                class="form-input" 
                                placeholder="请输入电话号码"
                                @input="generateQR"
                            />
                        </div>
                    </div>

                    <!-- 短信类型 -->
                    <div v-if="selectedType === 'sms'" class="input-form">
                        <div class="form-group">
                            <label class="form-label">手机号码</label>
                            <input 
                                v-model="smsNumber" 
                                type="tel" 
                                class="form-input" 
                                placeholder="接收短信的手机号码"
                                @input="generateQR"
                            />
                        </div>
                        <div class="form-group">
                            <label class="form-label">短信内容</label>
                            <textarea 
                                v-model="smsMessage" 
                                class="form-textarea" 
                                placeholder="短信内容..."
                                @input="generateQR"
                            ></textarea>
                        </div>
                    </div>

                    <!-- 位置类型 -->
                    <div v-if="selectedType === 'location'" class="input-form">
                        <!-- 地图选择器 -->
                        <div class="map-selector">
                            <div class="map-header">
                                <label class="form-label">选择位置</label>
                                <div class="map-controls">
                                    <div class="search-wrapper">
                                        <input 
                                            v-model="searchQuery"
                                            type="text" 
                                            class="search-input" 
                                            placeholder="搜索地点..."
                                            @input="handleSearchSuggestions"
                                            @keyup.enter="searchLocation"
                                            @focus="handleSearchSuggestions"
                                            @blur="hideSuggestions"
                                        />
                                        <div v-if="showSuggestions && searchSuggestions.length > 0" class="suggestions-dropdown">
                                            <div 
                                                v-for="(suggestion, index) in searchSuggestions" 
                                                :key="index"
                                                class="suggestion-item"
                                                @click="selectSuggestion(suggestion)"
                                            >
                                                <div class="suggestion-title">{{ suggestion.title }}</div>
                                                <div class="suggestion-address">{{ suggestion.address }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <button @click="searchLocation" class="search-btn">搜索</button>
                                    <button @click="getCurrentLocation" class="location-btn">定位</button>
                                    <div class="location-format-wrapper">
                                        <select v-model="locationFormat" class="format-select" @change="generateQR">
                                            <option value="tencent">腾讯地图</option>
                                            <option value="baidu">百度地图</option>
                                            <option value="amap">高德地图</option>
                                            <option value="google">谷歌地图</option>
                                            <option value="geo">Geo格式</option>
                                            <option value="text">纯文本</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 地图容器 -->
                            <div class="map-container">
                                <div ref="mapContainer" id="mapContainer" class="map-canvas"></div>
                                <div v-if="!mapLoaded" class="map-loading">
                                    <div class="loading-text">正在加载地图...</div>
                                </div>
                            </div>
                            
                            <!-- 位置信息显示 -->
                            <div v-if="locationLat && locationLng" class="location-info">
                                <div class="location-item">
                                    <span class="location-label">位置名称:</span>
                                    <span class="location-value">{{ locationName || '未命名位置' }}</span>
                                </div>
                                <div class="location-item">
                                    <span class="location-label">坐标:</span>
                                    <span class="location-value">{{ locationLat }}, {{ locationLng }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-panel">
                    <h3>二维码设置</h3>
                    
                    <!-- 预设样式 -->
                    <div class="settings-section">
                        <h4 class="section-title">预设样式</h4>
                        <div class="preset-grid">
                            <button 
                                v-for="preset in stylePresets" 
                                :key="preset.id"
                                class="preset-btn"
                                @click="applyPreset(preset)"
                            >
                                <div class="preset-preview" :class="'preset-' + preset.id"></div>
                                <span class="preset-name">{{ preset.name }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- 基本样式 -->
                    <div class="settings-section">
                        <h4 class="section-title">码点码眼</h4>
                        <div class="style-grid">
                            <div class="style-row">
                                <div class="style-item">
                                    <label class="style-label">码点形状:</label>
                                    <select v-model="dotStyle" class="style-select" @change="generateQR">
                                        <option value="square">方形</option>
                                        <option value="circle">圆形</option>
                                        <option value="rounded">圆角</option>
                                        <option value="horizontal">横条纹</option>
                                        <option value="vertical">竖条纹</option>
                                        <option value="diamond">菱形</option>
                                        <option value="dot">圆点</option>
                                        <option value="star">星形</option>
                                        <option value="liquid">液化</option>
                                        <option value="tile">瓷砖</option>
                                        <option value="grid">网格</option>
                                        <option value="small-square">小方点</option>
                                    </select>
                                </div>
                                <div class="style-item">
                                    <label class="style-label">码眼形状:</label>
                                    <select v-model="cornerStyle" class="style-select" @change="generateQR">
                                        <option value="square">方正</option>
                                        <option value="circle">圆形</option>
                                        <option value="rounded">圆角</option>
                                        <option value="leaf">叶形</option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- 码眼形状样式 -->
                            <div class="style-row">
                                <div class="style-item full-width">
                                    <label class="style-label">码眼形状:</label>
                                    <select v-model="eyePattern" class="style-select full-width-select" @change="generateQR">
                                        <option 
                                            v-for="shape in eyeShapes" 
                                            :key="shape.id"
                                            :value="shape.id"
                                        >
                                            {{ shape.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            
                            <!-- 自定义颜色 -->
                            <div v-if="eyePattern === 'custom'" class="style-row">
                                <div class="style-item">
                                    <label class="style-label">码外眼颜色:</label>
                                    <div class="color-picker-wrapper">
                                        <div class="color-preview" :style="{ backgroundColor: outerEyeColor }"></div>
                                        <input 
                                            v-model="outerEyeColor" 
                                            type="color" 
                                            class="color-input-hidden"
                                            @change="generateQR"
                                        />
                                    </div>
                                </div>
                                <div class="style-item">
                                    <label class="style-label">码内眼颜色:</label>
                                    <div class="color-picker-wrapper">
                                        <div class="color-preview" :style="{ backgroundColor: innerEyeColor }"></div>
                                        <input 
                                            v-model="innerEyeColor" 
                                            type="color" 
                                            class="color-input-hidden"
                                            @change="generateQR"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="style-row">
                                <div class="style-item">
                                    <label class="style-label">码颜色:</label>
                                    <div class="color-picker-wrapper">
                                        <div class="color-preview" :style="{ backgroundColor: foregroundColor }"></div>
                                        <input 
                                            v-model="foregroundColor" 
                                            type="color" 
                                            class="color-input-hidden"
                                            @change="generateQR"
                                        />
                                    </div>
                                </div>
                                <div class="style-item">
                                    <label class="style-label">码背景色:</label>
                                    <div class="color-picker-wrapper">
                                        <div class="color-preview" :style="{ backgroundColor: backgroundColor }"></div>
                                        <input 
                                            v-model="backgroundColor" 
                                            type="color" 
                                            class="color-input-hidden"
                                            @change="generateQR"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 尺寸设置 -->
                    <div class="settings-section">
                        <h4 class="section-title">尺寸设置</h4>
                        <div class="style-grid">
                            <div class="style-row">
                                <div class="style-item">
                                    <label class="style-label">标准尺寸:</label>
                                    <select v-model="qrSize" class="style-select" @change="generateQR">
                                        <option value="200">200x200</option>
                                        <option value="300">300x300</option>
                                        <option value="400">400x400</option>
                                        <option value="500">500x500</option>
                                        <option value="600">600x600</option>
                                    </select>
                                </div>
                                <div class="style-item">
                                    <label class="style-label">容错率:</label>
                                    <select v-model="errorCorrectionLevel" class="style-select" @change="generateQR">
                                        <option value="L">7%</option>
                                        <option value="M">15%</option>
                                        <option value="Q">25%</option>
                                        <option value="H">30%</option>
                                    </select>
                                </div>
                            </div>
                            <div class="style-row">
                                <div class="style-item">
                                    <label class="style-label">边距:</label>
                                    <input 
                                        v-model="qrMargin" 
                                        type="number" 
                                        min="0" 
                                        max="10"
                                        class="style-input"
                                        @input="generateQR"
                                    />
                                </div>
                                <div class="style-item">
                                    <label class="style-label">版本:</label>
                                    <select v-model="qrVersion" class="style-select" @change="generateQR">
                                        <option value="auto">自动</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Logo设置 -->
                    <div class="settings-section">
                        <h4 class="section-title">Logo设置</h4>
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
                                上传Logo
                            </button>
                            <div v-else class="logo-preview">
                                <img :src="logoImage" alt="Logo" class="logo-image" />
                                <div class="logo-info">
                                    <span class="logo-name">Logo已上传</span>
                                    <button @click="removeLogo" class="logo-remove-btn">移除</button>
                                </div>
                            </div>
                            <div v-if="logoImage" class="logo-size-control">
                                <label class="logo-size-label">大小: {{ logoSize }}%</label>
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
            </div>

            <!-- 右侧预览区域 -->
            <div class="preview-section">
                <div class="section-header">
                    <h3>二维码预览</h3>
                    <div class="scan-tip">{{ getScanTip() }}</div>
                </div>
                
                <div class="preview-container">
                    <div v-if="qrDataURL" class="qr-display">
                        <div class="qr-wrapper">
                            <img :src="qrDataURL" :alt="'二维码: ' + getCurrentContent()" class="qr-image" />
                        </div>
                        <div class="qr-info">
                            <div class="qr-content">{{ getCurrentContent() }}</div>
                            <div class="qr-stats">
                                <div class="stat-item">
                                    <span class="stat-label">内容长度:</span>
                                    <span class="stat-value">{{ getCurrentContent().length }} 字符</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">尺寸:</span>
                                    <span class="stat-value">{{ qrSize }}x{{ qrSize }}px</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">容错率:</span>
                                    <span class="stat-value">{{ getErrorCorrectionName() }}</span>
                                </div>
                            </div>
                            <button v-if="selectedType === 'sms' || selectedType === 'phone' || selectedType === 'email'" 
                                    @click="testLink" 
                                    class="test-link-btn">
                                测试链接
                            </button>
                        </div>
                    </div>
                    
                    <div v-else class="preview-placeholder">
                        <h4>二维码预览</h4>
                        <p>输入内容后将显示二维码</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import cardsData from '../config/cards.json'

// 全局类型声明
declare global {
    interface Window {
        L: any
        BMapGL: any
        BMAP_STATUS_SUCCESS: any
        initBaiduMap: () => void
    }
}

defineEmits<{
    back: []
}>()

usePageTitle('qr-generator')
const { success, error } = useNotification()

// 获取卡片标题
const cardTitle = computed(() => {
    for (const categoryCards of Object.values(cardsData.cards)) {
        const card = categoryCards.find((card: any) => card.id === 'qr-generator')
        if (card) {
            return card.title
        }
    }
    return '二维码生成器'
})

// 二维码类型
const qrTypes = [
    { id: 'text', name: '文本', icon: '📝' },
    { id: 'url', name: '链接', icon: '🔗' },
    { id: 'wifi', name: 'WiFi', icon: '📶' },
    { id: 'contact', name: '联系人', icon: '👤' },
    { id: 'email', name: '邮件', icon: '📧' },
    { id: 'phone', name: '电话', icon: '📞' },
    { id: 'sms', name: '短信', icon: '💬' },
    { id: 'location', name: '位置', icon: '📍' }
]

// 当前选择的类型
const selectedType = ref('text')

// 内容
const textContent = ref('')
const urlContent = ref('')
const wifiSSID = ref('')
const wifiPassword = ref('')
const wifiSecurity = ref('WPA')
const contactName = ref('')
const contactPhone = ref('')
const contactEmail = ref('')
const emailTo = ref('')
const emailSubject = ref('')
const emailBody = ref('')
const phoneNumber = ref('')
const smsNumber = ref('')
const smsMessage = ref('')
const locationLat = ref('')
const locationLng = ref('')
const locationName = ref('')
const locationFormat = ref('tencent')

// 地图相关
const mapContainer = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const searchSuggestions = ref<any[]>([])
const showSuggestions = ref(false)
const mapLoaded = ref(false)
const mapInstance = ref<any>(null)
let searchTimeout: any = null

// 样式设置
const qrSize = ref('300')
const qrVersion = ref('auto')
const qrMargin = ref('4')
const foregroundColor = ref('#000000')
const backgroundColor = ref('#ffffff')
const errorCorrectionLevel = ref('M')
const dotStyle = ref('square')
const cornerStyle = ref('square')
const eyeColor = ref('auto')
const eyePattern = ref('normal')
const outerEyeColor = ref('#000000')
const innerEyeColor = ref('#000000')
const encodingContent = ref('')
const encodingLength = ref('')

// 码眼形状选项
const eyeShapes = [
    { id: 'normal', name: '普通' },
    { id: 'liquid', name: '液化' },
    { id: 'round-liquid', name: '圆液化' },
    { id: 'stripe', name: '条纹' },
    { id: 'horizontal', name: '横条纹' },
    { id: 'vertical', name: '竖条纹' },
    { id: 'tile', name: '瓷砖' },
    { id: 'big-dot', name: '大圆点' },
    { id: 'small-dot', name: '小圆点' },
    { id: 'star', name: '粗星形' },
    { id: 'fine-star', name: '细星形' },
    { id: 'grid', name: '网格' },
    { id: 'diamond', name: '菱形' },
    { id: 'small-square', name: '小方点' }
]

// 预设样式
const stylePresets = [
    {
        id: 'classic',
        name: '经典',
        dotStyle: 'square',
        eyePattern: 'normal',
        foregroundColor: '#000000',
        backgroundColor: '#ffffff'
    },
    {
        id: 'modern',
        name: '现代',
        dotStyle: 'circle',
        eyePattern: 'rounded',
        foregroundColor: '#2563eb',
        backgroundColor: '#ffffff'
    },
    {
        id: 'artistic',
        name: '艺术',
        dotStyle: 'diamond',
        eyePattern: 'liquid',
        foregroundColor: '#7c3aed',
        backgroundColor: '#f8fafc'
    },
    {
        id: 'minimal',
        name: '简约',
        dotStyle: 'rounded',
        eyePattern: 'circle',
        foregroundColor: '#374151',
        backgroundColor: '#ffffff'
    }
]

// Logo相关
const logoImage = ref('')
const logoSize = ref(20)
const logoInput = ref<HTMLInputElement | null>(null)

// 二维码数据
const qrDataURL = ref('')

// 应用预设样式
const applyPreset = (preset: any) => {
    dotStyle.value = preset.dotStyle
    eyePattern.value = preset.eyePattern
    foregroundColor.value = preset.foregroundColor
    backgroundColor.value = preset.backgroundColor
    generateQR()
    success(`已应用${preset.name}样式`)
}

// 选择类型
const selectType = (type: string) => {
    selectedType.value = type
    
    if (type === 'location') {
        if (!locationLat.value || !locationLng.value) {
            locationLat.value = '39.9042'
            locationLng.value = '116.4074'
            locationName.value = '北京市'
        }
        
        nextTick(() => {
            initMap().then(() => {
                // 地图初始化完成后自动定位
                setTimeout(() => {
                    getCurrentLocation()
                }, 1000)
            })
        })
    }
    
    generateQR()
}

// 加载百度地图API
const loadBaiduMap = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (window.BMapGL) {
            resolve(window.BMapGL)
            return
        }
        
        const script = document.createElement('script')
        script.src = 'https://api.map.baidu.com/api?v=1.0&type=webgl&ak=E4805d16520de693a3fe707cdc962045&callback=initBaiduMap'
        script.async = true
        
        window.initBaiduMap = () => {
            resolve(window.BMapGL)
        }
        
        script.onerror = () => {
            reject(new Error('百度地图加载失败'))
        }
        
        document.head.appendChild(script)
    })
}

// 初始化地图
const initMap = async (): Promise<void> => {
    if (!mapContainer.value) return
    
    try {
        mapLoaded.value = false
        
        const BMapGL = await loadBaiduMap()
        
        // 创建地图实例
        mapInstance.value = new BMapGL.Map('mapContainer')
        
        const lat = parseFloat(locationLat.value)
        const lng = parseFloat(locationLng.value)
        const point = new BMapGL.Point(lng, lat)
        
        mapInstance.value.centerAndZoom(point, 13)
        mapInstance.value.enableScrollWheelZoom(true)
        mapInstance.value.addControl(new BMapGL.ZoomControl())
        
        // 添加默认标记
        const defaultMarker = new BMapGL.Marker(point)
        mapInstance.value.addOverlay(defaultMarker)
        
        // 添加点击事件
        mapInstance.value.addEventListener('click', (e: any) => {
            const point = e.point
            const lat = point.lat.toFixed(6)
            const lng = point.lng.toFixed(6)
            
            const geoc = new BMapGL.Geocoder()
            geoc.getLocation(point, (result: any) => {
                const address = result ? result.address : '选中位置'
                setLocation(lat, lng, address)
            })
        })
        
        mapLoaded.value = true
        console.log('地图初始化完成')
        
    } catch (err) {
        console.error('地图初始化失败:', err)
        mapLoaded.value = true
        error('地图加载失败')
    }
}

// 设置位置
const setLocation = (lat: string, lng: string, name: string = '') => {
    locationLat.value = lat
    locationLng.value = lng
    locationName.value = name
    
    if (mapInstance.value && window.BMapGL) {
        mapInstance.value.clearOverlays()
        const point = new window.BMapGL.Point(parseFloat(lng), parseFloat(lat))
        const marker = new window.BMapGL.Marker(point)
        mapInstance.value.addOverlay(marker)
        mapInstance.value.centerAndZoom(point, 15)
    }
    
    generateQR()
}

// 获取当前位置 - 使用百度地图API
const getCurrentLocation = () => {
    console.log('开始获取当前位置...')
    success('正在获取当前位置...')
    
    if (window.BMapGL && mapInstance.value) {
        console.log('使用百度地图定位API')
        
        const geolocation = new window.BMapGL.Geolocation()
        geolocation.getCurrentPosition((result: any) => {
            if (geolocation.getStatus() === window.BMAP_STATUS_SUCCESS) {
                const lat = result.point.lat.toFixed(6)
                const lng = result.point.lng.toFixed(6)
                
                console.log('百度地图定位成功:', lat, lng)
                
                const geoc = new window.BMapGL.Geocoder()
                geoc.getLocation(result.point, (geoResult: any) => {
                    const address = geoResult ? geoResult.address : '当前位置'
                    console.log('获取到地址:', address)
                    setLocation(lat, lng, address)
                    success(`定位成功: ${address}`)
                })
            } else {
                console.log('百度地图定位失败，尝试浏览器定位')
                tryBrowserGeolocation()
            }
        }, {
            enableHighAccuracy: true
        })
    } else {
        tryBrowserGeolocation()
    }
}

// 浏览器原生定位
const tryBrowserGeolocation = () => {
    if (!navigator.geolocation) {
        error('浏览器不支持地理定位')
        return
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(6)
            const lng = position.coords.longitude.toFixed(6)
            
            console.log('浏览器定位成功:', lat, lng)
            setLocation(lat, lng, '当前位置')
            success('定位成功')
        },
        (err) => {
            console.error('定位失败:', err)
            error('定位失败，请手动选择位置')
        },
        {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 300000
        }
    )
}

// 搜索位置建议（防抖处理）
const handleSearchSuggestions = () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
    
    searchTimeout = setTimeout(() => {
        if (!searchQuery.value.trim() || !window.BMapGL || !mapInstance.value) {
            searchSuggestions.value = []
            showSuggestions.value = false
            return
        }
        
        console.log('开始搜索建议:', searchQuery.value)
        
        // 使用百度地图的本地搜索获取建议
        const localSearch = new window.BMapGL.LocalSearch(mapInstance.value, {
            onSearchComplete: (results: any) => {
                console.log('搜索完成，状态:', localSearch.getStatus())
                if (localSearch.getStatus() === window.BMAP_STATUS_SUCCESS) {
                    const suggestions = []
                    const numPois = results.getNumPois()
                    console.log('找到POI数量:', numPois)
                    
                    for (let i = 0; i < Math.min(numPois, 5); i++) {
                        const poi = results.getPoi(i)
                        if (poi && poi.title) {
                            suggestions.push({
                                title: poi.title,
                                address: poi.address || '',
                                point: poi.point
                            })
                        }
                    }
                    searchSuggestions.value = suggestions
                    showSuggestions.value = suggestions.length > 0
                    console.log('搜索建议结果:', suggestions)
                } else {
                    console.log('搜索失败，状态码:', localSearch.getStatus())
                    searchSuggestions.value = []
                    showSuggestions.value = false
                }
            }
        })
        
        localSearch.search(searchQuery.value)
    }, 500)
}

// 隐藏搜索建议
const hideSuggestions = () => {
    setTimeout(() => {
        showSuggestions.value = false
    }, 200)
}

// 选择搜索建议
const selectSuggestion = (suggestion: any) => {
    const lat = suggestion.point.lat.toFixed(6)
    const lng = suggestion.point.lng.toFixed(6)
    const name = suggestion.title
    
    setLocation(lat, lng, name)
    searchQuery.value = suggestion.title
    showSuggestions.value = false
    success(`已选择位置: ${name}`)
}

// 搜索位置
const searchLocation = async () => {
    if (!searchQuery.value.trim()) return
    
    if (window.BMapGL && mapInstance.value) {
        const localSearch = new window.BMapGL.LocalSearch(mapInstance.value, {
            onSearchComplete: (results: any) => {
                if (localSearch.getStatus() === window.BMAP_STATUS_SUCCESS) {
                    const poi = results.getPoi(0)
                    if (poi) {
                        const lat = poi.point.lat.toFixed(6)
                        const lng = poi.point.lng.toFixed(6)
                        const name = poi.title || searchQuery.value
                        
                        setLocation(lat, lng, name)
                        success(`找到位置: ${name}`)
                    }
                }
            }
        })
        localSearch.search(searchQuery.value)
    }
    
    showSuggestions.value = false
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
        case 'email':
            return `mailto:${emailTo.value}?subject=${encodeURIComponent(emailSubject.value)}&body=${encodeURIComponent(emailBody.value)}`
        case 'phone':
            return `tel:${phoneNumber.value}`
        case 'sms':
            return `sms:${smsNumber.value}?body=${encodeURIComponent(smsMessage.value)}`
        case 'location':
            const lat = locationLat.value
            const lng = locationLng.value
            const name = locationName.value
            
            switch (locationFormat.value) {
                case 'geo':
                    if (name) {
                        return `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`
                    } else {
                        return `geo:${lat},${lng}`
                    }
                case 'google':
                    if (name) {
                        return `https://maps.google.com/maps?q=${lat},${lng}(${encodeURIComponent(name)})`
                    } else {
                        return `https://maps.google.com/maps?q=${lat},${lng}`
                    }
                case 'baidu':
                    if (name) {
                        const lngNum = parseFloat(lng)
                        const latNum = parseFloat(lat)
                        return `https://map.baidu.com/search/${encodeURIComponent(name)}/@${lng},${lat},15z?querytype=s&da_src=shareurl&wd=${encodeURIComponent(name)}&c=1&src=0&pn=0&sug=0&l=15&b=(${lngNum-0.01},${latNum-0.01};${lngNum+0.01},${latNum+0.01})&from=webmap&biz_forward=%7B%22scaler%22:1,%22styles%22:%22pl%22%7D`
                    } else {
                        return `https://map.baidu.com/@${lng},${lat},15z`
                    }
                case 'amap':
                    if (name) {
                        return `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(name)}`
                    } else {
                        return `https://uri.amap.com/marker?position=${lng},${lat}`
                    }
                case 'tencent':
                    if (name) {
                        return `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};title:${encodeURIComponent(name)}`
                    } else {
                        return `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng}`
                    }
                case 'text':
                    if (name) {
                        return `位置：${name}\n纬度：${lat}\n经度：${lng}`
                    } else {
                        return `纬度：${lat}\n经度：${lng}`
                    }
                default:
                    return `geo:${lat},${lng}`
            }
        default:
            return ''
    }
}

// 生成二维码
const generateQR = async () => {
    const content = getCurrentContent()
    
    if (selectedType.value === 'location' && (!locationLat.value || !locationLng.value)) {
        qrDataURL.value = ''
        encodingContent.value = ''
        encodingLength.value = ''
        return
    }
    
    if (!content.trim()) {
        qrDataURL.value = ''
        encodingContent.value = ''
        encodingLength.value = ''
        return
    }

    // 更新编码信息
    encodingContent.value = content.length > 20 ? content.substring(0, 20) + '...' : content
    encodingLength.value = content.length.toString()

    try {
        const options = {
            width: parseInt(qrSize.value),
            margin: parseInt(qrMargin.value),
            errorCorrectionLevel: errorCorrectionLevel.value as 'L' | 'M' | 'Q' | 'H',
            version: qrVersion.value === 'auto' ? undefined : parseInt(qrVersion.value),
            color: {
                dark: foregroundColor.value,
                light: backgroundColor.value
            }
        }

        // 生成基础二维码
        const baseQR = await QRCode.toDataURL(content, options)
        
        // 应用高级样式（码点码眼）
        let styledQR = baseQR
        if (dotStyle.value !== 'square' || cornerStyle.value !== 'square' || eyePattern.value !== 'normal') {
            styledQR = await applyAdvancedStyles(baseQR)
        }
        
        // 如果有Logo，则合成Logo到二维码中心
        if (logoImage.value) {
            qrDataURL.value = await addLogoToQR(styledQR)
        } else {
            qrDataURL.value = styledQR
        }
    } catch (err) {
        console.error('生成二维码失败:', err)
        error('生成二维码失败')
    }
}

// 应用高级样式（码点码眼）
const applyAdvancedStyles = async (qrDataURL: string): Promise<string> => {
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

            // 绘制背景
            ctx.fillStyle = backgroundColor.value
            ctx.fillRect(0, 0, size, size)

            // 获取原始图像数据
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            if (!tempCtx) {
                resolve(qrDataURL)
                return
            }
            
            tempCanvas.width = size
            tempCanvas.height = size
            tempCtx.drawImage(qrImage, 0, 0, size, size)
            
            const imageData = tempCtx.getImageData(0, 0, size, size)
            const data = imageData.data
            
            // 计算模块大小（假设标准21x21模块加边距）
            const margin = parseInt(qrMargin.value)
            const moduleSize = (size - 2 * margin * 4) / 21 // 简化计算
            const startX = margin * 4
            const startY = margin * 4
            
            // 绘制码点
            for (let y = 0; y < size; y += Math.max(1, Math.floor(moduleSize))) {
                for (let x = 0; x < size; x += Math.max(1, Math.floor(moduleSize))) {
                    const pixelIndex = (y * size + x) * 4
                    if (pixelIndex >= 0 && pixelIndex < data.length) {
                        const isDark = (data[pixelIndex] ?? 255) < 128 // 判断是否为暗色模块
                        
                        if (isDark) {
                            // 检查是否在码眼区域
                            const isInEye = isInEyeArea(x, y, startX, startY, moduleSize)
                            
                            if (isInEye && eyePattern.value !== 'normal') {
                                // 使用码眼形状样式
                                ctx.fillStyle = foregroundColor.value
                            } else if (isInEye && eyeColor.value === 'auto') {
                                // 使用自定义码眼颜色
                                const isOuterEye = isInOuterEye(x, y, startX, startY, moduleSize)
                                ctx.fillStyle = isOuterEye ? outerEyeColor.value : innerEyeColor.value
                            } else {
                                ctx.fillStyle = foregroundColor.value
                            }
                            
                            // 根据样式绘制模块
                            if (isInEye) {
                                // 码眼区域使用码眼形状
                                drawModule(ctx, x, y, moduleSize, eyePattern.value)
                            } else {
                                // 普通区域使用码点形状
                                drawModule(ctx, x, y, moduleSize, dotStyle.value)
                            }
                        }
                    }
                }
            }
            
            resolve(canvas.toDataURL('image/png'))
        }
        qrImage.onerror = () => resolve(qrDataURL) // 如果失败，返回原始图像
        qrImage.src = qrDataURL
    })
}

// 判断是否在码眼区域
const isInEyeArea = (x: number, y: number, startX: number, startY: number, moduleSize: number): boolean => {
    const moduleX = Math.floor((x - startX) / moduleSize)
    const moduleY = Math.floor((y - startY) / moduleSize)
    
    // 三个码眼的位置（简化）
    const eyePositions = [
        { x: 0, y: 0 },     // 左上
        { x: 14, y: 0 },    // 右上
        { x: 0, y: 14 }     // 左下
    ]
    
    for (const eye of eyePositions) {
        if (moduleX >= eye.x && moduleX < eye.x + 7 && 
            moduleY >= eye.y && moduleY < eye.y + 7) {
            return true
        }
    }
    
    return false
}

// 判断是否在码眼外圈
const isInOuterEye = (x: number, y: number, startX: number, startY: number, moduleSize: number): boolean => {
    const moduleX = Math.floor((x - startX) / moduleSize)
    const moduleY = Math.floor((y - startY) / moduleSize)
    
    const eyePositions = [
        { x: 0, y: 0 },
        { x: 14, y: 0 },
        { x: 0, y: 14 }
    ]
    
    for (const eye of eyePositions) {
        const relX = moduleX - eye.x
        const relY = moduleY - eye.y
        
        if (relX >= 0 && relX < 7 && relY >= 0 && relY < 7) {
            // 外圈：边框
            if (relX === 0 || relX === 6 || relY === 0 || relY === 6) {
                return true
            }
            // 内圈：中心3x3区域的边框
            if ((relX >= 2 && relX <= 4) && (relY >= 2 && relY <= 4)) {
                if (relX === 2 || relX === 4 || relY === 2 || relY === 4) {
                    return true
                }
            }
        }
    }
    
    return false
}

// 绘制模块
const drawModule = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: string) => {
    const actualSize = Math.max(1, Math.floor(size * 0.9)) // 稍微缩小以避免重叠
    
    switch (style) {
        case 'circle':
            ctx.beginPath()
            ctx.arc(x + size/2, y + size/2, actualSize/2, 0, 2 * Math.PI)
            ctx.fill()
            break
        case 'rounded':
            const radius = actualSize * 0.2
            ctx.beginPath()
            // 手动绘制圆角矩形
            const rectX = x + (size-actualSize)/2
            const rectY = y + (size-actualSize)/2
            ctx.moveTo(rectX + radius, rectY)
            ctx.lineTo(rectX + actualSize - radius, rectY)
            ctx.quadraticCurveTo(rectX + actualSize, rectY, rectX + actualSize, rectY + radius)
            ctx.lineTo(rectX + actualSize, rectY + actualSize - radius)
            ctx.quadraticCurveTo(rectX + actualSize, rectY + actualSize, rectX + actualSize - radius, rectY + actualSize)
            ctx.lineTo(rectX + radius, rectY + actualSize)
            ctx.quadraticCurveTo(rectX, rectY + actualSize, rectX, rectY + actualSize - radius)
            ctx.lineTo(rectX, rectY + radius)
            ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY)
            ctx.closePath()
            ctx.fill()
            break
        case 'horizontal':
            // 横条纹
            const hStripeHeight = actualSize / 3
            for (let i = 0; i < 3; i++) {
                if (i % 2 === 0) {
                    ctx.fillRect(x + (size-actualSize)/2, y + (size-actualSize)/2 + i * hStripeHeight, actualSize, hStripeHeight)
                }
            }
            break
        case 'vertical':
            // 竖条纹
            const vStripeWidth = actualSize / 3
            for (let i = 0; i < 3; i++) {
                if (i % 2 === 0) {
                    ctx.fillRect(x + (size-actualSize)/2 + i * vStripeWidth, y + (size-actualSize)/2, vStripeWidth, actualSize)
                }
            }
            break
        case 'diamond':
            // 菱形
            ctx.beginPath()
            const centerX = x + size/2
            const centerY = y + size/2
            const halfSize = actualSize/2
            ctx.moveTo(centerX, centerY - halfSize)
            ctx.lineTo(centerX + halfSize, centerY)
            ctx.lineTo(centerX, centerY + halfSize)
            ctx.lineTo(centerX - halfSize, centerY)
            ctx.closePath()
            ctx.fill()
            break
        case 'leaf':
            // 叶形（椭圆）
            ctx.beginPath()
            ctx.ellipse(x + size/2, y + size/2, actualSize/2, actualSize/3, 0, 0, 2 * Math.PI)
            ctx.fill()
            break
        case 'liquid':
            // 液化效果 - 不规则圆形
            ctx.beginPath()
            const liquidRadius = actualSize/2
            const centerLiquidX = x + size/2
            const centerLiquidY = y + size/2
            for (let angle = 0; angle < 2 * Math.PI; angle += 0.1) {
                const r = liquidRadius * (0.8 + 0.2 * Math.sin(angle * 5))
                const px = centerLiquidX + r * Math.cos(angle)
                const py = centerLiquidY + r * Math.sin(angle)
                if (angle === 0) {
                    ctx.moveTo(px, py)
                } else {
                    ctx.lineTo(px, py)
                }
            }
            ctx.closePath()
            ctx.fill()
            break
        case 'round-liquid':
            // 圆液化 - 多个小圆组成
            const dotRadius = actualSize / 6
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if ((i + j) % 2 === 0) {
                        ctx.beginPath()
                        ctx.arc(
                            x + (size-actualSize)/2 + (i + 0.5) * actualSize/3,
                            y + (size-actualSize)/2 + (j + 0.5) * actualSize/3,
                            dotRadius,
                            0, 2 * Math.PI
                        )
                        ctx.fill()
                    }
                }
            }
            break
        case 'stripe':
            // 条纹效果
            const stripeWidth = actualSize / 5
            for (let i = 0; i < 5; i++) {
                if (i % 2 === 0) {
                    ctx.fillRect(
                        x + (size-actualSize)/2 + i * stripeWidth,
                        y + (size-actualSize)/2,
                        stripeWidth,
                        actualSize
                    )
                }
            }
            break
        case 'tile':
            // 瓷砖效果
            const tileSize = actualSize / 3
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if ((i + j) % 2 === 0) {
                        ctx.fillRect(
                            x + (size-actualSize)/2 + i * tileSize,
                            y + (size-actualSize)/2 + j * tileSize,
                            tileSize,
                            tileSize
                        )
                    }
                }
            }
            break
        case 'big-dot':
            // 大圆点
            ctx.beginPath()
            ctx.arc(x + size/2, y + size/2, actualSize * 0.4, 0, 2 * Math.PI)
            ctx.fill()
            break
        case 'small-dot':
            // 小圆点
            ctx.beginPath()
            ctx.arc(x + size/2, y + size/2, actualSize * 0.3, 0, 2 * Math.PI)
            ctx.fill()
            break
        case 'star':
            // 粗星形
            drawStar(ctx, x + size/2, y + size/2, 5, actualSize/2, actualSize/4)
            break
        case 'fine-star':
            // 细星形
            drawStar(ctx, x + size/2, y + size/2, 8, actualSize/2, actualSize/3)
            break
        case 'grid':
            // 网格效果
            const gridLineWidth = 1
            const gridCellSize = actualSize / 3
            // 绘制网格线
            ctx.fillRect(x + (size-actualSize)/2, y + (size-actualSize)/2, actualSize, gridLineWidth)
            ctx.fillRect(x + (size-actualSize)/2, y + (size-actualSize)/2 + gridCellSize, actualSize, gridLineWidth)
            ctx.fillRect(x + (size-actualSize)/2, y + (size-actualSize)/2 + 2*gridCellSize, actualSize, gridLineWidth)
            ctx.fillRect(x + (size-actualSize)/2, y + (size-actualSize)/2, gridLineWidth, actualSize)
            ctx.fillRect(x + (size-actualSize)/2 + gridCellSize, y + (size-actualSize)/2, gridLineWidth, actualSize)
            ctx.fillRect(x + (size-actualSize)/2 + 2*gridCellSize, y + (size-actualSize)/2, gridLineWidth, actualSize)
            break
        case 'small-square':
            // 小方点
            const smallSquareSize = actualSize / 4
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    ctx.fillRect(
                        x + (size-actualSize)/2 + i * actualSize/2 + actualSize/4 - smallSquareSize/2,
                        y + (size-actualSize)/2 + j * actualSize/2 + actualSize/4 - smallSquareSize/2,
                        smallSquareSize,
                        smallSquareSize
                    )
                }
            }
            break
        case 'dot':
            // 圆点
            ctx.beginPath()
            ctx.arc(x + size/2, y + size/2, actualSize * 0.35, 0, 2 * Math.PI)
            ctx.fill()
            break
        case 'star':
            // 星形
            drawStar(ctx, x + size/2, y + size/2, 5, actualSize/2, actualSize/4)
            break
        case 'liquid':
            // 液化效果 - 不规则圆形
            ctx.beginPath()
            const dotLiquidRadius = actualSize/2
            const dotCenterX = x + size/2
            const dotCenterY = y + size/2
            for (let angle = 0; angle < 2 * Math.PI; angle += 0.2) {
                const r = dotLiquidRadius * (0.7 + 0.3 * Math.sin(angle * 3))
                const px = dotCenterX + r * Math.cos(angle)
                const py = dotCenterY + r * Math.sin(angle)
                if (angle === 0) {
                    ctx.moveTo(px, py)
                } else {
                    ctx.lineTo(px, py)
                }
            }
            ctx.closePath()
            ctx.fill()
            break
        case 'tile':
            // 瓷砖效果
            const dotTileSize = actualSize / 2
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    if ((i + j) % 2 === 0) {
                        ctx.fillRect(
                            x + (size-actualSize)/2 + i * dotTileSize,
                            y + (size-actualSize)/2 + j * dotTileSize,
                            dotTileSize,
                            dotTileSize
                        )
                    }
                }
            }
            break
        case 'grid':
            // 网格效果
            const dotGridLineWidth = Math.max(1, actualSize / 8)
            const dotGridCellSize = actualSize / 3
            // 绘制网格线
            for (let i = 0; i <= 3; i++) {
                // 水平线
                ctx.fillRect(
                    x + (size-actualSize)/2, 
                    y + (size-actualSize)/2 + i * dotGridCellSize - dotGridLineWidth/2, 
                    actualSize, 
                    dotGridLineWidth
                )
                // 垂直线
                ctx.fillRect(
                    x + (size-actualSize)/2 + i * dotGridCellSize - dotGridLineWidth/2, 
                    y + (size-actualSize)/2, 
                    dotGridLineWidth, 
                    actualSize
                )
            }
            break
        case 'small-square':
            // 小方点
            const dotSmallSquareSize = actualSize / 3
            ctx.fillRect(
                x + (size-actualSize)/2 + actualSize/2 - dotSmallSquareSize/2,
                y + (size-actualSize)/2 + actualSize/2 - dotSmallSquareSize/2,
                dotSmallSquareSize,
                dotSmallSquareSize
            )
            break
        default: // square 和 normal
            ctx.fillRect(x + (size-actualSize)/2, y + (size-actualSize)/2, actualSize, actualSize)
            break
    }
}

// 绘制星形
const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
    let rot = Math.PI / 2 * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius
        y = cy + Math.sin(rot) * outerRadius
        ctx.lineTo(x, y)
        rot += step

        x = cx + Math.cos(rot) * innerRadius
        y = cy + Math.sin(rot) * innerRadius
        ctx.lineTo(x, y)
        rot += step
    }
    
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.fill()
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
        error('请上传图片文件')
        return
    }

    // 检查文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
        error('图片文件不能超过5MB')
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        logoImage.value = e.target?.result as string
        generateQR()
        success('Logo已上传')
    }
    reader.onerror = () => {
        error('Logo上传失败')
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
    success('Logo已移除')
}

// 下载二维码
const downloadQR = () => {
    if (!qrDataURL.value) return
    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = qrDataURL.value
    link.click()
    success('二维码已下载')
}

// 复制二维码
const copyQR = async () => {
    if (!qrDataURL.value) return
    try {
        const response = await fetch(qrDataURL.value)
        const blob = await response.blob()
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        success('二维码已复制到剪贴板')
    } catch (err) {
        error('复制失败')
    }
}

// 获取扫描提示
const getScanTip = (): string => {
    switch (selectedType.value) {
        case 'text':
        case 'url':
            return '使用任意二维码扫描应用或手机相机扫描'
        case 'wifi':
            return '使用手机相机或支持WiFi连接的扫描应用扫描'
        case 'contact':
            return '使用手机相机扫描，可直接添加到通讯录'
        case 'email':
            return '使用手机扫描，会自动打开邮件应用'
        case 'phone':
            return '使用手机扫描，会自动拨打电话'
        case 'sms':
            return '使用手机扫描，会自动打开短信应用'
        case 'location':
            switch (locationFormat.value) {
                case 'tencent':
                    return '使用微信扫描，会在腾讯地图中显示位置'
                case 'baidu':
                    return '使用百度APP扫描，会在百度地图中显示位置'
                case 'amap':
                    return '使用支付宝扫描，会在高德地图中显示位置'
                case 'google':
                    return '使用手机相机扫描，会在谷歌地图中显示位置'
                case 'geo':
                    return '使用手机相机扫描，会在默认地图应用中显示位置'
                case 'text':
                    return '使用任意扫描应用，会显示位置文本信息'
                default:
                    return '使用手机相机或地图应用扫描'
            }
        default:
            return '使用手机相机或二维码扫描应用扫描'
    }
}

// 获取容错率名称
const getErrorCorrectionName = (): string => {
    switch (errorCorrectionLevel.value) {
        case 'L': return '低 (7%)'
        case 'M': return '中 (15%)'
        case 'Q': return '高 (25%)'
        case 'H': return '最高 (30%)'
        default: return '中 (15%)'
    }
}

// 测试链接
const testLink = () => {
    const content = getCurrentContent()
    try {
        window.open(content, '_blank')
        success('已尝试打开链接')
    } catch (err) {
        error('无法打开链接，请在手机上扫描二维码测试')
    }
}

// 清空所有
// 清空所有
const clearAll = () => {
    textContent.value = ''
    urlContent.value = ''
    wifiSSID.value = ''
    wifiPassword.value = ''
    wifiSecurity.value = 'WPA'
    contactName.value = ''
    contactPhone.value = ''
    contactEmail.value = ''
    emailTo.value = ''
    emailSubject.value = ''
    emailBody.value = ''
    phoneNumber.value = ''
    smsNumber.value = ''
    smsMessage.value = ''
    locationLat.value = ''
    locationLng.value = ''
    locationName.value = ''
    locationFormat.value = 'tencent'
    logoImage.value = ''
    qrDataURL.value = ''
    selectedType.value = 'text'
    qrVersion.value = 'auto'
    qrMargin.value = '4'
    errorCorrectionLevel.value = 'M'
    dotStyle.value = 'square'
    cornerStyle.value = 'square'
    eyePattern.value = 'normal'
    encodingContent.value = ''
    encodingLength.value = ''
    logoSize.value = 20
    if (logoInput.value) {
        logoInput.value.value = ''
    }
    success('已清空所有内容')
}

// 初始化
onMounted(() => {
    textContent.value = '欢迎使用二维码生成器！'
    generateQR()
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

.generator-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border-color);
    min-height: 0;
}

.input-section, .preview-section {
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}

.input-section {
    overflow-y: auto;
    padding-bottom: 20px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    flex-shrink: 0;
    height: 52px;
    box-sizing: border-box;
}

.section-header h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
}

.type-selector {
    display: flex;
    gap: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    height: 26px;
}

.type-btn {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 0 6px;
    background: transparent;
    border: none;
    border-right: 1px solid var(--border-color);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 9px;
    white-space: nowrap;
    flex-shrink: 0;
    height: 26px;
}

.type-btn:last-child {
    border-right: none;
}

.type-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.type-btn.active {
    background: var(--primary-color);
    color: white;
}

.type-icon {
    font-size: 16px;
}

.type-name {
    font-size: 10px;
    font-weight: 500;
}

.content-area {
    padding: 20px;
    overflow: visible;
    margin-bottom: 16px;
}

.input-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.form-textarea, .form-input, .form-select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 14px;
    transition: all 0.2s ease;
}

.form-textarea {
    min-height: 120px;
    resize: vertical;
}

.form-textarea:focus, .form-input:focus, .form-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

/* 位置类型特殊间距 */
.input-form .form-group:last-child {
    margin-bottom: 0;
}

.input-form .map-selector {
    margin-top: -4px;
}

.map-selector {
    margin: 0;
}

.map-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
}

.map-controls {
    display: flex;
    gap: 6px;
    align-items: center;
}

.search-wrapper {
    position: relative;
    flex: 1;
}

.location-format-wrapper {
    margin-left: 8px;
    flex-shrink: 0;
}

.format-select {
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 13px;
    min-width: 100px;
    height: 36px;
    box-sizing: border-box;
}

.search-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 13px;
    width: 100%;
}

.suggestions-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-top: none;
    border-radius: 0 0 6px 6px;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s ease;
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-item:hover {
    background: var(--bg-hover);
}

.suggestion-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 2px;
}

.suggestion-address {
    font-size: 11px;
    color: var(--text-secondary);
}

.search-btn, .location-btn {
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 12px;
}

.search-btn:hover, .location-btn:hover {
    background: var(--primary-color);
    color: white;
}

.map-container {
    position: relative;
    width: 100%;
    height: 300px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    background: var(--bg-secondary);
}

.map-canvas {
    width: 100%;
    height: 100%;
}

.map-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
}

.loading-text {
    font-size: 13px;
    color: var(--text-secondary);
}

.location-info {
    margin-top: 12px;
    padding: 12px;
    background: var(--bg-tertiary);
    border-radius: 6px;
    border: 1px solid var(--border-color);
}

.location-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.location-item:last-child {
    margin-bottom: 0;
}

.location-label {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
}

.location-value {
    font-size: 12px;
    color: var(--text-primary);
    font-family: monospace;
}

.preview-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.qr-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.qr-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.qr-image {
    max-width: 100%;
    max-height: 300px;
    border-radius: 4px;
}

.qr-info {
    text-align: center;
    max-width: 300px;
}

.qr-content {
    font-size: 13px;
    color: var(--text-primary);
    font-weight: 500;
    word-break: break-all;
    line-height: 1.3;
    margin-bottom: 12px;
}

.qr-stats {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
    padding: 8px;
    background: var(--bg-tertiary);
    border-radius: 6px;
    border: 1px solid var(--border-color);
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.stat-label {
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 500;
}

.stat-value {
    font-size: 11px;
    color: var(--text-primary);
    font-weight: 600;
    font-family: monospace;
}

.scan-tip {
    font-size: 12px;
    color: var(--primary-color);
    font-weight: 600;
    background: var(--primary-color-alpha);
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    padding: 6px 10px;
    line-height: 1.3;
    text-align: center;
    white-space: nowrap;
    flex-shrink: 0;
}

.test-link-btn {
    padding: 6px 12px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.test-link-btn:hover {
    background: var(--primary-color-dark);
}

.preview-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    color: var(--text-secondary);
    text-align: center;
}

.preview-placeholder h4 {
    margin: 0;
    font-size: 16px;
}

.preview-placeholder p {
    margin: 0;
    font-size: 13px;
}

/* 样式设置面板 */
.settings-panel {
    padding: 12px 20px 20px 20px;
    margin-top: 16px;
    border-top: 1px solid var(--border-color);
    background: var(--bg-secondary);
    width: 100%;
    box-sizing: border-box;
    position: relative;
    left: 0;
    right: auto;
}

.settings-panel h3 {
    margin: 0 0 16px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
}

.settings-section {
    margin-bottom: 16px;
}

.section-title {
    margin: 0 0 8px 0;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 4px;
}

/* 预设样式 */
.preset-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 4px;
}

.preset-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 6px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 10px;
}

.preset-btn:hover {
    border-color: var(--primary-color);
    background: var(--bg-hover);
}

.preset-preview {
    width: 24px;
    height: 24px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    position: relative;
}

.preset-preview.preset-classic {
    background: 
        linear-gradient(45deg, #000 25%, transparent 25%), 
        linear-gradient(-45deg, #000 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #000 75%), 
        linear-gradient(-45deg, transparent 75%, #000 75%);
    background-size: 4px 4px;
    background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
}

.preset-preview.preset-modern {
    background: radial-gradient(circle, #2563eb 30%, transparent 30%);
    background-size: 4px 4px;
}

.preset-preview.preset-artistic {
    background: #7c3aed;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.preset-preview.preset-minimal {
    background: #374151;
    border-radius: 6px;
}

.preset-name {
    font-size: 9px;
    color: var(--text-secondary);
    text-align: center;
    line-height: 1;
}

/* 基本样式区域 */
.style-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.style-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.style-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.style-item.full-width {
    grid-column: 1 / -1;
}

.style-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-primary);
}

.color-picker-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-primary);
    cursor: pointer;
    position: relative;
}

.color-picker-wrapper:hover {
    border-color: var(--primary-color);
}

.color-preview {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    border: 1px solid var(--border-color);
    cursor: pointer;
}

.color-input-hidden {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.style-select-wrapper {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-primary);
    cursor: pointer;
}

.shape-preview {
    width: 16px;
    height: 16px;
    border: 1px solid var(--border-color);
}

.shape-preview.square {
    background: #000;
}

.shape-preview.eye-square {
    background: #000;
    position: relative;
}

.shape-preview.eye-square::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: white;
}

/* 码眼样式网格 */
.eye-pattern-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
    margin-top: 4px;
}

.eye-pattern-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 6px 4px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--bg-primary);
}

.eye-pattern-item:hover {
    border-color: var(--primary-color);
    background: var(--bg-hover);
}

.eye-pattern-item.active {
    border-color: var(--primary-color);
    background: var(--primary-color-alpha);
}

.pattern-preview {
    width: 20px;
    height: 20px;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    background: var(--text-primary);
    position: relative;
}

/* 不同样式的预览 */
.pattern-preview.pattern-normal {
    background: #000;
}

.pattern-preview.pattern-liquid {
    background: linear-gradient(45deg, #000 25%, #333 25%, #333 50%, #000 50%, #000 75%, #333 75%);
    background-size: 4px 4px;
}

.pattern-preview.pattern-round-liquid {
    background: radial-gradient(circle, #000 30%, #333 70%);
}

.pattern-preview.pattern-stripe {
    background: repeating-linear-gradient(0deg, #000 0px, #000 2px, #666 2px, #666 4px);
}

.pattern-preview.pattern-horizontal {
    background: repeating-linear-gradient(0deg, #000 0px, #000 3px, transparent 3px, transparent 6px);
}

.pattern-preview.pattern-vertical {
    background: repeating-linear-gradient(90deg, #000 0px, #000 3px, transparent 3px, transparent 6px);
}

.pattern-preview.pattern-tile {
    background: 
        linear-gradient(45deg, #000 25%, transparent 25%), 
        linear-gradient(-45deg, #000 25%, transparent 25%), 
        linear-gradient(45deg, transparent 75%, #000 75%), 
        linear-gradient(-45deg, transparent 75%, #000 75%);
    background-size: 4px 4px;
    background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
}

.pattern-preview.pattern-big-dot {
    background: radial-gradient(circle, #000 40%, transparent 40%);
    background-size: 6px 6px;
}

.pattern-preview.pattern-small-dot {
    background: radial-gradient(circle, #000 30%, transparent 30%);
    background-size: 4px 4px;
}

.pattern-preview.pattern-star {
    background: #000;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.pattern-preview.pattern-fine-star {
    background: #000;
    clip-path: polygon(50% 0%, 55% 40%, 100% 40%, 65% 65%, 80% 100%, 50% 80%, 20% 100%, 35% 65%, 0% 40%, 45% 40%);
}

.pattern-preview.pattern-grid {
    background: 
        linear-gradient(to right, #000 1px, transparent 1px),
        linear-gradient(to bottom, #000 1px, transparent 1px);
    background-size: 4px 4px;
}

.pattern-preview.pattern-diamond {
    background: #000;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.pattern-preview.pattern-small-square {
    background: 
        radial-gradient(circle at 25% 25%, #000 20%, transparent 20%),
        radial-gradient(circle at 75% 75%, #000 20%, transparent 20%);
    background-size: 8px 8px;
}

.pattern-preview.pattern-custom {
    background: linear-gradient(45deg, var(--primary-color), var(--primary-color-dark));
}

.pattern-name {
    font-size: 9px;
    color: var(--text-secondary);
    text-align: center;
    line-height: 1;
}

/* 更新形状预览样式 */
.shape-preview.dot-square {
    background: #000;
}

.shape-preview.dot-circle {
    background: #000;
    border-radius: 50%;
}

.shape-preview.dot-rounded {
    background: #000;
    border-radius: 3px;
}

.shape-preview.dot-horizontal {
    background: repeating-linear-gradient(0deg, #000 0px, #000 2px, transparent 2px, transparent 4px);
}

.shape-preview.dot-vertical {
    background: repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px);
}

.shape-preview.dot-diamond {
    background: #000;
    transform: rotate(45deg);
}

.shape-preview.eye-square {
    background: #000;
    position: relative;
}

.shape-preview.eye-square::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: white;
}

.shape-preview.eye-circle {
    background: #000;
    border-radius: 50%;
    position: relative;
}

.shape-preview.eye-circle::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
}

.shape-preview.eye-rounded {
    background: #000;
    border-radius: 3px;
    position: relative;
}

.shape-preview.eye-rounded::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 1px;
}

.shape-preview.eye-leaf {
    background: #000;
    border-radius: 50% 0;
    position: relative;
}

.shape-preview.eye-leaf::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50% 0;
}

.eye-color-options {
    display: flex;
    gap: 12px;
}

.eye-color-option {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 11px;
}

.eye-color-option input[type="radio"] {
    display: none;
}

.checkmark {
    width: 12px;
    height: 12px;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    position: relative;
}

.eye-color-option input[type="radio"]:checked + .checkmark {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

.eye-color-option input[type="radio"]:checked + .checkmark::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
}

.style-item.full-width {
    grid-column: 1 / -1;
}

.style-select,
.style-input {
    padding: 4px 6px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 11px;
}

.full-width-select {
    width: 100%;
    padding: 6px 8px;
    font-size: 12px;
}

/* Logo设置 */
.logo-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.logo-upload-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 11px;
}

.logo-upload-btn:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
}

.logo-preview {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
}

.logo-image {
    width: 20px;
    height: 20px;
    object-fit: contain;
    border-radius: 2px;
    background: white;
}

.logo-info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo-name {
    font-size: 10px;
    color: var(--text-primary);
    font-weight: 500;
}

.logo-remove-btn {
    padding: 2px 6px;
    background: var(--error-color);
    color: white;
    border: none;
    border-radius: 3px;
    font-size: 9px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.logo-remove-btn:hover {
    background: var(--error-color-dark);
}

.logo-size-control {
    margin-top: 6px;
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
    background: var(--bg-primary);
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
</style>