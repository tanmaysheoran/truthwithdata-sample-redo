// Package only browser runtime files for deployment to any static host.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js', 'site-config.js', 'article-content.js', 'currency.js', 'grainient.js', 'assets'];
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of files) fs.cpSync(path.join(root, file), path.join(output, file), { recursive: true });
console.log('Static HTML site ready in dist/ — no server runtime required.');
