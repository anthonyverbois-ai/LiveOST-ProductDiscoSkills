// Builds the README image as one self-contained page, the same way build.mjs builds the visual tree:
// React, Astryx, the neutral theme and the visual tree's styles, inlined. Run from view/: node readme-visual/build.mjs
import {build} from 'esbuild';
import {readFile, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const css = async (spec) => readFile(require.resolve(spec), 'utf8');

const result = await build({
  entryPoints: ['readme-visual/main.jsx'],
  bundle: true,
  minify: true,
  write: false,
  format: 'iife',
  jsx: 'automatic',
  target: 'es2020',
  define: {'process.env.NODE_ENV': '"production"'},
  logLevel: 'warning',
});

const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const styles = [
  await css('@astryxdesign/core/reset.css'),
  await css('@astryxdesign/core/astryx.css'),
  await css('@astryxdesign/theme-neutral/theme.css'),
  await readFile('src/styles.css', 'utf8'),
  await readFile('readme-visual/styles.css', 'utf8'),
]
  .join('\n')
  .replace(/<\/style/gi, '<\\/style');

const page = `<!doctype html>
<meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap">
<style>
${styles}
</style>
<div id="root"></div>
<script>
${js}
</script>
`;

await writeFile('readme-visual/how-it-works.html', page);
console.log('readme-visual/how-it-works.html');
