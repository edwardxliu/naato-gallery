import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
// Only clear the generated directory inside this repository.
if (dirname(output) !== root || basename(output) !== 'dist') throw new Error('Unsafe output path');
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(join(root, 'public'), output, {
  recursive: true,
  filter: (source) => basename(source) !== '.DS_Store',
});

const names = { elle: 'life', esquire: 'objects', 'elle-intro': 'life-intro', 'esquire-intro': 'objects-intro' };
let pages = 0;
function copyPages(directory, segments = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name);
    if (entry.isDirectory()) copyPages(source, [...segments, entry.name]);
    else if (entry.name === 'index.html') {
      const mapped = segments.map((segment, index) => index === 0 ? names[segment] || segment : segment);
      const destination = join(output, ...mapped);
      mkdirSync(destination, { recursive: true });
      cpSync(source, join(destination, 'index.html'));
      pages++;
    }
  }
}
copyPages(join(root, 'mirror'));
console.log(`Built ${pages} pages and public assets in dist/`);
