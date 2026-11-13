# The README image

`docs/img/how-it-works.png`, at the top of the repository's README, is drawn with the same components, theme and card styles as the visual tree (Astryx, neutral theme, `src/styles.css`). Every name, account and number in it is fictional.

To change it, edit `main.jsx` or `styles.css` in this folder, then, from `view/`:

1. `npm ci`, once.
2. `node readme-visual/build.mjs`: builds `readme-visual/how-it-works.html`, which is not committed.
3. `python3 readme-visual/screenshot.py`: saves the image at twice its size, for sharp text. It needs Playwright (`pip install playwright`, then `playwright install chromium`). Where Google Fonts cannot be reached, add `--fonts <folder>` with the Figtree woff2 files, for example those of the `@fontsource/figtree` npm package.
