<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Navigation from './components/Navigation.vue'
import CardGrid from './components/CardGrid.vue'
import Header from './components/Header.vue'
import NotificationContainer from './components/common/NotificationContainer.vue'
import { useTheme } from './composables/useTheme'
import navigationConfig from './config/navigation.json'
import cardsConfig from './config/cards.json'

// 直接同步导入所有组件（不拆分代码）
import JsonFormatter from './components/JsonFormatter.vue'
import JsonToExcel from './components/JsonToExcel.vue'
import JsonPostmanConverter from './components/JsonPostmanConverter.vue'
import JsonToPhp from './components/JsonToPhp.vue'
import TimestampConverter from './components/TimestampConverter.vue'
import DateCalculator from './components/DateCalculator.vue'
import CountdownTimer from './components/CountdownTimer.vue'
import Stopwatch from './components/Stopwatch.vue'
import Clock from './components/Clock.vue'
import TimezoneConverter from './components/TimezoneConverter.vue'
import Base64Converter from './components/Base64Converter.vue'
import UrlConverter from './components/UrlConverter.vue'
import HashGenerator from './components/HashGenerator.vue'
import PasswordGenerator from './components/PasswordGenerator.vue'
import RsaKeyGenerator from './components/RsaKeyGenerator.vue'
import CodeFormatter from './components/CodeFormatter.vue'
import QrGenerator from './components/QrGenerator.vue'
import CrontabGenerator from './components/CrontabGenerator.vue'
import BaseConverter from './components/BaseConverter.vue'
import TextEncoder from './components/TextEncoder.vue'
import StringCounter from './components/StringCounter.vue'
import PhpSerializer from './components/PhpSerializer.vue'
import TextReplacer from './components/TextReplacer.vue'
import ChineseConverter from './components/ChineseConverter.vue'
import AsciiLookup from './components/AsciiLookup.vue'
import UnitConverter from './components/UnitConverter.vue'
import NumberConverter from './components/NumberConverter.vue'
import ColorReference from './components/ColorReference.vue'
import JwtGenerator from './components/JwtGenerator.vue'
import ImageBase64Converter from './components/ImageBase64Converter.vue'
import SurnameLookup from './components/SurnameLookup.vue'
import RegexTester from './components/RegexTester.vue'
import ApiTester from './components/ApiTester.vue'
import TextCompare from './components/TextCompare.vue'
import MimeTypeReference from './components/MimeTypeReference.vue'
import DynastyQuery from './components/DynastyQuery.vue'
import UuidGenerator from './components/UuidGenerator.vue'
import ProgrammingLanguages from './components/ProgrammingLanguages.vue'
import MarkdownEditor from './components/MarkdownEditor.vue'
import Teleprompter from './components/Teleprompter.vue'
import ScreenTest from './components/ScreenTest.vue'
import Settings from './components/Settings.vue'
import CountriesCapitals from './components/CountriesCapitals.vue'
import EmojiReference from './components/EmojiReference.vue'
import IpLookup from './components/IpLookup.vue'
const activeNav = ref('json')
const currentTab = ref<any>(null)
const pageInfo = ref<any>(null)
const isLoading = ref(false)
const currentPage = ref<string | null>(null)
const showSettings = ref(false)

// 主题管理
const { toggleTheme, currentTheme } = useTheme()

// 导航配置
const navigationItems = navigationConfig.navigation

// 当前激活的卡片
const currentCards = computed(() => {
    return cardsConfig.cards[activeNav.value as keyof typeof cardsConfig.cards] || []
})

// 当前页面标题
const currentTitle = computed(() => {
    const navItem = navigationItems.find(item => item.id === activeNav.value)
    return navItem?.name || 'JSON工具'
})

