<template>
    <div class="excel-json-converter">
        <div class="converter-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="converter-title">Excel ⇄ JSON 互转</h2>
            <div class="converter-actions">
                <div class="mode-toggle">
                    <button 
                        class="mode-btn" 
                        :class="{ active: mode === 'json-to-excel' }"
                        @click="switchMode('json-to-excel')"
                    >
                        JSON → Excel
                    </button>
                    <button 
                        class="mode-btn" 
                        :class="{ active: mode === 'excel-to-json' }"
                        @click="switchMode('excel-to-json')"
                    >
                        Excel → JSON
                    </button>
                </div>
                <button class="action-btn" @click="clearAll" title="清空">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- JSON转Excel模式 -->
        <div v-if="mode === 'json-to-excel'" class="converter-content">
            <div class="input-section">
                <div class="section-header">
                    <h3>JSON数据输入</h3>
                    <div class="section-actions">
                        <div class="button-group">
                            <button class="group-btn" @click="loadExample(1)">用户数据</button>
                            <button class="group-btn" @click="loadExample(2)">销售数据</button>
                            <button class="group-btn" @click="parseJson">解析JSON</button>
                        </div>
                    </div>
                </div>
                <textarea v-model="inputJson" class="json-input" placeholder="请输入JSON数据..."
                    @input="onInputChange"></textarea>
                <div v-if="inputError" class="error-message">
                    {{ inputError }}
                </div>
            </div>

            <div class="output-section">
                <div class="section-header">
                    <h3>导出设置</h3>
                    <div class="export-actions">
                        <select v-model="selectedFormat" class="format-select">
                            <option value="xlsx">Excel (.xlsx)</option>
                            <option value="xls">Excel 97-2003 (.xls)</option>
                            <option value="csv">CSV (.csv)</option>
                        </select>
                        <button class="export-btn" @click="exportData"
                            :disabled="!parsedData || parsedData.length === 0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            导出文件
                        </button>
                    </div>
                </div>

                <div class="preview-container">
                    <div v-if="parsedData && parsedData.length > 0" class="data-preview">
                        <div class="preview-info">
                            <span class="info-item">{{ parsedData.length }} 行数据</span>
                            <span class="info-item">{{ Object.keys(parsedData[0] || {}).length }} 列</span>
                        </div>

                        <div class="table-container">
                            <table class="preview-table">
                                <thead>
                                    <tr>
                                        <th v-for="column in columns" :key="column">{{ column }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in previewRows" :key="index">
                                        <td v-for="column in columns" :key="column">
                                            {{ formatCellValue(row[column]) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div v-if="parsedData.length > 5" class="more-rows">
                                还有 {{ parsedData.length - 5 }} 行数据...
                            </div>
                        </div>
                    </div>

                    <div v-else class="preview-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <p>解析JSON后将显示数据预览</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Excel转JSON模式 -->
        <div v-else class="converter-content">
            <div class="input-section">
                <div class="section-header">
                    <h3>Excel文件上传</h3>
                    <div class="section-actions">
                        <input 
                            ref="fileInput" 
                            type="file" 
                            accept=".xlsx,.xls,.csv" 
                            @change="handleFileUpload"
                            style="display: none"
                        />
                        <button class="upload-btn" @click="triggerFileInput">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-15" />
                                <polyline points="17,10 12,5 7,10" />
                                <line x1="12" y1="5" x2="12" y2="15" />
                            </svg>
                            选择文件
                        </button>
                    </div>
                </div>
                
                <div class="upload-area" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
                    <div v-if="!uploadedFile" class="upload-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <h4>拖拽Excel文件到此处</h4>
                        <p>或点击"选择文件"按钮</p>
                        <p class="file-types">支持 .xlsx, .xls, .csv 格式</p>
                    </div>
                    
                    <div v-else class="file-info">
                        <div class="file-details">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                            </svg>
                            <div class="file-text">
                                <div class="file-name">{{ uploadedFile.name }}</div>
                                <div class="file-size">{{ formatFileSize(uploadedFile.size) }}</div>
                            </div>
                        </div>
                        <button class="remove-file-btn" @click="removeFile" title="移除文件">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div v-if="uploadError" class="error-message">
                    {{ uploadError }}
                </div>
            </div>

            <div class="output-section">
                <div class="section-header">
                    <h3>JSON输出</h3>
                    <div class="export-actions">
                        <button class="copy-btn" @click="copyJson" :disabled="!convertedJson">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                            复制JSON
                        </button>
                        <button class="download-btn" @click="downloadJson" :disabled="!convertedJson">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7,10 12,15 17,10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            下载JSON
                        </button>
                    </div>
                </div>

                <div class="json-output-container">
                    <div v-if="convertedJson" class="json-output">
                        <pre class="json-text">{{ convertedJson }}</pre>
                    </div>
                    <div v-else class="output-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <polyline points="16,18 22,12 16,6" />
                            <polyline points="8,6 2,12 8,18" />
                        </svg>
                        <p>上传Excel文件后将显示JSON数据</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="message" class="message-toast" :class="messageType">
            {{ message }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'
import { setPageTitle, restoreDefaultTitle } from '../utils/cardTitles'

defineEmits<{
    back: []
}>()

// 模式切换
const mode = ref<'json-to-excel' | 'excel-to-json'>('json-to-excel')

// JSON转Excel相关
const inputJson = ref('')
const inputError = ref('')
const parsedData = ref<any[]>([])
const selectedFormat = ref<'xlsx' | 'xls' | 'csv'>('xlsx')

// Excel转JSON相关
const uploadedFile = ref<File | null>(null)
const uploadError = ref('')
const convertedJson = ref('')

// 通用
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// 计算列名
const columns = computed(() => {
    if (!parsedData.value || parsedData.value.length === 0) return []

    const allKeys = new Set<string>()
    parsedData.value.forEach(row => {
        Object.keys(row).forEach(key => allKeys.add(key))
    })

    return Array.from(allKeys)
})

// 预览行数据（只显示前5行）
const previewRows = computed(() => {
    return parsedData.value.slice(0, 5)
})

// 切换模式
const switchMode = (newMode: 'json-to-excel' | 'excel-to-json') => {
    mode.value = newMode
    clearAll()
}

// 输入变化时清除错误
const onInputChange = () => {
    inputError.value = ''
}

// 解析JSON数据
const parseJson = () => {
    if (!inputJson.value.trim()) {
        showMessage('请先输入JSON数据', 'error')
        return
    }

    try {
        const parsed = JSON.parse(inputJson.value)

        // 处理不同类型的JSON数据
        if (Array.isArray(parsed)) {
            // 如果是数组，直接使用
            parsedData.value = parsed
        } else if (typeof parsed === 'object' && parsed !== null) {
            // 如果是对象，转换为数组
            if (Object.keys(parsed).length > 0) {
                // 检查是否所有值都是对象（可能是以ID为key的数据）
                const values = Object.values(parsed)
                if (values.every(v => typeof v === 'object' && v !== null)) {
                    parsedData.value = values.map((v, i) => ({
                        id: Object.keys(parsed)[i],
                        ...v as object
                    }))
                } else {
                    // 否则将对象转换为键值对数组
                    parsedData.value = Object.entries(parsed).map(([key, value]) => ({
                        key,
                        value: typeof value === 'object' ? JSON.stringify(value) : value
                    }))
                }
            } else {
                parsedData.value = []
            }
        } else {
            // 基本类型，包装成对象
            parsedData.value = [{ value: parsed }]
        }

        inputError.value = ''
        showMessage(`成功解析 ${parsedData.value.length} 行数据`, 'success')
    } catch (error) {
        inputError.value = `JSON格式错误: ${(error as Error).message}`
        parsedData.value = []
        showMessage('JSON格式错误', 'error')
    }
}

// 格式化单元格值
const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
}

// 导出数据
const exportData = () => {
    if (!parsedData.value || parsedData.value.length === 0) {
        showMessage('没有数据可导出', 'error')
        return
    }

    try {
        // 创建工作簿
        const wb = XLSX.utils.book_new()

        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(parsedData.value)

        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

        // 生成文件名
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        const filename = `json-export-${timestamp}.${selectedFormat.value}`

        // 导出文件
        XLSX.writeFile(wb, filename)

        showMessage(`文件已导出: ${filename}`, 'success')
    } catch (error) {
        console.error('Export error:', error)
        showMessage('导出失败', 'error')
    }
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        processFile(file)
    }
}

// 处理拖拽上传
const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer?.files[0]
    if (file) {
        processFile(file)
    }
}

// 处理文件
const processFile = (file: File) => {
    // 检查文件类型
    const fileExtension = file.name.toLowerCase().split('.').pop()
    const allowedExtensions = ['xlsx', 'xls', 'csv']
    
    if (!allowedExtensions.includes(fileExtension || '')) {
        uploadError.value = '不支持的文件格式，请选择 .xlsx, .xls 或 .csv 文件'
        return
    }

    uploadedFile.value = file
    uploadError.value = ''
    
    // 读取文件
    const reader = new FileReader()
    reader.onload = (e) => {
        try {
            const data = e.target?.result
            let workbook: XLSX.WorkBook

            if (fileExtension === 'csv') {
                // 处理CSV文件
                workbook = XLSX.read(data, { type: 'string' })
            } else {
                // 处理Excel文件
                workbook = XLSX.read(data, { type: 'array' })
            }

            // 获取第一个工作表
            const firstSheetName = workbook.SheetNames[0]
            if (!firstSheetName) {
                throw new Error('工作表为空')
            }
            
            const worksheet = workbook.Sheets[firstSheetName]
            if (!worksheet) {
                throw new Error('工作表为空')
            }

            // 转换为JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,  // 使用数组格式
                defval: ''  // 空单元格默认值
            }) as any[][]

            // 处理数据：第一行作为表头
            if (jsonData.length > 0) {
                const headers = jsonData[0] as string[]
                const rows = jsonData.slice(1)
                
                const result = rows.map(row => {
                    const obj: any = {}
                    headers.forEach((header, index) => {
                        obj[header || `Column${index + 1}`] = row[index] || ''
                    })
                    return obj
                }).filter(row => Object.values(row).some(val => val !== '')) // 过滤空行

                convertedJson.value = JSON.stringify(result, null, 2)
                showMessage(`成功转换 ${result.length} 行数据`, 'success')
            } else {
                convertedJson.value = '[]'
                showMessage('文件为空或无有效数据', 'error')
            }
        } catch (error) {
            console.error('File processing error:', error)
            uploadError.value = `文件处理失败: ${(error as Error).message}`
            convertedJson.value = ''
        }
    }

    if (fileExtension === 'csv') {
        reader.readAsText(file, 'UTF-8')
    } else {
        reader.readAsArrayBuffer(file)
    }
}

