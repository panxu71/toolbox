<template>
    <div class="markdown-editor">
        <PageHeader :title="pageTitle" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="copy" tooltip="复制Markdown" @click="copyContent" />
                <HeaderActionButton icon="download" tooltip="下载Markdown" @click="exportMarkdown" />
                <HeaderActionButton icon="clear" tooltip="清空内容" @click="clearContent" />
            </template>
        </PageHeader>

        <!-- 编辑器容器 -->
        <div class="editor-container">
            <div class="editor-panes">
                <!-- 编辑区域 -->
                <div class="editor-pane">
                    <div class="pane-header">
                        <span>编辑</span>
                        <!-- 编辑工具栏 -->
                        <div class="editor-toolbar">
                            <button @click="insertText('**', '**')" title="粗体" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                                </svg>
                            </button>
                            <button @click="insertText('*', '*')" title="斜体" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="10,4 14,4 8,20 4,20" />
                                </svg>
                            </button>
                            <button @click="insertText('~~', '~~')" title="删除线" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M16 4H9a3 3 0 0 0-2.83 4" />
                                    <path d="M14 12a4 4 0 0 1 0 8H6" />
                                    <line x1="4" y1="12" x2="20" y2="12" />
                                </svg>
                            </button>
                            <button @click="insertText('`', '`')" title="行内代码" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="16,18 22,12 16,6" />
                                    <polyline points="8,6 2,12 8,18" />
                                </svg>
                            </button>
                            <div class="toolbar-divider"></div>
                            <button @click="insertHeading(1)" title="标题 1" class="toolbar-btn">H1</button>
                            <button @click="insertHeading(2)" title="标题 2" class="toolbar-btn">H2</button>
                            <button @click="insertHeading(3)" title="标题 3" class="toolbar-btn">H3</button>
                            <div class="toolbar-divider"></div>
                            <button @click="insertList('- ')" title="无序列表" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="8" y1="6" x2="21" y2="6" />
                                    <line x1="8" y1="12" x2="21" y2="12" />
                                    <line x1="8" y1="18" x2="21" y2="18" />
                                    <line x1="3" y1="6" x2="3.01" y2="6" />
                                    <line x1="3" y1="12" x2="3.01" y2="12" />
                                    <line x1="3" y1="18" x2="3.01" y2="18" />
                                </svg>
                            </button>
                            <button @click="insertList('1. ')" title="有序列表" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="10" y1="6" x2="21" y2="6" />
                                    <line x1="10" y1="12" x2="21" y2="12" />
                                    <line x1="10" y1="18" x2="21" y2="18" />
                                    <path d="M4 6h1v4" />
                                    <path d="M4 10h2" />
                                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                                </svg>
                            </button>
                            <button @click="insertQuote()" title="引用" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                                    <path
                                        d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                                </svg>
                            </button>
                            <div class="toolbar-divider"></div>
                            <button @click="insertLink()" title="链接" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
                                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
                                </svg>
                            </button>
                            <button @click="selectImage()" title="插入图片" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="9" cy="9" r="2" />
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                </svg>
                            </button>
                            <div class="table-wrapper">
                                <button @click="toggleTableMenu()" title="表格" class="toolbar-btn"
                                    :class="{ active: showTableMenu }">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path
                                            d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                                    </svg>
                                </button>
                                <div v-if="showTableMenu" class="table-menu">
                                    <div class="table-size-selector">
                                        <div class="table-grid">
                                            <div v-for="row in 6" :key="row" class="table-row">
                                                <div v-for="col in 8" :key="col" class="table-cell"
                                                    :class="{ active: row <= hoverRow && col <= hoverCol }"
                                                    @mouseenter="hoverRow = row; hoverCol = col"
                                                    @click="insertTable(row, col)">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="table-info">{{ hoverRow }} × {{ hoverCol }} 表格</div>
                                    </div>
                                </div>
                            </div>
                            <button @click="insertTOC()" title="插入目录" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="8" y1="6" x2="21" y2="6" />
                                    <line x1="8" y1="12" x2="21" y2="12" />
                                    <line x1="8" y1="18" x2="21" y2="18" />
                                    <line x1="3" y1="6" x2="3.01" y2="6" />
                                    <line x1="3" y1="12" x2="3.01" y2="12" />
                                    <line x1="3" y1="18" x2="3.01" y2="18" />
                                </svg>
                            </button>
                            <div class="code-block-wrapper">
                                <button @click="toggleCodeBlockMenu()" title="代码块" class="toolbar-btn"
                                    :class="{ active: showCodeBlockMenu }">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <polyline points="16,18 22,12 16,6" />
                                        <polyline points="8,6 2,12 8,18" />
                                    </svg>
                                </button>
                                <div v-if="showCodeBlockMenu" class="code-block-menu">
                                    <div class="code-lang-item" @click="insertCodeBlock('javascript')">JavaScript</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('python')">Python</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('java')">Java</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('cpp')">C++</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('csharp')">C#</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('php')">PHP</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('go')">Go</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('rust')">Rust</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('html')">HTML</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('css')">CSS</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('sql')">SQL</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('json')">JSON</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('yaml')">YAML</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('bash')">Bash</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('powershell')">PowerShell</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('dockerfile')">Dockerfile</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('swift')">Swift</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('kotlin')">Kotlin</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('dart')">Dart</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('markdown')">Markdown</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('xml')">XML</div>
                                    <div class="code-lang-item" @click="insertCodeBlock('')">纯文本</div>
                                </div>
                            </div>
                            <button @click="insertHorizontalRule()" title="分割线" class="toolbar-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                </svg>
                            </button>
                            <div class="datetime-wrapper">
                                <button @click="toggleDateTimeMenu()" title="插入日期时间" class="toolbar-btn"
                                    :class="{ active: showDateTimeMenu }">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </button>
                                <div v-if="showDateTimeMenu" class="datetime-menu">
                                    <div class="datetime-item" @click="insertDateTime('date')">
                                        <span class="datetime-label">日期</span>
                                        <span class="datetime-preview">{{ formatDateTime('date') }}</span>
                                    </div>
                                    <div class="datetime-item" @click="insertDateTime('time')">
                                        <span class="datetime-label">时间</span>
                                        <span class="datetime-preview">{{ formatDateTime('time') }}</span>
                                    </div>
                                    <div class="datetime-item" @click="insertDateTime('datetime')">
                                        <span class="datetime-label">日期时间</span>
                                        <span class="datetime-preview">{{ formatDateTime('datetime') }}</span>
                                    </div>
                                    <div class="datetime-item" @click="insertDateTime('iso')">
                                        <span class="datetime-label">ISO 格式</span>
                                        <span class="datetime-preview">{{ formatDateTime('iso') }}</span>
                                    </div>
                                    <div class="datetime-item" @click="insertDateTime('timestamp')">
                                        <span class="datetime-label">时间戳</span>
                                        <span class="datetime-preview">{{ formatDateTime('timestamp') }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="emoji-wrapper">
                                <button @click="toggleEmojiMenu()" title="表情" class="toolbar-btn"
                                    :class="{ active: showEmojiMenu }">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="m9 9 1.5 1.5L12 9l1.5 1.5L15 9" />
                                        <path d="M8 15s1.5 2 4 2 4-2 4-2" />
                                    </svg>
                                </button>
                                <div v-if="showEmojiMenu" class="emoji-menu">
                                    <div class="emoji-categories">
                                        <button v-for="category in emojiCategories" :key="category.key"
                                            @click="setEmojiCategory(category.key)"
                                            :class="{ active: selectedEmojiCategory === category.key }"
                                            class="emoji-category-btn" :title="category.name">
                                            {{ category.icon }}
                                        </button>
                                    </div>
                                    <div class="emoji-grid">
                                        <button v-for="emoji in currentEmojis" :key="emoji.code"
                                            @click="insertEmoji(emoji.symbol)" class="emoji-item" :title="emoji.name">
                                            {{ emoji.symbol }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="toolbar-divider"></div>
                            <button @click="togglePreview()" :title="enablePreview ? '关闭预览' : '开启预览'"
                                class="toolbar-btn preview-toggle" :class="{ active: enablePreview }">
                                <svg v-if="enablePreview" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            </button>
                        </div>
                        <div class="pane-actions">
                            <button class="sample-btn" @click="insertSampleData()" title="插入示例数据">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14,2 14,8 20,8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10,9 9,9 8,9" />
                                </svg>
                                示例数据
                            </button>
                        </div>
                    </div>
                    <div class="editor-content">
                        <div class="line-numbers" ref="lineNumbersRef"></div>
                        <textarea ref="editorRef" v-model="content" class="editor-textarea"
                            placeholder="在这里输入 Markdown 内容..." @input="updatePreview" @keydown="handleKeydown"
                            @paste="handlePaste" @scroll="syncScroll">
                </textarea>
                    </div>
                </div>

                <!-- 预览区域 -->
                <div v-if="enablePreview" class="preview-pane">
                    <div class="pane-header">
                        <span>预览</span>
                        <div class="preview-toolbar">
                            <span class="preview-info">实时预览</span>
                        </div>
                    </div>
                    <div class="preview-content" v-html="previewHtml"></div>
                </div>
            </div>
        </div>

        <!-- 隐藏的文件输入 -->
        <input ref="imageInput" type="file" accept="image/*" @change="handleImageSelect" style="display: none;">
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import PageHeader from './common/PageHeader.vue'
import HeaderActionButton from './common/HeaderActionButton.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import { useClipboard } from '../composables/useClipboard'
import { useEmojis } from '../composables/useEmojis'
import cardsConfig from '../config/cards.json'
import { marked } from 'marked'

// 生成目录的函数
const generateTOC = (markdownContent: string): string => {
    const lines = markdownContent.split('\n')
    const headings: Array<{ level: number; text: string; id: string }> = []

    // 提取所有标题
    lines.forEach(line => {
        const match = line.match(/^(#{1,6})\s+(.+)$/)
        if (match && match[1] && match[2]) {
            const level = match[1].length
            const text = match[2].trim()
            const id = text.toLowerCase()
                .replace(/[^\w\s-]/g, '') // 移除特殊字符
                .replace(/\s+/g, '-') // 空格替换为连字符
                .replace(/-+/g, '-') // 多个连字符合并为一个
                .replace(/^-|-$/g, '') // 移除开头和结尾的连字符

            headings.push({ level, text, id })
        }
    })

    if (headings.length === 0) {
        return '<div class="toc-empty">暂无目录</div>'
    }

    // 生成目录HTML
    let tocHtml = '<div class="table-of-contents">\n<div class="toc-title">目录</div>\n<ul class="toc-list">\n'

    headings.forEach(heading => {
        const indent = '  '.repeat(heading.level - 1)
        tocHtml += `${indent}<li class="toc-level-${heading.level}"><a href="#${heading.id}" class="toc-link">${heading.text}</a></li>\n`
    })

    tocHtml += '</ul>\n</div>'
    return tocHtml
}

// 为标题添加ID的函数
const addHeadingIds = (html: string): string => {
    return html.replace(/<h([1-6])>(.*?)<\/h[1-6]>/g, (_, level, text) => {
        const cleanText = text.replace(/<[^>]*>/g, '') // 移除HTML标签
        const id = cleanText.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')

        return `<h${level} id="${id}">${text}</h${level}>`
    })
}

defineEmits<{
    back: []
}>()

// 使用组合式函数
usePageTitle('markdown-editor')
const { success: showSuccess, error: showError } = useNotification()
const { copyToClipboard } = useClipboard()
const {
    activeCategory: selectedEmojiCategory,
    filteredEmojis: currentEmojis,
    setActiveCategory: setEmojiCategory,
    emojiCategories
} = useEmojis()

// 获取页面标题
const pageTitle = computed(() => {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === 'markdown-editor')
        if (card) {
            return card.title
        }
    }
    return 'Markdown编辑器'
})

// DOM 引用
const editorRef = ref<HTMLTextAreaElement>()
const imageInput = ref<HTMLInputElement>()
const lineNumbersRef = ref<HTMLDivElement>()

// 响应式数据
const content = ref('')
const showEmojiMenu = ref(false)
const showTableMenu = ref(false)
const hoverRow = ref(1)
const hoverCol = ref(1)
const showCodeBlockMenu = ref(false)
const showDateTimeMenu = ref(false)
const enablePreview = ref(true)

// 示例数据
const example = ref(`# 欢迎使用 Markdown 编辑器 📝

[TOC]

## 功能特色 ✨

- **实时预览** - 左右分屏显示，所见即所得
- **丰富工具栏** - 一键插入各种 Markdown 语法
- **目录支持** - 自动生成文档目录，支持 TOC 标记
- **图片支持** - 拖拽或粘贴图片自动转 Base64
- **表情符号** - 内置丰富的 Emoji 表情库 😊
- **代码高亮** - 支持 20+ 种编程语言
- **导出功能** - 一键下载 .md 文件
- **复制功能** - 快速复制到剪贴板
- **日期时间** - 快速插入各种时间格式

## 目录功能说明 📚

### 如何使用目录
1. 在文档中任意位置输入 \`TOC\`
2. 系统会自动扫描所有标题（H1-H6）
3. 生成带链接的目录列表
4. 点击目录项可快速跳转到对应章节

### 目录特性
- 自动识别标题层级
- 支持中英文标题
- 生成唯一锚点链接
- 响应式设计，适配各种屏幕

## 文本格式示例 📖

### 基础格式
- **粗体文本** - 重要内容突出显示
- *斜体文本* - 强调或引用
- ~~删除线~~ - 标记已删除内容
- \`行内代码\` - 变量名或函数名
- ==高亮文本== - 重点标记

### 标题层级
# 一级标题 - 文档主标题
## 二级标题 - 章节标题  
### 三级标题 - 小节标题
#### 四级标题 - 子小节
##### 五级标题 - 详细分类
###### 六级标题 - 最小单位

## 列表示例 📋

### 无序列表
- 🍎 苹果 - 富含维生素C
- 🍌 香蕉 - 补充钾元素
- 🍇 葡萄 - 抗氧化作用
  - 🟣 紫葡萄 - 花青素丰富
  - 🟢 青葡萄 - 口感清爽
  - 🔴 红葡萄 - 甜度较高

### 有序列表
1. 📅 制定计划 - 明确目标和时间线
2. 🔍 收集资料 - 查找相关信息和资源
3. ✏️ 开始编写 - 按照大纲逐步完成
4. 🔄 反复修改 - 完善内容和结构
5. ✅ 最终确认 - 检查格式和错误

### 任务列表
- [x] ✅ 完成项目需求分析
- [x] ✅ 设计系统架构
- [ ] 🔄 开发核心功能
- [ ] 📝 编写测试用例
- [ ] 🚀 部署到生产环境

## 代码示例 💻

### JavaScript 代码
\`\`\`javascript
// 🚀 现代 JavaScript 示例
const greeting = (name) => {
    return \`Hello, \${name}! 👋\`;
};

// 📊 数据处理
const users = [
    { id: 1, name: 'Alice', role: '👩‍💻 Developer' },
    { id: 2, name: 'Bob', role: '🎨 Designer' },
    { id: 3, name: 'Charlie', role: '📊 Analyst' }
];

console.log(greeting('World')); // Hello, World! 👋
\`\`\`

### Python 代码
\`\`\`python
# 🐍 Python 数据分析示例
import pandas as pd
import numpy as np

def analyze_data(data):
    """📈 数据分析函数"""
    result = {
        'mean': np.mean(data),
        'std': np.std(data),
        'count': len(data)
    }
    return result

# 📊 示例数据
sales_data = [100, 150, 200, 180, 220, 190, 250]
stats = analyze_data(sales_data)
print(f"📊 销售统计: {stats}")
\`\`\`

### CSS 样式
\`\`\`css
/* 🎨 现代 CSS 样式 */
.card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 24px;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
}

.icon {
    font-size: 2rem;
    margin-bottom: 16px;
}
\`\`\`

## 表格示例 📊

| 🏆 排名 | 👤 姓名 | 💼 职位 | 📧 邮箱 | 📱 电话 | 🌟 评分 |
|---------|---------|---------|---------|---------|---------|
| 1 | 张三 | 🚀 项目经理 | zhang@example.com | 138-0000-0001 | ⭐⭐⭐⭐⭐ |
| 2 | 李四 | 👩‍💻 前端开发 | li@example.com | 138-0000-0002 | ⭐⭐⭐⭐ |
| 3 | 王五 | 🎨 UI设计师 | wang@example.com | 138-0000-0003 | ⭐⭐⭐⭐⭐ |
| 4 | 赵六 | 🔧 后端开发 | zhao@example.com | 138-0000-0004 | ⭐⭐⭐⭐ |

## 引用和链接 🔗

### 经典引用
> 💡 "代码是写给人看的，只是偶尔让计算机执行一下。"  
> —— Harold Abelson

> 🎯 "过早的优化是万恶之源。"  
> —— Donald Knuth

> 🚀 "任何傻瓜都能写出计算机能理解的代码，只有优秀的程序员才能写出人类能理解的代码。"  
> —— Martin Fowler

### 有用的链接
- 📚 [MDN Web 文档](https://developer.mozilla.org/) - 最权威的前端技术文档
- 🐙 [GitHub](https://github.com) - 全球最大的代码托管平台
- 📖 [Stack Overflow](https://stackoverflow.com) - 程序员问答社区
- 🎨 [Dribbble](https://dribbble.com) - 设计师灵感平台

## 图片示例 🖼️

### 在线图片
![🌅 美丽风景](https://picsum.photos/400/300?random=3)

### 本地图片（Base64）
> 💡 提示：你可以通过工具栏的图片按钮上传本地图片，系统会自动转换为 Base64 格式

## 表情符号大全 😊

### 常用表情
😀 😃 😄 😁 😆 😅 🤣 😂 🙂 😉 😊 😇 🥰 😍 🤩 😘 😗 😚 😙

### 手势表情  
👋 🤚 ✋ 👌 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ 👍 👎 ✊ 👊

### 工具图标
🧰 🔧 🔨 ⚙️ 🛠️ ⚒️ 🔩 ⛏️ 🪓 🪚 🔪 🗡️ 🛡️ 💻 🖥️ 🖨️ ⌨️ 🖱️

### 交通工具
🚀 🛸 🚁 ✈️ 🛫 🛬 🚗 🚕 🚙 🚌 🚎 🏎️ 🚓 🚑 🚒 🚐 🛻 🚚

## 特殊格式 ⚡

### 分割线
---

### 脚注
这是一个带脚注的文本[^1]。

[^1]: 这里是脚注的内容，提供额外的说明信息。

### 数学公式（如果支持）
行内公式：$E = mc^2$

块级公式：
$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$

### 键盘按键
按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制  
按 <kbd>Ctrl</kbd> + <kbd>V</kbd> 粘贴  
按 <kbd>Ctrl</kbd> + <kbd>S</kbd> 保存

## 时间记录 ⏰

- 📅 创建时间：${new Date().toLocaleDateString('zh-CN')}
- ⏰ 当前时间：${new Date().toLocaleTimeString('zh-CN')}
- 🌍 时区：${Intl.DateTimeFormat().resolvedOptions().timeZone}

---

🎉 **开始你的 Markdown 创作之旅吧！** 

💡 **小贴士：**
- 使用工具栏快速插入各种元素
- 支持键盘快捷键：Ctrl+B（粗体）、Ctrl+I（斜体）、Ctrl+K（链接）
- 可以直接粘贴图片，自动转换为 Base64 格式
- 点击预览按钮切换编辑/预览模式`)

const previewHtml = computed(() => {
    try {
        let processedContent = content.value

        // 处理 [TOC] 标记
        if (processedContent.includes('[TOC]')) {
            const toc = generateTOC(processedContent)
            processedContent = processedContent.replace(/\[TOC\]/g, toc)
        }

        // 渲染 Markdown
        const markdownResult = marked(processedContent)
        let html: string

        // 处理 marked 可能返回 Promise 的情况
        if (typeof markdownResult === 'string') {
            html = markdownResult
        } else {
            // 如果是 Promise，返回加载状态
            return '<p>正在渲染...</p>'
        }

        // 为标题添加ID以支持目录跳转
        html = addHeadingIds(html)

        return html
    } catch (error) {
        return '<p>预览解析错误</p>'
    }
})

// 移除重复的 showMessage 函数定义，使用公共的 useNotification

function updatePreview() {
    // 预览会自动更新，因为使用了 computed
    updateLineNumbers()
}

function updateLineNumbers() {
    if (!lineNumbersRef.value || !editorRef.value) return

    const lines = content.value.split('\n').length
    const lineNumbersHtml = Array.from({ length: lines }, (_, i) =>
        `<div class="line-number">${i + 1}</div>`
    ).join('')

    lineNumbersRef.value.innerHTML = lineNumbersHtml
}

function syncScroll() {
    if (!lineNumbersRef.value || !editorRef.value) return

    lineNumbersRef.value.scrollTop = editorRef.value.scrollTop
}

function togglePreview() {
    enablePreview.value = !enablePreview.value
    showSuccess(enablePreview.value ? '预览已开启' : '预览已关闭')
}

function insertText(before: string, after: string = '') {
    const textarea = editorRef.value
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.value.substring(start, end)

    const newText = before + selectedText + after
    content.value = content.value.substring(0, start) + newText + content.value.substring(end)

    // 设置光标位置
    setTimeout(() => {
        if (selectedText) {
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
        } else {
            textarea.setSelectionRange(start + before.length, start + before.length)
        }
        textarea.focus()
    })
}

function insertHeading(level: number) {
    const textarea = editorRef.value
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = content.value.lastIndexOf('\n', start - 1) + 1
    const prefix = '#'.repeat(level) + ' '

    content.value = content.value.substring(0, lineStart) + prefix + content.value.substring(lineStart)

    setTimeout(() => {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length)
        textarea.focus()
    })
}

function insertList(prefix: string) {
    const textarea = editorRef.value
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = content.value.lastIndexOf('\n', start - 1) + 1

    content.value = content.value.substring(0, lineStart) + prefix + content.value.substring(lineStart)

    setTimeout(() => {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length)
        textarea.focus()
    })
}