// 处理工具选择（来自搜索）
const handleToolSelection = (toolId: string, action: string) => {
    // 根据工具ID确定应该切换到哪个导航分类
    const toolCategoryMap: Record<string, string> = {
        // JSON工具
        'json-format': 'json',
        'json-to-excel': 'json',
        'json-postman-converter': 'json',
        'json-to-php': 'json',

        // 时间工具
        'timestamp-convert': 'time',
        'date-calculator': 'time',
        'timezone-convert': 'time',
        'countdown-timer': 'time',

        // 加密工具
        'base64-encode': 'crypto',
        'url-encode': 'crypto',
        'md5-hash': 'crypto',
        'rsa-key-generator': 'crypto',
        'text-encoder': 'crypto',
        'jwt-generator': 'crypto',

        // 转换工具
        'chinese-converter': 'convert',
        'text-replacer': 'convert',
        'php-serializer': 'convert',
        'code-formatter': 'convert',
        'number-base': 'convert',

        // 创建工具
        'api-tester': 'create',
        'password-generator': 'create',
        'qr-generator': 'create',
        'crontab-generator': 'create',
        'uuid-generator': 'create',
        'lorem-generator': 'create',
        'gradient-generator': 'create',

        // 查询工具
        'string-counter': 'query',
        'ascii-lookup': 'query',
        'ip-lookup': 'query',
        'domain-whois': 'query',
        'http-status': 'query',
        'regex-tester': 'query',
        'color-reference': 'query',
        'countries-capitals': 'query',
        'emoji-reference': 'query',

        // 导航工具
        'programming-languages': 'navigation',
        'bookmark-manager': 'navigation',
        'quick-links': 'navigation',
        'search-engines': 'navigation',
        'tab-manager': 'navigation',
        'url-shortener': 'navigation',
        'website-analyzer': 'navigation'
    }

    // 切换到对应的导航分类
    const category = toolCategoryMap[toolId]
    if (category && category !== activeNav.value) {
        activeNav.value = category
    }

    // 执行对应的功能
    executeFunction(action)
}

// 导航切换
const handleNavigate = (navId: string) => {
    activeNav.value = navId
    currentPage.value = null // 返回主页面
    updateUrl(navId) // 更新URL
}

// 页面切换
const openPage = (pageName: string) => {
    currentPage.value = pageName
    // 根据页面名称找到对应的工具ID并更新URL
    const toolId = getToolIdByPageName(pageName)
    if (toolId) {
        updateUrl(activeNav.value, toolId)
    }
}

// 根据页面名称获取工具ID
const getToolIdByPageName = (pageName: string): string | null => {
    const pageToolMap: Record<string, string> = {
        'json-formatter': 'json-format',
        'json-to-excel': 'json-to-excel',
        'json-postman-converter': 'json-postman-converter',
        'json-to-php': 'json-to-php',  // 使用更新后的组件
        'json-to-php-new': 'json-to-php',  // 新组件的映射
        'timestamp-converter': 'timestamp-convert',
        'date-calculator': 'date-calculator',
        'timezone-converter': 'timezone-convert',
        'countdown-timer': 'countdown-timer',
        'stopwatch': 'stopwatch',
        'clock': 'clock',
        'base64-converter': 'base64-encode',
        'base64-converter-new': 'base64-encode-new',
        'url-converter': 'url-encode',
        'hash-generator': 'md5-hash',
        'rsa-key-generator': 'rsa-key-generator',
        'text-encoder': 'text-encoder',
        'jwt-generator': 'jwt-generator',
        'chinese-converter': 'chinese-converter',
        'text-replacer': 'text-replacer',
        'php-serializer': 'php-serializer',
        'code-formatter': 'code-formatter',
        'base-converter': 'number-base',
        'number-converter': 'number-format',
        'unit-converter': 'unit-convert',
        'image-base64-converter': 'image-base64',
        'api-tester': 'api-tester',
        'uuid-generator': 'uuid-generator',
        'password-generator': 'password-generator',
        'qr-generator': 'qr-generator',
        'crontab-generator': 'crontab-generator',
        'markdown-editor': 'markdown-editor',
        'teleprompter': 'teleprompter',
        'screen-test': 'screen-test',
        'text-compare': 'text-compare',
        'string-counter': 'string-counter',
        'ascii-lookup': 'ascii-lookup',
        'regex-tester': 'regex-tester',
        'color-reference': 'color-reference',
        'surname-lookup': 'surname-lookup',
        'mime-type-reference': 'mime-type-reference',
        'dynasty-query': 'dynasty-query',
        'programming-languages': 'programming-languages',
        'countries-capitals': 'countries-capitals',
        'emoji-reference': 'emoji-reference',
        'ip-lookup': 'ip-lookup'
    }

    return pageToolMap[pageName] || null
}

