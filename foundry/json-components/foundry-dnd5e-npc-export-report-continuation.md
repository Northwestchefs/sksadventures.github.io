# Foundry dnd5e NPC Export Report (Continuation)

The previous report output was truncated mid-section; this file completes the remaining deliverables: the **medium** and **complex** sample JSON outputs, plus **repo integration instructions** and **CI/test recommendations**.

## Sample output: medium-complexity (minified JSON)

```json
{"name":"Hobgoblin Captain","type":"npc","img":"icons/svg/mystery-man.svg","system":{"currency":{"pp":0,"gp":0,"ep":0,"sp":0,"cp":0},"abilities":{"str":{"value":14,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"dex":{"value":12,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"con":{"value":14,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"int":{"value":10,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"wis":{"value":11,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"cha":{"value":14,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}}},"bonuses":{"mwak":{"attack":"","damage":""},"rwak":{"attack":"","damage":""},"msak":{"attack":"","damage":""},"rsak":{"attack":"","damage":""},"abilities":{"check":"","save":"","skill":""},"spell":{"dc":""}},"skills":{"acr":{"ability":"dex","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"ani":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"arc":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"ath":{"ability":"str","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"dec":{"ability":"cha","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"his":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"ins":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"itm":{"ability":"cha","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"inv":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"med":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"nat":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"prc":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"prf":{"ability":"cha","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"per":{"ability":"cha","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"rel":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"slt":{"ability":"dex","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"ste":{"ability":"dex","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"sur":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}}},"tools":{},"spells":{"spell1":{"value":0,"override":null},"spell2":{"value":0,"override":null},"spell3":{"value":0,"override":null},"spell4":{"value":0,"override":null},"spell5":{"value":0,"override":null},"spell6":{"value":0,"override":null},"spell7":{"value":0,"override":null},"spell8":{"value":0,"override":null},"spell9":{"value":0,"override":null},"pact":{"value":0,"override":null}},"attributes":{"ac":{"calc":"default","flat":null},"hp":{"value":60,"max":60,"formula":"8d8 + 24","temp":null,"tempmax":null},"senses":{"darkvision":60,"blindsight":null,"tremorsense":null,"truesight":null,"units":"ft","special":""},"movement":{"walk":"30","units":"ft","hover":false,"ignoredDifficultTerrain":[]},"init":{"ability":"","roll":{"min":null,"max":null,"mode":0},"bonus":""},"attunement":{"max":3},"spellcasting":"","exhaustion":0,"concentration":{"ability":"","roll":{"min":null,"max":null,"mode":0},"bonuses":{"save":""},"limit":1},"loyalty":{},"hd":{"spent":0},"death":{"roll":{"min":null,"max":null,"mode":0},"success":0,"failure":0,"bonuses":{"save":""}},"spell":{"level":0},"price":{"value":null,"denomination":"gp"}},"details":{"biography":{"value":"<p>A disciplined hobgoblin commander.</p>","public":""},"alignment":"Lawful Evil","ideal":"","bond":"","flaw":"","race":null,"type":{"value":"humanoid","subtype":"Goblinoid","swarm":"","custom":""},"cr":3,"habitat":{"value":[],"custom":""},"treasure":{"value":[]}},"resources":{"legact":{"max":0,"spent":0},"legres":{"max":0,"spent":0},"lair":{"value":false,"initiative":null,"inside":false}},"source":{"revision":1,"rules":"2024","book":"","page":"","custom":"","license":""},"traits":{"languages":{"value":["common","goblin"],"custom":"","communication":{}},"size":"med","di":{"value":[],"custom":"","bypasses":[]},"dr":{"value":[],"custom":"","bypasses":[]},"dv":{"value":[],"custom":"","bypasses":[]},"dm":{"amount":{},"bypasses":[]},"ci":{"value":[],"custom":""},"important":false}},"prototypeToken":{"name":"Hobgoblin Captain","displayName":20,"actorLink":false,"width":1,"height":1,"texture":{"src":"icons/svg/helmet.svg"},"disposition":-1,"displayBars":20,"bar1":{"attribute":"attributes.hp"},"bar2":{"attribute":null}},"items":[{"_id":"captMultiattack","name":"Multiattack","type":"feat","img":"icons/svg/lightning.svg","system":{"description":{"value":"<p>The captain makes two attacks with its longsword.</p>","chat":""},"activities":{},"uses":{"spent":0,"recovery":[],"max":""},"identifier":"","properties":[],"source":{"revision":1,"rules":"2024"}},"effects":[],"folder":null,"flags":{},"sort":0,"ownership":{"default":0}},{"_id":"captLongsword","name":"Longsword","type":"weapon","img":"icons/svg/sword.svg","system":{"description":{"value":"<p>Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) slashing damage.</p>","chat":""},"activities":{},"uses":{"spent":0,"recovery":[],"max":""},"identifier":"","properties":[],"source":{"revision":1,"rules":"2024"}},"effects":[],"folder":null,"flags":{},"sort":0,"ownership":{"default":0}},{"_id":"captParry","name":"Parry","type":"feat","img":"icons/svg/shield.svg","system":{"description":{"value":"<p>The captain adds 2 to its AC against one melee attack that would hit it.</p>","chat":""},"activities":{},"uses":{"spent":0,"recovery":[],"max":""},"identifier":"","properties":[],"source":{"revision":1,"rules":"2024"}},"effects":[],"folder":null,"flags":{},"sort":0,"ownership":{"default":0}}],"effects":[],"folder":null,"flags":{},"ownership":{"default":0}}
```

