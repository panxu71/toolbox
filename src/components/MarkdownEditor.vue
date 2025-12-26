<template>
    <div class="markdown-editor">
        <!-- 顶部工具栏 -->
        <div class="toolbar">
            <button class="back-btn" @click="$emit('back')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m12 19-7-7 7-7" />
                    <path d="m19 12H5" />
                </svg>
                返回
            </button>
            <h1>Markdown 编辑器</h1>
            <div class="header-actions">
                <button class="action-btn clear-btn" @click="clearContent" title="清空内容">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="m19 6-2 14H7L5 6" />
                        <path d="m10 11 4 4" />
                        <path d="m14 11-4 4" />
                    </svg>
                </button>
                <button class="action-btn download-btn" @click="exportMarkdown" title="下载 Markdown">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7,10 12,15 17,10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                </button>
                <button class="action-btn copy-btn" @click="copyContent" title="复制 Markdown">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                </button>
            </div>
        </div>

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
                                        <button v-for="category in emojiCategories" :key="category.name"
                                            @click="selectedEmojiCategory = category.name"
                                            :class="{ active: selectedEmojiCategory === category.name }"
                                            class="emoji-category-btn" :title="category.name">
                                            {{ category.icon }}
                                        </button>
                                    </div>
                                    <div class="emoji-grid">
                                        <button v-for="emoji in currentEmojis" :key="emoji.code"
                                            @click="insertEmoji(emoji.char)" class="emoji-item" :title="emoji.name">
                                            {{ emoji.char }}
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

        <!-- 消息提示 -->
        <div v-if="message" class="message" :class="messageType">
            {{ message }}
        </div>

        <!-- 隐藏的文件输入 -->
        <input ref="imageInput" type="file" accept="image/*" @change="handleImageSelect" style="display: none;">
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'

const emit = defineEmits<{ back: [] }>()

