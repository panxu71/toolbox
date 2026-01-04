<template>
    <div class="countries-capitals">
        <div class="reference-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="reference-title">世界国家和首都</h2>
            <div class="reference-actions">
                <button class="action-btn" @click="exportData" title="导出数据">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7,10 12,15 17,10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="reference-content">
            <!-- 搜索和筛选 -->
            <div class="search-section">
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input v-model="searchQuery" type="text" placeholder="搜索国家或首都..." class="search-input" @input="filterCountries" />
                        <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="category-filter">
                        <button v-for="continent in allContinents" :key="continent.key" @click="setActiveContinent(continent.key)" :class="['category-btn', { active: activeContinent === continent.key }]">
                            {{ continent.icon }} {{ continent.name }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 国家卡片 -->
            <div class="countries-section">
                <div class="section-header">
                    <h3>{{ getTitle() }}</h3>
                    <div class="section-info">
                        <span class="info-text">共 {{ filteredCountries.length }} 个国家</span>
                    </div>
                </div>

                <div class="countries-grid">
                    <div v-for="(country, idx) in paginatedCountries" :key="country.name" class="country-card" @click="openCountryModal(country)">
                        <div class="card-header">
                            <div class="country-index">{{ (currentPage - 1) * pageSize + idx + 1 }}</div>
                            <div class="country-region">{{ country.region }}</div>
                        </div>
                        <div class="card-content">
                            <div class="country-main">
                                <div class="country-flag-section">
                                    <img 
                                        :src="`https://flagcdn.com/w40/${getCountryCode(country).toLowerCase()}.png`" 
                                        :alt="`${country.name}国旗`"
                                        class="flag-image"
                                        @error="handleFlagError"
                                    />
                                </div>
                                <div class="country-details">
                                    <div class="country-names">
                                        <h3 class="country-name">{{ country.name }}</h3>
                                        <p v-if="country.nameEn" class="country-name-en">{{ country.nameEn }}</p>
                                    </div>
                                    <div class="capital-info">
                                        <div class="capital-main">
                                            <span class="capital-icon">🏛️</span>
                                            <div class="capital-names">
                                                <span class="capital-name">{{ country.capital }}</span>
                                                <span v-if="country.capitalEn" class="capital-name-en">{{ country.capitalEn }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="country.population || country.area" class="country-stats">
                                <div v-if="country.population" class="stat-item">
                                    <span class="stat-icon">👥</span>
                                    <span class="stat-value">{{ country.population }}</span>
                                </div>
                                <div v-if="country.area" class="stat-item">
                                    <span class="stat-icon">🗺️</span>
                                    <span class="stat-value">{{ country.area }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 分页 -->
                <div class="pagination" v-if="totalPages > 1">
                    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>

        <!-- 国家详情弹窗 -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <div class="modal-title">
                        <div class="modal-flag-section">
                            <img 
                                :src="`https://flagcdn.com/w80/${getCountryCode(selectedCountry).toLowerCase()}.png`" 
                                :alt="`${selectedCountry?.name}国旗`"
                                class="flag-image-large"
                                @error="handleFlagError"
                            />
                        </div>
                        <div class="title-text">
                            <h3>{{ selectedCountry?.name }}</h3>
                            <p v-if="selectedCountry?.nameEn">{{ selectedCountry.nameEn }}</p>
                        </div>
                    </div>
                    <button class="close-btn" @click="closeModal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="country-info-grid">
                        <div class="info-item">
                            <div class="info-label">首都</div>
                            <div class="info-value">
                                <span>{{ selectedCountry?.capital }}</span>
                                <span v-if="selectedCountry?.capitalEn" class="info-value-en">{{ selectedCountry.capitalEn }}</span>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <div class="info-label">地区</div>
                            <div class="info-value">{{ selectedCountry?.region }}</div>
                        </div>
                        
                        <div class="info-item" v-if="selectedCountry?.population">
                            <div class="info-label">人口</div>
                            <div class="info-value">{{ selectedCountry.population }}</div>
                        </div>
                        
                        <div class="info-item" v-if="selectedCountry?.area">
                            <div class="info-label">面积</div>
                            <div class="info-value">{{ selectedCountry.area }}</div>
                        </div>
                    </div>
                    
                    <div v-if="selectedCountry?.history" class="country-history">
                        <div class="history-label">国家简史</div>
                        <div class="history-content">{{ selectedCountry.history }}</div>
                    </div>
                    
                    <div v-if="!selectedCountry?.history" class="no-info">
                        <p>暂无详细信息</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import {  ref, computed, onMounted, onUnmounted  } from 'vue'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'

defineEmits<{ back: [] }>()

const searchQuery = ref('')
const activeContinent = ref('all')
const currentPage = ref(1)
const pageSize = 20
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const showModal = ref(false)
const selectedCountry = ref<Country | null>(null)

interface Country {
    name: string
    nameEn?: string
    capital: string
    capitalEn?: string
    region: string
    flag?: string
    population?: string
    area?: string
    history?: string
}

interface Continent {
    key: string
    name: string
    icon: string
    countries: Country[]
}

const continents = ref<Continent[]>([
    {
        key: 'asia',
        name: '亚洲',
        icon: '🌏',
        countries: [
            { name: '中国', nameEn: 'China', capital: '北京', capitalEn: 'Beijing', region: '东亚', flag: '🇨🇳', population: '14.1亿', area: '960万平方公里', history: '中华人民共和国成立于1949年，是世界上历史最悠久的文明之一，拥有5000多年的文明史。中国是世界第二大经济体，也是联合国安理会常任理事国。' },
            { name: '日本', nameEn: 'Japan', capital: '东京', capitalEn: 'Tokyo', region: '东亚', flag: '🇯🇵', population: '1.25亿', area: '37.8万平方公里', history: '日本是一个岛国，由四个主要岛屿组成。明治维新后迅速现代化，二战后成为世界第三大经济体，以科技创新和制造业闻名。' },
            { name: '韩国', nameEn: 'South Korea', capital: '首尔', capitalEn: 'Seoul', region: '东亚', flag: '🇰🇷', population: '5180万', area: '10万平方公里', history: '大韩民国成立于1948年，经历了朝鲜战争后快速发展，成为亚洲四小龙之一，在科技、文化产业方面表现突出。' },
            { name: '朝鲜', nameEn: 'North Korea', capital: '平壤', capitalEn: 'Pyongyang', region: '东亚', flag: '🇰🇵', population: '2580万', area: '12.3万平方公里', history: '朝鲜民主主义人民共和国成立于1948年，实行社会主义制度，以主体思想为指导思想。' },
            { name: '蒙古', nameEn: 'Mongolia', capital: '乌兰巴托', capitalEn: 'Ulaanbaatar', region: '东亚', flag: '🇲🇳', population: '330万', area: '156万平方公里', history: '蒙古国是一个内陆国家，曾是蒙古帝国的核心地区。1990年开始民主化进程，经济以畜牧业和矿业为主。' },
            { name: '越南', nameEn: 'Vietnam', capital: '河内', capitalEn: 'Hanoi', region: '东南亚', flag: '🇻🇳', population: '9800万', area: '33万平方公里', history: '越南社会主义共和国成立于1976年，经历了长期的独立战争。改革开放后经济快速发展，成为东南亚重要经济体。' },
            { name: '柬埔寨', nameEn: 'Cambodia', capital: '金边', capitalEn: 'Phnom Penh', region: '东南亚', flag: '🇰🇭', population: '1680万', area: '18万平方公里', history: '柬埔寨王国拥有悠久的历史，吴哥王朝曾是东南亚强国。现代柬埔寨以农业为主，旅游业发展迅速。' },
            { name: '老挝', nameEn: 'Laos', capital: '万象', capitalEn: 'Vientiane', region: '东南亚', flag: '🇱🇦', population: '730万', area: '23.7万平方公里', history: '老挝人民民主共和国是东南亚唯一的内陆国，实行社会主义制度，经济以农业和水电为主。' },
            { name: '泰国', nameEn: 'Thailand', capital: '曼谷', capitalEn: 'Bangkok', region: '东南亚', flag: '🇹🇭', population: '7000万', area: '51.3万平方公里', history: '泰王国是东南亚唯一未被殖民的国家，素有"微笑之国"美誉，旅游业和制造业发达。' },
            { name: '缅甸', nameEn: 'Myanmar', capital: '内比都', capitalEn: 'Naypyidaw', region: '东南亚', flag: '🇲🇲', population: '5400万', area: '67.7万平方公里', history: '缅甸联邦共和国拥有丰富的自然资源，历史上曾是英属印度的一部分，1948年独立。' },
            { name: '马来西亚', nameEn: 'Malaysia', capital: '吉隆坡', capitalEn: 'Kuala Lumpur', region: '东南亚', flag: '🇲🇾', population: '3300万', area: '33万平方公里', history: '马来西亚由马来半岛和婆罗洲北部组成，1957年独立。是多元文化国家，经济以制造业、服务业和石油为主。' },
            { name: '新加坡', nameEn: 'Singapore', capital: '新加坡', capitalEn: 'Singapore', region: '东南亚', flag: '🇸🇬', population: '580万', area: '720平方公里', history: '新加坡共和国是城市国家，1965年独立。从第三世界发展为发达国家，被誉为"亚洲四小龙"之一。' },
            { name: '印度尼西亚', nameEn: 'Indonesia', capital: '雅加达', capitalEn: 'Jakarta', region: '东南亚', flag: '🇮🇩', population: '2.7亿', area: '191万平方公里', history: '印度尼西亚共和国是世界最大的群岛国家，由17000多个岛屿组成。1945年独立，是东南亚最大经济体。' },
            { name: '菲律宾', nameEn: 'Philippines', capital: '马尼拉', capitalEn: 'Manila', region: '东南亚', flag: '🇵🇭', population: '1.1亿', area: '30万平方公里', history: '菲律宾共和国由7000多个岛屿组成，曾是西班牙和美国殖民地，1946年独立。经济以服务业和制造业为主。' },
            { name: '东帝汶', nameEn: 'East Timor', capital: '帝力', capitalEn: 'Dili', region: '东南亚', flag: '��', population: '130万', area: '1.5万平方公里' },
            { name: '文莱', nameEn: 'Brunei', capital: '斯里巴加湾市', capitalEn: 'Bandar Seri Begawan', region: '东南亚', flag: '🇧🇳', population: '44万', area: '5765平方公里' },
            { name: '孟加拉国', nameEn: 'Bangladesh', capital: '达卡', capitalEn: 'Dhaka', region: '南亚', flag: '🇧🇩', population: '1.65亿', area: '14.8万平方公里', history: '孟加拉人民共和国1971年从巴基斯坦独立。人口密度极高，经济以农业和纺织业为主，近年来发展迅速。' },
            { name: '印度', nameEn: 'India', capital: '新德里', capitalEn: 'New Delhi', region: '南亚', flag: '🇮🇳', population: '14.2亿', area: '328万平方公里', history: '印度共和国是世界人口第一大国，1947年独立。拥有悠久的文明史，现为世界第五大经济体，IT产业发达。' },
            { name: '巴基斯坦', nameEn: 'Pakistan', capital: '伊斯兰堡', capitalEn: 'Islamabad', region: '南亚', flag: '🇵🇰', population: '2.3亿', area: '88万平方公里', history: '巴基斯坦伊斯兰共和国1947年独立，是核武器国家。经济以农业和纺织业为主，地理位置重要。' },
            { name: '斯里兰卡', nameEn: 'Sri Lanka', capital: '科伦坡', capitalEn: 'Colombo', region: '南亚', flag: '🇱🇰', population: '2200万', area: '6.6万平方公里', history: '斯里兰卡民主社会主义共和国是印度洋岛国，1948年独立。以茶叶、宝石和旅游业闻名，有"印度洋明珠"之称。' },
            { name: '尼泊尔', nameEn: 'Nepal', capital: '加德满都', capitalEn: 'Kathmandu', region: '南亚', flag: '🇳🇵', population: '3000万', area: '14.7万平方公里' },
            { name: '不丹', nameEn: 'Bhutan', capital: '廷布', capitalEn: 'Thimphu', region: '南亚', flag: '🇧🇹', population: '77万', area: '3.8万平方公里' },
            { name: '马尔代夫', nameEn: 'Maldives', capital: '马累', capitalEn: 'Male', region: '南亚', flag: '🇲🇻', population: '54万', area: '298平方公里' },
            { name: '伊朗', nameEn: 'Iran', capital: '德黑兰', capitalEn: 'Tehran', region: '西亚', flag: '🇮🇷', population: '8500万', area: '164万平方公里' },
            { name: '伊拉克', nameEn: 'Iraq', capital: '巴格达', capitalEn: 'Baghdad', region: '西亚', flag: '🇮🇶', population: '4200万', area: '43.8万平方公里' },
            { name: '沙特阿拉伯', nameEn: 'Saudi Arabia', capital: '利雅得', capitalEn: 'Riyadh', region: '西亚', flag: '🇸🇦', population: '3500万', area: '215万平方公里' },
            { name: '阿联酋', nameEn: 'UAE', capital: '阿布扎比', capitalEn: 'Abu Dhabi', region: '西亚', flag: '🇦🇪', population: '1000万', area: '8.4万平方公里' },
            { name: '卡塔尔', nameEn: 'Qatar', capital: '多哈', capitalEn: 'Doha', region: '西亚', flag: '🇶🇦', population: '290万', area: '1.1万平方公里' },
            { name: '巴林', nameEn: 'Bahrain', capital: '麦纳麦', capitalEn: 'Manama', region: '西亚', flag: '🇧🇭', population: '170万', area: '765平方公里' },
            { name: '科威特', nameEn: 'Kuwait', capital: '科威特城', capitalEn: 'Kuwait City', region: '西亚', flag: '🇰🇼', population: '430万', area: '1.8万平方公里' },
            { name: '阿曼', nameEn: 'Oman', capital: '马斯喀特', capitalEn: 'Muscat', region: '西亚', flag: '🇴🇲', population: '520万', area: '31万平方公里' },
            { name: '也门', nameEn: 'Yemen', capital: '萨那', capitalEn: 'Sanaa', region: '西亚', flag: '🇾🇪', population: '3000万', area: '52.8万平方公里' },
            { name: '以色列', nameEn: 'Israel', capital: '耶路撒冷', capitalEn: 'Jerusalem', region: '西亚', flag: '🇮🇱', population: '950万', area: '2.2万平方公里' },
            { name: '巴勒斯坦', nameEn: 'Palestine', capital: '拉姆安拉', capitalEn: 'Ramallah', region: '西亚', flag: '🇵🇸', population: '510万', area: '6020平方公里' },
            { name: '约旦', nameEn: 'Jordan', capital: '安曼', capitalEn: 'Amman', region: '西亚', flag: '🇯🇴', population: '1100万', area: '8.9万平方公里' },
            { name: '黎巴嫩', nameEn: 'Lebanon', capital: '贝鲁特', capitalEn: 'Beirut', region: '西亚', flag: '🇱🇧', population: '680万', area: '1万平方公里' },
            { name: '叙利亚', nameEn: 'Syria', capital: '大马士革', capitalEn: 'Damascus', region: '西亚', flag: '🇸🇾', population: '1800万', area: '18.5万平方公里' },
            { name: '土耳其', nameEn: 'Turkey', capital: '安卡拉', capitalEn: 'Ankara', region: '西亚', flag: '🇹🇷', population: '8500万', area: '78万平方公里' },
            { name: '亚美尼亚', nameEn: 'Armenia', capital: '埃里温', capitalEn: 'Yerevan', region: '西亚', flag: '�,🇲', population: '300万', area: '2.97万平方公里' },
            { name: '阿塞拜疆', nameEn: 'Azerbaijan', capital: '巴库', capitalEn: 'Baku', region: '西亚', flag: '🇦🇿', population: '1020万', area: '8.66万平方公里' },
            { name: '格鲁吉亚', nameEn: 'Georgia', capital: '第比利斯', capitalEn: 'Tbilisi', region: '西亚', flag: '🇬🇪', population: '370万', area: '6.97万平方公里' },
            { name: '塞浦路斯北部', nameEn: 'Northern Cyprus', capital: '北尼科西亚', capitalEn: 'North Nicosia', region: '西亚', flag: '🏴', population: '35万', area: '3355平方公里' },
            { name: '阿富汗', nameEn: 'Afghanistan', capital: '喀布尔', capitalEn: 'Kabul', region: '中亚', flag: '🇦🇫', population: '4000万', area: '65.2万平方公里' },
            { name: '哈萨克斯坦', nameEn: 'Kazakhstan', capital: '努尔苏丹', capitalEn: 'Nur-Sultan', region: '中亚', flag: '🇰🇿', population: '1950万', area: '272万平方公里' },
            { name: '乌兹别克斯坦', nameEn: 'Uzbekistan', capital: '塔什干', capitalEn: 'Tashkent', region: '中亚', flag: '🇺🇿', population: '3500万', area: '44.7万平方公里' },
            { name: '土库曼斯坦', nameEn: 'Turkmenistan', capital: '阿什哈巴特', capitalEn: 'Ashgabat', region: '中亚', flag: '🇹🇲', population: '600万', area: '48.8万平方公里' },
            { name: '吉尔吉斯斯坦', nameEn: 'Kyrgyzstan', capital: '比什凯克', capitalEn: 'Bishkek', region: '中亚', flag: '🇰🇬', population: '670万', area: '19.9万平方公里' },
            { name: '塔吉克斯坦', nameEn: 'Tajikistan', capital: '杜尚别', capitalEn: 'Dushanbe', region: '中亚', flag: '🇹🇯', population: '980万', area: '14.3万平方公里' },
        ]
    },
    {
        key: 'africa',
        name: '非洲',
        icon: '🌍',
        countries: [
            { name: '埃及', nameEn: 'Egypt', capital: '开罗', capitalEn: 'Cairo', region: '北非', flag: '🇪🇬', population: '1.04亿', area: '100万平方公里' },
            { name: '利比亚', nameEn: 'Libya', capital: '的黎波里', capitalEn: 'Tripoli', region: '北非', flag: '🇱🇾', population: '690万', area: '176万平方公里' },
            { name: '突尼斯', nameEn: 'Tunisia', capital: '突尼斯城', capitalEn: 'Tunis', region: '北非', flag: '🇹🇳', population: '1200万', area: '16.4万平方公里' },
            { name: '阿尔及利亚', nameEn: 'Algeria', capital: '阿尔及尔', capitalEn: 'Algiers', region: '北非', flag: '🇩🇿', population: '4400万', area: '238万平方公里' },
            { name: '摩洛哥', nameEn: 'Morocco', capital: '拉巴特', capitalEn: 'Rabat', region: '北非', flag: '🇲🇦', population: '3700万', area: '44.7万平方公里' },
            { name: '苏丹', nameEn: 'Sudan', capital: '喀土穆', capitalEn: 'Khartoum', region: '东非', flag: '🇸🇩', population: '4500万', area: '188万平方公里' },
            { name: '埃塞俄比亚', nameEn: 'Ethiopia', capital: '亚的斯亚贝巴', capitalEn: 'Addis Ababa', region: '东非', flag: '🇪🇹', population: '1.2亿', area: '110万平方公里' },
            { name: '肯尼亚', nameEn: 'Kenya', capital: '内罗毕', capitalEn: 'Nairobi', region: '东非', flag: '🇰🇪', population: '5400万', area: '58万平方公里' },
            { name: '坦桑尼亚', nameEn: 'Tanzania', capital: '多多马', capitalEn: 'Dodoma', region: '东非', flag: '🇹🇿', population: '6100万', area: '94.5万平方公里' },
            { name: '乌干达', nameEn: 'Uganda', capital: '坎帕拉', capitalEn: 'Kampala', region: '东非', flag: '🇺🇬', population: '4700万', area: '24.1万平方公里' },
            { name: '卢旺达', nameEn: 'Rwanda', capital: '基加利', capitalEn: 'Kigali', region: '东非', flag: '🇷🇼', population: '1300万', area: '2.6万平方公里' },
            { name: '布隆迪', nameEn: 'Burundi', capital: '吉特加', capitalEn: 'Gitega', region: '东非', flag: '🇧🇮', population: '1200万', area: '2.8万平方公里' },
            { name: '南苏丹', nameEn: 'South Sudan', capital: '朱巴', capitalEn: 'Juba', region: '东非', flag: '🇸🇸', population: '1100万', area: '64万平方公里' },
            { name: '索马里', nameEn: 'Somalia', capital: '摩加迪沙', capitalEn: 'Mogadishu', region: '东非', flag: '🇸🇴', population: '1600万', area: '63.8万平方公里' },
            { name: '吉布提', nameEn: 'Djibouti', capital: '吉布提城', capitalEn: 'Djibouti City', region: '东非', flag: '🇩🇯', population: '99万', area: '2.3万平方公里' },
            { name: '厄立特里亚', nameEn: 'Eritrea', capital: '阿斯玛拉', capitalEn: 'Asmara', region: '东非', flag: '🇪🇷', population: '350万', area: '11.7万平方公里' },
            { name: '塞舌尔', nameEn: 'Seychelles', capital: '维多利亚', capitalEn: 'Victoria', region: '东非', flag: '🇸🇨', population: '10万', area: '455平方公里' },
            { name: '毛里求斯', nameEn: 'Mauritius', capital: '路易港', capitalEn: 'Port Louis', region: '东非', flag: '🇲🇺', population: '127万', area: '2040平方公里' },
            { name: '刚果民主共和国', nameEn: 'Democratic Republic of Congo', capital: '金沙萨', capitalEn: 'Kinshasa', region: '中非', flag: '🇨🇩', population: '9500万', area: '234万平方公里' },
            { name: '刚果共和国', nameEn: 'Republic of Congo', capital: '布拉柴维尔', capitalEn: 'Brazzaville', region: '中非', flag: '🇨🇬', population: '560万', area: '34.2万平方公里' },
            { name: '中非共和国', nameEn: 'Central African Republic', capital: '班吉', capitalEn: 'Bangui', region: '中非', flag: '🇨🇫', population: '490万', area: '62.3万平方公里' },
            { name: '喀麦隆', nameEn: 'Cameroon', capital: '雅温得', capitalEn: 'Yaoundé', region: '中非', flag: '🇨🇲', population: '2700万', area: '47.5万平方公里' },
            { name: '赤道几内亚', nameEn: 'Equatorial Guinea', capital: '马拉博', capitalEn: 'Malabo', region: '中非', flag: '🇬🇶', population: '140万', area: '2.8万平方公里' },
            { name: '加蓬', nameEn: 'Gabon', capital: '利伯维尔', capitalEn: 'Libreville', region: '中非', flag: '🇬🇦', population: '230万', area: '26.8万平方公里' },
            { name: '圣多美和普林西比', nameEn: 'São Tomé and Príncipe', capital: '圣多美', capitalEn: 'São Tomé', region: '中非', flag: '🇸🇹', population: '22万', area: '964平方公里' },
            { name: '尼日利亚', nameEn: 'Nigeria', capital: '阿布贾', capitalEn: 'Abuja', region: '西非', flag: '🇳🇬', population: '2.2亿', area: '92.4万平方公里' },
            { name: '尼日尔', nameEn: 'Niger', capital: '尼亚美', capitalEn: 'Niamey', region: '西非', flag: '🇳🇪', population: '2500万', area: '127万平方公里' },
            { name: '马里', nameEn: 'Mali', capital: '巴马科', capitalEn: 'Bamako', region: '西非', flag: '🇲🇱', population: '2100万', area: '124万平方公里' },
            { name: '毛里塔尼亚', nameEn: 'Mauritania', capital: '努瓦克肖特', capitalEn: 'Nouakchott', region: '西非', flag: '🇲🇷', population: '470万', area: '103万平方公里' },
            { name: '塞内加尔', nameEn: 'Senegal', capital: '达喀尔', capitalEn: 'Dakar', region: '西非', flag: '🇸🇳', population: '1700万', area: '19.7万平方公里' },
            { name: '冈比亚', nameEn: 'Gambia', capital: '班珠尔', capitalEn: 'Banjul', region: '西非', flag: '🇬🇲', population: '250万', area: '1.1万平方公里' },
            { name: '几内亚比绍', nameEn: 'Guinea-Bissau', capital: '比绍', capitalEn: 'Bissau', region: '西非', flag: '🇬🇼', population: '200万', area: '3.6万平方公里' },
            { name: '几内亚', nameEn: 'Guinea', capital: '科纳克里', capitalEn: 'Conakry', region: '西非', flag: '🇬🇳', population: '1300万', area: '24.6万平方公里' },
            { name: '塞拉利昂', nameEn: 'Sierra Leone', capital: '弗里敦', capitalEn: 'Freetown', region: '西非', flag: '🇸🇱', population: '800万', area: '7.2万平方公里' },
            { name: '利比里亚', nameEn: 'Liberia', capital: '蒙罗维亚', capitalEn: 'Monrovia', region: '西非', flag: '🇱🇷', population: '520万', area: '11.1万平方公里' },
            { name: '科特迪瓦', nameEn: 'Côte d\'Ivoire', capital: '亚穆苏克罗', capitalEn: 'Yamoussoukro', region: '西非', flag: '🇨🇮', population: '2700万', area: '32.2万平方公里' },
            { name: '加纳', nameEn: 'Ghana', capital: '阿克拉', capitalEn: 'Accra', region: '西非', flag: '🇬🇭', population: '3200万', area: '23.9万平方公里' },
            { name: '多哥', nameEn: 'Togo', capital: '洛美', capitalEn: 'Lomé', region: '西非', flag: '🇹🇬', population: '830万', area: '5.7万平方公里' },
            { name: '贝宁', nameEn: 'Benin', capital: '波多诺伏', capitalEn: 'Porto-Novo', region: '西非', flag: '🇧🇯', population: '1200万', area: '11.3万平方公里' },
            { name: '佛得角', nameEn: 'Cape Verde', capital: '普拉亚', capitalEn: 'Praia', region: '西非', flag: '🇨🇻', population: '56万', area: '4033平方公里' },
            { name: '乍得', nameEn: 'Chad', capital: '恩贾梅纳', capitalEn: 'N\'Djamena', region: '中非', flag: '🇹🇩', population: '1700万', area: '128万平方公里' },
            { name: '科摩罗', nameEn: 'Comoros', capital: '莫罗尼', capitalEn: 'Moroni', region: '东非', flag: '🇰🇲', population: '87万', area: '2235平方公里' },
            { name: '南非', nameEn: 'South Africa', capital: '比勒陀利亚', capitalEn: 'Pretoria', region: '南非', flag: '🇿🇦', population: '6000万', area: '122万平方公里' },
            { name: '博茨瓦纳', nameEn: 'Botswana', capital: '哈博罗内', capitalEn: 'Gaborone', region: '南非', flag: '🇧🇼', population: '240万', area: '58.2万平方公里' },
            { name: '纳米比亚', nameEn: 'Namibia', capital: '温得和克', capitalEn: 'Windhoek', region: '南非', flag: '🇳🇦', population: '260万', area: '82.4万平方公里' },
            { name: '莱索托', nameEn: 'Lesotho', capital: '马塞卢', capitalEn: 'Maseru', region: '南非', flag: '🇱🇸', population: '220万', area: '3万平方公里' },
            { name: '斯威士兰', nameEn: 'Eswatini', capital: '姆巴巴内', capitalEn: 'Mbabane', region: '南非', flag: '🇸🇿', population: '120万', area: '1.7万平方公里' },
            { name: '津巴布韦', nameEn: 'Zimbabwe', capital: '哈拉雷', capitalEn: 'Harare', region: '南非', flag: '🇿🇼', population: '1500万', area: '39.1万平方公里' },
            { name: '赞比亚', nameEn: 'Zambia', capital: '卢萨卡', capitalEn: 'Lusaka', region: '南非', flag: '🇿🇲', population: '1900万', area: '75.3万平方公里' },
            { name: '马拉维', nameEn: 'Malawi', capital: '利隆圭', capitalEn: 'Lilongwe', region: '南非', flag: '🇲🇼', population: '2000万', area: '11.8万平方公里' },
            { name: '莫桑比克', nameEn: 'Mozambique', capital: '马普托', capitalEn: 'Maputo', region: '南非', flag: '🇲🇿', population: '3200万', area: '80.1万平方公里' },
            { name: '马达加斯加', nameEn: 'Madagascar', capital: '塔那那利佛', capitalEn: 'Antananarivo', region: '南非', flag: '🇲🇬', population: '2800万', area: '58.7万平方公里' },
            { name: '布基纳法索', nameEn: 'Burkina Faso', capital: '瓦加杜古', capitalEn: 'Ouagadougou', region: '西非', flag: '🇧🇫', population: '2200万', area: '27.4万平方公里' },
        ]
    },
    {
        key: 'europe',
        name: '欧洲',
        icon: '🌍',
        countries: [
            { name: '俄罗斯', nameEn: 'Russia', capital: '莫斯科', capitalEn: 'Moscow', region: '东欧', flag: '🇷🇺', population: '1.46亿', area: '1709万平方公里', history: '俄罗斯联邦是世界面积最大的国家，横跨欧亚大陆。拥有丰富的自然资源，是联合国安理会常任理事国。' },
            { name: '乌克兰', nameEn: 'Ukraine', capital: '基辅', capitalEn: 'Kyiv', region: '东欧', flag: '🇺🇦', population: '4400万', area: '60万平方公里', history: '乌克兰1991年独立，是欧洲面积第二大国家。素有"欧洲粮仓"之称，农业发达。' },
            { name: '白俄罗斯', nameEn: 'Belarus', capital: '明斯克', capitalEn: 'Minsk', region: '东欧', flag: '🇧🇾', population: '940万', area: '20.8万平方公里' },
            { name: '波兰', nameEn: 'Poland', capital: '华沙', capitalEn: 'Warsaw', region: '东欧', flag: '🇵🇱', population: '3800万', area: '31.3万平方公里' },
            { name: '捷克', nameEn: 'Czech Republic', capital: '布拉格', capitalEn: 'Prague', region: '东欧', flag: '🇨🇿', population: '1070万', area: '7.9万平方公里' },
            { name: '斯洛伐克', nameEn: 'Slovakia', capital: '布拉迪斯拉发', capitalEn: 'Bratislava', region: '东欧', flag: '🇸🇰', population: '540万', area: '4.9万平方公里' },
            { name: '匈牙利', nameEn: 'Hungary', capital: '布达佩斯', capitalEn: 'Budapest', region: '东欧', flag: '🇭🇺', population: '970万', area: '9.3万平方公里' },
            { name: '罗马尼亚', nameEn: 'Romania', capital: '布加勒斯特', capitalEn: 'Bucharest', region: '东欧', flag: '🇷🇴', population: '1900万', area: '23.8万平方公里' },
            { name: '保加利亚', nameEn: 'Bulgaria', capital: '索非亚', capitalEn: 'Sofia', region: '东欧', flag: '🇧🇬', population: '690万', area: '11.1万平方公里' },
            { name: '塞尔维亚', nameEn: 'Serbia', capital: '贝尔格莱德', capitalEn: 'Belgrade', region: '东欧', flag: '🇷🇸', population: '690万', area: '8.8万平方公里' },
            { name: '克罗地亚', nameEn: 'Croatia', capital: '萨格勒布', capitalEn: 'Zagreb', region: '东欧', flag: '🇭🇷', population: '390万', area: '5.7万平方公里' },
            { name: '波黑', nameEn: 'Bosnia and Herzegovina', capital: '萨拉热窝', capitalEn: 'Sarajevo', region: '东欧', flag: '🇧🇦', population: '330万', area: '5.1万平方公里' },
            { name: '黑山', nameEn: 'Montenegro', capital: '波德戈里察', capitalEn: 'Podgorica', region: '东欧', flag: '🇲🇪', population: '63万', area: '1.4万平方公里' },
            { name: '北马其顿', nameEn: 'North Macedonia', capital: '斯科普里', capitalEn: 'Skopje', region: '东欧', flag: '🇲🇰', population: '210万', area: '2.6万平方公里' },
            { name: '科索沃', nameEn: 'Kosovo', capital: '普里什蒂纳', capitalEn: 'Pristina', region: '东欧', flag: '�🇰', population: '180万', area: '1.1万平方公里' },
            { name: '南奥塞梯', nameEn: 'South Ossetia', capital: '茨欣瓦利', capitalEn: 'Tskhinvali', region: '东欧', flag: '🏴', population: '5.3万', area: '3900平方公里' },
            { name: '阿布哈兹', nameEn: 'Abkhazia', capital: '苏呼米', capitalEn: 'Sukhumi', region: '东欧', flag: '🏴', population: '24万', area: '8665平方公里' },
            { name: '希腊', nameEn: 'Greece', capital: '雅典', capitalEn: 'Athens', region: '南欧', flag: '🇬🇷', population: '1070万', area: '13.2万平方公里' },
            { name: '意大利', nameEn: 'Italy', capital: '罗马', capitalEn: 'Rome', region: '南欧', flag: '🇮🇹', population: '5900万', area: '30.1万平方公里' },
            { name: '西班牙', nameEn: 'Spain', capital: '马德里', capitalEn: 'Madrid', region: '南欧', flag: '🇪🇸', population: '4700万', area: '50.6万平方公里' },
            { name: '葡萄牙', nameEn: 'Portugal', capital: '里斯本', capitalEn: 'Lisbon', region: '南欧', flag: '🇵🇹', population: '1030万', area: '9.2万平方公里' },
            { name: '法国', nameEn: 'France', capital: '巴黎', capitalEn: 'Paris', region: '西欧', flag: '🇫🇷', population: '6800万', area: '67万平方公里', history: '法兰西共和国是联合国安理会常任理事国，拥有悠久的历史文化。以时尚、美食、艺术和旅游业闻名世界。' },
            { name: '德国', nameEn: 'Germany', capital: '柏林', capitalEn: 'Berlin', region: '西欧', flag: '🇩🇪', population: '8300万', area: '35.7万平方公里', history: '德意志联邦共和国是欧洲经济强国，1990年东西德统一。以制造业和出口贸易著称，是欧盟核心成员。' },
            { name: '荷兰', nameEn: 'Netherlands', capital: '阿姆斯特丹', capitalEn: 'Amsterdam', region: '西欧', flag: '🇳🇱', population: '1750万', area: '4.2万平方公里' },
            { name: '比利时', nameEn: 'Belgium', capital: '布鲁塞尔', capitalEn: 'Brussels', region: '西欧', flag: '🇧🇪', population: '1150万', area: '3.1万平方公里' },
            { name: '卢森堡', nameEn: 'Luxembourg', capital: '卢森堡城', capitalEn: 'Luxembourg City', region: '西欧', flag: '🇱🇺', population: '63万', area: '2586平方公里' },
            { name: '瑞士', nameEn: 'Switzerland', capital: '伯尔尼', capitalEn: 'Bern', region: '西欧', flag: '🇨🇭', population: '870万', area: '4.1万平方公里' },
            { name: '奥地利', nameEn: 'Austria', capital: '维也纳', capitalEn: 'Vienna', region: '西欧', flag: '🇦🇹', population: '900万', area: '8.4万平方公里' },
            { name: '英国', nameEn: 'United Kingdom', capital: '伦敦', capitalEn: 'London', region: '西欧', flag: '🇬🇧', population: '6700万', area: '24.3万平方公里', history: '大不列颠及北爱尔兰联合王国曾是世界最大殖民帝国。现为发达的资本主义国家，金融业发达。' },
            { name: '爱尔兰', nameEn: 'Ireland', capital: '都柏林', capitalEn: 'Dublin', region: '西欧', flag: '🇮🇪', population: '500万', area: '7万平方公里' },
            { name: '瑞典', nameEn: 'Sweden', capital: '斯德哥尔摩', capitalEn: 'Stockholm', region: '北欧', flag: '🇸🇪', population: '1040万', area: '45万平方公里' },
            { name: '挪威', nameEn: 'Norway', capital: '奥斯陆', capitalEn: 'Oslo', region: '北欧', flag: '🇳🇴', population: '540万', area: '38.5万平方公里' },
            { name: '芬兰', nameEn: 'Finland', capital: '赫尔辛基', capitalEn: 'Helsinki', region: '北欧', flag: '🇫🇮', population: '550万', area: '33.8万平方公里' },
            { name: '丹麦', nameEn: 'Denmark', capital: '哥本哈根', capitalEn: 'Copenhagen', region: '北欧', flag: '🇩🇰', population: '580万', area: '4.3万平方公里' },
            { name: '冰岛', nameEn: 'Iceland', capital: '雷克雅未克', capitalEn: 'Reykjavik', region: '北欧', flag: '🇮🇸', population: '37万', area: '10.3万平方公里' },
            { name: '立陶宛', nameEn: 'Lithuania', capital: '维尔纽斯', capitalEn: 'Vilnius', region: '北欧', flag: '🇱🇹', population: '280万', area: '6.5万平方公里' },
            { name: '拉脱维亚', nameEn: 'Latvia', capital: '里加', capitalEn: 'Riga', region: '北欧', flag: '🇱🇻', population: '190万', area: '6.5万平方公里' },
            { name: '爱沙尼亚', nameEn: 'Estonia', capital: '塔林', capitalEn: 'Tallinn', region: '北欧', flag: '🇪🇪', population: '130万', area: '4.5万平方公里' },
            { name: '斯洛文尼亚', nameEn: 'Slovenia', capital: '卢布尔雅那', capitalEn: 'Ljubljana', region: '南欧', flag: '🇸🇮', population: '210万', area: '2万平方公里' },
            { name: '塞浦路斯', nameEn: 'Cyprus', capital: '尼科西亚', capitalEn: 'Nicosia', region: '南欧', flag: '🇨🇾', population: '120万', area: '9251平方公里' },
            { name: '梵蒂冈', nameEn: 'Vatican City', capital: '梵蒂冈城', capitalEn: 'Vatican City', region: '南欧', flag: '🇻🇦', population: '800人', area: '0.44平方公里' },
            { name: '圣马力诺', nameEn: 'San Marino', capital: '圣马力诺', capitalEn: 'San Marino', region: '南欧', flag: '🇸🇲', population: '3.4万', area: '61平方公里' },
            { name: '摩纳哥', nameEn: 'Monaco', capital: '摩纳哥', capitalEn: 'Monaco', region: '西欧', flag: '🇲🇨', population: '3.9万', area: '2平方公里' },
            { name: '列支敦士登', nameEn: 'Liechtenstein', capital: '瓦杜兹', capitalEn: 'Vaduz', region: '西欧', flag: '🇱🇮', population: '3.9万', area: '160平方公里' },
            { name: '安道尔', nameEn: 'Andorra', capital: '安道尔城', capitalEn: 'Andorra la Vella', region: '西欧', flag: '🇦🇩', population: '7.9万', area: '468平方公里' },
        ]
    },
    {
        key: 'americas',
        name: '美洲',
        icon: '🌎',
        countries: [
            { name: '加拿大', nameEn: 'Canada', capital: '渥太华', capitalEn: 'Ottawa', region: '北美', flag: '🇨🇦', population: '3800万', area: '998万平方公里', history: '加拿大是世界面积第二大国家，1867年独立。拥有丰富的自然资源，是发达的工业化国家。' },
            { name: '美国', nameEn: 'United States', capital: '华盛顿', capitalEn: 'Washington D.C.', region: '北美', flag: '🇺🇸', population: '3.3亿', area: '937万平方公里', history: '美利坚合众国1776年独立，是世界第一大经济体和军事强国，联合国安理会常任理事国。' },
            { name: '墨西哥', nameEn: 'Mexico', capital: '墨西哥城', capitalEn: 'Mexico City', region: '北美', flag: '🇲🇽', population: '1.3亿', area: '196万平方公里', history: '墨西哥合众国拥有古老的玛雅和阿兹特克文明，1821年独立。是拉丁美洲第二大经济体。' },
            { name: '危地马拉', nameEn: 'Guatemala', capital: '危地马拉城', capitalEn: 'Guatemala City', region: '中美', flag: '🇬🇹', population: '1800万', area: '10.9万平方公里' },
            { name: '伯利兹', nameEn: 'Belize', capital: '伯利兹城', capitalEn: 'Belize City', region: '中美', flag: '🇧🇿', population: '40万', area: '2.3万平方公里' },
            { name: '萨尔瓦多', nameEn: 'El Salvador', capital: '圣萨尔瓦多', capitalEn: 'San Salvador', region: '中美', flag: '🇸🇻', population: '650万', area: '2.1万平方公里' },
            { name: '洪都拉斯', nameEn: 'Honduras', capital: '特古西加尔巴', capitalEn: 'Tegucigalpa', region: '中美', flag: '🇭🇳', population: '1000万', area: '11.2万平方公里' },
            { name: '尼加拉瓜', nameEn: 'Nicaragua', capital: '马那瓜', capitalEn: 'Managua', region: '中美', flag: '🇳🇮', population: '680万', area: '13万平方公里' },
            { name: '哥斯达黎加', nameEn: 'Costa Rica', capital: '圣何塞', capitalEn: 'San José', region: '中美', flag: '🇨🇷', population: '520万', area: '5.1万平方公里' },
            { name: '巴拿马', nameEn: 'Panama', capital: '巴拿马城', capitalEn: 'Panama City', region: '中美', flag: '🇵🇦', population: '440万', area: '7.5万平方公里' },
            { name: '古巴', nameEn: 'Cuba', capital: '哈瓦那', capitalEn: 'Havana', region: '加勒比', flag: '🇨🇺', population: '1130万', area: '11万平方公里' },
            { name: '多米尼加共和国', nameEn: 'Dominican Republic', capital: '圣多明各', capitalEn: 'Santo Domingo', region: '加勒比', flag: '🇩🇴', population: '1100万', area: '4.9万平方公里' },
            { name: '海地', nameEn: 'Haiti', capital: '太子港', capitalEn: 'Port-au-Prince', region: '加勒比', flag: '🇭🇹', population: '1150万', area: '2.8万平方公里' },
            { name: '牙买加', nameEn: 'Jamaica', capital: '金斯敦', capitalEn: 'Kingston', region: '加勒比', flag: '🇯🇲', population: '300万', area: '1.1万平方公里' },
            { name: '巴哈马', nameEn: 'Bahamas', capital: '拿骚', capitalEn: 'Nassau', region: '加勒比', flag: '🇧🇸', population: '39万', area: '1.4万平方公里' },
            { name: '巴巴多斯', nameEn: 'Barbados', capital: '布里奇敦', capitalEn: 'Bridgetown', region: '加勒比', flag: '🇧🇧', population: '29万', area: '431平方公里' },
            { name: '圣卢西亚', nameEn: 'Saint Lucia', capital: '卡斯特里', capitalEn: 'Castries', region: '加勒比', flag: '🇱🇨', population: '18万', area: '616平方公里' },
            { name: '圣文森特和格林纳丁斯', nameEn: 'Saint Vincent and the Grenadines', capital: '金斯敦', capitalEn: 'Kingstown', region: '加勒比', flag: '🇻🇨', population: '11万', area: '389平方公里' },
            { name: '格林纳达', nameEn: 'Grenada', capital: '圣乔治', capitalEn: 'St. George\'s', region: '加勒比', flag: '🇬🇩', population: '11万', area: '344平方公里' },
            { name: '安提瓜和巴布达', nameEn: 'Antigua and Barbuda', capital: '圣约翰', capitalEn: 'St. John\'s', region: '加勒比', flag: '🇦🇬', population: '10万', area: '442平方公里' },
            { name: '多米尼克', nameEn: 'Dominica', capital: '罗索', capitalEn: 'Roseau', region: '加勒比', flag: '🇩🇲', population: '7万', area: '751平方公里' },
            { name: '圣基茨和尼维斯', nameEn: 'Saint Kitts and Nevis', capital: '巴斯特尔', capitalEn: 'Basseterre', region: '加勒比', flag: '🇰🇳', population: '5万', area: '261平方公里' },
            { name: '哥伦比亚', nameEn: 'Colombia', capital: '波哥大', capitalEn: 'Bogotá', region: '南美', flag: '🇨🇴', population: '5100万', area: '114万平方公里' },
            { name: '委内瑞拉', nameEn: 'Venezuela', capital: '加拉加斯', capitalEn: 'Caracas', region: '南美', flag: '🇻🇪', population: '2800万', area: '91.2万平方公里' },
            { name: '圭亚那', nameEn: 'Guyana', capital: '乔治敦', capitalEn: 'Georgetown', region: '南美', flag: '🇬🇾', population: '79万', area: '21.5万平方公里' },
            { name: '苏里南', nameEn: 'Suriname', capital: '帕拉马里博', capitalEn: 'Paramaribo', region: '南美', flag: '🇸🇷', population: '59万', area: '16.4万平方公里' },
            { name: '厄瓜多尔', nameEn: 'Ecuador', capital: '基多', capitalEn: 'Quito', region: '南美', flag: '🇪🇨', population: '1800万', area: '28.4万平方公里' },
            { name: '秘鲁', nameEn: 'Peru', capital: '利马', capitalEn: 'Lima', region: '南美', flag: '🇵🇪', population: '3300万', area: '128万平方公里' },
            { name: '巴西', nameEn: 'Brazil', capital: '巴西利亚', capitalEn: 'Brasília', region: '南美', flag: '🇧🇷', population: '2.15亿', area: '851万平方公里', history: '巴西联邦共和国是南美洲最大国家，1822年独立。拥有世界最大的热带雨林，是新兴经济体。' },
            { name: '玻利维亚', nameEn: 'Bolivia', capital: '拉巴斯', capitalEn: 'La Paz', region: '南美', flag: '🇧🇴', population: '1200万', area: '110万平方公里' },
            { name: '智利', nameEn: 'Chile', capital: '圣地亚哥', capitalEn: 'Santiago', region: '南美', flag: '🇨🇱', population: '1900万', area: '75.6万平方公里' },
            { name: '阿根廷', nameEn: 'Argentina', capital: '布宜诺斯艾利斯', capitalEn: 'Buenos Aires', region: '南美', flag: '🇦🇷', population: '4500万', area: '278万平方公里', history: '阿根廷共和国1816年独立，曾是世界最富有国家之一。以牛肉、足球和探戈舞闻名世界。' },
            { name: '乌拉圭', nameEn: 'Uruguay', capital: '蒙得维的亚', capitalEn: 'Montevideo', region: '南美', flag: '🇺🇾', population: '350万', area: '17.6万平方公里' },
            { name: '巴拉圭', nameEn: 'Paraguay', capital: '亚松森', capitalEn: 'Asunción', region: '南美', flag: '🇵🇾', population: '720万', area: '40.7万平方公里' },
        ]
    },
    {
        key: 'oceania',
        name: '大洋洲',
        icon: '🌏',
        countries: [
            { name: '澳大利亚', nameEn: 'Australia', capital: '堪培拉', capitalEn: 'Canberra', region: '大洋洲', flag: '🇦🇺', population: '2600万', area: '769万平方公里', history: '澳大利亚联邦1901年独立，是世界面积第六大国家。拥有独特的生态系统和丰富的矿产资源。' },
            { name: '新西兰', nameEn: 'New Zealand', capital: '惠灵顿', capitalEn: 'Wellington', region: '大洋洲', flag: '🇳🇿', population: '510万', area: '26.8万平方公里', history: '新西兰1907年独立，由北岛和南岛组成。以农牧业和旅游业著称，自然环境优美。' },
            { name: '斐济', nameEn: 'Fiji', capital: '苏瓦', capitalEn: 'Suva', region: '大洋洲', flag: '🇫🇯', population: '90万', area: '1.8万平方公里' },
            { name: '巴布亚新几内亚', nameEn: 'Papua New Guinea', capital: '莫尔兹比港', capitalEn: 'Port Moresby', region: '大洋洲', flag: '🇵🇬', population: '900万', area: '46.3万平方公里' },
            { name: '所罗门群岛', nameEn: 'Solomon Islands', capital: '霍尼亚拉', capitalEn: 'Honiara', region: '大洋洲', flag: '🇸🇧', population: '70万', area: '2.8万平方公里' },
            { name: '瓦努阿图', nameEn: 'Vanuatu', capital: '维拉港', capitalEn: 'Port Vila', region: '大洋洲', flag: '🇻🇺', population: '32万', area: '1.2万平方公里' },
            { name: '萨摩亚', nameEn: 'Samoa', capital: '阿皮亚', capitalEn: 'Apia', region: '大洋洲', flag: '🇼🇸', population: '20万', area: '2831平方公里' },
            { name: '基里巴斯', nameEn: 'Kiribati', capital: '塔拉瓦', capitalEn: 'Tarawa', region: '大洋洲', flag: '🇰🇮', population: '12万', area: '811平方公里' },
            { name: '马绍尔群岛', nameEn: 'Marshall Islands', capital: '马朱罗', capitalEn: 'Majuro', region: '大洋洲', flag: '🇲🇭', population: '6万', area: '181平方公里' },
            { name: '密克罗尼西亚', nameEn: 'Micronesia', capital: '帕利基尔', capitalEn: 'Palikir', region: '大洋洲', flag: '🇫🇲', population: '11万', area: '702平方公里' },
            { name: '瑙鲁', nameEn: 'Nauru', capital: '瑙鲁', capitalEn: 'Yaren', region: '大洋洲', flag: '🇳🇷', population: '1.1万', area: '21平方公里' },
            { name: '帕劳', nameEn: 'Palau', capital: '恩吉鲁梅托尔', capitalEn: 'Ngerulmud', region: '大洋洲', flag: '🇵🇼', population: '1.8万', area: '459平方公里' },
            { name: '汤加', nameEn: 'Tonga', capital: '努库阿洛法', capitalEn: 'Nuku\'alofa', region: '大洋洲', flag: '🇹🇴', population: '11万', area: '747平方公里' },
            { name: '库克群岛', nameEn: 'Cook Islands', capital: '阿瓦鲁阿', capitalEn: 'Avarua', region: '大洋洲', flag: '��pu', population: '1.8万', area: '236平方公里' },
            { name: '纽埃', nameEn: 'Niue', capital: '阿洛菲', capitalEn: 'Alofi', region: '大洋洲', flag: '🇳🇺', population: '1600人', area: '260平方公里' },
        ]
    }
])
const allContinents = computed(() => [
    { key: 'all', name: '全部', icon: '🌍' },
    ...continents.value
])

const filteredCountries = computed(() => {
    let result = activeContinent.value === 'all' 
        ? continents.value.flatMap(c => c.countries)
        : continents.value.find(c => c.key === activeContinent.value)?.countries || []
    
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(c => 
            c.name.toLowerCase().includes(query) || 
            c.capital.toLowerCase().includes(query) ||
            (c.nameEn && c.nameEn.toLowerCase().includes(query)) ||
            (c.capitalEn && c.capitalEn.toLowerCase().includes(query))
        )
    }
    return result
})

const totalPages = computed(() => Math.ceil(filteredCountries.value.length / pageSize))

const paginatedCountries = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredCountries.value.slice(start, start + pageSize)
})

