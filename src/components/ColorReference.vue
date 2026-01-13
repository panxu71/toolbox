<template>
    <div class="color-reference">
        <PageHeader :title="pageTitle" @back="handleBack" />

        <div class="converter-content">
            <!-- 搜索区域 -->
            <SearchSection :searchQuery="searchQuery" @update:searchQuery="searchQuery = $event"
                placeholder="搜索颜色名称或代码..." :filters="filterOptions" :activeFilter="activeFilter"
                @update:activeFilter="activeFilter = $event" />

            <!-- 颜色网格 -->
            <div class="colors-grid">
                <div v-for="color in filteredColors" :key="color.name" class="color-card" @click="selectColor(color)">
                    <div class="color-preview" :style="{ backgroundColor: color.hex }"></div>
                    <div class="color-info">
                        <div class="color-name">{{ color.name }}</div>
                        <div class="color-hex">{{ color.hex }}</div>
                    </div>
                </div>
            </div>


        </div>

        <!-- 回到顶部按钮 -->
        <ScrollToTop :threshold="200" container=".converter-content" />

        <!-- 颜色详情弹窗 -->
        <Modal v-model:visible="showColorModal" title="颜色详情" max-width="700px" max-height="550px"
            content-class="color-modal-content">
            <div class="color-details-content">
                <div class="color-display">
                    <div class="large-preview" :style="{ backgroundColor: selectedColor?.hex }"></div>
                    <div class="color-name-large">{{ selectedColor?.name }}</div>
                </div>

                <div class="color-formats">
                    <div class="format-row">
                        <div class="format-item">
                            <label>HEX</label>
                            <div class="format-value">
                                <input :value="selectedColor?.hex" readonly class="format-input" />
                                <HeaderActionButton icon="copy" tooltip="复制HEX值" @click="copyHex" />
                            </div>
                        </div>

                        <div class="format-item">
                            <label>RGB</label>
                            <div class="format-value">
                                <input :value="selectedColor?.rgb" readonly class="format-input" />
                                <HeaderActionButton icon="copy" tooltip="复制RGB值" @click="copyRgb" />
                            </div>
                        </div>
                    </div>

                    <div class="format-row">
                        <div class="format-item">
                            <label>HSL</label>
                            <div class="format-value">
                                <input :value="selectedColor?.hsl" readonly class="format-input" />
                                <HeaderActionButton icon="copy" tooltip="复制HSL值" @click="copyHsl" />
                            </div>
                        </div>

                        <div class="format-item">
                            <label>CSS</label>
                            <div class="format-value">
                                <input :value="`color: ${selectedColor?.hex};`" readonly class="format-input" />
                                <HeaderActionButton icon="copy" tooltip="复制CSS样式" @click="copyCss" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import PageHeader from './common/PageHeader.vue'
import SearchSection from './common/SearchSection.vue'
import ScrollToTop from './common/ScrollToTop.vue'
import Modal from './common/Modal.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import cardsConfig from '../config/cards.json'

const emit = defineEmits<{
    back: []
}>()

interface Color {
    name: string
    hex: string
    rgb: string
    hsl: string
    category: string
}

// 使用页面标题管理
usePageTitle('color-reference')
const { success } = useNotification()

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'color-reference')
        if (card) {
            return card.title
        }
    }
    return '颜色对照表'
})

// 搜索和筛选
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedColor = ref<Color | null>(null)
const showColorModal = ref(false)

// 筛选选项 - 为SearchSection组件提供
const filterOptions = computed(() => [
    { key: 'all', name: '全部', count: colors.value.length },
    { key: 'basic', name: '基础色', count: colors.value.filter(c => c.category === 'basic').length },
    { key: 'web', name: '网页安全色', count: colors.value.filter(c => c.category === 'web').length },
    { key: 'material', name: 'Material Design', count: colors.value.filter(c => c.category === 'material').length }
])

// 监听筛选变化
watch([searchQuery, activeFilter], () => {
    selectedColor.value = null
})

// DOM引用
// const colorDetailsRef = ref<HTMLElement | null>(null) // 不再需要