const closePage = () => {
    currentPage.value = null
    updateUrl(activeNav.value) // 清除工具参数，只保留分类
}

const goHome = () => {
    currentPage.value = null
    activeNav.value = 'json' // 使用正确的id，对应JSON工具
    // 清空地址栏参数，但保持页面状态
    const url = new URL(window.location.href)
    url.search = ''
    window.history.replaceState({}, '', url.toString())
}

const openSettings = () => {
    showSettings.value = true
}

const closeSettings = () => {
    showSettings.value = false
}

const openFeedback = () => {
    window.open('https://github.com/panxu71/toolbox/issues', '_blank')
}

// 执行功能
const executeFunction = async (action: string) => {
    console.log('执行功能:', action)
    isLoading.value = true

    try {
        switch (action) {
            // JSON工具
            case 'formatJson':
                openPage('json-formatter')
                return // 不需要loading状态
            case 'jsonToExcel':
                openPage('json-to-excel')
                return // 不需要loading状态
            case 'jsonPostmanConverter':
                openPage('json-postman-converter')
                return // 不需要loading状态
            case 'jsonToPhp':
                openPage('json-to-php')
                return // 不需要loading状态
            case 'validateJson':
                await validateJson()
                break
            case 'minifyJson':
                await minifyJson()
                break
            case 'jsonToCsv':
                await jsonToCsv()
                break

            // 时间工具
            case 'convertTimestamp':
                openPage('timestamp-converter')
                return // 不需要loading状态
            case 'calculateDate':
                openPage('date-calculator')
                return // 不需要loading状态
            case 'convertTimezone':
                openPage('timezone-converter')
                return // 不需要loading状态
            case 'countdownTimer':
                openPage('countdown-timer')
                return // 不需要loading状态
            case 'stopwatch':
                openPage('stopwatch')
                return // 不需要loading状态
            case 'clock':
                openPage('clock')
                return // 不需要loading状态

            // 加密工具
            case 'base64Encode':
                openPage('base64-converter')
                return // 不需要loading状态
            case 'base64EncodeNew':
                openPage('base64-converter-new')
                return // 不需要loading状态
            case 'urlEncode':
                openPage('url-converter')
                return // 不需要loading状态
            case 'md5Hash':
                openPage('hash-generator')
                return // 不需要loading状态
            case 'generatePassword':
                openPage('password-generator')
                return // 不需要loading状态
            case 'generateRsaKeys':
                openPage('rsa-key-generator')
                return // 不需要loading状态
            case 'generateJWT':
                openPage('jwt-generator')
                return // 不需要loading状态

            // 转换工具
            case 'convertChinese':
                openPage('chinese-converter')
                return // 不需要loading状态
            case 'replaceText':
                openPage('text-replacer')
                return // 不需要loading状态
            case 'phpSerialize':
                openPage('php-serializer')
                return // 不需要loading状态
            case 'formatCode':
                openPage('code-formatter')
                return // 不需要loading状态
            case 'convertColor':
                openPage('color-reference')
                return // 不需要loading状态
            case 'convertUnit':
                await convertUnit()
                break
            case 'convertNumber':
                await convertNumber()
                break
            case 'convertBase':
                openPage('base-converter')
                return // 不需要loading状态
            case 'convertImageBase64':
                openPage('image-base64-converter')
                return // 不需要loading状态

            // 加密工具 - 文本编码转换
            case 'encodeText':
                openPage('text-encoder')
                return // 不需要loading状态

            // 创建工具
            case 'testApi':
                openPage('api-tester')
                return // 不需要loading状态
            case 'generateQR':
                openPage('qr-generator')
                return // 不需要loading状态
            case 'generateCrontab':
                openPage('crontab-generator')
                return // 不需要loading状态
            case 'markdownEditor':
                openPage('markdown-editor')
                return // 不需要loading状态
            case 'teleprompter':
                openPage('teleprompter')
                return // 不需要loading状态
            case 'screenTest':
                openPage('screen-test')
                return // 不需要loading状态
            case 'generateUuid':
                openPage('uuid-generator')
                return // 不需要loading状态
            case 'generateLorem':
                await generateLorem()
                break
            case 'generateGradient':
                await generateGradient()
                break

            // 查询工具
            case 'countString':
                openPage('string-counter')
                return // 不需要loading状态
            case 'lookupAscii':
                openPage('ascii-lookup')
                return // 不需要loading状态
            case 'lookupSurname':
                openPage('surname-lookup')
                return // 不需要loading状态
            case 'lookupIP':
                openPage('ip-lookup')
                return // 不需要loading状态
            case 'whoisDomain':
                await whoisDomain()
                break
            case 'httpStatus':
                await httpStatus()
                break
            case 'compareText':
                openPage('text-compare')
                return // 不需要loading状态
            case 'mimeTypeReference':
                openPage('mime-type-reference')
                return // 不需要loading状态
            case 'dynastyQuery':
                openPage('dynasty-query')
                return // 不需要loading状态
            case 'countriesCapitals':
                openPage('countries-capitals')
                return // 不需要loading状态
            case 'emojiReference':
                openPage('emoji-reference')
                return // 不需要loading状态
            case 'testRegex':
                openPage('regex-tester')
                return // 不需要loading状态

            // 导航工具
            case 'programmingLanguages':
                openPage('programming-languages')
                return // 不需要loading状态
            case 'manageBookmarks':
                await manageBookmarks()
                break
            case 'quickLinks':
                await quickLinks()
                break
            case 'searchEngines':
                await searchEngines()
                break
            case 'manageTabs':
                await manageTabs()
                break
            case 'shortenUrl':
                await shortenUrl()
                break
            case 'analyzeWebsite':
                await analyzeWebsite()
                break

            // 设置
            case 'toggleTheme':
                toggleTheme()
                showMessage(`已切换到${currentTheme.value === 'dark' ? '夜间' : '白天'}模式`)
                break
            case 'changeLanguage':
                await changeLanguage()
                break
            case 'exportSettings':
                await exportSettings()
                break
            case 'showAbout':
                await showAbout()
                break

            // 原有功能
            case 'getPageInfo':
                await getPageInfo()
                break
            case 'highlightText':
                await highlightText()
                break
            case 'takeScreenshot':
                await takeScreenshot()
                break
            case 'extractLinks':
                await extractLinks()
                break
            case 'extractImages':
                await extractImages()
                break
            case 'countWords':
                await countWords()
                break
            case 'extractText':
                await extractText()
                break
            default:
                console.log('功能开发中:', action)
                showMessage(`功能 "${action}" 正在开发中...`)
        }
    } catch (error) {
        console.error('执行功能失败:', error)
        showMessage('执行失败，请重试')
    } finally {
        isLoading.value = false
    }
}



