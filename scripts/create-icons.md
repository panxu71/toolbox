# 📱 图标创建指南

## 🎨 图标要求

Chrome 扩展程序需要以下尺寸的 PNG 图标：
- `icon16.png` (16x16) - 工具栏小图标
- `icon32.png` (32x32) - Windows 系统图标
- `icon48.png` (48x48) - 扩展管理页面
- `icon128.png` (128x128) - Chrome 网上应用店

## 🛠️ 创建方法

### 方法一：在线工具
1. 使用 [Favicon Generator](https://favicon.io/) 或 [RealFaviconGenerator](https://realfavicongenerator.net/)
2. 上传 SVG 文件 (`public/icons/icon.svg`)
3. 生成所需尺寸的 PNG 文件
4. 下载并放置到 `public/icons/` 文件夹

### 方法二：使用 Photoshop/GIMP
1. 打开 `public/icons/icon.svg`
2. 导出为不同尺寸的 PNG：
   - 16x16 → `icon16.png`
   - 32x32 → `icon32.png`
   - 48x48 → `icon48.png`
   - 128x128 → `icon128.png`

### 方法三：命令行工具 (需要安装 ImageMagick)
```bash
# 安装 ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# 转换 SVG 到不同尺寸的 PNG
magick public/icons/icon.svg -resize 16x16 public/icons/icon16.png
magick public/icons/icon.svg -resize 32x32 public/icons/icon32.png
magick public/icons/icon.svg -resize 48x48 public/icons/icon48.png
magick public/icons/icon.svg -resize 128x128 public/icons/icon128.png
```

## 📁 文件结构

创建图标后，文件结构应该是：
```
public/
└── icons/
    ├── icon.svg      # 源文件
    ├── icon16.png    # 16x16
    ├── icon32.png    # 32x32
    ├── icon48.png    # 48x48
    └── icon128.png   # 128x128
```

## 🔧 启用图标

创建图标文件后，需要更新 `manifest.json`：

```json
{
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_title": "Toolbox 工具箱",
    "default_icon": {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  }
}
```

然后重新构建：
```bash
npm run build:extension
```

## 🎨 设计建议

- 使用简洁的设计，在小尺寸下仍然清晰可见
- 保持品牌一致性
- 使用对比鲜明的颜色
- 避免过多细节，特别是在 16x16 尺寸下
- 考虑深色和浅色主题的兼容性