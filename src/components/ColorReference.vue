<template>
    <div class="color-reference">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">颜色对照表</h2>
        </div>

        <div ref="converterContentRef" class="converter-content">
            <!-- 搜索和筛选 -->
            <div class="search-section">
                <div class="search-wrapper">
                    <input v-model="searchQuery" type="text" class="search-input" placeholder="搜索颜色名称或代码..."
                        @input="filterColors" />
                    <div class="filter-buttons">
                        <button :class="['filter-btn', { active: selectedCategory === 'all' }]"
                            @click="setCategory('all')">
                            全部
                        </button>
                        <button :class="['filter-btn', { active: selectedCategory === 'basic' }]"
                            @click="setCategory('basic')">
                            基础色
                        </button>
                        <button :class="['filter-btn', { active: selectedCategory === 'web' }]"
                            @click="setCategory('web')">
                            网页安全色
                        </button>
                        <button :class="['filter-btn', { active: selectedCategory === 'material' }]"
                            @click="setCategory('material')">
                            Material Design
                        </button>
                    </div>
                </div>
            </div>

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

            <!-- 选中颜色详情 -->
            <div v-if="selectedColor" ref="colorDetailsRef" class="color-details">
                <h3 class="section-title">颜色详情</h3>
                <div class="details-content">
                    <div class="color-display">
                        <div class="large-preview" :style="{ backgroundColor: selectedColor.hex }"></div>
                        <div class="color-name-large">{{ selectedColor.name }}</div>
                    </div>

                    <div class="color-formats">
                        <div class="format-item">
                            <label>HEX</label>
                            <div class="format-value">
                                <input :value="selectedColor.hex" readonly class="format-input" />
                                <button class="copy-btn" @click="copyFormat(selectedColor.hex)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="format-item">
                            <label>RGB</label>
                            <div class="format-value">
                                <input :value="selectedColor.rgb" readonly class="format-input" />
                                <button class="copy-btn" @click="copyFormat(selectedColor.rgb)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="format-item">
                            <label>HSL</label>
                            <div class="format-value">
                                <input :value="selectedColor.hsl" readonly class="format-input" />
                                <button class="copy-btn" @click="copyFormat(selectedColor.hsl)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="format-item">
                            <label>CSS</label>
                            <div class="format-value">
                                <input :value="`color: ${selectedColor.hex};`" readonly class="format-input" />
                                <button class="copy-btn" @click="copyFormat(`color: ${selectedColor.hex};`)" title="复制">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 悬浮回到顶部按钮 -->
        <button v-if="showBackToTop" class="floating-back-to-top" @click="scrollToTop" title="回到顶部">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m18 15-6-6-6 6" />
            </svg>
        </button>

        <!-- 消息提示 -->
        <div v-if="message" :class="['message', messageType]">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import {  ref, computed, onMounted, onUnmounted, nextTick  } from 'vue'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'

defineEmits<{
    back: []
}>()

interface Color {
    name: string
    hex: string
    rgb: string
    hsl: string
    category: string
}

// 搜索和筛选
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedColor = ref<Color | null>(null)

// DOM引用
const colorDetailsRef = ref<HTMLElement | null>(null)
const converterContentRef = ref<HTMLElement | null>(null)

// 回到顶部按钮显示控制
const showBackToTop = ref(false)

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

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

    // 网页安全色和常用颜色
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
    if (selectedCategory.value !== 'all') {
        result = result.filter(color => color.category === selectedCategory.value)
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

// 设置分类
const setCategory = (category: string) => {
    selectedCategory.value = category
    selectedColor.value = null
}

// 筛选颜色
const filterColors = () => {
    selectedColor.value = null
}

// 监听滚动事件
const handleScroll = () => {
    if (converterContentRef.value) {
        const scrollTop = converterContentRef.value.scrollTop
        showBackToTop.value = scrollTop > 300
        console.log('Scroll top:', scrollTop, 'Show button:', showBackToTop.value) // 调试信息
    } else {
        showBackToTop.value = window.scrollY > 300
    }
}

// 选择颜色
const selectColor = async (color: Color) => {
    selectedColor.value = color

    // 等待DOM更新后滚动到颜色详情
    await nextTick()
    if (colorDetailsRef.value) {
        colorDetailsRef.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }
}

// 回到顶部
const scrollToTop = () => {
    if (converterContentRef.value) {
        converterContentRef.value.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    } else {
        // 备用方案：滚动window
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }
}

// 复制格式
const copyFormat = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        showMessage('已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
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

// 初始化
onMounted(() => {
    setPageTitle('color-reference')
    // 默认选择第一个颜色
    if (colors.value.length > 0) {
        selectedColor.value = colors.value[0] || null
    }

    // 等待DOM更新后添加滚动监听
    nextTick(() => {
        if (converterContentRef.value) {
            converterContentRef.value.addEventListener('scroll', handleScroll)
        } else {
            window.addEventListener('scroll', handleScroll)
        }
    })
})

// 清理
onUnmounted(() => {
    restoreDefaultTitle()
    if (converterContentRef.value) {
        converterContentRef.value.removeEventListener('scroll', handleScroll)
    } else {
        window.removeEventListener('scroll', handleScroll)
    }
})
</script>

<style scoped>
.color-reference {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.converter-header {
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

.converter-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
    color: #1e293b;
}

.converter-content {
    flex: 1;
    padding: 2rem;
    padding-bottom: 6rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 120px);
}

/* 搜索区域 */
.search-section {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.search-input {
    width: 100%;
    padding: 1rem 1.5rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    color: #1e293b;
    font-size: 1rem;
    transition: all 0.2s;
    box-sizing: border-box;
}

.search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 0.75rem 1.5rem;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 0.5rem;
    color: #475569;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-btn:hover {
    background: #e2e8f0;
    color: #334155;
}

.filter-btn.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
}

/* 颜色网格 */
.colors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.color-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.color-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

.color-preview {
    width: 100%;
    height: 80px;
    border-bottom: 1px solid #e2e8f0;
}

.color-info {
    padding: 1rem;
}

.color-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
}

.color-hex {
    font-size: 0.75rem;
    color: #64748b;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

/* 颜色详情 */
.color-details {
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
}

/* 悬浮回到顶部按钮 */
.floating-back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3b82f6;
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    transition: all 0.3s ease;
    z-index: 9999;
}

.floating-back-to-top:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
}

.details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.back-to-top-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #3b82f6;
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.back-to-top-btn:hover {
    background: #2563eb;
    transform: translateY(-1px);
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
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.color-name-large {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
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
    color: #374151;
}

.format-value {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.format-input {
    flex: 1;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    color: #1f2937;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.875rem;
}

.copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    background: transparent;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
}

.copy-btn:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #475569;
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
    .converter-content {
        padding: 1rem;
        padding-bottom: 4rem;
        gap: 1.5rem;
    }

    .search-section,
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

    .filter-buttons {
        justify-content: center;
    }

    .floating-back-to-top {
        bottom: 1rem;
        right: 1rem;
        width: 2.5rem;
        height: 2.5rem;
    }

    .details-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }

    .back-to-top-btn {
        justify-content: center;
    }
}
</style>