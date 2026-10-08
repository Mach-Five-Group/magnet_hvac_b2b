# magnet_hvac_b2b
Targeted Prospect Collateral

Static demo that hosts a dynamic magnet (to be added). Built with Vite and
deployed to GitHub Pages on every push to `main`.

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # outputs dist/
npm run preview  # serve the built dist/ locally
```

## Deploy

Push to `main`. The workflow in
[.github/workflows/deploy.yml](.github/workflows/deploy.yml) runs `npm ci &&
npm run build` and force-publishes `dist/` to the `gh-pages` branch. The site
is served at <https://mach-five-group.github.io/magnet_hvac_b2b/>.

One-time repo setup: **Settings → Pages → Source: Deploy from a branch →
`gh-pages` / `(root)`**. The first workflow run creates the branch.

`vite.config.js` sets `base: '/magnet_hvac_b2b/'` so asset URLs resolve under
the project Pages path. Override with the `PAGES_BASE` env var (e.g. `/` for a
custom domain).
