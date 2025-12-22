@echo off
echo 🚀 开始构建 Toolbox 工具箱发布版本...
echo.

echo 📋 检查环境...
call npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 npm，请先安装 Node.js
    pause
    exit /b 1
)

echo ✅ Node.js 环境正常

echo.
echo 📦 安装依赖...
call npm install
if errorlevel 1 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo.
echo 🔧 类型检查...
call npm run type-check
if errorlevel 1 (
    echo ⚠️  类型检查有警告，继续构建...
)

echo.
echo 🏗️  构建扩展程序...
call npm run build:extension
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

echo.
echo 📁 检查构建结果...
if not exist "dist\popup.html" (
    echo ❌ 构建文件不完整
    pause
    exit /b 1
)

echo ✅ 构建文件检查通过

echo.
echo 📦 创建发布包...
cd dist
powershell -Command "Compress-Archive -Path * -DestinationPath ./toolbox-extension-v1.0.0.zip -Force"
cd ..

if exist "dist\toolbox-extension-v1.0.0.zip" (
    echo ✅ 发布包创建成功: dist\toolbox-extension-v1.0.0.zip
) else (
    echo ❌ 发布包创建失败
    pause
    exit /b 1
)

echo.
echo 📊 构建统计:
for %%f in (dist\toolbox-extension-v1.0.0.zip) do echo 包大小: %%~zf 字节
echo 构建时间: %date% %time%

echo.
echo 🎉 构建完成！
echo.
echo 📋 下一步操作:
echo 1. 在 Chrome 中加载 dist 文件夹测试
echo 2. 上传 dist\toolbox-extension-v1.0.0.zip 到 Chrome 网上应用店
echo 3. 或分享给用户手动安装
echo.
pause