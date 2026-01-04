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
                        </div>

                        <!-- 错误状态 -->
                        <div v-else class="error-info">
                            <div class="error-message">{{ info.error }}</div>
                            <a v-if="info.source === 'IP.me'" href="https://ip.me" target="_blank" class="visit-link">
                                访问 IP.me
                            </a>
                        </div>

                        <!-- 详细信息 -->
                        <div v-if="!info.error && !info.loading" class="ip-details">
                            <div class="detail-item">
                                <span class="label">国家/地区:</span>
                                <span class="value">{{ info.country || '-' }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">省份/州:</span>
                                <span class="value">{{ info.region || '-' }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">城市:</span>
                                <span class="value">{{ info.city || '-' }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">ISP:</span>
                                <span class="value">{{ info.isp || '-' }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">时区:</span>
                                <span class="value">{{ info.timezone || '-' }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">经纬度:</span>
                                <span class="value">{{ (info.lat && info.lon) ? `${info.lat}, ${info.lon}` : '-' }}</span>
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
                            </div>

                            <div v-if="info.error" class="error-info">
                                <div class="error-message">{{ info.error }}</div>
                            </div>

                            <div v-if="!info.error" class="ip-details">
                                <div class="detail-item">
                                    <span class="label">国家/地区:</span>
                                    <span class="value">{{ info.country || '-' }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">省份/州:</span>
                                    <span class="value">{{ info.region || '-' }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">城市:</span>
                                    <span class="value">{{ info.city || '-' }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">ISP:</span>
                                    <span class="value">{{ info.isp || '-' }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">时区:</span>
                                    <span class="value">{{ info.timezone || '-' }}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">经纬度:</span>
                                    <span class="value">{{ (info.lat && info.lon) ? `${info.lat}, ${info.lon}` : '-' }}</span>
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
import {  ref, onMounted, onUnmounted  } from 'vue'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'

// 立即执行的调试信息已移除

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
    // IP.me额外字段
    countryCode?: string
    postalCode?: string
    organization?: string
    asn?: string
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
            
            // 查找表格并从中提取数据
            const tableSection = html.match(/<table[\s\S]*?<\/table>/);
            let city = '', country = '', countryCode = '', lat = '', lon = '', postalCode = '', organization = '', asn = '', ispName = '';
            
            if (tableSection) {
                const tableHtml = tableSection[0];
                
                // 使用更宽松的正则，允许中间有其他内容
                const cityMatch = tableHtml.match(/<th>City:<\/th>[\s\S]*?<code>([^<]*)<\/code>/);
                const countryMatch = tableHtml.match(/<th>Country:<\/th>[\s\S]*?<code>([^<]*)<\/code>/);
                const countryCodeMatch = tableHtml.match(/<th>Country Code:<\/th>[\s\S]*?<code>([^<]*)<\/code>/);
                const latMatch = tableHtml.match(/<th>Latitude:<\/th>[\s\S]*?<code>([^<]*)<\/code>/);
                const lonMatch = tableHtml.match(/<th>Longitude:<\/th>[\s\S]*?<code>([^<]*)<\/code>/);
                const postalMatch = tableHtml.match(/<th>Postal Code:<\/th>[\s\S]*?<code>([^<]*)<\/code>/);
                const orgMatch = tableHtml.match(/<th>Organization:<\/th>[\s\S]*?<code>([^<]*)<\/code>/);
                const asnMatch = tableHtml.match(/<th>ASN:<\/th>[\s\S]*?<code>([^<]*)<\/code>/);
                const ispMatch = tableHtml.match(/<th>ISP Name:<\/th>[\s\S]*?<code>([^<]*)<\/code>/);
                
                city = cityMatch?.[1] || '';
                country = countryMatch?.[1] || '';
                countryCode = countryCodeMatch?.[1] || '';
                lat = latMatch?.[1] || '';
                lon = lonMatch?.[1] || '';
                postalCode = (postalMatch?.[1] && postalMatch[1] !== 'None') ? postalMatch[1] : '';
                organization = orgMatch?.[1] || '';
                asn = asnMatch?.[1] || '';
                ispName = ispMatch?.[1] || '';
                
                
            } else {
            }

            // 简单的城市到省份映射（中国主要城市）
            const getCityProvince = (city: string, country: string): string => {
                if (country !== 'China') return '';
                
                const cityProvinceMap: { [key: string]: string } = {
                    'Beijing': '北京',
                    'Shanghai': '上海',
                    'Shenzhen': '广东',
                    'Guangzhou': '广东',
                    'Hangzhou': '浙江',
                    'Nanjing': '江苏',
                    'Chengdu': '四川',
                    'Wuhan': '湖北',
                    'Xi\'an': '陕西',
                    'Tianjin': '天津',
                    'Chongqing': '重庆'
                };
                
                return cityProvinceMap[city] || '';
            };

            const result = {
                ip: ipMatch ? ipMatch[1] : '未知',
                city: city,
                country: country,
                region: getCityProvince(city, country), // 根据城市推断省份
                location: `${city} ${country}`.trim() || '来自IP.me',
                isp: ispName || organization,
                timezone: '',
                lat: lat ? parseFloat(lat) : undefined,
                lon: lon ? parseFloat(lon) : undefined,
                source: 'IP.me',
                countryCode: countryCode,
                postalCode: postalCode,
                organization: organization,
                asn: asn
            } as IpInfo;
            
            return result;
        } else {
            // 生产环境使用background script
            return await fetchIpMeFromBackground();
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'IP.me (请求失败)',
            source: 'IP.me',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取whatismyipaddress.com数据
const fetchWhatIsMyIpData = async (): Promise<IpInfo> => {
    try {
        // 直接使用固定token，跳过主页获取
        const token = '4c9dd22613e14d8d6717f16874731d5e';
        
        // 直接调用API
        const apiUrl = import.meta.env.DEV 
            ? `/api/whatismyip-api/ds3?token=${token}&v=4`
            : `https://whatismyipaddress.com/api/ds3?token=${token}&v=4`;
        
        const apiResponse = await fetch(apiUrl);
        
        if (!apiResponse.ok) {
            throw new Error(`API请求失败: HTTP ${apiResponse.status}`);
        }
        
        const data = await apiResponse.json();
        
        // 数据在data字段中
        const ipData = data.data || data;
        
        const result = {
            ip: ipData.ipv4 || ipData.ip || '未知',
            country: ipData.country || '',
            region: ipData.region || ipData.state || '',
            city: ipData.city || '',
            location: `${ipData.city || ''} ${ipData.region || ipData.state || ''} ${ipData.country || ''}`.trim() || '未知位置',
            isp: ipData.isp || '',
            timezone: ipData.timezone || '',
            lat: ipData.latitude ? parseFloat(ipData.latitude) : undefined,
            lon: ipData.longitude ? parseFloat(ipData.longitude) : undefined,
            source: 'WhatIsMyIP'
        };
        
        return result;
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'WhatIsMyIP',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IPIP.net JSON数据
const fetchIpipJsonData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/ipip-json' : 'https://myip.ipip.net/json';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.ret === 'ok' && data.data) {
            const ipData = data.data;
            const location = ipData.location || [];
            
            const result = {
                ip: ipData.ip || '未知',
                country: location[0] || '',
                region: location[1] || '',
                city: location[2] || '',
                location: location.filter(item => item).join(' ') || '未知位置',
                isp: location[4] || '',
                timezone: '',
                source: 'IPIP.net'
            };
            
            return result;
        } else {
            throw new Error('API返回格式错误');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'IPIP.net',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取ITDog数据
const fetchItDogData = async (): Promise<IpInfo> => {
    try {
        // 生成时间戳参数
        const timestamp = Date.now();
        const url = import.meta.env.DEV 
            ? `/api/itdog?_t=${timestamp}` 
            : `https://ipv4_cu.itdog.cn/?_t=${timestamp}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.type === 'success' && data.ip) {
            // 解析地址信息，格式：中国/广东/深圳/联通
            const addressParts = data.address ? data.address.split('/') : [];
            
            const result = {
                ip: data.ip || '未知',
                country: addressParts[0] || '',
                region: addressParts[1] || '',
                city: addressParts[2] || '',
                location: data.address || '未知位置',
                isp: addressParts[3] || '',
                timezone: '',
                source: 'ITDog'
            };
            
            return result;
        } else {
            throw new Error('API返回格式错误');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'ITDog',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取又拍云数据
const fetchUpYunData = async (): Promise<IpInfo> => {
    try {
        // 生成时间戳参数
        const timestamp = Date.now();
        const url = import.meta.env.DEV 
            ? `/api/upyun?_upnode&_t=${timestamp}` 
            : `https://pubstatic.b0.upaiyun.com/?_upnode&_t=${timestamp}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.remote_addr && data.remote_addr_location) {
            // 使用用户的真实IP和位置信息
            const ip = data.remote_addr;
            const location = data.remote_addr_location;
            
            const result = {
                ip: ip || '未知',
                country: location?.country || '',
                region: location?.province || '',
                city: location?.city || '',
                location: `${location?.city || ''} ${location?.province || ''} ${location?.country || ''}`.trim() || '未知位置',
                isp: location?.isp || '',
                timezone: '',
                source: 'UpYun'
            };
            
            return result;
        } else {
            throw new Error('API返回数据格式错误');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'UpYun',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取AAPQ数据
const fetchAapqData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/aapq' : 'https://fcd09628a76x.aapq.net/ip';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.ip) {
            // 国家代码转换为中文名称
            const countryMap: { [key: string]: string } = {
                'CN': '中国',
                'US': '美国',
                'JP': '日本',
                'KR': '韩国',
                'GB': '英国',
                'DE': '德国',
                'FR': '法国',
                'CA': '加拿大',
                'AU': '澳大利亚',
                'SG': '新加坡',
                'HK': '香港',
                'TW': '台湾',
                'MO': '澳门'
            };
            
            const country = countryMap[data.country] || data.country || '';
            
            const result = {
                ip: data.ip || '未知',
                country: country,
                region: '',
                city: data.city || '',
                location: `${data.city || ''} ${country}`.trim() || '未知位置',
                isp: '',
                timezone: '',
                source: 'AAPQ'
            };
            
            return result;
        } else {
            throw new Error('API返回数据格式错误');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'AAPQ',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IPDataCloud数据
const fetchIpDataCloudData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/ipdatacloud' : 'https://app.ipdatacloud.com/v1/ip_self_search';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            const ipData = data.data;
            
            const result = {
                ip: ipData.ip || '未知',
                country: ipData.country || '',
                region: ipData.province || '',
                city: ipData.city || '',
                location: `${ipData.city || ''} ${ipData.province || ''} ${ipData.country || ''}`.trim() || '未知位置',
                isp: '',
                timezone: '',
                lat: ipData.latitude ? parseFloat(ipData.latitude) : undefined,
                lon: ipData.longitude ? parseFloat(ipData.longitude) : undefined,
                source: 'IPDataCloud'
            };
            
            return result;
        } else {
            throw new Error(`API返回错误: ${data.msg || '未知错误'}`);
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'IPDataCloud',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IPNews数据
const fetchIpNewsData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/ipnews' : 'https://api.ipnews.io/v1/ip_self_search';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            const ipData = data.data;
            
            // 国家名称转换（如果是英文则转为中文）
            const countryMap: { [key: string]: string } = {
                'China': '中国',
                'United States': '美国',
                'Japan': '日本',
                'South Korea': '韩国',
                'United Kingdom': '英国',
                'Germany': '德国',
                'France': '法国',
                'Canada': '加拿大',
                'Australia': '澳大利亚',
                'Singapore': '新加坡'
            };
            
            const country = countryMap[ipData.country] || ipData.country || '';
            
            const result = {
                ip: ipData.ip || '未知',
                country: country,
                region: ipData.region || '',
                city: ipData.city || '',
                location: `${ipData.city || ''} ${ipData.region || ''} ${country}`.trim() || '未知位置',
                isp: ipData.isp || ipData.carrier_name || '',
                timezone: ipData.time_zone || '',
                lat: ipData.latitude ? parseFloat(ipData.latitude) : undefined,
                lon: ipData.longitude ? parseFloat(ipData.longitude) : undefined,
                asn: ipData.asn || '',
                source: 'IPNews'
            };
            
            return result;
        } else {
            throw new Error(`API返回错误: ${data.msg || '未知错误'}`);
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'IPNews',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取MaxMind数据
const fetchMaxMindData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/maxmind' : 'https://geoip.maxmind.com/geoip/v2.1/city/me';
        
        const response = await fetch(url, {
            headers: {
                'Accept': '*/*',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Referer': 'https://www.maxmind.com/'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.traits && data.traits.ip_address) {
            // 优先使用中文名称，如果没有则使用英文
            const getLocalizedName = (names: any) => {
                return names?.['zh-CN'] || names?.['en'] || '';
            };
            
            const country = getLocalizedName(data.country?.names);
            const region = getLocalizedName(data.subdivisions?.[0]?.names);
            const city = getLocalizedName(data.city?.names);
            
            const result = {
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
            };
            
            return result;
        } else {
            throw new Error('API返回数据格式错误');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'MaxMind',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取XXIR数据
const fetchXxirData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/xxir' : 'https://ip.xxir.com/ip/mtip.php';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.ip && data.data) {
            const ipData = data.data;
            
            // 解析详细地址，格式：中国/广东省/深圳市/南山区/南方科技大学九华精舍
            const addressParts = ipData.detail ? ipData.detail.split('/') : [];
            
            const result = {
                ip: data.ip || '未知',
                country: addressParts[0] || '',
                region: addressParts[1] || '',
                city: addressParts[2] || '',
                location: ipData.detail || '未知位置',
                isp: '',
                timezone: '',
                lat: ipData.lat ? parseFloat(ipData.lat) : undefined,
                lon: ipData.lng ? parseFloat(ipData.lng) : undefined,
                source: 'XXIR'
            };
            
            return result;
        } else {
            throw new Error('API返回数据格式错误');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'XXIR',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IPLark数据
const fetchIpLarkData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/iplark' : 'https://iplark.com/ipapi/public/ipinfo?db=moon';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 0 && data.data) {
            const ipData = data.data;
            
            const result = {
                ip: ipData.ip || '未知',
                country: ipData.country || '',
                region: ipData.province || '',
                city: ipData.city || '',
                location: `${ipData.city || ''} ${ipData.province || ''} ${ipData.country || ''}`.trim() || '未知位置',
                isp: ipData.as || '',
                timezone: '',
                lat: ipData.latitude ? parseFloat(ipData.latitude) : undefined,
                lon: ipData.longitude ? parseFloat(ipData.longitude) : undefined,
                source: 'IPLark'
            };
            
            return result;
        } else {
            throw new Error(`API返回错误: ${data.message || '未知错误'}`);
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'IPLark',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取淘宝数据
const fetchTaobaoData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/taobao' : 'https://www.taobao.com/help/getip.php';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const text = await response.text();
        
        // 淘宝返回的是JSONP格式，需要解析
        // 格式通常是：ipCallback({"data":{"ip":"xxx","country":"xxx"}})
        const jsonpMatch = text.match(/ipCallback\((.+)\)/);
        if (jsonpMatch) {
            const data = JSON.parse(jsonpMatch[1]);
            
            if (data.data) {
                const ipData = data.data;
                
                const result = {
                    ip: ipData.ip || '未知',
                    country: ipData.country || '',
                    region: ipData.region || '',
                    city: ipData.city || '',
                    location: `${ipData.city || ''} ${ipData.region || ''} ${ipData.country || ''}`.trim() || '未知位置',
                    isp: ipData.isp || '',
                    timezone: '',
                    source: 'Taobao'
                };
                
                return result;
            }
        }
        
        throw new Error('无法解析淘宝API响应');
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'Taobao',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取BrowserScan数据
const fetchBrowserScanData = async (): Promise<IpInfo> => {
    try {
        // 生成时间戳
        const timestamp = Math.floor(Date.now() / 1000);
        // 这里使用示例中的签名，实际可能需要动态生成
        const sign = 'b0d247da09f5a53af1f7b72fed3abcff';
        
        const url = import.meta.env.DEV 
            ? `/api/browserscan?_t=${timestamp}&_from=browserscan&_sign=${sign}&type=ip-api`
            : `https://ip-scan.browserscan.net/sys/config/ip/get-visitor-ip?_t=${timestamp}&_from=browserscan&_sign=${sign}&type=ip-api`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 0 && data.data && data.data.ip_data) {
            const ipData = data.data.ip_data;
            
            // 国家代码转换
            const countryMap: { [key: string]: string } = {
                'cn': '中国',
                'us': '美国',
                'jp': '日本',
                'kr': '韩国',
                'gb': '英国',
                'de': '德国',
                'fr': '法国',
                'ca': '加拿大',
                'au': '澳大利亚',
                'sg': '新加坡',
                'hk': '香港',
                'tw': '台湾'
            };
            
            // 省份代码转换
            const regionMap: { [key: string]: string } = {
                'gd': '广东',
                'bj': '北京',
                'sh': '上海',
                'js': '江苏',
                'zj': '浙江',
                'sd': '山东',
                'hn': '河南',
                'sc': '四川',
                'hb': '湖北',
                'hl': '湖南'
            };
            
            const country = countryMap[ipData.country] || ipData.country || '';
            const region = regionMap[ipData.region] || ipData.region || '';
            
            const result = {
                ip: data.data.ip || '未知',
                country: country,
                region: region,
                city: ipData.city || '',
                location: `${ipData.city || ''} ${region} ${country}`.trim() || '未知位置',
                isp: ipData.isp || '',
                timezone: ipData.timezone || '',
                lat: ipData.latitude ? parseFloat(ipData.latitude) : undefined,
                lon: ipData.longitude ? parseFloat(ipData.longitude) : undefined,
                source: 'BrowserScan'
            };
            
            return result;
        } else {
            throw new Error(`API返回错误: ${data.msg || '未知错误'}`);
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'BrowserScan',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取MyIP.com.tw数据
const fetchMyIpTwData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/myip-tw' : 'https://myip.com.tw/';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const html = await response.text();
        
        // 提取IP地址
        const ipMatch = html.match(/data-ip="([^"]+)"/);
        const ip = ipMatch ? ipMatch[1] : '';
        
        // 提取各个信息字段 - 优化正则表达式以更好地匹配HTML结构
        const extractInfoValue = (label: string): string => {
            // 更精确的正则表达式，处理HTML标签和图标
            const regex = new RegExp(`<div class="info-label">.*?${label}.*?</div>\\s*<div class="info-value">([^<]+)</div>`, 'is');
            const match = html.match(regex);
            const result = match ? match[1].trim() : '';
            return result;
        };
        
        const country = extractInfoValue('國家/地區');
        const region = extractInfoValue('地區');
        const city = extractInfoValue('城市');
        const isp = extractInfoValue('網路提供商');
        const timezone = extractInfoValue('時區');
        const coordinates = extractInfoValue('座標');
        
        // 解析坐标
        let lat: number | undefined, lon: number | undefined;
        if (coordinates) {
            const coordMatch = coordinates.match(/([0-9.-]+),([0-9.-]+)/);
            if (coordMatch) {
                lat = parseFloat(coordMatch[1]);
                lon = parseFloat(coordMatch[2]);
            }
        }
        
        // 国家代码转换
        const countryMap: { [key: string]: string } = {
            'CN': '中国',
            'US': '美国',
            'JP': '日本',
            'KR': '韩国',
            'GB': '英国',
            'DE': '德国',
            'FR': '法国',
            'CA': '加拿大',
            'AU': '澳大利亚',
            'SG': '新加坡',
            'HK': '香港',
            'TW': '台湾'
        };
        
        const countryName = countryMap[country] || country || '';
        
        const result = {
            ip: ip || '未知',
            country: countryName,
            region: region,
            city: city,
            location: `${city} ${region} ${countryName}`.trim() || '未知位置',
            isp: isp,
            timezone: timezone,
            lat: lat,
            lon: lon,
            source: 'MyIP.com.tw'
        };
        
        return result;
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'MyIP.com.tw',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取Coding.tools数据
const fetchCodingToolsData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/coding-tools' : 'https://coding.tools/cn/my-ip-address';
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json, text/plain, */*',
                'X-Requested-With': 'XMLHttpRequest',
                'Cache-Control': 'no-cache'
            },
            body: 'queryIp=' // 空值，表示查询当前IP
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const text = await response.text();
        
        // 尝试解析JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            throw new Error('服务器返回HTML而不是JSON，可能需要特殊认证');
        }
        
        if (data.ip) {
            // 国家名称转换
            const countryMap: { [key: string]: string } = {
                'China': '中国',
                'United States': '美国',
                'Japan': '日本',
                'South Korea': '韩国',
                'United Kingdom': '英国',
                'Germany': '德国',
                'France': '法国',
                'Canada': '加拿大',
                'Australia': '澳大利亚',
                'Singapore': '新加坡'
            };
            
            const country = countryMap[data.country_name] || data.country_name || '';
            
            const result = {
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
            };
            
            return result;
        } else {
            throw new Error('API返回数据格式错误');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'Coding.tools',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IP-API数据
const fetchIpApiData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/ip-api/json/?fields=66842623&lang=en' : 'http://demo.ip-api.com/json/?fields=66842623&lang=en';
        const response = await fetch(url, {
            headers: {
                'Referer': 'https://ip-api.com/'
            }
        });
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
        // 使用IPv4专用的API端点
        const response = await fetch('https://ipapi.co/json/?force=ipv4');
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
            country: '', // ifconfig.me不提供地理位置信息
            region: '',
            city: '',
            location: '来自ifconfig.me',
            isp: '',
            timezone: '',
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

// 获取CIP.cc数据
const fetchCipCcData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/cip-cc' : 'https://cip.cc/';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const html = await response.text();
        
        // 查找包含IP信息的pre标签
        const preMatch = html.match(/<pre>([\s\S]*?)<\/pre>/);
        if (preMatch) {
            const preContent = preMatch[1];
            
            // 解析各个字段
            const extractField = (fieldName: string): string => {
                const regex = new RegExp(`${fieldName}\\s*[:：]\\s*([^\\n\\r]+)`, 'i');
                const match = preContent.match(regex);
                return match ? match[1].trim() : '';
            };
            
            const ip = extractField('IP');
            const address = extractField('地址');
            const isp = extractField('运营商');
            
            // 解析地址信息，格式：中国 广东 深圳
            const addressParts = address ? address.split(/\s+/) : [];
            
            const result = {
                ip: ip || '未知',
                country: addressParts[0] || '',
                region: addressParts[1] || '',
                city: addressParts[2] || '',
                location: address || '未知位置',
                isp: isp || '',
                timezone: '',
                source: 'CIP.cc'
            };
            
            return result;
        } else {
            throw new Error('无法找到IP信息');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'CIP.cc',
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

// 获取IPinfo.io数据
const fetchIpinfoData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? '/api/ipinfo' : 'https://ipinfo.io/lookup-data';
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.userIp) {
            const result = {
                ip: data.userIp || '未知',
                country: '',
                region: '',
                city: '',
                location: '来自IPinfo.io',
                isp: '',
                timezone: '',
                asn: data.asn || '',
                source: 'IPinfo.io'
            };
            
            return result;
        } else {
            throw new Error('API返回数据格式错误');
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'IPinfo.io',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取IP.cn数据
const fetchIpCnData = async (): Promise<IpInfo> => {
    try {
        // 生成类似的ticket格式：32位十六进制字符串 + 时间戳
        const randomHex = Array.from({length: 32}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const timestamp = Date.now().toString();
        const ticket = randomHex + timestamp;
        
        const url = import.meta.env.DEV 
            ? `/api/ip-cn?ticket=${ticket}`
            : `https://my.ip.cn/json/?ticket=${ticket}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const text = await response.text();
        
        // 检查是否返回"ticket expire"
        if (text.includes('ticket expire')) {
            throw new Error('ticket已过期，需要重新生成');
        }
        
        // 尝试解析JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            throw new Error('响应不是有效的JSON格式');
        }
        
        if (data.status && data.code === 0 && data.data) {
            const ipData = data.data;
            
            const result = {
                ip: ipData.ip || '未知',
                country: ipData.country || '',
                region: ipData.province || '',
                city: ipData.city || '',
                location: `${ipData.city || ''} ${ipData.province || ''} ${ipData.country || ''}`.trim() || '未知位置',
                isp: ipData.isp || '',
                timezone: '',
                source: 'IP.cn'
            };
            
            return result;
        } else {
            throw new Error(`API返回错误: ${data.msg || '未知错误'}`);
        }
    } catch (error) {
        return {
            ip: '获取失败',
            location: '请求失败',
            source: 'IP.cn',
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

// 获取USTC数据
const fetchUstcData = async (): Promise<IpInfo> => {
    try {
        const url = import.meta.env.DEV ? `/api/ustc/backend/getIP.php?&r=${Math.random()}` : `https://test.ustc.edu.cn/backend/getIP.php?&r=${Math.random()}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return {
            ip: data.processedString || '未知',
            location: '来自中科大',
            source: 'USTC',
            isp: data.rawIspInfo || ''
        };
    } catch (error) {
        return {
            ip: '获取失败',
            location: 'USTC (请求失败)',
            source: 'USTC',
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
    loadingCurrent.value = false // 不显示全局loading
    currentError.value = ''

    // 配置所有API源 - 调整这里的顺序就能改变显示顺序
    const apiConfigs = [
        // { name: 'IP.me', fetcher: fetchIpMeData },
        // { name: 'WhatIsMyIP', fetcher: fetchWhatIsMyIpData },
        // { name: 'IPIP.net', fetcher: fetchIpipJsonData },
        // { name: 'ITDog', fetcher: fetchItDogData },
        // { name: 'UpYun', fetcher: fetchUpYunData },
        // { name: 'AAPQ', fetcher: fetchAapqData },
        // { name: 'IPDataCloud', fetcher: fetchIpDataCloudData },
        // { name: 'IPNews', fetcher: fetchIpNewsData },
        // { name: 'MaxMind', fetcher: fetchMaxMindData },
        // { name: 'XXIR', fetcher: fetchXxirData },
        // { name: 'IPLark', fetcher: fetchIpLarkData },
        // { name: 'BrowserScan', fetcher: fetchBrowserScanData },
        // { name: 'MyIP.com.tw', fetcher: fetchMyIpTwData },
        // { name: 'IPapi.co', fetcher: fetchIpapiData },
        // { name: 'HTTPBin', fetcher: fetchHttpbinData },
        // { name: 'ifconfig.me', fetcher: fetchIfconfigData },
        // { name: 'USTC', fetcher: fetchUstcData },
        { name: 'Coding.tools', fetcher: fetchCodingToolsData },
        // { name: 'IP-API', fetcher: fetchIpApiData },  
        // { name: 'CIP.cc', fetcher: fetchCipCcData },
        // { name: 'IPinfo.io', fetcher: fetchIpinfoData },
    ]
    
    // 根据配置创建骨架屏卡片
    const skeletonCards: IpInfo[] = apiConfigs.map(config => ({
        ip: '',
        location: '',
        source: config.name,
        loading: true
    }))
    currentIpInfo.value = skeletonCards

    try {
        // 异步并发请求所有API，每个完成后立即更新对应卡片
        apiConfigs.forEach(async (config, index) => {
            try {
                let result: IpInfo

                // 添加最小延迟以便看到骨架屏效果
                await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

                if (config.fetcher) {
                    result = await config.fetcher()
                } else {
                    throw new Error('API配置错误')
                }

                // 更新对应位置的卡片
                currentIpInfo.value[index] = result
            } catch (error) {
                // 更新对应位置的卡片为错误状态
                currentIpInfo.value[index] = {
                    ip: '',
                    location: '请求失败',
                    source: config.name,
                    error: error instanceof Error ? error.message : '网络错误'
                } as IpInfo
            }
        })

    } catch (error) {
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
                url: `http://demo.ip-api.com/json/${ip}?fields=66842623&lang=en`,
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
                }),
                headers: {
                    'Referer': 'https://ip-api.com/'
                }
            },
            {
                name: 'USTC',
                url: import.meta.env.DEV ? `/api/ustc/backend/getIP.php?ip=${ip}&r=${Math.random()}` : `https://test.ustc.edu.cn/backend/getIP.php?ip=${ip}&r=${Math.random()}`,
                parser: (data: any): IpInfo => ({
                    ip: data.processedString || ip,
                    location: '来自中科大',
                    source: 'USTC',
                    isp: data.rawIspInfo || ''
                })
            }
        ]

        // 并发请求所有API
        const promises = apis.map(async (api) => {
            try {
                const fetchOptions: RequestInit = {}
                if (api.headers) {
                    fetchOptions.headers = api.headers
                }
                
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
    }
}

onMounted(() => {
    // 更新页面标题
    setPageTitle('ip-lookup')
    getCurrentIpInfo()
    loadHistory()
})

// 组件卸载时恢复原标题
onUnmounted(() => {
    // 恢复原标题
    restoreDefaultTitle()
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
    padding-bottom: 120px;
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
    color: var(--text-primary) !important;
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
    color: var(--text-secondary) !important;
}

.error-info {
    padding: 12px;
    background: var(--bg-error);
    border: 1px solid var(--border-error);
    border-radius: var(--radius-sm);
}

.error-message {
    font-size: 14px;
    color: var(--text-error) !important;
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
    color: var(--text-secondary) !important;
    font-weight: 500;
}

.value {
    font-size: 13px;
    color: var(--text-primary) !important;
    font-weight: 500;
    text-align: right;
}

.loading {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 40px 20px;
    justify-content: center;
    color: var(--text-secondary) !important;
}

.error {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    background: var(--bg-error);
    border: 1px solid var(--border-error);
    border-radius: var(--radius-md);
    color: var(--text-error) !important;
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
    color: var(--text-secondary) !important;
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
    color: var(--text-secondary) !important;
    font-size: 14px;
}

.history-time {
    font-size: 12px;
    color: var(--text-tertiary) !important;
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
        padding-bottom: 100px;
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