const getTitle = () => {
    if (activeContinent.value === 'all') return '全部国家'
    return continents.value.find(c => c.key === activeContinent.value)?.name || '全部国家'
}

const setActiveContinent = (key: string) => {
    activeContinent.value = key
    currentPage.value = 1
}

const filterCountries = () => {
    currentPage.value = 1
}

const clearSearch = () => {
    searchQuery.value = ''
    currentPage.value = 1
}

const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const exportData = () => {
    const data = continents.value.map(c => ({ continent: c.name, countries: c.countries }))
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'countries-capitals.json'
    a.click()
    URL.revokeObjectURL(url)
    message.value = '数据导出成功'
    messageType.value = 'success'
    setTimeout(() => { message.value = '' }, 2000)
}

const openCountryModal = (country: Country) => {
    selectedCountry.value = country
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedCountry.value = null
}

const getCountryCode = (country: Country | null) => {
    if (!country) return 'un'
    
    // 使用预定义的国家代码映射
    const countryCodeMap: { [key: string]: string } = {
        '中国': 'cn', '日本': 'jp', '韩国': 'kr', '朝鲜': 'kp', '蒙古': 'mn',
        '越南': 'vn', '柬埔寨': 'kh', '老挝': 'la', '泰国': 'th', '缅甸': 'mm',
        '马来西亚': 'my', '新加坡': 'sg', '印度尼西亚': 'id', '菲律宾': 'ph',
        '孟加拉国': 'bd', '印度': 'in', '巴基斯坦': 'pk', '斯里兰卡': 'lk',
        '尼泊尔': 'np', '不丹': 'bt', '马尔代夫': 'mv',
        '伊朗': 'ir', '伊拉克': 'iq', '沙特阿拉伯': 'sa', '阿联酋': 'ae',
        '卡塔尔': 'qa', '巴林': 'bh', '科威特': 'kw', '阿曼': 'om', '也门': 'ye',
        '以色列': 'il', '巴勒斯坦': 'ps', '约旦': 'jo', '黎巴嫩': 'lb', '叙利亚': 'sy',
        '土耳其': 'tr', '阿富汗': 'af', '哈萨克斯坦': 'kz', '乌兹别克斯坦': 'uz',
        '土库曼斯坦': 'tm', '吉尔吉斯斯坦': 'kg', '塔吉克斯坦': 'tj',
        '美国': 'us', '加拿大': 'ca', '墨西哥': 'mx', '巴西': 'br', '阿根廷': 'ar',
        '英国': 'gb', '法国': 'fr', '德国': 'de', '意大利': 'it', '西班牙': 'es',
        '俄罗斯': 'ru', '乌克兰': 'ua', '波兰': 'pl', '荷兰': 'nl', '比利时': 'be',
        '瑞士': 'ch', '奥地利': 'at', '瑞典': 'se', '挪威': 'no', '丹麦': 'dk',
        '芬兰': 'fi', '冰岛': 'is', '爱尔兰': 'ie', '葡萄牙': 'pt', '希腊': 'gr',
        '澳大利亚': 'au', '新西兰': 'nz', '南非': 'za', '埃及': 'eg', '尼日利亚': 'ng',
        '埃塞俄比亚': 'et', '肯尼亚': 'ke', '坦桑尼亚': 'tz', '乌干达': 'ug', '卢旺达': 'rw',
        '摩洛哥': 'ma', '阿尔及利亚': 'dz', '突尼斯': 'tn', '利比亚': 'ly', '苏丹': 'sd',
        '刚果民主共和国': 'cd', '刚果共和国': 'cg', '喀麦隆': 'cm', '加纳': 'gh',
        '科特迪瓦': 'ci', '塞内加尔': 'sn', '马里': 'ml', '布基纳法索': 'bf',
        '尼日尔': 'ne', '中非共和国': 'cf', '加蓬': 'ga',
        '赤道几内亚': 'gq', '圣多美和普林西比': 'st',
        '几内亚比绍': 'gw', '几内亚': 'gn', '塞拉利昂': 'sl', '利比里亚': 'lr',
        '毛里塔尼亚': 'mr', '冈比亚': 'gm', '马达加斯加': 'mg', '毛里求斯': 'mu',
        '塞舌尔': 'sc', '吉布提': 'dj', '厄立特里亚': 'er',
        '索马里': 'so', '南苏丹': 'ss', '布隆迪': 'bi', '马拉维': 'mw',
        '赞比亚': 'zm', '津巴布韦': 'zw', '博茨瓦纳': 'bw', '纳米比亚': 'na',
        '莱索托': 'ls', '斯威士兰': 'sz', '莫桑比克': 'mz',
        '危地马拉': 'gt', '伯利兹': 'bz', '萨尔瓦多': 'sv', '洪都拉斯': 'hn',
        '尼加拉瓜': 'ni', '哥斯达黎加': 'cr', '巴拿马': 'pa', '古巴': 'cu',
        '牙买加': 'jm', '海地': 'ht', '多米尼加共和国': 'do', '巴哈马': 'bs',
        '特立尼达和多巴哥': 'tt', '巴巴多斯': 'bb', '圣卢西亚': 'lc',
        '圣文森特和格林纳丁斯': 'vc', '格林纳达': 'gd', '安提瓜和巴布达': 'ag',
        '多米尼克': 'dm', '圣基茨和尼维斯': 'kn', '哥伦比亚': 'co',
        '委内瑞拉': 've', '圭亚那': 'gy', '苏里南': 'sr', '厄瓜多尔': 'ec',
        '秘鲁': 'pe', '玻利维亚': 'bo', '智利': 'cl', '乌拉圭': 'uy', '巴拉圭': 'py',
        '斐济': 'fj', '巴布亚新几内亚': 'pg', '所罗门群岛': 'sb', '瓦努阿图': 'vu',
        '萨摩亚': 'ws', '基里巴斯': 'ki', '马绍尔群岛': 'mh', '密克罗尼西亚': 'fm',
        '瑙鲁': 'nr', '帕劳': 'pw', '汤加': 'to', '图瓦卢': 'tv',
        '白俄罗斯': 'by', '捷克': 'cz', '斯洛伐克': 'sk', '匈牙利': 'hu',
        '罗马尼亚': 'ro', '保加利亚': 'bg', '塞尔维亚': 'rs', '克罗地亚': 'hr',
        '波黑': 'ba', '黑山': 'me', '北马其顿': 'mk', '阿尔巴尼亚': 'al',
        '斯洛文尼亚': 'si', '爱沙尼亚': 'ee', '拉脱维亚': 'lv', '立陶宛': 'lt',
        '卢森堡': 'lu', '马耳他': 'mt', '塞浦路斯': 'cy',
        '佛得角': 'cv', '乍得': 'td', '科摩罗': 'km', '东帝汶': 'tl', '文莱': 'bn',
        '梵蒂冈': 'va', '圣马力诺': 'sm', '摩纳哥': 'mc', '列支敦士登': 'li', '安道尔': 'ad',
        '库克群岛': 'ck', '纽埃': 'nu', '科索沃': 'xk', '南奥塞梯': 'os', '阿布哈兹': 'ab',
        '亚美尼亚': 'am', '阿塞拜疆': 'az', '格鲁吉亚': 'ge', '塞浦路斯北部': 'tr'
    }
    
    return countryCodeMap[country.name] || country.nameEn?.substring(0, 2).toLowerCase() || 'un'
}

