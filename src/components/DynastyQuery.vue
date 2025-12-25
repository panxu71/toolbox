<template>
    <div class="dynasty-query">
        <div class="query-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="query-title">历史朝代查询</h2>
            <div class="query-actions">
                <button class="action-btn" @click="exportData" title="导出数据">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7,10 12,15 17,10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="query-content">
            <!-- 搜索和筛选区域 - 只在列表页面显示 -->
            <div v-if="!selectedDynasty" class="search-section">
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input v-model="searchQuery" type="text" class="search-input" placeholder="搜索朝代名称、皇帝姓名..."
                            @input="filterDynasties" />
                        <button v-if="searchQuery" class="clear-search-btn" @click="clearSearch">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="period-filter">
                        <button v-for="period in periods" :key="period.key"
                            :class="['period-btn', { active: activePeriod === period.key }]"
                            @click="setActivePeriod(period.key)">
                            {{ period.name }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 朝代时间轴 -->
            <div v-if="!selectedDynasty" class="timeline-section">
                <div class="section-header">
                    <h3>{{ getPeriodTitle() }}</h3>
                    <div class="section-info">
                        <span class="info-text">共 {{ filteredDynasties.length }} 个朝代</span>
                    </div>
                </div>
                <div class="timeline-container">
                    <div class="timeline">
                        <div v-for="dynasty in filteredDynasties" :key="dynasty.name" class="timeline-item"
                            :data-dynasty="dynasty.name" @click="selectDynasty(dynasty)">
                            <div class="timeline-marker">
                                <div class="timeline-dot" :style="{ backgroundColor: '#dc2626' }"></div>
                                <div class="timeline-line"></div>
                            </div>
                            <div class="timeline-content">
                                <div class="dynasty-card">
                                    <div class="dynasty-header">
                                        <div class="dynasty-main">
                                            <h4 class="dynasty-name">{{ dynasty.name }}</h4>
                                            <span class="dynasty-period">{{ dynasty.period }}</span>
                                        </div>
                                        <div class="dynasty-basic">
                                            <span class="dynasty-years">{{ dynasty.startYear }} - {{ dynasty.endYear
                                            }}</span>
                                            <span class="dynasty-duration">{{ dynasty.duration }}年</span>
                                        </div>
                                    </div>
                                    <div class="dynasty-info">
                                        <span class="dynasty-capital">都城：{{ dynasty.capital }}</span>
                                        <span class="emperors-count">皇帝：{{ dynasty.emperors?.length || 0 }}位</span>
                                    </div>
                                    <div class="dynasty-founder">
                                        开国：{{ dynasty.founder }} → 末代：{{ dynasty.lastEmperor }}
                                    </div>
                                    <div class="dynasty-description">
                                        {{ dynasty.description.substring(0, 80) }}...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 朝代详情 -->
            <div v-if="selectedDynasty" class="dynasty-detail">
                <div class="detail-header">
                    <button class="back-detail-btn" @click="backToList">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        返回列表
                    </button>
                    <h3>{{ selectedDynasty.name }}详情</h3>
                </div>
                <div class="detail-content">
                    <div class="detail-grid">
                        <div class="detail-card">
                            <h4>基本信息</h4>
                            <div class="detail-item">
                                <span class="label">朝代名称：</span>
                                <span class="value">{{ selectedDynasty.name }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">起始年份：</span>
                                <span class="value">{{ selectedDynasty.startYear }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">结束年份：</span>
                                <span class="value">{{ selectedDynasty.endYear }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">历时年数：</span>
                                <span class="value">{{ selectedDynasty.duration }} 年</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">都城：</span>
                                <span class="value">{{ selectedDynasty.capital }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">开国皇帝：</span>
                                <span class="value">{{ selectedDynasty.founder }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">末代皇帝：</span>
                                <span class="value">{{ selectedDynasty.lastEmperor }}</span>
                            </div>
                        </div>

                        <div class="detail-card">
                            <h4>历史概述</h4>
                            <p class="dynasty-description">{{ selectedDynasty.description }}</p>
                        </div>

                        <div class="detail-card" v-if="selectedDynasty.timeline">
                            <h4>历史脉络</h4>
                            <div class="timeline-events">
                                <div v-for="event in selectedDynasty.timeline" :key="event.event" class="timeline-event"
                                    :class="event.type">
                                    <div class="event-marker"></div>
                                    <div class="event-content">
                                        <h5 class="event-title">{{ event.event }}</h5>
                                        <p class="event-description">{{ event.description }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="detail-card" v-if="selectedDynasty.achievements">
                            <h4>主要成就</h4>
                            <ul class="achievements-list">
                                <li v-for="achievement in selectedDynasty.achievements" :key="achievement">
                                    {{ achievement }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- 历代皇帝单独卡片 -->
                    <div class="emperors-card">
                        <h4>历代皇帝</h4>
                        <div class="emperors-table-container">
                            <table class="emperors-table">
                                <thead>
                                    <tr>
                                        <th>序号</th>
                                        <th>庙号/谥号</th>
                                        <th>年号</th>
                                        <th>姓名</th>
                                        <th>在位时间</th>
                                        <th>在位年数</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(emperor, index) in selectedDynasty.emperors || []" :key="emperor.name">
                                        <td class="emperor-index">{{ index + 1 }}</td>
                                        <td class="emperor-title-table">{{ emperor.title }}</td>
                                        <td class="emperor-era-table">{{ emperor.eraName || '-' }}</td>
                                        <td class="emperor-name-table">{{ emperor.name }}</td>
                                        <td class="emperor-reign-table">{{ emperor.reignStart }} - {{ emperor.reignEnd
                                        }}</td>
                                        <td class="emperor-years-table">{{ typeof emperor.reignYears === 'number' ?
                                            emperor.reignYears + '年' : emperor.reignYears }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>

        <!-- 悬浮回到顶部按钮 -->
        <button v-if="showBackToTop" class="floating-back-to-top" @click="scrollToTop" title="回到顶部">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m18 15-6-6-6 6" />
            </svg>
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

defineEmits<{
    back: []
}>()

// 基本状态
const searchQuery = ref('')
const activePeriod = ref('all')
const selectedDynasty = ref<Dynasty | null>(null)
const lastViewedDynasty = ref<string | null>(null)

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 回到顶部按钮显示控制
const showBackToTop = ref(false)

// 时期分类
const periods = [
    { key: 'all', name: '全部' },
    { key: 'ancient', name: '上古' },
    { key: 'imperial', name: '帝制' },
    { key: 'modern', name: '近现代' }
]

// 朝代接口定义
interface Emperor {
    name: string
    title: string
    reignStart: string
    reignEnd: string
    reignYears: number | string
    eraName?: string
}

interface Dynasty {
    name: string
    startYear: string
    endYear: string
    duration: number
    capital: string
    founder: string
    lastEmperor: string
    period: string
    description: string
    timeline?: Array<{
        event: string
        description: string
        type: 'start' | 'major' | 'end'
    }>
    emperors?: Emperor[]
    achievements?: string[]
    famousEmperors?: Array<{
        name: string
        description: string
    }>
}

// 朝代数据 - 按正确的时间顺序排列
const dynasties = ref<Dynasty[]>([
    {
        name: '夏朝',
        startYear: '约前2070年',
        endYear: '约前1600年',
        duration: 470,
        capital: '阳城（今河南登封）',
        founder: '禹',
        lastEmperor: '桀',
        period: 'ancient',
        description: '中国历史上第一个世袭制王朝，标志着中国进入奴隶社会。夏朝建立了早期的国家制度，为后世王朝奠定了基础。',
        emperors: [
            { name: '禹', title: '夏禹王', reignStart: '约前2123年', reignEnd: '约前2025年', reignYears: 98 },
            { name: '启', title: '夏启王', reignStart: '约前2025年', reignEnd: '约前1978年', reignYears: 47 },
            { name: '太康', title: '夏太康', reignStart: '约前1978年', reignEnd: '约前1949年', reignYears: 29 },
            { name: '仲康', title: '夏仲康', reignStart: '约前1949年', reignEnd: '约前1936年', reignYears: 13 },
            { name: '桀', title: '夏桀王', reignStart: '约前1652年', reignEnd: '约前1600年', reignYears: 52 }
        ],
        achievements: [
            '建立了中国第一个世袭制王朝',
            '创立了早期的国家制度',
            '发展了青铜器制造技术',
            '建立了历法制度'
        ]
    },
    {
        name: '商朝',
        startYear: '约前1600年',
        endYear: '约前1046年',
        duration: 554,
        capital: '亳（今河南商丘）',
        founder: '汤',
        lastEmperor: '纣王',
        period: 'ancient',
        description: '中国历史上第二个王朝，以青铜器和甲骨文著称。商朝在政治、经济、文化等方面都有重要发展。',
        emperors: [
            { name: '汤', title: '商汤王', reignStart: '约前1675年', reignEnd: '约前1646年', reignYears: 29 },
            { name: '太甲', title: '商太甲', reignStart: '约前1646年', reignEnd: '约前1614年', reignYears: 32 },
            { name: '沃丁', title: '商沃丁', reignStart: '约前1614年', reignEnd: '约前1586年', reignYears: 28 },
            { name: '盘庚', title: '商盘庚', reignStart: '约前1300年', reignEnd: '约前1277年', reignYears: 23 },
            { name: '纣王', title: '商纣王', reignStart: '约前1075年', reignEnd: '约前1046年', reignYears: 29 }
        ],
        achievements: [
            '发明了甲骨文，是中国最早的成熟文字',
            '青铜器制造达到高峰',
            '建立了完善的祭祀制度',
            '发展了天文历法'
        ]
    },
    {
        name: '西周',
        startYear: '约前1046年',
        endYear: '前771年',
        duration: 275,
        capital: '镐京（今陕西西安）',
        founder: '周武王',
        lastEmperor: '周幽王',
        period: 'ancient',
        description: '中国历史上第三个王朝，建立了分封制和宗法制，对中国古代政治制度产生深远影响。',
        emperors: [
            { name: '姬发', title: '周武王', reignStart: '约前1046年', reignEnd: '约前1043年', reignYears: 3 },
            { name: '姬诵', title: '周成王', reignStart: '约前1042年', reignEnd: '约前1021年', reignYears: 21 },
            { name: '姬钊', title: '周康王', reignStart: '约前1020年', reignEnd: '约前996年', reignYears: 24 },
            { name: '姬瑕', title: '周昭王', reignStart: '约前995年', reignEnd: '约前977年', reignYears: 18 },
            { name: '姬宫湦', title: '周幽王', reignStart: '前781年', reignEnd: '前771年', reignYears: 10 }
        ],
        achievements: [
            '建立了分封制和宗法制',
            '制定了礼乐制度',
            '发展了农业和手工业',
            '创立了"天命"思想'
        ]
    },
    {
        name: '东周',
        startYear: '前770年',
        endYear: '前256年',
        duration: 514,
        capital: '洛邑（今河南洛阳）',
        founder: '周平王',
        lastEmperor: '周赧王',
        period: 'ancient',
        description: '分为春秋和战国两个时期，是中国思想文化最为繁荣的时代，诸子百家争鸣。',
        emperors: [
            { name: '姬宜臼', title: '周平王', reignStart: '前770年', reignEnd: '前720年', reignYears: 50 },
            { name: '姬林', title: '周桓王', reignStart: '前719年', reignEnd: '前697年', reignYears: 22 },
            { name: '姬佗', title: '周庄王', reignStart: '前696年', reignEnd: '前682年', reignYears: 14 },
            { name: '姬胡齐', title: '周釐王', reignStart: '前681年', reignEnd: '前677年', reignYears: 4 },
            { name: '姬延', title: '周赧王', reignStart: '前314年', reignEnd: '前256年', reignYears: 58 }
        ],
        achievements: [
            '春秋战国时期诸子百家争鸣',
            '铁器的广泛使用',
            '商业和手工业的发展',
            '军事技术的进步'
        ]
    },
    {
        name: '秦朝',
        startYear: '前221年',
        endYear: '前206年',
        duration: 15,
        capital: '咸阳（今陕西咸阳）',
        founder: '秦始皇',
        lastEmperor: '秦二世',
        period: 'imperial',
        description: '中国历史上第一个统一的中央集权制帝国，建立了郡县制，统一了文字、货币、度量衡。',
        emperors: [
            { name: '嬴政', title: '秦始皇帝', reignStart: '前221年', reignEnd: '前210年', reignYears: 11 },
            { name: '嬴胡亥', title: '秦二世皇帝', reignStart: '前210年', reignEnd: '前207年', reignYears: 3 },
            { name: '嬴子婴', title: '秦王子婴', reignStart: '前207年', reignEnd: '前206年', reignYears: 1 }
        ],
        achievements: [
            '统一六国，建立中央集权制',
            '统一文字、货币、度量衡',
            '修建万里长城',
            '建立郡县制'
        ]
    },
    {
        name: '西汉',
        startYear: '前202年',
        endYear: '8年',
        duration: 210,
        capital: '长安（今陕西西安）',
        founder: '汉高祖刘邦',
        lastEmperor: '汉平帝',
        period: 'imperial',
        description: '中国历史上重要的统一王朝，开创了汉族的称谓，建立了丝绸之路，文化繁荣。',
        emperors: [
            { name: '刘邦', title: '汉高祖', reignStart: '前202年', reignEnd: '前195年', reignYears: 7, eraName: '汉' },
            { name: '刘盈', title: '汉惠帝', reignStart: '前194年', reignEnd: '前188年', reignYears: 6, eraName: '汉' },
            { name: '刘恭', title: '汉前少帝', reignStart: '前188年', reignEnd: '前184年', reignYears: 4, eraName: '汉' },
            { name: '刘弘', title: '汉后少帝', reignStart: '前184年', reignEnd: '前180年', reignYears: 4, eraName: '汉' },
            { name: '刘恒', title: '汉文帝', reignStart: '前180年', reignEnd: '前157年', reignYears: 23, eraName: '汉' },
            { name: '刘启', title: '汉景帝', reignStart: '前156年', reignEnd: '前141年', reignYears: 15, eraName: '汉' },
            { name: '刘彻', title: '汉武帝', reignStart: '前140年', reignEnd: '前87年', reignYears: 53, eraName: '建元、元光、元朔、元狩、元鼎、元封、太初、天汉、太始、征和、后元' },
            { name: '刘弗陵', title: '汉昭帝', reignStart: '前86年', reignEnd: '前74年', reignYears: 12, eraName: '始元、元凤、元平' },
            { name: '刘贺', title: '汉废帝', reignStart: '前74年', reignEnd: '前74年', reignYears: '27天', eraName: '汉' },
            { name: '刘询', title: '汉宣帝', reignStart: '前73年', reignEnd: '前49年', reignYears: 24, eraName: '本始、地节、元康、神爵、五凤、甘露、黄龙' },
            { name: '刘奭', title: '汉元帝', reignStart: '前48年', reignEnd: '前33年', reignYears: 15, eraName: '初元、永光、建昭、竟宁' },
            { name: '刘骜', title: '汉成帝', reignStart: '前32年', reignEnd: '前7年', reignYears: 25, eraName: '建始、河平、阳朔、鸿嘉、永始、元延、绥和' },
            { name: '刘欣', title: '汉哀帝', reignStart: '前6年', reignEnd: '前1年', reignYears: 5, eraName: '建平、太初元将、元寿' },
            { name: '刘衎', title: '汉平帝', reignStart: '1年', reignEnd: '5年', reignYears: 4, eraName: '元始' },
            { name: '刘婴', title: '孺子婴', reignStart: '6年', reignEnd: '8年', reignYears: 2, eraName: '居摄、初始' }
        ],
        achievements: [
            '开辟丝绸之路',
            '推行"文景之治"',
            '建立太学，重视教育',
            '发展农业和手工业'
        ]
    },
    {
        name: '新朝',
        startYear: '8年',
        endYear: '23年',
        duration: 15,
        capital: '长安（今陕西西安）',
        founder: '王莽',
        lastEmperor: '王莽',
        period: 'imperial',
        description: '王莽篡汉建立的短暂王朝，推行激进改革，最终失败。',
        emperors: [
            { name: '王莽', title: '新始祖', reignStart: '8年', reignEnd: '23年', reignYears: 15, eraName: '始建国、天凤、地皇' }
        ],
        achievements: [
            '推行土地国有化',
            '货币制度改革',
            '官制改革',
            '推广儒家经典'
        ]
    },
    {
        name: '东汉',
        startYear: '25年',
        endYear: '220年',
        duration: 195,
        capital: '洛阳（今河南洛阳）',
        founder: '汉光武帝',
        lastEmperor: '汉献帝',
        period: 'imperial',
        description: '汉朝的延续，科技文化继续发展，出现了造纸术等重要发明。',
        emperors: [
            { name: '刘秀', title: '汉光武帝', reignStart: '25年', reignEnd: '57年', reignYears: 32, eraName: '建武、建武中元' },
            { name: '刘庄', title: '汉明帝', reignStart: '57年', reignEnd: '75年', reignYears: 18, eraName: '永平' },
            { name: '刘炟', title: '汉章帝', reignStart: '75年', reignEnd: '88年', reignYears: 13, eraName: '建初、元和、章和' },
            { name: '刘肇', title: '汉和帝', reignStart: '88年', reignEnd: '106年', reignYears: 18, eraName: '永元、元兴' },
            { name: '刘隆', title: '汉殇帝', reignStart: '106年', reignEnd: '106年', reignYears: '8个月', eraName: '延平' },
            { name: '刘祜', title: '汉安帝', reignStart: '106年', reignEnd: '125年', reignYears: 19, eraName: '永初、元初、永宁、建光、延光' },
            { name: '刘懿', title: '汉前少帝', reignStart: '125年', reignEnd: '125年', reignYears: '7个月' },
            { name: '刘保', title: '汉顺帝', reignStart: '125年', reignEnd: '144年', reignYears: 19, eraName: '永建、阳嘉、永和、汉安、建康' },
            { name: '刘炳', title: '汉冲帝', reignStart: '144年', reignEnd: '145年', reignYears: '5个月', eraName: '永嘉' },
            { name: '刘缵', title: '汉质帝', reignStart: '145年', reignEnd: '146年', reignYears: 1, eraName: '本初' },
            { name: '刘志', title: '汉桓帝', reignStart: '146年', reignEnd: '167年', reignYears: 21, eraName: '建和、和平、元嘉、永兴、永寿、延熹、永康' },
            { name: '刘宏', title: '汉灵帝', reignStart: '167年', reignEnd: '189年', reignYears: 22, eraName: '建宁、熹平、光和、中平' },
            { name: '刘辩', title: '汉后少帝', reignStart: '189年', reignEnd: '189年', reignYears: '4个月', eraName: '光熹、昭宁' },
            { name: '刘协', title: '汉献帝', reignStart: '189年', reignEnd: '220年', reignYears: 31, eraName: '初平、兴平、建安、延康' }
        ],
        achievements: [
            '蔡伦改进造纸术',
            '张衡发明地动仪',
            '医学著作《伤寒杂病论》',
            '佛教传入中国'
        ]
    },
    {
        name: '三国时期',
        startYear: '220年',
        endYear: '280年',
        duration: 60,
        capital: '洛阳/成都/建业（今河南洛阳/四川成都/江苏南京）',
        founder: '曹丕/刘备/孙权',
        lastEmperor: '曹奂/刘禅/孙皓',
        period: 'imperial',
        description: '魏蜀吴三国鼎立，英雄辈出，是中国历史上著名的分裂时期。',
        emperors: [
            { name: '曹丕', title: '魏文帝', reignStart: '220年', reignEnd: '226年', reignYears: 6, eraName: '黄初' },
            { name: '曹叡', title: '魏明帝', reignStart: '226年', reignEnd: '239年', reignYears: 13, eraName: '太和、青龙、景初' },
            { name: '曹芳', title: '魏齐王', reignStart: '239年', reignEnd: '254年', reignYears: 15, eraName: '正始、嘉平' },
            { name: '曹髦', title: '魏高贵乡公', reignStart: '254年', reignEnd: '260年', reignYears: 6, eraName: '正元、甘露' },
            { name: '曹奂', title: '魏元帝', reignStart: '260年', reignEnd: '265年', reignYears: 5, eraName: '景元、咸熙' },
            { name: '刘备', title: '蜀昭烈帝', reignStart: '221年', reignEnd: '223年', reignYears: 2, eraName: '章武' },
            { name: '刘禅', title: '蜀后主', reignStart: '223年', reignEnd: '263年', reignYears: 40, eraName: '建兴、延熙、景耀、炎兴' },
            { name: '孙权', title: '吴大帝', reignStart: '229年', reignEnd: '252年', reignYears: 23, eraName: '黄龙、嘉禾、赤乌、太元、神凤' },
            { name: '孙亮', title: '吴会稽王', reignStart: '252年', reignEnd: '258年', reignYears: 6, eraName: '建兴、五凤、太平' },
            { name: '孙休', title: '吴景帝', reignStart: '258年', reignEnd: '264年', reignYears: 6, eraName: '永安' },
            { name: '孙皓', title: '吴末帝', reignStart: '264年', reignEnd: '280年', reignYears: 16, eraName: '元兴、甘露、宝鼎、建衡、凤凰、天册、天玺、天纪' }
        ],
        achievements: [
            '三国文化繁荣',
            '军事技术发展',
            '农业生产恢复',
            '文学艺术成就'
        ]
    },
    {
        name: '西晋',
        startYear: '266年',
        endYear: '316年',
        duration: 50,
        capital: '洛阳（今河南洛阳）',
        founder: '晋武帝司马炎',
        lastEmperor: '晋愍帝',
        period: 'imperial',
        description: '司马氏建立的王朝，短暂统一全国，后因八王之乱和五胡乱华而衰落。',
        emperors: [
            { name: '司马炎', title: '晋武帝', reignStart: '266年', reignEnd: '290年', reignYears: 24, eraName: '泰始、咸宁、太康、太熙' },
            { name: '司马衷', title: '晋惠帝', reignStart: '290年', reignEnd: '307年', reignYears: 17, eraName: '永熙、永平、元康、永康、永宁、太安、永兴、光熙' },
            { name: '司马炽', title: '晋怀帝', reignStart: '307年', reignEnd: '313年', reignYears: 6, eraName: '永嘉' },
            { name: '司马邺', title: '晋愍帝', reignStart: '313年', reignEnd: '316年', reignYears: 3, eraName: '建兴' }
        ],
        achievements: [
            '统一三国',
            '经济恢复发展',
            '文化艺术繁荣',
            '法律制度完善'
        ]
    },
    {
        name: '东晋',
        startYear: '317年',
        endYear: '420年',
        duration: 103,
        capital: '建康（今江苏南京）',
        founder: '晋元帝',
        lastEmperor: '晋恭帝',
        period: 'imperial',
        description: '西晋灭亡后，司马氏在南方建立的政权，与北方十六国并立。',
        emperors: [
            { name: '司马睿', title: '晋元帝', reignStart: '317年', reignEnd: '323年', reignYears: 6, eraName: '建武、大兴' },
            { name: '司马绍', title: '晋明帝', reignStart: '323年', reignEnd: '325年', reignYears: 2, eraName: '太宁' },
            { name: '司马衍', title: '晋成帝', reignStart: '325年', reignEnd: '342年', reignYears: 17, eraName: '咸和、咸康' },
            { name: '司马岳', title: '晋康帝', reignStart: '342年', reignEnd: '344年', reignYears: 2, eraName: '建元' },
            { name: '司马聃', title: '晋穆帝', reignStart: '344年', reignEnd: '361年', reignYears: 17, eraName: '永和、升平' },
            { name: '司马丕', title: '晋哀帝', reignStart: '361年', reignEnd: '365年', reignYears: 4, eraName: '隆和、兴宁' },
            { name: '司马奕', title: '晋废帝', reignStart: '365年', reignEnd: '371年', reignYears: 6, eraName: '太和' },
            { name: '司马昱', title: '晋简文帝', reignStart: '371年', reignEnd: '372年', reignYears: 1, eraName: '咸安' },
            { name: '司马曜', title: '晋孝武帝', reignStart: '372年', reignEnd: '396年', reignYears: 24, eraName: '宁康、太元' },
            { name: '司马德宗', title: '晋安帝', reignStart: '396年', reignEnd: '418年', reignYears: 22, eraName: '隆安、元兴、义熙' },
            { name: '司马德文', title: '晋恭帝', reignStart: '418年', reignEnd: '420年', reignYears: 2, eraName: '元熙' }
        ],
        achievements: [
            '保持汉族政权',
            '文化艺术发展',
            '佛教道教兴盛',
            '书法绘画成就'
        ]
    },
    {
        name: '南北朝',
        startYear: '420年',
        endYear: '589年',
        duration: 169,
        capital: '建康/平城/洛阳（今江苏南京/山西大同/河南洛阳）',
        founder: '刘裕等',
        lastEmperor: '陈叔宝等',
        period: 'imperial',
        description: '南朝宋齐梁陈与北朝北魏东魏西魏北齐北周对峙的时期，民族融合加强。',
        emperors: [
            // 南朝宋
            { name: '刘裕', title: '宋武帝', reignStart: '420年', reignEnd: '422年', reignYears: 2, eraName: '永初' },
            { name: '刘义符', title: '宋少帝', reignStart: '422年', reignEnd: '424年', reignYears: 2, eraName: '景平' },
            { name: '刘义隆', title: '宋文帝', reignStart: '424年', reignEnd: '453年', reignYears: 29, eraName: '元嘉' },
            { name: '刘骏', title: '宋孝武帝', reignStart: '453年', reignEnd: '464年', reignYears: 11, eraName: '孝建、大明' },
            { name: '刘子业', title: '宋前废帝', reignStart: '464年', reignEnd: '465年', reignYears: 1, eraName: '永光、景和' },
            { name: '刘彧', title: '宋明帝', reignStart: '465年', reignEnd: '472年', reignYears: 7, eraName: '泰始' },
            { name: '刘昱', title: '宋后废帝', reignStart: '472年', reignEnd: '477年', reignYears: 5, eraName: '元徽' },
            { name: '刘准', title: '宋顺帝', reignStart: '477年', reignEnd: '479年', reignYears: 2, eraName: '升明' },
            // 南朝齐
            { name: '萧道成', title: '齐高帝', reignStart: '479年', reignEnd: '482年', reignYears: 3, eraName: '建元' },
            { name: '萧赜', title: '齐武帝', reignStart: '482年', reignEnd: '493年', reignYears: 11, eraName: '永明' },
            { name: '萧昭业', title: '齐郁林王', reignStart: '493年', reignEnd: '494年', reignYears: 1, eraName: '隆昌' },
            { name: '萧昭文', title: '齐海陵王', reignStart: '494年', reignEnd: '494年', reignYears: 1, eraName: '延兴' },
            { name: '萧鸾', title: '齐明帝', reignStart: '494年', reignEnd: '498年', reignYears: 4, eraName: '建武、永泰' },
            { name: '萧宝卷', title: '齐东昏侯', reignStart: '498年', reignEnd: '501年', reignYears: 3, eraName: '永元' },
            { name: '萧宝融', title: '齐和帝', reignStart: '501年', reignEnd: '502年', reignYears: 1, eraName: '中兴' },
            // 南朝梁
            { name: '萧衍', title: '梁武帝', reignStart: '502年', reignEnd: '549年', reignYears: 47, eraName: '天监、普通、大通、中大通、大同、中大同、太清' },
            { name: '萧纲', title: '梁简文帝', reignStart: '549年', reignEnd: '551年', reignYears: 2, eraName: '大宝' },
            { name: '萧栋', title: '梁豫章王', reignStart: '551年', reignEnd: '551年', reignYears: 1, eraName: '天正' },
            { name: '萧绎', title: '梁元帝', reignStart: '552年', reignEnd: '554年', reignYears: 2, eraName: '承圣' },
            { name: '萧方智', title: '梁敬帝', reignStart: '555年', reignEnd: '557年', reignYears: 2, eraName: '绍泰、太平' },
            // 南朝陈
            { name: '陈霸先', title: '陈武帝', reignStart: '557年', reignEnd: '559年', reignYears: 2, eraName: '永定' },
            { name: '陈蒨', title: '陈文帝', reignStart: '559年', reignEnd: '566年', reignYears: 7, eraName: '天嘉、天康' },
            { name: '陈伯宗', title: '陈废帝', reignStart: '566年', reignEnd: '568年', reignYears: 2, eraName: '光大' },
            { name: '陈顼', title: '陈宣帝', reignStart: '568年', reignEnd: '582年', reignYears: 14, eraName: '太建' },
            { name: '陈叔宝', title: '陈后主', reignStart: '582年', reignEnd: '589年', reignYears: 7, eraName: '至德、祯明' },
            // 北朝北魏（部分代表）
            { name: '拓跋珪', title: '魏道武帝', reignStart: '386年', reignEnd: '409年', reignYears: 23, eraName: '登国、皇始、天兴、天赐' },
            { name: '拓跋嗣', title: '魏明元帝', reignStart: '409年', reignEnd: '423年', reignYears: 14, eraName: '永兴、神瑞、泰常' },
            { name: '拓跋焘', title: '魏太武帝', reignStart: '423年', reignEnd: '452年', reignYears: 29, eraName: '始光、神麚、延和、太延、太平真君、正平' },
            { name: '元宏', title: '魏孝文帝', reignStart: '471年', reignEnd: '499年', reignYears: 28, eraName: '延兴、承明、太和' }
        ],
        achievements: [
            '民族大融合',
            '佛教文化繁荣',
            '科技文化发展',
            '农业技术进步'
        ]
    },
    {
        name: '隋朝',
        startYear: '581年',
        endYear: '618年',
        duration: 37,
        capital: '大兴城（今陕西西安）',
        founder: '隋文帝杨坚',
        lastEmperor: '隋炀帝',
        period: 'imperial',
        description: '重新统一中国，建立科举制度，开凿大运河，为唐朝盛世奠定基础。',
        emperors: [
            { name: '杨坚', title: '隋文帝', reignStart: '581年', reignEnd: '604年', reignYears: 23, eraName: '开皇、仁寿' },
            { name: '杨广', title: '隋炀帝', reignStart: '604年', reignEnd: '618年', reignYears: 14, eraName: '大业' }
        ],
        achievements: [
            '重新统一中国',
            '建立科举制度',
            '开凿大运河',
            '经济文化发展'
        ]
    },
    {
        name: '唐朝',
        startYear: '618年',
        endYear: '907年',
        duration: 289,
        capital: '长安（今陕西西安）',
        founder: '唐高祖李渊',
        lastEmperor: '唐哀帝',
        period: 'imperial',
        description: '中国历史上最强盛的王朝之一，政治开明，文化繁荣，国际交流频繁，被誉为盛唐。',
        emperors: [
            { name: '李渊', title: '唐高祖', reignStart: '618年', reignEnd: '626年', reignYears: 8, eraName: '武德' },
            { name: '李世民', title: '唐太宗', reignStart: '626年', reignEnd: '649年', reignYears: 23, eraName: '贞观' },
            { name: '李治', title: '唐高宗', reignStart: '649年', reignEnd: '683年', reignYears: 34, eraName: '永徽、显庆、龙朔、麟德、乾封、总章、咸亨、上元、仪凤、调露、永隆、开耀、永淳、弘道' },
            { name: '李显', title: '唐中宗', reignStart: '683年', reignEnd: '684年', reignYears: 1, eraName: '嗣圣' },
            { name: '李旦', title: '唐睿宗', reignStart: '684年', reignEnd: '690年', reignYears: 6, eraName: '文明、光宅、垂拱、永昌、载初' },
            { name: '武则天', title: '武周皇帝', reignStart: '690年', reignEnd: '705年', reignYears: 15, eraName: '天授、如意、长寿、延载、证圣、天册万岁、万岁登封、万岁通天、神功、圣历、久视、大足、长安' },
            { name: '李显', title: '唐中宗(复辟)', reignStart: '705年', reignEnd: '710年', reignYears: 5, eraName: '神龙、景龙' },
            { name: '李重茂', title: '唐殇帝', reignStart: '710年', reignEnd: '710年', reignYears: '17天', eraName: '唐隆' },
            { name: '李旦', title: '唐睿宗(复辟)', reignStart: '710年', reignEnd: '712年', reignYears: 2, eraName: '景云、太极、延和' },
            { name: '李隆基', title: '唐玄宗', reignStart: '712年', reignEnd: '756年', reignYears: 44, eraName: '先天、开元、天宝' },
            { name: '李亨', title: '唐肃宗', reignStart: '756年', reignEnd: '762年', reignYears: 6, eraName: '至德、乾元、上元' },
            { name: '李豫', title: '唐代宗', reignStart: '762年', reignEnd: '779年', reignYears: 17, eraName: '宝应、广德、永泰、大历' },
            { name: '李适', title: '唐德宗', reignStart: '779年', reignEnd: '805年', reignYears: 26, eraName: '建中、兴元、贞元' },
            { name: '李诵', title: '唐顺宗', reignStart: '805年', reignEnd: '805年', reignYears: '8个月', eraName: '永贞' },
            { name: '李纯', title: '唐宪宗', reignStart: '805年', reignEnd: '820年', reignYears: 15, eraName: '元和' },
            { name: '李恒', title: '唐穆宗', reignStart: '820年', reignEnd: '824年', reignYears: 4, eraName: '长庆' },
            { name: '李湛', title: '唐敬宗', reignStart: '824年', reignEnd: '826年', reignYears: 2, eraName: '宝历' },
            { name: '李昂', title: '唐文宗', reignStart: '826年', reignEnd: '840年', reignYears: 14, eraName: '太和、开成' },
            { name: '李炎', title: '唐武宗', reignStart: '840年', reignEnd: '846年', reignYears: 6, eraName: '会昌' },
            { name: '李忱', title: '唐宣宗', reignStart: '846年', reignEnd: '859年', reignYears: 13, eraName: '大中' },
            { name: '李漼', title: '唐懿宗', reignStart: '859年', reignEnd: '873年', reignYears: 14, eraName: '咸通' },
            { name: '李儇', title: '唐僖宗', reignStart: '873年', reignEnd: '888年', reignYears: 15, eraName: '乾符、广明、中和、光启、文德' },
            { name: '李晔', title: '唐昭宗', reignStart: '888年', reignEnd: '904年', reignYears: 16, eraName: '龙纪、大顺、景福、乾宁、光化、天复、天祐' },
            { name: '李柷', title: '唐哀帝', reignStart: '904年', reignEnd: '907年', reignYears: 3, eraName: '天祐' }
        ],
        achievements: [
            '贞观之治、开元盛世',
            '科举制度的完善',
            '诗歌文化的巅峰',
            '国际交流的繁荣'
        ]
    },
    {
        name: '五代十国',
        startYear: '907年',
        endYear: '979年',
        duration: 72,
        capital: '开封/洛阳等（今河南开封/河南洛阳等）',
        founder: '朱温等',
        lastEmperor: '柴宗训等',
        period: 'imperial',
        description: '唐朝灭亡后的分裂时期，北方五代更替，南方十国并立，政治动荡但文化延续。',
        emperors: [
            { name: '朱温', title: '后梁太祖', reignStart: '907年', reignEnd: '912年', reignYears: 5, eraName: '开平、乾化' },
            { name: '朱友珪', title: '后梁郢王', reignStart: '912年', reignEnd: '913年', reignYears: 1, eraName: '凤历' },
            { name: '朱友贞', title: '后梁末帝', reignStart: '913年', reignEnd: '923年', reignYears: 10, eraName: '乾化、贞明、龙德' },
            { name: '李存勖', title: '后唐庄宗', reignStart: '923年', reignEnd: '926年', reignYears: 3, eraName: '同光' },
            { name: '李嗣源', title: '后唐明宗', reignStart: '926年', reignEnd: '933年', reignYears: 7, eraName: '天成、长兴' },
            { name: '李从厚', title: '后唐闵帝', reignStart: '933年', reignEnd: '934年', reignYears: 1, eraName: '应顺' },
            { name: '李从珂', title: '后唐末帝', reignStart: '934年', reignEnd: '936年', reignYears: 2, eraName: '清泰' },
            { name: '石敬瑭', title: '后晋高祖', reignStart: '936年', reignEnd: '942年', reignYears: 6, eraName: '天福' },
            { name: '石重贵', title: '后晋出帝', reignStart: '942年', reignEnd: '947年', reignYears: 5, eraName: '天福、开运' },
            { name: '刘知远', title: '后汉高祖', reignStart: '947年', reignEnd: '948年', reignYears: 1, eraName: '天福、乾祐' },
            { name: '刘承祐', title: '后汉隐帝', reignStart: '948年', reignEnd: '951年', reignYears: 3, eraName: '乾祐' },
            { name: '郭威', title: '后周太祖', reignStart: '951年', reignEnd: '954年', reignYears: 3, eraName: '广顺、显德' },
            { name: '柴荣', title: '后周世宗', reignStart: '954年', reignEnd: '959年', reignYears: 5, eraName: '显德' },
            { name: '柴宗训', title: '后周恭帝', reignStart: '959年', reignEnd: '960年', reignYears: 1, eraName: '显德' }
        ],
        achievements: [
            '保持文化传承',
            '经济局部发展',
            '科技继续进步',
            '为宋朝统一奠基'
        ]
    },
    {
        name: '北宋',
        startYear: '960年',
        endYear: '1127年',
        duration: 167,
        capital: '开封（今河南开封）',
        founder: '宋太祖赵匡胤',
        lastEmperor: '宋钦宗',
        period: 'imperial',
        description: '宋朝前期，经济文化高度发达，科技发明众多，是中国古代科技的黄金时代。',
        emperors: [
            { name: '赵匡胤', title: '宋太祖', reignStart: '960年', reignEnd: '976年', reignYears: 16, eraName: '建隆、乾德、开宝' },
            { name: '赵光义', title: '宋太宗', reignStart: '976年', reignEnd: '997年', reignYears: 21, eraName: '太平兴国、雍熙、端拱、淳化、至道' },
            { name: '赵恒', title: '宋真宗', reignStart: '997年', reignEnd: '1022年', reignYears: 25, eraName: '咸平、景德、大中祥符、天禧、乾兴' },
            { name: '赵祯', title: '宋仁宗', reignStart: '1022年', reignEnd: '1063年', reignYears: 41, eraName: '天圣、明道、景祐、宝元、康定、庆历、皇祐、至和、嘉祐' },
            { name: '赵曙', title: '宋英宗', reignStart: '1063年', reignEnd: '1067年', reignYears: 4, eraName: '治平' },
            { name: '赵顼', title: '宋神宗', reignStart: '1067年', reignEnd: '1085年', reignYears: 18, eraName: '熙宁、元丰' },
            { name: '赵煦', title: '宋哲宗', reignStart: '1085年', reignEnd: '1100年', reignYears: 15, eraName: '元祐、绍圣、元符' },
            { name: '赵佶', title: '宋徽宗', reignStart: '1100年', reignEnd: '1125年', reignYears: 25, eraName: '建中靖国、崇宁、大观、政和、重和、宣和' },
            { name: '赵桓', title: '宋钦宗', reignStart: '1125年', reignEnd: '1127年', reignYears: 2, eraName: '靖康' }
        ],
        achievements: [
            '四大发明中的三项（印刷术、火药、指南针）',
            '经济的高度发展',
            '理学的兴起',
            '文学艺术的繁荣'
        ]
    },
    {
        name: '南宋',
        startYear: '1127年',
        endYear: '1279年',
        duration: 152,
        capital: '临安（今浙江杭州）',
        founder: '宋高宗',
        lastEmperor: '宋末帝',
        period: 'imperial',
        description: '宋朝后期，偏安江南，经济文化依然发达，但军事相对薄弱。',
        emperors: [
            { name: '赵构', title: '宋高宗', reignStart: '1127年', reignEnd: '1162年', reignYears: 35, eraName: '建炎、绍兴' },
            { name: '赵昚', title: '宋孝宗', reignStart: '1162年', reignEnd: '1189年', reignYears: 27, eraName: '隆兴、乾道、淳熙' },
            { name: '赵惇', title: '宋光宗', reignStart: '1189年', reignEnd: '1194年', reignYears: 5, eraName: '绍熙' },
            { name: '赵扩', title: '宋宁宗', reignStart: '1194年', reignEnd: '1224年', reignYears: 30, eraName: '庆元、嘉泰、开禧、嘉定' },
            { name: '赵昀', title: '宋理宗', reignStart: '1224年', reignEnd: '1264年', reignYears: 40, eraName: '宝庆、绍定、端平、嘉熙、淳祐、宝祐、开庆、景定' },
            { name: '赵禥', title: '宋度宗', reignStart: '1264年', reignEnd: '1274年', reignYears: 10, eraName: '咸淳' },
            { name: '赵显', title: '宋恭帝', reignStart: '1274年', reignEnd: '1276年', reignYears: 2, eraName: '德祐' },
            { name: '赵昰', title: '宋端宗', reignStart: '1276年', reignEnd: '1278年', reignYears: 2, eraName: '景炎' },
            { name: '赵昺', title: '宋末帝', reignStart: '1278年', reignEnd: '1279年', reignYears: 1, eraName: '祥兴' }
        ],
        achievements: [
            '理学思想成熟',
            '商业经济发达',
            '科技文化繁荣',
            '海外贸易兴盛'
        ]
    },
    {
        name: '元朝',
        startYear: '1271年',
        endYear: '1368年',
        duration: 97,
        capital: '大都（今北京）',
        founder: '元世祖忽必烈',
        lastEmperor: '元顺帝',
        period: 'imperial',
        description: '蒙古族建立的王朝，疆域辽阔，促进了中外文化交流，但统治相对粗放。',
        emperors: [
            { name: '忽必烈', title: '元世祖', reignStart: '1260年', reignEnd: '1294年', reignYears: 34, eraName: '中统、至元' },
            { name: '铁穆耳', title: '元成宗', reignStart: '1294年', reignEnd: '1307年', reignYears: 13, eraName: '元贞、大德' },
            { name: '海山', title: '元武宗', reignStart: '1307年', reignEnd: '1311年', reignYears: 4, eraName: '至大' },
            { name: '爱育黎拔力八达', title: '元仁宗', reignStart: '1311年', reignEnd: '1320年', reignYears: 9, eraName: '皇庆、延祐' },
            { name: '硕德八剌', title: '元英宗', reignStart: '1320年', reignEnd: '1323年', reignYears: 3, eraName: '至治' },
            { name: '也孙铁木儿', title: '元泰定帝', reignStart: '1323年', reignEnd: '1328年', reignYears: 5, eraName: '泰定、致和' },
            { name: '阿速吉八', title: '元天顺帝', reignStart: '1328年', reignEnd: '1328年', reignYears: 1, eraName: '天顺' },
            { name: '图帖睦尔', title: '元文宗', reignStart: '1328年', reignEnd: '1332年', reignYears: 4, eraName: '天历、至顺' },
            { name: '懿璘质班', title: '元明宗', reignStart: '1329年', reignEnd: '1329年', reignYears: 1, eraName: '天历' },
            { name: '宁宗', title: '元宁宗', reignStart: '1332年', reignEnd: '1332年', reignYears: 1, eraName: '至顺' },
            { name: '妥懽帖睦尔', title: '元顺帝', reignStart: '1333年', reignEnd: '1368年', reignYears: 35, eraName: '元统、至元、至正' }
        ],
        achievements: [
            '建立行省制度',
            '促进中外文化交流',
            '发展农业和手工业',
            '统一度量衡和货币'
        ]
    },
    {
        name: '明朝',
        startYear: '1368年',
        endYear: '1644年',
        duration: 276,
        capital: '南京/北京（今江苏南京/北京）',
        founder: '明太祖朱元璋',
        lastEmperor: '崇祯帝',
        period: 'imperial',
        description: '中国历史上最后一个由汉族建立的大一统王朝，郑和下西洋，紫禁城建成。',
        emperors: [
            { name: '朱元璋', title: '明太祖', reignStart: '1368年', reignEnd: '1398年', reignYears: 30, eraName: '洪武' },
            { name: '朱允炆', title: '明惠帝', reignStart: '1398年', reignEnd: '1402年', reignYears: 4, eraName: '建文' },
            { name: '朱棣', title: '明成祖', reignStart: '1402年', reignEnd: '1424年', reignYears: 22, eraName: '永乐' },
            { name: '朱高炽', title: '明仁宗', reignStart: '1424年', reignEnd: '1425年', reignYears: 1, eraName: '洪熙' },
            { name: '朱瞻基', title: '明宣宗', reignStart: '1425年', reignEnd: '1435年', reignYears: 10, eraName: '宣德' },
            { name: '朱祁镇', title: '明英宗', reignStart: '1435年', reignEnd: '1449年', reignYears: 14, eraName: '正统' },
            { name: '朱祁钰', title: '明代宗', reignStart: '1449年', reignEnd: '1457年', reignYears: 8, eraName: '景泰' },
            { name: '朱祁镇', title: '明英宗(复辟)', reignStart: '1457年', reignEnd: '1464年', reignYears: 7, eraName: '天顺' },
            { name: '朱见深', title: '明宪宗', reignStart: '1464年', reignEnd: '1487年', reignYears: 23, eraName: '成化' },
            { name: '朱祐樘', title: '明孝宗', reignStart: '1487年', reignEnd: '1505年', reignYears: 18, eraName: '弘治' },
            { name: '朱厚照', title: '明武宗', reignStart: '1505年', reignEnd: '1521年', reignYears: 16, eraName: '正德' },
            { name: '朱厚熜', title: '明世宗', reignStart: '1521年', reignEnd: '1567年', reignYears: 46, eraName: '嘉靖' },
            { name: '朱载垕', title: '明穆宗', reignStart: '1567年', reignEnd: '1572年', reignYears: 5, eraName: '隆庆' },
            { name: '朱翊钧', title: '明神宗', reignStart: '1572年', reignEnd: '1620年', reignYears: 48, eraName: '万历' },
            { name: '朱常洛', title: '明光宗', reignStart: '1620年', reignEnd: '1620年', reignYears: '29天', eraName: '泰昌' },
            { name: '朱由校', title: '明熹宗', reignStart: '1620年', reignEnd: '1627年', reignYears: 7, eraName: '天启' },
            { name: '朱由检', title: '明思宗', reignStart: '1627年', reignEnd: '1644年', reignYears: 17, eraName: '崇祯' }
        ],
        achievements: [
            '郑和七下西洋',
            '修建紫禁城',
            '编纂《永乐大典》',
            '发展农业和手工业'
        ]
    },
    {
        name: '清朝',
        startYear: '1636年',
        endYear: '1912年',
        duration: 276,
        capital: '北京（今北京）',
        founder: '清太宗皇太极',
        lastEmperor: '溥仪',
        period: 'imperial',
        description: '中国历史上最后一个封建王朝，由满族建立，经历了康乾盛世，但后期闭关锁国，最终被推翻。',
        emperors: [
            { name: '爱新觉罗·努尔哈赤', title: '清太祖', reignStart: '1616年', reignEnd: '1626年', reignYears: 10, eraName: '天命' },
            { name: '爱新觉罗·皇太极', title: '清太宗', reignStart: '1626年', reignEnd: '1643年', reignYears: 17, eraName: '天聪、崇德' },
            { name: '爱新觉罗·福临', title: '清世祖', reignStart: '1644年', reignEnd: '1661年', reignYears: 17, eraName: '顺治' },
            { name: '爱新觉罗·玄烨', title: '清圣祖', reignStart: '1661年', reignEnd: '1722年', reignYears: 61, eraName: '康熙' },
            { name: '爱新觉罗·胤禛', title: '清世宗', reignStart: '1722年', reignEnd: '1735年', reignYears: 13, eraName: '雍正' },
            { name: '爱新觉罗·弘历', title: '清高宗', reignStart: '1735年', reignEnd: '1796年', reignYears: 61, eraName: '乾隆' },
            { name: '爱新觉罗·颙琰', title: '清仁宗', reignStart: '1796年', reignEnd: '1820年', reignYears: 24, eraName: '嘉庆' },
            { name: '爱新觉罗·旻宁', title: '清宣宗', reignStart: '1820年', reignEnd: '1850年', reignYears: 30, eraName: '道光' },
            { name: '爱新觉罗·奕詝', title: '清文宗', reignStart: '1850年', reignEnd: '1861年', reignYears: 11, eraName: '咸丰' },
            { name: '爱新觉罗·载淳', title: '清穆宗', reignStart: '1861年', reignEnd: '1875年', reignYears: 14, eraName: '同治' },
            { name: '爱新觉罗·载湉', title: '清德宗', reignStart: '1875年', reignEnd: '1908年', reignYears: 33, eraName: '光绪' },
            { name: '爱新觉罗·溥仪', title: '清末帝', reignStart: '1908年', reignEnd: '1912年', reignYears: 4, eraName: '宣统' }
        ],
        achievements: [
            '康乾盛世，疆域辽阔',
            '人口大幅增长',
            '《四库全书》的编纂',
            '统一台湾'
        ]
    },
    {
        name: '中华民国',
        startYear: '1912年',
        endYear: '1949年',
        duration: 37,
        capital: '南京（今江苏南京）',
        founder: '孙中山',
        lastEmperor: '蒋介石',
        period: 'modern',
        description: '推翻清朝建立的共和政府，经历了军阀混战、抗日战争等重大历史事件。',
        emperors: [
            { name: '孙中山', title: '临时大总统', reignStart: '1912年', reignEnd: '1912年', reignYears: 1, eraName: '中华民国元年' },
            { name: '袁世凯', title: '大总统', reignStart: '1912年', reignEnd: '1916年', reignYears: 4, eraName: '民国' },
            { name: '蒋介石', title: '国民政府主席', reignStart: '1928年', reignEnd: '1949年', reignYears: 21, eraName: '民国' }
        ],
        achievements: [
            '建立共和政体',
            '推翻封建制度',
            '抗日战争胜利',
            '现代化建设起步'
        ]
    }
])

// 过滤后的朝代
const filteredDynasties = computed(() => {
    let filtered = dynasties.value

    // 按时期过滤
    if (activePeriod.value !== 'all') {
        filtered = filtered.filter(item => item.period === activePeriod.value)
    }

    // 按搜索关键词过滤
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.founder.toLowerCase().includes(query) ||
            item.capital.toLowerCase().includes(query) ||
            item.startYear.includes(query) ||
            item.endYear.includes(query) ||
            item.description.toLowerCase().includes(query)
        )
    }

    return filtered
})

// 过滤朝代
const filterDynasties = () => {
    // 移除分页重置逻辑，因为不再需要分页
}

// 清空搜索
const clearSearch = () => {
    searchQuery.value = ''
    filterDynasties()
}

// 设置活动时期
const setActivePeriod = (period: string) => {
    activePeriod.value = period
}

// 获取时期标题
const getPeriodTitle = () => {
    const period = periods.find(p => p.key === activePeriod.value)
    return period ? `${period.name}朝代` : '历史朝代'
}

// 选择朝代查看详情
const selectDynasty = (dynasty: Dynasty) => {
    selectedDynasty.value = dynasty
    lastViewedDynasty.value = dynasty.name
}

// 返回列表并定位到之前查看的朝代
const backToList = () => {
    selectedDynasty.value = null
    // 等待DOM更新后滚动到指定位置
    nextTick(() => {
        if (lastViewedDynasty.value) {
            scrollToDynasty(lastViewedDynasty.value)
        }
    })
}

// 滚动到指定朝代
const scrollToDynasty = (dynastyName: string) => {
    const element = document.querySelector(`[data-dynasty="${dynastyName}"]`)
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
        // 添加高亮效果
        element.classList.add('highlight')
        setTimeout(() => {
            element.classList.remove('highlight')
        }, 2000)
    }
}

// 导出数据
const exportData = () => {
    const data = filteredDynasties.value.map(item => ({
        朝代名称: item.name,
        起始年份: item.startYear,
        结束年份: item.endYear,
        历时年数: item.duration,
        都城: item.capital,
        开国皇帝: item.founder,
        末代皇帝: item.lastEmperor,
        历史概述: item.description
    }))

    const jsonStr = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'chinese-dynasties.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    showMessage('朝代数据已导出', 'success')
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error') => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 滚动事件处理
const handleScroll = () => {
    const scrollContainer = document.querySelector('.query-content')
    if (scrollContainer) {
        showBackToTop.value = scrollContainer.scrollTop > 300
    }
}

// 回到顶部
const scrollToTop = () => {
    const scrollContainer = document.querySelector('.query-content')
    if (scrollContainer) {
        scrollContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
}

onMounted(() => {
    // 组件挂载时的初始化逻辑
    const scrollContainer = document.querySelector('.query-content')
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll)
    }
})
</script>

<style scoped>
.dynasty-query {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.query-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
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

.query-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.query-actions {
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

.query-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

/* 搜索区域样式 */
.search-section {
    margin-bottom: 2rem;
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
    gap: 1rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: var(--text-secondary);
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.clear-search-btn {
    position: absolute;
    right: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: var(--bg-tertiary);
    border: none;
    border-radius: 0.25rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.clear-search-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.period-filter {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.period-btn {
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.period-btn:hover {
    background: var(--bg-hover);
}

.period-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* 时间轴布局样式 */
.timeline-container {
    padding: 0;
}

.timeline {
    position: relative;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

.timeline-item {
    display: flex;
    margin-bottom: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.timeline-item:hover {
    transform: translateX(4px);
}

.timeline-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 1.5rem;
    flex-shrink: 0;
}

.timeline-dot {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #dc2626;
    border: 3px solid white;
    box-shadow: 0 0 0 3px #e2e8f0;
    flex-shrink: 0;
    z-index: 2;
}

.timeline-line {
    width: 2px;
    flex: 1;
    background: linear-gradient(to bottom, #e2e8f0, transparent);
    margin-top: 0.5rem;
    min-height: 3rem;
}

.timeline-item:last-child .timeline-line {
    display: none;
}

.timeline-content {
    flex: 1;
    min-width: 0;
}

.dynasty-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.dynasty-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    border-color: var(--primary-color);
}

.timeline-item.highlight .dynasty-card {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
    animation: highlightPulse 2s ease-in-out;
}

@keyframes highlightPulse {

    0%,
    100% {
        box-shadow: 0 0 0 3px var(--primary-color-alpha);
    }

    50% {
        box-shadow: 0 0 0 6px var(--primary-color-alpha);
    }
}

.dynasty-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1.5rem;
    transition: all 0.2s ease;
}

.dynasty-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f1f5f9;
}

.dynasty-main {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.dynasty-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.dynasty-period {
    font-size: 0.75rem;
    color: #64748b;
    background: #f1f5f9;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-weight: 500;
    align-self: flex-start;
}

.dynasty-basic {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
}

.dynasty-years {
    font-size: 0.875rem;
    font-weight: 600;
    color: #dc2626;
}

.dynasty-duration {
    font-size: 0.8rem;
    color: #059669;
    background: #ecfdf5;
    padding: 0.125rem 0.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
}

.dynasty-info {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
}

.dynasty-capital {
    color: #475569;
    font-weight: 500;
}

.emperors-count {
    color: #7c3aed;
    font-weight: 600;
}

.dynasty-founder {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 0.75rem;
    font-weight: 500;
}

.dynasty-description {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.6;
}

/* 朝代详情样式 */
.dynasty-detail {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
}

.detail-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.back-detail-btn {
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
}

.back-detail-btn:hover {
    background: var(--bg-hover);
}

.detail-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.detail-content {
    padding: 1.5rem;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.detail-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1.5rem;
}

.detail-card h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 0.5rem;
}

.detail-item {
    display: flex;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
}

.detail-item .label {
    min-width: 6rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.detail-item .value {
    color: var(--text-primary);
    font-weight: 600;
}

.dynasty-description {
    color: var(--text-primary);
    line-height: 1.6;
    margin: 0;
}

.achievements-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.achievements-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
}

.achievements-list li:last-child {
    border-bottom: none;
}

.achievements-list li::before {
    content: '✓';
    color: var(--success-color);
    font-weight: bold;
    margin-right: 0.5rem;
}

/* 历代皇帝独立卡片 */
.emperors-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-top: 1.5rem;
}

.emperors-card h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 0.5rem;
}

/* 皇帝表格样式 */
.emperors-table-container {
    overflow-x: auto;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
}

.emperors-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    background: white;
}

.emperors-table thead {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.emperors-table th {
    padding: 0.75rem 0.5rem;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    white-space: nowrap;
}

.emperors-table td {
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: top;
}

.emperors-table tbody tr:hover {
    background: #f9fafb;
}

.emperors-table tbody tr:last-child td {
    border-bottom: none;
}

.emperor-index {
    text-align: center;
    font-weight: 600;
    color: #6b7280;
    width: 3rem;
}

.emperor-name-table {
    font-weight: 600;
    color: #1f2937;
    min-width: 5rem;
}

.emperor-title-table {
    color: #4b5563;
    font-weight: 500;
    min-width: 6rem;
}

.emperor-reign-table {
    color: #6b7280;
    font-size: 0.8rem;
    min-width: 8rem;
}

.emperor-years-table {
    text-align: center;
    color: #dc2626;
    font-weight: 600;
    width: 4rem;
}

.emperor-era-table {
    color: #7c3aed;
    font-size: 0.8rem;
    line-height: 1.4;
    max-width: 12rem;
    word-break: break-all;
}

/* 消息提示样式 */
.message-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
}

.message-toast.success {
    background: var(--success-color);
}

.message-toast.error {
    background: var(--error-color);
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* 悬浮回到顶部按钮 */
.floating-back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
    z-index: 1000;
}

.floating-back-to-top:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* Timeline事件样式 */
.timeline-events {
    position: relative;
    padding-left: 1.5rem;
}

.timeline-events::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border-color);
}

.timeline-event {
    position: relative;
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
}

.timeline-event:last-child {
    margin-bottom: 0;
}

.event-marker {
    position: absolute;
    left: -1.25rem;
    top: 0.25rem;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    border: 2px solid var(--bg-secondary);
    z-index: 1;
}

.timeline-event.start .event-marker {
    background: var(--success-color);
}

.timeline-event.major .event-marker {
    background: var(--primary-color);
}

.timeline-event.end .event-marker {
    background: var(--error-color);
}

.event-content {
    background: var(--bg-secondary);
    border-radius: 0.5rem;
    padding: 1rem;
    border-left: 3px solid var(--border-color);
}

.timeline-event.start .event-content {
    border-left-color: var(--success-color);
}

.timeline-event.major .event-content {
    border-left-color: var(--primary-color);
}

.timeline-event.end .event-content {
    border-left-color: var(--error-color);
}

.event-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
}

.event-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .timeline {
        max-width: 100%;
        padding: 0;
    }

    .search-container {
        max-width: 100%;
    }

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .dynasty-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .dynasty-basic {
        align-items: flex-start;
    }

    .dynasty-info {
        flex-direction: column;
        gap: 0.25rem;
    }
}

@media (max-width: 768px) {
    .timeline-container {
        padding: 0;
    }

    .timeline-marker {
        margin-right: 1rem;
    }

    .dynasty-card {
        padding: 1rem;
    }

    .dynasty-name {
        font-size: 1.25rem;
    }

    .query-content {
        padding: 1rem;
    }

    .section-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .period-filter {
        justify-content: center;
    }

    .dynasty-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        margin-bottom: 0.375rem;
        padding-bottom: 0.375rem;
    }

    .dynasty-basic {
        flex-direction: column;
        gap: 0.25rem;
    }

    /* 表格响应式 */
    .emperors-table {
        font-size: 0.75rem;
    }

    .emperors-table th,
    .emperors-table td {
        padding: 0.5rem 0.25rem;
    }

    .emperor-era-table {
        font-size: 0.7rem;
        max-width: 8rem;
    }
}

@media (max-width: 480px) {
    .timeline-marker {
        margin-right: 0.75rem;
    }

    .timeline-dot {
        width: 0.75rem;
        height: 0.75rem;
    }

    .dynasty-card {
        padding: 0.75rem;
    }

    .dynasty-name {
        font-size: 1.125rem;
    }

    .dynasty-info {
        flex-direction: column;
        gap: 0.25rem;
    }

    .query-header {
        padding: 0.75rem 1rem;
    }

    .query-title {
        font-size: 1.125rem;
    }

    .query-content {
        padding: 0.75rem;
    }

    .search-container {
        gap: 0.75rem;
    }

    .period-btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.8rem;
    }

    .detail-content {
        padding: 1rem;
    }

    /* 小屏幕表格优化 */
    .emperors-table {
        font-size: 0.7rem;
    }

    .emperors-table th,
    .emperors-table td {
        padding: 0.375rem 0.25rem;
    }

    .emperor-era-table {
        font-size: 0.65rem;
        max-width: 6rem;
    }

    /* 隐藏部分列以节省空间 */
    .emperors-table th:first-child,
    .emperors-table td:first-child {
        display: none;
    }

    /* 移动端回到顶部按钮 */
    .floating-back-to-top {
        bottom: 1rem;
        right: 1rem;
        width: 2.5rem;
        height: 2.5rem;
    }
}
</style>