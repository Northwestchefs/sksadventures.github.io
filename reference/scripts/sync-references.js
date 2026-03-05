#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST_PATH = path.join(ROOT, 'reference', 'manifest.json');

async function main() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  const datasets = Object.values(manifest.datasets || {});

  for (const dataset of datasets) {
    for (const repo of dataset.repositories || []) {
      await syncRepository(repo.url, path.join(ROOT, repo.path));
    }
  }
}

async function syncRepository(url, targetDir) {
  const gitDir = path.join(targetDir, '.git');
  const hasGitDirectory = await exists(gitDir);

  if (!hasGitDirectory) {
    await fs.mkdir(path.dirname(targetDir), { recursive: true });
    console.log(`[reference-sync] Cloning ${url} -> ${path.relative(ROOT, targetDir)}`);
    await run('git', ['clone', url, targetDir], ROOT);
    return;
  }

  console.log(`[reference-sync] Updating ${path.relative(ROOT, targetDir)}`);
  await run('git', ['pull', '--ff-only'], targetDir);
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} failed with code ${code}`));
      }
    });
  });
}

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
