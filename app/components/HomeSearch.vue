<template>
  <div class="search-container">
    <div class="search-wrapper">
      <div class="search-input-container">
        <Icon name="mdi:magnify" class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索..."
          class="search-input"
          autocomplete="off"
          @focus="isSearchFocused = true"
          @keydown="handleKeydown"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-button"
          type="button"
        >
          <Icon name="mdi:close" />
        </button>
      </div>

      <!-- 搜索建议/结果下拉框 -->
      <div
        v-if="isSearchFocused && (searchSuggestions.length > 0 || searchQuery)"
        class="search-dropdown"
      >
        <div v-if="searchSuggestions.length > 0" class="suggestions-section">
          <div class="section-title">搜索建议</div>
          <div
            v-for="(suggestion, index) in searchSuggestions"
            :key="suggestion.id"
            :class="['suggestion-item', { selected: selectedIndex === index }]"
            @click="selectSuggestion(suggestion, index)"
            @mouseenter="selectedIndex = index"
          >
            <div class="suggestion-content">
              <Icon :name="suggestion.icon" class="suggestion-icon" />
              <div>
                <span class="suggestion-text">{{ suggestion.title }}</span>
                <span v-if="suggestion.description" class="suggestion-description">{{ suggestion.description }}</span>
              </div>
            </div>
            <span class="suggestion-type">{{ suggestion.type }}</span>
          </div>
        </div>
        <div v-else class="no-results">
          <Icon name="mdi:file-search-outline" class="no-results-icon" />
          <span>未找到相关内容</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

/* 定义内容项接口 */
interface ContentItem {
  id: string | number
  title: string
  type: string
  icon: string
  path: string
  description: string
  tags?: string[]
}

/* 定义搜索建议接口 */
interface SearchSuggestion extends ContentItem {
  score: number
}

/* 定义博客文章接口 */
interface BlogPost {
  _path: string
  title: string
  description?: string
  tags?: string[]
  date?: string
}

/* 响应式数据 */
const searchQuery = ref('')
const isSearchFocused = ref(false)
const searchResults = ref<ContentItem[]>([])
const allContent = ref<ContentItem[]>([])
const isLoading = ref(false)

/* 获取所有内容 */
const loadAllContent = async () => {
  try {
    /* 获取所有博客文章 */
    const { data: blogPosts } = await $fetch<{ data: BlogPost[] }>('/api/_content/query?_params={"where":[{"_path":{"$regex":"/blog"}}],"only":["title","_path","tags","description","date"]}')
    
    const content: ContentItem[] = []
    
    /* 添加博客文章 */
    if (blogPosts) {
      blogPosts.forEach((post: any) => {
        content.push({
          id: post._path,
          title: post.title,
          type: '文章',
          icon: 'mdi:file-document-outline',
          path: post._path,
          description: post.description || '',
          tags: post.tags || []
        })
        
        /* 添加文章的标签作为搜索项 */
        if (post.tags && Array.isArray(post.tags)) {
          post.tags.forEach((tag: string) => {
            if (!content.find(item => item.title === tag && item.type === '标签')) {
              content.push({
                id: `tag-${tag}`,
                title: tag,
                type: '标签',
                icon: 'mdi:tag-outline',
                path: `/tags/${tag.toLowerCase()}`,
                description: `标签: ${tag}`
              })
            }
          })
        }
      })
    }
    
    /* 添加固定的分类和页面 */
    content.push(
      { id: 'about', title: '关于', type: '页面', icon: 'mdi:account-circle', path: '/about', description: '了解更多关于 TouHikari' },
      { id: 'blog', title: '博客', type: '页面', icon: 'mdi:database', path: '/blog', description: '所有博客文章' },
      { id: 'categories', title: '分类', type: '页面', icon: 'mdi:folder-network', path: '/categories', description: '文章分类' },
      { id: 'tags', title: '标签', type: '页面', icon: 'mdi:tag-multiple', path: '/tags', description: '文章标签' }
    )
    
    allContent.value = content as ContentItem[]
  } catch (error) {
    console.error('加载内容失败:', error)
    /* 如果API调用失败，使用静态数据作为后备 */
    allContent.value = [
      { id: 1, title: '创世纪：代号 TouHikari 已上线', type: '文章', icon: 'mdi:file-document-outline', path: '/blog/genesis', description: 'Hello, Guest!' },
      { id: 2, title: '在 Vue 3 项目中前端使用 Luckysheet 遇到的若干问题及解决方法', type: '文章', icon: 'mdi:file-document-outline', path: '/blog/luckysheet-in-vue-3-frontend', description: 'Vue 3 + Luckysheet 实践指南' },
      { id: 3, title: 'VuePress 风格的 Markdown 功能演示', type: '文章', icon: 'mdi:file-document-outline', path: '/blog/vuepress-features-demo', description: 'Markdown 扩展功能演示' },
      { id: 4, title: '关于', type: '页面', icon: 'mdi:account-circle', path: '/about', description: '了解更多关于 TouHikari' },
      { id: 5, title: '博客', type: '页面', icon: 'mdi:database', path: '/blog', description: '所有博客文章' },
      { id: 6, title: 'Vue 3', type: '标签', icon: 'mdi:tag-outline', path: '/tags/vue-3', description: '标签: Vue 3' },
      { id: 7, title: 'JavaScript', type: '标签', icon: 'mdi:tag-outline', path: '/tags/javascript', description: '标签: JavaScript' },
      { id: 8, title: 'Meta', type: '标签', icon: 'mdi:tag-outline', path: '/tags/meta', description: '标签: Meta' }
    ] as ContentItem[]
  }
}

