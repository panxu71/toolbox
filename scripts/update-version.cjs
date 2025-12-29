#!/usr/bin/env node

/**
 * 版本更新脚本
 * 从 package.json 读取版本号并更新到所有相关文件
 */

const fs = require('fs')
const path = require('path')

// 读取 package.json
const packageJsonPath = path.join(__dirname, '../package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const version = packageJson.version

console.log(`🔄 开始更新版本号: ${version}`)

// 1. 更新 version.ts
const versionTsPath = path.join(__dirname, '../src/config/version.ts')
const versionTsContent = `// 版本配置
// 这个文件在构建时会被自动更新
export const VERSION = '${version}'

// 项目信息
export const PROJECT_INFO = {
    name: 'Toolbox',
    repository: 'panxu71/toolbox',
    homepage: 'https://toolbox.panxu.net'
} as const`

fs.writeFileSync(versionTsPath, versionTsContent, 'utf8')
console.log(`✅ 已更新 version.ts: ${version}`)

// 2. 更新 README.md 中的版本徽章
const readmePath = path.join(__dirname, '../README.md')
let readmeContent = fs.readFileSync(readmePath, 'utf8')

// 更新版本徽章
readmeContent = readmeContent.replace(
    /\[!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[^-]+-blue\.svg\)\]/,
    `[![Version](https://img.shields.io/badge/version-${version}-blue.svg)]`
)

fs.writeFileSync(readmePath, readmeContent, 'utf8')
console.log(`✅ 已更新 README.md 版本徽章: ${version}`)

// 3. 更新 package.json 中的打包脚本
let packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')

// 更新扩展打包脚本
packageJsonContent = packageJsonContent.replace(
    /"pack:ext": "npm run ext && cd dist && powershell Compress-Archive -Path \* -DestinationPath \.\/toolbox-extension-v[^-]+-[^-]+\.zip -Force && cd \.\."/,
    `"pack:ext": "npm run ext && cd dist && powershell Compress-Archive -Path * -DestinationPath ./toolbox-extension-v${version}.zip -Force && cd .."`
)

// 更新Web打包脚本
packageJsonContent = packageJsonContent.replace(
    /"pack:web": "npm run web && cd docs && powershell Compress-Archive -Path \* -DestinationPath \.\.\/dist\/toolbox-web-v[^-]+-[^-]+\.zip -Force && cd \.\."/,
    `"pack:web": "npm run web && cd docs && powershell Compress-Archive -Path * -DestinationPath ../dist/toolbox-web-v${version}.zip -Force && cd .."`
)

fs.writeFileSync(packageJsonPath, packageJsonContent, 'utf8')
console.log(`✅ 已更新 package.json 打包脚本: v${version}`)

// 4. 更新 manifest.json 中的版本号
const manifestPath = path.join(__dirname, '../manifest.json')
if (fs.existsSync(manifestPath)) {
    const manifestContent = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    manifestContent.version = version
    fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2), 'utf8')
    console.log(`✅ 已更新 manifest.json: ${version}`)
}

console.log(`\n🎉 版本号更新完成！`)
console.log(`📦 当前版本: ${version}`)
console.log(`📁 已更新文件:`)
console.log(`   - src/config/version.ts`)
console.log(`   - README.md`)
console.log(`   - package.json (scripts)`)
console.log(`   - manifest.json`)
console.log(`\n💡 提示: 现在可以运行以下命令:`)
console.log(`   npm run pack:ext  # 打包扩展为 toolbox-extension-v${version}.zip`)
console.log(`   npm run pack:web  # 打包Web版为 toolbox-web-v${version}.zip`)