// 站内链接预加载（hover-only 收敛版）
// - 仅在鼠标悬停站内链接 50ms 后预取，避免视口内批量预取抢占首屏带宽
// - NuxtLink 自身的预取策略由 nuxt.config.ts 的 experimental.defaults.nuxtLink.prefetchOn 控制
//   （visibility: false + interaction: true），本插件主要覆盖 NuxtLink 之外的普通 <a> 链接
// - 触屏设备（pointer: coarse）没有 hover 语义，直接跳过
export default defineNuxtPlugin(() => {
  if (window.matchMedia('(pointer: coarse)').matches) {
    return
  }

  const prefetched = new Set<string>()
  let timer: ReturnType<typeof setTimeout> | null = null
  let currentLink: HTMLAnchorElement | null = null

  const cancelPending = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    currentLink = null
  }

  const resolveInternalHref = (target: EventTarget | null): { link: HTMLAnchorElement; href: string } | null => {
    const link = target instanceof Element ? target.closest<HTMLAnchorElement>('a') : null
    const href = link?.getAttribute('href')
    if (!link || !href || !href.startsWith('/') || href.startsWith('#')) {
      return null
    }
    return { link, href }
  }

  const handleMouseOver = (event: MouseEvent) => {
    const hit = resolveInternalHref(event.target)
    if (!hit || hit.link === currentLink) {
      return
    }

    cancelPending()
    currentLink = hit.link

    if (prefetched.has(hit.href)) {
      return
    }

    // 50ms 防抖：鼠标快速划过时不会触发预取
    timer = setTimeout(() => {
      timer = null
      prefetched.add(hit.href)
      preloadRouteComponents(hit.href)
      preloadPayload(hit.href)
    }, 50)
  }

  const handleMouseOut = (event: MouseEvent) => {
    // 同一链接内部子元素之间移动时，不重置计时
    const related = resolveInternalHref(event.relatedTarget)
    if (related && related.link === currentLink) {
      return
    }
    cancelPending()
  }

  document.addEventListener('mouseover', handleMouseOver, { passive: true })
  document.addEventListener('mouseout', handleMouseOut, { passive: true })
})
