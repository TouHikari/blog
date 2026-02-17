<script setup lang="ts">
const { articles } = await useBlog()
</script>

<template>
  <div class="blog-list">
    <div v-for="article in articles" :key="article.path" class="blog-item">
      <div class="blog-header">
        <h3 class="blog-title">
          <NuxtLink :to="article.path">{{ article.title }}</NuxtLink>
        </h3>
        <div class="blog-date">post @ {{ article.date }}</div>
      </div>
      <div class="blog-excerpt">
        <ContentRenderer v-if="article.excerptContent" :value="article.excerptContent" />
        <p v-else>{{ article.description || '暂无摘要' }}</p>
      </div>
      <div class="blog-tags" v-if="article.meta?.tags">
        <UiTag v-for="tag in article.meta.tags" :key="tag">{{ tag }}</UiTag>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/fonts' as *;
@use '~/styles/variables' as *;

.blog-list {
  margin-top: 1em;
  font-family: $font-sans;
}

.blog-item {
  margin-bottom: 2em;
  padding-bottom: 1em;
  border-bottom: 1px solid white;
}

.blog-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1em;

  .blog-title {
    font-family: $font-cyber;
    padding-right: 5px;
    margin-top: 0;
    margin-bottom: 0;
  }

  .blog-date {
    font-family: $font-sans;
    color: $cyberpunk-light-yellow;
    min-width: 150px;
    padding-left: 5px;
    margin-top: 0;
    cursor: default;
    user-select: none;
  }
}

.blog-excerpt {
  text-wrap: pretty;
}

.blog-tags {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 1em;
  gap: 5px;
  flex-wrap: wrap;
}

@media (max-width: #{$breakpoint-mobile - 1px}) {
  .blog-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;

    .blog-date {
      align-self: flex-end;
    }
  }
}

@media (min-width: #{$breakpoint-mobile}) and (max-width: #{$breakpoint-tablet - 1px}) {
  //
}

@media (min-width: #{$breakpoint-tablet}) and (max-width: #{$breakpoint-desktop - 1px}) {
  //
}

@media (min-width: #{$breakpoint-desktop}) and (max-width: #{$breakpoint-desktop-lg - 1px}) {
  //
}

@media (min-width: #{$breakpoint-desktop-lg}) {
  //
}
</style>
