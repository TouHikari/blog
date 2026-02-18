<template>
  <div class="recent-posts-container">
    <h4>最近文章</h4>
    <ul class="recent-list">
      <li v-for="article in recentArticles" :key="article.path" class="recent-item">
        <NuxtLink :to="article.path" class="recent-link">
          {{ article.title }}
        </NuxtLink>
        <span class="recent-date">{{ article.date }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const { recentArticles } = useBlog()
</script>

<style lang="scss" scoped>
@use '~/styles/variables' as *;
@use '~/styles/fonts' as *;

.recent-posts-container {
  margin: 2rem auto;
  font-family: $font-pixel;
}

h4 {
  border-bottom: 1px dashed;
  padding-bottom: 0.5em;
  margin-bottom: 1em;
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-item {
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
}

.recent-link {
  font-family: $font-sans;
  color: $text-primary;
  text-decoration: none;
  font-size: 0.9em;
  transition: all 0.3s ease;
  
  &:hover {
    color: $cyberpunk-pink;
    padding-left: 5px;
    text-shadow: 0 0 8px $cyberpunk-pink;
  }
}

.recent-date {
  font-size: 0.75em;
  color: $gray-500;
  font-family: $font-mono;
  margin-top: 0.2em;
}
</style>
