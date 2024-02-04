import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function importHtml() {
  const filename = fileURLToPath(import.meta.url);
  const html = await readFile(resolve(filename, '../../app.html'), 'utf8');
  const [, body] = html.match(/<body>(.*)<\/body>/ms)!;

  return body;
}
