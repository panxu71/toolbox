@echo off
chcp 65001 >nul

echo 🚀 启动 Toolbox Web 服务器...

:: 检查是否已构建
if not exist "dist\web\index.html" (
    echo 📦 未找到构建文件，正在构建...
    call npm run web
    if errorlevel 1 (
        echo ❌ 构建失败
        pause
        exit /b 1
    )
    echo ✅ 构建完成
)

:: 进入 web 目录
cd dist\web

:: 检查 npx serve 是否可用
npx serve --version >nul 2>&1
if errorlevel 1 (
    echo 📦 正在安装 serve...
    npx serve@latest --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ 无法安装 serve，请检查网络连接
        echo 💡 你也可以直接双击 index.html 文件
        pause
        exit /b 1
    )
)

:: 启动服务器
echo 🌐 启动服务器...
echo 📍 访问地址: http://localhost:8080
echo 🛑 按 Ctrl+C 停止服务器
echo.

npx serve -s . -p 8080