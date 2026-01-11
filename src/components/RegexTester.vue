<template>
  <div class="regex-tester-wrapper">
    <PageHeader title="正则表达式测试" @back="$emit('back')">
      <template #actions>
        <HeaderActionButton
          v-if="regexPattern"
          icon="copy"
          tooltip="复制正则表达式"
          @click="copyRegex"
        />
        <HeaderActionButton
          v-if="regexPattern"
          icon="clear"
          tooltip="清空正则表达式"
          @click="clearRegex"
        />
      </template>
    </PageHeader>

    <div class="regex-tester-content">
      <!-- 主要内容区域：左右布局 -->
      <div class="main-content">
        <!-- 左侧：输入和结果区域 -->
        <div class="left-section">
          <!-- 正则表达式输入 -->
          <div class="regex-input-section">
            <h3 class="section-title">正则表达式</h3>
            
            <div class="regex-input-wrapper">
              <div class="regex-input-container">
                <span class="regex-delimiter">/</span>
                <input 
                  v-model="regexPattern" 
                  class="regex-input"
                  placeholder="输入正则表达式"
                  @input="testRegex"
                />
                <span class="regex-delimiter">/</span>
                <input 
                  v-model="regexFlags" 
                  class="flags-input"
                  placeholder="flags"
                  maxlength="6"
                  @input="testRegex"
                />
              </div>
              <div class="regex-hint">
                <span>常用标志：</span>
                <button 
                  v-for="flag in commonFlags" 
                  :key="flag.flag"
                  :class="['flag-btn', { active: regexFlags.includes(flag.flag) }]"
                  @click="toggleFlag(flag.flag)"
                  :title="flag.description"
                >
                  {{ flag.flag }}
                </button>
              </div>
            </div>
          </div>

          <!-- 测试文本输入 -->
          <div class="test-text-section">
            <h4 class="subsection-title">测试文本</h4>
            <textarea 
              v-model="testText" 
              class="test-textarea"
              placeholder="输入要测试的文本内容..."
              rows="6"
              @input="testRegex"
            ></textarea>
          </div>

          <!-- 匹配状态 -->
          <div class="match-status">
            <div :class="['status-indicator', matchStatus.type]">
              <span class="status-icon">{{ matchStatus.icon }}</span>
              <span class="status-text">{{ matchStatus.text }}</span>
            </div>
          </div>

          <!-- 匹配结果列表 -->
          <div v-if="matches.length > 0" class="matches-list">
            <h4 class="subsection-title">匹配详情</h4>
            <div class="matches-table-container">
              <table class="matches-table">
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>匹配内容</th>
                    <th>位置</th>
                    <th>分组</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(match, index) in matches" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td class="match-content-cell">{{ match[0] }}</td>
                    <td class="match-position-cell">{{ getMatchPosition(match) }}</td>
                    <td class="match-groups-cell">
                      <span v-if="match.length > 1" class="groups-info">
                        {{ match.slice(1).map((group, i) => `组${i+1}: ${group || '(空)'}`).join(', ') }}
                      </span>
                      <span v-else class="no-groups">无</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 高亮显示的文本 -->
          <div v-if="testText" class="highlighted-text">
            <h4 class="subsection-title">高亮显示</h4>
            <div class="highlight-container" v-html="highlightedText"></div>
          </div>
        </div>

        <!-- 右侧：正则示例区域 -->
        <div class="right-section">
          <h3 class="section-title">常用正则表达式</h3>
          
          <div class="examples-grid">
            <button 
              v-for="example in regexExamples.common" 
              :key="example.name"
              class="example-btn" 
              @click="setExample(example)"
              :title="example.description"
            >
              <div class="example-name">{{ example.name }}</div>
            </button>
          </div>
        </div>
      </div>

      <!-- 正则表达式参考 -->
      <div class="reference-section">
        <h3 class="section-title">正则表达式参考</h3>
        <div class="reference-content">
          <div class="reference-group">
            <h4>基本字符</h4>
            <div class="reference-list">
              <div class="reference-item">
                <code>.</code>
                <span>匹配任意单个字符（除换行符）</span>
              </div>
              <div class="reference-item">
                <code>\d</code>
                <span>匹配数字 [0-9]</span>
              </div>
              <div class="reference-item">
                <code>\w</code>
                <span>匹配字母、数字、下划线 [a-zA-Z0-9_]</span>
              </div>
              <div class="reference-item">
                <code>\s</code>
                <span>匹配空白字符（空格、制表符、换行符）</span>
              </div>
            </div>
          </div>

          <div class="reference-group">
            <h4>量词</h4>
            <div class="reference-list">
              <div class="reference-item">
                <code>*</code>
                <span>匹配0次或多次</span>
              </div>
              <div class="reference-item">
                <code>+</code>
                <span>匹配1次或多次</span>
              </div>
              <div class="reference-item">
                <code>?</code>
                <span>匹配0次或1次</span>
              </div>
              <div class="reference-item">
                <code>{n,m}</code>
                <span>匹配n到m次</span>
              </div>
            </div>
          </div>

          <div class="reference-group">
            <h4>位置锚点</h4>
            <div class="reference-list">
              <div class="reference-item">
                <code>^</code>
                <span>匹配行的开始</span>
              </div>
              <div class="reference-item">
                <code>$</code>
                <span>匹配行的结束</span>
              </div>
              <div class="reference-item">
                <code>\b</code>
                <span>匹配单词边界</span>
              </div>
            </div>
          </div>

          <div class="reference-group">
            <h4>字符类</h4>
            <div class="reference-list">
              <div class="reference-item">
                <code>[abc]</code>
                <span>匹配a、b或c中的任意一个</span>
              </div>
              <div class="reference-item">
                <code>[^abc]</code>
                <span>匹配除a、b、c之外的任意字符</span>
              </div>
              <div class="reference-item">
                <code>[a-z]</code>
                <span>匹配小写字母a到z</span>
              </div>
            </div>
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
import HeaderActionButton from './common/HeaderActionButton.vue'

