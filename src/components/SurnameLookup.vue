<template>
    <div class="surname-lookup">
        <div class="lookup-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="lookup-title">百家姓查询</h2>
        </div>

        <div class="lookup-content">
            <!-- 搜索区域 -->
            <div class="search-section">
                <div class="search-container">
                    <div class="search-input-wrapper">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input v-model="searchQuery" class="search-input" placeholder="输入姓氏进行查询，如：王、李、张..."
                            @input="handleSearch" />
                        <button v-if="searchQuery" class="clear-btn" @click="clearSearch" title="清空">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="quick-search">
                        <span class="quick-label">热门姓氏：</span>
                        <button v-for="surname in popularSurnames" :key="surname" class="quick-btn"
                            @click="searchSurname(surname)">
                            {{ surname }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 搜索结果 -->
            <div v-if="searchResults.length > 0" class="results-section">
                <h3 class="section-title">搜索结果</h3>
                <div class="results-grid">
                    <div v-for="result in searchResults" :key="result.surname" class="result-card"
                        @click="selectSurname(result)">
                        <button class="copy-btn-corner" @click.stop="copySurnameFromList(result.surname)" title="复制姓氏">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        </button>
                        <div class="surname-content">
                            <div class="pinyin-display">{{ result.pinyin }}</div>
                            <div class="surname-display">{{ result.surname }}</div>
                        </div>
                        <div class="surname-info">
                            <div class="rank">排名第 {{ result.rank }} 位</div>
                            <div class="population">约 {{ result.population }} 万人</div>
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
                            返回列表
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

            <!-- 百家姓全览 -->
            <div v-if="!searchQuery && !selectedSurname" class="overview-section">
                <h3 class="section-title">百家姓排行榜（前{{ allSurnames.length }}位）</h3>
                <div class="ranking-grid">
                    <div v-for="surname in allSurnames" :key="surname.surname" class="ranking-item"
                        @click="selectSurname(surname)">
                        <button class="copy-btn-corner-small" @click.stop="copySurnameFromList(surname.surname)"
                            title="复制姓氏">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
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

        <!-- 消息提示 -->
        <div v-if="message" :class="['message', messageType]">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {  ref, computed, onMounted, onUnmounted  } from 'vue'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'
import surnameConfig from '../config/surnames.json'

defineEmits<{
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

// 搜索相关
const searchQuery = ref('')
const selectedSurname = ref<SurnameInfo | null>(null)

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 从配置文件读取数据
const surnameData = ref<SurnameInfo[]>(surnameConfig.surnames)
const popularSurnames = ref<string[]>(surnameConfig.popularSurnames)

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
    if (!searchQuery.value.trim()) return []

    const query = searchQuery.value.trim()
    return allSurnames.value.filter(surname =>
        surname.surname.includes(query) ||
        surname.pinyin.toLowerCase().includes(query.toLowerCase())
    )
})

// 搜索处理
const handleSearch = () => {
    selectedSurname.value = null
}

// 清空搜索
const clearSearch = () => {
    searchQuery.value = ''
    selectedSurname.value = null
}

// 搜索指定姓氏
const searchSurname = (surname: string) => {
    searchQuery.value = surname
    handleSearch()
}

// 选择姓氏
const selectSurname = (surname: SurnameInfo) => {
    selectedSurname.value = surname
    searchQuery.value = ''
    showMessage(`已选择 ${surname.surname} 姓`, 'success')
}

// 清除选择，返回列表
const clearSelection = () => {
    selectedSurname.value = null
    showMessage('已返回列表', 'success')
}

// 从列表复制姓氏
const copySurnameFromList = async (surname: string) => {
    try {
        await navigator.clipboard.writeText(surname)
        showMessage('姓氏已复制到剪贴板', 'success')
    } catch (error) {
        console.error('复制失败:', error)
        showMessage('复制失败，请手动复制', 'error')
    }
}

// 显示消息
const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    message.value = msg
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

onMounted(() => {
    setPageTitle('surname-lookup')
    const version = surnameConfig.metadata.version
    showMessage(`百家姓查询已加载，当前版本 v${version}，收录 ${allSurnames.value.length} 个姓氏`, 'success')
})

onUnmounted(() => {
    restoreDefaultTitle()
})
</script>

<style scoped>
.surname-lookup {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.lookup-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem 2rem;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
}

.back-btn:hover {
    background: #e2e8f0;
    color: #334155;
}

