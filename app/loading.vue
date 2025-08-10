<template>
  <!-- 自定义加载组件 - 可以完全自定义或留空来禁用加载指示器 -->
  <div v-if="false" class="loading-container">
    <!-- 这里可以放置自定义的加载动画 -->
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup>
// 这个组件会在页面切换时显示
// 设置 v-if="false" 来完全禁用加载指示器
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