const validateJson = async () => {
    const input = prompt('请输入JSON字符串:')
    if (input) {
        try {
            JSON.parse(input)
            showMessage('JSON格式正确 ✅')
        } catch (error) {
            showMessage('JSON格式错误 ❌')
        }
    }
}

const minifyJson = async () => {
    const input = prompt('请输入JSON字符串:')
    if (input) {
        try {
            const parsed = JSON.parse(input)
            const minified = JSON.stringify(parsed)
            console.log('压缩后的JSON:', minified)
            showMessage('JSON压缩完成，请查看控制台')
        } catch (error) {
            showMessage('JSON格式错误')
        }
    }
}

const jsonToCsv = async () => {
    showMessage('JSON转CSV功能开发中...')
}







// 加密工具函数







// 转换工具函数
const convertUnit = async () => {
    openPage('unit-converter')
}

const convertNumber = async () => {
    openPage('number-converter')
}



// 创建工具函数
const generateUUID = async () => {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
    console.log('生成的UUID:', uuid)
    showMessage('UUID已生成，请查看控制台')
}

const generateLorem = async () => {
    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    console.log('Lorem文本:', lorem)
    showMessage('Lorem文本已生成，请查看控制台')
}

const generateGradient = async () => {
    showMessage('渐变生成器功能开发中...')
}

