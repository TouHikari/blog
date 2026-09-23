<script setup lang="ts">
import { highlightSegments } from '~/composables/useSearch'
import { toIsoDate } from '~/utils/date'

const { search, loadIndex, indexStatus } = useSearch()

const query = ref('')
const hasQuery = computed(() => query.value.trim().length > 0)

// 最近一次非空关键词：清空 query 后结果区保持展示到收起动画结束（同 /tags 页模式）
const lastQuery = ref('')
watch(query, (value) => {
  if (value.trim()) lastQuery.value = value
})

const shownKeyword = computed(() => (hasQuery.value ? query.value : lastQuery.value))
const shownResults = computed(() => search(shownKeyword.value))
const metaEmpty = computed(() => !shownResults.value.length && indexStatus.value !== 'loading')
</script>

<template>
  <div class="search-container" data-lock-container>
    <h4 data-lock-marked>搜索</h4>
    <div class="search-box">
      <span class="prompt" aria-hidden="true">&gt;</span>
      <input v-model="query" type="search" class="search-input" placeholder="输入关键词..." aria-label="搜索文章"
        @focus="loadIndex" @keydown.esc="query = ''">
    </div>
    <UiCollapse :open="hasQuery">
      <p class="search-meta" :class="{ empty: metaEmpty }" aria-live="polite">
        <template v-if="hasQuery && indexStatus === 'loading' && !shownResults.length">&gt; indexing
          archive...</template>
        <template v-else-if="shownResults.length">{{ shownResults.length }} {{ shownResults.length === 1 ? 'match' :
          'matches' }}</template>
        <template v-else>&gt; no matches.</template>
      </p>
      <div v-if="shownResults.length" class="search-results-scroll">
        <ul class="search-results">
          <li v-for="result in shownResults" :key="result.article.path" data-lock-marked data-lock-bg="#FF408020"
            data-lock-border="1px solid #FF408040">
            <NuxtLink :to="result.article.path" class="result-link">
              <template v-for="(segment, index) in highlightSegments(result.article.title, shownKeyword)" :key="index">
                <mark v-if="segment.hit">{{ segment.text }}</mark><template v-else>{{ segment.text }}</template>
              </template>
            </NuxtLink>
            <p v-if="result.snippet" class="result-snippet">
              <template v-for="(segment, index) in highlightSegments(result.snippet, shownKeyword)" :key="index">
                <mark v-if="segment.hit">{{ segment.text }}</mark><template v-else>{{ segment.text }}</template>
              </template>
            </p>
            <span class="result-date">{{ toIsoDate(result.article.date) }}</span>
          </li>
        </ul>
      </div>
    </UiCollapse>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/font-stacks' as *;
@use '~/styles/sidebar' as *;

.search-container {
  padding: 1rem 0 0 0;
  font-family: $font-pixel;
}

h4 {
  @include sidebar-heading;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.4em 0.6em;
  margin: 16px 0;
  border: 1px solid $cyberpunk-blue;
  background-color: rgba($bg-secondary, 0.8);
  transition: border-color 0.1s, box-shadow 0.1s;

  &:focus-within {
    border-color: $cyberpunk-cyan;
    box-shadow: 0 0 8px rgba($cyberpunk-cyan, 0.4);
  }

  .prompt {
    color: $cyberpunk-light-yellow;
    font-family: $font-mono;
    user-select: none;
  }
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: $text-primary;
  font-family: $font-mono;
  font-size: 0.9em;

  &::placeholder {
    color: $gray-500;
  }
}

.search-meta {
  font-family: $font-mono;
  font-size: 0.8em;
  color: $gray-500;
  margin: 0.75em 0 0 0;

  &.empty {
    color: $cyberpunk-pink;
  }
}

.search-results-scroll {
  max-height: 240px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: $gray-500 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: $gray-500;
    border-radius: 3px;
  }
}

.search-results {
  list-style: none;
  padding: 0.75em 0 0.25em 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.search-results li {
  display: flex;
  flex-direction: column;
}

mark {
  background-color: $cyberpunk-blue;
  color: $cyberpunk-light-yellow;
  padding: 0 1px;
}

.result-snippet {
  font-family: $font-mono;
  font-size: 0.75em;
  line-height: 1.5;
  color: $gray-500;
  margin: 0.35em 0 0 0;
  overflow-wrap: break-word;
}

.result-link {
  font-family: $font-sans;
  color: $text-primary;
  text-decoration: none;
  font-size: 0.9em;
  transition: all 0.1s ease;

  &:hover {
    color: $cyberpunk-pink;
    padding-left: 5px;
    font-weight: bold;
  }
}

.result-date {
  font-size: 0.75em;
  color: $gray-500;
  font-family: $font-mono;
  margin-top: 0.2em;
}
</style>
