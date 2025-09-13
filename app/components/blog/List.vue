<script setup lang="ts">
// 自动查询所有博客文章
const { data: articles } = await useAsyncData('blog-articles', async (): Promise<any[]> => {
  try {
    // 直接获取blog集合中的所有文章
    const allBlogArticles = await queryCollection('blog').all()

    if (!allBlogArticles || allBlogArticles.length === 0) {
      return []
    }

    // 处理每篇文章的摘要数据
    const processedArticles = allBlogArticles.map((article: any) => {
      let excerptContent = null

      // 使用现成的excerpt数据
      if (article.meta && article.meta.excerpt) {
        excerptContent = article.meta.excerpt
      }

      return {
        ...article,
        excerptContent
      }
    })

    // 按日期降序排序
    return processedArticles.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('获取博客文章失败:', error)
    return []
  }
})
</script>

<template>
  <div class="blog-list">
    <div v-for="article in articles" :key="article.path" class="blog-item">
      <div class="blog-header">
        <h3 class="blog-title">
          <NuxtLink :to="article.path">{{ article.title }}</NuxtLink>
        </h3>
        <div class="blog-date">post @ {{ article.date }}</div>
      </div>
      <div class="blog-excerpt">
        <ContentRenderer v-if="article.excerptContent" :value="article.excerptContent" />
        <p v-else>{{ article.description || '暂无摘要' }}</p>
      </div>
      <div class="blog-tags" v-if="article.meta?.tags">
        <span v-for="tag in article.meta.tags" :key="tag" class="blog-tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/fonts' as *;
@use '~/styles/variables' as *;

.blog-list {
  margin-top: 1em;
  font-family: $font-sans;
}

.blog-item {
  margin-bottom: 2em;
  padding-bottom: 1em;
  border-bottom: 1px solid white;
}

.blog-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1em;

  .blog-title {
    font-family: $font-cyber;
    padding-right: 5px;
    margin-top: 0;
    margin-bottom: 0;
  }

  .blog-date {
    font-family: $font-sans;
    color: $cyberpunk-light-yellow;
    min-width: 150px;
    padding-left: 5px;
    margin-top: 0;
    cursor: default;
    user-select: none;
  }
}

.blog-tags {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 1em;
  gap: 5px;

  .blog-tag {
    font-family: $font-mono;
    font-size: 0.75em;
    font-weight: 600;
    color: $cyberpunk-pink;
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 170, 0.05));
    border: 1px solid $cyberpunk-pink;
    border-radius: 2px;
    padding: 2px 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
    transition: all 0.05s ease;
    cursor: default;
    user-select: none;

    // 内部发光效果
    box-shadow:
      inset 0 0 8px rgba(255, 64, 128, 0.2),
      0 0 4px rgba(255, 64, 128, 0.3);

    // 悬停效果
    &:hover {

      // 扫描线效果
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, $cyberpunk-light-yellow, transparent);
        animation: scan 2s infinite;
      }

      color: $cyberpunk-light-yellow;
      border-color: $cyberpunk-light-yellow;
      background: linear-gradient(135deg, rgba(255, 255, 0, 0.15), rgba(255, 190, 11, 0.08));
      box-shadow: inset 0 0 12px rgba(255, 255, 0, 0.3),
      0 0 8px rgba(255, 255, 0, 0.4),
      0 0 16px rgba(255, 255, 0, 0.2);
    }
  }

  @keyframes scan {
    0% {
      left: -100%;
    }

    100% {
      left: 100%;
    }
  }
}
</style>