defineEmits<{
  back: []
}>()

// 使用页面标题管理
usePageTitle('regex-tester')

// 使用通知系统
const { success: showSuccess, error: showError } = useNotification()

const regexPattern = ref('')
const regexFlags = ref('g')
const testText = ref('')

// 匹配结果
const matches = ref<RegExpMatchArray[]>([])
const isValidRegex = ref(true)
const errorMessage = ref('')

// 常用标志
const commonFlags = [
  { flag: 'g', description: '全局匹配' },
  { flag: 'i', description: '忽略大小写' },
  { flag: 'm', description: '多行模式' },
  { flag: 's', description: '单行模式（.匹配换行符）' },
  { flag: 'u', description: 'Unicode模式' },
  { flag: 'y', description: '粘性匹配' }
]

// 正则表达式示例
const regexExamples = {
  common: [
    { name: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: '匹配邮箱地址' },
    { name: '手机号', pattern: '1[3-9]\\d{9}', description: '匹配中国手机号' },
    { name: '身份证', pattern: '[1-9]\\d{5}(18|19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[0-9Xx]', description: '匹配18位身份证号' },
    { name: '银行卡', pattern: '[1-9]\\d{12,18}', description: '匹配银行卡号' },
    { name: 'IPv4', pattern: '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)', description: '匹配IPv4地址' },
    { name: 'IPv6', pattern: '(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}', description: '匹配IPv6地址' },
    { name: 'QQ号', pattern: '[1-9][0-9]{4,10}', description: '匹配QQ号码' },
    { name: '强密码', pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}', description: '匹配强密码' },
    { name: '邮政编码', pattern: '[1-9]\\d{5}(?!\\d)', description: '匹配中国邮政编码' },
    { name: '微信号', pattern: '[a-zA-Z][-_a-zA-Z0-9]{5,19}', description: '匹配微信号格式' },
    { name: 'MAC地址', pattern: '([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})', description: '匹配MAC地址' },
    { name: '统一社会信用代码', pattern: '[0-9A-HJ-NPQRTUWXY]{2}\\d{6}[0-9A-HJ-NPQRTUWXY]{10}', description: '匹配统一社会信用代码' },
    { name: '数字', pattern: '\\d+', description: '匹配所有数字' },
    { name: '小数', pattern: '\\d+\\.\\d+', description: '匹配小数' },
    { name: '中文', pattern: '[\\u4e00-\\u9fa5]+', description: '匹配中文字符' },
    { name: '英文', pattern: '[a-zA-Z]+', description: '匹配英文字母' },
    { name: 'URL', pattern: 'https?://[^\\s]+', description: '匹配HTTP/HTTPS链接' },
    { name: '域名', pattern: '[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+', description: '匹配域名' },
    { name: '文件路径', pattern: '[a-zA-Z]:\\\\[^\\n\\r]*|/[^\\n\\r]*', description: '匹配文件路径' },
    { name: '颜色代码', pattern: '#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}', description: '匹配十六进制颜色代码' },
    { name: '日期', pattern: '\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}', description: '匹配日期格式' },
    { name: '时间', pattern: '([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?', description: '匹配时间格式' },
    { name: '版本号', pattern: '\\d+\\.\\d+\\.\\d+', description: '匹配版本号' },
    { name: 'UUID', pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}', description: '匹配UUID' },
    { name: '多个空格', pattern: '\\s+', description: '匹配多个连续空格' },
    { name: '换行符', pattern: '\\r?\\n', description: '匹配换行符' },
    { name: 'HTML标签', pattern: '<[^>]*>', description: '匹配HTML标签' },
    { name: '特殊字符', pattern: '[^a-zA-Z0-9\\u4e00-\\u9fa5\\s]', description: '匹配特殊字符' },
    { name: '首尾空格', pattern: '^\\s+|\\s+$', description: '匹配字符串首尾的空格' },
    { name: '中文标点', pattern: '[\\u3000-\\u303F\\uFF00-\\uFFEF]', description: '匹配中文标点符号' },
    { name: '英文标点', pattern: '[,.!?;:"\'()\\[\\]{}]', description: '匹配英文标点符号' },
    { name: '空行', pattern: '^\\s*$', description: '匹配空行' },
    { name: 'XML标签', pattern: '<[^>]+>', description: '匹配XML标签' },
    { name: 'JSON字符串', pattern: '"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"', description: '匹配JSON字符串' },
    { name: '货币格式', pattern: '\\$?\\d{1,3}(,\\d{3})*(\\.\\d{2})?', description: '匹配货币格式' },
    { name: '百分比', pattern: '\\d+(\\.\\d+)?%', description: '匹配百分比格式' },
    { name: 'Base64', pattern: '[A-Za-z0-9+/]*={0,2}', description: '匹配Base64编码' },
    { name: '端口号', pattern: ':(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3})', description: '匹配端口号' },
    { name: '电话号码', pattern: '(\\+\\d{1,3}[\\s-]?)?\\(?\\d{3,4}\\)?[\\s-]?\\d{3,4}[\\s-]?\\d{3,4}', description: '匹配电话号码' },
    { name: '信用卡号', pattern: '\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}', description: '匹配信用卡号' },
    { name: '图片文件', pattern: '\\S+\\.(jpg|jpeg|png|gif|bmp|webp|svg)\\b', description: '匹配图片文件' },
    { name: '视频文件', pattern: '\\S+\\.(mp4|avi|mkv|mov|wmv|flv|webm|m4v)\\b', description: '匹配视频文件' },
    { name: '音频文件', pattern: '\\S+\\.(mp3|wav|flac|aac|ogg|wma|m4a)\\b', description: '匹配音频文件' },
    { name: '文档文件', pattern: '\\S+\\.(pdf|doc|docx|txt|rtf|odt)\\b', description: '匹配文档文件' },
    { name: 'Excel文件', pattern: '\\S+\\.(xls|xlsx|xlsm|xlsb|csv)\\b', description: '匹配Excel文件' },
    { name: '压缩文件', pattern: '\\S+\\.(zip|rar|7z|tar|gz|bz2)\\b', description: '匹配压缩文件' },
    { name: '代码文件', pattern: '\\S+\\.(js|ts|py|java|cpp|c|php|rb|go|rs)\\b', description: '匹配代码文件' },
    { name: 'HTTP链接', pattern: 'https?://[^\\s<>"{}|\\\\^`\\[\\]]+', description: '匹配HTTP/HTTPS链接' },
    { name: 'FTP链接', pattern: 'ftp://[^\\s<>"{}|\\\\^`\\[\\]]+', description: '匹配FTP链接' },
    { name: '图片URL', pattern: 'https?://[^\\s<>"{}|\\\\^`\\[\\]]+\\.(jpg|jpeg|png|gif|bmp|webp|svg)', description: '匹配图片URL' },
    { name: 'API接口', pattern: 'https?://[^\\s<>"{}|\\\\^`\\[\\]]+/api/[^\\s<>"{}|\\\\^`\\[\\]]*', description: '匹配API接口URL' },
    { name: 'CDN资源', pattern: 'https?://[^\\s<>"{}|\\\\^`\\[\\]]*cdn[^\\s<>"{}|\\\\^`\\[\\]]*', description: '匹配CDN资源链接' },
    { name: 'GitHub链接', pattern: 'https?://github\\.com/[\\w.-]+/[\\w.-]+', description: '匹配GitHub仓库链接' },
    { name: '车牌号', pattern: '[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][DF][A-HJ-NP-Z0-9]{5}|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9][DF][A-HJ-NP-Z0-9]{4}', description: '匹配车牌号（含新能源）' },
    { name: '传统车牌', pattern: '[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]', description: '匹配传统车牌号' },
    { name: '新能源车牌', pattern: '[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][DF][A-HJ-NP-Z0-9]{5}|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9][DF][A-HJ-NP-Z0-9]{4}', description: '匹配新能源车牌号' }
  ]
}

