<template>
    <div class="ip-lookup-container">
        <div class="header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m12 19-7-7 7-7" />
                    <path d="m19 12H5" />
                </svg>
                返回
            </button>
            <h1>IP地址查询</h1>
        </div>

        <div class="content">
            <!-- 当前IP信息 -->
            <div class="current-ip-section">
                <h2>当前IP信息</h2>
                <div v-if="currentIpInfo.length > 0" class="api-results">
                    <div v-for="(info, index) in currentIpInfo" :key="index" class="ip-card"
                        :class="{ 'primary-source': info.source === 'IP.me', 'loading-card': info.loading }">
                        <div class="source-header">
                            <span class="source-name" :class="{ 'skeleton-text': info.loading }">{{ info.loading ? '' :
                                info.source }}</span>
                            <span v-if="info.source === 'IP.me' && !info.loading" class="primary-badge">推荐</span>
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
                            <div class="ip-address">{{ info.ip }}</div>
                            <div class="ip-location">{{ info.location }}</div>
                        </div>

                        <!-- 错误状态 -->
                        <div v-else class="error-info">
                            <div class="error-message">{{ info.error }}</div>
                            <a v-if="info.source === 'IP.me'" href="https://ip.me" target="_blank" class="visit-link">
                                访问 IP.me
                            </a>
                        </div>

                        <!-- 详细信息 -->
                        <div v-if="!info.error && !info.loading && (info.country || info.region || info.city || info.isp || info.timezone)"
                            class="ip-details">
                            <div class="detail-item" v-if="info.country">
                                <span class="label">国家/地区:</span>
                                <span class="value">{{ info.country }}</span>
                            </div>
                            <div class="detail-item" v-if="info.region">
                                <span class="label">省份/州:</span>
                                <span class="value">{{ info.region }}</span>
                            </div>
                            <div class="detail-item" v-if="info.city">
                                <span class="label">城市:</span>
                                <span class="value">{{ info.city }}</span>
                            </div>
                            <div class="detail-item" v-if="info.isp">
                                <span class="label">ISP:</span>
                                <span class="value">{{ info.isp }}</span>
                            </div>
                            <div class="detail-item" v-if="info.timezone">
                                <span class="label">时区:</span>
                                <span class="value">{{ info.timezone }}</span>
                            </div>
                            <div class="detail-item" v-if="info.lat && info.lon">
                                <span class="label">经纬度:</span>
                                <span class="value">{{ info.lat }}, {{ info.lon }}</span>
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
                        <button @click="setExampleIp('114.114.114.114')" class="example-btn">114.114.114.114</button>
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
                                <div class="ip-address">{{ info.ip }}</div>
                                <div class="ip-location">{{ info.location }}</div>
                            </div>

                            <div v-if="info.error" class="error-info">
                                <div class="error-message">{{ info.error }}</div>
                            </div>

                            <div v-if="!info.error && (info.country || info.region || info.city || info.isp || info.timezone)"
                                class="ip-details">
                                <div class="detail-item" v-if="info.country">
                                    <span class="label">国家/地区:</span>
                                    <span class="value">{{ info.country }}</span>
                                </div>
                                <div class="detail-item" v-if="info.region">
                                    <span class="label">省份/州:</span>
                                    <span class="value">{{ info.region }}</span>
                                </div>
                                <div class="detail-item" v-if="info.city">
                                    <span class="label">城市:</span>
                                    <span class="value">{{ info.city }}</span>
                                </div>
                                <div class="detail-item" v-if="info.isp">
                                    <span class="label">ISP:</span>
                                    <span class="value">{{ info.isp }}</span>
                                </div>
                                <div class="detail-item" v-if="info.timezone">
                                    <span class="label">时区:</span>
                                    <span class="value">{{ info.timezone }}</span>
                                </div>
                                <div class="detail-item" v-if="info.lat && info.lon">
                                    <span class="label">经纬度:</span>
                                    <span class="value">{{ info.lat }}, {{ info.lon }}</span>
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
                    <div v-for="(item, index) in queryHistory" :key="index" class="history-item"
                        @click="setQueryIp(item.ip)">
                        <div class="history-ip">{{ item.ip }}</div>
                        <div class="history-location">{{ item.location }}</div>
                        <div class="history-time">{{ formatTime(item.timestamp) }}</div>
                    </div>
                </div>
                <button @click="clearHistory" class="clear-history-btn">清空历史</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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
}

const currentIpInfo = ref<IpInfo[]>([])
const loadingCurrent = ref(false)
const currentError = ref('')

const queryIp = ref('')
const queryResult = ref<IpInfo[]>([])
const loadingQuery = ref(false)
const queryError = ref('')

