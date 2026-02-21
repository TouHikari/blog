<script setup lang="ts">
const { article } = useArticle()
</script>

<template>
  <div
    data-lock-bg="#FF408020"
    data-lock-border="1px solid #FF408040"
  >
    <ContentRenderer v-if="article" :value="article" />
    <div v-else>Article not found</div>
  </div>
</template>
