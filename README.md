# 🧰 Toolbox - 现代化开发者工具箱

> 专业的在线开发者工具集合，提供 JSON 处理、代码格式化、加密解密、进制转换、时间处理等 30+ 实用功能

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/panxu71/toolbox)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/vue-3.5-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Chrome Extension](https://img.shields.io/badge/chrome-extension-orange.svg)](https://chrome.google.com/webstore)

## 🌐 在线使用

**官方网站**: [http://toolbox.panxu.net](http://toolbox.panxu.net)

无需安装，打开即用！支持所有现代浏览器。

## 📱 Chrome扩展下载

**扩展下载**: [toolbox-extension-v1.0.0.zip](https://github.com/panxu71/toolbox/releases/latest/download/toolbox-extension-v1.0.0.zip)

下载后解压，在Chrome扩展管理页面加载即可离线使用。

## ✨ 功能特色

### 📋 JSON 工具
- **JSON 格式化** - 美化、压缩、验证 JSON 数据，支持粘贴自动格式化
- **Excel ⇄ JSON 互转** - Excel 表格与 JSON 数据双向转换
- **Postman ⇄ JSON 互转** - Postman 参数与 JSON 格式互相转换  
- **PHP ⇄ JSON 互转** - PHP 数组与 JSON 数据格式互相转换

### 🕐 时间工具
- **时间戳转换** - 时间戳与日期格式互转，支持多种格式
- **日期计算器** - 计算日期间隔和加减运算
- **时区转换** - 全球时区时间转换
- **倒计时器** - 创建倒计时和定时器功能

### 🔐 加密解密
- **Base64 编码** - Base64 编码和解码处理
- **URL 编码** - URL 编码和解码转换
- **MD5 哈希** - 生成 MD5 哈希值
- **RSA 密钥生成** - 生成 RSA 公私钥对，支持密码保护
- **文本编码转换** - Base64、URL、HTML、Unicode、ASCII 多种编码
- **JWT 生成器** - 生成和解析 JWT Token

### 🔄 转换工具
- **简繁体转换** - 基于 OpenCC 的权威中文简繁转换
- **全局文本替换** - 支持正则表达式的强大查找替换
- **PHP 序列化转换** - PHP 序列化与数组、JSON、XML 互转
- **单位转换** - 长度、重量、温度等单位转换
- **进制转换** - 二进制、八进制、十六进制等进制转换
- **数字格式转换** - 阿拉伯数字转罗马数字、中文数字
- **JS/HTML 格式化** - JavaScript、HTML、CSS 代码格式化和压缩
- **图片 ⇄ Base64 互转** - 图片与 Base64 编码互相转换

### 🛠️ 生成工具
- **密码生成器** - 生成安全随机密码，支持自定义规则
- **二维码生成** - 生成自定义二维码，支持 Logo 和容错率设置
- **Crontab 表达式** - 生成和解析 Cron 定时任务表达式

### 🔍 查询工具
- **字符串长度统计** - 统计文本字符数、字节数、单词数等详细信息
- **ASCII 编码查询** - 查询字符的 ASCII 编码值和完整 ASCII 表
- **颜色对照表** - 常用颜色的 HEX、RGB、HSL 格式对照
- **百家姓查询** - 查询中国传统百家姓的排名、起源和分布

## 🚀 快速开始

### 🌐 在线使用（最简单）
直接访问官网：**[http://toolbox.panxu.net](http://toolbox.panxu.net)**

### 📱 Chrome扩展（离线使用）
下载安装包：**[toolbox-extension-v1.0.0.zip](https://github.com/panxu71/toolbox/releases/latest/download/toolbox-extension-v1.0.0.zip)**

## 🌐 Web 版本使用

### 方式一：一键启动（最方便）
```bash
npm run serve
# 自动构建并启动服务器，访问 http://localhost:8080
```

### 方式二：使用启动脚本
```bash
# Windows: 双击运行
scripts/serve-web.bat

# Linux/Mac: 
chmod +x scripts/serve-web.sh
./scripts/serve-web.sh
```

### 方式三：直接打开 HTML 文件（最简单）
```bash
# 1. 构建 Web 版本
npm run web

# 2. 直接在浏览器中打开
# 双击 docs/index.html
# 或拖拽到浏览器窗口
```

### 方式四：使用 npm 预览
```bash
npm run web
npm run preview
# 访问 http://localhost:4173
```

### 🔧 Chrome 扩展安装

#### 方式一：下载安装包（推荐）
1. 下载最新版本：[toolbox-extension-v1.0.0.zip](https://github.com/panxu71/toolbox/releases/latest/download/toolbox-extension-v1.0.0.zip)
2. 解压下载的zip文件
3. 打开Chrome浏览器，访问 `chrome://extensions/`
4. 开启右上角的"开发者模式"
5. 点击"加载已解压的扩展程序"
6. 选择解压后的文件夹

#### 方式二：从源码构建
```bash
# 1. 克隆项目
git clone https://github.com/panxu71/toolbox.git
cd toolbox

# 2. 安装依赖
npm install

# 3. 构建扩展
npm run ext

# 4. 在 Chrome 中加载
# 打开 chrome://extensions/
# 开启开发者模式
# 点击"加载已解压的扩展程序"
# 选择 dist 目录
```

## 📦 构建命令

```bash
# 开发环境
npm run dev              # 启动开发服务器

# 构建命令
npm run web              # 构建 Web 版本 (docs/)
npm run ext              # 构建 Chrome 扩展 (dist/)
npm run build:all        # 同时构建两个版本

# 快速启动
npm run serve            # 构建并启动 Web 服务器 (http://localhost:8080)

# 打包命令
npm run pack:web         # 打包 Web 版本为 zip
npm run pack:ext         # 打包 Chrome 扩展为 zip

# 其他命令
npm run preview          # 预览构建结果
npm run type-check       # TypeScript 类型检查
```

## 🎨 界面特性

- 🌓 **智能主题** - 自动适应系统深色/浅色主题
- 📱 **响应式设计** - 完美支持手机、平板、桌面设备
- ⚡ **快速操作** - 一键复制、粘贴、清空、下载功能
- 🔍 **全局搜索** - 快速查找所需工具
- 💾 **数据持久化** - 自动保存用户设置和历史记录
- 🎯 **分类导航** - 清晰的工具分类和标签系统

## 🔒 隐私安全

- ✅ **本地处理** - 所有数据在本地处理，不上传服务器
- ✅ **隐私保护** - 不收集任何用户个人信息
- ✅ **开源透明** - 完全开源，代码可审查
- ✅ **最小权限** - Chrome 扩展仅申请必要权限

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | 3.5+ | 前端框架 |
| TypeScript | 5.9+ | 类型安全 |
| Vite | 7.0+ | 构建工具 |
| Prettier | 3.7+ | 代码格式化 |
| js-beautify | 1.15+ | 代码美化 |
| highlight.js | 11.11+ | 语法高亮 |
| OpenCC | 1.0+ | 中文转换 |
| SheetJS | 0.18+ | Excel 处理 |
| QRCode.js | 1.5+ | 二维码生成 |

## 📁 项目结构

```
toolbox/
├── src/
│   ├── components/          # 功能组件
│   │   ├── JsonFormatter.vue
│   │   ├── TimestampConverter.vue
│   │   ├── PasswordGenerator.vue
│   │   └── ...
│   ├── config/
│   │   └── cards.json       # 工具配置
│   ├── types/               # TypeScript 类型
│   ├── composables/         # Vue 组合式函数
│   ├── assets/              # 静态资源
│   ├── App.vue              # 主应用
│   ├── main.ts              # Web 版入口
│   ├── popup.ts             # 扩展版入口
│   └── style.css            # 全局样式
├── public/                  # 公共资源
├── scripts/                 # 构建脚本
├── docs/                    # Web 版本构建输出 (GitHub Pages)
├── dist/                    # Chrome 扩展构建输出
├── manifest.json            # 扩展清单
├── vite.config.ts           # Vite 配置
└── package.json             # 项目配置
```

## 🔧 开发指南

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 本地开发
```bash
# 1. 克隆项目
git clone https://github.com/panxu71/toolbox.git
cd toolbox

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问 http://localhost:5173
```

### 添加新工具
1. 在 `src/components/` 创建新组件
2. 在 `src/config/cards.json` 添加工具配置
3. 在 `src/App.vue` 添加组件引用

### 代码规范
```bash
# 类型检查
npm run type-check

# 代码格式化（自动）
# 使用 Prettier 配置
```

## 📖 相关文档

- [📦 构建发布指南](BUILD_RELEASE.md) - 详细的构建和发布流程
- [🔧 Chrome 扩展](CHROME_EXTENSION.md) - 扩展开发说明
- [🎨 主题系统](THEME_FEATURES.md) - 主题功能说明
- [📝 更新日志](CHANGELOG.md) - 版本更新记录

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 贡献流程
1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 问题反馈
- 🐛 [报告 Bug](https://github.com/panxu71/toolbox/issues/new?template=bug_report.md)
- 💡 [功能建议](https://github.com/panxu71/toolbox/issues/new?template=feature_request.md)
- 💬 [讨论交流](https://github.com/panxu71/toolbox/discussions)

## 📊 项目统计

- 🛠️ **30+ 实用工具** - 覆盖开发常用场景
- 📱 **双端支持** - Web 版本 + Chrome 扩展
- 🌍 **多语言支持** - 中文界面，国际化友好
- ⚡ **高性能** - 本地处理，响应迅速
- 🎨 **现代设计** - 简洁美观的用户界面

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE) - 查看 LICENSE 文件了解详情

## 🙏 致谢

感谢以下开源项目的支持：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具  
- [Prettier](https://prettier.io/) - 代码格式化工具
- [OpenCC](https://github.com/BYVoid/OpenCC) - 中文简繁转换
- [highlight.js](https://highlightjs.org/) - 语法高亮库
- [SheetJS](https://sheetjs.com/) - Excel 处理库
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - 二维码生成

## 📞 联系方式

- 📧 **邮箱**: panxu71@163.com
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/panxu71/toolbox/issues)
- 💬 **讨论交流**: [GitHub Discussions](https://github.com/panxu71/toolbox/discussions)
- 🌟 **项目主页**: [GitHub Repository](https://github.com/panxu71/toolbox)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给它一个星标！**

[🚀 立即使用](http://toolbox.panxu.net) | [📦 下载扩展](https://github.com/panxu71/toolbox/releases) | [📖 查看文档](https://github.com/panxu71/toolbox/wiki)

</div>