// 颜色数据
const colors = ref<Color[]>([
    // 基础色
    { name: '黑色', hex: '#000000', rgb: 'rgb(0, 0, 0)', hsl: 'hsl(0, 0%, 0%)', category: 'basic' },
    { name: '白色', hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', hsl: 'hsl(0, 0%, 100%)', category: 'basic' },
    { name: '红色', hex: '#FF0000', rgb: 'rgb(255, 0, 0)', hsl: 'hsl(0, 100%, 50%)', category: 'basic' },
    { name: '绿色', hex: '#00FF00', rgb: 'rgb(0, 255, 0)', hsl: 'hsl(120, 100%, 50%)', category: 'basic' },
    { name: '蓝色', hex: '#0000FF', rgb: 'rgb(0, 0, 255)', hsl: 'hsl(240, 100%, 50%)', category: 'basic' },
    { name: '黄色', hex: '#FFFF00', rgb: 'rgb(255, 255, 0)', hsl: 'hsl(60, 100%, 50%)', category: 'basic' },
    { name: '青色', hex: '#00FFFF', rgb: 'rgb(0, 255, 255)', hsl: 'hsl(180, 100%, 50%)', category: 'basic' },
    { name: '洋红', hex: '#FF00FF', rgb: 'rgb(255, 0, 255)', hsl: 'hsl(300, 100%, 50%)', category: 'basic' },
    { name: '灰色', hex: '#808080', rgb: 'rgb(128, 128, 128)', hsl: 'hsl(0, 0%, 50%)', category: 'basic' },
    { name: '银色', hex: '#C0C0C0', rgb: 'rgb(192, 192, 192)', hsl: 'hsl(0, 0%, 75%)', category: 'basic' },
    { name: '深灰', hex: '#404040', rgb: 'rgb(64, 64, 64)', hsl: 'hsl(0, 0%, 25%)', category: 'basic' },
    { name: '浅灰', hex: '#D3D3D3', rgb: 'rgb(211, 211, 211)', hsl: 'hsl(0, 0%, 83%)', category: 'basic' },

    // 网页安全色
    { name: '深红', hex: '#8B0000', rgb: 'rgb(139, 0, 0)', hsl: 'hsl(0, 100%, 27%)', category: 'web' },
    { name: '火砖红', hex: '#B22222', rgb: 'rgb(178, 34, 34)', hsl: 'hsl(0, 68%, 42%)', category: 'web' },
    { name: '印度红', hex: '#CD5C5C', rgb: 'rgb(205, 92, 92)', hsl: 'hsl(0, 53%, 58%)', category: 'web' },
    { name: '浅珊瑚', hex: '#F08080', rgb: 'rgb(240, 128, 128)', hsl: 'hsl(0, 79%, 72%)', category: 'web' },
    { name: '深粉', hex: '#FF1493', rgb: 'rgb(255, 20, 147)', hsl: 'hsl(328, 100%, 54%)', category: 'web' },
    { name: '热粉', hex: '#FF69B4', rgb: 'rgb(255, 105, 180)', hsl: 'hsl(330, 100%, 71%)', category: 'web' },
    { name: '粉色', hex: '#FFC0CB', rgb: 'rgb(255, 192, 203)', hsl: 'hsl(350, 100%, 88%)', category: 'web' },
    { name: '浅粉', hex: '#FFB6C1', rgb: 'rgb(255, 182, 193)', hsl: 'hsl(351, 100%, 86%)', category: 'web' },
    { name: '橙红', hex: '#FF4500', rgb: 'rgb(255, 69, 0)', hsl: 'hsl(16, 100%, 50%)', category: 'web' },
    { name: '橙色', hex: '#FFA500', rgb: 'rgb(255, 165, 0)', hsl: 'hsl(39, 100%, 50%)', category: 'web' },
    { name: '深橙', hex: '#FF8C00', rgb: 'rgb(255, 140, 0)', hsl: 'hsl(33, 100%, 50%)', category: 'web' },
    { name: '金色', hex: '#FFD700', rgb: 'rgb(255, 215, 0)', hsl: 'hsl(51, 100%, 50%)', category: 'web' },
    { name: '黄绿', hex: '#ADFF2F', rgb: 'rgb(173, 255, 47)', hsl: 'hsl(84, 100%, 59%)', category: 'web' },
    { name: '草绿', hex: '#7CFC00', rgb: 'rgb(124, 252, 0)', hsl: 'hsl(90, 100%, 49%)', category: 'web' },
    { name: '酸橙绿', hex: '#32CD32', rgb: 'rgb(50, 205, 50)', hsl: 'hsl(120, 61%, 50%)', category: 'web' },
    { name: '森林绿', hex: '#228B22', rgb: 'rgb(34, 139, 34)', hsl: 'hsl(120, 61%, 34%)', category: 'web' },
    { name: '深绿', hex: '#006400', rgb: 'rgb(0, 100, 0)', hsl: 'hsl(120, 100%, 20%)', category: 'web' },
    { name: '海绿', hex: '#2E8B57', rgb: 'rgb(46, 139, 87)', hsl: 'hsl(146, 50%, 36%)', category: 'web' },
    { name: '春绿', hex: '#00FF7F', rgb: 'rgb(0, 255, 127)', hsl: 'hsl(150, 100%, 50%)', category: 'web' },
    { name: '薄荷绿', hex: '#00FA9A', rgb: 'rgb(0, 250, 154)', hsl: 'hsl(157, 100%, 49%)', category: 'web' },

    { name: '深青', hex: '#008B8B', rgb: 'rgb(0, 139, 139)', hsl: 'hsl(180, 100%, 27%)', category: 'web' },
    { name: '浅海绿', hex: '#20B2AA', rgb: 'rgb(32, 178, 170)', hsl: 'hsl(177, 70%, 41%)', category: 'web' },
    { name: '青绿', hex: '#48D1CC', rgb: 'rgb(72, 209, 204)', hsl: 'hsl(178, 60%, 55%)', category: 'web' },
    { name: '浅青', hex: '#E0FFFF', rgb: 'rgb(224, 255, 255)', hsl: 'hsl(180, 100%, 94%)', category: 'web' },
    { name: '天蓝', hex: '#87CEEB', rgb: 'rgb(135, 206, 235)', hsl: 'hsl(197, 71%, 73%)', category: 'web' },
    { name: '深天蓝', hex: '#00BFFF', rgb: 'rgb(0, 191, 255)', hsl: 'hsl(195, 100%, 50%)', category: 'web' },
    { name: '道奇蓝', hex: '#1E90FF', rgb: 'rgb(30, 144, 255)', hsl: 'hsl(210, 100%, 56%)', category: 'web' },
    { name: '钢蓝', hex: '#4682B4', rgb: 'rgb(70, 130, 180)', hsl: 'hsl(207, 44%, 49%)', category: 'web' },
    { name: '皇家蓝', hex: '#4169E1', rgb: 'rgb(65, 105, 225)', hsl: 'hsl(225, 73%, 57%)', category: 'web' },
    { name: '深蓝', hex: '#00008B', rgb: 'rgb(0, 0, 139)', hsl: 'hsl(240, 100%, 27%)', category: 'web' },
    { name: '海军蓝', hex: '#000080', rgb: 'rgb(0, 0, 128)', hsl: 'hsl(240, 100%, 25%)', category: 'web' },
    { name: '午夜蓝', hex: '#191970', rgb: 'rgb(25, 25, 112)', hsl: 'hsl(240, 64%, 27%)', category: 'web' },

    { name: '靛青', hex: '#4B0082', rgb: 'rgb(75, 0, 130)', hsl: 'hsl(275, 100%, 25%)', category: 'web' },
    { name: '紫色', hex: '#800080', rgb: 'rgb(128, 0, 128)', hsl: 'hsl(300, 100%, 25%)', category: 'web' },
    { name: '深紫', hex: '#9400D3', rgb: 'rgb(148, 0, 211)', hsl: 'hsl(282, 100%, 41%)', category: 'web' },
    { name: '蓝紫', hex: '#8A2BE2', rgb: 'rgb(138, 43, 226)', hsl: 'hsl(271, 76%, 53%)', category: 'web' },
    { name: '深兰花紫', hex: '#9932CC', rgb: 'rgb(153, 50, 204)', hsl: 'hsl(280, 61%, 50%)', category: 'web' },
    { name: '兰花紫', hex: '#DA70D6', rgb: 'rgb(218, 112, 214)', hsl: 'hsl(302, 59%, 65%)', category: 'web' },
    { name: '紫罗兰', hex: '#EE82EE', rgb: 'rgb(238, 130, 238)', hsl: 'hsl(300, 76%, 72%)', category: 'web' },
    { name: '李子紫', hex: '#DDA0DD', rgb: 'rgb(221, 160, 221)', hsl: 'hsl(300, 47%, 75%)', category: 'web' },

    { name: '棕色', hex: '#A52A2A', rgb: 'rgb(165, 42, 42)', hsl: 'hsl(0, 59%, 41%)', category: 'web' },
    { name: '马鞍棕', hex: '#8B4513', rgb: 'rgb(139, 69, 19)', hsl: 'hsl(25, 76%, 31%)', category: 'web' },
    { name: '巧克力', hex: '#D2691E', rgb: 'rgb(210, 105, 30)', hsl: 'hsl(25, 75%, 47%)', category: 'web' },
    { name: '秘鲁', hex: '#CD853F', rgb: 'rgb(205, 133, 63)', hsl: 'hsl(30, 59%, 53%)', category: 'web' },
    { name: '沙棕', hex: '#F4A460', rgb: 'rgb(244, 164, 96)', hsl: 'hsl(28, 87%, 67%)', category: 'web' },
    { name: '小麦', hex: '#F5DEB3', rgb: 'rgb(245, 222, 179)', hsl: 'hsl(39, 77%, 83%)', category: 'web' },
    { name: '橄榄色', hex: '#808000', rgb: 'rgb(128, 128, 0)', hsl: 'hsl(60, 100%, 25%)', category: 'web' },
    { name: '卡其', hex: '#F0E68C', rgb: 'rgb(240, 230, 140)', hsl: 'hsl(54, 77%, 75%)', category: 'web' },

    // Material Design 色彩
    { name: 'Material Red 50', hex: '#FFEBEE', rgb: 'rgb(255, 235, 238)', hsl: 'hsl(351, 100%, 96%)', category: 'material' },
    { name: 'Material Red 100', hex: '#FFCDD2', rgb: 'rgb(255, 205, 210)', hsl: 'hsl(354, 100%, 90%)', category: 'material' },
    { name: 'Material Red 200', hex: '#EF9A9A', rgb: 'rgb(239, 154, 154)', hsl: 'hsl(0, 69%, 77%)', category: 'material' },
    { name: 'Material Red 300', hex: '#E57373', rgb: 'rgb(229, 115, 115)', hsl: 'hsl(0, 64%, 67%)', category: 'material' },
    { name: 'Material Red 400', hex: '#EF5350', rgb: 'rgb(239, 83, 80)', hsl: 'hsl(1, 83%, 63%)', category: 'material' },
    { name: 'Material Red 500', hex: '#F44336', rgb: 'rgb(244, 67, 54)', hsl: 'hsl(4, 90%, 58%)', category: 'material' },
    { name: 'Material Red 600', hex: '#E53935', rgb: 'rgb(229, 57, 53)', hsl: 'hsl(1, 77%, 55%)', category: 'material' },
    { name: 'Material Red 700', hex: '#D32F2F', rgb: 'rgb(211, 47, 47)', hsl: 'hsl(0, 66%, 51%)', category: 'material' },
    { name: 'Material Red 800', hex: '#C62828', rgb: 'rgb(198, 40, 40)', hsl: 'hsl(0, 66%, 47%)', category: 'material' },
    { name: 'Material Red 900', hex: '#B71C1C', rgb: 'rgb(183, 28, 28)', hsl: 'hsl(0, 73%, 41%)', category: 'material' },

    { name: 'Material Pink 500', hex: '#E91E63', rgb: 'rgb(233, 30, 99)', hsl: 'hsl(340, 82%, 52%)', category: 'material' },
    { name: 'Material Purple 500', hex: '#9C27B0', rgb: 'rgb(156, 39, 176)', hsl: 'hsl(291, 64%, 42%)', category: 'material' },
    { name: 'Material Deep Purple 500', hex: '#673AB7', rgb: 'rgb(103, 58, 183)', hsl: 'hsl(262, 52%, 47%)', category: 'material' },
    { name: 'Material Indigo 500', hex: '#3F51B5', rgb: 'rgb(63, 81, 181)', hsl: 'hsl(231, 48%, 48%)', category: 'material' },

    { name: 'Material Blue 50', hex: '#E3F2FD', rgb: 'rgb(227, 242, 253)', hsl: 'hsl(205, 79%, 94%)', category: 'material' },
    { name: 'Material Blue 100', hex: '#BBDEFB', rgb: 'rgb(187, 222, 251)', hsl: 'hsl(207, 89%, 86%)', category: 'material' },
    { name: 'Material Blue 200', hex: '#90CAF9', rgb: 'rgb(144, 202, 249)', hsl: 'hsl(207, 90%, 77%)', category: 'material' },
    { name: 'Material Blue 300', hex: '#64B5F6', rgb: 'rgb(100, 181, 246)', hsl: 'hsl(207, 90%, 68%)', category: 'material' },
    { name: 'Material Blue 400', hex: '#42A5F5', rgb: 'rgb(66, 165, 245)', hsl: 'hsl(207, 90%, 61%)', category: 'material' },
    { name: 'Material Blue 500', hex: '#2196F3', rgb: 'rgb(33, 150, 243)', hsl: 'hsl(207, 90%, 54%)', category: 'material' },
    { name: 'Material Blue 600', hex: '#1E88E5', rgb: 'rgb(30, 136, 229)', hsl: 'hsl(208, 79%, 51%)', category: 'material' },
    { name: 'Material Blue 700', hex: '#1976D2', rgb: 'rgb(25, 118, 210)', hsl: 'hsl(210, 79%, 46%)', category: 'material' },
    { name: 'Material Blue 800', hex: '#1565C0', rgb: 'rgb(21, 101, 192)', hsl: 'hsl(212, 80%, 42%)', category: 'material' },
    { name: 'Material Blue 900', hex: '#0D47A1', rgb: 'rgb(13, 71, 161)', hsl: 'hsl(216, 85%, 34%)', category: 'material' },

    { name: 'Material Light Blue 500', hex: '#03A9F4', rgb: 'rgb(3, 169, 244)', hsl: 'hsl(199, 98%, 48%)', category: 'material' },
    { name: 'Material Cyan 500', hex: '#00BCD4', rgb: 'rgb(0, 188, 212)', hsl: 'hsl(187, 100%, 42%)', category: 'material' },
    { name: 'Material Teal 500', hex: '#009688', rgb: 'rgb(0, 150, 136)', hsl: 'hsl(174, 100%, 29%)', category: 'material' },

    { name: 'Material Green 50', hex: '#E8F5E8', rgb: 'rgb(232, 245, 232)', hsl: 'hsl(120, 39%, 94%)', category: 'material' },
    { name: 'Material Green 100', hex: '#C8E6C9', rgb: 'rgb(200, 230, 201)', hsl: 'hsl(122, 39%, 84%)', category: 'material' },
    { name: 'Material Green 200', hex: '#A5D6A7', rgb: 'rgb(165, 214, 167)', hsl: 'hsl(122, 39%, 74%)', category: 'material' },
    { name: 'Material Green 300', hex: '#81C784', rgb: 'rgb(129, 199, 132)', hsl: 'hsl(123, 39%, 64%)', category: 'material' },
    { name: 'Material Green 400', hex: '#66BB6A', rgb: 'rgb(102, 187, 106)', hsl: 'hsl(123, 39%, 57%)', category: 'material' },
    { name: 'Material Green 500', hex: '#4CAF50', rgb: 'rgb(76, 175, 80)', hsl: 'hsl(122, 39%, 49%)', category: 'material' },
    { name: 'Material Green 600', hex: '#43A047', rgb: 'rgb(67, 160, 71)', hsl: 'hsl(123, 41%, 45%)', category: 'material' },
    { name: 'Material Green 700', hex: '#388E3C', rgb: 'rgb(56, 142, 60)', hsl: 'hsl(123, 43%, 39%)', category: 'material' },
    { name: 'Material Green 800', hex: '#2E7D32', rgb: 'rgb(46, 125, 50)', hsl: 'hsl(123, 46%, 34%)', category: 'material' },
    { name: 'Material Green 900', hex: '#1B5E20', rgb: 'rgb(27, 94, 32)', hsl: 'hsl(124, 55%, 24%)', category: 'material' },

    { name: 'Material Light Green 500', hex: '#8BC34A', rgb: 'rgb(139, 195, 74)', hsl: 'hsl(88, 50%, 53%)', category: 'material' },
    { name: 'Material Lime 500', hex: '#CDDC39', rgb: 'rgb(205, 220, 57)', hsl: 'hsl(66, 70%, 54%)', category: 'material' },
    { name: 'Material Yellow 500', hex: '#FFEB3B', rgb: 'rgb(255, 235, 59)', hsl: 'hsl(54, 100%, 62%)', category: 'material' },
    { name: 'Material Amber 500', hex: '#FFC107', rgb: 'rgb(255, 193, 7)', hsl: 'hsl(45, 100%, 51%)', category: 'material' },
    { name: 'Material Orange 500', hex: '#FF9800', rgb: 'rgb(255, 152, 0)', hsl: 'hsl(36, 100%, 50%)', category: 'material' },
    { name: 'Material Deep Orange 500', hex: '#FF5722', rgb: 'rgb(255, 87, 34)', hsl: 'hsl(14, 100%, 57%)', category: 'material' },
    { name: 'Material Brown 500', hex: '#795548', rgb: 'rgb(121, 85, 72)', hsl: 'hsl(16, 25%, 38%)', category: 'material' },
    { name: 'Material Grey 500', hex: '#9E9E9E', rgb: 'rgb(158, 158, 158)', hsl: 'hsl(0, 0%, 62%)', category: 'material' },
    { name: 'Material Blue Grey 500', hex: '#607D8B', rgb: 'rgb(96, 125, 139)', hsl: 'hsl(200, 18%, 46%)', category: 'material' }
])
// 筛选后的颜色
const filteredColors = computed(() => {
    let result = colors.value

    // 按分类筛选
    if (activeFilter.value !== 'all') {
        result = result.filter(color => color.category === activeFilter.value)
    }

    // 按搜索词筛选
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(color =>
            color.name.toLowerCase().includes(query) ||
            color.hex.toLowerCase().includes(query) ||
            color.rgb.toLowerCase().includes(query)
        )
    }

    return result
})

