/**
 * Kiddo app driver — launch dev server + drive via Playwright.
 *
 * Usage (from project root):
 *   node .claude/skills/run-kiddo/driver.mjs [route ...]
 *
 * Examples:
 *   node .claude/skills/run-kiddo/driver.mjs               # screenshots /, /login, /daftar
 *   node .claude/skills/run-kiddo/driver.mjs /challenges   # screenshots just /challenges
 *
 * Requires playwright in devDependencies (npm install in project root first).
 * Screenshots land in .claude/skills/run-kiddo/shots/.
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..', '..', '..'); // → project root
const SHOTS_DIR = join(__dirname, 'shots');
const BASE_URL = 'http://localhost:5173';
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/login', '/daftar'];

async function isPortOpen(port) {
  try {
    await fetch(`http://localhost:${port}/`, { signal: AbortSignal.timeout(1000) });
    return true;
  } catch {
    return false;
  }
}

async function waitForPort(port, ms = 30000) {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (await isPortOpen(port)) return;
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Port ${port} not ready after ${ms}ms`);
}

async function main() {
  await mkdir(SHOTS_DIR, { recursive: true });

  let devProc = null;
  if (!(await isPortOpen(5173))) {
    console.log('Starting dev server…');
    devProc = spawn('npm', ['run', 'dev'], {
      cwd: PROJECT_ROOT,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    devProc.stdout.on('data', d => process.stdout.write(d));
    devProc.stderr.on('data', d => process.stderr.write(d));
    await waitForPort(5173);
    console.log('Dev server ready.');
  } else {
    console.log('Dev server already running on :5173.');
  }

  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-gpu'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  const taken = [];
  for (const route of ROUTES) {
    const url = BASE_URL + route;
    const slug = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '');
    const file = join(SHOTS_DIR, `${slug}.png`);
    console.log(`nav → ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`screenshot → ${file}`);
    taken.push(file);
  }

  if (errors.length) {
    console.error('\nConsole errors:');
    errors.forEach(e => console.error(' ', e));
  } else {
    console.log('\nNo console errors.');
  }

  await browser.close();
  if (devProc) { devProc.kill(); console.log('Dev server stopped.'); }

  console.log('\nScreenshots saved to:', SHOTS_DIR);
}

main().catch(e => { console.error(e); process.exit(1); });
