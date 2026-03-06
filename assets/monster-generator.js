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
};

const ATTACK_THEMES = ['longsword', 'great axe', 'spear', 'dagger', 'bow', 'crossbow', 'claws', 'bite', 'tail', 'tentacle', 'slam', 'gore', 'necrotic blast', 'frost shard', 'moonlit strike', 'shadow lash'];

const RANDOM_BY_CR = {
  '1/2': ['Mire Gnawer', 'Shrine Kobold Adept', 'Rime Bat'],
  '2': ['Bogscale Marauder', 'Sunken Crypt Mage', 'Cinder Horn Boar'],
  '5': ['Duskhollow Basilisk', 'Ironwood Sentinel', 'Stormbound Warden'],
  '10': ['Umbral War Matron', 'Abyssal Oracle', 'Frostspire Tyrant'],
  '15': ['Star-Eater Chimera', 'Prince of Verdigris Chains', 'Cathedral Leviathan'],
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
  document.getElementById('import-json').addEventListener('change', importJson);
}

function populateSelects() {
  const presetSelect = document.getElementById('preset-select');
  presetSelect.innerHTML = Object.keys(PRESETS).map((key) => `<option value="${key}">${key}</option>`).join('');
  const randomCr = document.getElementById('random-cr');
  randomCr.innerHTML = CR_OPTIONS.map((cr) => `<option value="${cr}">CR ${cr}</option>`).join('');
  randomCr.value = '5';
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
  wrap.innerHTML = textField('Name', 'identity.name', i.name) + textField('Subtitle', 'identity.subtitle', i.subtitle) + textField('Size', 'identity.size', i.size) + textField('Creature Type', 'identity.type', i.type) + textField('Subtype / Tags', 'identity.tags', i.tags) + textField('Alignment', 'identity.alignment', i.alignment) + textField('Environment', 'identity.environment', i.environment) + textField('Role', 'identity.role', i.role) + textField('CR Target', 'identity.cr', i.cr) + textField('Origin Tag', 'identity.origin', i.origin);
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
  wrap.innerHTML = `<div class="field-grid">${textField('Saving Throw Proficiencies', 'defense.savingThrows', d.savingThrows.join(', '), 'comma-separated')}${textField('Skill Proficiencies', 'defense.skills', d.skills.join(', '), 'comma-separated')}${textField('Damage Vulnerabilities', 'defense.vulnerabilities', d.vulnerabilities.join(', '), 'comma-separated')}${textField('Damage Resistances', 'defense.resistances', d.resistances.join(', '), 'comma-separated')}${textField('Damage Immunities', 'defense.immunities', d.immunities.join(', '), 'comma-separated')}${textField('Condition Immunities', 'defense.conditionImmunities', d.conditionImmunities.join(', '), 'comma-separated')}${textField('Senses', 'defense.senses', d.senses)}${textField('Languages', 'defense.languages', d.languages)}${textField('Telepathy / Special Communication', 'defense.telepathy', d.telepathy)}</div>`;
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

  if (path.startsWith('defense.') && typeof getByPath(monster, path) === 'string' && path !== 'defense.senses' && path !== 'defense.languages' && path !== 'defense.telepathy') {
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
  const names = RANDOM_BY_CR[cr] || ['Wandering Revenant', 'Runebound Marauder', 'Thornmaw Beast'];
  const picked = names[Math.floor(Math.random() * names.length)];
  monster.identity.name = picked;
  monster.identity.cr = cr;
  monster.identity.role = ['brute', 'skirmisher', 'controller', 'boss'][Math.floor(Math.random() * 4)];
  monster.combat.attacks[0] = {
    ...monster.combat.attacks[0],
    name: `${ATTACK_THEMES[Math.floor(Math.random() * ATTACK_THEMES.length)]} Strike`,
    theme: ATTACK_THEMES[Math.floor(Math.random() * ATTACK_THEMES.length)],
    damageType: ['slashing', 'piercing', 'bludgeoning', 'fire', 'cold', 'necrotic'][Math.floor(Math.random() * 6)],
  };
  setStatus(`Random monster generated for CR ${cr}: ${picked}.`);
  renderForm();
  renderPreview();
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
  setStatus('JSON exported.');
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
