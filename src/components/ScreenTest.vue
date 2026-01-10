<template>
    <div class="screen-test" :class="{ fullscreen: isFullscreen }">
        <PageHeader :title="pageTitle" @back="$emit('back')" v-if="!isFullscreen">
            <template #actions>
                <HeaderActionButton icon="fullscreen" tooltip="全屏测试" @click="toggleFullscreen" />
            </template>
        </PageHeader>

        <div class="converter-content">
            <!-- 主要内容区域 -->
            <div class="main-content-area">
                <!-- 左侧控制面板 -->
                <div class="test-controls" v-if="!isFullscreen">
                <!-- 控制区域 -->
                <div class="controls-container">
                    <!-- 手动测试 -->
                    <div class="control-panel">
                        <h4>手动测试</h4>
                        

                        <div class="manual-selector">
                            <select v-model="currentTest" class="test-select" :disabled="isAutoTesting">
                                <optgroup label="基础测试">
                                    <option value="solid-colors">纯色测试</option>
                                    <option value="gradient">基础渐变</option>
                                    <option value="dead-pixel">坏点测试</option>
                                </optgroup>
                                <optgroup label="几何测试">
                                    <option value="grid">方形网格</option>
                                    <option value="horizontal-lines">水平线测试</option>
                                    <option value="vertical-lines">垂直线测试</option>
                                    <option value="diagonal-lines">斜线测试</option>
                                    <option value="dot-matrix">点阵测试</option>
                                    <option value="checkerboard">棋盘测试</option>
                                </optgroup>
                                <optgroup label="高级测试">
                                    <option value="pixel-alignment">像素对齐</option>
                                    <option value="brightness-test">亮度测试</option>
                                    <option value="contrast-test">对比度测试</option>
                                    <option value="color-gradient">彩色渐变</option>
                                    <option value="saturation-test">饱和度测试</option>
                                    <option value="stability-test">闪烁测试</option>
                                    <option value="convergence-test">彩色网格</option>
                                    <option value="micro-pattern">微型图案</option>
                                </optgroup>
                                <optgroup label="其他测试">
                                    <option value="text">文字清晰度</option>
                                    <option value="geometry">几何图形</option>
                                    <option value="color-bars">彩条测试</option>
                                </optgroup>
                            </select>
                        </div>
                        
                        <div class="manual-buttons">
                            <button @click="previousTest" :disabled="isAutoTesting" class="nav-button">
                                ← 上一个
                            </button>
                            <button @click="nextTest" :disabled="isAutoTesting" class="nav-button">
                                下一个 →
                            </button>
                        </div>

                        <!-- 测试提示 -->
                        <div class="test-hints">
                            <div class="hint-section">
                                <strong>{{ getTestName() }}:</strong>
                                <p v-if="currentTest === 'solid-colors'">
                                    检查屏幕颜色显示是否准确，点击屏幕切换颜色<br><br>
                                    <strong>{{ solidColors.find(c => c.value === currentColor)?.name || '颜色' }}</strong><br><br>
                                    <small>点击右侧测试区域切换颜色</small>
                                </p>
                                <p v-else-if="currentTest === 'dead-pixel'">
                                    仔细观察屏幕上是否有亮点、暗点或彩点，点击屏幕切换检测颜色<br><br>
                                    <strong>{{ deadPixelColors.find(c => c.value === currentColor)?.name || '颜色' }}</strong><br><br>
                                    <small>点击右侧测试区域切换颜色</small>
                                </p>
                                <p v-else-if="currentTest === 'gradient'">
                                    检查颜色过渡是否平滑，点击屏幕切换渐变类型<br><br>
                                    <strong>{{ { horizontal: '水平渐变', vertical: '竖直渐变', radial: '径向渐变', rgb: 'RGB渐变' }[gradientType] }}</strong><br><br>
                                    <small>点击右侧测试区域切换渐变类型</small>
                                </p>
                                <p v-else-if="currentTest === 'grid'">
                                    检查网格线条是否清晰、对齐，无断线或模糊
                                </p>
                                <p v-else-if="currentTest === 'horizontal-lines'">
                                    检查水平线条是否笔直、清晰，无弯曲或断线
                                </p>
                                <p v-else-if="currentTest === 'vertical-lines'">
                                    检查垂直线条是否笔直、清晰，无弯曲或断线
                                </p>
                                <p v-else-if="currentTest === 'diagonal-lines'">
                                    检查斜线是否笔直、清晰，角度是否准确
                                </p>
                                <p v-else-if="currentTest === 'dot-matrix'">
                                    检查点阵图案是否规整，点的大小和间距是否一致
                                </p>
                                <p v-else-if="currentTest === 'checkerboard'">
                                    检查棋盘格是否规整，黑白对比是否清晰
                                </p>
                                <p v-else-if="currentTest === 'pixel-alignment'">
                                    检查像素对齐精度，线条是否锐利清晰
                                </p>
                                <p v-else-if="currentTest === 'brightness-test'">
                                    检查灰度显示和亮度层次，能否区分不同亮度级别
                                </p>
                                <p v-else-if="currentTest === 'contrast-test'">
                                    检查灰度层次和对比度显示，观察不同灰度级别是否清晰可辨<br><br>
                                    <strong>{{ contrastMode === 'dark' ? '暗色灰度' : '亮色灰度' }}</strong><br><br>
                                    <small>点击右侧测试区域切换暗色/亮色灰度模式</small>
                                </p>
                                <p v-else-if="currentTest === 'color-gradient'">
                                    检查彩色渐变过渡是否平滑，无色带或断层<br><br>
                                    <strong>{{ { red: '红色渐变', green: '绿色渐变', blue: '蓝色渐变', white: '白色渐变', rainbow: '彩虹渐变' }[gradientColor] }}</strong><br><br>
                                    <small>点击右侧测试区域切换颜色</small>
                                </p>
                                <p v-else-if="currentTest === 'saturation-test'">
                                    检查颜色饱和度显示，不同饱和度级别是否清晰可辨
                                </p>
                                <p v-else-if="currentTest === 'stability-test'">
                                    检查屏幕稳定性和响应时间，点击屏幕开始闪烁测试<br><br>
                                    <strong>状态: {{ isFlickering ? '闪烁中' : '静止' }}</strong><br><br>
                                    <small>点击右侧测试区域开始/停止闪烁</small>
                                </p>
                                <p v-else-if="currentTest === 'convergence-test'">
                                    检查RGB像素对齐和聚焦，红绿线条是否清晰分离<br><br>
                                    <strong>放大倍数: {{ convergenceZoom }}x</strong><br><br>
                                    <small>点击右侧测试区域切换放大倍数 (1-5x)</small>
                                </p>
                                <p v-else-if="currentTest === 'micro-pattern'">
                                    检查精细图案显示能力，微小细节是否清晰可见<br><br>
                                    <strong>{{ ['1像素网格', '2像素网格', '细线图案', '微型棋盘'][microPatternIndex] }}</strong><br><br>
                                    <small>点击右侧测试区域切换图案</small>
                                </p>
                                <p v-else-if="currentTest === 'text'">
                                    检查文字边缘是否清晰，字体显示是否锐利
                                </p>
                                <p v-else-if="currentTest === 'geometry'">
                                    检查几何形状是否规整，线条是否笔直
                                </p>
                                <p v-else-if="currentTest === 'color-bars'">
                                    检查标准彩条颜色显示是否准确
                                </p>
                                <p v-else>
                                    选择测试模式开始检测
                                </p>
                            </div>
                        </div>

                        <div class="shortcuts">
                            <small>
                                快捷键: 空格(下一个) ←→(切换) F(全屏) A(自动)
                            </small>
                        </div>
                    </div>

                    <!-- 自动测试 -->
                    <div class="control-panel">
                        <h4>自动测试套件</h4>
                        
                        <div class="auto-test-config">
                            <div class="suite-selection">
                                <label>测试套件:</label>
                                <select v-model="currentTestSuite" class="suite-select">
                                    <option v-for="(suite, key) in testSuites" :key="key" :value="key">
                                        {{ suite.name }} ({{ suite.tests.length }}项)
                                    </option>
                                </select>
                            </div>

                            <div class="duration-setting">
                                <label>每项时长: {{ autoTestDuration }}秒</label>
                                <input 
                                    type="range" 
                                    v-model="autoTestDuration" 
                                    min="1" 
                                    max="10" 
                                    step="1"
                                    class="duration-range"
                                >
                            </div>
                        </div>

                        <div class="auto-buttons">
                            <button 
                                @click="startAutoTest" 
                                :disabled="isAutoTesting"
                                class="start-btn"
                            >
                                {{ isAutoTesting ? '测试进行中...' : '开始自动测试' }}
                            </button>
                            <button 
                                v-if="isAutoTesting"
                                @click="stopAutoTest" 
                                class="stop-btn"
                            >
                                停止测试
                            </button>
                        </div>

                        <!-- 自动测试状态 -->
                        <div v-if="isAutoTesting" class="auto-test-status">
                            <div class="status-info">
                                <strong>{{ getTestName() }}</strong>
                                <span class="progress-info">{{ currentAutoTestIndex + 1 }}/{{ testSuites[currentTestSuite]?.tests.length || 0 }}</span>
                            </div>
                            <div class="countdown-info">
                                剩余时间: {{ autoTestCountdown }}秒
                            </div>
                        </div>

                    </div>
                </div>
                </div>

                <!-- 右侧测试显示区域 -->
                <div 
                    class="test-display" 
                    :class="[currentTest]"
                    :style="getTestStyle()"
                    @click="handleTestClick"
                >
                <!-- 纯色测试 -->
                <div v-if="currentTest === 'solid-colors'" class="solid-color-test">
                </div>

                <!-- 坏点测试 -->
                <div v-if="currentTest === 'dead-pixel'" class="dead-pixel-test">
                    <!-- 坏点检测专用颜色序列 -->
                    <div class="pixel-test-overlay" v-if="!isFullscreen">
                        <div class="pixel-test-grid">
                            <div v-for="n in 25" :key="n" class="pixel-test-cell"
                                 :style="{ backgroundColor: getPixelTestColor(n) }">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 渐变测试 -->
                <div v-if="currentTest === 'gradient'" class="gradient-test">
                </div>

                <!-- 网格测试 -->
                <div v-if="currentTest === 'grid'" class="grid-test">
                </div>

                <!-- 彩色网格测试 -->
                <div v-if="currentTest === 'convergence-test'" class="convergence-test">
                </div>

                <!-- 彩条测试 -->
                <div v-if="currentTest === 'color-bars'" class="color-bars-test">
                    <div class="color-bar" v-for="color in colorBars" :key="color" :style="{ backgroundColor: color }"></div>
                </div>

                <!-- 文字清晰度测试 -->
                <div v-if="currentTest === 'text'" class="text-test" :style="{ fontSize: textSize + 'px' }">
                    <div class="text-samples">
                        <div class="text-line">ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
                        <div class="text-line">abcdefghijklmnopqrstuvwxyz</div>
                        <div class="text-line">0123456789</div>
                        <div class="text-line chinese">中文字体清晰度测试</div>
                    </div>
                </div>

                <!-- 饱和度测试 -->
                <div v-if="currentTest === 'saturation-test'" class="saturation-test">
                    <div class="saturation-bars">
                        <div v-for="(color, _index) in ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow']" 
                             :key="color" 
                             class="saturation-bar">
                            <div v-for="sat in [0, 20, 40, 60, 80, 100]" 
                                 :key="sat"
                                 class="saturation-block"
                                 :style="getSaturationStyle(color, sat)">
                                {{ sat }}%
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 闪烁测试 - 移除覆盖层，内容已移到左侧提示 -->

                <!-- 微型图案测试 -->
                <div v-if="currentTest === 'micro-pattern'" class="micro-pattern-test">
                    <div class="pattern-display">
                        <div v-if="microPatternIndex === 0" class="micro-grid-1px"></div>
                        <div v-else-if="microPatternIndex === 1" class="micro-grid-2px"></div>
                        <div v-else-if="microPatternIndex === 2" class="micro-lines"></div>
                        <div v-else class="micro-checkerboard"></div>
                        <div class="pattern-counter">{{ microPatternIndex + 1 }}/4</div>
                    </div>
                </div>

                <!-- 几何图形测试 -->
                <div v-if="currentTest === 'geometry'" class="geometry-test">
                    <div class="shapes">
                        <div class="shape circle"></div>
                        <div class="shape square"></div>
                        <div class="shape triangle"></div>
                        <div class="shape diamond"></div>
                    </div>
                    <div class="lines">
                        <div class="line horizontal"></div>
                        <div class="line vertical"></div>
                        <div class="line diagonal1"></div>
                        <div class="line diagonal2"></div>
                    </div>
                </div>

                <!-- 亮度测试 -->
                <div v-if="currentTest === 'brightness-test'" class="brightness-test">
                    <div class="brightness-gradient"></div>
                    <div class="brightness-levels">
                        <div v-for="level in [0, 32, 64, 96, 128, 160, 192, 224, 255]" 
                             :key="level" 
                             class="brightness-block"
                             :style="{ backgroundColor: `rgb(${level}, ${level}, ${level})` }">
                            {{ level }}
                        </div>
                    </div>
                </div>

                <!-- 对比度测试 - 专业灰度测试图案 -->
                <div v-if="currentTest === 'contrast-test'" class="contrast-test-professional">
                    <div class="gray-scale-grid">
                        <!-- 第一行：最暗的灰度 -->
                        <div class="gray-row">
                            <div v-for="(gray, index) in grayLevels[contrastMode].row1" :key="'row1-' + index" 
                                 class="gray-block"
                                 :style="{ backgroundColor: `rgb(${gray.rgb}, ${gray.rgb}, ${gray.rgb})` }">
                                <div class="gray-label" :style="{ color: gray.rgb < 128 ? '#ffffff' : '#000000' }">
                                    <div class="percentage">{{ gray.percent }}%</div>
                                    <div class="rgb-value">({{ gray.rgb }}/255)</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 第二行 -->
                        <div class="gray-row">
                            <div v-for="(gray, index) in grayLevels[contrastMode].row2" :key="'row2-' + index" 
                                 class="gray-block"
                                 :style="{ backgroundColor: `rgb(${gray.rgb}, ${gray.rgb}, ${gray.rgb})` }">
                                <div class="gray-label" :style="{ color: gray.rgb < 128 ? '#ffffff' : '#000000' }">
                                    <div class="percentage">{{ gray.percent }}%</div>
                                    <div class="rgb-value">({{ gray.rgb }}/255)</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 第三行 -->
                        <div class="gray-row">
                            <div v-for="(gray, index) in grayLevels[contrastMode].row3" :key="'row3-' + index" 
                                 class="gray-block"
                                 :style="{ backgroundColor: `rgb(${gray.rgb}, ${gray.rgb}, ${gray.rgb})` }">
                                <div class="gray-label" :style="{ color: gray.rgb < 128 ? '#ffffff' : '#000000' }">
                                    <div class="percentage">{{ gray.percent }}%</div>
                                    <div class="rgb-value">({{ gray.rgb }}/255)</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- 第四行：最亮的灰度 -->
                        <div class="gray-row">
                            <div v-for="(gray, index) in grayLevels[contrastMode].row4" :key="'row4-' + index" 
                                 class="gray-block"
                                 :style="{ backgroundColor: `rgb(${gray.rgb}, ${gray.rgb}, ${gray.rgb})` }">
                                <div class="gray-label" :style="{ color: gray.rgb < 128 ? '#ffffff' : '#000000' }">
                                    <div class="percentage">{{ gray.percent }}%</div>
                                    <div class="rgb-value">({{ gray.rgb }}/255)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
                </div>
            </div>

            <!-- 全屏控制条 -->
        <div class="fullscreen-controls" v-if="isFullscreen">
            <button v-if="!isAutoTesting" @click="previousTest" class="fs-control-btn" title="上一个测试">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6"/>
                </svg>
            </button>
            
            <div class="test-info-fs">
                <span class="test-name">{{ getTestName() }}</span>
                <span v-if="isAutoTesting" class="auto-progress">
                    {{ currentAutoTestIndex + 1 }}/{{ testSuites[currentTestSuite]?.tests.length || 0 }} ({{ autoTestCountdown }}s)
                </span>
            </div>
            
            <span v-if="currentTest === 'micro-pattern'" class="pattern-info">
                {{ ['1像素网格', '2像素网格', '细线图案', '微型棋盘'][microPatternIndex] }} ({{ microPatternIndex + 1 }}/4)
            </span>
            
            <span v-else-if="currentTest === 'color-gradient'" class="pattern-info">
                {{ { red: '红色渐变', green: '绿色渐变', blue: '蓝色渐变', white: '白色渐变', rainbow: '彩虹渐变' }[gradientColor] }}
            </span>
            
            <span v-else-if="currentTest === 'solid-colors'" class="pattern-info">
                {{ solidColors.find(c => c.value === currentColor)?.name || '颜色' }}
            </span>
            
            <span v-else-if="currentTest === 'dead-pixel'" class="pattern-info">
                {{ deadPixelColors.find(c => c.value === currentColor)?.name || '颜色' }}
            </span>
            
            <span v-else-if="currentTest === 'gradient'" class="pattern-info">
                {{ { horizontal: '水平渐变', vertical: '竖直渐变', radial: '径向渐变', rgb: 'RGB渐变' }[gradientType] }}
            </span>
            
            <span v-else-if="currentTest === 'contrast-test'" class="pattern-info">
                {{ contrastMode === 'dark' ? '暗色灰度' : '亮色灰度' }}
            </span>
            
            <span v-else-if="currentTest === 'stability-test'" class="pattern-info">
                {{ isFlickering ? '闪烁中' : '静止' }}
            </span>
            
            <span v-else-if="currentTest === 'convergence-test'" class="pattern-info">
                放大倍数: {{ convergenceZoom }}x
            </span>
            
            <button v-if="!isAutoTesting" @click="nextTest" class="fs-control-btn" title="下一个测试">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m9 18 6-6-6-6"/>
                </svg>
            </button>
            
            <button @click="toggleFullscreen" class="fs-control-btn" title="退出全屏 (ESC)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useWakeLock } from '../composables/useWakeLock'
