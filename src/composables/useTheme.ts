import { ref, watch, onMounted, onUnmounted } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'

const THEME_KEY = 'toolbox-theme'
const AUTO_THEME_KEY = 'toolbox-auto-theme'

// 从localStorage获取保存的主题，默认为auto
const getStoredTheme = (): Theme => {
    const stored = localStorage.getItem(THEME_KEY)
    return (stored as Theme) || 'auto'
}

// 获取是否启用自动模式
const getAutoThemeEnabled = (): boolean => {
    const stored = localStorage.getItem(AUTO_THEME_KEY)
    return stored !== 'false' // 默认启用
}

// 根据时间判断应该使用什么主题
const getTimeBasedTheme = (): 'light' | 'dark' => {
    const now = new Date()
    const hour = now.getHours()
    
    // 21:00-07:00 为夜间模式
    if (hour >= 21 || hour < 7) {
        return 'dark'
    } else {
        return 'light'
    }
}

// 当前主题设置（可能是 auto）
const currentTheme = ref<Theme>(getStoredTheme())
// 自动模式是否启用
const autoThemeEnabled = ref<boolean>(getAutoThemeEnabled())
// 实际应用的主题
const actualTheme = ref<'light' | 'dark'>('dark')

let timeCheckInterval: number | null = null

// 应用主题到document
const applyTheme = (theme: 'light' | 'dark') => {
    actualTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.className = theme
}

// 更新实际主题
const updateActualTheme = () => {
    if (currentTheme.value === 'auto' && autoThemeEnabled.value) {
        const timeBasedTheme = getTimeBasedTheme()
        applyTheme(timeBasedTheme)
    } else if (currentTheme.value !== 'auto') {
        applyTheme(currentTheme.value)
    }
}

// 切换主题
const toggleTheme = () => {
    if (currentTheme.value === 'auto') {
        // 如果当前是自动模式，切换到手动模式
        const currentActual = actualTheme.value
        currentTheme.value = currentActual === 'dark' ? 'light' : 'dark'
        autoThemeEnabled.value = false
    } else {
        // 如果是手动模式，在 light/dark 之间切换
        currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    }
}

// 设置特定主题
const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    if (theme === 'auto') {
        autoThemeEnabled.value = true
    } else {
        autoThemeEnabled.value = false
    }
}

// 启用自动模式
const enableAutoTheme = () => {
    currentTheme.value = 'auto'
    autoThemeEnabled.value = true
}

// 禁用自动模式
const disableAutoTheme = () => {
    autoThemeEnabled.value = false
    // 保持当前实际主题
    currentTheme.value = actualTheme.value
}

// 开始时间检查
const startTimeCheck = () => {
    if (timeCheckInterval) return
    
    // 每分钟检查一次时间
    timeCheckInterval = window.setInterval(() => {
        if (currentTheme.value === 'auto' && autoThemeEnabled.value) {
            updateActualTheme()
        }
    }, 60000) // 60秒检查一次
}

// 停止时间检查
const stopTimeCheck = () => {
    if (timeCheckInterval) {
        clearInterval(timeCheckInterval)
        timeCheckInterval = null
    }
}

// 监听主题变化，保存到localStorage并应用
watch(currentTheme, (newTheme) => {
    localStorage.setItem(THEME_KEY, newTheme)
    updateActualTheme()
}, { immediate: true })

// 监听自动模式状态变化
watch(autoThemeEnabled, (enabled) => {
    localStorage.setItem(AUTO_THEME_KEY, enabled.toString())
    if (enabled && currentTheme.value === 'auto') {
        startTimeCheck()
        updateActualTheme()
    } else {
        stopTimeCheck()
    }
}, { immediate: true })

export const useTheme = () => {
    // 组件挂载时启动时间检查
    onMounted(() => {
        if (currentTheme.value === 'auto' && autoThemeEnabled.value) {
            startTimeCheck()
        }
    })
    
    // 组件卸载时清理定时器
    onUnmounted(() => {
        stopTimeCheck()
    })
    
    return {
        currentTheme,
        actualTheme,
        autoThemeEnabled,
        toggleTheme,
        setTheme,
        enableAutoTheme,
        disableAutoTheme,
        isDark: () => actualTheme.value === 'dark',
        isLight: () => actualTheme.value === 'light',
        isAuto: () => currentTheme.value === 'auto',
        getTimeBasedTheme
    }
}