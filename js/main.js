/**
 * Preeti's Kitchen - Main Script
 * Handles navigation, mobile drawer, accessible FAQs accordion, and shared UI
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Drawer Navigation
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const drawer = document.querySelector(".mobile-drawer");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = drawer.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggleBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      
      // Toggle hamburger to X icon
      toggleBtn.innerHTML = isOpen
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close on link click
    drawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        drawer.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (drawer.classList.contains("open") && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        drawer.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // 2. FAQ Accordion Interaction
  const faqCards = document.querySelectorAll(".faq-card");
  faqCards.forEach(card => {
    const questionBtn = card.querySelector(".faq-question");
    const answer = card.querySelector(".faq-answer");

    if (questionBtn && answer) {
      questionBtn.addEventListener("click", () => {
        const isOpen = card.classList.contains("open");

        // Close other FAQs
        faqCards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove("open");
            const otherBtn = otherCard.querySelector(".faq-question");
            const otherAns = otherCard.querySelector(".faq-answer");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        // Toggle current FAQ
        if (isOpen) {
          card.classList.remove("open");
          questionBtn.setAttribute("aria-expanded", "false");
          answer.style.maxHeight = null;
        } else {
          card.classList.add("open");
          questionBtn.setAttribute("aria-expanded", "true");
          answer.style.maxHeight = answer.scrollHeight + 30 + "px";
        }
      });
    }
  });

  // 3. Highlight Active Navigation Item based on current path
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // 4. Dynamic Year in Footer
  const yearElem = document.getElementById("currentYear");
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // 5. Close Mobile Drawer on Escape Key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) {
      drawer.classList.remove("open");
      toggleBtn?.setAttribute("aria-expanded", "false");
      toggleBtn?.focus();
    }
  });
});
