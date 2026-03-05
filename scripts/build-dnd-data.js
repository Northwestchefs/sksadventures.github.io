#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REFERENCE_MANIFEST = path.join(ROOT, 'reference', 'manifest.json');
const OUTPUT_ROOT = path.join(ROOT, 'data');

const CATEGORY_CONFIG = [
  {
    key: 'monsters',
    output: 'monsters.json',
    type: 'monster',
    matchers: ['monster', 'monsters', 'creature', 'bestiary'],
  },
  {
    key: 'spells',
    output: 'spells.json',
    type: 'spell',
    matchers: ['spell', 'spells'],
  },
  {
    key: 'equipment',
    output: 'items.json',
    type: 'equipment',
    matchers: ['equipment', 'item', 'items', 'gear', 'weapon', 'armor'],
  },
  {
    key: 'classes',
    output: 'classes.json',
    type: 'class',
    matchers: ['class', 'classes'],
  },
  {
    key: 'conditions',
    output: 'conditions.json',
    type: 'condition',
    matchers: ['condition', 'conditions', 'status'],
  },
  {
    key: 'races',
    output: 'races.json',
    type: 'race',
    matchers: ['race', 'races', 'species'],
  },
  {
    key: 'skills',
    output: 'skills.json',
    type: 'skill',
    matchers: ['skill', 'skills', 'proficiency'],
  },
];

const SOURCE_HINTS = ['api-database/5e-database', 'srd', 'foundry', 'modules'];

async function resolveInputRoot() {
  const manifest = await readJson(REFERENCE_MANIFEST);
  const configured = manifest?.datasets?.apiDatabase?.repositories?.[0]?.path;
  if (configured) {
    return path.join(ROOT, configured);
  }

  return path.join(ROOT, 'reference', 'api-database', '5e-database');
}

async function main() {
  await fs.mkdir(OUTPUT_ROOT, { recursive: true });

  const inputRoot = await resolveInputRoot();
  const inputFiles = await collectJsonFiles(inputRoot);
  if (!inputFiles.length) {
    console.warn(`[build-dnd-data] No JSON files found under ${relativePath(inputRoot)}.`);
  }

  for (const category of CATEGORY_CONFIG) {
    const matchingFiles = inputFiles.filter((filePath) => fileMatchesCategory(filePath, category));
    const records = [];

    for (const filePath of matchingFiles) {
      const parsed = await readJson(filePath);
      const rows = unwrapRecords(parsed);
      for (const row of rows) {
        const normalized = normalizeRecord(row, category.type, filePath);
        if (normalized) {
          records.push(normalized);
        }
      }
    }

    const deduplicated = dedupeByIndex(records);
    deduplicated.sort((a, b) => a.name.localeCompare(b.name));

    const outputPath = path.join(OUTPUT_ROOT, category.output);
    await fs.writeFile(outputPath, JSON.stringify(deduplicated), 'utf8');

    console.log(
      `[build-dnd-data] Wrote ${deduplicated.length} ${category.key} -> ${relativePath(outputPath)} (${matchingFiles.length} source files).`,
    );
  }
}

async function collectJsonFiles(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      }

      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await collectJsonFiles(fullPath)));
        continue;
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
        files.push(fullPath);
      }
    }

    return files;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function readJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[build-dnd-data] Skipping invalid JSON file: ${relativePath(filePath)} (${error.message})`);
    return [];
  }
}

function fileMatchesCategory(filePath, category) {
  const lowered = filePath.toLowerCase();
  return category.matchers.some((token) => lowered.includes(token));
}

function unwrapRecords(parsed) {
  if (Array.isArray(parsed)) {
    return parsed;
  }

  if (!parsed || typeof parsed !== 'object') {
    return [];
  }

  if (Array.isArray(parsed.results)) {
    return parsed.results;
  }

  for (const value of Object.values(parsed)) {
    if (Array.isArray(value) && value.length && typeof value[0] === 'object') {
      return value;
    }
  }

  return [];
}

function normalizeRecord(record, fallbackType, sourcePath) {
  if (!record || typeof record !== 'object') {
    return null;
  }

  const name = pickString(record, ['name', 'full_name', 'title']);
  if (!name) {
    return null;
  }

  const index = slugify(pickString(record, ['index', 'slug', 'id']) || name);
  const type = pickString(record, ['type', 'category']) || fallbackType;
  const description = compactDescription(record);
  const source = pickString(record, ['source', 'document__slug', 'srd']) || inferSourceFromPath(sourcePath);

  return {
    name,
    index,
    type,
    description,
    source,
  };
}

function compactDescription(record) {
  const candidates = [
    record.description,
    record.desc,
    record.flavor_text,
    record.summary,
    record.entries,
    record.traits,
    record.special_abilities,
  ];

  for (const candidate of candidates) {
    const text = flattenToText(candidate);
    if (text) {
      return text;
    }
  }

  return '';
}

function flattenToText(value) {
  if (typeof value === 'string') {
    return normalizeWhitespace(value);
  }

  if (Array.isArray(value)) {
    const joined = value.map((item) => flattenToText(item)).filter(Boolean).join(' ');
    return normalizeWhitespace(joined);
  }

  if (value && typeof value === 'object') {
    if (typeof value.name === 'string' && typeof value.desc === 'string') {
      return normalizeWhitespace(`${value.name}: ${value.desc}`);
    }

    const parts = Object.values(value)
      .map((nested) => flattenToText(nested))
      .filter(Boolean)
      .join(' ');

    return normalizeWhitespace(parts);
  }

  return '';
}

function dedupeByIndex(records) {
  const map = new Map();

  for (const row of records) {
    if (!map.has(row.index)) {
      map.set(row.index, row);
      continue;
    }

    const current = map.get(row.index);
    if (row.description.length > current.description.length) {
      map.set(row.index, row);
    }
  }

  return [...map.values()];
}

function pickString(record, keys) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
}

function inferSourceFromPath(filePath) {
  const lowered = filePath.toLowerCase();
  for (const hint of SOURCE_HINTS) {
    if (lowered.includes(hint)) {
      return hint;
    }
  }
  return relativePath(filePath);
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function relativePath(filePath) {
  return path.relative(ROOT, filePath) || '.';
}

main().catch((error) => {
  console.error('[build-dnd-data] Failed:', error);
  process.exitCode = 1;
});
