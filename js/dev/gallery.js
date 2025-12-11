import { l as lightGallery } from "./vendor.min.js";
const KEY = "7EC452A9-0CFD441C-BD984C7C-17C8456E";
function initGallery() {
  if (document.querySelector("[data-fls-gallery]")) {
    new lightGallery(document.querySelector("[data-fls-gallery]"), {
      //plugins: [lgZoom, lgThumbnail],
      licenseKey: KEY,
      selector: "a",
      speed: 500
    });
  }
}
window.addEventListener("load", initGallery());
