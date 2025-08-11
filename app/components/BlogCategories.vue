<script setup lang="ts">
interface Category {
  name: string
  count: number
  url: string
}

// 获取所有博客文章的分类
const { data: categories } = await useAsyncData('blog-categories', async (): Promise<Category[]> => {
  // 模拟分类数据
  const mockCategories = [
    { name: '日志', count: 1, url: '/categories/日志' },
    { name: '技术', count: 1, url: '/categories/技术' }
  ]

  return mockCategories
})
</script>

<template>
  <div class="categories-widget">
    <ul class="category-list" v-if="categories && categories.length > 0">
      <li v-for="category in categories" :key="category.name" class="category-item">
        <NuxtLink :to="category.url" class="category-link">
          <i class="fa fa-folder-o"></i>
          {{ category.name }}
          <span class="category-count">({{ category.count }})</span>
        </NuxtLink>
      </li>
    </ul>
    <p v-else class="no-categories">暂无分类</p>
  </div>
</template>

<style scoped>
.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  margin-bottom: 8px;
}

.category-link {
  display: block;
  padding: 6px 0;
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  transition: all 0.3s ease;
}

.category-link:hover {
  color: var(--cyberpunk-light-yellow);
  background: var(--cyberpunk-blue);
  padding-left: 8px;
}

.category-link i {
  margin-right: 8px;
  opacity: 0.8;
}

.category-count {
  float: right;
  font-size: 0.85em;
  opacity: 0.7;
}

.no-categories {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}
</style>
