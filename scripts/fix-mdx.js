import fs from 'fs';
import { glob } from 'glob';

const docsDir = 'documentation/docs/api-specification/';

const files = await glob(`${docsDir}**/*.md`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<(boolean|string|number|void|any|undefined|null|never|unknown|symbol|bigint|object)>/gi, '`<$1>`');
  content = content.replace(/([A-Z]\w*)<(\w+)>/g, '$1`<$2>`');

  fs.writeFileSync(file, content, 'utf8');
});

console.log(`Fixed ${files.length} MDX files`);