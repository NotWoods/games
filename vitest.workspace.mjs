// @ts-check
import { defineWorkspace } from 'vitest/config';
import { readFileSync } from 'fs';

const { workspaces } = /** @type {{ workspaces: string[] }} */ (
  JSON.parse(readFileSync('package.json', 'utf-8'))
);

export default defineWorkspace(workspaces);
