<template>
    <div class="json-node">
        <!-- 对象或数组节点 -->
        <div v-if="isObject || isArray" class="json-branch">
            <div class="json-line" @mouseenter="showActions = true" @mouseleave="showActions = false">
                <span class="json-indent" :style="{ width: level * 20 + 'px' }"></span>
                <span class="json-toggle" :class="{ collapsed: !expanded }" @click="toggle">
                    {{ expanded ? '▼' : '▶' }}
                </span>
                <span v-if="nodeKey !== null" class="json-key">"{{ nodeKey }}":</span>
                <span class="json-bracket">{{ isArray ? '[' : '{' }}</span>
                <span v-if="!expanded" class="json-collapsed-info">
                    {{ isArray ? `${arrayLength} items` : `${objectKeys.length} keys` }}
                </span>
                <span v-if="!expanded" class="json-bracket">{{ isArray ? ']' : '}' }}</span>

                <!-- 操作按钮 -->
                <div v-if="showActions" class="json-actions">
                    <button class="action-btn copy-btn" @click.stop="copyNode" title="复制节点">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                    </button>
                    <button class="action-btn delete-btn" @click.stop="deleteNode" title="删除节点">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- 展开的子节点 -->
            <template v-if="expanded">
                <JsonTreeNode v-for="(value, key) in nodeData" :key="key" :data="value" :node-key="key"
                    :level="level + 1" @toggle="emit('toggle')" @copy="emit('copy', $event)"
                    @delete="emit('delete', $event)" />
                <div class="json-line">
                    <span class="json-indent" :style="{ width: level * 20 + 'px' }"></span>
                    <span class="json-bracket">{{ isArray ? ']' : '}' }}</span>
                    <span v-if="level === 0" class="json-comma">,</span>
                </div>
            </template>
        </div>

        <!-- 基本类型节点 -->
        <div v-else class="json-leaf">
            <div class="json-line" @mouseenter="showActions = true" @mouseleave="showActions = false">
                <span class="json-indent" :style="{ width: level * 20 + 'px' }"></span>
                <span v-if="nodeKey !== null" class="json-key">"{{ nodeKey }}":</span>
                <span class="json-value" :class="valueType">{{ formattedValue }}</span>
                <span class="json-comma">,</span>

                <!-- 操作按钮 -->
                <div v-if="showActions" class="json-actions">
                    <button class="action-btn copy-btn" @click.stop="copyNode" title="复制值">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                    </button>
                    <button class="action-btn delete-btn" @click.stop="deleteNode" title="删除属性">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
    data: any
    nodeKey?: string | number | null
    level: number
}

const props = withDefaults(defineProps<Props>(), {
    nodeKey: null
})

const emit = defineEmits<{
    toggle: []
    copy: [{ key: string | number | null, value: any, path: string }]
    delete: [{ key: string | number | null, path: string }]
}>()

const expanded = ref(true)
const showActions = ref(false)

// 计算属性
const isObject = computed(() => {
    return props.data !== null && typeof props.data === 'object' && !Array.isArray(props.data)
})

const isArray = computed(() => {
    return Array.isArray(props.data)
})

const nodeData = computed(() => {
    return props.data
})

const arrayLength = computed(() => {
    return isArray.value ? props.data.length : 0
})

const objectKeys = computed(() => {
    return isObject.value ? Object.keys(props.data) : []
})

const valueType = computed(() => {
    if (props.data === null) return 'null'
    if (typeof props.data === 'string') return 'string'
    if (typeof props.data === 'number') return 'number'
    if (typeof props.data === 'boolean') return 'boolean'
    return 'unknown'
})

const formattedValue = computed(() => {
    if (props.data === null) return 'null'
    if (typeof props.data === 'string') return `"${props.data}"`
    if (typeof props.data === 'boolean') return props.data.toString()
    return props.data
})

// 方法
const toggle = () => {
    expanded.value = !expanded.value
    emit('toggle')
}

// 复制节点
const copyNode = async () => {
    const path = generatePath()
    const value = isObject.value || isArray.value ? props.data : props.data

    emit('copy', {
        key: props.nodeKey,
        value: value,
        path: path
    })
}

// 删除节点
const deleteNode = () => {
    const path = generatePath()

    emit('delete', {
        key: props.nodeKey,
        path: path
    })
}

// 生成节点路径
const generatePath = (): string => {
    if (props.nodeKey === null) return 'root'
    return props.nodeKey.toString()
}
</script>

<style scoped>
.json-node {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
}

.json-line {
    display: flex;
    align-items: center;
    min-height: 21px;
    padding: 1px 0;
    position: relative;
    cursor: pointer;
}

.json-line:hover {
    background: rgba(0, 0, 0, 0.05);
}

.json-actions {
    position: absolute;
    right: 8px;
    display: flex;
    gap: 4px;
    background: var(--bg-primary);
    padding: 2px;
    border-radius: var(--radius-sm);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;
}

.action-btn {
    width: 20px;
    height: 20px;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.copy-btn {
    background: #e3f2fd;
    color: #1976d2;
}

.copy-btn:hover {
    background: #bbdefb;
}

.delete-btn {
    background: #ffebee;
    color: #d32f2f;
}

.delete-btn:hover {
    background: #ffcdd2;
}

.json-indent {
    flex-shrink: 0;
}

.json-toggle {
    width: 16px;
    color: var(--text-muted);
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s ease;
}

.json-toggle.collapsed {
    transform: rotate(-90deg);
}

.json-key {
    color: #0969da;
    margin-right: 4px;
}

.json-bracket {
    color: var(--text-primary);
    font-weight: bold;
}

.json-collapsed-info {
    color: var(--text-muted);
    font-style: italic;
    margin: 0 8px;
}

.json-value {
    margin-left: 4px;
}

.json-value.string {
    color: #032f62;
}

.json-value.number {
    color: #0550ae;
}

.json-value.boolean {
    color: #8250df;
}

.json-value.null {
    color: #6f42c1;
}

.json-comma {
    color: var(--text-muted);
}

.json-leaf .json-line {
    cursor: pointer;
}

.json-leaf .json-line:hover {
    background: rgba(0, 0, 0, 0.05);
}
</style>