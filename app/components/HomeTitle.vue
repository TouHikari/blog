<template>
  <div class="title-container">
    <h1 class="title">Where shadows dance with data streams.</h1>
    <hr />
    <div class="slogan-container">
      <img></img>
      <TypewriterSlogan />
    </div>
  </div>
</template>

<script setup lang="ts">
// 打字机效果由 TypewriterSlogan.client.vue 处理
</script>

<style lang="scss" scoped>
.title-container {
  margin-top: 50px;
}

.slogan-container {
  display: flex;
  flex-direction: row;
}
</style>