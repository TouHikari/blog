<script setup lang="ts">
const { article } = useArticle()
</script>

<template>
  <div
    data-lock-scan="p, h1, h2, h3, h4, h5, h6, li, .katex-display"
    data-lock-bg="#FF408020"
    data-lock-border="1px solid #FF408040"
  >
    <ContentRenderer v-if="article" :value="article" />
    <div v-else>Article not found</div>
  </div>
</template>
