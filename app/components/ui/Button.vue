<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'navbar-brand' | 'nav'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'nav'
})

const buttonClass = computed(() => {
  return props.type === 'navbar-brand' ? 'navbar-brand' : 'nav'
})
</script>

<style scoped lang="scss">
@use '~/styles/fonts' as *;

* {
  cursor: pointer;
}

.navbar-brand,
.nav {
  background: transparent;
  border: none;
}

.navbar-brand {
  padding: 0;
}

.nav {
  padding: 0 15px;
}
</style>
