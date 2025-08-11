<script setup lang="ts">
// 简洁布局配置（无侧边栏）
const layoutConfig = {
  showSidebar: false
}
</script>

<template>
  <div class="clean-layout cyber-bg cyber-grid cyber-scanlines">
    <!-- Header组件 -->
    <AppHeader>
      <!-- 可以通过slot传递页面特定的header内容 -->
      <template #pageHeader v-if="$slots.pageHeader">
        <slot name="pageHeader" />
      </template>
    </AppHeader>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <slot />
        </div>
      </div>
    </main>

    <!-- Footer组件 -->
    <AppFooter />
  </div>
</template>

<style scoped>
.clean-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* 为固定导航栏留出空间 */
  padding-bottom: 40px;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  min-height: 400px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 70px;
  }
  
  .content-wrapper {
    padding: 15px;
  }
}
</style>
