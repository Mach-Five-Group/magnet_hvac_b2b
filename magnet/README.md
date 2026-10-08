# Blackhawk product guide

This prospect demo embeds a real, hosted Mach Five Magnet under the Blackhawk Supply managed client in the Mach Five Marketing portfolio. The installation is restricted to `mach-five-group.github.io` and uses example capture mode.

## Behavior

The guide routes visitors through HVAC & Controls, Plumbing, Electrical, a job-based “Help me choose” path, or part-number search. It covers every leaf collection in the supplied taxonomy, using at most six choices per question. Previous answers remain in conversation bubbles; Back allows changing a choice. Each result links to the corresponding Blackhawk collection.

Recommendations are category-level guidance. This version does not infer exact part compatibility, stock or current pricing, and does not collect contact details or send prospect emails. The existing storefront product cards remain illustrative page content.

## Source of truth

`public/assets/categories.json` is the supplied taxonomy. Run `npm run guide:build` to regenerate `magnet/definition.json` and the coverage manifest, then `npm test`. The generated definition is published to the client's standard Magnet message; changing the JSON in this repository alone does not update that hosted record. The native builder can edit the hosted copy; reconcile those changes before regenerating.

- Client: `72eed9d4-06f5-4310-b038-00374b66b2a7`
- Installation: `037f06d2-a862-414d-ac5b-44db4ee5bb85`
- Message: `1e863175-5728-41e1-9980-989408d670f2`
- Page slot: `[data-m5m-inline]`

These are public identifiers, not credentials. No runtime fork, new question type, general library entry, or global customer migration is required for this prospect-specific example.

## Verification

`npm test` checks complete taxonomy coverage, unique and reachable steps, valid routing, bounded choices and Blackhawk-only destination links. `npm run build` builds the landing page. Check the served embed after publishing, including Back, More categories, terminal collection links and a narrow viewport. The existing GitHub Actions workflow builds main and publishes dist to gh-pages.
