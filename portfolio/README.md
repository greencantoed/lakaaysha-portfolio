# Lakaaysha van Ewijk — standalone portfolio

Revised portfolio, 11 September 2026. Newsreader typography, a film cursor with a soft glow, and a fading ink trail in Writing.

Public website: https://lakaaysha.com/

Private preview: https://lakaaysha-worlds.kaayardo.chatgpt.site

## Open the standalone

Extract the archive and open `dist/index.html`. All film images, fonts and the showreel are included. External press, social and email links open their existing destinations.

The site contains the film home, eight project pages, a writing identity page and a not-found page. The writing page includes the artist's identity, contact/social links, and Queerantine's confirmed Wattys 2026 Wildcard shortlist recognition. The announcement links to the official Wattpad shortlist and the story; it also appears in the homepage press and recognition list. Edit this announcement in the `writingRecognition` record in `content.json`.

## Edit

Edit portfolio facts in `content.json`. `media-map.json` maps source image paths to local optimized assets. Run `python build_site.py` to regenerate the HTML. Presentation and behavior are in `dist/style.css` and `dist/app.js`.

This is a plain static site with no installation or build dependencies. On Netlify or another static host, publish `dist`. The included `.openai/hosting.json` identifies the separate private review Site; it contains no credentials. The public deployment is maintained through `greencantoed/lakaaysha-portfolio` and its existing Netlify connection.

Cursor animation respects reduced-motion and touch-device preferences. The footer switch saves the visitor's preference locally. Gallery controls support keyboard navigation, Escape, focus return and touch swipes.

## Content and fonts

Film titles and media are from https://lakaaysha.com/ and https://github.com/greencantoed/lakaaysha-portfolio . The 7+1 joint directing credit is confirmed by https://www.insciencefestival.nl/nl/vertoning/cinepoems/ . All creative works remain their creators' property.

The original full 58-second silent reel is included in optimized form. Individual film viewing destinations were absent from the original records, so project pages provide stills and verified credits/press links without inventing screening links or descriptions.

Manrope, DM Sans and Newsreader fonts are self-hosted; their licenses are included in `dist/fonts`. Public pages use canonical URLs and a sitemap for lakaaysha.com. The private preview is protected by its separate owner-only access policy.