// 触发文件输入
const triggerFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
        fileInput.click()
    }
}

// 移除文件
const removeFile = () => {
    uploadedFile.value = null
    uploadError.value = ''
    convertedJson.value = ''
    // 清空文件输入
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
        fileInput.value = ''
    }
}

// 复制JSON
const copyJson = async () => {
    if (!convertedJson.value) return

    try {
        await navigator.clipboard.writeText(convertedJson.value)
        showMessage('JSON已复制到剪贴板', 'success')
    } catch (error) {
        showMessage('复制失败', 'error')
    }
}

// 下载JSON
const downloadJson = () => {
    if (!convertedJson.value) return

    try {
        const blob = new Blob([convertedJson.value], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        a.href = url
        a.download = `excel-to-json-${timestamp}.json`
        a.click()
        
        URL.revokeObjectURL(url)
        showMessage('JSON文件已下载', 'success')
    } catch (error) {
        showMessage('下载失败', 'error')
    }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// 清空所有内容
const clearAll = () => {
    inputJson.value = ''
    inputError.value = ''
    parsedData.value = []
    uploadedFile.value = null
    uploadError.value = ''
    convertedJson.value = ''
    showMessage('已清空', 'success')
}

// 加载示例数据
const loadExample = (exampleNumber: number) => {
    const examples = {
        1: {
            name: "用户数据",
            data: [
                {
                    "id": 1,
                    "姓名": "张三",
                    "邮箱": "zhangsan@example.com",
                    "年龄": 28,
                    "部门": "技术部",
                    "入职日期": "2022-01-15",
                    "薪资": 15000
                },
                {
                    "id": 2,
                    "姓名": "李四",
                    "邮箱": "lisi@example.com",
                    "年龄": 32,
                    "部门": "市场部",
                    "入职日期": "2021-06-20",
                    "薪资": 12000
                },
                {
                    "id": 3,
                    "姓名": "王五",
                    "邮箱": "wangwu@example.com",
                    "年龄": 25,
                    "部门": "设计部",
                    "入职日期": "2023-03-10",
                    "薪资": 10000
                }
            ]
        },
        2: {
            name: "销售数据",
            data: [
                {
                    "订单号": "ORD001",
                    "客户名称": "ABC公司",
                    "产品名称": "MacBook Pro",
                    "数量": 2,
                    "单价": 12999,
                    "总金额": 25998,
                    "订单日期": "2024-12-01",
                    "状态": "已完成"
                },
                {
                    "订单号": "ORD002",
                    "客户名称": "XYZ企业",
                    "产品名称": "iPhone 15",
                    "数量": 5,
                    "单价": 7999,
                    "总金额": 39995,
                    "订单日期": "2024-12-02",
                    "状态": "处理中"
                },
                {
                    "订单号": "ORD003",
                    "客户名称": "DEF集团",
                    "产品名称": "iPad Air",
                    "数量": 3,
                    "单价": 4599,
                    "总金额": 13797,
                    "订单日期": "2024-12-03",
                    "状态": "已发货"
                }
            ]
        }
    }

    const example = examples[exampleNumber as keyof typeof examples]
    if (example) {
        inputJson.value = JSON.stringify(example.data, null, 2)
        parseJson()
        showMessage(`已加载${example.name}示例`, 'success')
    }
}

// 显示消息
const showMessage = (text: string, type: 'success' | 'error') => {
    message.value = text
    messageType.value = type
    setTimeout(() => {
        message.value = ''
    }, 3000)
}

// 页面标题管理
onMounted(() => {
    setPageTitle('json-to-excel')
})

onUnmounted(() => {
    restoreDefaultTitle()
})
</script>

<style scoped>
.excel-json-converter {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
}

.converter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-secondary);
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: var(--transition);
    font-size: 14px;
}

