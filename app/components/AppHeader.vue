<script setup lang="ts">

</script>

<template>
  <div class="header-container">
    <div class="navbar">
      <UiButton type="navbar-brand" class="nav-brand">[TouHikari@localhost ~]$</UiButton>
      <div class="nav-items">
        <UiButton type="nav" class="nav-button">
          <Icon name="mdi:database" class="nav-icon" />
          Archives
        </UiButton>
        <UiButton type="nav" class="nav-button">
          <Icon name="mdi:folder-network" class="nav-icon" />
          Categories
        </UiButton>
        <UiButton type="nav" class="nav-button">
          <Icon name="mdi:tag-multiple" class="nav-icon" />
          Tags
        </UiButton>
        <UiButton type="nav" class="nav-button">
          <Icon name="mdi:account-circle" class="nav-icon" />
          About
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '~/styles/fonts' as *;
@use '~/styles/variables' as *;

.header-container {
  display: flex;
  top: 0;
  padding-top: 5px;
  min-height: 1.5rem;
  max-height: 2rem;
  font-family: $font-cyber;
}

.navbar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
}

.nav-brand {
  font-size: large;
  font-weight: bold;
  color: $gray-400;
  transition: all 0.3s ease;

  &:hover {
    color: white;
  }
}

.nav-items {
  display: flex;
  flex-direction: row;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: large;
  font-weight: bold;
  color: $gray-400;

  &:hover {
    color: black;
    background-color: $gray-400;
  }
}
</style>
