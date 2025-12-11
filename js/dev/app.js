window.customMiniSelect = function() {
  const selParents = document.querySelectorAll("[data-sel-block]");
  if (!selParents.length) return;
  selParents.forEach((selBlock) => {
    const selDropdownButton = selBlock.querySelector("[data-sel-block-current]");
    const selDropdownValueSpan = selDropdownButton.querySelector("[data-sel-block-value] span");
    const selDropdownInput = selDropdownButton.querySelector("[data-sel-block-input]");
    const selOptions = selBlock.querySelectorAll("[data-sel-block-btn]");
    const placeholderText = selBlock.getAttribute("data-sel-block-placeholder");
    const selCloseBtns = selBlock.querySelectorAll("[data-sel-block-close]");
    const selDropdown = selBlock.querySelector("[data-sel-block-dropdown]");
    let isOpen = false;
    function checkDropdownOverflow() {
      if (!selDropdown) return;
      selBlock.classList.remove("is-out-left", "is-out-right");
      const rect = selDropdown.getBoundingClientRect();
      if (rect.left < 0) {
        selBlock.classList.add("is-out-left");
      }
      if (rect.right > window.innerWidth) {
        selBlock.classList.add("is-out-right");
      }
    }
    function checkAndSetPlaceholder() {
      if (!placeholderText) return;
      const hasActiveOption = Array.from(selOptions).some((option) => option.classList.contains("is-active"));
      if (!hasActiveOption) {
        selBlock.classList.add("is-placeholder");
        if (selDropdownValueSpan) {
          selDropdownValueSpan.innerHTML = placeholderText;
        }
      } else {
        selBlock.classList.remove("is-placeholder");
      }
    }
    checkAndSetPlaceholder();
    function closeDropdown() {
      selBlock.classList.remove("sel-open");
      setTimeout(() => {
        selBlock.classList.remove("is-out-left", "is-out-right");
      }, 300);
      isOpen = false;
      document.removeEventListener("click", handleDocumentClick);
    }
    function handleDocumentClick(e) {
      if (!selBlock.contains(e.target)) {
        closeDropdown();
      }
    }
    selCloseBtns.forEach((btn) => {
      btn.addEventListener("click", closeDropdown);
    });
    selDropdownButton.addEventListener("click", (e) => {
      isOpen = !isOpen;
      const parentWithAttr = selBlock.closest("[data-one-sel-block]");
      if (parentWithAttr && isOpen) {
        parentWithAttr.querySelectorAll("[data-sel-block]").forEach((block) => {
          if (block !== selBlock) block.classList.remove("sel-open");
        });
      }
      selBlock.classList.toggle("sel-open", isOpen);
      if (isOpen) {
        document.addEventListener("click", handleDocumentClick);
        requestAnimationFrame(() => {
          checkDropdownOverflow();
        });
      } else {
        closeDropdown();
      }
    });
    selOptions.forEach((item) => {
      item.addEventListener("click", () => {
        const selectedText = item.textContent.replace(/\s+/g, " ").trim();
        if (selDropdownInput) {
          selDropdownInput.value = selectedText;
          selDropdownInput.dispatchEvent(new Event("input"));
        } else if (selDropdownValueSpan) {
          selDropdownValueSpan.innerHTML = selectedText;
        }
        selOptions.forEach((o) => o.classList.toggle("is-active", o === item));
        closeDropdown();
        checkAndSetPlaceholder();
      });
    });
  });
};
customMiniSelect();
const topPositionBlocks = document.querySelectorAll("[data-top-position]");
if (topPositionBlocks.length) {
  let updateTopPositions = function() {
    const headerHeight = header ? header.offsetHeight : 0;
    const headerRect = header ? header.getBoundingClientRect() : { bottom: 0 };
    topPositionBlocks.forEach((block) => {
      const blockRect = block.getBoundingClientRect();
      let topPosition;
      if (blockRect.top < headerRect.bottom) {
        topPosition = Math.max(0, blockRect.top);
      } else {
        topPosition = headerHeight;
      }
      block.style.setProperty("--top-position", `${topPosition}px`);
      block.style.setProperty("--header-height", `${headerHeight}px`);
    });
  };
  var updateTopPositions2 = updateTopPositions;
  const header = document.querySelector("header");
  updateTopPositions();
  window.addEventListener("scroll", updateTopPositions);
  window.addEventListener("resize", updateTopPositions);
  if (header && "ResizeObserver" in window) {
    const headerObserver = new ResizeObserver(() => {
      updateTopPositions();
    });
    headerObserver.observe(header);
  }
}
const toggleActiveParentBtns = document.querySelectorAll("[data-toggle-parent-active]");
if (toggleActiveParentBtns.length) {
  toggleActiveParentBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      btn.classList.toggle("is-active");
      btn.parentElement.classList.toggle("is-active");
    });
  });
}
const toggleActiveBtns = document.querySelectorAll("[data-toggle-active]");
if (toggleActiveBtns.length) {
  toggleActiveBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-active");
    });
  });
}
window.initInputEffects = function() {
  const inputFields = document.querySelectorAll("input, textarea");
  if (!inputFields.length) return;
  inputFields.forEach((input) => {
    const parent = input.parentElement;
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        parent.classList.add("is-filled");
      } else {
        parent.classList.remove("is-filled");
      }
    });
    input.addEventListener("focus", () => {
      parent.classList.add("is-focused");
    });
    input.addEventListener("blur", () => {
      parent.classList.remove("is-focused");
    });
  });
};
initInputEffects();
document.addEventListener("DOMContentLoaded", () => {
  const totalElements = document.querySelectorAll(".fixed-block-hide");
  const fixedElement = document.querySelector(".fixed-block");
  if (!totalElements.length || !fixedElement) return;
  const observer = new IntersectionObserver(
    (entries) => {
      let anyVisible = false;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anyVisible = true;
        }
      });
      if (anyVisible) {
        fixedElement.classList.add("hide");
      } else {
        fixedElement.classList.remove("hide");
      }
    },
    { threshold: 0.1 }
  );
  totalElements.forEach((el) => observer.observe(el));
});