## Sample output: complex (minified JSON)

```json
{"name":"Cult Pyromancer","type":"npc","img":"icons/svg/mystery-man.svg","system":{"currency":{"pp":0,"gp":0,"ep":0,"sp":0,"cp":0},"abilities":{"str":{"value":9,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"dex":{"value":14,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"con":{"value":12,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"int":{"value":12,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"wis":{"value":10,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}},"cha":{"value":16,"proficient":0,"max":null,"bonuses":{"check":"","save":""},"check":{"roll":{"min":null,"max":null,"mode":0}},"save":{"roll":{"min":null,"max":null,"mode":0}}}},"bonuses":{"mwak":{"attack":"","damage":""},"rwak":{"attack":"","damage":""},"msak":{"attack":"","damage":""},"rsak":{"attack":"","damage":""},"abilities":{"check":"","save":"","skill":""},"spell":{"dc":""}},"skills":{"acr":{"ability":"dex","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"ani":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"arc":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"ath":{"ability":"str","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"dec":{"ability":"cha","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"his":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"ins":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"itm":{"ability":"cha","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"inv":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"med":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"nat":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"prc":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"prf":{"ability":"cha","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"per":{"ability":"cha","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"rel":{"ability":"int","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"slt":{"ability":"dex","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"ste":{"ability":"dex","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}},"sur":{"ability":"wis","roll":{"min":null,"max":null,"mode":0},"value":0,"bonuses":{"check":"","passive":""}}},"tools":{},"spells":{"spell1":{"value":4,"override":null},"spell2":{"value":3,"override":null},"spell3":{"value":2,"override":null},"spell4":{"value":0,"override":null},"spell5":{"value":0,"override":null},"spell6":{"value":0,"override":null},"spell7":{"value":0,"override":null},"spell8":{"value":0,"override":null},"spell9":{"value":0,"override":null},"pact":{"value":0,"override":null}},"attributes":{"ac":{"calc":"default","flat":null},"hp":{"value":45,"max":45,"formula":"10d8","temp":null,"tempmax":null},"senses":{"darkvision":null,"blindsight":null,"tremorsense":null,"truesight":null,"units":"ft","special":""},"movement":{"walk":"30","units":"ft","hover":false,"ignoredDifficultTerrain":[]},"init":{"ability":"","roll":{"min":null,"max":null,"mode":0},"bonus":""},"attunement":{"max":3},"spellcasting":"cha","exhaustion":0,"concentration":{"ability":"","roll":{"min":null,"max":null,"mode":0},"bonuses":{"save":""},"limit":1},"loyalty":{},"hd":{"spent":0},"death":{"roll":{"min":null,"max":null,"mode":0},"success":0,"failure":0,"bonuses":{"save":""}},"spell":{"level":0},"price":{"value":null,"denomination":"gp"}},"details":{"biography":{"value":"<p>A fanatic who wields fire to serve a dark cause.</p>","public":""},"alignment":"Chaotic Evil","ideal":"","bond":"","flaw":"","race":null,"type":{"value":"humanoid","subtype":"Human","swarm":"","custom":""},"cr":4,"habitat":{"value":[],"custom":""},"treasure":{"value":[]}},"resources":{"legact":{"max":0,"spent":0},"legres":{"max":0,"spent":0},"lair":{"value":false,"initiative":null,"inside":false}},"source":{"revision":1,"rules":"2024","book":"","page":"","custom":"","license":""},"traits":{"languages":{"value":["common","infernal"],"custom":"","communication":{}},"size":"med","di":{"value":[],"custom":"","bypasses":[]},"dr":{"value":[],"custom":"","bypasses":[]},"dv":{"value":[],"custom":"","bypasses":[]},"dm":{"amount":{},"bypasses":[]},"ci":{"value":[],"custom":""},"important":false}},"prototypeToken":{"name":"Cult Pyromancer","displayName":20,"actorLink":false,"width":1,"height":1,"texture":{"src":"icons/svg/fire.svg"},"disposition":-1,"displayBars":20,"bar1":{"attribute":"attributes.hp"},"bar2":{"attribute":null}},"items":[{"_id":"pyroSpellcasting","name":"Spellcasting","type":"feat","img":"icons/svg/book.svg","system":{"description":{"value":"<p>The pyromancer is a 7th-level spellcaster (Charisma). Spell save DC 14, +6 to hit. It has the following spells prepared: cantrips (at will): <em>fire bolt</em>; 1st level (4 slots): <em>burning hands</em>, <em>shield</em>; 2nd level (3 slots): <em>scorching ray</em>; 3rd level (2 slots): <em>fireball</em>.</p>","chat":""},"activities":{},"uses":{"spent":0,"recovery":[],"max":""},"identifier":"","properties":[],"source":{"revision":1,"rules":"2024"}},"effects":[],"folder":null,"flags":{},"sort":0,"ownership":{"default":0}},{"_id":"pyroFireBolt","name":"Fire Bolt","type":"spell","img":"icons/svg/fire.svg","system":{"description":{"value":"<p><strong>Ranged Spell Attack:</strong> +6 to hit, range 120 ft., one creature. <strong>Hit:</strong> 10 (2d10) fire damage.</p>","chat":""},"activities":{},"uses":{"spent":0,"recovery":[],"max":""},"identifier":"","properties":[],"source":{"revision":1,"rules":"2024"}},"effects":[],"folder":null,"flags":{},"sort":0,"ownership":{"default":0}},{"_id":"pyroFireball","name":"Fireball","type":"spell","img":"icons/svg/fire.svg","system":{"description":{"value":"<p>Each creature in a 20-foot-radius sphere must make a Dexterity saving throw, taking 28 (8d6) fire damage on a failed save, or half as much on a successful one.</p>","chat":""},"activities":{},"uses":{"spent":0,"recovery":[],"max":""},"identifier":"","properties":[],"source":{"revision":1,"rules":"2024"}},"effects":[],"folder":null,"flags":{},"sort":0,"ownership":{"default":0}},{"_id":"pyroDagger","name":"Dagger","type":"weapon","img":"icons/svg/dagger.svg","system":{"description":{"value":"<p>Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4 + 2) piercing damage.</p>","chat":""},"activities":{},"uses":{"spent":0,"recovery":[],"max":""},"identifier":"","properties":[],"source":{"revision":1,"rules":"2024"}},"effects":[],"folder":null,"flags":{},"sort":0,"ownership":{"default":0}}],"effects":[],"folder":null,"flags":{},"ownership":{"default":0}}
```

