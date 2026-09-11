const CACHE_PREFIX = "commercehub-theme:";

function cacheKey() {
  return `${CACHE_PREFIX}${window.location.hostname}`;
}

// Only the properties store_themes actually controls are wired up here —
// primaryColor is stored for future use but has no utility class hooked to
// it yet in this design system (everything else uses raw black/white), so
// setting --store-primary alone won't change anything visible yet.
export function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement.style;
  if (theme.accentColor) root.setProperty("--color-accent", theme.accentColor);
  if (theme.backgroundColor) root.setProperty("--store-bg", theme.backgroundColor);
  if (theme.textColor) root.setProperty("--store-text", theme.textColor);
  if (theme.primaryColor) root.setProperty("--store-primary", theme.primaryColor);
  if (theme.fontFamily) root.setProperty("--store-font", `"${theme.fontFamily}", ui-sans-serif, system-ui, sans-serif`);
  if (theme.borderRadius) root.setProperty("--store-radius", theme.borderRadius);
}

export function applyCachedTheme() {
  try {
    const cached = localStorage.getItem(cacheKey());
    if (cached) applyTheme(JSON.parse(cached));
  } catch {
    /* no cache yet, or storage unavailable — fall through to defaults */
  }
}

export function cacheTheme(theme) {
  try {
    localStorage.setItem(cacheKey(), JSON.stringify(theme));
  } catch {
    /* storage unavailable (private browsing, quota, etc.) — non-fatal */
  }
}