// 匹配状态
const matchStatus = computed(() => {
  if (!regexPattern.value) {
    return { type: 'info', icon: '📝', text: '请输入正则表达式' }
  }
  if (!isValidRegex.value) {
    return { type: 'error', icon: '❌', text: `正则表达式语法错误: ${errorMessage.value}` }
  }
  if (!testText.value) {
    return { type: 'info', icon: '📝', text: '请输入测试文本' }
  }
  if (matches.value.length === 0) {
    return { type: 'warning', icon: '⚠️', text: '没有找到匹配项' }
  }
  return { type: 'success', icon: '✅', text: `匹配成功，找到 ${matches.value.length} 个匹配项` }
})

// 高亮显示的文本
const highlightedText = computed(() => {
  if (!testText.value || !isValidRegex.value || matches.value.length === 0) {
    return testText.value.replace(/\n/g, '<br>')
  }

  try {
    const regex = new RegExp(regexPattern.value, regexFlags.value)
    let result = testText.value
    let offset = 0

    // 按位置排序匹配项
    const sortedMatches = [...matches.value].sort((a, b) => (a.index || 0) - (b.index || 0))

    sortedMatches.forEach((match) => {
      if (match.index !== undefined) {
        const start = match.index + offset
        const end = start + match[0].length
        const highlighted = `<mark class="regex-match">${match[0]}</mark>`
        result = result.slice(0, start) + highlighted + result.slice(end)
        offset += highlighted.length - match[0].length
      }
    })

    return result.replace(/\n/g, '<br>')
  } catch {
    return testText.value.replace(/\n/g, '<br>')
  }
})

