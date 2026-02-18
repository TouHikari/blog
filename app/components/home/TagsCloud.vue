<template>
  <div class="tags-cloud-container">
    <h4>标签云</h4>
    <div class="tags-cloud">
      <UiTag 
        v-for="tag in tags" 
        :key="tag.name" 
        :to="`/tags/${tag.name}`" 
        class="tag-item"
      >
        {{ tag.name }}
      </UiTag>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { tags } = useBlog()
</script>

<style lang="scss" scoped>
@use '~/styles/variables' as *;
@use '~/styles/fonts' as *;

.tags-cloud-container {
  margin: 2rem auto;
  font-family: $font-pixel;
}

h4 {
  border-bottom: 1px dashed;
  padding-bottom: 0.5em;
  margin-bottom: 1em;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8em;
  align-items: center;
}
</style>
