const STORAGE_KEY = 'sks-monster-studio-v1';

const CR_OPTIONS = ['0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

const FOUNDATION_FLAGS = {
  foundryHint: {
    actorType: 'npc',
    compatibleTemplate: 'foundry/json-components/npc-actor.template.json',
    exportReady: false,
  },
};

const PRESETS = {
  'Beast Stalker': { name: 'Duskmaw Prowler', subtitle: 'Large beast, unaligned', role: 'ambusher', cr: '4', environment: 'forest, grassland', origin: 'primal', ac: 14, hp: 76, speed: { walk: 40, climb: 20 }, abilities: { str: 18, dex: 14, con: 16, int: 3, wis: 13, cha: 8 }, attacks: [{ name: 'Rending Claw', kind: 'Melee Weapon Attack', theme: 'claws', toHit: '+6', range: 'reach 5 ft.', target: 'one target', hit: '12 (2d6 + 5) slashing damage', damage: '2d6+5', damageType: 'slashing' }], actions: [{ name: 'Pounce', description: 'If the prowler moves at least 20 feet straight toward a creature then hits with claw, target must succeed on DC 14 Strength save or be knocked prone.' }] },
  'Undead Horror': { name: 'Crypt Warden', subtitle: 'Medium undead, lawful evil', role: 'defender', cr: '7', environment: 'dungeon, graveyard', origin: 'undead', ac: 17, hp: 128, speed: { walk: 30 }, abilities: { str: 19, dex: 11, con: 19, int: 10, wis: 12, cha: 15 }, resistances: ['necrotic', 'bludgeoning, piercing, and slashing from nonmagical attacks'], immunities: ['poison'], conditionImmunities: ['poisoned', 'exhaustion'], attacks: [{ name: 'Grave Halberd', kind: 'Melee Weapon Attack', theme: 'polearm', toHit: '+8', range: 'reach 10 ft.', target: 'one target', hit: '15 (2d10 + 4) slashing plus 7 (2d6) necrotic', damage: '2d10+4', damageType: 'slashing', secondaryDamage: '2d6 necrotic' }] },
  'Arcane Controller': { name: 'Moonglass Arcanist', subtitle: 'Medium humanoid (elf), neutral', role: 'controller', cr: '9', environment: 'urban, ruins', origin: 'fey-touched', ac: 15, hp: 110, speed: { walk: 30 }, abilities: { str: 9, dex: 14, con: 14, int: 19, wis: 15, cha: 16 }, spellcasting: [{ name: 'Innate Spellcasting', description: 'Spell save DC 17, +9 to hit. At will: mage hand, ray of frost. 3/day: hypnotic pattern, lightning bolt. 1/day: chain lightning.' }] },
  'Sky Tyrant': { name: 'Tempest Crown Roc', subtitle: 'Huge monstrosity, neutral evil', role: 'artillery', cr: '11', environment: 'mountain, coastal', origin: 'stormbound', ac: 17, hp: 172, speed: { walk: 20, fly: 80 }, abilities: { str: 23, dex: 16, con: 20, int: 8, wis: 15, cha: 12 } },
  'Planar Juggernaut': { name: 'Aether Bastion', subtitle: 'Large construct, lawful neutral', role: 'defender', cr: '13', environment: 'planar, ruins', origin: 'clockwork', ac: 20, hp: 210, speed: { walk: 30 }, abilities: { str: 24, dex: 10, con: 23, int: 12, wis: 16, cha: 9 } },
  'Swamp Ambusher': { name: 'Bogveil Lurker', subtitle: 'Large monstrosity, chaotic neutral', role: 'ambusher', cr: '6', environment: 'swamp, forest', origin: 'cursed', ac: 15, hp: 104, speed: { walk: 30, swim: 40 }, abilities: { str: 18, dex: 16, con: 17, int: 6, wis: 14, cha: 8 } },
  'Abyss Captain': { name: 'Chainbrand Despot', subtitle: 'Medium fiend, lawful evil', role: 'support', cr: '10', environment: 'dungeon, planar, urban', origin: 'infernal', ac: 18, hp: 145, speed: { walk: 30 }, abilities: { str: 17, dex: 14, con: 18, int: 16, wis: 13, cha: 20 } },
  'Fey Duelist': { name: 'Thorncourt Bladedancer', subtitle: 'Medium fey, chaotic good', role: 'skirmisher', cr: '8', environment: 'forest, planar', origin: 'fey-touched', ac: 18, hp: 123, speed: { walk: 40 }, abilities: { str: 12, dex: 22, con: 14, int: 15, wis: 14, cha: 18 } },
  'Deep Delver': { name: 'Gravelung Tunneler', subtitle: 'Huge aberration, unaligned', role: 'brute', cr: '9', environment: 'underdark, dungeon', origin: 'void', ac: 16, hp: 168, speed: { walk: 20, burrow: 40 }, abilities: { str: 22, dex: 8, con: 21, int: 5, wis: 11, cha: 6 } },
};

const ATTACK_THEMES = ['longsword', 'great axe', 'spear', 'dagger', 'bow', 'crossbow', 'claws', 'bite', 'tail', 'tentacle', 'slam', 'gore', 'necrotic blast', 'frost shard', 'moonlit strike', 'shadow lash'];

const RANDOM_BY_CR = {
  '1/2': ['Mire Gnawer', 'Shrine Kobold Adept', 'Rime Bat'],
  '2': ['Bogscale Marauder', 'Sunken Crypt Mage', 'Cinder Horn Boar'],
  '5': ['Duskhollow Basilisk', 'Ironwood Sentinel', 'Stormbound Warden'],
  '10': ['Umbral War Matron', 'Abyssal Oracle', 'Frostspire Tyrant'],
  '15': ['Star-Eater Chimera', 'Prince of Verdigris Chains', 'Cathedral Leviathan'],
};



const RANDOM_STYLES = {
  balanced: 'Balanced',
  horror: 'Horror',
  elemental: 'Elemental',
  aberrant: 'Aberrant',
  celestial: 'Celestial',
  swarm: 'Swarm',
  draconic: 'Draconic',
  infernal: 'Infernal',
  feywild: 'Feywild',
  aquatic: 'Aquatic',
};

const SIZE_OPTIONS = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];
const MONSTER_TYPES = ['aberration', 'beast', 'celestial', 'construct', 'dragon', 'elemental', 'fey', 'fiend', 'giant', 'humanoid', 'monstrosity', 'ooze', 'plant', 'undead'];
const ALIGNMENTS = ['lawful good', 'neutral good', 'chaotic good', 'lawful neutral', 'neutral', 'chaotic neutral', 'lawful evil', 'neutral evil', 'chaotic evil', 'unaligned'];
const ORIGINS = ['primal', 'arcane', 'divine', 'cursed', 'void', 'fey-touched', 'infernal', 'clockwork', 'stormbound', 'shadow', 'draconic'];
const ENVIRONMENTS = ['arctic', 'coastal', 'desert', 'dungeon', 'forest', 'grassland', 'mountain', 'swamp', 'underdark', 'underwater', 'urban', 'volcanic', 'badlands', 'ruins', 'graveyard', 'planar'];
const ROLES = ['brute', 'skirmisher', 'controller', 'artillery', 'support', 'defender', 'boss', 'ambusher'];
const DAMAGE_TYPES = ['slashing', 'piercing', 'bludgeoning', 'fire', 'cold', 'lightning', 'thunder', 'acid', 'poison', 'necrotic', 'radiant', 'psychic', 'force'];
const CONDITIONS = ['blinded', 'charmed', 'deafened', 'frightened', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned'];
const SENSE_OPTIONS = ['darkvision 60 ft.', 'darkvision 120 ft.', 'blindsight 10 ft.', 'blindsight 30 ft.', 'tremorsense 30 ft.', 'truesight 60 ft.'];
const LANGUAGE_OPTIONS = ['Common', 'Draconic', 'Infernal', 'Abyssal', 'Celestial', 'Sylvan', 'Primordial', 'Deep Speech', 'Undercommon', 'Aquan', 'telepathy 60 ft.'];

const STYLE_PROFILES = {
  balanced: { names: ['Riftclaw Predator', 'Moonfen Howler', 'Runic Bastion', 'Ashcoil Ravager', 'Stonevein Brute', 'Glasswing Manticore'], traits: ['Battle-hardened', 'Adaptive', 'Relentless'], actions: ['Crushing Advance', 'Tactical Feint', 'Break Formation'], flavor: ['Disciplined hunter', 'Ruin-forged enforcer', 'Territorial apex creature'] },
  horror: { names: ['Whispering Ossuary', 'Gloam-Eyed Collector', 'Pale Mire Widow', 'Hollow Choir Horror', 'Dread Lantern Wretch'], traits: ['Aura of Dread', 'Unnerving Presence', 'Body Horror'], actions: ['Devouring Scream', 'Harvest Memory', 'Grave Pull'], flavor: ['Feeds on fear', 'Stalks isolated prey', 'Turns battlefields into nightmares'] },
  elemental: { names: ['Tempest-Core Myrmidon', 'Cinderwake Serpent', 'Tidelash Colossus', 'Shiverglass Golem', 'Thunderbrand Roc'], traits: ['Elemental Flux', 'Living Storm', 'Fused Core'], actions: ['Elemental Surge', 'Seismic Pulse', 'Flash Freeze'], flavor: ['Raw elemental force given hunger', 'A conduit for planar weather', 'Unstable and catastrophic'] },
  aberrant: { names: ['Nexuspore Seer', 'Violet Maw Savant', 'Mindrift Stalker', 'Orbit-Eye Devourer', 'Warpfold Anatomist'], traits: ['Reality Distortion', 'Psionic Feedback', 'Impossible Anatomy'], actions: ['Mind Lance', 'Spatial Twist', 'Neural Collapse'], flavor: ['Alien intelligence with predatory curiosity', 'Warps local geometry', 'Hears thoughts as music'] },
  celestial: { names: ['Dawnward Justicar', 'Star-Vigil Seraph', 'Mercybrand Exemplar', 'Sunshard Arbiter', 'Choirblade Guardian'], traits: ['Radiant Ward', 'Beacon of Judgment', 'Blessed Aegis'], actions: ['Solar Verdict', 'Purging Lance', 'Heavenly Rebuke'], flavor: ['Serves an ancient vow', 'Punishes oathbreakers', 'Balances wrath and grace'] },
  swarm: { names: ['Gnashcloud Swarm-Lord', 'Thousand-Fang Cluster', 'Skittermass Regent', 'Needlewing Brood', 'Carrion Bloom Hive'], traits: ['Swarm Body', 'Overrun', 'Hive Mind'], actions: ['Razor Flood', 'Brood Spill', 'Consume Supplies'], flavor: ['Acts as one body', 'Devours terrain and morale', 'Grows stronger near corpses'] },
  draconic: { names: ['Emberspire Scion', 'Verdant Scale Tyrant', 'Nightglass Drake', 'Cataclysm Wyrmlord', 'Crownfire Broodqueen'], traits: ['Ancient Scale Ward', 'Draconic Majesty', 'Hoard Instinct'], actions: ['Breath of Dominion', 'Tailquake Rupture', 'Wingstorm'], flavor: ['Seeks tribute and domination', 'Treats battle as a declaration of lineage', 'Unleashes area devastation'] },
  infernal: { names: ['Ash-Contract Reaver', 'Hellchain Inquisitor', 'Brimstone Debt Collector', 'Censer of Ruin', 'Iron Sigil Tormentor'], traits: ['Infernal Contract', 'Hellfire Brand', 'Cruel Precision'], actions: ['Soul Lien Strike', 'Chains of Damnation', 'Scalding Verdict'], flavor: ['Manipulates foes through fear and bargains', 'Marks prey with infernal seals', 'Punishes oathbreakers mercilessly'] },
  feywild: { names: ['Laughing Briar Duchess', 'Mirrorgrove Trickster', 'Moonpetal Huntmaster', 'Thorn Masque Herald', 'Velvet Antler Regent'], traits: ['Glamour Veil', 'Capricious Step', 'Moonlit Grace'], actions: ['Prismatic Snare', 'Bewildering Waltz', 'Dreamthorn Volley'], flavor: ['Fights like a cruel dance', 'Delights in misdirection', 'Rewards clever roleplay'] },
  aquatic: { names: ['Abyss Current Oracle', 'Drownsong Leviathan', 'Coral Fanged Matron', 'Saltwake Executioner', 'Trenchlight Devourer'], traits: ['Pressure Skin', 'Tidal Adaptation', 'Drowncaller Aura'], actions: ['Riptide Crush', 'Saltburst Javelin', 'Undertow Drag'], flavor: ['Controls battlefield flow like currents', 'Drags victims out of formation', 'Strikes then vanishes into mist and spray'] },
};

const formEl = document.getElementById('monster-form');
const statusEl = document.getElementById('studio-status');

let monster = createDefaultMonster();

init();

function createDefaultMonster() {
  return {
    schemaVersion: 1,
    identity: {
      name: 'Ashenfang Matriarch',
      subtitle: 'Huge monstrosity, chaotic evil',
      size: 'Huge',
      type: 'monstrosity',
      tags: 'predator, alpha',
      alignment: 'chaotic evil',
      environment: 'mountain, volcanic, badlands',
      role: 'boss',
      cr: '12',
      origin: 'cursed',
    },
    core: {
      ac: 18,
      hp: 225,
      hitDice: '18d12 + 108',
      speed: { walk: 40, climb: 20, swim: 0, burrow: 0, fly: 30, hover: false },
      abilities: { str: 24, dex: 14, con: 23, int: 8, wis: 15, cha: 16 },
      proficiencyBonus: 4,
      initiativeBonus: 2,
      passivePerception: 18,
    },
    defense: {
      savingThrows: ['Str +11', 'Con +10', 'Wis +7'],
      skills: ['Perception +8', 'Stealth +6', 'Survival +7'],
      vulnerabilities: [],
      resistances: ['fire', 'bludgeoning/piercing/slashing from nonmagical attacks'],
      immunities: [],
      conditionImmunities: ['frightened'],
      senses: 'darkvision 120 ft., tremorsense 30 ft.',
      languages: 'Common, Draconic',
      telepathy: '60 ft.',
    },
    combat: {
      traits: [{ name: 'Molten Hide', category: 'Trait', description: 'A creature that touches the matriarch or hits it with a melee attack while within 5 ft. takes 5 (1d10) fire damage.', saveDc: '', recharge: '', usage: '', trigger: '' }],
      actions: [{ name: 'Inferno Roar', category: 'Action', description: 'Each creature of the matriarch’s choice within 30 ft. must make a DC 18 Wisdom save or be frightened until end of its next turn.', saveDc: '18 Wis', recharge: '5-6', usage: '', trigger: '' }],
      bonusActions: [],
      reactions: [{ name: 'Scorching Riposte', category: 'Reaction', description: 'When hit by a melee attack, the matriarch lashes out with embers. Attacker takes 7 (2d6) fire damage.', saveDc: '', recharge: '', usage: '3/day', trigger: 'When hit by a melee attack' }],
      legendaryActions: [{ name: 'Wing Buffet', category: 'Legendary', description: 'The matriarch beats its wings. Creatures within 10 ft. must succeed on DC 18 Dexterity save or be knocked prone.', saveDc: '18 Dex', recharge: '', usage: 'Costs 2 actions', trigger: '' }],
      lairActions: [],
      mythic: [],
      attacks: [{ name: 'Volcanic Bite', kind: 'Melee Weapon Attack', theme: 'bite', toHit: '+11', range: 'reach 10 ft.', target: 'one target', hit: '19 (2d10 + 8) piercing plus 10 (3d6) fire damage', damage: '2d10+8', damageType: 'piercing', secondaryDamage: '3d6 fire', save: '', rider: 'Target cannot regain hit points until start of matriarch’s next turn.', styleNote: '', recharge: '', multiattackGroup: 'Multiattack' }],
      spellcasting: [{ name: 'Ashen Blood Magic', description: 'Spell save DC 16, +8 to hit. 3/day each: fireball, wall of fire. 1/day: dominate monster.' }],
    },
    flavor: {
      summary: 'A tyrant predator born from a dragon grave and volcanic curse.',
      appearance: 'A horned beast plated in obsidian scales split with orange magma cracks.',
      behavior: 'Patient hunter that marks prey trails with scorched sigils.',
      tactics: 'Opens with fear effects, isolates targets, then shreds frontliners.',
      habitat: 'Volcanic caverns, ruined fortresses, and cursed calderas.',
      encounterIdeas: 'Guards a relic-forged egg clutch beneath an active mountain shrine.',
      loot: 'Heartstone Ember, obsidian warplate fragments, map to elemental fissure vault.',
      gmNotes: 'Its roar can collapse unstable terrain and create new hazards each round.',
      readAloud: 'The cavern floor sweats fire as a hulking silhouette unfolds from black smoke. Molten eyes snap toward you, and the air itself begins to burn.',
    },
    ...FOUNDATION_FLAGS,
  };
}

function init() {
  populateSelects();
  renderForm();
  renderPreview();

  document.querySelectorAll('.preview-tab').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.getElementById('apply-preset').addEventListener('click', applyPreset);
  document.getElementById('randomize-monster').addEventListener('click', randomFromCr);
  document.getElementById('save-local').addEventListener('click', saveLocal);
  document.getElementById('load-local').addEventListener('click', loadLocal);
  document.getElementById('export-json').addEventListener('click', exportJson);
  document.getElementById('export-foundry-json').addEventListener('click', exportFoundryNpcJson);
  document.getElementById('import-json').addEventListener('change', importJson);
}

function populateSelects() {
  const presetSelect = document.getElementById('preset-select');
  presetSelect.innerHTML = Object.keys(PRESETS).map((key) => `<option value="${key}">${key}</option>`).join('');
  const randomCr = document.getElementById('random-cr');
  randomCr.innerHTML = CR_OPTIONS.map((cr) => `<option value="${cr}">CR ${cr}</option>`).join('');
  randomCr.value = '5';

  const randomStyle = document.getElementById('random-style');
  randomStyle.innerHTML = Object.entries(RANDOM_STYLES).map(([key, label]) => `<option value="${key}">${label}</option>`).join('');
  randomStyle.value = 'balanced';
}

function renderForm() {
  formEl.innerHTML = '';
  formEl.append(section('Monster Identity', true, renderIdentityFields()));
  formEl.append(section('Core Stats', true, renderCoreFields()));
  formEl.append(section('Defensive Traits', false, renderDefenseFields()));
  formEl.append(section('Combat Features', true, renderCombatFields()));
  formEl.append(section('Flavor & Narrative', false, renderFlavorFields()));

  formEl.querySelectorAll('input, textarea, select').forEach((el) => {
    el.addEventListener('input', handleInputChange);
    el.addEventListener('change', handleInputChange);
  });

  formEl.querySelectorAll('[data-add]').forEach((btn) => btn.addEventListener('click', addEntry));
  formEl.querySelectorAll('[data-del], [data-dup], [data-up], [data-down]').forEach((btn) => btn.addEventListener('click', mutateEntry));
}

function section(title, open, content) {
  const details = document.createElement('details');
  details.className = 'studio-section';
  if (open) details.open = true;
  details.innerHTML = `<summary>${title}</summary><div class="studio-section-content"></div>`;
  details.querySelector('.studio-section-content').append(content);
  return details;
}

function renderIdentityFields() {
  const wrap = document.createElement('div');
  wrap.className = 'field-grid';
  const i = monster.identity;
  wrap.innerHTML = textField('Name', 'identity.name', i.name)
    + textField('Subtitle', 'identity.subtitle', i.subtitle)
    + selectField('Size', 'identity.size', i.size, SIZE_OPTIONS)
    + selectField('Creature Type', 'identity.type', i.type, MONSTER_TYPES)
    + textField('Subtype / Tags', 'identity.tags', i.tags)
    + selectField('Alignment', 'identity.alignment', i.alignment, ALIGNMENTS)
    + multiSelectField('Environment', 'identity.environment', i.environment, ENVIRONMENTS)
    + selectField('Role', 'identity.role', i.role, ROLES)
    + selectField('CR Target', 'identity.cr', i.cr, CR_OPTIONS)
    + selectField('Origin Tag', 'identity.origin', i.origin, ORIGINS);
  return wrap;
}

function renderCoreFields() {
  const c = monster.core;
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="field-grid">${numberField('AC', 'core.ac', c.ac)}${numberField('HP', 'core.hp', c.hp)}${textField('Hit Dice', 'core.hitDice', c.hitDice)}${numberField('Proficiency Bonus', 'core.proficiencyBonus', c.proficiencyBonus)}${numberField('Initiative Bonus', 'core.initiativeBonus', c.initiativeBonus)}${numberField('Passive Perception', 'core.passivePerception', c.passivePerception)}</div>`;
  const speedGrid = document.createElement('div');
  speedGrid.className = 'field-grid';
  speedGrid.innerHTML = `<p class="tiny">Movement</p>${numberField('Walk', 'core.speed.walk', c.speed.walk)}${numberField('Climb', 'core.speed.climb', c.speed.climb)}${numberField('Swim', 'core.speed.swim', c.speed.swim)}${numberField('Burrow', 'core.speed.burrow', c.speed.burrow)}${numberField('Fly', 'core.speed.fly', c.speed.fly)}<label><input type="checkbox" data-path="core.speed.hover" ${c.speed.hover ? 'checked' : ''}/> Hover</label>`;
  const abilityGrid = document.createElement('div');
  abilityGrid.className = 'field-grid';
  abilityGrid.innerHTML = `<p class="tiny">Ability Scores</p>${['str', 'dex', 'con', 'int', 'wis', 'cha'].map((a) => numberField(a.toUpperCase(), `core.abilities.${a}`, c.abilities[a])).join('')}`;
  wrap.append(speedGrid, abilityGrid);
  return wrap;
}

function renderDefenseFields() {
  const d = monster.defense;
  const wrap = document.createElement('div');
  wrap.innerHTML = `<div class="field-grid">${textField('Saving Throw Proficiencies', 'defense.savingThrows', d.savingThrows.join(', '), 'comma-separated')}${textField('Skill Proficiencies', 'defense.skills', d.skills.join(', '), 'comma-separated')}${multiSelectField('Damage Vulnerabilities', 'defense.vulnerabilities', d.vulnerabilities, DAMAGE_TYPES)}${multiSelectField('Damage Resistances', 'defense.resistances', d.resistances, DAMAGE_TYPES)}${multiSelectField('Damage Immunities', 'defense.immunities', d.immunities, DAMAGE_TYPES)}${multiSelectField('Condition Immunities', 'defense.conditionImmunities', d.conditionImmunities, CONDITIONS)}${multiSelectField('Senses', 'defense.senses', d.senses, SENSE_OPTIONS)}${multiSelectField('Languages', 'defense.languages', d.languages, LANGUAGE_OPTIONS)}${textField('Telepathy / Special Communication', 'defense.telepathy', d.telepathy)}</div>`;
  return wrap;
}

function renderCombatFields() {
  const wrap = document.createElement('div');
  wrap.append(
    repeatable('Traits', 'combat.traits', ['name', 'category', 'description', 'saveDc', 'recharge', 'usage', 'trigger']),
    repeatable('Actions', 'combat.actions', ['name', 'category', 'description', 'saveDc', 'recharge', 'usage', 'trigger']),
    repeatable('Bonus Actions', 'combat.bonusActions', ['name', 'category', 'description', 'saveDc', 'recharge', 'usage', 'trigger']),
    repeatable('Reactions', 'combat.reactions', ['name', 'category', 'description', 'saveDc', 'recharge', 'usage', 'trigger']),
    repeatable('Legendary Actions', 'combat.legendaryActions', ['name', 'category', 'description', 'saveDc', 'recharge', 'usage', 'trigger']),
    repeatable('Lair Actions', 'combat.lairActions', ['name', 'category', 'description', 'saveDc', 'recharge', 'usage', 'trigger']),
    repeatable('Mythic Traits / Phases', 'combat.mythic', ['name', 'category', 'description', 'saveDc', 'recharge', 'usage', 'trigger']),
    repeatable('Attack Builder', 'combat.attacks', ['name', 'kind', 'theme', 'toHit', 'range', 'target', 'hit', 'damage', 'damageType', 'secondaryDamage', 'save', 'rider', 'styleNote', 'recharge', 'multiattackGroup']),
    repeatable('Spellcasting / Power Builder', 'combat.spellcasting', ['name', 'description'])
  );
  return wrap;
}

function renderFlavorFields() {
  const f = monster.flavor;
  const wrap = document.createElement('div');
  wrap.className = 'field-grid';
  const keys = [['Monster Summary', 'summary'], ['Appearance', 'appearance'], ['Behavior', 'behavior'], ['Tactics', 'tactics'], ['Habitat Notes', 'habitat'], ['Encounter Use Ideas', 'encounterIdeas'], ['Loot / Reward Notes', 'loot'], ['GM Notes', 'gmNotes'], ['Read-Aloud', 'readAloud']];
  keys.forEach(([label, key]) => {
    wrap.insertAdjacentHTML('beforeend', `<label>${label}<textarea rows="3" data-path="flavor.${key}" placeholder="${label}">${f[key] || ''}</textarea></label>`);
  });
  return wrap;
}

function repeatable(title, path, fields) {
  const sectionEl = document.createElement('section');
  const list = getByPath(monster, path) || [];
  sectionEl.innerHTML = `<h3>${title}</h3><div class="entry-list">${list.map((item, i) => entryHtml(path, i, fields, item)).join('')}</div><button class="btn btn-secondary" type="button" data-add="${path}">Add ${title.slice(0, -1)}</button>`;
  return sectionEl;
}

function entryHtml(path, index, fields, item) {
  return `<article class="entry-item"><div class="field-grid">${fields.map((field) => {
    const value = item[field] ?? '';
    if (field === 'description') return `<label>${pretty(field)}<textarea rows="3" data-path="${path}.${index}.${field}">${value}</textarea></label>`;
    if (field === 'theme') return `<label>${pretty(field)}<input list="attack-theme-list" data-path="${path}.${index}.${field}" value="${escape(value)}"/></label>`;
    return `<label>${pretty(field)}<input data-path="${path}.${index}.${field}" value="${escape(value)}"/></label>`;
  }).join('')}</div><div class="entry-actions"><button class="btn btn-secondary" type="button" data-up="${path}.${index}">↑</button><button class="btn btn-secondary" type="button" data-down="${path}.${index}">↓</button><button class="btn btn-secondary" type="button" data-dup="${path}.${index}">Duplicate</button><button class="btn btn-secondary" type="button" data-del="${path}.${index}">Remove</button></div></article>`;
}

function textField(label, path, value, placeholder = '') {
  return `<label>${label}<input data-path="${path}" value="${escape(value ?? '')}" placeholder="${placeholder}"/></label>`;
}

function numberField(label, path, value) {
  return `<label>${label}<input type="number" data-path="${path}" value="${value}"/></label>`;
}

function handleInputChange(event) {
  const path = event.target.dataset.path;
  if (!path) return;
  const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
  setByPath(monster, path, coerce(value));

  if ((path.startsWith('defense.') || path === 'identity.environment') && typeof getByPath(monster, path) === 'string' && path !== 'defense.telepathy') {
    setByPath(monster, path, event.target.value.split(',').map((v) => v.trim()).filter(Boolean));
  }

  renderPreview();
}

function addEntry(event) {
  const path = event.target.dataset.add;
  const arr = getByPath(monster, path);
  if (!Array.isArray(arr)) return;
  arr.push(path.includes('attacks') ? { name: '', kind: 'Melee Weapon Attack', theme: '', toHit: '', range: '', target: '', hit: '', damage: '', damageType: '', secondaryDamage: '', save: '', rider: '', styleNote: '', recharge: '', multiattackGroup: '' } : { name: '', category: titleCase(path.split('.').pop().slice(0, -1)), description: '', saveDc: '', recharge: '', usage: '', trigger: '' });
  renderForm();
  renderPreview();
}

function mutateEntry(event) {
  const key = Object.keys(event.target.dataset).find((k) => ['del', 'dup', 'up', 'down'].includes(k));
  if (!key) return;
  const [path, idxStr] = event.target.dataset[key].split(/\.(?=\d+$)/);
  const index = Number(idxStr);
  const arr = getByPath(monster, path);
  if (!Array.isArray(arr) || Number.isNaN(index)) return;

  if (key === 'del') arr.splice(index, 1);
  if (key === 'dup') arr.splice(index + 1, 0, structuredClone(arr[index]));
  if (key === 'up' && index > 0) [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
  if (key === 'down' && index < arr.length - 1) [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];

  renderForm();
  renderPreview();
}

function renderPreview() {
  renderStatblock();
  renderCard();
  document.getElementById('preview-json').textContent = JSON.stringify(monster, null, 2);
}

function renderStatblock() {
  const i = monster.identity;
  const c = monster.core;
  const d = monster.defense;
  const panel = document.getElementById('preview-statblock');
  panel.className = 'preview-panel statblock';

  const speed = Object.entries(c.speed).filter(([k, v]) => k === 'hover' ? v : Number(v) > 0).map(([k, v]) => k === 'hover' ? 'hover' : `${k} ${v} ft.`).join(', ');
  const features = ['traits', 'actions', 'bonusActions', 'reactions', 'legendaryActions', 'lairActions', 'mythic'];

  panel.innerHTML = `
    <h2>${i.name}</h2>
    <p class="stat-sub">${i.subtitle} • Role: ${i.role} • CR ${i.cr}</p>
    <div class="stat-grid">
      <div><strong>Armor Class</strong><div>${c.ac}</div></div>
      <div><strong>Hit Points</strong><div>${c.hp} (${c.hitDice})</div></div>
      <div><strong>Speed</strong><div>${speed || '—'}</div></div>
    </div>
    <div class="ability-grid">${Object.entries(c.abilities).map(([ability, score]) => `<div><strong>${ability.toUpperCase()}</strong><div>${score} (${formatMod(score)})</div></div>`).join('')}</div>
    <p><strong>Saving Throws</strong> ${(d.savingThrows || []).join(', ') || '—'}</p>
    <p><strong>Skills</strong> ${(d.skills || []).join(', ') || '—'}</p>
    <p><strong>Damage Resistances</strong> ${(d.resistances || []).join(', ') || '—'}</p>
    <p><strong>Damage Immunities</strong> ${(d.immunities || []).join(', ') || '—'}</p>
    <p><strong>Condition Immunities</strong> ${(d.conditionImmunities || []).join(', ') || '—'}</p>
    <p><strong>Senses</strong> ${d.senses || '—'} • <strong>Passive Perception</strong> ${c.passivePerception}</p>
    <p><strong>Languages</strong> ${d.languages || '—'}${d.telepathy ? ` • Telepathy ${d.telepathy}` : ''}</p>
    ${features.map((group) => renderFeatureGroup(group)).join('')}
  `;
}

function renderFeatureGroup(group) {
  const title = pretty(group);
  const list = monster.combat[group] || [];
  if (!list.length) return '';
  return `<h3>${title}</h3><ul>${list.map((entry) => `<li><strong>${entry.name || 'Untitled'}.</strong> ${entry.description || entry.hit || ''}${entry.trigger ? ` <em>Trigger:</em> ${entry.trigger}.` : ''}${entry.recharge ? ` <em>Recharge:</em> ${entry.recharge}.` : ''}</li>`).join('')}</ul>`;
}

function renderCard() {
  const i = monster.identity;
  const panel = document.getElementById('preview-card');
  panel.innerHTML = `<article class="preview-card"><h3>${i.name}</h3><p>${monster.flavor.summary}</p><p><span class="pill">${i.size}</span><span class="pill">${i.type}</span><span class="pill">${i.role}</span><span class="pill">CR ${i.cr}</span></p><p><strong>Environment:</strong> ${i.environment}</p><p><strong>Tactics:</strong> ${monster.flavor.tactics}</p><p><strong>Foundry Ready Foundation:</strong> ${monster.foundryHint.compatibleTemplate}</p></article>`;
}

function switchTab(tab) {
  document.querySelectorAll('.preview-tab').forEach((btn) => {
    const active = btn.dataset.tab === tab;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  ['statblock', 'card', 'json'].forEach((name) => {
    document.getElementById(`preview-${name}`).hidden = name !== tab;
  });
}

function applyPreset() {
  const key = document.getElementById('preset-select').value;
  const preset = PRESETS[key];
  if (!preset) return;
  monster = { ...createDefaultMonster(), ...monster, identity: { ...monster.identity, name: preset.name, subtitle: preset.subtitle, role: preset.role, cr: preset.cr, environment: preset.environment, origin: preset.origin }, core: { ...monster.core, ac: preset.ac, hp: preset.hp, abilities: preset.abilities || monster.core.abilities, speed: { ...monster.core.speed, ...(preset.speed || {}) } }, defense: { ...monster.defense, resistances: preset.resistances || monster.defense.resistances, immunities: preset.immunities || monster.defense.immunities, conditionImmunities: preset.conditionImmunities || monster.defense.conditionImmunities }, combat: { ...monster.combat, attacks: preset.attacks || monster.combat.attacks, spellcasting: preset.spellcasting || monster.combat.spellcasting, actions: preset.actions || monster.combat.actions } };
  renderForm();
  renderPreview();
  setStatus(`Preset loaded: ${key}.`);
}

function randomFromCr() {
  const cr = document.getElementById('random-cr').value;
  const style = document.getElementById('random-style').value;
  const generated = generateRandomMonster(cr, style);
  monster = {
    ...monster,
    ...generated,
    foundryHint: { ...monster.foundryHint, ...FOUNDATION_FLAGS.foundryHint },
  };
  setStatus(`Random ${RANDOM_STYLES[style] || 'custom'} monster generated for CR ${cr}: ${generated.identity.name}.`);
  renderForm();
  renderPreview();
}


function generateRandomMonster(cr, styleKey) {
  const profile = STYLE_PROFILES[styleKey] || STYLE_PROFILES.balanced;
  const numericCr = crToNumber(cr);
  const names = [...(RANDOM_BY_CR[cr] || []), ...profile.names, ...Object.values(PRESETS).map((preset) => preset.name)];
  const name = pick(names);
  const size = weightedPick([
    { value: 'Tiny', weight: numericCr <= 2 ? 1 : 0 },
    { value: 'Small', weight: 2 },
    { value: 'Medium', weight: 4 },
    { value: 'Large', weight: 3 },
    { value: 'Huge', weight: numericCr >= 8 ? 2 : 1 },
    { value: 'Gargantuan', weight: numericCr >= 14 ? 1 : 0 },
  ]) || 'Medium';
  const type = pick(MONSTER_TYPES);
  const role = pick(ROLES);
  const alignment = pick(ALIGNMENTS);
  const origin = chance(0.65) ? pick(ORIGINS) : styleKey;
  const environmentList = pickMany(ENVIRONMENTS, randomInt(2, 5));
  const tags = pickMany(['alpha', 'lurker', 'hunter', 'ritual', 'sentinel', 'siege', 'pack', 'arcane', 'mythic', 'venomous', 'frenzied', 'eldritch', 'planar', 'cunning'], randomInt(2, 4)).join(', ');

  const proficiencyBonus = Math.max(2, Math.ceil((numericCr + 1) / 4) + 1);
  const ac = randomInt(11 + Math.floor(numericCr / 2), 15 + Math.floor(numericCr / 2));
  const hp = randomInt(18 + numericCr * 15, 46 + numericCr * 30);
  const hitDiceCount = Math.max(3, Math.round(hp / 11));
  const conMod = randomInt(1, Math.max(3, Math.floor(numericCr / 2) + 3));

  const speed = {
    walk: randomInt(25, 50),
    climb: chance(0.45) ? randomInt(15, 40) : 0,
    swim: chance(styleKey === 'aquatic' ? 0.95 : 0.35) ? randomInt(20, 50) : 0,
    burrow: chance(0.28) ? randomInt(10, 35) : 0,
    fly: chance(styleKey === 'draconic' || styleKey === 'celestial' ? 0.65 : 0.4) ? randomInt(30, 90) : 0,
    hover: chance(0.26),
  };

  const abilities = {
    str: clamp(8 + randomInt(0, 10) + Math.floor(numericCr / 2), 3, 30),
    dex: clamp(8 + randomInt(0, 12), 3, 30),
    con: clamp(10 + randomInt(0, 10) + Math.floor(numericCr / 3), 3, 30),
    int: clamp(4 + randomInt(0, 16), 1, 30),
    wis: clamp(6 + randomInt(0, 14), 1, 30),
    cha: clamp(5 + randomInt(0, 16), 1, 30),
  };

  const mainDamage = pick(DAMAGE_TYPES);
  const attackCount = randomInt(1, numericCr >= 8 ? 3 : 2);
  const traitCount = randomInt(1, 3);
  const actionCount = randomInt(1, 3);
  const bonusCount = chance(0.75) ? randomInt(1, 2) : 0;
  const reactionCount = chance(0.8) ? randomInt(1, 2) : 0;
  const legendaryCount = numericCr >= 10 ? randomInt(1, 3) : 0;
  const lairCount = numericCr >= 12 ? randomInt(1, 2) : 0;
  const mythicCount = numericCr >= 17 && chance(0.65) ? randomInt(1, 2) : 0;

  const saveDc = 10 + proficiencyBonus + Math.floor((Math.max(abilities.wis, abilities.cha) - 10) / 2);
  const roleFlavor = pick(profile.flavor);

  const attacks = Array.from({ length: attackCount }, () => buildAttackBlock({ numericCr, proficiencyBonus, abilities, mainDamage, styleKey }));

  return {
    identity: {
      ...monster.identity,
      name,
      subtitle: `${size} ${type}, ${alignment}`,
      size,
      type,
      tags,
      alignment,
      environment: environmentList.join(', '),
      role,
      cr,
      origin,
    },
    core: {
      ...monster.core,
      ac,
      hp,
      hitDice: `${hitDiceCount}d12 + ${hitDiceCount * conMod}`,
      speed,
      abilities,
      proficiencyBonus,
      initiativeBonus: Math.floor((abilities.dex - 10) / 2),
      passivePerception: 10 + Math.floor((abilities.wis - 10) / 2) + (chance(0.55) ? proficiencyBonus : 0),
    },
    defense: {
      ...monster.defense,
      savingThrows: buildSavingThrows(abilities, proficiencyBonus),
      skills: buildSkills(proficiencyBonus),
      vulnerabilities: chance(0.3) ? pickMany(DAMAGE_TYPES.filter((d) => d !== mainDamage), 1) : [],
      resistances: pickMany(DAMAGE_TYPES.filter((d) => d !== mainDamage), randomInt(1, 4)),
      immunities: chance(0.4) ? pickMany(DAMAGE_TYPES.filter((d) => d !== mainDamage), randomInt(1, 2)) : [],
      conditionImmunities: chance(0.6) ? pickMany(CONDITIONS, randomInt(1, 3)) : [],
      senses: pickMany(SENSE_OPTIONS, randomInt(1, 3)).join(', '),
      languages: pickMany(LANGUAGE_OPTIONS, randomInt(1, 4)).join(', '),
      telepathy: chance(0.4) ? `${randomInt(30, 120)} ft.` : '',
    },
    combat: {
      ...monster.combat,
      traits: Array.from({ length: traitCount }, () => buildFeature(profile.traits, ['Carapace', 'Instinct', 'Pattern', 'Aura', 'Protocol'], name, roleFlavor, 'Trait')),
      actions: Array.from({ length: actionCount }, () => buildAction(profile.actions, saveDc, mainDamage, name)),
      bonusActions: Array.from({ length: bonusCount }, () => buildBonusAction(name)),
      reactions: Array.from({ length: reactionCount }, () => buildReaction(name)),
      legendaryActions: Array.from({ length: legendaryCount }, () => buildLegendary(name, styleKey)),
      lairActions: Array.from({ length: lairCount }, () => buildLair(name, saveDc, styleKey)),
      mythic: Array.from({ length: mythicCount }, () => buildMythic(name, hp)),
      attacks,
      spellcasting: chance(0.7) ? [buildSpellcasting(saveDc, proficiencyBonus, abilities)] : [],
    },
    flavor: {
      ...monster.flavor,
      summary: `${name} is a ${roleFlavor.toLowerCase()} ${type} built for CR ${cr} encounters with ${RANDOM_STYLES[styleKey] || 'balanced'} flavor.`,
      appearance: pick(['Armor plates etched in runes.', 'A distorted silhouette with too many eyes.', 'Crystalline growths pulse with internal light.', 'Its body leaks elemental residue with every movement.', 'Its shadow moves half a second out of sync.', 'Each step leaves a brief sigil of power on the ground.']),
      behavior: pick(['Tests defenses before committing.', 'Prioritizes isolated and wounded prey.', 'Retreats only to set an ambush.', 'Escalates quickly if bloodied.', 'Switches targets whenever someone resists its preferred damage type.']),
      tactics: pick(['Uses terrain to split the party.', 'Pressures spellcasters first.', 'Focuses one target until they drop.', 'Combines crowd control with burst damage.', 'Cycles between mobility and lockdown abilities each round.']),
      habitat: `${name} is commonly found in ${environmentList.join(', ')} regions.`,
      encounterIdeas: pick(['Guards a ritual site about to rupture.', 'Hunts anyone carrying an ancient sigil.', 'Appears as a hired weapon in a war camp.', 'Emerges after magical storms.', 'Is the final experiment of a desperate archmage.']),
      loot: pick(['A resonant core worth 500 gp.', 'A map to a hidden vault.', 'A weapon fragment that grants minor elemental power.', 'A charm that can summon lesser kin once.', 'A style-infused trophy usable as a rare crafting component.']),
      gmNotes: `Increase pressure by adding environmental hazards that reflect the ${RANDOM_STYLES[styleKey] || 'Balanced'} style. Consider adding minions for action economy swings.`,
      readAloud: `A hush falls over the battlefield as ${name} steps forward, its presence bending the mood of the room before the first blow is struck.`,
    },
  };
}

function buildAttackBlock({ numericCr, proficiencyBonus, abilities, mainDamage, styleKey }) {
  const attackTheme = pick(ATTACK_THEMES);
  const avgDamage = randomInt(Math.max(4, Math.floor(4 + numericCr * 1.7)), Math.max(8, Math.floor(12 + numericCr * 3)));
  const dice = damageDice(avgDamage, attackTheme);
  const toHit = `+${Math.max(3, proficiencyBonus + Math.floor((Math.max(abilities.str, abilities.dex) - 10) / 2))}`;
  const saveDc = 10 + proficiencyBonus + Math.floor((Math.max(abilities.str, abilities.wis) - 10) / 2);
  const secondaryType = pick(DAMAGE_TYPES.filter((d) => d !== mainDamage));
  const secondaryDamageRoll = damageDice(randomInt(4, 18), attackTheme);
  return {
    name: `${titleCase(attackTheme)} ${pick(['Strike', 'Rend', 'Lash', 'Crash', 'Volley'])}`,
    kind: chance(0.35) ? 'Ranged Weapon Attack' : 'Melee Weapon Attack',
    theme: attackTheme,
    toHit,
    range: chance(0.35) ? `${randomInt(30, 150)}/${randomInt(120, 360)} ft.` : `reach ${randomInt(5, 20)} ft.`,
    target: pick(['one target', 'up to two targets', 'one creature and one adjacent creature']),
    hit: `${avgDamage} (${dice}) ${mainDamage} damage${chance(0.55) ? ` plus ${randomInt(4, 18)} (${secondaryDamageRoll}) ${secondaryType}` : ''}`,
    damage: dice,
    damageType: mainDamage,
    secondaryDamage: chance(0.55) ? `${secondaryDamageRoll} ${secondaryType}` : '',
    save: chance(0.4) ? `${saveDc} ${pick(['Str', 'Dex', 'Con', 'Wis'])}` : '',
    rider: chance(0.65) ? pick(['Target is knocked prone.', 'Target cannot take reactions until start of its next turn.', 'Target speed is reduced by 10 ft. until end of its next turn.', 'Target cannot regain hit points until start of this creature\'s next turn.', 'Target is pushed 10 feet and must succeed on a concentration check.']) : '',
    styleNote: `Generated with ${RANDOM_STYLES[styleKey] || 'Balanced'} style.`,
    recharge: chance(0.3) ? '5-6' : '',
    multiattackGroup: chance(0.8) ? 'Multiattack' : '',
  };
}

function buildFeature(traits, suffixes, name, roleFlavor, category) {
  return {
    name: `${pick(traits)} ${pick(suffixes)}`,
    category,
    description: `${name} embodies a ${roleFlavor.toLowerCase()} approach to combat and gains a tactical edge whenever enemies cluster together.`,
    saveDc: '',
    recharge: chance(0.2) ? '6' : '',
    usage: chance(0.3) ? `${randomInt(1, 3)}/day` : '',
    trigger: chance(0.3) ? pick(['When bloodied', 'When it drops to half hit points', 'When first targeted by a spell']) : '',
  };
}

function buildAction(actionNames, saveDc, mainDamage, name) {
  return {
    name: `${pick(actionNames)} ${pick(['Burst', 'Strike', 'Wave', 'Pulse', 'Assault'])}`,
    category: 'Action',
    description: `Creatures in a ${pick(['15-foot cone', '20-foot radius', '30-foot line'])} must succeed on a DC ${saveDc} ${pick(['Strength', 'Dexterity', 'Constitution', 'Wisdom'])} save or take ${randomInt(8, 24)} (${damageDice(randomInt(8, 24), pick(ATTACK_THEMES))}) ${mainDamage} damage and suffer a tactical setback.`,
    saveDc: `${saveDc}`,
    recharge: chance(0.45) ? '5-6' : '',
    usage: chance(0.35) ? `${randomInt(1, 3)}/day` : '',
    trigger: chance(0.2) ? `After ${name} hits with an attack` : '',
  };
}

function buildBonusAction(name) {
  return {
    name: pick(['Predatory Shift', 'Arc Flash Step', 'Skitter Dash', 'Grim Reposition', 'Mirage Snap']),
    category: 'Bonus Action',
    description: `${name} moves up to half its speed and can reposition through enemy spaces as difficult terrain.`,
    saveDc: '',
    recharge: '',
    usage: chance(0.35) ? '3/day' : '',
    trigger: '',
  };
}

function buildReaction(name) {
  return {
    name: pick(['Reactive Guard', 'Warp Riposte', 'Spiteful Counter', 'Aegis Flicker']),
    category: 'Reaction',
    description: `When hit by an attack, ${name} reduces damage by ${randomInt(4, 14)} and may make one attack against the triggering creature.`,
    saveDc: '',
    recharge: '',
    usage: chance(0.35) ? '3/day' : '',
    trigger: 'When hit by an attack',
  };
}

function buildLegendary(name, styleKey) {
  return {
    name: pick(['Predator Pulse', 'Void Lash', 'Solar Flare Step', 'Hoard Fury', 'Tidal Slip']),
    category: 'Legendary',
    description: `${name} performs a rapid tactical maneuver flavored by the ${RANDOM_STYLES[styleKey] || 'Balanced'} style.`,
    saveDc: '',
    recharge: '',
    usage: `Costs ${randomInt(1, 2)} action${chance(0.4) ? 's' : ''}`,
    trigger: '',
  };
}

function buildLair(name, saveDc, styleKey) {
  return {
    name: pick(['Falling Cinders', 'Warping Ground', 'Howling Dark', 'Surging Vines', 'Crashing Tides']),
    category: 'Lair',
    description: `On initiative count 20, ${name} twists the arena with ${RANDOM_STYLES[styleKey] || 'balanced'} energy; creatures must make a DC ${saveDc} save or take ${randomInt(8, 20)} damage.`,
    saveDc: `${saveDc}`,
    recharge: '',
    usage: '',
    trigger: 'Initiative count 20',
  };
}

function buildMythic(name, hp) {
  return {
    name: pick(['Mythic Resurgence', 'Second Form Awakening', 'Cataclysmic Renewal']),
    category: 'Mythic',
    description: `When reduced to 0 hit points, ${name} erupts with new power, regains ${Math.floor(hp / 2)} hit points, and immediately takes one action.`,
    saveDc: '',
    recharge: '',
    usage: '1/day',
    trigger: 'When first reduced to 0 hit points',
  };
}

function buildSpellcasting(saveDc, proficiencyBonus, abilities) {
  return {
    name: pick(['Innate Spellcasting', 'Psionic Burstcasting', 'Ritual Invocation', 'Battle Canticles']),
    description: `Spell save DC ${saveDc}, +${proficiencyBonus + Math.max(2, Math.floor((Math.max(abilities.int, abilities.cha) - 10) / 2))} to hit. At will: ${pickMany(['mage hand', 'minor illusion', 'ray of frost', 'thaumaturgy', 'chill touch', 'sacred flame', 'gust'], 3).join(', ')}. 3/day each: ${pickMany(['fear', 'fly', 'fireball', 'lightning bolt', 'slow', 'hunger of hadar', 'banishment', 'spirit guardians'], 3).join(', ')}.`,
  };
}

function selectField(label, path, value, options) {
  return `<label>${label}<select data-path="${path}">${options.map((option) => `<option value="${escape(option)}" ${String(option) === String(value) ? 'selected' : ''}>${option}</option>`).join('')}</select></label>`;
}

function multiSelectField(label, path, value, options) {
  const selected = Array.isArray(value) ? value : String(value || '').split(',').map((v) => v.trim()).filter(Boolean);
  const listValue = selected.join(', ');
  const listId = `${path.replaceAll('.', '-')}-list`;
  return `<label>${label}<input list="${listId}" data-path="${path}" value="${escape(listValue)}" placeholder="comma-separated"/></label><datalist id="${listId}">${options.map((option) => `<option value="${option}"></option>`).join('')}</datalist>`;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pickMany(list, count) {
  const clone = [...list];
  const picked = [];
  while (clone.length && picked.length < count) {
    const index = Math.floor(Math.random() * clone.length);
    picked.push(clone.splice(index, 1)[0]);
  }
  return picked;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(probability) {
  return Math.random() < probability;
}

function weightedPick(entries) {
  const valid = entries.filter((entry) => entry.weight > 0);
  const total = valid.reduce((sum, entry) => sum + entry.weight, 0);
  if (!total) return null;
  let roll = Math.random() * total;
  for (const entry of valid) {
    roll -= entry.weight;
    if (roll <= 0) return entry.value;
  }
  return valid[valid.length - 1].value;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function crToNumber(cr) {
  if (cr.includes('/')) {
    const [num, den] = cr.split('/').map(Number);
    return num / den;
  }
  return Number(cr) || 0;
}

function damageDice(avg, theme) {
  const die = ['dagger', 'claws'].includes(theme) ? 4 : ['spear', 'bow', 'crossbow'].includes(theme) ? 6 : ['great axe', 'tail', 'gore'].includes(theme) ? 10 : 8;
  const count = Math.max(1, Math.round(avg / (die / 2 + 0.5)));
  const bonus = Math.max(0, avg - Math.floor(count * (die + 1) / 2));
  return `${count}d${die}${bonus ? `+${bonus}` : ''}`;
}

function buildSavingThrows(abilities, proficiencyBonus) {
  const shortlist = pickMany(['str', 'dex', 'con', 'int', 'wis', 'cha'], 3);
  return shortlist.map((ability) => `${ability.toUpperCase()} ${formatSigned(Math.floor((abilities[ability] - 10) / 2) + proficiencyBonus)}`);
}

function buildSkills(proficiencyBonus) {
  const pool = ['Perception', 'Stealth', 'Athletics', 'Arcana', 'Intimidation', 'Survival', 'Insight', 'Deception'];
  return pickMany(pool, 3).map((skill) => `${skill} ${formatSigned(randomInt(1, 5) + proficiencyBonus)}`);
}

function formatSigned(value) {
  return `${value >= 0 ? '+' : ''}${value}`;
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(monster));
  setStatus('Monster saved to your browser vault.');
}

function loadLocal() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return setStatus('No local save found.');
  monster = JSON.parse(raw);
  renderForm();
  renderPreview();
  setStatus('Loaded monster from local save.');
}

function exportJson() {
  const blob = new Blob([JSON.stringify(monster, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${monster.identity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'monster'}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  setStatus('Authoring JSON exported.');
}

function exportFoundryNpcJson() {
  const foundryNpc = convertMonsterToFoundryNpc(monster);
  const blob = new Blob([JSON.stringify(foundryNpc, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const slug = monster.identity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'monster';
  a.download = `${slug}.foundry-npc.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  setStatus('Foundry NPC export generated from authoring schema.');
}

function convertMonsterToFoundryNpc(sourceMonster) {
  const identityData = mapIdentityToNpcData(sourceMonster.identity, sourceMonster.flavor);
  const coreData = mapCoreToNpcData(sourceMonster.core);
  const defenseData = mapDefenseToNpcData(sourceMonster.defense);
  const foundryItems = mapCombatToFoundryItems(sourceMonster.combat);

  return {
    name: identityData.name,
    type: 'npc',
    img: 'icons/svg/mystery-man.svg',
    system: {
      details: {
        type: {
          value: identityData.creatureType,
          subtype: identityData.subtype,
          custom: identityData.tags,
        },
        alignment: identityData.alignment,
        cr: identityData.cr,
        biography: {
          value: buildBiographyHtml(sourceMonster.flavor, sourceMonster.identity),
        },
      },
      attributes: {
        ac: { value: coreData.ac },
        hp: {
          value: coreData.hp,
          max: coreData.hp,
          formula: coreData.hitDice,
        },
        movement: coreData.movement,
        init: { value: coreData.initiativeBonus },
        prof: coreData.proficiencyBonus,
        senses: defenseData.senses,
      },
      abilities: coreData.abilities,
      skills: defenseData.skills,
      traits: {
        di: { value: defenseData.damageImmunities },
        dr: { value: defenseData.damageResistances },
        dv: { value: defenseData.damageVulnerabilities },
        ci: { value: defenseData.conditionImmunities },
        languages: {
          value: defenseData.languages,
          custom: defenseData.telepathy || '',
        },
      },
      bonuses: {
        saves: defenseData.savingThrowBonusText,
        check: '',
      },
      resources: {
        passivePerception: coreData.passivePerception,
      },
    },
    items: foundryItems,
    prototypeToken: {
      name: identityData.name,
      disposition: -1,
      actorLink: false,
    },
    flags: {
      sksMonsterStudio: {
        sourceSchema: 'sks-monster-studio-v1',
        role: identityData.role,
        environment: identityData.environment,
        origin: identityData.origin,
        exportPath: 'convertMonsterToFoundryNpc',
      },
    },
  };
}

function mapIdentityToNpcData(identity, flavor) {
  const subtitleParts = parseSubtitle(identity.subtitle);
  return {
    name: identity.name,
    size: identity.size,
    creatureType: identity.type || subtitleParts.type || 'humanoid',
    subtype: subtitleParts.subtype,
    tags: identity.tags || '',
    alignment: identity.alignment || subtitleParts.alignment || 'unaligned',
    cr: identity.cr,
    role: identity.role,
    environment: arrayOrEmpty(identity.environment),
    origin: identity.origin,
    summary: flavor.summary || '',
  };
}

function mapCoreToNpcData(core) {
  return {
    ac: Number(core.ac) || 10,
    hp: Number(core.hp) || 1,
    hitDice: core.hitDice || '',
    movement: {
      walk: Number(core.speed.walk) || 0,
      burrow: Number(core.speed.burrow) || 0,
      climb: Number(core.speed.climb) || 0,
      fly: Number(core.speed.fly) || 0,
      swim: Number(core.speed.swim) || 0,
      hover: Boolean(core.speed.hover),
      units: 'ft',
    },
    initiativeBonus: Number(core.initiativeBonus) || 0,
    passivePerception: Number(core.passivePerception) || 10,
    proficiencyBonus: Number(core.proficiencyBonus) || 2,
    abilities: mapAbilityScores(core.abilities),
  };
}

function mapDefenseToNpcData(defense) {
  return {
    savingThrowBonusText: arrayOrEmpty(defense.savingThrows).join(', '),
    skills: mapSkillsToFoundry(defense.skills),
    damageVulnerabilities: arrayOrEmpty(defense.vulnerabilities),
    damageResistances: arrayOrEmpty(defense.resistances),
    damageImmunities: arrayOrEmpty(defense.immunities),
    conditionImmunities: arrayOrEmpty(defense.conditionImmunities),
    senses: mapSensesToFoundry(defense.senses),
    languages: arrayOrEmpty(defense.languages),
    telepathy: defense.telepathy || '',
  };
}

function mapCombatToFoundryItems(combat = {}) {
  return [
    ...arrayOrEmpty(combat.traits).map((trait) => mapTraitToFeatureItem(trait, 'trait')),
    ...arrayOrEmpty(combat.actions).map((action) => mapActionToFeatureItem(action)),
    ...arrayOrEmpty(combat.bonusActions).map((action) => mapActionToFeatureItem(action, 'bonus')),
    ...arrayOrEmpty(combat.reactions).map((reaction) => mapReactionToFeatureItem(reaction)),
    ...arrayOrEmpty(combat.legendaryActions).map((entry) => mapTraitToFeatureItem(entry, 'legendary')),
    ...arrayOrEmpty(combat.lairActions).map((entry) => mapTraitToFeatureItem(entry, 'lair')),
    ...arrayOrEmpty(combat.mythic).map((entry) => mapTraitToFeatureItem(entry, 'mythic')),
    ...arrayOrEmpty(combat.attacks).map((attack) => mapAttackToAttackItem(attack)),
    ...arrayOrEmpty(combat.spellcasting).map((entry) => mapTraitToFeatureItem(entry, 'spellcasting')),
  ];
}

function mapTraitToFeatureItem(trait, activationType = 'special') {
  return {
    name: trait.name || 'Unnamed Feature',
    type: 'feat',
    system: {
      description: {
        value: buildCombatDescription(trait),
      },
      type: {
        value: 'monster',
      },
      activation: {
        type: activationType,
        cost: 1,
      },
      uses: {
        value: '',
        max: trait.usage || '',
      },
      recharge: {
        value: trait.recharge || '',
      },
    },
    flags: {
      sksMonsterStudio: {
        sourceCategory: trait.category || activationType,
      },
    },
  };
}

function mapActionToFeatureItem(action, activationType = 'action') {
  return mapTraitToFeatureItem(action, activationType);
}

function mapReactionToFeatureItem(reaction) {
  return mapTraitToFeatureItem(reaction, 'reaction');
}

function mapAttackToAttackItem(attack) {
  return {
    name: attack.name || 'Unnamed Attack',
    type: 'weapon',
    system: {
      description: {
        value: buildAttackDescription(attack),
      },
      activation: {
        type: 'action',
        cost: 1,
      },
      actionType: attack.kind?.toLowerCase().includes('ranged') ? 'rwak' : 'mwak',
      attackBonus: parseSignedNumber(attack.toHit),
      range: {
        value: parseAttackRange(attack.range),
        long: parseAttackLongRange(attack.range),
        units: 'ft',
      },
      damage: {
        parts: buildDamageParts(attack),
      },
      proficient: true,
      equipped: true,
    },
    flags: {
      sksMonsterStudio: {
        sourceCategory: 'attack',
        multiattackGroup: attack.multiattackGroup || '',
        styleNote: attack.styleNote || '',
      },
    },
  };
}

function buildBiographyHtml(flavor = {}, identity = {}) {
  const sections = [
    ['Summary', flavor.summary],
    ['Appearance', flavor.appearance],
    ['Behavior', flavor.behavior],
    ['Tactics', flavor.tactics],
    ['Habitat', flavor.habitat],
    ['Encounter Ideas', flavor.encounterIdeas],
    ['Loot', flavor.loot],
    ['GM Notes', flavor.gmNotes],
    ['Read Aloud', flavor.readAloud],
  ];

  const environment = arrayOrEmpty(identity.environment);
  const identitySummary = `<p><strong>${identity.name || 'Monster'}</strong> • ${identity.size || ''} ${identity.type || ''}${identity.origin ? ` • Origin: ${identity.origin}` : ''}${identity.role ? ` • Role: ${identity.role}` : ''}${environment.length ? ` • Environment: ${environment.join(', ')}` : ''}</p>`;
  const detailSections = sections.filter(([, value]) => value).map(([title, value]) => `<h3>${title}</h3><p>${value}</p>`).join('');
  return `${identitySummary}${detailSections}`;
}

function parseSubtitle(subtitle = '') {
  const firstSegment = subtitle.split(',')[0] || '';
  const typeMatch = firstSegment.match(/\b(?:tiny|small|medium|large|huge|gargantuan)\s+([^,(]+)/i);
  const subtypeMatch = firstSegment.match(/\(([^)]+)\)/);
  const alignment = subtitle.includes(',') ? subtitle.split(',').slice(1).join(',').trim() : '';
  return {
    type: typeMatch ? typeMatch[1].replace(/\s*\(.+\)$/, '').trim().toLowerCase() : '',
    subtype: subtypeMatch ? subtypeMatch[1].trim().toLowerCase() : '',
    alignment,
  };
}

function mapAbilityScores(abilities = {}) {
  const abilityKeys = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  return abilityKeys.reduce((acc, key) => {
    const score = Number(abilities[key]) || 10;
    acc[key] = {
      value: score,
      mod: Math.floor((score - 10) / 2),
      proficient: 0,
    };
    return acc;
  }, {});
}

function mapSkillsToFoundry(skills = []) {
  const skillMap = {
    acrobatics: 'acr', animalhandling: 'ani', arcana: 'arc', athletics: 'ath', deception: 'dec',
    history: 'his', insight: 'ins', intimidation: 'itm', investigation: 'inv', medicine: 'med',
    nature: 'nat', perception: 'prc', performance: 'prf', persuasion: 'per', religion: 'rel',
    sleightofhand: 'slt', stealth: 'ste', survival: 'sur',
  };
  const result = {};
  arrayOrEmpty(skills).forEach((entry) => {
    const nameMatch = String(entry).trim().match(/^[A-Za-z ]+/);
    const bonusMatch = String(entry).match(/([+-]\d+)$/);
    if (!nameMatch) return;
    const key = nameMatch[0].toLowerCase().replaceAll(' ', '');
    const foundryKey = skillMap[key];
    if (!foundryKey) return;
    result[foundryKey] = {
      value: 1,
      bonus: bonusMatch ? bonusMatch[1] : '',
    };
  });
  return result;
}

function mapSensesToFoundry(senses = []) {
  const mapped = {};
  arrayOrEmpty(senses).forEach((sense) => {
    const normalized = String(sense).toLowerCase();
    if (normalized.includes('darkvision')) mapped.darkvision = 60;
    if (normalized.includes('blindsight')) mapped.blindsight = 30;
    if (normalized.includes('tremorsense')) mapped.tremorsense = 30;
    if (normalized.includes('truesight')) mapped.truesight = 30;
  });
  return {
    ...mapped,
    units: 'ft',
    special: arrayOrEmpty(senses).join(', '),
  };
}

function buildCombatDescription(entry) {
  const details = [
    entry.description,
    entry.trigger ? `<p><strong>Trigger:</strong> ${entry.trigger}</p>` : '',
    entry.saveDc ? `<p><strong>Save:</strong> ${entry.saveDc}</p>` : '',
    entry.recharge ? `<p><strong>Recharge:</strong> ${entry.recharge}</p>` : '',
    entry.usage ? `<p><strong>Usage:</strong> ${entry.usage}</p>` : '',
  ].filter(Boolean).join('');
  return `<p>${details}</p>`;
}

function buildAttackDescription(attack) {
  return [
    attack.kind ? `<p><strong>${attack.kind}</strong></p>` : '',
    attack.target ? `<p><strong>Target:</strong> ${attack.target}</p>` : '',
    attack.hit ? `<p><strong>Hit:</strong> ${attack.hit}</p>` : '',
    attack.rider ? `<p><strong>Rider:</strong> ${attack.rider}</p>` : '',
    attack.save ? `<p><strong>Save:</strong> ${attack.save}</p>` : '',
    attack.recharge ? `<p><strong>Recharge:</strong> ${attack.recharge}</p>` : '',
  ].join('');
}

function buildDamageParts(attack) {
  const parts = [];
  if (attack.damage && attack.damageType) parts.push([attack.damage, attack.damageType]);
  if (attack.secondaryDamage) {
    const [roll, type] = String(attack.secondaryDamage).split(/\s+(?=[a-zA-Z]+$)/);
    if (roll && type) parts.push([roll.trim(), type.trim().toLowerCase()]);
  }
  return parts;
}

function parseAttackRange(rangeText = '') {
  const match = String(rangeText).match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function parseAttackLongRange(rangeText = '') {
  const match = String(rangeText).match(/(\d+)\s*\/\s*(\d+)/);
  return match ? Number(match[2]) : null;
}

function parseSignedNumber(value) {
  const match = String(value || '').match(/[+-]?\d+/);
  return match ? Number(match[0]) : 0;
}

function arrayOrEmpty(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((part) => part.trim()).filter(Boolean);
  return [];
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      monster = JSON.parse(String(reader.result));
      renderForm();
      renderPreview();
      setStatus('Imported monster JSON.');
    } catch {
      setStatus('Invalid JSON file.', true);
    }
  };
  reader.readAsText(file);
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? 'var(--danger-text)' : 'var(--muted)';
}

function getByPath(obj, path) {
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function setByPath(obj, path, value) {
  const parts = path.split('.');
  const key = parts.pop();
  const target = parts.reduce((acc, part) => acc[part], obj);
  target[key] = value;
}

function pretty(str) {
  return str.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function titleCase(value) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function escape(value) {
  return String(value).replaceAll('"', '&quot;');
}

function formatMod(score) {
  const mod = Math.floor((Number(score) - 10) / 2);
  return `${mod >= 0 ? '+' : ''}${mod}`;
}

function coerce(value) {
  if (value === '' || value === null || value === undefined) return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!Number.isNaN(Number(value)) && /^-?\d+(\.\d+)?$/.test(String(value))) return Number(value);
  return value;
}

document.body.insertAdjacentHTML('beforeend', `<datalist id="attack-theme-list">${ATTACK_THEMES.map((theme) => `<option value="${theme}"></option>`).join('')}</datalist>`);
