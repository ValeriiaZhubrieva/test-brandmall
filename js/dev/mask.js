import "./vendor.min.js";
window.inputMask = function() {
  const inputMasks = document.querySelectorAll("input[data-fls-input-mask]");
  inputMasks.forEach((input) => {
    const maskAttr = input.dataset.flsInputMask;
    if (maskAttr.startsWith("+")) {
      Inputmask(maskAttr).mask(input);
      return;
    }
    if (maskAttr.startsWith("price")) {
      let currency = "₴";
      const parts = maskAttr.split(":");
      if (parts[1]) {
        currency = parts[1].trim();
      }
      Inputmask({
        alias: "numeric",
        groupSeparator: " ",
        autoGroup: true,
        digits: 0,
        digitsOptional: false,
        prefix: "",
        suffix: " " + currency,
        placeholder: "",
        rightAlign: false,
        allowMinus: false,
        autoUnmask: true
      }).mask(input);
      return;
    }
  });
};
if (document.querySelector("input[data-fls-input-mask]")) {
  window.addEventListener("load", window.inputMask);
}