const queryHistory = ref<IpInfo[]>([])

// 从background script获取IP.me的IP信息（生产环境使用）
const fetchIpMeFromBackground = async (): Promise<IpInfo> => {
    try {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            const response = await chrome.runtime.sendMessage({ type: 'FETCH_IP_ME' });

            if (response.error) {
                return {
                    ip: '获取失败',
                    location: 'IP.me (请求失败)',
                    source: 'IP.me',
                    error: response.error
                };
            }

            return {
                ip: response.ip,
                location: response.location,
                source: 'IP.me'
            };
        } else {
            // 非扩展环境
            return {
                ip: '扩展模式',
                location: 'IP.me (需要扩展环境)',
                source: 'IP.me',
                error: '请在浏览器扩展环境中使用'
            };
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'IP.me (扩展错误)',
            source: 'IP.me',
            error: error instanceof Error ? error.message : '未知错误'
        };
    }
}

// 从代理或background script获取IP.me的IP信息
const fetchIpMeData = async (): Promise<IpInfo> => {
    try {
        // 开发环境使用代理
        if (import.meta.env.DEV) {
            const response = await fetch('/api/ip-me');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const html = await response.text();
            // 从HTML中提取IP地址
            const ipMatch = html.match(/<input[^>]*name="ip"[^>]*value="([^"]*)"[^>]*>/);

            if (ipMatch && ipMatch[1]) {
                return {
                    ip: ipMatch[1],
                    location: '来自IP.me页面',
                    source: 'IP.me'
                };
            } else {
                throw new Error('无法从页面提取IP地址');
            }
        } else {
            // 生产环境使用background script
            return await fetchIpMeFromBackground();
        }
    } catch (error) {
        console.error('获取IP.me数据失败:', error);
        return {
            ip: '获取失败',
            location: 'IP.me (请求失败)',
            source: 'IP.me',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IP-API数据
const fetchIpApiData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/ip-api/json/?fields=66842623&lang=zh-CN' : 'https://ip-api.com/json/?fields=66842623&lang=zh-CN';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return {
            ip: data.query || '未知',
            country: data.country || '',
            region: data.regionName || '',
            city: data.city || '',
            location: `${data.city || ''} ${data.regionName || ''} ${data.country || ''}`.trim() || '来自IP-API',
            isp: data.isp || '',
            timezone: data.timezone || '',
            lat: data.lat,
            lon: data.lon,
            source: 'IP-API'
        };
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'IP-API (请求失败)',
            source: 'IP-API',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IPapi.co数据
const fetchIpapiData = async (): Promise<IpInfo> => {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return {
            ip: data.ip || '未知',
            country: data.country_name || '',
            region: data.region || '',
            city: data.city || '',
            location: `${data.city || ''} ${data.region || ''} ${data.country_name || ''}`.trim() || '来自IPapi.co',
            isp: data.org || '',
            timezone: data.timezone || '',
            lat: data.latitude,
            lon: data.longitude,
            source: 'IPapi.co'
        };
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'IPapi.co (请求失败)',
            source: 'IPapi.co',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取HTTPBin数据
const fetchHttpbinData = async (): Promise<IpInfo> => {
    try {
        const response = await fetch('https://httpbin.org/ip');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return {
            ip: data.origin || '未知',
            location: '仅提供IP地址',
            source: 'HTTPBin'
        };
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'HTTPBin (请求失败)',
            source: 'HTTPBin',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取ifconfig.me数据
const fetchIfconfigData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/ifconfig/all.json' : 'https://ifconfig.me/all.json';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return {
            ip: data.ip_addr || '未知',
            country: data.country || '',
            region: data.region || '',
            city: data.city || '',
            location: `${data.city || ''} ${data.region || ''} ${data.country || ''}`.trim() || '来自ifconfig.me',
            isp: data.connection?.isp || '',
            timezone: data.time_zone || '',
            source: 'ifconfig.me'
        };
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'ifconfig.me (请求失败)',
            source: 'ifconfig.me',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IPIP.net数据
const fetchIpipData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/myip-ipip' : 'https://myip.ipip.net';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        // 解析IPIP.net的文本响应
        const match = text.match(/当前 IP：([0-9.]+)\s+来自于：(.+)/);
        if (match && match[1] && match[2]) {
            return {
                ip: match[1],
                location: match[2],
                source: 'IPIP.net'
            };
        } else {
            throw new Error('无法解析响应');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'IPIP.net (请求失败)',
            source: 'IPIP.net',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取CIP.cc数据 (占位符)
const fetchCipData = async (): Promise<IpInfo> => {
    try {
        // TODO: 实现CIP.cc数据获取
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟请求
        return {
            ip: '待实现',
            location: 'CIP.cc (待实现)',
            source: 'CIP.cc',
            error: '功能待实现'
        };
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'CIP.cc (请求失败)',
            source: 'CIP.cc',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IPinfo.io数据 (占位符)
const fetchIpinfoData = async (): Promise<IpInfo> => {
    try {
        // TODO: 实现IPinfo.io数据获取
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟请求
        return {
            ip: '待实现',
            location: 'IPinfo.io (待实现)',
            source: 'IPinfo.io',
            error: '功能待实现'
        };
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'IPinfo.io (请求失败)',
            source: 'IPinfo.io',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IP.cn数据 (占位符)
const fetchIpCnData = async (): Promise<IpInfo> => {
    try {
        // TODO: 实现IP.cn数据获取
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟请求
        return {
            ip: '待实现',
            location: 'IP.cn (待实现)',
            source: 'IP.cn',
            error: '功能待实现'
        };
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'IP.cn (请求失败)',
            source: 'IP.cn',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取3322.org数据 (占位符)
const fetch3322Data = async (): Promise<IpInfo> => {
    try {
        // TODO: 实现3322.org数据获取
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟请求
        return {
            ip: '待实现',
            location: '3322.org (待实现)',
            source: '3322.org',
            error: '功能待实现'
        };
    } catch (error) {
        return {
            ip: '获取失败',
            location: '3322.org (请求失败)',
            source: '3322.org',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取当前IP信息
const getCurrentIpInfo = async () => {
    console.log('开始获取IP信息，显示骨架屏')
    loadingCurrent.value = false // 不显示全局loading
    currentError.value = ''

    // 先创建骨架屏卡片
    const skeletonCards: IpInfo[] = [
        { ip: '', location: '', source: 'IP.me', loading: true },
        { ip: '', location: '', source: 'IP-API', loading: true },
        { ip: '', location: '', source: 'IPapi.co', loading: true },
        { ip: '', location: '', source: 'HTTPBin', loading: true },
        { ip: '', location: '', source: 'ifconfig.me', loading: true },
        { ip: '', location: '', source: 'IPIP.net', loading: true },
        { ip: '', location: '', source: 'CIP.cc', loading: true },
        { ip: '', location: '', source: 'IPinfo.io', loading: true },
        { ip: '', location: '', source: 'IP.cn', loading: true },
        { ip: '', location: '', source: '3322.org', loading: true }
    ]
    currentIpInfo.value = skeletonCards
    console.log('骨架屏卡片已设置:', skeletonCards)

    try {
        // 定义所有API源
        const apis = [
            { name: 'IP.me', index: 0, fetcher: fetchIpMeData },
            { name: 'IP-API', index: 1, fetcher: fetchIpApiData },
            { name: 'IPapi.co', index: 2, fetcher: fetchIpapiData },
            { name: 'HTTPBin', index: 3, fetcher: fetchHttpbinData },
            { name: 'ifconfig.me', index: 4, fetcher: fetchIfconfigData },
            { name: 'IPIP.net', index: 5, fetcher: fetchIpipData },
            { name: 'CIP.cc', index: 6, fetcher: fetchCipData },
            { name: 'IPinfo.io', index: 7, fetcher: fetchIpinfoData },
            { name: 'IP.cn', index: 8, fetcher: fetchIpCnData },
            { name: '3322.org', index: 9, fetcher: fetch3322Data }
        ]

        // 异步并发请求所有API，每个完成后立即更新对应卡片
        apis.forEach(async (api) => {
            try {
                let result: IpInfo

                // 添加最小延迟以便看到骨架屏效果
                await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

                if (api.fetcher) {
                    result = await api.fetcher()
                } else {
                    throw new Error('API配置错误')
                }

                // 更新对应位置的卡片
                console.log(`${api.name} 数据加载完成:`, result)
                currentIpInfo.value[api.index] = result
            } catch (error) {
                // 更新对应位置的卡片为错误状态
                console.log(`${api.name} 加载失败:`, error)
                currentIpInfo.value[api.index] = {
                    ip: '',
                    location: '请求失败',
                    source: api.name,
                    error: error instanceof Error ? error.message : '网络错误'
                } as IpInfo
            }
        })

    } catch (error) {
        console.error('获取当前IP信息失败:', error)
        currentError.value = '获取IP信息失败，请检查网络连接'
    }
}

// 查询指定IP信息
const queryIpInfo = async () => {
    if (!queryIp.value.trim()) return

    // 简单的IP格式验证
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    if (!ipRegex.test(queryIp.value.trim())) {
        queryError.value = '请输入有效的IP地址格式'
        return
    }

    loadingQuery.value = true
    queryError.value = ''
    queryResult.value = []

    try {
        const ip = queryIp.value.trim()

        // 定义多个API源（IP.me不支持查询特定IP）
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
            },
            {
                name: 'IP-API',
                url: `https://ip-api.com/json/${ip}?lang=zh-CN`,
                parser: (data: any): IpInfo => ({
                    ip: data.query || ip,
                    country: data.country || '',
                    region: data.regionName || '',
                    city: data.city || '',
                    location: `${data.city || ''} ${data.regionName || ''} ${data.country || ''}`.trim() || '未知位置',
                    isp: data.isp || '',
                    timezone: data.timezone || '',
                    lat: data.lat,
                    lon: data.lon,
                    source: 'IP-API'
                })
            }
        ]

        // 并发请求所有API
        const promises = apis.map(async (api) => {
            try {
                const response = await fetch(api.url)
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
        // 只保留成功的结果，过滤掉错误的
        queryResult.value = results.filter(result => result.ip && !result.error)

        // 添加到历史记录（只保存第一个成功的结果）
        const successResult = queryResult.value[0]
        if (successResult) {
            const historyItem = { ...successResult, timestamp: Date.now() }
            const existingIndex = queryHistory.value.findIndex(item => item.ip === successResult.ip)
            if (existingIndex >= 0) {
                queryHistory.value.splice(existingIndex, 1)
            }
            queryHistory.value.unshift(historyItem)

            // 限制历史记录数量
            if (queryHistory.value.length > 10) {
                queryHistory.value = queryHistory.value.slice(0, 10)
            }

            // 保存到本地存储
            localStorage.setItem('ip-query-history', JSON.stringify(queryHistory.value))
        }

        // 如果没有成功的结果
        if (queryResult.value.length === 0) {
            queryError.value = '所有查询服务都失败了，请稍后重试'
        }

    } catch (error) {
        console.error('查询IP信息失败:', error)
        queryError.value = '查询失败，请稍后重试'
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
.ip-lookup-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.header {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    flex-shrink: 0;
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
    background: var(--bg-hover);
    color: var(--text-primary);
}

.header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
}

.content {
    flex: 1;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px;
    padding-bottom: 80px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
    box-sizing: border-box;
}

.current-ip-section,
.query-section,
.history-section {
    width: 100%;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 24px;
    box-sizing: border-box;
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
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: 20px;
    box-sizing: border-box;
    transition: var(--transition);
}

.ip-card.primary-source {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary-alpha);
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
    background: var(--color-primary);
    color: white;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
}

.error-badge {
    background: var(--color-error);
    color: white;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
}

.ip-main {
    margin-bottom: 16px;
}

.ip-address {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-primary);
    margin-bottom: 4px;
}

.ip-location {
    font-size: 14px;
    color: var(--text-secondary);
}

.error-info {
    padding: 12px;
    background: var(--bg-error);
    border: 1px solid var(--border-error);
    border-radius: var(--radius-sm);
}

.error-message {
    font-size: 14px;
    color: var(--text-error);
    margin-bottom: 8px;
}

.visit-link {
    display: inline-block;
    padding: 6px 12px;
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
    transition: var(--transition);
}

.visit-link:hover {
    background: var(--color-primary-hover);
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
    background: var(--bg-error);
    border: 1px solid var(--border-error);
    border-radius: var(--radius-md);
    color: var(--text-error);
}

.retry-btn {
    padding: 6px 12px;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 12px;
    transition: var(--transition);
}

.retry-btn:hover {
    background: var(--color-primary-hover);
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
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.input-group input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.query-btn {
    padding: 12px 24px;
    background: var(--color-primary);
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
    background: var(--color-primary-hover);
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
    gap: 16px;
    padding: 12px 16px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition);
}

.history-item:hover {
    background: var(--bg-hover);
    border-color: var(--color-primary);
}

.history-ip {
    font-weight: 500;
    color: var(--color-primary);
    min-width: 120px;
}

.history-location {
    flex: 1;
    color: var(--text-secondary);
    font-size: 14px;
}

.history-time {
    font-size: 12px;
    color: var(--text-tertiary);
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
    border-top: 2px solid var(--color-primary);
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

@media (max-width: 768px) {
    .content {
        padding: 16px;
        padding-bottom: 60px;
        gap: 24px;
    }

    .current-ip-section,
    .query-section,
    .history-section {
        padding: 16px;
    }

    .api-results {
        grid-template-columns: 1fr;
    }

    .input-group {
        flex-direction: column;
    }

    .history-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .history-ip {
        min-width: auto;
    }
}
</style>