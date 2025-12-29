#!/usr/bin/env node

/**
 * 版本升级脚本
 * 自动升级版本号并更新所有相关文件
 * 
 * 用法:
 * npm run bump:patch  # 1.0.0 -> 1.0.1
 * npm run bump:minor  # 1.0.0 -> 1.1.0  
 * npm run bump:major  # 1.0.0 -> 2.0.0
 * npm run bump:version 2.1.1  # 直接设置版本号
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 获取命令行参数
const args = process.argv.slice(2)
const bumpType = args[0] // patch, minor, major, 或具体版本号

if (!bumpType) {
    console.log('❌ 请指定版本升级类型或版本号')
    console.log('用法:')
    console.log('  node scripts/bump-version.js patch   # 1.0.0 -> 1.0.1')
    console.log('  node scripts/bump-version.js minor   # 1.0.0 -> 1.1.0')
    console.log('  node scripts/bump-version.js major   # 1.0.0 -> 2.0.0')
    console.log('  node scripts/bump-version.js 2.1.1   # 直接设置版本号')
    process.exit(1)
}

// 读取当前版本
const packageJsonPath = path.join(__dirname, '../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const currentVersion = packageJson.version

console.log(`📦 当前版本: ${currentVersion}`)

let newVersion

// 判断是升级类型还是具体版本号
if (['patch', 'minor', 'major'].includes(bumpType)) {
    // 使用 npm version 命令升级版本
    try {
        console.log(`🔄 执行版本升级: ${bumpType}`)
        const result = execSync(`npm version ${bumpType} --no-git-tag-version`, {
            encoding: 'utf8',
            cwd: path.join(__dirname, '..')
        })
        newVersion = result.trim().replace('v', '')
        console.log(`✅ 版本已升级: ${currentVersion} -> ${newVersion}`)
    } catch (error) {
        console.error('❌ 版本升级失败:', error.message)
        process.exit(1)
    }
} else {
    // 直接设置版本号
    newVersion = bumpType
    console.log(`🔄 设置版本号: ${newVersion}`)

    // 验证版本号格式
    const versionRegex = /^\d+\.\d+\.\d+$/
    if (!versionRegex.test(newVersion)) {
        console.error('❌ 版本号格式错误，应为 x.y.z 格式')
        process.exit(1)
    }

    // 更新 package.json 版本号
    packageJson.version = newVersion
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
    console.log(`✅ 已更新 package.json 版本号: ${newVersion}`)
}

// 运行版本更新脚本
console.log(`🔄 更新相关文件...`)
try {
    execSync('node scripts/update-version.cjs', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
    })
} catch (error) {
    console.error('❌ 更新相关文件失败:', error.message)
    process.exit(1)
}

console.log(`\n🎉 版本升级完成！`)
console.log(`📦 新版本: ${newVersion}`)
console.log(`\n💡 接下来可以执行:`)
console.log(`   git add .`)
console.log(`   git commit -m "chore: bump version to ${newVersion}"`)
console.log(`   git tag v${newVersion}`)
console.log(`   git push origin main --tags`)
console.log(`\n📦 或者直接打包:`)
console.log(`   npm run pack:ext  # 扩展版`)
console.log(`   npm run pack:web  # Web版`)