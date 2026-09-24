<script setup lang="ts">
// 指定首页使用特定的layout
definePageMeta({
  layout: 'home'
})

// Orbitron 是首页 h1 的 LCP 字体，仅在首页预加载：其他页面标题为打字机渲染、页脚在视口外，
// 预加载会在判定窗口内被浏览器静默判定为未使用（preload 警告）
useHead({
  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/orbitron-latin-400-normal.woff2', crossorigin: 'anonymous' },
    { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/orbitron-latin-700-normal.woff2', crossorigin: 'anonymous' }
  ]
})

// 查询首页内容
const { data: home } = await useAsyncData('home-content', async () => {
  return await queryCollection('content').path('/').first()
})

useSeoMeta({
  title: home.value?.title || '[TouHikari@localhost ~]$',
  description: home.value?.description || '欢迎来到 TouHikari 的个人数字空间'
})
</script>

<template>
  <div
    data-lock-bg="#FF408020"
    data-lock-border="1px solid #FF408040"
  >
    <ContentRenderer v-if="home" :value="home" />
    <div v-else>首页内容加载中...</div>
  </div>
</template>
