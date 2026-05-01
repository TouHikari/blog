type RouteBoundTitle = {
  path: string
  value: string
}

export const usePageTitle = () => {
  const route = useRoute()
  const customTitle = useState<RouteBoundTitle | null>('page-custom-title', () => null)

  const titleMap: Record<string, string> = {
    '/': 'Home',
    '/about': '[:INIT_USER/TouHikari]',
    '/blog': '[SYS_ARCHIVES]',
    '/categories': '[:METADATA_INDEX]',
    '/tags': '[TAG_CLOUD]'
  }

  const title = computed(() => {
    // 1. If a custom title is set for the current route, use it
    if (customTitle.value?.path === route.path) {
      return customTitle.value.value
    }

    // 2. Check static map
    const path = route.path
    if (titleMap[path]) {
      return titleMap[path]
    }

    // 3. Fallback for blog posts (if customTitle hasn't been set yet) or other pages
    // This is just a temporary display until the page component sets the real title
    if (path.startsWith('/blog/')) {
      const slugPart = path.split('/').filter(Boolean).slice(1).join('/')
      return decodeURIComponent(slugPart || 'Blog Post')
    }

    return 'Page'
  })

  const setTitle = (newTitle: string) => {
    customTitle.value = {
      path: route.path,
      value: newTitle
    }
  }

  const clearTitle = () => {
    customTitle.value = null
  }

  // Automatically clear custom title on route change
  watch(() => route.path, () => {
    clearTitle()
  })

  return {
    title,
    setTitle,
    clearTitle
  }
}