.back-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.converter-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
}

.converter-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mode-toggle {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--bg-primary);
}

.mode-btn {
    padding: 8px 16px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    border-right: 1px solid var(--border-color);
}

.mode-btn:last-child {
    border-right: none;
}

.mode-btn.active {
    background: var(--primary-color);
    color: white;
}

.mode-btn:hover:not(.active) {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.action-btn {
    width: 36px;
    height: 36px;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.action-btn:hover {
    background: var(--border-color);
    color: var(--text-primary);
}

.converter-content {
    flex: 1;
    display: grid;
    grid-template-columns: 4fr 6fr;
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
    min-height: 72px;
    box-sizing: border-box;
}

.section-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.section-actions,
.export-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.button-group {
    display: inline-flex;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    overflow: hidden;
}

.group-btn {
    padding: 6px 12px;
    background: var(--bg-primary);
    border: none;
    border-right: 1px solid var(--border-color);
    border-radius: 0;
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.group-btn:first-child {
    border-top-left-radius: var(--radius-sm);
    border-bottom-left-radius: var(--radius-sm);
}

.group-btn:last-child {
    border-top-right-radius: var(--radius-sm);
    border-bottom-right-radius: var(--radius-sm);
    border-right: none;
}

.group-btn:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.group-btn:active {
    background: var(--bg-tertiary);
}

.upload-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--primary-color);
    color: white;
    border: 1px solid var(--primary-color);
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.upload-btn:hover {
    background: var(--primary-color-dark, #4f46e5);
}

.format-select {
    padding: 6px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 12px;
    cursor: pointer;
}

.export-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #059669;
    color: white;
    border: 1px solid #059669;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.export-btn:hover:not(:disabled) {
    background: #047857;
}

.export-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.copy-btn,
.download-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.copy-btn:hover:not(:disabled),
.download-btn:hover:not(:disabled) {
    background: var(--border-color);
}

.copy-btn:disabled,
.download-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.json-input {
    flex: 1;
    padding: 20px;
    border: none;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    outline: none;
}

.json-input::placeholder {
    color: var(--text-muted);
}

.upload-area {
    flex: 1;
    margin: 20px;
    border: 2px dashed var(--border-color);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    background: var(--bg-secondary);
}

.upload-area:hover {
    border-color: var(--primary-color);
    background: var(--bg-tertiary);
}

.upload-placeholder {
    text-align: center;
    padding: 40px 20px;
    color: var(--text-muted);
}

.upload-placeholder svg {
    margin-bottom: 16px;
    opacity: 0.5;
}

.upload-placeholder h4 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
}

.upload-placeholder p {
    margin: 4px 0;
    font-size: 14px;
}

.file-types {
    font-size: 12px;
    opacity: 0.7;
}

.file-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    margin: 20px;
}

