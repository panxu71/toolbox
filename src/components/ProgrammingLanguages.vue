<template>
    <div class="programming-languages">
        <div class="languages-header">
            <button class="back-btn" @click="$emit('back')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m15 18-6-6 6-6" />
                </svg>
                返回
            </button>
            <h2 class="languages-title">编程语言大全</h2>
            <div class="languages-actions">
                <button class="action-btn" @click="toggleView" :title="viewMode === 'grid' ? '切换到列表视图' : '切换到网格视图'">
                    <svg v-if="viewMode === 'grid'" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="languages-content">
            <!-- 搜索和筛选 -->
            <div class="filter-section">
                <div class="search-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input v-model="searchQuery" type="text" placeholder="搜索编程语言..." />
                </div>
                <div class="filter-tabs">
                    <button class="filter-tab" :class="{ active: activeFilter === 'all' }" @click="setFilter('all')">
                        全部 ({{ languages.length }})
                    </button>
                    <button class="filter-tab" :class="{ active: activeFilter === 'popular' }"
                        @click="setFilter('popular')">
                        热门 ({{ popularLanguages.length }})
                    </button>
                    <button class="filter-tab" :class="{ active: activeFilter === 'web' }" @click="setFilter('web')">
                        Web开发 ({{ webLanguages.length }})
                    </button>
                    <button class="filter-tab" :class="{ active: activeFilter === 'mobile' }"
                        @click="setFilter('mobile')">
                        移动开发 ({{ mobileLanguages.length }})
                    </button>
                    <button class="filter-tab" :class="{ active: activeFilter === 'system' }"
                        @click="setFilter('system')">
                        系统编程 ({{ systemLanguages.length }})
                    </button>
                </div>
            </div>

            <!-- 语言列表 -->
            <div class="languages-list" :class="viewMode">
                <div v-for="language in filteredLanguages" :key="language.id" class="language-card"
                    @click="selectLanguage(language)">
                    <div class="language-header">
                        <div class="language-icon" :style="{ backgroundColor: language.color }">
                            {{ language.icon }}
                        </div>
                        <div class="language-info">
                            <h3 class="language-name">{{ language.name }}</h3>
                            <p class="language-description">{{ language.description }}</p>
                        </div>
                        <div class="language-meta">
                            <span class="language-year">{{ language.year }}</span>
                            <div class="language-tags">
                                <span v-for="tag in language.tags" :key="tag" class="tag" :class="tag">{{ tag }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="language-stats">
                        <div class="stat-item">
                            <span class="stat-label">难度:</span>
                            <div class="difficulty-bar">
                                <div class="difficulty-fill"
                                    :style="{ width: language.difficulty * 20 + '%', backgroundColor: getDifficultyColor(language.difficulty) }">
                                </div>
                            </div>
                            <span class="stat-value">{{ getDifficultyText(language.difficulty) }}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">流行度:</span>
                            <div class="popularity-bar">
                                <div class="popularity-fill"
                                    :style="{ width: language.popularity + '%', backgroundColor: '#10b981' }"></div>
                            </div>
                            <span class="stat-value">{{ language.popularity }}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 语言详情弹窗 -->
            <div v-if="selectedLanguage" class="language-modal-overlay" @click="closeLanguageModal">
                <div class="language-modal" @click.stop>
                    <div class="modal-header">
                        <div class="modal-title-section">
                            <div class="language-icon large" :style="{ backgroundColor: selectedLanguage.color }">
                                {{ selectedLanguage.icon }}
                            </div>
                            <div>
                                <h2>{{ selectedLanguage.name }}</h2>
                                <p class="modal-subtitle">{{ selectedLanguage.description }}</p>
                            </div>
                        </div>
                        <button class="close-btn" @click="closeLanguageModal">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                    <div class="modal-content">
                        <div class="modal-section">
                            <h3>基本信息</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">发布年份:</span>
                                    <span class="info-value">{{ selectedLanguage.year }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">设计者:</span>
                                    <span class="info-value">{{ selectedLanguage.creator }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">类型:</span>
                                    <span class="info-value">{{ selectedLanguage.type }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">范式:</span>
                                    <span class="info-value">{{ selectedLanguage.paradigm }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="modal-section">
                            <h3>特点与优势</h3>
                            <ul class="features-list">
                                <li v-for="feature in selectedLanguage.features" :key="feature">{{ feature }}</li>
                            </ul>
                        </div>

                        <div class="modal-section">
                            <h3>主要用途</h3>
                            <div class="use-cases">
                                <span v-for="useCase in selectedLanguage.useCases" :key="useCase"
                                    class="use-case-tag">{{ useCase }}</span>
                            </div>
                        </div>

                        <div class="modal-section">
                            <h3>学习资源</h3>
                            <div class="resources-grid">
                                <a v-for="resource in selectedLanguage.resources" :key="resource.name"
                                    :href="resource.url" target="_blank" class="resource-link">
                                    <span class="resource-icon">{{ resource.icon }}</span>
                                    <span class="resource-name">{{ resource.name }}</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15,3 21,3 21,9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 语言排行来源网站导航 -->
            <div class="ranking-sources-section">
                <div class="section-header">
                    <h3>编程语言排行榜来源</h3>
                    <p class="section-description">在编程语言排行榜中，有许多不同的榜单和排名系统，每个系统都有自己的标准和考量因素。以下是一些全球公认的编程语言排行榜和排名系统：</p>
                </div>
                <div class="ranking-sources-grid">
                    <a href="https://www.tiobe.com/tiobe-index/" target="_blank" class="ranking-source-card">
                        <div class="source-header">
                            <div class="source-icon" style="background: #ff6b35;">📊</div>
                            <div class="source-info">
                                <h4>TIOBE Index</h4>
                                <span class="source-url">tiobe.com</span>
                            </div>
                        </div>
                        <p class="source-description">历史悠久的排名，通过搜索量来评估编程语言的流行度。尽管有局限性，但仍是广泛被引用的指标。</p>
                        <div class="source-features">
                            <span class="feature-tag">搜索量统计</span>
                            <span class="feature-tag">历史数据</span>
                        </div>
                    </a>

                    <a href="https://pypl.github.io/PYPL.html" target="_blank" class="ranking-source-card">
                        <div class="source-header">
                            <div class="source-icon" style="background: #4285f4;">📈</div>
                            <div class="source-info">
                                <h4>PYPL Index</h4>
                                <span class="source-url">pypl.github.io</span>
                            </div>
                        </div>
                        <p class="source-description">使用 GitHub 作为数据源，统计各种编程语言在 GitHub 上的使用频率，侧重于开源项目的活跃度。</p>
                        <div class="source-features">
                            <span class="feature-tag">GitHub数据</span>
                            <span class="feature-tag">开源项目</span>
                        </div>
                    </a>

                    <a href="https://redmonk.com/sogrady/category/programming-languages/" target="_blank"
                        class="ranking-source-card">
                        <div class="source-header">
                            <div class="source-icon" style="background: #e74c3c;">🔍</div>
                            <div class="source-info">
                                <h4>RedMonk Rankings</h4>
                                <span class="source-url">redmonk.com</span>
                            </div>
                        </div>
                        <p class="source-description">基于多种因素的综合排名，包括 GitHub 趋势、Stack Overflow 热度、Twitter 热度和行业专家意见。</p>
                        <div class="source-features">
                            <span class="feature-tag">综合评估</span>
                            <span class="feature-tag">专家意见</span>
                        </div>
                    </a>

                    <a href="https://github.com/trending" target="_blank" class="ranking-source-card">
                        <div class="source-header">
                            <div class="source-icon" style="background: #333;">🚀</div>
                            <div class="source-info">
                                <h4>GitHub Trending</h4>
                                <span class="source-url">github.com</span>
                            </div>
                        </div>
                        <p class="source-description">直接显示 GitHub 上最受欢迎和最活跃的仓库和项目所使用的语言，反映当前开发趋势。</p>
                        <div class="source-features">
                            <span class="feature-tag">实时趋势</span>
                            <span class="feature-tag">项目活跃度</span>
                        </div>
                    </a>

                    <a href="https://owasp.org/www-project-top-ten/" target="_blank" class="ranking-source-card">
                        <div class="source-header">
                            <div class="source-icon" style="background: #2c5aa0;">🔒</div>
                            <div class="source-info">
                                <h4>OWASP Top 10</h4>
                                <span class="source-url">owasp.org</span>
                            </div>
                        </div>
                        <p class="source-description">虽然不是直接的编程语言排名，但OWASP的"十大最危险的网络漏洞"列表对了解网络安全方面广泛使用的编程语言很有帮助。</p>
                        <div class="source-features">
                            <span class="feature-tag">网络安全</span>
                            <span class="feature-tag">漏洞分析</span>
                        </div>
                    </a>

                    <a href="https://insights.stackoverflow.com/survey" target="_blank" class="ranking-source-card">
                        <div class="source-header">
                            <div class="source-icon" style="background: #f48024;">💬</div>
                            <div class="source-info">
                                <h4>Stack Overflow Survey</h4>
                                <span class="source-url">stackoverflow.com</span>
                            </div>
                        </div>
                        <p class="source-description">每年发布的开发者调查，提供关于开发者使用的编程语言、技术栈和职业发展的深入见解。</p>
                        <div class="source-features">
                            <span class="feature-tag">开发者调查</span>
                            <span class="feature-tag">行业趋势</span>
                        </div>
                    </a>

                    <a href="https://www.hackerrank.com/research/developer-skills" target="_blank"
                        class="ranking-source-card">
                        <div class="source-header">
                            <div class="source-icon" style="background: #00ea64;">🎯</div>
                            <div class="source-info">
                                <h4>HackerRank Report</h4>
                                <span class="source-url">hackerrank.com</span>
                            </div>
                        </div>
                        <p class="source-description">提供关于开发者技能和流行编程语言的详细数据，包括哪些语言被广泛学习和使用。</p>
                        <div class="source-features">
                            <span class="feature-tag">技能报告</span>
                            <span class="feature-tag">学习趋势</span>
                        </div>
                    </a>
                </div>
                <div class="ranking-note">
                    <p><strong>注意：</strong>每个排名系统都有其独特的视角和方法论，建议根据具体需求（了解当前趋势、评估学习价值、寻找就业机会等）来选择合适的排名系统参考。</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePageTitle } from '../composables/usePageTitle'

defineEmits<{
    back: []
}>()

// 使用页面标题管理
usePageTitle('programming-languages')

// 视图模式
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedLanguage = ref<any>(null)

// 编程语言数据
const languages = ref([
    {
        id: 'python',
        name: 'Python',
        description: '简洁、易读的高级编程语言',
        icon: 'PY',
        color: '#3776ab',
        year: 1991,
        creator: 'Guido van Rossum',
        type: '解释型',
        paradigm: '多范式',
        difficulty: 1,
        popularity: 95,
        tags: ['popular', 'system'],
        features: [
            '语法简洁清晰',
            '丰富的标准库',
            '强大的第三方生态',
            '跨平台支持',
            '动态类型'
        ],
        useCases: ['数据科学', 'Web开发', '人工智能', '自动化脚本', '科学计算'],
        resources: [
            { name: 'Python官网', url: 'https://www.python.org/', icon: '🌐' },
            { name: '廖雪峰Python教程', url: 'https://www.liaoxuefeng.com/wiki/1016959663602400', icon: '📚' },
            { name: 'Python Package Index', url: 'https://pypi.org/', icon: '📦' }
        ]
    },
    {
        id: 'c',
        name: 'C',
        description: '经典的系统编程语言',
        icon: 'C',
        color: '#a8b9cc',
        year: 1972,
        creator: 'Dennis Ritchie',
        type: '编译型',
        paradigm: '过程式',
        difficulty: 4,
        popularity: 85,
        tags: ['system'],
        features: [
            '高效的执行速度',
            '底层硬件控制',
            '简洁的语法',
            '广泛的平台支持',
            '内存管理控制'
        ],
        useCases: ['操作系统', '嵌入式系统', '系统软件', '驱动程序', '编译器'],
        resources: [
            { name: 'C语言教程', url: 'https://www.runoob.com/cprogramming/c-tutorial.html', icon: '📚' },
            { name: 'GNU GCC', url: 'https://gcc.gnu.org/', icon: '🔧' },
            { name: 'C标准库参考', url: 'https://en.cppreference.com/w/c', icon: '📖' }
        ]
    },
    {
        id: 'cpp',
        name: 'C++',
        description: '高性能的系统编程语言',
        icon: 'C+',
        color: '#00599c',
        year: 1985,
        creator: 'Bjarne Stroustrup',
        type: '编译型',
        paradigm: '多范式',
        difficulty: 4,
        popularity: 80,
        tags: ['system'],
        features: [
            '高性能执行',
            '底层控制能力',
            '丰富的标准库',
            '多范式支持',
            '广泛的平台支持'
        ],
        useCases: ['系统软件', '游戏引擎', '嵌入式开发', '高性能计算', '操作系统'],
        resources: [
            { name: 'cppreference', url: 'https://zh.cppreference.com/', icon: '📚' },
            { name: 'ISO C++', url: 'https://isocpp.org/', icon: '🌐' },
            { name: 'Boost库', url: 'https://www.boost.org/', icon: '📦' }
        ]
    },
    {
        id: 'java',
        name: 'Java',
        description: '面向对象的、跨平台的编程语言',
        icon: 'JA',
        color: '#ed8b00',
        year: 1995,
        creator: 'James Gosling',
        type: '编译型',
        paradigm: '面向对象',
        difficulty: 3,
        popularity: 85,
        tags: ['popular', 'system'],
        features: [
            '跨平台运行',
            '强类型系统',
            '自动内存管理',
            '丰富的API',
            '企业级支持'
        ],
        useCases: ['企业应用', 'Android开发', 'Web后端', '大数据处理', '桌面应用'],
        resources: [
            { name: 'Oracle Java文档', url: 'https://docs.oracle.com/javase/', icon: '📚' },
            { name: 'Spring框架', url: 'https://spring.io/', icon: '🌱' },
            { name: 'Maven仓库', url: 'https://mvnrepository.com/', icon: '📦' }
        ]
    },
    {
        id: 'csharp',
        name: 'C#',
        description: 'Microsoft开发的面向对象编程语言',
        icon: 'C#',
        color: '#239120',
        year: 2000,
        creator: 'Microsoft',
        type: '编译型',
        paradigm: '面向对象',
        difficulty: 3,
        popularity: 75,
        tags: ['popular', 'system'],
        features: [
            '强类型系统',
            '.NET生态系统',
            '自动内存管理',
            '跨平台支持',
            '丰富的标准库'
        ],
        useCases: ['Windows应用', 'Web开发', '游戏开发', '企业应用', '移动应用'],
        resources: [
            { name: 'Microsoft C#文档', url: 'https://docs.microsoft.com/zh-cn/dotnet/csharp/', icon: '📚' },
            { name: '.NET官网', url: 'https://dotnet.microsoft.com/', icon: '🌐' },
            { name: 'NuGet包管理', url: 'https://www.nuget.org/', icon: '📦' }
        ]
    },
    {
        id: 'javascript',
        name: 'JavaScript',
        description: '动态的、弱类型的解释型编程语言',
        icon: 'JS',
        color: '#f7df1e',
        year: 1995,
        creator: 'Brendan Eich',
        type: '解释型',
        paradigm: '多范式',
        difficulty: 2,
        popularity: 90,
        tags: ['popular', 'web'],
        features: [
            '动态类型系统',
            '函数式编程支持',
            '原型继承',
            '事件驱动',
            '跨平台支持'
        ],
        useCases: ['Web前端', 'Node.js后端', '移动应用', '桌面应用', '游戏开发'],
        resources: [
            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', icon: '📚' },
            { name: 'JavaScript.info', url: 'https://zh.javascript.info/', icon: '📖' },
            { name: 'Node.js官网', url: 'https://nodejs.org/', icon: '🌐' }
        ]
    },
    {
        id: 'visual-basic',
        name: 'Visual Basic',
        description: 'Microsoft开发的事件驱动编程语言',
        icon: 'VB',
        color: '#945db7',
        year: 1991,
        creator: 'Microsoft',
        type: '编译型',
        paradigm: '面向对象',
        difficulty: 2,
        popularity: 60,
        tags: ['system'],
        features: [
            '可视化开发环境',
            '事件驱动编程',
            '简单易学',
            'Windows集成',
            'RAD开发'
        ],
        useCases: ['Windows应用', '办公自动化', '数据库应用', '企业软件', '原型开发'],
        resources: [
            { name: 'VB.NET文档', url: 'https://docs.microsoft.com/zh-cn/dotnet/visual-basic/', icon: '📚' },
            { name: 'Visual Studio', url: 'https://visualstudio.microsoft.com/', icon: '🔧' },
            { name: '.NET框架', url: 'https://dotnet.microsoft.com/', icon: '🌐' }
        ]
    },
    {
        id: 'sql',
        name: 'SQL',
        description: '结构化查询语言，用于数据库操作',
        icon: 'SQL',
        color: '#336791',
        year: 1974,
        creator: 'IBM',
        type: '声明式',
        paradigm: '声明式',
        difficulty: 2,
        popularity: 85,
        tags: ['popular'],
        features: [
            '标准化语法',
            '声明式查询',
            '数据完整性',
            '事务支持',
            '跨平台兼容'
        ],
        useCases: ['数据库查询', '数据分析', '报表生成', '数据管理', '商业智能'],
        resources: [
            { name: 'SQL教程', url: 'https://www.runoob.com/sql/sql-tutorial.html', icon: '📚' },
            { name: 'MySQL文档', url: 'https://dev.mysql.com/doc/', icon: '🐬' },
            { name: 'PostgreSQL文档', url: 'https://www.postgresql.org/docs/', icon: '🐘' }
        ]
    },
    {
        id: 'perl',
        name: 'Perl',
        description: '强大的文本处理和系统管理语言',
        icon: 'PL',
        color: '#39457e',
        year: 1987,
        creator: 'Larry Wall',
        type: '解释型',
        paradigm: '多范式',
        difficulty: 3,
        popularity: 45,
        tags: ['system'],
        features: [
            '强大的正则表达式',
            '文本处理能力',
            'CPAN模块库',
            '灵活的语法',
            '跨平台支持'
        ],
        useCases: ['文本处理', '系统管理', 'Web开发', '生物信息学', '网络编程'],
        resources: [
            { name: 'Perl官网', url: 'https://www.perl.org/', icon: '🌐' },
            { name: 'CPAN', url: 'https://www.cpan.org/', icon: '📦' },
            { name: 'Perl文档', url: 'https://perldoc.perl.org/', icon: '📚' }
        ]
    },
    {
        id: 'r',
        name: 'R',
        description: '统计计算和图形的编程语言',
        icon: 'R',
        color: '#276dc3',
        year: 1993,
        creator: 'Ross Ihaka & Robert Gentleman',
        type: '解释型',
        paradigm: '函数式',
        difficulty: 3,
        popularity: 55,
        tags: ['system'],
        features: [
            '统计分析功能',
            '数据可视化',
            '丰富的包生态',
            '向量化操作',
            '交互式环境'
        ],
        useCases: ['统计分析', '数据科学', '机器学习', '生物统计', '金融分析'],
        resources: [
            { name: 'R官网', url: 'https://www.r-project.org/', icon: '🌐' },
            { name: 'CRAN', url: 'https://cran.r-project.org/', icon: '📦' },
            { name: 'RStudio', url: 'https://www.rstudio.com/', icon: '🔧' }
        ]
    },
    {
        id: 'delphi',
        name: 'Delphi/Object Pascal',
        description: '面向对象的Pascal语言扩展',
        icon: 'DP',
        color: '#ee1f35',
        year: 1995,
        creator: 'Borland',
        type: '编译型',
        paradigm: '面向对象',
        difficulty: 3,
        popularity: 40,
        tags: ['system'],
        features: [
            '快速应用开发',
            '可视化设计器',
            '强类型系统',
            '原生代码编译',
            '数据库集成'
        ],
        useCases: ['Windows应用', '数据库应用', '企业软件', '桌面工具', '系统工具'],
        resources: [
            { name: 'Embarcadero Delphi', url: 'https://www.embarcadero.com/products/delphi', icon: '🔧' },
            { name: 'Free Pascal', url: 'https://www.freepascal.org/', icon: '🆓' },
            { name: 'Lazarus IDE', url: 'https://www.lazarus-ide.org/', icon: '🔧' }
        ]
    },
    {
        id: 'fortran',
        name: 'Fortran',
        description: '科学计算的先驱编程语言',
        icon: 'F',
        color: '#734f96',
        year: 1957,
        creator: 'IBM',
        type: '编译型',
        paradigm: '过程式',
        difficulty: 3,
        popularity: 35,
        tags: ['system'],
        features: [
            '高性能数值计算',
            '数组处理能力',
            '并行计算支持',
            '科学计算库',
            '长期稳定性'
        ],
        useCases: ['科学计算', '工程仿真', '天气预报', '数值分析', '高性能计算'],
        resources: [
            { name: 'Fortran官网', url: 'https://fortran-lang.org/', icon: '🌐' },
            { name: 'GNU Fortran', url: 'https://gcc.gnu.org/fortran/', icon: '🔧' },
            { name: 'Intel Fortran', url: 'https://software.intel.com/content/www/us/en/develop/tools/oneapi/components/fortran-compiler.html', icon: '🔧' }
        ]
    },
    {
        id: 'matlab',
        name: 'MATLAB',
        description: '数值计算和算法开发平台',
        icon: 'ML',
        color: '#0076a8',
        year: 1984,
        creator: 'MathWorks',
        type: '解释型',
        paradigm: '数值计算',
        difficulty: 2,
        popularity: 50,
        tags: ['system'],
        features: [
            '矩阵运算',
            '算法开发',
            '数据可视化',
            '仿真建模',
            '工具箱生态'
        ],
        useCases: ['科学计算', '工程分析', '算法开发', '数据分析', '控制系统'],
        resources: [
            { name: 'MATLAB官网', url: 'https://www.mathworks.com/products/matlab.html', icon: '🌐' },
            { name: 'MATLAB文档', url: 'https://www.mathworks.com/help/matlab/', icon: '📚' },
            { name: 'File Exchange', url: 'https://www.mathworks.com/matlabcentral/fileexchange/', icon: '📦' }
        ]
    },
    {
        id: 'ada',
        name: 'Ada',
        description: '高可靠性的系统编程语言',
        icon: 'ADA',
        color: '#02f88c',
        year: 1980,
        creator: 'Jean Ichbiah',
        type: '编译型',
        paradigm: '面向对象',
        difficulty: 4,
        popularity: 25,
        tags: ['system'],
        features: [
            '强类型系统',
            '高可靠性',
            '并发编程',
            '实时系统支持',
            '安全关键应用'
        ],
        useCases: ['航空航天', '国防系统', '交通控制', '医疗设备', '金融系统'],
        resources: [
            { name: 'Ada官网', url: 'https://www.adacore.com/', icon: '🌐' },
            { name: 'GNAT编译器', url: 'https://www.adacore.com/gnatpro', icon: '🔧' },
            { name: 'Ada参考手册', url: 'http://www.ada-auth.org/standards/ada12.html', icon: '📚' }
        ]
    },
    {
        id: 'go',
        name: 'Go',
        description: 'Google开发的简洁高效的编程语言',
        icon: 'GO',
        color: '#00add8',
        year: 2009,
        creator: 'Google',
        type: '编译型',
        paradigm: '过程式',
        difficulty: 2,
        popularity: 65,
        tags: ['popular', 'system'],
        features: [
            '简洁的语法',
            '快速编译',
            '并发编程支持',
            '垃圾回收',
            '静态类型'
        ],
        useCases: ['微服务', '云原生应用', '网络编程', '系统工具', 'DevOps工具'],
        resources: [
            { name: 'Go官网', url: 'https://golang.org/', icon: '🌐' },
            { name: 'Go语言之旅', url: 'https://tour.golang.org/', icon: '🎯' },
            { name: 'Go包索引', url: 'https://pkg.go.dev/', icon: '📦' }
        ]
    },
    {
        id: 'php',
        name: 'PHP',
        description: '专为Web开发设计的脚本语言',
        icon: 'PHP',
        color: '#777bb4',
        year: 1995,
        creator: 'Rasmus Lerdorf',
        type: '解释型',
        paradigm: '多范式',
        difficulty: 2,
        popularity: 70,
        tags: ['web'],
        features: [
            '易于学习',
            '丰富的Web框架',
            '广泛的主机支持',
            '大量的扩展库',
            '活跃的社区'
        ],
        useCases: ['Web开发', 'CMS系统', 'API开发', '电子商务', '内容管理'],
        resources: [
            { name: 'PHP官网', url: 'https://www.php.net/', icon: '🌐' },
            { name: 'PHP手册', url: 'https://www.php.net/manual/zh/', icon: '📚' },
            { name: 'Packagist', url: 'https://packagist.org/', icon: '📦' }
        ]
    },
    {
        id: 'rust',
        name: 'Rust',
        description: '内存安全的系统编程语言',
        icon: 'RS',
        color: '#ce422b',
        year: 2010,
        creator: 'Mozilla',
        type: '编译型',
        paradigm: '多范式',
        difficulty: 4,
        popularity: 60,
        tags: ['system'],
        features: [
            '内存安全',
            '零成本抽象',
            '并发安全',
            '高性能',
            '现代语言特性'
        ],
        useCases: ['系统编程', 'Web后端', '区块链', '游戏引擎', '操作系统'],
        resources: [
            { name: 'Rust官网', url: 'https://www.rust-lang.org/', icon: '🌐' },
            { name: 'Rust程序设计语言', url: 'https://doc.rust-lang.org/book/', icon: '📚' },
            { name: 'Crates.io', url: 'https://crates.io/', icon: '📦' }
        ]
    },
    {
        id: 'scratch',
        name: 'Scratch',
        description: '可视化编程语言，适合初学者',
        icon: 'SC',
        color: '#ffab19',
        year: 2007,
        creator: 'MIT Media Lab',
        type: '可视化',
        paradigm: '事件驱动',
        difficulty: 1,
        popularity: 40,
        tags: ['popular'],
        features: [
            '拖拽式编程',
            '可视化界面',
            '教育导向',
            '创意表达',
            '社区分享'
        ],
        useCases: ['编程教育', '创意项目', '游戏制作', '动画制作', '互动故事'],
        resources: [
            { name: 'Scratch官网', url: 'https://scratch.mit.edu/', icon: '🌐' },
            { name: 'Scratch教程', url: 'https://scratch.mit.edu/ideas', icon: '📚' },
            { name: 'Scratch社区', url: 'https://scratch.mit.edu/explore/projects/all', icon: '👥' }
        ]
    },
    {
        id: 'assembly',
        name: 'Assembly',
        description: '低级汇编语言，直接操作硬件',
        icon: 'ASM',
        color: '#6e4c13',
        year: 1949,
        creator: 'Various',
        type: '汇编',
        paradigm: '过程式',
        difficulty: 5,
        popularity: 30,
        tags: ['system'],
        features: [
            '直接硬件控制',
            '最高执行效率',
            '精确内存管理',
            '平台特定',
            '底层优化'
        ],
        useCases: ['嵌入式系统', '驱动程序', '系统内核', '性能优化', '逆向工程'],
        resources: [
            { name: 'NASM汇编器', url: 'https://www.nasm.us/', icon: '🔧' },
            { name: 'x86汇编指南', url: 'https://www.cs.virginia.edu/~evans/cs216/guides/x86.html', icon: '📚' },
            { name: 'ARM汇编', url: 'https://developer.arm.com/documentation', icon: '📖' }
        ]
    },
    {
        id: 'kotlin',
        name: 'Kotlin',
        description: 'JetBrains开发的现代编程语言',
        icon: 'KT',
        color: '#7f52ff',
        year: 2011,
        creator: 'JetBrains',
        type: '编译型',
        paradigm: '多范式',
        difficulty: 3,
        popularity: 60,
        tags: ['mobile'],
        features: [
            '与Java完全互操作',
            '简洁的语法',
            '空安全',
            '函数式编程支持',
            '协程支持'
        ],
        useCases: ['Android开发', 'Web开发', '服务器端开发', '跨平台移动开发'],
        resources: [
            { name: 'Kotlin官网', url: 'https://kotlinlang.org/', icon: '🌐' },
            { name: 'Kotlin文档', url: 'https://kotlinlang.org/docs/', icon: '📚' },
            { name: 'Kotlin多平台', url: 'https://kotlinlang.org/lp/mobile/', icon: '📱' }
        ]
    }
])

// 计算属性
const popularLanguages = computed(() => languages.value.filter(lang => lang.tags.includes('popular')))
const webLanguages = computed(() => languages.value.filter(lang => lang.tags.includes('web')))
const mobileLanguages = computed(() => languages.value.filter(lang => lang.tags.includes('mobile')))
const systemLanguages = computed(() => languages.value.filter(lang => lang.tags.includes('system')))

const filteredLanguages = computed(() => {
    let filtered = languages.value

    // 按分类筛选
    switch (activeFilter.value) {
        case 'popular':
            filtered = popularLanguages.value
            break
        case 'web':
            filtered = webLanguages.value
            break
        case 'mobile':
            filtered = mobileLanguages.value
            break
        case 'system':
            filtered = systemLanguages.value
            break
    }

    // 按搜索关键词筛选
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(lang =>
            lang.name.toLowerCase().includes(query) ||
            lang.description.toLowerCase().includes(query) ||
            lang.creator.toLowerCase().includes(query) ||
            lang.useCases.some(useCase => useCase.toLowerCase().includes(query))
        )
    }

    return filtered
})

// 方法
const toggleView = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const setFilter = (filter: string) => {
    activeFilter.value = filter
}

const selectLanguage = (language: any) => {
    selectedLanguage.value = language
}

const closeLanguageModal = () => {
    selectedLanguage.value = null
}

const getDifficultyColor = (difficulty: number): string => {
    const colors = ['#10b981', '#f59e0b', '#f97316', '#ef4444', '#dc2626']
    return colors[difficulty - 1] || '#6b7280'
}

const getDifficultyText = (difficulty: number): string => {
    const texts = ['入门', '简单', '中等', '困难', '专家']
    return texts[difficulty - 1] || '未知'
}

onMounted(() => {
    // 页面初始化逻辑
})
</script>

<style scoped>
.programming-languages {
    width: 100%;
    height: 100dvh;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
}

.languages-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.back-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
}

.languages-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.languages-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: var(--bg-hover);
    transform: translateY(-1px);
}

.languages-content {
    flex: 1;
    padding: 1.5rem 1.5rem 3rem 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
}

/* 筛选区域 */
.filter-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
}