const handleFlagError = (event: Event) => {
    const img = event.target as HTMLImageElement
    // 如果国旗图片加载失败，显示默认图片或隐藏
    img.style.display = 'none'
}

// 页面标题管理
onMounted(() => {
    setPageTitle('countries-capitals')
})

onUnmounted(() => {
    restoreDefaultTitle()
})
</script>
<style scoped>
.countries-capitals {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--bg-primary);
    color: var(--text-primary);
}

.reference-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    flex-shrink: 0;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.back-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.reference-title {
    flex: 1;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
}

.reference-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.reference-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.reference-content > * {
    width: 100%;
    max-width: 1200px;
}

.search-section {
    margin-bottom: 2rem;
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.search-input-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
}

.search-icon {
    color: var(--text-secondary);
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    outline: none;
    font-size: 1rem;
}

.search-input::placeholder {
    color: var(--text-secondary);
}

.clear-search-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-search-btn:hover {
    color: var(--text-primary);
}

.category-filter {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.category-btn {
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    cursor: pointer;
    border-radius: 0.375rem;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.category-btn:hover {
    background: var(--bg-tertiary);
}

.category-btn.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
}

.countries-section {
    margin-bottom: 2rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.section-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.section-info {
    display: flex;
    gap: 1rem;
}

.info-text {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.countries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.country-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1rem;
    transition: all 0.2s ease;
    cursor: pointer;
}

.country-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: var(--accent-color);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.country-index {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    font-size: 0.875rem;
    font-weight: 600;
}

.country-region {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.card-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.country-main {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
}

.country-flag-section {
    flex-shrink: 0;
}

.flag-image {
    width: 3.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 0.375rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
}

.country-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.country-names {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.country-name {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
}

.country-name-en {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-style: italic;
    font-weight: 500;
}

.capital-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.capital-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.capital-icon {
    font-size: 1rem;
    opacity: 0.7;
}

.capital-names {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.capital-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
}

.capital-name-en {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-style: italic;
}

.country-stats {
    display: flex;
    gap: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
    margin-top: 0.25rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex: 1;
}

.stat-icon {
    font-size: 0.875rem;
    opacity: 0.7;
}

.stat-value {
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.modal-flag-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.flag-image-large {
    width: 4rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 0.375rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border: 1px solid var(--border-color);
}



.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color);
}

.page-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    cursor: pointer;
    border-radius: 0.375rem;
    transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
    background: var(--bg-tertiary);
    border-color: var(--accent-color);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    color: var(--text-secondary);
    font-size: 0.875rem;
    min-width: 60px;
    text-align: center;
}

.message-toast {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 1rem 1.5rem;
    background: var(--success-color);
    color: white;
    border-radius: 0.375rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease-out;
}

.message-toast.error {
    background: var(--error-color);
}

/* 弹窗样式 */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: var(--bg-primary);
    border-radius: 1rem;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: modalSlideIn 0.3s ease;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.modal-title {
    display: flex;
    align-items: center;
    gap: 1rem;
}



.title-text h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
}

.title-text p {
    margin: 0.25rem 0 0 0;
    font-size: 1rem;
    color: var(--text-secondary);
    font-style: italic;
}

.close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: var(--bg-tertiary);
    transform: scale(1.05);
}

