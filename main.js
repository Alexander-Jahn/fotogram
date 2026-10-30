// GALLERY DATA

const GALLERY_ITEMS = [
  "ALASKA", "ANIME", "ATMOSPHERE", "BLUE_TIT",
  "HURRICANE", "LAKE", "MOORENTE", "SEA",
  "SNOW_BUNTING", "SNOW_LEOPARD_CUBS", "TRAVEL", "WINTER"
];

// DOM ELEMENTS

const galleryGrid = document.querySelector(".gallery_grid");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeButton = document.getElementById("lightboxClose");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCounter = document.getElementById("lightboxCounter");
const prevButton = document.getElementById("lightboxPrev");
const nextButton = document.getElementById("lightboxNext");
const backgroundElements = [
  document.querySelector(".header"),
  document.querySelector(".main"),
  document.querySelector(".footer")
];

//STATE

let currentIndex = 0;
let previousFocus = null;

// FUNCTIONS

/** Convert a filename to the visible image title. */
function getImageTitle(name) {
  const title = name.toLowerCase().replaceAll("_"," ");
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/** Update the image and caption displayed in the lightbox. */
function updateLightbox() {
  const name = GALLERY_ITEMS[currentIndex];
  const title = getImageTitle(name);

  lightboxImage.src = `./assets/images/${name}.jpg`;
  lightboxImage.alt = title;
  lightboxTitle.textContent = title;
  lightboxCounter.textContent = `${currentIndex + 1} / ${GALLERY_ITEMS.length}`;
}

/** Open the lightbox and activate modal behavior. */
function openLightbox(index) {
  previousFocus = document.activeElement;
  currentIndex = index;
  updateLightbox();

  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");

  setBackgroundInert(true);
  closeButton.focus();

}

/** Close the lightbox and restore page accessibility. */
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

/** Display the next image, wrapping at the end. */
function nextImage() {
  currentIndex = (currentIndex + 1) % GALLERY_ITEMS.length;
  updateLightbox();
}

/** Display the previous image, wrapping at the start. */
function prevImage() {
  currentIndex = (currentIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
  updateLightbox();
}

/** Create a keyboard-accessible gallery button. */
function createGalleryImage(name, index) {
  const button = document.createElement("button");
  const image = document.createElement("img");
  button.type = "button";
  button.className = "gallery_button";
  button.setAttribute("aria-label", `Open ${getImageTitle(name)}`);
  image.className = "gallery_image";
  image.src = `./assets/images/${name}.jpg`;
  image.alt = "";
  image.loading = "lazy";
  button.appendChild(image);
  button.addEventListener("click", () => openLightbox(index));
  return button;
}

/** Render all gallery images dynamically. */
function renderGallery() {
  const fragment = document.createDocumentFragment();
  GALLERY_ITEMS.forEach((name, index) => {
    fragment.appendChild(createGalleryImage(name, index));
  });
  galleryGrid.replaceChildren(fragment);
}

/** Return all available focusable controls in the lightbox. */
function getFocusableElements() {
  return [...lightbox.querySelectorAll(
    'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )].filter(element => !element.inert && element.getClientRects().length);
}

/** Calculate the next focus position inside the lightbox. */
function getNextFocusIndex(index, length, backwards) {
  if (backwards) {
    return index <= 0 ? length - 1 : index - 1;
  }

  return index < 0 || index === length - 1 ? 0 : index + 1;
}

/** Keep keyboard focus inside the lightbox. */
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

/** Redirect unexpected focus back into the open dialog. */
function keepFocusInside(event) {
  if (!lightbox.classList.contains("active")) return;
  if (lightbox.contains(event.target)) return;

  const elements = getFocusableElements();
  (elements[0] || lightbox).focus();
}

/** Handle keyboard interaction inside the lightbox. */
function handleLightboxKeys(event) {
  if (!lightbox.classList.contains("active")) return;

  trapLightboxFocus(event);

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") nextImage();
  if (event.key === "ArrowLeft") prevImage();
}

/** Disable or enable the page behind the lightbox. */
function setBackgroundInert(isInert) {
  backgroundElements.forEach(element => {
    if (element) element.inert = isInert;
  });
}

// EVENTS

renderGallery();

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", handleLightboxKeys);
closeButton.addEventListener("click", closeLightbox);
nextButton.addEventListener("click", nextImage);
prevButton.addEventListener("click", prevImage);
document.addEventListener("focusin", keepFocusInside);
