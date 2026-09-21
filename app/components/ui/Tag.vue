<template>
  <NuxtLink v-if="to" :to="to" class="blog-tag link" :class="{ active }">
    <slot />
  </NuxtLink>
  <button v-else-if="clickable" type="button" class="blog-tag interactive" :class="{ active }" @click="emit('click')">
    <slot />
  </button>
  <span v-else class="blog-tag" :class="{ active }">
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to?: RouteLocationRaw
  clickable?: boolean
  active?: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped lang="scss">
@use '~/styles/font-stacks' as *;
@use '~/styles/variables' as *;

.blog-tag {
  font-family: $font-mono;
  font-size: 0.75em;
  font-weight: 600;
  color: $cyberpunk-pink;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 170, 0.05));
  border: 1px solid $cyberpunk-pink;
  border-radius: 2px;
  padding: 2px 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: color 0.05s ease, background 0.05s ease, border-color 0.05s ease, box-shadow 0.05s ease;
  cursor: default;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block; // Ensure transform works well
  transform: translateZ(0); // 强制 GPU 加速，避免图层切换
  -webkit-font-smoothing: antialiased; // 统一抗锯齿模式
  -moz-osx-font-smoothing: grayscale;

  &.link,
  &.interactive {
    cursor: pointer;
  }

  &.interactive {
    // button 形态：继承行高（UA 默认 normal 会改变标签高度）
    line-height: inherit;
  }

  &:focus-visible {
    outline: 1px dashed $cyberpunk-cyan;
    outline-offset: 2px;
  }

  // 内部发光效果
  box-shadow:
    inset 0 0 8px rgba(255, 64, 128, 0.2),
    0 0 4px rgba(255, 64, 128, 0.3);

  // 悬停 / 选中：共享荧光点亮配色（扫描线仅在悬停时出现）
  &:hover,
  &.active {
    z-index: 2;
    color: $cyberpunk-light-yellow;
    border-color: $cyberpunk-light-yellow;
    background: linear-gradient(135deg, rgba(255, 255, 0, 0.15), rgba(255, 190, 11, 0.08));
    box-shadow: inset 0 0 12px rgba(255, 255, 0, 0.3),
      0 0 8px rgba(255, 255, 0, 0.4),
      0 0 16px rgba(255, 255, 0, 0.2);
  }

  // 扫描线效果
  &:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, $cyberpunk-light-yellow, transparent);
    animation: scan 2s infinite;
  }
}

@keyframes scan {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}
</style>
