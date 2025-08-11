<script setup lang="ts">
interface Tag {
  name: string
  count: number
  fontSize: string
  url: string
}

// 获取所有博客文章的标签
const { data: tags } = await useAsyncData('blog-tags', async (): Promise<Tag[]> => {
  // 模拟标签数据
  const mockTags = [
    { name: '开始', count: 1, fontSize: '1.0em', url: '/tags/开始' },
    { name: '创世纪', count: 1, fontSize: '1.0em', url: '/tags/创世纪' },
    { name: 'Vue', count: 1, fontSize: '1.2em', url: '/tags/Vue' },
    { name: 'Luckysheet', count: 1, fontSize: '1.0em', url: '/tags/Luckysheet' },
    { name: '前端', count: 1, fontSize: '1.4em', url: '/tags/前端' }
  ]

  return mockTags.sort((a, b) => a.name.localeCompare(b.name))
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
