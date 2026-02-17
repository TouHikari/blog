<template>
  <div class="links-container">
    <h4>相关链接</h4>
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
      <li>
        <a href="https://notes.owo.cab/" target="_blank">拾星絮语 | 『笔记小站』</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/fonts' as *;

h4 {
  border-bottom: 1px dashed;
  padding-bottom: 0.5em;
  margin-bottom: 1em;
}

.links-container {
  margin: 2rem auto;
}

.links-list {
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