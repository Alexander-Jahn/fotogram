
const GALLERY_ITEMS = [
    "ALASKA", "ANIME", "ATMOSPHERE", "BLUE_TIT",
    "HURRICANE", "LAKE", "MOORENTE", "SEA",
    "SNOW_BUNTING", "SNOW_LEOPARD_CUBS", "TRAVEL", "WINTER"
];

let currentIndex = 0;

function init() {
    renderGallery();
}

function getImageTitle(name) {
    const title = name.toLowerCase().replaceAll("_", " ");
    return title.charAt(0).toUpperCase() + title.slice(1);
}

function renderGallery() {
    let galleryHTML = "";

    for (let i = 0; i < GALLERY_ITEMS.length; i++) {
        galleryHTML += getGalleryImageTemplate(GALLERY_ITEMS[i], i);
    }

    document.getElementById("galleryGrid").innerHTML = galleryHTML;
}

function updateLightbox() {
    const name = GALLERY_ITEMS[currentIndex];

    document.getElementById("lightboxContent").innerHTML =
        getLightboxTemplate(name);
}

function openLightbox(index) {
    currentIndex = index;
    updateLightbox();

    document.getElementById("lightbox").showModal();
    document.getElementById("lightboxClose").focus();
}

function closeLightbox() {
    document.getElementById("lightbox").close();
}

function nextImage() {
    currentIndex = (currentIndex + 1) % GALLERY_ITEMS.length;
    updateLightbox();
    document.getElementById("lightboxNext").focus();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + GALLERY_ITEMS.length)
        % GALLERY_ITEMS.length;

    updateLightbox();
    document.getElementById("lightboxPrev").focus();
}

function handleLightboxClick(event) {
    if (event.target.id === "lightbox") {
        closeLightbox();
    }
}
