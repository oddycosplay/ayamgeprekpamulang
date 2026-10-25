import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const distDir = path.join(projectRoot, 'dist');
const htmlPath = path.join(distDir, 'index.html');
const outputPath = path.join(projectRoot, 'bundle.html');

if (!fs.existsSync(htmlPath)) {
  console.error('❌ dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

// Find and inline CSS
const cssMatch = htmlContent.match(/<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/([^"]+)">/);
if (cssMatch) {
  const cssFileName = cssMatch[1];
  const cssFilePath = path.join(distDir, 'assets', cssFileName);
  if (fs.existsSync(cssFilePath)) {
    let cssContent = fs.readFileSync(cssFilePath, 'utf-8');

    // Compatibility fixes for older browsers and CSS linters
    cssContent = cssContent
      .replaceAll('-webkit-text-size-adjust:100%;', '')
      .replaceAll('text-size-adjust:100%;', '')
      .replaceAll('vertical-align:middle;display:block', 'display:block')
      .replaceAll('-webkit-line-clamp:1;', '-webkit-line-clamp:1;line-clamp:1;')
      .replaceAll('-webkit-line-clamp:2;', '-webkit-line-clamp:2;line-clamp:2;')
      .replaceAll('-webkit-line-clamp:4;', '-webkit-line-clamp:4;line-clamp:4;')
      .replace(/oklab\(37\.4474% \.120738 \.0557226\/([0-9.]+)\)/g, 'rgba(120, 21, 25, $1)')
      .replace(/oklab\(84\.1944% -\.0012635 \.168374\/([0-9.]+)\)/g, 'rgba(245, 197, 24, $1)')
      .replace(/oklab\(31\.3925% \.102279 \.0481237\/([0-9.]+)\)/g, 'rgba(94, 13, 16, $1)')
      .replace(/oklab\(97\.9827% \.00091666 \.00442588\/([0-9.]+)\)/g, 'rgba(250, 248, 245, $1)')
      .replaceAll('oklab(84.1944% -.0012635 .168374/.15)', 'rgba(245, 197, 24, 0.15)')
      .replaceAll('scrollbar-width:none;', '')
      .replaceAll('scrollbar-width:none', '');

    htmlContent = htmlContent.replace(
      cssMatch[0],
      () => `<style>\n${cssContent}\n</style>`
    );
    console.log(`✅ Inlined CSS: assets/${cssFileName} (${(cssContent.length / 1024).toFixed(1)} KB)`);
  }
}

// Find and inline JS
const jsMatch = htmlContent.match(/<script\s+type="module"\s+crossorigin\s+src="\/assets\/([^"]+)"><\/script>/);
if (jsMatch) {
  const jsFileName = jsMatch[1];
  const jsFilePath = path.join(distDir, 'assets', jsFileName);
  if (fs.existsSync(jsFilePath)) {
    let jsContent = fs.readFileSync(jsFilePath, 'utf-8');
    // Rewrite relative imports so they resolve to /assets/ when script is inlined in root HTML
    jsContent = jsContent.replaceAll('from"./', 'from"/assets/');
    htmlContent = htmlContent.replace(
      jsMatch[0],
      () => `<script type="module">\n${jsContent}\n</script>`
    );
    console.log(`✅ Inlined JS: assets/${jsFileName} (${(jsContent.length / 1024).toFixed(1)} KB)`);
  }
}

fs.writeFileSync(outputPath, htmlContent, 'utf-8');
const stats = fs.statSync(outputPath);
console.log(`\n🎉 bundle.html successfully created!`);
console.log(`📄 Path: ${outputPath}`);
console.log(`📦 Size: ${(stats.size / 1024).toFixed(1)} KB`);