import { useNotification } from '../composables/useNotification'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 使用组合式函数
usePageTitle('screen-test')
const { requestWakeLock, releaseWakeLock } = useWakeLock()
const { success: showSuccess, error: showError } = useNotification()

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'screen-test')
        if (card) {
            return card.title
        }
    }
    return '屏幕测试'
})

const isFullscreen = ref(false)
const currentTest = ref('solid-colors')
const currentColor = ref('#000000')
const gradientType = ref('horizontal')
const gridSize = ref(20)
const textSize = ref(16)
const gradientColor = ref('red')
const isFlickering = ref(false)
const flickerColor = ref('#000000')
const contrastMode = ref('dark') // 对比度测试模式：dark 或 light
const microPatternIndex = ref(0) // 微型图案当前显示的索引
const convergenceZoom = ref(2) // 彩色网格放大倍数 1-5
let flickerInterval: number | null = null

// 专业灰度测试数据
const grayLevels = ref({
    light: {
        row1: [
            { percent: 64.63, rgb: 165 },
            { percent: 71.76, rgb: 183 },
            { percent: 74.90, rgb: 191 },
            { percent: 78.04, rgb: 199 },
            { percent: 81.18, rgb: 207 },
            { percent: 84.31, rgb: 215 },
            { percent: 87.45, rgb: 223 },
            { percent: 90.59, rgb: 231 },
            { percent: 93.73, rgb: 239 },
            { percent: 96.86, rgb: 247 }
        ],
        row2: [
            { percent: 54.51, rgb: 139 },
            { percent: 58.82, rgb: 150 },
            { percent: 61.96, rgb: 158 },
            { percent: 65.10, rgb: 166 },
            { percent: 68.24, rgb: 174 },
            { percent: 71.37, rgb: 182 },
            { percent: 74.51, rgb: 190 },
            { percent: 77.65, rgb: 198 },
            { percent: 80.78, rgb: 206 },
            { percent: 83.92, rgb: 214 }
        ],
        row3: [
            { percent: 42.16, rgb: 107 },
            { percent: 46.27, rgb: 118 },
            { percent: 49.41, rgb: 126 },
            { percent: 52.55, rgb: 134 },
            { percent: 55.69, rgb: 142 },
            { percent: 58.82, rgb: 150 },
            { percent: 61.96, rgb: 158 },
            { percent: 65.10, rgb: 166 },
            { percent: 68.24, rgb: 174 },
            { percent: 71.37, rgb: 182 }
        ],
        row4: [
            { percent: 26.08, rgb: 66 },
            { percent: 30.20, rgb: 77 },
            { percent: 33.33, rgb: 85 },
            { percent: 36.47, rgb: 93 },
            { percent: 39.61, rgb: 101 },
            { percent: 42.75, rgb: 109 },
            { percent: 45.88, rgb: 117 },
            { percent: 49.02, rgb: 125 },
            { percent: 52.16, rgb: 133 },
            { percent: 55.29, rgb: 141 }
        ]
    },
    dark: {
        row1: [
            { percent: 0.39, rgb: 1 },
            { percent: 0.78, rgb: 2 },
            { percent: 1.18, rgb: 3 },
            { percent: 1.57, rgb: 4 },
            { percent: 1.96, rgb: 5 },
            { percent: 2.35, rgb: 6 },
            { percent: 2.75, rgb: 7 },
            { percent: 3.14, rgb: 8 },
            { percent: 3.53, rgb: 9 },
            { percent: 3.92, rgb: 10 }
        ],
        row2: [
            { percent: 0.78, rgb: 2 },
            { percent: 1.57, rgb: 4 },
            { percent: 2.35, rgb: 6 },
            { percent: 3.14, rgb: 8 },
            { percent: 3.92, rgb: 10 },
            { percent: 4.71, rgb: 12 },
            { percent: 5.49, rgb: 14 },
            { percent: 6.27, rgb: 16 },
            { percent: 7.06, rgb: 18 },
            { percent: 7.84, rgb: 20 }
        ],
        row3: [
            { percent: 1.57, rgb: 4 },
            { percent: 3.14, rgb: 8 },
            { percent: 4.71, rgb: 12 },
            { percent: 6.27, rgb: 16 },
            { percent: 7.84, rgb: 20 },
            { percent: 9.41, rgb: 24 },
            { percent: 10.98, rgb: 28 },
            { percent: 12.55, rgb: 32 },
            { percent: 14.12, rgb: 36 },
            { percent: 15.69, rgb: 40 }
        ],
        row4: [
            { percent: 3.14, rgb: 8 },
            { percent: 6.27, rgb: 16 },
            { percent: 9.41, rgb: 24 },
            { percent: 12.55, rgb: 32 },
            { percent: 15.69, rgb: 40 },
            { percent: 18.82, rgb: 48 },
            { percent: 21.96, rgb: 56 },
            { percent: 25.10, rgb: 64 },
            { percent: 28.24, rgb: 72 },
            { percent: 31.37, rgb: 80 }
        ]
    }
})

