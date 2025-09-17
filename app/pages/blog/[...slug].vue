<script setup lang="ts">
// 获取路由参数
const route = useRoute()

// 查询博客文章
const { data: article } = await useAsyncData(route.path, async () => {
  const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
  return await queryCollection('blog').path(`/blog/${slug}`).first()
})

// 如果文章不存在，抛出404错误
if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found'
  })
}

// 设置SEO元数据
useSeoMeta({
  title: article.value?.title || 'Blog Article',
  description: article.value?.description || 'Blog article content'
})
</script>

<template>
  <div>
    <ContentRenderer v-if="article" :value="article" />
  </div>
</template>