.search-box {
    position: relative;
    max-width: 400px;
}

.search-box svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
}

.search-box input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.875rem;
}

.search-box input:focus {
    outline: none;
    border-color: var(--primary-color);
}

.filter-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.filter-tab {
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 500;
}

.filter-tab:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.filter-tab.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

/* 语言列表 */
.languages-list {
    display: grid;
    gap: 0.75rem;
}

.languages-list.grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.languages-list.list {
    grid-template-columns: 1fr;
}

.language-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    min-height: 180px;
}

.language-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
}

.language-header {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.language-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: 0.625rem;
    flex-shrink: 0;
}

.language-info {
    flex: 1;
}

.language-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.125rem 0;
}

.language-description {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin: 0;
    line-height: 1.3;
}

.language-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.375rem;
}

.language-year {
    font-size: 0.75rem;
    color: var(--text-secondary);
    background: var(--bg-tertiary);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
}

.language-tags {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
}

.tag {
    font-size: 0.625rem;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-weight: 500;
}

.tag.popular {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
}

.tag.web {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
}

.tag.mobile {
    background: rgba(99, 102, 241, 0.1);
    color: #6366f1;
}

.tag.system {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
}

.language-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.125rem 0;
}

.stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    min-width: 3rem;
}

.difficulty-bar,
.popularity-bar {
    flex: 1;
    height: 0.375rem;
    background: var(--bg-tertiary);
    border-radius: 0.25rem;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.difficulty-fill,
.popularity-fill {
    height: 100%;
    transition: width 0.3s ease;
}

.stat-value {
    font-size: 0.75rem;
    color: var(--text-primary);
    font-weight: 500;
    min-width: 2.5rem;
    text-align: right;
}

/* 语言详情弹窗 */
.language-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
    padding: 1rem;
}