const editorRef = ref<HTMLTextAreaElement>()
const imageInput = ref<HTMLInputElement>()
const lineNumbersRef = ref<HTMLDivElement>()
const content = ref('')
const example = ref(`# 欢迎使用 Markdown 编辑器 📝

## 功能特色 ✨

- **实时预览** - 左右分屏显示，所见即所得
- **丰富工具栏** - 一键插入各种 Markdown 语法
- **图片支持** - 拖拽或粘贴图片自动转 Base64
- **表情符号** - 内置丰富的 Emoji 表情库 😊
- **代码高亮** - 支持 20+ 种编程语言
- **导出功能** - 一键下载 .md 文件
- **复制功能** - 快速复制到剪贴板
- **日期时间** - 快速插入各种时间格式

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
$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$

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

const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const showEmojiMenu = ref(false)
const selectedEmojiCategory = ref('笑脸')
const showTableMenu = ref(false)
const hoverRow = ref(1)
const hoverCol = ref(1)
const showCodeBlockMenu = ref(false)
const showDateTimeMenu = ref(false)
const enablePreview = ref(true)

// 表情数据
const emojiCategories = [
    { name: '笑脸', icon: '😀' },
    { name: '手势', icon: '👋' },
    { name: '心形', icon: '❤️' },
    { name: '动物', icon: '🐶' },
    { name: '食物', icon: '🍎' },
    { name: '工具', icon: '🧰' },
    { name: '交通', icon: '🚀' },
    { name: '符号', icon: '⭐' }
]

const emojis = {
    '笑脸': [
        { char: '😀', name: '开心', code: 'grinning' },
        { char: '😃', name: '大笑', code: 'smiley' },
        { char: '😄', name: '笑眯眯', code: 'smile' },
        { char: '😁', name: '咧嘴笑', code: 'grin' },
        { char: '😆', name: '哈哈', code: 'laughing' },
        { char: '😅', name: '汗笑', code: 'sweat_smile' },
        { char: '🤣', name: '笑哭', code: 'rofl' },
        { char: '😂', name: '喜极而泣', code: 'joy' },
        { char: '🙂', name: '微笑', code: 'slightly_smiling_face' },
        { char: '😉', name: '眨眼', code: 'wink' },
        { char: '😊', name: '害羞', code: 'blush' },
        { char: '😇', name: '天使', code: 'innocent' },
        { char: '🥰', name: '爱心眼', code: 'smiling_face_with_hearts' },
        { char: '😍', name: '花痴', code: 'heart_eyes' },
        { char: '🤩', name: '星星眼', code: 'star_struck' },
        { char: '😘', name: '飞吻', code: 'kissing_heart' },
        { char: '😋', name: '美味', code: 'yum' },
        { char: '😛', name: '吐舌', code: 'stuck_out_tongue' },
        { char: '😜', name: '眨眼吐舌', code: 'stuck_out_tongue_winking_eye' },
        { char: '🤪', name: '疯狂', code: 'zany_face' }
    ],
    '手势': [
        { char: '👋', name: '挥手', code: 'wave' },
        { char: '🤚', name: '举手', code: 'raised_back_of_hand' },
        { char: '✋', name: '停止', code: 'raised_hand' },
        { char: '👌', name: 'OK', code: 'ok_hand' },
        { char: '✌️', name: '胜利', code: 'v' },
        { char: '🤞', name: '交叉手指', code: 'crossed_fingers' },
        { char: '🤟', name: '爱你', code: 'love_you_gesture' },
        { char: '🤘', name: '摇滚', code: 'metal' },
        { char: '🤙', name: '打电话', code: 'call_me_hand' },
        { char: '👈', name: '左指', code: 'point_left' },
        { char: '👉', name: '右指', code: 'point_right' },
        { char: '👆', name: '上指', code: 'point_up_2' },
        { char: '👇', name: '下指', code: 'point_down' },
        { char: '☝️', name: '食指', code: 'point_up' },
        { char: '👍', name: '赞', code: 'thumbsup' },
        { char: '👎', name: '踩', code: 'thumbsdown' },
        { char: '✊', name: '拳头', code: 'fist' },
        { char: '👊', name: '碰拳', code: 'facepunch' },
        { char: '🤛', name: '左拳', code: 'fist_left' },
        { char: '🤜', name: '右拳', code: 'fist_right' }
    ],
    '心形': [
        { char: '❤️', name: '红心', code: 'heart' },
        { char: '🧡', name: '橙心', code: 'orange_heart' },
        { char: '💛', name: '黄心', code: 'yellow_heart' },
        { char: '💚', name: '绿心', code: 'green_heart' },
        { char: '💙', name: '蓝心', code: 'blue_heart' },
        { char: '💜', name: '紫心', code: 'purple_heart' },
        { char: '🖤', name: '黑心', code: 'black_heart' },
        { char: '🤍', name: '白心', code: 'white_heart' },
        { char: '💔', name: '破碎的心', code: 'broken_heart' },
        { char: '💕', name: '两颗心', code: 'two_hearts' },
        { char: '💞', name: '旋转的心', code: 'revolving_hearts' },
        { char: '💓', name: '心跳', code: 'heartbeat' },
        { char: '💗', name: '成长的心', code: 'heartpulse' },
        { char: '💖', name: '闪亮的心', code: 'sparkling_heart' },
        { char: '💘', name: '丘比特之箭', code: 'cupid' },
        { char: '💝', name: '心形礼物', code: 'gift_heart' }
    ],
    '动物': [
        { char: '🐶', name: '狗脸', code: 'dog' },
        { char: '🐱', name: '猫脸', code: 'cat' },
        { char: '🐭', name: '鼠脸', code: 'mouse' },
        { char: '🐹', name: '仓鼠脸', code: 'hamster' },
        { char: '🐰', name: '兔脸', code: 'rabbit' },
        { char: '🦊', name: '狐狸脸', code: 'fox_face' },
        { char: '🐻', name: '熊脸', code: 'bear' },
        { char: '🐼', name: '熊猫脸', code: 'panda_face' },
        { char: '🐨', name: '考拉', code: 'koala' },
        { char: '🐯', name: '老虎脸', code: 'tiger' },
        { char: '🦁', name: '狮子脸', code: 'lion' },
        { char: '🐮', name: '牛脸', code: 'cow' },
        { char: '🐷', name: '猪脸', code: 'pig' },
        { char: '🐸', name: '青蛙脸', code: 'frog' },
        { char: '🐵', name: '猴脸', code: 'monkey_face' },
        { char: '🙈', name: '非礼勿视', code: 'see_no_evil' },
        { char: '🙉', name: '非礼勿听', code: 'hear_no_evil' },
        { char: '🙊', name: '非礼勿言', code: 'speak_no_evil' }
    ],
    '食物': [
        { char: '🍎', name: '苹果', code: 'apple' },
        { char: '🍊', name: '橘子', code: 'tangerine' },
        { char: '🍋', name: '柠檬', code: 'lemon' },
        { char: '🍌', name: '香蕉', code: 'banana' },
        { char: '🍉', name: '西瓜', code: 'watermelon' },
        { char: '🍇', name: '葡萄', code: 'grapes' },
        { char: '🍓', name: '草莓', code: 'strawberry' },
        { char: '🍑', name: '桃子', code: 'peach' },
        { char: '🍒', name: '樱桃', code: 'cherries' },
        { char: '🥝', name: '猕猴桃', code: 'kiwi_fruit' },
        { char: '🍅', name: '番茄', code: 'tomato' },
        { char: '🍆', name: '茄子', code: 'eggplant' },
        { char: '🥑', name: '牛油果', code: 'avocado' },
        { char: '🌶️', name: '辣椒', code: 'hot_pepper' },
        { char: '🌽', name: '玉米', code: 'corn' },
        { char: '🥕', name: '胡萝卜', code: 'carrot' }
    ],
    '工具': [
        { char: '🧰', name: '工具箱', code: 'toolbox' },
        { char: '🔧', name: '扳手', code: 'wrench' },
        { char: '🔨', name: '锤子', code: 'hammer' },
        { char: '⚙️', name: '齿轮', code: 'gear' },
        { char: '🛠️', name: '锤子和扳手', code: 'hammer_and_wrench' },
        { char: '⚒️', name: '锤子和镐', code: 'hammer_and_pick' },
        { char: '🔩', name: '螺栓', code: 'nut_and_bolt' },
        { char: '⛏️', name: '镐', code: 'pick' },
        { char: '🪓', name: '斧头', code: 'axe' },
        { char: '🪚', name: '锯子', code: 'carpentry_saw' },
        { char: '🔪', name: '刀', code: 'hocho' },
        { char: '🗡️', name: '剑', code: 'dagger' },
        { char: '🛡️', name: '盾牌', code: 'shield' },
        { char: '🔫', name: '手枪', code: 'gun' },
        { char: '🏹', name: '弓箭', code: 'bow_and_arrow' },
        { char: '🎣', name: '钓鱼竿', code: 'fishing_pole_and_fish' },
        { char: '🔬', name: '显微镜', code: 'microscope' },
        { char: '🔭', name: '望远镜', code: 'telescope' },
        { char: '📡', name: '卫星天线', code: 'satellite' },
        { char: '💻', name: '笔记本电脑', code: 'computer' },
        { char: '🖥️', name: '台式电脑', code: 'desktop_computer' },
        { char: '🖨️', name: '打印机', code: 'printer' },
        { char: '⌨️', name: '键盘', code: 'keyboard' },
        { char: '🖱️', name: '鼠标', code: 'computer_mouse' },
        { char: '🖲️', name: '轨迹球', code: 'trackball' },
        { char: '💽', name: '光盘', code: 'minidisc' },
        { char: '💾', name: '软盘', code: 'floppy_disk' },
        { char: '💿', name: 'CD', code: 'cd' },
        { char: '📀', name: 'DVD', code: 'dvd' },
        { char: '🔋', name: '电池', code: 'battery' },
        { char: '🔌', name: '插头', code: 'electric_plug' },
        { char: '💡', name: '灯泡', code: 'bulb' },
        { char: '🔦', name: '手电筒', code: 'flashlight' },
        { char: '🕯️', name: '蜡烛', code: 'candle' },
        { char: '🧯', name: '灭火器', code: 'fire_extinguisher' },
        { char: '🛢️', name: '油桶', code: 'oil_drum' }
    ],
    '交通': [
        { char: '🚀', name: '火箭', code: 'rocket' },
        { char: '🛸', name: 'UFO', code: 'flying_saucer' },
        { char: '🚁', name: '直升机', code: 'helicopter' },
        { char: '🛩️', name: '小飞机', code: 'small_airplane' },
        { char: '✈️', name: '飞机', code: 'airplane' },
        { char: '🛫', name: '起飞', code: 'airplane_departure' },
        { char: '🛬', name: '降落', code: 'airplane_arrival' },
        { char: '🪂', name: '降落伞', code: 'parachute' },
        { char: '💺', name: '座椅', code: 'seat' },
        { char: '🚗', name: '汽车', code: 'car' },
        { char: '🚕', name: '出租车', code: 'taxi' },
        { char: '🚙', name: 'SUV', code: 'blue_car' },
        { char: '🚌', name: '公交车', code: 'bus' },
        { char: '🚎', name: '无轨电车', code: 'trolleybus' },
        { char: '🏎️', name: '赛车', code: 'racing_car' },
        { char: '🚓', name: '警车', code: 'police_car' },
        { char: '🚑', name: '救护车', code: 'ambulance' },
        { char: '🚒', name: '消防车', code: 'fire_engine' },
        { char: '🚐', name: '面包车', code: 'minibus' },
        { char: '🛻', name: '皮卡', code: 'pickup_truck' },
        { char: '🚚', name: '卡车', code: 'truck' },
        { char: '🚛', name: '拖车', code: 'articulated_lorry' },
        { char: '🚜', name: '拖拉机', code: 'tractor' },
        { char: '🏍️', name: '摩托车', code: 'motorcycle' },
        { char: '🛵', name: '踏板车', code: 'motor_scooter' },
        { char: '🚲', name: '自行车', code: 'bike' },
        { char: '🛴', name: '滑板车', code: 'kick_scooter' },
        { char: '🛹', name: '滑板', code: 'skateboard' },
        { char: '🛼', name: '旱冰鞋', code: 'roller_skate' },
        { char: '🚄', name: '高铁', code: 'bullettrain_side' },
        { char: '🚅', name: '子弹头列车', code: 'bullettrain_front' },
        { char: '🚈', name: '轻轨', code: 'light_rail' },
        { char: '🚝', name: '单轨', code: 'monorail' },
        { char: '🚞', name: '山地铁路', code: 'mountain_railway' },
        { char: '🚋', name: '有轨电车', code: 'train' },
        { char: '🚃', name: '火车车厢', code: 'railway_car' },
        { char: '🚂', name: '蒸汽火车', code: 'steam_locomotive' },
        { char: '🚆', name: '火车', code: 'train2' },
        { char: '🚇', name: '地铁', code: 'metro' },
        { char: '🚊', name: '电车', code: 'tram' },
        { char: '🚉', name: '车站', code: 'station' },
        { char: '⛽', name: '加油站', code: 'fuelpump' },
        { char: '🛣️', name: '高速公路', code: 'motorway' },
        { char: '🛤️', name: '铁轨', code: 'railway_track' },
        { char: '🛳️', name: '客轮', code: 'passenger_ship' },
        { char: '⛴️', name: '渡轮', code: 'ferry' },
        { char: '🛥️', name: '快艇', code: 'motor_boat' },
        { char: '🚤', name: '快艇', code: 'speedboat' },
        { char: '⛵', name: '帆船', code: 'boat' },
        { char: '🛶', name: '独木舟', code: 'canoe' },
        { char: '🚁', name: '直升机', code: 'helicopter' }
    ],
    '符号': [
        { char: '⭐', name: '星星', code: 'star' },
        { char: '🌟', name: '闪亮星星', code: 'star2' },
        { char: '✨', name: '闪光', code: 'sparkles' },
        { char: '⚡', name: '闪电', code: 'zap' },
        { char: '💥', name: '爆炸', code: 'boom' },
        { char: '🔥', name: '火', code: 'fire' },
        { char: '🌈', name: '彩虹', code: 'rainbow' },
        { char: '☀️', name: '太阳', code: 'sunny' },
        { char: '⛅', name: '多云', code: 'partly_sunny' },
        { char: '☁️', name: '云', code: 'cloud' },
        { char: '🌙', name: '月亮', code: 'crescent_moon' },
        { char: '⚠️', name: '警告', code: 'warning' },
        { char: '🚫', name: '禁止', code: 'no_entry_sign' },
        { char: '✅', name: '勾选', code: 'white_check_mark' },
        { char: '❌', name: '叉号', code: 'x' },
        { char: '🔴', name: '红圆', code: 'red_circle' },
        { char: '🟠', name: '橙圆', code: 'orange_circle' },
        { char: '🟡', name: '黄圆', code: 'yellow_circle' },
        { char: '🟢', name: '绿圆', code: 'green_circle' },
        { char: '🔵', name: '蓝圆', code: 'blue_circle' },
        { char: '🟣', name: '紫圆', code: 'purple_circle' },
        { char: '⚫', name: '黑圆', code: 'black_circle' },
        { char: '⚪', name: '白圆', code: 'white_circle' },
        { char: '🟤', name: '棕圆', code: 'brown_circle' },
        { char: '🔶', name: '橙菱形', code: 'large_orange_diamond' },
        { char: '🔷', name: '蓝菱形', code: 'large_blue_diamond' },
        { char: '🔸', name: '小橙菱形', code: 'small_orange_diamond' },
        { char: '🔹', name: '小蓝菱形', code: 'small_blue_diamond' },
        { char: '🔺', name: '红三角', code: 'small_red_triangle' },
        { char: '🔻', name: '红倒三角', code: 'small_red_triangle_down' },
        { char: '💠', name: '钻石', code: 'diamond_shape_with_a_dot_inside' },
        { char: '🔘', name: '单选按钮', code: 'radio_button' },
        { char: '🔳', name: '白方块', code: 'white_square_button' },
        { char: '🔲', name: '黑方块', code: 'black_square_button' },
        { char: '▪️', name: '小黑方块', code: 'black_small_square' },
        { char: '▫️', name: '小白方块', code: 'white_small_square' },
        { char: '◾', name: '中黑方块', code: 'black_medium_small_square' },
        { char: '◽', name: '中白方块', code: 'white_medium_small_square' },
        { char: '◼️', name: '大黑方块', code: 'black_medium_square' },
        { char: '◻️', name: '大白方块', code: 'white_medium_square' },
        { char: '⬛', name: '黑大方块', code: 'black_large_square' },
        { char: '⬜', name: '白大方块', code: 'white_large_square' },
        { char: '🟥', name: '红方块', code: 'red_square' },
        { char: '🟧', name: '橙方块', code: 'orange_square' },
        { char: '🟨', name: '黄方块', code: 'yellow_square' },
        { char: '🟩', name: '绿方块', code: 'green_square' },
        { char: '🟦', name: '蓝方块', code: 'blue_square' },
        { char: '🟪', name: '紫方块', code: 'purple_square' },
        { char: '🟫', name: '棕方块', code: 'brown_square' },
        { char: '➡️', name: '右箭头', code: 'arrow_right' },
        { char: '⬅️', name: '左箭头', code: 'arrow_left' },
        { char: '⬆️', name: '上箭头', code: 'arrow_up' },
        { char: '⬇️', name: '下箭头', code: 'arrow_down' },
        { char: '↗️', name: '右上箭头', code: 'arrow_upper_right' },
        { char: '↘️', name: '右下箭头', code: 'arrow_lower_right' },
        { char: '↙️', name: '左下箭头', code: 'arrow_lower_left' },
        { char: '↖️', name: '左上箭头', code: 'arrow_upper_left' },
        { char: '↕️', name: '上下箭头', code: 'arrow_up_down' },
        { char: '↔️', name: '左右箭头', code: 'left_right_arrow' },
        { char: '↩️', name: '右弯箭头', code: 'leftwards_arrow_with_hook' },
        { char: '↪️', name: '左弯箭头', code: 'arrow_right_hook' },
        { char: '⤴️', name: '右上弯箭头', code: 'arrow_heading_up' },
        { char: '⤵️', name: '右下弯箭头', code: 'arrow_heading_down' },
        { char: '🔄', name: '刷新', code: 'arrows_counterclockwise' },
        { char: '🔃', name: '顺时针箭头', code: 'arrows_clockwise' },
        { char: '🔀', name: '随机播放', code: 'twisted_rightwards_arrows' },
        { char: '🔁', name: '重复', code: 'repeat' },
        { char: '🔂', name: '单曲循环', code: 'repeat_one' },
        { char: '▶️', name: '播放', code: 'arrow_forward' },
        { char: '⏸️', name: '暂停', code: 'pause_button' },
        { char: '⏹️', name: '停止', code: 'stop_button' },
        { char: '⏺️', name: '录制', code: 'record_button' },
        { char: '⏭️', name: '下一首', code: 'next_track_button' },
        { char: '⏮️', name: '上一首', code: 'previous_track_button' },
        { char: '⏩', name: '快进', code: 'fast_forward' },
        { char: '⏪', name: '快退', code: 'rewind' },
        { char: '⏫', name: '快速向上', code: 'arrow_double_up' },
        { char: '⏬', name: '快速向下', code: 'arrow_double_down' },
        { char: '◀️', name: '向左', code: 'arrow_backward' },
        { char: '🔼', name: '向上小三角', code: 'arrow_up_small' },
        { char: '🔽', name: '向下小三角', code: 'arrow_down_small' },
        { char: '⏏️', name: '弹出', code: 'eject_button' },
        { char: '🎵', name: '音符', code: 'musical_note' },
        { char: '🎶', name: '音乐', code: 'notes' },
        { char: '➕', name: '加号', code: 'heavy_plus_sign' },
        { char: '➖', name: '减号', code: 'heavy_minus_sign' },
        { char: '➗', name: '除号', code: 'heavy_division_sign' },
        { char: '✖️', name: '乘号', code: 'heavy_multiplication_x' },
        { char: '🟰', name: '等号', code: 'heavy_equals_sign' },
        { char: '♾️', name: '无穷', code: 'infinity' },
        { char: '‼️', name: '双感叹号', code: 'bangbang' },
        { char: '⁉️', name: '感叹问号', code: 'interrobang' },
        { char: '❓', name: '问号', code: 'question' },
        { char: '❔', name: '白问号', code: 'grey_question' },
        { char: '❕', name: '白感叹号', code: 'grey_exclamation' },
        { char: '❗', name: '感叹号', code: 'exclamation' },
        { char: '〰️', name: '波浪线', code: 'wavy_dash' },
        { char: '💱', name: '货币兑换', code: 'currency_exchange' },
        { char: '💲', name: '美元', code: 'heavy_dollar_sign' },
        { char: '⚕️', name: '医疗', code: 'medical_symbol' },
        { char: '♻️', name: '回收', code: 'recycle' },
        { char: '⚜️', name: '百合花', code: 'fleur_de_lis' },
        { char: '🔱', name: '三叉戟', code: 'trident' },
        { char: '📛', name: '姓名牌', code: 'name_badge' },
        { char: '🔰', name: '新手标志', code: 'beginner' },
        { char: '⭕', name: '红圈', code: 'o' },
        { char: '✅', name: '勾选标记', code: 'white_check_mark' },
        { char: '☑️', name: '勾选框', code: 'ballot_box_with_check' },
        { char: '✔️', name: '勾号', code: 'heavy_check_mark' },
        { char: '❌', name: '叉号', code: 'x' },
        { char: '❎', name: '叉号按钮', code: 'negative_squared_cross_mark' },
        { char: '➰', name: '卷曲环', code: 'curly_loop' },
        { char: '➿', name: '双卷曲环', code: 'loop' },
        { char: '〽️', name: '部分交替标记', code: 'part_alternation_mark' },
        { char: '✳️', name: '八角星', code: 'eight_spoked_asterisk' },
        { char: '✴️', name: '八角黑星', code: 'eight_pointed_black_star' },
        { char: '❇️', name: '闪光', code: 'sparkle' },
        { char: '©️', name: '版权', code: 'copyright' },
        { char: '®️', name: '注册商标', code: 'registered' },
        { char: '™️', name: '商标', code: 'tm' }
    ]
}

const currentEmojis = computed(() => {
    return emojis[selectedEmojiCategory.value as keyof typeof emojis] || []
})

const previewHtml = computed(() => {
    try {
        return marked(content.value)
    } catch (error) {
        return '<p>预览解析错误</p>'
    }
})

function showMessage(text: string, type: 'success' | 'error' = 'success') {
    message.value = text
    messageType.value = type
    setTimeout(() => message.value = '', 2000)
}

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
    showMessage(enablePreview.value ? '预览已开启' : '预览已关闭')
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
    showMessage(`已插入${type === 'date' ? '日期' : type === 'time' ? '时间' : type === 'datetime' ? '日期时间' : type === 'iso' ? 'ISO格式' : '时间戳'}`)
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

// 添加全局点击监听
document.addEventListener('click', handleClickOutside)

// 组件挂载时初始化行号
onMounted(() => {
    updateLineNumbers()
})

function insertSampleData() {
    content.value = example.value
    showMessage('示例数据已插入')
}

function clearContent() {
    content.value = ''
    showMessage('内容已清空')
}

function exportMarkdown() {
    const blob = new Blob([content.value], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `markdown-${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
    showMessage('文件已导出')
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(content.value)
        showMessage('内容已复制到剪贴板')
    } catch {
        showMessage('复制失败', 'error')
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
        showMessage('请选择图片文件', 'error')
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        const base64 = e.target?.result as string
        const fileName = file.name.replace(/\.[^/.]+$/, '') // 去掉扩展名
        const imageMarkdown = `![${fileName}](${base64})`
        insertText(imageMarkdown)
        showMessage('图片已插入')
    }
    reader.onerror = () => {
        showMessage('图片读取失败', 'error')
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
</script>
<style scoped>
.markdown-editor {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: #ffffff;
    display: flex;
    flex-direction: column;
}

.toolbar {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    gap: 16px;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}

.back-btn:hover {
    background: #f3f4f6;
    color: #374151;
    border-color: #d1d5db;
}

.toolbar h1 {
    margin: 0;
    flex: 1;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
}

.header-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.action-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.action-btn:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.action-btn svg {
    transition: all 0.2s ease;
}

.action-btn:hover svg {
    transform: scale(1.05);
}

/* 清空按钮 - 红色主题 */
.clear-btn:hover {
    background: #fef2f2;
    border-color: #fecaca;
    color: #dc2626;
}

.clear-btn:hover svg {
    color: #dc2626;
}

/* 下载按钮 - 绿色主题 */
.download-btn:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    color: #16a34a;
}

.download-btn:hover svg {
    color: #16a34a;
}

/* 复制按钮 - 蓝色主题 */
.copy-btn:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #2563eb;
}

