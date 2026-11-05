// Builds the live view into one self-contained page: React, Astryx and all CSS are inlined,
// because published Claude pages only load scripts from a few CDNs and stylesheets from Google Fonts.
import {build} from 'esbuild';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const css = async (spec) => readFile(require.resolve(spec), 'utf8');

const result = await build({
  entryPoints: ['src/main.jsx'],
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
]
  .join('\n')
  .replace(/<\/style/gi, '<\\/style');

const page = `<title>Live OST view</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap">
<style>
${styles}
</style>
<div id="root"></div>
<script>
${js}
</script>
`;

await mkdir('dist', {recursive: true});
await writeFile('dist/live-view.html', page);
console.log(`dist/live-view.html: ${(page.length / 1024).toFixed(0)} KB`);
