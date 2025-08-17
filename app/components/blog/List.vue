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
    min-width: 150px;
    padding-left: 5px;
    margin-top: 0;
  }
}

.blog-tags {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 1em;
  gap: 5px;

  .blog-tag {
    font-family: $font-sans;
    font-size: 0.8em;
    color: $neon-pink-light;
    border: 1px solid $neon-pink-light;
    border-radius: 5px;
    padding: 1px 5px;
  }
}
</style>
