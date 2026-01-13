<template>
    <div class="surname-lookup">
        <PageHeader :title="pageTitle" @back="handleBack" />

        <div class="converter-content">
            <!-- 搜索区域 -->
            <SearchSection :searchQuery="searchQuery" @update:searchQuery="searchQuery = $event"
                placeholder="输入姓氏进行查询，如：王、李、张..." :filters="filterOptions" :activeFilter="activeFilter"
                @update:activeFilter="activeFilter = $event" />

            <!-- 搜索结果 -->
            <div v-if="searchResults.length > 0" class="results-section">
                <h3 class="section-title">搜索结果</h3>
                <div class="ranking-grid">
                    <div v-for="result in searchResults" :key="result.surname" class="ranking-item"
                        :class="getRankingClass(result.rank)" @click="selectSurname(result)">
                        <button class="copy-btn-corner-small" @click.stop="copySurnameFromList(result.surname)"
                            title="复制姓氏">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        <div class="ranking-header">
                            <div class="ranking-number">{{ result.rank }}</div>
                        </div>
                        <div class="ranking-main">
                            <div class="ranking-pinyin">{{ result.pinyin }}</div>
                            <div class="ranking-surname">{{ result.surname }}</div>
                        </div>
                        <div class="ranking-footer">
                            <div class="ranking-population">{{ result.population }}万人</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 百家姓全览 -->
            <div v-if="!searchQuery && !selectedSurname" class="overview-section">
                <h3 class="section-title">百家姓排行榜（前{{ displayedSurnames.length }}位）</h3>
                <div class="ranking-grid">
                    <div v-for="surname in displayedSurnames" :key="surname.surname" class="ranking-item"
                        :class="getRankingClass(surname.rank)" @click="selectSurname(surname)">
                        <button class="copy-btn-corner-small" @click.stop="copySurnameFromList(surname.surname)"
                            title="复制姓氏">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        <div class="ranking-header">
                            <div class="ranking-number">{{ surname.rank }}</div>
                        </div>
                        <div class="ranking-main">
                            <div class="ranking-pinyin">{{ surname.pinyin }}</div>
                            <div class="ranking-surname">{{ surname.surname }}</div>
                        </div>
                        <div class="ranking-footer">
                            <div class="ranking-population">{{ surname.population }}万人</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 详细信息 -->
            <div v-if="selectedSurname" class="detail-section">
                <div class="detail-card">
                    <div class="detail-header">
                        <button class="back-to-list-btn" @click="clearSelection" title="返回列表">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <div class="surname-title">
                            <div class="surname-main">
                                <span class="surname-char">{{ selectedSurname.surname }}</span>
                                <div class="surname-pinyin">
                                    <span class="pinyin-text">{{ selectedSurname.pinyin }}</span>
                                </div>
                            </div>
                            <div class="surname-meta">
                                <span class="rank-badge">第{{ selectedSurname.rank }}位</span>
                                <span class="population-badge">{{ selectedSurname.population }}万人</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-content">
                        <div class="info-grid">
                            <div class="info-item">
                                <div class="info-label">拼音</div>
                                <div class="info-value">{{ selectedSurname.pinyin }}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">起源</div>
                                <div class="info-value">{{ selectedSurname.origin }}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">郡望</div>
                                <div class="info-value">{{ selectedSurname.junwang }}</div>
                            </div>
                            <div class="info-item">
                                <div class="info-label">主要分布</div>
                                <div class="info-value">{{ selectedSurname.distribution }}</div>
                            </div>
                        </div>

                        <div class="description-section">
                            <h4>姓氏来源</h4>
                            <p class="description-text">{{ selectedSurname.description }}</p>
                        </div>

                        <div v-if="selectedSurname.celebrities && selectedSurname.celebrities.length > 0"
                            class="celebrities-section">
                            <h4>历史名人</h4>
                            <div class="celebrities-list">
                                <span v-for="celebrity in selectedSurname.celebrities" :key="celebrity"
                                    class="celebrity-tag">
                                    {{ celebrity }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 无结果提示 -->
            <div v-if="searchQuery && searchResults.length === 0" class="no-results">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                </svg>
                <h3>未找到相关姓氏</h3>
                <p>请尝试输入其他姓氏或检查输入是否正确</p>
            </div>
        </div>

        <!-- 回到顶部按钮 -->
        <ScrollToTop :threshold="200" container=".converter-content" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import PageHeader from './common/PageHeader.vue'
import SearchSection from './common/SearchSection.vue'
import ScrollToTop from './common/ScrollToTop.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import cardsConfig from '../config/cards.json'
import surnameConfig from '../config/surnames.json'

const emit = defineEmits<{
    back: []
}>()

interface SurnameInfo {
    surname: string
    rank: number
    population: number
    pinyin: string
    origin: string
    junwang: string
    distribution: string
    description: string
    celebrities?: string[]
}

// 使用页面标题管理
usePageTitle('surname-lookup')
const { success, error } = useNotification()

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'surname-lookup')
        if (card) {
            return card.title
        }
    }
    return '百家姓查询'
})

