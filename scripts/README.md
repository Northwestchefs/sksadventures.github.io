# D&D Data Build Pipeline

This repository includes a browser-friendly data compilation script at:

- `scripts/build-dnd-data.js`

## How the build script works

The script reads reference paths from:

- `reference/manifest.json`

It currently compiles from the API database repository configured at:

- `reference/api-database/5e-database`

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

## How to run

From repository root:

```bash
node scripts/build-dnd-data.js
```

This regenerates all files in `/data`.

## Reference architecture

Reference libraries are isolated under `/reference`:

- `reference/srd`
- `reference/api-database`
- `reference/foundry`
- `reference/foundry-dnd5e`

To clone/update configured sources, run:

```bash
./reference/scripts/sync-references.sh
```

## Extending later

To add future datasets or swap source repositories:

1. Update `reference/manifest.json`.
2. Keep raw data in `/reference/*`.
3. Extend `scripts/build-dnd-data.js` category matching and normalizers as needed.
4. Re-run the build script and verify `/data/*.json` output.
