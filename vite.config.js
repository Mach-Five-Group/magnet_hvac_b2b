// GitHub Pages serves a project site from /<repo>/, not from the domain root.
// Without this base, every asset URL is absolute from / and the deployed page
// loads blank — the single most common Vite-on-Pages failure.
// A custom domain serving from root would use base: '/' instead.
export default {
  base: process.env.PAGES_BASE ?? '/magnet_hvac_b2b/'
};
