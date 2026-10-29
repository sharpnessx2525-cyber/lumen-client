const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
    }
  });
}

const supportsPointerMotion =
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (supportsPointerMotion) {
  document.querySelectorAll("[data-magnetic]").forEach((scene) => {
    const layers = scene.querySelectorAll("[data-magnetic-layer]");

    scene.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const bounds = scene.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      layers.forEach((layer) => {
        const depth = Number.parseFloat(layer.dataset.magneticLayer ?? "0");
        layer.style.setProperty("--shift-x", `${pointerX * depth * 8}px`);
        layer.style.setProperty("--shift-y", `${pointerY * depth * 8}px`);
        layer.style.setProperty("--tilt-x", `${pointerY * -4}deg`);
        layer.style.setProperty("--tilt-y", `${pointerX * 4}deg`);
      });
    });

    scene.addEventListener("pointerleave", () => {
      layers.forEach((layer) => {
        layer.style.setProperty("--shift-x", "0px");
        layer.style.setProperty("--shift-y", "0px");
        layer.style.setProperty("--tilt-x", "0deg");
        layer.style.setProperty("--tilt-y", "0deg");
      });
    });
  });

  document.querySelectorAll("[data-magnetic-card]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const bounds = card.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      card.style.setProperty("--shift-x", `${pointerX * 2}px`);
      card.style.setProperty("--shift-y", `${pointerY * 2}px`);
      card.style.setProperty("--tilt-x", `${pointerY * -3}deg`);
      card.style.setProperty("--tilt-y", `${pointerX * 3}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--shift-x", "0px");
      card.style.setProperty("--shift-y", "0px");
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}
