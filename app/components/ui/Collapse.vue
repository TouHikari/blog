<template>
  <div
    class="collapse"
    :class="{ 'is-open': open }"
    :style="{ height: renderedHeight }"
    @transitionend="onTransitionEnd"
  >
    <div ref="innerRef" class="collapse-inner" :inert="!open">
      <div :key="contentKey ?? 'content'" class="collapse-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  contentKey?: string | number
}>()

const emit = defineEmits<{
  (e: 'expanded'): void
}>()

const innerRef = ref<HTMLElement | null>(null)
const measuredHeight = ref<number | null>(null)
let observer: ResizeObserver | null = null

const measure = () => {
  if (innerRef.value) {
    measuredHeight.value = innerRef.value.offsetHeight
  }
}

// 高度跟随内容实测值：晚到的高度变化（字体加载等）也会被过渡平滑吸收
onMounted(() => {
  measure()
  observer = new ResizeObserver(measure)
  if (innerRef.value) {
    observer.observe(innerRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})

// 未测量前（SSR / 挂载瞬间）用 auto 兜底
const renderedHeight = computed(() =>
  props.open ? (measuredHeight.value === null ? 'auto' : `${measuredHeight.value}px`) : '0px'
)

// 展开方向的高度过渡完成时通知（供调用方在动画结束后滚动等）
const onTransitionEnd = (event: TransitionEvent) => {
  if (event.target !== event.currentTarget || event.propertyName !== 'height') return
  if (props.open) emit('expanded')
}
</script>

<style scoped lang="scss">
.collapse {
  height: 0;
  overflow: hidden;
  transition: height 0.2s ease-in;

  &.is-open {
    transition: height 0.3s ease-out;
  }
}

.collapse-inner {
  // flow-root 建立 BFC：防止内容首元素上边距折叠穿透，导致 offsetHeight 实测值低估（底部被 overflow 裁切）
  display: flow-root;
  opacity: 0;
  transition: opacity 0.25s ease-out;
}

.is-open .collapse-inner {
  opacity: 1;
}

// contentKey 变化时内容重建并淡入
.collapse-content {
  animation: collapse-content-in 0.25s ease-out;
}

@keyframes collapse-content-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
