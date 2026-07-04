/**
 * js/app.js
 * Main application script. Handles navigation, interactivity,
 * form validation, scroll-based animations, and toast notifications.
 */

import { submitContactForm } from "./firebase.js";

// ==========================================================================
// DOM Elements
// ==========================================================================
const header = document.querySelector(".navbar-header");
const navToggle = document.querySelector(".nav-toggle");
const mobileNavDrawer = document.querySelector(".mobile-nav-drawer");
const navOverlay = document.getElementById("nav-overlay");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
const desktopNavLinks = document.querySelectorAll(".nav-link");
const backToTopBtn = document.getElementById("back-to-top");
const toastContainer = document.getElementById("toast-container");

// Form Elements
const contactForm = document.getElementById("contact-form");
const formName = document.getElementById("form-name");
const formEmail = document.getElementById("form-email");
const formSubject = document.getElementById("form-subject");
const formMessage = document.getElementById("form-message");
const submitBtn = document.getElementById("submit-btn");
const messageCharCount = document.getElementById("message-char-count");

// ==========================================================================
// Navigation & Mobile Menu Logic
// ==========================================================================

/**
 * Toggles the mobile menu drawer state
 * @param {boolean} forceClose - if true, forces the menu to close
 */
function toggleMobileMenu(forceClose = false) {
    const isOpened = mobileNavDrawer.classList.contains("open");
    const shouldOpen = forceClose ? false : !isOpened;

    if (shouldOpen) {
        mobileNavDrawer.classList.add("open");
        navOverlay.classList.add("open");
        navToggle.classList.add("open");
        navToggle.setAttribute("aria-expanded", "true");
        mobileNavDrawer.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
        mobileNavDrawer.classList.remove("open");
        navOverlay.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        mobileNavDrawer.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Re-enable background scroll
    }
}

// Click events for hamburger and overlay
navToggle.addEventListener("click", () => toggleMobileMenu());
navOverlay.addEventListener("click", () => toggleMobileMenu(true));

// Close mobile menu when a drawer link is clicked
mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => toggleMobileMenu(true));
});

// Sticky header shrink state on scroll
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

// ==========================================================================
// Smooth Scroll & Hash Link Management
// ==========================================================================

// Intercept clicks on links that are anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        
        // Skip links and links with only #
        if (targetId === "#" || this.classList.contains("skip-link")) return;

        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Account for header offset height
            const headerOffset = header.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Update URL hash without jumping
            history.pushState(null, null, targetId);
        }
    });
});

// ==========================================================================
// Scroll Active Link Observer
// ==========================================================================