function insertQuote() {
    insertList('> ')
}

function insertTOC() {
    const textarea = editorRef.value
    if (!textarea) return

    const start = textarea.selectionStart
    const lineStart = content.value.lastIndexOf('\n', start - 1) + 1
    const tocText = '[TOC]\n\n'

    content.value = content.value.substring(0, lineStart) + tocText + content.value.substring(lineStart)

    setTimeout(() => {
        textarea.setSelectionRange(start + tocText.length, start + tocText.length)
        textarea.focus()
    })
}

function insertLink() {
    const textarea = editorRef.value
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.value.substring(start, end)

    const linkText = selectedText || '链接文本'
    const newText = `[${linkText}](https://example.com)`

    content.value = content.value.substring(0, start) + newText + content.value.substring(end)

    setTimeout(() => {
        if (!selectedText) {
            textarea.setSelectionRange(start + 1, start + 1 + linkText.length)
        } else {
            textarea.setSelectionRange(start + linkText.length + 3, start + newText.length - 1)
        }
        textarea.focus()
    })
}

function insertTable(rows: number = 3, cols: number = 3) {
    let tableText = '\n'

    // 生成表头
    const headers = Array.from({ length: cols }, (_, i) => `列${i + 1}`).join(' | ')
    tableText += `| ${headers} |\n`

    // 生成分隔线
    const separator = Array.from({ length: cols }, () => '-----').join(' | ')
    tableText += `| ${separator} |\n`

    // 生成数据行
    for (let row = 1; row <= rows - 1; row++) {
        const rowData = Array.from({ length: cols }, (_, i) => `数据${row}-${i + 1}`).join(' | ')
        tableText += `| ${rowData} |\n`
    }

    tableText += '\n'
    insertText(tableText)
    showTableMenu.value = false
}

