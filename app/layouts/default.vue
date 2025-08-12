<script setup lang="ts">

</script>

<template>
  <div class="container">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;

.container {
  max-width: 1200px;
  margin: 0 auto;
}

// 手机端
@media (max-width: #{$breakpoint-mobile - 1px}) {
  // 手机端样式
}

// 平板端
@media (min-width: #{$breakpoint-mobile}) and (max-width: #{$breakpoint-tablet - 1px}) {
  // 平板端样式
}

// 桌面端
@media (min-width: #{$breakpoint-desktop}) {
  // 桌面端样式
}
</style>
