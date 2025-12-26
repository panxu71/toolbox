import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync, unlinkSync, rmSync, statSync } from 'fs'

// 检查构建目标
const buildTarget = process.env.BUILD_TARGET || 'web'
const isExtensionBuild = buildTarget === 'extension'
const isStandaloneBuild = buildTarget === 'standalone'
const isWebBuild = buildTarget === 'web'

// 根据构建目标设置输出目录
const getOutDir = () => {
  switch (buildTarget) {
    case 'extension':
      return 'dist'
    case 'standalone':
      return 'dist/standalone'
    case 'web':
      return 'docs'
    default:
      return 'dist'
  }
}

// 自定义清空目录函数，保留指定文件
const emptyDirExcept = (dir: string, keepFiles: string[] = []) => {
  if (!existsSync(dir)) return
  
  const files = readdirSync(dir)
  for (const file of files) {
    if (keepFiles.includes(file)) {
      console.log(`🔒 保留文件: ${file}`)
      continue
    }
    
    const filePath = resolve(dir, file)
    const stat = statSync(filePath)
    
    if (stat.isDirectory()) {
      rmSync(filePath, { recursive: true, force: true })
      console.log(`🗑️ 删除目录: ${file}`)
    } else {
      unlinkSync(filePath)
      console.log(`🗑️ 删除文件: ${file}`)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件来处理文件复制和目录清理
    {
      name: 'copy-extension-files',
      buildStart() {
        // Web构建时自定义清空目录，保留CNAME文件
        if (isWebBuild) {
          const outDir = getOutDir()
          const outDirPath = resolve(__dirname, outDir)
          if (existsSync(outDirPath)) {
            console.log('🧹 清空输出目录，保留 CNAME 文件...')
            emptyDirExcept(outDirPath, ['CNAME'])
          }
        }
      },
      writeBundle() {
        const outDir = getOutDir()
        const iconsDir = resolve(__dirname, `${outDir}/icons`)
        if (!existsSync(iconsDir)) {
          mkdirSync(iconsDir, { recursive: true })
        }

        // 复制图标文件到根目录
        const iconFiles = ['icon16.png', 'icon32.png', 'icon48.png']
        iconFiles.forEach(file => {
          const src = resolve(__dirname, `src/assets/icons/${file}`)
          const dest = resolve(__dirname, `${outDir}/${file}`)
          if (existsSync(src)) {
            copyFileSync(src, dest)
            console.log(`✅ 复制图标到根目录: ${file}`)
          }
        })

        // 只在扩展构建模式下复制manifest.json
        if (isExtensionBuild) {
          const manifestSrc = resolve(__dirname, 'manifest.json')
          const manifestDest = resolve(__dirname, `${outDir}/manifest.json`)
          if (existsSync(manifestSrc)) {
            copyFileSync(manifestSrc, manifestDest)
            console.log(`✅ 复制清单文件: manifest.json`)
          }
        }
      }
    }
  ],
  base: isExtensionBuild ? '/' : './', // 扩展模式使用绝对路径，其他模式使用相对路径
  build: {
    rollupOptions: {
      input: isExtensionBuild ? {
        // 扩展模式：包含所有扩展相关文件
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts')
      } : {
        // Web模式：只包含主应用
        main: resolve(__dirname, 'index.html')
      },
      output: isExtensionBuild ? {
        // 扩展模式：固定文件名，CSS放在根目录
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `icons/[name].[ext]`
          }
          if (ext === 'css') {
            return `[name].[ext]` // CSS文件放在根目录
          }
          return `assets/[name].[ext]`
        }
      } : isStandaloneBuild ? {
        // 单文件模式：内联所有资源
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `icons/[name].[ext]`
          }
          return `assets/[name].[ext]`
        }
      } : {
        // Web模式：带hash的文件名
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `icons/[name].[ext]`
          }
          return `assets/[name]-[hash].[ext]`
        }
      }
    },
    outDir: getOutDir(),
    emptyOutDir: false, // 禁用vite的自动清空，使用自定义清空逻辑
    minify: 'terser',
    sourcemap: false,
    target: 'es2020',
    cssCodeSplit: false
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
