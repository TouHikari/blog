<template>
  <div class="links-container" data-lock-container>
    <h4 data-lock-marked>相关链接</h4>
    <ul class="links-list">
      <li data-lock-marked>
        <a class="links" href="https://github.com/TouHikari" target="_blank">GitHub - TouHikari</a>
      </li>
      <li data-lock-marked>
        <a class="links" href="https://space.bilibili.com/123365221" target="_blank">bilibili | 哔哩哔哩 - HvnZ_Null</a>
      </li>
      <li data-lock-marked>
        <a class="links" href="https://music.163.com/#/user/home?id=436110203" target="_blank">NetEase Music | 网易云音乐 - HvnZ_Null</a>
      </li>
      <li data-lock-marked>
        <a class="links" href="https://notes.owo.cab/" target="_blank">拾星絮语 | 『笔记小站』</a>
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
  margin-top: 0;
  margin-bottom: 1em;
}

.links-container {
  padding: 1rem 0;
  user-select: none;
}

.links-list {
  display: flex;
  flex-direction: column;
  margin: 0;
  list-style-type: circle;
  padding: 0 0 0 20px;
}

.links-list li {
  margin-bottom: 0.5rem;
  font-size: 14px;
}

.links-list li::marker {
  color: $cyberpunk-pink;
}

.links {
  display: block;

  &:hover {
    color: $cyberpunk-pink;
    padding-left: 5px;
    font-weight: bold;
  }
}
</style>