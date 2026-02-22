<template>
  <div class="tabs-container">
    <div class="tabs-header">
      <button v-for="tab in tabNames" :key="tab" class="tab-button" :class="{ active: activeTab === tab }"
        @click="activeTab = tab">
        {{ tab }}
      </button>
    </div>
    <div class="tabs-content">
      <component :is="slots[activeTab]" v-if="activeTab && slots[activeTab]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useSlots, computed } from 'vue';

const slots = useSlots();
const tabNames = computed(() => {
  return Object.keys(slots).filter(name => name !== 'default' && !name.startsWith('_'));
});

const activeTab = ref(tabNames.value[0]);
</script>

<style scoped lang="scss">
@use "@/styles/variables" as *;
@use "@/styles/fonts" as *;

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
      border-bottom: 2px solid $cyberpunk-pink;
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
