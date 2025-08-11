<template>
  <div class="cyber-bg">
    <header class="site-header">
      <div class="container header-inner">
        <NuxtLink to="/" class="brand">TouHikari<span class="accent">.top</span></NuxtLink>
        <nav class="nav">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <a href="/blog/genesis">Blog</a>
        </nav>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <p>© {{ new Date().getFullYear() }} TouHikari.top · Stay curious. Hack the planet.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>