## Usage instructions for integrating into a GitHub repo

This assumes your repo has (or can support) a Node/TypeScript tooling layer for schema validation and tests. Even if your code is primarily Foundry runtime JS, CI is typically easiest in Node.

### Add these repository artifacts

1. `schemas/foundry-dnd5e-npc-actor.schema.json`
   - Save the JSON Schema from the report.
   - Treat it as the contract the AI output must comply with.

2. `prompts/foundry-dnd5e-npc-export.prompt.txt`
   - Save the prompt template from the report (with placeholders like `{{SCHEMA_JSON}}`).
   - Your generator script should inject the schema and (optionally) your three real example exports to strongly anchor output toward your environment’s conventions.

3. `scripts/validate-actors.mjs`
   - A CLI that:
     - loads all generated actor JSON files from a directory (e.g., `generated/actors/*.json`)
     - validates each against the JSON schema
     - prints human-friendly errors (and fails with non-zero exit code if any file fails)

### Recommended validation tooling

- `ajv` (JSON Schema validator) + `ajv-formats` for robust schema validation in Node.
- Optional: `json-schema-to-typescript` to generate TS types from your schema to strengthen your converter code.

### Runtime integration options

Depending on your workflow, you’ll do one (or both):

- **Offline generation + import**: run the AI converter in CI/local, then import JSON into Foundry via Actor directory “Import Data” (overwrites an existing actor) or via a compendium-building workflow. Foundry documents that actors can be exported/imported as JSON from the Actor directory context menu.
- **In-Foundry creation script**: write a Foundry macro/module script that reads the generated JSON and calls Foundry document creation APIs (Actor + embedded Items). The Actor data model explicitly includes `system`, `prototypeToken`, `items`, and `effects` as core structural components.

