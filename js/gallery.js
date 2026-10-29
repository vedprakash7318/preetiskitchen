/**
 * Preeti's Kitchen - Gallery & Accessible Lightbox
 */

document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const filterBtns = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("galleryLightbox");

  if (!galleryItems.length || !modal) return;

  const modalImg = modal.querySelector(".lightbox-img");
  const modalTitle = modal.querySelector(".lightbox-caption-title");
  const modalDesc = modal.querySelector(".lightbox-caption-desc");
  const closeBtn = modal.querySelector(".lightbox-close-btn");
  const prevBtn = modal.querySelector(".lightbox-prev-btn");
  const nextBtn = modal.querySelector(".lightbox-next-btn");

  let currentIndex = 0;
  let visibleItems = [...galleryItems];
  let lastFocusedElement = null;

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      galleryItems.forEach(item => {
        const category = item.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });

      visibleItems = galleryItems.filter(item => item.style.display !== "none");
    });
  });

  // Open Lightbox
  function openLightbox(index) {
    currentIndex = index;
    const item = visibleItems[currentIndex];
    if (!item) return;

    lastFocusedElement = document.activeElement;
    updateModalContent();
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function updateModalContent() {
    const item = visibleItems[currentIndex];
    if (!item) return;

    const img = item.querySelector("img");
    const title = item.querySelector(".gallery-title")?.innerText || "";
    const desc = item.querySelector(".gallery-desc")?.innerText || "";

    modalImg.src = img.currentSrc || img.src;
    modalImg.alt = img.alt || title;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
  }

  function closeLightbox() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function showNext() {
    if (visibleItems.length <= 1) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateModalContent();
  }

  function showPrev() {
    if (visibleItems.length <= 1) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateModalContent();
  }

  // Click handlers on items
  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const idx = visibleItems.indexOf(item);
        if (idx !== -1) openLightbox(idx);
      }
    });
  });

  // Controls
  closeBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  });
  nextBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showNext();
  });
  prevBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showPrev();
  });

  // Close on outside overlay click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    }
  });
});