// 自动测试相关
const isAutoTesting = ref(false)
const currentAutoTestIndex = ref(0)
const autoTestDuration = ref(3)
const autoTestTimer = ref<number | null>(null)
const autoTestCountdown = ref(0)

// 测试套件定义
const testSuites: Record<string, {
    name: string;
    description: string;
    tests: string[];
    duration: number;
}> = {
    basic: {
        name: '基础测试',
        description: '快速检测屏幕基本功能',
        tests: ['solid-colors', 'dead-pixel', 'grid', 'text'],
        duration: 2
    },
    comprehensive: {
        name: '全面测试',
        description: '完整的屏幕质量检测',
        tests: [
            'solid-colors', 'dead-pixel', 'grid', 'horizontal-lines', 'vertical-lines',
            'diagonal-lines', 'dot-matrix', 'checkerboard', 'brightness-test',
            'contrast-test', 'color-gradient', 'convergence-test', 'text'
        ],
        duration: 3
    },
    professional: {
        name: '专业测试',
        description: '专业级屏幕测试套件',
        tests: [
            'solid-colors', 'dead-pixel', 'grid', 'horizontal-lines', 'vertical-lines',
            'diagonal-lines', 'dot-matrix', 'checkerboard', 'pixel-alignment',
            'brightness-test', 'contrast-test', 'color-gradient', 'saturation-test',
            'stability-test', 'convergence-test', 'micro-pattern', 'text', 'geometry'
        ],
        duration: 4
    },
    quick: {
        name: '快速检测',
        description: '30秒快速屏幕检测',
        tests: ['solid-colors', 'dead-pixel', 'grid', 'text'],
        duration: 1
    }
}