// 查询工具函数
const lookupIP = async () => {
    openPage('ip-lookup')
}

const whoisDomain = async () => {
    showMessage('域名查询功能开发中...')
}

const httpStatus = async () => {
    const codes = {
        200: 'OK - 请求成功',
        404: 'Not Found - 页面未找到',
        500: 'Internal Server Error - 服务器内部错误'
    }
    console.log('常见HTTP状态码:', codes)
    showMessage('HTTP状态码信息已显示在控制台')
}

// 导航工具函数
const manageBookmarks = async () => {
    showMessage('书签管理功能开发中...')
}

const quickLinks = async () => {
    showMessage('快速链接功能开发中...')
}

const searchEngines = async () => {
    showMessage('搜索引擎功能开发中...')
}

const manageTabs = async () => {
    showMessage('标签页管理功能开发中...')
}

const shortenUrl = async () => {
    showMessage('短链接生成功能开发中...')
}

const analyzeWebsite = async () => {
    showMessage('网站分析工具功能开发中...')
}

// 设置函数
const changeLanguage = async () => {
    showMessage('语言设置功能开发中...')
}

const exportSettings = async () => {
    const settings = {
        theme: currentTheme.value,
        version: '1.0.0',
        exportTime: new Date().toISOString()
    }
    console.log('导出的设置:', settings)
    showMessage('设置已导出到控制台')
}

const showAbout = async () => {
    const about = {
        name: 'Toolbox',
        version: '1.0.0',
        description: '现代化工具箱',
        author: 'Toolbox Team'
    }
    console.log('关于信息:', about)
    showMessage('关于信息已显示在控制台')
}

// 获取当前标签页
const getCurrentTab = async () => {
    try {
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
            currentTab.value = tab
            return tab
        } else {
            // 开发模式模拟数据
            currentTab.value = {
                title: '示例页面',
                url: 'https://example.com',
                id: 1
            }
            return currentTab.value
        }
    } catch (error) {
        console.error('获取标签页失败:', error)
        return null
    }
}

// 获取页面信息
const getPageInfo = async () => {
    const tab = await getCurrentTab()
    if (tab && tab.id && typeof chrome !== 'undefined') {
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_INFO' })
            pageInfo.value = response
            showMessage('页面信息已获取')
        } catch (error) {
            console.error('获取页面信息失败:', error)
        }
    } else {
        // 开发模式模拟
        pageInfo.value = {
            title: '示例页面',
            url: 'https://example.com',
            domain: 'example.com'
        }
        showMessage('页面信息已获取（开发模式）')
    }
}

// 高亮文本
const highlightText = async () => {
    const tab = await getCurrentTab()
    if (tab && tab.id && typeof chrome !== 'undefined') {
        try {
            await chrome.tabs.sendMessage(tab.id, { type: 'HIGHLIGHT_TEXT' })
            showMessage('文本已高亮')
        } catch (error) {
            console.error('高亮文本失败:', error)
        }
    } else {
        showMessage('文本已高亮（开发模式）')
    }
}

