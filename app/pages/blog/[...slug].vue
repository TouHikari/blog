<script setup lang="ts">
const { article } = useArticle()
</script>

<template>
  <div>
    <ContentRenderer v-if="article" :value="article" />
    <div v-else>Article not found</div>
  </div>
</template>
