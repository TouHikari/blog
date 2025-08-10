<script setup lang="ts">
const slug = useRoute().params.slug

// 查询博客文章
const { data: post } = await useAsyncData(`blog-${slug}`, async () => {
  return await queryCollection('blog').path(`/blog/${slug}`).first()
})

// 设置 SEO 元数据
useSeoMeta({
  title: post.value?.title || '文章',
  description: post.value?.description || '博客文章'
})
</script>

<template>
  <div>
    <ContentRenderer v-if="post" :value="post" />
    <div v-else>
      <h1>文章未找到</h1>
      <p>抱歉，找不到您要查看的文章 "{{ slug }}"。</p>
    </div>
  </div>
</template>