const currentTestSuite = ref('basic')

// 测试数据
const testModes = [
    'solid-colors', 'gradient', 'dead-pixel', 'grid', 'horizontal-lines',
    'vertical-lines', 'diagonal-lines', 'dot-matrix', 'checkerboard',
    'pixel-alignment', 'brightness-test', 'contrast-test', 'color-gradient',
    'saturation-test', 'stability-test', 'convergence-test', 'micro-pattern',
    'text', 'geometry', 'color-bars'
]

const solidColors = [
    { name: '黑色', value: '#000000' },
    { name: '白色', value: '#ffffff' },
    { name: '红色', value: '#ff0000' },
    { name: '绿色', value: '#00ff00' },
    { name: '蓝色', value: '#0000ff' },
    { name: '黄色', value: '#ffff00' },
    { name: '青色', value: '#00ffff' },
    { name: '洋红', value: '#ff00ff' },
    { name: '灰色', value: '#808080' }
]

// 坏点检测专用颜色序列
const deadPixelColors = [
    { name: '纯黑色', value: '#000000', purpose: '检测亮点' },
    { name: '纯白色', value: '#ffffff', purpose: '检测暗点' },
    { name: '纯红色', value: '#ff0000', purpose: '检测绿蓝坏点' },
    { name: '纯绿色', value: '#00ff00', purpose: '检测红蓝坏点' },
    { name: '纯蓝色', value: '#0000ff', purpose: '检测红绿坏点' },
    { name: '深灰色', value: '#404040', purpose: '检测亮点' },
    { name: '浅灰色', value: '#c0c0c0', purpose: '检测暗点' }
]

