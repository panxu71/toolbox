# Toolbox 项目架构文档

> 📅 最后更新：2026-01-16  
> 📌 版本：v2.1.0  
> 🎯 目的：快速理解项目结构，便于功能开发和维护

---

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [核心架构](#核心架构)
5. [构建系统](#构建系统)
6. [组件系统](#组件系统)
7. [配置系统](#配置系统)
8. [开发代理](#开发代理)
9. [新增功能指南](#新增功能指南)
10. [常见问题](#常见问题)

---

## 项目概述

**Toolbox** 是一个多功能在线工具箱，支持三种部署模式：
- 🌐 **Web 版本**：部署到 GitHub Pages / Netlify / Cloudflare Pages
- 🔌 **Chrome 扩展**：作为浏览器扩展使用
- 💻 **独立应用**：本地运行的独立版本

### 核心特性
- ✅ 50+ 实用工具（JSON、时间、加密、转换、查询等）
- ✅ 响应式设计，支持移动端
- ✅ 深色/浅色主题切换
- ✅ 无需后端，纯前端实现
- ✅ 支持离线使用（Chrome 扩展）

---

## 技术栈

### 核心框架
- **Vue 3.5** - 渐进式 JavaScript 框架
- **TypeScript 5.9** - 类型安全
- **Vite 7.2** - 快速构建工具

### 主要依赖
```json
{
  "vue": "^3.5.24",           // 核心框架
  "typescript": "~5.9.3",     // 类型系统
  "vite": "^7.2.4",           // 构建工具
  
  // 功能库
  "crypto-js": "^4.2.0",      // 加密功能
  "marked": "^17.0.1",        // Markdown 解析
  "qrcode": "^1.5.4",         // 二维码生成
  "xlsx": "^0.18.5",          // Excel 处理
  "opencc-js": "^1.0.5",      // 简繁体转换
  "codemirror": "^6.0.2",     // 代码编辑器
  "highlight.js": "^11.11.1", // 代码高亮
  "prettier": "^3.7.4",       // 代码格式化
  "js-beautify": "^1.15.4",   // JS/HTML 美化
  "diff": "^8.0.2",           // 文本对比
  "lunar-javascript": "^1.7.7" // 农历转换
}
```

---

## 项目结构

```
toolbox/
├── src/                          # 源代码目录
│   ├── components/               # Vue 组件
│   │   ├── common/              # 公共组件
│   │   │   ├── PageHeader.vue   # 页面头部
│   │   │   ├── HeaderActionButton.vue  # 头部按钮
│   │   │   ├── SearchSection.vue       # 搜索区域
│   │   │   ├── Modal.vue               # 模态框
│   │   │   ├── ScrollToTop.vue         # 回到顶部
│   │   │   └── NotificationContainer.vue # 通知容器
│   │   ├── JsonFormatter.vue    # JSON 格式化
│   │   ├── IpLookup.vue         # IP 查询
│   │   ├── CountriesCapitals.vue # 国家首都查询
│   │   └── ...                  # 其他 50+ 工具组件
│   ├── composables/             # 组合式函数（Hooks）
│   │   ├── useTheme.ts          # 主题管理
│   │   ├── useNotification.ts   # 通知系统
│   │   ├── useClipboard.ts      # 剪贴板操作
│   │   ├── usePageTitle.ts      # 页面标题
│   │   ├── useScrollToTop.ts    # 滚动到顶部
│   │   └── ...
│   ├── config/                  # 配置文件
│   │   ├── cards.json           # 工具卡片配置
│   │   ├── navigation.json      # 导航配置
│   │   └── surnames.json        # 百家姓数据
│   ├── styles/                  # 样式文件
│   │   └── common.css           # 公共样式
│   ├── types/                   # TypeScript 类型定义
│   ├── App.vue                  # 根组件
│   ├── main.ts                  # Web 版入口
│   ├── popup.ts                 # 扩展弹窗入口
│   ├── background.ts            # 扩展后台脚本
│   └── content.ts               # 扩展内容脚本
├── docs/                        # Web 版构建输出（GitHub Pages）
├── dist/                        # Chrome 扩展构建输出
├── toolbox-proxy/               # 独立的代理服务项目（Vercel/Deno）
├── scripts/                     # 构建脚本
│   └── update-version.cjs       # 版本同步脚本
├── vite.config.ts               # Vite 配置
├── manifest.json                # Chrome 扩展清单
├── package.json                 # 项目配置
└── README.md                    # 项目说明

```

---

## 核心架构

### 1. 路由系统（无路由库）

项目**不使用** Vue Router，而是通过 **URL 参数 + 组件状态** 实现路由：

```typescript
// URL 格式
https://toolbox.panxu.net/?category=json&tool=json-format

// 状态管理
const activeNav = ref('json')        // 当前分类
const currentPage = ref<string | null>(null)  // 当前工具页面

// URL 参数处理
const handleUrlParams = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const tool = urlParams.get('tool')
  const category = urlParams.get('category')
  
  if (tool) {
    const toolAction = getToolAction(tool)
    if (toolAction) {
      if (category) activeNav.value = category
      executeFunction(toolAction)
    }
  }
}
```

### 2. 组件加载策略

**同步导入**（不使用代码分割）：
```typescript
// src/App.vue
import JsonFormatter from './components/JsonFormatter.vue'
import IpLookup from './components/IpLookup.vue'
// ... 所有组件直接导入
```

**原因**：
- 工具箱应用体积可控
- 避免首次加载时的延迟
- 简化构建配置

### 3. 页面切换逻辑

```typescript
// 打开工具页面
const openPage = (pageName: string) => {
  currentPage.value = pageName
  const toolId = getToolIdByPageName(pageName)
  if (toolId) updateUrl(activeNav.value, toolId)
}

// 关闭工具页面
const closePage = () => {
  currentPage.value = null
  updateUrl(activeNav.value)
}

// 模板渲染
<template>
  <div v-if="!currentPage">
    <!-- 显示工具卡片网格 -->
    <CardGrid />
  </div>
  <div v-else>
    <!-- 显示具体工具组件 -->
    <JsonFormatter v-if="currentPage === 'json-formatter'" />
    <IpLookup v-if="currentPage === 'ip-lookup'" />
  </div>
</template>
```

---

## 构建系统

### 构建目标

通过环境变量 `BUILD_TARGET` 控制：

```bash
# Web 版本（默认）
npm run web
# 输出到: docs/

# Chrome 扩展
npm run ext
# 输出到: dist/

# 独立应用
npm run standalone
# 输出到: dist/standalone/
```

### 构建配置差异

| 特性 | Web 版 | Chrome 扩展 | 独立应用 |
|------|--------|-------------|----------|
| 输出目录 | `docs/` | `dist/` | `dist/standalone/` |
| Base Path | `./` | `/` | `./` |
| 入口文件 | `index.html` | `index.html` + `popup.html` | `index.html` |
| 额外文件 | 保留 `CNAME` | 复制 `manifest.json` + 图标 | - |
| 文件名 | 带 hash | 不带 hash | 带 hash |

### Vite 配置关键点

```typescript
// vite.config.ts
export default defineConfig({
  base: isExtensionBuild ? '/' : './',
  build: {
    outDir: getOutDir(),
    emptyOutDir: false,  // 手动控制清空逻辑
    rollupOptions: {
      input: isExtensionBuild ? {
        main: 'index.html',
        popup: 'popup.html',
        background: 'src/background.ts',
        content: 'src/content.ts'
      } : {
        main: 'index.html'
      }
    }
  }
})
```

### 版本管理

```bash
# 同步版本号（package.json → manifest.json → README.md）
npm run update-version

# 打包扩展（自动更新版本）
npm run pack:ext
# 输出: dist/toolbox-extension-v2.1.0.zip

# 打包 Web 版
npm run pack:web
# 输出: dist/toolbox-web-v2.1.0.zip
```

---

## 组件系统

### 公共组件库

位于 `src/components/common/`，所有工具页面都应使用：

#### 1. PageHeader（页面头部）
```vue
<PageHeader 
  :title="pageTitle"
  :show-back="true"
  @back="handleBack"
/>
```

#### 2. HeaderActionButton（头部操作按钮）
```vue
<HeaderActionButton 
  icon="📋"
  text="复制"
  @click="handleCopy"
/>
```

#### 3. SearchSection（搜索区域）
```vue
<SearchSection 
  v-model="searchQuery"
  placeholder="搜索国家或首都..."
/>
```

#### 4. Modal（模态框）
```vue
<Modal 
  :show="showModal"
  :title="modalTitle"
  @close="showModal = false"
>
  <template #default>
    <!-- 模态框内容 -->
  </template>
</Modal>
```

#### 5. ScrollToTop（回到顶部）
```vue
<ScrollToTop />
```

#### 6. NotificationContainer（通知容器）
```vue
<NotificationContainer />
```

### Composables（组合式函数）

#### useNotification（通知系统）
```typescript
import { useNotification } from '@/composables/useNotification'

const { showNotification } = useNotification()

showNotification('操作成功', 'success')
showNotification('操作失败', 'error')
showNotification('提示信息', 'info')
```

#### usePageTitle（页面标题）
```typescript
import { usePageTitle } from '@/composables/usePageTitle'

// 从 cards.json 动态获取标题
usePageTitle('json-format')
```

#### useClipboard（剪贴板）
```typescript
import { useClipboard } from '@/composables/useClipboard'

const { copyToClipboard } = useClipboard()

await copyToClipboard('要复制的文本')
```

#### useScrollToTop（滚动到顶部）
```typescript
import { useScrollToTop } from '@/composables/useScrollToTop'

const { showButton, scrollToTop } = useScrollToTop()
```

---

## 配置系统

### 1. cards.json（工具卡片配置）

定义所有工具的元数据：

```json
{
  "cards": {
    "json": [
      {
        "id": "json-format",
        "title": "JSON格式化",
        "description": "美化和格式化JSON数据",
        "icon": "📋",
        "action": "formatJson",
        "color": "#10b981",
        "badge": {
          "text": "热门",
          "color": "#ef4444"
        }
      }
    ]
  }
}
```

**字段说明**：
- `id`: 工具唯一标识（用于 URL 参数）
- `title`: 显示标题
- `description`: 工具描述
- `icon`: Emoji 图标
- `action`: 对应的 action 名称（在 App.vue 中处理）
- `color`: 卡片颜色
- `badge`: 可选徽章（热门、新功能等）

### 2. navigation.json（导航配置）

定义左侧导航分类：

```json
{
  "navigation": [
    {
      "id": "json",
      "name": "JSON工具",
      "icon": "📋",
      "color": "#10b981"
    },
    {
      "id": "time",
      "name": "时间工具",
      "icon": "🕐",
      "color": "#06b6d4"
    }
  ]
}
```

---

## 开发代理

### Vite 开发代理配置

用于解决开发环境的 CORS 问题：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api/ip-me': {
      target: 'https://ip.me',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/ip-me/, '')
    },
    '/api/cip-cc': {
      target: 'https://cip.cc',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/cip-cc/, '/')
    }
    // ... 更多代理配置
  }
}
```

### 生产环境代理

**问题**：生产环境无法使用 Vite 代理

**解决方案**：
1. **使用支持 CORS 的 API**（推荐）
   - GeoJS: `https://get.geojs.io/v1/ip/geo.json`
   - IPapi.co: `https://ipapi.co/json/`
   - IP-API: `http://ip-api.com/json/`

2. **使用 Cloudflare Workers 代理**
   ```typescript
   const PROXY_API_URL = 'https://api.panxu71.workers.dev'
   
   const response = await fetch(`${PROXY_API_URL}?url=${encodeURIComponent(targetUrl)}`)
   const data = await response.json()
   const html = data.content  // Cloudflare Workers 返回格式
   ```

3. **独立代理项目**（可选）
   - 位置：`toolbox-proxy/`
   - 部署到：Vercel / Deno Deploy / Cloudflare Workers
   - 用途：为不支持 CORS 的 API 提供代理

---

## 新增功能指南

### 步骤 1：创建组件

在 `src/components/` 创建新组件：

```vue
<!-- src/components/MyNewTool.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import PageHeader from './common/PageHeader.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { useNotification } from '@/composables/useNotification'
import cardsConfig from '@/config/cards.json'

// 动态设置页面标题
usePageTitle('my-new-tool')

const { showNotification } = useNotification()

// 组件逻辑
const inputValue = ref('')

const handleProcess = () => {
  // 处理逻辑
  showNotification('处理成功', 'success')
}
</script>

<template>
  <div class="tool-container">
    <PageHeader 
      :title="cardsConfig.cards.query.find(c => c.id === 'my-new-tool')?.title || '新工具'"
      :show-back="true"
    />
    
    <div class="content-wrapper">
      <!-- 工具内容 -->
    </div>
  </div>
</template>

<style scoped>
.tool-container {
  min-height: 100vh;
  background: var(--bg-primary);
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
```

### 步骤 2：注册到 cards.json

```json
{
  "cards": {
    "query": [
      {
        "id": "my-new-tool",
        "title": "我的新工具",
        "description": "工具描述",
        "icon": "🔧",
        "action": "myNewTool",
        "color": "#10b981",
        "badge": {
          "text": "新功能",
          "color": "#10b981"
        }
      }
    ]
  }
}
```

### 步骤 3：在 App.vue 中导入和注册

```typescript
// 1. 导入组件
import MyNewTool from './components/MyNewTool.vue'

// 2. 添加到 pageToolMap
const getToolIdByPageName = (pageName: string): string | null => {
  const pageToolMap: Record<string, string> = {
    // ... 现有映射
    'my-new-tool': 'my-new-tool'
  }
  return pageToolMap[pageName] || null
}

// 3. 添加到 toolActionMap
const getToolAction = (toolId: string): string | null => {
  const toolActionMap: Record<string, string> = {
    // ... 现有映射
    'my-new-tool': 'myNewTool'
  }
  return toolActionMap[toolId] || null
}

// 4. 添加到 executeFunction
const executeFunction = async (action: string) => {
  switch (action) {
    // ... 现有 case
    case 'myNewTool':
      openPage('my-new-tool')
      return
  }
}

// 5. 添加到模板
<template>
  <div v-else>
    <!-- 现有组件 -->
    <MyNewTool v-if="currentPage === 'my-new-tool'" />
  </div>
</template>
```

### 步骤 4：测试

```bash
# 开发环境测试
npm run dev

# 访问 URL
http://localhost:5173/?category=query&tool=my-new-tool

# 构建测试
npm run web
```

---

## 常见问题

### Q1: 如何添加新的导航分类？

**A**: 修改 `src/config/navigation.json`：

```json
{
  "navigation": [
    {
      "id": "my-category",
      "name": "我的分类",
      "icon": "🎯",
      "color": "#10b981"
    }
  ]
}
```

然后在 `cards.json` 中添加对应的 `my-category` 键。

### Q2: 如何处理 CORS 问题？

**A**: 三种方案：
1. **优先使用支持 CORS 的 API**（推荐）
2. **开发环境**：在 `vite.config.ts` 添加代理配置
3. **生产环境**：使用 Cloudflare Workers / Deno Deploy 代理

### Q3: 如何修改主题颜色？

**A**: 修改 `src/styles/common.css` 中的 CSS 变量：

```css
:root {
  --primary-color: #10b981;
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
}

[data-theme="dark"] {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
}
```

### Q4: 如何添加新的 Composable？

**A**: 在 `src/composables/` 创建新文件：

```typescript
// src/composables/useMyFeature.ts
import { ref } from 'vue'

export function useMyFeature() {
  const state = ref(false)
  
  const toggle = () => {
    state.value = !state.value
  }
  
  return {
    state,
    toggle
  }
}
```

然后在组件中使用：
```typescript
import { useMyFeature } from '@/composables/useMyFeature'

const { state, toggle } = useMyFeature()
```

### Q5: 如何调试 Chrome 扩展？

**A**:
```bash
# 1. 构建扩展
npm run ext

# 2. 打开 Chrome 扩展管理页面
chrome://extensions/

# 3. 开启"开发者模式"

# 4. 点击"加载已解压的扩展程序"，选择 dist/ 目录

# 5. 修改代码后重新构建并刷新扩展
```

### Q6: 版本号在哪里管理？

**A**: 版本号统一在 `package.json` 中管理：

```bash
# 手动修改 package.json 中的 version 字段
"version": "2.1.0"

# 运行同步脚本
npm run update-version

# 这会自动更新：
# - manifest.json
# - README.md 中的版本徽章
```

### Q7: 如何添加新的 IP 查询源？

**A**: 修改 `src/components/IpLookup.vue`：

```typescript
// 1. 添加到 apiSources 数组
const apiSources = [
  {
    id: 'my-source',
    name: 'My IP Source',
    description: '我的IP源',
    fetcher: apiFetchers.fetchMySourceData
  }
]

// 2. 实现 fetcher 函数
const apiFetchers = {
  fetchMySourceData: async (): Promise<IpInfo> => {
    const response = await fetch('https://my-api.com/ip')
    const data = await response.json()
    
    return {
      ip: data.ip,
      country: data.country,
      city: data.city,
      location: `${data.city} ${data.country}`,
      source: 'My IP Source'
    }
  }
}
```

---

## 项目特点总结

### ✅ 优点
1. **无路由库**：简化依赖，URL 参数驱动
2. **同步加载**：无代码分割，首屏快速
3. **配置驱动**：JSON 配置，易于扩展
4. **组件复用**：公共组件库，统一风格
5. **类型安全**：TypeScript 全覆盖
6. **多端支持**：Web + Chrome 扩展 + 独立应用

### ⚠️ 注意事项
1. **不使用 Vue Router**：所有路由逻辑在 App.vue 中
2. **不使用 Vuex/Pinia**：状态管理用 ref/reactive
3. **不使用代码分割**：所有组件同步导入
4. **CORS 问题**：生产环境需要代理或使用支持 CORS 的 API
5. **版本同步**：修改版本号后需运行 `npm run update-version`

---

## 快速参考

### 常用命令
```bash
npm run dev              # 开发服务器
npm run web              # 构建 Web 版
npm run ext              # 构建扩展
npm run pack:ext         # 打包扩展为 zip
npm run update-version   # 同步版本号
npm run type-check       # TypeScript 检查
```

### 关键文件
- `src/App.vue` - 路由和页面切换逻辑
- `src/config/cards.json` - 工具配置
- `src/config/navigation.json` - 导航配置
- `vite.config.ts` - 构建配置
- `manifest.json` - Chrome 扩展配置

### 目录约定
- `src/components/` - 工具组件
- `src/components/common/` - 公共组件
- `src/composables/` - 组合式函数
- `src/config/` - 配置文件
- `src/styles/` - 全局样式

---

## 更新日志

### v2.1.0 (2026-01-16)
- ✅ 移除 Vercel 依赖，独立代理项目
- ✅ 优化 IP 查询功能，使用 Cloudflare Workers 代理
- ✅ 完善项目架构文档

### v2.0.0 (2026-01-13)
- ✅ 新增国家首都查询工具
- ✅ 新增 IP 地址查询工具
- ✅ 新增 Emoji 符号大全
- ✅ 新增屏幕测试工具
- ✅ 优化版本管理系统

---

**📝 文档维护**：每次重大功能更新时，请同步更新此文档。
