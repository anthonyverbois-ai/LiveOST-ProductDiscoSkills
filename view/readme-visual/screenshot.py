"""Takes the README image from the built page: python3 readme-visual/screenshot.py, run from view/.

Needs Playwright (pip install playwright, then playwright install chromium). When Google Fonts cannot be
reached, pass a folder holding the Figtree woff2 files (for example from the @fontsource/figtree npm package):
python3 readme-visual/screenshot.py --fonts <folder>.
"""
import argparse
import pathlib

from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent.parent / 'docs' / 'img' / 'how-it-works.png'

parser = argparse.ArgumentParser()
parser.add_argument('--fonts', help='folder with figtree-latin-<weight>-normal.woff2 files')
args = parser.parse_args()

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800}, device_scale_factor=2)
    if args.fonts:
        fonts = pathlib.Path(args.fonts)
        faces = ''.join(
            f"@font-face{{font-family:'Figtree';font-weight:{w};font-style:normal;"
            f"src:url(https://local.fonts/figtree-{w}.woff2) format('woff2');}}"
            for w in (400, 500, 600, 700)
        )
        page.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body=faces, content_type='text/css'))
        page.route(
            'https://local.fonts/**',
            lambda r: r.fulfill(
                body=(fonts / f"figtree-latin-{r.request.url.split('-')[-1].split('.')[0]}-normal.woff2").read_bytes(),
                content_type='font/woff2',
            ),
        )
    page.goto((HERE / 'how-it-works.html').as_uri())
    page.wait_for_function('document.fonts.ready.then(() => true)')
    page.wait_for_timeout(500)
    page.locator('#visual').screenshot(path=str(OUT))
    browser.close()
print(OUT)
