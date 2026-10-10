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
    const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
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
    const jsContent = fs.readFileSync(jsFilePath, 'utf-8');
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
