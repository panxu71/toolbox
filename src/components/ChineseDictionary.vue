<template>
    <div class="chinese-dictionary">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">中文汉字字典</h2>
        </div>

        <div class="converter-content">
            <!-- 功能选择标签 -->
            <div class="function-tabs">
                <button v-for="tab in functionTabs" :key="tab.id" :class="['tab-btn', { active: activeTab === tab.id }]"
                    @click="activeTab = tab.id">
                    <span class="tab-icon">{{ tab.icon }}</span>
                    <span class="tab-text">{{ tab.name }}</span>
                </button>
            </div>

            <!-- 汉字查询 -->
            <div v-if="activeTab === 'character'" class="tab-content">
                <div class="search-section">
                    <h3 class="section-title">汉字查询</h3>
                    <div class="search-input-group">
                        <input v-model="characterInput" class="search-input" placeholder="输入汉字进行查询..."
                            @input="searchCharacter" />
                        <button class="search-btn" @click="searchCharacter">查询</button>
                    </div>
                </div>

                <!-- 汉字详情 -->
                <div v-if="characterResult" class="character-details">
                    <div class="character-display">
                        <div class="character-main">{{ characterResult.character }}</div>
                        <div class="character-info">
                            <div class="info-item">
                                <span class="info-label">拼音</span>
                                <span class="info-value">{{ characterResult.pinyin }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">笔画数</span>
                                <span class="info-value">{{ characterResult.strokes }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">繁体字</span>
                                <span class="info-value">{{ characterResult.traditional }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">释义</span>
                                <span class="info-value">{{ characterResult.meaning }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 笔画动画区域 -->
                    <div class="stroke-animation-section">
                        <h4>笔画动画演示</h4>
                        <div class="animation-controls">
                            <button class="animate-btn" @click="showStrokeAnimation">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                播放笔画动画
                            </button>
                            <button class="animate-btn" @click="showStrokeOrder">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M9 12l2 2 4-4" />
                                </svg>
                                显示笔画顺序
                            </button>
                        </div>
                        <div id="stroke-container" class="stroke-container">
                            <div class="placeholder-text">点击上方按钮查看笔画动画</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 拼音查询 -->
            <div v-if="activeTab === 'pinyin'" class="tab-content">
                <div class="search-section">
                    <h3 class="section-title">拼音查询</h3>
                    <div class="search-input-group">
                        <input v-model="pinyinInput" class="search-input" placeholder="输入拼音查询汉字..."
                            @input="searchByPinyin" />
                        <button class="search-btn" @click="searchByPinyin">查询</button>
                    </div>
                </div>

                <div v-if="pinyinResults.length > 0" class="results-section">
                    <h4>查询结果 ({{ pinyinResults.length }}个)</h4>
                    <div class="character-grid">
                        <div v-for="(char, index) in pinyinResults" :key="index" class="character-card"
                            @click="selectCharacter(char)">
                            <div class="char-main">{{ char.character }}</div>
                            <div class="char-pinyin">{{ Array.isArray(char.pinyin) ? char.pinyin.join(', ') :
                                char.pinyin }}</div>
                            <div class="char-meaning">{{ char.meaning }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 文字转换 -->
            <div v-if="activeTab === 'convert'" class="tab-content">
                <div class="search-section">
                    <h3 class="section-title">文字转换</h3>
                    <textarea v-model="convertInput" class="convert-textarea" placeholder="输入要转换的文字..."></textarea>

                    <div class="convert-buttons">
                        <button v-for="option in convertOptions" :key="option.type" class="convert-btn"
                            @click="convertText(option.type)">
                            {{ option.name }}
                        </button>
                    </div>
                </div>

                <div v-if="convertResult" class="result-section">
                    <h4>转换结果</h4>
                    <div class="result-box">
                        <div class="result-text">{{ convertResult }}</div>
                        <button class="copy-btn" @click="copyResult">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            复制
                        </button>
                    </div>
                </div>
            </div>

            <!-- 随机生成 -->
            <div v-if="activeTab === 'random'" class="tab-content">
                <div class="search-section">
                    <h3 class="section-title">随机生成</h3>
                    <div class="random-buttons">
                        <button v-for="option in randomOptions" :key="option.type" class="random-btn"
                            @click="generateRandom(option.type)">
                            <span class="random-icon">{{ option.icon }}</span>
                            <span class="random-text">{{ option.name }}</span>
                        </button>
                    </div>
                </div>

                <div v-if="randomResult" class="result-section">
                    <h4>{{ randomResult.title }}</h4>
                    <div class="random-result-box">
                        <div class="random-result-content">{{ randomResult.content }}</div>
                        <button class="generate-again-btn" @click="generateRandom(randomResult.type)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                                <path d="M21 3v5h-5" />
                                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                                <path d="M3 21v-5h5" />
                            </svg>
                            再次生成
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 消息提示 -->
        <div v-if="message" :class="['message', messageType]">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

defineEmits<{
    back: []
}>()

// 当前活动标签
const activeTab = ref('character')

// 功能标签配置
const functionTabs = [
    { id: 'character', name: '汉字查询', icon: '🔍' },
    { id: 'pinyin', name: '拼音查询', icon: '🔤' },
    { id: 'convert', name: '文字转换', icon: '🔄' },
    { id: 'random', name: '随机生成', icon: '🎲' }
]

// 搜索输入
const characterInput = ref('')
const pinyinInput = ref('')
const convertInput = ref('')

// 搜索结果
const characterResult = ref<any>(null)
const pinyinResults = ref<any[]>([])
const convertResult = ref('')
const randomResult = ref<any>(null)

// 消息提示
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 转换选项
const convertOptions = [
    { type: 'traditional', name: '转繁体' },
    { type: 'simplified', name: '转简体' },
    { type: 'pinyin', name: '转拼音' },
    { type: 'mars', name: '转火星文' }
]

// 随机生成选项
const randomOptions = [
    { type: 'character', name: '随机汉字', icon: '🀄' },
    { type: 'word', name: '随机词语', icon: '📝' },
    { type: 'idiom', name: '随机成语', icon: '📚' },
    { type: 'name', name: '随机姓名', icon: '👤' }
]

// cnchar库引用
let cncharLib: any = null

// 搜索汉字
const searchCharacter = async () => {
    if (!characterInput.value) {
        characterResult.value = null
        showMessage('请输入汉字', 'error')
        return
    }

    const char = characterInput.value.charAt(0)

    try {
        // 使用cnchar获取汉字信息
        const result = {
            character: char,
            pinyin: '',
            strokes: 0,
            traditional: char,
            meaning: '暂无释义'
        }

        // 安全地调用各个API
        try {
            if (cncharLib && cncharLib.spell) {
                const pinyinResult = cncharLib.spell(char, 'tone')
                result.pinyin = pinyinResult || char
            }
        } catch (error) {
            console.warn('获取拼音失败:', error)
        }

        try {
            if (cncharLib && cncharLib.stroke) {
                result.strokes = cncharLib.stroke(char) || 0
            }
        } catch (error) {
            console.warn('获取笔画数失败:', error)
        }

        try {
            if (cncharLib && cncharLib.convert && cncharLib.convert.simpleToTrad) {
                result.traditional = cncharLib.convert.simpleToTrad(char) || char
            }
        } catch (error) {
            console.warn('获取繁体字失败:', error)
        }

        try {
            if (cncharLib && cncharLib.explain) {
                result.meaning = cncharLib.explain(char) || '暂无释义'
            }
        } catch (error) {
            console.warn('获取释义失败:', error)
        }

        characterResult.value = result
        showMessage('查询成功', 'success')
    } catch (error) {
        console.error('汉字查询错误:', error)
        characterResult.value = null
        showMessage('查询失败，请重试', 'error')
    }
}

// 根据拼音搜索
const searchByPinyin = async () => {
    if (!pinyinInput.value) {
        pinyinResults.value = []
        showMessage('请输入拼音', 'error')
        return
    }

    try {
        let chars = ''
        const inputLower = pinyinInput.value.toLowerCase().trim()

        // 尝试使用cnchar库
        if (cncharLib) {
            try {
                if (cncharLib.spellToWord) {
                    chars = cncharLib.spellToWord(inputLower)
                } else if (cncharLib.spell && cncharLib.spell.toWord) {
                    chars = cncharLib.spell.toWord(inputLower)
                }
            } catch (apiError) {
                console.warn('cnchar API调用失败:', apiError)
            }
        }

        // 如果cnchar没有返回结果，使用备用映射表
        if (!chars) {
            const commonPinyinMap: { [key: string]: string } = {
                'ni': '你尼泥逆腻', 'hao': '好号豪毫浩', 'wo': '我沃握卧', 'ta': '他她它塔踏',
                'de': '的得地德', 'shi': '是时事实石', 'zai': '在再载栽', 'you': '有又右游优',
                'le': '了乐勒', 'ma': '吗妈马码', 'bu': '不步部布', 'dou': '都斗豆逗',
                'hen': '很恨狠', 'shui': '水谁睡', 'ren': '人任认仁', 'da': '大打达答',
                'xiao': '小笑校效', 'shang': '上商伤尚', 'xia': '下夏吓', 'zhong': '中钟重种',
                'guo': '国过果锅', 'lai': '来赖莱', 'qu': '去取趣', 'kan': '看刊砍',
                'shuo': '说朔硕', 'zhe': '这者哲', 'ge': '个各格', 'yi': '一以意',
                'er': '二而儿', 'san': '三散伞', 'si': '四死思', 'wu': '五无舞',
                'liu': '六流留', 'qi': '七起气', 'ba': '八把吧', 'jiu': '九久酒',
                'bai': '白百摆', 'qian': '千前钱', 'wan': '万完玩', 'nian': '年念粘',
                'yue': '月约跃', 'ri': '日入', 'tian': '天田甜', 'sheng': '生声胜',
                'ming': '明名鸣', 'ai': '爱哀矮', 'qing': '请情青', 'jia': '家加价',
                'xue': '学雪血', 'gong': '工公功', 'zuo': '做作坐', 'dian': '点电店',
                'hua': '话花化', 'shou': '手首受', 'xin': '心新信', 'yan': '眼言颜',
                'jian': '见间建', 'mian': '面免绵', 'bei': '被北背', 'dong': '东动冬',
                'xi': '西希息', 'nan': '南男难', 'chang': '长常场', 'duan': '短段断',
                'gao': '高搞告', 'di': '低地第', 'kuai': '快块筷', 'man': '慢满漫',
                'hei': '黑嘿', 'hong': '红洪虹', 'huang': '黄皇荒', 'lv': '绿律',
                'lan': '蓝兰篮', 'zi': '紫字自', 'fen': '粉分份', 'cheng': '成城橙',
                'hui': '会回灰', 'jin': '金今进', 'yin': '银音因', 'tong': '同铜通',
                'tie': '铁贴', 'mu': '木目母', 'huo': '火活货', 'tu': '土图兔',
                'feng': '风封疯', 'yu': '雨语鱼', 'lei': '雷累泪', 'shan': '山删闪',
                'he': '河和何', 'hai': '海害孩', 'hu': '湖虎户', 'chuan': '川传船',
                'lin': '林临邻', 'shu': '树书数', 'cao': '草操曹', 'niao': '鸟尿',
                'gou': '狗够钩', 'mao': '猫毛帽', 'zhu': '猪主住', 'niu': '牛扭纽',
                'yang': '羊阳养', 'ji': '鸡机积', 'ya': '鸭压牙', 'e': '鹅额恶',
                'xiong': '熊雄胸', 'lang': '狼浪朗', 'she': '蛇舌设', 'long': '龙隆笼',
                'gui': '龟贵鬼', 'xiang': '象香想', 'chong': '虫冲充', 'die': '蝶跌叠',
                'mi': '蜜密秘', 'wang': '网王忘', 'luo': '螺罗落', 'xian': '线先鲜',
                'dai': '带代待', 'fu': '服福富', 'qun': '裙群', 'ku': '裤哭苦',
                'xie': '鞋写谢', 'tao': '套逃桃', 'ju': '具句巨', 'ben': '本奔笨',
                'bi': '笔比必', 'mo': '墨默摸', 'zhang': '张章掌', 'biao': '表标彪',
                'kuang': '框狂况', 'jie': '姐街接', 'mei': '妹美每', 'nv': '女怒',
                'lao': '老劳牢', 'shao': '少烧稍', 'pang': '胖旁', 'cong': '聪从丛',
                'sha': '傻沙杀', 'huai': '坏怀槐', 'chou': '丑抽愁', 'qin': '勤亲琴',
                'zao': '早枣造', 'yuan': '远原园', 'hou': '后厚候', 'li': '里理力',
                'wai': '外歪'
            }
            chars = commonPinyinMap[inputLower] || ''
        }

        if (!chars) {
            pinyinResults.value = []
            showMessage('未找到对应的汉字，请尝试其他拼音', 'error')
            return
        }

        const charArray = chars.split('').slice(0, 20)
        const results = charArray.map((char: string) => {
            try {
                return {
                    character: char,
                    pinyin: cncharLib && cncharLib.spell ? cncharLib.spell(char, 'tone') || char : char,
                    strokes: cncharLib && cncharLib.stroke ? cncharLib.stroke(char) || 0 : 0,
                    meaning: cncharLib && cncharLib.explain ? cncharLib.explain(char) || '暂无释义' : '暂无释义'
                }
            } catch (error) {
                return {
                    character: char,
                    pinyin: char,
                    strokes: 0,
                    meaning: '暂无释义'
                }
            }
        })

        pinyinResults.value = results
        showMessage(`找到 ${results.length} 个汉字`, 'success')
    } catch (error) {
        console.error('拼音查询错误:', error)
        pinyinResults.value = []
        showMessage('查询失败，请重试', 'error')
    }
}

// 文字转换
const convertText = async (type: string) => {
    if (!convertInput.value) {
        showMessage('请输入要转换的文字', 'error')
        return
    }

    try {
        let result = convertInput.value // 默认返回原文

        switch (type) {
            case 'traditional':
                if (cncharLib && cncharLib.convert && cncharLib.convert.simpleToTrad) {
                    result = cncharLib.convert.simpleToTrad(convertInput.value)
                } else {
                    // 备用简单转换
                    const simpleToTradMap: { [key: string]: string } = {
                        '国': '國', '学': '學', '说': '說', '长': '長', '时': '時',
                        '会': '會', '来': '來', '对': '對', '开': '開', '关': '關',
                        '门': '門', '车': '車', '马': '馬', '鸟': '鳥', '鱼': '魚',
                        '龙': '龍', '风': '風', '云': '雲', '电': '電', '雷': '雷',
                        '雨': '雨', '雪': '雪', '冰': '冰', '火': '火', '水': '水',
                        '土': '土', '木': '木', '金': '金', '银': '銀', '铜': '銅',
                        '铁': '鐵', '钢': '鋼', '石': '石', '山': '山', '川': '川',
                        '河': '河', '海': '海', '湖': '湖', '江': '江', '溪': '溪'
                    }
                    result = convertInput.value.split('').map(char => simpleToTradMap[char] || char).join('')
                }
                break
            case 'simplified':
                if (cncharLib && cncharLib.convert && cncharLib.convert.tradToSimple) {
                    result = cncharLib.convert.tradToSimple(convertInput.value)
                } else {
                    // 备用繁简转换
                    const tradToSimpleMap: { [key: string]: string } = {
                        '國': '国', '學': '学', '說': '说', '長': '长', '時': '时',
                        '會': '会', '來': '来', '對': '对', '開': '开', '關': '关',
                        '門': '门', '車': '车', '馬': '马', '鳥': '鸟', '魚': '鱼',
                        '龍': '龙', '風': '风', '雲': '云', '電': '电', '雷': '雷',
                        '銀': '银', '銅': '铜', '鐵': '铁', '鋼': '钢'
                    }
                    result = convertInput.value.split('').map(char => tradToSimpleMap[char] || char).join('')
                }
                break
            case 'pinyin':
                if (cncharLib && cncharLib.spell) {
                    result = cncharLib.spell(convertInput.value, 'tone')
                } else {
                    // 备用拼音转换
                    const charToPinyinMap: { [key: string]: string } = {
                        '你': 'nǐ', '好': 'hǎo', '我': 'wǒ', '他': 'tā', '她': 'tā',
                        '的': 'de', '是': 'shì', '在': 'zài', '有': 'yǒu', '了': 'le',
                        '不': 'bù', '人': 'rén', '中': 'zhōng', '国': 'guó', '大': 'dà',
                        '小': 'xiǎo', '上': 'shàng', '下': 'xià', '来': 'lái', '去': 'qù',
                        '说': 'shuō', '看': 'kàn', '听': 'tīng', '做': 'zuò', '走': 'zǒu',
                        '吃': 'chī', '喝': 'hē', '睡': 'shuì', '起': 'qǐ', '坐': 'zuò',
                        '站': 'zhàn', '跑': 'pǎo', '跳': 'tiào', '飞': 'fēi', '游': 'yóu',
                        '学': 'xué', '习': 'xí', '工': 'gōng', '作': 'zuò', '家': 'jiā',
                        '爱': 'ài', '喜': 'xǐ', '欢': 'huān', '高': 'gāo', '兴': 'xìng',
                        '快': 'kuài', '乐': 'lè', '美': 'měi', '丽': 'lì', '漂': 'piào',
                        '亮': 'liàng', '聪': 'cōng', '明': 'míng', '智': 'zhì', '慧': 'huì'
                    }
                    result = convertInput.value.split('').map(char => charToPinyinMap[char] || char).join(' ')
                }
                break
            case 'mars':
                if (cncharLib && cncharLib.convert && cncharLib.convert.simpleToSpark) {
                    result = cncharLib.convert.simpleToSpark(convertInput.value)
                } else {
                    // 备用火星文转换
                    const marsMap: { [key: string]: string } = {
                        '的': '滴', '了': '叻', '是': '4', '我': '莪', '你': '伱',
                        '他': '彵', '她': '咜', '它': '牠', '在': '茬', '有': '冇',
                        '不': '卟', '人': '亻', '大': '夶', '小': '尛', '好': '恏',
                        '来': '唻', '去': '厾', '说': '説', '看': '瞧', '听': '厛',
                        '做': '莋', '走': '赱', '吃': '恰', '喝': '咊', '爱': '薆',
                        '喜': '囍', '欢': '歡', '高': '髙', '兴': '興', '快': '筷',
                        '乐': '樂', '美': '媄', '丽': '麗', '漂': '飄', '亮': '煷'
                    }
                    result = convertInput.value.split('').map(char => marsMap[char] || char).join('')
                }
                break
        }

        convertResult.value = result || convertInput.value
        showMessage('转换完成', 'success')
    } catch (error) {
        console.error('转换错误:', error)
        showMessage('转换失败，请重试', 'error')
    }
}

// 随机生成
const generateRandom = async (type: string) => {
    try {
        let content = ''
        let title = ''

        switch (type) {
            case 'character':
                title = '随机汉字'
                if (cncharLib && cncharLib.random && cncharLib.random.char) {
                    content = cncharLib.random.char() || '汉'
                } else {
                    // 备用随机汉字
                    const chars = ['汉', '字', '中', '文', '语', '言', '书', '画', '诗', '词', '歌', '舞', '乐', '美', '善', '真', '爱', '和', '平', '福', '寿', '康', '宁', '安', '乐', '喜', '庆', '祥', '瑞', '吉']
                    content = chars[Math.floor(Math.random() * chars.length)] || '汉'
                }
                break
            case 'word':
                title = '随机词语'
                if (cncharLib && cncharLib.random && cncharLib.random.word) {
                    content = cncharLib.random.word() || '词语'
                } else {
                    // 备用随机词语
                    const words = ['汉语', '中文', '文字', '语言', '文化', '传统', '历史', '古典', '现代', '科技', '艺术', '音乐', '绘画', '书法', '诗歌', '散文', '小说', '戏剧', '电影', '摄影', '雕塑', '建筑', '园林', '美食', '茶道', '武术', '太极', '气功', '中医', '养生']
                    content = words[Math.floor(Math.random() * words.length)] || '词语'
                }
                break
            case 'idiom':
                title = '随机成语'
                if (cncharLib && cncharLib.random && cncharLib.random.idiom) {
                    content = cncharLib.random.idiom() || '成语'
                } else {
                    // 备用随机成语
                    const idioms = [
                        '一心一意', '三心二意', '四面八方', '五光十色', '六神无主', '七上八下', '八仙过海', '九牛一毛', '十全十美',
                        '百花齐放', '千军万马', '万紫千红', '龙飞凤舞', '虎虎生威', '鸟语花香', '鱼跃龙门', '马到成功', '羊年大吉',
                        '猴年马月', '鸡鸣狗盗', '狗急跳墙', '猪突豨勇', '春暖花开', '夏日炎炎', '秋高气爽', '冬雪纷飞',
                        '风和日丽', '雨过天晴', '云开雾散', '电闪雷鸣', '山清水秀', '鸟语花香', '国泰民安', '风调雨顺',
                        '五谷丰登', '六畜兴旺', '七星高照', '八方来财', '九九归一', '十分完美', '百事可乐', '千里之行',
                        '万事如意', '心想事成', '梦想成真', '前程似锦', '锦绣前程', '光明磊落', '正大光明', '堂堂正正'
                    ]
                    content = idioms[Math.floor(Math.random() * idioms.length)] || '成语'
                }
                break
            case 'name':
                title = '随机姓名'
                if (cncharLib && cncharLib.random && cncharLib.random.name) {
                    content = cncharLib.random.name() || '姓名'
                } else {
                    // 备用随机姓名
                    const surnames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '朱', '马', '胡', '郭', '林', '何', '高', '梁', '郑', '罗', '宋', '谢', '唐', '韩', '曹', '许', '邓', '萧', '冯', '曾', '程', '蔡', '彭', '潘', '袁', '于', '董', '余', '苏', '叶', '吕', '魏', '蒋', '田', '杜', '丁', '沈', '姜', '范']
                    const maleNames = ['伟', '强', '明', '华', '建', '文', '军', '志', '勇', '峰', '磊', '鹏', '涛', '斌', '辉', '宇', '杰', '松', '超', '飞', '刚', '龙', '虎', '豪', '俊', '凯', '亮', '博', '海', '山']
                    const femaleNames = ['芳', '丽', '娜', '敏', '静', '秀', '慧', '美', '雅', '琳', '萍', '红', '梅', '玲', '燕', '霞', '莉', '兰', '凤', '洁', '倩', '婷', '颖', '蕾', '薇', '菲', '晶', '欣', '瑶', '怡']

                    const surname = surnames[Math.floor(Math.random() * surnames.length)]
                    const isGirl = Math.random() > 0.5
                    const namePool = isGirl ? femaleNames : maleNames
                    const name = namePool[Math.floor(Math.random() * namePool.length)]

                    // 有时候生成双字名
                    if (Math.random() > 0.7) {
                        const name2 = namePool[Math.floor(Math.random() * namePool.length)]
                        content = (surname || '张') + (name || '明') + (name2 || '华')
                    } else {
                        content = (surname || '张') + (name || '明')
                    }
                }
                break
        }

        randomResult.value = {
            type,
            title,
            content: content || '生成失败'
        }

        showMessage('生成成功', 'success')
    } catch (error) {
        console.error('随机生成错误:', error)
        showMessage('生成失败，请重试', 'error')
    }
}

// 选择汉字
const selectCharacter = (char: any) => {
    characterInput.value = char.character
    characterResult.value = char
    activeTab.value = 'character'
}

// 复制结果
const copyResult = async () => {
    try {
        await navigator.clipboard.writeText(convertResult.value)
        showMessage('已复制到剪贴板', 'success')
    } catch {
        showMessage('复制失败', 'error')
    }
}

// 显示笔画动画
const showStrokeAnimation = () => {
    if (!characterResult.value) {
        showMessage('请先查询一个汉字', 'error')
        return
    }

    // 显示备用信息
    const container = document.getElementById('stroke-container')
    if (container) {
        container.innerHTML = `
            <div class="fallback-info">
                <h5>笔画信息</h5>
                <p><strong>汉字:</strong> ${characterResult.value.character}</p>
                <p><strong>笔画数:</strong> ${characterResult.value.strokes || '未知'}</p>
                <p><strong>拼音:</strong> ${characterResult.value.pinyin || '未知'}</p>
                <p>笔画动画功能需要额外的库支持，当前使用备用显示</p>
            </div>
        `
        showMessage('已显示汉字基本信息', 'success')
    }
}

// 显示笔画顺序
const showStrokeOrder = () => {
    if (!characterResult.value) {
        showMessage('请先查询一个汉字', 'error')
        return
    }

    // 显示备用信息
    const container = document.getElementById('stroke-container')
    if (container) {
        container.innerHTML = `
            <div class="fallback-info">
                <h5>笔画顺序信息</h5>
                <p><strong>汉字:</strong> ${characterResult.value.character}</p>
                <p><strong>笔画数:</strong> ${characterResult.value.strokes || '未知'}</p>
                <p><strong>繁体字:</strong> ${characterResult.value.traditional || characterResult.value.character}</p>
                <p>详细笔画顺序功能需要额外的库支持，当前使用备用显示</p>
            </div>
        `
        showMessage('已显示笔画基本信息', 'success')
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

// 组件挂载时初始化cnchar
onMounted(async () => {
    try {
        // 动态导入cnchar库
        const cncharModule = await import('cnchar')

        cncharLib = cncharModule.default

        console.log('cnchar核心库加载成功')

        // 测试基本功能
        if (cncharLib) {
            console.log('cnchar库测试:')
            try {
                console.log('拼音测试:', cncharLib.spell ? cncharLib.spell('中') : '拼音功能不可用')
            } catch (e) {
                console.log('拼音功能测试失败')
            }
            try {
                console.log('笔画测试:', cncharLib.stroke ? cncharLib.stroke('中') : '笔画功能不可用')
            } catch (e) {
                console.log('笔画功能测试失败')
            }
        }

        showMessage('中文字典已加载完成，使用备用数据库', 'success')
    } catch (error) {
        console.error('加载cnchar库失败:', error)
        showMessage('字典加载失败，将使用备用数据', 'error')

        // 设置一个基本的备用对象
        cncharLib = {
            spell: null,
            stroke: null,
            random: null,
            convert: null,
            explain: null
        }
    }
})
</script>
<style scoped>
.chinese-dictionary {
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
    padding: 2rem 2rem 5rem 2rem;
    overflow-y: auto;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.function-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    background: white;
    padding: 0.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow-x: auto;
}

.tab-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    color: #64748b;
    font-size: 0.875rem;
    white-space: nowrap;
}

.tab-btn:hover {
    background: #f1f5f9;
    color: #475569;
}

.tab-btn.active {
    background: #3b82f6;
    color: white;
}

.tab-content {
    background: white;
    border-radius: 0.75rem;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: #1e293b;
}

.search-section {
    margin-bottom: 2rem;
}

.search-input-group {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-btn {
    padding: 0.75rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-btn:hover {
    background: #2563eb;
}

.character-details {
    margin-top: 2rem;
}

.character-display {
    display: flex;
    align-items: flex-start;
    gap: 2rem;
    padding: 2rem;
    background: #f8fafc;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
}

.character-main {
    font-size: 8rem;
    font-weight: bold;
    color: #1e293b;
    font-family: 'SimSun', serif;
    line-height: 1;
}

.character-info {
    flex: 1;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e2e8f0;
}

.info-item:last-child {
    border-bottom: none;
}

.info-label {
    font-weight: 600;
    color: #475569;
    font-size: 0.875rem;
}

.info-value {
    color: #1e293b;
    font-size: 1rem;
}

.stroke-animation-section {
    margin-top: 2rem;
    padding: 2rem;
    background: white;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
}

.stroke-animation-section h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
}

.animation-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.animate-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
}

.animate-btn:hover {
    background: #059669;
}

.stroke-container {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
    border: 2px dashed #cbd5e1;
    border-radius: 0.5rem;
    padding: 2rem;
}

.placeholder-text {
    color: #64748b;
    font-size: 0.875rem;
    text-align: center;
}

.fallback-info {
    text-align: center;
    padding: 1rem;
}

.fallback-info h5 {
    margin: 0 0 1rem 0;
    color: #374151;
    font-size: 1rem;
}

.fallback-info p {
    margin: 0.5rem 0;
    color: #64748b;
    font-size: 0.875rem;
}

.fallback-info strong {
    color: #1e293b;
}

.results-section {
    margin-top: 2rem;
}

.results-section h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem 0;
}

.character-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.character-card {
    padding: 1.5rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
}

.character-card:hover {
    background: #f1f5f9;
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.char-main {
    font-size: 3rem;
    font-weight: bold;
    color: #1e293b;
    font-family: 'SimSun', serif;
    margin-bottom: 0.5rem;
}

.char-pinyin {
    font-size: 1rem;
    color: #3b82f6;
    margin-bottom: 0.5rem;
}

.char-meaning {
    font-size: 0.875rem;
    color: #64748b;
}

.convert-textarea {
    width: 100%;
    min-height: 120px;
    padding: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    resize: vertical;
    margin-bottom: 1rem;
}

.convert-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.convert-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
}

.convert-btn {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
}

.convert-btn:hover {
    background: #2563eb;
}

.result-section {
    margin-top: 2rem;
}

.result-section h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 1rem 0;
}

.result-box {
    position: relative;
    padding: 1rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
}

.result-text {
    font-size: 1rem;
    color: #1e293b;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.copy-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
}

.copy-btn:hover {
    background: #059669;
}

.random-buttons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
}

.random-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
}

.random-btn:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.random-icon {
    font-size: 2rem;
}

.random-text {
    font-size: 1rem;
    font-weight: 500;
    color: #374151;
}

.random-result-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
}

.random-result-content {
    font-size: 2rem;
    font-weight: bold;
    color: #1e293b;
    font-family: 'SimSun', serif;
}

.generate-again-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background-color 0.2s;
}

.generate-again-btn:hover {
    background: #2563eb;
}

.message {
    position: fixed;
    bottom: 1rem;
    right: 2rem;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: slideUp 0.3s ease-out;
    max-width: 300px;
    word-wrap: break-word;
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

@media (max-width: 768px) {
    .converter-content {
        padding: 1rem 1rem 5rem 1rem;
    }

    .character-display {
        flex-direction: column;
        text-align: center;
    }

    .character-main {
        font-size: 6rem;
    }

    .function-tabs {
        overflow-x: auto;
    }
}
</style>