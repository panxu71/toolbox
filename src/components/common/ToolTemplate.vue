<template>
    <div class="tool-container">
        <!-- 使用通用头部组件 -->
        <PageHeader :title="title" @back="$emit('back')">
            <template #actions>
                <HeaderActionButton icon="clear" tooltip="清空" @click="clearAll" />
                <HeaderActionButton icon="copy" tooltip="复制结果" :disabled="!hasResult" @click="copyResult" />
                <HeaderActionButton icon="download" tooltip="下载文件" :disabled="!hasResult" @click="downloadResult" />
            </template>
        </PageHeader>

        <div class="tool-content">
            <!-- 输入区域 -->
            <div class="input-section">
                <div class="section-header">
                    <h3>{{ inputTitle || '输入' }}</h3>
                    <div class="section-actions">
                        <slot name="input-actions"></slot>
                    </div>
                </div>
                <div class="input-content">
                    <slot name="input"></slot>
                </div>
            </div>

            <!-- 输出区域 -->
            <div class="output-section">
                <div class="section-header">
                    <h3>{{ outputTitle || '结果' }}</h3>
                    <div class="section-info">
                        <slot name="output-info"></slot>
                    </div>
                </div>
                <div class="output-content">
                    <slot name="output"></slot>
                </div>
            </div>
        </div>

        <!-- 消息提示 -->
        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageTitle } from '../../composables/usePageTitle'
import { useClipboard } from '../../composables/useClipboard'
import { useDownload } from '../../composables/useDownload'
import { useMessage } from '../../composables/useMessage'
import PageHeader from './PageHeader.vue'
import HeaderActionButton from './HeaderActionButton.vue'

interface Props {
    toolId: string
    title: string
    inputTitle?: string
    outputTitle?: string
    resultContent?: string
    filename?: string
    fileExtension?: string
}

const props = withDefaults(defineProps<Props>(), {
    inputTitle: '输入',
    outputTitle: '结果',
    filename: 'result',
    fileExtension: 'txt'
})

defineEmits<{
    back: []
    clear: []
    copy: []
    download: []
}>()

// 使用页面标题管理
usePageTitle(props.toolId)

// 使用功能 composables
const { copyToClipboard } = useClipboard()
const { downloadText } = useDownload()
const { message, messageType, showMessage } = useMessage()

// 计算属性
const hasResult = computed(() => {
    return !!(props.resultContent && props.resultContent.trim())
})

// 方法
const clearAll = () => {
    $emit('clear')
    showMessage('已清空', 'success')
}

const copyResult = async () => {
    if (!props.resultContent) return

    const success = await copyToClipboard(props.resultContent)
    if (success) {
        showMessage('已复制到剪贴板', 'success')
        $emit('copy')
    } else {
        showMessage('复制失败', 'error')
    }
}

const downloadResult = () => {
    if (!props.resultContent) return

    const success = downloadText(props.resultContent, props.filename, props.fileExtension)
    if (success) {
        showMessage(`${props.filename}.${props.fileExtension} 已下载`, 'success')
        $emit('download')
    } else {
        showMessage('下载失败', 'error')
    }
}
</script>

<style scoped>
.tool-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.tool-content {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border-color);
    min-height: 0;
}

.input-section,
.output-section {
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
    min-height: 60px;
    box-sizing: border-box;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.section-actions,
.section-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-muted);
}

.input-content,
.output-content {
    flex: 1;
    overflow: auto;
}

.message-toast {
    position: absolute;
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    z-index: 100;
    animation: slideUp 0.3s ease-out;
}

.message-toast.success {
    background: #10b981;
    color: white;
}

.message-toast.error {
    background: #ef4444;
    color: white;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .tool-content {
        grid-template-columns: 1fr;
    }
}
</style>