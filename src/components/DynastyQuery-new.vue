<template>
    <div class="dynasty-query">
        <!-- 使用公共组件PageHeader -->
        <PageHeader :title="pageTitle" @back="$emit('back')" />

        <div class="converter-content">
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
                                    <tr v-for="(emperor, index) in getEmperorsForDisplay()" :key="emperor.name"
                                        :class="{ 'dynasty-separator': shouldShowSeparator(emperor, index) }">
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

        <!-- 使用公共组件ScrollToTop -->
        <ScrollToTop />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import PageHeader from './common/PageHeader.vue'
import ScrollToTop from './common/ScrollToTop.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 基本状态
// 使用页面标题管理
usePageTitle('dynasty-query')

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'dynasty-query')
        if (card) {
            return card.title
        }
    }
    return '历史朝代查询'
})

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
    description?: string
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
    timeline?: Array<{
        event: string
        description: string
        type: 'start' | 'major' | 'end'
    }>
    emperors?: Emperor[]
    emperorsByCountry?: Record<string, Emperor[]>
    achievements?: string[]
    famousEmperors?: Array<{
        name: string
        description: string
    }>
}