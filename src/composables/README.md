# Composables

## useWakeLock

防止屏幕息屏的通用 composable，适用于需要保持屏幕常亮的场景。

### 使用方法

```typescript
import { useWakeLock } from '@/composables/useWakeLock'

export default {
  setup() {
    const { 
      isWakeLockActive, 
      requestWakeLock, 
      releaseWakeLock, 
      toggleWakeLock,
      isWakeLockSupported 
    } = useWakeLock()

    // 显示消息的函数（可选）
    const showMessage = (msg: string, type?: 'success' | 'error') => {
      console.log(`${type}: ${msg}`)
    }

    // 进入全屏时启用防息屏
    const enterFullscreen = async () => {
      await document.documentElement.requestFullscreen()
      requestWakeLock(showMessage)
    }

    // 退出全屏时释放防息屏
    const exitFullscreen = async () => {
      await document.exitFullscreen()
      releaseWakeLock(showMessage)
    }

    return {
      isWakeLockActive,
      enterFullscreen,
      exitFullscreen,
      toggleWakeLock: () => toggleWakeLock(showMessage)
    }
  }
}
```

### API

#### 返回值

- `isWakeLockActive`: `Ref<boolean>` - Wake Lock 是否处于激活状态
- `requestWakeLock`: `(showMessage?) => Promise<void>` - 请求屏幕保持唤醒
- `releaseWakeLock`: `(showMessage?) => void` - 释放屏幕保持唤醒
- `toggleWakeLock`: `(showMessage?) => Promise<void>` - 切换 Wake Lock 状态
- `isWakeLockSupported`: `() => boolean` - 检查浏览器是否支持 Wake Lock API

#### 参数

所有函数都接受一个可选的 `showMessage` 参数：
```typescript
showMessage?: (msg: string, type?: 'success' | 'error') => void
```

### 使用场景

- 全屏时钟显示
- 秒表计时
- 提词器播放
- 视频播放器
- 演示文稿
- 任何需要保持屏幕常亮的应用

### 浏览器支持

Wake Lock API 需要现代浏览器支持：
- Chrome 84+
- Edge 84+
- Safari 16.4+
- Firefox 126+

不支持的浏览器会优雅降级，不会影响应用功能。