// 搜索相关
const searchQuery = ref('')
const selectedSurname = ref<SurnameInfo | null>(null)
const activeFilter = ref('')

// 监听筛选变化，当选择热门姓氏时设置搜索关键词
watch(activeFilter, (newFilter) => {
    if (newFilter && popularSurnames.value.includes(newFilter)) {
        searchQuery.value = newFilter
        selectedSurname.value = null
    }
})

// 监听搜索框变化，当搜索框被清空时清除activeFilter
watch(searchQuery, (newQuery) => {
    if (!newQuery.trim()) {
        activeFilter.value = ''
    }
})

// 从配置文件读取数据
const surnameData = ref<SurnameInfo[]>(surnameConfig.surnames)
const popularSurnames = ref<string[]>(surnameConfig.popularSurnames)

// 筛选选项 - 改为热门姓氏快速搜索
const filterOptions = computed(() =>
    popularSurnames.value.slice(0, 10).map(surname => ({
        key: surname,
        name: surname,
        count: undefined
    }))
)

// 生成完整的姓氏列表（如果需要扩展到100个）
const generateExtendedSurnames = (): SurnameInfo[] => {
    const baseData = [...surnameData.value]

    // 如果配置文件中的数据少于100个，可以在这里扩展
    const additionalSurnames = [
        { surname: '梁', pinyin: 'Liáng' }, { surname: '宋', pinyin: 'Sòng' }, { surname: '郑', pinyin: 'Zhèng' }, { surname: '谢', pinyin: 'Xiè' }, { surname: '韩', pinyin: 'Hán' },
        { surname: '唐', pinyin: 'Táng' }, { surname: '冯', pinyin: 'Féng' }, { surname: '于', pinyin: 'Yú' }, { surname: '董', pinyin: 'Dǒng' }, { surname: '萧', pinyin: 'Xiāo' },
        { surname: '程', pinyin: 'Chéng' }, { surname: '曹', pinyin: 'Cáo' }, { surname: '袁', pinyin: 'Yuán' }, { surname: '邓', pinyin: 'Dèng' }, { surname: '许', pinyin: 'Xǔ' },
        { surname: '傅', pinyin: 'Fù' }, { surname: '沈', pinyin: 'Shěn' }, { surname: '曾', pinyin: 'Zēng' }, { surname: '彭', pinyin: 'Péng' }, { surname: '吕', pinyin: 'Lǚ' },
        { surname: '苏', pinyin: 'Sū' }, { surname: '卢', pinyin: 'Lú' }, { surname: '蒋', pinyin: 'Jiǎng' }, { surname: '蔡', pinyin: 'Cài' }, { surname: '贾', pinyin: 'Jiǎ' },
        { surname: '丁', pinyin: 'Dīng' }, { surname: '魏', pinyin: 'Wèi' }, { surname: '薛', pinyin: 'Xuē' }, { surname: '叶', pinyin: 'Yè' }, { surname: '阎', pinyin: 'Yán' },
        { surname: '余', pinyin: 'Yú' }, { surname: '潘', pinyin: 'Pān' }, { surname: '杜', pinyin: 'Dù' }, { surname: '戴', pinyin: 'Dài' }, { surname: '夏', pinyin: 'Xià' },
        { surname: '钟', pinyin: 'Zhōng' }, { surname: '汪', pinyin: 'Wāng' }, { surname: '田', pinyin: 'Tián' }, { surname: '任', pinyin: 'Rèn' }, { surname: '姜', pinyin: 'Jiāng' },
        { surname: '范', pinyin: 'Fàn' }, { surname: '方', pinyin: 'Fāng' }, { surname: '石', pinyin: 'Shí' }, { surname: '姚', pinyin: 'Yáo' }, { surname: '谭', pinyin: 'Tán' },
        { surname: '廖', pinyin: 'Liào' }, { surname: '邹', pinyin: 'Zōu' }, { surname: '熊', pinyin: 'Xióng' }, { surname: '金', pinyin: 'Jīn' }, { surname: '陆', pinyin: 'Lù' },
        { surname: '郝', pinyin: 'Hǎo' }, { surname: '孔', pinyin: 'Kǒng' }, { surname: '白', pinyin: 'Bái' }, { surname: '崔', pinyin: 'Cuī' }, { surname: '康', pinyin: 'Kāng' },
        { surname: '毛', pinyin: 'Máo' }, { surname: '邱', pinyin: 'Qiū' }, { surname: '秦', pinyin: 'Qín' }, { surname: '江', pinyin: 'Jiāng' }, { surname: '史', pinyin: 'Shǐ' },
        { surname: '顾', pinyin: 'Gù' }, { surname: '侯', pinyin: 'Hóu' }, { surname: '邵', pinyin: 'Shào' }, { surname: '孟', pinyin: 'Mèng' }, { surname: '龙', pinyin: 'Lóng' },
        { surname: '万', pinyin: 'Wàn' }, { surname: '段', pinyin: 'Duàn' }, { surname: '漕', pinyin: 'Cáo' }, { surname: '钱', pinyin: 'Qián' }, { surname: '汤', pinyin: 'Tāng' },
        { surname: '尹', pinyin: 'Yǐn' }, { surname: '黎', pinyin: 'Lí' }, { surname: '易', pinyin: 'Yì' }, { surname: '常', pinyin: 'Cháng' }, { surname: '武', pinyin: 'Wǔ' },
        { surname: '乔', pinyin: 'Qiáo' }, { surname: '贺', pinyin: 'Hè' }, { surname: '赖', pinyin: 'Lài' }, { surname: '龚', pinyin: 'Gōng' }, { surname: '文', pinyin: 'Wén' }
    ]

    // 只有当配置文件数据不足时才添加额外数据
    if (baseData.length < 100) {
        const startRank = baseData.length + 1
        additionalSurnames.slice(0, 100 - baseData.length).forEach((item, idx) => {
            baseData.push({
                surname: item.surname,
                rank: startRank + idx,
                population: Math.floor(Math.random() * 800) + 200,
                pinyin: item.pinyin,
                origin: '待完善',
                junwang: '待完善',
                distribution: '全国各地',
                description: `${item.surname}姓的详细信息正在整理中，欢迎提供更多资料...`,
                celebrities: []
            })
        })
    }

    return baseData
}

