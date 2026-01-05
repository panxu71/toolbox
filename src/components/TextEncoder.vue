<template>
    <div class="text-encoder">
        <PageHeader :title="cardTitle" @back="$emit('back')">
            <template #actions>
                <div class="encoding-selector">
                    <select v-model="selectedEncoding" class="encoding-select" @change="convertText">
                        <option value="base64">Base64</option>
                        <option value="url">URL编码</option>
                        <option value="html">HTML实体</option>
                        <option value="unicode">Unicode</option>
                        <option value="ascii">ASCII码</option>
                    </select>
                </div>
                <div class="header-actions">
                    <button class="action-btn-small" @click="copyTextResult" title="复制结果"
                        :disabled="!textOutput">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                    </button>
                    <button class="action-btn-small" @click="reverseConvert" title="反向转换"
                        :disabled="!textOutput">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="m3 16 4 4 4-4" />
                            <path d="M7 20V4" />
                            <path d="m21 8-4-4-4 4" />
                            <path d="M17 4v16" />
                        </svg>
                    </button>
                    <button class="action-btn-small" @click="clearOutput" title="清空结果" :disabled="!textOutput">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </template>
        </PageHeader>

        <div class="encoder-content">
            <div class="main-workspace">
                <div class="input-section">
                    <div class="section-header">
                        <h3>文本输入</h3>
                        <div class="quick-examples">
                            <ButtonGroup>
                                <button class="group-btn" @click="setExample('Hello World!')" title="基础文本示例">
                                    Hello
                                </button>
                                <button class="group-btn" @click="setExample('你好，世界！')" title="中文文本示例">
                                    中文
                                </button>
                                <button class="group-btn"
                                    @click="setExample('https://example.com/path?param=value&other=123')"
                                    title="URL链接示例">
                                    URL
                                </button>
                                <button class="group-btn"
                                    @click="setExample('<div class=&quot;container&quot;>Content</div>')"
                                    title="HTML代码示例">
                                    HTML
                                </button>
                            </ButtonGroup>
                        </div>
                    </div>
                    
                    <div class="text-editor">
                        <textarea v-model="textInput" class="text-input" placeholder="输入要转换的文本..."
                            @input="convertText"></textarea>
                    </div>
                    <div class="section-footer">
                        <div class="stats-info">
                            <span class="stat-item">{{ textStats.characters }} 字符</span>
                            <span class="stat-item">{{ textStats.bytes }} 字节</span>
                            <span class="stat-item">{{ textStats.lines }} 行</span>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>

                <div class="output-section">
                    <div class="section-header">
                        <h3>转换结果 ({{ getEncodingName() }})</h3>
                        <div class="header-placeholder"></div>
                    </div>
                    <div class="text-editor">
                        <textarea v-model="textOutput" class="text-output" readonly
                            placeholder="转换结果将显示在这里..."></textarea>
                    </div>
                    <div class="section-footer">
                        <div class="stats-info">
                            <span class="stat-item">{{ outputStats.characters }} 字符</span>
                            <span class="stat-item">{{ outputStats.bytes }} 字节</span>
                            <span class="stat-item compression" v-if="compressionRatio !== 0">
                                {{ compressionRatio > 0 ? '增加' : '减少' }} {{ Math.abs(compressionRatio) }}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="feature-description">
                <div class="description-content">
                    <div class="feature-item">
                        <strong>Base64编码：</strong>将文本转换为Base64格式，常用于数据传输
                    </div>
                    <div class="feature-item">
                        <strong>URL编码：</strong>将特殊字符转换为URL安全格式
                    </div>
                    <div class="feature-item">
                        <strong>HTML实体：</strong>将HTML特殊字符转换为实体编码
                    </div>
                    <div class="feature-item">
                        <strong>Unicode编码：</strong>显示字符的Unicode码点表示
                    </div>
                    <div class="feature-item">
                        <strong>ASCII码：</strong>显示字符对应的ASCII数值
                    </div>
                    <div class="feature-item">
                        <strong>反向转换：</strong>支持将编码结果转换回原始文本
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useNotification } from '../composables/useNotification'
import PageHeader from './common/PageHeader.vue'
import ButtonGroup from './common/ButtonGroup.vue'
import cardsConfig from '../config/cards.json'

defineEmits<{
    back: []
}>()

// 根据卡片ID获取标题
function getCardTitle(cardId: string): string {
    for (const categoryKey in cardsConfig.cards) {
        const cards = cardsConfig.cards[categoryKey as keyof typeof cardsConfig.cards]
        const card = cards.find((card: any) => card.id === cardId)
        if (card) {
            return card.title
        }
    }
    return cardId
}

// 使用页面标题管理
usePageTitle('text-encoder')
const cardTitle = getCardTitle('text-encoder')

// 使用公共通知系统
const { success: showSuccess, error: showError } = useNotification()

const textInput = ref('')
const textOutput = ref('')
const selectedEncoding = ref('base64')

// 文本统计
const textStats = computed(() => {
    const text = textInput.value
    return {
        characters: text.length,
        bytes: new Blob([text]).size,
        lines: text.split('\n').length
    }
})

const outputStats = computed(() => {
    const text = textOutput.value
    return {
        characters: text.length,
        bytes: new Blob([text]).size,
        lines: text.split('\n').length
    }
})

