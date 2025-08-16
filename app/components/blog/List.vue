<script setup lang="ts">
// 查询所有博客文章
const { data: articles } = await useAsyncData('blog-articles', async () => {
  try {
    // 手动获取所有博客文章
    const articlePaths = ['genesis', 'luckysheet-in-vue-3-frontend', 'test', 'vuepress-features-demo']
    const articles = []

    for (const path of articlePaths) {
      try {
        const article = await queryCollection('blog').path(`/blog/${path}`).first()
        if (article) {
          // 处理摘要
          let excerpt = ''
          if (article.body) {
            const bodyText = JSON.stringify(article.body)
            const moreIndex = bodyText.indexOf('<!--more-->')
            if (moreIndex !== -1) {
              excerpt = bodyText.substring(0, moreIndex).replace(/[{}"]/g, '').trim()
            } else {
              excerpt = bodyText.substring(0, 200).replace(/[{}"]/g, '').trim() + '...'
            }
          }

          articles.push({
            ...article,
            excerpt
          })
        }
      } catch (e) {
        console.log(`无法加载文章: ${path}`)
      }
    }

    // 按日期排序
    return articles.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
      <div class="blog-excerpt" v-html="article.excerpt"></div>
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
