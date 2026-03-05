#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH = path.join(ROOT, 'reference', 'manifest.json');

async function main() {
  const manifestRaw = await fs.readFile(MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestRaw);

  const repositories = Array.isArray(manifest.repositories) ? manifest.repositories : [];
  if (!repositories.length) {
    console.log('[sync-references] No repositories defined in reference/manifest.json.');
    return;
  }

  const failures = [];

  for (const repo of repositories) {
    try {
      await syncRepository(repo);
    } catch (error) {
      failures.push({ name: repo.name || repo.path || 'unknown', error });
      console.error(`[sync-references] Failed to sync ${repo.name || repo.path}: ${error.message}`);
    }
  }

  if (failures.length) {
    throw new Error(`${failures.length} repository sync operation(s) failed.`);
  }

  console.log(`[sync-references] Synced ${repositories.length} repositories.`);
}

async function syncRepository(repo) {
  const { name, url, path: repoPath } = repo;
  if (!name || !url || !repoPath) {
    throw new Error(`Invalid manifest entry: ${JSON.stringify(repo)}`);
  }

  const absoluteTarget = path.join(ROOT, repoPath);
  const gitDir = path.join(absoluteTarget, '.git');

  await fs.mkdir(path.dirname(absoluteTarget), { recursive: true });

  if (await exists(gitDir)) {
    console.log(`[sync-references] Updating ${name} in ${repoPath}...`);
    await run('git', ['-C', absoluteTarget, 'pull', '--ff-only']);
  } else {
    console.log(`[sync-references] Cloning ${name} into ${repoPath}...`);
    await run('git', ['clone', url, absoluteTarget]);
  }
}

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: 'inherit',
      shell: false,
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

main().catch((error) => {
  console.error('[sync-references] Failed:', error.message);
  process.exitCode = 1;
});
