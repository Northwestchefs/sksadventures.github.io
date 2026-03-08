#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');

require('../assets/monster-generator.js');

const hooks = globalThis.__monsterGeneratorTestHooks;
assert.ok(hooks, 'Expected __monsterGeneratorTestHooks to be available.');

const STYLES = ['balanced', 'brutal', 'arcane', 'shadow', 'draconic', 'elemental', 'infernal', 'celestial', 'swarm', 'undead', 'fey', 'aquatic'];
const CRS = ['0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

const ITERATIONS_PER_PAIR = 60;
const monsters = [];

for (const cr of CRS) {
  for (const style of STYLES) {
    for (let i = 0; i < ITERATIONS_PER_PAIR; i += 1) {
      monsters.push(hooks.generateRandomMonster(cr, style));
    }
  }
}

let hoverWithoutFly = 0;
let hpOutOfRange = 0;
let malformedIdentity = 0;
let attacksMissing = 0;
let secondaryDamageMismatch = 0;
let dprOutOfRange = 0;
let totalAttacks = 0;

for (const mon of monsters) {
  const identity = mon.identity || {};
  const core = mon.core || {};
  const speed = core.speed || {};
  const combat = mon.combat || {};

  const baseline = hooks.getCrBaseline(hooks.normalizeCrKey(identity.cr));

  if (speed.hover && !(Number(speed.fly) > 0)) hoverWithoutFly += 1;
  if (typeof core.hp !== 'number' || core.hp < baseline.hpMin || core.hp > baseline.hpMax) hpOutOfRange += 1;
  if (!identity.name || !identity.type || !identity.size || !identity.cr) malformedIdentity += 1;
  if (!Array.isArray(combat.attacks) || combat.attacks.length < 1) attacksMissing += 1;

  const attackDamageTotal = (combat.attacks || []).reduce((sum, attack) => {
    const hitText = String(attack.hit || '');
    const match = hitText.match(/^(\d+)\s*\(/);
    return sum + (match ? Number(match[1]) : 0);
  }, 0);
  if (attackDamageTotal < baseline.dprMin || attackDamageTotal > baseline.dprMax) dprOutOfRange += 1;

  for (const attack of combat.attacks || []) {
    totalAttacks += 1;
    const hasPlusInHit = / plus /i.test(String(attack.hit || ''));
    const hasSecondaryDamage = Boolean(String(attack.secondaryDamage || '').trim());
    if (hasPlusInHit !== hasSecondaryDamage) secondaryDamageMismatch += 1;
  }
}

assert.equal(hoverWithoutFly, 0, `Found ${hoverWithoutFly} monsters with hover=true but no fly speed.`);
assert.equal(hpOutOfRange, 0, `Found ${hpOutOfRange} monsters with HP outside CR baseline range.`);
assert.equal(malformedIdentity, 0, `Found ${malformedIdentity} malformed monster identities.`);
assert.equal(attacksMissing, 0, `Found ${attacksMissing} monsters with zero attacks.`);
assert.equal(secondaryDamageMismatch, 0, `Found ${secondaryDamageMismatch} attacks with mismatched hit text vs secondaryDamage field.`);
assert.equal(dprOutOfRange, 0, `Found ${dprOutOfRange} monsters with total attack DPR outside CR baseline range.`);

console.log(JSON.stringify({
  monstersGenerated: monsters.length,
  attacksGenerated: totalAttacks,
  checks: {
    hoverWithoutFly,
    hpOutOfRange,
    malformedIdentity,
    attacksMissing,
    secondaryDamageMismatch,
    dprOutOfRange,
  },
}, null, 2));
