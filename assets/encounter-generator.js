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

  let monsterPool = [];

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

    renderEncounters(options, thresholds, targetXp, { level, size, difficulty });
  }

  (async function init() {
    monsterPool = await loadMonsterPool();
    form.addEventListener('submit', generateEncounters);
  })();
})();
