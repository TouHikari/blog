<script setup lang="ts">
// 仅文章页需要 KaTeX 样式（从全局 css 拆出，减小其他页面的 CSS 体积）
import 'katex/dist/katex.min.css'
import ContentAlert from '~/components/content/Alert.vue'

const props = defineProps<{
  collection?: 'blog' | 'test'
}>()

const { article, status, error } = useArticle(props.collection ?? 'blog')
</script>

<template>
  <div data-lock-bg="#FF408020" data-lock-border="1px solid #FF408040">
    <div v-if="status === 'pending'" class="status">Loading...</div>
    <div v-else-if="error || !article" class="status">
      <p>文章不存在！</p>
      <p>404 Article not found!</p>
    </div>
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
@use '~/styles/font-stacks' as *;

.status {
  text-align: center;
  padding: 2em 0;
  color: $cyberpunk-pink;
  font-family: $font-mono;
}
</style>
