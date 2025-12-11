import { S as Swiper, N as Navigation, P as Pagination, a as Scrollbar } from "./vendor.min.js";
const resizableSwiper = (breakpoint, swiperElementOrClass, swiperSettings, callback) => {
  const swiperElement = typeof swiperElementOrClass === "string" ? document.querySelector(swiperElementOrClass) : swiperElementOrClass;
  if (swiperElement) {
    let swiper;
    breakpoint = window.matchMedia(breakpoint);
    const enableSwiper = function(element, settings) {
      swiper = new Swiper(element, settings);
    };
    const checker = function() {
      if (breakpoint.matches) {
        return enableSwiper(swiperElement, swiperSettings);
      } else {
        if (swiper !== void 0) swiper.destroy(true, true);
        return;
      }
    };
    breakpoint.addEventListener("change", checker);
    checker();
  }
};
function toggleLockSliderClass(swiper) {
  const nextBtn = swiper.el.parentElement.querySelector(".swiper-button-next");
  const pagination = swiper.el.parentElement.querySelector(".swiper-pagination");
  const myBlock = swiper.el.parentElement.querySelector("[data-swiper-lock]");
  if (!myBlock) return;
  if (nextBtn && nextBtn.classList.contains("swiper-button-lock") || pagination && pagination.classList.contains("swiper-pagination-lock")) {
    myBlock.classList.add("swiper-block-lock");
  } else {
    myBlock.classList.remove("swiper-block-lock");
  }
}
function initSliders() {
  if (document.querySelector(".specialproposal__slider")) {
    document.querySelectorAll(".specialproposal__slider").forEach((el) => {
      const parentSlider = el.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      new Swiper(el, {
        modules: [Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: "auto",
        spaceBetween: 10,
        //autoHeight: true,
        speed: 800,
        //touchRatio: 0,
        //simulateTouch: false,
        //loop: true,
        //preloadImages: false,
        //lazy: true,
        /*
        // Ефекти
        effect: 'fade',
        autoplay: {
        	delay: 3000,
        	disableOnInteraction: false,
        },
        */
        // Пагінація
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        // Скроллбар
        /*
        scrollbar: {
        	el: '.swiper-scrollbar',
        	draggable: true,
        },
        */
        // Кнопки "вліво/вправо"
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        // Брейкпоінти
        breakpoints: {
          319: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          549.98: {
            slidesPerView: 2,
            spaceBetween: 10
          },
          767.98: {
            slidesPerView: "auto",
            spaceBetween: 10
          }
        },
        // Події
        on: {
          init(sw) {
            toggleLockSliderClass(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
          }
        }
      });
    });
  }
  if (document.querySelector(".offers__slider")) {
    document.querySelectorAll(".offers__slider").forEach((el) => {
      const parentSlider = el.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      const swiperScrollbar = parentSlider.querySelector(".swiper-scrollbar");
      new Swiper(el, {
        modules: [Navigation, Pagination, Scrollbar],
        observer: true,
        observeParents: true,
        slidesPerView: 3,
        spaceBetween: 9,
        speed: 800,
        // Пагінація
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        // Скроллбар
        scrollbar: {
          el: swiperScrollbar,
          draggable: true
        },
        // Кнопки "вліво/вправо"
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        // Брейкпоінти
        breakpoints: {
          319: {
            slidesPerView: 1,
            spaceBetween: 8
          },
          369.98: {
            slidesPerView: 2,
            spaceBetween: 8
          },
          929.98: {
            slidesPerView: 3,
            spaceBetween: 8
          },
          991.98: {
            slidesPerView: 2,
            spaceBetween: 8
          },
          1199.98: {
            slidesPerView: 3,
            spaceBetween: 9
          }
        },
        // Події
        on: {
          init(sw) {
            toggleLockSliderClass(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
          }
        }
      });
    });
  }
  if (document.querySelector(".product-detail__slider")) {
    document.querySelectorAll(".product-detail__slider").forEach((el) => {
      resizableSwiper("(max-width: 47.9988em)", el, {
        modules: [Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 800,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        on: {}
      });
    });
  }
  if (document.querySelector(".proposals__slider")) {
    document.querySelectorAll(".proposals__slider").forEach((el) => {
      const parentSlider = el.parentElement;
      const swiperNextBtn = parentSlider.querySelector(".swiper-button-next");
      const swiperPrevBtn = parentSlider.querySelector(".swiper-button-prev");
      const swiperPagination = parentSlider.querySelector(".swiper-pagination");
      const swiperScrollbar = parentSlider.querySelector(".swiper-scrollbar");
      new Swiper(el, {
        modules: [Navigation, Pagination, Scrollbar],
        observer: true,
        observeParents: true,
        slidesPerView: 4,
        spaceBetween: 10,
        speed: 800,
        // Пагінація
        pagination: {
          el: swiperPagination,
          clickable: true
        },
        // Скроллбар
        scrollbar: {
          el: swiperScrollbar,
          draggable: true
        },
        // Кнопки "вліво/вправо"
        navigation: {
          prevEl: swiperPrevBtn,
          nextEl: swiperNextBtn
        },
        // Брейкпоінти
        breakpoints: {
          319: {
            slidesPerView: 1,
            spaceBetween: 8
          },
          369.98: {
            slidesPerView: 2,
            spaceBetween: 8
          },
          991.98: {
            slidesPerView: 3,
            spaceBetween: 8
          },
          1199.98: {
            slidesPerView: 4,
            spaceBetween: 10
          }
        },
        // Події
        on: {
          init(sw) {
            toggleLockSliderClass(this);
          },
          slideChange(sw) {
            toggleLockSliderClass(this);
          },
          resize(sw) {
            toggleLockSliderClass(this);
          }
        }
      });
    });
  }
}
document.querySelector("[data-fls-slider]") ? window.addEventListener("load", initSliders) : null;
