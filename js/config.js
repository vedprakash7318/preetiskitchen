/**
 * Preeti's Kitchen - Central Configuration
 * Pure Vegetarian Catering, Tiffin & Bulk Food Orders
 * Serving Lucknow, Uttar Pradesh, India
 */

const SITE_CONFIG = {
  businessName: "Preeti's Kitchen",
  tagline: "Pure Vegetarian Catering & Tiffin Services in Lucknow",
  phone: "9415516588",
  phoneFormatted: "+91 94155 16588",
  whatsappNumber: "919415516588",
  callUrl: "tel:+919415516588",
  whatsappUrl: "https://wa.me/919415516588",
  serviceArea: "All areas of Lucknow (subject to confirmation)",
  locationCity: "Lucknow",
  locationState: "Uttar Pradesh",
  locationCountry: "India",
  foodType: "100% Pure Vegetarian",
  
  // Order Rules
  cateringMinPeople: 10,
  bulkOrderMinPeople: 10,
  tiffinMinPeople: 1, // Tiffin orders do not require a 10-person minimum
  
  // Base Production URL (Configurable)
  baseUrl: "https://preetiskitchenlucknow.com",

  // Theme Colors
  theme: {
    bgIvory: "#F8F5ED",
    herbGreen: "#526B4D",
    terracotta: "#D99A64",
    charcoal: "#292A25",
    white: "#FFFFFF"
  }
};

// Expose globally for vanilla JS compatibility
if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
}