/* 组件挂载时加载内容 */
onMounted(() => {
  loadAllContent()
})

/* 搜索相关状态 */
const selectedIndex = ref(-1)

/* 计算搜索建议 */
const searchSuggestions = computed<SearchSuggestion[]>(() => {
  if (!searchQuery.value.trim()) {
    return allContent.value.slice(0, 8).map(item => ({ ...item, score: 0 }))
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return allContent.value
    .filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query)
      const typeMatch = item.type.toLowerCase().includes(query)
      const descMatch = item.description?.toLowerCase().includes(query)
      const tagMatch = item.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      return titleMatch || typeMatch || descMatch || tagMatch
    })
    .map(item => {
      /* 计算匹配度分数 */
      let score = 0
      const title = item.title.toLowerCase()
      
      /* 完全匹配得分最高 */
      if (title === query) score += 100
      /* 标题开头匹配 */
      else if (title.startsWith(query)) score += 50
      /* 标题包含匹配 */
      else if (title.includes(query)) score += 25
      
      /* 类型匹配加分 */
      if (item.type.toLowerCase().includes(query)) score += 10
      
      /* 描述匹配加分 */
      if (item.description?.toLowerCase().includes(query)) score += 5
      
      /* 标签匹配加分 */
      if (item.tags?.some((tag: string) => tag.toLowerCase().includes(query))) score += 15
      
      return { ...item, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
})

/* 监听搜索建议变化，重置选中索引 */
watch(searchSuggestions, () => {
  selectedIndex.value = -1
})

/* 键盘导航处理 */
const handleKeydown = (event: KeyboardEvent) => {
  if (!isSearchFocused.value || searchSuggestions.value.length === 0) {
    return
  }
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, searchSuggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < searchSuggestions.value.length) {
        const selectedSuggestion = searchSuggestions.value[selectedIndex.value]
        if (selectedSuggestion) {
          selectSuggestion(selectedSuggestion)
        }
      } else {
        handleSearch()
      }
      break
    case 'Escape':
      isSearchFocused.value = false
      selectedIndex.value = -1
      break
  }
}

/* 搜索处理函数 */
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  
  /* 如果有选中的建议项，直接跳转 */
  if (selectedIndex.value >= 0 && selectedIndex.value < searchSuggestions.value.length) {
    const selectedSuggestion = searchSuggestions.value[selectedIndex.value]
    if (selectedSuggestion) {
      selectSuggestion(selectedSuggestion)
      return
    }
  }
  
  /* 否则跳转到搜索结果页面 */
  const results = searchSuggestions.value
  
  if (results.length > 0) {
    /* 这里可以跳转到搜索结果页面，或者在当前页面显示搜索结果 */
    /* navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`) */
    
    /* 暂时显示搜索结果在控制台 */
    if (results.length === 1) {
      /* 如果只有一个结果，直接跳转 */
      const firstResult = results[0]
      if (firstResult) {
        navigateTo(firstResult.path)
      }
    } else {
      /* 多个结果时，可以实现一个搜索结果页面 */
      console.log('搜索结果:', results)
    }
  }
}

