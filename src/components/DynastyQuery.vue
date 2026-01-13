<template>
    <div class="dynasty-query">
        <PageHeader :title="cardTitle" @back="$emit('back')" />

        <div class="dynasty-content">
            <!-- 搜索和筛选区域 - 只在列表页面显示 -->
            <SearchSection v-if="!selectedDynasty" :searchQuery="searchQuery" @update:searchQuery="searchQuery = $event"
                placeholder="搜索朝代名称、皇帝姓名..." :filters="periodFilters" :activeFilter="activePeriod"
                @update:activeFilter="activePeriod = $event" />

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
                                        </div>
                                        <div class="dynasty-basic">
                                            <span class="dynasty-years">{{ dynasty.startYear }} - {{ dynasty.endYear
                                            }}</span>
                                            <span class="dynasty-duration">{{ dynasty.duration }}年</span>
                                        </div>
                                        <div class="dynasty-info">
                                            <span class="dynasty-capital">都城：{{ dynasty.capital }}</span>
                                            <span class="emperors-count">皇帝：{{ dynasty.emperors?.length || 0 }}位</span>
                                        </div>
                                        <div class="dynasty-founder">
                                            开国：{{ dynasty.founder }} → 末代：{{ dynasty.lastEmperor }}
                                        </div>
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

                            <div v-if="selectedDynasty.achievements" class="achievements-section">
                                <h5>主要成就</h5>
                                <ul class="achievements-list">
                                    <li v-for="achievement in selectedDynasty.achievements" :key="achievement">
                                        {{ achievement }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="detail-card">
                            <h4>历史概述</h4>
                            <p class="dynasty-description">{{ selectedDynasty.description }}</p>
                        </div>
                    </div>

                    <!-- 历代皇帝 -->
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
                                        <th>生卒年份</th>
                                        <th>享年</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(emperor, index) in selectedDynasty.emperors || []" :key="emperor.name">
                                        <td class="emperor-index">{{ index + 1 }}</td>
                                        <td class="emperor-title-table">{{ emperor.title }}</td>
                                        <td class="emperor-era-table">{{ emperor.eraName || '-' }}</td>
                                        <td class="emperor-name-table">{{ emperor.name }}</td>
                                        <td class="emperor-reign-table">
                                            {{ emperor.reignStart }} - {{ emperor.reignEnd }}
                                        </td>
                                        <td class="emperor-years-table">{{ typeof emperor.reignYears === 'number' ?
                                            emperor.reignYears + '年' : emperor.reignYears }}</td>
                                        <td class="emperor-birth-death">
                                            <span v-if="emperor.birth === '不详' || emperor.death === '不详'">不详</span>
                                            <span v-else-if="emperor.birth && emperor.death">
                                                {{ emperor.birth }} - {{ emperor.death }}
                                            </span>
                                            <span v-else>-</span>
                                        </td>
                                        <td class="emperor-age">
                                            <span v-if="emperor.age === '不详'">不详</span>
                                            <span v-else-if="emperor.age">{{ emperor.age }}</span>
                                            <span v-else>-</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 回到顶部按钮 -->
        <ScrollToTop container=".dynasty-content" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import PageHeader from './common/PageHeader.vue'
import SearchSection from './common/SearchSection.vue'
import ScrollToTop from './common/ScrollToTop.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
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

// 使用页面标题管理
usePageTitle('dynasty-query')
const cardTitle = getCardTitle('dynasty-query')

// 基本状态
const searchQuery = ref('')
const activePeriod = ref('all')
const selectedDynasty = ref<Dynasty | null>(null)
const lastViewedDynasty = ref<string | null>(null)

// 时期分类
const periods = [
    { key: 'all', name: '全部' },
    { key: 'ancient', name: '上古' },
    { key: 'imperial', name: '帝制' },
    { key: 'modern', name: '近现代' }
]

// 筛选选项 - 为SearchSection组件提供
const periodFilters = computed(() =>
    periods.map(period => ({
        key: period.key,
        name: period.name,
        count: period.key === 'all'
            ? dynasties.value.length
            : dynasties.value.filter(d => d.period === period.key).length
    }))
)

// 朝代接口定义
interface Emperor {
    name: string
    title: string
    reignStart: string
    reignEnd: string
    reignYears: number | string
    eraName?: string
    birth?: string
    death?: string
    age?: number | string
    dynasty?: string
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
    emperors?: Emperor[]
    achievements?: string[]
}

// 朝代数据 - 完整版，基于权威资料整理的22个主要朝代
const dynasties = ref<Dynasty[]>([
    {
        name: '夏朝',
        startYear: '约前2070年',
        endYear: '约前1600年',
        duration: 470,
        capital: '阳城、斟鄩、安邑等地',
        founder: '禹',
        lastEmperor: '桀',
        period: 'ancient',
        description: '中国史书中记载的第一个奴隶制朝代，也是中国历史上第一个世袭王权的朝代。夏朝实际是由氏族为核心发展形成的国家，一般认为夏朝共传14代、17后（夏统治者在位称"后"，去世后称"帝"）。\n\n夏朝的兴起：夏是黄河中游地区一个历史悠久的部落联盟，由十多个姒姓部落所组成，夏后氏在这些部落中居于领导地位。尧、舜时期逐步强大，鲧治水失败被杀。鲧子禹，继承父业，并取得了治水的成功，得到众多部落首领支持拥护，成为诸夏族最高领导者。禹本来传位于益，但益却让位给禹子启，这被看作是中国历史上"家天下"的开始，标志着禅让制的结束。\n\n夏朝的发展：夏朝疆域西起河南省西部、山西省南部，东至河南省、山东省和河北省三省交界处，南达湖北省北部，北及河北省南部，地理中心是今河南偃师、登封、新密、禹州一带。夏朝时形成了完善的官僚制度、赋税制度，建立了军队、制定刑法、设置监狱，还建立了礼制。\n\n夏朝的衰亡：夏朝后期，第十七任君主桀即位后荒淫无度、暴虐无道，天下诸侯大多背弃桀而投靠商汤。商汤于是起兵讨伐桀，在鸣条之战将他击败后放逐到南方，夏朝自此灭亡。\n\n河南洛阳偃师二里头遗址的发现揭开了古老"夏都"的神秘面纱，为夏朝都城遗存已逐渐成为学界共识。夏朝历时约470年，共有17位君主。',
        emperors: [
            { name: '禹(Yǔ)', title: '夏禹', reignStart: '约前2070年', reignEnd: '约前2061年', reignYears: 9, birth: '不详', death: '不详', age: '不详' },
            { name: '启(Qǐ)', title: '夏启', reignStart: '约前2061年', reignEnd: '约前2051年', reignYears: 10, birth: '不详', death: '不详', age: '不详' },
            { name: '太康(Tài Kāng)', title: '夏太康', reignStart: '约前2051年', reignEnd: '约前2022年', reignYears: 29, birth: '不详', death: '不详', age: '不详' },
            { name: '仲康(Zhòng Kāng)', title: '夏仲康', reignStart: '约前2022年', reignEnd: '约前2009年', reignYears: 13, birth: '不详', death: '不详', age: '不详' },
            { name: '相(Xiāng)', title: '夏相', reignStart: '约前2009年', reignEnd: '约前1981年', reignYears: 28, birth: '不详', death: '不详', age: '不详' },
            { name: '少康(Shào Kāng)', title: '夏少康', reignStart: '约前1981年', reignEnd: '约前1960年', reignYears: 21, birth: '不详', death: '不详', age: '不详' },
            { name: '予(Yǔ)', title: '夏予', reignStart: '约前1960年', reignEnd: '约前1943年', reignYears: 17, birth: '不详', death: '不详', age: '不详' },
            { name: '槐(Huái)', title: '夏槐', reignStart: '约前1943年', reignEnd: '约前1900年', reignYears: 43, birth: '不详', death: '不详', age: '不详' },
            { name: '芒(Máng)', title: '夏芒', reignStart: '约前1900年', reignEnd: '约前1882年', reignYears: 18, birth: '不详', death: '不详', age: '不详' },
            { name: '泄(Xiè)', title: '夏泄', reignStart: '约前1882年', reignEnd: '约前1866年', reignYears: 16, birth: '不详', death: '不详', age: '不详' },
            { name: '不降(Bù Jiàng)', title: '夏不降', reignStart: '约前1866年', reignEnd: '约前1808年', reignYears: 58, birth: '不详', death: '不详', age: '不详' },
            { name: '扃(Jiōng)', title: '夏扃', reignStart: '约前1808年', reignEnd: '约前1788年', reignYears: 20, birth: '不详', death: '不详', age: '不详' },
            { name: '廑(Jǐn)', title: '夏廑', reignStart: '约前1788年', reignEnd: '约前1780年', reignYears: 8, birth: '不详', death: '不详', age: '不详' },
            { name: '孔甲(Kǒng Jiǎ)', title: '夏孔甲', reignStart: '约前1780年', reignEnd: '约前1749年', reignYears: 31, birth: '不详', death: '不详', age: '不详' },
            { name: '皋(Gāo)', title: '夏皋', reignStart: '约前1749年', reignEnd: '约前1738年', reignYears: 11, birth: '不详', death: '不详', age: '不详' },
            { name: '发(Fā)', title: '夏发', reignStart: '约前1738年', reignEnd: '约前1729年', reignYears: 9, birth: '不详', death: '不详', age: '不详' },
            { name: '桀(Jié)', title: '夏桀', reignStart: '约前1729年', reignEnd: '约前1600年', reignYears: 129, birth: '不详', death: '不详', age: '不详' }
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
        description: '中国历史上第二个王朝，也是中国第一个有直接文字记载同时期的王朝。商朝约存在于公元前1600年至公元前1046年，经历了三个大的阶段：先商、早商、晚商，前后相传17世31王。\n\n商朝处于奴隶社会时期，奴隶主贵族是统治阶级，形成了庞大的官僚统治机构和军队。商朝农业和手工业较发达，且有了原始的瓷器。商朝的手工业作坊规模很大，能制造出精美的青铜器，如司母戊鼎等。\n\n商朝文字系统比较成熟，其文字系统为甲骨文，这是中国最早的成熟文字系统。商朝历法也比较完备，采用干支纪日，一年分12个月。商朝的都城最初在亳（今河南商丘），后迁至殷（今河南安阳），因此商朝又称殷商。\n\n商朝的疆域，东到大海，西到陕西，南到长江流域，北到河北、山西一带。商朝历时约554年，共有30位君主。',
        emperors: [
            { name: '汤(Tāng)', title: '商汤王', reignStart: '约前1675年', reignEnd: '约前1646年', reignYears: 29, birth: '不详', death: '不详', age: '不详' },
            { name: '太丁(Tài Dīng)', title: '商太丁', reignStart: '约前1646年', reignEnd: '约前1644年', reignYears: 2, birth: '不详', death: '不详', age: '不详' },
            { name: '外丙(Wài Bǐng)', title: '商外丙', reignStart: '约前1644年', reignEnd: '约前1642年', reignYears: 2, birth: '不详', death: '不详', age: '不详' },
            { name: '中壬(Zhōng Rén)', title: '商中壬', reignStart: '约前1642年', reignEnd: '约前1638年', reignYears: 4, birth: '不详', death: '不详', age: '不详' },
            { name: '太甲(Tài Jiǎ)', title: '商太甲', reignStart: '约前1638年', reignEnd: '约前1615年', reignYears: 23, birth: '不详', death: '不详', age: '不详' },
            { name: '沃丁(Wò Dīng)', title: '商沃丁', reignStart: '约前1615年', reignEnd: '约前1587年', reignYears: 28, birth: '不详', death: '不详', age: '不详' },
            { name: '太庚(Tài Gēng)', title: '商太庚', reignStart: '约前1587年', reignEnd: '约前1562年', reignYears: 25, birth: '不详', death: '不详', age: '不详' },
            { name: '小甲(Xiǎo Jiǎ)', title: '商小甲', reignStart: '约前1562年', reignEnd: '约前1545年', reignYears: 17, birth: '不详', death: '不详', age: '不详' },
            { name: '雍己(Yōng Jǐ)', title: '商雍己', reignStart: '约前1545年', reignEnd: '约前1533年', reignYears: 12, birth: '不详', death: '不详', age: '不详' },
            { name: '太戊(Tài Wù)', title: '商太戊', reignStart: '约前1533年', reignEnd: '约前1459年', reignYears: 74, birth: '不详', death: '不详', age: '不详' },
            { name: '中丁(Zhōng Dīng)', title: '商中丁', reignStart: '约前1459年', reignEnd: '约前1450年', reignYears: 9, birth: '不详', death: '不详', age: '不详' },
            { name: '外壬(Wài Rén)', title: '商外壬', reignStart: '约前1450年', reignEnd: '约前1435年', reignYears: 15, birth: '不详', death: '不详', age: '不详' },
            { name: '河亶甲(Hé Dǎn Jiǎ)', title: '商河亶甲', reignStart: '约前1435年', reignEnd: '约前1427年', reignYears: 8, birth: '不详', death: '不详', age: '不详' },
            { name: '祖乙(Zǔ Yǐ)', title: '商祖乙', reignStart: '约前1427年', reignEnd: '约前1409年', reignYears: 18, birth: '不详', death: '不详', age: '不详' },
            { name: '祖辛(Zǔ Xīn)', title: '商祖辛', reignStart: '约前1409年', reignEnd: '约前1393年', reignYears: 16, birth: '不详', death: '不详', age: '不详' },
            { name: '沃甲(Wò Jiǎ)', title: '商沃甲', reignStart: '约前1393年', reignEnd: '约前1368年', reignYears: 25, birth: '不详', death: '不详', age: '不详' },
            { name: '祖丁(Zǔ Dīng)', title: '商祖丁', reignStart: '约前1368年', reignEnd: '约前1336年', reignYears: 32, birth: '不详', death: '不详', age: '不详' },
            { name: '南庚(Nán Gēng)', title: '商南庚', reignStart: '约前1336年', reignEnd: '约前1308年', reignYears: 28, birth: '不详', death: '不详', age: '不详' },
            { name: '阳甲(Yáng Jiǎ)', title: '商阳甲', reignStart: '约前1308年', reignEnd: '约前1301年', reignYears: 7, birth: '不详', death: '不详', age: '不详' },
            { name: '盘庚(Pán Gēng)', title: '商盘庚', reignStart: '约前1301年', reignEnd: '约前1273年', reignYears: 28, birth: '不详', death: '不详', age: '不详' },
            { name: '小辛(Xiǎo Xīn)', title: '商小辛', reignStart: '约前1273年', reignEnd: '约前1270年', reignYears: 3, birth: '不详', death: '不详', age: '不详' },
            { name: '小乙(Xiǎo Yǐ)', title: '商小乙', reignStart: '约前1270年', reignEnd: '约前1251年', reignYears: 19, birth: '不详', death: '不详', age: '不详' },
            { name: '武丁(Wǔ Dīng)', title: '商武丁', reignStart: '约前1251年', reignEnd: '约前1192年', reignYears: 59, birth: '不详', death: '不详', age: '不详' },
            { name: '祖庚(Zǔ Gēng)', title: '商祖庚', reignStart: '约前1192年', reignEnd: '约前1181年', reignYears: 11, birth: '不详', death: '不详', age: '不详' },
            { name: '祖甲(Zǔ Jiǎ)', title: '商祖甲', reignStart: '约前1181年', reignEnd: '约前1148年', reignYears: 33, birth: '不详', death: '不详', age: '不详' },
            { name: '廪辛(Lǐn Xīn)', title: '商廪辛', reignStart: '约前1148年', reignEnd: '约前1142年', reignYears: 6, birth: '不详', death: '不详', age: '不详' },
            { name: '康丁(Kāng Dīng)', title: '商康丁', reignStart: '约前1142年', reignEnd: '约前1134年', reignYears: 8, birth: '不详', death: '不详', age: '不详' },
            { name: '武乙(Wǔ Yǐ)', title: '商武乙', reignStart: '约前1134年', reignEnd: '约前1115年', reignYears: 19, birth: '不详', death: '不详', age: '不详' },
            { name: '文丁(Wén Dīng)', title: '商文丁', reignStart: '约前1115年', reignEnd: '约前1102年', reignYears: 13, birth: '不详', death: '不详', age: '不详' },
            { name: '帝乙(Dì Yǐ)', title: '商帝乙', reignStart: '约前1102年', reignEnd: '约前1076年', reignYears: 26, birth: '不详', death: '不详', age: '不详' },
            { name: '纣王(Zhòu Wáng)', title: '商纣王', reignStart: '约前1076年', reignEnd: '约前1046年', reignYears: 30, birth: '不详', death: '不详', age: '不详' }
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
        description: '中国历史上第三个王朝，由周武王姬发建立。西周实行分封制、井田制和宗法制，奠定了中国古代政治制度的基础。\n\n政治上实行分封制，周王把土地和人民分封给诸侯，诸侯在自己的领地内享有统治权；经济上实行井田制，土地名义上属于周王，实际上由各级贵族占有；社会关系方面实行宗法制，以血缘关系为纽带。西周建立了完备的礼乐制度，强调等级秩序和道德规范。\n\n西周的疆域比商朝有所扩大，东到大海，西到甘肃，南到长江流域，北到辽宁。西周前期政治清明，经济繁荣，被称为"成康之治"。后期由于土地兼并严重，阶级矛盾尖锐，加上外族入侵，最终在公元前771年被犬戎攻破，周幽王被杀，西周灭亡。\n\n西周历时约275年，共有12位君主。',
        emperors: [
            { name: '姬发', title: '周武王', reignStart: '约前1046年', reignEnd: '约前1043年', reignYears: 3, birth: '不详', death: '不详', age: '不详' },
            { name: '姬诵', title: '周成王', reignStart: '约前1042年', reignEnd: '约前1021年', reignYears: 21, birth: '不详', death: '不详', age: '不详' },
            { name: '姬钊', title: '周康王', reignStart: '约前1020年', reignEnd: '约前996年', reignYears: 24, birth: '不详', death: '不详', age: '不详' },
            { name: '姬瑕', title: '周昭王', reignStart: '约前995年', reignEnd: '约前977年', reignYears: 18, birth: '不详', death: '不详', age: '不详' },
            { name: '姬满', title: '周穆王', reignStart: '约前976年', reignEnd: '约前922年', reignYears: 54, birth: '不详', death: '不详', age: '不详' },
            { name: '姬繄扈(yī hù)', title: '周共王', reignStart: '约前922年', reignEnd: '约前900年', reignYears: 22, birth: '不详', death: '不详', age: '不详' },
            { name: '姬囏(jiān)', title: '周懿王', reignStart: '约前899年', reignEnd: '约前892年', reignYears: 7, birth: '不详', death: '不详', age: '不详' },
            { name: '姬辟方', title: '周孝王', reignStart: '约前891年', reignEnd: '约前886年', reignYears: 5, birth: '不详', death: '不详', age: '不详' },
            { name: '姬燮(xiè)', title: '周夷王', reignStart: '约前885年', reignEnd: '约前878年', reignYears: 7, birth: '不详', death: '不详', age: '不详' },
            { name: '姬胡', title: '周厉王', reignStart: '约前877年', reignEnd: '约前841年', reignYears: 36, birth: '不详', death: '不详', age: '不详' },
            { name: '姬静', title: '周宣王', reignStart: '约前827年', reignEnd: '约前782年', reignYears: 45, birth: '不详', death: '不详', age: '不详' },
            { name: '姬宫湦(shēng)', title: '周幽王', reignStart: '前781年', reignEnd: '前771年', reignYears: 10, birth: '不详', death: '不详', age: '不详' }
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
        description: '西周灭亡后，周平王东迁洛邑建立的王朝，分为春秋和战国两个时期。东周时期，周王室衰微，诸侯争霸，礼崩乐坏，但却是中国思想文化最为繁荣的时代。\n\n春秋时期（公元前770年-公元前476年），先后出现了"春秋五霸"：齐桓公、晋文公、楚庄王、吴王阖闾、越王勾践。战国时期（公元前475年-公元前221年），形成了"战国七雄"：齐、楚、燕、韩、赵、魏、秦的格局。\n\n东周时期是中国古代思想文化的黄金时代，出现了孔子、老子、墨子、孟子、荀子、韩非子等思想家，形成了儒家、道家、墨家、法家等诸子百家争鸣的局面。这一时期铁器广泛使用，农业生产力大幅提高，商业和手工业也得到很大发展。\n\n东周最终被秦国所灭，结束了长达514年的历史，共有25位君主。',
        emperors: [
            { name: '姬宜臼(Yí Jiù)', title: '周平王', reignStart: '前770年', reignEnd: '前720年', reignYears: 50, birth: '约前795年', death: '约前720年', age: '约75岁' },
            { name: '姬林(Lín)', title: '周桓王', reignStart: '前719年', reignEnd: '前697年', reignYears: 22, birth: '约前743年', death: '约前697年', age: '约46岁' },
            { name: '姬佗(Tuó)', title: '周庄王', reignStart: '前696年', reignEnd: '前682年', reignYears: 14, birth: '约前717年', death: '约前682年', age: '约35岁' },
            { name: '姬胡齐(Hú Qí)', title: '周釐王', reignStart: '前681年', reignEnd: '前677年', reignYears: 4, birth: '约前705年', death: '约前677年', age: '约28岁' },
            { name: '姬阆(Láng)', title: '周惠王', reignStart: '前676年', reignEnd: '前652年', reignYears: 24, birth: '约前700年', death: '约前652年', age: '约48岁' },
            { name: '姬郑(Zhèng)', title: '周襄王', reignStart: '前651年', reignEnd: '前619年', reignYears: 32, birth: '约前683年', death: '约前619年', age: '约64岁' },
            { name: '姬壬臣(Rén Chén)', title: '周顷王', reignStart: '前618年', reignEnd: '前613年', reignYears: 5, birth: '约前650年', death: '约前613年', age: '约37岁' },
            { name: '姬班(Bān)', title: '周匡王', reignStart: '前612年', reignEnd: '前607年', reignYears: 5, birth: '约前645年', death: '约前607年', age: '约38岁' },
            { name: '姬瑜(Yú)', title: '周定王', reignStart: '前606年', reignEnd: '前586年', reignYears: 20, birth: '约前633年', death: '约前586年', age: '约47岁' },
            { name: '姬夷(Yí)', title: '周简王', reignStart: '前585年', reignEnd: '前572年', reignYears: 13, birth: '约前610年', death: '约前572年', age: '约38岁' },
            { name: '姬泄心(Xiè Xīn)', title: '周灵王', reignStart: '前571年', reignEnd: '前545年', reignYears: 26, birth: '约前597年', death: '约前545年', age: '约52岁' },
            { name: '姬贵(Guì)', title: '周景王', reignStart: '前544年', reignEnd: '前521年', reignYears: 23, birth: '约前571年', death: '约前521年', age: '约50岁' },
            { name: '姬猛(Měng)', title: '周悼王', reignStart: '前520年', reignEnd: '前520年', reignYears: '6个月', birth: '约前548年', death: '约前520年', age: '28岁' },
            { name: '姬丐(Gài)', title: '周敬王', reignStart: '前519年', reignEnd: '前476年', reignYears: 43, birth: '约前547年', death: '约前476年', age: '约71岁' },
            { name: '姬仁(Rén)', title: '周元王', reignStart: '前475年', reignEnd: '前469年', reignYears: 6, birth: '约前510年', death: '约前469年', age: '约41岁' },
            { name: '姬介(Jiè)', title: '周贞定王', reignStart: '前468年', reignEnd: '前441年', reignYears: 27, birth: '约前495年', death: '约前441年', age: '约54岁' },
            { name: '姬去疾(Qù Jí)', title: '周哀王', reignStart: '前441年', reignEnd: '前441年', reignYears: '3个月', birth: '约前468年', death: '约前441年', age: '27岁' },
            { name: '姬叔(Shū)', title: '周思王', reignStart: '前441年', reignEnd: '前441年', reignYears: '5个月', birth: '约前465年', death: '约前441年', age: '24岁' },
            { name: '姬嵬(Wéi)', title: '周考王', reignStart: '前440年', reignEnd: '前426年', reignYears: 14, birth: '约前467年', death: '约前426年', age: '约41岁' },
            { name: '姬午(Wǔ)', title: '周威烈王', reignStart: '前425年', reignEnd: '前402年', reignYears: 23, birth: '约前450年', death: '约前402年', age: '约48岁' },
            { name: '姬骄(Jiāo)', title: '周安王', reignStart: '前401年', reignEnd: '前376年', reignYears: 25, birth: '约前426年', death: '约前376年', age: '约50岁' },
            { name: '姬喜(Xǐ)', title: '周烈王', reignStart: '前375年', reignEnd: '前369年', reignYears: 6, birth: '约前400年', death: '约前369年', age: '约31岁' },
            { name: '姬扁(Biǎn)', title: '周显王', reignStart: '前368年', reignEnd: '前321年', reignYears: 47, birth: '约前395年', death: '约前321年', age: '约74岁' },
            { name: '姬定(Dìng)', title: '周慎靓王', reignStart: '前320年', reignEnd: '前315年', reignYears: 5, birth: '约前350年', death: '约前315年', age: '约35岁' },
            { name: '姬延(Yán)', title: '周赧王', reignStart: '前314年', reignEnd: '前256年', reignYears: 58, birth: '约前372年', death: '约前256年', age: '约116岁' }
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
        description: '中国历史上第一个统一的中央集权制帝国，由秦始皇嬴政建立。秦朝结束了春秋战国以来长期分裂割据的局面，建立了中国历史上第一个统一的多民族的中央集权国家。\n\n东周末期，战国七雄争霸，秦国通过商鞅变法逐渐强大。秦始皇继位后，采用"远交近攻"的策略，先后灭掉了韩、赵、魏、楚、燕、齐六国，于公元前221年统一了中国，结束了长达500多年的分裂局面。\n\n秦始皇统一六国后，在政治上建立了皇帝制度和三公九卿制，在地方实行郡县制；在经济上统一货币、度量衡；在文化上统一文字，推行小篆；在军事上修筑万里长城，抵御北方匈奴。秦朝还修建了大量的道路和水利工程，如直道、灵渠等。\n\n但秦朝实行严刑峻法，赋税繁重，徭役频繁，激起了人民的反抗。秦始皇死后，秦二世胡亥继位，政治更加黑暗，最终爆发了陈胜吴广起义，各地纷纷响应，秦朝迅速灭亡。\n\n秦朝虽然存在时间很短，仅历时15年，但其建立的政治制度对后世产生了深远影响，共有3位皇帝。',
        emperors: [
            { name: '嬴政', title: '秦始皇帝', reignStart: '前221年', reignEnd: '前210年', reignYears: 11, birth: '前259年', death: '前210年', age: '49岁' },
            { name: '嬴胡亥', title: '秦二世皇帝', reignStart: '前210年', reignEnd: '前207年', reignYears: 3, birth: '前230年', death: '前207年', age: '23岁' },
            { name: '嬴子婴', title: '秦王子婴', reignStart: '前207年', reignEnd: '前206年', reignYears: 1, birth: '前225年', death: '前206年', age: '19岁' }
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
        description: '中国历史上重要的统一王朝，由汉高祖刘邦建立。西汉继承了秦朝的政治制度，但在具体政策上有所调整，实行"无为而治"和"休养生息"的政策。\n\n西汉前期出现了"文景之治"的盛世局面，经济繁荣，人口增长。汉武帝时期，国力达到鼎盛，对外开拓疆土，派张骞出使西域，开辟了丝绸之路；对内加强中央集权，推行"推恩令"削弱诸侯王势力，设立刺史制度监察地方。\n\n西汉时期儒学成为正统思想，董仲舒提出"罢黜百家，独尊儒术"。西汉的疆域空前辽阔，东到朝鲜，西到中亚，南到越南，北到蒙古高原。西汉后期由于土地兼并严重，外戚专权，政治腐败，最终被王莽篡夺，建立新朝。\n\n西汉历时210年，为中华民族的形成和发展奠定了重要基础，共有15位皇帝。',
        emperors: [
            { name: '刘邦', title: '汉高祖', reignStart: '前202年', reignEnd: '前195年', reignYears: 7, eraName: '汉', birth: '前256年', death: '前195年', age: '61岁' },
            { name: '刘盈', title: '汉惠帝', reignStart: '前194年', reignEnd: '前188年', reignYears: 6, eraName: '汉', birth: '前211年', death: '前188年', age: '23岁' },
            { name: '刘恭', title: '汉前少帝', reignStart: '前188年', reignEnd: '前184年', reignYears: 4, eraName: '汉', birth: '前188年', death: '前184年', age: '4岁' },
            { name: '刘弘', title: '汉后少帝', reignStart: '前184年', reignEnd: '前180年', reignYears: 4, eraName: '汉', birth: '前188年', death: '前180年', age: '8岁' },
            { name: '刘恒', title: '汉文帝', reignStart: '前180年', reignEnd: '前157年', reignYears: 23, eraName: '汉', birth: '前202年', death: '前157年', age: '45岁' },
            { name: '刘启', title: '汉景帝', reignStart: '前156年', reignEnd: '前141年', reignYears: 15, eraName: '汉', birth: '前188年', death: '前141年', age: '47岁' },
            { name: '刘彻', title: '汉武帝', reignStart: '前140年', reignEnd: '前87年', reignYears: 53, eraName: '建元、元光、元朔、元狩、元鼎、元封、太初、天汉、太始、征和、后元', birth: '前156年', death: '前87年', age: '69岁' },
            { name: '刘弗陵', title: '汉昭帝', reignStart: '前86年', reignEnd: '前74年', reignYears: 12, eraName: '始元、元凤、元平', birth: '前94年', death: '前74年', age: '20岁' },
            { name: '刘贺', title: '汉废帝', reignStart: '前74年', reignEnd: '前74年', reignYears: '27天', eraName: '汉', birth: '前92年', death: '前59年', age: '33岁' },
            { name: '刘询', title: '汉宣帝', reignStart: '前73年', reignEnd: '前49年', reignYears: 24, eraName: '本始、地节、元康、神爵、五凤、甘露、黄龙', birth: '前74年', death: '前49年', age: '25岁' },
            { name: '刘奭', title: '汉元帝', reignStart: '前48年', reignEnd: '前33年', reignYears: 15, eraName: '初元、永光、建昭、竟宁', birth: '前75年', death: '前33年', age: '42岁' },
            { name: '刘骜', title: '汉成帝', reignStart: '前32年', reignEnd: '前7年', reignYears: 25, eraName: '建始、河平、阳朔、鸿嘉、永始、元延、绥和', birth: '前51年', death: '前7年', age: '44岁' },
            { name: '刘欣', title: '汉哀帝', reignStart: '前6年', reignEnd: '前1年', reignYears: 5, eraName: '建平、太初元将、元寿', birth: '前27年', death: '前1年', age: '26岁' },
            { name: '刘衎', title: '汉平帝', reignStart: '1年', reignEnd: '5年', reignYears: 4, eraName: '元始', birth: '前9年', death: '5年', age: '14岁' },
            { name: '刘婴', title: '孺子婴', reignStart: '6年', reignEnd: '8年', reignYears: 2, eraName: '居摄、初始', birth: '3年', death: '25年', age: '22岁' }
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
        description: '王莽篡汉建立的短暂王朝，是中国历史上第一个通过和平方式取得政权的朝代。王莽是西汉外戚，通过一系列政治手段逐步掌握大权，最终在公元8年建立新朝。\n\n王莽推行激进的改革政策，包括土地国有化、货币制度改革、官制改革等，试图恢复周朝的政治制度。他将私有土地收归国有，重新分配给农民；多次改革货币制度，造成经济混乱；频繁更改官制和地名，引起社会动荡。\n\n王莽的改革虽然出发点是好的，但脱离实际，加上天灾频繁，最终引发了绿林、赤眉等农民起义。公元23年，王莽在长安被杀，新朝灭亡。\n\n新朝历时15年，只有王莽1位皇帝。',
        emperors: [
            { name: '王莽', title: '新始祖', reignStart: '8年', reignEnd: '23年', reignYears: 15, eraName: '始建国、天凤、地皇', birth: '前45年', death: '23年', age: '68岁' }
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
        description: '汉朝的延续，由汉光武帝刘秀建立。新朝灭亡后，天下大乱，各地豪强割据。刘秀是汉景帝之子刘章的后代，出身于南阳豪族。他起初参加绿林起义，后来脱离绿林军，独立发展势力。刘秀利用"柔远人，优待降者"的政策，逐步统一了中原地区，于25年建立东汉，定都洛阳。\n\n东汉前期政治清明，经济繁荣，出现了"光武中兴"和"明章之治"等盛世局面。这一时期科技文化继续发展，出现了造纸术等重要发明，蔡伦改进了造纸技术；张衡发明了地动仪；医学家张仲景著有《伤寒杂病论》。\n\n东汉时期佛教正式传入中国，对中国文化产生了深远影响。丝绸之路继续繁荣，中外文化交流频繁。东汉的疆域基本继承了西汉的版图，并在西域设立了西域都护府。\n\n东汉后期外戚宦官专权，政治腐败，黄巾起义爆发后，东汉名存实亡，最终被曹魏取代。东汉历时195年，共有14位皇帝。',
        emperors: [
            { name: '刘秀', title: '汉光武帝', reignStart: '25年', reignEnd: '57年', reignYears: 32, eraName: '建武、建武中元', birth: '前6年', death: '57年', age: '63岁' },
            { name: '刘庄', title: '汉明帝', reignStart: '57年', reignEnd: '75年', reignYears: 18, eraName: '永平', birth: '28年', death: '75年', age: '47岁' },
            { name: '刘炟(Dá)', title: '汉章帝', reignStart: '75年', reignEnd: '88年', reignYears: 13, eraName: '建初、元和、章和', birth: '56年', death: '88年', age: '32岁' },
            { name: '刘肇(Zhào)', title: '汉和帝', reignStart: '88年', reignEnd: '106年', reignYears: 18, eraName: '永元、元兴', birth: '79年', death: '106年', age: '27岁' },
            { name: '刘隆(Lóng)', title: '汉殇帝', reignStart: '106年', reignEnd: '106年', reignYears: '8个月', eraName: '延平', birth: '105年', death: '106年', age: '1岁' },
            { name: '刘祜(Hù)', title: '汉安帝', reignStart: '106年', reignEnd: '125年', reignYears: 19, eraName: '永初、元初、永宁、建光、延光', birth: '94年', death: '125年', age: '31岁' },
            { name: '刘懿(Yì)', title: '汉前少帝', reignStart: '125年', reignEnd: '125年', reignYears: '7个月', birth: '115年', death: '125年', age: '10岁' },
            { name: '刘保', title: '汉顺帝', reignStart: '125年', reignEnd: '144年', reignYears: 19, eraName: '永建、阳嘉、永和、汉安、建康', birth: '115年', death: '144年', age: '29岁' },
            { name: '刘炳', title: '汉冲帝', reignStart: '144年', reignEnd: '145年', reignYears: '5个月', eraName: '永嘉', birth: '143年', death: '145年', age: '2岁' },
            { name: '刘缵(Zuǎn)', title: '汉质帝', reignStart: '145年', reignEnd: '146年', reignYears: 1, eraName: '本初', birth: '138年', death: '146年', age: '8岁' },
            { name: '刘志', title: '汉桓帝', reignStart: '146年', reignEnd: '167年', reignYears: 21, eraName: '建和、和平、元嘉、永兴、永寿、延熹、永康', birth: '132年', death: '167年', age: '35岁' },
            { name: '刘宏', title: '汉灵帝', reignStart: '167年', reignEnd: '189年', reignYears: 22, eraName: '建宁、熹平、光和、中平', birth: '156年', death: '189年', age: '33岁' },
            { name: '刘辩', title: '汉后少帝', reignStart: '189年', reignEnd: '189年', reignYears: '4个月', eraName: '光熹、昭宁', birth: '175年', death: '190年', age: '15岁' },
            { name: '刘协', title: '汉献帝', reignStart: '189年', reignEnd: '220年', reignYears: 31, eraName: '初平、兴平、建安、延康', birth: '181年', death: '234年', age: '53岁' }
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
        capital: '洛阳/成都/建业',
        founder: '曹丕/刘备/孙权',
        lastEmperor: '曹奂/刘禅/孙皓',
        period: 'imperial',
        description: '东汉末年，中央权力衰落，地方豪强割据。曹操起兵于北方，逐步统一中原，其子曹丕于220年建立魏国。同年，刘备在蜀地建立蜀汉，自称汉室正统。孙权继承父亲孙策的基业，占据江南，于229年建立吴国。三国鼎立的局面由此形成。\n\n三国时期战争频繁，著名的战役有官渡之战、赤壁之战、夷陵之战等。这一时期涌现出了诸葛亮、司马懿、周瑜、陆逊等杰出的政治家和军事家。三国文化对后世影响深远，《三国演义》等文学作品使这一时期的人物和故事家喻户晓。\n\n魏国由曹操奠基，曹丕建立，定都洛阳，占据中原地区，国力最强；蜀国由刘备建立，定都成都，占据四川盆地，以恢复汉室为号召；吴国由孙权建立，定都建业（今南京），占据江南地区，善于水战。\n\n最终蜀国最先灭亡（263年被司马昭灭），吴国被西晋所灭（280年），三国归晋。三国时期历时60年，魏国5位皇帝，蜀国2位皇帝，吴国4位皇帝。',
        emperors: [
            { name: '曹丕', title: '魏文帝', reignStart: '220年', reignEnd: '226年', reignYears: 6, eraName: '黄初', birth: '187年', death: '226年', age: '39岁' },
            { name: '曹叡(Ruì)', title: '魏明帝', reignStart: '226年', reignEnd: '239年', reignYears: 13, eraName: '太和、青龙、景初', birth: '204年', death: '239年', age: '35岁' },
            { name: '曹芳', title: '魏齐王', reignStart: '239年', reignEnd: '254年', reignYears: 15, eraName: '正始、嘉平', birth: '232年', death: '274年', age: '42岁' },
            { name: '曹髦(Máo)', title: '魏高贵乡公', reignStart: '254年', reignEnd: '260年', reignYears: 6, eraName: '正元、甘露', birth: '241年', death: '260年', age: '19岁' },
            { name: '曹奂(Huàn)', title: '魏元帝', reignStart: '260年', reignEnd: '265年', reignYears: 5, eraName: '景元、咸熙', birth: '246年', death: '302年', age: '56岁' },
            { name: '刘备', title: '蜀昭烈帝', reignStart: '221年', reignEnd: '223年', reignYears: 2, eraName: '章武', birth: '161年', death: '223年', age: '62岁' },
            { name: '刘禅(Shàn)', title: '蜀后主', reignStart: '223年', reignEnd: '263年', reignYears: 40, eraName: '建兴、延熙、景耀、炎兴', birth: '207年', death: '271年', age: '64岁' },
            { name: '孙权', title: '吴大帝', reignStart: '229年', reignEnd: '252年', reignYears: 23, eraName: '黄龙、嘉禾、赤乌、太元、神凤', birth: '182年', death: '252年', age: '70岁' },
            { name: '孙亮', title: '吴会稽王', reignStart: '252年', reignEnd: '258年', reignYears: 6, eraName: '建兴、五凤、太平', birth: '243年', death: '260年', age: '17岁' },
            { name: '孙休', title: '吴景帝', reignStart: '258年', reignEnd: '264年', reignYears: 6, eraName: '永安', birth: '235年', death: '264年', age: '29岁' },
            { name: '孙皓(Hào)', title: '吴末帝', reignStart: '264年', reignEnd: '280年', reignYears: 16, eraName: '元兴、甘露、宝鼎、建衡、凤凰、天册、天玺、天纪', birth: '242年', death: '284年', age: '42岁' }
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
        description: '司马氏建立的王朝，短暂统一全国后因内乱和外族入侵而衰落。西晋由司马炎建立，他是司马懿的孙子，通过"高平陵之变"等政治斗争，司马氏逐步掌握了曹魏政权。\n\n西晋建立后，于280年灭吴，结束了三国分裂局面，实现了全国统一。西晋前期政治相对稳定，经济得到恢复和发展。但西晋实行分封制，分封了大量宗室为王，为后来的内乱埋下了隐患。\n\n西晋后期爆发了"八王之乱"，宗室诸王为争夺权力而相互攻伐，持续16年，严重削弱了西晋的国力。同时，北方游牧民族趁机南下，发生了"五胡乱华"，西晋政权岌岌可危。\n\n最终，匈奴人刘渊建立汉国（后称前赵），攻陷洛阳，俘虏晋怀帝；后又攻陷长安，俘虏晋愍帝，西晋灭亡。西晋历时50年，共有4位皇帝。',
        emperors: [
            { name: '司马炎', title: '晋武帝', reignStart: '266年', reignEnd: '290年', reignYears: 24, eraName: '泰始、咸宁、太康、太熙', birth: '236年', death: '290年', age: '54岁' },
            { name: '司马衷', title: '晋惠帝', reignStart: '290年', reignEnd: '307年', reignYears: 17, eraName: '永熙、永平、元康、永康、永宁、太安、永兴、光熙', birth: '259年', death: '307年', age: '48岁' },
            { name: '司马炽', title: '晋怀帝', reignStart: '307年', reignEnd: '313年', reignYears: 6, eraName: '永嘉', birth: '284年', death: '313年', age: '29岁' },
            { name: '司马邺', title: '晋愍帝', reignStart: '313年', reignEnd: '316年', reignYears: 3, eraName: '建兴', birth: '300年', death: '318年', age: '18岁' }
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
        description: '西晋灭亡后，司马氏皇族后裔在南方建立的政权，与北方十六国并立。司马睿是西晋皇帝司马炎的儿子，属于皇族直系。西晋灭亡时，司马睿在南方拥有兵权和势力，他联合南方士族，于317年在建康（今南京）建立东晋，成为中原士族南迁的领导者。\n\n东晋前期，在王导、谢安等名臣辅佐下，政治相对稳定。著名的淝水之战中，东晋以少胜多，击败了前秦苻坚的百万大军，保住了江南半壁江山。这一时期文化艺术繁荣，出现了王羲之、顾恺之等杰出的艺术家。\n\n东晋时期佛教和道教都得到很大发展，佛教寺院遍布江南，道教理论也日趋完善。士族门阀制度在这一时期达到鼎盛，形成了"王谢"等著名的门阀世族。\n\n东晋后期，门阀政治腐朽，皇权衰微，军阀割据严重。最终刘裕崛起，废除晋恭帝，建立刘宋，东晋灭亡。东晋历时103年，共有11位皇帝。',
        emperors: [
            { name: '司马睿', title: '晋元帝', reignStart: '317年', reignEnd: '323年', reignYears: 6, eraName: '建武、大兴', birth: '275年', death: '323年', age: '48岁' },
            { name: '司马绍', title: '晋明帝', reignStart: '323年', reignEnd: '325年', reignYears: 2, eraName: '太宁', birth: '298年', death: '325年', age: '27岁' },
            { name: '司马衍', title: '晋成帝', reignStart: '325年', reignEnd: '342年', reignYears: 17, eraName: '咸和、咸康', birth: '321年', death: '342年', age: '21岁' },
            { name: '司马岳', title: '晋康帝', reignStart: '342年', reignEnd: '344年', reignYears: 2, eraName: '建元', birth: '322年', death: '344年', age: '22岁' },
            { name: '司马聃(dān)', title: '晋穆帝', reignStart: '344年', reignEnd: '361年', reignYears: 17, eraName: '永和、升平', birth: '343年', death: '361年', age: '18岁' },
            { name: '司马丕', title: '晋哀帝', reignStart: '361年', reignEnd: '365年', reignYears: 4, eraName: '隆和、兴宁', birth: '341年', death: '365年', age: '24岁' },
            { name: '司马奕', title: '晋废帝', reignStart: '365年', reignEnd: '371年', reignYears: 6, eraName: '太和', birth: '342年', death: '386年', age: '44岁' },
            { name: '司马昱(yù)', title: '晋简文帝', reignStart: '371年', reignEnd: '372年', reignYears: 1, eraName: '咸安', birth: '320年', death: '372年', age: '52岁' },
            { name: '司马曜', title: '晋孝武帝', reignStart: '372年', reignEnd: '396年', reignYears: 24, eraName: '宁康、太元', birth: '361年', death: '396年', age: '35岁' },
            { name: '司马德宗', title: '晋安帝', reignStart: '396年', reignEnd: '418年', reignYears: 22, eraName: '隆安、元兴、义熙', birth: '382年', death: '418年', age: '36岁' },
            { name: '司马德文', title: '晋恭帝', reignStart: '418年', reignEnd: '420年', reignYears: 2, eraName: '元熙', birth: '406年', death: '421年', age: '15岁' }
        ],
        achievements: [
            '保持汉族政权',
            '文化艺术发展',
            '佛教道教兴盛',
            '书法绘画成就'
        ]
    },
    {
        name: '十六国',
        startYear: '304年',
        endYear: '439年',
        duration: 135,
        capital: '多个都城',
        founder: '刘渊等',
        lastEmperor: '沮渠牧犍等',
        period: 'imperial',
        description: '西晋末年至北魏统一北方期间，北方地区由各少数民族建立的十六个主要政权的总称，是中国历史上重要的民族大融合时期。\n\n十六国包括：前赵（汉赵）、后赵、前燕、后燕、南燕、北燕、前秦、后秦、西秦、前凉、后凉、南凉、西凉、北凉、夏、成汉。各政权疆域大小不一，存在时间长短不等，相互征伐不断，但促进了民族融合。\n\n这一时期为后来北魏的统一奠定了基础，也为中华民族的形成和发展做出了重要贡献。十六国时期的民族融合，为隋唐时期的繁荣创造了条件。',
        emperors: [
            // 前赵（汉赵）304年－329年
            { name: '刘渊', title: '汉光文帝', reignStart: '304年', reignEnd: '310年', reignYears: 6, eraName: '元熙、永凤、河瑞', birth: '251年', death: '310年', age: '59岁', dynasty: '前赵（汉赵）' },
            { name: '刘和', title: '汉废帝', reignStart: '310年', reignEnd: '310年', reignYears: '数月', eraName: '河瑞', birth: '不详', death: '310年', age: '不详', dynasty: '前赵（汉赵）' },
            { name: '刘聪', title: '汉昭武帝', reignStart: '310年', reignEnd: '318年', reignYears: 8, eraName: '光兴、嘉平、建元、麟嘉', birth: '285年', death: '318年', age: '33岁', dynasty: '前赵（汉赵）' },
            { name: '刘粲', title: '汉隐帝', reignStart: '318年', reignEnd: '318年', reignYears: '数月', eraName: '汉昌', birth: '不详', death: '318年', age: '不详', dynasty: '前赵（汉赵）' },
            { name: '刘曜', title: '前赵光初帝', reignStart: '318年', reignEnd: '329年', reignYears: 11, eraName: '光初、建光', birth: '285年', death: '329年', age: '44岁', dynasty: '前赵（汉赵）' },

            // 后赵 319年－351年
            { name: '石勒', title: '后赵武帝', reignStart: '319年', reignEnd: '333年', reignYears: 14, eraName: '太和、建平', birth: '274年', death: '333年', age: '59岁', dynasty: '后赵' },
            { name: '石弘', title: '后赵成帝', reignStart: '333年', reignEnd: '334年', reignYears: 1, eraName: '延熙', birth: '不详', death: '334年', age: '不详', dynasty: '后赵' },
            { name: '石虎', title: '后赵武帝（称帝）', reignStart: '334年', reignEnd: '349年', reignYears: 15, eraName: '建武、太宁', birth: '295年', death: '349年', age: '54岁', dynasty: '后赵' },
            { name: '石世', title: '后赵废帝', reignStart: '349年', reignEnd: '349年', reignYears: '33天', eraName: '太宁', birth: '不详', death: '349年', age: '不详', dynasty: '后赵' },
            { name: '石遵', title: '后赵义阳王', reignStart: '349年', reignEnd: '349年', reignYears: '183天', eraName: '青龙', birth: '不详', death: '349年', age: '不详', dynasty: '后赵' },
            { name: '石鉴', title: '后赵新兴王', reignStart: '349年', reignEnd: '350年', reignYears: 1, eraName: '青龙', birth: '不详', death: '350年', age: '不详', dynasty: '后赵' },
            { name: '石祗', title: '后赵武宁王', reignStart: '350年', reignEnd: '351年', reignYears: 1, eraName: '永宁', birth: '不详', death: '351年', age: '不详', dynasty: '后赵' },

            // 前燕 337年－370年
            { name: '慕容皝', title: '前燕文明帝', reignStart: '337年', reignEnd: '348年', reignYears: 11, eraName: '延兴', birth: '297年', death: '348年', age: '51岁', dynasty: '前燕' },
            { name: '慕容儁', title: '前燕景昭帝', reignStart: '349年', reignEnd: '360年', reignYears: 11, eraName: '元玺', birth: '319年', death: '360年', age: '41岁', dynasty: '前燕' },
            { name: '慕容暐', title: '前燕幽帝', reignStart: '360年', reignEnd: '370年', reignYears: 10, eraName: '建熙', birth: '350年', death: '384年', age: '34岁', dynasty: '前燕' },

            // 后燕 384年－407年
            { name: '慕容垂', title: '后燕成武帝', reignStart: '384年', reignEnd: '396年', reignYears: 12, eraName: '燕元、建兴', birth: '326年', death: '396年', age: '70岁', dynasty: '后燕' },
            { name: '慕容宝', title: '后燕惠愍帝', reignStart: '396年', reignEnd: '398年', reignYears: 2, eraName: '永康', birth: '355年', death: '398年', age: '43岁', dynasty: '后燕' },
            { name: '慕容盛', title: '后燕昭武帝', reignStart: '398年', reignEnd: '401年', reignYears: 3, eraName: '建平', birth: '373年', death: '401年', age: '28岁', dynasty: '后燕' },
            { name: '慕容熙', title: '后燕昭文帝', reignStart: '401年', reignEnd: '407年', reignYears: 6, eraName: '光始', birth: '385年', death: '407年', age: '22岁', dynasty: '后燕' },

            // 前秦 351年－394年
            { name: '苻健', title: '前秦景明帝', reignStart: '351年', reignEnd: '355年', reignYears: 4, eraName: '皇始', birth: '317年', death: '355年', age: '38岁', dynasty: '前秦' },
            { name: '苻生', title: '前秦厉王', reignStart: '355年', reignEnd: '357年', reignYears: 2, eraName: '寿光', birth: '335年', death: '357年', age: '22岁', dynasty: '前秦' },
            { name: '苻坚', title: '前秦宣昭帝', reignStart: '357年', reignEnd: '385年', reignYears: 28, eraName: '永兴、甘露、建元', birth: '338年', death: '385年', age: '47岁', dynasty: '前秦' },
            { name: '苻丕', title: '前秦哀平帝', reignStart: '385年', reignEnd: '386年', reignYears: 1, eraName: '太安', birth: '不详', death: '386年', age: '不详', dynasty: '前秦' },
            { name: '苻登', title: '前秦太宗', reignStart: '386年', reignEnd: '394年', reignYears: 8, eraName: '太初', birth: '不详', death: '394年', age: '不详', dynasty: '前秦' },

            // 后秦 384年－417年
            { name: '姚苌', title: '后秦武昭帝', reignStart: '384年', reignEnd: '393年', reignYears: 9, eraName: '白雀、建初', birth: '331年', death: '393年', age: '62岁', dynasty: '后秦' },
            { name: '姚兴', title: '后秦文桓帝', reignStart: '394年', reignEnd: '416年', reignYears: 22, eraName: '皇初、弘始', birth: '366年', death: '416年', age: '50岁', dynasty: '后秦' },
            { name: '姚泓', title: '后秦末主', reignStart: '416年', reignEnd: '417年', reignYears: 1, eraName: '永和', birth: '不详', death: '417年', age: '不详', dynasty: '后秦' },

            // 成汉 304年－347年
            { name: '李特', title: '成汉景帝', reignStart: '304年', reignEnd: '304年', reignYears: 1, eraName: '建初', birth: '不详', death: '304年', age: '不详', dynasty: '成汉' },
            { name: '李流', title: '成汉始祖', reignStart: '304年', reignEnd: '304年', reignYears: 1, eraName: '建兴', birth: '不详', death: '304年', age: '不详', dynasty: '成汉' },
            { name: '李雄', title: '成汉武帝', reignStart: '304年', reignEnd: '334年', reignYears: 30, eraName: '建兴、晏平、玉衡、玉恒、建元', birth: '274年', death: '334年', age: '60岁', dynasty: '成汉' },
            { name: '李班', title: '成汉戾太子', reignStart: '334年', reignEnd: '334年', reignYears: '数月', eraName: '玉恒', birth: '不详', death: '334年', age: '不详', dynasty: '成汉' },
            { name: '李期', title: '成汉幽公', reignStart: '334年', reignEnd: '338年', reignYears: 4, eraName: '玉恒、建兴', birth: '不详', death: '338年', age: '不详', dynasty: '成汉' },
            { name: '李寿', title: '成汉昭文帝', reignStart: '338年', reignEnd: '343年', reignYears: 5, eraName: '汉兴', birth: '不详', death: '343年', age: '不详', dynasty: '成汉' },
            { name: '李势', title: '成汉归义侯', reignStart: '343年', reignEnd: '347年', reignYears: 4, eraName: '太和', birth: '不详', death: '361年', age: '不详', dynasty: '成汉' },

            // 北凉 397年－439年
            { name: '段业', title: '北凉建国公', reignStart: '397年', reignEnd: '401年', reignYears: 4, eraName: '神玺', birth: '不详', death: '401年', age: '不详', dynasty: '北凉' },
            { name: '沮渠蒙逊', title: '北凉武宣王', reignStart: '401年', reignEnd: '433年', reignYears: 32, eraName: '永安、玄始、承玄、义和、真兴', birth: '368年', death: '433年', age: '65岁', dynasty: '北凉' },
            { name: '沮渠牧犍', title: '北凉哀王', reignStart: '433年', reignEnd: '439年', reignYears: 6, eraName: '承和、胜光', birth: '不详', death: '447年', age: '不详', dynasty: '北凉' }
        ],
        achievements: [
            '促进民族融合',
            '文化交流发展',
            '军事技术进步',
            '为北魏统一奠基'
        ]
    },
    {
        name: '南北朝',
        startYear: '420年',
        endYear: '589年',
        duration: 169,
        capital: '建康/平城/洛阳',
        founder: '刘裕等',
        lastEmperor: '陈叔宝/杨坚',
        period: 'imperial',
        description: '中国历史上的分裂时期，南朝包括宋、齐、梁、陈四个朝代，北朝包括北魏、东魏、西魏、北齐、北周五个朝代。这一时期民族融合加速，文化艺术繁荣。\n\n南朝政权都建都建康（今南京），主要由汉族士族建立和统治，保持了汉族的传统文化；北朝政权主要由鲜卑族等少数民族建立，但逐渐汉化，促进了民族融合。\n\n这一时期佛教得到很大发展，出现了许多著名的佛教石窟和寺院；文学艺术也很繁荣，出现了《文心雕龙》、《诗品》等重要著作。科技方面，祖冲之计算出圆周率，贾思勰著《齐民要术》。\n\n南北朝的分裂局面最终被隋朝统一，结束了长达169年的分裂状态。',
        emperors: [
            // 南朝宋 420年－479年
            { name: '刘裕', title: '宋武帝', reignStart: '420年', reignEnd: '422年', reignYears: 2, eraName: '永初', birth: '363年', death: '422年', age: '59岁', dynasty: '南朝宋' },
            { name: '刘义符', title: '宋少帝', reignStart: '422年', reignEnd: '424年', reignYears: 2, eraName: '景平', birth: '406年', death: '424年', age: '18岁', dynasty: '南朝宋' },
            { name: '刘义隆', title: '宋文帝', reignStart: '424年', reignEnd: '453年', reignYears: 29, eraName: '元嘉', birth: '407年', death: '453年', age: '46岁', dynasty: '南朝宋' },
            { name: '刘骏', title: '宋孝武帝', reignStart: '453年', reignEnd: '464年', reignYears: 11, eraName: '孝建、大明', birth: '430年', death: '464年', age: '34岁', dynasty: '南朝宋' },
            { name: '刘子业', title: '宋前废帝', reignStart: '464年', reignEnd: '465年', reignYears: 1, eraName: '永光、景和', birth: '449年', death: '465年', age: '16岁', dynasty: '南朝宋' },
            { name: '刘彧', title: '宋明帝', reignStart: '465年', reignEnd: '472年', reignYears: 7, eraName: '泰始', birth: '439年', death: '472年', age: '33岁', dynasty: '南朝宋' },
            { name: '刘昱', title: '宋后废帝', reignStart: '472年', reignEnd: '477年', reignYears: 5, eraName: '元徽', birth: '463年', death: '477年', age: '14岁', dynasty: '南朝宋' },
            { name: '刘准', title: '宋顺帝', reignStart: '477年', reignEnd: '479年', reignYears: 2, eraName: '升明', birth: '467年', death: '479年', age: '12岁', dynasty: '南朝宋' },

            // 南朝齐 479年－502年
            { name: '萧道成', title: '齐高帝', reignStart: '479年', reignEnd: '482年', reignYears: 3, eraName: '建元', birth: '427年', death: '482年', age: '55岁', dynasty: '南朝齐' },
            { name: '萧赜', title: '齐武帝', reignStart: '482年', reignEnd: '493年', reignYears: 11, eraName: '永明', birth: '440年', death: '493年', age: '53岁', dynasty: '南朝齐' },
            { name: '萧昭业', title: '齐郁林王', reignStart: '493年', reignEnd: '494年', reignYears: 1, eraName: '隆昌', birth: '473年', death: '494年', age: '21岁', dynasty: '南朝齐' },
            { name: '萧昭文', title: '齐海陵王', reignStart: '494年', reignEnd: '494年', reignYears: '4个月', eraName: '延兴', birth: '480年', death: '494年', age: '14岁', dynasty: '南朝齐' },
            { name: '萧鸾', title: '齐明帝', reignStart: '494年', reignEnd: '498年', reignYears: 4, eraName: '建武', birth: '452年', death: '498年', age: '46岁', dynasty: '南朝齐' },
            { name: '萧宝卷', title: '齐东昏侯', reignStart: '498年', reignEnd: '501年', reignYears: 3, eraName: '永元', birth: '483年', death: '501年', age: '18岁', dynasty: '南朝齐' },
            { name: '萧宝融', title: '齐和帝', reignStart: '501年', reignEnd: '502年', reignYears: 1, eraName: '中兴', birth: '488年', death: '502年', age: '14岁', dynasty: '南朝齐' },

            // 南朝梁 502年－557年
            { name: '萧衍', title: '梁武帝', reignStart: '502年', reignEnd: '549年', reignYears: 47, eraName: '天监、普通、大通、中大通、大同、中大同、太清', birth: '464年', death: '549年', age: '85岁', dynasty: '南朝梁' },
            { name: '萧纲', title: '梁简文帝', reignStart: '549年', reignEnd: '551年', reignYears: 2, eraName: '大宝', birth: '503年', death: '551年', age: '48岁', dynasty: '南朝梁' },
            { name: '萧栋', title: '梁豫章王', reignStart: '551年', reignEnd: '551年', reignYears: '3个月', eraName: '天正', birth: '536年', death: '551年', age: '15岁', dynasty: '南朝梁' },
            { name: '萧绎', title: '梁元帝', reignStart: '552年', reignEnd: '554年', reignYears: 2, eraName: '承圣', birth: '508年', death: '554年', age: '46岁', dynasty: '南朝梁' },
            { name: '萧方智', title: '梁敬帝', reignStart: '555年', reignEnd: '557年', reignYears: 2, eraName: '绍泰、太平', birth: '544年', death: '558年', age: '14岁', dynasty: '南朝梁' },

            // 南朝陈 557年－589年
            { name: '陈霸先', title: '陈武帝', reignStart: '557年', reignEnd: '559年', reignYears: 2, eraName: '永定', birth: '503年', death: '559年', age: '56岁', dynasty: '南朝陈' },
            { name: '陈蒨', title: '陈文帝', reignStart: '559年', reignEnd: '566年', reignYears: 7, eraName: '天嘉、天康', birth: '522年', death: '566年', age: '44岁', dynasty: '南朝陈' },
            { name: '陈伯宗', title: '陈废帝', reignStart: '566年', reignEnd: '568年', reignYears: 2, eraName: '光大', birth: '554年', death: '570年', age: '16岁', dynasty: '南朝陈' },
            { name: '陈顼', title: '陈宣帝', reignStart: '568年', reignEnd: '582年', reignYears: 14, eraName: '太建', birth: '530年', death: '582年', age: '52岁', dynasty: '南朝陈' },
            { name: '陈叔宝', title: '陈后主', reignStart: '582年', reignEnd: '589年', reignYears: 7, eraName: '至德、祯明', birth: '553年', death: '604年', age: '51岁', dynasty: '南朝陈' },

            // 北朝北魏 386年－534年
            { name: '拓跋珪', title: '北魏道武帝', reignStart: '386年', reignEnd: '409年', reignYears: 23, eraName: '登国、皇始、天兴、天赐', birth: '371年', death: '409年', age: '38岁', dynasty: '北朝北魏' },
            { name: '拓跋嗣', title: '北魏明元帝', reignStart: '409年', reignEnd: '423年', reignYears: 14, eraName: '永兴、神瑞、泰常', birth: '392年', death: '423年', age: '31岁', dynasty: '北朝北魏' },
            { name: '拓跋焘', title: '北魏太武帝', reignStart: '423年', reignEnd: '452年', reignYears: 29, eraName: '始光、神䴥、延和、太延、太平真君、正平', birth: '408年', death: '452年', age: '44岁', dynasty: '北朝北魏' },
            { name: '拓跋余', title: '北魏南安王', reignStart: '452年', reignEnd: '452年', reignYears: '8个月', eraName: '永平', birth: '不详', death: '452年', age: '不详', dynasty: '北朝北魏' },
            { name: '拓跋濬', title: '北魏文成帝', reignStart: '452年', reignEnd: '465年', reignYears: 13, eraName: '兴安、兴光、太安、和平', birth: '440年', death: '465年', age: '25岁', dynasty: '北朝北魏' },
            { name: '拓跋弘', title: '北魏献文帝', reignStart: '465年', reignEnd: '471年', reignYears: 6, eraName: '天安、皇兴', birth: '454年', death: '476年', age: '22岁', dynasty: '北朝北魏' },
            { name: '元宏', title: '北魏孝文帝', reignStart: '471年', reignEnd: '499年', reignYears: 28, eraName: '延兴、承明、太和', birth: '467年', death: '499年', age: '32岁', dynasty: '北朝北魏' },
            { name: '元恪', title: '北魏宣武帝', reignStart: '499年', reignEnd: '515年', reignYears: 16, eraName: '景明、正始、永平、延昌', birth: '483年', death: '515年', age: '32岁', dynasty: '北朝北魏' },
            { name: '元诩', title: '北魏孝明帝', reignStart: '515年', reignEnd: '528年', reignYears: 13, eraName: '熙平、神龟、正光、孝昌、武泰', birth: '510年', death: '528年', age: '18岁', dynasty: '北朝北魏' },
            { name: '元钊', title: '北魏幼主', reignStart: '528年', reignEnd: '528年', reignYears: '数月', eraName: '武泰', birth: '526年', death: '528年', age: '2岁', dynasty: '北朝北魏' },
            { name: '元子攸', title: '北魏孝庄帝', reignStart: '528年', reignEnd: '530年', reignYears: 2, eraName: '建义、永安', birth: '507年', death: '530年', age: '23岁', dynasty: '北朝北魏' },
            { name: '元晔', title: '北魏节闵帝', reignStart: '531年', reignEnd: '531年', reignYears: '5个月', eraName: '建明', birth: '不详', death: '532年', age: '不详', dynasty: '北朝北魏' },
            { name: '元恭', title: '北魏安定王', reignStart: '531年', reignEnd: '532年', reignYears: 1, eraName: '中兴', birth: '498年', death: '532年', age: '34岁', dynasty: '北朝北魏' },
            { name: '元修', title: '北魏孝武帝', reignStart: '532年', reignEnd: '534年', reignYears: 2, eraName: '太昌、永兴、永熙', birth: '510年', death: '535年', age: '25岁', dynasty: '北朝北魏' }
        ],
        achievements: [
            '民族融合加速',
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
        lastEmperor: '隋恭帝',
        period: 'imperial',
        description: '结束了长期分裂局面，重新统一中国的朝代。隋朝建立了三省六部制，开凿了大运河，创立了科举制度，为唐朝的繁荣奠定了基础。\n\n隋朝由杨坚建立，他是北周的外戚，通过政治手段夺取了政权。隋文帝杨坚统一南北后，进行了一系列改革：政治上建立三省六部制，加强中央集权；经济上统一货币，兴修水利；文化上创立科举制度，打破门第限制。\n\n隋炀帝杨广继位后，开凿了贯通南北的大运河，这是中国古代最伟大的工程之一，对后世经济文化交流产生了深远影响。但杨广好大喜功，频繁征战，加重了人民负担，最终导致农民起义，隋朝灭亡。\n\n隋朝虽然只存在了37年，但其建立的政治制度和文化成就为唐朝的繁荣奠定了坚实基础。',
        emperors: [
            { name: '杨坚', title: '隋文帝', reignStart: '581年', reignEnd: '604年', reignYears: 23, eraName: '开皇、仁寿', birth: '541年', death: '604年', age: '63岁' },
            { name: '杨广', title: '隋炀帝', reignStart: '604年', reignEnd: '618年', reignYears: 14, eraName: '大业', birth: '569年', death: '618年', age: '49岁' },
            { name: '杨侑', title: '隋恭帝', reignStart: '617年', reignEnd: '618年', reignYears: 1, eraName: '义宁', birth: '605年', death: '619年', age: '14岁' }
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
        description: '中国历史上最强盛的王朝之一，由唐高祖李渊建立。唐朝是中国古代最为辉煌的时期，政治开明，经济繁荣，文化昌盛，国际交流频繁，被誉为"盛唐"。\n\n唐朝前期出现了"贞观之治"和"开元盛世"等繁荣局面。唐太宗李世民励精图治，政治清明；唐玄宗时期国力达到鼎盛，疆域辽阔，文化繁荣。唐朝实行开放的对外政策，长安成为国际大都市，丝绸之路空前繁荣。\n\n唐朝是诗歌的黄金时代，涌现出李白、杜甫、白居易等伟大诗人。科举制度得到完善，促进了社会流动。佛教、道教都得到很大发展，对外文化交流频繁。\n\n唐朝后期由于安史之乱等内乱，国力衰落，藩镇割据严重，最终被朱温建立的后梁所取代。唐朝历时289年，是中国历史上最辉煌的朝代之一。',
        emperors: [
            { name: '李渊', title: '唐高祖', reignStart: '618年', reignEnd: '626年', reignYears: 8, eraName: '武德', birth: '566年', death: '635年', age: '69岁' },
            { name: '李世民', title: '唐太宗', reignStart: '626年', reignEnd: '649年', reignYears: 23, eraName: '贞观', birth: '598年', death: '649年', age: '51岁' },
            { name: '李治', title: '唐高宗', reignStart: '649年', reignEnd: '683年', reignYears: 34, eraName: '永徽、显庆、龙朔、麟德、乾封、总章、咸亨、上元、仪凤、调露、永隆、开耀、永淳、弘道', birth: '628年', death: '683年', age: '55岁' },
            { name: '李显', title: '唐中宗', reignStart: '683年', reignEnd: '684年', reignYears: 1, eraName: '嗣圣', birth: '656年', death: '710年', age: '54岁' },
            { name: '李旦', title: '唐睿宗', reignStart: '684年', reignEnd: '690年', reignYears: 6, eraName: '文明、光宅、垂拱、永昌、载初', birth: '662年', death: '716年', age: '54岁' },
            { name: '武曌', title: '武周圣神皇帝', reignStart: '690年', reignEnd: '705年', reignYears: 15, eraName: '天授、如意、长寿、延载、证圣、天册万岁、万岁登封、万岁通天、神功、圣历、久视、大足、长安', birth: '624年', death: '705年', age: '81岁' },
            { name: '李显', title: '唐中宗（复位）', reignStart: '705年', reignEnd: '710年', reignYears: 5, eraName: '神龙、景龙', birth: '656年', death: '710年', age: '54岁' },
            { name: '李重茂', title: '唐殇帝', reignStart: '710年', reignEnd: '710年', reignYears: '1个月', eraName: '唐隆', birth: '695年', death: '714年', age: '19岁' },
            { name: '李旦', title: '唐睿宗（复位）', reignStart: '710年', reignEnd: '712年', reignYears: 2, eraName: '景云、太极、延和', birth: '662年', death: '716年', age: '54岁' },
            { name: '李隆基', title: '唐玄宗', reignStart: '712年', reignEnd: '756年', reignYears: 44, eraName: '先天、开元、天宝', birth: '685年', death: '762年', age: '77岁' },
            { name: '李亨', title: '唐肃宗', reignStart: '756年', reignEnd: '762年', reignYears: 6, eraName: '至德、乾元、上元', birth: '711年', death: '762年', age: '51岁' },
            { name: '李豫', title: '唐代宗', reignStart: '762年', reignEnd: '779年', reignYears: 17, eraName: '宝应、广德、永泰、大历', birth: '726年', death: '779年', age: '53岁' },
            { name: '李适', title: '唐德宗', reignStart: '779年', reignEnd: '805年', reignYears: 26, eraName: '建中、兴元、贞元', birth: '742年', death: '805年', age: '63岁' },
            { name: '李诵', title: '唐顺宗', reignStart: '805年', reignEnd: '805年', reignYears: '8个月', eraName: '永贞', birth: '761年', death: '806年', age: '45岁' },
            { name: '李纯', title: '唐宪宗', reignStart: '805年', reignEnd: '820年', reignYears: 15, eraName: '元和', birth: '778年', death: '820年', age: '42岁' },
            { name: '李恒', title: '唐穆宗', reignStart: '820年', reignEnd: '824年', reignYears: 4, eraName: '长庆', birth: '795年', death: '824年', age: '29岁' },
            { name: '李湛', title: '唐敬宗', reignStart: '824年', reignEnd: '826年', reignYears: 2, eraName: '宝历', birth: '809年', death: '826年', age: '17岁' },
            { name: '李昂', title: '唐文宗', reignStart: '826年', reignEnd: '840年', reignYears: 14, eraName: '太和、开成', birth: '809年', death: '840年', age: '31岁' },
            { name: '李炎', title: '唐武宗', reignStart: '840年', reignEnd: '846年', reignYears: 6, eraName: '会昌', birth: '814年', death: '846年', age: '32岁' },
            { name: '李忱', title: '唐宣宗', reignStart: '846年', reignEnd: '859年', reignYears: 13, eraName: '大中', birth: '810年', death: '859年', age: '49岁' },
            { name: '李漼', title: '唐懿宗', reignStart: '859年', reignEnd: '873年', reignYears: 14, eraName: '大中、咸通', birth: '833年', death: '873年', age: '40岁' },
            { name: '李儇', title: '唐僖宗', reignStart: '873年', reignEnd: '888年', reignYears: 15, eraName: '咸通、乾符、广明、中和、光启、文德', birth: '862年', death: '888年', age: '26岁' },
            { name: '李晔', title: '唐昭宗', reignStart: '888年', reignEnd: '904年', reignYears: 16, eraName: '龙纪、大顺、景福、乾宁、光化、天复、天祐', birth: '867年', death: '904年', age: '37岁' },
            { name: '李柷', title: '唐哀帝', reignStart: '904年', reignEnd: '907年', reignYears: 3, eraName: '天祐', birth: '892年', death: '908年', age: '16岁' }
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
        capital: '开封/洛阳等',
        founder: '朱温等',
        lastEmperor: '柴宗训等',
        period: 'imperial',
        description: '唐朝灭亡后中国历史上的大分裂时期，北方相继出现后梁、后唐、后晋、后汉、后周五个朝代，南方同时并立着十个割据政权。\n\n五代是指后梁、后唐、后晋、后汉、后周五个朝代，都建都于中原地区；十国是指前蜀、后蜀、吴、南唐、吴越、闽、楚、南汉、南平、北汉十个割据政权，主要分布在南方和山西。\n\n这一时期政权更迭频繁，战乱不断，但经济文化仍有发展。南方各国相对稳定，经济繁荣；北方虽然战乱频繁，但科技文化仍有进步，如活字印刷术的发明等。\n\n五代十国的分裂局面最终被宋朝统一，结束了72年的分裂状态。',
        emperors: [
            // 后梁 907年－923年
            { name: '朱温', title: '后梁太祖', reignStart: '907年', reignEnd: '912年', reignYears: 5, eraName: '开平、乾化', birth: '852年', death: '912年', age: '60岁', dynasty: '后梁' },
            { name: '朱友珪', title: '后梁郢王', reignStart: '912年', reignEnd: '913年', reignYears: 1, eraName: '凤历', birth: '不详', death: '913年', age: '不详', dynasty: '后梁' },
            { name: '朱友贞', title: '后梁末帝', reignStart: '913年', reignEnd: '923年', reignYears: 10, eraName: '乾化、贞明、龙德', birth: '888年', death: '923年', age: '35岁', dynasty: '后梁' },

            // 后唐 923年－936年
            { name: '李存勖', title: '后唐庄宗', reignStart: '923年', reignEnd: '926年', reignYears: 3, eraName: '同光', birth: '885年', death: '926年', age: '41岁', dynasty: '后唐' },
            { name: '李嗣源', title: '后唐明宗', reignStart: '926年', reignEnd: '933年', reignYears: 7, eraName: '天成、长兴', birth: '867年', death: '933年', age: '66岁', dynasty: '后唐' },
            { name: '李从厚', title: '后唐闵帝', reignStart: '933年', reignEnd: '934年', reignYears: 1, eraName: '应顺', birth: '914年', death: '934年', age: '20岁', dynasty: '后唐' },
            { name: '李从珂', title: '后唐末帝', reignStart: '934年', reignEnd: '936年', reignYears: 2, eraName: '清泰', birth: '885年', death: '936年', age: '51岁', dynasty: '后唐' },

            // 后晋 936年－947年
            { name: '石敬瑭', title: '后晋高祖', reignStart: '936年', reignEnd: '942年', reignYears: 6, eraName: '天福', birth: '892年', death: '942年', age: '50岁', dynasty: '后晋' },
            { name: '石重贵', title: '后晋出帝', reignStart: '942年', reignEnd: '947年', reignYears: 5, eraName: '天福、开运', birth: '914年', death: '974年', age: '60岁', dynasty: '后晋' },

            // 后汉 947年－951年
            { name: '刘知远', title: '后汉高祖', reignStart: '947年', reignEnd: '948年', reignYears: 1, eraName: '天福、乾祐', birth: '895年', death: '948年', age: '53岁', dynasty: '后汉' },
            { name: '刘承祐', title: '后汉隐帝', reignStart: '948年', reignEnd: '951年', reignYears: 3, eraName: '乾祐', birth: '930年', death: '951年', age: '21岁', dynasty: '后汉' },

            // 后周 951年－960年
            { name: '郭威', title: '后周太祖', reignStart: '951年', reignEnd: '954年', reignYears: 3, eraName: '广顺、显德', birth: '904年', death: '954年', age: '50岁', dynasty: '后周' },
            { name: '柴荣', title: '后周世宗', reignStart: '954年', reignEnd: '959年', reignYears: 5, eraName: '显德', birth: '921年', death: '959年', age: '38岁', dynasty: '后周' },
            { name: '柴宗训', title: '后周恭帝', reignStart: '959年', reignEnd: '960年', reignYears: 1, eraName: '显德', birth: '953年', death: '973年', age: '20岁', dynasty: '后周' }
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
        description: '中国历史上经济文化高度发达的朝代，由宋太祖赵匡胤通过"陈桥兵变"建立。北宋结束了五代十国的分裂局面，基本统一了中国，开创了中国古代科技文化的黄金时代。\n\n北宋实行重文轻武的政策，科举制度得到完善，文化教育繁荣。这一时期出现了四大发明中的三项：活字印刷术、火药、指南针。经济高度发达，商业繁荣，出现了世界上最早的纸币"交子"。\n\n北宋在哲学思想方面形成了理学，以程颢、程颐、朱熹为代表；文学艺术方面出现了苏轼、欧阳修、王安石等文学巨匠；科技方面有沈括的《梦溪笔谈》等重要著作。\n\n北宋后期由于冗官、冗兵、冗费等问题，国力衰弱，最终在靖康之变中被金国所灭。',
        emperors: [
            { name: '赵匡胤', title: '宋太祖', reignStart: '960年', reignEnd: '976年', reignYears: 16, eraName: '建隆、乾德、开宝', birth: '927年', death: '976年', age: '49岁' },
            { name: '赵光义', title: '宋太宗', reignStart: '976年', reignEnd: '997年', reignYears: 21, eraName: '太平兴国、雍熙、端拱、淳化、至道', birth: '939年', death: '997年', age: '58岁' },
            { name: '赵恒', title: '宋真宗', reignStart: '997年', reignEnd: '1022年', reignYears: 25, eraName: '咸平、景德、大中祥符、天禧、乾兴', birth: '968年', death: '1022年', age: '54岁' },
            { name: '赵祯', title: '宋仁宗', reignStart: '1022年', reignEnd: '1063年', reignYears: 41, eraName: '天圣、明道、景祐、宝元、康定、庆历、皇祐、至和、嘉祐', birth: '1010年', death: '1063年', age: '53岁' },
            { name: '赵曙', title: '宋英宗', reignStart: '1063年', reignEnd: '1067年', reignYears: 4, eraName: '治平', birth: '1032年', death: '1067年', age: '35岁' },
            { name: '赵顼', title: '宋神宗', reignStart: '1067年', reignEnd: '1085年', reignYears: 18, eraName: '熙宁、元丰', birth: '1048年', death: '1085年', age: '37岁' },
            { name: '赵煦', title: '宋哲宗', reignStart: '1085年', reignEnd: '1100年', reignYears: 15, eraName: '元祐、绍圣、元符', birth: '1076年', death: '1100年', age: '24岁' },
            { name: '赵佶', title: '宋徽宗', reignStart: '1100年', reignEnd: '1125年', reignYears: 25, eraName: '建中靖国、崇宁、大观、政和、重和、宣和', birth: '1082年', death: '1135年', age: '53岁' },
            { name: '赵桓', title: '宋钦宗', reignStart: '1125年', reignEnd: '1127年', reignYears: 2, eraName: '靖康', birth: '1100年', death: '1156年', age: '56岁' }
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
        description: '北宋灭亡后，宋室南迁建立的政权，由宋高宗赵构建立，定都临安（今杭州）。南宋偏安江南，与北方的金国、后来的蒙古（元）长期对峙，虽然军事相对薄弱，但经济文化依然发达。\n\n南宋时期，江南经济进一步发展，成为全国的经济重心，农业、手工业、商业都很繁荣，海外贸易兴盛，泉州成为世界性的大港口。理学思想在南宋时期达到成熟，朱熹集理学之大成，对后世影响深远。\n\n南宋的科技文化成就依然辉煌，出现了《梦溪笔谈》、《本草纲目》等重要著作，指南针、火药等技术进一步完善并传播到世界各地。文学方面，词的创作达到新的高峰，辛弃疾、李清照等词人留下了不朽名作。\n\n南宋后期面临蒙古的强大压力，虽有岳飞、文天祥等忠臣良将奋力抵抗，但最终不敌蒙古铁骑，在崖山海战后彻底灭亡。南宋历时152年，在中华文明史上占有重要地位，共有9位皇帝。',
        emperors: [
            { name: '赵构', title: '宋高宗', reignStart: '1127年', reignEnd: '1162年', reignYears: 35, eraName: '建炎、绍兴', birth: '1107年', death: '1187年', age: '80岁' },
            { name: '赵昚(Shèn)', title: '宋孝宗', reignStart: '1162年', reignEnd: '1189年', reignYears: 27, eraName: '隆兴、乾道、淳熙', birth: '1127年', death: '1194年', age: '67岁' },
            { name: '赵惇(Dūn)', title: '宋光宗', reignStart: '1189年', reignEnd: '1194年', reignYears: 5, eraName: '绍熙', birth: '1147年', death: '1200年', age: '53岁' },
            { name: '赵扩(Kuò)', title: '宋宁宗', reignStart: '1194年', reignEnd: '1224年', reignYears: 30, eraName: '庆元、嘉泰、开禧、嘉定', birth: '1168年', death: '1224年', age: '56岁' },
            { name: '赵昀(Yún)', title: '宋理宗', reignStart: '1224年', reignEnd: '1264年', reignYears: 40, eraName: '宝庆、绍定、端平、嘉熙、淳祐、宝祐、开庆、景定', birth: '1205年', death: '1264年', age: '59岁' },
            { name: '赵禥(Qí)', title: '宋度宗', reignStart: '1264年', reignEnd: '1274年', reignYears: 10, eraName: '咸淳', birth: '1240年', death: '1274年', age: '34岁' },
            { name: '赵显', title: '宋恭帝', reignStart: '1274年', reignEnd: '1276年', reignYears: 2, eraName: '德祐', birth: '1271年', death: '1323年', age: '52岁' },
            { name: '赵昰(Shì)', title: '宋端宗', reignStart: '1276年', reignEnd: '1278年', reignYears: 2, eraName: '景炎', birth: '1272年', death: '1278年', age: '6岁' },
            { name: '赵昺(Bǐng)', title: '宋末帝', reignStart: '1278年', reignEnd: '1279年', reignYears: 1, eraName: '祥兴', birth: '1278年', death: '1279年', age: '1岁' }
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
        description: '中国历史上第一个由少数民族建立的大一统王朝，由蒙古族建立。元朝是蒙古帝国的一部分，疆域辽阔，东起朝鲜半岛，西达东欧，南至东南亚，北抵西伯利亚，是世界历史上疆域最大的帝国之一。\n\n元朝在政治上建立了行省制度，这一制度对后世影响深远，至今仍是中国行政区划的基础。元朝实行民族等级制度，将人民分为蒙古人、色目人、汉人、南人四个等级。在文化上，元朝促进了中外文化交流，马可·波罗等外国人来华，中国的科技文化也传播到世界各地。\n\n元朝时期科技文化继续发展，出现了《农桑辑要》等农学著作，天文学、数学、医学都有重要成就。文学方面，元曲兴起，关汉卿、马致远等戏曲家创作了大量优秀作品。元朝还修建了大运河，促进了南北交通。\n\n元朝后期由于统治腐败，民族矛盾尖锐，加上自然灾害频繁，最终爆发了红巾军起义，朱元璋建立明朝，推翻了元朝统治。元朝历时97年，在中华文明史上具有重要地位，共有11位皇帝。',
        emperors: [
            { name: '忽必烈', title: '元世祖', reignStart: '1260年', reignEnd: '1294年', reignYears: 34, eraName: '中统、至元', birth: '1215年', death: '1294年', age: '79岁' },
            { name: '铁穆耳', title: '元成宗', reignStart: '1294年', reignEnd: '1307年', reignYears: 13, eraName: '元贞、大德', birth: '1265年', death: '1307年', age: '42岁' },
            { name: '海山', title: '元武宗', reignStart: '1307年', reignEnd: '1311年', reignYears: 4, eraName: '至大', birth: '1281年', death: '1311年', age: '30岁' },
            { name: '爱育黎拔力八达', title: '元仁宗', reignStart: '1311年', reignEnd: '1320年', reignYears: 9, eraName: '皇庆、延祐', birth: '1285年', death: '1320年', age: '35岁' },
            { name: '硕德八剌(Lá)', title: '元英宗', reignStart: '1320年', reignEnd: '1323年', reignYears: 3, eraName: '至治', birth: '1303年', death: '1323年', age: '20岁' },
            { name: '也孙铁木儿', title: '元泰定帝', reignStart: '1323年', reignEnd: '1328年', reignYears: 5, eraName: '泰定、致和', birth: '1293年', death: '1328年', age: '35岁' },
            { name: '阿速吉八', title: '元天顺帝', reignStart: '1328年', reignEnd: '1328年', reignYears: 1, eraName: '天顺', birth: '1320年', death: '1328年', age: '8岁' },
            { name: '图帖睦尔', title: '元文宗', reignStart: '1328年', reignEnd: '1332年', reignYears: 4, eraName: '天历、至顺', birth: '1304年', death: '1332年', age: '28岁' },
            { name: '懿璘(Lín)质班', title: '元明宗', reignStart: '1329年', reignEnd: '1329年', reignYears: 1, eraName: '天历', birth: '1326年', death: '1329年', age: '3岁' },
            { name: '宁宗', title: '元宁宗', reignStart: '1332年', reignEnd: '1332年', reignYears: 1, eraName: '至顺', birth: '1326年', death: '1332年', age: '6岁' },
            { name: '妥懽(Huān)帖睦尔', title: '元顺帝', reignStart: '1333年', reignEnd: '1368年', reignYears: 35, eraName: '元统、至元、至正', birth: '1320年', death: '1370年', age: '50岁' }
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
        description: '中国历史上最后一个由汉族建立的大一统王朝，由明太祖朱元璋建立。明朝推翻了元朝的统治，恢复了汉族政权，在政治、经济、文化等方面都取得了重要成就。\n\n明朝的建立：元末，朱元璋起义于濠州，逐步统一南方，建立明朝。1368年，朱元璋定都南京，建立了明朝政权。随后，明朝继续北伐，消灭了元朝残余势力，完成了全国统一。\n\n明朝的鼎盛：明朝前期国力强盛，明成祖朱棣迁都北京，修建了紫禁城，派遣郑和七下西洋，展现了中华文明的辉煌。明朝建立了完善的科举制度，编纂了《永乐大典》等重要典籍，小说、戏曲等文学形式达到新的高峰，出现了《西游记》、《水浒传》、《三国演义》、《红楼梦》等四大名著中的三部。明朝的手工业和商业发达，出现了资本主义萌芽，农业技术也有很大发展。\n\n明朝的衰落：明朝后期由于政治腐败、宦官专权、自然灾害频繁、外敌入侵等多重因素，国力衰落。李自成农民起义最终攻陷北京，崇祯帝自缢身亡，明朝灭亡。随后满族入关，建立清朝。\n\n明朝历时276年，在中华文明史上占有重要地位，共有17位皇帝。',
        emperors: [
            { name: '朱元璋', title: '明太祖', reignStart: '1368年', reignEnd: '1398年', reignYears: 30, eraName: '洪武', birth: '1328年', death: '1398年', age: '70岁' },
            { name: '朱允炆', title: '明惠帝', reignStart: '1398年', reignEnd: '1402年', reignYears: 4, eraName: '建文', birth: '1377年', death: '1402年', age: '25岁' },
            { name: '朱棣', title: '明成祖', reignStart: '1402年', reignEnd: '1424年', reignYears: 22, eraName: '永乐', birth: '1360年', death: '1424年', age: '64岁' },
            { name: '朱高炽', title: '明仁宗', reignStart: '1424年', reignEnd: '1425年', reignYears: 1, eraName: '洪熙', birth: '1378年', death: '1425年', age: '47岁' },
            { name: '朱瞻基', title: '明宣宗', reignStart: '1425年', reignEnd: '1435年', reignYears: 10, eraName: '宣德', birth: '1399年', death: '1435年', age: '36岁' },
            { name: '朱祁镇', title: '明英宗', reignStart: '1435年', reignEnd: '1449年', reignYears: 14, eraName: '正统', birth: '1427年', death: '1464年', age: '37岁' },
            { name: '朱祁钰', title: '明代宗', reignStart: '1449年', reignEnd: '1457年', reignYears: 8, eraName: '景泰', birth: '1428年', death: '1457年', age: '29岁' },
            { name: '朱祁镇', title: '明英宗(复辟)', reignStart: '1457年', reignEnd: '1464年', reignYears: 7, eraName: '天顺', birth: '1427年', death: '1464年', age: '37岁' },
            { name: '朱见深', title: '明宪宗', reignStart: '1464年', reignEnd: '1487年', reignYears: 23, eraName: '成化', birth: '1447年', death: '1487年', age: '40岁' },
            { name: '朱祐樘', title: '明孝宗', reignStart: '1487年', reignEnd: '1505年', reignYears: 18, eraName: '弘治', birth: '1470年', death: '1505年', age: '35岁' },
            { name: '朱厚照', title: '明武宗', reignStart: '1505年', reignEnd: '1521年', reignYears: 16, eraName: '正德', birth: '1491年', death: '1521年', age: '30岁' },
            { name: '朱厚熜(Cōng)', title: '明世宗', reignStart: '1521年', reignEnd: '1567年', reignYears: 46, eraName: '嘉靖', birth: '1507年', death: '1567年', age: '60岁' },
            { name: '朱载垕(Hòu)', title: '明穆宗', reignStart: '1567年', reignEnd: '1572年', reignYears: 5, eraName: '隆庆', birth: '1537年', death: '1572年', age: '35岁' },
            { name: '朱翊钧', title: '明神宗', reignStart: '1572年', reignEnd: '1620年', reignYears: 48, eraName: '万历', birth: '1563年', death: '1620年', age: '57岁' },
            { name: '朱常洛', title: '明光宗', reignStart: '1620年', reignEnd: '1620年', reignYears: '29天', eraName: '泰昌', birth: '1582年', death: '1620年', age: '38岁' },
            { name: '朱由校', title: '明熹宗', reignStart: '1620年', reignEnd: '1627年', reignYears: 7, eraName: '天启', birth: '1605年', death: '1627年', age: '22岁' },
            { name: '朱由检', title: '明思宗', reignStart: '1627年', reignEnd: '1644年', reignYears: 17, eraName: '崇祯', birth: '1611年', death: '1644年', age: '33岁' }
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
        description: '中国历史上最后一个封建王朝，由满族建立。清朝是中国历史上疆域最辽阔、人口最多的朝代之一，经历了从兴盛到衰落的完整历程，最终被辛亥革命推翻。\n\n清朝的兴起：1616年努尔哈赤建立后金，1636年皇太极改国号为清。1644年李自成攻陷北京，明朝灭亡，清军入关，逐步统一全国，建立了对中国的统治。\n\n清朝的鼎盛：清朝前期出现了"康乾盛世"，国力强盛，疆域辽阔，东起库页岛，西至葱岭，南达南海诸岛，北抵外兴安岭，总面积达1300多万平方公里。清朝统一了台湾，平定了准噶尔叛乱，加强了对西藏、新疆的管理，巩固了多民族国家的统一。在文化上编纂了《四库全书》等重要典籍，人口从明末的6000万增长到清末的4亿多。\n\n清朝的衰落：清朝后期由于闭关锁国政策，错失了工业革命的机遇，在鸦片战争后逐渐沦为半殖民地半封建社会。虽然进行了洋务运动、戊戌变法等改革尝试，但最终无法挽回颓势。1911年辛亥革命爆发，1912年宣统帝退位，清朝灭亡。\n\n清朝历时276年，是中国封建社会的最后一个朝代，共有12位皇帝。',
        emperors: [
            { name: '爱新觉罗·努尔哈赤', title: '清太祖', reignStart: '1616年', reignEnd: '1626年', reignYears: 10, eraName: '天命', birth: '1559年', death: '1626年', age: '68岁' },
            { name: '爱新觉罗·皇太极', title: '清太宗', reignStart: '1626年', reignEnd: '1643年', reignYears: 17, eraName: '天聪、崇德', birth: '1592年', death: '1643年', age: '52岁' },
            { name: '爱新觉罗·福临', title: '清世祖', reignStart: '1644年', reignEnd: '1661年', reignYears: 17, eraName: '顺治', birth: '1638年', death: '1661年', age: '24岁' },
            { name: '爱新觉罗·玄烨', title: '清圣祖', reignStart: '1661年', reignEnd: '1722年', reignYears: 61, eraName: '康熙', birth: '1654年', death: '1722年', age: '69岁' },
            { name: '爱新觉罗·胤禛(Yìn Zhēn)', title: '清世宗', reignStart: '1722年', reignEnd: '1735年', reignYears: 13, eraName: '雍正', birth: '1678年', death: '1735年', age: '58岁' },
            { name: '爱新觉罗·弘历', title: '清高宗', reignStart: '1735年', reignEnd: '1796年', reignYears: 61, eraName: '乾隆', birth: '1711年', death: '1799年', age: '89岁' },
            { name: '爱新觉罗·颙琰(Yóng Yǎn)', title: '清仁宗', reignStart: '1796年', reignEnd: '1820年', reignYears: 24, eraName: '嘉庆', birth: '1760年', death: '1820年', age: '61岁' },
            { name: '爱新觉罗·旻(Mín)宁', title: '清宣宗', reignStart: '1820年', reignEnd: '1850年', reignYears: 30, eraName: '道光', birth: '1782年', death: '1850年', age: '69岁' },
            { name: '爱新觉罗·奕詝(Zhǔ)', title: '清文宗', reignStart: '1850年', reignEnd: '1861年', reignYears: 11, eraName: '咸丰', birth: '1831年', death: '1861年', age: '31岁' },
            { name: '爱新觉罗·载淳(chún)', title: '清穆宗', reignStart: '1861年', reignEnd: '1875年', reignYears: 14, eraName: '同治', birth: '1856年', death: '1875年', age: '19岁' },
            { name: '爱新觉罗·载湉(Tián)', title: '清德宗', reignStart: '1875年', reignEnd: '1908年', reignYears: 33, eraName: '光绪', birth: '1871年', death: '1908年', age: '38岁' },
            { name: '爱新觉罗·溥仪', title: '清末帝', reignStart: '1908年', reignEnd: '1912年', reignYears: 4, eraName: '宣统', birth: '1906年', death: '1967年', age: '61岁' }
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
        description: '中国历史上第一个共和政府，由孙中山领导的辛亥革命推翻清朝建立。中华民国的建立结束了中国两千多年的封建帝制，开创了共和政治的新纪元。\n\n中华民国初期政局动荡，经历了袁世凯称帝、军阀混战等政治危机。1928年国民政府完成北伐，基本统一全国，开始进行现代化建设。这一时期在政治上建立了三民主义的政治体系，在经济上发展民族工业，在文化上推行新文化运动，促进了思想解放。\n\n抗日战争时期（1937-1945年），中华民国政府领导全国人民进行了艰苦卓绝的抗战，最终取得胜利，成为联合国创始会员国之一。战后由于内战爆发，国民政府最终迁至台湾地区继续存在。\n\n中华民国在大陆时期虽然只有37年，但推翻了封建制度，建立了共和政体，为中国的现代化进程奠定了重要基础，共有多位领导人。',
        emperors: [
            { name: '孙中山', title: '临时大总统', reignStart: '1912年', reignEnd: '1912年', reignYears: 1, eraName: '中华民国元年', birth: '1866年', death: '1925年', age: '59岁' },
            { name: '袁世凯', title: '大总统', reignStart: '1912年', reignEnd: '1916年', reignYears: 4, eraName: '民国', birth: '1859年', death: '1916年', age: '57岁' },
            { name: '蒋介石', title: '国民政府主席', reignStart: '1928年', reignEnd: '1949年', reignYears: 21, eraName: '民国', birth: '1887年', death: '1975年', age: '88岁' }
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

.dynasty-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    /* 隐藏滚动条 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.dynasty-content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari and Opera */
}

/* 时间轴区域样式 */
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
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 1.5rem;
    transition: all 0.2s ease;
}

.dynasty-card:hover {
    background: var(--bg-hover);
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

.dynasty-header {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto auto;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #f1f5f9;
}

.dynasty-main {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
}

.dynasty-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
}

.dynasty-basic {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.125rem;
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
    grid-column: 1 / -1;
    grid-row: 2;
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
}

.dynasty-founder {
    grid-column: 1 / -1;
    grid-row: 3;
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
}

.dynasty-capital {
    color: #475569;
    font-weight: 500;
}

.emperors-count {
    color: #7c3aed;
    font-weight: 600;
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
    white-space: pre-line;
}

.achievements-section {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
}

.achievements-section h5 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.75rem 0;
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

.emperor-birth-death {
    color: #6b7280;
    font-size: 0.8rem;
    min-width: 8rem;
}

.emperor-age {
    color: #059669;
    font-weight: 500;
    min-width: 4rem;
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

/* 响应式设计 */
@media (max-width: 1024px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }

    .dynasty-header {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;
        gap: 0.5rem;
    }

    .dynasty-main {
        grid-column: 1;
        grid-row: 1;
    }

    .dynasty-basic {
        grid-column: 1;
        grid-row: 2;
        align-items: flex-start;
    }

    .dynasty-info {
        grid-column: 1;
        grid-row: 3;
        flex-direction: column;
        gap: 0.25rem;
    }

    .dynasty-founder {
        grid-column: 1;
        grid-row: 4;
    }
}

@media (max-width: 768px) {
    .timeline-marker {
        margin-right: 1rem;
    }

    .dynasty-card {
        padding: 1rem;
    }

    .dynasty-name {
        font-size: 1.25rem;
    }

    .emperors-table {
        font-size: 0.75rem;
    }

    .emperors-table th,
    .emperors-table td {
        padding: 0.5rem 0.25rem;
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

    .emperors-table {
        font-size: 0.7rem;
    }

    .emperors-table th,
    .emperors-table td {
        padding: 0.375rem 0.25rem;
    }

    /* 隐藏部分列以节省空间 */
    .emperors-table th:first-child,
    .emperors-table td:first-child,
    .emperors-table th:nth-child(3),
    .emperors-table td:nth-child(3),
    .emperors-table th:nth-child(7),
    .emperors-table td:nth-child(7) {
        display: none;
    }
}
</style>