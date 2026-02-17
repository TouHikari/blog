<script setup lang="ts">
const { article } = await useArticle()
</script>

<template>
  <div>
    <ContentRenderer v-if="article" :value="article" />
  </div>
</template>