// 截图功能
const takeScreenshot = async () => {
    try {
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            const dataUrl = await chrome.tabs.captureVisibleTab()
            const link = document.createElement('a')
            link.download = `screenshot-${Date.now()}.png`
            link.href = dataUrl
            link.click()
            showMessage('截图已保存')
        } else {
            showMessage('截图功能（开发模式）')
        }
    } catch (error) {
        console.error('截图失败:', error)
    }
}

// 提取链接
const extractLinks = async () => {
    const tab = await getCurrentTab()
    if (tab && tab.id && typeof chrome !== 'undefined') {
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_LINKS' })
            console.log('页面链接:', response)
            showMessage(`找到 ${response.links?.length || 0} 个链接`)
        } catch (error) {
            console.error('提取链接失败:', error)
        }
    } else {
        showMessage('找到 15 个链接（开发模式）')
    }
}

// 提取图片
const extractImages = async () => {
    const tab = await getCurrentTab()
    if (tab && tab.id && typeof chrome !== 'undefined') {
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_IMAGES' })
            console.log('页面图片:', response)
            showMessage(`找到 ${response.images?.length || 0} 张图片`)
        } catch (error) {
            console.error('提取图片失败:', error)
        }
    } else {
        showMessage('找到 8 张图片（开发模式）')
    }
}

// 统计字数
const countWords = async () => {
    const tab = await getCurrentTab()
    if (tab && tab.id && typeof chrome !== 'undefined') {
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'COUNT_WORDS' })
            console.log('字数统计:', response)
            showMessage(`页面共有 ${response.wordCount || 0} 个字`)
        } catch (error) {
            console.error('统计字数失败:', error)
        }
    } else {
        showMessage('页面共有 1,234 个字（开发模式）')
    }
}

// 提取文本
const extractText = async () => {
    const tab = await getCurrentTab()
    if (tab && tab.id && typeof chrome !== 'undefined') {
        try {
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_TEXT' })
            console.log('页面文本:', response)
            showMessage('文本已提取到控制台')
        } catch (error) {
            console.error('提取文本失败:', error)
        }
    } else {
        showMessage('文本已提取到控制台（开发模式）')
    }
}

// 显示消息
const showMessage = (message: string) => {
    console.log('提示:', message)
    // TODO: 可以添加 toast 通知组件
}

onMounted(() => {
    getCurrentTab()
    // 处理URL参数，支持直接访问特定功能
    handleUrlParams()
})

// 处理URL参数
const handleUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const tool = urlParams.get('tool')
    const category = urlParams.get('category')

    if (tool) {
        // 根据工具ID直接打开对应功能
        const toolAction = getToolAction(tool)
        if (toolAction) {
            if (category) {
                activeNav.value = category
            }
            executeFunction(toolAction)
        }
    } else if (category) {
        // 只指定了分类，切换到对应分类
        if (navigationItems.find(item => item.id === category)) {
            activeNav.value = category
        }
    }
}

