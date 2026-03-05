const FORM_URL = "https://formsubmit.co/contact.sksadventures@gmail.com";
const DISCORD_INVITE_URL = "https://discord.gg/ZgydMte5SW";
const CONTACT_EMAIL = "contact.sksadventures@gmail.com";
const SAFETY_URL = "apply.html"; 
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
  const applyLinks = document.querySelectorAll(".js-apply-link");
  const waitlistLinks = document.querySelectorAll(".js-waitlist-link");
  const discordLinks = document.querySelectorAll(".js-discord-link");
  const warningPill = document.getElementById("form-warning");
  const safetyLink = document.getElementById("safety-link");
  const contactLink = document.getElementById("contact-link");
  const handleDisplay = document.getElementById("discord-handle-display");

  const formNotSet = isPlaceholderUrl(FORM_URL);
  const discordNotSet = isPlaceholderUrl(DISCORD_INVITE_URL);

  // Point main "Apply to Play" actions to the local application page
  applyLinks.forEach((link) => {
    link.setAttribute("href", "/sksadventures.github.io/apply.html");
    setDisabledLink(link, false);
  });

  // Keep waitlist links pointing at the configured form URL (disabled if unset)
  waitlistLinks.forEach((link) => {
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
    // contactLink should use a mailto: scheme
    contactLink.setAttribute("href", `mailto:${CONTACT_EMAIL}`);
  }

  if (handleDisplay) {
    handleDisplay.textContent = `Discord: ${DISCORD_HANDLE}`;
  }
}



function removeLegacyFeaturedArt() {
  const legacyShowcase = document.querySelector(".hero-showcase");
  if (!legacyShowcase) return;

  const legacyLayout = legacyShowcase.closest(".hero-layout");
  legacyShowcase.remove();
  if (legacyLayout) {
    legacyLayout.classList.remove("hero-layout");
  }
}

function removeLegacyArtPlaceholders() {
  const blockerText = ["Artwork preview", "add file to assets/images", "Featured Art", "Hand-picked pieces from your gallery"];
  const hero = document.getElementById("hero");
  if (!hero) return;

  hero.querySelectorAll("*").forEach((node) => {
    const text = node.textContent?.trim();
    if (!text) return;
    if (!blockerText.some((value) => text.includes(value))) return;

    const removable = node.closest("aside, figure, .card, .panel, .hero-showcase, .hero-art-card, .hero-art-grid");
    if (removable && removable !== hero) {
      removable.remove();
    }
  });
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
removeLegacyFeaturedArt();
removeLegacyArtPlaceholders();
