<script setup lang="ts">
import type { Article } from '~/types'
import { toIsoDate } from '~/utils/date'

definePageMeta({
  hideLicense: true
})

const { articles, tags } = useBlog()

type ArchiveMonth = { month: string; articles: Article[] }
type ArchiveYear = { year: string; months: ArchiveMonth[] }

// articles 已按日期降序，顺序分桶即可保持时间线顺序
const archiveYears = computed<ArchiveYear[]>(() => {
  const years: ArchiveYear[] = []
  for (const article of articles.value ?? []) {
    const iso = toIsoDate(article.date)
    const year = iso.slice(0, 4)
    const month = iso.slice(5, 7)

    let yearGroup = years.find((group) => group.year === year)
    if (!yearGroup) {
      yearGroup = { year, months: [] }
      years.push(yearGroup)
    }

    let monthGroup = yearGroup.months.find((group) => group.month === month)
    if (!monthGroup) {
      monthGroup = { month, articles: [] }
      yearGroup.months.push(monthGroup)
    }

    monthGroup.articles.push(article)
  }
  return years
})

const lastUpdated = computed(() => {
  const latest = articles.value?.[0]
  return latest ? toIsoDate(latest.date) : '—'
})
</script>

<template>
  <div class="archive-page">
    <div class="archive-stats" data-lock-marked>
      <span class="prompt">&gt;</span>
      <span>{{ articles?.length ?? 0 }} entries</span>
      <span class="divider">·</span>
      <span>{{ tags.length }} tags</span>
      <span class="divider">·</span>
      <span>last update {{ lastUpdated }}</span>
    </div>

    <template v-if="archiveYears.length">
      <section
        v-for="yearGroup in archiveYears"
        :key="yearGroup.year"
        class="archive-year"
        data-lock-container
      >
        <h2 class="year-title">{{ yearGroup.year }}</h2>
        <div v-for="monthGroup in yearGroup.months" :key="monthGroup.month" class="archive-month">
          <h3 class="month-title">{{ monthGroup.month }} 月</h3>
          <ul class="entry-list">
            <li
              v-for="article in monthGroup.articles"
              :key="article.path"
              class="entry-item"
              data-lock-marked
            >
              <NuxtLink :to="article.path" class="entry-link">
                <span class="entry-date">{{ toIsoDate(article.date).slice(5) }}</span>
                <span class="entry-title">{{ article.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </section>
    </template>
    <div v-else class="status">&gt; no articles indexed yet.</div>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/font-stacks' as *;

.archive-stats {
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

  .divider {
    margin: 0 0.5em;
    color: $cyberpunk-cyan;
  }
}

.archive-year {
  margin-top: 1.5em;
}

.year-title {
  font-family: $font-cyber;
  font-size: 1.6em;
  color: $white;
  margin: 0 0 0.5em 0;
}

.month-title {
  font-family: $font-mono;
  font-size: 0.85em;
  font-weight: normal;
  color: $gray-500;
  letter-spacing: $letter-spacing-wider;
  text-shadow: none;
  animation: none;
  margin: 1em 0 0.4em 0;

  &::before {
    content: '// ';
    color: $gray-700;
  }
}

.entry-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.entry-item {
  padding: 0.1em 0;
}

.entry-link {
  display: flex;
  gap: 1em;
  align-items: baseline;
  padding: 0.2em 0.4em;
  transition: all ease 0.3s;

  &:hover {
    .entry-title {
      color: $cyberpunk-pink;
    }

    .entry-date {
      color: $cyberpunk-pink;
    }
  }
}

.entry-date {
  font-family: $font-mono;
  font-size: 0.85em;
  color: $cyberpunk-light-yellow;
  opacity: 0.85;
  flex-shrink: 0; // 永不压缩，窄屏只压缩右侧标题
  white-space: nowrap;
  transition: color 0.1s ease;
}

.entry-title {
  color: $text-primary;
  font-size: 0.95em;
  flex: 1;
  min-width: 0;
  overflow-wrap: break-word;
  transition: color 0.1s ease;
}

.status {
  text-align: center;
  padding: 2em 0;
  color: $cyberpunk-pink;
  font-family: $font-mono;
}

@media (max-width: #{$breakpoint-mobile - 1px}) {
  .entry-link {
    gap: 0.6em;
  }
}
</style>
