<script setup lang="ts">
interface CategoryPost {
  title: string
  url: string
  date: string
  description?: string
}

interface Category {
  name: string
  count: number
  posts: CategoryPost[]
}

// 获取所有分类
const { data: categories } = await useAsyncData('all-categories', async (): Promise<Category[]> => {
  // 模拟分类数据
  const mockCategories = [
    {
      name: '技术',
      count: 1,
      posts: [{
        title: 'Luckysheet in Vue 3 Frontend',
        url: '/blog/luckysheet-in-Vue-3-frontend',
        date: '2025-01-11',
        description: '在Vue 3前端项目中集成Luckysheet'
      }]
    },
    {
      name: '日志',
      count: 1,
      posts: [{
        title: 'Genesis',
        url: '/blog/genesis',
        date: '2025-05-04',
        description: '创世纪 - 博客的开始'
      }]
    }
  ]

  return mockCategories.sort((a, b) => b.count - a.count)
})

// SEO设置
useSeoMeta({
  title: 'Categories - TouHikari.top',
  description: '文章分类 - TouHikari 的数字幽灵日志'
})
</script>

<template>
  <div class="categories-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fa fa-folder"></i>
        Categories
      </h1>
      <p class="page-description">
        共 {{ categories?.length || 0 }} 个分类
      </p>
    </div>

    <div class="categories-grid" v-if="categories && categories.length > 0">
      <div 
        v-for="category in categories" 
        :key="category.name"
        class="category-card"
      >
        <div class="category-header">
          <h2 class="category-name">
            <NuxtLink :to="`/categories/${category.name}`">
              <i class="fa fa-folder-open"></i>
              {{ category.name }}
            </NuxtLink>
          </h2>
          <span class="category-count">{{ category.count }} 篇文章</span>
        </div>
        
        <div class="category-posts">
          <div 
            v-for="post in category.posts.slice(0, 3)" 
            :key="post.url"
            class="post-preview"
          >
            <NuxtLink :to="post.url" class="post-link">
              {{ post.title }}
            </NuxtLink>
          </div>
          
          <div v-if="category.posts.length > 3" class="more-posts">
            <NuxtLink :to="`/categories/${category.name}`" class="view-all">
              查看全部 {{ category.count }} 篇文章 →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-categories">
      <p>暂无分类</p>
    </div>
  </div>
</template>

<style scoped>
.categories-page {
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.category-card {
  background: rgba(0, 255, 213, 0.03);
  border: 1px solid rgba(0, 255, 170, 0.15);
  border-radius: 8px;
  padding: 25px;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: rgba(0, 255, 170, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 213, 0.1);
  transform: translateY(-2px);
}

.category-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed rgba(0, 255, 170, 0.2);
}

.category-name {
  margin-bottom: 8px;
}

.category-name a {
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  font-size: 1.3em;
  font-weight: 600;
  transition: color 0.3s ease;
}

.category-name a:hover {
  color: var(--cyberpunk-light-yellow);
}

.category-name i {
  margin-right: 8px;
  opacity: 0.8;
}

.category-count {
  color: #999;
  font-size: 0.9em;
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

.no-categories {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 60px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .categories-page {
    padding: 10px;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .category-card {
    padding: 20px;
  }
  
  .page-title {
    font-size: 2em;
  }
}
</style>
