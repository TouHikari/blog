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
      background: rgba(100, 255, 218, 0.1); /* Default following color */
      border: 1px solid rgba(100, 255, 218, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%); /* Center on coordinate */
      /* Transition is handled dynamically in JS */
      box-sizing: border-box;
      will-change: top, left, width, height, transform, border-radius;
    }
    .mouse-follower.snapped {
      background: rgba(100, 255, 218, 0.2);
      border: 1px solid rgba(100, 255, 218, 0.8);
      transform: translate(0, 0); /* Reset centering to match element rect */
    }
    .mouse-follower.hidden {
      opacity: 0;
      transition: opacity 0.3s;
    }
  `;
    document.head.appendChild(style);

    let mouseX = 0;
    let mouseY = 0;
    let targetElement: HTMLElement | null = null;
    let isSnapped = false;

    const isMarked = (el: HTMLElement) => {
      // Basic filtering: ignore body, html
      if (!el) return false;
      if (el === document.body || el === document.documentElement) return false;
      if (el.classList.contains("mouse-follower")) return false;
      if (el.id === "__nuxt") return false;
      return true;
    };

    const update = () => {
      if (isSnapped && targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const computed = window.getComputedStyle(targetElement);

        // When snapped, we want smooth transition for all properties
        follower.style.transition = "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";

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
          "width 0.3s, height 0.3s, border-radius 0.3s, transform 0.3s, top 0.05s, left 0.05s";

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

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement;
      // We check if the target is marked.
      // Since "act on all elements" is requested, we treat any non-root element as marked.
      if (isMarked(target)) {
        targetElement = target;
        isSnapped = true;
      } else {
        targetElement = null;
        isSnapped = false;
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
