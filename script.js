
"use strict";

/*
  HANNAN.DEV
  Portfolio by Abdul Hannan Kandhir
*/

// ELEMENTS
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");
const copyEmailButton = document.getElementById("copyEmail");
const toast = document.getElementById("toast");

const EMAIL = "hannankandhir123@gmail.com";
const THEME_KEY = "hannan_portfolio_theme_v2";

let toastTimer;

// STORAGE
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Website works even if storage is blocked.
  }
}

// THEME
function applyTheme(theme) {
  const selected = theme === "light" ? "light" : "dark";

  document.documentElement.dataset.theme = selected;

  themeToggle.textContent = selected === "dark" ? "☀" : "☾";

  themeToggle.setAttribute(
    "aria-label",
    selected === "dark"
      ? "Switch to light mode"
      : "Switch to dark mode"
  );

  const meta = document.querySelector(
    'meta[name="theme-color"]'
  );

  if (meta) {
    meta.content = selected === "dark"
      ? "#080d19"
      : "#f6f8fc";
  }

  saveStorage(THEME_KEY, selected);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  applyTheme(current === "dark" ? "light" : "dark");
});

// MOBILE MENU
function closeMenu() {
  navMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation"
  );
});

navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.addEventListener("click", event => {
  if (
    !navMenu.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});

// PROJECT FILTERS
function filterProjects(category) {
  filterButtons.forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  projectCards.forEach(card => {
    card.hidden =
      category !== "all" &&
      card.dataset.category !== category;
  });
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterProjects(button.dataset.filter);
  });
});

// SECTION REVEAL ANIMATIONS
function setupRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (
    reducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    elements.forEach(element => {
      element.classList.add("visible");
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: "0px 0px -20px 0px"
  });

  elements.forEach(element => observer.observe(element));
}

// NAVIGATION HIGHLIGHT
function setupNavigationHighlight() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-menu a");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;

      links.forEach(link => {
        const active = link.getAttribute("href") === "#" + id;
        link.classList.toggle("active", active);

        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, {
    rootMargin: "-15% 0px -65% 0px",
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

// NOTIFICATIONS
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// COPY EMAIL
async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const area = document.createElement("textarea");

  area.value = value;
  area.style.position = "fixed";
  area.style.opacity = "0";

  document.body.append(area);
  area.select();

  const successful = document.execCommand("copy");

  area.remove();

  if (!successful) {
    throw new Error("Copy failed");
  }
}

copyEmailButton.addEventListener("click", async () => {
  try {
    await copyText(EMAIL);
    showToast("Email address copied!");
  } catch {
    showToast("Copy failed. Please select the email manually.");
  }
});

// CURRENT YEAR
document.getElementById("year").textContent =
  new Date().getFullYear();

// START
applyTheme(readStorage(THEME_KEY) || "dark");
filterProjects("all");
setupRevealAnimations();
setupNavigationHighlight();
