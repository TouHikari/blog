<template>
  <div class="tags-cloud-container" data-lock-container>
    <h4 data-lock-marked>标签云</h4>
    <div
      class="tags-cloud"
      data-lock-marked
      data-lock-bg="#FF408020"
      data-lock-border="1px solid #FF408040"
    >
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
  padding: 1rem 0 0 0;
  font-family: $font-pixel;
  user-select: none;
}

h4 {
  border-bottom: 1px dashed;
  padding-bottom: 0.5em;
  margin-top: 0;
  margin-bottom: 0;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8em;
  align-items: center;
  padding: 1em 0;
}
</style>
