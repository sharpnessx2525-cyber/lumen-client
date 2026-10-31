const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const themeTrigger = document.querySelector(".theme-trigger");
const themeMenu = document.querySelector("#theme-menu");
const themeOptions = [...document.querySelectorAll("[data-theme-option]")];
const availableThemes = new Set(["white", "gray", "neon", "blue", "red"]);

let activeTheme = "neon";
try {
  const savedTheme = window.localStorage.getItem("lumen-theme");
  if (savedTheme && availableThemes.has(savedTheme)) activeTheme = savedTheme;
} catch (error) {
  console.error("Tema tersimpan tidak dapat dibaca.", error);
}

document.body.dataset.theme = activeTheme;
const updateThemeSelection = (theme) => {
  const selectedOption = themeOptions.find((option) => option.dataset.themeOption === theme);
  const swatch = selectedOption?.querySelector("span");
  const currentSwatch = document.querySelector(".theme-current-swatch");
  if (swatch && currentSwatch) {
    currentSwatch.style.setProperty("--theme-swatch", getComputedStyle(swatch).backgroundColor);
  }
  themeOptions.forEach((option) => {
    option.setAttribute("aria-pressed", String(option.dataset.themeOption === theme));
  });
};

updateThemeSelection(activeTheme);
themeTrigger?.addEventListener("click", () => {
  const isOpen = themeTrigger.getAttribute("aria-expanded") === "true";
  themeTrigger.setAttribute("aria-expanded", String(!isOpen));
  if (themeMenu) themeMenu.hidden = isOpen;
});

themeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const theme = option.dataset.themeOption;
    if (!availableThemes.has(theme)) return;

    activeTheme = theme;
    document.body.dataset.theme = theme;
    updateThemeSelection(theme);
    if (themeMenu) themeMenu.hidden = true;
    themeTrigger?.setAttribute("aria-expanded", "false");

    try {
      window.localStorage.setItem("lumen-theme", theme);
    } catch (error) {
      console.error("Tema berubah tetapi tidak dapat disimpan.", error);
      window.alert("Tema berhasil diubah, tetapi tidak dapat disimpan untuk kunjungan berikutnya.");
    }

    if (menuToggle && primaryNav) {
      menuToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
    }
  });
});

document.addEventListener("click", (event) => {
  if (event.target instanceof Node && !event.target.closest(".theme-switch")) {
    if (themeMenu) themeMenu.hidden = true;
    themeTrigger?.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && themeTrigger?.getAttribute("aria-expanded") === "true") {
    if (themeMenu) themeMenu.hidden = true;
    themeTrigger.setAttribute("aria-expanded", "false");
    themeTrigger.focus();
  }
});

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

  const featureGrid = document.querySelector(".feature-grid");
  const featureCards = [...document.querySelectorAll(".feature-card[data-magnetic-card]")];
  if (featureGrid) {
    featureGrid.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const target = event.target instanceof Element
        ? event.target.closest(".feature-card[data-magnetic-card]")
        : null;

      featureCards.forEach((card) => {
        if (card !== target) {
          card.style.setProperty("--shift-x", "0px");
          card.style.setProperty("--shift-y", "0px");
          return;
        }

        const bounds = card.getBoundingClientRect();
        const transform = new DOMMatrixReadOnly(getComputedStyle(card).transform);
        const currentX = transform.m41;
        const currentY = transform.m42;
        const pointerX = ((event.clientX - (bounds.left - currentX)) / bounds.width - 0.5) * 2;
        const pointerY = ((event.clientY - (bounds.top - currentY)) / bounds.height - 0.5) * 2;
        card.style.setProperty("--shift-x", `${Math.round(pointerX * 7)}px`);
        card.style.setProperty("--shift-y", `${Math.round(pointerY * 7)}px`);
      });
    });

    featureGrid.addEventListener("pointerleave", () => {
      featureCards.forEach((card) => {
        card.style.setProperty("--shift-x", "0px");
        card.style.setProperty("--shift-y", "0px");
      });
    });
  }

  document.querySelectorAll(".chart-card[data-magnetic-card]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const bounds = card.getBoundingClientRect();
      const pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

      card.style.setProperty("--shift-x", `${Math.round(pointerX * 6)}px`);
      card.style.setProperty("--shift-y", `${Math.round(pointerY * 6)}px`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--shift-x", "0px");
      card.style.setProperty("--shift-y", "0px");
    });
  });
}

const configuredImages = window.LUMEN_IMAGE_SETTINGS ?? {};

const showFeaturePreview = (image, container, source, width, height) => {
  container.style.setProperty("--preview-aspect-ratio", `${width} / ${height}`);
  image.src = source;
  image.hidden = false;
  container.classList.add("has-custom-preview");
};

document.querySelectorAll("[data-feature-preview-image]").forEach((image) => {
  const slot = image.dataset.featurePreviewImage;
  const previewContainer = document.querySelector(`[data-preview-container="${slot}"]`);
  const configuredSource = configuredImages[slot];

  if (typeof configuredSource !== "string" || !configuredSource.trim()) return;

  const validationImage = new Image();
  validationImage.onload = () => {
    showFeaturePreview(image, previewContainer, configuredSource.trim(), validationImage.naturalWidth, validationImage.naturalHeight);
  };
  validationImage.onerror = () => {
    console.error(`Gambar untuk preview "${slot}" gagal dimuat: ${configuredSource}`);
  };
  validationImage.src = configuredSource.trim();
});