const colorBars = [
    '#ffffff', '#ffff00', '#00ffff', '#00ff00', 
    '#ff00ff', '#ff0000', '#0000ff', '#000000'
]

let colorIndex = 0

const getPixelTestColor = (index: number) => {
    // 为小网格提供不同的测试颜色
    const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff']
    return colors[index % colors.length]
}

// 功能函数
const getSaturationStyle = (color: string, saturation: number) => {
    const colors: Record<string, string> = {
        red: `hsl(0, ${saturation}%, 50%)`,
        green: `hsl(120, ${saturation}%, 50%)`,
        blue: `hsl(240, ${saturation}%, 50%)`,
        cyan: `hsl(180, ${saturation}%, 50%)`,
        magenta: `hsl(300, ${saturation}%, 50%)`,
        yellow: `hsl(60, ${saturation}%, 50%)`
    }
    return { backgroundColor: colors[color] || '#000' }
}

const toggleFlicker = () => {
    isFlickering.value = !isFlickering.value
    
    if (isFlickering.value) {
        console.log('Starting flicker test')
        showSuccess('闪烁测试已开始')
        startFlicker()
    } else {
        console.log('Stopping flicker test')
        showSuccess('闪烁测试已停止')
        stopFlicker()
    }
}

const startFlicker = () => {
    const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffffff', '#ffff00', '#ff00ff']
    let colorIndex = 0
    
    flickerInterval = setInterval(() => {
        flickerColor.value = colors[colorIndex] || '#000000'
        colorIndex = (colorIndex + 1) % colors.length
    }, 200) as unknown as number
}

const stopFlicker = () => {
    if (flickerInterval) {
        clearInterval(flickerInterval)
        flickerInterval = null
    }
    flickerColor.value = '#000000' // 回到黑色
}

const getTestName = () => {
    const names: Record<string, string> = {
        'solid-colors': '纯色测试',
        'gradient': '基础渐变',
        'dead-pixel': '坏点测试',
        'grid': '方形网格',
        'horizontal-lines': '水平线测试',
        'vertical-lines': '垂直线测试',
        'diagonal-lines': '斜线测试',
        'dot-matrix': '点阵测试',
        'checkerboard': '棋盘测试',
        'pixel-alignment': '像素对齐',
        'brightness-test': '亮度测试',
        'contrast-test': '对比度测试',
        'color-gradient': '彩色渐变',
        'saturation-test': '饱和度测试',
        'stability-test': '闪烁测试',
        'convergence-test': '彩色网格',
        'micro-pattern': '微型图案',
        'text': '文字清晰度',
        'geometry': '几何图形',
        'color-bars': '彩条测试'
    }
    return names[currentTest.value] || '未知测试'
}

const getTestStyle = () => {
    const style: Record<string, any> = {}
    
    switch (currentTest.value) {
        case 'solid-colors':
        case 'dead-pixel':
            style.backgroundColor = currentColor.value
            break
            
        case 'gradient':
            switch (gradientType.value) {
                case 'horizontal':
                    style.background = 'linear-gradient(to right, #000000, #ffffff)'
                    break
                case 'vertical':
                    style.background = 'linear-gradient(to bottom, #000000, #ffffff)'
                    break
                case 'radial':
                    style.background = 'radial-gradient(circle, #000000, #ffffff)'
                    break
                case 'rgb':
                    style.background = 'linear-gradient(to right, #ff0000, #00ff00, #0000ff)'
                    break
            }
            break
            
        case 'grid':
            style.backgroundImage = `
                linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)
            `
            style.backgroundSize = `${gridSize.value}px ${gridSize.value}px`
            style.backgroundColor = '#ffffff'
            break
            
        case 'horizontal-lines':
            style.backgroundImage = `linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px)`
            style.backgroundSize = `100% ${gridSize.value}px`
            style.backgroundColor = '#ffffff'
            break
            
        case 'vertical-lines':
            style.backgroundImage = `linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)`
            style.backgroundSize = `${gridSize.value}px 100%`
            style.backgroundColor = '#ffffff'
            break
            
        case 'diagonal-lines':
            style.backgroundImage = `
                repeating-linear-gradient(45deg, 
                    rgba(0,0,0,0.8) 0px, 
                    rgba(0,0,0,0.8) 1px, 
                    transparent 1px, 
                    transparent ${gridSize.value}px)
            `
            style.backgroundColor = '#ffffff'
            break
            
        case 'dot-matrix':
            style.backgroundImage = `radial-gradient(circle, rgba(0,0,0,0.8) 1px, transparent 1px)`
            style.backgroundSize = `${gridSize.value}px ${gridSize.value}px`
            style.backgroundColor = '#ffffff'
            break
            
        case 'checkerboard':
            const checkerSize = gridSize.value
            style.backgroundImage = `
                linear-gradient(45deg, #000 25%, transparent 25%),
                linear-gradient(-45deg, #000 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #000 75%),
                linear-gradient(-45deg, transparent 75%, #000 75%)
            `
            style.backgroundSize = `${checkerSize}px ${checkerSize}px`
            style.backgroundPosition = `0 0, 0 ${checkerSize/2}px, ${checkerSize/2}px -${checkerSize/2}px, -${checkerSize/2}px 0px`
            style.backgroundColor = '#ffffff'
            break
            
        case 'pixel-alignment':
            style.backgroundImage = `
                linear-gradient(90deg, #000 1px, #fff 1px, #fff ${gridSize.value-1}px, #000 ${gridSize.value-1}px),
                linear-gradient(#000 1px, #fff 1px, #fff ${gridSize.value-1}px, #000 ${gridSize.value-1}px)
            `
            style.backgroundSize = `${gridSize.value}px ${gridSize.value}px`
            style.backgroundColor = '#ffffff'
            break
            
        case 'brightness-test':
            style.backgroundColor = '#f0f0f0'
            break
            
        case 'contrast-test':
            // 对比度测试使用白色背景
            style.backgroundColor = '#ffffff'
            break
            
        case 'color-gradient':
            switch (gradientColor.value) {
                case 'red':
                    style.background = 'linear-gradient(to right, #000000, #ff0000)'
                    break
                case 'green':
                    style.background = 'linear-gradient(to right, #000000, #00ff00)'
                    break
                case 'blue':
                    style.background = 'linear-gradient(to right, #000000, #0000ff)'
                    break
                case 'white':
                    style.background = 'linear-gradient(to right, #000000, #ffffff)'
                    break
                case 'rainbow':
                    style.background = 'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)'
                    break
            }
            break
            
        case 'saturation-test':
            style.backgroundColor = '#f0f0f0'
            break
            
        case 'stability-test':
            // 闪烁测试直接设置背景色，让整个测试区域都闪烁
            style.backgroundColor = flickerColor.value
            break
            
        case 'convergence-test':
            // 彩色网格 - 红绿蓝交替的网格线，线条粗细随放大倍数变化
            const lineWidth = convergenceZoom.value * 4
            style.backgroundImage = `
                linear-gradient(rgba(255,0,0,0.8) ${lineWidth}px, transparent ${lineWidth}px),
                linear-gradient(90deg, rgba(0,255,0,0.8) ${lineWidth}px, transparent ${lineWidth}px)
            `
            style.backgroundSize = `${gridSize.value * convergenceZoom.value}px ${gridSize.value * convergenceZoom.value}px`
            style.backgroundColor = '#000000'
            break
            
        case 'micro-pattern':
            style.backgroundColor = '#ffffff'
            break
            
        case 'text':
            style.backgroundColor = '#ffffff'
            style.color = '#000000'
            break
            
        case 'geometry':
            style.backgroundColor = '#f0f0f0'
            break
            
        case 'color-bars':
            // 彩条样式完全在模板中处理，不设置背景色
            break
            
        default:
            style.backgroundColor = '#f0f0f0'
            break
    }
    
    return style
}

