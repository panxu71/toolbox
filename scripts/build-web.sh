#!/bin/bash

echo "🚀 开始构建 Toolbox Web 版本..."
echo

echo "📋 检查环境..."
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 Node.js"
    exit 1
fi

echo "✅ Node.js 环境正常"

echo
echo "📦 安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo
echo "🔧 类型检查..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "⚠️  类型检查有警告，继续构建..."
fi

echo
echo "🏗️  构建 Web 版本..."
npm run web
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo
echo "📁 检查构建结果..."
if [ ! -f "docs/index.html" ]; then
    echo "❌ 构建文件不完整"
    exit 1
fi

echo "✅ 构建文件检查通过"

echo
echo "📦 创建发布包..."
cd docs
zip -r ../dist/toolbox-web-v1.0.0.zip .
cd ..

# 确保dist目录存在
mkdir -p dist

if [ -f "dist/toolbox-web-v1.0.0.zip" ]; then
    echo "✅ 发布包创建成功: dist/toolbox-web-v1.0.0.zip"
else
    echo "❌ 发布包创建失败"
    exit 1
fi

echo
echo "📊 构建统计:"
echo "包大小: $(du -h dist/toolbox-web-v1.0.0.zip | cut -f1)"
echo "构建时间: $(date)"
echo "输出目录: docs/"

echo
echo "🎉 构建完成！"
echo
echo "📋 下一步操作:"
echo "1. 本地预览: npm run serve"
echo "2. 部署到 GitHub Pages (docs 目录)"
echo "3. 或上传 dist/toolbox-web-v1.0.0.zip 到服务器"
echo