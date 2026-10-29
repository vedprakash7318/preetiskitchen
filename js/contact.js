/**
 * Preeti's Kitchen - Contact & WhatsApp Form Handler
 * Validates inputs and compiles URL-encoded WhatsApp message
 * 
 * Rules:
 * - Minimum 10 people for Catering & Bulk Orders
 * - Tiffin orders do NOT require a 10-person minimum
 * - WhatsApp redirect to +91 94155 16588
 * - Clear disclaimer that sending WhatsApp does NOT mean a booking is confirmed
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingEnquiryForm");
  if (!form) return;

  const serviceSelect = document.getElementById("serviceType");
  const peopleInput = document.getElementById("guestCount");
  const peopleHint = document.getElementById("peopleHint");
  const dateInput = document.getElementById("eventDate");
  const resultNotice = document.getElementById("formResultNotice");

  // Prevent past dates
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  // Helper to determine minimum requirement
  function getMinCountForService(service) {
    if (service === "catering_20") return 20;
    if (service === "catering_100") return 50;
    if (["wedding", "catering", "bulk", "birthday", "office"].includes(service)) return 10;
    return 1;
  }

  // Dynamic helper text for People Count based on Service Type
  function updatePeopleRequirements() {
    const service = serviceSelect.value;
    const minRequired = getMinCountForService(service);

    if (minRequired > 1) {
      if (service === "catering_20") {
        peopleHint.textContent = "ℹ️ Note: Minimum 20 people required for this small party catering package.";
      } else if (service === "catering_100") {
        peopleHint.textContent = "ℹ️ Note: Recommended for gatherings of 50 to 100+ guests.";
      } else {
        peopleHint.textContent = "ℹ️ Note: Minimum 10 people required for party catering and bulk orders in Lucknow.";
      }
      peopleInput.setAttribute("min", minRequired.toString());
      if (peopleInput.value && parseInt(peopleInput.value, 10) < minRequired) {
        showError(peopleInput, `Minimum ${minRequired} people required for this service.`);
      } else {
        clearError(peopleInput);
      }
    } else {
      peopleHint.textContent = "ℹ️ Daily tiffins can be ordered for 1 or more people.";
      peopleInput.setAttribute("min", "1");
      clearError(peopleInput);
    }
  }

  serviceSelect.addEventListener("change", updatePeopleRequirements);
  peopleInput.addEventListener("input", () => {
    const service = serviceSelect.value;
    const val = parseInt(peopleInput.value, 10);
    const minRequired = getMinCountForService(service);
    if (minRequired > 1 && val < minRequired) {
      showError(peopleInput, `Minimum ${minRequired} people required for this service.`);
    } else if (val < 1) {
      showError(peopleInput, "Please enter at least 1 person.");
    } else {
      clearError(peopleInput);
    }
  });

  // Check URL parameters for pre-population
  const urlParams = new URLSearchParams(window.location.search);
  const paramService = urlParams.get("service");
  if (paramService && serviceSelect.querySelector(`option[value="${paramService}"]`)) {
    serviceSelect.value = paramService;
  }
  const paramArea = urlParams.get("area");
  if (paramArea) {
    const areaInput = document.getElementById("deliveryArea");
    if (areaInput) areaInput.value = paramArea;
  }
  updatePeopleRequirements();

  // Validation Helpers
  function showError(input, message) {
    const group = input.closest(".form-group");
    if (!group) return;
    group.classList.add("has-error");
    input.classList.add("error");
    let errorElem = group.querySelector(".form-error-msg");
    if (!errorElem) {
      errorElem = document.createElement("div");
      errorElem.className = "form-error-msg";
      group.appendChild(errorElem);
    }
    errorElem.textContent = message;
  }

  function clearError(input) {
    const group = input.closest(".form-group");
    if (!group) return;
    group.classList.remove("has-error");
    input.classList.remove("error");
  }

  // Form Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // 1. Name validation
    const nameInput = document.getElementById("fullName");
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, "Please enter your full name (at least 2 characters).");
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // 2. Phone validation (Indian 10-digit number)
    const phoneInput = document.getElementById("phoneNumber");
    const phoneVal = phoneInput.value.replace(/[\s-]/g, "");
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneVal)) {
      showError(phoneInput, "Please enter a valid 10-digit Indian mobile number (e.g. 9415516588).");
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    // 3. Service Type
    if (!serviceSelect.value) {
      showError(serviceSelect, "Please select the service type.");
      isValid = false;
    } else {
      clearError(serviceSelect);
    }

    // 4. Number of People Rule Validation
    const guestCount = parseInt(peopleInput.value, 10);
    const minRequired = getMinCountForService(serviceSelect.value);
    if (isNaN(guestCount) || guestCount < 1) {
      showError(peopleInput, "Please enter the number of people.");
      isValid = false;
    } else if (minRequired > 1 && guestCount < minRequired) {
      showError(peopleInput, `Minimum ${minRequired} people required for this service.`);
      isValid = false;
    } else {
      clearError(peopleInput);
    }

    // 5. Delivery Area in Lucknow
    const areaInput = document.getElementById("deliveryArea");
    if (!areaInput.value.trim()) {
      showError(areaInput, "Please specify your area/locality in Lucknow (e.g. Gomti Nagar, Aliganj).");
      isValid = false;
    } else {
      clearError(areaInput);
    }

    // Date
    const dateVal = dateInput.value || "To be discussed";
    const messageVal = document.getElementById("customMessage")?.value.trim() || "None";

    if (!isValid) {
      // Focus on first error
      const firstError = form.querySelector(".form-control.error");
      if (firstError) firstError.focus();
      return;
    }

    // Map service label
    const serviceLabels = {
      wedding: "Wedding Catering Packages & Engagement (Full-Service)",
      catering_20: "Food Catering for 20 People (Small Party)",
      catering_100: "Catering for 100 People (Mid-Size Banquet)",
      birthday: "Birthday Party Catering Services / Kids Birthday",
      office: "Office Party Catering & Corporate Luncheon",
      catering: "Pure Veg Party / Event Catering (Min 10 People)",
      bulk: "Bulk Food Order Lucknow (Min 10 Packs)",
      tiffin: "Daily / Regular Pure Veg Tiffin Service",
      other: "Custom Pooja Bhojan / Full-Service Catering"
    };
    const serviceLabel = serviceLabels[serviceSelect.value] || serviceSelect.value;

    // Compose formatted WhatsApp text
    const waText = 
      `*New Enquiry - Preeti's Kitchen (Lucknow)*\n\n` +
      `• *Name:* ${nameInput.value.trim()}\n` +
      `• *Contact:* ${phoneVal}\n` +
      `• *Service:* ${serviceLabel}\n` +
      `• *Number of People:* ${guestCount}\n` +
      `• *Preferred Date:* ${dateVal}\n` +
      `• *Lucknow Area:* ${areaInput.value.trim()}\n` +
      `• *Food Preference:* 100% Pure Vegetarian (Strict)\n` +
      `• *Notes/Details:* ${messageVal}\n\n` +
      `_I would like to check availability and discuss menu options for Lucknow._`;

    const encodedText = encodeURIComponent(waText);
    const waUrl = `https://wa.me/919415516588?text=${encodedText}`;

    // Display confirmation & disclaimer notice
    if (resultNotice) {
      resultNotice.style.display = "block";
      resultNotice.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Open WhatsApp in a new tab
    window.open(waUrl, "_blank", "noopener,noreferrer");
  });
});
