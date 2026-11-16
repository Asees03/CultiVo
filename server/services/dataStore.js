import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the data directory both locally and inside a bundled Netlify
// Function, where the module's own location differs from the source tree.
function resolveDataDir() {
  const candidates = [];
  if (import.meta.url) {
    candidates.push(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data'));
  }
  candidates.push(path.resolve(process.cwd(), 'server/data'));
  if (process.env.LAMBDA_TASK_ROOT) {
    candidates.push(path.resolve(process.env.LAMBDA_TASK_ROOT, 'server/data'));
  }
  return candidates.find((dir) => fs.existsSync(path.join(dir, 'crops.json'))) || candidates[0];
}

const DATA_DIR = resolveDataDir();
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function getCrops() {
  return readJson('crops.json');
}

export function getMandis() {
  return readJson('mandis.json');
}

export function getLocations() {
  return readJson('locations.json');
}

export function readUserStore() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      const initial = { users: {}, sessions: {}, otps: {} };
      fs.writeFileSync(USERS_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const parsed = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    return {
      users: parsed.users || {},
      sessions: parsed.sessions || {},
      otps: parsed.otps || {},
    };
  } catch {
    return { users: {}, sessions: {}, otps: {} };
  }
}

export function writeUserStore(store) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(store, null, 2));
}