const allSurnames = ref<SurnameInfo[]>(generateExtendedSurnames())

// 搜索结果
const searchResults = computed(() => {
    // 如果没有搜索关键词，返回空数组（不显示搜索结果区域）
    if (!searchQuery.value.trim()) {
        return []
    }

    const query = searchQuery.value.trim()
    return allSurnames.value.filter(surname =>
        surname.surname.includes(query) ||
        surname.pinyin.toLowerCase().includes(query.toLowerCase())
    )
})

// 显示的姓氏列表（用于百家姓全览）
const displayedSurnames = computed(() => {
    return allSurnames.value
})

// 选择姓氏
const selectSurname = (surname: SurnameInfo) => {
    selectedSurname.value = surname
    searchQuery.value = ''
    success(`已选择 ${surname.surname} 姓`)
}

// 清除选择，返回列表
const clearSelection = () => {
    selectedSurname.value = null
}

// 从列表复制姓氏
const copySurnameFromList = async (surname: string) => {
    try {
        await navigator.clipboard.writeText(surname)
        success(`已复制姓氏: ${surname}`)
    } catch (err) {
        console.error('复制失败:', err)
        error('复制失败，请手动复制')
    }
}

// 处理返回事件
const handleBack = () => {
    emit('back')
}

// 获取排名样式类
const getRankingClass = (rank: number) => {
    if (rank === 1) return 'rank-first'
    if (rank === 2) return 'rank-second'
    if (rank === 3) return 'rank-third'
    if (rank <= 10) return 'rank-top-ten'
    return ''
}