.copy-btn:hover svg {
    color: #2563eb;
}

.editor-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    background: #ffffff;
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
    background: #f9fafb;
    border-right: 1px solid #e5e7eb;
    color: #9ca3af;
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
    border-left: 1px solid #e5e7eb;
}

.pane-header {
    padding: 8px 16px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 16px;
}

.pane-header>span {
    text-transform: uppercase;
}

.pane-actions {
    margin-left: auto;
}

.sample-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 11px;
    font-weight: 500;
}

.sample-btn:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #2563eb;
}

.sample-btn:hover svg {
    color: #2563eb;
}

.editor-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 8px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    height: 40px;
    box-sizing: border-box;
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
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 11px;
    font-weight: 600;
}

.toolbar-btn:hover {
    background: #f3f4f6;
    color: #374151;
}

.toolbar-btn:active {
    background: #e5e7eb;
    transform: scale(0.95);
}

.toolbar-divider {
    width: 1px;
    height: 20px;
    background: #e5e7eb;
    margin: 0 4px;
}

.emoji-wrapper {
    position: relative;
}

.table-wrapper {
    position: relative;
}

.code-block-wrapper {
    position: relative;
}

.datetime-wrapper {
    position: relative;
}

.toolbar-btn.active {
    background: #e5e7eb;
    color: #374151;
}