/* 选择建议项 */
const selectSuggestion = (suggestion: SearchSuggestion, index?: number) => {
  if (typeof index === 'number') {
    selectedIndex.value = index
  }
  searchQuery.value = suggestion.title
  isSearchFocused.value = false
  selectedIndex.value = -1
  navigateTo(suggestion.path)
}

/* 清空搜索 */
const clearSearch = () => {
  searchQuery.value = ''
}

/* 失焦处理 */
const handleBlur = () => {
  /* 延迟隐藏下拉框，以便点击建议项 */
  setTimeout(() => {
    isSearchFocused.value = false
  }, 200)
}
</script>

<style lang="scss" scoped>
@use '~/styles/variables' as *;
@use '~/styles/mixins' as *;
@use '~/styles/fonts' as *;
@use '~/styles/terminal-glow' as *;

.search-container {
  width: 100%;
  max-width: 600px;
  margin: 1rem auto;
  position: relative;
  z-index: 10;
}

.search-wrapper {
  position: relative;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid $cyberpunk-pink;
  border-radius: 8px;
  padding: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    border-color: $cyberpunk-light-pink;
    box-shadow: 0 0 20px rgba(255, 64, 128, 0.3);
  }
  
  &:focus-within {
    border-color: $cyberpunk-cyan;
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.4),
      inset 0 0 20px rgba(0, 255, 255, 0.1);
    
    .search-icon {
      color: $cyberpunk-cyan;
      transform: scale(1.1);
    }
  }
}

.search-icon {
  color: $cyberpunk-pink;
  font-size: 1.2rem;
  margin: 0 12px 0 16px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: $white;
  font-size: 1rem;
  padding: 8px 8px;
  font-family: $font-cyber;
  letter-spacing: 0.5px;
  
  &::placeholder {
    color: $white-55;
    font-style: italic;
  }
}

.clear-button {
  background: transparent;
  border: none;
  color: $white-80;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: $cyberpunk-pink;
    transform: scale(1.1);
  }
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid $cyberpunk-pink;
  border-top: none;
  border-radius: 0 0 8px 8px;
  backdrop-filter: blur(15px);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  
  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: $cyberpunk-pink;
    border-radius: 3px;
    
    &:hover {
      background: $cyberpunk-light-pink;
    }
  }
}

.suggestions-section {
  padding: 8px 0;
}

.section-title {
  padding: 8px 16px;
  font-size: 0.75rem;
  color: $white-55;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 64, 128, 0.2);
  margin-bottom: 4px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  
  &:hover,
  &.selected {
    background: rgba(255, 64, 128, 0.1);
    border-left-color: $cyberpunk-pink;
  }
}

.suggestion-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.suggestion-icon {
  color: $cyberpunk-cyan;
  font-size: 1.1rem;
  margin-right: 12px;
  flex-shrink: 0;
}

.suggestion-text {
  color: $white;
  font-weight: 500;
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-description {
  color: $white-55;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  margin-top: 2px;
}

.suggestion-type {
  color: $cyberpunk-pink;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  color: $white-55;
  font-style: italic;
  
  .no-results-icon {
    margin-right: 8px;
    font-size: 1.2rem;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
    margin: 1.5rem 1rem;
  }
  
  .search-input {
    font-size: 0.9rem;
    padding: 14px 8px;
  }
  
  .search-dropdown {
    max-height: 300px;
  }
  
  .suggestion-item {
    padding: 10px 12px;
  }
  
  .suggestion-text {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .search-container {
    margin: 1rem 0.5rem;
  }
  
  .search-input {
    font-size: 0.85rem;
    padding: 12px 6px;
  }
  
  .search-icon {
    margin: 0 8px 0 12px;
    font-size: 1.1rem;
  }
  
  .clear-button {
    padding: 6px 12px;
  }
}
</style>