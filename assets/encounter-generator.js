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

  const SRD_MONSTER_LIST_ENDPOINT = 'https://www.dnd5eapi.co/api/2014/monsters';
  const SRD_MONSTER_API_BASE = 'https://www.dnd5eapi.co';
  const SRD_CACHE_KEY = 'sks-encounter-srd-monsters-v1';

  const form = document.getElementById('encounter-form');
  const levelEl = document.getElementById('party-level');
  const sizeEl = document.getElementById('party-size');
  const difficultyEl = document.getElementById('difficulty');
  const environmentEl = document.getElementById('environment');
  const focusEl = document.getElementById('encounter-focus');
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

  function parseArmorClass(value) {
    if (typeof value === 'number') return value;

    if (Array.isArray(value)) {
      const first = value.find((entry) => typeof entry === 'number' || typeof entry?.value === 'number');
      if (typeof first === 'number') return first;
      if (typeof first?.value === 'number') return first.value;
      return Number.NaN;
    }

    if (value && typeof value === 'object' && typeof value.value === 'number') {
      return value.value;
    }

    return Number(value);
  }

  function estimateInitiative(dexterity) {
    const dex = Number(dexterity);
    if (!Number.isFinite(dex)) return Number.NaN;
    return Math.floor((dex - 10) / 2);
  }

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

    const hp = Number(monster.hit_points ?? monster.hp);
    const ac = parseArmorClass(monster.armor_class ?? monster.ac);
    const init = Number(monster.init ?? estimateInitiative(monster.dexterity));

    return {
      name,
      cr,
      xp,
      environments,
      hp: Number.isFinite(hp) && hp > 0 ? hp : null,
      ac: Number.isFinite(ac) && ac > 0 ? ac : null,
      init: Number.isFinite(init) ? init : null
    };
  }

  async function loadSrdMonstersFromApi() {
    const listResponse = await fetch(SRD_MONSTER_LIST_ENDPOINT);
    if (!listResponse.ok) {
      throw new Error('Unable to load SRD monster list.');
    }

    const listData = await listResponse.json();
    const monsters = Array.isArray(listData?.results) ? listData.results : [];
    const detailed = (await Promise.all(monsters.map(async (entry) => {
      if (!entry?.url) return null;
      try {
        const response = await fetch(`${SRD_MONSTER_API_BASE}${entry.url}`);
        if (!response.ok) return null;
        const detail = await response.json();
        return normalizeMonster(detail);
      } catch (error) {
        return null;
      }
    }))).filter(Boolean);

    if (detailed.length) {
      localStorage.setItem(SRD_CACHE_KEY, JSON.stringify(detailed));
    }

    return detailed;
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
    } catch (error) {
      statusEl.textContent = 'Could not load local monster data. Trying SRD API...';
    }

    try {
      const cached = localStorage.getItem(SRD_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const normalizedCached = Array.isArray(parsed) ? parsed.map(normalizeMonster).filter(Boolean) : [];
        if (normalizedCached.length) {
          statusEl.textContent = `Loaded ${normalizedCached.length} monsters from cached SRD data.`;
          return normalizedCached;
        }
      }
    } catch (error) {
      localStorage.removeItem(SRD_CACHE_KEY);
    }

    try {
      const srdMonsters = await loadSrdMonstersFromApi();
      if (srdMonsters.length > 0) {
        statusEl.textContent = `Loaded ${srdMonsters.length} monsters from the SRD API.`;
        return srdMonsters;
      }
    } catch (error) {
      statusEl.textContent = 'SRD API unavailable. Using curated fallback roster.';
    }

    if (statusEl.textContent !== 'SRD API unavailable. Using curated fallback roster.') {
      statusEl.textContent = 'Local/SRD monster data unavailable. Using curated fallback roster.';
    }

    return FALLBACK_MONSTERS.map((monster) => normalizeMonster(monster)).filter(Boolean);
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

  function buildEncounterOption(pool, targetXp, attempt, focus = 'balanced') {
    const roster = [];
    const safePool = Array.isArray(pool) ? pool : [];

    if (!safePool.length) {
      return { id: attempt + 1, roster, rawXp: 0, adjustedXp: 0, creatureCount: 0, distance: targetXp };
    }

    if (focus === 'boss') {
      const sortedByCr = [...safePool].sort((a, b) => b.cr - a.cr);
      const boss = sortedByCr[0];
      const minionPool = safePool.filter((monster) => monster.name !== boss.name).sort((a, b) => a.cr - b.cr);
      if (boss) {
        roster.push({ ...boss, ...getMonsterStats(boss), quantity: 1 });
      }

      while (roster.length < 3 && minionPool.length) {
        const pick = minionPool[Math.floor(Math.random() * Math.min(minionPool.length, 8))];
        const existing = roster.find((entry) => entry.name === pick.name);
        if (existing) {
          existing.quantity += 1;
        } else {
          roster.push({ ...pick, ...getMonsterStats(pick), quantity: 1 });
        }

        const creatureCount = roster.reduce((sum, creature) => sum + creature.quantity, 0);
        const rawXp = roster.reduce((sum, creature) => sum + creature.xp * creature.quantity, 0);
        const adjusted = Math.floor(rawXp * xpMultiplier(creatureCount));
        if (adjusted > targetXp * 1.25) {
          break;
        }
      }
    } else if (focus === 'swarm') {
      const swarmPool = [...safePool].sort((a, b) => a.cr - b.cr).slice(0, Math.max(5, Math.floor(safePool.length * 0.45)));
      const maxCreatures = 4 + Math.floor(Math.random() * 4);
      while (roster.length < maxCreatures) {
        const pick = swarmPool[Math.floor(Math.random() * swarmPool.length)] || safePool[Math.floor(Math.random() * safePool.length)];
        if (!pick) break;
        const quantity = Math.random() > 0.35 ? 2 : 1;
        const existing = roster.find((entry) => entry.name === pick.name);
        if (existing) {
          existing.quantity += quantity;
        } else {
          roster.push({ ...pick, ...getMonsterStats(pick), quantity });
        }

        const creatureCount = roster.reduce((sum, creature) => sum + creature.quantity, 0);
        const rawXp = roster.reduce((sum, creature) => sum + creature.xp * creature.quantity, 0);
        const adjusted = Math.floor(rawXp * xpMultiplier(creatureCount));
        if (adjusted > targetXp * 1.18) {
          break;
        }
      }
    } else {
      const maxCreatures = 2 + Math.floor(Math.random() * 3);
      while (roster.length < maxCreatures) {
        const pick = safePool[Math.floor(Math.random() * safePool.length)];
        if (!pick) {
          break;
        }

        const quantity = Math.random() > 0.7 ? 2 : 1;
        const existing = roster.find((entry) => entry.name === pick.name);
        if (existing) {
          existing.quantity += quantity;
        } else {
          const stats = getMonsterStats(pick);
          roster.push({ ...pick, ...stats, quantity });
        }

        const creatureCount = roster.reduce((sum, c) => sum + c.quantity, 0);
        const rawXp = roster.reduce((sum, creature) => sum + creature.xp * creature.quantity, 0);
        const adjusted = Math.floor(rawXp * xpMultiplier(creatureCount));
        if (adjusted > targetXp * 1.22) {
          break;
        }
      }
    }

    const creatureCount = roster.reduce((sum, creature) => sum + creature.quantity, 0);
    const rawXp = roster.reduce((sum, creature) => sum + creature.xp * creature.quantity, 0);
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
      H ${thresholds.hard.toLocaleString()} / D ${thresholds.deadly.toLocaleString()} •
      <strong>Focus:</strong> ${context.focusLabel}
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

  function getMonsterStats(monster) {
    const explicitHp = Number(monster?.hp);
    const explicitAc = Number(monster?.ac);
    const explicitInit = Number(monster?.init);

    if (Number.isFinite(explicitHp) && Number.isFinite(explicitAc) && Number.isFinite(explicitInit)) {
      return { hp: explicitHp, ac: explicitAc, init: explicitInit };
    }

    const estimated = estimateMonsterStats(monster?.cr);
    return {
      hp: Number.isFinite(explicitHp) ? explicitHp : estimated.hp,
      ac: Number.isFinite(explicitAc) ? explicitAc : estimated.ac,
      init: Number.isFinite(explicitInit) ? explicitInit : estimated.init
    };
  }

  function buildEncounterExportPayload() {
    if (!lastGenerated || !lastGenerated.encounters.length) {
      return null;
    }

    const bestEncounter = lastGenerated.encounters[0];
    const hooks = lastGenerated.hooks;
    const monsters = bestEncounter.roster.map((monster) => {
      const estimated = getMonsterStats(monster);
      return {
        name: monster.name,
        count: monster.quantity,
        cr: monster.cr,
        hp: estimated.hp,
        ac: estimated.ac,
        init: estimated.init,
        xp: monster.xp
      };
    });

    const journal = {
      treasure: hooks?.treasureIdeas || [],
      narrativeHooks: hooks?.narrativeIdeas || [],
      bossBehavior: hooks ? `${hooks.bossChassis} ${hooks.bossBehavior}` : '',
      bossPhases: hooks ? [hooks.bossPhaseTwo, hooks.bossPhaseThree].filter(Boolean) : [],
      lairActions: hooks?.lairActions || [],
      environmentHazards: hooks ? [hooks.hazard, hooks.objective, hooks.twist].filter(Boolean) : []
    };

    const journalHtml = `
<h1>Encounter Brief</h1>
<p><strong>Difficulty:</strong> ${String(lastGenerated.context.difficulty || '').toUpperCase()}</p>
<p><strong>Environment:</strong> ${lastGenerated.context.environment || 'any'}</p>
<h2>Treasure Ideas</h2>
<ul>${journal.treasure.map((item) => `<li>${item}</li>`).join('') || '<li>None provided.</li>'}</ul>
<h2>Narrative Hooks</h2>
<ul>${journal.narrativeHooks.map((item) => `<li>${item}</li>`).join('') || '<li>None provided.</li>'}</ul>
<h2>Boss Behavior</h2>
<p>${journal.bossBehavior || 'None provided.'}</p>
<h2>Boss Phases</h2>
<ul>${journal.bossPhases.map((item) => `<li>${item}</li>`).join('') || '<li>None provided.</li>'}</ul>
<h2>Lair Actions</h2>
<ul>${journal.lairActions.map((item) => `<li>${item}</li>`).join('') || '<li>None provided.</li>'}</ul>
<h2>Environmental Hazards</h2>
<ul>${journal.environmentHazards.map((item) => `<li>${item}</li>`).join('') || '<li>None provided.</li>'}</ul>
`.trim();

    return {
      meta: {
        generator: 'SKS Encounter Generator',
        foundryVersion: 'v13 (Build 351+)',
        system: 'dnd5e 5.2.x',
        exportedAt: new Date().toISOString()
      },
      encounter: {
        name: `SKS ${lastGenerated.context.environment.toUpperCase()} ${lastGenerated.context.difficulty.toUpperCase()} Encounter`,
        difficulty: lastGenerated.context.difficulty,
        environment: lastGenerated.context.environment,
        partyLevel: lastGenerated.context.level,
        partySize: lastGenerated.context.size,
        adjustedXp: bestEncounter.adjustedXp,
        rawXp: bestEncounter.rawXp
      },
      monsters,
      journal,
      journalEntry: {
        name: `SKS ${lastGenerated.context.environment.toUpperCase()} ${lastGenerated.context.difficulty.toUpperCase()} Encounter - Encounter Brief`,
        pages: [
          {
            name: 'Encounter Brief',
            type: 'text',
            text: {
              format: 1,
              content: journalHtml
            }
          }
        ],
        flags: {
          sks: {
            contains: ['treasure', 'narrativeHooks', 'bossBehavior', 'bossPhases', 'lairActions', 'environmentHazards']
          }
        }
      }
    };
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeTag(value) {
    return String(value || '').trim().toLowerCase();
  }

  function toSentence(value) {
    const trimmed = String(value || '').trim();
    if (!trimmed) return '';
    const base = trimmed.replace(/[\s.]+$/, '');
    return `${base.charAt(0).toUpperCase()}${base.slice(1)}.`;
  }

  function dedupeList(items) {
    const seen = new Set();
    return (Array.isArray(items) ? items : [])
      .map((item) => String(item || '').trim())
      .filter((item) => {
        if (!item) return false;
        const key = item.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  function getMonsterArchetypes(monsters) {
    const tags = new Set();
    monsters.forEach((monster) => {
      const name = normalizeTag(monster.name);
      if (name.includes('orc')) tags.add('orc');
      if (name.includes('skeleton')) tags.add('skeleton');
      if (name.includes('gelatinous cube')) tags.add('gelatinous cube');
      if (name.includes('basilisk')) tags.add('basilisk');
      if (name.includes('goblin')) tags.add('goblin');
      if (name.includes('troll')) tags.add('troll');
      if (name.includes('air elemental')) tags.add('air elemental');
    });
    return tags;
  }

  function getEnvironmentReadAloud(environment, monsters, difficulty) {
    const env = normalizeTag(environment);
    const monsterNames = monsters.slice(0, 2).map((monster) => String(monster.name || '').trim()).filter(Boolean).join(' and ');
    const threat = normalizeTag(difficulty) === 'deadly' ? 'Every sound carries the promise of immediate violence.' : 'The air tightens as danger gathers nearby.';
    const byEnvironment = {
      dungeon: 'Stale air clings to old stone while torchlight gutters along cramped walls. Water beads in cracked mortar, and distant scraping rises through narrow corridors where every step feels boxed in.',
      underdark: 'Damp cavern air settles heavy in your lungs. Fungal light pulses across hanging stone, drops echo from unseen heights, and stretches of unnatural silence break only when rock shifts in the dark.',
      arctic: 'Windbite cuts through cloaks as drifting snow erases depth and distance. Ice creaks underfoot with every shift of weight, and the brittle stillness makes each exposed movement feel costly.',
      swamp: 'Rot and stagnant water sour the air. Insects drone over slick roots and fog-choked pools, while each uncertain foothold threatens to slide into black muck.',
      ruins: 'Broken arches claw at an open sky, and toppled masonry turns every route into unstable footing. Dust hangs over old carvings and collapsed halls where the stone remembers violence.'
    };
    const base = byEnvironment[env] || 'The battlefield feels wrong at first glance: sightlines break unexpectedly, footing shifts under pressure, and every approach has a hidden cost.';
    const rosterLine = monsterNames ? `Ahead, signs of ${monsterNames} mark where this space has already been claimed.` : 'Ahead, signs of a waiting threat mark where this space has already been claimed.';
    return `${base} ${rosterLine} ${threat}`;
  }

  function getScenePurpose(payload) {
    const env = normalizeTag(payload?.encounter?.environment);
    const archetypes = getMonsterArchetypes(Array.isArray(payload?.monsters) ? payload.monsters : []);
    const bullets = [];

    if (env === 'dungeon' || env === 'underdark' || archetypes.has('gelatinous cube')) bullets.push('Chokepoint defense that punishes careless movement and bunching.');
    if (env === 'swamp' || env === 'arctic' || env === 'ruins') bullets.push('Environmental hazard showcase where footing and visibility shape decisions.');
    if (archetypes.has('goblin') || archetypes.has('air elemental')) bullets.push('Ambush pressure that forces the party to protect exposed backline targets.');
    if (archetypes.has('troll') || archetypes.has('orc')) bullets.push('Resource drain through sustained front-line attrition.');
    if (archetypes.has('skeleton') || archetypes.has('basilisk')) bullets.push('Positional pressure that interrupts ideal movement and targeting.');

    bullets.push('Clue delivery through aftermath evidence and enemy positioning.');
    return dedupeList(bullets).slice(0, 4);
  }

  function getMonsterSynergy(monsters, environment) {
    const archetypes = getMonsterArchetypes(monsters);
    const lines = [];

    if (archetypes.has('orc')) lines.push('Orcs drive direct melee pressure and force immediate front-line commitments.');
    if (archetypes.has('skeleton')) lines.push('Skeletons hold lanes without morale checks, soaking actions that would otherwise hit priority threats.');
    if (archetypes.has('gelatinous cube')) lines.push('Gelatinous cubes deny corridor space, turning confined movement into engulf risk.');
    if (archetypes.has('basilisk')) lines.push('Basilisks create gaze pressure that punishes poor positioning and predictable approaches.');
    if (archetypes.has('goblin')) lines.push('Goblins harass from cover, reposition often, and disengage when direct pressure turns against them.');
    if (archetypes.has('troll')) lines.push('Trolls lock the party into sustained melee while regeneration threatens to win attrition.');
    if (archetypes.has('air elemental')) lines.push('Air elementals exploit mobility to isolate vulnerable targets and disrupt formation.');

    if (!lines.length && monsters.length) {
      lines.push('This roster works by combining focused attacks with terrain pressure to isolate weak positions.');
    }

    if (lines.length > 1) {
      lines.push(`In ${environment || 'this environment'}, these roles stack into layered pressure instead of isolated threats.`);
    }

    return dedupeList(lines);
  }

  function getQuickDmReminders(monsters) {
    const archetypes = getMonsterArchetypes(monsters);
    const reminders = [
      'Pick one party position to pressure each round and narrate that intent clearly.'
    ];
    if (archetypes.has('gelatinous cube')) reminders.push('Track corridor space carefully; cube threat is strongest when movement choices are narrow.');
    if (archetypes.has('basilisk')) reminders.push('Call out gaze and line-of-sight choices before players commit to movement.');
    if (archetypes.has('goblin') || archetypes.has('air elemental')) reminders.push('Reposition skirmishers often so ranged characters cannot free-fire safely.');
    if (archetypes.has('troll')) reminders.push('Telegraph regeneration pressure early so players understand the attrition clock.');
    if (archetypes.has('skeleton')) reminders.push('Use undead as lane anchors: simple choices, relentless pressure.');
    return dedupeList(reminders).slice(0, 5);
  }

  function describeMonsterRole(monsterName, environment) {
    const name = normalizeTag(monsterName);
    const env = normalizeTag(environment);

    if (name.includes('goblin')) return 'Skirmisher ambusher using cover and dirty disengages.';
    if (name.includes('orc')) return 'Shock infantry built to collapse one defensive lane at a time.';
    if (name.includes('skeleton')) return 'Undead line-holder that trades mobility for relentless pressure.';
    if (name.includes('zombie')) return 'Slow attrition brute that absorbs actions and pins chokepoints.';
    if (name.includes('gelatinous cube')) return 'Corridor denial hazard that turns movement mistakes into captures.';
    if (name.includes('basilisk')) return 'Zone controller threatening petrification through gaze exposure.';
    if (name.includes('air elemental')) return 'Mobile disrupter that isolates vulnerable targets.';
    if (name.includes('troll')) return 'Regenerating brawler that forces focused finishing damage.';
    if (name.includes('mind flayer')) return 'Controller specialist that combines positioning and psychic lockdown.';
    if (name.includes('dragon')) return 'Apex predator with burst turns and fear-driven battlefield control.';

    if (env === 'swamp') return 'Terrain opportunist using murk and difficult ground for tempo advantage.';
    if (env === 'arctic') return 'Cold-weather hunter that punishes overextension in exposed lanes.';
    return 'Pressures weak points and exploits any split in party formation.';
  }

  function buildSignatureActions(monster, environment, difficulty) {
    const count = Math.max(1, Number(monster?.count) || 1);
    const cr = Number(monster?.cr) || 0;
    const name = String(monster?.name || 'Creature');
    const safeName = escapeHtml(name);
    const accuracyBonus = 3 + Math.max(0, Math.floor(cr / 2));
    const saveDc = 11 + Math.max(0, Math.floor(cr / 2));
    const threatScale = difficulty === 'deadly' ? 1.2 : difficulty === 'hard' ? 1.1 : 1;
    const averageDamage = Math.max(4, Math.round((6 + cr * 2.5) * threatScale));
    const swingDamage = Math.max(averageDamage + 3, Math.round((8 + cr * 3.2) * threatScale));

    const environmentalFeat = {
      forest: 'Can bonus action Hide when lightly obscured by brush, roots, or canopy shadow.',
      swamp: 'Can move through nonmagical difficult terrain caused by mud or roots without extra movement cost.',
      dungeon: 'Has advantage on checks to detect intruders within 30 ft. of doors, halls, and intersections.',
      underdark: 'Ignores penalties from dim light and bioluminescent haze when making Perception checks.',
      urban: 'Can Dash as a bonus action while within 10 ft. of walls, carts, doors, or market clutter.',
      arctic: 'Reduces cold-weather travel penalties and ignores slippery ice penalties once per round.',
      any: 'Gains +2 to initiative while defending prepared ground.'
    };

    const featLine = environmentalFeat[normalizeTag(environment)] || environmentalFeat.any;

    const primaryAttack = `+${accuracyBonus} to hit; reach 5 ft. or range 30/120 ft.; one target. Hit: ${averageDamage} damage (adapt type to creature).`;
    const pressureAttack = `Recharge 5-6 or bloodied trigger: forces a DC ${saveDc} save or suffers ${Math.max(2, Math.floor(averageDamage / 2))} damage plus repositioning pressure.`;
    const commanderCallout = count > 1
      ? `Pack Coordination: while at least one ally of ${safeName} is adjacent to the target, add +${Math.min(4, 1 + Math.floor(count / 2))} damage once per turn.`
      : 'Solo Focus: when first bloodied, immediately repositions up to half speed without provoking opportunity attacks.';

    return {
      role: describeMonsterRole(name, environment),
      attackOne: primaryAttack,
      attackTwo: `${swingDamage >= 10 ? 'Heavy' : 'Swift'} Follow-Up: ${pressureAttack}`,
      feat: featLine,
      beat: commanderCallout
    };
  }

  function formatMonsterTable(monsters) {
    const rows = monsters.length
      ? monsters.map((monster) => `
<tr>
  <td>${escapeHtml(monster.name)}</td>
  <td>${escapeHtml(monster.count ?? '1')}</td>
  <td>${escapeHtml(monster.cr ?? '—')}</td>
  <td>${escapeHtml(monster.ac ?? '—')}</td>
  <td>${escapeHtml(monster.hp ?? '—')}</td>
  <td>${escapeHtml(monster.init ?? '—')}</td>
  <td>${escapeHtml(monster.xp ?? '—')}</td>
</tr>`).join('')
      : '<tr><td>None listed</td><td>0</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>';

    return `
<table>
  <tr>
    <th>Creature</th>
    <th>Count</th>
    <th>CR</th>
    <th>AC</th>
    <th>HP</th>
    <th>Initiative</th>
    <th>XP Each</th>
  </tr>${rows}
</table>
`.trim();
  }

  function formatBattlefieldFlow(payload) {
    const monsters = Array.isArray(payload?.monsters) ? payload.monsters : [];
    const environment = payload?.encounter?.environment || 'the area';
    const count = monsters.reduce((sum, monster) => sum + (Number(monster.count) || 1), 0);
    const opening = count >= 5
      ? 'Opening pressure comes from multiple threats forcing the party to split actions between survival and positioning.'
      : 'Opening pressure comes from focused threats trying to establish one decisive lane.';
    const mid = 'Mid-fight, enemies that survive first contact shift to isolate exposed targets or hold key routes while heavier hitters keep the front pinned.';
    const terrain = `Terrain in ${environment} should keep changing player choices: movement, line-of-sight, and retreat paths are never all safe at once.`;
    return `<ul><li>${escapeHtml(opening)}</li><li>${escapeHtml(mid)}</li><li>${escapeHtml(terrain)}</li></ul>`;
  }

  function formatEnvironmentalPressure(hazards, environment) {
    const uniqueHazards = dedupeList(hazards);
    if (!uniqueHazards.length) {
      return `<ul><li>${escapeHtml(`Use ${environment || 'the environment'} to force movement tradeoffs: safety, line-of-sight, and tempo should compete every round.`)}</li></ul>`;
    }

    return `<ul>${uniqueHazards.map((hazard) => {
      const text = toSentence(hazard) || hazard;
      return `<li>${escapeHtml(`If this pressure stays active, ${text.charAt(0).toLowerCase()}${text.slice(1)}`)}</li>`;
    }).join('')}</ul>`;
  }

  function formatAftermath(journal, encounter) {
    const treasureItems = dedupeList(journal?.treasure);
    const hooks = dedupeList(journal?.narrativeHooks);
    const hazardClues = dedupeList(journal?.environmentHazards);

    const treasureHtml = treasureItems.length
      ? `<ul style="padding-left:18px;">${treasureItems.map((item) => `<li>${escapeHtml(toSentence(item) || item)}</li>`).join('')}</ul>`
      : '<ul style="padding-left:18px;"><li>Scattered valuables and practical gear can be recovered from the site.</li></ul>';

    const finds = dedupeList([
      ...hooks.map((hook) => `Evidence tied to ${hook}`),
      ...hazardClues.map((hazard) => `Physical residue showing ${hazard}`),
      `Tracks and broken gear that show how the fight was staged in ${encounter?.environment || 'this area'}`
    ]).slice(0, 4);

    const leads = dedupeList([
      ...hooks,
      ...treasureItems,
      ...hazardClues
    ]).slice(0, 4).map((item) => `Following up on ${toSentence(item).toLowerCase()} could reveal the next active threat.`);

    return {
      treasureHtml,
      findsHtml: `<ul>${finds.map((item) => `<li>${escapeHtml(toSentence(item) || item)}</li>`).join('')}</ul>`,
      leadsHtml: leads.length
        ? `<ul>${leads.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : '<ul><li>A survivor or witness can point the party toward the next flashpoint.</li><li>Noise from this battle attracts another faction with immediate demands.</li></ul>'
    };
  }

  function getDangerSummary(payload) {
    const monsters = Array.isArray(payload?.monsters) ? payload.monsters : [];
    const environment = payload?.encounter?.environment || 'the area';
    const archetypes = getMonsterArchetypes(monsters);
    const count = monsters.reduce((sum, monster) => sum + (Number(monster.count) || 1), 0);
    const pressure = [];

    if (count >= 5) pressure.push('action economy');
    if (archetypes.has('gelatinous cube') || normalizeTag(environment) === 'dungeon' || normalizeTag(environment) === 'underdark') pressure.push('chokepoints');
    if (archetypes.has('basilisk')) pressure.push('line-of-sight pressure');
    if (archetypes.has('goblin') || archetypes.has('air elemental')) pressure.push('movement disruption');
    if (archetypes.has('troll') || archetypes.has('skeleton') || archetypes.has('orc')) pressure.push('attrition');

    const summaryBits = dedupeList(pressure);
    if (!summaryBits.length) {
      return `The real threat here is coordinated pressure in ${environment}: enemies force hard movement choices while terrain limits safe lines of attack.`;
    }

    return `The encounter leans on ${summaryBits.join(', ')} in ${environment}, forcing the party to choose between clean positioning and immediate survival.`;
  }

  function convertEncounterToFoundryJournal(payload) {
    if (!payload || !payload.encounter) {
      return null;
    }

    const encounterName = payload.encounter.name || 'SKS Encounter';
    const environment = payload.encounter.environment || 'any';
    const difficulty = String(payload.encounter.difficulty || 'medium');
    const partyLevel = payload.encounter.partyLevel ?? 'Unknown';
    const partySize = payload.encounter.partySize ?? 'Unknown';
    const monsters = Array.isArray(payload.monsters) ? payload.monsters : [];
    const adjustedXp = payload.encounter.adjustedXp;
    const rawXp = payload.encounter.rawXp;

    const scenePurpose = getScenePurpose(payload);
    const readAloud = getEnvironmentReadAloud(environment, monsters, difficulty);
    const dangerSummary = getDangerSummary(payload);
    const behaviorLines = getMonsterSynergy(monsters, environment);
    const reminders = getQuickDmReminders(monsters);
    const battlefieldFlowHtml = formatBattlefieldFlow(payload);
    const hazardHtml = formatEnvironmentalPressure(payload.journal?.environmentHazards, environment);
    const aftermath = formatAftermath(payload.journal || {}, payload.encounter || {});

    const encounterSummaryDetails = [
      `<div><strong>Environment:</strong> ${escapeHtml(environment)}</div>`,
      `<div><strong>Difficulty:</strong> ${escapeHtml(difficulty)}</div>`,
      `<div><strong>Party Level:</strong> ${escapeHtml(partyLevel)}</div>`,
      `<div><strong>Party Size:</strong> ${escapeHtml(partySize)}</div>`,
      adjustedXp != null ? `<div><strong>Adjusted XP:</strong> ${escapeHtml(adjustedXp)}</div>` : '',
      rawXp != null ? `<div><strong>Raw XP:</strong> ${escapeHtml(rawXp)}</div>` : ''
    ].filter(Boolean).join('');

    const overviewHtml = `
<div style="border:1px solid #5a4a34;padding:14px;border-radius:10px;background:linear-gradient(180deg,#1a1a1a,#121212);color:#d9d2c3;box-shadow:0 0 0 1px #24201a inset;">
  <h1 style="margin:0 0 8px 0;color:#e8ddc9;">${escapeHtml(encounterName)}</h1>
  ${encounterSummaryDetails}
</div>
<hr>
<h2>Scene Purpose</h2>
<ul>
  ${scenePurpose.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
</ul>
<hr>
<h2>Read Aloud</h2>
<blockquote>
  <p>${escapeHtml(readAloud)}</p>
</blockquote>
<hr>
<h2>What Makes This Dangerous</h2>
<p>${escapeHtml(dangerSummary)}</p>
`.trim();

    const formatMonsterLabel = (monster) => {
      const dataName = String(monster?.name || '').trim();
      return `<span data-compendium-name="${escapeHtml(dataName)}">${escapeHtml(dataName || 'Unknown Creature')}</span>`;
    };

    const monsterRows = monsters.length
      ? monsters.map((monster) => `
<tr>
  <td>${formatMonsterLabel(monster)}</td>
  <td>${escapeHtml(monster.count ?? '1')}</td>
  <td>${escapeHtml(monster.cr ?? '—')}</td>
  <td>${escapeHtml(monster.ac ?? '—')}</td>
  <td>${escapeHtml(monster.hp ?? '—')}</td>
  <td>${escapeHtml(monster.init ?? '—')}</td>
  <td>${escapeHtml(monster.xp ?? '—')}</td>
</tr>`).join('')
      : '<tr><td>None listed</td><td>0</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td></tr>';

    const attackProfiles = monsters.map((monster) => {
      const profile = buildSignatureActions(monster, environment, difficulty);
      return `
<article style="border:1px solid #3a3024;border-radius:8px;padding:10px;margin-bottom:10px;background:#161411;color:#dbcfb9;">
  <h3 style="margin:0 0 6px 0;">${escapeHtml(monster.name || 'Unknown Creature')} — Signature Kit</h3>
  <p style="margin:0 0 6px 0;"><strong>Combat Role:</strong> ${escapeHtml(profile.role)}</p>
  <ul style="margin:0 0 6px 0;padding-left:18px;">
    <li><strong>Signature Attack:</strong> ${escapeHtml(profile.attackOne)}</li>
    <li><strong>Pressure Move:</strong> ${escapeHtml(profile.attackTwo)}</li>
    <li><strong>Creative Feat:</strong> ${escapeHtml(profile.feat)}</li>
    <li><strong>Tactical Beat:</strong> ${escapeHtml(profile.beat)}</li>
  </ul>
</article>`;
    }).join('');

    const monstersHtml = `
<h2>⚔ Encounter Roster</h2>
<table>
  <tr>
    <th>Creature</th>
    <th>Count</th>
    <th>CR</th>
    <th>AC</th>
    <th>HP</th>
    <th>Initiative</th>
    <th>XP Each</th>
  </tr>
  ${monsterRows}
</table>
<hr>
<h2>Behavior and Tactics</h2>
<ul>
  ${behaviorLines.map((line) => `<li>${escapeHtml(line)}</li>`).join('') || `<li>${escapeHtml('Use the roster to pressure one lane at a time and force hard movement choices.')}</li>`}
</ul>
<h3>Quick DM Reminders</h3>
<ul>
  ${reminders.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}
</ul>
<hr>
<h2>Signature Attacks & Creative Feats</h2>
${attackProfiles || `<p>${escapeHtml('No monster signatures were generated for this roster.')}</p>`}
`.trim();

    const runningHtml = `
<h2>Battlefield Flow</h2>
${battlefieldFlowHtml}
<hr>
<h2>Environmental Pressure</h2>
${hazardHtml}
<hr>
<h2>Pacing and Escalation</h2>
<ul>
  <li>${escapeHtml('If the party dominates quickly, let noise draw a nearby threat or cut off a safe retreat lane.')}</li>
  <li>${escapeHtml('If the fight stalls, reveal a second route or shift the battlefield so static positions become risky.')}</li>
  <li>${escapeHtml('If the environment is ignored, trigger a late hazard beat that forces immediate repositioning.')}</li>
</ul>
`.trim();

    const treasureHtml = `
<h2>Treasure</h2>
<div style="border:1px solid #3d3326;padding:10px;border-radius:8px;background:#171512;color:#d8cfbe;">
  ${aftermath.treasureHtml}
</div>
<hr>
<h2>What the Party Finds</h2>
${aftermath.findsHtml}
<hr>
<h2>Where This Leads Next</h2>
${aftermath.leadsHtml}
`.trim();

    const hiddenContext = dedupeList(payload.journal?.narrativeHooks);
    const complications = dedupeList([
      ...(Array.isArray(payload.journal?.lairActions) ? payload.journal.lairActions : []),
      ...(Array.isArray(payload.journal?.bossPhases) ? payload.journal.bossPhases : [])
    ]);
    const escalation = dedupeList([
      payload.journal?.bossBehavior,
      ...(Array.isArray(payload.journal?.environmentHazards) ? payload.journal.environmentHazards : [])
    ]);
    const clueDelivery = dedupeList([
      ...hiddenContext.map((item) => `Clues in the scene point to ${item}`),
      ...complications.map((item) => `NPC reactions and battlefield changes reveal ${item}`)
    ]).slice(0, 4);

    const gmSections = [];
    if (hiddenContext.length) gmSections.push(`<h3>Hidden Context</h3><ul>${hiddenContext.map((note) => `<li>${escapeHtml(toSentence(note) || note)}</li>`).join('')}</ul>`);
    if (complications.length) gmSections.push(`<h3>Complications</h3><ul>${complications.map((note) => `<li>${escapeHtml(toSentence(note) || note)}</li>`).join('')}</ul>`);
    if (escalation.length) gmSections.push(`<h3>Escalation</h3><ul>${escalation.map((note) => `<li>${escapeHtml(toSentence(note) || note)}</li>`).join('')}</ul>`);
    if (clueDelivery.length) gmSections.push(`<h3>Clue Delivery</h3><ul>${clueDelivery.map((note) => `<li>${escapeHtml(toSentence(note) || note)}</li>`).join('')}</ul>`);

    const gmNotesHtml = `
<section class="secret">
  <h2>🧠 GM Secrets</h2>
  ${gmSections.length ? gmSections.join('<hr>') : '<p>No additional secret notes were generated for this encounter.</p>'}
</section>
`.trim();

    return {
      name: encounterName,
      pages: [
        { name: 'Overview', type: 'text', text: { format: 1, content: overviewHtml } },
        { name: 'Monsters', type: 'text', text: { format: 1, content: monstersHtml } },
        { name: 'Running the Fight', type: 'text', text: { format: 1, content: runningHtml } },
        { name: 'Rewards and Aftermath', type: 'text', text: { format: 1, content: treasureHtml } },
        { name: 'GM Notes', type: 'text', text: { format: 1, content: gmNotesHtml } }
      ],
      ownership: {
        default: 0
      }
    };
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
    const payload = buildEncounterExportPayload();
    const journalDocument = convertEncounterToFoundryJournal(payload);
    if (!journalDocument) {
      if (exportStatusEl) {
        exportStatusEl.textContent = 'Generate encounters before exporting.';
      }
      return;
    }

    downloadFile('sks-encounter-foundry.json', JSON.stringify(journalDocument, null, 2), 'application/json');

    if (exportStatusEl) {
      exportStatusEl.textContent = 'Downloaded sks-encounter-foundry.json as a Foundry JournalEntry (v13).';
    }
  }

  function generateEncounters(event) {
    event.preventDefault();

    const level = clamp(Number(levelEl.value) || 1, 1, 20);
    const size = clamp(Number(sizeEl.value) || 1, 1, 10);
    const difficulty = difficultyEl.value;
    const environment = environmentEl.value;
    const focus = focusEl ? focusEl.value : 'balanced';

    levelEl.value = String(level);
    sizeEl.value = String(size);

    const thresholds = getThresholds(level, size);
    const targetXp = thresholds[difficulty];

    const filteredPool = monsterPool.filter((monster) => {
      const inEnvironment = environment === 'any' || monster.environments.includes(environment) || monster.environments.includes('any');
      const inCrRange = monster.cr <= level + 4 && monster.cr >= Math.max(0, level / 4 - 1);
      return inEnvironment && inCrRange;
    });

    const options = Array.from({ length: 6 }, (_, idx) => buildEncounterOption(filteredPool, targetXp, idx, focus))
      .filter((encounter) => encounter.roster.length > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    const focusLabel = focus === 'boss' ? 'Boss + Minions' : focus === 'swarm' ? 'Swarm Skirmish' : 'Balanced Mix';
    const context = { level, size, difficulty, environment, focus, focusLabel };
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
      exportStatusEl.textContent = options.length ? 'Ready to export to Foundry Journal (v13).' : 'No encounter available to export.';
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