function toggleTableMenu() {
    showTableMenu.value = !showTableMenu.value
    if (showTableMenu.value) {
        // 每次打开都重置选择状态
        hoverRow.value = 1
        hoverCol.value = 1
    }
}

function insertCodeBlock(language: string = '') {
    let codeText = ''
    let comment = ''

    // 根据语言设置合适的注释
    switch (language) {
        case 'javascript':
        case 'typescript':
        case 'java':
        case 'cpp':
        case 'csharp':
        case 'php':
        case 'go':
        case 'rust':
        case 'swift':
        case 'kotlin':
        case 'dart':
        case 'scala':
            comment = `// 在这里输入代码`
            break
        case 'python':
        case 'ruby':
        case 'perl':
        case 'r':
        case 'bash':
        case 'shell':
        case 'powershell':
            comment = `# 在这里输入代码`
            break
        case 'html':
        case 'xml':
            comment = `<!-- 在这里输入代码 -->`
            break
        case 'css':
            comment = `/* 在这里输入样式 */`
            break
        case 'sql':
            comment = `-- 在这里输入查询`
            break
        case 'lua':
            comment = `-- 在这里输入代码`
            break
        case 'vim':
            comment = `" 在这里输入代码`
            break
        case 'matlab':
            comment = `% 在这里输入代码`
            break
        default:
            comment = '在这里输入代码内容'
    }

    codeText = language
        ? `\`\`\`${language}\n${comment}\n\`\`\``
        : '```\n代码内容\n```'

    insertText(codeText)
    showCodeBlockMenu.value = false
}

