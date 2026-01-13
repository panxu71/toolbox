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

export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件来处理文件复制和目录清理
    {
      name: 'copy-extension-files',
      buildStart() {
        // 只在构建时执行，不在开发时执行
        if (process.env.NODE_ENV === 'development') {
          return
        }

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
        // 只在构建时执行，不在开发时执行
        if (process.env.NODE_ENV === 'development') {
          return
        }

        const outDir = getOutDir()

        // Web构建时只复制favicon图标
        if (isWebBuild) {
          const src = resolve(__dirname, 'src/assets/icons/icon16.png')
          const dest = resolve(__dirname, `${outDir}/icon16.png`)
          if (existsSync(src)) {
            copyFileSync(src, dest)
            console.log(`✅ 复制favicon图标: icon16.png`)
          }
        }

        // 只在扩展构建模式下处理图标文件
        if (isExtensionBuild) {
          const iconsDir = resolve(__dirname, `${outDir}/icons`)
          if (!existsSync(iconsDir)) {
            mkdirSync(iconsDir, { recursive: true })
          }

          // 复制图标文件到根目录和icons目录
          const iconFiles = ['icon16.png', 'icon32.png', 'icon48.png']
          iconFiles.forEach(file => {
            const src = resolve(__dirname, `src/assets/icons/${file}`)

            // 复制到根目录（保持兼容性）
            const destRoot = resolve(__dirname, `${outDir}/${file}`)
            if (existsSync(src)) {
              copyFileSync(src, destRoot)
              console.log(`✅ 复制图标到根目录: ${file}`)
            }

            // 复制到icons目录
            const destIcons = resolve(__dirname, `${outDir}/icons/${file}`)
            if (existsSync(src)) {
              copyFileSync(src, destIcons)
              console.log(`✅ 复制图标到icons目录: ${file}`)
            }
          })

          // 复制manifest.json
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
  base: isExtensionBuild ? '/' : './',
  build: {
    rollupOptions: {
      input: isExtensionBuild ? {
        main: resolve(__dirname, 'index.html'),
        popup: resolve(__dirname, 'popup.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts')
      } : {
        main: resolve(__dirname, 'index.html')
      },
      output: (isExtensionBuild || isWebBuild) ? {
        entryFileNames: isWebBuild ? 'assets/[name]-[hash].js' : '[name].js',
        chunkFileNames: isWebBuild ? 'assets/[name]-[hash].js' : '[name].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `icons/[name].[ext]`
          }
          if (ext === 'css') {
            return isWebBuild ? `assets/[name]-[hash].[ext]` : `[name].[ext]`
          }
          return isWebBuild ? `assets/[name]-[hash].[ext]` : `[name].[ext]`
        }
      } : {
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
    emptyOutDir: false,
    minify: 'terser',
    sourcemap: false,
    target: 'es2020',
    cssCodeSplit: false,
    chunkSizeWarningLimit: 3000
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api/ip-me': {
        target: 'https://ip.me',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ip-me/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
            proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.5');
          });
        }
      },
      '/api/whatismyip-api': {
        target: 'https://whatismyipaddress.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/whatismyip-api/, '/api'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Accept-Language', 'zh-TW,zh;q=0.9,en;q=0.8');
            proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
            proxyReq.setHeader('Referer', 'https://whatismyipaddress.com/zh-tw/index');
            proxyReq.setHeader('Origin', 'https://whatismyipaddress.com');
            proxyReq.setHeader('Sec-Ch-Ua', '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"');
            proxyReq.setHeader('Sec-Ch-Ua-Mobile', '?0');
            proxyReq.setHeader('Sec-Ch-Ua-Platform', '"Windows"');
            proxyReq.setHeader('Sec-Fetch-Dest', 'empty');
            proxyReq.setHeader('Sec-Fetch-Mode', 'cors');
            proxyReq.setHeader('Sec-Fetch-Site', 'same-origin');
          });
        }
      },
      '/api/whatismyip': {
        target: 'https://whatismyipaddress.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/whatismyip/, '/ip.php'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 完全模拟真实浏览器请求头，移除可疑的头部
            proxyReq.setHeader('Host', 'whatismyipaddress.com');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
            proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
            proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('Upgrade-Insecure-Requests', '1');
            proxyReq.setHeader('Sec-Fetch-Dest', 'document');
            proxyReq.setHeader('Sec-Fetch-Mode', 'navigate');
            proxyReq.setHeader('Sec-Fetch-Site', 'none');
            proxyReq.setHeader('Sec-Fetch-User', '?1');
            proxyReq.setHeader('Cache-Control', 'max-age=0');

            // 移除所有可能暴露代理的请求头
            proxyReq.removeHeader('X-Forwarded-For');
            proxyReq.removeHeader('X-Real-IP');
            proxyReq.removeHeader('X-Forwarded-Proto');
            proxyReq.removeHeader('X-Forwarded-Host');
            proxyReq.removeHeader('Via');
            proxyReq.removeHeader('X-Forwarded-Server');
            proxyReq.removeHeader('Referer'); // 移除暴露本地环境的Referer
            proxyReq.removeHeader('Origin');

            // 移除可能被Cloudflare检测的头部
            proxyReq.removeHeader('Sec-CH-UA');
            proxyReq.removeHeader('Sec-CH-UA-Mobile');
            proxyReq.removeHeader('Sec-CH-UA-Platform');
            proxyReq.removeHeader('DNT');

            console.log('Proxying request to whatismyipaddress.com/ip.php');
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Response status from whatismyipaddress.com:', proxyRes.statusCode);
            if (proxyRes.statusCode !== 200) {
              console.log('Response headers:', proxyRes.headers);
            }
            // 移除可能导致问题的响应头
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['x-content-type-options'];
          });

          proxy.on('error', (err, req, res) => {
            console.error('Proxy error for /api/whatismyip:', err.message);
          });
        }
      },
      '/api/cip-cc': {
        target: 'https://cip.cc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cip-cc/, '/'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
            proxyReq.setHeader('Accept-Language', 'zh-CN,zh;q=0.9,en;q=0.8');
            proxyReq.setHeader('Referer', 'https://cip.cc/');
          });
        }
      },
      '/api/coding-tools': {
        target: 'https://coding.tools',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coding-tools/, '/cn/my-ip-address'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            proxyReq.setHeader('Accept-Language', 'zh-CN,zh;q=0.9,en;q=0.8');
            proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Referer', 'https://coding.tools/cn/my-ip-address');
            proxyReq.setHeader('Origin', 'https://coding.tools');
            proxyReq.setHeader('Sec-Fetch-Dest', 'empty');
            proxyReq.setHeader('Sec-Fetch-Mode', 'cors');
            proxyReq.setHeader('Sec-Fetch-Site', 'same-origin');
          });
        }
      },
      '/api/myip-tw': {
        target: 'https://myip.com.tw',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/myip-tw/, '/'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
            proxyReq.setHeader('Accept-Language', 'zh-TW,zh;q=0.9,en;q=0.8');
            proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
            proxyReq.setHeader('Referer', 'https://myip.com.tw/');
          });
        }
      },
      '/api/browserscan': {
        target: 'https://ip-scan.browserscan.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/browserscan/, '/sys/config/ip/get-visitor-ip'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Accept-Language', 'zh-CN,zh;q=0.9');
            proxyReq.setHeader('Referer', 'https://browserscan.net/');
            proxyReq.setHeader('Origin', 'https://browserscan.net');
          });
        }
      },
      '/api/taobao': {
        target: 'https://www.taobao.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/taobao/, '/help/getip.php'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
            proxyReq.setHeader('Accept-Language', 'zh-CN,zh;q=0.9,en;q=0.8');
            proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br');
            proxyReq.setHeader('Referer', 'https://www.taobao.com/');
            proxyReq.setHeader('Origin', 'https://www.taobao.com');
            proxyReq.setHeader('Sec-Ch-Ua', '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"');
            proxyReq.setHeader('Sec-Ch-Ua-Mobile', '?0');
            proxyReq.setHeader('Sec-Ch-Ua-Platform', '"Windows"');
            proxyReq.setHeader('Sec-Fetch-Dest', 'script');
            proxyReq.setHeader('Sec-Fetch-Mode', 'no-cors');
            proxyReq.setHeader('Sec-Fetch-Site', 'same-origin');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Pragma', 'no-cache');
          });
        }
      },
      '/api/iplark': {
        target: 'https://iplark.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/iplark/, '/ipapi/public/ipinfo?db=moon'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Referer', 'https://iplark.com/');
          });
        }
      },
      '/api/xxir': {
        target: 'https://ip.xxir.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/xxir/, '/ip/mtip.php'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Referer', 'https://ip.xxir.com/');
          });
        }
      },
      '/api/maxmind': {
        target: 'https://geoip.maxmind.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/maxmind/, '/geoip/v2.1/city/me'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', '*/*');
            proxyReq.setHeader('Accept-Language', 'zh-CN,zh;q=0.9');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Pragma', 'no-cache');
            proxyReq.setHeader('Referer', 'https://www.maxmind.com/');
            proxyReq.setHeader('Origin', 'https://www.maxmind.com');
          });
        }
      },
      '/api/ipnews': {
        target: 'https://api.ipnews.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ipnews/, '/v1/ip_self_search'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Referer', 'https://api.ipnews.io/');
          });
        }
      },
      '/api/ipdatacloud': {
        target: 'https://app.ipdatacloud.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ipdatacloud/, '/v1/ip_self_search'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Referer', 'https://app.ipdatacloud.com/');
          });
        }
      },
      '/api/aapq': {
        target: 'https://fcd09628a76x.aapq.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/aapq/, '/ip'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
          });
        }
      },
      '/api/upyun': {
        target: 'https://pubstatic.b0.upaiyun.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/upyun/, '/'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Referer', 'https://www.upyun.com/');
          });
        }
      },
      '/api/itdog': {
        target: 'https://ipv4_cu.itdog.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/itdog/, '/'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Referer', 'https://www.itdog.cn/');
          });
        }
      },
      '/api/ipip-json': {
        target: 'https://myip.ipip.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ipip-json/, '/json'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
          });
        }
      },
      '/api/ip-api': {
        target: 'http://demo.ip-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ip-api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            proxyReq.setHeader('Referer', 'https://ip-api.com/');
          });
        }
      },
      '/api/ifconfig': {
        target: 'https://ifconfig.me',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ifconfig/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
          });
        }
      },
      '/api/myip-ipip': {
        target: 'https://myip.ipip.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/myip-ipip/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
          });
        }
      },
      '/api/cip': {
        target: 'http://cip.cc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cip/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
          });
        }
      },
      '/api/ipinfo': {
        target: 'https://ipinfo.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ipinfo/, '/lookup-data'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Referer', 'https://ipinfo.io/');
          });
        }
      },
      '/api/ip-cn': {
        target: 'https://my.ip.cn',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/ip-cn/, '/json/'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            proxyReq.setHeader('Accept', '*/*');
            proxyReq.setHeader('Accept-Encoding', 'gzip, deflate, br, zstd');
            proxyReq.setHeader('Accept-Language', 'zh-CN,zh;q=0.9');
            proxyReq.setHeader('Cache-Control', 'no-cache');
            proxyReq.setHeader('Connection', 'keep-alive');
            proxyReq.setHeader('DNT', '1');
            proxyReq.setHeader('Pragma', 'no-cache');
            proxyReq.setHeader('Referer', 'https://ip.cn/');
            proxyReq.setHeader('Sec-Ch-Ua', '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"');
            proxyReq.setHeader('Sec-Ch-Ua-Mobile', '?0');
            proxyReq.setHeader('Sec-Ch-Ua-Platform', '"Windows"');
            proxyReq.setHeader('Sec-Fetch-Dest', 'empty');
            proxyReq.setHeader('Sec-Fetch-Mode', 'cors');
            proxyReq.setHeader('Sec-Fetch-Site', 'cross-site');
          });
        }
      },
      '/api/ustc': {
        target: 'https://test.ustc.edu.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ustc/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
          });
        }
      },
      '/api/3322': {
        target: 'http://members.3322.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/3322/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
          });
        }
      }
    }
  }
})
