# Encounter Generator

The web generator UI is served from `tools/encounter-generator.html`.

Foundry import assets:
- Export schema sample: `export/sks-encounter.json`
- Import macro: `foundry/sks-encounter-importer-macro.js`

`sks-encounter.json` now includes both:
- `journal`: simplified encounter note fields used by older imports
- `journalEntry`: Foundry-native JournalEntry payload with typed page data (`pages[].type = "text"`)
