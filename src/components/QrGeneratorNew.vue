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
                        <div class="form-group">
                            <label class="form-label">位置格式</label>
                            <select v-model="locationFormat" class="form-select" @change="generateQR">
                                <option value="tencent">腾讯地图</option>
                                <option value="baidu">百度地图</option>
                                <option value="amap">高德地图</option>
                                <option value="google">谷歌地图</option>
                                <option value="geo">Geo格式 (geo:lat,lng)</option>
                                <option value="text">纯文本格式</option>
                            </select>
                        </div>
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
                    
                    <!-- 基本样式 -->
                    <div class="settings-section">
                        <h4 class="section-title">基本样式</h4>
                        <div class="style-grid">
                            <div class="style-row">
                                <div class="style-item">
                                    <label class="style-label">点阵颜色:</label>
                                    <div class="color-picker-wrapper">
                                        <div class="color-preview" :style="{ backgroundColor: foregroundColor }"></div>
                                        <input 
                                            v-model="foregroundColor" 
                                            type="color" 
                                            class="color-input-hidden"
                                            @change="generateQR"
                                        />
                                        <span class="color-text">{{ foregroundColor.toUpperCase() }}</span>
                                    </div>
                                </div>
                                <div class="style-item">
                                    <label class="style-label">背景色:</label>
                                    <div class="color-picker-wrapper">
                                        <div class="color-preview" :style="{ backgroundColor: backgroundColor }"></div>
                                        <input 
                                            v-model="backgroundColor" 
                                            type="color" 
                                            class="color-input-hidden"
                                            @change="generateQR"
                                        />
                                        <span class="color-text">{{ backgroundColor.toUpperCase() }}</span>
                                    </div>
                                </div>
                            </div>
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
const encodingContent = ref('')
const encodingLength = ref('')

// Logo相关
const logoImage = ref('')
const logoSize = ref(20)
const logoInput = ref<HTMLInputElement | null>(null)

// 二维码数据
const qrDataURL = ref('')

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
                        return `https://map.baidu.com/search/${encodeURIComponent(name)}/@${lng},${lat},15z?querytype=s&da_src=shareurl&wd=${encodeURIComponent(name)}&c=1&src=0&pn=0&sug=0&l=15&b=(${lng-0.01},${lat-0.01};${lng+0.01},${lat+0.01})&from=webmap&biz_forward=%7B%22scaler%22:1,%22styles%22:%22pl%22%7D`
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
        
        // 如果有Logo，则合成Logo到二维码中心
        if (logoImage.value) {
            qrDataURL.value = await addLogoToQR(baseQR)
        } else {
            qrDataURL.value = baseQR
        }
    } catch (err) {
        console.error('生成二维码失败:', err)
        error('生成二维码失败')
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
}

.search-wrapper {
    position: relative;
    flex: 1;
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
    margin-bottom: 8px;
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

.color-text {
    font-size: 10px;
    color: var(--text-secondary);
    font-family: monospace;
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