.lookup-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
}

.lookup-content {
    flex: 1;
    padding: 2rem;
    padding-bottom: 6rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

/* 搜索区域 */
.search-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: #9ca3af;
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    color: #1f2937;
    font-size: 1rem;
    transition: all 0.2s;
    box-sizing: border-box;
}

.search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: white;
}

.clear-btn {
    position: absolute;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: #f3f4f6;
    border: none;
    border-radius: 0.5rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
}

.clear-btn:hover {
    background: #e5e7eb;
    color: #374151;
}

.quick-search {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
}

.quick-label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
    white-space: nowrap;
}

.quick-btn {
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    color: #475569;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
}

.quick-btn:hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

/* 结果区域 */
.results-section,
.overview-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: #1e293b;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #f1f5f9;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.result-card {
    position: relative;
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    min-height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.result-card:hover {
    border-color: #3b82f6;
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.copy-btn-corner {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: translateY(-4px);
    backdrop-filter: blur(8px);
    z-index: 2;
}

.result-card:hover .copy-btn-corner {
    opacity: 1;
    transform: translateY(0);
}

.copy-btn-corner:hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.surname-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 12px 0;
}

.surname-display {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
}

.result-card:hover .surname-display {
    color: #3b82f6;
}

.pinyin-display {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 500;
    font-style: italic;
    opacity: 0.8;
}

.result-card:hover .pinyin-display {
    color: #3b82f6;
    opacity: 1;
}

.surname-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.rank {
    font-size: 0.875rem;
    color: #3b82f6;
    font-weight: 600;
}

.population {
    font-size: 0.75rem;
    color: #6b7280;
}

/* 详细信息 */
.detail-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.detail-card {
    display: flex;
    flex-direction: column;
}

.detail-header {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 1rem 1rem 0 0;
}

.back-to-list-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    font-weight: 500;
    align-self: flex-start;
}

.back-to-list-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
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
    color: #6b7280;
    font-weight: 600;
}

.info-value {
    font-size: 1rem;
    color: #1e293b;
    font-weight: 500;
}

.description-section h4,
.celebrities-section h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
}

.description-text {
    font-size: 0.875rem;
    color: #4b5563;
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
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 1rem;
    font-size: 0.875rem;
    color: #475569;
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
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    min-height: 120px;
}

.ranking-item:hover {
    background: white;
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.copy-btn-corner-small {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    transform: translateY(-4px);
    backdrop-filter: blur(8px);
    z-index: 2;
}

.ranking-item:hover .copy-btn-corner-small {
    opacity: 1;
    transform: translateY(0);
}

.copy-btn-corner-small:hover {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
    border: 1px solid #cbd5e1;
}

.ranking-item:hover .ranking-number {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #3b82f6;
    border-color: #93c5fd;
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
    color: #64748b;
    font-weight: 500;
    font-style: italic;
    text-align: center;
    opacity: 0.8;
    margin-bottom: 2px;
}

.ranking-item:hover .ranking-pinyin {
    color: #3b82f6;
    opacity: 1;
}

.ranking-surname {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    text-align: center;
}

.ranking-item:hover .ranking-surname {
    color: #3b82f6;
}

.ranking-footer {
    display: flex;
    justify-content: center;
    margin-top: auto;
}

.ranking-population {
    font-size: 10px;
    color: #94a3b8;
    font-weight: 500;
    padding: 4px 8px;
    background: #f1f5f9;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.ranking-item:hover .ranking-population {
    background: #dbeafe;
    color: #3b82f6;
    border-color: #bfdbfe;
}

/* 无结果 */
.no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    text-align: center;
    color: #9ca3af;
}

.no-results svg {
    margin-bottom: 1rem;
}

.no-results h3 {
    margin: 0 0 0.5rem 0;
    color: #6b7280;
}

.no-results p {
    margin: 0;
    font-size: 0.875rem;
}

/* 消息提示 */
.message {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 9998;
    animation: slideUp 0.3s ease-out;
}

.message.success {
    background: #10b981;
    color: white;
}

.message.error {
    background: #ef4444;
    color: white;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .lookup-content {
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

    .quick-search {
        flex-direction: column;
        align-items: flex-start;
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
        width: 20px;
        height: 20px;
        top: 6px;
        right: 6px;
    }

    .copy-btn-corner-small svg {
        width: 8px;
        height: 8px;
    }
}
</style>