// 根据工具ID获取对应的action
const getToolAction = (toolId: string): string | null => {
    const toolActionMap: Record<string, string> = {
        // JSON工具
        'json-format': 'formatJson',
        'json-to-excel': 'jsonToExcel',
        'json-postman-converter': 'jsonPostmanConverter',
        'json-to-php': 'jsonToPhp',

        // 时间工具
        'timestamp-convert': 'convertTimestamp',
        'date-calculator': 'calculateDate',
        'timezone-convert': 'convertTimezone',
        'countdown-timer': 'countdownTimer',
        'stopwatch': 'stopwatch',
        'clock': 'clock',

        // 加密工具
        'base64-encode': 'base64Encode',
        'url-encode': 'urlEncode',
        'md5-hash': 'md5Hash',
        'rsa-key-generator': 'generateRsaKeys',
        'text-encoder': 'encodeText',
        'jwt-generator': 'generateJWT',

        // 转换工具
        'chinese-converter': 'convertChinese',
        'text-replacer': 'replaceText',
        'php-serializer': 'phpSerialize',
        'code-formatter': 'formatCode',
        'number-base': 'convertBase',
        'number-format': 'convertNumber',
        'unit-convert': 'convertUnit',
        'image-base64': 'convertImageBase64',

        // 生成工具
        'api-tester': 'testApi',
        'uuid-generator': 'generateUuid',
        'password-generator': 'generatePassword',
        'qr-generator': 'generateQR',
        'crontab-generator': 'generateCrontab',
        'markdown-editor': 'markdownEditor',
        'teleprompter': 'teleprompter',

        // 查询工具
        'screen-test': 'screenTest',
        'text-compare': 'compareText',
        'string-counter': 'countString',
        'ascii-lookup': 'lookupAscii',
        'regex-tester': 'testRegex',
        'color-reference': 'convertColor',
        'surname-lookup': 'lookupSurname',
        'mime-type-reference': 'mimeTypeReference',
        'dynasty-query': 'dynastyQuery',
        'countries-capitals': 'countriesCapitals',
        'emoji-reference': 'emojiReference',
        'ip-lookup': 'lookupIP',

        // 导航工具
        'programming-languages': 'programmingLanguages',
        'bookmark-manager': 'manageBookmarks',
        'quick-links': 'quickLinks',
        'search-engines': 'searchEngines',
        'tab-manager': 'manageTabs',
        'url-shortener': 'shortenUrl',
        'website-analyzer': 'analyzeWebsite'
    }

    return toolActionMap[toolId] || null
}

// 更新URL（不刷新页面）
const updateUrl = (category?: string, tool?: string) => {
    const url = new URL(window.location.href)

    if (category) {
        url.searchParams.set('category', category)
    } else {
        url.searchParams.delete('category')
    }

    if (tool) {
        url.searchParams.set('tool', tool)
    } else {
        url.searchParams.delete('tool')
    }

    // 如果没有参数，清空search
    if (!url.searchParams.toString()) {
        url.search = ''
    }

    window.history.replaceState({}, '', url.toString())
}
</script>

