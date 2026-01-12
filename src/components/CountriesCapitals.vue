<template>
    <div class="countries-capitals">
        <!-- 使用公共页面头部组件 -->
        <PageHeader 
            :title="cardTitle" 
            @back="$emit('back')"
        />

        <!-- 内容区域 -->
        <div class="content-wrapper">
            <div class="reference-content">
                <!-- 搜索和筛选 -->
                <SearchSection
                    v-model:search-query="searchQuery"
                    v-model:active-filter="selectedRegion"
                    placeholder="搜索国家或首都..."
                    :filters="regions"
                />

                <!-- 国家列表 -->
                <div class="countries-section">
                    <div class="section-header">
                        <div class="header-left">
                            <h3>{{ getSectionTitle() }}</h3>
                            <div class="section-info">
                                <span class="info-text">共 {{ filteredCountries.length }} 个国家</span>
                            </div>
                        </div>
                        
                        <!-- 高级筛选 -->
                        <div class="advanced-filters">
                            <div class="filter-group">
                                <label class="filter-label">人口</label>
                                <select v-model="selectedPopulation" class="filter-select">
                                    <option value="all">全部</option>
                                    <option value="large">大国 (>1亿)</option>
                                    <option value="medium">中等 (1000万-1亿)</option>
                                    <option value="small">小国 (<1000万)</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">面积</label>
                                <select v-model="selectedArea" class="filter-select">
                                    <option value="all">全部</option>
                                    <option value="huge">超大 (>500万km²)</option>
                                    <option value="large">大 (100万-500万km²)</option>
                                    <option value="medium">中等 (10万-100万km²)</option>
                                    <option value="small">小 (<10万km²)</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">发展水平</label>
                                <select v-model="selectedDevelopment" class="filter-select">
                                    <option value="all">全部</option>
                                    <option value="developed">发达国家</option>
                                    <option value="developing">发展中国家</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <label class="filter-label">排序方式</label>
                                <select v-model="sortBy" class="filter-select">
                                    <option value="name">按名称</option>
                                    <option value="population">按人口</option>
                                    <option value="area">按面积</option>
                                </select>
                            </div>

                            <div class="filter-group">
                                <button 
                                    @click="toggleSortOrder" 
                                    class="sort-btn"
                                >
                                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="countries-grid">
                        <div
                            v-for="(country, index) in paginatedCountries"
                            :key="country.code"
                            class="country-card"
                            @click="showCountryDetail(country)"
                        >
                            <div class="card-header">
                                <div class="country-index">{{ (currentPage - 1) * pageSize + index + 1 }}</div>
                                <div class="country-region">{{ getRegionName(country.region) }}</div>
                            </div>

                            <div class="card-content">
                                <div class="country-main">
                                    <div class="country-flag-section">
                                        <img
                                            :src="country.flag"
                                            :alt="`${country.name}国旗`"
                                            class="flag-image"
                                            @error="handleImageError"
                                        />
                                    </div>

                                    <div class="country-details">
                                        <div class="country-names">
                                            <h3 class="country-name">{{ country.name }}</h3>
                                            <p class="country-name-en">{{ country.nameEn }}</p>
                                        </div>

                                        <div class="capital-info">
                                            <div class="capital-main">
                                                <span class="capital-icon">🏛️</span>
                                                <div class="capital-names">
                                                    <div class="capital-name">{{ country.capital }}</div>
                                                    <div class="capital-name-en">{{ country.capitalEn }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="country-stats">
                                    <div class="stat-item">
                                        <span class="stat-icon">🌍</span>
                                        <span class="stat-value">{{ country.continent }}</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-icon">👥</span>
                                        <span class="stat-value">{{ formatPopulation(country.population) }}</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-icon">📐</span>
                                        <span class="stat-value">{{ formatArea(country.area) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 分页 -->
                    <div class="pagination" v-if="totalPages > 1">
                        <button
                            class="page-btn"
                            :disabled="currentPage === 1"
                            @click="currentPage--"
                        >
                            ‹
                        </button>
                        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
                        <button
                            class="page-btn"
                            :disabled="currentPage === totalPages"
                            @click="currentPage++"
                        >
                            ›
                        </button>
                    </div>
                    
                    <!-- 无分页时的底部间距 -->
                    <div v-else class="no-pagination-spacer"></div>
                </div>
            </div>
        </div>

        <!-- 使用公共弹窗组件 -->
        <Modal
            v-model:visible="showModal"
            :title="selectedCountry?.name || ''"
            max-width="600px"
            max-height="80vh"
        >
            <div v-if="selectedCountry" class="modal-body">
                <div class="modal-title">
                    <div class="modal-flag-section">
                        <img
                            :src="selectedCountry.flag"
                            :alt="`${selectedCountry.name}国旗`"
                            class="flag-image-large"
                            @error="handleImageError"
                        />
                    </div>
                    <div class="title-text">
                        <h3>{{ selectedCountry.name }}</h3>
                        <p>{{ selectedCountry.nameEn }}</p>
                    </div>
                </div>

                <div class="country-info-grid">
                    <div class="info-item">
                        <div class="info-label">首都</div>
                        <div class="info-value">
                            {{ selectedCountry.capital }}
                            <div class="info-value-en">{{ selectedCountry.capitalEn }}</div>
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">地区</div>
                        <div class="info-value">{{ getRegionName(selectedCountry.region) }}</div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">大洲</div>
                        <div class="info-value">{{ selectedCountry.continent }}</div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">人口</div>
                        <div class="info-value">{{ formatPopulation(selectedCountry.population) }}</div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">面积</div>
                        <div class="info-value">{{ formatArea(selectedCountry.area) }}</div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">货币</div>
                        <div class="info-value">
                            {{ selectedCountry.currency }}
                            <div class="info-value-en">{{ selectedCountry.currencyCode }}</div>
                        </div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">语言</div>
                        <div class="info-value">{{ selectedCountry.language }}</div>
                    </div>

                    <div class="info-item">
                        <div class="info-label">国家代码</div>
                        <div class="info-value">{{ selectedCountry.code }}</div>
                    </div>
                </div>

                <div v-if="selectedCountry.description" class="country-history">
                    <div class="history-label">国家简介</div>
                    <div class="history-content">{{ selectedCountry.description }}</div>
                </div>

                <div v-else class="no-info">
                    <p>暂无详细信息</p>
                </div>
            </div>
        </Modal>

        <!-- 使用公共回到顶部组件 -->
        <ScrollToTop container=".content-wrapper" />

        <!-- 使用公共通知组件 -->
        <NotificationContainer />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import PageHeader from './common/PageHeader.vue'
import SearchSection from './common/SearchSection.vue'
import Modal from './common/Modal.vue'
import ScrollToTop from './common/ScrollToTop.vue'
import NotificationContainer from './common/NotificationContainer.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import cardsConfig from '../config/cards.json'

// 设置页面标题
usePageTitle('国家首都查询')

// 定义 emits
const emit = defineEmits<{
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

const cardTitle = getCardTitle('countries-capitals')

// 通知系统
const { success, error } = useNotification()

// 响应式数据
const searchQuery = ref('')
const selectedRegion = ref('all')
const selectedPopulation = ref('all')
const selectedArea = ref('all')
const selectedDevelopment = ref('all')
const sortBy = ref('name')
const sortOrder = ref('asc')
const currentPage = ref(1)
const pageSize = 20
const showModal = ref(false)
const selectedCountry = ref<Country | null>(null)

// 国家数据接口
interface Country {
    code: string
    name: string
    nameEn: string
    capital: string
    capitalEn: string
    region: string
    continent: string
    population: number
    area: number
    currency: string
    currencyCode: string
    language: string
    flag: string
    description?: string
}

// 地区配置
const regions = computed(() => [
    { key: 'all', name: '全部地区', count: countriesData.value.length },
    { key: 'asia', name: '亚洲', count: getRegionCount('asia') },
    { key: 'europe', name: '欧洲', count: getRegionCount('europe') },
    { key: 'africa', name: '非洲', count: getRegionCount('africa') },
    { key: 'north-america', name: '北美洲', count: getRegionCount('north-america') },
    { key: 'south-america', name: '南美洲', count: getRegionCount('south-america') },
    { key: 'oceania', name: '大洋洲', count: getRegionCount('oceania') }
])

// 195个国家完整数据
const countriesData = ref<Country[]>([
    // 亚洲国家
    { code: 'CN', name: '中国', nameEn: 'China', capital: '北京', capitalEn: 'Beijing', region: 'asia', continent: '亚洲', population: 1439323776, area: 9596960, currency: '人民币', currencyCode: 'CNY', language: '中文', flag: 'https://flagcdn.com/w320/cn.png', description: '中华人民共和国，简称中国，是位于东亚的社会主义国家，首都北京。' },
    { code: 'IN', name: '印度', nameEn: 'India', capital: '新德里', capitalEn: 'New Delhi', region: 'asia', continent: '亚洲', population: 1380004385, area: 3287263, currency: '卢比', currencyCode: 'INR', language: '印地语', flag: 'https://flagcdn.com/w320/in.png', description: '印度共和国，简称印度，是位于南亚的联邦制国家，首都新德里。' },
    { code: 'JP', name: '日本', nameEn: 'Japan', capital: '东京', capitalEn: 'Tokyo', region: 'asia', continent: '亚洲', population: 126476461, area: 377975, currency: '日元', currencyCode: 'JPY', language: '日语', flag: 'https://flagcdn.com/w320/jp.png', description: '日本国，简称日本，是位于东亚的岛国，首都东京。' },
    { code: 'KR', name: '韩国', nameEn: 'South Korea', capital: '首尔', capitalEn: 'Seoul', region: 'asia', continent: '亚洲', population: 51269185, area: 100210, currency: '韩元', currencyCode: 'KRW', language: '韩语', flag: 'https://flagcdn.com/w320/kr.png', description: '大韩民国，简称韩国，是位于东亚朝鲜半岛南部的共和制国家，首都首尔。' },
    { code: 'TH', name: '泰国', nameEn: 'Thailand', capital: '曼谷', capitalEn: 'Bangkok', region: 'asia', continent: '亚洲', population: 69799978, area: 513120, currency: '泰铢', currencyCode: 'THB', language: '泰语', flag: 'https://flagcdn.com/w320/th.png', description: '泰王国，简称泰国，是位于东南亚的君主立宪制国家，首都曼谷。' },
    { code: 'AF', name: '阿富汗', nameEn: 'Afghanistan', capital: '喀布尔', capitalEn: 'Kabul', region: 'asia', continent: '亚洲', population: 38928346, area: 652230, currency: '阿富汗尼', currencyCode: 'AFN', language: '达里语', flag: 'https://flagcdn.com/w320/af.png', description: '阿富汗伊斯兰共和国，简称阿富汗，是位于中亚和南亚的内陆国家，首都喀布尔。' },
    { code: 'BD', name: '孟加拉国', nameEn: 'Bangladesh', capital: '达卡', capitalEn: 'Dhaka', region: 'asia', continent: '亚洲', population: 164689383, area: 147570, currency: '塔卡', currencyCode: 'BDT', language: '孟加拉语', flag: 'https://flagcdn.com/w320/bd.png', description: '孟加拉人民共和国，简称孟加拉国，是位于南亚的国家，首都达卡。' },
    { code: 'BT', name: '不丹', nameEn: 'Bhutan', capital: '廷布', capitalEn: 'Thimphu', region: 'asia', continent: '亚洲', population: 771608, area: 38394, currency: '努尔特鲁姆', currencyCode: 'BTN', language: '宗卡语', flag: 'https://flagcdn.com/w320/bt.png', description: '不丹王国，简称不丹，是位于喜马拉雅山脉的内陆国家，首都廷布。' },
    { code: 'BN', name: '文莱', nameEn: 'Brunei', capital: '斯里巴加湾市', capitalEn: 'Bandar Seri Begawan', region: 'asia', continent: '亚洲', population: 437479, area: 5765, currency: '文莱元', currencyCode: 'BND', language: '马来语', flag: 'https://flagcdn.com/w320/bn.png', description: '文莱达鲁萨兰国，简称文莱，是位于东南亚的君主制国家，首都斯里巴加湾市。' },
    { code: 'KH', name: '柬埔寨', nameEn: 'Cambodia', capital: '金边', capitalEn: 'Phnom Penh', region: 'asia', continent: '亚洲', population: 16718965, area: 181035, currency: '瑞尔', currencyCode: 'KHR', language: '高棉语', flag: 'https://flagcdn.com/w320/kh.png', description: '柬埔寨王国，简称柬埔寨，是位于东南亚的君主立宪制国家，首都金边。' },
    { code: 'ID', name: '印度尼西亚', nameEn: 'Indonesia', capital: '雅加达', capitalEn: 'Jakarta', region: 'asia', continent: '亚洲', population: 273523615, area: 1904569, currency: '印尼盾', currencyCode: 'IDR', language: '印尼语', flag: 'https://flagcdn.com/w320/id.png', description: '印度尼西亚共和国，简称印尼，是位于东南亚的群岛国家，首都雅加达。' },
    { code: 'IR', name: '伊朗', nameEn: 'Iran', capital: '德黑兰', capitalEn: 'Tehran', region: 'asia', continent: '亚洲', population: 83992949, area: 1648195, currency: '里亚尔', currencyCode: 'IRR', language: '波斯语', flag: 'https://flagcdn.com/w320/ir.png', description: '伊朗伊斯兰共和国，简称伊朗，是位于西亚的国家，首都德黑兰。' },
    { code: 'IQ', name: '伊拉克', nameEn: 'Iraq', capital: '巴格达', capitalEn: 'Baghdad', region: 'asia', continent: '亚洲', population: 40222493, area: 438317, currency: '第纳尔', currencyCode: 'IQD', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/iq.png', description: '伊拉克共和国，简称伊拉克，是位于西亚的国家，首都巴格达。' },
    { code: 'IL', name: '以色列', nameEn: 'Israel', capital: '耶路撒冷', capitalEn: 'Jerusalem', region: 'asia', continent: '亚洲', population: 9364000, area: 20770, currency: '新谢克尔', currencyCode: 'ILS', language: '希伯来语', flag: 'https://flagcdn.com/w320/il.png', description: '以色列国，简称以色列，是位于西亚的国家，首都耶路撒冷。' },
    { code: 'JO', name: '约旦', nameEn: 'Jordan', capital: '安曼', capitalEn: 'Amman', region: 'asia', continent: '亚洲', population: 10203134, area: 89342, currency: '第纳尔', currencyCode: 'JOD', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/jo.png', description: '约旦哈希姆王国，简称约旦，是位于西亚的君主立宪制国家，首都安曼。' },
    { code: 'KZ', name: '哈萨克斯坦', nameEn: 'Kazakhstan', capital: '努尔苏丹', capitalEn: 'Nur-Sultan', region: 'asia', continent: '亚洲', population: 18776707, area: 2724900, currency: '坚戈', currencyCode: 'KZT', language: '哈萨克语', flag: 'https://flagcdn.com/w320/kz.png', description: '哈萨克斯坦共和国，简称哈萨克斯坦，是位于中亚的内陆国家，首都努尔苏丹。' },
    { code: 'KW', name: '科威特', nameEn: 'Kuwait', capital: '科威特城', capitalEn: 'Kuwait City', region: 'asia', continent: '亚洲', population: 4270571, area: 17818, currency: '第纳尔', currencyCode: 'KWD', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/kw.png', description: '科威特国，简称科威特，是位于西亚的君主制国家，首都科威特城。' },
    { code: 'KG', name: '吉尔吉斯斯坦', nameEn: 'Kyrgyzstan', capital: '比什凯克', capitalEn: 'Bishkek', region: 'asia', continent: '亚洲', population: 6524195, area: 199951, currency: '索姆', currencyCode: 'KGS', language: '吉尔吉斯语', flag: 'https://flagcdn.com/w320/kg.png', description: '吉尔吉斯共和国，简称吉尔吉斯斯坦，是位于中亚的内陆国家，首都比什凯克。' },
    { code: 'LA', name: '老挝', nameEn: 'Laos', capital: '万象', capitalEn: 'Vientiane', region: 'asia', continent: '亚洲', population: 7275560, area: 236800, currency: '基普', currencyCode: 'LAK', language: '老挝语', flag: 'https://flagcdn.com/w320/la.png', description: '老挝人民民主共和国，简称老挝，是位于东南亚的内陆国家，首都万象。' },
    { code: 'LB', name: '黎巴嫩', nameEn: 'Lebanon', capital: '贝鲁特', capitalEn: 'Beirut', region: 'asia', continent: '亚洲', population: 6825445, area: 10452, currency: '镑', currencyCode: 'LBP', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/lb.png', description: '黎巴嫩共和国，简称黎巴嫩，是位于西亚的国家，首都贝鲁特。' },
    { code: 'MY', name: '马来西亚', nameEn: 'Malaysia', capital: '吉隆坡', capitalEn: 'Kuala Lumpur', region: 'asia', continent: '亚洲', population: 32365999, area: 330803, currency: '林吉特', currencyCode: 'MYR', language: '马来语', flag: 'https://flagcdn.com/w320/my.png', description: '马来西亚，是位于东南亚的联邦制国家，首都吉隆坡。' },
    { code: 'MV', name: '马尔代夫', nameEn: 'Maldives', capital: '马累', capitalEn: 'Male', region: 'asia', continent: '亚洲', population: 540544, area: 300, currency: '拉菲亚', currencyCode: 'MVR', language: '迪维希语', flag: 'https://flagcdn.com/w320/mv.png', description: '马尔代夫共和国，简称马尔代夫，是位于印度洋的岛国，首都马累。' },
    { code: 'MN', name: '蒙古', nameEn: 'Mongolia', capital: '乌兰巴托', capitalEn: 'Ulaanbaatar', region: 'asia', continent: '亚洲', population: 3278290, area: 1564110, currency: '图格里克', currencyCode: 'MNT', language: '蒙古语', flag: 'https://flagcdn.com/w320/mn.png', description: '蒙古国，简称蒙古，是位于东亚的内陆国家，首都乌兰巴托。' },
    { code: 'MM', name: '缅甸', nameEn: 'Myanmar', capital: '内比都', capitalEn: 'Naypyidaw', region: 'asia', continent: '亚洲', population: 54409800, area: 676578, currency: '缅元', currencyCode: 'MMK', language: '缅甸语', flag: 'https://flagcdn.com/w320/mm.png', description: '缅甸联邦共和国，简称缅甸，是位于东南亚的国家，首都内比都。' },
    { code: 'NP', name: '尼泊尔', nameEn: 'Nepal', capital: '加德满都', capitalEn: 'Kathmandu', region: 'asia', continent: '亚洲', population: 29136808, area: 147516, currency: '卢比', currencyCode: 'NPR', language: '尼泊尔语', flag: 'https://flagcdn.com/w320/np.png', description: '尼泊尔联邦民主共和国，简称尼泊尔，是位于喜马拉雅山脉的内陆国家，首都加德满都。' },
    { code: 'KP', name: '朝鲜', nameEn: 'North Korea', capital: '平壤', capitalEn: 'Pyongyang', region: 'asia', continent: '亚洲', population: 25778816, area: 120538, currency: '朝鲜元', currencyCode: 'KPW', language: '朝鲜语', flag: 'https://flagcdn.com/w320/kp.png', description: '朝鲜民主主义人民共和国，简称朝鲜，是位于东亚朝鲜半岛北部的社会主义国家，首都平壤。' },
    { code: 'OM', name: '阿曼', nameEn: 'Oman', capital: '马斯喀特', capitalEn: 'Muscat', region: 'asia', continent: '亚洲', population: 5106626, area: 309500, currency: '里亚尔', currencyCode: 'OMR', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/om.png', description: '阿曼苏丹国，简称阿曼，是位于西亚的君主制国家，首都马斯喀特。' },
    { code: 'PK', name: '巴基斯坦', nameEn: 'Pakistan', capital: '伊斯兰堡', capitalEn: 'Islamabad', region: 'asia', continent: '亚洲', population: 220892340, area: 881913, currency: '卢比', currencyCode: 'PKR', language: '乌尔都语', flag: 'https://flagcdn.com/w320/pk.png', description: '巴基斯坦伊斯兰共和国，简称巴基斯坦，是位于南亚的国家，首都伊斯兰堡。' },
    { code: 'PS', name: '巴勒斯坦', nameEn: 'Palestine', capital: '拉马拉', capitalEn: 'Ramallah', region: 'asia', continent: '亚洲', population: 5101414, area: 6220, currency: '谢克尔', currencyCode: 'ILS', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/ps.png', description: '巴勒斯坦国，简称巴勒斯坦，是位于西亚的国家，首都拉马拉。' },
    { code: 'PH', name: '菲律宾', nameEn: 'Philippines', capital: '马尼拉', capitalEn: 'Manila', region: 'asia', continent: '亚洲', population: 109581078, area: 300000, currency: '比索', currencyCode: 'PHP', language: '菲律宾语', flag: 'https://flagcdn.com/w320/ph.png', description: '菲律宾共和国，简称菲律宾，是位于东南亚的群岛国家，首都马尼拉。' },
    { code: 'QA', name: '卡塔尔', nameEn: 'Qatar', capital: '多哈', capitalEn: 'Doha', region: 'asia', continent: '亚洲', population: 2881053, area: 11586, currency: '里亚尔', currencyCode: 'QAR', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/qa.png', description: '卡塔尔国，简称卡塔尔，是位于西亚的君主制国家，首都多哈。' },
    { code: 'SA', name: '沙特阿拉伯', nameEn: 'Saudi Arabia', capital: '利雅得', capitalEn: 'Riyadh', region: 'asia', continent: '亚洲', population: 34813871, area: 2149690, currency: '里亚尔', currencyCode: 'SAR', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/sa.png', description: '沙特阿拉伯王国，简称沙特阿拉伯，是位于西亚的君主制国家，首都利雅得。' },
    { code: 'SG', name: '新加坡', nameEn: 'Singapore', capital: '新加坡', capitalEn: 'Singapore', region: 'asia', continent: '亚洲', population: 5850342, area: 719, currency: '新加坡元', currencyCode: 'SGD', language: '英语', flag: 'https://flagcdn.com/w320/sg.png', description: '新加坡共和国，简称新加坡，是位于东南亚的城市国家，首都新加坡。' },
    { code: 'LK', name: '斯里兰卡', nameEn: 'Sri Lanka', capital: '科伦坡', capitalEn: 'Colombo', region: 'asia', continent: '亚洲', population: 21413249, area: 65610, currency: '卢比', currencyCode: 'LKR', language: '僧伽罗语', flag: 'https://flagcdn.com/w320/lk.png', description: '斯里兰卡民主社会主义共和国，简称斯里兰卡，是位于南亚的岛国，首都科伦坡。' },
    { code: 'SY', name: '叙利亚', nameEn: 'Syria', capital: '大马士革', capitalEn: 'Damascus', region: 'asia', continent: '亚洲', population: 17500658, area: 185180, currency: '镑', currencyCode: 'SYP', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/sy.png', description: '阿拉伯叙利亚共和国，简称叙利亚，是位于西亚的国家，首都大马士革。' },
    { code: 'TJ', name: '塔吉克斯坦', nameEn: 'Tajikistan', capital: '杜尚别', capitalEn: 'Dushanbe', region: 'asia', continent: '亚洲', population: 9537645, area: 143100, currency: '索莫尼', currencyCode: 'TJS', language: '塔吉克语', flag: 'https://flagcdn.com/w320/tj.png', description: '塔吉克斯坦共和国，简称塔吉克斯坦，是位于中亚的内陆国家，首都杜尚别。' },
    { code: 'TL', name: '东帝汶', nameEn: 'East Timor', capital: '帝力', capitalEn: 'Dili', region: 'asia', continent: '亚洲', population: 1318445, area: 14874, currency: '美元', currencyCode: 'USD', language: '德顿语', flag: 'https://flagcdn.com/w320/tl.png', description: '东帝汶民主共和国，简称东帝汶，是位于东南亚的国家，首都帝力。' },
    { code: 'TR', name: '土耳其', nameEn: 'Turkey', capital: '安卡拉', capitalEn: 'Ankara', region: 'asia', continent: '亚洲', population: 84339067, area: 783562, currency: '里拉', currencyCode: 'TRY', language: '土耳其语', flag: 'https://flagcdn.com/w320/tr.png', description: '土耳其共和国，简称土耳其，是位于欧亚大陆的国家，首都安卡拉。' },
    { code: 'TM', name: '土库曼斯坦', nameEn: 'Turkmenistan', capital: '阿什哈巴德', capitalEn: 'Ashgabat', region: 'asia', continent: '亚洲', population: 6031200, area: 488100, currency: '马纳特', currencyCode: 'TMT', language: '土库曼语', flag: 'https://flagcdn.com/w320/tm.png', description: '土库曼斯坦，是位于中亚的内陆国家，首都阿什哈巴德。' },
    { code: 'AE', name: '阿联酋', nameEn: 'United Arab Emirates', capital: '阿布扎比', capitalEn: 'Abu Dhabi', region: 'asia', continent: '亚洲', population: 9890402, area: 83600, currency: '迪拉姆', currencyCode: 'AED', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/ae.png', description: '阿拉伯联合酋长国，简称阿联酋，是位于西亚的联邦制国家，首都阿布扎比。' },
    { code: 'UZ', name: '乌兹别克斯坦', nameEn: 'Uzbekistan', capital: '塔什干', capitalEn: 'Tashkent', region: 'asia', continent: '亚洲', population: 33469203, area: 447400, currency: '苏姆', currencyCode: 'UZS', language: '乌兹别克语', flag: 'https://flagcdn.com/w320/uz.png', description: '乌兹别克斯坦共和国，简称乌兹别克斯坦，是位于中亚的内陆国家，首都塔什干。' },
    { code: 'VN', name: '越南', nameEn: 'Vietnam', capital: '河内', capitalEn: 'Hanoi', region: 'asia', continent: '亚洲', population: 97338579, area: 331212, currency: '越南盾', currencyCode: 'VND', language: '越南语', flag: 'https://flagcdn.com/w320/vn.png', description: '越南社会主义共和国，简称越南，是位于东南亚的国家，首都河内。' },
    { code: 'YE', name: '也门', nameEn: 'Yemen', capital: '萨那', capitalEn: 'Sanaa', region: 'asia', continent: '亚洲', population: 29825964, area: 527968, currency: '里亚尔', currencyCode: 'YER', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/ye.png', description: '也门共和国，简称也门，是位于西亚的国家，首都萨那。' },
    
    // 欧洲国家
    { code: 'RU', name: '俄罗斯', nameEn: 'Russia', capital: '莫斯科', capitalEn: 'Moscow', region: 'europe', continent: '欧洲', population: 145934462, area: 17098242, currency: '卢布', currencyCode: 'RUB', language: '俄语', flag: 'https://flagcdn.com/w320/ru.png', description: '俄罗斯联邦，简称俄罗斯，是位于欧亚大陆的联邦制国家，首都莫斯科。' },
    { code: 'DE', name: '德国', nameEn: 'Germany', capital: '柏林', capitalEn: 'Berlin', region: 'europe', continent: '欧洲', population: 83783942, area: 357114, currency: '欧元', currencyCode: 'EUR', language: '德语', flag: 'https://flagcdn.com/w320/de.png', description: '德意志联邦共和国，简称德国，是位于欧洲中部的联邦制国家，首都柏林。' },
    { code: 'GB', name: '英国', nameEn: 'United Kingdom', capital: '伦敦', capitalEn: 'London', region: 'europe', continent: '欧洲', population: 67886011, area: 243610, currency: '英镑', currencyCode: 'GBP', language: '英语', flag: 'https://flagcdn.com/w320/gb.png', description: '大不列颠及北爱尔兰联合王国，简称英国，是位于欧洲西北部的岛国，首都伦敦。' },
    { code: 'FR', name: '法国', nameEn: 'France', capital: '巴黎', capitalEn: 'Paris', region: 'europe', continent: '欧洲', population: 65273511, area: 643801, currency: '欧元', currencyCode: 'EUR', language: '法语', flag: 'https://flagcdn.com/w320/fr.png', description: '法兰西共和国，简称法国，是位于欧洲西部的共和制国家，首都巴黎。' },
    { code: 'IT', name: '意大利', nameEn: 'Italy', capital: '罗马', capitalEn: 'Rome', region: 'europe', continent: '欧洲', population: 60461826, area: 301340, currency: '欧元', currencyCode: 'EUR', language: '意大利语', flag: 'https://flagcdn.com/w320/it.png', description: '意大利共和国，简称意大利，是位于欧洲南部的共和制国家，首都罗马。' },
    { code: 'ES', name: '西班牙', nameEn: 'Spain', capital: '马德里', capitalEn: 'Madrid', region: 'europe', continent: '欧洲', population: 46754778, area: 505992, currency: '欧元', currencyCode: 'EUR', language: '西班牙语', flag: 'https://flagcdn.com/w320/es.png', description: '西班牙王国，简称西班牙，是位于欧洲西南部的君主立宪制国家，首都马德里。' },
    { code: 'AL', name: '阿尔巴尼亚', nameEn: 'Albania', capital: '地拉那', capitalEn: 'Tirana', region: 'europe', continent: '欧洲', population: 2877797, area: 28748, currency: '列克', currencyCode: 'ALL', language: '阿尔巴尼亚语', flag: 'https://flagcdn.com/w320/al.png', description: '阿尔巴尼亚共和国，简称阿尔巴尼亚，是位于欧洲东南部的国家，首都地拉那。' },
    { code: 'AD', name: '安道尔', nameEn: 'Andorra', capital: '安道尔城', capitalEn: 'Andorra la Vella', region: 'europe', continent: '欧洲', population: 77265, area: 468, currency: '欧元', currencyCode: 'EUR', language: '加泰罗尼亚语', flag: 'https://flagcdn.com/w320/ad.png', description: '安道尔公国，简称安道尔，是位于欧洲西南部的内陆国家，首都安道尔城。' },
    { code: 'AM', name: '亚美尼亚', nameEn: 'Armenia', capital: '埃里温', capitalEn: 'Yerevan', region: 'europe', continent: '欧洲', population: 2963243, area: 29743, currency: '德拉姆', currencyCode: 'AMD', language: '亚美尼亚语', flag: 'https://flagcdn.com/w320/am.png', description: '亚美尼亚共和国，简称亚美尼亚，是位于西亚的内陆国家，首都埃里温。' },
    { code: 'AT', name: '奥地利', nameEn: 'Austria', capital: '维也纳', capitalEn: 'Vienna', region: 'europe', continent: '欧洲', population: 9006398, area: 83879, currency: '欧元', currencyCode: 'EUR', language: '德语', flag: 'https://flagcdn.com/w320/at.png', description: '奥地利共和国，简称奥地利，是位于欧洲中部的内陆国家，首都维也纳。' },
    { code: 'AZ', name: '阿塞拜疆', nameEn: 'Azerbaijan', capital: '巴库', capitalEn: 'Baku', region: 'europe', continent: '欧洲', population: 10139177, area: 86600, currency: '马纳特', currencyCode: 'AZN', language: '阿塞拜疆语', flag: 'https://flagcdn.com/w320/az.png', description: '阿塞拜疆共和国，简称阿塞拜疆，是位于西亚的国家，首都巴库。' },
    { code: 'BY', name: '白俄罗斯', nameEn: 'Belarus', capital: '明斯克', capitalEn: 'Minsk', region: 'europe', continent: '欧洲', population: 9449323, area: 207600, currency: '卢布', currencyCode: 'BYN', language: '白俄罗斯语', flag: 'https://flagcdn.com/w320/by.png', description: '白俄罗斯共和国，简称白俄罗斯，是位于欧洲东部的内陆国家，首都明斯克。' },
    { code: 'BE', name: '比利时', nameEn: 'Belgium', capital: '布鲁塞尔', capitalEn: 'Brussels', region: 'europe', continent: '欧洲', population: 11589623, area: 30528, currency: '欧元', currencyCode: 'EUR', language: '荷兰语', flag: 'https://flagcdn.com/w320/be.png', description: '比利时王国，简称比利时，是位于欧洲西部的国家，首都布鲁塞尔。' },
    { code: 'BA', name: '波黑', nameEn: 'Bosnia and Herzegovina', capital: '萨拉热窝', capitalEn: 'Sarajevo', region: 'europe', continent: '欧洲', population: 3280819, area: 51197, currency: '马克', currencyCode: 'BAM', language: '波斯尼亚语', flag: 'https://flagcdn.com/w320/ba.png', description: '波斯尼亚和黑塞哥维那，简称波黑，是位于欧洲东南部的国家，首都萨拉热窝。' },
    { code: 'BG', name: '保加利亚', nameEn: 'Bulgaria', capital: '索菲亚', capitalEn: 'Sofia', region: 'europe', continent: '欧洲', population: 6948445, area: 110879, currency: '列弗', currencyCode: 'BGN', language: '保加利亚语', flag: 'https://flagcdn.com/w320/bg.png', description: '保加利亚共和国，简称保加利亚，是位于欧洲东南部的国家，首都索菲亚。' },
    { code: 'HR', name: '克罗地亚', nameEn: 'Croatia', capital: '萨格勒布', capitalEn: 'Zagreb', region: 'europe', continent: '欧洲', population: 4105267, area: 56594, currency: '欧元', currencyCode: 'EUR', language: '克罗地亚语', flag: 'https://flagcdn.com/w320/hr.png', description: '克罗地亚共和国，简称克罗地亚，是位于欧洲东南部的国家，首都萨格勒布。' },
    { code: 'CY', name: '塞浦路斯', nameEn: 'Cyprus', capital: '尼科西亚', capitalEn: 'Nicosia', region: 'europe', continent: '欧洲', population: 1207359, area: 9251, currency: '欧元', currencyCode: 'EUR', language: '希腊语', flag: 'https://flagcdn.com/w320/cy.png', description: '塞浦路斯共和国，简称塞浦路斯，是位于地中海的岛国，首都尼科西亚。' },
    { code: 'CZ', name: '捷克', nameEn: 'Czech Republic', capital: '布拉格', capitalEn: 'Prague', region: 'europe', continent: '欧洲', population: 10708981, area: 78867, currency: '克朗', currencyCode: 'CZK', language: '捷克语', flag: 'https://flagcdn.com/w320/cz.png', description: '捷克共和国，简称捷克，是位于欧洲中部的内陆国家，首都布拉格。' },
    { code: 'DK', name: '丹麦', nameEn: 'Denmark', capital: '哥本哈根', capitalEn: 'Copenhagen', region: 'europe', continent: '欧洲', population: 5792202, area: 43094, currency: '克朗', currencyCode: 'DKK', language: '丹麦语', flag: 'https://flagcdn.com/w320/dk.png', description: '丹麦王国，简称丹麦，是位于欧洲北部的国家，首都哥本哈根。' },
    { code: 'EE', name: '爱沙尼亚', nameEn: 'Estonia', capital: '塔林', capitalEn: 'Tallinn', region: 'europe', continent: '欧洲', population: 1326535, area: 45228, currency: '欧元', currencyCode: 'EUR', language: '爱沙尼亚语', flag: 'https://flagcdn.com/w320/ee.png', description: '爱沙尼亚共和国，简称爱沙尼亚，是位于欧洲北部的国家，首都塔林。' },
    { code: 'FI', name: '芬兰', nameEn: 'Finland', capital: '赫尔辛基', capitalEn: 'Helsinki', region: 'europe', continent: '欧洲', population: 5540720, area: 338424, currency: '欧元', currencyCode: 'EUR', language: '芬兰语', flag: 'https://flagcdn.com/w320/fi.png', description: '芬兰共和国，简称芬兰，是位于欧洲北部的国家，首都赫尔辛基。' },
    { code: 'GE', name: '格鲁吉亚', nameEn: 'Georgia', capital: '第比利斯', capitalEn: 'Tbilisi', region: 'europe', continent: '欧洲', population: 3989167, area: 69700, currency: '拉里', currencyCode: 'GEL', language: '格鲁吉亚语', flag: 'https://flagcdn.com/w320/ge.png', description: '格鲁吉亚，是位于西亚的国家，首都第比利斯。' },
    { code: 'GR', name: '希腊', nameEn: 'Greece', capital: '雅典', capitalEn: 'Athens', region: 'europe', continent: '欧洲', population: 10423054, area: 131957, currency: '欧元', currencyCode: 'EUR', language: '希腊语', flag: 'https://flagcdn.com/w320/gr.png', description: '希腊共和国，简称希腊，是位于欧洲东南部的国家，首都雅典。' },
    { code: 'HU', name: '匈牙利', nameEn: 'Hungary', capital: '布达佩斯', capitalEn: 'Budapest', region: 'europe', continent: '欧洲', population: 9660351, area: 93028, currency: '福林', currencyCode: 'HUF', language: '匈牙利语', flag: 'https://flagcdn.com/w320/hu.png', description: '匈牙利，是位于欧洲中部的内陆国家，首都布达佩斯。' },
    { code: 'IS', name: '冰岛', nameEn: 'Iceland', capital: '雷克雅未克', capitalEn: 'Reykjavik', region: 'europe', continent: '欧洲', population: 341243, area: 103000, currency: '克朗', currencyCode: 'ISK', language: '冰岛语', flag: 'https://flagcdn.com/w320/is.png', description: '冰岛共和国，简称冰岛，是位于北大西洋的岛国，首都雷克雅未克。' },
    { code: 'IE', name: '爱尔兰', nameEn: 'Ireland', capital: '都柏林', capitalEn: 'Dublin', region: 'europe', continent: '欧洲', population: 4937786, area: 70273, currency: '欧元', currencyCode: 'EUR', language: '英语', flag: 'https://flagcdn.com/w320/ie.png', description: '爱尔兰共和国，简称爱尔兰，是位于欧洲西部的岛国，首都都柏林。' },
    { code: 'LV', name: '拉脱维亚', nameEn: 'Latvia', capital: '里加', capitalEn: 'Riga', region: 'europe', continent: '欧洲', population: 1886198, area: 64589, currency: '欧元', currencyCode: 'EUR', language: '拉脱维亚语', flag: 'https://flagcdn.com/w320/lv.png', description: '拉脱维亚共和国，简称拉脱维亚，是位于欧洲北部的国家，首都里加。' },
    { code: 'LI', name: '列支敦士登', nameEn: 'Liechtenstein', capital: '瓦杜兹', capitalEn: 'Vaduz', region: 'europe', continent: '欧洲', population: 38128, area: 160, currency: '瑞士法郎', currencyCode: 'CHF', language: '德语', flag: 'https://flagcdn.com/w320/li.png', description: '列支敦士登公国，简称列支敦士登，是位于欧洲中部的内陆国家，首都瓦杜兹。' },
    { code: 'LT', name: '立陶宛', nameEn: 'Lithuania', capital: '维尔纽斯', capitalEn: 'Vilnius', region: 'europe', continent: '欧洲', population: 2722289, area: 65300, currency: '欧元', currencyCode: 'EUR', language: '立陶宛语', flag: 'https://flagcdn.com/w320/lt.png', description: '立陶宛共和国，简称立陶宛，是位于欧洲北部的国家，首都维尔纽斯。' },
    { code: 'LU', name: '卢森堡', nameEn: 'Luxembourg', capital: '卢森堡市', capitalEn: 'Luxembourg City', region: 'europe', continent: '欧洲', population: 625978, area: 2586, currency: '欧元', currencyCode: 'EUR', language: '卢森堡语', flag: 'https://flagcdn.com/w320/lu.png', description: '卢森堡大公国，简称卢森堡，是位于欧洲西部的内陆国家，首都卢森堡市。' },
    { code: 'MT', name: '马耳他', nameEn: 'Malta', capital: '瓦莱塔', capitalEn: 'Valletta', region: 'europe', continent: '欧洲', population: 441543, area: 316, currency: '欧元', currencyCode: 'EUR', language: '马耳他语', flag: 'https://flagcdn.com/w320/mt.png', description: '马耳他共和国，简称马耳他，是位于地中海的岛国，首都瓦莱塔。' },
    { code: 'MD', name: '摩尔多瓦', nameEn: 'Moldova', capital: '基希讷乌', capitalEn: 'Chisinau', region: 'europe', continent: '欧洲', population: 4033963, area: 33851, currency: '列伊', currencyCode: 'MDL', language: '罗马尼亚语', flag: 'https://flagcdn.com/w320/md.png', description: '摩尔多瓦共和国，简称摩尔多瓦，是位于欧洲东南部的内陆国家，首都基希讷乌。' },
    { code: 'MC', name: '摩纳哥', nameEn: 'Monaco', capital: '摩纳哥', capitalEn: 'Monaco', region: 'europe', continent: '欧洲', population: 39242, area: 2, currency: '欧元', currencyCode: 'EUR', language: '法语', flag: 'https://flagcdn.com/w320/mc.png', description: '摩纳哥公国，简称摩纳哥，是位于欧洲西南部的城市国家，首都摩纳哥。' },
    { code: 'ME', name: '黑山', nameEn: 'Montenegro', capital: '波德戈里察', capitalEn: 'Podgorica', region: 'europe', continent: '欧洲', population: 628066, area: 13812, currency: '欧元', currencyCode: 'EUR', language: '黑山语', flag: 'https://flagcdn.com/w320/me.png', description: '黑山，是位于欧洲东南部的国家，首都波德戈里察。' },
    { code: 'NL', name: '荷兰', nameEn: 'Netherlands', capital: '阿姆斯特丹', capitalEn: 'Amsterdam', region: 'europe', continent: '欧洲', population: 17134872, area: 41543, currency: '欧元', currencyCode: 'EUR', language: '荷兰语', flag: 'https://flagcdn.com/w320/nl.png', description: '荷兰王国，简称荷兰，是位于欧洲西北部的国家，首都阿姆斯特丹。' },
    { code: 'MK', name: '北马其顿', nameEn: 'North Macedonia', capital: '斯科普里', capitalEn: 'Skopje', region: 'europe', continent: '欧洲', population: 2083374, area: 25713, currency: '第纳尔', currencyCode: 'MKD', language: '马其顿语', flag: 'https://flagcdn.com/w320/mk.png', description: '北马其顿共和国，简称北马其顿，是位于欧洲东南部的内陆国家，首都斯科普里。' },
    { code: 'NO', name: '挪威', nameEn: 'Norway', capital: '奥斯陆', capitalEn: 'Oslo', region: 'europe', continent: '欧洲', population: 5421241, area: 323802, currency: '克朗', currencyCode: 'NOK', language: '挪威语', flag: 'https://flagcdn.com/w320/no.png', description: '挪威王国，简称挪威，是位于欧洲北部的国家，首都奥斯陆。' },
    { code: 'PL', name: '波兰', nameEn: 'Poland', capital: '华沙', capitalEn: 'Warsaw', region: 'europe', continent: '欧洲', population: 37846611, area: 312696, currency: '兹罗提', currencyCode: 'PLN', language: '波兰语', flag: 'https://flagcdn.com/w320/pl.png', description: '波兰共和国，简称波兰，是位于欧洲中部的国家，首都华沙。' },
    { code: 'PT', name: '葡萄牙', nameEn: 'Portugal', capital: '里斯本', capitalEn: 'Lisbon', region: 'europe', continent: '欧洲', population: 10196709, area: 92090, currency: '欧元', currencyCode: 'EUR', language: '葡萄牙语', flag: 'https://flagcdn.com/w320/pt.png', description: '葡萄牙共和国，简称葡萄牙，是位于欧洲西南部的国家，首都里斯本。' },
    { code: 'RO', name: '罗马尼亚', nameEn: 'Romania', capital: '布加勒斯特', capitalEn: 'Bucharest', region: 'europe', continent: '欧洲', population: 19237691, area: 238391, currency: '列伊', currencyCode: 'RON', language: '罗马尼亚语', flag: 'https://flagcdn.com/w320/ro.png', description: '罗马尼亚，是位于欧洲东南部的国家，首都布加勒斯特。' },
    { code: 'SM', name: '圣马力诺', nameEn: 'San Marino', capital: '圣马力诺', capitalEn: 'San Marino', region: 'europe', continent: '欧洲', population: 33931, area: 61, currency: '欧元', currencyCode: 'EUR', language: '意大利语', flag: 'https://flagcdn.com/w320/sm.png', description: '圣马力诺共和国，简称圣马力诺，是位于欧洲南部的内陆国家，首都圣马力诺。' },
    { code: 'RS', name: '塞尔维亚', nameEn: 'Serbia', capital: '贝尔格莱德', capitalEn: 'Belgrade', region: 'europe', continent: '欧洲', population: 8737371, area: 77474, currency: '第纳尔', currencyCode: 'RSD', language: '塞尔维亚语', flag: 'https://flagcdn.com/w320/rs.png', description: '塞尔维亚共和国，简称塞尔维亚，是位于欧洲东南部的内陆国家，首都贝尔格莱德。' },
    { code: 'SK', name: '斯洛伐克', nameEn: 'Slovakia', capital: '布拉迪斯拉发', capitalEn: 'Bratislava', region: 'europe', continent: '欧洲', population: 5459642, area: 49035, currency: '欧元', currencyCode: 'EUR', language: '斯洛伐克语', flag: 'https://flagcdn.com/w320/sk.png', description: '斯洛伐克共和国，简称斯洛伐克，是位于欧洲中部的内陆国家，首都布拉迪斯拉发。' },
    { code: 'SI', name: '斯洛文尼亚', nameEn: 'Slovenia', capital: '卢布尔雅那', capitalEn: 'Ljubljana', region: 'europe', continent: '欧洲', population: 2078938, area: 20273, currency: '欧元', currencyCode: 'EUR', language: '斯洛文尼亚语', flag: 'https://flagcdn.com/w320/si.png', description: '斯洛文尼亚共和国，简称斯洛文尼亚，是位于欧洲中南部的国家，首都卢布尔雅那。' },
    { code: 'SE', name: '瑞典', nameEn: 'Sweden', capital: '斯德哥尔摩', capitalEn: 'Stockholm', region: 'europe', continent: '欧洲', population: 10099265, area: 450295, currency: '克朗', currencyCode: 'SEK', language: '瑞典语', flag: 'https://flagcdn.com/w320/se.png', description: '瑞典王国，简称瑞典，是位于欧洲北部的国家，首都斯德哥尔摩。' },
    { code: 'CH', name: '瑞士', nameEn: 'Switzerland', capital: '伯尔尼', capitalEn: 'Bern', region: 'europe', continent: '欧洲', population: 8654622, area: 41277, currency: '瑞士法郎', currencyCode: 'CHF', language: '德语', flag: 'https://flagcdn.com/w320/ch.png', description: '瑞士联邦，简称瑞士，是位于欧洲中部的内陆国家，首都伯尔尼。' },
    { code: 'UA', name: '乌克兰', nameEn: 'Ukraine', capital: '基辅', capitalEn: 'Kiev', region: 'europe', continent: '欧洲', population: 43733762, area: 603550, currency: '格里夫纳', currencyCode: 'UAH', language: '乌克兰语', flag: 'https://flagcdn.com/w320/ua.png', description: '乌克兰，是位于欧洲东部的国家，首都基辅。' },
    { code: 'VA', name: '梵蒂冈', nameEn: 'Vatican City', capital: '梵蒂冈城', capitalEn: 'Vatican City', region: 'europe', continent: '欧洲', population: 801, area: 0.17, currency: '欧元', currencyCode: 'EUR', language: '意大利语', flag: 'https://flagcdn.com/w320/va.png', description: '梵蒂冈城国，简称梵蒂冈，是位于欧洲的城市国家，首都梵蒂冈城。' },
    { code: 'XK', name: '科索沃', nameEn: 'Kosovo', capital: '普里什蒂纳', capitalEn: 'Pristina', region: 'europe', continent: '欧洲', population: 1873160, area: 10887, currency: '欧元', currencyCode: 'EUR', language: '阿尔巴尼亚语', flag: 'https://flagcdn.com/w320/xk.png', description: '科索沃共和国，简称科索沃，是位于欧洲东南部的国家，首都普里什蒂纳。' },
    
    // 非洲国家
    { code: 'DZ', name: '阿尔及利亚', nameEn: 'Algeria', capital: '阿尔及尔', capitalEn: 'Algiers', region: 'africa', continent: '非洲', population: 43851044, area: 2381741, currency: '第纳尔', currencyCode: 'DZD', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/dz.png', description: '阿尔及利亚民主人民共和国，简称阿尔及利亚，是位于非洲北部的国家，首都阿尔及尔。' },
    { code: 'AO', name: '安哥拉', nameEn: 'Angola', capital: '罗安达', capitalEn: 'Luanda', region: 'africa', continent: '非洲', population: 32866272, area: 1246700, currency: '宽扎', currencyCode: 'AOA', language: '葡萄牙语', flag: 'https://flagcdn.com/w320/ao.png', description: '安哥拉共和国，简称安哥拉，是位于非洲西南部的国家，首都罗安达。' },
    { code: 'BJ', name: '贝宁', nameEn: 'Benin', capital: '波多诺伏', capitalEn: 'Porto-Novo', region: 'africa', continent: '非洲', population: 12123200, area: 112622, currency: '西非法郎', currencyCode: 'XOF', language: '法语', flag: 'https://flagcdn.com/w320/bj.png', description: '贝宁共和国，简称贝宁，是位于非洲西部的国家，首都波多诺伏。' },
    { code: 'BW', name: '博茨瓦纳', nameEn: 'Botswana', capital: '哈博罗内', capitalEn: 'Gaborone', region: 'africa', continent: '非洲', population: 2351627, area: 581730, currency: '普拉', currencyCode: 'BWP', language: '英语', flag: 'https://flagcdn.com/w320/bw.png', description: '博茨瓦纳共和国，简称博茨瓦纳，是位于非洲南部的内陆国家，首都哈博罗内。' },
    { code: 'BF', name: '布基纳法索', nameEn: 'Burkina Faso', capital: '瓦加杜古', capitalEn: 'Ouagadougou', region: 'africa', continent: '非洲', population: 20903273, area: 274200, currency: '西非法郎', currencyCode: 'XOF', language: '法语', flag: 'https://flagcdn.com/w320/bf.png', description: '布基纳法索，是位于非洲西部的内陆国家，首都瓦加杜古。' },
    { code: 'BI', name: '布隆迪', nameEn: 'Burundi', capital: '基特加', capitalEn: 'Gitega', region: 'africa', continent: '非洲', population: 11890784, area: 27830, currency: '布隆迪法郎', currencyCode: 'BIF', language: '基隆迪语', flag: 'https://flagcdn.com/w320/bi.png', description: '布隆迪共和国，简称布隆迪，是位于非洲中东部的内陆国家，首都基特加。' },
    { code: 'CV', name: '佛得角', nameEn: 'Cape Verde', capital: '普拉亚', capitalEn: 'Praia', region: 'africa', continent: '非洲', population: 555987, area: 4033, currency: '埃斯库多', currencyCode: 'CVE', language: '葡萄牙语', flag: 'https://flagcdn.com/w320/cv.png', description: '佛得角共和国，简称佛得角，是位于大西洋的岛国，首都普拉亚。' },
    { code: 'CM', name: '喀麦隆', nameEn: 'Cameroon', capital: '雅温得', capitalEn: 'Yaounde', region: 'africa', continent: '非洲', population: 26545863, area: 475442, currency: '中非法郎', currencyCode: 'XAF', language: '法语', flag: 'https://flagcdn.com/w320/cm.png', description: '喀麦隆共和国，简称喀麦隆，是位于非洲中西部的国家，首都雅温得。' },
    { code: 'CF', name: '中非', nameEn: 'Central African Republic', capital: '班吉', capitalEn: 'Bangui', region: 'africa', continent: '非洲', population: 4829767, area: 622984, currency: '中非法郎', currencyCode: 'XAF', language: '法语', flag: 'https://flagcdn.com/w320/cf.png', description: '中非共和国，简称中非，是位于非洲中部的内陆国家，首都班吉。' },
    { code: 'TD', name: '乍得', nameEn: 'Chad', capital: '恩贾梅纳', capitalEn: 'N\'Djamena', region: 'africa', continent: '非洲', population: 16425864, area: 1284000, currency: '中非法郎', currencyCode: 'XAF', language: '法语', flag: 'https://flagcdn.com/w320/td.png', description: '乍得共和国，简称乍得，是位于非洲中部的内陆国家，首都恩贾梅纳。' },
    { code: 'KM', name: '科摩罗', nameEn: 'Comoros', capital: '莫罗尼', capitalEn: 'Moroni', region: 'africa', continent: '非洲', population: 869601, area: 2235, currency: '科摩罗法郎', currencyCode: 'KMF', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/km.png', description: '科摩罗联盟，简称科摩罗，是位于印度洋的岛国，首都莫罗尼。' },
    { code: 'CG', name: '刚果（布）', nameEn: 'Republic of the Congo', capital: '布拉柴维尔', capitalEn: 'Brazzaville', region: 'africa', continent: '非洲', population: 5518087, area: 342000, currency: '中非法郎', currencyCode: 'XAF', language: '法语', flag: 'https://flagcdn.com/w320/cg.png', description: '刚果共和国，简称刚果（布），是位于非洲中西部的国家，首都布拉柴维尔。' },
    { code: 'CD', name: '刚果（金）', nameEn: 'Democratic Republic of the Congo', capital: '金沙萨', capitalEn: 'Kinshasa', region: 'africa', continent: '非洲', population: 89561403, area: 2344858, currency: '刚果法郎', currencyCode: 'CDF', language: '法语', flag: 'https://flagcdn.com/w320/cd.png', description: '刚果民主共和国，简称刚果（金），是位于非洲中部的国家，首都金沙萨。' },
    { code: 'CI', name: '科特迪瓦', nameEn: 'Ivory Coast', capital: '亚穆苏克罗', capitalEn: 'Yamoussoukro', region: 'africa', continent: '非洲', population: 26378274, area: 322463, currency: '西非法郎', currencyCode: 'XOF', language: '法语', flag: 'https://flagcdn.com/w320/ci.png', description: '科特迪瓦共和国，简称科特迪瓦，是位于非洲西部的国家，首都亚穆苏克罗。' },
    { code: 'DJ', name: '吉布提', nameEn: 'Djibouti', capital: '吉布提市', capitalEn: 'Djibouti City', region: 'africa', continent: '非洲', population: 988000, area: 23200, currency: '吉布提法郎', currencyCode: 'DJF', language: '法语', flag: 'https://flagcdn.com/w320/dj.png', description: '吉布提共和国，简称吉布提，是位于非洲东北部的国家，首都吉布提市。' },
    { code: 'EG', name: '埃及', nameEn: 'Egypt', capital: '开罗', capitalEn: 'Cairo', region: 'africa', continent: '非洲', population: 102334404, area: 1001450, currency: '埃及镑', currencyCode: 'EGP', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/eg.png', description: '阿拉伯埃及共和国，简称埃及，是位于非洲东北部的共和制国家，首都开罗。' },
    { code: 'GQ', name: '赤道几内亚', nameEn: 'Equatorial Guinea', capital: '马拉博', capitalEn: 'Malabo', region: 'africa', continent: '非洲', population: 1402985, area: 28051, currency: '中非法郎', currencyCode: 'XAF', language: '西班牙语', flag: 'https://flagcdn.com/w320/gq.png', description: '赤道几内亚共和国，简称赤道几内亚，是位于非洲中西部的国家，首都马拉博。' },
    { code: 'ER', name: '厄立特里亚', nameEn: 'Eritrea', capital: '阿斯马拉', capitalEn: 'Asmara', region: 'africa', continent: '非洲', population: 3546421, area: 117600, currency: '纳克法', currencyCode: 'ERN', language: '提格雷尼亚语', flag: 'https://flagcdn.com/w320/er.png', description: '厄立特里亚国，简称厄立特里亚，是位于非洲东北部的国家，首都阿斯马拉。' },
    { code: 'SZ', name: '斯威士兰', nameEn: 'Eswatini', capital: '姆巴巴纳', capitalEn: 'Mbabane', region: 'africa', continent: '非洲', population: 1160164, area: 17364, currency: '里兰吉尼', currencyCode: 'SZL', language: '英语', flag: 'https://flagcdn.com/w320/sz.png', description: '斯威士兰王国，简称斯威士兰，是位于非洲南部的内陆国家，首都姆巴巴纳。' },
    { code: 'ET', name: '埃塞俄比亚', nameEn: 'Ethiopia', capital: '亚的斯亚贝巴', capitalEn: 'Addis Ababa', region: 'africa', continent: '非洲', population: 114963588, area: 1104300, currency: '比尔', currencyCode: 'ETB', language: '阿姆哈拉语', flag: 'https://flagcdn.com/w320/et.png', description: '埃塞俄比亚联邦民主共和国，简称埃塞俄比亚，是位于非洲东部的内陆国家，首都亚的斯亚贝巴。' },
    { code: 'GA', name: '加蓬', nameEn: 'Gabon', capital: '利伯维尔', capitalEn: 'Libreville', region: 'africa', continent: '非洲', population: 2225734, area: 267668, currency: '中非法郎', currencyCode: 'XAF', language: '法语', flag: 'https://flagcdn.com/w320/ga.png', description: '加蓬共和国，简称加蓬，是位于非洲中西部的国家，首都利伯维尔。' },
    { code: 'GM', name: '冈比亚', nameEn: 'Gambia', capital: '班珠尔', capitalEn: 'Banjul', region: 'africa', continent: '非洲', population: 2416668, area: 11295, currency: '达拉西', currencyCode: 'GMD', language: '英语', flag: 'https://flagcdn.com/w320/gm.png', description: '冈比亚共和国，简称冈比亚，是位于非洲西部的国家，首都班珠尔。' },
    { code: 'GH', name: '加纳', nameEn: 'Ghana', capital: '阿克拉', capitalEn: 'Accra', region: 'africa', continent: '非洲', population: 31072940, area: 238533, currency: '塞地', currencyCode: 'GHS', language: '英语', flag: 'https://flagcdn.com/w320/gh.png', description: '加纳共和国，简称加纳，是位于非洲西部的国家，首都阿克拉。' },
    { code: 'GN', name: '几内亚', nameEn: 'Guinea', capital: '科纳克里', capitalEn: 'Conakry', region: 'africa', continent: '非洲', population: 13132795, area: 245857, currency: '几内亚法郎', currencyCode: 'GNF', language: '法语', flag: 'https://flagcdn.com/w320/gn.png', description: '几内亚共和国，简称几内亚，是位于非洲西部的国家，首都科纳克里。' },
    { code: 'GW', name: '几内亚比绍', nameEn: 'Guinea-Bissau', capital: '比绍', capitalEn: 'Bissau', region: 'africa', continent: '非洲', population: 1968001, area: 36125, currency: '西非法郎', currencyCode: 'XOF', language: '葡萄牙语', flag: 'https://flagcdn.com/w320/gw.png', description: '几内亚比绍共和国，简称几内亚比绍，是位于非洲西部的国家，首都比绍。' },
    { code: 'KE', name: '肯尼亚', nameEn: 'Kenya', capital: '内罗毕', capitalEn: 'Nairobi', region: 'africa', continent: '非洲', population: 53771296, area: 580367, currency: '肯尼亚先令', currencyCode: 'KES', language: '英语', flag: 'https://flagcdn.com/w320/ke.png', description: '肯尼亚共和国，简称肯尼亚，是位于非洲东部的国家，首都内罗毕。' },
    { code: 'LS', name: '莱索托', nameEn: 'Lesotho', capital: '马塞卢', capitalEn: 'Maseru', region: 'africa', continent: '非洲', population: 2142249, area: 30355, currency: '洛蒂', currencyCode: 'LSL', language: '英语', flag: 'https://flagcdn.com/w320/ls.png', description: '莱索托王国，简称莱索托，是位于非洲南部的内陆国家，首都马塞卢。' },
    { code: 'LR', name: '利比里亚', nameEn: 'Liberia', capital: '蒙罗维亚', capitalEn: 'Monrovia', region: 'africa', continent: '非洲', population: 5057681, area: 111369, currency: '利比里亚元', currencyCode: 'LRD', language: '英语', flag: 'https://flagcdn.com/w320/lr.png', description: '利比里亚共和国，简称利比里亚，是位于非洲西部的国家，首都蒙罗维亚。' },
    { code: 'LY', name: '利比亚', nameEn: 'Libya', capital: '的黎波里', capitalEn: 'Tripoli', region: 'africa', continent: '非洲', population: 6871292, area: 1759540, currency: '第纳尔', currencyCode: 'LYD', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/ly.png', description: '利比亚国，简称利比亚，是位于非洲北部的国家，首都的黎波里。' },
    { code: 'MG', name: '马达加斯加', nameEn: 'Madagascar', capital: '塔那那利佛', capitalEn: 'Antananarivo', region: 'africa', continent: '非洲', population: 27691018, area: 587041, currency: '阿里亚里', currencyCode: 'MGA', language: '马达加斯加语', flag: 'https://flagcdn.com/w320/mg.png', description: '马达加斯加共和国，简称马达加斯加，是位于印度洋的岛国，首都塔那那利佛。' },
    { code: 'MW', name: '马拉维', nameEn: 'Malawi', capital: '利隆圭', capitalEn: 'Lilongwe', region: 'africa', continent: '非洲', population: 19129952, area: 118484, currency: '克瓦查', currencyCode: 'MWK', language: '英语', flag: 'https://flagcdn.com/w320/mw.png', description: '马拉维共和国，简称马拉维，是位于非洲东南部的内陆国家，首都利隆圭。' },
    { code: 'ML', name: '马里', nameEn: 'Mali', capital: '巴马科', capitalEn: 'Bamako', region: 'africa', continent: '非洲', population: 20250833, area: 1240192, currency: '西非法郎', currencyCode: 'XOF', language: '法语', flag: 'https://flagcdn.com/w320/ml.png', description: '马里共和国，简称马里，是位于非洲西部的内陆国家，首都巴马科。' },
    { code: 'MR', name: '毛里塔尼亚', nameEn: 'Mauritania', capital: '努瓦克肖特', capitalEn: 'Nouakchott', region: 'africa', continent: '非洲', population: 4649658, area: 1030700, currency: '乌吉亚', currencyCode: 'MRU', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/mr.png', description: '毛里塔尼亚伊斯兰共和国，简称毛里塔尼亚，是位于非洲西北部的国家，首都努瓦克肖特。' },
    { code: 'MU', name: '毛里求斯', nameEn: 'Mauritius', capital: '路易港', capitalEn: 'Port Louis', region: 'africa', continent: '非洲', population: 1271768, area: 2040, currency: '毛里求斯卢比', currencyCode: 'MUR', language: '英语', flag: 'https://flagcdn.com/w320/mu.png', description: '毛里求斯共和国，简称毛里求斯，是位于印度洋的岛国，首都路易港。' },
    { code: 'MA', name: '摩洛哥', nameEn: 'Morocco', capital: '拉巴特', capitalEn: 'Rabat', region: 'africa', continent: '非洲', population: 36910560, area: 446550, currency: '迪拉姆', currencyCode: 'MAD', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/ma.png', description: '摩洛哥王国，简称摩洛哥，是位于非洲西北部的国家，首都拉巴特。' },
    { code: 'MZ', name: '莫桑比克', nameEn: 'Mozambique', capital: '马普托', capitalEn: 'Maputo', region: 'africa', continent: '非洲', population: 31255435, area: 801590, currency: '梅蒂卡尔', currencyCode: 'MZN', language: '葡萄牙语', flag: 'https://flagcdn.com/w320/mz.png', description: '莫桑比克共和国，简称莫桑比克，是位于非洲东南部的国家，首都马普托。' },
    { code: 'NA', name: '纳米比亚', nameEn: 'Namibia', capital: '温得和克', capitalEn: 'Windhoek', region: 'africa', continent: '非洲', population: 2540905, area: 824292, currency: '纳米比亚元', currencyCode: 'NAD', language: '英语', flag: 'https://flagcdn.com/w320/na.png', description: '纳米比亚共和国，简称纳米比亚，是位于非洲西南部的国家，首都温得和克。' },
    { code: 'NE', name: '尼日尔', nameEn: 'Niger', capital: '尼亚美', capitalEn: 'Niamey', region: 'africa', continent: '非洲', population: 24206644, area: 1267000, currency: '西非法郎', currencyCode: 'XOF', language: '法语', flag: 'https://flagcdn.com/w320/ne.png', description: '尼日尔共和国，简称尼日尔，是位于非洲西部的内陆国家，首都尼亚美。' },
    { code: 'NG', name: '尼日利亚', nameEn: 'Nigeria', capital: '阿布贾', capitalEn: 'Abuja', region: 'africa', continent: '非洲', population: 206139589, area: 923768, currency: '奈拉', currencyCode: 'NGN', language: '英语', flag: 'https://flagcdn.com/w320/ng.png', description: '尼日利亚联邦共和国，简称尼日利亚，是位于非洲西部的国家，首都阿布贾。' },
    { code: 'RW', name: '卢旺达', nameEn: 'Rwanda', capital: '基加利', capitalEn: 'Kigali', region: 'africa', continent: '非洲', population: 12952218, area: 26338, currency: '卢旺达法郎', currencyCode: 'RWF', language: '卢旺达语', flag: 'https://flagcdn.com/w320/rw.png', description: '卢旺达共和国，简称卢旺达，是位于非洲中东部的内陆国家，首都基加利。' },
    { code: 'ST', name: '圣多美和普林西比', nameEn: 'Sao Tome and Principe', capital: '圣多美', capitalEn: 'Sao Tome', region: 'africa', continent: '非洲', population: 219159, area: 964, currency: '多布拉', currencyCode: 'STN', language: '葡萄牙语', flag: 'https://flagcdn.com/w320/st.png', description: '圣多美和普林西比民主共和国，简称圣多美和普林西比，是位于几内亚湾的岛国，首都圣多美。' },
    { code: 'SN', name: '塞内加尔', nameEn: 'Senegal', capital: '达喀尔', capitalEn: 'Dakar', region: 'africa', continent: '非洲', population: 16743927, area: 196722, currency: '西非法郎', currencyCode: 'XOF', language: '法语', flag: 'https://flagcdn.com/w320/sn.png', description: '塞内加尔共和国，简称塞内加尔，是位于非洲西部的国家，首都达喀尔。' },
    { code: 'SC', name: '塞舌尔', nameEn: 'Seychelles', capital: '维多利亚', capitalEn: 'Victoria', region: 'africa', continent: '非洲', population: 98347, area: 455, currency: '塞舌尔卢比', currencyCode: 'SCR', language: '英语', flag: 'https://flagcdn.com/w320/sc.png', description: '塞舌尔共和国，简称塞舌尔，是位于印度洋的岛国，首都维多利亚。' },
    { code: 'SL', name: '塞拉利昂', nameEn: 'Sierra Leone', capital: '弗里敦', capitalEn: 'Freetown', region: 'africa', continent: '非洲', population: 7976983, area: 71740, currency: '利昂', currencyCode: 'SLL', language: '英语', flag: 'https://flagcdn.com/w320/sl.png', description: '塞拉利昂共和国，简称塞拉利昂，是位于非洲西部的国家，首都弗里敦。' },
    { code: 'SO', name: '索马里', nameEn: 'Somalia', capital: '摩加迪沙', capitalEn: 'Mogadishu', region: 'africa', continent: '非洲', population: 15893222, area: 637657, currency: '索马里先令', currencyCode: 'SOS', language: '索马里语', flag: 'https://flagcdn.com/w320/so.png', description: '索马里联邦共和国，简称索马里，是位于非洲东部的国家，首都摩加迪沙。' },
    { code: 'ZA', name: '南非', nameEn: 'South Africa', capital: '开普敦', capitalEn: 'Cape Town', region: 'africa', continent: '非洲', population: 59308690, area: 1221037, currency: '兰特', currencyCode: 'ZAR', language: '英语', flag: 'https://flagcdn.com/w320/za.png', description: '南非共和国，简称南非，是位于非洲南部的共和制国家，首都开普敦。' },
    { code: 'SS', name: '南苏丹', nameEn: 'South Sudan', capital: '朱巴', capitalEn: 'Juba', region: 'africa', continent: '非洲', population: 11193725, area: 644329, currency: '南苏丹镑', currencyCode: 'SSP', language: '英语', flag: 'https://flagcdn.com/w320/ss.png', description: '南苏丹共和国，简称南苏丹，是位于非洲东北部的内陆国家，首都朱巴。' },
    { code: 'SD', name: '苏丹', nameEn: 'Sudan', capital: '喀土穆', capitalEn: 'Khartoum', region: 'africa', continent: '非洲', population: 43849260, area: 1861484, currency: '苏丹镑', currencyCode: 'SDG', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/sd.png', description: '苏丹共和国，简称苏丹，是位于非洲东北部的国家，首都喀土穆。' },
    { code: 'TZ', name: '坦桑尼亚', nameEn: 'Tanzania', capital: '多多马', capitalEn: 'Dodoma', region: 'africa', continent: '非洲', population: 59734218, area: 947303, currency: '坦桑尼亚先令', currencyCode: 'TZS', language: '斯瓦希里语', flag: 'https://flagcdn.com/w320/tz.png', description: '坦桑尼亚联合共和国，简称坦桑尼亚，是位于非洲东部的国家，首都多多马。' },
    { code: 'TG', name: '多哥', nameEn: 'Togo', capital: '洛美', capitalEn: 'Lome', region: 'africa', continent: '非洲', population: 8278724, area: 56785, currency: '西非法郎', currencyCode: 'XOF', language: '法语', flag: 'https://flagcdn.com/w320/tg.png', description: '多哥共和国，简称多哥，是位于非洲西部的国家，首都洛美。' },
    { code: 'TN', name: '突尼斯', nameEn: 'Tunisia', capital: '突尼斯市', capitalEn: 'Tunis', region: 'africa', continent: '非洲', population: 11818619, area: 163610, currency: '第纳尔', currencyCode: 'TND', language: '阿拉伯语', flag: 'https://flagcdn.com/w320/tn.png', description: '突尼斯共和国，简称突尼斯，是位于非洲北部的国家，首都突尼斯市。' },
    { code: 'UG', name: '乌干达', nameEn: 'Uganda', capital: '坎帕拉', capitalEn: 'Kampala', region: 'africa', continent: '非洲', population: 45741007, area: 241038, currency: '乌干达先令', currencyCode: 'UGX', language: '英语', flag: 'https://flagcdn.com/w320/ug.png', description: '乌干达共和国，简称乌干达，是位于非洲东部的内陆国家，首都坎帕拉。' },
    { code: 'ZM', name: '赞比亚', nameEn: 'Zambia', capital: '卢萨卡', capitalEn: 'Lusaka', region: 'africa', continent: '非洲', population: 18383955, area: 752618, currency: '克瓦查', currencyCode: 'ZMW', language: '英语', flag: 'https://flagcdn.com/w320/zm.png', description: '赞比亚共和国，简称赞比亚，是位于非洲南部的内陆国家，首都卢萨卡。' },
    { code: 'ZW', name: '津巴布韦', nameEn: 'Zimbabwe', capital: '哈拉雷', capitalEn: 'Harare', region: 'africa', continent: '非洲', population: 14862924, area: 390757, currency: '美元', currencyCode: 'USD', language: '英语', flag: 'https://flagcdn.com/w320/zw.png', description: '津巴布韦共和国，简称津巴布韦，是位于非洲南部的内陆国家，首都哈拉雷。' },
    
    // 北美洲国家
    { code: 'US', name: '美国', nameEn: 'United States', capital: '华盛顿', capitalEn: 'Washington D.C.', region: 'north-america', continent: '北美洲', population: 331002651, area: 9833517, currency: '美元', currencyCode: 'USD', language: '英语', flag: 'https://flagcdn.com/w320/us.png', description: '美利坚合众国，简称美国，是位于北美洲的联邦共和制国家，首都华盛顿哥伦比亚特区。' },
    { code: 'CA', name: '加拿大', nameEn: 'Canada', capital: '渥太华', capitalEn: 'Ottawa', region: 'north-america', continent: '北美洲', population: 37742154, area: 9984670, currency: '加元', currencyCode: 'CAD', language: '英语', flag: 'https://flagcdn.com/w320/ca.png', description: '加拿大，是位于北美洲北部的联邦制国家，首都渥太华。' },
    { code: 'MX', name: '墨西哥', nameEn: 'Mexico', capital: '墨西哥城', capitalEn: 'Mexico City', region: 'north-america', continent: '北美洲', population: 128932753, area: 1964375, currency: '比索', currencyCode: 'MXN', language: '西班牙语', flag: 'https://flagcdn.com/w320/mx.png', description: '墨西哥合众国，简称墨西哥，是位于北美洲南部的联邦制国家，首都墨西哥城。' },
    { code: 'AG', name: '安提瓜和巴布达', nameEn: 'Antigua and Barbuda', capital: '圣约翰', capitalEn: 'Saint John\'s', region: 'north-america', continent: '北美洲', population: 97929, area: 442, currency: '东加勒比元', currencyCode: 'XCD', language: '英语', flag: 'https://flagcdn.com/w320/ag.png', description: '安提瓜和巴布达，是位于加勒比海的岛国，首都圣约翰。' },
    { code: 'BS', name: '巴哈马', nameEn: 'Bahamas', capital: '拿骚', capitalEn: 'Nassau', region: 'north-america', continent: '北美洲', population: 393244, area: 13943, currency: '巴哈马元', currencyCode: 'BSD', language: '英语', flag: 'https://flagcdn.com/w320/bs.png', description: '巴哈马联邦，简称巴哈马，是位于大西洋的岛国，首都拿骚。' },
    { code: 'BB', name: '巴巴多斯', nameEn: 'Barbados', capital: '布里奇敦', capitalEn: 'Bridgetown', region: 'north-america', continent: '北美洲', population: 287375, area: 430, currency: '巴巴多斯元', currencyCode: 'BBD', language: '英语', flag: 'https://flagcdn.com/w320/bb.png', description: '巴巴多斯，是位于加勒比海的岛国，首都布里奇敦。' },
    { code: 'BZ', name: '伯利兹', nameEn: 'Belize', capital: '贝尔莫潘', capitalEn: 'Belmopan', region: 'north-america', continent: '北美洲', population: 397628, area: 22966, currency: '伯利兹元', currencyCode: 'BZD', language: '英语', flag: 'https://flagcdn.com/w320/bz.png', description: '伯利兹，是位于中美洲的国家，首都贝尔莫潘。' },
    { code: 'CR', name: '哥斯达黎加', nameEn: 'Costa Rica', capital: '圣何塞', capitalEn: 'San Jose', region: 'north-america', continent: '北美洲', population: 5094118, area: 51100, currency: '科朗', currencyCode: 'CRC', language: '西班牙语', flag: 'https://flagcdn.com/w320/cr.png', description: '哥斯达黎加共和国，简称哥斯达黎加，是位于中美洲的国家，首都圣何塞。' },
    { code: 'CU', name: '古巴', nameEn: 'Cuba', capital: '哈瓦那', capitalEn: 'Havana', region: 'north-america', continent: '北美洲', population: 11326616, area: 109884, currency: '比索', currencyCode: 'CUP', language: '西班牙语', flag: 'https://flagcdn.com/w320/cu.png', description: '古巴共和国，简称古巴，是位于加勒比海的岛国，首都哈瓦那。' },
    { code: 'DM', name: '多米尼克', nameEn: 'Dominica', capital: '罗索', capitalEn: 'Roseau', region: 'north-america', continent: '北美洲', population: 71986, area: 751, currency: '东加勒比元', currencyCode: 'XCD', language: '英语', flag: 'https://flagcdn.com/w320/dm.png', description: '多米尼克联邦，简称多米尼克，是位于加勒比海的岛国，首都罗索。' },
    { code: 'DO', name: '多米尼加', nameEn: 'Dominican Republic', capital: '圣多明各', capitalEn: 'Santo Domingo', region: 'north-america', continent: '北美洲', population: 10847910, area: 48671, currency: '比索', currencyCode: 'DOP', language: '西班牙语', flag: 'https://flagcdn.com/w320/do.png', description: '多米尼加共和国，简称多米尼加，是位于加勒比海的国家，首都圣多明各。' },
    { code: 'SV', name: '萨尔瓦多', nameEn: 'El Salvador', capital: '圣萨尔瓦多', capitalEn: 'San Salvador', region: 'north-america', continent: '北美洲', population: 6486205, area: 21041, currency: '美元', currencyCode: 'USD', language: '西班牙语', flag: 'https://flagcdn.com/w320/sv.png', description: '萨尔瓦多共和国，简称萨尔瓦多，是位于中美洲的国家，首都圣萨尔瓦多。' },
    { code: 'GD', name: '格林纳达', nameEn: 'Grenada', capital: '圣乔治', capitalEn: 'Saint George\'s', region: 'north-america', continent: '北美洲', population: 112523, area: 344, currency: '东加勒比元', currencyCode: 'XCD', language: '英语', flag: 'https://flagcdn.com/w320/gd.png', description: '格林纳达，是位于加勒比海的岛国，首都圣乔治。' },
    { code: 'GT', name: '危地马拉', nameEn: 'Guatemala', capital: '危地马拉城', capitalEn: 'Guatemala City', region: 'north-america', continent: '北美洲', population: 17915568, area: 108889, currency: '格查尔', currencyCode: 'GTQ', language: '西班牙语', flag: 'https://flagcdn.com/w320/gt.png', description: '危地马拉共和国，简称危地马拉，是位于中美洲的国家，首都危地马拉城。' },
    { code: 'HT', name: '海地', nameEn: 'Haiti', capital: '太子港', capitalEn: 'Port-au-Prince', region: 'north-america', continent: '北美洲', population: 11402528, area: 27750, currency: '古德', currencyCode: 'HTG', language: '法语', flag: 'https://flagcdn.com/w320/ht.png', description: '海地共和国，简称海地，是位于加勒比海的国家，首都太子港。' },
    { code: 'HN', name: '洪都拉斯', nameEn: 'Honduras', capital: '特古西加尔巴', capitalEn: 'Tegucigalpa', region: 'north-america', continent: '北美洲', population: 9904607, area: 112492, currency: '伦皮拉', currencyCode: 'HNL', language: '西班牙语', flag: 'https://flagcdn.com/w320/hn.png', description: '洪都拉斯共和国，简称洪都拉斯，是位于中美洲的国家，首都特古西加尔巴。' },
    { code: 'JM', name: '牙买加', nameEn: 'Jamaica', capital: '金斯敦', capitalEn: 'Kingston', region: 'north-america', continent: '北美洲', population: 2961167, area: 10991, currency: '牙买加元', currencyCode: 'JMD', language: '英语', flag: 'https://flagcdn.com/w320/jm.png', description: '牙买加，是位于加勒比海的岛国，首都金斯敦。' },
    { code: 'NI', name: '尼加拉瓜', nameEn: 'Nicaragua', capital: '马那瓜', capitalEn: 'Managua', region: 'north-america', continent: '北美洲', population: 6624554, area: 130373, currency: '科多巴', currencyCode: 'NIO', language: '西班牙语', flag: 'https://flagcdn.com/w320/ni.png', description: '尼加拉瓜共和国，简称尼加拉瓜，是位于中美洲的国家，首都马那瓜。' },
    { code: 'PA', name: '巴拿马', nameEn: 'Panama', capital: '巴拿马城', capitalEn: 'Panama City', region: 'north-america', continent: '北美洲', population: 4314767, area: 75417, currency: '巴波亚', currencyCode: 'PAB', language: '西班牙语', flag: 'https://flagcdn.com/w320/pa.png', description: '巴拿马共和国，简称巴拿马，是位于中美洲的国家，首都巴拿马城。' },
    { code: 'KN', name: '圣基茨和尼维斯', nameEn: 'Saint Kitts and Nevis', capital: '巴斯特尔', capitalEn: 'Basseterre', region: 'north-america', continent: '北美洲', population: 53199, area: 261, currency: '东加勒比元', currencyCode: 'XCD', language: '英语', flag: 'https://flagcdn.com/w320/kn.png', description: '圣基茨和尼维斯联邦，简称圣基茨和尼维斯，是位于加勒比海的岛国，首都巴斯特尔。' },
    { code: 'LC', name: '圣卢西亚', nameEn: 'Saint Lucia', capital: '卡斯特里', capitalEn: 'Castries', region: 'north-america', continent: '北美洲', population: 183627, area: 616, currency: '东加勒比元', currencyCode: 'XCD', language: '英语', flag: 'https://flagcdn.com/w320/lc.png', description: '圣卢西亚，是位于加勒比海的岛国，首都卡斯特里。' },
    { code: 'VC', name: '圣文森特和格林纳丁斯', nameEn: 'Saint Vincent and the Grenadines', capital: '金斯敦', capitalEn: 'Kingstown', region: 'north-america', continent: '北美洲', population: 110940, area: 389, currency: '东加勒比元', currencyCode: 'XCD', language: '英语', flag: 'https://flagcdn.com/w320/vc.png', description: '圣文森特和格林纳丁斯，是位于加勒比海的岛国，首都金斯敦。' },
    { code: 'TT', name: '特立尼达和多巴哥', nameEn: 'Trinidad and Tobago', capital: '西班牙港', capitalEn: 'Port of Spain', region: 'north-america', continent: '北美洲', population: 1399488, area: 5128, currency: '特立尼达和多巴哥元', currencyCode: 'TTD', language: '英语', flag: 'https://flagcdn.com/w320/tt.png', description: '特立尼达和多巴哥共和国，简称特立尼达和多巴哥，是位于加勒比海的岛国，首都西班牙港。' },
    
    // 南美洲国家
    { code: 'BR', name: '巴西', nameEn: 'Brazil', capital: '巴西利亚', capitalEn: 'Brasília', region: 'south-america', continent: '南美洲', population: 212559417, area: 8514877, currency: '雷亚尔', currencyCode: 'BRL', language: '葡萄牙语', flag: 'https://flagcdn.com/w320/br.png', description: '巴西联邦共和国，简称巴西，是位于南美洲的联邦制国家，首都巴西利亚。' },
    { code: 'AR', name: '阿根廷', nameEn: 'Argentina', capital: '布宜诺斯艾利斯', capitalEn: 'Buenos Aires', region: 'south-america', continent: '南美洲', population: 45195774, area: 2780400, currency: '比索', currencyCode: 'ARS', language: '西班牙语', flag: 'https://flagcdn.com/w320/ar.png', description: '阿根廷共和国，简称阿根廷，是位于南美洲南部的联邦制国家，首都布宜诺斯艾利斯。' },
    { code: 'BO', name: '玻利维亚', nameEn: 'Bolivia', capital: '苏克雷', capitalEn: 'Sucre', region: 'south-america', continent: '南美洲', population: 11673021, area: 1098581, currency: '玻利维亚诺', currencyCode: 'BOB', language: '西班牙语', flag: 'https://flagcdn.com/w320/bo.png', description: '玻利维亚多民族国，简称玻利维亚，是位于南美洲中部的内陆国家，首都苏克雷。' },
    { code: 'CL', name: '智利', nameEn: 'Chile', capital: '圣地亚哥', capitalEn: 'Santiago', region: 'south-america', continent: '南美洲', population: 19116201, area: 756096, currency: '比索', currencyCode: 'CLP', language: '西班牙语', flag: 'https://flagcdn.com/w320/cl.png', description: '智利共和国，简称智利，是位于南美洲西部的国家，首都圣地亚哥。' },
    { code: 'CO', name: '哥伦比亚', nameEn: 'Colombia', capital: '波哥大', capitalEn: 'Bogota', region: 'south-america', continent: '南美洲', population: 50882891, area: 1141748, currency: '比索', currencyCode: 'COP', language: '西班牙语', flag: 'https://flagcdn.com/w320/co.png', description: '哥伦比亚共和国，简称哥伦比亚，是位于南美洲西北部的国家，首都波哥大。' },
    { code: 'EC', name: '厄瓜多尔', nameEn: 'Ecuador', capital: '基多', capitalEn: 'Quito', region: 'south-america', continent: '南美洲', population: 17643054, area: 283561, currency: '美元', currencyCode: 'USD', language: '西班牙语', flag: 'https://flagcdn.com/w320/ec.png', description: '厄瓜多尔共和国，简称厄瓜多尔，是位于南美洲西北部的国家，首都基多。' },
    { code: 'GY', name: '圭亚那', nameEn: 'Guyana', capital: '乔治敦', capitalEn: 'Georgetown', region: 'south-america', continent: '南美洲', population: 786552, area: 214969, currency: '圭亚那元', currencyCode: 'GYD', language: '英语', flag: 'https://flagcdn.com/w320/gy.png', description: '圭亚那合作共和国，简称圭亚那，是位于南美洲北部的国家，首都乔治敦。' },
    { code: 'PY', name: '巴拉圭', nameEn: 'Paraguay', capital: '亚松森', capitalEn: 'Asuncion', region: 'south-america', continent: '南美洲', population: 7132538, area: 406752, currency: '瓜拉尼', currencyCode: 'PYG', language: '西班牙语', flag: 'https://flagcdn.com/w320/py.png', description: '巴拉圭共和国，简称巴拉圭，是位于南美洲中部的内陆国家，首都亚松森。' },
    { code: 'PE', name: '秘鲁', nameEn: 'Peru', capital: '利马', capitalEn: 'Lima', region: 'south-america', continent: '南美洲', population: 32971854, area: 1285216, currency: '索尔', currencyCode: 'PEN', language: '西班牙语', flag: 'https://flagcdn.com/w320/pe.png', description: '秘鲁共和国，简称秘鲁，是位于南美洲西部的国家，首都利马。' },
    { code: 'SR', name: '苏里南', nameEn: 'Suriname', capital: '帕拉马里博', capitalEn: 'Paramaribo', region: 'south-america', continent: '南美洲', population: 586632, area: 163820, currency: '苏里南元', currencyCode: 'SRD', language: '荷兰语', flag: 'https://flagcdn.com/w320/sr.png', description: '苏里南共和国，简称苏里南，是位于南美洲北部的国家，首都帕拉马里博。' },
    { code: 'UY', name: '乌拉圭', nameEn: 'Uruguay', capital: '蒙得维的亚', capitalEn: 'Montevideo', region: 'south-america', continent: '南美洲', population: 3473730, area: 176215, currency: '比索', currencyCode: 'UYU', language: '西班牙语', flag: 'https://flagcdn.com/w320/uy.png', description: '乌拉圭东岸共和国，简称乌拉圭，是位于南美洲东南部的国家，首都蒙得维的亚。' },
    { code: 'VE', name: '委内瑞拉', nameEn: 'Venezuela', capital: '加拉加斯', capitalEn: 'Caracas', region: 'south-america', continent: '南美洲', population: 28435940, area: 912050, currency: '玻利瓦尔', currencyCode: 'VES', language: '西班牙语', flag: 'https://flagcdn.com/w320/ve.png', description: '委内瑞拉玻利瓦尔共和国，简称委内瑞拉，是位于南美洲北部的国家，首都加拉加斯。' },
    
    // 大洋洲国家
    { code: 'AU', name: '澳大利亚', nameEn: 'Australia', capital: '堪培拉', capitalEn: 'Canberra', region: 'oceania', continent: '大洋洲', population: 25499884, area: 7692024, currency: '澳元', currencyCode: 'AUD', language: '英语', flag: 'https://flagcdn.com/w320/au.png', description: '澳大利亚联邦，简称澳大利亚，是位于大洋洲的联邦制国家，首都堪培拉。' },
    { code: 'NZ', name: '新西兰', nameEn: 'New Zealand', capital: '惠灵顿', capitalEn: 'Wellington', region: 'oceania', continent: '大洋洲', population: 4822233, area: 268838, currency: '新西兰元', currencyCode: 'NZD', language: '英语', flag: 'https://flagcdn.com/w320/nz.png', description: '新西兰，是位于大洋洲的岛国，首都惠灵顿。' },
    { code: 'FJ', name: '斐济', nameEn: 'Fiji', capital: '苏瓦', capitalEn: 'Suva', region: 'oceania', continent: '大洋洲', population: 896445, area: 18274, currency: '斐济元', currencyCode: 'FJD', language: '英语', flag: 'https://flagcdn.com/w320/fj.png', description: '斐济共和国，简称斐济，是位于南太平洋的岛国，首都苏瓦。' },
    { code: 'KI', name: '基里巴斯', nameEn: 'Kiribati', capital: '塔拉瓦', capitalEn: 'Tarawa', region: 'oceania', continent: '大洋洲', population: 119449, area: 811, currency: '澳元', currencyCode: 'AUD', language: '英语', flag: 'https://flagcdn.com/w320/ki.png', description: '基里巴斯共和国，简称基里巴斯，是位于太平洋的岛国，首都塔拉瓦。' },
    { code: 'MH', name: '马绍尔群岛', nameEn: 'Marshall Islands', capital: '马朱罗', capitalEn: 'Majuro', region: 'oceania', continent: '大洋洲', population: 59190, area: 181, currency: '美元', currencyCode: 'USD', language: '英语', flag: 'https://flagcdn.com/w320/mh.png', description: '马绍尔群岛共和国，简称马绍尔群岛，是位于太平洋的岛国，首都马朱罗。' },
    { code: 'FM', name: '密克罗尼西亚', nameEn: 'Micronesia', capital: '帕利基尔', capitalEn: 'Palikir', region: 'oceania', continent: '大洋洲', population: 115023, area: 702, currency: '美元', currencyCode: 'USD', language: '英语', flag: 'https://flagcdn.com/w320/fm.png', description: '密克罗尼西亚联邦，简称密克罗尼西亚，是位于太平洋的岛国，首都帕利基尔。' },
    { code: 'NR', name: '瑙鲁', nameEn: 'Nauru', capital: '亚伦', capitalEn: 'Yaren', region: 'oceania', continent: '大洋洲', population: 10824, area: 21, currency: '澳元', currencyCode: 'AUD', language: '英语', flag: 'https://flagcdn.com/w320/nr.png', description: '瑙鲁共和国，简称瑙鲁，是位于太平洋的岛国，首都亚伦。' },
    { code: 'PW', name: '帕劳', nameEn: 'Palau', capital: '恩吉鲁穆德', capitalEn: 'Ngerulmud', region: 'oceania', continent: '大洋洲', population: 18094, area: 459, currency: '美元', currencyCode: 'USD', language: '英语', flag: 'https://flagcdn.com/w320/pw.png', description: '帕劳共和国，简称帕劳，是位于太平洋的岛国，首都恩吉鲁穆德。' },
    { code: 'PG', name: '巴布亚新几内亚', nameEn: 'Papua New Guinea', capital: '莫尔兹比港', capitalEn: 'Port Moresby', region: 'oceania', continent: '大洋洲', population: 8947024, area: 462840, currency: '基那', currencyCode: 'PGK', language: '英语', flag: 'https://flagcdn.com/w320/pg.png', description: '巴布亚新几内亚独立国，简称巴布亚新几内亚，是位于太平洋的岛国，首都莫尔兹比港。' },
    { code: 'WS', name: '萨摩亚', nameEn: 'Samoa', capital: '阿皮亚', capitalEn: 'Apia', region: 'oceania', continent: '大洋洲', population: 198414, area: 2831, currency: '塔拉', currencyCode: 'WST', language: '英语', flag: 'https://flagcdn.com/w320/ws.png', description: '萨摩亚独立国，简称萨摩亚，是位于太平洋的岛国，首都阿皮亚。' },
    { code: 'SB', name: '所罗门群岛', nameEn: 'Solomon Islands', capital: '霍尼亚拉', capitalEn: 'Honiara', region: 'oceania', continent: '大洋洲', population: 686884, area: 28896, currency: '所罗门群岛元', currencyCode: 'SBD', language: '英语', flag: 'https://flagcdn.com/w320/sb.png', description: '所罗门群岛，是位于太平洋的岛国，首都霍尼亚拉。' },
    { code: 'TO', name: '汤加', nameEn: 'Tonga', capital: '努库阿洛法', capitalEn: 'Nuku\'alofa', region: 'oceania', continent: '大洋洲', population: 105695, area: 747, currency: '潘加', currencyCode: 'TOP', language: '英语', flag: 'https://flagcdn.com/w320/to.png', description: '汤加王国，简称汤加，是位于太平洋的岛国，首都努库阿洛法。' },
    { code: 'TV', name: '图瓦卢', nameEn: 'Tuvalu', capital: '富纳富提', capitalEn: 'Funafuti', region: 'oceania', continent: '大洋洲', population: 11792, area: 26, currency: '澳元', currencyCode: 'AUD', language: '英语', flag: 'https://flagcdn.com/w320/tv.png', description: '图瓦卢，是位于太平洋的岛国，首都富纳富提。' },
    { code: 'VU', name: '瓦努阿图', nameEn: 'Vanuatu', capital: '维拉港', capitalEn: 'Port Vila', region: 'oceania', continent: '大洋洲', population: 307145, area: 12189, currency: '瓦图', currencyCode: 'VUV', language: '英语', flag: 'https://flagcdn.com/w320/vu.png', description: '瓦努阿图共和国，简称瓦努阿图，是位于太平洋的岛国，首都维拉港。' }
])

// 发达国家列表（基于联合国和世界银行分类）
const developedCountries = [
    'US', 'CA', 'GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'CH', 'AT', 'SE', 'NO', 'DK', 'FI', 'IS', 'IE', 'LU', 'PT', 'GR', 'CY', 'MT',
    'JP', 'KR', 'AU', 'NZ', 'SG', 'IL', 'CZ', 'SK', 'SI', 'EE', 'LV', 'LT', 'PL', 'HU'
]

// 计算属性
const filteredCountries = computed(() => {
    let filtered = countriesData.value

    // 地区筛选
    if (selectedRegion.value !== 'all') {
        filtered = filtered.filter(country => country.region === selectedRegion.value)
    }

    // 搜索筛选
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        filtered = filtered.filter(country =>
            country.name.toLowerCase().includes(query) ||
            country.nameEn.toLowerCase().includes(query) ||
            country.capital.toLowerCase().includes(query) ||
            country.capitalEn.toLowerCase().includes(query)
        )
    }

    // 人口规模筛选
    if (selectedPopulation.value !== 'all') {
        filtered = filtered.filter(country => {
            const population = country.population
            switch (selectedPopulation.value) {
                case 'large': return population > 100000000
                case 'medium': return population >= 10000000 && population <= 100000000
                case 'small': return population < 10000000
                default: return true
            }
        })
    }

    // 国土面积筛选
    if (selectedArea.value !== 'all') {
        filtered = filtered.filter(country => {
            const area = country.area
            switch (selectedArea.value) {
                case 'huge': return area > 5000000
                case 'large': return area >= 1000000 && area <= 5000000
                case 'medium': return area >= 100000 && area < 1000000
                case 'small': return area < 100000
                default: return true
            }
        })
    }

    // 发展水平筛选
    if (selectedDevelopment.value !== 'all') {
        filtered = filtered.filter(country => {
            const isDeveloped = developedCountries.includes(country.code)
            return selectedDevelopment.value === 'developed' ? isDeveloped : !isDeveloped
        })
    }

    // 排序
    if (sortBy.value !== 'name') {
        filtered.sort((a, b) => {
            let valueA: number | string, valueB: number | string
            switch (sortBy.value) {
                case 'population':
                    valueA = a.population
                    valueB = b.population
                    break
                case 'area':
                    valueA = a.area
                    valueB = b.area
                    break
                default:
                    valueA = a.name
                    valueB = b.name
            }

            if (typeof valueA === 'number' && typeof valueB === 'number') {
                return sortOrder.value === 'desc' ? valueB - valueA : valueA - valueB
            } else {
                const strA = String(valueA)
                const strB = String(valueB)
                return sortOrder.value === 'desc' ? strB.localeCompare(strA) : strA.localeCompare(strB)
            }
        })
    } else {
        // 按名称排序
        filtered.sort((a, b) => {
            return sortOrder.value === 'desc' 
                ? b.name.localeCompare(a.name)
                : a.name.localeCompare(b.name)
        })
    }

    return filtered
})

const totalPages = computed(() => Math.ceil(filteredCountries.value.length / pageSize))

const paginatedCountries = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return filteredCountries.value.slice(start, end)
})

// 方法
const getRegionName = (regionKey: string) => {
    const region = regions.value.find((r: any) => r.key === regionKey)
    return region ? region.name : regionKey
}

const getRegionCount = (regionKey: string) => {
    if (regionKey === 'all') return countriesData.value.length
    return countriesData.value.filter(country => country.region === regionKey).length
}

const getSectionTitle = () => {
    if (selectedRegion.value === 'all') {
        return searchQuery.value ? `搜索结果` : '世界各国'
    }
    return getRegionName(selectedRegion.value)
}

const formatPopulation = (population: number) => {
    if (population >= 100000000) {
        return `${(population / 100000000).toFixed(1)}亿`
    } else if (population >= 10000) {
        return `${(population / 10000).toFixed(1)}万`
    }
    return population.toLocaleString()
}

const formatArea = (area: number) => {
    return `${area.toLocaleString()} km²`
}

const showCountryDetail = (country: Country) => {
    selectedCountry.value = country
    showModal.value = true
}

const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxMkwyNCAxOE0yNCAxMkwxNiAxOCIgc3Ryb2tlPSIjOUI5QkEwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K'
}

const toggleSortOrder = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// 监听搜索和筛选变化，重置页码
const resetPage = () => {
    currentPage.value = 1
}

// 生命周期
onMounted(async () => {
    try {
        success('195个国家首都数据加载完成')
    } catch (err) {
        error('数据加载失败，请刷新重试')
    }
})

// 监听变化
watch([searchQuery, selectedRegion, selectedPopulation, selectedArea, selectedDevelopment, sortBy, sortOrder], (newValues, oldValues) => {
    resetPage()
    
    // 只在有旧值时才显示通知（避免初始化时的通知）
    if (!oldValues) return
    
    // 构建当前筛选条件描述
    const conditions = []
    
    // 地区条件
    if (selectedRegion.value !== 'all') {
        const regionName = regions.value.find(r => r.key === selectedRegion.value)?.name
        conditions.push(regionName)
    }
    
    // 人口条件
    if (selectedPopulation.value !== 'all') {
        const popText = selectedPopulation.value === 'large' ? '大国(>1亿人口)' : selectedPopulation.value === 'medium' ? '中等国家(1000万-1亿人口)' : '小国(<1000万人口)'
        conditions.push(popText)
    }
    
    // 面积条件
    if (selectedArea.value !== 'all') {
        const areaText = selectedArea.value === 'huge' ? '超大国家(>500万km²)' : selectedArea.value === 'large' ? '大国(100万-500万km²)' : selectedArea.value === 'medium' ? '中等国家(10万-100万km²)' : '小国(<10万km²)'
        conditions.push(areaText)
    }
    
    // 发展水平条件
    if (selectedDevelopment.value !== 'all') {
        const devText = selectedDevelopment.value === 'developed' ? '发达国家' : '发展中国家'
        conditions.push(devText)
    }
    
    // 排序条件
    const sortText = sortBy.value === 'name' ? '名称' : sortBy.value === 'population' ? '人口' : '面积'
    const orderText = sortOrder.value === 'asc' ? '升序' : '降序'
    
    // 显示完整的筛选状态
    if (conditions.length > 0) {
        success(`筛选条件: ${conditions.join(' + ')}，按${sortText}${orderText}排序`)
    } else {
        success(`显示全部国家，按${sortText}${orderText}排序`)
    }
})
</script>
<style scoped>
.countries-capitals {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: var(--bg-primary);
}

.content-wrapper {
    flex: 1;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    padding-bottom: 8rem;
}

.reference-content {
    max-width: 1000px;
    width: 100%;
    padding: 1.5rem;
    padding-bottom: 3rem;
}

.countries-section {
    margin-bottom: 4rem;
}

.advanced-filters {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0;
}

.filter-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: auto;
}

.filter-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
    white-space: nowrap;
}

.filter-select {
    padding: 0.25rem 0.375rem;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.75rem;
    transition: all 0.2s;
}

.filter-select:focus {
    outline: none;
    border-color: var(--accent-color);
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
}

.sort-btn {
    padding: 0.25rem 0.375rem;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0;
}

.sort-btn:hover {
    background: var(--bg-tertiary);
    border-color: var(--accent-color);
}

.sort-btn.desc {
    background: var(--accent-color) !important;
    color: white !important;
    border-color: var(--accent-color) !important;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-left h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
}

.section-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.countries-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
    width: 1.75rem;
    height: 1.75rem;
    background: var(--accent-color);
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
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
    gap: 0.75rem;
}

.country-main {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.country-flag-section {
    flex-shrink: 0;
}

.flag-image {
    width: 3rem;
    height: 2rem;
    object-fit: cover;
    border-radius: 0.25rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
}

.country-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.country-names {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.country-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
}

.country-name-en {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-secondary);
    font-style: italic;
}

.capital-info {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.capital-main {
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.capital-icon {
    font-size: 0.875rem;
    opacity: 0.7;
}

.capital-names {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.capital-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.capital-name-en {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-style: italic;
}

.country-stats {
    display: flex;
    gap: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
    margin-top: 0.25rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
}

.stat-icon {
    font-size: 0.75rem;
    opacity: 0.7;
}

.stat-value {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem 0;
    border-top: 1px solid var(--border-color);
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.no-pagination-spacer {
    height: 2rem;
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
    min-width: 4rem;
    text-align: center;
}

.modal-body {
    padding: 1.5rem;
}

.modal-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
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

@media (max-width: 768px) {
    .reference-content {
        padding: 1rem;
        padding-bottom: 8rem;
    }

    .advanced-filters {
        flex-direction: column;
        gap: 0.75rem;
        padding: 0;
    }

    .filter-group {
        min-width: auto;
    }

    .sort-btn {
        margin-top: 0;
        align-self: flex-start;
    }

    .countries-grid {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .country-card {
        padding: 0.875rem;
    }

    .card-header {
        margin-bottom: 0.5rem;
    }

    .card-content {
        gap: 0.5rem;
    }

    .country-main {
        gap: 0.5rem;
    }

    .flag-image {
        width: 2.5rem;
        height: 1.75rem;
    }

    .country-name {
        font-size: 0.9rem;
    }

    .country-name-en {
        font-size: 0.75rem;
    }

    .capital-name {
        font-size: 0.8rem;
    }

    .capital-name-en {
        font-size: 0.7rem;
    }

    .country-stats {
        gap: 0.5rem;
        padding-top: 0.375rem;
    }

    .stat-value {
        font-size: 0.7rem;
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