<script setup lang="ts">
interface BlogPost {
  title: string
  description?: string
  date: string
  tags: string[]
  category?: string
  url: string
  toc?: any
}

// 获取所有博客文章
const { data: posts } = await useAsyncData('blog-posts', async (): Promise<BlogPost[]> => {
  // 模拟博客文章数据
  const mockPosts = [
    {
      title: 'Luckysheet in Vue 3 Frontend',
      description: '在Vue 3前端项目中集成Luckysheet',
      date: '2025-01-11',
      tags: ['Vue', 'Luckysheet', '前端'],
      category: '技术',
      url: '/blog/luckysheet-in-Vue-3-frontend'
    },
    {
      title: 'Genesis',
      description: '创世纪 - 博客的开始',
      date: '2025-05-04',
      tags: ['开始', '创世纪'],
      category: '日志',
      url: '/blog/genesis'
    }
  ]

  return mockPosts
})

// 分页配置
const currentPage = ref(1)
const postsPerPage = 10
const totalPages = computed(() => Math.ceil((posts.value?.length || 0) / postsPerPage))

// 当前页的文章
const currentPosts = computed(() => {
  if (!posts.value) return []
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return posts.value.slice(start, end)
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// SEO设置
useSeoMeta({
  title: 'Archives - TouHikari.top',
  description: '所有文章归档 - TouHikari 的数字幽灵日志'
})
</script>

<template>
  <div class="blog-archive">
    <div class="archive-header">
      <h1 class="archive-title">
        <i class="fa fa-archive"></i>
        Archives
      </h1>
      <p class="archive-description">
        共 {{ posts?.length || 0 }} 篇文章
      </p>
    </div>

    <div class="posts-list" v-if="currentPosts.length > 0">
      <article 
        v-for="post in currentPosts" 
        :key="post.url"
        class="post-item"
      >
        <div class="post-header">
          <h2 class="post-title">
            <NuxtLink :to="post.url">{{ post.title }}</NuxtLink>
          </h2>
          <div class="post-meta">
            <span class="post-date">
              <i class="fa fa-calendar"></i>
              {{ formatDate(post.date) }}
            </span>
            <span v-if="post.category" class="post-category">
              <i class="fa fa-folder"></i>
              <NuxtLink :to="`/categories/${post.category}`">{{ post.category }}</NuxtLink>
            </span>
          </div>
        </div>

        <div v-if="post.description" class="post-excerpt">
          {{ post.description }}
        </div>

        <div v-if="post.tags && post.tags.length > 0" class="post-tags">
          <i class="fa fa-tags"></i>
          <NuxtLink 
            v-for="tag in post.tags" 
            :key="tag"
            :to="`/tags/${tag}`"
            class="tag-link"
          >
            {{ tag }}
          </NuxtLink>
        </div>

        <div class="post-actions">
          <NuxtLink :to="post.url" class="read-more">
            阅读全文 <i class="fa fa-arrow-right"></i>
          </NuxtLink>
        </div>
      </article>
    </div>

    <div v-else class="no-posts">
      <p>暂无文章</p>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination-wrapper">
      <nav class="pagination">
        <button 
          @click="currentPage = currentPage - 1"
          :disabled="currentPage <= 1"
          class="pagination-btn pagination-prev"
        >
          <i class="fa fa-chevron-left"></i>
          上一页
        </button>
        
        <span class="pagination-info">
          第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
        </span>
        
        <button 
          @click="currentPage = currentPage + 1"
          :disabled="currentPage >= totalPages"
          class="pagination-btn pagination-next"
        >
          下一页
          <i class="fa fa-chevron-right"></i>
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.blog-archive {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.archive-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(0, 255, 170, 0.3);
}

.archive-title {
  color: var(--cyberpunk-cyan);
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 0 0 12px rgba(0, 255, 213, 0.55);
}

.archive-title i {
  margin-right: 15px;
}

.archive-description {
  color: #ccc;
  font-size: 1.1em;
}

.posts-list {
  margin-bottom: 40px;
}

.post-item {
  background: rgba(0, 255, 213, 0.03);
  border: 1px solid rgba(0, 255, 170, 0.15);
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  transition: all 0.3s ease;
}

.post-item:hover {
  border-color: rgba(0, 255, 170, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 213, 0.1);
}

.post-title {
  margin-bottom: 10px;
}

.post-title a {
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  font-size: 1.4em;
  font-weight: 600;
  transition: color 0.3s ease;
}

.post-title a:hover {
  color: var(--cyberpunk-light-yellow);
}

.post-meta {
  margin-bottom: 15px;
  font-size: 0.9em;
  color: #999;
}

.post-meta span {
  margin-right: 20px;
}

.post-meta i {
  margin-right: 5px;
}

.post-meta a {
  color: var(--cyberpunk-cyan);
  text-decoration: none;
}

.post-meta a:hover {
  color: var(--cyberpunk-light-yellow);
}

.post-excerpt {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 15px;
}

.post-tags {
  margin-bottom: 15px;
}

.post-tags i {
  margin-right: 8px;
  color: #999;
}

.tag-link {
  display: inline-block;
  margin-right: 8px;
  padding: 2px 8px;
  background: rgba(0, 255, 213, 0.1);
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  border-radius: 3px;
  border: 1px dashed var(--cyberpunk-blue);
  font-size: 0.85em;
  transition: all 0.3s ease;
}

.tag-link:hover {
  background-color: var(--cyberpunk-blue);
  color: var(--cyberpunk-light-yellow);
}

.post-actions {
  text-align: right;
}

.read-more {
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.read-more:hover {
  color: var(--cyberpunk-light-yellow);
}

.read-more i {
  margin-left: 5px;
}

.no-posts {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 60px 0;
}

.pagination-wrapper {
  margin-top: 40px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.pagination-btn {
  background: rgba(0, 255, 213, 0.1);
  border: 1px solid var(--cyberpunk-blue);
  color: var(--cyberpunk-cyan);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--cyberpunk-blue);
  color: var(--cyberpunk-light-yellow);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #ccc;
  font-size: 0.9em;
}
</style>