// Track the current section and update nav elements
const sections = document.querySelectorAll("section[id]");
const observerOptions = {
    root: null, // Viewport
    rootMargin: "-20% 0px -60% 0px", // Trigger when section occupies mid-viewport
    threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("id");
            
            // Highlight Desktop Menu
            desktopNavLinks.forEach(link => {
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });

            // Highlight Mobile Menu
            mobileNavLinks.forEach(link => {
                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => navObserver.observe(section));

// ==========================================================================
// Scroll Reveal Animations
// ==========================================================================
const revealElements = document.querySelectorAll(".scroll-reveal");
const revealOptions = {
    root: null,
    rootMargin: "0px 0px -10% 0px", // Trigger slightly before element enters viewport
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            // Optional: stop observing once revealed
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(element => revealObserver.observe(element));

// ==========================================================================
// Back-to-Top Button
// ==========================================================================
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add("visible");
    } else {
        backToTopBtn.classList.remove("visible");
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// ==========================================================================
// Toast Notification Engine
// ==========================================================================

/**
 * Spawns a floating toast notification alert
 * @param {string} message - Text message content
 * @param {'success'|'error'} type - Style modifier key
 */
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "alert");

    // Icons mapped to types
    const successIcon = `<svg class="toast-icon success" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    const errorIcon = `<svg class="toast-icon error" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    const icon = type === "success" ? successIcon : errorIcon;

    toast.innerHTML = `
        ${icon}
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;

    toastContainer.appendChild(toast);

    // Event listener for manual close
    const closeBtn = toast.querySelector(".toast-close");
    closeBtn.addEventListener("click", () => {
        dismissToast(toast);
    });

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        dismissToast(toast);
    }, 4000);
}

/**
 * Animates and removes toast element
 * @param {HTMLElement} toast 
 */
function dismissToast(toast) {
    if (toast.classList.contains("toast-fade-out")) return;
    toast.classList.add("toast-fade-out");
    toast.addEventListener("animationend", (e) => {
        if (e.animationName === "toastOut") {
            toast.remove();
        }
    });
}

// ==========================================================================
// Contact Form Validation & Submission
// ==========================================================================

/**
 * Validates individual form inputs
 * @param {HTMLInputElement|HTMLTextAreaElement} input - Target input node
 * @param {HTMLElement} errorElement - Subtext element for errors
 * @param {string} customMsg - Fallback text context
 * @returns {boolean} - true if valid
 */
function validateInput(input, errorElement, customMsg = "") {
    let isValid = true;
    let errorMsg = "";

    // Trim content
    const value = input.value.trim();

    if (input.hasAttribute("required") && value === "") {
        isValid = false;
        errorMsg = customMsg || "This field is required.";
    } else if (input.type === "email" && value !== "") {
        // Regex format validator
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMsg = "Please enter a valid email address.";
        }
    }

    // Toggle validation visual states
    if (!isValid) {
        input.classList.add("input-error");
        errorElement.textContent = errorMsg;
        errorElement.classList.add("active");
    } else {
        input.classList.remove("input-error");
        errorElement.textContent = "";
        errorElement.classList.remove("active");
    }

    return isValid;
}

// Realtime validation triggers on input/blur
formName.addEventListener("blur", () => validateInput(formName, document.getElementById("name-error")));
formEmail.addEventListener("blur", () => validateInput(formEmail, document.getElementById("email-error")));
formSubject.addEventListener("blur", () => validateInput(formSubject, document.getElementById("subject-error")));
formMessage.addEventListener("blur", () => validateInput(formMessage, document.getElementById("message-error")));

// Message character counter
formMessage.addEventListener("input", () => {
    const remaining = formMessage.value.length;
    messageCharCount.textContent = `${remaining} / 1000`;
    
    // Warn style if getting close to limit
    if (remaining >= 900) {
        messageCharCount.style.color = "var(--color-error)";
    } else {
        messageCharCount.style.color = "";
    }
});

// Form submission handler
contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Run validation across all fields
    const isNameValid = validateInput(formName, document.getElementById("name-error"), "Name is required.");
    const isEmailValid = validateInput(formEmail, document.getElementById("email-error"), "Email address is required.");
    const isSubjectValid = validateInput(formSubject, document.getElementById("subject-error"), "Subject is required.");
    const isMessageValid = validateInput(formMessage, document.getElementById("message-error"), "Message details are required.");

    const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

    if (!isFormValid) {
        showToast("Please correct the errors in the form.", "error");
        return;
    }

    // Set Loading state
    submitBtn.disabled = true;
    const submitText = submitBtn.querySelector(".submit-text");
    const submit = submitBtn.querySelector(".submit");
    
    submitText.textContent = "Sending...";
    submit.hidden = false;

    // Disabling inputs
    formName.disabled = true;
    formEmail.disabled = true;
    formSubject.disabled = true;
    formMessage.disabled = true;

    try {
        const response = await submitContactForm(
            formName.value,
            formEmail.value,
            formSubject.value,
            formMessage.value
        );

        if (response.success) {
            showToast(response.message, "success");
            contactForm.reset();
            messageCharCount.textContent = "0 / 1000";
        } else {
            throw new Error(response.message || "Failed to deliver message.");
        }
    } catch (error) {
        console.error("Submission failed:", error);
        showToast(error.message || "An unexpected error occurred. Please try again later.", "error");
    } finally {
        // Reset button and inputs state
        submitBtn.disabled = false;
        submitText.textContent = "Send Message";
        submit.hidden = true;

        formName.disabled = false;
        formEmail.disabled = false;
        formSubject.disabled = false;
        formMessage.disabled = false;
    }
});

// Log loaded notification
console.log("App script loaded. Navigation, Validation, and Observers running.");
