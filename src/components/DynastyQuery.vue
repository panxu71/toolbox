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
            <!-- 搜索和筛选 -->
            <div class="search-section">
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input v-model="searchQuery" type="text" placeholder="搜索朝代名称、皇帝、年代..." class="search-input"
                            @input="filterDynasties" />
                        <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="period-filter">
                        <button v-for="period in periods" :key="period.key" @click="setActivePeriod(period.key)"
                            :class="['period-btn', { active: activePeriod === period.key }]">
                            {{ period.name }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 朝代时间轴 -->
            <div class="timeline-section" v-if="!selectedDynasty">
                <div class="section-header">
                    <h3>{{ getPeriodTitle() }}</h3>
                    <div class="section-info">
                        <span class="info-text">共 {{ filteredDynasties.length }} 个朝代</span>
                    </div>
                </div>

                <div class="timeline-container">
                    <div class="timeline">
                        <div v-for="dynasty in filteredDynasties" :key="dynasty.name" class="timeline-item"
                            @click="selectDynasty(dynasty)">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div class="dynasty-card">
                                    <div class="dynasty-header">
                                        <h4 class="dynasty-name">{{ dynasty.name }}</h4>
                                        <span class="dynasty-period">{{ dynasty.startYear }} - {{ dynasty.endYear
                                        }}</span>
                                    </div>
                                    <div class="dynasty-info">
                                        <span class="dynasty-duration">历时 {{ dynasty.duration }} 年</span>
                                        <span class="dynasty-capital">都城：{{ dynasty.capital }}</span>
                                    </div>
                                    <div class="dynasty-founder">
                                        <span>开国皇帝：{{ dynasty.founder }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 朝代详情 -->
            <div class="dynasty-detail" v-if="selectedDynasty">
                <div class="detail-header">
                    <button class="back-detail-btn" @click="selectedDynasty = null">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        返回列表
                    </button>
                    <h3>{{ selectedDynasty.name }} 详情</h3>
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
                                <span class="label">存续时间：</span>
                                <span class="value">{{ selectedDynasty.startYear }} - {{ selectedDynasty.endYear
                                    }}</span>
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

                        <div class="detail-card" v-if="selectedDynasty.achievements">
                            <h4>主要成就</h4>
                            <ul class="achievements-list">
                                <li v-for="achievement in selectedDynasty.achievements" :key="achievement">
                                    {{ achievement }}
                                </li>
                            </ul>
                        </div>

                        <div class="detail-card" v-if="selectedDynasty.famousEmperors">
                            <h4>著名皇帝</h4>
                            <div class="emperors-list">
                                <div v-for="emperor in selectedDynasty.famousEmperors" :key="emperor.name"
                                    class="emperor-item">
                                    <span class="emperor-name">{{ emperor.name }}</span>
                                    <span class="emperor-desc">{{ emperor.description }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

defineEmits<{
    back: []
}>()

// 基本状态
const searchQuery = ref('')
const activePeriod = ref('all')
const selectedDynasty = ref<Dynasty | null>(null)

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 时期分类
const periods = [
    { key: 'all', name: '全部' },
    { key: 'ancient', name: '上古' },
    { key: 'imperial', name: '帝制' },
    { key: 'modern', name: '近现代' }
]

// 朝代接口定义
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
    achievements?: string[]
    famousEmperors?: Array<{
        name: string
        description: string
    }>
}

// 朝代数据
const dynasties = ref<Dynasty[]>([
    {
        name: '夏朝',
        startYear: '约前2070年',
        endYear: '约前1600年',
        duration: 470,
        capital: '阳城',
        founder: '禹',
        lastEmperor: '桀',
        period: 'ancient',
        description: '中国历史上第一个世袭制王朝，标志着中国进入奴隶社会。夏朝建立了早期的国家制度，为后世王朝奠定了基础。',
        timeline: [
            { event: '大禹治水', description: '禹治理洪水，获得民心，被推举为领袖', type: 'start' },
            { event: '启继承王位', description: '禹之子启继位，确立世袭制，夏朝正式建立', type: 'major' },
            { event: '桀王暴政', description: '末代君主桀暴虐无道，民心尽失', type: 'end' },
            { event: '商汤灭夏', description: '商汤起兵推翻夏桀，夏朝灭亡', type: 'end' }
        ],
        achievements: [
            '建立了中国第一个世袭制王朝',
            '创立了早期的国家制度',
            '发展了青铜器制造技术',
            '建立了历法制度'
        ],
        famousEmperors: [
            { name: '禹', description: '治水英雄，夏朝开国君主' },
            { name: '启', description: '禹之子，确立世袭制' }
        ]
    },
    {
        name: '商朝',
        startYear: '约前1600年',
        endYear: '约前1046年',
        duration: 554,
        capital: '亳',
        founder: '汤',
        lastEmperor: '纣王',
        period: 'ancient',
        description: '中国历史上第二个王朝，以青铜器和甲骨文著称。商朝在政治、经济、文化等方面都有重要发展。',
        timeline: [
            { event: '商汤灭夏', description: '商汤起兵推翻夏桀，建立商朝', type: 'start' },
            { event: '盘庚迁殷', description: '盘庚迁都至殷，商朝进入鼎盛期', type: 'major' },
            { event: '甲骨文成熟', description: '甲骨文字体系趋于成熟，用于占卜记录', type: 'major' },
            { event: '纣王暴政', description: '纣王沉迷酒色，暴虐无道，民心尽失', type: 'end' },
            { event: '牧野之战', description: '周武王在牧野击败商军，商朝灭亡', type: 'end' }
        ],
        achievements: [
            '发明了甲骨文，是中国最早的成熟文字',
            '青铜器制造达到高峰',
            '建立了完善的祭祀制度',
            '发展了天文历法'
        ],
        famousEmperors: [
            { name: '汤', description: '商朝开国君主，推翻夏桀' },
            { name: '盘庚', description: '迁都殷，史称殷商' },
            { name: '纣王', description: '商朝末代君主，暴虐无道' }
        ]
    },
    {
        name: '西周',
        startYear: '约前1046年',
        endYear: '前771年',
        duration: 275,
        capital: '镐京',
        founder: '周武王',
        lastEmperor: '周幽王',
        period: 'ancient',
        description: '中国历史上第三个王朝，建立了分封制和宗法制，对中国古代政治制度产生深远影响。',
        timeline: [
            { event: '牧野之战', description: '周武王率联军在牧野击败商军，灭商建周', type: 'start' },
            { event: '分封诸侯', description: '周王分封诸侯，建立分封制和宗法制', type: 'major' },
            { event: '成康之治', description: '周成王、周康王时期政治清明，经济繁荣', type: 'major' },
            { event: '国人暴动', description: '周厉王暴政引发国人暴动，王室衰落', type: 'major' },
            { event: '犬戎入侵', description: '犬戎攻破镐京，周幽王被杀，西周灭亡', type: 'end' }
        ],
        achievements: [
            '建立了分封制和宗法制',
            '制定了礼乐制度',
            '发展了农业和手工业',
            '创立了"天命"思想'
        ],
        famousEmperors: [
            { name: '周武王', description: '西周开国君主，灭商建周' },
            { name: '周成王', description: '巩固周朝统治' },
            { name: '周康王', description: '成康之治的缔造者之一' }
        ]
    }
])
// 继续添加更多朝代数据
dynasties.value.push(
    {
        name: '东周',
        startYear: '前770年',
        endYear: '前256年',
        duration: 514,
        capital: '洛邑',
        founder: '周平王',
        lastEmperor: '周赧王',
        period: 'ancient',
        description: '分为春秋和战国两个时期，是中国思想文化最为繁荣的时代，诸子百家争鸣。',
        timeline: [
            { event: '平王东迁', description: '周平王迁都洛邑，东周开始', type: 'start' },
            { event: '春秋争霸', description: '齐桓公、晋文公等五霸相继称霸', type: 'major' },
            { event: '孔子诞生', description: '孔子出生，儒家思想开始形成', type: 'major' },
            { event: '战国七雄', description: '进入战国时期，七国争雄', type: 'major' },
            { event: '诸子百家', description: '思想文化繁荣，诸子百家争鸣', type: 'major' },
            { event: '秦灭东周', description: '秦昭襄王灭东周，周朝彻底结束', type: 'end' }
        ],
        achievements: [
            '春秋战国时期诸子百家争鸣',
            '铁器的广泛使用',
            '商业和手工业的发展',
            '军事技术的进步'
        ],
        famousEmperors: [
            { name: '周平王', description: '东周开国君主，迁都洛邑' }
        ]
    },
    {
        name: '秦朝',
        startYear: '前221年',
        endYear: '前206年',
        duration: 15,
        capital: '咸阳',
        founder: '秦始皇',
        lastEmperor: '秦二世',
        period: 'imperial',
        description: '中国历史上第一个统一的中央集权制帝国，建立了郡县制，统一了文字、货币、度量衡。',
        timeline: [
            { event: '统一六国', description: '秦始皇统一六国，建立中央集权制帝国', type: 'start' },
            { event: '统一文字', description: '统一文字、货币、度量衡，加强中央集权', type: 'major' },
            { event: '修建长城', description: '连接各国长城，修建万里长城', type: 'major' },
            { event: '焚书坑儒', description: '焚烧典籍，坑杀儒生，加强思想控制', type: 'major' },
            { event: '始皇帝死', description: '秦始皇死于巡游途中，帝国开始动荡', type: 'end' },
            { event: '陈胜吴广起义', description: '农民起义爆发，秦朝迅速灭亡', type: 'end' }
        ],
        achievements: [
            '统一六国，建立中央集权制',
            '统一文字、货币、度量衡',
            '修建万里长城',
            '建立郡县制'
        ],
        famousEmperors: [
            { name: '秦始皇', description: '千古一帝，统一中国' },
            { name: '秦二世', description: '秦朝末代皇帝' }
        ]
    },
    {
        name: '西汉',
        startYear: '前202年',
        endYear: '8年',
        duration: 210,
        capital: '长安',
        founder: '汉高祖刘邦',
        lastEmperor: '汉平帝',
        period: 'imperial',
        description: '中国历史上重要的统一王朝，开创了汉族的称谓，建立了丝绸之路，文化繁荣。',
        timeline: [
            { event: '楚汉争霸', description: '刘邦击败项羽，建立汉朝', type: 'start' },
            { event: '文景之治', description: '汉文帝、汉景帝时期政治清明，经济繁荣', type: 'major' },
            { event: '汉武盛世', description: '汉武帝开疆拓土，开辟丝绸之路', type: 'major' },
            { event: '昭宣中兴', description: '汉昭帝、汉宣帝时期国力恢复', type: 'major' },
            { event: '王莽篡汉', description: '王莽篡夺皇位，建立新朝，西汉灭亡', type: 'end' }
        ],
        achievements: [
            '开辟丝绸之路',
            '推行"文景之治"',
            '建立太学，重视教育',
            '发展农业和手工业'
        ],
        famousEmperors: [
            { name: '汉高祖刘邦', description: '西汉开国皇帝' },
            { name: '汉文帝', description: '文景之治的缔造者' },
            { name: '汉武帝', description: '雄才大略，开疆拓土' }
        ]
    },
    {
        name: '东汉',
        startYear: '25年',
        endYear: '220年',
        duration: 195,
        capital: '洛阳',
        founder: '汉光武帝',
        lastEmperor: '汉献帝',
        period: 'imperial',
        description: '汉朝的延续，科技文化继续发展，出现了造纸术等重要发明。',
        timeline: [
            { event: '光武中兴', description: '刘秀推翻王莽，重建汉朝', type: 'start' },
            { event: '明章之治', description: '汉明帝、汉章帝时期政治稳定', type: 'major' },
            { event: '蔡伦造纸', description: '蔡伦改进造纸术，促进文化传播', type: 'major' },
            { event: '张衡发明', description: '张衡发明地动仪，科技发达', type: 'major' },
            { event: '黄巾起义', description: '张角领导黄巾起义，东汉衰落', type: 'major' },
            { event: '董卓乱政', description: '董卓专权，汉献帝成为傀儡', type: 'end' },
            { event: '曹丕篡汉', description: '曹丕逼迫汉献帝禅让，东汉灭亡', type: 'end' }
        ],
        achievements: [
            '蔡伦改进造纸术',
            '张衡发明地动仪',
            '医学著作《伤寒杂病论》',
            '佛教传入中国'
        ],
        famousEmperors: [
            { name: '汉光武帝', description: '东汉开国皇帝，光武中兴' },
            { name: '汉明帝', description: '明章之治的缔造者' }
        ]
    },
    {
        name: '唐朝',
        startYear: '618年',
        endYear: '907年',
        duration: 289,
        capital: '长安',
        founder: '唐高祖李渊',
        lastEmperor: '唐哀帝',
        period: 'imperial',
        description: '中国历史上最强盛的王朝之一，政治开明，文化繁荣，国际交流频繁，被誉为盛唐。',
        achievements: [
            '贞观之治、开元盛世',
            '科举制度的完善',
            '诗歌文化的巅峰',
            '国际交流的繁荣'
        ],
        famousEmperors: [
            { name: '唐太宗李世民', description: '贞观之治，千古明君' },
            { name: '武则天', description: '中国历史上唯一的女皇帝' },
            { name: '唐玄宗', description: '开元盛世的缔造者' }
        ]
    },
    {
        name: '宋朝',
        startYear: '960年',
        endYear: '1279年',
        duration: 319,
        capital: '开封/临安',
        founder: '宋太祖赵匡胤',
        lastEmperor: '宋末帝',
        period: 'imperial',
        description: '分为北宋和南宋，经济文化高度发达，科技发明众多，是中国古代科技的黄金时代。',
        achievements: [
            '四大发明中的三项（印刷术、火药、指南针）',
            '经济的高度发展',
            '理学的兴起',
            '文学艺术的繁荣'
        ],
        famousEmperors: [
            { name: '宋太祖赵匡胤', description: '宋朝开国皇帝，杯酒释兵权' },
            { name: '宋仁宗', description: '仁宗盛治，文化繁荣' }
        ]
    },
    {
        name: '明朝',
        startYear: '1368年',
        endYear: '1644年',
        duration: 276,
        capital: '南京/北京',
        founder: '明太祖朱元璋',
        lastEmperor: '崇祯帝',
        period: 'imperial',
        description: '中国历史上最后一个由汉族建立的大一统王朝，郑和下西洋，紫禁城建成。',
        achievements: [
            '郑和七下西洋',
            '修建紫禁城',
            '编纂《永乐大典》',
            '发展农业和手工业'
        ],
        famousEmperors: [
            { name: '明太祖朱元璋', description: '明朝开国皇帝，从乞丐到皇帝' },
            { name: '明成祖朱棣', description: '永乐大帝，迁都北京' },
            { name: '崇祯帝', description: '明朝末代皇帝，勤政但无力回天' }
        ]
    },
    {
        name: '清朝',
        startYear: '1636年',
        endYear: '1912年',
        duration: 276,
        capital: '北京',
        founder: '清太宗皇太极',
        lastEmperor: '溥仪',
        period: 'imperial',
        description: '中国历史上最后一个封建王朝，由满族建立，经历了康乾盛世，但后期闭关锁国，最终被推翻。',
        achievements: [
            '康乾盛世，疆域辽阔',
            '人口大幅增长',
            '《四库全书》的编纂',
            '统一台湾'
        ],
        famousEmperors: [
            { name: '康熙帝', description: '康乾盛世的开创者，在位61年' },
            { name: '雍正帝', description: '勤政皇帝，改革吏治' },
            { name: '乾隆帝', description: '十全老人，文治武功' }
        ]
    }
)

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

onMounted(() => {
    // 组件挂载时的初始化逻辑
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
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

/* 搜索区域样式 */
.search-section {
    margin-bottom: 2rem;
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

/* 时间轴样式 */
.timeline-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
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
    gap: 0.5rem;
}

.info-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.timeline-container {
    padding: 1.5rem;
}

.timeline {
    position: relative;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 1rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--border-color);
}

.timeline-item {
    position: relative;
    margin-bottom: 2rem;
    cursor: pointer;
}

.timeline-marker {
    position: absolute;
    left: 0.5rem;
    top: 1rem;
    width: 1rem;
    height: 1rem;
    background: var(--primary-color);
    border-radius: 50%;
    border: 3px solid var(--bg-secondary);
    z-index: 1;
}

.timeline-content {
    margin-left: 3rem;
}

.dynasty-card {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1.5rem;
    transition: all 0.2s ease;
}

.dynasty-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
}

.dynasty-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.dynasty-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.dynasty-period {
    font-size: 0.875rem;
    color: var(--text-secondary);
    background: var(--bg-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
}

.dynasty-info {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.dynasty-founder {
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* 朝代详情样式 */
.dynasty-detail {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    overflow: hidden;
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

.emperors-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.emperor-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 0.5rem;
    border-left: 4px solid var(--primary-color);
}

.emperor-name {
    font-weight: 600;
    color: var(--text-primary);
}

.emperor-desc {
    font-size: 0.875rem;
    color: var(--text-secondary);
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

/* 响应式设计 */
@media (max-width: 1024px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }

    .dynasty-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .dynasty-info {
        flex-direction: column;
        gap: 0.25rem;
    }
}

@media (max-width: 768px) {
    .query-content {
        padding: 1rem;
    }

    .section-header {
        padding: 1rem;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .period-filter {
        justify-content: center;
    }

    .timeline-container {
        padding: 1rem;
    }

    .timeline-content {
        margin-left: 2rem;
    }

    .dynasty-card {
        padding: 1rem;
    }
}

@media (max-width: 480px) {
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
}
</style>