// 获取匹配位置
const getMatchPosition = (match: RegExpMatchArray) => {
  const start = match.index || 0
  const end = start + match[0].length - 1
  return `${start} - ${end}`
}

// 测试正则表达式
const testRegex = () => {
  matches.value = []
  isValidRegex.value = true
  errorMessage.value = ''

  if (!regexPattern.value || !testText.value) {
    return
  }

  try {
    const regex = new RegExp(regexPattern.value, regexFlags.value)
    const allMatches: RegExpMatchArray[] = []
    
    if (regexFlags.value.includes('g')) {
      // 全局匹配
      let match
      while ((match = regex.exec(testText.value)) !== null) {
        allMatches.push(match)
        // 防止无限循环
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
      }
    } else {
      // 单次匹配
      const match = regex.exec(testText.value)
      if (match) {
        allMatches.push(match)
      }
    }

    matches.value = allMatches
  } catch (error) {
    isValidRegex.value = false
    errorMessage.value = error instanceof Error ? error.message : '未知错误'
  }
}

// 切换标志
const toggleFlag = (flag: string) => {
  if (regexFlags.value.includes(flag)) {
    regexFlags.value = regexFlags.value.replace(flag, '')
  } else {
    regexFlags.value += flag
  }
  testRegex()
}

// 设置示例
const setExample = (example: any) => {
  regexPattern.value = example.pattern
  
  // 根据不同的正则表达式设置合适的标志
  if (example.name === '空行' || example.name === '首尾空格') {
    regexFlags.value = 'gm'  // 全局 + 多行模式
  } else if (example.name.includes('文件') || example.name === 'Excel文件' || 
             example.name.includes('链接') || example.name.includes('URL') || 
             example.name === 'API接口' || example.name === 'CDN资源' || example.name === 'GitHub链接') {
    regexFlags.value = 'gi'  // 全局 + 忽略大小写
  } else {
    regexFlags.value = 'g'   // 默认全局模式
  }
  
  // 设置对应的测试文本
  const testTexts: { [key: string]: string } = {
    '邮箱': '联系我们：admin@example.com 或 support@test.org\n客服邮箱：service@company.com.cn',
    '手机号': '请联系：13812345678 或 15987654321\n座机：010-12345678',
    'IPv4': '服务器地址：192.168.1.1\n网关：10.0.0.1\n公网IP：203.208.60.1',
    'IPv6': '本地地址：::1\n公网IPv6：2001:0db8:85a3:0000:0000:8a2e:0370:7334\n简化格式：2001:db8::1',
    '身份证': '张三：110101199001011234\n李四：320102198505052345',
    '银行卡': '卡号：6225881234567890\n备用卡：9558801234567890123',
    'QQ号': '张三：123456789\n李四：987654321\n王五：1234567890',
    '强密码': '强密码：MyP@ssw0rd123\n弱密码：123456\n弱密码：password',
    '邮政编码': '北京朝阳区：100020\n上海浦东区：200120\n广州天河区：510630',
    '微信号': '微信号：wechat_user123\n微信号：wx-test-2024\n微信号：user_name_01',
    'MAC地址': '网卡1：00:1B:44:11:3A:B7\n网卡2：AA-BB-CC-DD-EE-FF\n无线网卡：12:34:56:78:9A:BC',
    '统一社会信用代码': '公司A：91110000000000000A\n公司B：92320000MA1234567X',
    '数字': '价格：99.99元，数量：5个，总计：499.95元',
    '小数': '商品A：￥99.99\n商品B：￥199.50\n商品C：￥1299.00',
    '中文': 'Hello 世界！这是一个测试文本。包含中文字符：你好，欢迎使用。',
    '英文': '这是English文本，包含Chinese和English混合内容。',
    'URL': '官网：https://www.example.com 文档：http://docs.example.com/api',
    '域名': '网站：www.example.com\n邮箱服务：mail.google.com\nAPI：api.github.com',
    '文件路径': 'Windows路径：C:\\Users\\Admin\\Documents\\file.txt\nLinux路径：/home/user/documents/file.txt\n相对路径：./src/main.js',
    '颜色代码': 'CSS颜色：#FF5733, #3498DB, #2ECC71\n简写：#F00, #0F0, #00F',
    '多个空格': '这是    一个   有多个     空格的    文本',
    '换行符': '第一行\n第二行\r\n第三行\n第四行',
    'HTML标签': '<p>这是<strong>重要</strong>的<em>文本</em></p>',
    '特殊字符': 'Hello@World#2024!测试$文本%^&*()',
    '首尾空格': '   文本首尾有多余空格   \n  另一行也有空格  ',
    '中文标点': '你好，世界！这是一个测试。包含：引号"内容"和（括号）【方括号】',
    '英文标点': 'Hello, World! This is a test. Contains: "quotes" and (parentheses) [brackets] {braces}',
    '空行': '第一行\n\n第二行\n   \n第三行\n\t\n第四行',
    '日期': '开始日期：2024-01-15，结束日期：2024/12/31',
    '时间': '上班时间：09:30:00，下班时间：18:30',
    '版本号': '当前版本：1.2.3，最新版本：2.0.1',
    'UUID': '用户ID：550e8400-e29b-41d4-a716-446655440000\n会话ID：6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    '货币格式': '价格：$1,234.56，折扣价：$999.99',
    '百分比': '完成率：85.5%，增长率：12.3%，转化率：3.7%',
    'Base64': 'SGVsbG8gV29ybGQ=\niVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ',
    'JSON字符串': '{"name": "张三", "age": 25, "city": "北京"}\n{"message": "Hello World", "status": "success"}',
    'XML标签': '<user><name>张三</name><age>25</age></user>\n<message>Hello World</message>',
    '端口号': '服务器：192.168.1.1:8080\nSSH：server.com:22\nHTTPS：api.example.com:443',
    '电话号码': '客服热线：+86 400-123-4567\n座机：(010) 1234-5678\n手机：138-1234-5678\n国际：+1 555-123-4567',
    '信用卡号': '卡号：4532 1234 5678 9012\n备用卡：5555-4444-3333-2222\n公司卡：378282246310005',
    '图片文件': '头像：avatar.jpg\n背景：background.png\n图标：icon.svg\n照片：photo.jpeg\n动图：animation.gif',
    '视频文件': '宣传片：promo.mp4\n教程：tutorial.avi\n电影：movie.mkv\n录屏：screen.mov\n直播：live.webm',
    '音频文件': '音乐：song.mp3\n录音：record.wav\n播客：podcast.m4a\n音效：sound.ogg\n无损：music.flac',
    '文档文件': '报告：report.pdf\n合同：contract.docx\n说明：readme.txt\n手册：manual.doc\n文档：document.odt',
    'Excel文件': '数据：data.xlsx\n报表：report.xls\n统计：stats.csv\n模板：template.xlsm\n工作簿：workbook.xlsb',
    '压缩文件': '源码：source.zip\n备份：backup.rar\n安装包：setup.7z\n归档：archive.tar.gz\n压缩：files.bz2',
    '代码文件': '脚本：script.js\n组件：component.ts\n程序：main.py\n类：Class.java\n头文件：header.cpp',
    'HTTP链接': '官网：https://www.example.com\n文档：http://docs.example.com/guide\nAPI：https://api.github.com/users\n博客：https://blog.example.com/post/123',
    'FTP链接': '文件服务器：ftp://files.example.com/downloads\n备份：ftp://backup.server.com/data\n资源：ftp://resources.company.com/assets',
    '图片URL': '头像：https://cdn.example.com/avatar.jpg\n背景：https://images.unsplash.com/photo.png\n图标：https://static.example.com/icon.svg',
    'API接口': 'REST API：https://api.example.com/api/users\n数据接口：https://service.com/api/v1/data\nGraphQL：https://graph.example.com/api/graphql',
    'CDN资源': 'JS库：https://cdn.jsdelivr.net/npm/vue@3.0.0/dist/vue.js\nCSS：https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.0/css/bootstrap.min.css\n字体：https://fonts.googleapis.com/css2?family=Roboto',
    'GitHub链接': '仓库：https://github.com/vuejs/vue\n项目：https://github.com/microsoft/vscode\n工具：https://github.com/facebook/react',
    '车牌号': '传统车牌：京A12345\n新能源：京AD12345\n蓝牌：沪B67890\n绿牌：粤BD88888\n黄牌：川A12345挂\n警车：京A12345警',
    '传统车牌': '小型车：京A12345\n大型车：京A12345挂\n教练车：京A12345学\n警车：京A12345警\n港澳车：粤Z12345港\n使馆车：使001234',
    '新能源车牌': '小型新能源：京AD12345\n大型新能源：京AF12345\n纯电动：沪AD88888\n混合动力：粤BF66666\n燃料电池：川A1D234'
  }
  
  testText.value = testTexts[example.name] || '请输入测试文本...'
  testRegex()
  showSuccess(`已设置${example.name}示例`)
}

