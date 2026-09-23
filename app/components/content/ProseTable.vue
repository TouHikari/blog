<script setup lang="ts">
import type { PropType, StyleValue } from 'vue';

/**
 * Markdown 表格渲染组件（覆盖 @nuxtjs/mdc 默认 ProseTable）。
 *
 * 表格外层包裹横向滚动容器：列多或内容宽时表格在容器内部滚动，
 * 不再把页面宽度撑开；容器内滚动条沿用站点的风格。
 */
defineProps({
  class: {
    type: [String, Object, Array] as PropType<string | Record<string, unknown> | unknown[]>,
    default: null
  },
  style: {
    type: [String, Object, Array] as PropType<StyleValue>,
    default: null
  }
});
</script>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<template>
  <div class="prose-table-scroll">
    <table :class="$props.class" :style="$props.style">
      <slot />
    </table>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.prose-table-scroll {
  position: relative;
  max-width: 100%;
  margin: 1rem 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;

  /* 横向滚动条 */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($cyberpunk-background-pink, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba($cyberpunk-cyan, 0.55);
    transition: background-color 0.15s;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: $cyberpunk-pink;
  }
}
</style>
