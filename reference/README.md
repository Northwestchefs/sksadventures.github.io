# Reference Data Architecture

All reusable rules, external datasets, and platform schemas must live under `/reference`.

## Directory layout

- `reference/srd`
  - SRD rules and structured data.
- `reference/api-database`
  - monster, spell, and item datasets for high-speed search/build tools.
- `reference/foundry`
  - Foundry VTT API/type references, JSON structure examples, and integration docs.
- `reference/foundry-dnd5e`
  - Foundry's DnD5e system repository for actor/item schema and compendium model reference.
- `reference/manifest.json`
  - canonical map of reference libraries and upstream repositories.

## Design rules

1. Keep all reference material isolated in `/reference`.
2. Do not mix reference datasets with front-end/site code.
3. Tools should read from reference datasets rather than hardcoded rules.
4. Keep upstream checkouts clean; place transformed/derived output in `/data`.
5. Add future sources by extending `reference/manifest.json` and sync scripts.

## Syncing repositories

Use one of these scripts to clone or update all configured datasets:

- `reference/scripts/sync-references.sh`
- `reference/scripts/sync-references.ps1`

These scripts read from `reference/manifest.json` and keep the directory structure consistent.
