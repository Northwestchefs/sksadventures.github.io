# D&D Data Build Pipeline

This repository includes a browser-friendly data compilation script at:

- `scripts/build-dnd-data.js`

## How the build script works

The script reads raw JSON datasets from:

- `reference/api-database/5e-database` (including `reference/api-database/5e-database/src`)

It recursively discovers JSON files, identifies files relevant to each supported category, then normalizes records into a compact structure.

### Categories compiled

- monsters → `data/monsters.json`
- spells → `data/spells.json`
- equipment/items → `data/items.json`
- classes → `data/classes.json`
- conditions → `data/conditions.json`
- races → `data/races.json`
- skills → `data/skills.json`

### Normalized output schema

Each output entry is flattened to:

- `name`
- `index`
- `type`
- `description`
- `source`

The script also:

- accepts common input shapes (`[]`, `{ results: [] }`, and object containers)
- flattens nested description fields into a plain text string
- deduplicates by `index`
- writes compact JSON arrays for faster browser loading

## How to run

From repository root:

```bash
node scripts/build-dnd-data.js
```

This regenerates all files in `/data`.

## Adding new datasets later

The pipeline is intentionally modular to support future inputs from:

- `reference/srd`
- `reference/modules`
- `reference/foundry`

To add support for new datasets:

1. Extend file discovery roots (e.g., add new input directories).
2. Add/adjust category filename matchers in `CATEGORY_CONFIG`.
3. If a dataset uses a different schema, update:
   - `unwrapRecords` for collection extraction
   - `normalizeRecord` and `compactDescription` for field mapping
4. Re-run the script and confirm the generated `/data/*.json` files.

Before building, sync reference repositories:

```bash
node ./reference/scripts/sync-references.js
```
