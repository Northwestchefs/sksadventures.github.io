const GALLERY_SECTIONS = [
  { key: "heroes", title: "Heroes" },
  { key: "castles", title: "Castles" },
  { key: "characters", title: "Characters" },
  { key: "locations", title: "Locations" },
  { key: "monsters", title: "Monsters" },
  { key: "gallery", title: "Gallery" }
];

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];
const CACHE_MAX_AGE_MS = 1000 * 60 * 60;

const galleryRoot = document.getElementById("gallery-root");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeButton = lightbox.querySelector(".lightbox-close");
const prevButton = lightbox.querySelector(".lightbox-prev");
const nextButton = lightbox.querySelector(".lightbox-next");

const allImages = [];
let activeIndex = 0;

function titleCaseFromFilename(fileName) {
  const base = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
  if (!base) return "Fantasy artwork";
  return base
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getRepoInfo() {
  const hostParts = window.location.hostname.split(".");
  const pathParts = window.location.pathname.split("/").filter(Boolean);

  if (hostParts.length >= 3 && hostParts[1] === "github" && hostParts[2] === "io") {
    const owner = hostParts[0];
    const repo = pathParts[0] || `${owner}.github.io`;
    return { owner, repo };
  }

  if (pathParts.length >= 2) {
    return { owner: pathParts[0], repo: pathParts[1] };
  }

  return null;
}

function getCachedCategory(repoInfo, category) {
  const cacheKey = `gallery-cache:${repoInfo.owner}/${repoInfo.repo}:${category}`;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;

    const payload = JSON.parse(raw);
    if (!payload || !Array.isArray(payload.images) || typeof payload.cachedAt !== "number") {
      return null;
    }

    if (Date.now() - payload.cachedAt > CACHE_MAX_AGE_MS) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return payload.images;
  } catch {
    return null;
  }
}

function setCachedCategory(repoInfo, category, images) {
  const cacheKey = `gallery-cache:${repoInfo.owner}/${repoInfo.repo}:${category}`;
  try {
    const payload = {
      cachedAt: Date.now(),
      images
    };
    localStorage.setItem(cacheKey, JSON.stringify(payload));
  } catch {
    // Ignore localStorage quota/privacy mode errors.
  }
}

async function listCategoryImages(category) {
  const repoInfo = getRepoInfo();

  if (!repoInfo) {
    return [];
  }

  const cached = getCachedCategory(repoInfo, category);
  if (cached) {
    return cached;
  }

  const apiUrl = `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/assets/images/${category}`;
  const response = await fetch(apiUrl, {
    headers: { Accept: "application/vnd.github+json" }
  });

  if (!response.ok) {
    return [];
  }

  const files = await response.json();
  if (!Array.isArray(files)) {
    return [];
  }

  const images = files
    .filter((file) => file.type === "file")
    .map((file) => file.name)
    .filter((name) => IMAGE_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext)))
    .sort((a, b) => a.localeCompare(b));

  setCachedCategory(repoInfo, category, images);
  return images;
}

function openLightbox(index) {
  activeIndex = index;
  const activeImage = allImages[activeIndex];
  if (!activeImage) return;

  lightboxImage.src = activeImage.src;
  lightboxImage.alt = activeImage.alt;
  lightboxCaption.textContent = activeImage.alt;

  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
}

function shiftLightbox(step) {
  if (!allImages.length) return;
  activeIndex = (activeIndex + step + allImages.length) % allImages.length;
  openLightbox(activeIndex);
}

function buildImageCard(src, alt, globalIndex) {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  image.decoding = "async";
  image.fetchPriority = "low";
  image.addEventListener("click", () => openLightbox(globalIndex));
  return image;
}

function buildSectionSkeleton(section) {
  const sectionEl = document.createElement("section");
  sectionEl.className = "gallery-section";

  const heading = document.createElement("h2");
  heading.textContent = section.title;

  const loading = document.createElement("p");
  loading.className = "muted gallery-empty";
  loading.textContent = "Loading artwork...";

  sectionEl.append(heading, loading);
  galleryRoot.append(sectionEl);
  return sectionEl;
}

function renderSection(sectionEl, section, fileNames) {
  const statusEl = sectionEl.querySelector(".gallery-empty");
  if (statusEl) {
    statusEl.remove();
  }

  if (!fileNames.length) {
    const empty = document.createElement("p");
    empty.className = "muted gallery-empty";
    empty.textContent = `No artwork found in assets/images/${section.key} yet.`;
    sectionEl.append(empty);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "gallery-grid";

  for (const fileName of fileNames) {
    const src = `assets/images/${section.key}/${fileName}`;
    const alt = titleCaseFromFilename(fileName);
    const globalIndex = allImages.push({ src, alt }) - 1;
    grid.append(buildImageCard(src, alt, globalIndex));
  }

  sectionEl.append(grid);
}

async function renderGallery() {
  galleryRoot.innerHTML = "";
  allImages.length = 0;

  const sectionNodes = new Map();
  for (const section of GALLERY_SECTIONS) {
    sectionNodes.set(section.key, buildSectionSkeleton(section));
  }

  await Promise.all(
    GALLERY_SECTIONS.map(async (section) => {
      const sectionEl = sectionNodes.get(section.key);
      const fileNames = await listCategoryImages(section.key);
      renderSection(sectionEl, section, fileNames);
    })
  );
}

closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", () => shiftLightbox(-1));
nextButton.addEventListener("click", () => shiftLightbox(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") shiftLightbox(-1);
  if (event.key === "ArrowRight") shiftLightbox(1);
});

renderGallery();