// 复制正则表达式
const copyRegex = async () => {
  if (!regexPattern.value) {
    showError('没有可复制的正则表达式')
    return
  }

  try {
    const fullRegex = `/${regexPattern.value}/${regexFlags.value}`
    await navigator.clipboard.writeText(fullRegex)
    showSuccess('正则表达式已复制到剪贴板')
  } catch (error) {
    showError('复制失败')
  }
}

// 清空正则表达式
const clearRegex = () => {
  regexPattern.value = ''
  regexFlags.value = 'g'
  testText.value = ''
  matches.value = []
  showSuccess('已清空正则表达式')
}
</script>

<style scoped>
.regex-tester-wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.regex-tester-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
  width: 100%;
}

/* 主要内容区域：左右布局 */
.main-content {
  display: flex;
  gap: 1rem;
  flex: 1;
  align-items: flex-start;
}

/* 左侧区域 */
.left-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 1;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: fit-content;
}

/* 右侧区域 */
.right-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex: 0 0 300px;
  overflow-y: auto;
  max-height: 70vh;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #1e293b;
}

.subsection-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #1e293b;
}

/* 正则表达式输入 */
.regex-input-section {
  flex-shrink: 0;
  margin-bottom: 0;
}

.regex-input-wrapper {
  margin-bottom: 1rem;
}