// 功能函数
// 处理测试区域点击
const handleTestClick = () => {
    // 对于纯色测试和坏点测试，点击切换颜色
    if (currentTest.value === 'solid-colors' || currentTest.value === 'dead-pixel') {
        nextColor()
    } else if (currentTest.value === 'gradient') {
        // 基础渐变测试，点击切换渐变类型
        nextGradient()
    } else if (currentTest.value === 'stability-test') {
        // 闪烁测试，点击开始/停止闪烁
        toggleFlicker()
    } else if (currentTest.value === 'contrast-test') {
        // 对比度测试，点击切换亮色/暗色灰度
        toggleContrastMode()
    } else if (currentTest.value === 'micro-pattern') {
        // 微型图案测试，点击切换到下一个图案
        microPatternIndex.value = (microPatternIndex.value + 1) % 4
    } else if (currentTest.value === 'color-gradient') {
        // 彩色渐变测试，点击切换颜色
        nextColorGradient()
    } else if (currentTest.value === 'convergence-test') {
        // 彩色网格测试，点击切换放大倍数
        convergenceZoom.value = convergenceZoom.value === 5 ? 1 : convergenceZoom.value + 1
    } else {
        // 其他测试，暂时不做任何操作（或者可以添加其他逻辑）
        // nextTest() // 移除自动切换模式
    }
}

// 对比度测试模式切换
const toggleContrastMode = () => {
    contrastMode.value = contrastMode.value === 'dark' ? 'light' : 'dark'
}

const nextTest = () => {
    const currentIndex = testModes.indexOf(currentTest.value)
    const nextIndex = (currentIndex + 1) % testModes.length
    currentTest.value = testModes[nextIndex] || 'solid-colors'
    
    // 重置颜色索引到第一个
    colorIndex = 0
    if (currentTest.value === 'dead-pixel') {
        currentColor.value = deadPixelColors[0]?.value || '#000000'
    } else {
        currentColor.value = solidColors[0]?.value || '#000000'
    }
}

const previousTest = () => {
    const currentIndex = testModes.indexOf(currentTest.value)
    const prevIndex = currentIndex === 0 ? testModes.length - 1 : currentIndex - 1
    currentTest.value = testModes[prevIndex] || 'solid-colors'
    
    // 重置颜色索引到第一个
    colorIndex = 0
    if (currentTest.value === 'dead-pixel') {
        currentColor.value = deadPixelColors[0]?.value || '#000000'
    } else {
        currentColor.value = solidColors[0]?.value || '#000000'
    }
}

// 专门用于颜色切换的函数
const nextColor = () => {
    if (currentTest.value === 'solid-colors') {
        colorIndex = (colorIndex + 1) % solidColors.length
        currentColor.value = solidColors[colorIndex]?.value || '#000000'
    } else if (currentTest.value === 'dead-pixel') {
        colorIndex = (colorIndex + 1) % deadPixelColors.length
        currentColor.value = deadPixelColors[colorIndex]?.value || '#000000'
    }
}

const previousColor = () => {
    if (currentTest.value === 'solid-colors') {
        colorIndex = colorIndex === 0 ? solidColors.length - 1 : colorIndex - 1
        currentColor.value = solidColors[colorIndex]?.value || '#000000'
    } else if (currentTest.value === 'dead-pixel') {
        colorIndex = colorIndex === 0 ? deadPixelColors.length - 1 : colorIndex - 1
        currentColor.value = deadPixelColors[colorIndex]?.value || '#000000'
    }
}

// 渐变类型切换函数
const gradientTypes = ['horizontal', 'vertical', 'radial', 'rgb']
let gradientIndex = 0

const nextGradient = () => {
    gradientIndex = (gradientIndex + 1) % gradientTypes.length
    gradientType.value = gradientTypes[gradientIndex] || 'horizontal'
}

const previousGradient = () => {
    gradientIndex = gradientIndex === 0 ? gradientTypes.length - 1 : gradientIndex - 1
    gradientType.value = gradientTypes[gradientIndex] || 'horizontal'
}

// 彩色渐变颜色切换
const gradientColors = ['red', 'green', 'blue', 'white', 'rainbow']
let colorGradientIndex = 0

const nextColorGradient = () => {
    colorGradientIndex = (colorGradientIndex + 1) % gradientColors.length
    gradientColor.value = gradientColors[colorGradientIndex] || 'red'
}

const startAutoTest = async () => {
    if (isAutoTesting.value) return
    
    isAutoTesting.value = true
    currentAutoTestIndex.value = 0
    
    try {
        const suite = testSuites[currentTestSuite.value]
        if (!suite) return
        
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen()
            isFullscreen.value = true
            requestWakeLock()
        }
    } catch (error) {
        isFullscreen.value = true
        requestWakeLock()
    }
    
    showSuccess(`开始${testSuites[currentTestSuite.value]?.name || '测试'}`)
    runNextAutoTest()
}

const stopAutoTest = () => {
    if (autoTestTimer.value) {
        clearInterval(autoTestTimer.value)
        autoTestTimer.value = null
    }
    
    isAutoTesting.value = false
    currentAutoTestIndex.value = 0
    autoTestCountdown.value = 0
    
    showSuccess('自动测试已停止')
}