// 处理返回事件
const handleBack = () => {
    emit('back')
}

// 复制功能
const copyToClipboard = async (text: string, label: string) => {
    try {
        await navigator.clipboard.writeText(text)
        success(`已复制${label}: ${text}`)
    } catch (error) {
        console.error('复制失败:', error)
        success('复制失败，请手动复制')
    }
}

const copyHex = () => {
    if (selectedColor.value) {
        copyToClipboard(selectedColor.value.hex, 'HEX值')
    }
}

const copyRgb = () => {
    if (selectedColor.value) {
        copyToClipboard(selectedColor.value.rgb, 'RGB值')
    }
}

const copyHsl = () => {
    if (selectedColor.value) {
        copyToClipboard(selectedColor.value.hsl, 'HSL值')
    }
}

const copyCss = () => {
    if (selectedColor.value) {
        copyToClipboard(`color: ${selectedColor.value.hex};`, 'CSS样式')
    }
}

// 选择颜色
const selectColor = (color: Color) => {
    selectedColor.value = color
    showColorModal.value = true
}

// 初始化
onMounted(() => {
    // 不再默认选择第一个颜色，让用户主动选择
})
</script>
<style scoped>
.color-reference {
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

/* 颜色网格 */
.colors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.color-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
}

.color-card:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
}

