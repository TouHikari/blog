<script setup lang="ts">
import type { PropType, StyleValue } from 'vue';

defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as PropType<number[]>,
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: [String, Object, Array] as PropType<any>,
    default: null
  },
  style: {
    type: [String, Object, Array] as PropType<StyleValue>,
    default: null
  }
});
</script>

<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<template>
  <div class="prose-pre-container">
    <pre :class="['prose-pre', $props.class]" :style="$props.style"><slot /></pre>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.prose-pre-container {
  position: relative;
  max-width: 100%;
  margin: 1em 0;
  background: linear-gradient(to right, rgba($cyberpunk-pink, 0.2), rgba($cyberpunk-pink, 0.2) 2%, rgba($cyberpunk-pink, 0.08));
  // padding: 15px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(to right, rgba($cyberpunk-pink, 0), rgba($cyberpunk-pink, 0) 2%, rgba($cyberpunk-pink, 0.12));
    transition: opacity 0.1s;
  }

  &:hover::after {
    opacity: 1;
  }

  code {
    margin: 15px;
  }
}

.prose-pre {
  margin: 0;
  background-color: transparent !important;
  overflow-x: auto;

  // scrollbar-width: 1px;
  // scrollbar-color: $cyberpunk-cyan $bg-secondary;

  &::-webkit-scrollbar {
    height: 1px;
  }

  &::-webkit-scrollbar-track {
    background: rgba($cyberpunk-background-pink, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: $cyberpunk-cyan;
  }

  @media (pointer: fine) {
    // scrollbar-width: 6px;
    // scrollbar-color: $cyberpunk-cyan $bg-secondary;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: $cyberpunk-pink;
    }
  }

  :deep(code) {
    display: block;
    min-width: 100%;
    width: fit-content;
    padding: 20px 0;
    font-family: inherit;
  }

  :deep(.line) {
    padding: 0 18px;
    min-height: 1.5em;
    display: block;
    // width: 100%;

    &.highlight {
      position: relative;
      background-color: rgba($cyberpunk-pink, 0.1);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background-color: $cyberpunk-light-pink;
        box-shadow: 0 0 10px $cyberpunk-light-pink;
      }
    }

    &.diff {
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 8px;
        font-size: 0.85rem;
        font-weight: bold;
        text-shadow: 0 0 10px currentColor;
      }
      
      &.add {
        background-color: rgba($cyberpunk-green, 0.1);
        
        &::before {
          background-color: $cyberpunk-light-green;
        }

        &::after {
          content: '+';
          color: $cyberpunk-light-green;
        }
      }

      &.remove {
        background-color: rgba($cyberpunk-red, 0.1);

        &::before {
          background-color: $cyberpunk-light-red;
          box-shadow: 0 0 10px $cyberpunk-light-red;
        }

        &::after {
          content: '-';
          color: $cyberpunk-light-red;
        }
      }
    }

    &.highlighted {
      position: relative;
      background-color: rgba($cyberpunk-pink, 0.1);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background-color: $cyberpunk-light-pink;
        box-shadow: 0 0 10px $cyberpunk-light-pink;
      }

      &.error {
        background-color: rgba($cyberpunk-red, 0.1);

        &::before {
          background-color: $cyberpunk-light-red;
          box-shadow: 0 0 10px $cyberpunk-light-red;
        }
      }

      &.warning {
        background-color: rgba($cyberpunk-yellow, 0.1);

        &::before {
          background-color: $cyberpunk-light-yellow;
          box-shadow: 0 0 10px $cyberpunk-light-yellow;
        }
      }
    }
  }
}

pre.language-text {
  padding: 0 18px;
}
</style>
