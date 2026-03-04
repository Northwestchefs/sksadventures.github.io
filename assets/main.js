// Core configuration for contact and signup links.
const FORM_URL = "https://example.com";
const DISCORD_INVITE_URL = "https://example.com";
const CONTACT_EMAIL = "mailto:example@example.com";

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "mailto:";
  } catch {
    return false;
  }
};

const setHref = (id, url) => {
  const el = document.getElementById(id);
  if (el) el.setAttribute("href", url);
};

const setFormLinks = () => {
  const status = document.getElementById("form-url-status");
  const formIsConfigured = isValidUrl(FORM_URL) && !FORM_URL.includes("example.com");

  if (!formIsConfigured) {
    // Fallback behavior: send visitors to the Apply section so the button always does something useful.
    ["apply-link-hero", "waitlist-link-hero", "footer-apply-link"].forEach((id) => {
      setHref(id, "#apply");
    });

    if (status) {
      status.textContent = "Apply buttons currently jump to the Apply section. Set FORM_URL in assets/main.js to open your live form.";
    }
    return;
  }

  ["apply-link-hero", "waitlist-link-hero", "apply-link-section", "footer-apply-link"].forEach((id) => {
    setHref(id, FORM_URL);
  });

  if (status) {
    status.textContent = "Applications are open.";
  }
};

const setContactLinks = () => {
  if (isValidUrl(DISCORD_INVITE_URL)) {
    setHref("discord-link", DISCORD_INVITE_URL);
  }

  if (isValidUrl(CONTACT_EMAIL)) {
    setHref("footer-contact-link", CONTACT_EMAIL);
  }
};

const setupCopyDiscordHandle = () => {
  const button = document.getElementById("copy-discord-handle");
  const copyStatus = document.getElementById("copy-status");
  if (!button || !navigator.clipboard) return;

  button.addEventListener("click", async () => {
    const handle = button.dataset.handle || "";
    try {
      await navigator.clipboard.writeText(handle);
      if (copyStatus) copyStatus.textContent = `Copied ${handle}`;
    } catch {
      if (copyStatus) copyStatus.textContent = "Copy failed. Please copy manually.";
    }
  });
};

const setupSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

const setCurrentYear = () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
};

setFormLinks();
setContactLinks();
setupCopyDiscordHandle();
setupSmoothScroll();
setCurrentYear();