.toolbar-btn.preview-toggle.active {
    background: #dbeafe;
    color: #2563eb;
}

.toolbar-btn.preview-toggle:hover {
    background: #f3f4f6;
    color: #2563eb;
}

.toolbar-btn.sample-data-btn {
    background: #f0f9ff;
    border: 1px solid #bae6fd;
    color: #0369a1;
}

.toolbar-btn.sample-data-btn:hover {
    background: #e0f2fe;
    border-color: #7dd3fc;
    color: #0c4a6e;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(3, 105, 161, 0.2);
}

.emoji-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    margin-top: 4px;
    width: 280px;
}

.emoji-categories {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
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
    background: #f3f4f6;
}

.emoji-category-btn.active {
    background: #e5e7eb;
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
    background: #f3f4f6;
}

.table-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.15s ease;
}

.table-cell:hover,
.table-cell.active {
    background: #3b82f6;
    border-color: #2563eb;
}

.table-info {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    text-align: center;
    min-width: 80px;
}

.code-block-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    color: #374151;
    transition: background-color 0.15s ease;
}

.code-lang-item:hover {
    background: #f3f4f6;
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
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    height: 40px;
    box-sizing: border-box;
}

.preview-info {
    font-size: 11px;
    color: #9ca3af;
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
    color: #374151;
    background: #ffffff;
    resize: none;
    margin: 0;
}

