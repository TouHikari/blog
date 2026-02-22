<script setup lang="ts">
import ContentAlert from '~/components/content/Alert.vue'
const { article, status, error } = await useArticle()
</script>

<template>
  <div
    data-lock-bg="#FF408020"
    data-lock-border="1px solid #FF408040"
  >
    <div v-if="status === 'pending'" class="status">Loading...</div>
    <div v-else-if="error || !article" class="status">Article not found!</div>
    <div v-else>
      <ContentAlert type="warning" v-if="article.description">
        {{ article.description }}
      </ContentAlert>
      <br v-if="article.description">
      <ContentRenderer :value="article" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/fonts' as *;

.status {
  text-align: center;
  padding: 2em 0;
  color: $cyberpunk-pink;
  font-family: $font-mono;
}
</style>