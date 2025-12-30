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
                                            <span class="era-prefix">约前</span>
                                            {{ emperor.reignStart.replace('约前', '') }} - {{
                                                emperor.reignEnd.replace('约前', '') }}
                                        </td>
                                        <td class="emperor-years-table">{{ typeof emperor.reignYears === 'number' ?
                                            emperor.reignYears + '年' : emperor.reignYears }}</td>
                                        <td class="emperor-birth-death">
                                            <span v-if="emperor.birth === '不详' || emperor.death === '不详'">不详</span>
                                            <span v-else-if="emperor.birth && emperor.death">
                                                <span class="era-prefix">约前</span>
                                                {{ emperor.birth.replace('约前', '') }} - {{ emperor.death.replace('约前',
                                                    '') }}
                                            </span>
                                            <span v-else>-</span>
                                        </td>
                                        <td class="emperor-age">
                                            <span v-if="emperor.age === '不详'">不详</span>
                                            <span v-else-if="emperor.age">{{ emperor.age }}岁</span>
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
    pinyin?: string
    title: string
    reignStart: string
    reignEnd: string
    reignYears: number | string
    eraName?: string
    birth?: string
    death?: string
    age?: number | string
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
            { name: '姬繄(yī)扈', title: '周共王', reignStart: '约前922年', reignEnd: '约前900年', reignYears: 22, birth: '不详', death: '不详', age: '不详' },
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
            { name: '姬宜臼', pinyin: 'Jī Yí Jiù', title: '周平王', reignStart: '前770年', reignEnd: '前720年', reignYears: 50, birth: '不详', death: '不详', age: '不详' },
            { name: '姬林', pinyin: 'Jī Lín', title: '周桓王', reignStart: '前719年', reignEnd: '前697年', reignYears: 22, birth: '不详', death: '不详', age: '不详' },
            { name: '姬佗', pinyin: 'Jī Tuó', title: '周庄王', reignStart: '前696年', reignEnd: '前682年', reignYears: 14, birth: '不详', death: '不详', age: '不详' },
            { name: '姬胡齐', pinyin: 'Jī Hú Qí', title: '周釐王', reignStart: '前681年', reignEnd: '前677年', reignYears: 4, birth: '不详', death: '不详', age: '不详' },
            { name: '姬阆', pinyin: 'Jī Láng', title: '周惠王', reignStart: '前676年', reignEnd: '前652年', reignYears: 24, birth: '不详', death: '不详', age: '不详' },
            { name: '姬郑', pinyin: 'Jī Zhèng', title: '周襄王', reignStart: '前651年', reignEnd: '前619年', reignYears: 32, birth: '不详', death: '不详', age: '不详' },
            { name: '姬壬臣', pinyin: 'Jī Rén Chén', title: '周顷王', reignStart: '前618年', reignEnd: '前613年', reignYears: 5, birth: '不详', death: '不详', age: '不详' },
            { name: '姬班', pinyin: 'Jī Bān', title: '周匡王', reignStart: '前612年', reignEnd: '前607年', reignYears: 5, birth: '不详', death: '不详', age: '不详' },
            { name: '姬瑜', pinyin: 'Jī Yú', title: '周定王', reignStart: '前606年', reignEnd: '前586年', reignYears: 20, birth: '不详', death: '不详', age: '不详' },
            { name: '姬夷', pinyin: 'Jī Yí', title: '周简王', reignStart: '前585年', reignEnd: '前572年', reignYears: 13, birth: '不详', death: '不详', age: '不详' },
            { name: '姬泄心', pinyin: 'Jī Xiè Xīn', title: '周灵王', reignStart: '前571年', reignEnd: '前545年', reignYears: 26, birth: '不详', death: '不详', age: '不详' },
            { name: '姬贵', pinyin: 'Jī Guì', title: '周景王', reignStart: '前544年', reignEnd: '前521年', reignYears: 23, birth: '不详', death: '不详', age: '不详' },
            { name: '姬猛', pinyin: 'Jī Měng', title: '周悼王', reignStart: '前520年', reignEnd: '前520年', reignYears: '数月', birth: '不详', death: '不详', age: '不详' },
            { name: '姬丐', pinyin: 'Jī Gài', title: '周敬王', reignStart: '前519年', reignEnd: '前476年', reignYears: 43, birth: '不详', death: '不详', age: '不详' },
            { name: '姬仁', pinyin: 'Jī Rén', title: '周元王', reignStart: '前475年', reignEnd: '前469年', reignYears: 6, birth: '不详', death: '不详', age: '不详' },
            { name: '姬介', pinyin: 'Jī Jiè', title: '周贞定王', reignStart: '前468年', reignEnd: '前441年', reignYears: 27, birth: '不详', death: '不详', age: '不详' },
            { name: '姬去疾', pinyin: 'Jī Qù Jí', title: '周哀王', reignStart: '前441年', reignEnd: '前441年', reignYears: '3个月', birth: '不详', death: '不详', age: '不详' },
            { name: '姬叔', pinyin: 'Jī Shū', title: '周思王', reignStart: '前441年', reignEnd: '前441年', reignYears: '5个月', birth: '不详', death: '不详', age: '不详' },
            { name: '姬嵬', pinyin: 'Jī Wéi', title: '周考王', reignStart: '前440年', reignEnd: '前426年', reignYears: 14, birth: '不详', death: '不详', age: '不详' },
            { name: '姬午', pinyin: 'Jī Wǔ', title: '周威烈王', reignStart: '前425年', reignEnd: '前402年', reignYears: 23, birth: '不详', death: '不详', age: '不详' },
            { name: '姬骄', pinyin: 'Jī Jiāo', title: '周安王', reignStart: '前401年', reignEnd: '前376年', reignYears: 25, birth: '不详', death: '不详', age: '不详' },
            { name: '姬喜', pinyin: 'Jī Xǐ', title: '周烈王', reignStart: '前375年', reignEnd: '前369年', reignYears: 6, birth: '不详', death: '不详', age: '不详' },
            { name: '姬扁', pinyin: 'Jī Biǎn', title: '周显王', reignStart: '前368年', reignEnd: '前321年', reignYears: 47, birth: '不详', death: '不详', age: '不详' },
            { name: '姬定', pinyin: 'Jī Dìng', title: '周慎靓王', reignStart: '前320年', reignEnd: '前315年', reignYears: 5, birth: '不详', death: '不详', age: '不详' },
            { name: '姬延', pinyin: 'Jī Yán', title: '周赧王', reignStart: '前314年', reignEnd: '前256年', reignYears: 58, birth: '不详', death: '不详', age: '不详' }
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
        description: '中国历史上第一个统一的中央集权制帝国，由秦始皇嬴政建立。秦朝结束了春秋战国以来长期分裂割据的局面，建立了中国历史上第一个统一的多民族的中央集权国家。\n\n秦始皇统一六国后，在政治上建立了皇帝制度和三公九卿制，在地方实行郡县制；在经济上统一货币、度量衡；在文化上统一文字，推行小篆；在军事上修筑万里长城，抵御北方匈奴。秦朝还修建了大量的道路和水利工程，如直道、灵渠等。\n\n但秦朝实行严刑峻法，赋税繁重，徭役频繁，激起了人民的反抗。秦始皇死后，秦二世胡亥继位，政治更加黑暗，最终爆发了陈胜吴广起义，各地纷纷响应，秦朝迅速灭亡。\n\n秦朝虽然存在时间很短，仅历时15年，但其建立的政治制度对后世产生了深远影响，共有3位皇帝。',
        emperors: [
            { name: '嬴政', pinyin: 'Yíng Zhèng', title: '秦始皇帝', reignStart: '前221年', reignEnd: '前210年', reignYears: 11, birth: '不详', death: '不详', age: '不详' },
            { name: '嬴胡亥', pinyin: 'Yíng Hú Hài', title: '秦二世皇帝', reignStart: '前210年', reignEnd: '前207年', reignYears: 3, birth: '不详', death: '不详', age: '不详' },
            { name: '嬴子婴', pinyin: 'Yíng Zǐ Yīng', title: '秦王子婴', reignStart: '前207年', reignEnd: '前206年', reignYears: 1, birth: '不详', death: '不详', age: '不详' }
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
            { name: '刘邦', pinyin: 'Liú Bāng', title: '汉高祖', reignStart: '前202年', reignEnd: '前195年', reignYears: 7, eraName: '汉', birth: '不详', death: '不详', age: '不详' },
            { name: '刘盈', pinyin: 'Liú Yíng', title: '汉惠帝', reignStart: '前194年', reignEnd: '前188年', reignYears: 6, eraName: '汉', birth: '不详', death: '不详', age: '不详' },
            { name: '刘恭', pinyin: 'Liú Gōng', title: '汉前少帝', reignStart: '前188年', reignEnd: '前184年', reignYears: 4, eraName: '汉', birth: '不详', death: '不详', age: '不详' },
            { name: '刘弘', pinyin: 'Liú Hóng', title: '汉后少帝', reignStart: '前184年', reignEnd: '前180年', reignYears: 4, eraName: '汉', birth: '不详', death: '不详', age: '不详' },
            { name: '刘恒', pinyin: 'Liú Héng', title: '汉文帝', reignStart: '前180年', reignEnd: '前157年', reignYears: 23, eraName: '汉', birth: '不详', death: '不详', age: '不详' },
            { name: '刘启', pinyin: 'Liú Qǐ', title: '汉景帝', reignStart: '前156年', reignEnd: '前141年', reignYears: 15, eraName: '汉', birth: '不详', death: '不详', age: '不详' },
            { name: '刘彻', pinyin: 'Liú Chè', title: '汉武帝', reignStart: '前140年', reignEnd: '前87年', reignYears: 53, eraName: '建元、元光、元朔、元狩、元鼎、元封、太初、天汉、太始、征和、后元', birth: '不详', death: '不详', age: '不详' },
            { name: '刘弗陵', pinyin: 'Liú Fú Líng', title: '汉昭帝', reignStart: '前86年', reignEnd: '前74年', reignYears: 12, eraName: '始元、元凤、元平', birth: '不详', death: '不详', age: '不详' },
            { name: '刘贺', pinyin: 'Liú Hè', title: '汉废帝', reignStart: '前74年', reignEnd: '前74年', reignYears: '27天', eraName: '汉', birth: '不详', death: '不详', age: '不详' },
            { name: '刘询', pinyin: 'Liú Xún', title: '汉宣帝', reignStart: '前73年', reignEnd: '前49年', reignYears: 24, eraName: '本始、地节、元康、神爵、五凤、甘露、黄龙', birth: '不详', death: '不详', age: '不详' },
            { name: '刘奭', pinyin: 'Liú Shì', title: '汉元帝', reignStart: '前48年', reignEnd: '前33年', reignYears: 15, eraName: '初元、永光、建昭、竟宁', birth: '不详', death: '不详', age: '不详' },
            { name: '刘骜', pinyin: 'Liú Áo', title: '汉成帝', reignStart: '前32年', reignEnd: '前7年', reignYears: 25, eraName: '建始、河平、阳朔、鸿嘉、永始、元延、绥和', birth: '不详', death: '不详', age: '不详' },
            { name: '刘欣', pinyin: 'Liú Xīn', title: '汉哀帝', reignStart: '前6年', reignEnd: '前1年', reignYears: 5, eraName: '建平、太初元将、元寿', birth: '不详', death: '不详', age: '不详' },
            { name: '刘衎', pinyin: 'Liú Kàn', title: '汉平帝', reignStart: '1年', reignEnd: '5年', reignYears: 4, eraName: '元始', birth: '不详', death: '不详', age: '不详' },
            { name: '刘婴', pinyin: 'Liú Yīng', title: '孺子婴', reignStart: '6年', reignEnd: '8年', reignYears: 2, eraName: '居摄、初始', birth: '不详', death: '不详', age: '不详' }
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
            { name: '王莽', pinyin: 'Wáng Mǎng', title: '新始祖', reignStart: '8年', reignEnd: '23年', reignYears: 15, eraName: '始建国、天凤、地皇', birth: '不详', death: '不详', age: '不详' }
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
        description: '汉朝的延续，由汉光武帝刘秀建立。东汉是中国历史上继西汉之后的又一个重要统一王朝，定都洛阳，因此称为东汉。\n\n东汉前期政治清明，经济繁荣，出现了"光武中兴"和"明章之治"等盛世局面。这一时期科技文化继续发展，出现了造纸术等重要发明，蔡伦改进了造纸技术；张衡发明了地动仪；医学家张仲景著有《伤寒杂病论》。\n\n东汉时期佛教正式传入中国，对中国文化产生了深远影响。丝绸之路继续繁荣，中外文化交流频繁。东汉的疆域基本继承了西汉的版图，并在西域设立了西域都护府。\n\n东汉后期外戚宦官专权，政治腐败，黄巾起义爆发后，东汉名存实亡，最终被曹魏取代。东汉历时195年，共有14位皇帝。',
        emperors: [
            { name: '刘秀', pinyin: 'Liú Xiù', title: '汉光武帝', reignStart: '25年', reignEnd: '57年', reignYears: 32, eraName: '建武、建武中元', birth: '不详', death: '不详', age: '不详' },
            { name: '刘庄', pinyin: 'Liú Zhuāng', title: '汉明帝', reignStart: '57年', reignEnd: '75年', reignYears: 18, eraName: '永平', birth: '不详', death: '不详', age: '不详' },
            { name: '刘炟', pinyin: 'Liú Dá', title: '汉章帝', reignStart: '75年', reignEnd: '88年', reignYears: 13, eraName: '建初、元和、章和', birth: '不详', death: '不详', age: '不详' },
            { name: '刘肇', pinyin: 'Liú Zhào', title: '汉和帝', reignStart: '88年', reignEnd: '106年', reignYears: 18, eraName: '永元、元兴', birth: '不详', death: '不详', age: '不详' },
            { name: '刘隆', pinyin: 'Liú Lóng', title: '汉殇帝', reignStart: '106年', reignEnd: '106年', reignYears: '8个月', eraName: '延平', birth: '不详', death: '不详', age: '不详' },
            { name: '刘祜', pinyin: 'Liú Hù', title: '汉安帝', reignStart: '106年', reignEnd: '125年', reignYears: 19, eraName: '永初、元初、永宁、建光、延光', birth: '不详', death: '不详', age: '不详' },
            { name: '刘懿', pinyin: 'Liú Yì', title: '汉前少帝', reignStart: '125年', reignEnd: '125年', reignYears: '7个月', birth: '不详', death: '不详', age: '不详' },
            { name: '刘保', pinyin: 'Liú Bǎo', title: '汉顺帝', reignStart: '125年', reignEnd: '144年', reignYears: 19, eraName: '永建、阳嘉、永和、汉安、建康', birth: '不详', death: '不详', age: '不详' },
            { name: '刘炳', pinyin: 'Liú Bǐng', title: '汉冲帝', reignStart: '144年', reignEnd: '145年', reignYears: '5个月', eraName: '永嘉', birth: '不详', death: '不详', age: '不详' },
            { name: '刘缵', pinyin: 'Liú Zuǎn', title: '汉质帝', reignStart: '145年', reignEnd: '146年', reignYears: 1, eraName: '本初', birth: '不详', death: '不详', age: '不详' },
            { name: '刘志', pinyin: 'Liú Zhì', title: '汉桓帝', reignStart: '146年', reignEnd: '167年', reignYears: 21, eraName: '建和、和平、元嘉、永兴、永寿、延熹、永康', birth: '不详', death: '不详', age: '不详' },
            { name: '刘宏', pinyin: 'Liú Hóng', title: '汉灵帝', reignStart: '167年', reignEnd: '189年', reignYears: 22, eraName: '建宁、熹平、光和、中平', birth: '不详', death: '不详', age: '不详' },
            { name: '刘辩', pinyin: 'Liú Biàn', title: '汉后少帝', reignStart: '189年', reignEnd: '189年', reignYears: '4个月', eraName: '光熹、昭宁', birth: '不详', death: '不详', age: '不详' },
            { name: '刘协', pinyin: 'Liú Xié', title: '汉献帝', reignStart: '189年', reignEnd: '220年', reignYears: 31, eraName: '初平、兴平、建安、延康', birth: '不详', death: '不详', age: '不详' }
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
        description: '东汉末年群雄割据，最终形成魏蜀吴三国鼎立的局面。这一时期英雄辈出，是中国历史上著名的分裂时期，也是军事、政治人才荟萃的时代。\n\n魏国由曹操奠基，曹丕建立，定都洛阳，占据中原地区，国力最强；蜀国由刘备建立，定都成都，占据四川盆地，以恢复汉室为号召；吴国由孙权建立，定都建业（今南京），占据江南地区，善于水战。\n\n三国时期战争频繁，著名的战役有官渡之战、赤壁之战、夷陵之战等。这一时期涌现出了诸葛亮、司马懿、周瑜、陆逊等杰出的政治家和军事家。三国文化对后世影响深远，《三国演义》等文学作品使这一时期的人物和故事家喻户晓。\n\n最终蜀国最先灭亡（263年），吴国被西晋所灭（280年），三国归晋。三国时期历时60年，魏国5位皇帝，蜀国2位皇帝，吴国4位皇帝。',
        emperors: [
            { name: '曹丕', pinyin: 'Cáo Pī', title: '魏文帝', reignStart: '220年', reignEnd: '226年', reignYears: 6, eraName: '黄初', birth: '不详', death: '不详', age: '不详' },
            { name: '曹叡', pinyin: 'Cáo Ruì', title: '魏明帝', reignStart: '226年', reignEnd: '239年', reignYears: 13, eraName: '太和、青龙、景初', birth: '不详', death: '不详', age: '不详' },
            { name: '曹芳', pinyin: 'Cáo Fāng', title: '魏齐王', reignStart: '239年', reignEnd: '254年', reignYears: 15, eraName: '正始、嘉平', birth: '不详', death: '不详', age: '不详' },
            { name: '曹髦', pinyin: 'Cáo Máo', title: '魏高贵乡公', reignStart: '254年', reignEnd: '260年', reignYears: 6, eraName: '正元、甘露', birth: '不详', death: '不详', age: '不详' },
            { name: '曹奂', pinyin: 'Cáo Huàn', title: '魏元帝', reignStart: '260年', reignEnd: '265年', reignYears: 5, eraName: '景元、咸熙', birth: '不详', death: '不详', age: '不详' },
            { name: '刘备', pinyin: 'Liú Bèi', title: '蜀昭烈帝', reignStart: '221年', reignEnd: '223年', reignYears: 2, eraName: '章武', birth: '不详', death: '不详', age: '不详' },
            { name: '刘禅', pinyin: 'Liú Shàn', title: '蜀后主', reignStart: '223年', reignEnd: '263年', reignYears: 40, eraName: '建兴、延熙、景耀、炎兴', birth: '不详', death: '不详', age: '不详' },
            { name: '孙权', pinyin: 'Sūn Quán', title: '吴大帝', reignStart: '229年', reignEnd: '252年', reignYears: 23, eraName: '黄龙、嘉禾、赤乌、太元、神凤', birth: '不详', death: '不详', age: '不详' },
            { name: '孙亮', pinyin: 'Sūn Liàng', title: '吴会稽王', reignStart: '252年', reignEnd: '258年', reignYears: 6, eraName: '建兴、五凤、太平', birth: '不详', death: '不详', age: '不详' },
            { name: '孙休', pinyin: 'Sūn Xiū', title: '吴景帝', reignStart: '258年', reignEnd: '264年', reignYears: 6, eraName: '永安', birth: '不详', death: '不详', age: '不详' },
            { name: '孙皓', pinyin: 'Sūn Hào', title: '吴末帝', reignStart: '264年', reignEnd: '280年', reignYears: 16, eraName: '元兴、甘露、宝鼎、建衡、凤凰、天册、天玺、天纪', birth: '不详', death: '不详', age: '不详' }
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
            { name: '司马炎', pinyin: 'Sī Mǎ Yán', title: '晋武帝', reignStart: '266年', reignEnd: '290年', reignYears: 24, eraName: '泰始、咸宁、太康、太熙', birth: '不详', death: '不详', age: '不详' },
            { name: '司马衷', pinyin: 'Sī Mǎ Zhōng', title: '晋惠帝', reignStart: '290年', reignEnd: '307年', reignYears: 17, eraName: '永熙、永平、元康、永康、永宁、太安、永兴、光熙', birth: '不详', death: '不详', age: '不详' },
            { name: '司马炽', pinyin: 'Sī Mǎ Chì', title: '晋怀帝', reignStart: '307年', reignEnd: '313年', reignYears: 6, eraName: '永嘉', birth: '不详', death: '不详', age: '不详' },
            { name: '司马邺', pinyin: 'Sī Mǎ Yè', title: '晋愍帝', reignStart: '313年', reignEnd: '316年', reignYears: 3, eraName: '建兴', birth: '不详', death: '不详', age: '不详' }
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
        description: '西晋灭亡后，司马氏在南方建立的政权，与北方十六国并立。东晋由司马睿建立，定都建康（今南京），偏安江南，与北方的十六国政权长期对峙。\n\n东晋前期，在王导、谢安等名臣辅佐下，政治相对稳定。著名的淝水之战中，东晋以少胜多，击败了前秦苻坚的百万大军，保住了江南半壁江山。这一时期文化艺术繁荣，出现了王羲之、顾恺之等杰出的艺术家。\n\n东晋时期佛教和道教都得到很大发展，佛教寺院遍布江南，道教理论也日趋完善。士族门阀制度在这一时期达到鼎盛，形成了"王谢"等著名的门阀世族。\n\n东晋后期，门阀政治腐朽，皇权衰微，军阀割据严重。最终刘裕崛起，废除晋恭帝，建立刘宋，东晋灭亡。东晋历时103年，共有11位皇帝。',
        emperors: [
            { name: '司马睿', pinyin: 'Sī Mǎ Ruì', title: '晋元帝', reignStart: '317年', reignEnd: '323年', reignYears: 6, eraName: '建武、大兴', birth: '不详', death: '不详', age: '不详' },
            { name: '司马绍', pinyin: 'Sī Mǎ Shào', title: '晋明帝', reignStart: '323年', reignEnd: '325年', reignYears: 2, eraName: '太宁', birth: '不详', death: '不详', age: '不详' },
            { name: '司马衍', pinyin: 'Sī Mǎ Yǎn', title: '晋成帝', reignStart: '325年', reignEnd: '342年', reignYears: 17, eraName: '咸和、咸康', birth: '不详', death: '不详', age: '不详' },
            { name: '司马岳', pinyin: 'Sī Mǎ Yuè', title: '晋康帝', reignStart: '342年', reignEnd: '344年', reignYears: 2, eraName: '建元', birth: '不详', death: '不详', age: '不详' },
            { name: '司马聃', pinyin: 'Sī Mǎ Dān', title: '晋穆帝', reignStart: '344年', reignEnd: '361年', reignYears: 17, eraName: '永和、升平', birth: '不详', death: '不详', age: '不详' },
            { name: '司马丕', pinyin: 'Sī Mǎ Pī', title: '晋哀帝', reignStart: '361年', reignEnd: '365年', reignYears: 4, eraName: '隆和、兴宁', birth: '不详', death: '不详', age: '不详' },
            { name: '司马奕', pinyin: 'Sī Mǎ Yì', title: '晋废帝', reignStart: '365年', reignEnd: '371年', reignYears: 6, eraName: '太和', birth: '不详', death: '不详', age: '不详' },
            { name: '司马昱', pinyin: 'Sī Mǎ Yù', title: '晋简文帝', reignStart: '371年', reignEnd: '372年', reignYears: 1, eraName: '咸安', birth: '不详', death: '不详', age: '不详' },
            { name: '司马曜', pinyin: 'Sī Mǎ Yào', title: '晋孝武帝', reignStart: '372年', reignEnd: '396年', reignYears: 24, eraName: '宁康、太元', birth: '不详', death: '不详', age: '不详' },
            { name: '司马德宗', pinyin: 'Sī Mǎ Dé Zōng', title: '晋安帝', reignStart: '396年', reignEnd: '418年', reignYears: 22, eraName: '隆安、元兴、义熙', birth: '不详', death: '不详', age: '不详' },
            { name: '司马德文', pinyin: 'Sī Mǎ Dé Wén', title: '晋恭帝', reignStart: '418年', reignEnd: '420年', reignYears: 2, eraName: '元熙', birth: '不详', death: '不详', age: '不详' }
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
        description: '中国历史上南朝宋齐梁陈与北朝北魏东魏西魏北齐北周对峙的分裂时期，是中国历史上民族大融合的重要阶段。南朝承继东晋，偏安江南；北朝由鲜卑族等少数民族建立，统治北方。\n\n南朝四朝（宋齐梁陈）都建都建康（今南京），政治上门阀政治衰落，皇权加强；经济上江南得到进一步开发，农业、手工业和商业都有发展；文化上佛教兴盛，文学艺术繁荣，出现了《文心雕龙》等重要著作。\n\n北朝政权中，北魏最为重要，孝文帝改革推行汉化政策，迁都洛阳，促进了民族融合。北朝时期佛教石窟艺术达到高峰，云冈石窟、龙门石窟等都是这一时期的杰作。北朝的均田制为后来隋唐的土地制度奠定了基础。\n\n南北朝时期虽然政治分裂，但文化交流频繁，科技发展迅速，出现了《齐民要术》等农学著作。这一时期的民族融合为隋朝的统一奠定了基础。南北朝历时169年，南朝共有25位皇帝，北朝主要政权共有约30位皇帝。',
        emperors: [
            // 南朝宋
            { name: '刘裕', pinyin: 'Liú Yù', title: '宋武帝', reignStart: '420年', reignEnd: '422年', reignYears: 2, eraName: '永初', birth: '不详', death: '不详', age: '不详' },
            { name: '刘义符', pinyin: 'Liú Yì Fú', title: '宋少帝', reignStart: '422年', reignEnd: '424年', reignYears: 2, eraName: '景平', birth: '不详', death: '不详', age: '不详' },
            { name: '刘义隆', pinyin: 'Liú Yì Lóng', title: '宋文帝', reignStart: '424年', reignEnd: '453年', reignYears: 29, eraName: '元嘉', birth: '不详', death: '不详', age: '不详' },
            { name: '刘骏', pinyin: 'Liú Jùn', title: '宋孝武帝', reignStart: '453年', reignEnd: '464年', reignYears: 11, eraName: '孝建、大明', birth: '不详', death: '不详', age: '不详' },
            { name: '刘子业', pinyin: 'Liú Zǐ Yè', title: '宋前废帝', reignStart: '464年', reignEnd: '465年', reignYears: 1, eraName: '永光、景和', birth: '不详', death: '不详', age: '不详' },
            { name: '刘彧', pinyin: 'Liú Yù', title: '宋明帝', reignStart: '465年', reignEnd: '472年', reignYears: 7, eraName: '泰始', birth: '不详', death: '不详', age: '不详' },
            { name: '刘昱', pinyin: 'Liú Yù', title: '宋后废帝', reignStart: '472年', reignEnd: '477年', reignYears: 5, eraName: '元徽', birth: '不详', death: '不详', age: '不详' },
            { name: '刘准', pinyin: 'Liú Zhǔn', title: '宋顺帝', reignStart: '477年', reignEnd: '479年', reignYears: 2, eraName: '升明', birth: '不详', death: '不详', age: '不详' },
            // 南朝齐
            { name: '萧道成', pinyin: 'Xiāo Dào Chéng', title: '齐高帝', reignStart: '479年', reignEnd: '482年', reignYears: 3, eraName: '建元', birth: '不详', death: '不详', age: '不详' },
            { name: '萧赜', pinyin: 'Xiāo Zé', title: '齐武帝', reignStart: '482年', reignEnd: '493年', reignYears: 11, eraName: '永明', birth: '不详', death: '不详', age: '不详' },
            { name: '萧昭业', pinyin: 'Xiāo Zhāo Yè', title: '齐郁林王', reignStart: '493年', reignEnd: '494年', reignYears: 1, eraName: '隆昌', birth: '不详', death: '不详', age: '不详' },
            { name: '萧昭文', pinyin: 'Xiāo Zhāo Wén', title: '齐海陵王', reignStart: '494年', reignEnd: '494年', reignYears: 1, eraName: '延兴', birth: '不详', death: '不详', age: '不详' },
            { name: '萧鸾', pinyin: 'Xiāo Luán', title: '齐明帝', reignStart: '494年', reignEnd: '498年', reignYears: 4, eraName: '建武、永泰', birth: '不详', death: '不详', age: '不详' },
            { name: '萧宝卷', pinyin: 'Xiāo Bǎo Juǎn', title: '齐东昏侯', reignStart: '498年', reignEnd: '501年', reignYears: 3, eraName: '永元', birth: '不详', death: '不详', age: '不详' },
            { name: '萧宝融', pinyin: 'Xiāo Bǎo Róng', title: '齐和帝', reignStart: '501年', reignEnd: '502年', reignYears: 1, eraName: '中兴', birth: '不详', death: '不详', age: '不详' },
            // 南朝梁
            { name: '萧衍', pinyin: 'Xiāo Yǎn', title: '梁武帝', reignStart: '502年', reignEnd: '549年', reignYears: 47, eraName: '天监、普通、大通、中大通、大同、中大同、太清', birth: '不详', death: '不详', age: '不详' },
            { name: '萧纲', pinyin: 'Xiāo Gāng', title: '梁简文帝', reignStart: '549年', reignEnd: '551年', reignYears: 2, eraName: '大宝', birth: '不详', death: '不详', age: '不详' },
            { name: '萧栋', pinyin: 'Xiāo Dòng', title: '梁豫章王', reignStart: '551年', reignEnd: '551年', reignYears: 1, eraName: '天正', birth: '不详', death: '不详', age: '不详' },
            { name: '萧绎', pinyin: 'Xiāo Yì', title: '梁元帝', reignStart: '552年', reignEnd: '554年', reignYears: 2, eraName: '承圣', birth: '不详', death: '不详', age: '不详' },
            { name: '萧方智', pinyin: 'Xiāo Fāng Zhì', title: '梁敬帝', reignStart: '555年', reignEnd: '557年', reignYears: 2, eraName: '绍泰、太平', birth: '不详', death: '不详', age: '不详' },
            // 南朝陈
            { name: '陈霸先', pinyin: 'Chén Bà Xiān', title: '陈武帝', reignStart: '557年', reignEnd: '559年', reignYears: 2, eraName: '永定', birth: '不详', death: '不详', age: '不详' },
            { name: '陈蒨', pinyin: 'Chén Qiàn', title: '陈文帝', reignStart: '559年', reignEnd: '566年', reignYears: 7, eraName: '天嘉、天康', birth: '不详', death: '不详', age: '不详' },
            { name: '陈伯宗', pinyin: 'Chén Bó Zōng', title: '陈废帝', reignStart: '566年', reignEnd: '568年', reignYears: 2, eraName: '光大', birth: '不详', death: '不详', age: '不详' },
            { name: '陈顼', pinyin: 'Chén Xū', title: '陈宣帝', reignStart: '568年', reignEnd: '582年', reignYears: 14, eraName: '太建', birth: '不详', death: '不详', age: '不详' },
            { name: '陈叔宝', pinyin: 'Chén Shū Bǎo', title: '陈后主', reignStart: '582年', reignEnd: '589年', reignYears: 7, eraName: '至德、祯明', birth: '不详', death: '不详', age: '不详' },
            // 北朝北魏（部分代表）
            { name: '拓跋珪', pinyin: 'Tuò Bá Guī', title: '魏道武帝', reignStart: '386年', reignEnd: '409年', reignYears: 23, eraName: '登国、皇始、天兴、天赐', birth: '不详', death: '不详', age: '不详' },
            { name: '拓跋嗣', pinyin: 'Tuò Bá Sì', title: '魏明元帝', reignStart: '409年', reignEnd: '423年', reignYears: 14, eraName: '永兴、神瑞、泰常', birth: '不详', death: '不详', age: '不详' },
            { name: '拓跋焘', pinyin: 'Tuò Bá Tāo', title: '魏太武帝', reignStart: '423年', reignEnd: '452年', reignYears: 29, eraName: '始光、神麚、延和、太延、太平真君、正平', birth: '不详', death: '不详', age: '不详' },
            { name: '元宏', pinyin: 'Yuán Hóng', title: '魏孝文帝', reignStart: '471年', reignEnd: '499年', reignYears: 28, eraName: '延兴、承明、太和', birth: '不详', death: '不详', age: '不详' }
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
        description: '中国历史上承南北朝、启唐朝的重要朝代，由隋文帝杨坚建立。隋朝结束了自西晋末年以来长达近300年的分裂局面，重新统一了中国。\n\n隋文帝杨坚建立隋朝后，在政治上确立了三省六部制，完善了科举制度；在经济上轻徭薄赋，发展农业生产；在军事上统一了南北，结束了分裂局面。隋朝还修建了举世闻名的大运河，沟通了南北交通，促进了经济文化交流。\n\n隋炀帝杨广继位后，虽然在文化建设上有所贡献，但好大喜功，频繁发动战争，大兴土木，加重了人民负担。特别是三征高句丽的失败，激起了全国性的农民起义，最终导致隋朝灭亡。\n\n隋朝虽然只存在了37年，但其政治制度和文化成就为唐朝的繁荣奠定了重要基础，共有2位皇帝。',
        emperors: [
            { name: '杨坚', pinyin: 'Yáng Jiān', title: '隋文帝', reignStart: '581年', reignEnd: '604年', reignYears: 23, eraName: '开皇、仁寿', birth: '不详', death: '不详', age: '不详' },
            { name: '杨广', pinyin: 'Yáng Guǎng', title: '隋炀帝', reignStart: '604年', reignEnd: '618年', reignYears: 14, eraName: '大业', birth: '不详', death: '不详', age: '不详' }
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
        description: '中国历史上最强盛的王朝之一，由唐高祖李渊建立。唐朝是中国古代最为辉煌的时期，政治开明，经济繁荣，文化昌盛，国际交流频繁，被誉为"盛唐"。\n\n唐朝的兴起：隋朝末年，天下大乱，李渊在太原起兵，于618年建立唐朝。唐太宗李世民通过玄武门之变夺取皇位，开创了"贞观之治"，奠定了唐朝强盛的基础。\n\n唐朝的鼎盛：唐朝前期出现了"贞观之治"和"开元盛世"等治世，国力强盛，疆域辽阔，东起朝鲜半岛，西达中亚，南至越南，北到蒙古高原。唐朝实行开放的对外政策，长安成为国际性大都市，各国使节、商人、学者云集，形成了多元文化交融的局面。唐朝的科举制度更加完善，诗歌文化达到巅峰，出现了李白、杜甫、白居易等伟大诗人。\n\n唐朝的衰落：安史之乱（755-763年）成为唐朝由盛转衰的转折点，此后藩镇割据严重，宦官专权，国力日渐衰落。黄巢起义进一步削弱了唐朝统治，最终朱温篡唐，建立后梁，唐朝灭亡。\n\n唐朝历时289年，是中华文明的重要高峰，共有24位皇帝。',
        emperors: [
            { name: '李渊', pinyin: 'Lǐ Yuān', title: '唐高祖', reignStart: '618年', reignEnd: '626年', reignYears: 8, eraName: '武德', birth: '不详', death: '不详', age: '不详' },
            { name: '李世民', pinyin: 'Lǐ Shì Mín', title: '唐太宗', reignStart: '626年', reignEnd: '649年', reignYears: 23, eraName: '贞观', birth: '不详', death: '不详', age: '不详' },
            { name: '李治', pinyin: 'Lǐ Zhì', title: '唐高宗', reignStart: '649年', reignEnd: '683年', reignYears: 34, eraName: '永徽、显庆、龙朔、麟德、乾封、总章、咸亨、上元、仪凤、调露、永隆、开耀、永淳、弘道', birth: '不详', death: '不详', age: '不详' },
            { name: '李显', pinyin: 'Lǐ Xiǎn', title: '唐中宗', reignStart: '683年', reignEnd: '684年', reignYears: 1, eraName: '嗣圣', birth: '不详', death: '不详', age: '不详' },
            { name: '李旦', pinyin: 'Lǐ Dàn', title: '唐睿宗', reignStart: '684年', reignEnd: '690年', reignYears: 6, eraName: '文明、光宅、垂拱、永昌、载初', birth: '不详', death: '不详', age: '不详' },
            { name: '武则天', pinyin: 'Wǔ Zé Tiān', title: '武周皇帝', reignStart: '690年', reignEnd: '705年', reignYears: 15, eraName: '天授、如意、长寿、延载、证圣、天册万岁、万岁登封、万岁通天、神功、圣历、久视、大足、长安', birth: '不详', death: '不详', age: '不详' },
            { name: '李显', pinyin: 'Lǐ Xiǎn', title: '唐中宗(复辟)', reignStart: '705年', reignEnd: '710年', reignYears: 5, eraName: '神龙、景龙', birth: '不详', death: '不详', age: '不详' },
            { name: '李重茂', pinyin: 'Lǐ Zhòng Mào', title: '唐殇帝', reignStart: '710年', reignEnd: '710年', reignYears: '17天', eraName: '唐隆', birth: '不详', death: '不详', age: '不详' },
            { name: '李旦', pinyin: 'Lǐ Dàn', title: '唐睿宗(复辟)', reignStart: '710年', reignEnd: '712年', reignYears: 2, eraName: '景云、太极、延和', birth: '不详', death: '不详', age: '不详' },
            { name: '李隆基', pinyin: 'Lǐ Lóng Jī', title: '唐玄宗', reignStart: '712年', reignEnd: '756年', reignYears: 44, eraName: '先天、开元、天宝', birth: '不详', death: '不详', age: '不详' },
            { name: '李亨', pinyin: 'Lǐ Hēng', title: '唐肃宗', reignStart: '756年', reignEnd: '762年', reignYears: 6, eraName: '至德、乾元、上元', birth: '不详', death: '不详', age: '不详' },
            { name: '李豫', pinyin: 'Lǐ Yù', title: '唐代宗', reignStart: '762年', reignEnd: '779年', reignYears: 17, eraName: '宝应、广德、永泰、大历', birth: '不详', death: '不详', age: '不详' },
            { name: '李适', pinyin: 'Lǐ Shì', title: '唐德宗', reignStart: '779年', reignEnd: '805年', reignYears: 26, eraName: '建中、兴元、贞元', birth: '不详', death: '不详', age: '不详' },
            { name: '李诵', pinyin: 'Lǐ Sòng', title: '唐顺宗', reignStart: '805年', reignEnd: '805年', reignYears: '8个月', eraName: '永贞', birth: '不详', death: '不详', age: '不详' },
            { name: '李纯', pinyin: 'Lǐ Chún', title: '唐宪宗', reignStart: '805年', reignEnd: '820年', reignYears: 15, eraName: '元和', birth: '不详', death: '不详', age: '不详' },
            { name: '李恒', pinyin: 'Lǐ Héng', title: '唐穆宗', reignStart: '820年', reignEnd: '824年', reignYears: 4, eraName: '长庆', birth: '不详', death: '不详', age: '不详' },
            { name: '李湛', pinyin: 'Lǐ Zhàn', title: '唐敬宗', reignStart: '824年', reignEnd: '826年', reignYears: 2, eraName: '宝历', birth: '不详', death: '不详', age: '不详' },
            { name: '李昂', pinyin: 'Lǐ Áng', title: '唐文宗', reignStart: '826年', reignEnd: '840年', reignYears: 14, eraName: '太和、开成', birth: '不详', death: '不详', age: '不详' },
            { name: '李炎', pinyin: 'Lǐ Yán', title: '唐武宗', reignStart: '840年', reignEnd: '846年', reignYears: 6, eraName: '会昌', birth: '不详', death: '不详', age: '不详' },
            { name: '李忱', pinyin: 'Lǐ Chén', title: '唐宣宗', reignStart: '846年', reignEnd: '859年', reignYears: 13, eraName: '大中', birth: '不详', death: '不详', age: '不详' },
            { name: '李漼', pinyin: 'Lǐ Cuǐ', title: '唐懿宗', reignStart: '859年', reignEnd: '873年', reignYears: 14, eraName: '咸通', birth: '不详', death: '不详', age: '不详' },
            { name: '李儇', pinyin: 'Lǐ Xuān', title: '唐僖宗', reignStart: '873年', reignEnd: '888年', reignYears: 15, eraName: '乾符、广明、中和、光启、文德', birth: '不详', death: '不详', age: '不详' },
            { name: '李晔', pinyin: 'Lǐ Yè', title: '唐昭宗', reignStart: '888年', reignEnd: '904年', reignYears: 16, eraName: '龙纪、大顺、景福、乾宁、光化、天复、天祐', birth: '不详', death: '不详', age: '不详' },
            { name: '李柷', pinyin: 'Lǐ Zhù', title: '唐哀帝', reignStart: '904年', reignEnd: '907年', reignYears: 3, eraName: '天祐', birth: '不详', death: '不详', age: '不详' }
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
        description: '唐朝灭亡后中国历史上的大分裂时期，北方相继出现后梁、后唐、后晋、后汉、后周五个朝代，南方同时并立着十个割据政权。这一时期政治动荡，战争频繁，但文化传承得以延续。\n\n五代政权都建都于中原地区，主要在开封和洛阳，政权更替频繁，平均存在时间不到15年。十国主要分布在南方，包括吴、南唐、吴越、楚、南汉、前蜀、后蜀、南平、闽、北汉等，相对稳定，经济文化发展较好。\n\n这一时期虽然政治分裂，但科技文化仍有发展，如雕版印刷术进一步推广，火药开始用于军事，指南针技术日趋成熟。南方各国相对和平，为经济发展创造了条件，江南地区的开发进一步加强。\n\n五代十国时期为宋朝的统一奠定了基础，许多制度和文化成果被宋朝继承和发展。五代十国历时72年，五代共有14位皇帝，十国君主约30余位。',
        emperors: [
            { name: '朱温', pinyin: 'Zhū Wēn', title: '后梁太祖', reignStart: '907年', reignEnd: '912年', reignYears: 5, eraName: '开平、乾化', birth: '不详', death: '不详', age: '不详' },
            { name: '朱友珪', pinyin: 'Zhū Yǒu Guī', title: '后梁郢王', reignStart: '912年', reignEnd: '913年', reignYears: 1, eraName: '凤历', birth: '不详', death: '不详', age: '不详' },
            { name: '朱友贞', pinyin: 'Zhū Yǒu Zhēn', title: '后梁末帝', reignStart: '913年', reignEnd: '923年', reignYears: 10, eraName: '乾化、贞明、龙德', birth: '不详', death: '不详', age: '不详' },
            { name: '李存勖', pinyin: 'Lǐ Cún Xù', title: '后唐庄宗', reignStart: '923年', reignEnd: '926年', reignYears: 3, eraName: '同光', birth: '不详', death: '不详', age: '不详' },
            { name: '李嗣源', pinyin: 'Lǐ Sì Yuán', title: '后唐明宗', reignStart: '926年', reignEnd: '933年', reignYears: 7, eraName: '天成、长兴', birth: '不详', death: '不详', age: '不详' },
            { name: '李从厚', pinyin: 'Lǐ Cóng Hòu', title: '后唐闵帝', reignStart: '933年', reignEnd: '934年', reignYears: 1, eraName: '应顺', birth: '不详', death: '不详', age: '不详' },
            { name: '李从珂', pinyin: 'Lǐ Cóng Kē', title: '后唐末帝', reignStart: '934年', reignEnd: '936年', reignYears: 2, eraName: '清泰', birth: '不详', death: '不详', age: '不详' },
            { name: '石敬瑭', pinyin: 'Shí Jìng Táng', title: '后晋高祖', reignStart: '936年', reignEnd: '942年', reignYears: 6, eraName: '天福', birth: '不详', death: '不详', age: '不详' },
            { name: '石重贵', pinyin: 'Shí Zhòng Guì', title: '后晋出帝', reignStart: '942年', reignEnd: '947年', reignYears: 5, eraName: '天福、开运', birth: '不详', death: '不详', age: '不详' },
            { name: '刘知远', pinyin: 'Liú Zhī Yuǎn', title: '后汉高祖', reignStart: '947年', reignEnd: '948年', reignYears: 1, eraName: '天福、乾祐', birth: '不详', death: '不详', age: '不详' },
            { name: '刘承祐', pinyin: 'Liú Chéng Yòu', title: '后汉隐帝', reignStart: '948年', reignEnd: '951年', reignYears: 3, eraName: '乾祐', birth: '不详', death: '不详', age: '不详' },
            { name: '郭威', pinyin: 'Guō Wēi', title: '后周太祖', reignStart: '951年', reignEnd: '954年', reignYears: 3, eraName: '广顺、显德', birth: '不详', death: '不详', age: '不详' },
            { name: '柴荣', pinyin: 'Chái Róng', title: '后周世宗', reignStart: '954年', reignEnd: '959年', reignYears: 5, eraName: '显德', birth: '不详', death: '不详', age: '不详' },
            { name: '柴宗训', pinyin: 'Chái Zōng Xùn', title: '后周恭帝', reignStart: '959年', reignEnd: '960年', reignYears: 1, eraName: '显德', birth: '不详', death: '不详', age: '不详' }
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
        description: '中国历史上经济文化高度发达的朝代，由宋太祖赵匡胤通过"陈桥兵变"建立。北宋结束了五代十国的分裂局面，基本统一了中国，开创了中国古代科技文化的黄金时代。\n\n北宋在政治上实行文官政治，重文轻武，科举制度更加完善，选拔了大量文人治国；经济上商品经济发达，出现了世界上最早的纸币"交子"，手工业和农业技术都有很大发展；文化上理学兴起，科技发明众多，四大发明中的三项（印刷术、火药、指南针）都在宋代得到发展和应用。\n\n北宋时期文学艺术繁荣，出现了苏轼、王安石、欧阳修等文学大家，词作为一种新的文学形式达到高峰。绘画方面出现了张择端的《清明上河图》等传世名作。科学技术方面，沈括的《梦溪笔谈》记录了大量科技成就。\n\n北宋后期由于冗官、冗兵、冗费等问题，国力衰弱，最终在靖康之变中被金国所灭，徽钦二帝被俘。北宋历时167年，是中华文明的重要发展期，共有9位皇帝。',
        emperors: [
            { name: '赵匡胤', pinyin: 'Zhào Kuāng Yìn', title: '宋太祖', reignStart: '960年', reignEnd: '976年', reignYears: 16, eraName: '建隆、乾德、开宝', birth: '不详', death: '不详', age: '不详' },
            { name: '赵光义', pinyin: 'Zhào Guāng Yì', title: '宋太宗', reignStart: '976年', reignEnd: '997年', reignYears: 21, eraName: '太平兴国、雍熙、端拱、淳化、至道', birth: '不详', death: '不详', age: '不详' },
            { name: '赵恒', pinyin: 'Zhào Héng', title: '宋真宗', reignStart: '997年', reignEnd: '1022年', reignYears: 25, eraName: '咸平、景德、大中祥符、天禧、乾兴', birth: '不详', death: '不详', age: '不详' },
            { name: '赵祯', pinyin: 'Zhào Zhēn', title: '宋仁宗', reignStart: '1022年', reignEnd: '1063年', reignYears: 41, eraName: '天圣、明道、景祐、宝元、康定、庆历、皇祐、至和、嘉祐', birth: '不详', death: '不详', age: '不详' },
            { name: '赵曙', pinyin: 'Zhào Shù', title: '宋英宗', reignStart: '1063年', reignEnd: '1067年', reignYears: 4, eraName: '治平', birth: '不详', death: '不详', age: '不详' },
            { name: '赵顼', pinyin: 'Zhào Xū', title: '宋神宗', reignStart: '1067年', reignEnd: '1085年', reignYears: 18, eraName: '熙宁、元丰', birth: '不详', death: '不详', age: '不详' },
            { name: '赵煦', pinyin: 'Zhào Xù', title: '宋哲宗', reignStart: '1085年', reignEnd: '1100年', reignYears: 15, eraName: '元祐、绍圣、元符', birth: '不详', death: '不详', age: '不详' },
            { name: '赵佶', pinyin: 'Zhào Jí', title: '宋徽宗', reignStart: '1100年', reignEnd: '1125年', reignYears: 25, eraName: '建中靖国、崇宁、大观、政和、重和、宣和', birth: '不详', death: '不详', age: '不详' },
            { name: '赵桓', pinyin: 'Zhào Huán', title: '宋钦宗', reignStart: '1125年', reignEnd: '1127年', reignYears: 2, eraName: '靖康', birth: '不详', death: '不详', age: '不详' }
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
            { name: '赵构', pinyin: 'Zhào Gòu', title: '宋高宗', reignStart: '1127年', reignEnd: '1162年', reignYears: 35, eraName: '建炎、绍兴', birth: '不详', death: '不详', age: '不详' },
            { name: '赵昚', pinyin: 'Zhào Shèn', title: '宋孝宗', reignStart: '1162年', reignEnd: '1189年', reignYears: 27, eraName: '隆兴、乾道、淳熙', birth: '不详', death: '不详', age: '不详' },
            { name: '赵惇', pinyin: 'Zhào Dūn', title: '宋光宗', reignStart: '1189年', reignEnd: '1194年', reignYears: 5, eraName: '绍熙', birth: '不详', death: '不详', age: '不详' },
            { name: '赵扩', pinyin: 'Zhào Kuò', title: '宋宁宗', reignStart: '1194年', reignEnd: '1224年', reignYears: 30, eraName: '庆元、嘉泰、开禧、嘉定', birth: '不详', death: '不详', age: '不详' },
            { name: '赵昀', pinyin: 'Zhào Yún', title: '宋理宗', reignStart: '1224年', reignEnd: '1264年', reignYears: 40, eraName: '宝庆、绍定、端平、嘉熙、淳祐、宝祐、开庆、景定', birth: '不详', death: '不详', age: '不详' },
            { name: '赵禥', pinyin: 'Zhào Qí', title: '宋度宗', reignStart: '1264年', reignEnd: '1274年', reignYears: 10, eraName: '咸淳', birth: '不详', death: '不详', age: '不详' },
            { name: '赵显', pinyin: 'Zhào Xiǎn', title: '宋恭帝', reignStart: '1274年', reignEnd: '1276年', reignYears: 2, eraName: '德祐', birth: '不详', death: '不详', age: '不详' },
            { name: '赵昰', pinyin: 'Zhào Shì', title: '宋端宗', reignStart: '1276年', reignEnd: '1278年', reignYears: 2, eraName: '景炎', birth: '不详', death: '不详', age: '不详' },
            { name: '赵昺', pinyin: 'Zhào Bǐng', title: '宋末帝', reignStart: '1278年', reignEnd: '1279年', reignYears: 1, eraName: '祥兴', birth: '不详', death: '不详', age: '不详' }
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
            { name: '忽必烈', pinyin: 'Hū Bì Liè', title: '元世祖', reignStart: '1260年', reignEnd: '1294年', reignYears: 34, eraName: '中统、至元', birth: '不详', death: '不详', age: '不详' },
            { name: '铁穆耳', pinyin: 'Tiě Mù ěr', title: '元成宗', reignStart: '1294年', reignEnd: '1307年', reignYears: 13, eraName: '元贞、大德', birth: '不详', death: '不详', age: '不详' },
            { name: '海山', pinyin: 'Hǎi Shān', title: '元武宗', reignStart: '1307年', reignEnd: '1311年', reignYears: 4, eraName: '至大', birth: '不详', death: '不详', age: '不详' },
            { name: '爱育黎拔力八达', pinyin: 'Ài Yù Lí Bá Lì Bā Dá', title: '元仁宗', reignStart: '1311年', reignEnd: '1320年', reignYears: 9, eraName: '皇庆、延祐', birth: '不详', death: '不详', age: '不详' },
            { name: '硕德八剌', pinyin: 'Shuò Dé Bā Lá', title: '元英宗', reignStart: '1320年', reignEnd: '1323年', reignYears: 3, eraName: '至治', birth: '不详', death: '不详', age: '不详' },
            { name: '也孙铁木儿', pinyin: 'Yě Sūn Tiě Mù ér', title: '元泰定帝', reignStart: '1323年', reignEnd: '1328年', reignYears: 5, eraName: '泰定、致和', birth: '不详', death: '不详', age: '不详' },
            { name: '阿速吉八', pinyin: 'Ā Sù Jí Bā', title: '元天顺帝', reignStart: '1328年', reignEnd: '1328年', reignYears: 1, eraName: '天顺', birth: '不详', death: '不详', age: '不详' },
            { name: '图帖睦尔', pinyin: 'Tú Tiē Mù ěr', title: '元文宗', reignStart: '1328年', reignEnd: '1332年', reignYears: 4, eraName: '天历、至顺', birth: '不详', death: '不详', age: '不详' },
            { name: '懿璘质班', pinyin: 'Yì Lín Zhì Bān', title: '元明宗', reignStart: '1329年', reignEnd: '1329年', reignYears: 1, eraName: '天历', birth: '不详', death: '不详', age: '不详' },
            { name: '宁宗', pinyin: 'Níng Zōng', title: '元宁宗', reignStart: '1332年', reignEnd: '1332年', reignYears: 1, eraName: '至顺', birth: '不详', death: '不详', age: '不详' },
            { name: '妥懽帖睦尔', pinyin: 'Tuǒ Huān Tiē Mù ěr', title: '元顺帝', reignStart: '1333年', reignEnd: '1368年', reignYears: 35, eraName: '元统、至元、至正', birth: '不详', death: '不详', age: '不详' }
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
        description: '中国历史上最后一个由汉族建立的大一统王朝，由明太祖朱元璋建立。明朝推翻了元朝的统治，恢复了汉族政权，在政治、经济、文化等方面都取得了重要成就。\n\n明朝前期国力强盛，明成祖朱棣迁都北京，修建了紫禁城，派遣郑和七下西洋，展现了中华文明的辉煌。明朝建立了完善的科举制度，编纂了《永乐大典》等重要典籍，小说、戏曲等文学形式达到新的高峰，出现了《西游记》、《水浒传》、《三国演义》、《红楼梦》等四大名著中的三部。\n\n明朝的手工业和商业发达，出现了资本主义萌芽，农业技术也有很大发展。科技方面，李时珍的《本草纲目》、宋应星的《天工开物》等著作总结了丰富的科技成果。明朝还修建了万里长城的大部分段落，成为中华文明的象征。\n\n明朝后期由于政治腐败、自然灾害、外敌入侵等多重因素，国力衰落，最终被李自成农民起义和满族入关所推翻。明朝历时276年，在中华文明史上占有重要地位，共有17位皇帝。',
        emperors: [
            { name: '朱元璋', pinyin: 'Zhū Yuán Zhāng', title: '明太祖', reignStart: '1368年', reignEnd: '1398年', reignYears: 30, eraName: '洪武', birth: '不详', death: '不详', age: '不详' },
            { name: '朱允炆', pinyin: 'Zhū Yǔn Wén', title: '明惠帝', reignStart: '1398年', reignEnd: '1402年', reignYears: 4, eraName: '建文', birth: '不详', death: '不详', age: '不详' },
            { name: '朱棣', pinyin: 'Zhū Dì', title: '明成祖', reignStart: '1402年', reignEnd: '1424年', reignYears: 22, eraName: '永乐', birth: '不详', death: '不详', age: '不详' },
            { name: '朱高炽', pinyin: 'Zhū Gāo Chì', title: '明仁宗', reignStart: '1424年', reignEnd: '1425年', reignYears: 1, eraName: '洪熙', birth: '不详', death: '不详', age: '不详' },
            { name: '朱瞻基', pinyin: 'Zhū Zhān Jī', title: '明宣宗', reignStart: '1425年', reignEnd: '1435年', reignYears: 10, eraName: '宣德', birth: '不详', death: '不详', age: '不详' },
            { name: '朱祁镇', pinyin: 'Zhū Qí Zhèn', title: '明英宗', reignStart: '1435年', reignEnd: '1449年', reignYears: 14, eraName: '正统', birth: '不详', death: '不详', age: '不详' },
            { name: '朱祁钰', pinyin: 'Zhū Qí Yù', title: '明代宗', reignStart: '1449年', reignEnd: '1457年', reignYears: 8, eraName: '景泰', birth: '不详', death: '不详', age: '不详' },
            { name: '朱祁镇', pinyin: 'Zhū Qí Zhèn', title: '明英宗(复辟)', reignStart: '1457年', reignEnd: '1464年', reignYears: 7, eraName: '天顺', birth: '不详', death: '不详', age: '不详' },
            { name: '朱见深', pinyin: 'Zhū Jiàn Shēn', title: '明宪宗', reignStart: '1464年', reignEnd: '1487年', reignYears: 23, eraName: '成化', birth: '不详', death: '不详', age: '不详' },
            { name: '朱祐樘', pinyin: 'Zhū Yòu Táng', title: '明孝宗', reignStart: '1487年', reignEnd: '1505年', reignYears: 18, eraName: '弘治', birth: '不详', death: '不详', age: '不详' },
            { name: '朱厚照', pinyin: 'Zhū Hòu Zhào', title: '明武宗', reignStart: '1505年', reignEnd: '1521年', reignYears: 16, eraName: '正德', birth: '不详', death: '不详', age: '不详' },
            { name: '朱厚熜', pinyin: 'Zhū Hòu Cōng', title: '明世宗', reignStart: '1521年', reignEnd: '1567年', reignYears: 46, eraName: '嘉靖', birth: '不详', death: '不详', age: '不详' },
            { name: '朱载垕', pinyin: 'Zhū Zài Hòu', title: '明穆宗', reignStart: '1567年', reignEnd: '1572年', reignYears: 5, eraName: '隆庆', birth: '不详', death: '不详', age: '不详' },
            { name: '朱翊钧', pinyin: 'Zhū Yì Jūn', title: '明神宗', reignStart: '1572年', reignEnd: '1620年', reignYears: 48, eraName: '万历', birth: '不详', death: '不详', age: '不详' },
            { name: '朱常洛', pinyin: 'Zhū Cháng Luò', title: '明光宗', reignStart: '1620年', reignEnd: '1620年', reignYears: '29天', eraName: '泰昌', birth: '不详', death: '不详', age: '不详' },
            { name: '朱由校', pinyin: 'Zhū Yóu Xiào', title: '明熹宗', reignStart: '1620年', reignEnd: '1627年', reignYears: 7, eraName: '天启', birth: '不详', death: '不详', age: '不详' },
            { name: '朱由检', pinyin: 'Zhū Yóu Jiǎn', title: '明思宗', reignStart: '1627年', reignEnd: '1644年', reignYears: 17, eraName: '崇祯', birth: '不详', death: '不详', age: '不详' }
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
            { name: '爱新觉罗·努尔哈赤', title: '清太祖', reignStart: '1616年', reignEnd: '1626年', reignYears: 10, eraName: '天命', birth: '1559年', death: '1626年', age: 68 },
            { name: '爱新觉罗·皇太极', title: '清太宗', reignStart: '1626年', reignEnd: '1643年', reignYears: 17, eraName: '天聪、崇德', birth: '1592年', death: '1643年', age: 52 },
            { name: '爱新觉罗·福临', title: '清世祖', reignStart: '1644年', reignEnd: '1661年', reignYears: 17, eraName: '顺治', birth: '1638年', death: '1661年', age: 24 },
            { name: '爱新觉罗·玄烨', pinyin: 'Xuán Yè', title: '清圣祖', reignStart: '1661年', reignEnd: '1722年', reignYears: 61, eraName: '康熙', birth: '1654年', death: '1722年', age: 69 },
            { name: '爱新觉罗·胤禛', pinyin: 'Yìn Zhēn', title: '清世宗', reignStart: '1722年', reignEnd: '1735年', reignYears: 13, eraName: '雍正', birth: '1678年', death: '1735年', age: 58 },
            { name: '爱新觉罗·弘历', title: '清高宗', reignStart: '1735年', reignEnd: '1796年', reignYears: 61, eraName: '乾隆', birth: '1711年', death: '1799年', age: 89 },
            { name: '爱新觉罗·颙琰', pinyin: 'Yóng Yǎn', title: '清仁宗', reignStart: '1796年', reignEnd: '1820年', reignYears: 24, eraName: '嘉庆', birth: '1760年', death: '1820年', age: 61 },
            { name: '爱新觉罗·旻宁', pinyin: 'Mín Níng', title: '清宣宗', reignStart: '1820年', reignEnd: '1850年', reignYears: 30, eraName: '道光', birth: '1782年', death: '1850年', age: 69 },
            { name: '爱新觉罗·奕詝', pinyin: 'Yì Zhǔ', title: '清文宗', reignStart: '1850年', reignEnd: '1861年', reignYears: 11, eraName: '咸丰', birth: '1831年', death: '1861年', age: 31 },
            { name: '爱新觉罗·载淳', title: '清穆宗', reignStart: '1861年', reignEnd: '1875年', reignYears: 14, eraName: '同治', birth: '1856年', death: '1875年', age: 19 },
            { name: '爱新觉罗·载湉', pinyin: 'Zǎi Tián', title: '清德宗', reignStart: '1875年', reignEnd: '1908年', reignYears: 33, eraName: '光绪', birth: '1871年', death: '1908年', age: 38 },
            { name: '爱新觉罗·溥仪', title: '清末帝', reignStart: '1908年', reignEnd: '1912年', reignYears: 4, eraName: '宣统', birth: '1906年', death: '1967年', age: 61 }
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
            { name: '孙中山', pinyin: 'Sūn Zhōng Shān', title: '临时大总统', reignStart: '1912年', reignEnd: '1912年', reignYears: 1, eraName: '中华民国元年', birth: '不详', death: '不详', age: '不详' },
            { name: '袁世凯', pinyin: 'Yuán Shì Kǎi', title: '大总统', reignStart: '1912年', reignEnd: '1916年', reignYears: 4, eraName: '民国', birth: '不详', death: '不详', age: '不详' },
            { name: '蒋介石', pinyin: 'Jiǎng Jiè Shí', title: '国民政府主席', reignStart: '1928年', reignEnd: '1949年', reignYears: 21, eraName: '民国', birth: '不详', death: '不详', age: '不详' }
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
    white-space: pre-line;
    /* 让换行符生效 */
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

.name-with-pinyin {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.chinese-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 0.9rem;
}

.pinyin-name {
    font-size: 0.7rem;
    color: #6b7280;
    font-style: italic;
    font-weight: 400;
}

.emperor-birth-death {
    color: #6b7280;
    font-size: 0.8rem;
    min-width: 8rem;
}

.era-prefix {
    color: #9ca3af;
    font-size: 0.7rem;
    margin-right: 0.25rem;
    font-weight: 400;
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
    .emperors-table td:first-child,
    .emperors-table th:nth-child(3),
    .emperors-table td:nth-child(3),
    .emperors-table th:nth-child(7),
    .emperors-table td:nth-child(7) {
        display: none;
    }

    /* 调整拼音显示 */
    .name-with-pinyin {
        gap: 0.0625rem;
    }

    .chinese-name {
        font-size: 0.8rem;
    }

    .pinyin-name {
        font-size: 0.6rem;
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