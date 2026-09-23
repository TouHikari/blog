<template>
  <div class="tabs-container">
    <div class="tabs-header" role="tablist">
      <button v-for="(tab, index) in tabNames" :key="tab" :ref="(el) => setTabRef(el, index)" class="tab-button"
        :class="{ active: activeTab === tab }" role="tab" :id="tabId(index)" :aria-selected="activeTab === tab"
        :aria-controls="panelId(index)" :tabindex="activeTab === tab ? 0 : -1" @click="activeTab = tab"
        @keydown="onTabKeydown($event, index)">
        {{ tab }}
      </button>
    </div>
    <div class="tabs-content" role="tabpanel" :id="panelId(activeIndex)" :aria-labelledby="tabId(activeIndex)">
      <component :is="slots[activeTab]" v-if="activeTab && slots[activeTab]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useSlots, computed, nextTick, useId } from 'vue';
import type { ComponentPublicInstance } from 'vue';

const slots = useSlots();
const tabNames = computed(() => {
  return Object.keys(slots).filter(name => name !== 'default' && !name.startsWith('_'));
});

const activeTab = ref(tabNames.value[0]);
const activeIndex = computed(() => Math.max(0, tabNames.value.indexOf(activeTab.value)));

const uid = useId();
const tabId = (index: number) => `${uid}-tab-${index}`;
const panelId = (index: number) => `${uid}-tabpanel-${index}`;

const tabRefs = ref<Array<HTMLButtonElement | undefined>>([]);
const setTabRef = (el: Element | ComponentPublicInstance | null, index: number) => {
  tabRefs.value[index] = el instanceof HTMLButtonElement ? el : undefined;
};

const onTabKeydown = (event: KeyboardEvent, index: number) => {
  const last = tabNames.value.length - 1;
  let next = -1;
  if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
  else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = last;
  if (next === -1) return;

  event.preventDefault();
  activeTab.value = tabNames.value[next];
  nextTick(() => {
    tabRefs.value[next]?.focus();
  });
};
</script>

<style scoped lang="scss">
@use "@/styles/variables" as *;
@use "@/styles/font-stacks" as *;

.tabs-container {
  margin: 1.5em 0;
  border: 1px solid $cyberpunk-background-pink;
  background-color: $bg-secondary;
  overflow: hidden;

  .tabs-header {
    display: flex;
    background: rgba($bg-tertiary, 0.8);
    border-bottom: 1px solid $cyberpunk-background-pink;
    overflow-x: auto;

    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .tab-button {
    padding: 0.5em 1em;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    border-right: 1px solid rgba($cyberpunk-background-pink, 0.3);
    color: $text-muted;
    font-family: $font-mono;
    font-feature-settings: "liga" 1, "calt" 1;
    font-size: 0.85em;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      color: $cyberpunk-cyan;
      background: rgba($cyberpunk-cyan, 0.05);
    }

    &.active {
      color: $cyberpunk-pink;
      background: rgba($cyberpunk-pink, 0.08);
      border-bottom-color: $cyberpunk-pink;
    }
  }

  .tabs-content {
    padding: 0 1em;

    // :deep(pre) {
    //   margin: 0;
    //   background: transparent;
    // }
  }
}
</style>
