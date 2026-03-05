#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH = path.join(ROOT, 'reference', 'manifest.json');

function main() {
  const manifestRaw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const manifest = JSON.parse(manifestRaw);
  const repositories = Array.isArray(manifest.repositories) ? manifest.repositories : [];

  if (!repositories.length) {
    console.log('[sync-references] No repositories defined in reference/manifest.json.');
    return;
  }

  const results = [];

  for (const repo of repositories) {
    const name = repo?.name || repo?.path || 'unknown';

    try {
      const action = syncRepository(repo);
      results.push({ name, status: 'success', action });
      console.log(`[sync-references] ✓ ${name} (${action})`);
    } catch (error) {
      results.push({ name, status: 'failed', error: error.message });
      console.error(`[sync-references] ✗ ${name} failed: ${error.message}`);
    }
  }

  const successCount = results.filter((result) => result.status === 'success').length;
  const failureCount = results.length - successCount;

  console.log('\n[sync-references] Summary');
  console.log(`[sync-references] Total: ${results.length}`);
  console.log(`[sync-references] Succeeded: ${successCount}`);
  console.log(`[sync-references] Failed: ${failureCount}`);

  if (failureCount > 0) {
    console.log('[sync-references] Failed repositories:');
    for (const result of results.filter((entry) => entry.status === 'failed')) {
      console.log(`[sync-references] - ${result.name}: ${result.error}`);
    }
    process.exitCode = 1;
  }
}

function syncRepository(repo) {
  const { name, url, path: repoPath } = repo || {};
  if (!name || !url || !repoPath) {
    throw new Error(`Invalid manifest entry: ${JSON.stringify(repo)}`);
  }

  const absoluteTarget = path.join(ROOT, repoPath);
  const gitDir = path.join(absoluteTarget, '.git');

  fs.mkdirSync(path.dirname(absoluteTarget), { recursive: true });

  if (fs.existsSync(gitDir)) {
    console.log(`[sync-references] Updating ${name} in ${repoPath}...`);
    execSync('git pull --ff-only', {
      cwd: absoluteTarget,
      stdio: 'inherit',
    });
    return 'updated';
  }

  console.log(`[sync-references] Cloning ${name} into ${repoPath}...`);
  execSync(`git clone ${quoteShell(url)} ${quoteShell(absoluteTarget)}`, {
    cwd: ROOT,
    stdio: 'inherit',
  });
  return 'cloned';
}

function quoteShell(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

main();
