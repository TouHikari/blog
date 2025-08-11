<script setup lang="ts">
// 获取最近的博客文章
const { data: recentPosts } = await useAsyncData('recent-posts', async () => {
  const posts = await queryCollection('content')
    .where('_path', 'startsWith', '/blog')
    .sort({ date: -1 })
    .limit(5)
    .find()
  
  return posts.map(post => ({
    title: post.title,
    url: post._path,
    date: post.date,
    description: post.description
  }))
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
</script>

<template>
  <div class="recent-posts-widget">
    <ul class="recent-posts-list" v-if="recentPosts && recentPosts.length > 0">
      <li v-for="post in recentPosts" :key="post.url" class="recent-post-item">
        <NuxtLink :to="post.url" class="recent-post-link">
          <div class="post-title">{{ post.title }}</div>
          <div class="post-date">
            <i class="fa fa-calendar"></i>
            {{ formatDate(post.date) }}
          </div>
          <div v-if="post.description" class="post-excerpt">
            {{ post.description }}
          </div>
        </NuxtLink>
      </li>
    </ul>
    <p v-else class="no-posts">暂无文章</p>
  </div>
</template>

<style scoped>
.recent-posts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-post-item {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px dashed rgba(0, 255, 170, 0.2);
}

.recent-post-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.recent-post-link {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.recent-post-link:hover {
  transform: translateX(4px);
}

.post-title {
  color: var(--cyberpunk-cyan);
  font-size: 0.9em;
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

.recent-post-link:hover .post-title {
  color: var(--cyberpunk-light-yellow);
}

.post-date {
  color: #999;
  font-size: 0.75em;
  margin-bottom: 6px;
}

.post-date i {
  margin-right: 4px;
}

.post-excerpt {
  color: #ccc;
  font-size: 0.8em;
  line-height: 1.3;
  opacity: 0.8;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.no-posts {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}
</style>
