(function encounterGenerator() {
  const THRESHOLDS_BY_LEVEL = {
    1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
    2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
    3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
    4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
    5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
    6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
    7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
    8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
    9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
    10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
    11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
    12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
    13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
    14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
    15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
    16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
    17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
    18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
    19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
    20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 }
  };

  const FALLBACK_MONSTERS = [
    { name: 'Goblin', cr: 0.25, xp: 50, environments: ['dungeon', 'forest', 'urban'] },
    { name: 'Skeleton', cr: 0.25, xp: 50, environments: ['dungeon', 'urban'] },
    { name: 'Zombie', cr: 0.25, xp: 50, environments: ['dungeon', 'swamp'] },
    { name: 'Orc', cr: 0.5, xp: 100, environments: ['dungeon', 'forest'] },
    { name: 'Bandit Captain', cr: 2, xp: 450, environments: ['urban', 'forest'] },
    { name: 'Ogre', cr: 2, xp: 450, environments: ['dungeon', 'swamp'] },
    { name: 'Gelatinous Cube', cr: 2, xp: 450, environments: ['dungeon'] },
    { name: 'Werewolf', cr: 3, xp: 700, environments: ['forest', 'urban'] },
    { name: 'Displacer Beast', cr: 3, xp: 700, environments: ['underdark', 'forest'] },
    { name: 'Basilisk', cr: 3, xp: 700, environments: ['underdark', 'swamp'] },
    { name: 'Troll', cr: 5, xp: 1800, environments: ['swamp', 'forest'] },
    { name: 'Air Elemental', cr: 5, xp: 1800, environments: ['any'] },
    { name: 'Young White Dragon', cr: 6, xp: 2300, environments: ['arctic'] },
    { name: 'Mind Flayer', cr: 7, xp: 2900, environments: ['underdark'] },
    { name: 'Frost Giant', cr: 8, xp: 3900, environments: ['arctic'] },
    { name: 'Stone Golem', cr: 10, xp: 5900, environments: ['dungeon'] }
  ];

  const form = document.getElementById('encounter-form');
  const levelEl = document.getElementById('party-level');
  const sizeEl = document.getElementById('party-size');
  const difficultyEl = document.getElementById('difficulty');
  const environmentEl = document.getElementById('environment');
  const statusEl = document.getElementById('generator-status');
  const summaryEl = document.getElementById('encounter-summary');
  const resultsEl = document.getElementById('encounter-results');
  const exportBtnEl = document.getElementById('export-foundry-btn');
  const exportStatusEl = document.getElementById('export-status');

  const treasureEl = document.getElementById('treasure-hooks');
  const narrativeEl = document.getElementById('narrative-hooks');
  const bossEl = document.getElementById('boss-hooks');
  const environmentHooksEl = document.getElementById('environment-hooks');

  const TREASURE_TABLE = {
    easy: ['1d4 minor healing potions', 'A pouch with 3d10 gp and a silvered dagger', 'A spell scroll (1st level) in a weatherproof case'],
    medium: ['2d4 gemstones worth 25 gp each', 'One uncommon consumable and 4d10 gp', 'A map fragment leading to a side vault'],
    hard: ['A +1 ammunition bundle (6 pieces) and 6d10 gp', 'A rare crafting component tied to the region', 'A key that opens a locked faction cache'],
    deadly: ['A rare magic item with a complication attached', 'A relic tied to the campaign villain and 8d10 gp', 'A boon token redeemable with a powerful patron']
  };

  const NARRATIVE_PROMPTS = {
    any: ['A survivor begs the party to recover a ledger before rival scavengers arrive.', 'The monsters were hired to delay the heroes while a ritual advances elsewhere.', 'One enemy carries proof that a trusted ally is leaking party movements.'],
    dungeon: ['Ancient mural clues reveal the true final chamber if deciphered during combat.', 'A chained spirit offers tactical aid in exchange for burial rites.', 'Noise from the fight wakes something deeper unless the party ends quickly.'],
    forest: ['A druid circle marked these creatures as guardians, not villains.', "Fey emissaries watch from the treeline and judge the party's choices.", 'The encounter site sits atop a blighted root network spreading overnight.'],
    underdark: ['Bioluminescent spores reveal invisible tracks to a hidden colony.', 'A drow house symbol brands one foe as politically significant.', 'A collapsed tunnel reveals an ancient route to the campaign objective.'],
    urban: ['City watch plans to frame the party unless witnesses are protected.', "A thieves' guild fixer offers intel in exchange for a captured target.", 'The battle disrupts a festival, creating social fallout and opportunity.'],
    swamp: ['The fetid water carries alchemical runoff from a secret laboratory.', 'Local villagers believe this marsh is cursed by a forgotten oath.', 'A submerged shrine briefly rises during the moon tide after combat.'],
    arctic: ['Aurora patterns during battle point toward a giant-held observatory.', 'Supplies are sabotaged, forcing a survival bargain with defeated foes.', 'An ancestral spirit appears only if a fallen enemy receives honors.']
  };

  const ENVIRONMENT_PACKS = {
    any: {
      hazards: ['Shifting line-of-sight (fog, smoke, darkness pulses)', 'Unstable cover that can collapse after heavy hits'],
      objectives: ['Rescue a captive before round 4', 'Disrupt an active ritual focus'],
      twists: ['A neutral faction arrives mid-fight and demands terms', 'The objective relocates when triggered']
    },
    dungeon: {
      hazards: ['Pressure-plate corridors trigger darts or swinging blades', 'Rune circles flare every other round'],
      objectives: ['Seal a summoning gate', 'Hold a chokepoint for 3 rounds'],
      twists: ['A portcullis splits the party', 'Torchlight awakens stone sentinels']
    },
    forest: {
      hazards: ['Dense roots create difficult terrain', 'Canopy snipers gain intermittent half cover'],
      objectives: ['Protect a sacred tree from fire damage', 'Track the alpha through moving brush'],
      twists: ['Wild beasts panic through the battlefield', 'A rain burst extinguishes nonmagical flames']
    },
    underdark: {
      hazards: ['Spore clouds impose brief vision penalties', 'Narrow ledges risk falling into chasms'],
      objectives: ['Secure a fungus bridge crossing', 'Capture a scout alive for route intel'],
      twists: ['Cave tremors reorder terrain', 'A myconid circle offers truce if not harmed']
    },
    urban: {
      hazards: ['Crowded alleys restrict large creatures', 'Rooftop movement risks dangerous drops'],
      objectives: ['Evacuate civilians from a market lane', 'Protect evidence from being burned'],
      twists: ['Bell towers summon reinforcements on round 3', 'A rival crew exploits the chaos to steal valuables']
    },
    swamp: {
      hazards: ['Deep mud reduces movement unless paths are found', 'Toxic insects swarm any creature that dashes'],
      objectives: ['Destroy a fetid idol empowering foes', 'Escort an herbalist to rare reagents'],
      twists: ['Tidewater rises and redraws safe routes', "Will-o'wisps attempt to lure stragglers away"]
    },
    arctic: {
      hazards: ['Icy surfaces force balance checks on high-speed movement', 'Whiteout gusts impose ranged attack penalties'],
      objectives: ['Stabilize a cracking ice bridge', 'Light heat beacons before exhaustion sets in'],
      twists: ['An avalanche starts a round timer', 'An ice mephit envoy offers hidden passage']
    }
  };

  const BOSS_BEHAVIORS = ['focuses the weakest target', 'opens with battlefield control', 'retreats behind minions when bloodied', 'hunts spellcasters first'];
  const BOSS_PHASE_EVENTS = ['summons reinforcements', 'changes damage type', 'activates terrain hazards', 'gains a reaction-based counter'];
  const LAIR_ACTIONS = ['Initiative 20: force movement via terrain shift', 'Initiative 20: spawn obscuring effects', 'Initiative 20: pulse damage in a marked zone', 'Initiative 20: disable healing in one area until next round'];

  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

  let monsterPool = [];
  let lastGenerated = null;

  const CR_BASELINE = {
    0: { hp: 8, ac: 10, init: 1 },
    0.125: { hp: 16, ac: 11, init: 1 },
    0.25: { hp: 24, ac: 12, init: 1 },
    0.5: { hp: 36, ac: 12, init: 1 },
    1: { hp: 52, ac: 13, init: 2 },
    2: { hp: 78, ac: 13, init: 2 },
    3: { hp: 95, ac: 14, init: 2 },
    4: { hp: 110, ac: 14, init: 2 },
    5: { hp: 131, ac: 15, init: 2 },
    6: { hp: 146, ac: 15, init: 2 },
    7: { hp: 161, ac: 15, init: 2 },
    8: { hp: 176, ac: 16, init: 2 },
    9: { hp: 190, ac: 16, init: 3 },
    10: { hp: 205, ac: 17, init: 3 }
  };

  const xpMultiplier = (count) => {
    if (count === 1) return 1;
    if (count === 2) return 1.5;
    if (count <= 6) return 2;
    if (count <= 10) return 2.5;
    if (count <= 14) return 3;
    return 4;
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function normalizeMonster(monster) {
    if (!monster || typeof monster !== 'object') {
      return null;
    }

    const name = monster.name;
    const cr = Number(monster.challenge_rating ?? monster.cr);
    const xp = Number(monster.xp);

    if (!name || Number.isNaN(cr) || Number.isNaN(xp) || xp <= 0) {
      return null;
    }

    const environments = Array.isArray(monster.environments) && monster.environments.length
      ? monster.environments
      : ['any'];

    return { name, cr, xp, environments };
  }

  async function loadMonsterPool() {
    try {
      const response = await fetch('../data/monsters.json');
      if (!response.ok) {
        throw new Error('Monster data file unavailable.');
      }

      const data = await response.json();
      const normalized = Array.isArray(data) ? data.map(normalizeMonster).filter(Boolean) : [];
      if (normalized.length > 0) {
        statusEl.textContent = `Loaded ${normalized.length} monsters from local data.`;
        return normalized;
      }

      statusEl.textContent = 'Local monster data is empty. Using curated fallback roster.';
      return FALLBACK_MONSTERS;
    } catch (error) {
      statusEl.textContent = 'Could not load local monster data. Using curated fallback roster.';
      return FALLBACK_MONSTERS;
    }
  }

  function getThresholds(level, size) {
    const perCharacter = THRESHOLDS_BY_LEVEL[level];
    return {
      easy: perCharacter.easy * size,
      medium: perCharacter.medium * size,
      hard: perCharacter.hard * size,
      deadly: perCharacter.deadly * size
    };
  }

  function buildEncounterOption(pool, targetXp, attempt) {
    const roster = [];
    const maxCreatures = 2 + Math.floor(Math.random() * 3);
    let rawXp = 0;

    while (roster.length < maxCreatures) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (!pick) {
        break;
      }

      const quantity = Math.random() > 0.7 ? 2 : 1;
      const existing = roster.find((entry) => entry.name === pick.name);
      if (existing) {
        existing.quantity += quantity;
      } else {
        roster.push({ ...pick, quantity });
      }

      rawXp = roster.reduce((sum, creature) => sum + creature.xp * creature.quantity, 0);
      const adjusted = Math.floor(rawXp * xpMultiplier(roster.reduce((sum, c) => sum + c.quantity, 0)));
      if (adjusted > targetXp * 1.22) {
        break;
      }
    }

    const creatureCount = roster.reduce((sum, creature) => sum + creature.quantity, 0);
    const adjustedXp = Math.floor(rawXp * xpMultiplier(creatureCount));
    const distance = Math.abs(targetXp - adjustedXp);

    return { id: attempt + 1, roster, rawXp, adjustedXp, creatureCount, distance };
  }

  function difficultyLabel(adjustedXp, thresholds) {
    if (adjustedXp < thresholds.easy) return 'Trivial';
    if (adjustedXp < thresholds.medium) return 'Easy';
    if (adjustedXp < thresholds.hard) return 'Medium';
    if (adjustedXp < thresholds.deadly) return 'Hard';
    return 'Deadly+';
  }

  function renderEncounters(encounters, thresholds, targetXp, context) {
    if (!encounters.length) {
      summaryEl.classList.remove('placeholder');
      summaryEl.textContent = 'No encounter candidates found for your filters. Try a broader environment or lower difficulty.';
      resultsEl.innerHTML = '';
      return;
    }

    summaryEl.classList.remove('placeholder');
    summaryEl.innerHTML = `
      <strong>Party:</strong> ${context.size} adventurers (level ${context.level}) •
      <strong>Target:</strong> ${context.difficulty.toUpperCase()} (${targetXp.toLocaleString()} adjusted XP) •
      <strong>Thresholds:</strong> E ${thresholds.easy.toLocaleString()} / M ${thresholds.medium.toLocaleString()} /
      H ${thresholds.hard.toLocaleString()} / D ${thresholds.deadly.toLocaleString()}
    `;

    resultsEl.innerHTML = encounters
      .map((encounter) => {
        const label = difficultyLabel(encounter.adjustedXp, thresholds);
        const monsters = encounter.roster
          .map(
            (monster) => `
              <div class="monster-item">
                <strong>${monster.quantity}× ${monster.name}</strong>
                <div>CR ${monster.cr} • ${monster.xp.toLocaleString()} XP each</div>
              </div>
            `
          )
          .join('');

        return `
          <article class="encounter-card">
            <h3>Encounter Seed ${encounter.id}</h3>
            <div class="encounter-meta">
              <span class="enc-badge">${label}</span>
              <span class="enc-badge">${encounter.creatureCount} creatures</span>
              <span class="enc-badge">${encounter.adjustedXp.toLocaleString()} adjusted XP</span>
            </div>
            <div class="monster-grid">${monsters}</div>
          </article>
        `;
      })
      .join('');
  }


  function buildExpansionHooks(encounters, context) {
    if (!encounters.length) {
      return null;
    }

    const strongestEncounter = [...encounters].sort((a, b) => b.adjustedXp - a.adjustedXp)[0];
    const bossCandidate = [...strongestEncounter.roster].sort((a, b) => b.cr - a.cr)[0];
    const treasureIdeas = [
      randomItem(TREASURE_TABLE[context.difficulty] || TREASURE_TABLE.medium),
      randomItem(TREASURE_TABLE.medium),
      `${Math.max(1, strongestEncounter.creatureCount)} treasure parcels hidden across the battlefield`
    ];

    const narrativePool = [
      ...(NARRATIVE_PROMPTS[context.environment] || []),
      ...NARRATIVE_PROMPTS.any
    ];

    const pack = ENVIRONMENT_PACKS[context.environment] || ENVIRONMENT_PACKS.any;

    return {
      treasureIdeas,
      narrativeIdeas: [randomItem(narrativePool), randomItem(narrativePool), randomItem(narrativePool)],
      bossChassis: bossCandidate ? bossCandidate.name : 'Elite lieutenant',
      bossBehavior: randomItem(BOSS_BEHAVIORS),
      bossPhaseTwo: randomItem(BOSS_PHASE_EVENTS),
      bossPhaseThree: randomItem(BOSS_PHASE_EVENTS),
      lairActions: [randomItem(LAIR_ACTIONS), randomItem(LAIR_ACTIONS)],
      hazard: randomItem(pack.hazards),
      objective: randomItem(pack.objectives),
      twist: randomItem(pack.twists)
    };
  }


  function renderExpansionHooks(encounters, hooks) {
    if (!treasureEl || !narrativeEl || !bossEl || !environmentHooksEl) {
      return;
    }

    if (!encounters.length) {
      treasureEl.textContent = 'No encounters available yet. Generate seeds to produce treasure prompts.';
      narrativeEl.textContent = 'No encounters available yet. Generate seeds to produce narrative prompts.';
      bossEl.textContent = 'No encounters available yet. Generate seeds to draft a boss template.';
      environmentHooksEl.textContent = 'No encounters available yet. Generate seeds to produce environment twists.';
      treasureEl.classList.add('muted');
      narrativeEl.classList.add('muted');
      bossEl.classList.add('muted');
      environmentHooksEl.classList.add('muted');
      return;
    }

    treasureEl.classList.remove('muted');
    narrativeEl.classList.remove('muted');
    bossEl.classList.remove('muted');
    environmentHooksEl.classList.remove('muted');

    treasureEl.innerHTML = `<ul>${hooks.treasureIdeas.map((idea) => `<li>${idea}</li>`).join('')}</ul>`;
    narrativeEl.innerHTML = `<ul>${hooks.narrativeIdeas.map((idea) => `<li>${idea}</li>`).join('')}</ul>`;

    bossEl.innerHTML = `
      <p><strong>Boss Chassis:</strong> ${hooks.bossChassis} (${hooks.bossBehavior}).</p>
      <ol>
        <li><strong>Phase 1:</strong> Establish pressure and test player positioning.</li>
        <li><strong>Phase 2:</strong> At 60% HP, boss ${hooks.bossPhaseTwo}.</li>
        <li><strong>Phase 3:</strong> At 25% HP, boss ${hooks.bossPhaseThree} and risks everything.</li>
      </ol>
      <p><strong>Lair Actions:</strong> ${hooks.lairActions[0]}; ${hooks.lairActions[1]}.</p>
    `;

    environmentHooksEl.innerHTML = `
      <ul>
        <li><strong>Hazard:</strong> ${hooks.hazard}</li>
        <li><strong>Objective:</strong> ${hooks.objective}</li>
        <li><strong>Twist:</strong> ${hooks.twist}</li>
      </ul>
    `;
  }

  function estimateMonsterStats(cr) {
    const roundedCr = Math.max(0, Number(cr) || 0);
    const baseline = CR_BASELINE[roundedCr] || CR_BASELINE[Math.floor(roundedCr)] || CR_BASELINE[10];
    return {
      hp: baseline.hp,
      ac: baseline.ac,
      init: baseline.init
    };
  }

  function buildFoundryPayload() {
    if (!lastGenerated || !lastGenerated.encounters.length) {
      return null;
    }

    const encounter = lastGenerated.encounters[0];
    const monsters = encounter.roster.flatMap((monster) => Array.from({ length: monster.quantity }, (_, idx) => {
      const estimated = estimateMonsterStats(monster.cr);
      return {
        name: monster.quantity > 1 ? `${monster.name} ${idx + 1}` : monster.name,
        baseName: monster.name,
        cr: monster.cr,
        xp: monster.xp,
        estimated
      };
    }));

    return {
      exportMeta: {
        source: 'SKS Adventures Encounter Generator',
        foundryTarget: 'V13 Build 351',
        systemTarget: 'dnd5e 5.2.4',
        createdAt: new Date().toISOString()
      },
      context: lastGenerated.context,
      thresholds: lastGenerated.thresholds,
      encounter: {
        name: `SKS ${lastGenerated.context.environment.toUpperCase()} ${lastGenerated.context.difficulty.toUpperCase()} Encounter`,
        adjustedXp: encounter.adjustedXp,
        rawXp: encounter.rawXp,
        creatureCount: encounter.creatureCount,
        monsters
      },
      hooks: lastGenerated.hooks
    };
  }

  function buildFoundryMacro(payload) {
    const payloadText = JSON.stringify(payload, null, 2);
    return `const payload = ${payloadText};

const ensureFolder = async (name, type) => {
  const existing = game.folders.find((f) => f.type === type && f.name === name);
  return existing ?? Folder.create({ name, type, color: '#7cc7ff' });
};

const actorFolder = await ensureFolder('SKS Encounters', 'Actor');
const journalFolder = await ensureFolder('SKS Encounters', 'JournalEntry');

const actors = [];
for (const monster of payload.encounter.monsters) {
  const actor = await Actor.create({
    name: monster.name,
    type: 'npc',
    img: 'icons/svg/mystery-man.svg',
    folder: actorFolder.id,
    system: {
      details: { cr: monster.cr },
      attributes: {
        ac: { value: monster.estimated.ac },
        hp: { value: monster.estimated.hp, max: monster.estimated.hp },
        init: { bonus: monster.estimated.init }
      }
    },
    prototypeToken: {
      name: monster.name,
      disposition: -1,
      actorLink: false,
      randomImg: false
    }
  });
  actors.push({ actor, initBonus: monster.estimated.init });
}

let scene = canvas?.scene ?? game.scenes.current;
if (!scene) {
  scene = await Scene.create({
    name: payload.encounter.name,
    width: 3000,
    height: 2000,
    grid: { type: 1, size: 100 }
  });
}

const tokenDocs = actors.map(({ actor }, index) => ({
  name: actor.name,
  actorId: actor.id,
  x: 400 + (index % 6) * 160,
  y: 400 + Math.floor(index / 6) * 160,
  disposition: -1
}));

const createdTokens = await scene.createEmbeddedDocuments('Token', tokenDocs);
let combat = game.combats.viewed;
if (!combat || combat.scene?.id !== scene.id) {
  combat = await Combat.create({ scene: scene.id, active: true });
}

const combatants = await combat.createEmbeddedDocuments('Combatant', createdTokens.map((token) => ({
  tokenId: token.id,
  actorId: token.actorId
})));

await Promise.all(combatants.map((combatant, index) => {
  const initBonus = actors[index]?.initBonus ?? 0;
  const initiative = Math.floor(Math.random() * 20) + 1 + initBonus;
  return combatant.update({ initiative });
}));

const hookList = payload.hooks;
const journalContent = \
  '<h2>' + payload.encounter.name + '</h2>' +
  '<p><strong>Target Difficulty:</strong> ' + payload.context.difficulty.toUpperCase() + '</p>' +
  '<p><strong>Environment:</strong> ' + payload.context.environment + '</p>' +
  '<p><strong>Adjusted XP:</strong> ' + payload.encounter.adjustedXp.toLocaleString() + '</p>' +
  '<h3>Treasure Ideas</h3><ul>' + hookList.treasureIdeas.map((i) => '<li>' + i + '</li>').join('') + '</ul>' +
  '<h3>Narrative Hooks</h3><ul>' + hookList.narrativeIdeas.map((i) => '<li>' + i + '</li>').join('') + '</ul>' +
  '<h3>Boss Phases</h3>' +
  '<p><strong>Boss:</strong> ' + hookList.bossChassis + ' (' + hookList.bossBehavior + ')</p>' +
  '<ol>' +
  '<li><strong>Phase 1:</strong> Establish pressure and test player positioning.</li>' +
  '<li><strong>Phase 2:</strong> At 60% HP, boss ' + hookList.bossPhaseTwo + '.</li>' +
  '<li><strong>Phase 3:</strong> At 25% HP, boss ' + hookList.bossPhaseThree + ' and risks everything.</li>' +
  '</ol>' +
  '<p><strong>Lair Actions:</strong> ' + hookList.lairActions.join('; ') + '</p>' +
  '<h3>Environment Pack</h3>' +
  '<ul><li><strong>Hazard:</strong> ' + hookList.hazard + '</li><li><strong>Objective:</strong> ' + hookList.objective + '</li><li><strong>Twist:</strong> ' + hookList.twist + '</li></ul>';

await JournalEntry.create({
  name: payload.encounter.name + ' - Encounter Brief',
  folder: journalFolder.id,
  pages: [{
    name: 'Encounter Brief',
    type: 'text',
    text: { content: journalContent, format: 1 }
  }]
});

ui.notifications.info('SKS encounter imported: actors, tokens, combat tracker, and journal are ready.');
`;
  }

  function downloadFile(name, content, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function exportFoundryEncounter() {
    const payload = buildFoundryPayload();
    if (!payload) {
      if (exportStatusEl) {
        exportStatusEl.textContent = 'Generate encounters before exporting.';
      }
      return;
    }

    const slug = `${payload.context.environment}-${payload.context.difficulty}-${Date.now()}`;
    const macro = buildFoundryMacro(payload);
    downloadFile(`sks-foundry-import-${slug}.js`, macro, 'text/javascript');
    downloadFile(`sks-foundry-payload-${slug}.json`, JSON.stringify(payload, null, 2), 'application/json');

    if (exportStatusEl) {
      exportStatusEl.textContent = 'Downloaded Foundry macro + payload. Run the macro in Foundry V13 to create actors, tokens, initiative, and journal.';
    }
  }

  function generateEncounters(event) {
    event.preventDefault();

    const level = clamp(Number(levelEl.value) || 1, 1, 20);
    const size = clamp(Number(sizeEl.value) || 1, 1, 10);
    const difficulty = difficultyEl.value;
    const environment = environmentEl.value;

    levelEl.value = String(level);
    sizeEl.value = String(size);

    const thresholds = getThresholds(level, size);
    const targetXp = thresholds[difficulty];

    const filteredPool = monsterPool.filter((monster) => {
      const inEnvironment = environment === 'any' || monster.environments.includes(environment) || monster.environments.includes('any');
      const inCrRange = monster.cr <= level + 4 && monster.cr >= Math.max(0, level / 4 - 1);
      return inEnvironment && inCrRange;
    });

    const options = Array.from({ length: 5 }, (_, idx) => buildEncounterOption(filteredPool, targetXp, idx))
      .filter((encounter) => encounter.roster.length > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    const context = { level, size, difficulty, environment };
    const hooks = buildExpansionHooks(options, context);

    lastGenerated = {
      context,
      thresholds,
      targetXp,
      encounters: options,
      hooks
    };

    renderEncounters(options, thresholds, targetXp, context);
    renderExpansionHooks(options, hooks);

    if (exportBtnEl) {
      exportBtnEl.disabled = options.length === 0;
    }
    if (exportStatusEl) {
      exportStatusEl.textContent = options.length ? 'Ready to export best encounter for Foundry V13.' : 'No encounter available to export.';
    }
  }

  (async function init() {
    monsterPool = await loadMonsterPool();
    form.addEventListener('submit', generateEncounters);
    if (exportBtnEl) {
      exportBtnEl.addEventListener('click', exportFoundryEncounter);
    }
  })();
})();
