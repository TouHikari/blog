<script setup lang="ts">
interface TagPost {
  title: string
  description?: string
  date: string
  category?: string
  tags: string[]
  url: string
}

const route = useRoute()
const tagName = route.params.tag as string

// 获取该标签下的所有文章
const { data: posts } = await useAsyncData(`tag-${tagName}`, async (): Promise<TagPost[]> => {
  // 模拟所有文章数据
  const allPosts = [
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

  // 过滤出包含该标签的文章
  const tagPosts = allPosts.filter(post => post.tags.includes(tagName))

  return tagPosts.map(post => ({
    title: post.title,
    description: post.description,
    date: post.date,
    category: post.category,
    tags: post.tags,
    url: post.url
  }))
})

// 如果标签不存在或没有文章，显示404
if (!posts.value || posts.value.length === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Tag not found or no posts with this tag'
  })
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

// SEO设置
useSeoMeta({
  title: `${tagName} - Tags - TouHikari.top`,
  description: `标签"${tagName}"下的所有文章 - TouHikari 的数字幽灵日志`
})
</script>

<template>
  <div class="tag-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fa fa-tag"></i>
        {{ tagName }}
      </h1>
      <p class="page-description">
        共 {{ posts?.length || 0 }} 篇文章
      </p>
      <div class="breadcrumb">
        <NuxtLink to="/tags" class="breadcrumb-link">
          <i class="fa fa-tags"></i>
          Tags
        </NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ tagName }}</span>
      </div>
    </div>

    <div class="posts-list" v-if="posts && posts.length > 0">
      <article 
        v-for="post in posts" 
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
            :class="{ 'current-tag': tag === tagName }"
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
      <p>该标签下暂无文章</p>
    </div>
  </div>
</template>

<style scoped>
.tag-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(0, 255, 170, 0.3);
}

.page-title {
  color: var(--cyberpunk-cyan);
  font-size: 2.5em;
  margin-bottom: 10px;
  text-shadow: 0 0 12px rgba(0, 255, 213, 0.55);
}

.page-title i {
  margin-right: 15px;
}

.page-description {
  color: #ccc;
  font-size: 1.1em;
  margin-bottom: 15px;
}

.breadcrumb {
  font-size: 0.9em;
  color: #999;
}

.breadcrumb-link {
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: var(--cyberpunk-light-yellow);
}

.breadcrumb-separator {
  margin: 0 8px;
}

.breadcrumb-current {
  color: #ccc;
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

.tag-link.current-tag {
  background-color: var(--cyberpunk-pink);
  border-color: var(--cyberpunk-pink);
  color: #fff;
  font-weight: bold;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .tag-page {
    padding: 10px;
  }
  
  .post-item {
    padding: 20px;
  }
  
  .page-title {
    font-size: 2em;
  }
  
  .post-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .post-meta span {
    margin-right: 0;
  }
}
</style>
