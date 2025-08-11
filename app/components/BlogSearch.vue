<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface BlogPost {
  title: string
  description: string
  content: string
  url: string
  date: string
  tags: string[]
  category?: string
  highlightedTitle?: string
  highlightedDescription?: string
}

// 搜索相关状态
const searchQuery = ref('')
const searchResults = ref<BlogPost[]>([])
const isSearching = ref(false)
const showResults = ref(false)
const searchInput = ref<HTMLElement | null>(null)

// 所有文章数据
const allPosts = ref<BlogPost[]>([])

// 获取所有文章用于搜索
onMounted(async () => {
  try {
    // 模拟文章数据，实际项目中应该从API获取
    allPosts.value = [
      {
        title: 'Genesis',
        description: '创世纪 - 博客的开始',
        content: '这是第一篇博客文章，标志着这个数字幽灵日志的开始。',
        url: '/blog/genesis',
        date: '2025-05-04',
        tags: ['开始', '创世纪'],
        category: '日志'
      },
      {
        title: 'Luckysheet in Vue 3 Frontend',
        description: '在Vue 3前端项目中集成Luckysheet',
        content: '本文介绍如何在Vue 3项目中集成Luckysheet电子表格组件。',
        url: '/blog/luckysheet-in-Vue-3-frontend',
        date: '2025-01-11',
        tags: ['Vue', 'Luckysheet', '前端'],
        category: '技术'
      }
    ]
  } catch (error) {
    console.error('Failed to load posts for search:', error)
  }
})

// 执行搜索
const performSearch = (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    showResults.value = false
    return
  }

  isSearching.value = true
  
  const searchTerm = query.toLowerCase().trim()
  const results = allPosts.value.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm)
    const descriptionMatch = post.description?.toLowerCase().includes(searchTerm)
    const contentMatch = post.content.toLowerCase().includes(searchTerm)
    const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    const categoryMatch = post.category?.toLowerCase().includes(searchTerm)
    
    return titleMatch || descriptionMatch || contentMatch || tagsMatch || categoryMatch
  }).slice(0, 10) // 限制结果数量

  // 为每个结果添加高亮信息
  searchResults.value = results.map(post => {
    const highlightedTitle = highlightText(post.title, searchTerm)
    const highlightedDescription = highlightText(post.description || '', searchTerm)
    
    return {
      ...post,
      highlightedTitle,
      highlightedDescription
    }
  })

  showResults.value = true
  isSearching.value = false
}

// 高亮搜索关键词
const highlightText = (text: string, searchTerm: string) => {
  if (!text || !searchTerm) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

// 监听搜索输入
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    // 防抖处理
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      performSearch(newQuery)
    }, 300)
  } else {
    searchResults.value = []
    showResults.value = false
  }
})

let searchTimeout: NodeJS.Timeout

// 清空搜索
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
}

// 选择搜索结果
const selectResult = (url: string) => {
  clearSearch()
  navigateTo(url)
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 点击外部关闭搜索结果
const handleClickOutside = (event: Event) => {
  if (searchInput.value && event.target instanceof Node && !searchInput.value.contains(event.target)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="blog-search" ref="searchInput">
    <div class="search-input-wrapper">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索文章..."
        class="search-input"
        @focus="showResults = searchResults.length > 0"
      />
      <i class="fa fa-search search-icon"></i>
      <button 
        v-if="searchQuery"
        @click="clearSearch"
        class="clear-button"
      >
        <i class="fa fa-times"></i>
      </button>
    </div>

    <!-- 搜索结果 -->
    <div v-if="showResults" class="search-results">
      <div v-if="isSearching" class="search-loading">
        <i class="fa fa-spinner fa-spin"></i>
        搜索中...
      </div>
      
      <div v-else-if="searchResults.length > 0" class="results-list">
        <div 
          v-for="result in searchResults" 
          :key="result.url"
          class="result-item"
          @click="selectResult(result.url)"
        >
          <div class="result-title" v-html="result.highlightedTitle"></div>
          <div class="result-meta">
            <span class="result-date">{{ formatDate(result.date) }}</span>
            <span v-if="result.category" class="result-category">
              <i class="fa fa-folder"></i>
              {{ result.category }}
            </span>
          </div>
          <div 
            v-if="result.highlightedDescription" 
            class="result-description" 
            v-html="result.highlightedDescription"
          ></div>
          <div v-if="result.tags.length > 0" class="result-tags">
            <i class="fa fa-tags"></i>
            <span v-for="tag in result.tags.slice(0, 3)" :key="tag" class="result-tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-else class="no-results">
        <i class="fa fa-search"></i>
        没有找到相关文章
      </div>
    </div>
  </div>
</template>

<style scoped>
.blog-search {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  background-color: var(--cyberpunk-background-pink);
  border: 1px solid rgba(0, 255, 170, 0.3);
  border-radius: 4px;
  color: #fff;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--cyberpunk-cyan);
  box-shadow: 0 0 8px rgba(0, 255, 213, 0.3);
}

.search-input::placeholder {
  color: #bbb;
}

.search-icon {
  position: absolute;
  right: 12px;
  color: #999;
  pointer-events: none;
}

.clear-button {
  position: absolute;
  right: 35px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s ease;
}

.clear-button:hover {
  color: var(--cyberpunk-cyan);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(0, 255, 170, 0.3);
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.search-loading {
  padding: 20px;
  text-align: center;
  color: #999;
}

.search-loading i {
  margin-right: 8px;
}

.results-list {
  padding: 8px 0;
}

.result-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px dashed rgba(0, 255, 170, 0.1);
  transition: background-color 0.3s ease;
}

.result-item:hover {
  background-color: rgba(0, 255, 213, 0.05);
}

.result-item:last-child {
  border-bottom: none;
}

.result-title {
  color: var(--cyberpunk-cyan);
  font-weight: 600;
  margin-bottom: 6px;
  line-height: 1.3;
}

.result-meta {
  font-size: 0.8em;
  color: #999;
  margin-bottom: 6px;
}

.result-meta span {
  margin-right: 12px;
}

.result-meta i {
  margin-right: 4px;
}

.result-description {
  color: #ccc;
  font-size: 0.85em;
  line-height: 1.4;
  margin-bottom: 6px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.result-tags {
  font-size: 0.8em;
  color: #999;
}

.result-tags i {
  margin-right: 6px;
}

.result-tag {
  margin-right: 8px;
  padding: 1px 4px;
  background: rgba(0, 255, 213, 0.1);
  border-radius: 2px;
}

.no-results {
  padding: 30px 20px;
  text-align: center;
  color: #999;
  font-style: italic;
}

.no-results i {
  margin-right: 8px;
  opacity: 0.7;
}

/* 搜索高亮样式 */
:deep(.search-highlight) {
  background-color: var(--cyberpunk-yellow);
  color: #000;
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: bold;
}

/* 滚动条样式 */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.search-results::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 213, 0.3);
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 213, 0.5);
}
</style>
