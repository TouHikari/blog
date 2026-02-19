export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return;

  nuxtApp.hook("app:mounted", () => {
    const follower = document.createElement("div");
    follower.className = "mouse-follower";
    document.body.appendChild(follower);

    // Add styles
    const style = document.createElement("style");
    style.innerHTML = `
    .mouse-follower {
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      background: var(--mf-bg, rgba(100, 255, 218, 0.1)); /* Default following color */
      border: var(--mf-border, 1px solid rgba(100, 255, 218, 0.3));
      border-radius: 50%;
      transform: translate(-50%, -50%); /* Center on coordinate */
      /* Transition is handled dynamically in JS */
      box-sizing: border-box;
      will-change: top, left, width, height, transform, border-radius;
    }
    .mouse-follower.snapped {
      background: var(--mf-bg-snapped, rgba(100, 255, 218, 0.2));
      border: var(--mf-border-snapped, 1px solid rgba(100, 255, 218, 0.8));
      transform: translate(0, 0); /* Reset centering to match element rect */
    }
    .mouse-follower.hidden {
      opacity: 0;
      transition: opacity 0.1s;
    }
  `;
    document.head.appendChild(style);

    let mouseX = 0;
    let mouseY = 0;
    let targetElement: HTMLElement | null = null;
    let isSnapped = false;

    const MARKED_SELECTORS = [
      ".lock_marked",
      "#lock_marked",
      "[data-lock-marked]",
    ];
    const CONTAINER_SELECTORS = [
      ".lock_wrap",
      ".lock_container",
      "[data-lock-container]",
    ];

    // 1. 寻找被标记的元素 (Find Marked Element)
    const getMarkedElement = (el: HTMLElement | null): HTMLElement | null => {
      if (!el) return null;

      // 使用 closest 向上查找，这样鼠标悬停在子元素上也能触发父级标记
      // Use closest to find the nearest marked ancestor
      const selector = MARKED_SELECTORS.join(",");
      return el.closest(selector) as HTMLElement | null;
    };

    // 2. 寻找动画生效的父元素 (Find Animation Container)
    const getContainerElement = (
      el: HTMLElement | null,
    ): HTMLElement | null => {
      if (!el) return null;
      const selector = CONTAINER_SELECTORS.join(",");
      return el.closest(selector) as HTMLElement | null;
    };

    // 3. 应用自定义样式 (Apply Custom Styles)
    const applyCustomStyles = (el: HTMLElement | null) => {
      if (!el) {
        follower.style.removeProperty("--mf-bg-snapped");
        follower.style.removeProperty("--mf-border-snapped");
        return;
      }

      // 优先读取 data-lock-bg 和 data-lock-border
      // Prioritize data-lock-bg and data-lock-border
      const bg = el.getAttribute("data-lock-bg");
      const border = el.getAttribute("data-lock-border");

      if (bg) {
        follower.style.setProperty("--mf-bg-snapped", bg);
      } else {
        follower.style.removeProperty("--mf-bg-snapped");
      }

      if (border) {
        follower.style.setProperty("--mf-border-snapped", border);
      } else {
        follower.style.removeProperty("--mf-border-snapped");
      }
    };

    const update = () => {
      if (isSnapped && targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const computed = window.getComputedStyle(targetElement);

        // When snapped, we want smooth transition for all properties
        follower.style.transition = "all 0.1s cubic-bezier(0.25, 0.8, 0.25, 1)";

        follower.style.width = `${rect.width}px`;
        follower.style.height = `${rect.height}px`;
        follower.style.top = `${rect.top}px`;
        follower.style.left = `${rect.left}px`;
        follower.style.borderRadius = computed.borderRadius;

        if (!follower.classList.contains("snapped")) {
          follower.classList.add("snapped");
        }
      } else {
        // When following mouse, we want instant/fast movement for position,
        // but smooth transition for shape restoration
        follower.style.transition =
          "width 0.1s, height 0.1s, border-radius 0.1s, transform 0.1s, top 0.05s, left 0.05s";

        follower.style.width = "20px";
        follower.style.height = "20px";
        follower.style.top = `${mouseY}px`;
        follower.style.left = `${mouseX}px`;
        follower.style.borderRadius = "50%";

        if (follower.classList.contains("snapped")) {
          follower.classList.remove("snapped");
        }
      }
      requestAnimationFrame(update);
    };

    let lastSnappedElement: HTMLElement | null = null;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement;
      const marked = getMarkedElement(target);
      const container = getContainerElement(target);

      if (marked) {
        // 悬停在标记元素上 (Hovering marked element)
        // 检查是否切换了新的标记元素 (Check if target changed)
        if (lastSnappedElement !== marked) {
          applyCustomStyles(marked);
        }

        targetElement = marked;
        lastSnappedElement = marked;
        isSnapped = true;
      } else if (
        container &&
        lastSnappedElement &&
        container.contains(lastSnappedElement)
      ) {
        // 悬停在容器内，且之前已经吸附过某个元素，保持吸附在那个元素上 (Inside container, keep snapped to last element)
        // 只有当鼠标移出容器时，才视为移开 (Only retract when leaving container)
        targetElement = lastSnappedElement;
        isSnapped = true;
      } else {
        // 既不在标记元素上，也不在包含上次吸附元素的容器内 -> 恢复跟随鼠标 (Reset to follow mouse)
        targetElement = null;
        isSnapped = false;
        // 清除记录，因为已经完全离开了相关区域
        lastSnappedElement = null;
        // 清除自定义样式 (Clear custom styles)
        applyCustomStyles(null);
      }
    });

    // Handle mouse leaving the window
    document.addEventListener("mouseleave", () => {
      follower.classList.add("hidden");
    });

    document.addEventListener("mouseenter", () => {
      follower.classList.remove("hidden");
    });

    requestAnimationFrame(update);
  });
});
