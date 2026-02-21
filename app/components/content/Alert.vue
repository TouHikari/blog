<template>
  <div class="alert-box" :class="[`type-${type}`]">
    <div class="alert-icon-container">
      <div class="alert-icon">
        <Icon v-if="type === 'info'" name="mdi:information-outline" />
        <Icon v-else-if="type === 'warning'" name="mdi:alert-outline" />
        <Icon v-else-if="type === 'danger'" name="mdi:alert-octagon-outline" />
        <Icon v-else name="mdi:information-outline" />
      </div>
      <div class="alert-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'info' | 'warning' | 'danger'
}

withDefaults(defineProps<Props>(), {
  type: 'info'
})
</script>

<style scoped lang="scss">
@use "@/styles/variables" as *;

.alert-box {
  position: relative;
  padding: 1px 30px;
  margin: 1em 0;
  background-color: rgba($bg-secondary, 0.8);
  backdrop-filter: blur(4px);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: $cyberpunk-light-yellow;
    box-shadow: 0 0 10px $cyberpunk-light-yellow;
    z-index: 3;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 1;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }
  
  .alert-icon-container {
    position: relative;
    z-index: 2;
    display: flex;
    gap: 1em;
    margin: 1em 0;
  }

  .alert-icon {
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    padding-top: 2px;
    font-size: 1.4rem;
  }

  .alert-content {
    flex: 1;
    font-size: 0.95rem;
    line-height: 1.6;
    color: $text-primary;

    :deep(p) {
      margin: 0;
      
      &:not(:last-child) {
        margin-bottom: 1em;
      }
    }
  }

  // Info
  &.type-info {
    border-color: $cyberpunk-blue;
    background: linear-gradient(to right, rgba($cyberpunk-blue, 0.2), rgba($cyberpunk-blue, 0.1) 2%, rgba($cyberpunk-blue, 0.02));

    &::after {
      background: linear-gradient(to right, rgba($cyberpunk-blue, 0.1), rgba($cyberpunk-blue, 0) 2%, rgba($cyberpunk-blue, 0.08));
    }

    .alert-icon {
      color: $cyberpunk-blue;
      text-shadow: 0 0 5px rgba($cyberpunk-blue, 0.5);
    }
    
    .alert-content :deep(a) {
      color: $cyberpunk-blue;

      &:hover {
        color: $cyberpunk-pink;
      }
    }

    &::before {
      background-color: $cyberpunk-cyan;
      box-shadow: 0 0 10px $cyberpunk-cyan;
    }
  }

  // Warning
  &.type-warning {
    border-color: $cyberpunk-yellow;
    background: linear-gradient(to right, rgba($cyberpunk-yellow, 0.2), rgba($cyberpunk-yellow, 0.1) 2%, rgba($cyberpunk-yellow, 0.02));
    
    &::after {
      background: linear-gradient(to right, rgba($cyberpunk-yellow, 0.1), rgba($cyberpunk-yellow, 0) 2%, rgba($cyberpunk-yellow, 0.08));
    }

    .alert-icon {
      color: $cyberpunk-yellow;
      text-shadow: 0 0 5px rgba($cyberpunk-yellow, 0.5);
    }

    .alert-content :deep(a) {
      color: $cyberpunk-yellow;
      
      &:hover {
        color: $cyberpunk-pink;
      }
    }

    &::before {
      background-color: $cyberpunk-light-yellow;
      box-shadow: 0 0 10px $cyberpunk-light-yellow;
    }
  }

  // Danger
  &.type-danger {
    border-color: $cyberpunk-pink;
    background: linear-gradient(to right, rgba($cyberpunk-pink, 0.2), rgba($cyberpunk-pink, 0.1) 2%, rgba($cyberpunk-pink, 0.02));
    
    &::after {
      background: linear-gradient(to right, rgba($cyberpunk-pink, 0.1), rgba($cyberpunk-pink, 0) 2%, rgba($cyberpunk-pink, 0.08));
    }

    .alert-icon {
      color: $cyberpunk-pink;
      text-shadow: 0 0 5px rgba($cyberpunk-pink, 0.5);
    }

    .alert-content :deep(a) {
      color: $cyberpunk-pink;
      
      &:hover {
        color: $cyberpunk-pink;
      }
    }

    &::before {
      background-color: $cyberpunk-light-pink;
      box-shadow: 0 0 10px $cyberpunk-light-pink;
    }
  }
}
</style>