.editor-textarea::placeholder {
    color: #9ca3af;
}

.preview-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background: #ffffff;
    color: #374151;
    line-height: 1.6;
}

/* Markdown 预览样式 */
.preview-content :deep(h1) {
    font-size: 2em;
    font-weight: 700;
    margin: 0 0 16px 0;
    color: #111827;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 8px;
}

.preview-content :deep(h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin: 24px 0 12px 0;
    color: #111827;
}

.preview-content :deep(h3) {
    font-size: 1.25em;
    font-weight: 600;
    margin: 20px 0 8px 0;
    color: #111827;
}

.preview-content :deep(p) {
    margin: 0 0 12px 0;
    color: #374151;
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
    background: #f3f4f6;
    color: #dc2626;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.9em;
}

.preview-content :deep(pre) {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 12px;
    margin: 12px 0;
    overflow-x: auto;
}

.preview-content :deep(pre code) {
    background: none;
    color: #374151;
    padding: 0;
}

.preview-content :deep(blockquote) {
    border-left: 4px solid #e5e7eb;
    background: #f9fafb;
    margin: 12px 0;
    padding: 8px 16px;
    color: #6b7280;
}

.preview-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
}

.preview-content :deep(th),
.preview-content :deep(td) {
    border: 1px solid #e5e7eb;
    padding: 8px 12px;
    text-align: left;
}

.preview-content :deep(th) {
    background: #f9fafb;
    font-weight: 600;
}

.preview-content :deep(a) {
    color: #2563eb;
    text-decoration: none;
}

.preview-content :deep(a:hover) {
    text-decoration: underline;
}

.preview-content :deep(hr) {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 24px 0;
}

.preview-content :deep(strong) {
    font-weight: 600;
    color: #111827;
}

.preview-content :deep(em) {
    font-style: italic;
}

.preview-content :deep(del) {
    text-decoration: line-through;
    color: #6b7280;
}

.message {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 16px;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.message.success {
    background: #10b981;
}

.message.error {
    background: #ef4444;
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

.datetime-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    border-bottom: 1px solid #f3f4f6;
}

.datetime-item:last-child {
    border-bottom: none;
    border-radius: 0 0 6px 6px;
}

.datetime-item:first-child {
    border-radius: 6px 6px 0 0;
}

.datetime-item:hover {
    background: #f3f4f6;
}

.datetime-label {
    font-size: 12px;
    color: #374151;
    font-weight: 500;
}

.datetime-preview {
    font-size: 11px;
    color: #6b7280;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}
</style>