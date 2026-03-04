const FORM_URL = "https://example.com";
const DISCORD_INVITE_URL = "https://discord.gg/ZgydMte5SW";
const CONTACT_EMAIL = "contact.sksadventures@gmail.com";
const SAFETY_URL = FORM_URL;
const DISCORD_HANDLE = "YourDiscordHere";

const isPlaceholderUrl = (url) => url === "https://example.com";

function setDisabledLink(link, disabled) {
  if (!link) return;
  if (disabled) {
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("tabindex", "-1");
  } else {
    link.removeAttribute("aria-disabled");
    link.removeAttribute("tabindex");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1700);
}

function wireSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function configureLinks() {
  const applyLinks = document.querySelectorAll(".js-apply-link, .js-waitlist-link");
  const discordLinks = document.querySelectorAll(".js-discord-link");
  const warningPill = document.getElementById("form-warning");
  const safetyLink = document.getElementById("safety-link");
  const contactLink = document.getElementById("contact-link");
  const handleDisplay = document.getElementById("discord-handle-display");

  const formNotSet = isPlaceholderUrl(FORM_URL);
  const discordNotSet = isPlaceholderUrl(DISCORD_INVITE_URL);

  applyLinks.forEach((link) => {
    link.setAttribute("href", FORM_URL);
    setDisabledLink(link, formNotSet);
  });

  if (warningPill) {
    warningPill.hidden = !formNotSet;
  }

  discordLinks.forEach((link) => {
    link.setAttribute("href", DISCORD_INVITE_URL);
    setDisabledLink(link, discordNotSet);
  });

  if (safetyLink) {
    safetyLink.setAttribute("href", SAFETY_URL);
  }

  if (contactLink) {
    contactLink.setAttribute("href", CONTACT_EMAIL);
  }

  if (handleDisplay) {
    handleDisplay.textContent = `Discord: ${DISCORD_HANDLE}`;
  }
}

function wireCopyHandle() {
  const copyBtn = document.getElementById("copy-discord");
  if (!copyBtn) return;

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(DISCORD_HANDLE);
      showToast("Discord handle copied.");
    } catch {
      showToast("Could not copy automatically.");
    }
  });
}

wireSmoothScroll();
configureLinks();
wireCopyHandle();
