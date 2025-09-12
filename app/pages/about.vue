<script lang="ts" setup>
const { data: about } = await useAsyncData('about-content', async () => {
  return await queryCollection('content').path('/about').first()
})
</script>

<template>
  <div>
    <ContentRenderer v-if="about" :value="about" />
  </div>
</template>
