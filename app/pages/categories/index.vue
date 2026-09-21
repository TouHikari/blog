<script setup lang="ts">
definePageMeta({
  hideLicense: true
})

const { categories, articlesByCategory } = useBlog()

const expandedCategory = ref<string | null>(null)
// 曾展开分类：内容保留在折叠容器中（收起动画期间随之收缩）
const openedCategories = ref<Set<string>>(new Set())

const toggleCategory = (name: string) => {
  const isExpanding = expandedCategory.value !== name
  expandedCategory.value = isExpanding ? name : null
  if (isExpanding) {
    openedCategories.value.add(name)
  }
}
</script>

<template>
  <div class="categories-page">
    <div class="categories-stats" data-lock-marked>
      <span class="prompt">&gt;</span>
      <span>{{ categories.length }} categories indexed</span>
    </div>

    <ul v-if="categories.length" class="category-list" data-lock-container>
      <li v-for="category in categories" :key="category.name" class="category-item">
        <button
          type="button"
          class="category-toggle"
          :class="{ expanded: expandedCategory === category.name }"
          :aria-expanded="expandedCategory === category.name"
          data-lock-marked
          @click="toggleCategory(category.name)"
        >
          <span class="category-name">{{ category.name }}</span>
          <span class="category-count">{{ category.count }} {{ category.count > 1 ? 'posts' : 'post' }}</span>
        </button>
        <UiCollapse :open="expandedCategory === category.name">
          <BlogQueryResult
            v-if="openedCategories.has(category.name)"
            label="CATEGORY_QUERY"
            :term="category.name"
            :articles="articlesByCategory(category.name)"
          />
        </UiCollapse>
      </li>
    </ul>
    <div v-else class="status">&gt; no categories indexed yet.</div>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/font-stacks' as *;

.categories-stats {
  font-family: $font-mono;
  font-size: 0.9em;
  color: $white;
  padding-bottom: 1em;
  border-bottom: 1px dashed $gray-700;
  user-select: none;

  .prompt {
    color: $cyberpunk-light-yellow;
    margin-right: 0.5em;
  }
}

.category-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.category-item {
  padding: 0.15em 0;
}

.category-toggle {
  display: flex;
  align-items: baseline;
  gap: 1em;
  width: 100%;
  padding: 0.4em 0.4em;
  border: none;
  border-bottom: 1px solid $white-15;
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 1px dashed $cyberpunk-cyan;
    outline-offset: 2px;
  }

  &:hover,
  &.expanded {
    .category-name {
      color: $cyberpunk-light-yellow;
    }

    .category-count {
      color: $cyberpunk-cyan;
    }
  }

  &.expanded {
    .category-name::before {
      color: $cyberpunk-cyan;
    }
  }
}

.category-name {
  font-family: $font-mono;
  font-size: 1.05em;
  color: $text-primary;
  transition: color 0.1s ease;

  &::before {
    content: '> ';
    color: $gray-700;
    transition: color 0.1s ease;
  }
}

.category-count {
  font-family: $font-mono;
  font-size: 0.85em;
  color: $gray-500;
  margin-left: auto;
  user-select: none;
  transition: color 0.1s ease;
}

.status {
  text-align: center;
  padding: 2em 0;
  color: $cyberpunk-pink;
  font-family: $font-mono;
}
</style>
