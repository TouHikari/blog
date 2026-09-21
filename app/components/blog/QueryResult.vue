<script setup lang="ts">
import type { Article } from '~/types'

defineProps<{
  label: string
  term: string
  articles: Article[]
}>()
</script>

<template>
  <div class="query-result">
    <div class="query-header" data-lock-marked>
      <span class="prompt">&gt;</span>
      <span class="query-label">{{ label }}</span>
      <span class="query-value">"{{ term }}"</span>
      <span class="query-count">— {{ articles.length }} {{ articles.length === 1 ? 'entry' : 'entries' }}</span>
    </div>

    <BlogList v-if="articles.length" :articles="articles" />
    <div v-else class="status">&gt; no articles found.</div>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/font-stacks' as *;

// 终端输出块：左侧荧光竖条（呼应 Alert 风格）
.query-result {
  border-left: 2px solid $cyberpunk-cyan;
  padding-left: 1em;
  margin: 0.25em 0 0.5em 0.5em;

  :deep(.blog-item:last-child) {
    border-bottom: none;
  }
}

.query-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5em;
  font-family: $font-mono;
  font-size: 0.9em;
  color: $white;
  padding-bottom: 0.75em;
  border-bottom: 1px dashed $gray-700;
  user-select: none;

  .prompt {
    color: $cyberpunk-light-yellow;
  }

  .query-label {
    color: $cyberpunk-light-green;
  }

  .query-value {
    color: $text-primary;
  }

  .query-count {
    color: $gray-500;
  }
}

.status {
  text-align: center;
  padding: 2em 0;
  color: $cyberpunk-pink;
  font-family: $font-mono;
}
</style>