const runNextAutoTest = () => {
    const suite = testSuites[currentTestSuite.value]
    
    if (!suite || currentAutoTestIndex.value >= suite.tests.length) {
        stopAutoTest()
        showSuccess('所有测试已完成！')
        return
    }
    
    currentTest.value = suite.tests[currentAutoTestIndex.value] || 'solid-colors'
    autoTestCountdown.value = autoTestDuration.value
    
    colorIndex = 0
    if (currentTest.value === 'dead-pixel') {
        currentColor.value = deadPixelColors[0]?.value || '#000000'
    } else {
        currentColor.value = solidColors[0]?.value || '#000000'
    }
    
    const countdownTimer = setInterval(() => {
        autoTestCountdown.value--
        
        if (autoTestCountdown.value <= 0) {
            clearInterval(countdownTimer)
            currentAutoTestIndex.value++
            
            if ((currentTest.value === 'solid-colors' || currentTest.value === 'dead-pixel') && colorIndex < (currentTest.value === 'dead-pixel' ? deadPixelColors.length - 1 : solidColors.length - 1)) {
                nextColor()
                autoTestCountdown.value = autoTestDuration.value
                
                const colorCountdown = setInterval(() => {
                    autoTestCountdown.value--
                    if (autoTestCountdown.value <= 0) {
                        clearInterval(colorCountdown)
                        runNextAutoTest()
                    }
                }, 1000)
            } else {
                runNextAutoTest()
            }
        }
    }, 1000)
}

const toggleFullscreen = async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen()
            isFullscreen.value = true
            requestWakeLock()
            showSuccess('全屏测试模式，点击切换测试，ESC退出')
        } else {
            await document.exitFullscreen()
            isFullscreen.value = false
            releaseWakeLock()
        }
    } catch (error) {
        isFullscreen.value = !isFullscreen.value
        if (isFullscreen.value) {
            requestWakeLock()
            showSuccess('全屏测试模式，点击切换测试，ESC退出')
        } else {
            releaseWakeLock()
        }
    }
}

const handleFullscreenChange = () => {
    const wasFullscreen = isFullscreen.value
    isFullscreen.value = !!document.fullscreenElement
    
    if (wasFullscreen && !isFullscreen.value) {
        releaseWakeLock()
    }
}

const handleKeyPress = (event: KeyboardEvent) => {
    if (isAutoTesting.value) {
        if (event.code === 'Escape') {
            event.preventDefault()
            stopAutoTest()
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else if (isFullscreen.value) {
                isFullscreen.value = false
            }
        }
        return
    }
    
    if (event.code === 'Space' || event.code === 'ArrowRight') {
        event.preventDefault()
        handleTestClick()
    } else if (event.code === 'ArrowLeft') {
        event.preventDefault()
        // 对于纯色测试和坏点测试，左箭头切换到上一个颜色
        if (currentTest.value === 'solid-colors' || currentTest.value === 'dead-pixel') {
            previousColor()
        } else if (currentTest.value === 'gradient') {
            // 基础渐变测试，左箭头切换到上一个渐变类型
            previousGradient()
        } else {
            // 其他测试，左箭头切换到上一个测试模式
            previousTest()
        }
    } else if (event.code === 'Escape') {
        event.preventDefault()
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else if (isFullscreen.value) {
            isFullscreen.value = false
        }
    } else if (event.code === 'KeyF' || event.code === 'F11') {
        event.preventDefault()
        toggleFullscreen()
    } else if (event.code === 'KeyA') {
        event.preventDefault()
        startAutoTest()
    }
}

const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
        showSuccess(msg)
    } else {
        showError(msg)
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeyPress)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    showSuccess('屏幕测试已就绪，空格键或点击切换测试')
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyPress)
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    releaseWakeLock()
    stopFlicker()
    stopAutoTest()
})
</script>
<style scoped>
.screen-test {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    position: relative;
    overflow: hidden;
    background: var(--bg-primary);
}

.screen-test.fullscreen,
.screen-test:fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
}

.converter-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
}

.main-content-area {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-height: 0;
}

/* 简洁的测试控制面板 */
.test-controls {
    width: 320px;
    flex-shrink: 0;
    padding: 16px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    overflow-y: auto;
}


.controls-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 400px;
}

.control-panel {
    background: var(--bg-primary);
    padding: 16px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    width: 100%;
    display: flex;
    flex-direction: column;
}

.control-panel:first-child {
    flex: 1;
    min-height: 0;
}

.control-panel h4 {
    margin: 0 0 12px 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
}

.suite-select,
.test-select {
    width: 100%;
    max-width: 200px;
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 13px;
    margin-bottom: 12px;
}

.duration-setting {
    margin-bottom: 12px;
}

.duration-setting label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    color: var(--text-secondary);
}

