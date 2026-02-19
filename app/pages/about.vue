<script lang="ts" setup>
const { data: about } = await useAsyncData('about-content', async () => {
  return await queryCollection('content').path('/about').first()
})
</script>

<template>
  <div
    data-lock-scan="p, h1, h2, h3, h4, h5, h6, li"
    data-lock-bg="#FF408020"
    data-lock-border="1px solid #FF408040"
  >
    <ContentRenderer v-if="about" :value="about" />
  </div>
</template>