.language-modal {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--bg-tertiary);
}

.modal-title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.language-icon.large {
    width: 4rem;
    height: 4rem;
    font-size: 1.125rem;
}

.modal-title-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.modal-subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin: 0.25rem 0 0 0;
}

.close-btn {
    width: 2.5rem;
    height: 2.5rem;
    background: none;
    border: none;
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.close-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.modal-section h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 500;
}

.info-value {
    font-size: 0.875rem;
    color: var(--text-primary);
}

.features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.features-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.875rem;
    color: var(--text-primary);
}

.features-list li:last-child {
    border-bottom: none;
}

.use-cases {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.use-case-tag {
    padding: 0.5rem 1rem;
    background: var(--primary-color-alpha);
    color: var(--primary-color);
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
}

.resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.resource-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.2s ease;
}

.resource-link:hover {
    background: var(--bg-hover);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.resource-icon {
    font-size: 1.25rem;
}

.resource-name {
    flex: 1;
    font-size: 0.875rem;
    font-weight: 500;
}

/* 语言排行来源网站导航 */
.ranking-sources-section {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 2rem;
    margin-top: 1rem;
}

.section-header {
    margin-bottom: 1.5rem;
}

.section-header h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.75rem 0;
}

.section-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0;
}

.ranking-sources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.ranking-source-card {
    display: flex;
    flex-direction: column;
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: 0.75rem;
    padding: 1.5rem;
    text-decoration: none;
    color: var(--text-primary);
    transition: all 0.2s ease;
    min-height: 200px;
}

