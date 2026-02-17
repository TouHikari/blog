<template>
  <NuxtLink v-if="to" :to="to" class="blog-tag link">
    <slot />
  </NuxtLink>
  <span v-else class="blog-tag">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{
  to?: string
}>()
</script>

<style scoped lang="scss">
@use '~/styles/fonts' as *;
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
  overflow: hidden;
  transition: all 0.05s ease;
  cursor: default;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block; // Ensure transform works well

  &.link {
    cursor: pointer;
  }

  // 内部发光效果
  box-shadow:
    inset 0 0 8px rgba(255, 64, 128, 0.2),
    0 0 4px rgba(255, 64, 128, 0.3);

  // 悬停效果
  &:hover {
    z-index: 1;

    // 扫描线效果
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, $cyberpunk-light-yellow, transparent);
      animation: scan 2s infinite;
    }

    color: $cyberpunk-light-yellow;
    border-color: $cyberpunk-light-yellow;
    background: linear-gradient(135deg, rgba(255, 255, 0, 0.15), rgba(255, 190, 11, 0.08));
    box-shadow: inset 0 0 12px rgba(255, 255, 0, 0.3),
      0 0 8px rgba(255, 255, 0, 0.4),
      0 0 16px rgba(255, 255, 0, 0.2);
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