// 计算压缩率
const compressionRatio = computed(() => {
    if (!textStats.value.characters || !outputStats.value.characters) return 0
    const ratio = ((outputStats.value.characters - textStats.value.characters) / textStats.value.characters) * 100
    return Math.round(ratio)
})

// 获取编码名称
const getEncodingName = () => {
    const names = {
        base64: 'Base64',
        url: 'URL编码',
        html: 'HTML实体',
        unicode: 'Unicode',
        ascii: 'ASCII码'
    }
    return names[selectedEncoding.value as keyof typeof names] || '未知编码'
}

// 文本编码转换函数
const convertText = () => {
    if (!textInput.value) {
        textOutput.value = ''
        return
    }

    try {
        switch (selectedEncoding.value) {
            case 'base64':
                // 使用 TextEncoder 替代 deprecated escape/unescape
                const encoder = new TextEncoder()
                const data = encoder.encode(textInput.value)
                textOutput.value = btoa(String.fromCharCode(...data))
                break
            case 'url':
                textOutput.value = encodeURIComponent(textInput.value)
                break
            case 'html':
                textOutput.value = textInput.value
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;')
                break
            case 'unicode':
                textOutput.value = textInput.value
                    .split('')
                    .map(char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'))
                    .join('')
                break
            case 'ascii':
                textOutput.value = textInput.value
                    .split('')
                    .map(char => char.charCodeAt(0))
                    .join(' ')
                break
        }
    } catch (error) {
        textOutput.value = '转换失败'
        showError('转换失败')
    }
}

// 反向转换
const reverseConvert = () => {
    if (!textOutput.value) return

    try {
        let reversed = ''
        switch (selectedEncoding.value) {
            case 'base64':
                // 使用 TextDecoder 替代 deprecated escape/unescape
                const binaryString = atob(textOutput.value)
                const bytes = new Uint8Array(binaryString.length)
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i)
                }
                const decoder = new TextDecoder()
                reversed = decoder.decode(bytes)
                break
            case 'url':
                reversed = decodeURIComponent(textOutput.value)
                break
            case 'html':
                reversed = textOutput.value
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                break
            case 'unicode':
                reversed = textOutput.value.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
                    String.fromCharCode(parseInt(hex, 16))
                )
                break
            case 'ascii':
                reversed = textOutput.value
                    .split(' ')
                    .map(code => String.fromCharCode(parseInt(code)))
                    .join('')
                break
        }
        textInput.value = reversed
        showSuccess('反向转换完成')
    } catch (error) {
        showError('反向转换失败')
    }
}

// 复制文本结果
const copyTextResult = async () => {
    if (!textOutput.value) return

    try {
        await navigator.clipboard.writeText(textOutput.value)
        showSuccess('结果已复制到剪贴板')
    } catch (error) {
        showError('复制失败')
    }
}

// 清空输出
const clearOutput = () => {
    textOutput.value = ''
    showSuccess('输出已清空')
}

// 设置示例
const setExample = (text: string) => {
    textInput.value = text
    convertText()
    showSuccess('已设置示例文本')
}

// 初始化
convertText()
</script>

<style scoped>
.text-encoder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
}

.encoding-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.header-actions {
    display: flex;
    gap: 0.5rem;
}

.encoding-select {
    padding: 0.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.encoding-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-color-alpha);
}

.encoder-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    overflow: hidden;
}

.main-workspace {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    overflow: hidden;
    min-height: 400px;
}

.input-section,
.output-section {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.divider {
    background: var(--border-color);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 0.5rem;
    flex-shrink: 0;
    gap: 1rem;
    min-height: 3rem;
}

.section-header h3 {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
    color: var(--text-primary);
    white-space: nowrap;
}

.quick-examples {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.header-placeholder {
    height: 2rem;
    min-width: 1px;
}

.header-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn-small {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn-small:hover:not(:disabled) {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.action-btn-small:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.text-editor {
    flex: 1;
    position: relative;
    background: var(--bg-primary);
    border: none;
    border-radius: 0;
    overflow: hidden;
}

.text-input,
.text-output {
    width: 100%;
    height: 100%;
    padding: 1rem;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
    line-height: 1.5;
    resize: none;
    outline: none;
}

.text-input:focus {
    outline: none;
}

.section-footer {
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
    margin-top: 0.75rem;
    flex-shrink: 0;
}

.stats-info {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.stat-item {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.stat-item.compression {
    color: var(--success-color);
    font-weight: 600;
}

.feature-description {
    padding: 0.75rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    flex-shrink: 0;
}

.description-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.feature-item {
    font-size: 0.75rem;
    color: var(--text-secondary);
    line-height: 1.4;
}

.feature-item strong {
    color: var(--text-primary);
    font-weight: 600;
}

@media (max-width: 1024px) {
    .main-workspace {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1px 1fr;
        gap: 1rem;
        min-height: 300px;
    }

    .divider {
        height: 1px;
        width: 100%;
    }

    .description-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }

    .quick-examples-inline {
        flex-wrap: wrap;
    }

    :deep(.button-group) {
        flex-wrap: wrap;
    }
}

@media (max-width: 768px) {
    .encoder-content {
        padding: 1rem;
    }

    .main-workspace {
        min-height: 250px;
        gap: 0.75rem;
    }

    .description-content {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .header-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .quick-examples-inline {
        gap: 0.375rem;
    }

    :deep(.group-btn) {
        font-size: 0.6875rem;
        padding: 0.25rem 0.5rem;
        min-width: 50px;
    }
}
</style>