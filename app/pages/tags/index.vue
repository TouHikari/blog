<script setup lang="ts">
interface TagPost {
  title: string
  url: string
  date: string
  description?: string
}

interface Tag {
  name: string
  count: number
  fontSize: string
  posts: TagPost[]
}

// 获取所有标签
const { data: tags } = await useAsyncData('all-tags', async (): Promise<Tag[]> => {
  // 模拟标签数据
  const mockTags = [
    {
      name: '开始',
      count: 1,
      fontSize: '1.0em',
      posts: [{
        title: 'Genesis',
        url: '/blog/genesis',
        date: '2025-05-04',
        description: '创世纪 - 博客的开始'
      }]
    },
    {
      name: '创世纪',
      count: 1,
      fontSize: '1.0em',
      posts: [{
        title: 'Genesis',
        url: '/blog/genesis',
        date: '2025-05-04',
        description: '创世纪 - 博客的开始'
      }]
    },
    {
      name: 'Vue',
      count: 1,
      fontSize: '1.2em',
      posts: [{
        title: 'Luckysheet in Vue 3 Frontend',
        url: '/blog/luckysheet-in-Vue-3-frontend',
        date: '2025-01-11',
        description: '在Vue 3前端项目中集成Luckysheet'
      }]
    },
    {
      name: 'Luckysheet',
      count: 1,
      fontSize: '1.0em',
      posts: [{
        title: 'Luckysheet in Vue 3 Frontend',
        url: '/blog/luckysheet-in-Vue-3-frontend',
        date: '2025-01-11',
        description: '在Vue 3前端项目中集成Luckysheet'
      }]
    },
    {
      name: '前端',
      count: 1,
      fontSize: '1.4em',
      posts: [{
        title: 'Luckysheet in Vue 3 Frontend',
        url: '/blog/luckysheet-in-Vue-3-frontend',
        date: '2025-01-11',
        description: '在Vue 3前端项目中集成Luckysheet'
      }]
    }
  ]

  return mockTags.sort((a, b) => a.name.localeCompare(b.name))
})

// SEO设置
useSeoMeta({
  title: 'Tags - TouHikari.top',
  description: '文章标签 - TouHikari 的数字幽灵日志'
})
</script>

<template>
  <div class="tags-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fa fa-tags"></i>
        Tags
      </h1>
      <p class="page-description">
        共 {{ tags?.length || 0 }} 个标签
      </p>
    </div>

    <div class="tags-cloud" v-if="tags && tags.length > 0">
      <NuxtLink 
        v-for="tag in tags" 
        :key="tag.name"
        :to="`/tags/${tag.name}`"
        class="tag-link"
        :style="{ fontSize: tag.fontSize }"
        :title="`${tag.name} (${tag.count} 篇文章)`"
      >
        {{ tag.name }}
        <span class="tag-count">({{ tag.count }})</span>
      </NuxtLink>
    </div>

    <div v-else class="no-tags">
      <p>暂无标签</p>
    </div>

    <!-- 标签列表视图 -->
    <div class="tags-list-view" v-if="tags && tags.length > 0">
      <h2 class="section-title">
        <i class="fa fa-list"></i>
        标签列表
      </h2>
      
      <div class="tags-grid">
        <div 
          v-for="tag in tags" 
          :key="tag.name"
          class="tag-card"
        >
          <div class="tag-header">
            <h3 class="tag-name">
              <NuxtLink :to="`/tags/${tag.name}`">
                <i class="fa fa-tag"></i>
                {{ tag.name }}
              </NuxtLink>
            </h3>
            <span class="tag-count-badge">{{ tag.count }} 篇文章</span>
          </div>
          
          <div class="tag-posts">
            <div 
              v-for="post in tag.posts.slice(0, 3)" 
              :key="post.url"
              class="post-preview"
            >
              <NuxtLink :to="post.url" class="post-link">
                {{ post.title }}
              </NuxtLink>
            </div>
            
            <div v-if="tag.posts.length > 3" class="more-posts">
              <NuxtLink :to="`/tags/${tag.name}`" class="view-all">
                查看全部 {{ tag.count }} 篇文章 →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tags-page {
  max-width: 1000px;
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
}

.tags-cloud {
  background: rgba(0, 255, 213, 0.03);
  border: 1px solid rgba(0, 255, 170, 0.15);
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 50px;
  text-align: center;
  line-height: 2;
}

.tag-link {
  display: inline-block;
  margin: 8px 12px;
  padding: 6px 12px;
  background: rgba(0, 255, 213, 0.1);
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  border-radius: 4px;
  border: 1px dashed var(--cyberpunk-blue);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tag-link:hover {
  background-color: var(--cyberpunk-blue);
  color: var(--cyberpunk-light-yellow);
  transform: scale(1.05);
  box-shadow: 0 0 8px rgba(0, 255, 213, 0.3);
}

.tag-count {
  font-size: 0.8em;
  opacity: 0.7;
  margin-left: 4px;
}

.section-title {
  color: var(--cyberpunk-cyan);
  font-size: 1.8em;
  margin-bottom: 30px;
  text-align: center;
  border-bottom: 1px dashed rgba(0, 255, 170, 0.25);
  padding-bottom: 15px;
}

.section-title i {
  margin-right: 10px;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.tag-card {
  background: rgba(0, 255, 213, 0.03);
  border: 1px solid rgba(0, 255, 170, 0.15);
  border-radius: 8px;
  padding: 25px;
  transition: all 0.3s ease;
}

.tag-card:hover {
  border-color: rgba(0, 255, 170, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 213, 0.1);
  transform: translateY(-2px);
}

.tag-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed rgba(0, 255, 170, 0.2);
}

.tag-name {
  margin-bottom: 8px;
}

.tag-name a {
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  font-size: 1.2em;
  font-weight: 600;
  transition: color 0.3s ease;
}

.tag-name a:hover {
  color: var(--cyberpunk-light-yellow);
}

.tag-name i {
  margin-right: 8px;
  opacity: 0.8;
}

.tag-count-badge {
  color: #999;
  font-size: 0.9em;
}

.tag-posts {
  space-y: 10px;
}

.post-preview {
  margin-bottom: 12px;
}

.post-link {
  color: #ccc;
  text-decoration: none;
  font-size: 0.95em;
  line-height: 1.4;
  transition: color 0.3s ease;
  display: block;
  padding: 4px 0;
}

.post-link:hover {
  color: var(--cyberpunk-cyan);
  padding-left: 8px;
}

.more-posts {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed rgba(0, 255, 170, 0.15);
}

.view-all {
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  font-size: 0.9em;
  font-weight: 500;
  transition: color 0.3s ease;
}

.view-all:hover {
  color: var(--cyberpunk-light-yellow);
}

.no-tags {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 60px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tags-page {
    padding: 10px;
  }
  
  .tags-cloud {
    padding: 20px;
  }
  
  .tags-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .tag-card {
    padding: 20px;
  }
  
  .page-title {
    font-size: 2em;
  }
  
  .tag-link {
    margin: 6px 8px;
    padding: 4px 8px;
  }
}
</style>
