export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return;

  nuxtApp.hook("app:mounted", () => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const init = () => {
      const follower = document.createElement("div");
      follower.className = "mouse-follower";
      document.body.appendChild(follower);

      const style = document.createElement("style");
      style.innerHTML = `
        .mouse-follower {
          position: fixed;
          pointer-events: none;
          z-index: 1999; /* Higher than content, unless element is elevated */
          background: var(--mf-bg, rgba(0, 255, 255, 0.1)); /* Default following color */
          border: var(--mf-border, 1px solid rgba(0, 255, 255, 1));
          border-radius: 0; /* Square by default */
          transform: translate(-50%, -50%); /* Center on coordinate */
          /* Transition is handled dynamically in JS */
          box-sizing: border-box;
          will-change: top, left, width, height, transform, border-radius;
          
          /* Center dot implementation */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* The center dot */
        .mouse-follower::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: rgba(0, 255, 255, 0.8); /* Match border color usually */
          opacity: 1;
          transition: opacity 0.1s;
        }

        .mouse-follower.snapped {
          background: var(--mf-bg-snapped, rgba(0, 255, 255, 0.1));
          border: var(--mf-border-snapped, 1px solid rgba(0, 255, 255, 0.4));
          transform: translate(0, 0); /* Reset centering to match element rect */
          z-index: 0; /* Drop below elevated content when snapped */
        }
        
        /* Hide dot when snapped */
        .mouse-follower.snapped::after {
          opacity: 0;
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
        "[data-lock-scan]",
      ];

      const getMarkedElement = (el: HTMLElement | null): HTMLElement | null => {
        if (!el) return null;

        const markSelector = MARKED_SELECTORS.join(",");
        const directMark = el.closest(markSelector) as HTMLElement | null;
        if (directMark) return directMark;

        const scanContainer = el.closest(
          "[data-lock-scan]",
        ) as HTMLElement | null;
        if (scanContainer) {
          const scanSelector =
            scanContainer.getAttribute("data-lock-scan") || "a, button";

          const candidate = el.closest(scanSelector) as HTMLElement | null;

          if (candidate && scanContainer.contains(candidate)) {
            return candidate;
          }
        }

        return null;
      };

      const getContainerElement = (
        el: HTMLElement | null,
      ): HTMLElement | null => {
        if (!el) return null;
        const selector = CONTAINER_SELECTORS.join(",");
        return el.closest(selector) as HTMLElement | null;
      };

      const applyCustomStyles = (el: HTMLElement | null) => {
        if (!el) {
          follower.style.removeProperty("--mf-bg-snapped");
          follower.style.removeProperty("--mf-border-snapped");
          return;
        }

        let bg = el.getAttribute("data-lock-bg");
        let border = el.getAttribute("data-lock-border");

        if (!bg || !border) {
          const scanContainer = el.closest(
            "[data-lock-scan]",
          ) as HTMLElement | null;
          if (scanContainer) {
            if (!bg) bg = scanContainer.getAttribute("data-lock-bg");
            if (!border)
              border = scanContainer.getAttribute("data-lock-border");
          }
        }

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

      const elevateElement = (el: HTMLElement | null) => {
        if (lastSnappedElement && lastSnappedElement !== el) {
          lastSnappedElement.style.removeProperty("z-index");

          if (lastSnappedElement.style.position === "relative") {
            lastSnappedElement.style.removeProperty("position");
          }
        }

        if (el) {
          if (
            el.style.position !== "absolute" &&
            el.style.position !== "fixed" &&
            el.style.position !== "relative"
          ) {
            const computed = window.getComputedStyle(el);
            if (computed.position === "static") {
              el.style.position = "relative";
            }
          }
          el.style.zIndex = "1";
        }
      };

      const update = () => {
        if (isSnapped && targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const computed = window.getComputedStyle(targetElement);

          const isTargetChanged = currentActiveTarget !== targetElement;

          if (isTargetChanged || !follower.classList.contains("snapped")) {
            follower.style.transition =
              "all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)";
            applyCustomStyles(targetElement);
            elevateElement(targetElement);
          } else {
            follower.style.transition =
              "width 0.1s, height 0.1s, border-radius 0.1s, top 0s, left 0s, background 0.1s, border 0.1s";
          }

          currentActiveTarget = targetElement;

          follower.style.width = `${rect.width}px`;
          follower.style.height = `${rect.height}px`;
          follower.style.top = `${rect.top}px`;
          follower.style.left = `${rect.left}px`;
          follower.style.borderRadius = computed.borderRadius;

          if (!follower.classList.contains("snapped")) {
            follower.classList.add("snapped");
          }
        } else {
          if (currentActiveTarget !== null) {
            applyCustomStyles(null);
            elevateElement(null);
          }
          currentActiveTarget = null;
          follower.style.transition =
            "width 0.1s, height 0.1s, border-radius 0.1s, transform 0.1s, top 0.05s, left 0.05s, background 0.1s, border 0.1s";

          follower.style.width = "20px";
          follower.style.height = "20px";
          follower.style.top = `${mouseY}px`;
          follower.style.left = `${mouseX}px`;
          follower.style.borderRadius = "0";

          if (follower.classList.contains("snapped")) {
            follower.classList.remove("snapped");
          }
        }
        requestAnimationFrame(update);
      };

      let lastSnappedElement: HTMLElement | null = null;
      let currentActiveTarget: HTMLElement | null = null;

      window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const target = e.target as HTMLElement;
        const marked = getMarkedElement(target);
        const container = getContainerElement(target);

        if (marked) {
          targetElement = marked;
          lastSnappedElement = marked;
          isSnapped = true;
        } else if (
          container &&
          lastSnappedElement &&
          container.contains(lastSnappedElement)
        ) {
          targetElement = lastSnappedElement;
          isSnapped = true;
        } else {
          targetElement = null;
          isSnapped = false;
          lastSnappedElement = null;
        }
      });

      document.addEventListener("mouseleave", () => {
        follower.classList.add("hidden");
      });

      document.addEventListener("mouseenter", () => {
        follower.classList.remove("hidden");
      });

      requestAnimationFrame(update);
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        init();
      });
    } else {
      setTimeout(() => {
        init();
      }, 1000);
    }
  });
});
