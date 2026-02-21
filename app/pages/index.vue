<script setup lang="ts">
// 指定首页使用特定的layout
definePageMeta({
  layout: 'home'
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
