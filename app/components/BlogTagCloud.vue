<script setup lang="ts">
// 获取所有博客文章的标签
const { data: tags } = await useAsyncData('blog-tags', async () => {
  const posts = await queryCollection('content')
    .where('_path', 'startsWith', '/blog')
    .find()
  
  const tagMap = new Map()
  
  posts.forEach(post => {
    if (post.tags) {
      const tags = Array.isArray(post.tags) ? post.tags : [post.tags]
      tags.forEach(tag => {
        if (tagMap.has(tag)) {
          tagMap.set(tag, tagMap.get(tag) + 1)
        } else {
          tagMap.set(tag, 1)
        }
      })
    }
  })
  
  // 计算标签的字体大小（基于使用频率）
  const maxCount = Math.max(...Array.from(tagMap.values()))
  const minCount = Math.min(...Array.from(tagMap.values()))
  
  return Array.from(tagMap.entries()).map(([name, count]) => {
    // 计算相对大小 (0.8em - 1.4em)
    const ratio = maxCount === minCount ? 1 : (count - minCount) / (maxCount - minCount)
    const fontSize = 0.8 + (ratio * 0.6)
    
    return {
      name,
      count,
      fontSize: `${fontSize}em`,
      url: `/tags/${name}`
    }
  }).sort((a, b) => a.name.localeCompare(b.name))
})
</script>

<template>
  <div class="tagcloud-widget">
    <div class="tag-cloud" v-if="tags && tags.length > 0">
      <NuxtLink 
        v-for="tag in tags" 
        :key="tag.name"
        :to="tag.url"
        class="tag-link"
        :style="{ fontSize: tag.fontSize }"
        :title="`${tag.name} (${tag.count} 篇文章)`"
      >
        {{ tag.name }}
      </NuxtLink>
    </div>
    <p v-else class="no-tags">暂无标签</p>
  </div>
</template>

<style scoped>
.tag-cloud {
  line-height: 1.8;
}

.tag-link {
  display: inline-block;
  margin: 4px 6px;
  padding: 2px 8px;
  background: rgba(0, 255, 213, 0.1);
  color: var(--cyberpunk-cyan);
  text-decoration: none;
  border-radius: 3px;
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

.no-tags {
  color: #999;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}
</style>
