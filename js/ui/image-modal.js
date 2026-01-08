/**
 * Image Modal Module
 * Handles expanding and closing image modals
 */

const ImageModal = (function () {
  let modal = null;

  /**
   * Create the modal element if it doesn't exist
   */
  function ensureModal() {
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "image-modal-overlay";
    modal.className = "image-modal-overlay";
    modal.innerHTML = `
      <span class="image-modal-close" onclick="ImageModal.close()">&times;</span>
      <img src="" alt="Expanded view" />
    `;
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };
    document.body.appendChild(modal);

    return modal;
  }

  /**
   * Open the modal with an image
   * @param {string} imageSrc - URL of the image to display
   */
  function open(imageSrc) {
    const m = ensureModal();
    m.querySelector("img").src = imageSrc;
    m.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  /**
   * Close the modal
   */
  function close() {
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Listen for Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Public API
  return {
    open,
    close,
  };
})();

// Export for global access (needed for onclick handlers in HTML)
window.ImageModal = ImageModal;

// Legacy function names for backwards compatibility (used in HTML onclick)
window.openImageModal = ImageModal.open;
window.closeImageModal = ImageModal.close;
