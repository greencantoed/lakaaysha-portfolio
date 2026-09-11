# Lakaaysha van Ewijk — portfolio

Public website: https://lakaaysha.com/

The current published site is in `portfolio/`. Netlify runs `node prepare.mjs` from that directory and publishes `portfolio/dist`.

The site contains the film homepage, eight project pages, the writing/contact page, 40 film stills and the complete 58-second silent showreel. It uses self-hosted Newsreader and Manrope fonts and an optional animated cursor.

## Editing

Edit facts in `portfolio/content.json` and run `python portfolio/build_site.py` to regenerate the HTML. Edit presentation and interactions in `portfolio/dist/style.css` and `portfolio/dist/app.js`. Run `node portfolio/prepare.mjs` before serving `portfolio/dist` with a static server.

The showreel's source is stored in ordered binary fragments under `portfolio/reel-source` because the connector used for source delivery limits individual uploads. The build assembles them into a normal MP4 and validates its SHA-256 before publication. Fragments are outside the published directory. Visitors receive the complete optimized MP4 with normal browser video controls.

The root React source is retained for reference to the earlier design. The Netlify configuration selects the current portfolio directory explicitly. Previous published versions are recoverable through Git history.
