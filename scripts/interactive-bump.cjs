#!/usr/bin/env node

/**
 * 交互式版本升级脚本
 * 帮助用户根据变更内容选择合适的版本升级类型
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { execSync } = require('child_process')

// 创建交互式界面
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

// 读取当前版本
const packageJsonPath = path.join(__dirname, '../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const currentVersion = packageJson.version

console.log('🚀 交互式版本升级工具')
console.log('='.repeat(50))
console.log(`📦 当前版本: ${currentVersion}`)
console.log('')

// 版本升级指南
console.log('📋 版本升级指南 (语义化版本控制):')
console.log('')
console.log('🔧 PATCH (修订号) - 例如: 2.1.0 → 2.1.1')
console.log('   • 修复bug')
console.log('   • 小的改进和优化')
console.log('   • 不影响现有功能的变更')
console.log('   • 完全向后兼容')
console.log('')
console.log('✨ MINOR (次版本号) - 例如: 2.1.0 → 2.2.0')
console.log('   • 新增功能')
console.log('   • 新增工具组件')
console.log('   • 功能增强')
console.log('   • 向后兼容的API变更')
console.log('')
console.log('💥 MAJOR (主版本号) - 例如: 2.1.0 → 3.0.0')
console.log('   • 重大架构变更')
console.log('   • 不兼容的API变更')
console.log('   • 移除已废弃的功能')
console.log('   • 重大UI/UX改版')
console.log('')
console.log('🎯 CUSTOM (自定义版本号) - 例如: 直接设置为 2.1.5')
console.log('   • 手动指定具体版本号')
console.log('   • 适用于特殊发布需求')
console.log('')

// 询问变更类型
function askChangeType() {
    return new Promise((resolve) => {
        rl.question('❓ 请描述本次主要变更内容:\n> ', (answer) => {
            console.log(`\n📝 变更描述: ${answer}`)
            resolve(answer)
        })
    })
}

// 询问版本升级类型
function askVersionType() {
    return new Promise((resolve) => {
        console.log('\n🔢 请选择版本升级类型:')
        console.log('1. PATCH (修订号) - 修复bug/小改进')
        console.log('2. MINOR (次版本号) - 新增功能')
        console.log('3. MAJOR (主版本号) - 重大变更')
        console.log('4. CUSTOM (自定义) - 手动输入版本号')
        console.log('5. CANCEL (取消) - 退出升级')
        console.log('')

        rl.question('请输入选项 (1-5): ', (answer) => {
            resolve(answer.trim())
        })
    })
}

// 询问自定义版本号
function askCustomVersion() {
    return new Promise((resolve) => {
        rl.question('\n📝 请输入新版本号 (格式: x.y.z): ', (answer) => {
            resolve(answer.trim())
        })
    })
}

// 确认升级
function confirmUpgrade(newVersion, changeDescription) {
    return new Promise((resolve) => {
        console.log('\n' + '='.repeat(50))
        console.log('📋 升级确认信息:')
        console.log(`📦 当前版本: ${currentVersion}`)
        console.log(`🆕 新版本: ${newVersion}`)
        console.log(`📝 变更描述: ${changeDescription}`)
        console.log('='.repeat(50))

        rl.question('\n✅ 确认执行版本升级? (y/N): ', (answer) => {
            resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
        })
    })
}

// 计算新版本号
function calculateNewVersion(type) {
    const [major, minor, patch] = currentVersion.split('.').map(Number)

    switch (type) {
        case '1': // PATCH
            return `${major}.${minor}.${patch + 1}`
        case '2': // MINOR
            return `${major}.${minor + 1}.0`
        case '3': // MAJOR
            return `${major + 1}.0.0`
        default:
            return null
    }
}

// 验证版本号格式
function validateVersion(version) {
    const versionRegex = /^\d+\.\d+\.\d+$/
    return versionRegex.test(version)
}

// 执行版本升级
function executeUpgrade(newVersion, changeDescription) {
    try {
        console.log('\n🔄 开始执行版本升级...')

        // 更新 package.json
        packageJson.version = newVersion
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8')
        console.log('✅ 已更新 package.json')

        // 运行版本更新脚本
        execSync('node scripts/update-version.cjs', {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
        })

        console.log('\n🎉 版本升级完成!')
        console.log(`📦 新版本: ${newVersion}`)
        console.log(`📝 变更: ${changeDescription}`)

        console.log('\n💡 建议的后续操作:')
        console.log(`   git add .`)
        console.log(`   git commit -m "chore: bump version to ${newVersion}`)
        console.log(`   ${changeDescription}"`)
        console.log(`   git tag v${newVersion}`)
        console.log(`   git push origin main --tags`)

        console.log('\n📦 打包命令:')
        console.log(`   npm run pack:ext  # 扩展版 -> toolbox-extension-v${newVersion}.zip`)
        console.log(`   npm run pack:web  # Web版 -> toolbox-web-v${newVersion}.zip`)

    } catch (error) {
        console.error('\n❌ 版本升级失败:', error.message)
        process.exit(1)
    }
}

// 主流程
async function main() {
    try {
        // 1. 询问变更内容
        const changeDescription = await askChangeType()

        // 2. 询问版本类型
        const versionType = await askVersionType()

        if (versionType === '5') {
            console.log('\n❌ 用户取消升级')
            rl.close()
            return
        }

        let newVersion

        if (versionType === '4') {
            // 自定义版本号
            newVersion = await askCustomVersion()

            if (!validateVersion(newVersion)) {
                console.log('\n❌ 版本号格式错误，应为 x.y.z 格式')
                rl.close()
                return
            }
        } else if (['1', '2', '3'].includes(versionType)) {
            // 自动计算版本号
            newVersion = calculateNewVersion(versionType)
        } else {
            console.log('\n❌ 无效的选项')
            rl.close()
            return
        }

        // 3. 确认升级
        const confirmed = await confirmUpgrade(newVersion, changeDescription)

        if (confirmed) {
            executeUpgrade(newVersion, changeDescription)
        } else {
            console.log('\n❌ 用户取消升级')
        }

        rl.close()

    } catch (error) {
        console.error('\n❌ 发生错误:', error.message)
        rl.close()
        process.exit(1)
    }
}

// 启动主流程
main()