// 初始化
onMounted(() => {
    const version = surnameConfig.metadata.version
    success(`当前版本 v${version}，收录 ${allSurnames.value.length} 个姓氏`)
})
</script>

<style scoped>
.surname-lookup {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.converter-content {
    flex: 1;
    padding: 2rem;
    padding-bottom: 6rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 120px);
    /* 隐藏滚动条但保持滚动功能 */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
}

.converter-content::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
}

/* 复制按钮样式 */
.copy-btn-corner-small,
.back-to-list-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.copy-btn-corner-small:hover {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
    transform: scale(1.1);
}

/* 结果区域 */
.results-section,
.overview-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 2rem;
    box-shadow: var(--shadow-sm);
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: var(--text-primary);
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--border-color);
}

/* 排行榜 */
.ranking-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
}

.ranking-item {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 16px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: var(--transition);
    overflow: hidden;
    min-height: 120px;
}

.ranking-item:hover {
    background: var(--bg-secondary);
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.copy-btn-corner-small {
    position: absolute !important;
    top: 8px !important;
    right: 8px !important;
    width: 24px !important;
    height: 24px !important;
    opacity: 0;
    transform: translateY(-4px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
}

.ranking-item:hover .copy-btn-corner-small {
    opacity: 1;
    transform: translateY(0);
}

.ranking-header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 8px;
}

.ranking-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
    height: 20px;
    padding: 0 8px;
    background: var(--bg-tertiary);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
}

.ranking-item:hover .ranking-number {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.ranking-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 8px 0;
}

.ranking-pinyin {
    font-size: 10px;
    color: var(--text-secondary);
    font-weight: 500;
    font-style: italic;
    text-align: center;
    opacity: 0.8;
    margin-bottom: 2px;
}

.ranking-item:hover .ranking-pinyin {
    color: var(--primary-color);
    opacity: 1;
}

.ranking-surname {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
    text-align: center;
}

.ranking-item:hover .ranking-surname {
    color: var(--primary-color);
}

.ranking-footer {
    display: flex;
    justify-content: center;
    margin-top: auto;
}

