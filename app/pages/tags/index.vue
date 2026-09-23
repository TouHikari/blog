<script setup lang="ts">
definePageMeta({
  hideLicense: true
})

const route = useRoute()
const { tags, articlesByTag } = useBlog()

const selectedTag = ref<string | null>(null)
// 最近选中标签：收起动画期间内容随折叠高度收缩，避免瞬间消失
const lastSelectedTag = ref<string | null>(null)
const resultRef = ref<HTMLElement | null>(null)

// SSR 不读取 query（服务端恒输出收起态，避免 hydration 不一致），挂载后再应用
const applyQueryTag = () => {
  const queryTag = typeof route.query.tag === 'string' && route.query.tag ? route.query.tag : null
  selectedTag.value = queryTag
  if (queryTag) lastSelectedTag.value = queryTag
}

watch(() => route.query.tag, applyQueryTag)
onMounted(applyQueryTag)

const selectedArticles = computed(() =>
  lastSelectedTag.value ? articlesByTag(lastSelectedTag.value) : []
)

// 点击选中后等展开过渡完成再滚动：页面高度未撑开时落点会被钳制在中间值
let expandPending = false

const toggleTag = (name: string) => {
  const isSelecting = selectedTag.value !== name
  selectedTag.value = isSelecting ? name : null
  if (isSelecting) {
    lastSelectedTag.value = name
    expandPending = true
  } else {
    expandPending = false
  }
}

const onExpanded = () => {
  if (!expandPending) return
  expandPending = false
  resultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="tags-page">
    <div class="tags-stats" data-lock-marked>
      <span class="prompt">&gt;</span>
      <span>{{ tags.length }} tags indexed</span>
    </div>

    <div v-if="tags.length" class="tags-cloud" data-lock-container data-lock-marked data-lock-bg="#FF408020"
      data-lock-border="1px solid #FF408040">
      <UiTag v-for="tag in tags" :key="tag.name" clickable :active="selectedTag === tag.name" class="cloud-tag"
        @click="toggleTag(tag.name)">
        <span class="tag-name">{{ tag.name }}</span><span class="tag-count">×{{ tag.count }}</span>
      </UiTag>
    </div>
    <div v-else class="status">&gt; no tags indexed yet.</div>

    <div ref="resultRef" class="result-anchor">
      <UiCollapse :open="!!selectedTag" :content-key="lastSelectedTag ?? undefined" @expanded="onExpanded">
        <BlogQueryResult v-if="lastSelectedTag" label="TAG_QUERY" :term="lastSelectedTag"
          :articles="selectedArticles" />
      </UiCollapse>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/variables' as *;
@use '~/styles/font-stacks' as *;

.tags-stats {
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

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5em 0;
  font-size: 1.6em; // 放大 UiTag 的 0.75em 基准字号，全页展示比侧边栏更饱满
}

.tags-cloud .cloud-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35em;

  .tag-count {
    font-size: 0.8em;
    opacity: 0.75;
    color: $cyberpunk-light-yellow;
  }
}

.status {
  text-align: center;
  padding: 2em 0;
  color: $cyberpunk-pink;
  font-family: $font-mono;
}

// 滚动落点：避开固定头部
.result-anchor {
  scroll-margin-top: 5rem;
}
</style>
