# Toolbox 构建与发布指南

本文档详细说明了 Toolbox 项目的构建、打包和发布流程。

## 📦 构建模式

项目支持两种构建模式，分别输出到不同目录：

### 🌐 Web 模式
用于网站部署和本地预览。

```bash
npm run web        # 构建Web版本
npm run web:serve  # 构建并启动预览服务器
```

**输出目录**: `dist/web/`
**特点**:
- 文件名带 hash 值（如 `main-B3cbWWds.js`）
- 使用相对路径（如 `./assets/main.js`）
- 可直接在浏览器中打开 HTML 文件
- 也可通过 HTTP 服务器访问
- 利于浏览器缓存
- 适合本地使用和服务器部署

**使用方式**:
- 直接双击 `dist/web/index.html` 打开
- 或通过 HTTP 服务器访问（推荐）

### 🔧 Chrome 扩展模式
用于 Chrome 浏览器扩展安装。

```bash
npm run ext
```

**输出目录**: `dist/chrome/`
**特点**:
- 固定文件名（如 `main.js`）
- 使用相对路径（如 `./assets/main.js`）
- 包含 `manifest.json` 清单文件
- 包含所有扩展相关脚本
- 适合扩展商店发布和本地加载

### 🚀 同时构建两种模式

```bash
npm run build:all
```

## 📋 构建输出说明

### Web 模式输出结构
```
dist/web/
├── index.html
├── assets/
│   ├── main-[hash].js
│   └── style-[hash].css
└── icons/
    ├── icon16.png
    ├── icon32.png
    └── icon48.png
```

### Chrome 扩展输出结构
```
dist/chrome/
├── manifest.json          # 扩展清单文件
├── index.html             # 主页面
├── popup.html             # 弹窗页面
├── background.js          # 后台脚本
├── content.js             # 内容脚本
├── main.js                # 主应用脚本
├── popup.js               # 弹窗脚本
├── App.js                 # 应用组件
├── full.js                # 完整功能脚本
├── assets/
│   └── style.css          # 样式文件
└── icons/
    ├── icon16.png         # 16x16 图标
    ├── icon32.png         # 32x32 图标
    └── icon48.png         # 48x48 图标
```

## 📦 打包命令

### Chrome 扩展打包
```bash
npm run pack:ext
```
- 自动构建扩展版本
- 生成 `dist/toolbox-extension-v1.0.0.zip`
- 可直接上传到 Chrome 网上应用店

### Web 版本打包
```bash
npm run pack:web
```
- 自动构建 Web 版本
- 生成 `dist/toolbox-web-v1.0.0.zip`
- 可用于服务器部署

## 快速使用

### Web 版本
```bash
# 构建
npm run web

# 方式一：一键启动（最方便）
npm run serve
# 自动构建并启动服务器，访问 http://localhost:8080

# 方式二：使用脚本启动
# Windows: 双击 scripts/serve-web.bat
# Linux/Mac: ./scripts/serve-web.sh

# 方式三：手动启动 npx 服务器
cd dist/web
npx serve -s . -p 8080

# 方式四：直接打开（最简单）
# 双击 dist/web/index.html

# 方式五：npm 预览
npm run preview
# 访问 http://localhost:4173
```

### Chrome 扩展
```bash
# 构建
npm run ext

# 在 Chrome 中加载
# 1. 打开 chrome://extensions/
# 2. 开启开发者模式
# 3. 加载 dist/chrome 目录
```

## Chcrome 扩展安装

### 开发者模式安装
1. 构建扩展版本：
   ```bash
   npm run ext
   ```

2. 打开 Chrome 浏览器，访问 `chrome://extensions/`

3. 开启右上角的"开发者模式"

4. 点击"加载已解压的扩展程序"

5. 选择项目中的 `dist/chrome` 目录

6. 扩展安装完成，可在工具栏看到图标

### 打包安装
1. 生成扩展包：
   ```bash
   npm run pack:ext
   ```

2. 在 `dist/` 目录找到 `toolbox-extension-v1.0.0.zip`

3. 解压后按开发者模式安装，或上传到 Chrome 网上应用店

## 🛠️ 开发环境

### 启动开发服务器
```bash
npm run dev
```
- 访问地址: http://localhost:5173
- 支持热重载
- 实时预览修改效果

### 类型检查
```bash
npm run type-check
```

### 预览构建结果
```bash
npm run preview
```

## 📝 版本管理

### 更新版本号
修改以下文件中的版本号：
- `package.json` - `version` 字段
- `manifest.json` - `version` 字段

### 发布检查清单
- [ ] 更新版本号
- [ ] 测试所有功能正常
- [ ] 构建无错误和警告
- [ ] Chrome 扩展可正常加载
- [ ] 更新 CHANGELOG.md

## 🚨 常见问题

### Q: Chrome 扩展加载失败，提示"清单文件缺失"
**A**: 确保使用 `npm run ext` 构建扩展版本，而不是 `npm run web`

### Q: 构建后文件名没有 hash 值
**A**: 
- Web 模式 (`npm run web`) 会生成带 hash 的文件名
- 扩展模式 (`npm run ext`) 使用固定文件名

### Q: 扩展图标不显示
**A**: 确保 `src/assets/icons/` 目录包含所需的图标文件

## 📊 构建性能优化

当前构建会提示某些文件过大（>500KB），这是正常的，因为包含了完整的工具集。如需优化：

1. **代码分割**: 考虑使用动态导入拆分大型组件
2. **手动分块**: 配置 `build.rollupOptions.output.manualChunks`
3. **调整警告阈值**: 设置 `build.chunkSizeWarningLimit`

## 🔗 相关文档

- [Chrome 扩展开发](CHROME_EXTENSION.md)
- [功能特性说明](FEATURES.md)
- [开发指南](DEVELOPMENT.md)