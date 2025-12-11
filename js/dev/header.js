import { i as isMobile } from "./common.min.js";
window.enableFocusTrap = function(menu, { openClass = "is-open" } = {}) {
  const focusableSelector = 'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';
  const guardStart = document.createElement("span");
  const guardEnd = document.createElement("span");
  guardStart.tabIndex = 0;
  guardEnd.tabIndex = 0;
  guardStart.className = "focus-guard";
  guardEnd.className = "focus-guard";
  guardStart.setAttribute("aria-hidden", "true");
  guardEnd.setAttribute("aria-hidden", "true");
  menu.prepend(guardStart);
  menu.append(guardEnd);
  const getFocusable = () => Array.from(menu.querySelectorAll(focusableSelector)).filter((el) => {
    const style = window.getComputedStyle(el);
    const notHidden = style.visibility !== "hidden" && style.display !== "none";
    const rect = typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : { width: 1, height: 1 };
    const hasSize = rect.width > 0 && rect.height > 0;
    return notHidden && hasSize && !el.hasAttribute("disabled");
  });
  function handleGuardFocus(e) {
    const focusable = getFocusable();
    if (!focusable.length) return;
    if (e.target === guardStart) {
      focusable[focusable.length - 1].focus();
    } else {
      focusable[0].focus();
    }
  }
  guardStart.addEventListener("focus", handleGuardFocus);
  guardEnd.addEventListener("focus", handleGuardFocus);
  function onKeydown(e) {
    if (e.key !== "Tab") return;
    if (!menu.classList.contains(openClass)) return;
    const isInside = menu.contains(document.activeElement);
    const focusable = getFocusable();
    if (!focusable.length) {
      e.preventDefault();
      return;
    }
    if (!isInside) {
      e.preventDefault();
      (e.shiftKey ? focusable[focusable.length - 1] : focusable[0]).focus();
      return;
    }
  }
  document.addEventListener("keydown", onKeydown, true);
  return function cleanup() {
    document.removeEventListener("keydown", onKeydown, true);
    guardStart.removeEventListener("focus", handleGuardFocus);
    guardEnd.removeEventListener("focus", handleGuardFocus);
    guardStart.remove();
    guardEnd.remove();
  };
};
window.initMenu = function() {
  const activeClass = "is-open";
  const activeBtnClass = "is-active";
  const html = document.documentElement;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  let removeTrap = null;
  let lastActiveButton = null;
  let focusReturnNeeded = false;
  let overlay = null;
  function createOverlay(menu) {
    removeOverlay();
    overlay = document.createElement("div");
    overlay.className = "menu-overlay";
    overlay.style.zIndex = -1;
    menu.appendChild(overlay);
    overlay.addEventListener("click", closeAllMenus);
    if (!isTouch && !isMobile.any()) {
      overlay.addEventListener("mouseenter", () => {
        menu.dispatchEvent(new Event("mouseleave"));
      });
      overlay.addEventListener("mouseleave", () => {
        menu.dispatchEvent(new Event("mouseleave"));
      });
    }
  }
  function removeOverlay() {
    if (overlay && overlay.parentElement) {
      overlay.removeEventListener("click", closeAllMenus);
      overlay.remove();
      overlay = null;
    }
  }
  function closeAllMenus() {
    document.querySelectorAll("[data-menu-target]." + activeClass).forEach((menu) => {
      menu.classList.remove(activeClass);
    });
    document.querySelectorAll("[data-menu]." + activeBtnClass).forEach((btn) => {
      btn.classList.remove(activeBtnClass);
    });
    html.classList.remove("menu-open");
    html.className = [...html.classList].filter((cls) => !cls.startsWith("menu-open--")).join(" ");
    if (removeTrap) {
      removeTrap();
      removeTrap = null;
    }
    if (focusReturnNeeded && lastActiveButton) {
      lastActiveButton.focus();
    }
    lastActiveButton = null;
    focusReturnNeeded = false;
  }
  function openMenu(menuName, { withFocusReturn = true } = {}) {
    closeAllMenus();
    const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
    const button = document.querySelector(`[data-menu="${menuName}"]`);
    if (menu && button) {
      const menuBlockRect = menu.parentElement.getBoundingClientRect();
      lastActiveButton = button;
      focusReturnNeeded = withFocusReturn;
      menu.classList.add(activeClass);
      button.classList.add(activeBtnClass);
      html.classList.add("menu-open");
      html.classList.add(`menu-open--${menuName}`);
      menu.style.setProperty("--menu-height", `${window.innerHeight - menuBlockRect.bottom}px`);
      removeTrap = enableFocusTrap(menu, { openClass: "is-open" });
      createOverlay(menu);
    }
  }
  function toggleMenu(menuName) {
    const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
    const isOpen = menu?.classList.contains(activeClass);
    if (isOpen) {
      closeAllMenus();
    } else {
      openMenu(menuName);
    }
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllMenus();
    }
  });
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "data-fls-popup-open") {
        if (html.hasAttribute("data-fls-popup-open")) {
          closeAllMenus();
        }
      }
    }
  });
  observer.observe(html, { attributes: true });
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-menu]");
    const isInsideMenu = e.target.closest("[data-menu-target]." + activeClass);
    if (btn) {
      if (btn.hasAttribute("data-menu-click") || isTouch && isMobile.any()) {
        e.preventDefault();
      }
      const menuName = btn.dataset.menu;
      toggleMenu(menuName);
    } else if (!isInsideMenu) {
      closeAllMenus();
    }
  });
  document.querySelectorAll("[data-menu-close]").forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeAllMenus();
    });
  });
  if (!isTouch && !isMobile.any()) {
    document.querySelectorAll("[data-menu]").forEach((button) => {
      if (button.hasAttribute("data-menu-click")) return;
      const menuName = button.dataset.menu;
      const menu = document.querySelector(`[data-menu-target="${menuName}"]`);
      if (!menu) return;
      let overBtn = false;
      let overMenu = false;
      let localCloseTimer = null;
      const startCloseTimer = () => {
        clearTimeout(localCloseTimer);
        localCloseTimer = setTimeout(() => {
          if (!overBtn && !overMenu) {
            menu.classList.remove(activeClass);
            button.classList.remove(activeBtnClass);
            html.classList.remove(`menu-open--${menuName}`);
            if (!document.querySelector("[data-menu-target]." + activeClass)) {
              html.classList.remove("menu-open");
            }
          }
        }, 300);
      };
      button.addEventListener("mouseenter", () => {
        overBtn = true;
        openMenu(menuName, { withFocusReturn: false });
      });
      button.addEventListener("mouseleave", () => {
        overBtn = false;
        startCloseTimer();
      });
      menu.addEventListener("mouseenter", () => {
        overMenu = true;
      });
      menu.addEventListener("mouseleave", () => {
        overMenu = false;
        startCloseTimer();
      });
    });
  }
};
document.addEventListener("DOMContentLoaded", window.initMenu);
window.initSubmenu = function() {
  const submenuActiveClass = "is-open";
  const submenuBtnActiveClass = "is-active";
  const mediaBreakpoint = 549.98;
  const mediaQueryString = `(max-width: ${mediaBreakpoint}px)`;
  const subMenus = document.querySelectorAll("[data-submenu]");
  if (!subMenus.length) return;
  const mediaQuery = window.matchMedia(mediaQueryString);
  subMenus.forEach((submenu) => {
    const submenuBtn = submenu.querySelector("[data-submenu-link]");
    const submenuBack = submenu.querySelector("[data-submenu-back]");
    const submenuClose = submenu.querySelector("[data-menu-close]");
    if (submenuBtn) {
      submenuBtn.addEventListener("click", (e) => {
        if (!mediaQuery.matches) return;
        e.preventDefault();
        submenuBtn.classList.toggle(submenuBtnActiveClass);
        submenu.classList.toggle(submenuActiveClass);
      });
    }
    if (submenuBack) {
      submenuBack.addEventListener("click", (e) => {
        if (!mediaQuery.matches) return;
        e.preventDefault();
        submenuBtn.classList.remove(submenuBtnActiveClass);
        submenu.classList.remove(submenuActiveClass);
      });
    }
    if (submenuClose) {
      submenuClose.addEventListener("click", (e) => {
        if (!mediaQuery.matches) return;
        e.preventDefault();
        submenuBtn.classList.remove(submenuBtnActiveClass);
        submenu.classList.remove(submenuActiveClass);
      });
    }
  });
  mediaQuery.addEventListener("change", (e) => {
    if (!e.matches) {
      subMenus.forEach((submenu) => {
        const submenuBtn = submenu.querySelector("[data-submenu-link]");
        submenuBtn?.classList.remove(submenuBtnActiveClass);
        submenu.classList.remove(submenuActiveClass);
      });
    }
  });
};
document.addEventListener("DOMContentLoaded", window.initSubmenu);
document.querySelectorAll(".lang-block").forEach((block) => {
  const btn = block.querySelector(".lang-block__current");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = block.classList.toggle("is-active");
    btn.classList.toggle("is-active", isActive);
  });
  document.addEventListener("click", (e) => {
    if (!block.contains(e.target)) {
      block.classList.remove("is-active");
      btn.classList.remove("is-active");
    }
  });
});
