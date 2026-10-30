
const GALLERY_ITEMS = [
  "ALASKA", "ANIME", "ATMOSPHERE", "BLUE_TIT",
  "HURRICANE", "LAKE", "MOORENTE", "SEA",
  "SNOW_BUNTING", "SNOW_LEOPARD_CUBS", "TRAVEL", "WINTER"
];

const galleryGrid = document.querySelector(".gallery_grid");
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");

const backgroundElements = [
  document.querySelector(".header"),
  document.querySelector(".main"),
  document.querySelector(".footer")
];

let currentIndex = 0;
let previousFocus = null;

function getImageTitle(name) {
  const title = name.toLowerCase().replaceAll("_", " ");
  return title.charAt(0).toUpperCase() + title.slice(1);
}

function updateLightbox() {
  const name = GALLERY_ITEMS[currentIndex];
  const title = getImageTitle(name);

  lightboxContent.innerHTML = `
    <div class="lightbox_header">
      <h2 id="lightboxTitle">${title}</h2>
      <button id="lightboxClose" aria-label="Close image">
        <img src="./assets/icons/close.svg" alt="">
      </button>
    </div>

    <img id="lightboxImage"
         src="./assets/images/${name}.jpg"
         alt="${title}">

    <div class="lightbox_navigation">
      <button id="lightboxPrev" aria-label="Previous image">
        <img src="./assets/icons/Arrow-Right.svg" alt="">
      </button>

      <span id="lightboxCounter" role="status"
            aria-live="polite" aria-atomic="true">
        ${currentIndex + 1} / ${GALLERY_ITEMS.length}
      </span>

      <button id="lightboxNext" aria-label="Next image">
        <img src="./assets/icons/Arrow-Right.svg" alt="">
      </button>
    </div>
  `;
}

function openLightbox(index) {
  previousFocus = document.activeElement;
  currentIndex = index;
  updateLightbox();

  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  setBackgroundInert(true);
  lightbox.querySelector("#lightboxClose").focus();
}

function closeLightbox() {
  if (!lightbox.classList.contains("active")) return;

  setBackgroundInert(false);
  lightbox.classList.remove("active");
  document.body.classList.remove("no-scroll");

  if (previousFocus?.isConnected) previousFocus.focus();
  else document.activeElement.blur();

  lightbox.setAttribute("aria-hidden", "true");
  previousFocus = null;
}

function nextImage() {
  currentIndex = (currentIndex + 1) % GALLERY_ITEMS.length;
  updateLightbox();
  lightbox.querySelector("#lightboxNext").focus();
}

function prevImage() {
  currentIndex = (currentIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  updateLightbox();
  lightbox.querySelector("#lightboxPrev").focus();
}

function createGalleryImage(name, index) {
  const button = document.createElement("button");

  button.type = "button";
  button.className = "gallery_button";
  button.setAttribute("aria-label", `Open ${getImageTitle(name)}`);

  button.innerHTML = `
    <img class="gallery_image"
         src="./assets/images/${name}.jpg"
         alt=""
         loading="lazy">
  `;

  button.addEventListener("click", () => openLightbox(index));

  return button;
}

function renderGallery() {
  const fragment = document.createDocumentFragment();

  GALLERY_ITEMS.forEach((name, index) => {
    fragment.appendChild(createGalleryImage(name, index));
  });

  galleryGrid.replaceChildren(fragment);
}

function getFocusableElements() {
  return [...lightbox.querySelectorAll(
    'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter(element => !element.inert && element.getClientRects().length);
}

function getNextFocusIndex(index, length, backwards) {
  if (backwards) {
    return index <= 0 ? length - 1 : index - 1;
  }

  return index < 0 || index === length - 1 ? 0 : index + 1;
}

function trapLightboxFocus(event) {
  if (event.key !== "Tab") return;

  const elements = getFocusableElements();
  event.preventDefault();

  if (!elements.length) {
    lightbox.focus();
    return;
  }

  const index = elements.indexOf(document.activeElement);
  const next = getNextFocusIndex(index, elements.length, event.shiftKey);
  elements[next].focus();
}

function keepFocusInside(event) {
  if (!lightbox.classList.contains("active")) return;
  if (lightbox.contains(event.target)) return;

  const elements = getFocusableElements();
  (elements[0] || lightbox).focus();
}

function handleLightboxKeys(event) {
  if (!lightbox.classList.contains("active")) return;

  trapLightboxFocus(event);

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") nextImage();
  if (event.key === "ArrowLeft") prevImage();
}

function setBackgroundInert(isInert) {
  backgroundElements.forEach(element => {
    if (element) element.inert = isInert;
  });
}

function handleLightboxClick(event) {
  if (event.target === lightbox) {
    closeLightbox();
    return;
  }

  const button = event.target.closest("button");
  if (!button || !lightbox.contains(button)) return;

  if (button.id === "lightboxClose") closeLightbox();
  if (button.id === "lightboxNext") nextImage();
  if (button.id === "lightboxPrev") prevImage();
}

renderGallery();

lightbox.addEventListener("click", handleLightboxClick);
document.addEventListener("keydown", handleLightboxKeys);
document.addEventListener("focusin", keepFocusInside);