function toggleCodeBlockMenu() {
    showCodeBlockMenu.value = !showCodeBlockMenu.value
}

function insertHorizontalRule() {
    insertText('\n---\n')
}

function toggleDateTimeMenu() {
    showDateTimeMenu.value = !showDateTimeMenu.value
}

function formatDateTime(type: string): string {
    const now = new Date()

    switch (type) {
        case 'date':
            return now.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '-')
        case 'time':
            return now.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            })
        case 'datetime':
            return now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(/\//g, '-')
        case 'iso':
            return now.toISOString()
        case 'timestamp':
            return now.getTime().toString()
        default:
            return ''
    }
}

function insertDateTime(type: string) {
    const dateTimeText = formatDateTime(type)
    insertText(dateTimeText)
    showDateTimeMenu.value = false
    showSuccess(`已插入${type === 'date' ? '日期' : type === 'time' ? '时间' : type === 'datetime' ? '日期时间' : type === 'iso' ? 'ISO格式' : '时间戳'}`)
}

function toggleEmojiMenu() {
    showEmojiMenu.value = !showEmojiMenu.value
}

function insertEmoji(emoji: string) {
    insertText(emoji)
    showEmojiMenu.value = false
}

function handleKeydown(event: KeyboardEvent) {
    // 快捷键支持
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'b':
                event.preventDefault()
                insertText('**', '**')
                break
            case 'i':
                event.preventDefault()
                insertText('*', '*')
                break
            case 'k':
                event.preventDefault()
                insertLink()
                break
        }
    }

    // Tab 键支持
    if (event.key === 'Tab') {
        event.preventDefault()
        insertText('    ')
    }

    // ESC 键关闭菜单
    if (event.key === 'Escape') {
        showEmojiMenu.value = false
        showTableMenu.value = false
        showCodeBlockMenu.value = false
        showDateTimeMenu.value = false
    }
}

