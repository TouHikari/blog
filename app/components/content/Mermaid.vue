<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { renderMermaid } from '@/utils/mermaid';

/**
 * Mermaid 图表渲染组件。
 *
 * 文章中的 ```mermaid 代码块会由 ProsePre 拦截并传入本组件，
 * 在客户端将图表定义渲染为 SVG（主题为站点赛博朋克暗色风格），
 * 渲染失败时自动回退为显示原始 Mermaid 源码。
 */
const props = defineProps<{
  code?: string;
}>();

const svg = ref('');
const failed = ref(false);

onMounted(async () => {
  const code = props.code?.trim();
  if (!code) {
    return;
  }

  try {
    svg.value = await renderMermaid(code);
  } catch (error) {
    console.error('[mermaid] diagram render failed:', error);
    failed.value = true;
  }
});
</script>

<template>
  <div class="mermaid-block" :class="{ 'is-failed': failed }">
    <div v-if="svg" class="mermaid-diagram" v-html="svg"></div>
    <template v-else>
      <div v-if="failed" class="mermaid-error">
        <Icon name="mdi:alert-outline" />
        <span>图表渲染失败，已回退显示 Mermaid 源码：</span>
      </div>
      <pre class="mermaid-source"><code>{{ code }}</code></pre>
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/font-stacks' as *;

.mermaid-block {
  position: relative;
  margin: 1.5em 0;
  padding: 1.2em 1em;
  border: 1px solid rgba($cyberpunk-cyan, 0.22);
  background: linear-gradient(135deg, rgba($cyberpunk-cyan, 0.05), rgba($cyberpunk-pink, 0.04) 60%, transparent);
  overflow-x: auto;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: rgba($cyberpunk-cyan, 0.5);
    box-shadow: 0 0 10px rgba($cyberpunk-cyan, 0);
    transition: background-color 0.25s ease, box-shadow 0.25s ease;
    z-index: 3;
  }

  &:hover::before {
    background-color: $cyberpunk-cyan;
    box-shadow: 0 0 10px $cyberpunk-cyan;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.1s;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(to right, rgba($cyberpunk-cyan, 0.1), rgba($cyberpunk-cyan, 0) 2%, rgba($cyberpunk-cyan, 0.08));
  }

  &:hover::after {
    opacity: 1;
  }

  &.is-failed {
    border-color: rgba($cyberpunk-red, 0.4);

    &::before {
      background-color: $cyberpunk-red;
      box-shadow: 0 0 10px rgba($cyberpunk-red, 0.5);
    }
  }
}

.mermaid-diagram {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;

  :deep(svg) {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
  }
}

.mermaid-error {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.4em;
  margin-bottom: 0.6em;
  color: $cyberpunk-light-red;
  font-family: $font-mono;
  font-size: 0.85rem;
}

.mermaid-source {
  position: relative;
  z-index: 2;
  margin: 0;
  padding: 0.5em 0;
  overflow-x: auto;

  code {
    display: block;
    min-width: 100%;
    width: fit-content;
    padding: 0 18px;
    color: $text-muted;
    font-family: $font-mono;
    font-size: $font-size-small;
    line-height: $line-height-tight;
  }
}
</style>
