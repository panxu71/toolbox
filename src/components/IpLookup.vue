<template>
    <div class="ip-lookup">
        <!-- 使用公共组件PageHeader -->
        <PageHeader :title="pageTitle" @back="$emit('back')" />

        <div class="converter-content">
            <div class="content-wrapper">
                <!-- 当前IP信息 -->
                <div class="current-ip-section">
                    <div class="section-header">
                        <h2>当前IP信息</h2>
                        <div class="api-source-selector">
                            <label for="api-source">第二数据源：</label>
                            <div class="select-wrapper">
                                <select id="api-source" v-model="selectedApiSource" @change="switchSecondSource"
                                    class="source-select">
                                    <option v-for="source in apiSources" :key="source.id" :value="source.id">
                                        {{ source.name }} - {{ source.description }}
                                    </option>
                                </select>
                                <svg class="select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <polyline points="6,9 12,15 18,9"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div v-if="currentIpInfo.length > 0" class="api-results">
                        <div v-for="(info, index) in currentIpInfo" :key="index" class="ip-card"
                            :class="{ 'primary-source': (info.source && info.source === 'IP.me'), 'loading-card': info.loading }">
                            <div class="source-header">
                                <span class="source-name" :class="{ 'skeleton-text': info.loading }">{{ info.loading ?
                                    '' :
                                    (info.source || '未知来源') }}</span>
                                <span v-if="info.source && info.source === 'IP.me' && !info.loading"
                                    class="primary-badge">推荐</span>
                                <span v-if="info.error && !info.loading" class="error-badge">失败</span>
                            </div>

                            <!-- 骨架屏状态 -->
                            <div v-if="info.loading" class="skeleton-content">
                                <div class="skeleton-ip"></div>
                                <div class="skeleton-location"></div>
                                <div class="skeleton-details">
                                    <div class="skeleton-detail-item"></div>
                                    <div class="skeleton-detail-item"></div>
                                    <div class="skeleton-detail-item"></div>
                                </div>
                            </div>

                            <!-- 正常内容 -->
                            <div v-else-if="!info.error" class="ip-main">
                                <div class="ip-address-container">
                                    <div class="ip-address">{{ info.ip }}</div>
                                    <button @click="copyIpAddress(info.ip)" class="copy-btn" title="复制IP地址">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- 错误状态 -->
                            <div v-else class="error-info">
                                <div class="error-message">{{ info.error }}</div>
                                <a v-if="info.source?.includes('IP.me')" href="https://ip.me" target="_blank"
                                    class="visit-link">
                                    直接访问 IP.me
                                </a>
                            </div>

                            <!-- 详细信息 -->
                            <div v-if="!info.error && !info.loading" class="ip-details">
                                <div class="detail-item">
                                    <span class="label">国家/地区:</span>
                                    <span class="value">{{ info.country || '-' }}</span>
                                </div>
                                <div v-if="info.countryCode" class="detail-item">
                                    <span class="label">国家代码:</span>
                                    <span class="value">{{ info.countryCode }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">省份/州:</span>
                                    <span class="value">{{ info.region || '-' }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">城市:</span>
                                    <span class="value">{{ info.city || '-' }}</span>
                                </div>
                                <div v-if="info.postalCode" class="detail-item">
                                    <span class="label">邮政编码:</span>
                                    <span class="value">{{ info.postalCode }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">ISP:</span>
                                    <span class="value">{{ info.isp || '-' }}</span>
                                </div>
                                <div v-if="info.organization && info.organization !== info.isp" class="detail-item">
                                    <span class="label">组织:</span>
                                    <span class="value">{{ info.organization }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">时区:</span>
                                    <span class="value">{{ info.timezone || '-' }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">经纬度:</span>
                                    <span class="value">{{ (info.lat && info.lon) ? `${info.lat}, ${info.lon}` : '-'
                                    }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">ASN:</span>
                                    <span class="value">{{ info.asn || '-' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="loading" v-else-if="loadingCurrent">
                        <div class="spinner"></div>
                        <span>正在获取当前IP信息...</span>
                    </div>

                    <div class="error" v-else-if="currentError">
                        <span>{{ currentError }}</span>
                        <button @click="getCurrentIpInfo" class="retry-btn">重试</button>
                    </div>
                </div>

                <!-- IP查询工具 -->
                <div class="query-section">
                    <h2>IP地址查询</h2>
                    <div class="query-form">
                        <div class="input-group">
                            <input v-model="queryIp" type="text" placeholder="请输入要查询的IP地址，如：8.8.8.8"
                                @keyup.enter="queryIpInfo" :disabled="loadingQuery" />
                            <button @click="queryIpInfo" :disabled="!queryIp.trim() || loadingQuery" class="query-btn">
                                <span v-if="!loadingQuery">查询</span>
                                <div v-else class="spinner small"></div>
                            </button>
                        </div>
                        <div class="ip-examples">
                            <span>示例IP：</span>
                            <button @click="setExampleIp('8.8.8.8')" class="example-btn">8.8.8.8</button>
                            <button @click="setExampleIp('1.1.1.1')" class="example-btn">1.1.1.1</button>
                            <button @click="setExampleIp('114.114.114.114')"
                                class="example-btn">114.114.114.114</button>
                        </div>
                    </div>

                    <!-- 查询结果 -->
                    <div class="query-result" v-if="queryResult.length > 0">
                        <div class="api-results">
                            <div v-for="(info, index) in queryResult" :key="index" class="ip-card">
                                <div class="source-header">
                                    <span class="source-name">{{ info.source }}</span>
                                    <span v-if="info.error" class="error-badge">失败</span>
                                </div>

                                <div v-if="!info.error" class="ip-main">
                                    <div class="ip-address-container">
                                        <div class="ip-address">{{ info.ip }}</div>
                                        <button @click="copyIpAddress(info.ip)" class="copy-btn" title="复制IP地址">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div v-if="info.error" class="error-info">
                                    <div class="error-message">{{ info.error }}</div>
                                </div>

                                <div v-if="!info.error" class="ip-details">
                                    <div class="detail-item">
                                        <span class="label">国家/地区:</span>
                                        <span class="value">{{ info.country || '-' }}</span>
                                    </div>
                                    <div v-if="info.countryCode" class="detail-item">
                                        <span class="label">国家代码:</span>
                                        <span class="value">{{ info.countryCode }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="label">省份/州:</span>
                                        <span class="value">{{ info.region || '-' }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="label">城市:</span>
                                        <span class="value">{{ info.city || '-' }}</span>
                                    </div>
                                    <div v-if="info.postalCode" class="detail-item">
                                        <span class="label">邮政编码:</span>
                                        <span class="value">{{ info.postalCode }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="label">ISP:</span>
                                        <span class="value">{{ info.isp || '-' }}</span>
                                    </div>
                                    <div v-if="info.organization && info.organization !== info.isp" class="detail-item">
                                        <span class="label">组织:</span>
                                        <span class="value">{{ info.organization }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="label">时区:</span>
                                        <span class="value">{{ info.timezone || '-' }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="label">经纬度:</span>
                                        <span class="value">{{ (info.lat && info.lon) ? `${info.lat}, ${info.lon}` : '-'
                                        }}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="label">ASN:</span>
                                        <span class="value">{{ info.asn || '-' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="error" v-if="queryError">
                        <span>{{ queryError }}</span>
                    </div>
                </div>

                <!-- 查询历史 -->
                <div class="history-section" v-if="queryHistory.length > 0">
                    <h2>查询历史</h2>
                    <div class="history-list">
                        <div v-for="(item, index) in queryHistory" :key="index" class="history-item">
                            <div class="history-content" @click="setQueryIp(item.ip)">
                                <div class="history-ip">{{ item.ip }}</div>
                                <div class="history-location">{{ item.location }}</div>
                                <div class="history-time">{{ formatTime(item.timestamp) }}</div>
                            </div>
                            <button @click.stop="copyIpAddress(item.ip)" class="copy-btn" title="复制IP地址">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button @click="clearHistory" class="clear-history-btn">清空历史</button>
                </div>
            </div>
        </div>

        <!-- 使用公共组件ScrollToTop，指定滚动容器 -->
        <ScrollToTop container=".converter-content" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import ScrollToTop from './common/ScrollToTop.vue'
import cardsConfig from '../config/cards.json'

// 代理API配置
const PROXY_API_URL = 'https://difficult-ape-32.panxu71.deno.net'

// 通用代理请求函数
const proxyFetch = async (url: string, options: RequestInit = {}) => {
    const isExtension = import.meta.env.BUILD_TARGET === 'extension'

    // 如果是浏览器插件环境，直接请求
    if (isExtension) {
        // console.log('🔌 插件环境，直接请求:', url)
        return await fetch(url, options)
    }

    // Web 环境，使用代理
    // console.log('🌐 Web 环境，使用代理请求:', url)

    const proxyBody: any = {
        url: url,
        method: options.method || 'GET',
        headers: options.headers || {}
    }

    if (options.method === 'POST' && options.body) {
        proxyBody.body = options.body
    }

    const response = await fetch(PROXY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proxyBody)
    })

    return response
}

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('ip-lookup')

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'ip-lookup')
        if (card) {
            return card.title
        }
    }
    return 'IP地址查询'
})

// 使用通知系统
const { success, error, copySuccess, copyError } = useNotification()

// 国家数据接口
interface IpInfo {
    ip: string
    country?: string
    region?: string
    city?: string
    location: string
    isp?: string
    timezone?: string
    lat?: number
    lon?: number
    timestamp?: number
    source?: string
    error?: string
    loading?: boolean
    countryCode?: string
    postalCode?: string
    organization?: string
    asn?: string
}

const currentIpInfo = ref<IpInfo[]>([])
const loadingCurrent = ref(false)
const currentError = ref('')

// IP API源统一配置
interface ApiSourceConfig {
    id: string
    name: string
    description: string
    fetcher: () => Promise<IpInfo>
}

// 所有API源的fetcher函数
const apiFetchers = {
    // 获取Coding.tools数据
    fetchCodingToolsData: async (): Promise<IpInfo> => {
        try {
            const isExtension = import.meta.env.BUILD_TARGET === 'extension'
            let response

            if (import.meta.env.DEV) {
                // 开发环境使用vite代理
                response = await fetch('/api/coding-tools', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json, text/plain, */*',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Cache-Control': 'no-cache'
                    },
                    body: 'queryIp='
                })
            } else {
                // 生产环境使用 proxyFetch（会根据环境自动选择直接请求或代理）
                response = await proxyFetch('https://coding.tools/cn/my-ip-address', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json, text/plain, */*',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': 'https://coding.tools/cn/my-ip-address',
                        'Origin': 'https://coding.tools',
                        'Cache-Control': 'no-cache'
                    },
                    body: 'queryIp='
                })
            }

            if (!response.ok) throw new Error(`HTTP ${response.status}`)

            const result = await response.json()

            // 处理不同环境的响应格式
            let data
            if (isExtension || import.meta.env.DEV) {
                // 插件环境或开发环境：直接返回的数据
                data = result
            } else {
                // Web 环境：代理返回的数据在 data 字段中
                data = result.data || result.body || result
                // 如果 data 是字符串，尝试解析
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data)
                    } catch (e) {
                        // 解析失败，保持原样
                    }
                }
            }

            if (data.ip) {
                const countryMap: { [key: string]: string } = {
                    'China': '中国', 'United States': '美国', 'Japan': '日本', 'South Korea': '韩国',
                    'United Kingdom': '英国', 'Germany': '德国', 'France': '法国', 'Canada': '加拿大',
                    'Australia': '澳大利亚', 'Singapore': '新加坡'
                }
                const country = countryMap[data.country_name] || data.country_name || ''
                return {
                    ip: data.ip || '未知',
                    country: country,
                    region: data.region_name || '',
                    city: data.city_name || '',
                    location: `${data.city_name || ''} ${data.region_name || ''} ${country}`.trim() || '未知位置',
                    isp: '',
                    timezone: data.time_zone || '',
                    lat: data.latitude ? parseFloat(data.latitude) : undefined,
                    lon: data.longitude ? parseFloat(data.longitude) : undefined,
                    source: 'Coding.tools'
                }
            } else {
                throw new Error('API返回数据格式错误')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'Coding.tools',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取whatismyipaddress.com数据
    fetchWhatIsMyIpData: async (): Promise<IpInfo> => {
        try {
            const isExtension = import.meta.env.BUILD_TARGET === 'extension'
            let text = ''

            if (import.meta.env.DEV || isExtension) {
                // 开发环境或插件环境：直接请求
                const response = await fetch('https://whatismyipaddress.com/', {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                text = await response.text()
            } else {
                // Web 生产环境使用代理
                const response = await proxyFetch('https://whatismyipaddress.com/', {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)

                const data = await response.json()
                text = data.data || data.body || data || ''
                if (typeof text !== 'string') {
                    text = JSON.stringify(text)
                }
            }

            // 从HTML中提取IP地址
            const ipMatch = text.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/)

            if (ipMatch) {
                return {
                    ip: ipMatch[0],
                    country: '',
                    region: '',
                    city: '',
                    location: '来自WhatIsMyIP',
                    source: 'WhatIsMyIP'
                }
            } else {
                throw new Error('无法从响应中提取IP地址')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'WhatIsMyIP',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取HTTPBin数据
    fetchHttpbinData: async (): Promise<IpInfo> => {
        try {
            const isExtension = import.meta.env.BUILD_TARGET === 'extension'
            let data

            if (import.meta.env.DEV || isExtension) {
                // 开发环境或插件环境：直接请求
                const response = await fetch('https://httpbin.org/ip')
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                data = await response.json()
            } else {
                // Web 生产环境使用代理
                const response = await proxyFetch('https://httpbin.org/ip')
                if (!response.ok) throw new Error(`HTTP ${response.status}`)

                const result = await response.json()
                data = result.data || result.body || result
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data)
                    } catch (e) {
                        // 解析失败，保持原样
                    }
                }
            }

            return {
                ip: data.origin || '未知',
                country: '',
                region: '',
                city: '',
                location: '仅提供IP地址',
                source: 'HTTPBin'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'HTTPBin',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取ICanHazIP数据
    fetchICanHazIpData: async (): Promise<IpInfo> => {
        try {
            const isExtension = import.meta.env.BUILD_TARGET === 'extension'
            let text = ''

            if (import.meta.env.DEV || isExtension) {
                // 开发环境或插件环境：直接请求
                const response = await fetch('https://icanhazip.com', {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                text = await response.text()
            } else {
                // Web 生产环境使用代理
                const response = await proxyFetch('https://icanhazip.com', {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)

                const data = await response.json()
                text = data.data || data.body || data || ''
                if (typeof text !== 'string') {
                    text = String(text)
                }
            }

            const ip = text.trim()

            // 验证IP地址格式
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
            if (!ipRegex.test(ip)) {
                throw new Error('无效的IP地址格式')
            }

            return {
                ip: ip,
                country: '',
                region: '',
                city: '',
                location: '仅提供IP地址',
                source: 'ICanHazIP'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'ICanHazIP',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取AWS CheckIP数据
    fetchCheckIpData: async (): Promise<IpInfo> => {
        try {
            const isExtension = import.meta.env.BUILD_TARGET === 'extension'
            let text = ''

            if (import.meta.env.DEV || isExtension) {
                // 开发环境或插件环境：直接请求
                const response = await fetch('https://checkip.amazonaws.com', {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                text = await response.text()
            } else {
                // Web 生产环境使用代理
                const response = await proxyFetch('https://checkip.amazonaws.com', {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)

                const data = await response.json()
                text = data.data || data.body || data || ''
                if (typeof text !== 'string') {
                    text = String(text)
                }
            }

            const ip = text.trim()

            // 验证IP地址格式
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
            if (!ipRegex.test(ip)) {
                throw new Error('无效的IP地址格式')
            }

            return {
                ip: ip,
                country: '',
                region: '',
                city: '',
                location: '仅提供IP地址',
                source: 'AWS CheckIP'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'AWS CheckIP',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取IPUU.net数据
    fetchIpuuData: async (): Promise<IpInfo> => {
        try {
            const isExtension = import.meta.env.BUILD_TARGET === 'extension'
            // 生成随机数参数
            const randomParam = Math.floor(Math.random() * 100000000)
            const url = `https://www.ipuu.net/ipuu/user/getIP?r=${randomParam}`
            let data

            if (import.meta.env.DEV || isExtension) {
                // 开发环境或插件环境：直接请求
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                data = await response.json()
            } else {
                // Web 生产环境使用代理
                const response = await proxyFetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)

                const result = await response.json()
                data = result.data || result.body || result
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data)
                    } catch (e) {
                        // 解析失败，保持原样
                    }
                }
            }

            // IPUU.net返回格式：{"code":200,"data":"163.125.214.143","msg":"获取用户端IP成功"}
            if (data.code === 200 && data.data) {
                // 验证IP地址格式
                const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
                if (!ipRegex.test(data.data)) {
                    throw new Error('无效的IP地址格式')
                }

                return {
                    ip: data.data,
                    country: '',
                    region: '',
                    city: '',
                    location: '仅提供IP地址',
                    source: 'IPUU.net'
                }
            } else {
                throw new Error(`API返回错误: ${data.msg || '未知错误'}`)
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'IPUU.net',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取IP.SB数据
    fetchIpSbData: async (): Promise<IpInfo> => {
        try {
            const isExtension = import.meta.env.BUILD_TARGET === 'extension'
            // 生成随机参数
            const randomParam = Math.floor(Math.random() * 100000000)
            const url = `https://api-ipv4.ip.sb/geoip?z=${randomParam}`
            let data

            if (import.meta.env.DEV || isExtension) {
                // 开发环境或插件环境：直接请求
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                data = await response.json()
            } else {
                // Web 生产环境使用代理
                const response = await proxyFetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)

                const result = await response.json()
                data = result.data || result.body || result
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data)
                    } catch (e) {
                        // 解析失败，保持原样
                    }
                }
            }

            // IP.SB返回详细的地理位置信息
            if (data.ip) {
                return {
                    ip: data.ip,
                    country: data.country || '',
                    region: data.region || '',
                    city: data.city || '',
                    location: `${data.city || ''} ${data.region || ''} ${data.country || ''}`.trim() || '未知位置',
                    isp: data.isp || data.organization || '',
                    timezone: data.timezone || '',
                    lat: data.latitude ? parseFloat(data.latitude) : undefined,
                    lon: data.longitude ? parseFloat(data.longitude) : undefined,
                    asn: data.asn ? `AS${data.asn}` : '',
                    source: 'IP.SB'
                }
            } else {
                throw new Error('API返回数据格式错误')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'IP.SB',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取LoliCP数据
    fetchLoliCpData: async (): Promise<IpInfo> => {
        try {
            const isExtension = import.meta.env.BUILD_TARGET === 'extension'
            let text = ''

            if (import.meta.env.DEV || isExtension) {
                // 开发环境或插件环境：直接请求
                const response = await fetch('https://ip.lolicp.com/', {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                text = await response.text()
            } else {
                // Web 生产环境使用代理
                const response = await proxyFetch('https://ip.lolicp.com/', {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)

                const data = await response.json()
                text = data.data || data.body || data || ''
                if (typeof text !== 'string') {
                    text = String(text)
                }
            }

            const ip = text.trim()

            // 验证IP地址格式
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
            if (!ipRegex.test(ip)) {
                throw new Error('无效的IP地址格式')
            }

            return {
                ip: ip,
                country: '',
                region: '',
                city: '',
                location: '仅提供IP地址',
                source: 'LoliCP'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'LoliCP',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取爱奇艺数据
    fetchIqiyiData: async (): Promise<IpInfo> => {
        try {
            const isExtension = import.meta.env.BUILD_TARGET === 'extension'
            // 生成随机参数
            const randomParam = Math.floor(Math.random() * 100000000)
            const url = `https://data.video.iqiyi.com/v.f4v?z=${randomParam}`
            let data

            if (import.meta.env.DEV || isExtension) {
                // 开发环境或插件环境：直接请求
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                data = await response.json()
            } else {
                // Web 生产环境使用代理
                const response = await proxyFetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)

                const result = await response.json()
                data = result.data || result.body || result
                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data)
                    } catch (e) {
                        // 解析失败，保持原样
                    }
                }
            }

            // 爱奇艺返回格式：{"t": "CNC|GuangDong_ShenZhen-163.125.214.143", ...}
            if (data.t) {
                // 解析 t 字段：格式为 "CNC|GuangDong_ShenZhen-163.125.214.143"
                const parts = data.t.split('-')
                if (parts.length >= 2) {
                    const ip = parts[1]
                    const locationPart = parts[0] // "CNC|GuangDong_ShenZhen"

                    // 验证IP地址格式
                    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/
                    if (!ipRegex.test(ip)) {
                        throw new Error('无效的IP地址格式')
                    }

                    // 解析位置信息
                    let isp = '', region = '', city = ''
                    if (locationPart.includes('|')) {
                        const locationParts = locationPart.split('|')
                        isp = locationParts[0] || '' // CNC
                        if (locationParts[1]) {
                            // GuangDong_ShenZhen
                            const geoInfo = locationParts[1].split('_')
                            region = geoInfo[0] || '' // GuangDong
                            city = geoInfo[1] || '' // ShenZhen
                        }
                    }

                    return {
                        ip: ip,
                        country: '中国',
                        region: region,
                        city: city,
                        location: `${city} ${region} 中国`.trim() || '未知位置',
                        isp: isp,
                        source: '爱奇艺'
                    }
                } else {
                    throw new Error('无法解析t字段格式')
                }
            } else {
                throw new Error('API返回数据格式错误')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: '爱奇艺',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取IPIP.net JSON数据
    fetchIpipJsonData: async (): Promise<IpInfo> => {
        try {
            const url = import.meta.env.DEV ? '/api/ipip-json' : 'https://myip.ipip.net/json'

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()

            // IPIP.net返回格式：{"ret":"ok","data":{"ip":"27.46.77.60","location":["中国","广东","深圳","","联通"]}}
            if (data.ret === 'ok' && data.data) {
                const ipData = data.data
                const location = ipData.location || []

                return {
                    ip: ipData.ip || '未知',
                    country: location[0] || '',
                    region: location[1] || '',
                    city: location[2] || '',
                    location: location.filter((item: string) => item).join(' ') || '未知位置',
                    isp: location[4] || '',
                    source: 'IPIP.net'
                }
            } else {
                throw new Error('API返回格式错误')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'IPIP.net',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取ITDog数据
    fetchItDogData: async (): Promise<IpInfo> => {
        try {
            const timestamp = Date.now()
            const url = import.meta.env.DEV
                ? `/api/itdog?_t=${timestamp}`
                : `https://ipv4_cu.itdog.cn/?_t=${timestamp}`

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()
            if (data.type === 'success' && data.ip) {
                const addressParts = data.address ? data.address.split('/') : []
                return {
                    ip: data.ip || '未知',
                    country: addressParts[0] || '',
                    region: addressParts[1] || '',
                    city: addressParts[2] || '',
                    location: data.address || '未知位置',
                    isp: addressParts[3] || '',
                    source: 'ITDog'
                }
            } else {
                throw new Error('API返回格式错误')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'ITDog',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取又拍云数据
    fetchUpYunData: async (): Promise<IpInfo> => {
        try {
            // 生成随机参数
            const randomParam = Math.floor(Math.random() * 100000000)
            const url = import.meta.env.DEV
                ? `/api/upyun?_upnode&r=${randomParam}`
                : `https://pubstatic.b0.upaiyun.com/?_upnode&r=${randomParam}`

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()

            // 又拍云返回格式包含用户真实IP和位置信息
            // 使用 remote_addr 和 remote_addr_location 获取用户真实IP信息
            if (data.remote_addr && data.remote_addr_location) {
                const ip = data.remote_addr
                const location = data.remote_addr_location

                return {
                    ip: ip,
                    country: location.country || '',
                    region: location.province || '',
                    city: location.city || '',
                    location: `${location.city || ''} ${location.province || ''} ${location.country || ''}`.trim() || '未知位置',
                    isp: location.isp || '',
                    source: '又拍云'
                }
            } else {
                throw new Error('API返回数据格式错误')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: '又拍云',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取AAPQ数据
    fetchAapqData: async (): Promise<IpInfo> => {
        try {
            const url = import.meta.env.DEV ? '/api/aapq' : 'https://fcd09628a76x.aapq.net/ip'

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()
            if (data.ip) {
                const countryMap: { [key: string]: string } = {
                    'CN': '中国', 'US': '美国', 'JP': '日本', 'KR': '韩国',
                    'GB': '英国', 'DE': '德国', 'FR': '法国', 'CA': '加拿大',
                    'AU': '澳大利亚', 'SG': '新加坡', 'HK': '香港', 'TW': '台湾'
                }
                const country = countryMap[data.country] || data.country || ''
                return {
                    ip: data.ip || '未知',
                    country: country,
                    region: '',
                    city: data.city || '',
                    location: `${data.city || ''} ${country}`.trim() || '未知位置',
                    source: 'AAPQ'
                }
            } else {
                throw new Error('API返回数据格式错误')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'AAPQ',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取MaxMind数据
    fetchMaxMindData: async (): Promise<IpInfo> => {
        try {
            const url = import.meta.env.DEV ? '/api/maxmind' : 'https://geoip.maxmind.com/geoip/v2.1/city/me'

            const response = await fetch(url, {
                headers: {
                    'Accept': '*/*',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Referer': 'https://www.maxmind.com/'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()
            if (data.traits && data.traits.ip_address) {
                const getLocalizedName = (names: any) => {
                    return names?.['zh-CN'] || names?.['en'] || ''
                }

                const country = getLocalizedName(data.country?.names)
                const region = getLocalizedName(data.subdivisions?.[0]?.names)
                const city = getLocalizedName(data.city?.names)

                return {
                    ip: data.traits.ip_address || '未知',
                    country: country,
                    region: region,
                    city: city,
                    location: `${city} ${region} ${country}`.trim() || '未知位置',
                    isp: data.traits.isp || '',
                    timezone: data.location?.time_zone || '',
                    lat: data.location?.latitude ? parseFloat(data.location.latitude) : undefined,
                    lon: data.location?.longitude ? parseFloat(data.location.longitude) : undefined,
                    asn: data.traits.autonomous_system_number ? `AS${data.traits.autonomous_system_number}` : '',
                    source: 'MaxMind'
                }
            } else {
                throw new Error('API返回数据格式错误')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'MaxMind',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取IPapi.co数据
    fetchIpapiData: async (): Promise<IpInfo> => {
        try {
            const response = await fetch('https://ipapi.co/json/')
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()
            return {
                ip: data.ip || '未知',
                country: data.country_name || '',
                region: data.region || '',
                city: data.city || '',
                location: `${data.city || ''} ${data.region || ''} ${data.country_name || ''}`.trim() || '未知位置',
                isp: data.org || '',
                timezone: data.timezone || '',
                lat: data.latitude,
                lon: data.longitude,
                source: 'IPapi.co'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'IPapi.co',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取ifconfig.me数据
    fetchIfconfigData: async (): Promise<IpInfo> => {
        try {
            const url = import.meta.env.DEV ? '/api/ifconfig/all.json' : 'https://ifconfig.me/all.json'

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()
            return {
                ip: data.ip_addr || '未知',
                country: data.country || '',
                region: '',
                city: '',
                location: data.country || '未知位置',
                source: 'ifconfig.me'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'ifconfig.me',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取USTC数据
    fetchUstcData: async (): Promise<IpInfo> => {
        try {
            const url = import.meta.env.DEV
                ? `/api/ustc/backend/getIP.php?&r=${Math.random()}`
                : `https://test.ustc.edu.cn/backend/getIP.php?&r=${Math.random()}`

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()

            // USTC返回格式：{"processedString":"27.46.56.150","rawIspInfo":""}
            if (data.processedString) {
                return {
                    ip: data.processedString,
                    country: '',
                    region: '',
                    city: '',
                    location: '仅提供IP地址',
                    isp: data.rawIspInfo || '',
                    source: 'USTC'
                }
            } else {
                throw new Error('API返回数据格式错误')
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'USTC',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取IP-API数据
    fetchIpApiData: async (): Promise<IpInfo> => {
        try {
            const url = import.meta.env.DEV
                ? '/api/ip-api/json/?fields=66842623&lang=en'
                : 'http://demo.ip-api.com/json/?fields=66842623&lang=en'

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()
            return {
                ip: data.query || '未知',
                country: data.country || '',
                region: data.regionName || '',
                city: data.city || '',
                location: `${data.city || ''} ${data.regionName || ''} ${data.country || ''}`.trim() || '未知位置',
                isp: data.isp || '',
                timezone: data.timezone || '',
                lat: data.lat,
                lon: data.lon,
                source: 'IP-API'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'IP-API',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取CIP.cc数据
    fetchCipCcData: async (): Promise<IpInfo> => {
        try {
            const url = import.meta.env.DEV ? '/api/cip-cc' : 'https://cip.cc/'

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const text = await response.text()

            // CIP.cc返回HTML格式，需要从<pre>标签中提取信息
            // 格式：IP : 27.46.56.150\n地址 : 中国 广东 深圳\n运营商 : 联通\n数据二 : 中国广东深圳 | 联通\n...

            let ip = '', country = '', region = '', city = '', isp = ''

            // 提取<pre>标签内容
            const preMatch = text.match(/<pre>([\s\S]*?)<\/pre>/)
            if (preMatch && preMatch[1]) {
                const preContent = preMatch[1]
                const lines = preContent.split('\n')

                for (const line of lines) {
                    const trimmedLine = line.trim()
                    if (trimmedLine.includes('IP') && trimmedLine.includes(':')) {
                        ip = trimmedLine.split(':')[1]?.trim() || ''
                    } else if (trimmedLine.includes('地址') && trimmedLine.includes(':')) {
                        const addressParts = trimmedLine.split(':')[1]?.trim().split(' ') || []
                        country = addressParts[0] || ''
                        region = addressParts[1] || ''
                        city = addressParts[2] || ''
                    } else if (trimmedLine.includes('运营商') && trimmedLine.includes(':')) {
                        isp = trimmedLine.split(':')[1]?.trim() || ''
                    }
                }
            }

            // 如果没有找到<pre>标签，尝试直接解析文本
            if (!ip) {
                const lines = text.split('\n')
                for (const line of lines) {
                    const trimmedLine = line.trim()
                    if (trimmedLine.includes('IP') && trimmedLine.includes(':')) {
                        ip = trimmedLine.split(':')[1]?.trim() || ''
                    } else if (trimmedLine.includes('地址') && trimmedLine.includes(':')) {
                        const addressParts = trimmedLine.split(':')[1]?.trim().split(' ') || []
                        country = addressParts[0] || ''
                        region = addressParts[1] || ''
                        city = addressParts[2] || ''
                    } else if (trimmedLine.includes('运营商') && trimmedLine.includes(':')) {
                        isp = trimmedLine.split(':')[1]?.trim() || ''
                    }
                }
            }

            return {
                ip: ip || '未知',
                country: country,
                region: region,
                city: city,
                location: `${city} ${region} ${country}`.trim() || '未知位置',
                isp: isp,
                source: 'CIP.cc'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'CIP.cc',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取IPinfo.io数据
    fetchIpinfoData: async (): Promise<IpInfo> => {
        try {
            const url = import.meta.env.DEV ? '/api/ipinfo' : 'https://ipinfo.io/lookup-data'

            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const data = await response.json()

            // IPinfo.io返回格式：{"userIp": "27.46.77.60","asn": "AS17623"}
            return {
                ip: data.userIp || data.ip || '未知',
                country: '',
                region: '',
                city: '',
                location: '仅提供IP地址',
                isp: '',
                timezone: '',
                asn: data.asn || '',
                source: 'IPinfo.io'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'IPinfo.io',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    },

    // 获取GeoJS数据
    fetchGeoJsData: async (): Promise<IpInfo> => {
        try {
            const response = await fetch('https://get.geojs.io/v1/ip/geo.json')
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            const data = await response.json()

            return {
                ip: data.ip || '未知',
                country: data.country || '',
                region: data.region || '',
                city: data.city || '',
                location: `${data.city || ''} ${data.region || ''} ${data.country || ''}`.trim() || '未知位置',
                isp: data.organization_name || data.organization || '',
                timezone: data.timezone || '',
                lat: data.latitude ? parseFloat(data.latitude) : undefined,
                lon: data.longitude ? parseFloat(data.longitude) : undefined,
                countryCode: data.country_code || '',
                postalCode: '', // GeoJS不提供邮政编码
                organization: data.organization_name || '',
                asn: data.asn ? `AS${data.asn}` : '',
                source: 'GeoJS'
            }
        } catch (error) {
            return {
                ip: '获取失败',
                location: '请求失败',
                source: 'GeoJS',
                error: error instanceof Error ? error.message : '网络错误'
            }
        }
    }
}

// API源配置 - 在这里添加或删除源
const API_SOURCES_CONFIG: ApiSourceConfig[] = [
    { id: 'coding-tools', name: 'Coding.tools', description: '稳定可靠', fetcher: apiFetchers.fetchCodingToolsData },
    { id: 'whatismyip', name: 'WhatIsMyIP', description: '国外源', fetcher: apiFetchers.fetchWhatIsMyIpData },
    { id: 'httpbin', name: 'HTTPBin', description: 'JSON格式', fetcher: apiFetchers.fetchHttpbinData },
    { id: 'icanhazip', name: 'ICanHazIP', description: '纯文本IP', fetcher: apiFetchers.fetchICanHazIpData },
    { id: 'checkip', name: 'AWS CheckIP', description: 'AWS服务', fetcher: apiFetchers.fetchCheckIpData },
    { id: 'ipuu', name: 'IPUU.net', description: '简洁快速', fetcher: apiFetchers.fetchIpuuData },
    { id: 'ipsb', name: 'IP.SB', description: '详细信息', fetcher: apiFetchers.fetchIpSbData },
    { id: 'lolicp', name: 'LoliCP', description: '纯文本IP', fetcher: apiFetchers.fetchLoliCpData },
    { id: 'iqiyi', name: '爱奇艺', description: '视频CDN', fetcher: apiFetchers.fetchIqiyiData },
    { id: 'ipip-net', name: 'IPIP.net', description: '国内源', fetcher: apiFetchers.fetchIpipJsonData },
    { id: 'itdog', name: 'ITDog', description: '国内源', fetcher: apiFetchers.fetchItDogData },
    { id: 'upyun', name: '又拍云', description: '国内CDN', fetcher: apiFetchers.fetchUpYunData },
    { id: 'aapq', name: 'AAPQ', description: '高精度', fetcher: apiFetchers.fetchAapqData },
    { id: 'maxmind', name: 'MaxMind', description: '地理位置专家', fetcher: apiFetchers.fetchMaxMindData },
    { id: 'ipapi-co', name: 'IPapi.co', description: '免费API', fetcher: apiFetchers.fetchIpapiData },
    { id: 'ifconfig', name: 'ifconfig.me', description: 'Linux风格', fetcher: apiFetchers.fetchIfconfigData },
    { id: 'ustc', name: 'USTC', description: '中科大源', fetcher: apiFetchers.fetchUstcData },
    { id: 'ip-api', name: 'IP-API', description: '批量查询', fetcher: apiFetchers.fetchIpApiData },
    { id: 'cip-cc', name: 'CIP.cc', description: '纯文本', fetcher: apiFetchers.fetchCipCcData },
    { id: 'ipinfo', name: 'IPinfo.io', description: '仅IP和ASN', fetcher: apiFetchers.fetchIpinfoData },
    { id: 'geojs', name: 'GeoJS', description: '详细地理信息', fetcher: apiFetchers.fetchGeoJsData }
]

// 导出API源列表（用于下拉选择）
const apiSources = API_SOURCES_CONFIG.map(config => ({
    id: config.id,
    name: config.name,
    description: config.description
}))

// 获取API源对应的fetcher函数
const getApiFetcher = (sourceId: string) => {
    const config = API_SOURCES_CONFIG.find(config => config.id === sourceId)
    return config?.fetcher || apiFetchers.fetchCodingToolsData
}

// 当前选择的第二个API源
const selectedApiSource = ref('coding-tools')

const queryIp = ref('')
const queryResult = ref<IpInfo[]>([])
const loadingQuery = ref(false)
const queryError = ref('')

const queryHistory = ref<IpInfo[]>([])

// 从代理或background script获取IP.me的IP信息
const fetchIpMeData = async (): Promise<IpInfo> => {
    try {
        let html = ''
        const isExtension = import.meta.env.BUILD_TARGET === 'extension'

        if (isExtension) {
            // 浏览器插件环境：直接请求
            console.log('🔌 浏览器插件环境，直接请求 IP.me')
            const response = await fetch('https://ip.me', {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            })
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            html = await response.text()
        } else if (import.meta.env.DEV) {
            // 开发环境使用 vite 代理
            console.log('🛠️ 开发环境，使用 vite 代理')
            const response = await fetch('/api/ip-me')
            if (!response.ok) throw new Error(`HTTP ${response.status}`)
            html = await response.text()
        } else {
            // Web 生产环境使用 Deno 代理
            console.log('🌐 Web 生产环境，使用 Deno 代理')
            const proxyUrl = 'https://difficult-ape-32.panxu71.deno.net'
            const proxyBody = {
                url: 'https://ip.me',
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
                }
            }

            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(proxyBody)
            })

            if (!response.ok) throw new Error(`HTTP ${response.status}`)

            const data = await response.json()
            console.log('IP.me 代理返回数据:', data)

            // 处理 Deno 代理返回的数据
            html = data.data || data.content || data.body || ''

            // 如果返回的不是字符串，尝试转换
            if (typeof html !== 'string') {
                html = JSON.stringify(html)
            }
        }

        if (!html) throw new Error('返回内容为空')

        // 解析IP地址
        const ipMatch = html.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/)
        if (!ipMatch) throw new Error('无法从HTML中提取IP地址')

        // 尝试解析详细信息（处理HTML中的换行符和空格）
        const parseTableValue = (label: string): string => {
            const regex = new RegExp(`<th>${label}:</th>\\s*<td[^>]*>\\s*<code>([^<]+)</code>`, 'i')
            const match = html.match(regex)
            return match?.[1]?.trim() || ''
        }

        const city = parseTableValue('City')
        const country = parseTableValue('Country')
        const countryCode = parseTableValue('Country Code')
        const latitude = parseTableValue('Latitude')
        const longitude = parseTableValue('Longitude')
        const postalCode = parseTableValue('Postal Code')
        const organization = parseTableValue('Organization')
        const asn = parseTableValue('ASN')
        const ispName = parseTableValue('ISP Name')

        return {
            ip: ipMatch[0],
            country: country || '',
            region: '',
            city: city || '',
            location: `${city} ${country}`.trim() || '仅提供IP地址',
            isp: ispName || organization || '',
            timezone: '',
            lat: latitude ? parseFloat(latitude) : undefined,
            lon: longitude ? parseFloat(longitude) : undefined,
            asn: asn ? `AS${asn}` : '',
            countryCode: countryCode || '',
            postalCode: postalCode || '',
            organization: organization || '',
            source: 'IP.me'
        }
    } catch (error) {
        console.error('IP.me 请求错误:', error)
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'IP.me',
            error: error instanceof Error ? error.message : '网络错误'
        }
    }
}

// 获取当前IP信息
const getCurrentIpInfo = async () => {
    loadingCurrent.value = true
    currentError.value = ''

    // 创建两个骨架屏卡片：IP.me + 选择的API源
    const skeletonCards: IpInfo[] = [
        {
            ip: '',
            location: '',
            source: 'IP.me',
            loading: true
        },
        {
            ip: '',
            location: '',
            source: apiSources.find(s => s.id === selectedApiSource.value)?.name || 'Unknown',
            loading: true
        }
    ]
    currentIpInfo.value = skeletonCards

    try {
        // 并发请求两个API源
        const promises = [
            // IP.me（尝试多种方式访问）
            (async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
                    const result = await fetchIpMeData()
                    currentIpInfo.value[0] = result
                } catch (error) {
                    currentIpInfo.value[0] = {
                        ip: '',
                        location: '请求失败',
                        source: 'IP.me',
                        error: error instanceof Error ? error.message : '网络错误'
                    } as IpInfo
                }
            })(),
            // 选择的API源
            (async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
                    const fetcher = getApiFetcher(selectedApiSource.value)
                    const result = await fetcher()
                    currentIpInfo.value[1] = result
                } catch (error) {
                    currentIpInfo.value[1] = {
                        ip: '',
                        location: '请求失败',
                        source: apiSources.find(s => s.id === selectedApiSource.value)?.name || 'Unknown',
                        error: error instanceof Error ? error.message : '网络错误'
                    } as IpInfo
                }
            })()
        ]

        await Promise.all(promises)
    } catch (error) {
        currentError.value = '获取IP信息失败，请检查网络连接'
    } finally {
        loadingCurrent.value = false
    }
}

// 切换第二数据源时只更新第二个卡片
const switchSecondSource = async () => {
    // 如果还没有初始化，则初始化所有数据
    if (currentIpInfo.value.length === 0) {
        await getCurrentIpInfo()
        return
    }

    // 只更新第二个卡片为加载状态
    if (currentIpInfo.value.length >= 2) {
        currentIpInfo.value[1] = {
            ip: '',
            location: '',
            source: apiSources.find(s => s.id === selectedApiSource.value)?.name || 'Unknown',
            loading: true
        }
    }

    try {
        // 只请求新选择的API源
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
        const fetcher = getApiFetcher(selectedApiSource.value)
        const result = await fetcher()

        // 更新第二个卡片
        if (currentIpInfo.value.length >= 2) {
            currentIpInfo.value[1] = result
        }
    } catch (error) {
        if (currentIpInfo.value.length >= 2) {
            currentIpInfo.value[1] = {
                ip: '',
                location: '请求失败',
                source: apiSources.find(s => s.id === selectedApiSource.value)?.name || 'Unknown',
                error: error instanceof Error ? error.message : '网络错误'
            } as IpInfo
        }
    }
}

// 查询指定IP信息
const queryIpInfo = async () => {
    if (!queryIp.value.trim()) return

    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    if (!ipRegex.test(queryIp.value.trim())) {
        queryError.value = '请输入有效的IP地址格式'
        error('请输入有效的IP地址格式')
        return
    }

    loadingQuery.value = true
    queryError.value = ''
    queryResult.value = []

    try {
        const ip = queryIp.value.trim()

        const apis = [
            {
                name: 'IPapi.co',
                url: `https://ipapi.co/${ip}/json/`,
                parser: (data: any): IpInfo => ({
                    ip: data.ip || ip,
                    country: data.country_name || '',
                    region: data.region || '',
                    city: data.city || '',
                    location: `${data.city || ''} ${data.region || ''} ${data.country_name || ''}`.trim() || '未知位置',
                    isp: data.org || '',
                    timezone: data.timezone || '',
                    lat: data.latitude,
                    lon: data.longitude,
                    source: 'IPapi.co'
                })
            }
        ]

        const promises = apis.map(async (api) => {
            try {
                const fetchOptions: RequestInit = {}

                const response = await fetch(api.url, fetchOptions)
                if (response.ok) {
                    const data = await response.json()
                    return api.parser(data)
                } else {
                    return {
                        ip: ip,
                        location: '请求失败',
                        source: api.name,
                        error: `HTTP ${response.status}`
                    } as IpInfo
                }
            } catch (error) {
                return {
                    ip: ip,
                    location: '请求失败',
                    source: api.name,
                    error: error instanceof Error ? error.message : '网络错误'
                } as IpInfo
            }
        })

        const results = await Promise.all(promises)
        queryResult.value = results.filter(result => result.ip && !result.error)

        const successResult = queryResult.value[0]
        if (successResult) {
            const historyItem = { ...successResult, timestamp: Date.now() }
            const existingIndex = queryHistory.value.findIndex(item => item.ip === successResult.ip)
            if (existingIndex >= 0) {
                queryHistory.value.splice(existingIndex, 1)
            }
            queryHistory.value.unshift(historyItem)

            if (queryHistory.value.length > 10) {
                queryHistory.value = queryHistory.value.slice(0, 10)
            }

            localStorage.setItem('ip-query-history', JSON.stringify(queryHistory.value))
            success(`查询成功：${successResult.location}`)
        }

        if (queryResult.value.length === 0) {
            queryError.value = '所有查询服务都失败了，请稍后重试'
            error('查询失败，请稍后重试')
        }

    } catch (err) {
        queryError.value = '查询失败，请稍后重试'
        error('查询失败，请稍后重试')
    } finally {
        loadingQuery.value = false
    }
}

// 设置示例IP
const setExampleIp = (ip: string) => {
    queryIp.value = ip
}

// 设置查询IP（从历史记录）
const setQueryIp = (ip: string) => {
    queryIp.value = ip
}

// 格式化时间
const formatTime = (timestamp?: number) => {
    if (!timestamp) return '未知时间'
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// 清空历史记录
const clearHistory = () => {
    queryHistory.value = []
    localStorage.removeItem('ip-query-history')
    success('历史记录已清空')
}

// 复制IP地址
const copyIpAddress = async (ip: string) => {
    try {
        await navigator.clipboard.writeText(ip)
        copySuccess(ip)
    } catch (err) {
        copyError('复制失败，请手动复制')
    }
}

// 加载历史记录
const loadHistory = () => {
    try {
        const saved = localStorage.getItem('ip-query-history')
        if (saved) {
            queryHistory.value = JSON.parse(saved)
        }
    } catch (error) {
        console.error('加载历史记录失败:', error)
    }
}

onMounted(() => {
    getCurrentIpInfo()
    loadHistory()
})
</script>

<style scoped>
.ip-lookup {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.converter-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 0 6rem 0;
    /* 增加底部间距从4rem到6rem */
}

/* 内容容器 - 限制宽度并居中 */
.content-wrapper {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.current-ip-section,
.query-section,
.history-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 24px;
    box-shadow: var(--shadow-sm);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;
}

.section-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.api-source-selector {
    display: flex;
    align-items: center;
    gap: 8px;
}

.api-source-selector label {
    font-size: 14px;
    color: var(--text-secondary);
    white-space: nowrap;
}

.select-wrapper {
    position: relative;
    display: inline-block;
}

.source-select {
    appearance: none;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 6px 32px 6px 12px;
    font-size: 14px;
    color: var(--text-primary);
    cursor: pointer;
    transition: var(--transition);
    min-width: 200px;
}

.source-select:hover {
    border-color: var(--primary-color);
}

.source-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.select-arrow {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--text-secondary);
}

.current-ip-section h2,
.query-section h2,
.history-section h2 {
    margin: 0 0 20px 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
}

.api-results {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
}

.ip-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 20px;
    transition: var(--transition);
}

.ip-card.primary-source {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 1px var(--primary-color-alpha);
}

.loading-card {
    position: relative;
    overflow: hidden;
}

.source-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
}

.source-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
}

.primary-badge {
    background: var(--primary-color);
    color: white;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
}

.error-badge {
    background: var(--error-color);
    color: white;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
}

.ip-main {
    margin-bottom: 16px;
}

.ip-address-container {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
}

.ip-address {
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-color);
}

.copy-btn {
    padding: 4px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
}

.copy-btn:hover {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.error-info {
    padding: 12px;
    background: var(--error-color-alpha);
    border: 1px solid var(--error-color);
    border-radius: var(--radius-sm);
}

.error-message {
    font-size: 14px;
    color: var(--error-color);
    margin-bottom: 8px;
}

.visit-link {
    display: inline-block;
    padding: 6px 12px;
    background: var(--primary-color);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
    transition: var(--transition);
}

.visit-link:hover {
    background: var(--primary-hover);
}

.ip-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid var(--border-color);
}

.detail-item:last-child {
    border-bottom: none;
}

.label {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
}

.value {
    font-size: 13px;
    color: var(--text-primary);
    font-weight: 500;
    text-align: right;
}

.loading {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 40px 20px;
    justify-content: center;
    color: var(--text-secondary);
}

.error {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    background: var(--error-color-alpha);
    border: 1px solid var(--error-color);
    border-radius: var(--radius-md);
    color: var(--error-color);
}

.retry-btn {
    padding: 6px 12px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 12px;
    transition: var(--transition);
}

.retry-btn:hover {
    background: var(--primary-hover);
}

.query-form {
    margin-bottom: 24px;
}

.input-group {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
}

.input-group input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 14px;
    transition: var(--transition);
}

.input-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.input-group input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.query-btn {
    padding: 12px 24px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: var(--transition);
    min-width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.query-btn:hover:not(:disabled) {
    background: var(--primary-hover);
}

.query-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.ip-examples {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.ip-examples span {
    font-size: 14px;
    color: var(--text-secondary);
}

.example-btn {
    padding: 4px 8px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 12px;
    transition: var(--transition);
}

.example-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.query-result {
    margin-top: 20px;
}

.history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 16px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    transition: var(--transition);
}

.history-item:hover {
    background: var(--bg-tertiary);
    border-color: var(--primary-color);
}

.history-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    cursor: pointer;
}

.history-ip {
    font-weight: 500;
    color: var(--primary-color);
    min-width: 120px;
}

.history-location {
    flex: 1;
    color: var(--text-secondary);
    font-size: 14px;
}

.history-time {
    font-size: 12px;
    color: var(--text-muted);
}

.clear-history-btn {
    padding: 8px 16px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 14px;
    transition: var(--transition);
}

.clear-history-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-top: 2px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.spinner.small {
    width: 16px;
    height: 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 骨架屏样式 */
.skeleton-text {
    background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-hover) 50%, var(--border-color) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: var(--radius-sm);
    height: 16px;
    width: 80px;
}

.skeleton-content {
    padding: 4px 0;
}

.skeleton-ip {
    background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-hover) 50%, var(--border-color) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: var(--radius-sm);
    height: 24px;
    width: 140px;
    margin-bottom: 8px;
}

.skeleton-location {
    background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-hover) 50%, var(--border-color) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: var(--radius-sm);
    height: 16px;
    width: 100px;
    margin-bottom: 16px;
}

.skeleton-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skeleton-detail-item {
    background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-hover) 50%, var(--border-color) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: var(--radius-sm);
    height: 14px;
    width: 100%;
}

.skeleton-detail-item:nth-child(1) {
    width: 90%;
}

.skeleton-detail-item:nth-child(2) {
    width: 75%;
}

.skeleton-detail-item:nth-child(3) {
    width: 85%;
}

@keyframes skeleton-loading {
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .converter-content {
        padding: 16px 0 6rem 0;
        /* 保持底部间距 */
    }

    .content-wrapper {
        gap: 24px;
        padding: 0 16px;
        /* 调整左右内边距 */
    }

    .current-ip-section,
    .query-section,
    .history-section {
        padding: 16px;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .api-source-selector {
        width: 100%;
        justify-content: space-between;
    }

    .source-select {
        min-width: 180px;
        flex: 1;
    }

    .api-results {
        grid-template-columns: 1fr;
    }

    .input-group {
        flex-direction: column;
    }

    .history-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .history-ip {
        min-width: auto;
    }

    .copy-btn {
        min-width: 28px;
        height: 28px;
    }
}

@media (max-width: 480px) {
    .ip-examples {
        flex-direction: column;
        align-items: flex-start;
    }

    .example-btn {
        padding: 6px 12px;
    }
}
</style>