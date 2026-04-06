// ===== Theme Toggle =====
(function () {
  const THEME_KEY = "portfolio-theme";

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);

    const toggleBtn = document.querySelector(".theme-toggle");
    if (toggleBtn) {
      toggleBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  // Set theme before paint to avoid flash
  setTheme(getPreferredTheme());

  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.querySelector(".theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        const current =
          document.documentElement.getAttribute("data-theme") || "light";
        setTheme(current === "dark" ? "light" : "dark");
      });
    }

    // ===== Mobile Nav Toggle =====
    const navToggle = document.querySelector(".nav-toggle");
    const navList = document.querySelector(".main-nav ul");
    const navOverlay = document.querySelector(".nav-overlay");

    if (navToggle && navList) {
      navToggle.addEventListener("click", function () {
        const isOpen = navList.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen);
        if (navOverlay) navOverlay.classList.toggle("open", isOpen);

        if (isOpen) {
          // Focus first link
          const firstLink = navList.querySelector("a");
          if (firstLink) firstLink.focus();
        }
      });

      if (navOverlay) {
        navOverlay.addEventListener("click", function () {
          navList.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          navOverlay.classList.remove("open");
          navToggle.focus();
        });
      }

      // Close on Escape
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && navList.classList.contains("open")) {
          navList.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          if (navOverlay) navOverlay.classList.remove("open");
          navToggle.focus();
        }
      });
    }

    // ===== Intersection Observer for fade-in =====
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach(function (el) {
      observer.observe(el);
    });
  });

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (e) {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
})();