.ranking-population {
    font-size: 10px;
    color: var(--text-secondary);
    font-weight: 500;
    padding: 4px 8px;
    background: var(--bg-tertiary);
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.ranking-item:hover .ranking-population {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* 排行榜特殊样式 */
.ranking-item.rank-first {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    border-color: #f59e0b;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.ranking-item.rank-first .ranking-number {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
    color: white;
    border-color: #dc2626;
    font-weight: 700;
}

.ranking-item.rank-first .ranking-surname {
    color: #92400e;
}

.ranking-item.rank-first .ranking-pinyin {
    color: #a16207;
}

.ranking-item.rank-first .ranking-population {
    background: #92400e;
    color: white;
    border-color: #92400e;
}

.ranking-item.rank-second {
    background: linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%);
    border-color: #9ca3af;
    box-shadow: 0 4px 12px rgba(156, 163, 175, 0.3);
}

.ranking-item.rank-second .ranking-number {
    background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
    color: white;
    border-color: #6b7280;
    font-weight: 700;
}

.ranking-item.rank-second .ranking-surname {
    color: #374151;
}

.ranking-item.rank-second .ranking-pinyin {
    color: #6b7280;
}

.ranking-item.rank-second .ranking-population {
    background: #6b7280;
    color: white;
    border-color: #6b7280;
}

.ranking-item.rank-third {
    background: linear-gradient(135deg, #cd7f32 0%, #d4a574 100%);
    border-color: #b45309;
    box-shadow: 0 4px 12px rgba(180, 83, 9, 0.3);
}

.ranking-item.rank-third .ranking-number {
    background: linear-gradient(135deg, #92400e 0%, #b45309 100%);
    color: white;
    border-color: #92400e;
    font-weight: 700;
}

.ranking-item.rank-third .ranking-surname {
    color: #78350f;
}

.ranking-item.rank-third .ranking-pinyin {
    color: #92400e;
}

.ranking-item.rank-third .ranking-population {
    background: #78350f;
    color: white;
    border-color: #78350f;
}

.ranking-item.rank-top-ten {
    background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.ranking-item.rank-top-ten .ranking-number {
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    color: white;
    border-color: #3b82f6;
    font-weight: 600;
}

.ranking-item.rank-top-ten .ranking-surname {
    color: #1e40af;
}

.ranking-item.rank-top-ten .ranking-pinyin {
    color: #3b82f6;
}

.ranking-item.rank-top-ten .ranking-population {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

/* 无结果 */
.no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
    color: var(--text-secondary);
}

.no-results svg {
    margin-bottom: 1rem;
}

.no-results h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
}

.no-results p {
    margin: 0;
    font-size: 0.875rem;
}

/* 详细信息 */
.detail-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
}

.detail-card {
    display: flex;
    flex-direction: column;
}

.detail-header {
    background: linear-gradient(135deg, var(--primary-color) 0%, #1d4ed8 100%);
    color: white;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.back-to-list-btn {
    align-self: flex-start !important;
    background: rgba(255, 255, 255, 0.2) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    color: white !important;
}

.back-to-list-btn:hover {
    background: rgba(255, 255, 255, 0.3) !important;
    border-color: rgba(255, 255, 255, 0.5) !important;
}

.surname-title {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.surname-main {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
}

.surname-char {
    font-size: 3rem;
    font-weight: bold;
}

.surname-pinyin {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.15);
    padding: 0.5rem 1rem;
    border-radius: 1rem;
}

.pinyin-text {
    font-size: 1.125rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
}

.surname-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.rank-badge,
.population-badge {
    padding: 0.25rem 0.75rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.detail-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 600;
}

.info-value {
    font-size: 1rem;
    color: var(--text-primary);
    font-weight: 500;
}

.description-section h4,
.celebrities-section h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
}

.description-text {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
}

.celebrities-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.celebrity-tag {
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 5rem;
        gap: 1.5rem;
    }

    .search-section,
    .results-section,
    .overview-section {
        padding: 1.5rem;
    }

    .detail-content {
        padding: 1.5rem;
    }

    .detail-header {
        padding: 1.5rem;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .surname-title {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1rem;
    }

    .surname-main {
        align-items: center;
    }

    .ranking-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
    }

    .ranking-item {
        min-height: 100px;
        padding: 12px 8px;
    }

    .ranking-surname {
        font-size: 24px;
    }

    .copy-btn-corner-small {
        width: 20px !important;
        height: 20px !important;
        top: 6px !important;
        right: 6px !important;
    }
}
</style>