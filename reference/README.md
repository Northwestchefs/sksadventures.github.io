# Reference Data

This directory stores external rule datasets used by SKS Adventures tools.

## Included datasets

- `srd/dnd-5e-srd`: The [BTMorton/dnd-5e-srd](https://github.com/BTMorton/dnd-5e-srd) repository, which contains the Dungeons & Dragons System Reference Document converted into structured formats such as JSON and Markdown.

These files support development of tools such as monster browsers, encounter builders, and spell search.

## Data integrity

Do not modify files inside upstream dataset repositories (for example `srd/dnd-5e-srd`). Keep these checkouts clean so upstream updates can be pulled without conflicts.

Store all processed, transformed, or generated data in a separate location such as `/data`.

## Future expansion

This reference system is designed to support additional datasets over time, for example:

- `reference/api-database`
- `reference/foundry`
- `reference/modules`

Use `reference/scripts` to manage dataset cloning and updates.