// 点击外部关闭菜单
function handleClickOutside(event: Event) {
    const target = event.target as HTMLElement
    if (!target.closest('.emoji-wrapper')) {
        showEmojiMenu.value = false
    }
    if (!target.closest('.table-wrapper')) {
        showTableMenu.value = false
    }
    if (!target.closest('.code-block-wrapper')) {
        showCodeBlockMenu.value = false
    }
    if (!target.closest('.datetime-wrapper')) {
        showDateTimeMenu.value = false
    }
}

// 组件挂载时初始化行号
onMounted(() => {
    updateLineNumbers()
    // 添加全局点击监听
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    // 移除全局点击监听
    document.removeEventListener('click', handleClickOutside)
})

// 监听内容变化，更新行号
watch(content, () => {
    updateLineNumbers()
}, { immediate: true })

function insertSampleData() {
    content.value = example.value
    showSuccess('示例数据已插入')
}

function clearContent() {
    content.value = ''
    showSuccess('内容已清空')
}

function exportMarkdown() {
    const blob = new Blob([content.value], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `markdown-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    showSuccess('文件已导出')
}

async function copyContent() {
    try {
        await copyToClipboard(content.value)
        showSuccess('内容已复制到剪贴板')
    } catch {
        showError('复制失败')
    }
}

// 图片处理相关方法
function selectImage() {
    imageInput.value?.click()
}

function handleImageSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        convertImageToBase64(file)
    }
}

function convertImageToBase64(file: File) {
    if (!file.type.startsWith('image/')) {
        showError('请选择图片文件')
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        const base64 = e.target?.result as string
        const fileName = file.name.replace(/\.[^/.]+$/, '') // 去掉扩展名
        const imageMarkdown = `![${fileName}](${base64})`
        insertText(imageMarkdown)
        showSuccess('图片已插入')
    }
    reader.onerror = () => {
        showError('图片读取失败')
    }
    reader.readAsDataURL(file)
}

// 处理粘贴图片
function handlePaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item && item.type.startsWith('image/')) {
            event.preventDefault()
            const file = item.getAsFile()
            if (file) {
                convertImageToBase64(file)
            }
            break
        }
    }
}

// 初始化
onMounted(() => {
    // 设置默认内容
    content.value = example.value
    updatePreview()
})
</script>

<style scoped>
.markdown-editor {
    width: 100%;
    height: 100dvh;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    overflow: hidden;
}

.editor-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.editor-panes {
    display: flex;
    flex: 1;
    min-height: 0;
}

.editor-pane,
.preview-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.editor-content {
    flex: 1;
    display: flex;
    position: relative;
    min-height: 0;
}

.line-numbers {
    width: 50px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    color: var(--text-muted);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.6;
    padding: 16px 8px 16px 0;
    text-align: right;
    user-select: none;
    overflow: hidden;
    flex-shrink: 0;
}

.line-number {
    height: 22.4px;
    /* 匹配 textarea 行高 */
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
}

.preview-pane {
    border-left: 1px solid var(--border-color);
}

.pane-header {
    padding: 8px 16px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    font-size: 12px;
    font-weight: 500;
    color: var(--text-secondary);
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 16px;
}

.pane-header>span {
    text-transform: uppercase;
}

.pane-actions {
    /* 移除 margin-left: auto，让操作按钮保持在固定位置 */
}

.sample-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 11px;
    font-weight: 500;
}

.sample-btn:hover {
    background: var(--primary-bg-light);
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.sample-btn:hover svg {
    color: var(--primary-color);
}

.editor-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    height: 40px;
    box-sizing: border-box;
    /* 移除 margin-left: auto，让工具栏保持在固定位置 */
}

.toolbar-btn {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 11px;
    font-weight: 600;
}

.toolbar-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
}

.toolbar-btn:active {
    background: var(--bg-secondary);
    transform: scale(0.95);
}

.toolbar-divider {
    width: 1px;
    height: 20px;
    background: var(--border-color);
    margin: 0 4px;
}

.emoji-wrapper,
.table-wrapper,
.code-block-wrapper,
.datetime-wrapper {
    position: relative;
}

.toolbar-btn.active {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.toolbar-btn.preview-toggle.active {
    background: var(--primary-bg-light);
    color: var(--primary-color);
}

.toolbar-btn.preview-toggle:hover {
    background: var(--bg-tertiary);
    color: var(--primary-color);
}

.emoji-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    margin-top: 4px;
    width: 280px;
}

.emoji-categories {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    padding: 8px;
    gap: 4px;
}

.emoji-category-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.15s ease;
}

.emoji-category-btn:hover {
    background: var(--bg-tertiary);
}

.emoji-category-btn.active {
    background: var(--bg-secondary);
}

.emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    padding: 12px;
    max-height: 200px;
    overflow-y: auto;
}

.emoji-item {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.15s ease;
}

.emoji-item:hover {
    background: var(--bg-tertiary);
}

.table-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    margin-top: 4px;
    padding: 12px;
}

.table-size-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.table-grid {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.table-row {
    display: flex;
    gap: 2px;
}

.table-cell {
    width: 16px;
    height: 16px;
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.15s ease;
}

.table-cell:hover,
.table-cell.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

.table-info {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
    text-align: center;
    min-width: 80px;
}

.code-block-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    min-width: 120px;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 4px;
}

.code-lang-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 12px;
    color: var(--text-primary);
    transition: background-color 0.15s ease;
}

.code-lang-item:hover {
    background: var(--bg-tertiary);
}

.code-lang-item:first-child {
    border-radius: 6px 6px 0 0;
}

.code-lang-item:last-child {
    border-radius: 0 0 6px 6px;
}

.preview-toolbar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px 8px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    height: 40px;
    box-sizing: border-box;
}

.preview-info {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
}

.editor-textarea {
    flex: 1;
    border: none;
    outline: none;
    padding: 16px 16px 16px 12px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-primary);
    background: var(--bg-primary);
    resize: none;
    margin: 0;
}

.editor-textarea::placeholder {
    color: var(--text-muted);
}

.preview-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
}

/* Markdown 预览样式 */
.preview-content :deep(h1) {
    font-size: 2em;
    font-weight: 700;
    margin: 0 0 16px 0;
    color: var(--text-primary);
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 8px;
}

.preview-content :deep(h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin: 24px 0 12px 0;
    color: var(--text-primary);
}

.preview-content :deep(h3) {
    font-size: 1.25em;
    font-weight: 600;
    margin: 20px 0 8px 0;
    color: var(--text-primary);
}

.preview-content :deep(p) {
    margin: 0 0 12px 0;
    color: var(--text-primary);
}

.preview-content :deep(ul),
.preview-content :deep(ol) {
    margin: 0 0 12px 0;
    padding-left: 24px;
}

.preview-content :deep(li) {
    margin: 4px 0;
}

.preview-content :deep(code) {
    background: var(--bg-tertiary);
    color: var(--primary-color);
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
}

.preview-content :deep(pre) {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 12px;
    margin: 12px 0;
    overflow-x: auto;
}

.preview-content :deep(pre code) {
    background: none;
    color: var(--text-primary);
    padding: 0;
}

.preview-content :deep(blockquote) {
    border-left: 4px solid var(--border-color);
    background: var(--bg-secondary);
    margin: 12px 0;
    padding: 8px 16px;
    color: var(--text-secondary);
}

.preview-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
}

.preview-content :deep(th),
.preview-content :deep(td) {
    border: 1px solid var(--border-color);
    padding: 8px 12px;
    text-align: left;
}

.preview-content :deep(th) {
    background: var(--bg-secondary);
    font-weight: 600;
}

.preview-content :deep(a) {
    color: var(--primary-color);
    text-decoration: none;
}

.preview-content :deep(a:hover) {
    text-decoration: underline;
}

.preview-content :deep(hr) {
    border: none;
    border-top: 1px solid var(--border-color);
    margin: 24px 0;
}

.preview-content :deep(strong) {
    font-weight: 600;
    color: var(--text-primary);
}

.preview-content :deep(em) {
    font-style: italic;
}

.preview-content :deep(del) {
    text-decoration: line-through;
    color: var(--text-secondary);
}

.preview-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: 1em 0;
}

.datetime-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    min-width: 200px;
    margin-top: 4px;
}

.datetime-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.15s ease;
    border-bottom: 1px solid var(--bg-tertiary);
}

.datetime-item:last-child {
    border-bottom: none;
    border-radius: 0 0 6px 6px;
}

.datetime-item:first-child {
    border-radius: 6px 6px 0 0;
}

.datetime-item:hover {
    background: var(--bg-tertiary);
}

.datetime-label {
    font-size: 12px;
    color: var(--text-primary);
    font-weight: 500;
}

.datetime-preview {
    font-size: 11px;
    color: var(--text-secondary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .editor-panes {
        flex-direction: column;
    }

    .editor-toolbar {
        flex-wrap: wrap;
        gap: 2px;
    }

    .toolbar-btn {
        width: 24px;
        height: 24px;
    }

    .pane-header {
        padding: 8px 12px;
        font-size: 12px;
    }

    .editor-textarea,
    .preview-content {
        padding: 12px;
        font-size: 13px;
    }
}

/* TOC 目录样式 */
.table-of-contents {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    max-width: 100%;
}

.toc-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
}

.toc-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.toc-list li {
    margin: 4px 0;
}

.toc-level-1 {
    margin-left: 0;
}

.toc-level-2 {
    margin-left: 16px;
}

.toc-level-3 {
    margin-left: 32px;
}

.toc-level-4 {
    margin-left: 48px;
}

.toc-level-5 {
    margin-left: 64px;
}

.toc-level-6 {
    margin-left: 80px;
}

.toc-link {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    line-height: 1.5;
    display: block;
    padding: 2px 0;
    transition: color 0.2s ease;
}

.toc-link:hover {
    color: var(--primary-color);
    text-decoration: underline;
}

.toc-empty {
    color: var(--text-tertiary);
    font-style: italic;
    text-align: center;
    padding: 20px;
}

/* 预览区域中的标题锚点样式 */
.preview-content h1,
.preview-content h2,
.preview-content h3,
.preview-content h4,
.preview-content h5,
.preview-content h6 {
    scroll-margin-top: 20px;
}

.preview-content h1:target,
.preview-content h2:target,
.preview-content h3:target,
.preview-content h4:target,
.preview-content h5:target,
.preview-content h6:target {
    background-color: var(--highlight-bg);
    padding: 4px 8px;
    margin: -4px -8px;
    border-radius: 4px;
    animation: highlight-fade 2s ease-out;
}

@keyframes highlight-fade {
    0% {
        background-color: var(--primary-color-light);
    }

    100% {
        background-color: transparent;
    }
}
</style>