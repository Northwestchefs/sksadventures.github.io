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

  if (!fs.existsSync(absoluteTarget)) {
    console.log(`[sync-references] Cloning ${name} into ${repoPath}...`);
    runCommand(['git', 'clone', url, absoluteTarget], ROOT);
    return 'cloned';
  }

  if (!fs.existsSync(gitDir)) {
    const entries = fs.readdirSync(absoluteTarget);
    if (entries.length === 0) {
      console.log(`[sync-references] Empty directory found for ${name}; cloning into ${repoPath}...`);
      fs.rmdirSync(absoluteTarget);
      runCommand(['git', 'clone', url, absoluteTarget], ROOT);
      return 'cloned';
    }

    throw new Error(`Target directory exists but is not a git repository: ${repoPath}`);
  }

  console.log(`[sync-references] Updating ${name} in ${repoPath}...`);
  runCommand(['git', 'pull', '--ff-only'], absoluteTarget);
  return 'updated';
}

function runCommand(parts, cwd) {
  const command = parts.map(quoteArg).join(' ');
  execSync(command, {
    cwd,
    stdio: 'inherit',
  });
}

function quoteArg(value) {
  const text = String(value);
  return `"${text.replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/g, '$1$1')}"`;
}

main();