.file-details {
    display: flex;
    align-items: center;
    gap: 12px;
}

.file-text {
    display: flex;
    flex-direction: column;
}

.file-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
}

.file-size {
    font-size: 12px;
    color: var(--text-muted);
}

.remove-file-btn {
    width: 24px;
    height: 24px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.remove-file-btn:hover {
    background: var(--error-color);
    color: white;
}

.json-output-container {
    flex: 1;
    overflow: auto;
    padding: 20px;
}

.json-output {
    height: 100%;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: auto;
}

.json-text {
    margin: 0;
    padding: 20px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
    color: var(--text-primary);
    background: var(--bg-secondary);
    white-space: pre-wrap;
    word-wrap: break-word;
}

.output-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted);
    text-align: center;
}

.output-placeholder svg {
    margin-bottom: 16px;
    opacity: 0.5;
}

.error-message {
    padding: 12px 20px;
    background: rgba(239, 68, 68, 0.1);
    border-top: 1px solid rgba(239, 68, 68, 0.2);
    color: #ef4444;
    font-size: 14px;
}

.preview-container {
    flex: 1;
    overflow: auto;
    padding: 20px;
}

.data-preview {
    height: 100%;
}

.preview-info {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

.info-item {
    padding: 4px 8px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    font-size: 12px;
    color: var(--text-muted);
}

.table-container {
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    overflow: hidden;
}

.preview-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}

.preview-table th {
    background: var(--bg-secondary);
    padding: 12px 8px;
    text-align: left;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
}

.preview-table td {
    padding: 10px 8px;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-secondary);
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.preview-table tr:last-child td {
    border-bottom: none;
}

.more-rows {
    padding: 12px;
    text-align: center;
    color: var(--text-muted);
    font-size: 12px;
    background: var(--bg-secondary);
}

.preview-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-muted);
    text-align: center;
}

.preview-placeholder svg {
    margin-bottom: 16px;
    opacity: 0.5;
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
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .converter-content {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }
    
    .converter-header {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }
    
    .mode-toggle {
        justify-content: center;
    }
}
</style>