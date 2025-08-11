<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string[]
const path = `/blog/${slug.join('/')}`

// 获取文章内容
const { data: post } = await useAsyncData(`post-${path}`, async () => {
  return await queryCollection('content').path(path).first()
})

// 如果文章不存在，抛出404错误
if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found'
  })
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SEO设置
useSeoMeta({
  title: `${post.value.title} - TouHikari.top`,
  description: post.value.description || post.value.title,
  ogTitle: post.value.title,
  ogDescription: post.value.description || post.value.title,
  ogType: 'article',
  articleAuthor: 'TouHikari',
  articlePublishedTime: post.value.date,
  articleModifiedTime: post.value.updated || post.value.date
})
</script>

<template>
  <div class="blog-post">
    <article class="post-content">
      <!-- 文章头部 -->
      <header class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        
        <div class="post-meta">
          <div class="meta-item">
            <i class="fa fa-calendar"></i>
            <span>{{ formatDate(post.date) }}</span>
          </div>
          
          <div v-if="post.category" class="meta-item">
            <i class="fa fa-folder"></i>
            <NuxtLink :to="`/categories/${post.category}`">{{ post.category }}</NuxtLink>
          </div>
          
          <div v-if="post.tags && post.tags.length > 0" class="meta-item">
            <i class="fa fa-tags"></i>
            <span class="tags-list">
              <NuxtLink 
                v-for="tag in post.tags" 
                :key="tag"
                :to="`/tags/${tag}`"
                class="tag-link"
              >
                {{ tag }}
              </NuxtLink>
            </span>
          </div>
        </div>
      </header>

      <!-- 文章内容 -->
      <div class="post-body">
        <ContentRenderer :value="post" class="content-prose" />
      </div>

      <!-- 文章底部 -->
      <footer class="post-footer">
        <div class="post-navigation">
          <NuxtLink to="/blog" class="back-to-archive">
            <i class="fa fa-arrow-left"></i>
            返回文章列表
          </NuxtLink>
        </div>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.post-content {
  background: rgba(0, 255, 213, 0.02);
  border: 1px solid rgba(0, 255, 170, 0.1);
  border-radius: 8px;
  padding: 40px;
  margin-bottom: 30px;
}

.post-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px dashed rgba(0, 255, 170, 0.25);
}

.post-title {
  color: var(--cyberpunk-cyan);
  font-size: 2.2em;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 20px;
  text-shadow: 0 0 12px rgba(0, 255, 213, 0.55);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: #999;
  font-size: 0.9em;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-item i {
  opacity: 0.8;
}

.meta-item a {
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  transition: color 0.3s ease;
}

.meta-item a:hover {
  color: var(--cyberpunk-light-yellow);
}

.tags-list {
  display: flex;
  gap: 8px;
}

.tag-link {
  padding: 2px 8px;
  background: rgba(0, 255, 213, 0.1);
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  border-radius: 3px;
  border: 1px dashed var(--cyberpunk-blue);
  font-size: 0.9em;
  transition: all 0.3s ease;
}

.tag-link:hover {
  background-color: var(--cyberpunk-blue);
  color: var(--cyberpunk-light-yellow);
}

.post-body {
  line-height: 1.8;
  font-size: 1.05em;
}

.post-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px dashed rgba(0, 255, 170, 0.25);
}

.post-navigation {
  text-align: center;
}

.back-to-archive {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  padding: 10px 20px;
  border: 1px solid var(--cyberpunk-blue);
  border-radius: 4px;
  background: rgba(0, 255, 213, 0.05);
  transition: all 0.3s ease;
}

.back-to-archive:hover {
  background-color: var(--cyberpunk-blue);
  color: var(--cyberpunk-light-yellow);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-post {
    padding: 10px;
  }
  
  .post-content {
    padding: 20px;
  }
  
  .post-title {
    font-size: 1.8em;
  }
  
  .post-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .tags-list {
    flex-wrap: wrap;
  }
}
</style>
