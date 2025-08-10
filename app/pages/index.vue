<script setup lang="ts">
const { data: home } = await useAsyncData(() => queryCollection('content').path('/index').first())

useSeoMeta({
  title: home.value?.title || 'TouHikari.top',
  description: home.value?.description || '欢迎来到 TouHikari 的个人数字空间'
})
</script>

<template>
  <ContentRenderer v-if="home" :value="home" />
  <div v-else>Home not found</div>
</template>