.duration-range {
    width: 100%;
    height: 4px;
    background: var(--border-color);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

.auto-buttons,
.manual-buttons {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.start-btn {
    flex: 1;
    padding: 10px 12px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.start-btn:hover:not(:disabled) {
    background: var(--primary-color-dark);
}

.start-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.stop-btn {
    padding: 10px 12px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.stop-btn:hover {
    background: #dc2626;
}

.nav-button {
    flex: none;
    min-width: 80px;
    padding: 8px 16px;
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
}

.nav-button:hover:not(:disabled) {
    background: var(--border-color);
}

.nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.shortcuts {
    margin-top: 8px;
}

.shortcuts small {
    color: var(--text-secondary);
    font-size: 11px;
}

.test-hints {
    margin-top: 12px;
    padding: 12px 14px;
    background: var(--bg-secondary);
    border-radius: 4px;
    border: 1px solid var(--border-color);
    min-height: 80px;
    flex: 1;
}

.hint-section strong {
    color: var(--text-primary);
    font-size: 13px;
    font-weight: 600;
    display: block;
    margin: 8px 0;
}

.hint-section p strong {
    padding: 8px 12px;
    border: 2px solid var(--primary-color);
    border-radius: 4px;
    background: rgba(var(--primary-color-rgb), 0.1);
    display: inline-block;
}

.hint-section p {
    margin: 0;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.hint-section p strong {
    display: inline;
    margin: 8px 0;
}

.hint-section p:has(strong) {
    margin: 8px 0;
}

.auto-test-config {
    margin-bottom: 12px;
}

.suite-selection {
    margin-bottom: 10px;
}

.suite-selection label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
}

.auto-test-status {
    margin-top: 12px;
    padding: 10px 12px;
    background: var(--bg-secondary);
    border-radius: 4px;
    border: 1px solid var(--border-color);
}

.status-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.status-info strong {
    font-size: 13px;
    color: var(--text-primary);
}

.progress-info {
    font-size: 12px;
    color: var(--text-secondary);
    background: var(--bg-primary);
    padding: 2px 6px;
    border-radius: 3px;
    border: 1px solid var(--border-color);
}

.countdown-info {
    font-size: 12px;
    color: var(--text-secondary);
    text-align: center;
}



.test-display {
    flex: 1;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-height: 0;
    padding-bottom: 40px;
    box-sizing: border-box;
}

/* 全屏模式下移除底部 padding */
.screen-test.fullscreen .test-display,
.screen-test:fullscreen .test-display {
    padding-bottom: 0;
}

/* 闪烁测试特殊处理 - 移除默认的居中对齐 */
.test-display.stability-test {
    align-items: stretch;
    justify-content: stretch;
}

.test-info {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10;
}

.test-info h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
}

.test-info p {
    margin: 4px 0;
}

/* 全屏控制条 */
.fullscreen-controls {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 15px;
    background: rgba(0, 0, 0, 0.85);
    padding: 15px 25px;
    border-radius: 50px;
    backdrop-filter: blur(10px);
    z-index: 10001;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.fs-control-btn {
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
}

.fs-control-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
}

.test-name {
    color: white;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
}

.test-info-fs {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.auto-progress {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
}

.pattern-info {
    color: white;
    font-size: 14px;
    font-weight: 500;
    padding: 4px 8px;
    border: 1px solid white;
    border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .main-content-area {
        flex-direction: column;
    }
    
    .test-controls {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
    }
    
    .control-panel {
        min-width: auto;
        max-width: none;
    }
    
    .test-controls {
        padding: 16px;
    }
    
    .control-panel {
        padding: 16px;
    }
    
    .fullscreen-controls {
        flex-wrap: wrap;
        gap: 10px;
        bottom: 20px;
        padding: 12px 20px;
    }
}

/* 彩条测试样式 */
.color-bars-test {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.color-bar {
    flex: 1;
    width: 100%;
}

/* 几何图形测试样式 */
.geometry-test {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
}

.shapes {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
    margin-bottom: 40px;
}

.shape {
    width: 80px;
    height: 80px;
    border: 2px solid #333;
}

.circle {
    border-radius: 50%;
}

.square {
    /* 默认方形 */
}

.triangle {
    width: 0;
    height: 0;
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    border-bottom: 80px solid #333;
    border-top: none;
}

.diamond {
    transform: rotate(45deg);
}

.lines {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

.line {
    position: absolute;
    background: #333;
}

.horizontal {
    top: 50%;
    left: 10%;
    right: 10%;
    height: 2px;
}

.vertical {
    left: 50%;
    top: 10%;
    bottom: 10%;
    width: 2px;
}

.diagonal1 {
    top: 10%;
    left: 10%;
    width: 80%;
    height: 2px;
    transform-origin: left;
    transform: rotate(45deg);
}

.diagonal2 {
    top: 10%;
    right: 10%;
    width: 80%;
    height: 2px;
    transform-origin: right;
    transform: rotate(-45deg);
}

/* 对比度测试样式 - 专业灰度测试图案 */
.contrast-test-professional {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    padding: 10px 10px 50px 10px;
    background: #ffffff;
}

/* 全屏模式下统一间距 */
.screen-test.fullscreen .contrast-test-professional,
.screen-test:fullscreen .contrast-test-professional {
    padding: 10px;
}

/* 亮度测试样式 */
.brightness-test {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    padding: 10px;
    background: #f0f0f0;
    box-sizing: border-box;
}

/* 全屏模式下统一间距 */
.screen-test.fullscreen .brightness-test,
.screen-test:fullscreen .brightness-test {
    height: 100%;
}

.brightness-gradient {
    flex: 1;
    background: linear-gradient(to right, #000000, #ffffff);
    margin-bottom: 10px;
}

.brightness-levels {
    display: flex;
    gap: 1px;
    flex: 1;
}

.brightness-block {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    color: #333;
}

.gray-scale-grid {
    width: 100%;
    height: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    gap: 2px;
}

/* 全屏模式下灰度网格占满整个高度 */
.screen-test.fullscreen .gray-scale-grid,
.screen-test:fullscreen .gray-scale-grid {
    height: 100%;
}

.gray-row {
    flex: 1;
    display: flex;
    width: 100%;
    gap: 2px;
}

.gray-block {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.gray-label {
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    color: #000;
}

.percentage {
    font-size: 13px;
    margin-bottom: 3px;
}

.rgb-value {
    font-size: 11px;
    opacity: 0.8;
}

/* 饱和度测试样式 */
.saturation-test {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 10px 40px 10px;
    background: #f0f0f0;
}

.saturation-bars {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    height: 100%;
}

.saturation-bar {
    display: flex;
    gap: 1px;
    flex: 1;
}

.saturation-block {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
    border: 1px solid rgba(255,255,255,0.3);
    min-height: 60px;
}

/* 全屏模式下统一间距 */
.screen-test.fullscreen .saturation-test,
.screen-test:fullscreen .saturation-test {
    padding: 10px;
}

/* 微型图案测试样式 */
.micro-pattern-test {
    width: 100%;
    height: calc(100%);
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    background: #f0f0f0;
    box-sizing: border-box;
}

/* 全屏模式下统一间距 */
.screen-test.fullscreen .micro-pattern-test,
.screen-test:fullscreen .micro-pattern-test {
    height: 100%;
}

.micro-patterns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    height: 100%;
}

.pattern-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 20px;
    position: relative;
}

.pattern-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.pattern-title {
    font-weight: bold;
    color: #333;
    font-size: 16px;
    flex-shrink: 0;
}

.pattern-counter {
    font-size: 14px;
    color: #666;
    flex-shrink: 0;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
}

.micro-grid-1px,
.micro-grid-2px,
.micro-lines,
.micro-checkerboard {
    flex: 1;
    width: 100%;
    background-color: #fff;
}

.micro-grid-1px {
    background-image: 
        linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px);
    background-size: 2px 2px;
}

.micro-grid-2px {
    background-image: 
        linear-gradient(rgba(0,0,0,1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px);
    background-size: 4px 4px;
}

.micro-lines {
    background-image: 
        repeating-linear-gradient(0deg, #000 0px, #000 1px, #fff 1px, #fff 2px);
    background-size: 100% 2px;
}

.micro-checkerboard {
    background-image: 
        linear-gradient(45deg, #000 25%, transparent 25%),
        linear-gradient(-45deg, #000 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #000 75%),
        linear-gradient(-45deg, transparent 75%, #000 75%);
    background-size: 4px 4px;
    background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .micro-patterns {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .micro-grid-1px,
    .micro-grid-2px,
    .micro-lines,
    .micro-checkerboard {
        width: 250px;
        height: 250px;
    }
}
</style>