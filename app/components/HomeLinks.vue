<template>
  <div class="links-container">
    <h4>链接</h4>
    <ul class="links-list">
      <li>
        <a href="https://github.com/TouHikari" target="_blank">GitHub - TouHikari</a>
      </li>
      <li>
        <a href="https://space.bilibili.com/123365221" target="_blank">bilibili | 哔哩哔哩 - HvnZ_Null</a>
      </li>
      <li>
        <a href="https://music.163.com/#/user/home?id=436110203" target="_blank">NetEase Music | 网易云音乐 - HvnZ_Null</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/fonts' as *;

.links-container {
  margin: 1rem auto;
}

.links-list {
  font-family: $font-cyber;
  list-style-type: circle;
  padding-left: 20px;
}

.links-list li {
  margin-bottom: 0.5rem;
  font-size: 13px;
}

.links-list li::marker {
  color: $cyberpunk-pink;
}
</style>