.regex-input-container {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.375rem;
  transition: border-color 0.2s;
}

.regex-input-container:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.regex-delimiter {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 1.25rem;
  color: #64748b;
  padding: 0 0.5rem;
}

.regex-input {
  flex: 1;
  padding: 0.625rem;
  border: none;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  color: #1e293b;
}

.flags-input {
  width: 55px;
  padding: 0.625rem 0.375rem;
  border: none;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  color: #1e293b;
  text-align: center;
}

.regex-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.625rem;
  font-size: 0.8rem;
  color: #64748b;
}

.flag-btn {
  padding: 0.25rem 0.5rem;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  font-family: monospace;
  font-size: 0.75rem;
}

.flag-btn:hover {
  background: #e2e8f0;
}

.flag-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* 测试文本区域 */
.test-text-section {
  flex-shrink: 0;
  margin-bottom: 0;
}

.test-textarea {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  color: #1e293b;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.test-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 匹配状态 */
.match-status {
  flex-shrink: 0;
  margin-bottom: 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

.status-indicator.success {
  background: #dcfce7;
  color: #166534;
}

.status-indicator.error {
  background: #fef2f2;
  color: #dc2626;
}

.status-indicator.warning {
  background: #fefce8;
  color: #ca8a04;
}

.status-indicator.info {
  background: #f0f9ff;
  color: #0369a1;
}

/* 匹配结果列表 */
.matches-list {
  margin-bottom: 0.75rem;
}

.matches-table-container {
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.matches-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.matches-table th {
  background: #f8fafc;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.75rem;
}

.matches-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.matches-table tr:last-child td {
  border-bottom: none;
}

.matches-table tr:hover {
  background: #f9fafb;
}

.match-content-cell {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #1e293b;
  word-break: break-all;
  max-width: 200px;
}

.match-position-cell {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #64748b;
  white-space: nowrap;
}

.match-groups-cell {
  font-size: 0.75rem;
  color: #64748b;
  max-width: 150px;
}

.groups-info {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.no-groups {
  color: #9ca3af;
  font-style: italic;
}

/* 高亮显示 */
.highlighted-text {
  flex: 1;
  min-height: 0;
}

.highlight-container {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 1rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 220px;
  overflow-y: auto;
}

:deep(.regex-match) {
  background: #fef3c7;
  color: #92400e;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

/* 示例网格 */
.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 0.4rem;
}

.example-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.25rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 38px;
  font-size: 0.7rem;
}

.example-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.example-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  line-height: 1.2;
}

/* 参考区域 */
.reference-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
}

.reference-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.reference-group h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #1e293b;
}

.reference-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.reference-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 0.375rem;
}

.reference-item code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: #e2e8f0;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  color: #1e293b;
  min-width: 55px;
  text-align: center;
}

.reference-item span {
  font-size: 0.85rem;
  color: #475569;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .regex-tester-content {
    padding: 1rem;
    gap: 1.5rem;
  }

  .main-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .left-section,
  .right-section {
    padding: 1.5rem;
    width: auto;
  }

  .reference-content {
    grid-template-columns: 1fr;
  }

  .examples-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 0.3rem;
  }

  .example-btn {
    min-height: 40px;
    padding: 0.3rem 0.15rem;
    font-size: 0.65rem;
  }
}
</style>