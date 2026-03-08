#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');

require('../assets/monster-generator.js');

const hooks = globalThis.__monsterGeneratorTestHooks;
assert.ok(hooks, 'Expected __monsterGeneratorTestHooks to be available.');

const updated = hooks.replaceMonsterNameInText(
  'The bear has advantage on Wisdom (Perception) checks that rely on smell.',
  'Brown Bear',
  'Shadow Stalker'
);
assert.equal(
  updated,
  'The Shadow Stalker has advantage on Wisdom (Perception) checks that rely on smell.',
  'Expected generic "the bear" text to follow the renamed monster.'
);

const monster = {
  combat: {
    traits: [{ description: 'The bear has advantage on Wisdom (Perception) checks that rely on smell.' }],
    actions: [{ description: "The Brown Bear's bite deals extra damage." }],
    bonusActions: [],
    reactions: [],
    legendaryActions: [],
    lairActions: [],
    mythic: [],
    attacks: [{ hit: 'The brown bear deals 8 slashing damage.', rider: '', styleNote: '' }],
    spellcasting: [{ description: 'Brown Bear can cast fog cloud once per day.' }],
  },
};

hooks.synchronizeMonsterNameReferences(monster, 'Brown Bear', 'Shadow Stalker');

assert.equal(
  monster.combat.traits[0].description,
  'The Shadow Stalker has advantage on Wisdom (Perception) checks that rely on smell.'
);
assert.equal(
  monster.combat.actions[0].description,
  "The Shadow Stalker's bite deals extra damage."
);
assert.equal(
  monster.combat.attacks[0].hit,
  'The Shadow Stalker deals 8 slashing damage.'
);
assert.equal(
  monster.combat.spellcasting[0].description,
  'Shadow Stalker can cast fog cloud once per day.'
);

console.log('rename sync checks passed');
