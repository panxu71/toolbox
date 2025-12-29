import { ref, onMounted } from 'vue'
import { VERSION, PROJECT_INFO } from '../config/version'

interface GitHubRelease {
    tag_name: string
    name: string
    body: string
    html_url: string
    published_at: string
    prerelease: boolean
    draft: boolean
}

interface VersionInfo {
    hasUpdate: boolean
    currentVersion: string
    latestVersion: string
    releaseUrl: string
    releaseNotes: string
    publishedAt: string
}

/**
 * 版本检查 composable
 * 检查GitHub releases获取最新版本信息
 */
export function useVersionCheck() {
    const isChecking = ref(false)
    const versionInfo = ref<VersionInfo | null>(null)
    const error = ref<string | null>(null)

    // 从配置文件获取当前版本
    const getCurrentVersion = (): string => {
        return VERSION
    }

    // 比较版本号
    const compareVersions = (current: string, latest: string): boolean => {
        const currentParts = current.replace('v', '').split('.').map(Number)
        const latestParts = latest.replace('v', '').split('.').map(Number)

        for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
            const currentPart = currentParts[i] || 0
            const latestPart = latestParts[i] || 0

            if (latestPart > currentPart) return true
            if (latestPart < currentPart) return false
        }
        return false
    }

    // 检查是否全局忽略更新
    const isUpdateDisabled = (): boolean => {
        try {
            const disabled = localStorage.getItem('toolbox_disable_update_check')
            return disabled === 'true'
        } catch {
            return false
        }
    }

    // 设置延迟提醒
    const setRemindLater = (hours: number): void => {
        if (versionInfo.value) {
            const remindTime = Date.now() + (hours * 60 * 60 * 1000)
            const remindInfo = {
                version: versionInfo.value.latestVersion,
                remindTime: remindTime
            }
            localStorage.setItem('toolbox_remind_later', JSON.stringify(remindInfo))
            versionInfo.value = null // 隐藏当前提醒
        }
    }

    // 检查是否在延迟提醒期间
    const isInRemindLaterPeriod = (version: string): boolean => {
        try {
            const remindInfo = localStorage.getItem('toolbox_remind_later')
            if (!remindInfo) return false

            const { version: remindVersion, remindTime } = JSON.parse(remindInfo)
            const now = Date.now()

            // 如果是同一个版本且还在延迟期间内
            if (remindVersion === version && now < remindTime) {
                return true
            }

            // 如果延迟期间已过或版本不同，清除延迟提醒
            if (now >= remindTime || remindVersion !== version) {
                localStorage.removeItem('toolbox_remind_later')
            }

            return false
        } catch {
            return false
        }
    }

    // 清除延迟提醒
    const clearRemindLater = (): void => {
        localStorage.removeItem('toolbox_remind_later')
    }

    // 设置全局忽略更新
    const setUpdateDisabled = (disabled: boolean): void => {
        try {
            if (disabled) {
                localStorage.setItem('toolbox_disable_update_check', 'true')
            } else {
                localStorage.removeItem('toolbox_disable_update_check')
            }
        } catch {
            // 忽略localStorage错误
        }
    }

    // 检查更新
    const checkForUpdates = async (): Promise<void> => {
        if (isChecking.value || isUpdateDisabled()) return

        isChecking.value = true
        error.value = null

        try {
            const response = await fetch(`https://api.github.com/repos/${PROJECT_INFO.repository}/releases/latest`)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const release: GitHubRelease = await response.json()

            // 跳过草稿和预发布版本
            if (release.draft || release.prerelease) {
                versionInfo.value = null
                return
            }

            const currentVersion = getCurrentVersion()
            const latestVersion = release.tag_name
            const hasUpdate = compareVersions(currentVersion, latestVersion)

            versionInfo.value = {
                hasUpdate,
                currentVersion,
                latestVersion,
                releaseUrl: release.html_url,
                releaseNotes: release.body || '',
                publishedAt: release.published_at
            }

            // 如果有更新，保存到localStorage以便后续显示
            if (hasUpdate) {
                // 检查是否在延迟提醒期间
                if (isInRemindLaterPeriod(latestVersion)) {
                    versionInfo.value = null
                    return
                }

                const updateInfo = {
                    ...versionInfo.value,
                    checkTime: Date.now()
                }
                localStorage.setItem('toolbox_update_info', JSON.stringify(updateInfo))
            }

        } catch (err) {
            console.error('检查更新失败:', err)
            error.value = err instanceof Error ? err.message : '检查更新失败'
        } finally {
            isChecking.value = false
        }
    }

    // 获取缓存的更新信息
    const getCachedUpdateInfo = (): VersionInfo | null => {
        try {
            const cached = localStorage.getItem('toolbox_update_info')
            if (!cached) return null

            const updateInfo = JSON.parse(cached)
            const checkTime = updateInfo.checkTime || 0
            const now = Date.now()

            // 缓存24小时有效
            if (now - checkTime > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('toolbox_update_info')
                return null
            }

            return updateInfo
        } catch {
            return null
        }
    }

    // 忽略当前版本的更新
    const ignoreCurrentUpdate = (): void => {
        if (versionInfo.value) {
            const ignoredVersions = getIgnoredVersions()
            ignoredVersions.push(versionInfo.value.latestVersion)
            localStorage.setItem('toolbox_ignored_versions', JSON.stringify(ignoredVersions))
            versionInfo.value = null
        }
    }

    // 获取已忽略的版本列表
    const getIgnoredVersions = (): string[] => {
        try {
            const ignored = localStorage.getItem('toolbox_ignored_versions')
            return ignored ? JSON.parse(ignored) : []
        } catch {
            return []
        }
    }

    // 检查版本是否已被忽略
    const isVersionIgnored = (version: string): boolean => {
        const ignoredVersions = getIgnoredVersions()
        return ignoredVersions.includes(version)
    }

    // 清除忽略的版本（用于测试或重置）
    const clearIgnoredVersions = (): void => {
        localStorage.removeItem('toolbox_ignored_versions')
    }

    // 初始化时检查缓存和更新
    onMounted(() => {
        // 如果全局禁用更新检查，直接返回
        if (isUpdateDisabled()) return

        // 先检查缓存
        const cached = getCachedUpdateInfo()
        if (cached && cached.hasUpdate && !isVersionIgnored(cached.latestVersion) && !isInRemindLaterPeriod(cached.latestVersion)) {
            versionInfo.value = cached
        }

        // 然后异步检查最新版本
        checkForUpdates()
    })

    return {
        isChecking,
        versionInfo,
        error,
        checkForUpdates,
        ignoreCurrentUpdate,
        clearIgnoredVersions,
        getCurrentVersion,
        isUpdateDisabled,
        setUpdateDisabled,
        setRemindLater,
        clearRemindLater
    }
}