#!/bin/bash

echo "🚀 启动 Toolbox Web 服务器..."

# 检查是否已构建
if [ ! -f "dist/web/index.html" ]; then
    echo "📦 未找到构建文件，正在构建..."
    npm run web
    if [ $? -ne 0 ]; then
        echo "❌ 构建失败"
        exit 1
    fi
    echo "✅ 构建完成"
fi

# 进入 web 目录
cd dist/web

# 检查 npx serve 是否可用
if ! npx serve --version > /dev/null 2>&1; then
    echo "📦 正在安装 serve..."
    if ! npx serve@latest --version > /dev/null 2>&1; then
        echo "❌ 无法安装 serve，尝试使用 Python 服务器..."
        if command -v python3 > /dev/null 2>&1; then
            echo "🌐 启动 Python 服务器..."
            echo "📍 访问地址: http://localhost:8080"
            echo "🛑 按 Ctrl+C 停止服务器"
            echo ""
            python3 -m http.server 8080
        elif command -v python > /dev/null 2>&1; then
            echo "🌐 启动 Python 服务器..."
            echo "📍 访问地址: http://localhost:8080"
            echo "🛑 按 Ctrl+C 停止服务器"
            echo ""
            python -m http.server 8080
        else
            echo "❌ 无法启动服务器，请手动打开 index.html 文件"
            exit 1
        fi
        exit 0
    fi
fi

# 启动服务器
echo "🌐 启动服务器..."
echo "📍 访问地址: http://localhost:8080"
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

npx serve -s . -p 8080