## Recommended tests and CI checks

Use a layered testing strategy:

### Schema validation (fast, mandatory in CI)

- Validate every generated actor JSON against `schemas/foundry-dnd5e-npc-actor.schema.json`.
- Fail CI on any schema error.

### Semantic validation (fast, mandatory in CI)

Add custom checks beyond schema, reflecting dnd5e data model requirements:

- `system.attributes.hp.formula` non-empty and parseable as a roll expression (string). NPC data model requires HP formula.
- `system.details.cr` is `null` or in `[0, 30]` (CR filters and conventions assume this range).
- Ensure canonical key sets:
  - abilities use `str/dex/con/int/wis/cha` keys (config also includes `fullKey` like “strength”, which is a common input form; treat fullKey as input-only).
  - skills use canonical abbreviations `acr/ani/.../sur`.
  - currencies include `pp/gp/ep/sp/cp`.

### Unit tests for mapping

If your repo includes a transformer that takes statblock text and produces JSON:

- Add fixtures: `tests/fixtures/input/*.txt` and expected outputs `tests/fixtures/expected/*.json`.
- Unit-test mapping functions:
  - CR parsing (including fractions like `1/4`)
  - speed parsing to movement fields (`walk/fly/etc`)
  - senses parsing (including handling absent senses)

### Linting and formatting

- `eslint` + `prettier`, run in CI.
- Prettier can also enforce stable formatting for committed prompt/schema/fixtures.

### GitHub Actions suggestion

A typical workflow job:

- `npm ci`
- `npm run lint`
- `npm run test`
- `npm run validate:actors` (Ajv schema validation + semantic checks)

## Tool/library suggestions

- JSON Schema validation: **Ajv**
- Test runner: **Vitest** (fast, TS-friendly) or **Jest**
- Type generation: **json-schema-to-typescript**
- Static analysis: **ESLint** (+ TypeScript ESLint if applicable)
- Formatting: **Prettier**

All of these fit well into a repo that consumes AI outputs as generated artifacts and enforces correctness gates before merging.