<template>
    <div class="app-container">
        <!-- 顶部导航栏 -->
        <Header :currentTab="currentTab" :pageInfo="pageInfo" @refresh="getCurrentTab" @goHome="goHome" />

        <!-- 主内容区域 -->
        <div class="main-content">
            <!-- 主页面 -->
            <template v-if="!currentPage">
                <!-- 左侧导航 -->
                <Navigation :navigationItems="navigationItems" :activeNav="activeNav" @navigate="handleNavigate"
                    @openSettings="openSettings" @openFeedback="openFeedback" />

                <!-- 右侧功能区 -->
                <div class="content-area">
                    <CardGrid :title="currentTitle" :subtitle="`共 ${currentCards.length} 个功能`" :cards="currentCards"
                        :isLoading="isLoading" @execute="executeFunction" @selectTool="handleToolSelection" />
                </div>
            </template>

            <!-- 功能页面 -->
            <template v-else>
                <JsonFormatter v-if="currentPage === 'json-formatter'" @back="closePage" />
                <JsonToExcel v-if="currentPage === 'json-to-excel'" @back="closePage" />
                <JsonPostmanConverter v-if="currentPage === 'json-postman-converter'" @back="closePage" />
                <JsonToPhp v-if="currentPage === 'json-to-php'" @back="closePage" />
                <TimestampConverter v-if="currentPage === 'timestamp-converter'" @back="closePage" />
                <DateCalculator v-if="currentPage === 'date-calculator'" @back="closePage" />
                <CountdownTimer v-if="currentPage === 'countdown-timer'" @back="closePage" />
                <Stopwatch v-if="currentPage === 'stopwatch'" @back="closePage" />
                <Clock v-if="currentPage === 'clock'" @back="closePage" />
                <TimezoneConverter v-if="currentPage === 'timezone-converter'" @back="closePage" />
                <ApiTester v-if="currentPage === 'api-tester'" @back="closePage" />
                <Base64Converter v-if="currentPage === 'base64-converter'" @back="closePage" />
                <UrlConverter v-if="currentPage === 'url-converter'" @back="closePage" />
                <HashGenerator v-if="currentPage === 'hash-generator'" @back="closePage" />
                <PasswordGenerator v-if="currentPage === 'password-generator'" @back="closePage" />
                <RsaKeyGenerator v-if="currentPage === 'rsa-key-generator'" @back="closePage" />
                <CodeFormatter v-if="currentPage === 'code-formatter'" @back="closePage" />
                <QrGenerator v-if="currentPage === 'qr-generator'" @back="closePage" />
                <CrontabGenerator v-if="currentPage === 'crontab-generator'" @back="closePage" />
                <MarkdownEditor v-if="currentPage === 'markdown-editor'" @back="closePage" />
                <Teleprompter v-if="currentPage === 'teleprompter'" @back="closePage" />
                <ScreenTest v-if="currentPage === 'screen-test'" @back="closePage" />
                <BaseConverter v-if="currentPage === 'base-converter'" @back="closePage" />
                <TextEncoder v-if="currentPage === 'text-encoder'" @back="closePage" />
                <StringCounter v-if="currentPage === 'string-counter'" @back="closePage" />
                <SurnameLookup v-if="currentPage === 'surname-lookup'" @back="closePage" />
                <Settings v-if="currentPage === 'settings'" @back="closePage" />
                <PhpSerializer v-if="currentPage === 'php-serializer'" @back="closePage" />
                <TextReplacer v-if="currentPage === 'text-replacer'" @back="closePage" />
                <ChineseConverter v-if="currentPage === 'chinese-converter'" @back="closePage" />
                <AsciiLookup v-if="currentPage === 'ascii-lookup'" @back="closePage" />
                <UnitConverter v-if="currentPage === 'unit-converter'" @back="closePage" />
                <NumberConverter v-if="currentPage === 'number-converter'" @back="closePage" />
                <ColorReference v-if="currentPage === 'color-reference'" @back="closePage" />
                <JwtGenerator v-if="currentPage === 'jwt-generator'" @back="closePage" />
                <RegexTester v-if="currentPage === 'regex-tester'" @back="closePage" />
                <TextCompare v-if="currentPage === 'text-compare'" @back="closePage" />
                <MimeTypeReference v-if="currentPage === 'mime-type-reference'" @back="closePage" />
                <DynastyQuery v-if="currentPage === 'dynasty-query'" @back="closePage" />
                <UuidGenerator v-if="currentPage === 'uuid-generator'" @back="closePage" />
                <ProgrammingLanguages v-if="currentPage === 'programming-languages'" @back="closePage" />
                <ImageBase64Converter v-if="currentPage === 'image-base64-converter'" @back="closePage" />
                <CountriesCapitals v-if="currentPage === 'countries-capitals'" @back="closePage" />
                <EmojiReference v-if="currentPage === 'emoji-reference'" @back="closePage" />
                <IpLookup v-if="currentPage === 'ip-lookup'" @back="closePage" />
            </template>
        </div>

        <!-- 设置弹窗 -->
        <div v-if="showSettings" class="settings-overlay" @click="closeSettings">
            <div class="settings-modal" @click.stop>
                <div class="settings-header">
                    <h2>设置</h2>
                    <button class="close-btn" @click="closeSettings">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="settings-content">
                    <Settings />
                </div>
            </div>
        </div>

        <!-- 通知容器 -->
        <NotificationContainer />
    </div>
</template>

<style scoped>
.settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.settings-modal {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
}

.settings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    flex-shrink: 0;
}

.settings-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

.settings-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.close-btn {
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.close-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.app-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    overflow: hidden;
}

.main-content {
    flex: 1;
    display: flex;
    min-height: 0;
}

.content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: var(--bg-primary);
}
</style>