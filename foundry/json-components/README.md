# Foundry VTT JSON Components

These JSON files are reusable templates/schemas for common Foundry VTT components used by SKS encounter exports and imports.

## Source material used

- `export/sks-encounter.json`
- `foundry/sks-encounter-importer-macro.js`
- `dnd-guide/foundry-vtt/index.html` and related Foundry guide pages
- `reference/manifest.json`

## Included component files

- `encounter-package.schema.json`: top-level payload schema
- `npc-actor.template.json`: dnd5e NPC actor template
- `scene.template.json`: scene setup template
- `token.template.json`: token creation template
- `combat.template.json`: combat + combatants template
- `journal-entry.template.json`: encounter notes template
- `foundry-component-catalog.json`: index of all templates

Use these as starting points for Foundry macros, importers, or data generation pipelines.