.ranking-source-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
    background: var(--bg-hover);
}

.source-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.source-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    color: white;
    flex-shrink: 0;
}

.source-info {
    flex: 1;
}

.source-info h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.25rem 0;
}

.source-url {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: var(--bg-primary);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    border: 1px solid var(--border-color);
}

.source-description {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
    margin: 0 0 1rem 0;
    flex: 1;
}

.source-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: auto;
}

.feature-tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: var(--primary-color-alpha);
    color: var(--primary-color);
    border-radius: 0.25rem;
    font-weight: 500;
}

.ranking-note {
    background: var(--warning-color-alpha);
    border: 1px solid var(--warning-color);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin-top: 1.5rem;
}

.ranking-note p {
    font-size: 0.875rem;
    color: var(--text-primary);
    line-height: 1.5;
    margin: 0;
}

.ranking-note strong {
    color: var(--warning-color);
    font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .languages-content {
        padding: 1rem 1rem 3rem 1rem;
    }

    .languages-list.grid {
        grid-template-columns: 1fr;
    }

    .language-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
    }

    .language-meta {
        align-items: flex-start;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
    }

    .filter-section {
        padding: 1rem;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .resources-grid {
        grid-template-columns: 1fr;
    }

    .ranking-sources-section {
        padding: 1.5rem;
    }

    .ranking-sources-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .ranking-source-card {
        padding: 1.25rem;
        min-height: auto;
    }

    .source-header {
        gap: 0.75rem;
    }

    .source-icon {
        width: 2.5rem;
        height: 2.5rem;
        font-size: 1rem;
    }

    .source-info h4 {
        font-size: 1rem;
    }

    .ranking-note {
        padding: 1rem;
    }
}
</style>