.modal-body {
    padding: 1.5rem;
}

.country-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.info-item {
    background: var(--bg-secondary);
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-color);
}

.info-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.info-value {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info-value-en {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-style: italic;
    font-weight: normal;
}

.country-history {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
}

.history-label {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.history-content {
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--text-secondary);
}

.no-info {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
}

.no-info p {
    margin: 0;
    font-style: italic;
}

@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes modalSlideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .reference-content {
        padding: 1rem;
    }

    .countries-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .country-card {
        padding: 0.875rem;
    }

    .category-filter {
        gap: 0.25rem;
    }

    .category-btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
    }

    .card-header {
        margin-bottom: 0.5rem;
    }

    .card-content {
        gap: 0.75rem;
    }

    .country-main {
        gap: 0.75rem;
    }

    .flag-image {
        width: 3rem;
        height: 2rem;
    }

    .country-name {
        font-size: 1rem;
    }

    .country-name-en {
        font-size: 0.8rem;
    }

    .capital-name {
        font-size: 0.85rem;
    }

    .capital-name-en {
        font-size: 0.75rem;
    }

    .country-stats {
        gap: 0.75rem;
        padding-top: 0.5rem;
    }

    .stat-value {
        font-size: 0.75rem;
    }

    .modal-content {
        width: 95%;
        max-height: 90vh;
    }

    .modal-header {
        padding: 1rem;
    }

    .modal-body {
        padding: 1rem;
    }

    .country-info-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .flag-image-large {
        width: 3.5rem;
        height: 2.25rem;
    }

    .title-text h3 {
        font-size: 1.25rem;
    }
}
</style>