.color-preview {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid var(--border-color);
}

.color-info {
    padding: 1rem;
}

.color-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.color-hex {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* 颜色详情 */
.color-details {
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
}

.details-content {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 2rem;
    align-items: start;
}

.color-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.large-preview {
    width: 150px;
    height: 150px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
}

.color-name-large {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    text-align: center;
}

.color-formats {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.format-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.format-item label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
}

.format-value {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.format-input {
    flex: 1;
    padding: 0.75rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
}

/* 弹窗内容样式 */
.color-details-content {
    padding: 1.25rem;
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 1.25rem;
    align-items: start;
}

.color-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.large-preview {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
}

.color-name-large {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-primary);
    text-align: center;
    line-height: 1.2;
}

.color-formats {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.format-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.format-item {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.format-item label {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.format-value {
    display: flex;
    align-items: center;
    gap: 0.375rem;
}

.format-input {
    flex: 1;
    padding: 0.375rem 0.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    min-width: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .converter-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }

    .color-details {
        padding: 1.5rem;
    }

    .colors-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 0.75rem;
    }

    .details-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .color-display {
        flex-direction: row;
        justify-content: center;
    }

    .large-preview {
        width: 100px;
        height: 100px;
    }

    /* 弹窗内容移动端适配 */
    .color-details-content {
        padding: 1rem;
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .color-display {
        flex-direction: row;
        justify-content: center;
        gap: 1rem;
    }

    .large-preview {
        width: 80px;
        height: 80px;
    }

    .color-name-large {
        font-size: 0.75rem;
    }

    .format-row {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }

    .format-input {
        font-size: 0.7rem;
        padding: 0.4rem 0.6rem;
    }
}
</style>