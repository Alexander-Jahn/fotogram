function getGalleryImageTemplate(name, index) {
    const title = getImageTitle(name);

    return `
        <button class="gallery_button"
            onclick="openLightbox(${index})"
            aria-label="Open ${title}">
            <img class="gallery_image"
                src="./assets/images/${name}.jpg"
                alt=""
                loading="lazy">
        </button>
    `;
}

function getLightboxHeaderTemplate(title) {
    return `
        <div class="lightbox_header">
            <h2 id="lightboxTitle">${title}</h2>
            <button onclick="closeLightbox()"
                aria-label="Close image">
                <img src="./assets/icons/close.svg" alt="">
            </button>
        </div>
    `;
}

function getLightboxNavigationTemplate() {
    return `
        <div class="lightbox_navigation">
            <button onclick="prevImage()"
                aria-label="Previous image">
                <img src="./assets/icons/Arrow-Right.svg" alt="">
            </button>

            <span>${currentIndex + 1} / ${GALLERY_ITEMS.length}</span>

            <button onclick="nextImage()"
                aria-label="Next image">
                <img src="./assets/icons/Arrow-Right.svg" alt="">
            </button>
        </div>
    `;
}

function getLightboxTemplate(name) {
    const title = getImageTitle(name);

    return `
        ${getLightboxHeaderTemplate(title)}

        <img id="lightboxImage"
            src="./assets/images/${name}.jpg"
            alt="${title}">

        ${getLightboxNavigationTemplate()}
    `;
}