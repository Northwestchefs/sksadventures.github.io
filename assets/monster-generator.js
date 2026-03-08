const STORAGE_KEY = 'sks-monster-studio-v1';

const CR_OPTIONS = ['0', '1/8', '1/4', '1/2', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

const SRD_DATA_PATH = '../data/monsters.json';

const SRD_MONSTER_LIST_ENDPOINT = 'https://www.dnd5eapi.co/api/2014/monsters';
const SRD_MONSTER_API_BASE = 'https://www.dnd5eapi.co';
const SRD_CACHE_KEY = 'sks-monster-generator-srd-monsters-v1';
const MIN_EXPECTED_SRD_MONSTERS = 300;
const SRD_FETCH_CONCURRENCY = 8;
const SRD_FETCH_RETRIES = 2;
const SRD_FETCH_RETRY_BASE_DELAY_MS = 250;

const CR_BASELINES = {
  '0': { ac: 13, hpMin: 1, hpMax: 7, dprMin: 0, dprMax: 1 },
  '1/8': { ac: 13, hpMin: 7, hpMax: 35, dprMin: 2, dprMax: 3 },
  '1/4': { ac: 13, hpMin: 36, hpMax: 49, dprMin: 4, dprMax: 5 },
  '1/2': { ac: 13, hpMin: 50, hpMax: 70, dprMin: 6, dprMax: 8 },
  '1': { ac: 13, hpMin: 71, hpMax: 85, dprMin: 9, dprMax: 14 },
  '2': { ac: 13, hpMin: 86, hpMax: 100, dprMin: 15, dprMax: 20 },
  '3': { ac: 13, hpMin: 101, hpMax: 115, dprMin: 21, dprMax: 26 },
  '4': { ac: 14, hpMin: 116, hpMax: 130, dprMin: 27, dprMax: 32 },
  '5': { ac: 15, hpMin: 131, hpMax: 145, dprMin: 33, dprMax: 38 },
  '6': { ac: 15, hpMin: 146, hpMax: 160, dprMin: 39, dprMax: 44 },
  '7': { ac: 15, hpMin: 161, hpMax: 175, dprMin: 45, dprMax: 50 },
  '8': { ac: 16, hpMin: 176, hpMax: 190, dprMin: 51, dprMax: 56 },
  '9': { ac: 16, hpMin: 191, hpMax: 205, dprMin: 57, dprMax: 62 },
  '10': { ac: 17, hpMin: 206, hpMax: 220, dprMin: 63, dprMax: 68 },
  '11': { ac: 17, hpMin: 221, hpMax: 235, dprMin: 69, dprMax: 74 },
  '12': { ac: 17, hpMin: 236, hpMax: 250, dprMin: 75, dprMax: 80 },
  '13': { ac: 18, hpMin: 251, hpMax: 265, dprMin: 81, dprMax: 86 },
  '14': { ac: 18, hpMin: 266, hpMax: 280, dprMin: 87, dprMax: 92 },
  '15': { ac: 18, hpMin: 281, hpMax: 295, dprMin: 93, dprMax: 98 },
  '16': { ac: 18, hpMin: 296, hpMax: 310, dprMin: 99, dprMax: 104 },
  '17': { ac: 19, hpMin: 311, hpMax: 325, dprMin: 105, dprMax: 110 },
  '18': { ac: 19, hpMin: 326, hpMax: 340, dprMin: 111, dprMax: 116 },
  '19': { ac: 19, hpMin: 341, hpMax: 355, dprMin: 117, dprMax: 122 },
  '20': { ac: 19, hpMin: 356, hpMax: 400, dprMin: 123, dprMax: 140 },
};

const SRD_FALLBACK_MONSTERS = [
  { name: 'Goblin', index: 'goblin', challenge_rating: '1/4', size: 'Small', type: 'humanoid', subtype: 'goblinoid', alignment: 'neutral evil', armor_class: 15, hit_points: 7, hit_dice: '2d6', speed: { walk: '30 ft.' }, strength: 8, dexterity: 14, constitution: 10, intelligence: 10, wisdom: 8, charisma: 8, languages: 'Common, Goblin', senses: { darkvision: '60 ft.', passive_perception: 9 }, actions: [{ name: 'Scimitar', attack_bonus: 4, desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.' }] },
  { name: 'Orc', index: 'orc', challenge_rating: '1/2', size: 'Medium', type: 'humanoid', subtype: 'orc', alignment: 'chaotic evil', armor_class: 13, hit_points: 15, hit_dice: '2d8 + 6', speed: { walk: '30 ft.' }, strength: 16, dexterity: 12, constitution: 16, intelligence: 7, wisdom: 11, charisma: 10, languages: 'Common, Orc', senses: { darkvision: '60 ft.', passive_perception: 10 }, actions: [{ name: 'Greataxe', attack_bonus: 5, desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage.' }] },
  { name: 'Skeleton', index: 'skeleton', challenge_rating: '1/4', size: 'Medium', type: 'undead', subtype: '', alignment: 'lawful evil', armor_class: 13, hit_points: 13, hit_dice: '2d8 + 4', speed: { walk: '30 ft.' }, strength: 10, dexterity: 14, constitution: 15, intelligence: 6, wisdom: 8, charisma: 5, languages: 'Understands languages it knew in life but can\'t speak', senses: { darkvision: '60 ft.', passive_perception: 9 }, actions: [{ name: 'Shortsword', attack_bonus: 4, desc: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.' }] },
  { name: 'Ogre', index: 'ogre', challenge_rating: '2', size: 'Large', type: 'giant', subtype: '', alignment: 'chaotic evil', armor_class: 11, hit_points: 59, hit_dice: '7d10 + 21', speed: { walk: '40 ft.' }, strength: 19, dexterity: 8, constitution: 16, intelligence: 5, wisdom: 7, charisma: 7, languages: 'Common, Giant', senses: { passive_perception: 8 }, actions: [{ name: 'Greatclub', attack_bonus: 6, desc: 'Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage.' }] },
  { name: 'Young Red Dragon', index: 'young-red-dragon', challenge_rating: '10', size: 'Large', type: 'dragon', subtype: '', alignment: 'chaotic evil', armor_class: 18, hit_points: 178, hit_dice: '17d10 + 85', speed: { walk: '40 ft.', climb: '40 ft.', fly: '80 ft.' }, strength: 23, dexterity: 10, constitution: 21, intelligence: 14, wisdom: 11, charisma: 19, languages: 'Common, Draconic', senses: { blindsight: '30 ft.', darkvision: '120 ft.', passive_perception: 17 }, actions: [{ name: 'Bite', attack_bonus: 10, desc: 'Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 7 (2d6) fire damage.' }] },
  { name: 'Lich', index: 'lich', challenge_rating: '21', size: 'Medium', type: 'undead', subtype: '', alignment: 'any evil alignment', armor_class: 17, hit_points: 135, hit_dice: '18d8 + 54', speed: { walk: '30 ft.' }, strength: 11, dexterity: 16, constitution: 16, intelligence: 20, wisdom: 14, charisma: 16, languages: 'Common plus up to five other languages', senses: { truesight: '120 ft.', passive_perception: 12 }, actions: [{ name: 'Paralyzing Touch', attack_bonus: 12, desc: 'Melee Spell Attack: +12 to hit, reach 5 ft., one creature. Hit: 10 (3d6) cold damage.' }] },
];

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
const SRD_RACES = [
  { race: 'Dragonborn', subraces: [] },
  { race: 'Dwarf', subraces: ['Hill Dwarf', 'Mountain Dwarf'] },
  { race: 'Elf', subraces: ['High Elf', 'Wood Elf', 'Dark Elf (Drow)'] },
  { race: 'Gnome', subraces: ['Forest Gnome', 'Rock Gnome'] },
  { race: 'Half-Elf', subraces: [] },
  { race: 'Half-Orc', subraces: [] },
  { race: 'Halfling', subraces: ['Lightfoot Halfling', 'Stout Halfling'] },
  { race: 'Human', subraces: [] },
  { race: 'Tiefling', subraces: [] },
];
const SRD_RACE_OPTIONS = ['—', ...SRD_RACES.map((entry) => entry.race)];

const ORC_VARIANTS = [
  'Orc Brawler', 'Orc Warrior', 'Orc Brute', 'Orc Berserker', 'Orc Raider', 'Orc Reaver', 'Orc Skirmisher', 'Orc Hunter', 'Orc Tracker',
  'Orc Scout', 'Orc Archer', 'Orc Javelin-Thrower', 'Orc Spearfighter', 'Orc Axeman', 'Orc Shieldbearer', 'Orc Duelist', 'Orc Ravager',
  'Orc Marauder', 'Orc Bloodrager', 'Orc Champion', 'Orc Warlord', 'Orc Chieftain', 'Orc Captain', 'Orc Taskmaster', 'Orc Beastmaster',
  'Orc Wolf Rider', 'Orc Boar Rider', 'Orc Drummer', 'Orc Standard-Bearer', 'Orc Shaman', 'Orc War Priest', 'Orc Hexer', 'Orc Bonecaster',
  'Orc Spirit Caller', 'Orc Firecaller', 'Orc Necroshaman', 'Orc Witch Doctor', 'Orc Assassin', 'Orc Ambusher', 'Orc Stalker',
  'Orc Nightblade', 'Orc Executioner', 'Orc Torturer', 'Orc Siege Breaker', 'Orc Demolisher', 'Orc Gatecrusher', 'Orc Slaver',
  'Orc Pillager', 'Orc Butcher', 'Orc Flesh-Eater', 'Orc Blood Guard', 'Orc Ironhide', 'Orc Doomcaller', 'Orc Skullcrusher', 'Orc War Beast',
  'Orc Elite Guard', 'Orc Veteran', 'Orc Youngblood', 'Orc Outcast', 'Orc Exile', 'Orc Bonebreaker', 'Orc Storm Orc', 'Orc Frost Orc',
  'Orc Ash Orc', 'Orc Blacktooth Orc', 'Orc Red Fang Orc',
];

const ORC_VARIANT_ATTACK_LIBRARY = [
  { name: 'Brutal Greataxe', kind: 'Melee Weapon Attack', theme: 'great axe', range: 'reach 5 ft.', target: 'one target', damage: '1d12+3', damageType: 'slashing', rider: 'If the target is bloodied, it takes an extra 3 (1d6) slashing damage.' },
  { name: 'Hooking Spear', kind: 'Melee Weapon Attack', theme: 'spear', range: 'reach 10 ft.', target: 'one target', damage: '1d10+3', damageType: 'piercing', rider: 'Target must succeed on a DC 13 Strength save or be pulled 10 feet.' },
  { name: 'Raiders Javelin', kind: 'Ranged Weapon Attack', theme: 'javelin', range: '30/120 ft.', target: 'one target', damage: '1d8+3', damageType: 'piercing', rider: 'The first hit each turn reduces target speed by 10 feet.' },
  { name: 'Shieldbash', kind: 'Melee Weapon Attack', theme: 'slam', range: 'reach 5 ft.', target: 'one target', damage: '1d8+3', damageType: 'bludgeoning', rider: 'Target must succeed on a DC 13 Strength save or be knocked prone.' },
  { name: 'Cleaving Chop', kind: 'Melee Weapon Attack', theme: 'cleaver', range: 'reach 5 ft.', target: 'one target', damage: '2d6+3', damageType: 'slashing', rider: 'A second creature within 5 feet takes 3 slashing damage.' },
  { name: 'Skullsplitter', kind: 'Melee Weapon Attack', theme: 'maul', range: 'reach 5 ft.', target: 'one target', damage: '1d10+3', damageType: 'bludgeoning', rider: 'On a critical hit, the target is stunned until the end of its next turn.' },
  { name: 'Nightblade Strike', kind: 'Melee Weapon Attack', theme: 'blade', range: 'reach 5 ft.', target: 'one target', damage: '1d8+3', damageType: 'slashing', rider: 'Deals an extra 3 (1d6) poison damage when attacking with advantage.' },
  { name: 'Bonebreaker Maul', kind: 'Melee Weapon Attack', theme: 'maul', range: 'reach 5 ft.', target: 'one target', damage: '2d8+3', damageType: 'bludgeoning', rider: 'Target has disadvantage on opportunity attacks until end of its next turn.' },
];

const ORC_VARIANT_ACTION_LIBRARY = [
  { name: 'Warcry of the Horde', description: 'Each allied orc within 30 feet that can hear this creature gains advantage on its next attack roll before the end of its next turn.', usage: '1/short rest' },
  { name: 'Savage Rush', description: 'The orc moves up to its speed toward an enemy and can make one melee attack as part of this movement. Opportunity attacks against it are made with disadvantage.' },
  { name: 'Crushing Follow-Through', description: 'After this orc hits a creature with a melee attack, it can force that target to make a DC 13 Strength save or be shoved 10 feet.' },
  { name: 'Drumbeat Advance', description: 'Until the start of this orc\'s next turn, allied creatures that start their turn within 20 feet gain +10 feet to walking speed.', usage: '3/day' },
  { name: 'Hex Totem', description: 'One creature the orc can see within 60 feet must succeed on a DC 13 Wisdom save or deal half damage with weapon attacks until the end of its next turn.', usage: '2/day' },
  { name: 'Blood Frenzy', description: 'The orc gains advantage on melee attack rolls and resistance to bludgeoning, piercing, and slashing damage until the start of its next turn.', recharge: '5-6' },
];

const ORC_VARIANT_PROFILE_RULES = [
  { tokens: ['archer', 'javelin-thrower', 'hunter', 'scout', 'tracker'], role: 'artillery', attacks: ['Raiders Javelin'], actions: ['Savage Rush'] },
  { tokens: ['shaman', 'war priest', 'hexer', 'bonecaster', 'spirit caller', 'firecaller', 'necroshaman', 'witch doctor', 'doomcaller'], role: 'controller', attacks: ['Nightblade Strike'], actions: ['Hex Totem'] },
  { tokens: ['drummer', 'standard-bearer', 'taskmaster', 'captain', 'chieftain', 'warlord'], role: 'support', attacks: ['Shieldbash'], actions: ['Warcry of the Horde', 'Drumbeat Advance'] },
  { tokens: ['wolf rider', 'boar rider', 'skirmisher', 'raider', 'reaver', 'ambusher', 'stalker', 'nightblade', 'assassin'], role: 'skirmisher', attacks: ['Hooking Spear', 'Raiders Javelin', 'Nightblade Strike'], actions: ['Savage Rush', 'Crushing Follow-Through'] },
  { tokens: ['shieldbearer', 'ironhide', 'blood guard', 'elite guard', 'veteran', 'champion', 'duelist'], role: 'defender', attacks: ['Shieldbash', 'Brutal Greataxe'], actions: ['Crushing Follow-Through'] },
  { tokens: ['brute', 'brawler', 'berserker', 'ravager', 'marauder', 'bloodrager', 'executioner', 'demolisher', 'gatecrusher', 'butcher', 'flesh-eater', 'bonebreaker', 'war beast', 'storm orc', 'frost orc', 'ash orc'], role: 'brute', attacks: ['Brutal Greataxe', 'Bonebreaker Maul', 'Cleaving Chop', 'Skullsplitter'], actions: ['Blood Frenzy', 'Savage Rush'] },
];

const ORC_ROLE_DEFAULTS = {
  brute: { attacks: ['Brutal Greataxe', 'Bonebreaker Maul', 'Cleaving Chop', 'Skullsplitter'], actions: ['Blood Frenzy', 'Savage Rush'] },
  skirmisher: { attacks: ['Hooking Spear', 'Raiders Javelin', 'Nightblade Strike'], actions: ['Savage Rush', 'Crushing Follow-Through'] },
  artillery: { attacks: ['Raiders Javelin', 'Hooking Spear'], actions: ['Savage Rush'] },
  support: { attacks: ['Shieldbash', 'Brutal Greataxe'], actions: ['Warcry of the Horde', 'Drumbeat Advance'] },
  controller: { attacks: ['Nightblade Strike', 'Hooking Spear'], actions: ['Hex Totem', 'Crushing Follow-Through'] },
  defender: { attacks: ['Shieldbash', 'Brutal Greataxe'], actions: ['Crushing Follow-Through', 'Warcry of the Horde'] },
};

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

const AFFINITY_RULES = {
  aquatic: {
    damagePool: ['bludgeoning', 'piercing', 'cold', 'lightning', 'acid'],
    avoidDamage: ['fire'],
    attackThemes: ['bite', 'tail', 'gore', 'claws', 'slam', 'javelin', 'tentacle'],
    spellsAtWill: ['gust', 'ray of frost', 'minor illusion', 'mage hand', 'shape water'],
    spellsDaily: ['tidal wave', 'control water', 'lightning bolt', 'slow', 'fog cloud'],
    bonusActions: ['Undertow Step', 'Current Slip', 'Predatory Surge'],
    reactions: ['Rip Current Riposte', 'Brine Guard', 'Depth Counter'],
    legendary: ['Tidal Slip', 'Breaker Pulse', 'Abyssal Rush'],
    lair: ['Crashing Tides', 'Pressure Surge', 'Razor Current'],
  },
  infernal: {
    damagePool: ['fire', 'necrotic', 'poison'],
    attackThemes: ['claws', 'tail', 'whip', 'great axe'],
  },
  storm: {
    damagePool: ['lightning', 'thunder', 'cold', 'bludgeoning'],
    attackThemes: ['spear', 'tail', 'slam', 'bow'],
  },
  primal: {
    damagePool: ['slashing', 'piercing', 'bludgeoning', 'poison'],
    attackThemes: ['bite', 'claws', 'tail', 'gore', 'slam'],
  },
};

const TRAIT_ARCHETYPES = {
  brute: [
    { effect: 'takes reduced damage from weapon hits', trigger: 'while above half hit points', kind: 'mitigation', scalesWith: 'proficiency' },
    { effect: 'knocks creatures prone when it moves through their space', trigger: 'once on each turn', kind: 'control', scalesWith: 'saveDc' },
  ],
  skirmisher: [
    { effect: 'can move up to 10 feet without provoking opportunity attacks', trigger: 'after it damages a creature', kind: 'mobility', scalesWith: 'flat' },
    { effect: 'imposes disadvantage on the next attack against it', trigger: 'when it moves at least 15 feet on its turn', kind: 'defense', scalesWith: 'saveDc' },
  ],
  controller: [
    { effect: 'reduces a target\'s speed by 10 feet', trigger: 'when it deals damage', kind: 'control', scalesWith: 'saveDc' },
    { effect: 'creates difficult terrain in a 10-foot radius', trigger: 'at the start of its turn', kind: 'zone', scalesWith: 'flat' },
  ],
  artillery: [
    { effect: 'ignores half cover with ranged attacks', trigger: 'always active', kind: 'offense', scalesWith: 'flat' },
    { effect: 'deals bonus damage to creatures farther than 30 feet', trigger: 'on ranged hits', kind: 'damage', scalesWith: 'proficiency' },
  ],
  support: [
    { effect: 'grants temporary hit points to an ally', trigger: 'at the start of its turn', kind: 'ally', scalesWith: 'proficiency' },
    { effect: 'lets an ally reroll a failed save', trigger: 'as a reaction', kind: 'ally', scalesWith: 'usage' },
  ],
  defender: [
    { effect: 'marks creatures it hits, imposing disadvantage on attacks not targeting it', trigger: 'until the start of its next turn', kind: 'mark', scalesWith: 'flat' },
    { effect: 'can intercept damage meant for an adjacent ally', trigger: 'as a reaction', kind: 'ally', scalesWith: 'proficiency' },
  ],
  boss: [
    { effect: 'shrugs off one failed save', trigger: 'once per round', kind: 'legendary', scalesWith: 'usage' },
    { effect: 'immediately makes a weapon attack', trigger: 'when reduced below half hit points', kind: 'counter', scalesWith: 'flat' },
  ],
  ambusher: [
    { effect: 'deals extra damage against surprised creatures', trigger: 'on the first round of combat', kind: 'damage', scalesWith: 'proficiency' },
    { effect: 'becomes lightly obscured by shadow or mist', trigger: 'if it moved this turn', kind: 'defense', scalesWith: 'flat' },
  ],
};

const hasDocument = typeof document !== 'undefined';
const formEl = hasDocument ? document.getElementById('monster-form') : null;
const statusEl = hasDocument ? document.getElementById('studio-status') : null;

let monster = createDefaultMonster();
let srdMonsters = [];
let srdMonstersByCr = {};
let srdLoadPromise = null;

if (hasDocument && formEl && statusEl) {
  init();
}

function createDefaultMonster() {
  const generatedMonster = {
    schemaVersion: 1,
    identity: {
      name: 'Ashenfang Matriarch',
      subtitle: 'Huge monstrosity, chaotic evil',
      size: 'Huge',
      type: 'monstrosity',
      ancestryRace: '',
      ancestrySubrace: '',
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

  return generatedMonster;
}

async function init() {
  await ensureSrdMonstersLoaded();
  populateSelects();
  renderForm();
  renderPreview();

  document.querySelectorAll('.preview-tab').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.getElementById('apply-preset').addEventListener('click', applyPreset);
  document.getElementById('randomize-monster').addEventListener('click', randomFromCr);
  document.getElementById('import-srd-monster').addEventListener('click', loadSelectedSrdMonster);
  document.getElementById('srd-monster-select').addEventListener('change', loadSelectedSrdMonster);
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

  if (!hasSrdForCr(randomCr.value)) {
    const firstAvailableCr = CR_OPTIONS.find((cr) => hasSrdForCr(cr));
    if (firstAvailableCr) randomCr.value = firstAvailableCr;
  }

  populateSrdMonsterSelect(randomCr.value);
  randomCr.addEventListener('change', () => populateSrdMonsterSelect(randomCr.value));
}

function hasSrdForCr(cr) {
  return Boolean((srdMonstersByCr[normalizeCrKey(cr)] || []).length);
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
  formEl.querySelectorAll('[data-random-trait]').forEach((btn) => btn.addEventListener('click', addRandomTraitByCr));
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
  const raceSelection = i.ancestryRace || '—';
  const subraceOptions = getSubraceOptions(i.ancestryRace);
  const subraceSelection = i.ancestrySubrace || '—';
  wrap.innerHTML = textField('Name', 'identity.name', i.name)
    + textField('Subtitle', 'identity.subtitle', i.subtitle)
    + selectField('Size', 'identity.size', i.size, SIZE_OPTIONS)
    + selectField('Creature Type', 'identity.type', i.type, MONSTER_TYPES)
    + selectField('SRD Race (humanoids)', 'identity.ancestryRace', raceSelection, SRD_RACE_OPTIONS)
    + selectField('SRD Subrace', 'identity.ancestrySubrace', subraceSelection, subraceOptions)
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
  const randomTraitButton = path === 'combat.traits'
    ? `<button class="btn btn-secondary" type="button" data-random-trait="${path}">Random Trait (CR)</button>`
    : '';
  sectionEl.innerHTML = `<h3>${title}</h3><div class="entry-list">${list.map((item, i) => entryHtml(path, i, fields, item)).join('')}</div><div class="entry-actions">${randomTraitButton}<button class="btn btn-secondary" type="button" data-add="${path}">Add ${title.slice(0, -1)}</button></div>`;
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

  if (path === 'identity.ancestryRace') {
    const normalizedRace = value === '—' ? '' : value;
    setByPath(monster, path, normalizedRace);
    const allowedSubraces = getSubraceOptions(normalizedRace).filter((entry) => entry !== '—');
    if (!allowedSubraces.includes(monster.identity.ancestrySubrace)) {
      monster.identity.ancestrySubrace = '';
    }
    renderForm();
  }

  if (path === 'identity.ancestrySubrace' && value === '—') {
    monster.identity.ancestrySubrace = '';
  }

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

function addRandomTraitByCr() {
  const cr = normalizeCrKey(monster?.identity?.cr || '1');
  const traitPool = buildCrTraitPool(cr, monster);
  if (!traitPool.length) {
    setStatus(`No trait templates found for CR ${cr}.`, true);
    return;
  }

  const traits = Array.isArray(monster.combat?.traits) ? monster.combat.traits : [];
  const existingNames = new Set(traits.map((trait) => String(trait?.name || '').toLowerCase()));
  const availableTraits = traitPool.filter((trait) => !existingNames.has(String(trait.name || '').toLowerCase()));
  const nextTrait = pick(availableTraits.length ? availableTraits : traitPool);

  traits.push(normalizeCombatFeatureEntry(nextTrait, 'Trait'));
  monster.combat.traits = traits;

  renderForm();
  renderPreview();
  setStatus(`Added CR ${cr} trait: ${nextTrait.name}.`);
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
  return `<h3>${title}</h3><ul>${list.map((entry) => `<li><strong>${entry.name || 'Untitled'}.</strong> ${entry.description || entry.hit || ''}${entry.trigger ? ` <em>Trigger:</em> ${entry.trigger}.` : ''}${entry.saveDc ? ` <em>Save:</em> ${entry.saveDc}.` : ''}${entry.usage ? ` <em>Usage:</em> ${entry.usage}.` : ''}${entry.recharge ? ` <em>Recharge:</em> ${entry.recharge}.` : ''}</li>`).join('')}</ul>`;
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
  const defaultMonster = createDefaultMonster();
  monster = {
    ...defaultMonster,
    ...monster,
    identity: {
      ...monster.identity,
      name: preset.name,
      subtitle: preset.subtitle,
      role: preset.role,
      cr: preset.cr,
      environment: preset.environment,
      origin: preset.origin,
    },
    core: {
      ...monster.core,
      ac: preset.ac,
      hp: preset.hp,
      abilities: preset.abilities || monster.core.abilities,
      speed: { ...monster.core.speed, ...(preset.speed || {}) },
    },
    defense: {
      ...monster.defense,
      resistances: preset.resistances || monster.defense.resistances,
      immunities: preset.immunities || monster.defense.immunities,
      conditionImmunities: preset.conditionImmunities || monster.defense.conditionImmunities,
    },
    combat: {
      ...monster.combat,
      attacks: preset.attacks || monster.combat.attacks,
      spellcasting: preset.spellcasting || monster.combat.spellcasting,
      actions: preset.actions || monster.combat.actions,
    },
    flavor: {
      ...defaultMonster.flavor,
      ...(preset.flavor || {}),
    },
  };
  renderForm();
  renderPreview();
  setStatus(`Preset loaded: ${key}.`);
}

async function randomFromCr() {
  const cr = document.getElementById('random-cr').value;
  const style = document.getElementById('random-style').value;
  let randomSrdMonster = pickRandomSrdMonsterForCr(cr);

  if (!randomSrdMonster) {
    await ensureSrdMonstersLoaded(true);
    populateSrdMonsterSelect(cr);
    randomSrdMonster = pickRandomSrdMonsterForCr(cr);
  }

  if (randomSrdMonster) {
    monster = importSrdMonster(randomSrdMonster, monster);
    syncSrdSelection(cr, randomSrdMonster);
    setStatus(`Random SRD monster loaded for CR ${cr}: ${randomSrdMonster.name}.`);
    renderForm();
    renderPreview();
    return;
  }

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

function pickRandomSrdMonsterForCr(cr) {
  const list = srdMonstersByCr[normalizeCrKey(cr)] || [];
  if (!list.length) return null;
  return pick(list);
}

function syncSrdSelection(cr, selectedMonster) {
  const select = document.getElementById('srd-monster-select');
  if (!select || !selectedMonster) return;

  const list = srdMonstersByCr[normalizeCrKey(cr)] || [];
  const selectedValue = selectedMonster.index || String(list.indexOf(selectedMonster));
  select.value = selectedValue;
}


function generateRandomMonster(cr, styleKey) {
  const baseMonster = monster && typeof monster === 'object' ? monster : createDefaultMonster();
  const profile = STYLE_PROFILES[styleKey] || STYLE_PROFILES.balanced;
  const normalizedCr = normalizeCrKey(cr);
  const numericCr = crToNumber(normalizedCr);
  const baseline = getCrBaseline(normalizedCr);
  const names = [...(RANDOM_BY_CR[normalizedCr] || []), ...profile.names, ...Object.values(PRESETS).map((preset) => preset.name)];
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
  const ancestry = type === 'humanoid' ? pick(SRD_RACES) : null;
  const ancestryRace = ancestry ? ancestry.race : '';
  const ancestrySubrace = ancestry && ancestry.subraces.length ? pick(ancestry.subraces) : '';
  const humanoidSubtype = ancestrySubrace || ancestryRace;
  const role = pick(ROLES);
  const alignment = pick(ALIGNMENTS);
  const origin = chance(0.65) ? pick(ORIGINS) : styleKey;
  const environmentList = pickMany(ENVIRONMENTS, randomInt(2, 5));
  const tags = pickMany(['alpha', 'lurker', 'hunter', 'ritual', 'sentinel', 'siege', 'pack', 'arcane', 'mythic', 'venomous', 'frenzied', 'eldritch', 'planar', 'cunning'], randomInt(2, 4)).join(', ');

  const proficiencyBonus = Math.max(2, Math.min(9, 2 + Math.floor((numericCr - 1) / 4)));
  const hp = randomInt(baseline.hpMin, baseline.hpMax);

  const affinity = inferAffinity({ styleKey, type, origin, environmentList });

  const speed = {
    walk: randomInt(25, 50),
    climb: chance(0.45) ? randomInt(15, 40) : 0,
    swim: chance(affinity === 'aquatic' ? 0.98 : 0.35) ? randomInt(20, 60) : 0,
    burrow: chance(affinity === 'aquatic' ? 0.08 : 0.28) ? randomInt(10, 35) : 0,
    fly: chance(styleKey === 'draconic' || styleKey === 'celestial' ? 0.65 : affinity === 'aquatic' ? 0.1 : 0.4) ? randomInt(30, 90) : 0,
    hover: false,
  };

  speed.hover = speed.fly > 0 && affinity !== 'aquatic' && chance(0.26);

  const roleAbilityBoosts = {
    brute: { str: 3, con: 2 }, skirmisher: { dex: 3, wis: 1 }, controller: { int: 3, wis: 1 }, artillery: { dex: 2, int: 2 },
    support: { wis: 2, cha: 2 }, defender: { con: 3, str: 1 }, boss: { str: 2, con: 2, cha: 1 }, ambusher: { dex: 3, str: 1 },
  };

  const abilities = {
    str: clamp(8 + randomInt(0, 8) + Math.floor(numericCr / 2), 3, 30),
    dex: clamp(8 + randomInt(0, 8) + (styleKey === 'swarm' ? 2 : 0), 3, 30),
    con: clamp(10 + randomInt(0, 8) + Math.floor(numericCr / 3), 3, 30),
    int: clamp(4 + randomInt(0, 10), 1, 30),
    wis: clamp(6 + randomInt(0, 10), 1, 30),
    cha: clamp(5 + randomInt(0, 10), 1, 30),
  };

  const boosts = roleAbilityBoosts[role] || {};
  Object.entries(boosts).forEach(([ability, amount]) => {
    abilities[ability] = clamp((abilities[ability] || 10) + amount, 1, 30);
  });

  const ac = clamp(baseline.ac + randomInt(-1, 2) + (role === 'defender' ? 1 : 0), 10, 25);
  const hitDieSize = numericCr >= 10 ? 12 : numericCr >= 5 ? 10 : 8;
  const avgPerDie = hitDieSize / 2 + 0.5;
  const conMod = Math.floor((abilities.con - 10) / 2);
  const hitDiceCount = Math.max(2, Math.round(hp / Math.max(1, avgPerDie + conMod)));
  const hitDiceBonus = Math.max(0, hitDiceCount * conMod);

  const affinityProfile = AFFINITY_RULES[affinity] || AFFINITY_RULES.primal;
  const mainDamage = pick(affinityProfile.damagePool || DAMAGE_TYPES);
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

  const attacks = Array.from({ length: attackCount }, () => buildAttackBlock({ numericCr, proficiencyBonus, abilities, mainDamage, styleKey, affinityProfile }));

  const traitBuildContext = {
    usedTitles: new Set(),
    usedSuffixes: new Set(),
    usedTemplateKinds: new Set(),
    usedSaveAbilities: new Set(),
    usedDescriptionOpeners: new Set(),
  };

  const generatedMonster = {
    identity: {
      ...baseMonster.identity,
      name,
      subtitle: `${size} ${type}${humanoidSubtype ? ` (${humanoidSubtype.toLowerCase()})` : ''}, ${alignment}`,
      size,
      type,
      ancestryRace,
      ancestrySubrace,
      tags,
      alignment,
      environment: environmentList.join(', '),
      role,
      cr: normalizedCr,
      origin,
    },
    core: {
      ...baseMonster.core,
      ac,
      hp,
      hitDice: `${hitDiceCount}d${hitDieSize}${hitDiceBonus ? ` + ${hitDiceBonus}` : ''}`,
      speed,
      abilities,
      proficiencyBonus,
      initiativeBonus: Math.floor((abilities.dex - 10) / 2),
      passivePerception: 10 + Math.floor((abilities.wis - 10) / 2) + (chance(0.55) ? proficiencyBonus : 0),
    },
    defense: {
      ...baseMonster.defense,
      savingThrows: buildSavingThrows(abilities, proficiencyBonus),
      skills: buildSkills(proficiencyBonus),
      vulnerabilities: chance(0.3) ? pickMany(DAMAGE_TYPES.filter((d) => d !== mainDamage && !(affinityProfile.avoidDamage || []).includes(d)), 1) : [],
      resistances: pickMany((affinityProfile.damagePool || DAMAGE_TYPES).filter((d) => d !== mainDamage), randomInt(1, 3)),
      immunities: chance(0.4) ? pickMany((affinityProfile.damagePool || DAMAGE_TYPES).filter((d) => d !== mainDamage), randomInt(1, 2)) : [],
      conditionImmunities: chance(0.6) ? pickMany(CONDITIONS, randomInt(1, 3)) : [],
      senses: pickMany(SENSE_OPTIONS, randomInt(1, 3)).join(', '),
      languages: pickMany(LANGUAGE_OPTIONS, randomInt(1, 4)).join(', '),
      telepathy: chance(0.4) ? `${randomInt(30, 120)} ft.` : '',
    },
    combat: {
      ...baseMonster.combat,
      traits: Array.from({ length: traitCount }, (_, index) => buildTrait({
        profileTraits: profile.traits,
        name,
        roleFlavor,
        role,
        saveDc,
        proficiencyBonus,
        numericCr,
        mainDamage,
        index,
        context: traitBuildContext,
      })),
      actions: Array.from({ length: actionCount }, () => buildAction(profile.actions, saveDc, mainDamage, name, affinityProfile)),
      bonusActions: Array.from({ length: bonusCount }, () => buildBonusAction(name, affinityProfile)),
      reactions: Array.from({ length: reactionCount }, () => buildReaction(name, affinityProfile)),
      legendaryActions: Array.from({ length: legendaryCount }, () => buildLegendary(name, styleKey, affinityProfile)),
      lairActions: Array.from({ length: lairCount }, () => buildLair(name, saveDc, styleKey, affinityProfile)),
      mythic: Array.from({ length: mythicCount }, () => buildMythic(name, hp)),
      attacks,
      spellcasting: chance(0.7) ? [buildSpellcasting(saveDc, proficiencyBonus, abilities, affinityProfile)] : [],
    },
    flavor: {
      ...baseMonster.flavor,
      summary: `${name} is a ${roleFlavor.toLowerCase()} ${type} built for CR ${normalizedCr} encounters with ${RANDOM_STYLES[styleKey] || 'balanced'} flavor.`,
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

  return applyOrcVariantCustomization(generatedMonster);
}

function buildAttackBlock({ numericCr, proficiencyBonus, abilities, mainDamage, styleKey, affinityProfile }) {
  const attackTheme = pick((affinityProfile && affinityProfile.attackThemes) || ATTACK_THEMES);
  const crKey = normalizeCrKey(numericCr);
  const baseline = getCrBaseline(crKey);
  const avgDamage = randomInt(Math.max(2, baseline.dprMin), Math.max(4, baseline.dprMax));
  const dice = damageDice(avgDamage, attackTheme);
  const toHit = `+${Math.max(3, proficiencyBonus + Math.floor((Math.max(abilities.str, abilities.dex) - 10) / 2))}`;
  const saveDc = 10 + proficiencyBonus + Math.floor((Math.max(abilities.str, abilities.wis) - 10) / 2);
  const secondaryPool = DAMAGE_TYPES.filter((d) => d !== mainDamage && !((affinityProfile?.avoidDamage || []).includes(d)));
  const secondaryType = pick((affinityProfile?.damagePool || secondaryPool).filter((d) => d !== mainDamage));
  const secondaryDamageRoll = damageDice(randomInt(4, 18), attackTheme);
  const includeSecondaryDamage = chance(0.55) && Boolean(secondaryType);
  return {
    name: `${titleCase(attackTheme)} ${pick(['Strike', 'Rend', 'Lash', 'Crash', 'Volley'])}`,
    kind: chance(0.35) ? 'Ranged Weapon Attack' : 'Melee Weapon Attack',
    theme: attackTheme,
    toHit,
    range: chance(0.35) ? `${randomInt(30, 150)}/${randomInt(120, 360)} ft.` : `reach ${randomInt(5, 20)} ft.`,
    target: pick(['one target', 'up to two targets', 'one creature and one adjacent creature']),
    hit: `${avgDamage} (${dice}) ${mainDamage} damage${includeSecondaryDamage ? ` plus ${randomInt(4, 18)} (${secondaryDamageRoll}) ${secondaryType}` : ''}`,
    damage: dice,
    damageType: mainDamage,
    secondaryDamage: includeSecondaryDamage ? `${secondaryDamageRoll} ${secondaryType}` : '',
    save: chance(0.4) ? `${saveDc} ${pick(['Str', 'Dex', 'Con', 'Wis'])}` : '',
    rider: chance(0.65) ? pick(['Target is knocked prone.', 'Target cannot take reactions until start of its next turn.', 'Target speed is reduced by 10 ft. until end of its next turn.', 'Target cannot regain hit points until start of this creature\'s next turn.', 'Target is pushed 10 feet and must succeed on a concentration check.']) : '',
    styleNote: `Generated with ${RANDOM_STYLES[styleKey] || 'Balanced'} style.`,
    recharge: chance(0.3) ? '5-6' : '',
    multiattackGroup: chance(0.8) ? 'Multiattack' : '',
  };
}

function isOrcIdentity(identity = {}) {
  const name = String(identity.name || '').toLowerCase();
  const type = String(identity.type || '').toLowerCase();
  const tags = String(identity.tags || '').toLowerCase();
  const race = String(identity.ancestryRace || '').toLowerCase();
  const subrace = String(identity.ancestrySubrace || '').toLowerCase();
  return race.includes('orc') || subrace.includes('orc') || type.includes('orc') || tags.includes('orc') || /^orc\b/.test(name);
}

function getOrcVariantProfile(variantName = '') {
  const normalizedName = String(variantName || '').toLowerCase();
  const profile = ORC_VARIANT_PROFILE_RULES.find((entry) => entry.tokens.some((token) => normalizedName.includes(token)));
  return profile || { role: 'brute', attacks: [], actions: [] };
}

function pickAttackTemplateByName(name) {
  return ORC_VARIANT_ATTACK_LIBRARY.find((entry) => entry.name === name) || null;
}

function pickActionTemplateByName(name) {
  return ORC_VARIANT_ACTION_LIBRARY.find((entry) => entry.name === name) || null;
}

function getOrcRoleDefaults(role = 'brute') {
  return ORC_ROLE_DEFAULTS[role] || ORC_ROLE_DEFAULTS.brute;
}

function createOrcVariantAttack(baseAttack = {}, preferredAttackNames = []) {
  const preferredTemplates = preferredAttackNames.map((name) => pickAttackTemplateByName(name)).filter(Boolean);
  const template = pick(preferredTemplates.length ? preferredTemplates : ORC_VARIANT_ATTACK_LIBRARY) || ORC_VARIANT_ATTACK_LIBRARY[0];
  const templateDamageType = String(template.damageType || 'slashing');
  const damage = String(baseAttack.damage || template.damage || '1d8+3');
  const secondaryDamage = String(baseAttack.secondaryDamage || '');
  const hitRoll = damage.replace(/\s+/g, '');
  const hitText = `${damageRollAverage(hitRoll)} (${hitRoll}) ${templateDamageType} damage${secondaryDamage ? ` plus ${secondaryDamage}` : ''}`;

  return normalizeAttackEntry({
    ...baseAttack,
    name: template.name,
    kind: template.kind,
    theme: template.theme,
    range: template.range,
    target: template.target,
    damage,
    damageType: templateDamageType,
    rider: template.rider,
    hit: hitText,
  });
}

function createOrcVariantAction(baseAction = {}, preferredActionNames = []) {
  const preferredTemplates = preferredActionNames.map((name) => pickActionTemplateByName(name)).filter(Boolean);
  const template = pick(preferredTemplates.length ? preferredTemplates : ORC_VARIANT_ACTION_LIBRARY) || ORC_VARIANT_ACTION_LIBRARY[0];
  return normalizeCombatFeatureEntry({
    ...baseAction,
    name: template.name,
    category: 'Action',
    description: template.description,
    usage: template.usage || baseAction.usage || '',
    recharge: template.recharge || baseAction.recharge || '',
    trigger: template.trigger || baseAction.trigger || '',
  }, 'Action');
}

function applyOrcVariantCustomization(monsterData) {
  const result = monsterData && typeof monsterData === 'object' ? monsterData : createDefaultMonster();
  if (!isOrcIdentity(result.identity)) return result;

  const chosenName = pick(ORC_VARIANTS) || result.identity.name || 'Orc Warrior';
  const profile = getOrcVariantProfile(chosenName);
  const roleDefaults = getOrcRoleDefaults(profile.role);
  const preferredAttacks = profile.attacks?.length ? profile.attacks : roleDefaults.attacks;
  const preferredActions = profile.actions?.length ? profile.actions : roleDefaults.actions;
  const attackPool = arrayOrEmpty(result?.combat?.attacks);
  const actionPool = arrayOrEmpty(result?.combat?.actions);

  const updatedAttacks = attackPool.length
    ? attackPool.map((attack, index) => (index < 2 ? createOrcVariantAttack(attack, preferredAttacks) : normalizeAttackEntry(attack)))
    : [createOrcVariantAttack({}, preferredAttacks)];

  const updatedActions = actionPool.length
    ? actionPool.map((action, index) => (index < 2 ? createOrcVariantAction(action, preferredActions) : normalizeCombatFeatureEntry(action, 'Action')))
    : [createOrcVariantAction({}, preferredActions)];

  return {
    ...result,
    identity: {
      ...result.identity,
      name: chosenName,
      subtitle: `${result.identity.size || 'Medium'} ${result.identity.type || 'humanoid'} (orc), ${result.identity.alignment || 'chaotic evil'}`,
      tags: mergeCsvValues(result.identity.tags, 'orc, horde, warband'),
      role: profile.role || result.identity.role || 'brute',
      ancestryRace: 'Orc',
    },
    defense: {
      ...result.defense,
      languages: mergeCsvValues(result.defense.languages, 'Orc'),
    },
    combat: {
      ...result.combat,
      attacks: updatedAttacks,
      actions: updatedActions,
    },
    flavor: {
      ...result.flavor,
      summary: `${chosenName} is an orc variant built for warband encounters and battlefield pressure.`,
      tactics: `${chosenName} coordinates brutal front-line pressure, then pivots into opportunistic strikes.`,
      habitat: result.flavor?.habitat || 'raider camps, badlands, mountain passes, and fortified war camps',
    },
  };
}

function buildTrait({ profileTraits, name, roleFlavor, role, saveDc, proficiencyBonus, numericCr, mainDamage, index, context }) {
  const suffixes = ['Carapace', 'Instinct', 'Pattern', 'Aura', 'Protocol', 'Directive', 'Manifestation'];
  const roleTemplates = TRAIT_ARCHETYPES[role] || TRAIT_ARCHETYPES.brute;
  const openerTemplates = [
    `${name} fights with ${roleFlavor.toLowerCase()} instincts and`,
    `In battle, ${name} leverages ${roleFlavor.toLowerCase()} tactics to`,
    `${name} channels a ${roleFlavor.toLowerCase()} doctrine that`,
    `${name} reveals ${roleFlavor.toLowerCase()} discipline and`,
  ];

  const usedContext = context || {};
  usedContext.usedTitles = usedContext.usedTitles || new Set();
  usedContext.usedSuffixes = usedContext.usedSuffixes || new Set();
  usedContext.usedTemplateKinds = usedContext.usedTemplateKinds || new Set();
  usedContext.usedSaveAbilities = usedContext.usedSaveAbilities || new Set();
  usedContext.usedDescriptionOpeners = usedContext.usedDescriptionOpeners || new Set();

  let availableTemplates = roleTemplates.filter((entry) => !usedContext.usedTemplateKinds.has(entry.kind));
  if (!availableTemplates.length) availableTemplates = roleTemplates;
  const template = pick(availableTemplates) || roleTemplates[index % roleTemplates.length] || pick(roleTemplates);
  usedContext.usedTemplateKinds.add(template.kind);

  const traitBase = pick(profileTraits);
  let suffixPool = suffixes.filter((suffix) => !usedContext.usedSuffixes.has(suffix));
  if (!suffixPool.length) suffixPool = suffixes;
  const pickedSuffix = pick(suffixPool);
  usedContext.usedSuffixes.add(pickedSuffix);

  let title = `${traitBase} ${pickedSuffix}`;
  let titleAttempts = 0;
  while (usedContext.usedTitles.has(title) && titleAttempts < 6) {
    title = `${traitBase} ${pick(suffixes)}`;
    titleAttempts += 1;
  }
  usedContext.usedTitles.add(title);

  let availableSaveAbilities = ['Strength', 'Dexterity', 'Constitution', 'Wisdom'].filter((ability) => !usedContext.usedSaveAbilities.has(ability));
  if (!availableSaveAbilities.length) availableSaveAbilities = ['Strength', 'Dexterity', 'Constitution', 'Wisdom'];
  const saveAbility = pick(availableSaveAbilities);
  usedContext.usedSaveAbilities.add(saveAbility);

  let availableOpeners = openerTemplates.filter((opener) => !usedContext.usedDescriptionOpeners.has(opener));
  if (!availableOpeners.length) availableOpeners = openerTemplates;
  const descriptionOpener = pick(availableOpeners);
  usedContext.usedDescriptionOpeners.add(descriptionOpener);

  const bonusValue = Math.max(2, Math.ceil(proficiencyBonus * 1.5));
  const scalingText = template.scalesWith === 'saveDc'
    ? `Creatures can resist with a DC ${saveDc} ${saveAbility} save.`
    : template.scalesWith === 'proficiency'
      ? `The effect scales by ${bonusValue} (${proficiencyBonus} PB-based) ${mainDamage} damage or protection.`
      : '';
  const usage = template.scalesWith === 'usage' || (numericCr >= 10 && chance(0.35)) ? `${Math.max(1, Math.ceil(proficiencyBonus / 2))}/round` : '';
  const recharge = template.kind === 'counter' || template.kind === 'zone' ? (chance(0.5) ? '5-6' : '') : '';
  const trigger = template.trigger === 'always active' ? '' : template.trigger;

  return {
    name: title,
    category: 'Trait',
    description: `${descriptionOpener} ${template.effect}. ${scalingText}`.trim(),
    saveDc: template.scalesWith === 'saveDc' ? `${saveDc} ${saveAbility.slice(0, 3)}` : '',
    recharge,
    usage,
    trigger,
  };
}


function buildCrTraitPool(crKey, sourceMonster = {}) {
  const normalizedCr = normalizeCrKey(crKey);
  const numericCr = crToNumber(normalizedCr);
  const role = sourceMonster?.identity?.role || 'brute';
  const type = sourceMonster?.identity?.type || 'monstrosity';
  const origin = sourceMonster?.identity?.origin || 'arcane';
  const name = sourceMonster?.identity?.name || 'This creature';
  const proficiencyBonus = Math.max(2, Math.min(9, 2 + Math.floor((numericCr - 1) / 4)));
  const saveDc = 8 + proficiencyBonus + Math.max(2, Math.floor((Number(sourceMonster?.core?.abilities?.wis || 10) - 10) / 2));
  const tiers = {
    low: ['brute', 'skirmisher', 'ambusher'],
    mid: ['controller', 'artillery', 'defender'],
    high: ['support', 'boss', 'controller'],
    apex: ['boss', 'support', 'defender'],
  };
  const tierRoles = numericCr <= 2 ? tiers.low : numericCr <= 8 ? tiers.mid : numericCr <= 15 ? tiers.high : tiers.apex;
  const roleCandidates = Array.from(new Set([role, ...tierRoles])).filter((entry) => TRAIT_ARCHETYPES[entry]);

  const prefixByOrigin = {
    cursed: 'Doomscarred', infernal: 'Hellforged', arcane: 'Runebound', primordial: 'Worldfanged', divine: 'Sanctified', undead: 'Gravewrought', fey: 'Moonwoven', aberrant: 'Voidtouched', stormbound: 'Tempestforged', mechanical: 'Clockwork', mutated: 'Warpgrown', ancient: 'Ancient', shadow: 'Nightshrouded', celestial: 'Starblessed', draconic: 'Scaled', elemental: 'Elemental', aquatic: 'Depthborn', primal: 'Wild', summoned: 'Bound', default: 'Battleforged',
  };

  const traitNames = ['Ward', 'Instinct', 'Carapace', 'Discipline', 'Resurgence', 'Pressure', 'Counterpulse', 'Aegis', 'Overdrive'];
  const triggerByCr = numericCr >= 10 ? 'as a reaction' : 'once on each turn';
  const results = [];

  roleCandidates.forEach((roleKey) => {
    const templates = TRAIT_ARCHETYPES[roleKey] || [];
    templates.forEach((template, index) => {
      const prefix = prefixByOrigin[origin] || prefixByOrigin.default;
      const traitName = `${prefix} ${pick(traitNames)} ${index + 1}`;
      const scaleText = template.scalesWith === 'saveDc'
        ? `The target must succeed on a DC ${saveDc} save.`
        : template.scalesWith === 'proficiency'
          ? `It scales with proficiency bonus (+${proficiencyBonus}).`
          : template.scalesWith === 'usage'
            ? `This can be used up to ${Math.max(1, Math.ceil(proficiencyBonus / 2))} times per round.`
            : '';

      results.push(normalizeCombatFeatureEntry({
        name: traitName,
        category: 'Trait',
        description: `${name} (${type}) at CR ${normalizedCr} ${template.effect}. ${scaleText}`.trim(),
        saveDc: template.scalesWith === 'saveDc' ? `${saveDc}` : '',
        recharge: template.kind === 'counter' || template.kind === 'zone' ? '5-6' : '',
        usage: template.scalesWith === 'usage' ? `${Math.max(1, Math.ceil(proficiencyBonus / 2))}/round` : '',
        trigger: template.trigger === 'always active' ? '' : template.trigger || triggerByCr,
      }, 'Trait'));
    });
  });

  return results;
}

function buildAction(actionNames, saveDc, mainDamage, name, affinityProfile) {
  return {
    name: `${pick(actionNames)} ${pick(['Burst', 'Strike', 'Wave', 'Pulse', 'Assault'])}`,
    category: 'Action',
    description: `Creatures in a ${pick(['15-foot cone', '20-foot radius', '30-foot line'])} must succeed on a DC ${saveDc} ${pick(['Strength', 'Dexterity', 'Constitution', 'Wisdom'])} save or take ${randomInt(8, 24)} (${damageDice(randomInt(8, 24), pick((affinityProfile && affinityProfile.attackThemes) || ATTACK_THEMES))}) ${mainDamage} damage and suffer a tactical setback.`,
    saveDc: `${saveDc}`,
    recharge: chance(0.45) ? '5-6' : '',
    usage: chance(0.35) ? `${randomInt(1, 3)}/day` : '',
    trigger: chance(0.2) ? `After ${name} hits with an attack` : '',
  };
}

function buildBonusAction(name, affinityProfile) {
  return {
    name: pick((affinityProfile && affinityProfile.bonusActions) || ['Predatory Shift', 'Arc Flash Step', 'Skitter Dash', 'Grim Reposition', 'Mirage Snap']),
    category: 'Bonus Action',
    description: `${name} moves up to half its speed and can reposition through enemy spaces as difficult terrain.`,
    saveDc: '',
    recharge: '',
    usage: chance(0.35) ? '3/day' : '',
    trigger: '',
  };
}

function buildReaction(name, affinityProfile) {
  return {
    name: pick((affinityProfile && affinityProfile.reactions) || ['Reactive Guard', 'Warp Riposte', 'Spiteful Counter', 'Aegis Flicker']),
    category: 'Reaction',
    description: `When hit by an attack, ${name} reduces damage by ${randomInt(4, 14)} and may make one attack against the triggering creature.`,
    saveDc: '',
    recharge: '',
    usage: chance(0.35) ? '3/day' : '',
    trigger: 'When hit by an attack',
  };
}

function buildLegendary(name, styleKey, affinityProfile) {
  return {
    name: pick((affinityProfile && affinityProfile.legendary) || ['Predator Pulse', 'Void Lash', 'Solar Flare Step', 'Hoard Fury', 'Tidal Slip']),
    category: 'Legendary',
    description: `${name} performs a rapid tactical maneuver flavored by the ${RANDOM_STYLES[styleKey] || 'Balanced'} style.`,
    saveDc: '',
    recharge: '',
    usage: `Costs ${randomInt(1, 2)} action${chance(0.4) ? 's' : ''}`,
    trigger: '',
  };
}

function buildLair(name, saveDc, styleKey, affinityProfile) {
  return {
    name: pick((affinityProfile && affinityProfile.lair) || ['Falling Cinders', 'Warping Ground', 'Howling Dark', 'Surging Vines', 'Crashing Tides']),
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

function buildSpellcasting(saveDc, proficiencyBonus, abilities, affinityProfile) {
  const atWillPool = (affinityProfile && affinityProfile.spellsAtWill) || ['mage hand', 'minor illusion', 'ray of frost', 'thaumaturgy', 'chill touch', 'sacred flame', 'gust'];
  const dailyPool = (affinityProfile && affinityProfile.spellsDaily) || ['fear', 'fly', 'fireball', 'lightning bolt', 'slow', 'hunger of hadar', 'banishment', 'spirit guardians'];
  return {
    name: pick(['Innate Spellcasting', 'Psionic Burstcasting', 'Ritual Invocation', 'Battle Canticles']),
    description: `Spell save DC ${saveDc}, +${proficiencyBonus + Math.max(2, Math.floor((Math.max(abilities.int, abilities.cha) - 10) / 2))} to hit. At will: ${pickMany(atWillPool, 3).join(', ')}. 3/day each: ${pickMany(dailyPool, 3).join(', ')}.`,
  };
}

function inferAffinity({ styleKey, type, origin, environmentList }) {
  if (styleKey === 'aquatic' || environmentList.includes('underwater') || (environmentList.includes('coastal') && chance(0.7))) return 'aquatic';
  if (styleKey === 'infernal' || origin === 'infernal' || environmentList.includes('volcanic')) return 'infernal';
  if (styleKey === 'elemental' || origin === 'stormbound' || environmentList.includes('mountain')) return 'storm';
  if (type === 'beast' || styleKey === 'balanced') return 'primal';
  return styleKey;
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

if (typeof globalThis !== 'undefined') {
  globalThis.__monsterGeneratorTestHooks = {
    generateRandomMonster,
    normalizeCrKey,
    crToNumber,
    getCrBaseline,
  };
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

function damageRollAverage(roll) {
  const cleaned = String(roll || '').replace(/\s+/g, '');
  const match = cleaned.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return 0;
  const count = Number(match[1]) || 0;
  const die = Number(match[2]) || 0;
  const bonus = Number(match[3] || 0);
  return Math.floor((count * (die + 1)) / 2 + bonus);
}

function mergeCsvValues(...values) {
  const merged = [];
  values.forEach((value) => {
    String(value || '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        if (!merged.some((entry) => entry.toLowerCase() === part.toLowerCase())) {
          merged.push(part);
        }
      });
  });
  return merged.join(', ');
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
  const actor = mapActorCore(sourceMonster);
  actor.items = mapCombatToFoundryItems(sourceMonster.combat);
  return actor;
}

function mapActorCore(sourceMonster = {}) {
  const identityData = mapIdentityToNpcData(sourceMonster.identity || {}, sourceMonster.flavor || {});
  const coreData = mapCoreToNpcData(sourceMonster.core || {});
  const defenseData = mapDefenseToNpcData(sourceMonster.defense || {});

  return {
    name: identityData.name,
    type: 'npc',
    img: 'icons/svg/mystery-man.svg',
    system: {
      currency: { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 },
      abilities: coreData.abilities,
      bonuses: mapBonuses(),
      skills: defenseData.skills,
      tools: {},
      spells: mapSpells(),
      attributes: mapAttributes(coreData, defenseData),
      details: mapDetails(identityData, sourceMonster),
      resources: mapResources(),
      source: { revision: 1, rules: '2024', book: '', page: '', custom: '', license: '' },
      traits: mapTraits(identityData, defenseData),
    },
    prototypeToken: mapPrototypeToken(identityData),
    items: [],
    effects: [],
    folder: null,
    flags: {},
    _stats: {
      systemId: 'dnd5e',
      systemVersion: '5.2.x',
      coreVersion: '13.0.0',
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null,
      compendiumSource: null,
      duplicateSource: null,
      exportSource: null,
      sort: 0,
    },
    ownership: { default: 0 },
  };
}

function mapIdentityToNpcData(identity, flavor) {
  const subtitleParts = parseSubtitle(identity.subtitle);
  const ancestry = [identity.ancestryRace, identity.ancestrySubrace].filter(Boolean).join(' • ');
  const resolvedSubtype = [subtitleParts.subtype, ancestry].filter(Boolean).join(' • ');
  return {
    name: identity.name,
    size: identity.size,
    creatureType: identity.type || subtitleParts.type || 'humanoid',
    subtype: resolvedSubtype,
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
  const speed = core.speed || {};
  return {
    ac: Number(core.ac) || 10,
    hp: Number(core.hp) || 1,
    hitDice: core.hitDice || '',
    movement: {
      walk: normalizeMovementValue(speed.walk),
      burrow: normalizeMovementValue(speed.burrow),
      climb: normalizeMovementValue(speed.climb),
      fly: normalizeMovementValue(speed.fly),
      swim: normalizeMovementValue(speed.swim),
      hover: Boolean(speed.hover),
      units: 'ft',
      ignoredDifficultTerrain: [],
    },
    initiativeBonus: Number(core.initiativeBonus) || 0,
    passivePerception: Number(core.passivePerception) || 10,
    proficiencyBonus: Number(core.proficiencyBonus) || 2,
    abilities: mapAbilityScores(core.abilities),
  };
}

function mapDefenseToNpcData(defense) {
  const defenseSenses = mapSensesToFoundry(defense.senses);
  return {
    skills: mapSkillsToFoundry(defense.skills),
    damageVulnerabilities: arrayOrEmpty(defense.vulnerabilities),
    damageResistances: arrayOrEmpty(defense.resistances),
    damageImmunities: arrayOrEmpty(defense.immunities),
    conditionImmunities: arrayOrEmpty(defense.conditionImmunities),
    senses: defenseSenses,
    languages: arrayOrEmpty(defense.languages),
    telepathy: defense.telepathy || defenseSenses.communication,
  };
}

function mapCombatToFoundryItems(combat = {}) {
  const items = [
    ...arrayOrEmpty(combat.traits).map((trait) => mapFeatureItem(trait, 'special')),
    ...arrayOrEmpty(combat.actions).map((action) => mapFeatureItem(action, 'action')),
    ...arrayOrEmpty(combat.bonusActions).map((action) => mapFeatureItem(action, 'bonus')),
    ...arrayOrEmpty(combat.reactions).map((reaction) => mapFeatureItem(reaction, 'reaction')),
    ...arrayOrEmpty(combat.legendaryActions).map((entry) => mapFeatureItem(entry, 'special')),
    ...arrayOrEmpty(combat.lairActions).map((entry) => mapFeatureItem(entry, 'special')),
    ...arrayOrEmpty(combat.mythic).map((entry) => mapFeatureItem(entry, 'special')),
    ...arrayOrEmpty(combat.attacks).map((attack) => mapAttackToFeatureItem(attack)),
    ...arrayOrEmpty(combat.spellcasting).map((entry) => mapFeatureItem(entry, 'special')),
  ];
  return items.filter(Boolean);
}

function mapFeatureItem(trait, activationType = 'special') {
  const description = buildCombatDescription(trait);
  return {
    _id: buildFoundryId(trait.name || `${activationType}-feature`),
    name: trait.name || 'Unnamed Feature',
    type: 'feat',
    img: 'icons/svg/lightning.svg',
    system: {
      description: { value: description, chat: '' },
      activities: mapActivityUtility(description, activationType),
      uses: { spent: 0, recovery: [], max: '' },
      identifier: '',
      properties: [],
      source: { revision: 1, rules: '2024' },
      type: { value: 'monster', subtype: '', custom: '' },
    },
    effects: [],
    folder: null,
    flags: {},
    sort: 0,
    ownership: { default: 0 },
  };
}

function mapAttackToFeatureItem(attack = {}) {
  const description = buildAttackDescription(attack);
  const activity = mapActivityAttack(attack);
  return {
    _id: buildFoundryId(attack.name || 'attack'),
    name: attack.name || 'Unnamed Attack',
    type: 'feat',
    img: 'icons/svg/sword.svg',
    system: {
      description: { value: description, chat: '' },
      activities: activity ? { [activity.id]: activity.data } : {},
      uses: { spent: 0, recovery: [], max: '' },
      identifier: '',
      properties: [],
      source: { revision: 1, rules: '2024' },
      type: { value: 'monster', subtype: '', custom: '' },
    },
    effects: [],
    folder: null,
    flags: {},
    sort: 0,
    ownership: { default: 0 },
  };
}

function mapBonuses() {
  return {
    mwak: { attack: '', damage: '' }, rwak: { attack: '', damage: '' },
    msak: { attack: '', damage: '' }, rsak: { attack: '', damage: '' },
    abilities: { check: '', save: '', skill: '' }, spell: { dc: '' },
  };
}

function mapSpells() {
  return {
    spell1: { value: 0, override: null }, spell2: { value: 0, override: null }, spell3: { value: 0, override: null },
    spell4: { value: 0, override: null }, spell5: { value: 0, override: null }, spell6: { value: 0, override: null },
    spell7: { value: 0, override: null }, spell8: { value: 0, override: null }, spell9: { value: 0, override: null },
    pact: { value: 0, override: null },
  };
}

function mapAttributes(coreData, defenseData) {
  return {
    ac: { calc: 'default', flat: coreData.ac },
    hp: { value: coreData.hp, max: coreData.hp, formula: coreData.hitDice, temp: null, tempmax: null },
    senses: defenseData.senses,
    movement: coreData.movement,
    init: { ability: '', roll: { min: null, max: null, mode: 0 }, bonus: coreData.initiativeBonus ? String(coreData.initiativeBonus) : '' },
    attunement: { max: 3 },
    spellcasting: '', exhaustion: 0,
    concentration: { ability: '', roll: { min: null, max: null, mode: 0 }, bonuses: { save: '' }, limit: 1 },
    loyalty: {}, hd: { spent: 0 },
    death: { roll: { min: null, max: null, mode: 0 }, success: 0, failure: 0, bonuses: { save: '' } },
    spell: { level: 0 },
    price: { value: null, denomination: 'gp' },
  };
}

function mapDetails(identityData, sourceMonster) {
  return {
    biography: { value: buildBiographyHtml(sourceMonster.flavor, sourceMonster.identity), public: '' },
    alignment: identityData.alignment,
    ideal: '', bond: '', flaw: '', race: null,
    type: { value: identityData.creatureType, subtype: identityData.subtype, swarm: '', custom: identityData.tags },
    cr: Number(identityData.cr) || crToNumber(String(identityData.cr || 0)),
    habitat: { value: [], custom: '' },
    treasure: { value: [] },
  };
}

function mapResources() {
  return {
    legact: { max: 0, spent: 0 },
    legres: { max: 0, spent: 0 },
    lair: { value: false, initiative: null, inside: false },
  };
}

function mapTraits(identityData, defenseData) {
  return {
    languages: { value: defenseData.languages, custom: defenseData.telepathy || '', communication: {} },
    size: mapSizeToFoundry(identityData.size),
    di: { value: defenseData.damageImmunities, custom: '', bypasses: [] },
    dr: { value: defenseData.damageResistances, custom: '', bypasses: [] },
    dv: { value: defenseData.damageVulnerabilities, custom: '', bypasses: [] },
    dm: { amount: {}, bypasses: [] },
    ci: { value: defenseData.conditionImmunities, custom: '' },
    important: false,
  };
}

function mapPrototypeToken(identityData) {
  const size = mapTokenSize(identityData.size);
  return {
    name: identityData.name,
    displayName: 20,
    actorLink: false,
    width: size,
    height: size,
    texture: { src: 'icons/svg/mystery-man.svg', anchorX: 0.5, anchorY: 0.5, fit: 'contain', alphaThreshold: 0.75, scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0, rotation: 0, tint: null },
    hexagonalShape: 0,
    lockRotation: false,
    rotation: 0,
    alpha: 1,
    disposition: -1,
    displayBars: 20,
    bar1: { attribute: 'attributes.hp' },
    bar2: { attribute: null },
    light: { dim: 0, bright: 0, angle: 360, alpha: 0.5, coloration: 1, luminosity: 0.5, attenuation: 0.5, saturation: 0, contrast: 0, shadows: 0, animation: { type: null, speed: 5, intensity: 5, reverse: false }, darkness: { min: 0, max: 1 } },
    sight: { enabled: false, range: 0, angle: 360, visionMode: 'basic', color: null, attenuation: 0.1, brightness: 0, saturation: 0, contrast: 0 },
    detectionModes: [],
    occludable: { radius: 0 },
    ring: { enabled: false, colors: { ring: null, background: null }, effects: 1, subject: { texture: null, scale: 1 } },
    randomImg: false,
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
  const ancestry = [identity.ancestryRace, identity.ancestrySubrace].filter(Boolean).join(' • ');
  const identitySummary = `<p><strong>${identity.name || 'Monster'}</strong> • ${identity.size || ''} ${identity.type || ''}${ancestry ? ` • Ancestry: ${ancestry}` : ''}${identity.origin ? ` • Origin: ${identity.origin}` : ''}${identity.role ? ` • Role: ${identity.role}` : ''}${environment.length ? ` • Environment: ${environment.join(', ')}` : ''}</p>`;
  const detailSections = sections.filter(([, value]) => value).map(([title, value]) => `<h3>${title}</h3><p>${value}</p>`).join('');
  return `${identitySummary}${detailSections}`;
}

function getSubraceOptions(race) {
  if (!race) return ['—'];
  const entry = SRD_RACES.find((candidate) => candidate.race === race);
  if (!entry?.subraces?.length) return ['—'];
  return ['—', ...entry.subraces];
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
      max: null,
      proficient: 0,
      bonuses: { check: '', save: '' },
      check: { roll: { min: null, max: null, mode: 0 } },
      save: { roll: { min: null, max: null, mode: 0 } },
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
  const defaultSkills = {
    acr: 'dex', ani: 'wis', arc: 'int', ath: 'str', dec: 'cha', his: 'int', ins: 'wis', itm: 'cha', inv: 'int', med: 'wis',
    nat: 'int', prc: 'wis', prf: 'cha', per: 'cha', rel: 'int', slt: 'dex', ste: 'dex', sur: 'wis',
  };
  const result = Object.fromEntries(Object.entries(defaultSkills).map(([key, ability]) => ([key, {
    ability,
    roll: { min: null, max: null, mode: 0 },
    value: 0,
    bonuses: { check: '', passive: '' },
  }])));

  arrayOrEmpty(skills).forEach((entry) => {
    const nameMatch = String(entry).trim().match(/^[A-Za-z ]+/);
    const bonusMatch = String(entry).match(/([+-]\d+)$/);
    if (!nameMatch) return;
    const key = nameMatch[0].toLowerCase().replaceAll(' ', '');
    const foundryKey = skillMap[key];
    if (!foundryKey) return;
    result[foundryKey].value = 1;
    result[foundryKey].bonuses.check = bonusMatch ? bonusMatch[1] : '';
  });
  return result;
}

function mapSensesToFoundry(senses = []) {
  const mapped = {
    darkvision: null,
    blindsight: null,
    tremorsense: null,
    truesight: null,
    units: 'ft',
    special: '',
    communication: '',
  };
  arrayOrEmpty(senses).forEach((sense) => {
    const normalized = String(sense).toLowerCase();
    const range = parseAttackRange(normalized);
    if (normalized.includes('darkvision')) mapped.darkvision = range;
    if (normalized.includes('blindsight')) mapped.blindsight = range;
    if (normalized.includes('tremorsense')) mapped.tremorsense = range;
    if (normalized.includes('truesight')) mapped.truesight = range;
    if (normalized.includes('telepathy')) mapped.communication = String(sense).trim();
  });
  mapped.special = arrayOrEmpty(senses).join(', ');
  return mapped;
}

function mapActivityUtility(description, activationType = 'special') {
  if (!description) return {};
  const activityId = buildFoundryId(`${activationType}-utility`);
  return {
    [activityId]: {
      type: 'utility',
      activation: { type: activationType, value: 1, condition: '' },
      consumption: { targets: [], scaling: { allowed: false, max: '' } },
      description: { chatFlavor: '' },
      duration: { units: 'inst', concentration: false, value: '' },
      effects: [],
      range: { units: 'self', special: '', value: null },
      target: { template: { contiguous: false, count: '', type: '', size: '', width: '', height: '', units: 'ft' }, affects: { choice: false, count: '', type: '', special: '' }, prompt: true, override: false },
      uses: { spent: 0, max: '', recovery: [] },
      sort: 0,
      _id: activityId,
    },
  };
}

function mapActivityAttack(attack = {}) {
  const hasToHit = /[+-]?\d+/.test(String(attack.toHit || ''));
  const hasDamage = buildDamageParts(attack).length > 0;
  if (!hasToHit && !hasDamage) return null;
  const id = buildFoundryId(`${attack.name || 'attack'}-activity`);
  return {
    id,
    data: {
      _id: id,
      type: 'attack',
      activation: { type: 'action', value: 1, condition: '' },
      attack: {
        type: attack.kind?.toLowerCase().includes('ranged') ? { value: 'ranged', classification: 'weapon' } : { value: 'melee', classification: 'weapon' },
        ability: '',
        bonus: hasToHit ? String(parseSignedNumber(attack.toHit)) : '',
        critical: { threshold: null },
        flat: false,
      },
      consumption: { targets: [], scaling: { allowed: false, max: '' } },
      damage: {
        includeBase: true,
        parts: buildDamageParts(attack).map(([number, type]) => ({ number, denomination: 0, bonus: '', types: [type], custom: { enabled: false, formula: '' }, scaling: { mode: '', number: null, formula: '' } })),
      },
      description: { chatFlavor: '' },
      duration: { units: 'inst', concentration: false, value: '' },
      effects: [],
      range: { value: parseAttackRange(attack.range), long: parseAttackLongRange(attack.range), units: 'ft', special: '' },
      target: { template: { contiguous: false, count: '', type: '', size: '', width: '', height: '', units: 'ft' }, affects: { choice: false, count: '1', type: 'creature', special: '' }, prompt: true, override: false },
      uses: { spent: 0, max: '', recovery: [] },
      sort: 0,
    },
  };
}

function mapSizeToFoundry(size) {
  const map = { tiny: 'tiny', small: 'sm', medium: 'med', large: 'lg', huge: 'huge', gargantuan: 'grg' };
  return map[String(size || '').toLowerCase()] || 'med';
}

function mapTokenSize(size) {
  const map = { tiny: 1, small: 1, medium: 1, large: 2, huge: 3, gargantuan: 4 };
  return map[String(size || '').toLowerCase()] || 1;
}

function normalizeMovementValue(value) {
  const n = parseAttackRange(String(value || ''));
  return n ? String(n) : null;
}

function buildFoundryId(seed = '') {
  return String(seed).toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 16).padEnd(16, '0');
}

function buildCombatDescription(entry) {
  const details = [];
  if (entry.description) details.push(`<p>${entry.description}</p>`);
  if (entry.trigger) details.push(`<p><strong>Trigger:</strong> ${entry.trigger}</p>`);
  if (entry.saveDc) details.push(`<p><strong>Save:</strong> ${entry.saveDc}</p>`);
  if (entry.recharge) details.push(`<p><strong>Recharge:</strong> ${entry.recharge}</p>`);
  if (entry.usage) details.push(`<p><strong>Usage:</strong> ${entry.usage}</p>`);
  return details.join('');
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

function normalizeNamedList(value) {
  return arrayOrEmpty(value)
    .map((entry) => {
      if (typeof entry === 'string') return entry.trim();
      if (entry && typeof entry === 'object') {
        if (typeof entry.name === 'string') return entry.name.trim();
        if (typeof entry.index === 'string') return entry.index.replace(/-/g, ' ').trim();
      }
      return '';
    })
    .filter(Boolean);
}

function normalizeCrKey(value) {
  const normalized = String(value).trim();
  if (CR_BASELINES[normalized]) return normalized;

  const n = Number(normalized);
  if (Number.isNaN(n)) return '1';

  if (n > 0 && n < 1) {
    if (n <= 0.125) return '1/8';
    if (n <= 0.25) return '1/4';
    return '1/2';
  }

  if (n <= 0) return '0';
  return String(Math.min(20, Math.floor(n)));
}

function getCrBaseline(cr) {
  return CR_BASELINES[normalizeCrKey(cr)] || CR_BASELINES['1'];
}

async function ensureSrdMonstersLoaded(forceRefresh = false) {
  if (!forceRefresh && srdMonsters.length) return;
  if (!srdLoadPromise || forceRefresh) {
    srdLoadPromise = loadSrdMonsters();
  }
  await srdLoadPromise;
}

async function loadSrdMonsters() {
  const combined = [];

  try {
    const response = await fetch(SRD_DATA_PATH);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const parsed = await response.json();
    if (Array.isArray(parsed)) combined.push(...parsed);
  } catch {
    // Local data is optional because we can still hydrate from cache and API.
  }

  let usedCache = false;
  if (combined.length < MIN_EXPECTED_SRD_MONSTERS) {
    try {
      const cached = localStorage.getItem(SRD_CACHE_KEY);
      if (cached) {
        const parsedCached = JSON.parse(cached);
        if (Array.isArray(parsedCached)) {
          combined.push(...parsedCached);
          usedCache = true;
        }
      }
    } catch {
      localStorage.removeItem(SRD_CACHE_KEY);
    }
  }

  if (combined.length < MIN_EXPECTED_SRD_MONSTERS) {
    try {
      const fetched = await fetchSrdMonsterCatalog();
      if (fetched.length) {
        combined.push(...fetched);
        localStorage.setItem(SRD_CACHE_KEY, JSON.stringify(fetched));
      }
    } catch {
      if (!usedCache) {
        // We still keep whatever came from the local data file.
      }
    }
  }

  const normalized = combined
    .map((entry) => normalizeSrdEntry(entry))
    .filter((entry) => entry && entry.name && entry.challenge_rating !== undefined && entry.challenge_rating !== null);

  const fallback = SRD_FALLBACK_MONSTERS.map((entry) => normalizeSrdEntry(entry));
  const merged = mergeUniqueSrdMonsters(normalized);
  fallback.forEach((entry) => {
    if (!merged.some((candidate) => candidate.index === entry.index)) merged.push(entry);
  });

  srdMonsters = merged;
  srdMonstersByCr = groupSrdByCr(merged);
}

function mergeUniqueSrdMonsters(list) {
  const unique = new Map();
  list.forEach((entry) => {
    const key = String(entry.index || entry.slug || entry.url || entry.name || '').toLowerCase().trim();
    if (!key || !unique.has(key)) unique.set(key, entry);
  });
  return [...unique.values()];
}

async function fetchSrdMonsterCatalog() {
  const listResponse = await fetch(SRD_MONSTER_LIST_ENDPOINT);
  if (!listResponse.ok) throw new Error(`HTTP ${listResponse.status}`);

  const listData = await listResponse.json();
  const monsters = Array.isArray(listData?.results) ? listData.results : [];

  const details = await runWithConcurrency(monsters, SRD_FETCH_CONCURRENCY, async (entry) => {
    const detail = await fetchSrdMonsterDetailWithRetry(`${SRD_MONSTER_API_BASE}${entry.url}`);
    if (detail) return detail;

    return {
      ...entry,
      challenge_rating: normalizeCrKey(entry.challenge_rating ?? entry.cr ?? '1'),
    };
  });

  return details.filter(Boolean);
}

async function fetchSrdMonsterDetailWithRetry(url) {
  for (let attempt = 0; attempt <= SRD_FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
      if (response.status !== 429 || attempt === SRD_FETCH_RETRIES) return null;
    } catch {
      if (attempt === SRD_FETCH_RETRIES) return null;
    }

    await wait(SRD_FETCH_RETRY_BASE_DELAY_MS * 2 ** attempt);
  }

  return null;
}

async function runWithConcurrency(items, concurrency, task) {
  if (!Array.isArray(items) || !items.length) return [];
  const normalizedConcurrency = Math.max(1, Math.floor(Number(concurrency) || 1));
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await task(items[index], index);
    }
  }

  const workers = Array.from({ length: Math.min(normalizedConcurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function groupSrdByCr(list) {
  return list.reduce((acc, entry) => {
    const cr = normalizeCrKey(entry.challenge_rating);
    if (!acc[cr]) acc[cr] = [];
    acc[cr].push(entry);
    return acc;
  }, {});
}

function populateSrdMonsterSelect(cr) {
  const select = document.getElementById('srd-monster-select');
  if (!select) return;
  const list = [...(srdMonstersByCr[normalizeCrKey(cr)] || [])].sort((a, b) => a.name.localeCompare(b.name));
  if (!list.length) {
    select.innerHTML = '<option value=>No SRD monsters for this CR</option>';
    select.value = '';
    return;
  }
  select.innerHTML = list.map((entry, idx) => `<option value="${entry.index || idx}">${entry.name}</option>`).join('');
}

function loadSelectedSrdMonster() {
  const cr = document.getElementById('random-cr').value;
  const select = document.getElementById('srd-monster-select');
  const list = srdMonstersByCr[normalizeCrKey(cr)] || [];
  if (!list.length || !select?.value) {
    setStatus('No SRD monster available for this CR selection.', true);
    return;
  }
  const selected = list.find((entry, idx) => (entry.index || String(idx)) === select.value);
  if (!selected) {
    setStatus('Could not resolve selected SRD monster.', true);
    return;
  }

  monster = importSrdMonster(selected, monster);
  setStatus(`Loaded SRD monster: ${selected.name}.`);
  renderForm();
  renderPreview();
}

function importSrdMonster(srd, currentMonster) {
  const defaultMonster = createDefaultMonster();
  const subtitleSubtype = srd.subtype ? ` (${srd.subtype})` : '';
  const subtitle = `${srd.size || 'Medium'} ${srd.type || 'monstrosity'}${subtitleSubtype}, ${srd.alignment || 'unaligned'}`;
  const movement = normalizeSrdSpeed(srd.speed);
  const actions = arrayOrEmpty(srd.actions).map((action) => ({
    name: action.name || 'Action',
    category: 'Action',
    description: action.desc || '',
    saveDc: '',
    recharge: '',
    usage: '',
    trigger: '',
  }));

  const inferredHabitat = inferHabitatFromSrd(srd);
  const actionNames = arrayOrEmpty(srd.actions).map((action) => action.name).filter(Boolean);

  const importedMonster = {
    ...currentMonster,
    identity: {
      ...currentMonster.identity,
      name: srd.name || currentMonster.identity.name,
      subtitle,
      size: srd.size || currentMonster.identity.size,
      type: srd.type || currentMonster.identity.type,
      tags: srd.subtype || currentMonster.identity.tags,
      alignment: srd.alignment || currentMonster.identity.alignment,
      cr: normalizeCrKey(srd.challenge_rating || currentMonster.identity.cr),
      role: currentMonster.identity.role,
      ancestryRace: '',
      ancestrySubrace: '',
    },
    core: {
      ...currentMonster.core,
      ac: parseArmorClass(srd.armor_class) || currentMonster.core.ac,
      hp: Number(srd.hit_points) || currentMonster.core.hp,
      hitDice: srd.hit_dice || currentMonster.core.hitDice,
      speed: movement,
      abilities: {
        str: Number(srd.strength) || currentMonster.core.abilities.str,
        dex: Number(srd.dexterity) || currentMonster.core.abilities.dex,
        con: Number(srd.constitution) || currentMonster.core.abilities.con,
        int: Number(srd.intelligence) || currentMonster.core.abilities.int,
        wis: Number(srd.wisdom) || currentMonster.core.abilities.wis,
        cha: Number(srd.charisma) || currentMonster.core.abilities.cha,
      },
      proficiencyBonus: inferProficiencyBonusFromCr(srd.challenge_rating),
      passivePerception: inferPassivePerception(srd.senses, srd.wisdom),
      initiativeBonus: Math.floor(((Number(srd.dexterity) || 10) - 10) / 2),
    },
    defense: {
      ...currentMonster.defense,
      vulnerabilities: normalizeNamedList(srd.damage_vulnerabilities),
      resistances: normalizeNamedList(srd.damage_resistances),
      immunities: normalizeNamedList(srd.damage_immunities),
      conditionImmunities: normalizeNamedList(srd.condition_immunities),
      senses: formatSrdSenses(srd.senses),
      languages: srd.languages || '',
      telepathy: srd.languages?.toLowerCase().includes('telepathy') ? 'Telepathy listed in languages' : '',
    },
    combat: {
      ...currentMonster.combat,
      traits: mapSrdFeatures(srd.special_abilities, 'Trait'),
      actions,
      bonusActions: mapSrdFeatures(srd.bonus_actions, 'Bonus Action'),
      reactions: mapSrdFeatures(srd.reactions, 'Reaction'),
      legendaryActions: mapSrdFeatures(srd.legendary_actions, 'Legendary'),
      lairActions: [],
      mythic: [],
      attacks: mapSrdActionsToAttacks(srd.actions),
      spellcasting: mapSrdSpellcasting(srd.special_abilities),
    },
    flavor: {
      ...defaultMonster.flavor,
      summary: `${srd.name} imported from SRD data and ready for tuning in the studio.`,
      appearance: `${srd.name} is a ${srd.size || 'Medium'} ${srd.type || 'creature'}${subtitleSubtype} with AC ${parseArmorClass(srd.armor_class) || currentMonster.core.ac}.`,
      behavior: `Tends toward ${srd.alignment || 'unpredictable'} behavior and usually fights in direct, efficient patterns.`,
      tactics: actionNames.length
        ? `Opens with ${actionNames.slice(0, 2).join(' and ')}${actionNames.length > 2 ? ', then adapts with remaining actions.' : '.'}`
        : 'Uses straightforward attacks and focuses exposed targets first.',
      habitat: inferredHabitat || defaultMonster.flavor.habitat,
      encounterIdeas: `Use as a CR ${normalizeCrKey(srd.challenge_rating || currentMonster.identity.cr)} encounter anchor with terrain that supports ${srd.type || 'its'} strengths.`,
      loot: `Theme loot around ${srd.type || 'monster'} traits, plus a trophy tied to ${srd.name}.`,
      gmNotes: 'Review action economy, recharge cadence, and encounter role before finalizing this import.',
      readAloud: `You spot ${srd.name} ahead: ${srd.size || 'medium'} silhouette, tense posture, and a threat that radiates immediate danger.`,
    },
  };

  return applyOrcVariantCustomization(importedMonster);
}

function inferHabitatFromSrd(srd) {
  const sourceText = [srd.type, srd.subtype, srd.name].filter(Boolean).join(' ').toLowerCase();
  if (/(dragon|wyvern|roc|griffon|harpy|fly|wing)/.test(sourceText)) return 'mountain, sky ruins, windswept cliffs';
  if (/(undead|ghost|skeleton|zombie|lich|vampire)/.test(sourceText)) return 'catacombs, haunted keeps, forgotten battlefields';
  if (/(fiend|demon|devil|infernal)/.test(sourceText)) return 'hellscar rifts, cursed temples, volcanic wastes';
  if (/(beast|wolf|bear|boar|cat)/.test(sourceText)) return 'forests, plains, and wild borderlands';
  if (/(aberration|mind|ooze|eldritch)/.test(sourceText)) return 'deep caverns, psychic ruins, and planar fractures';
  if (/(construct|golem|clockwork)/.test(sourceText)) return 'ruined laboratories, arcane vaults, and fortified halls';
  if (/(elemental|water|fire|air|earth)/.test(sourceText)) return 'elemental nexuses and unstable natural extremes';
  return '';
}

function normalizeSrdEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  return { ...entry, challenge_rating: normalizeCrKey(entry.challenge_rating ?? entry.cr ?? '1') };
}

function normalizeSrdSpeed(speed = {}) {
  const readFeet = (value) => {
    const match = String(value || '').match(/\d+/);
    return match ? Number(match[0]) : 0;
  };
  return {
    walk: readFeet(speed.walk),
    climb: readFeet(speed.climb),
    swim: readFeet(speed.swim),
    burrow: readFeet(speed.burrow),
    fly: readFeet(speed.fly),
    hover: String(speed.fly || '').toLowerCase().includes('hover'),
  };
}

function parseArmorClass(value) {
  if (Array.isArray(value) && value.length) {
    return Number(value[0]?.value) || Number(value[0]) || 10;
  }
  return Number(value) || 10;
}

function inferProficiencyBonusFromCr(cr) {
  const n = crToNumber(normalizeCrKey(cr));
  return Math.max(2, Math.min(9, 2 + Math.floor((n - 1) / 4)));
}

function inferPassivePerception(senses, wisdom = 10) {
  const passive = Number(senses?.passive_perception);
  if (passive) return passive;
  return 10 + Math.floor(((Number(wisdom) || 10) - 10) / 2);
}

function formatSrdSenses(senses = {}) {
  return Object.entries(senses)
    .map(([key, value]) => `${key.replaceAll('_', ' ')} ${value}`.trim())
    .join(', ');
}

function mapSrdFeatures(features = [], category = 'Trait') {
  return arrayOrEmpty(features).map((feature) => ({
    name: feature.name || category,
    category,
    description: feature.desc || '',
    saveDc: '',
    recharge: '',
    usage: '',
    trigger: '',
  }));
}

function mapSrdActionsToAttacks(actions = []) {
  return arrayOrEmpty(actions).slice(0, 4).map((action) => ({
    name: action.name || 'Attack',
    kind: inferActionKind(action.desc),
    theme: 'srd',
    toHit: parseToHitBonus(action.attack_bonus),
    range: parseAttackRangeText(action.desc),
    target: 'one target',
    hit: action.desc || '',
    damage: '',
    damageType: '',
    secondaryDamage: '',
    save: '',
    rider: '',
    styleNote: 'Imported from SRD action text.',
    recharge: '',
    multiattackGroup: '',
  }));
}

function mapSrdSpellcasting(features = []) {
  return arrayOrEmpty(features)
    .filter((feature) => String(feature.name || '').toLowerCase().includes('spellcasting'))
    .map((feature) => ({ name: feature.name || 'Spellcasting', description: feature.desc || '' }));
}

function inferActionKind(desc = '') {
  const lowered = String(desc).toLowerCase();
  if (lowered.includes('ranged')) return 'Ranged Weapon Attack';
  if (lowered.includes('melee spell attack')) return 'Melee Spell Attack';
  if (lowered.includes('ranged spell attack')) return 'Ranged Spell Attack';
  return 'Melee Weapon Attack';
}

function parseToHitBonus(value) {
  const n = Number(value);
  if (!Number.isNaN(n)) return `${n >= 0 ? '+' : ''}${n}`;
  return '+0';
}

function parseAttackRangeText(desc = '') {
  const reach = String(desc).match(/reach\s+\d+\s*ft\./i);
  if (reach) return reach[0];
  const range = String(desc).match(/range\s+\d+\s*\/\s*\d+\s*ft\./i);
  if (range) return range[0].replace(/^range\s+/i, '');
  return 'reach 5 ft.';
}

function importJson(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      monster = normalizeMonsterImport(JSON.parse(String(reader.result)));
      renderForm();
      renderPreview();
      setStatus('Imported monster JSON and normalized it to the current schema.');
    } catch {
      setStatus('Invalid JSON file.', true);
    }
  };
  reader.readAsText(file);
}

function normalizeMonsterImport(input) {
  const base = createDefaultMonster();
  const parsed = input && typeof input === 'object' ? input : {};
  const parsedIdentity = parsed.identity && typeof parsed.identity === 'object' ? parsed.identity : {};
  const parsedCore = parsed.core && typeof parsed.core === 'object' ? parsed.core : {};
  const parsedDefense = parsed.defense && typeof parsed.defense === 'object' ? parsed.defense : {};
  const parsedCombat = parsed.combat && typeof parsed.combat === 'object' ? parsed.combat : {};

  return {
    ...base,
    ...parsed,
    schemaVersion: Number(parsed.schemaVersion) || base.schemaVersion,
    identity: {
      ...base.identity,
      ...parsedIdentity,
      environment: normalizeNamedList(parsedIdentity.environment ?? base.identity.environment),
      cr: normalizeCrKey(parsedIdentity.cr ?? base.identity.cr),
    },
    core: {
      ...base.core,
      ...parsedCore,
      speed: { ...base.core.speed, ...(parsedCore.speed || {}) },
      abilities: { ...base.core.abilities, ...(parsedCore.abilities || {}) },
    },
    defense: {
      ...base.defense,
      ...parsedDefense,
      savingThrows: normalizeNamedList(parsedDefense.savingThrows ?? base.defense.savingThrows),
      skills: normalizeNamedList(parsedDefense.skills ?? base.defense.skills),
      vulnerabilities: normalizeNamedList(parsedDefense.vulnerabilities ?? base.defense.vulnerabilities),
      resistances: normalizeNamedList(parsedDefense.resistances ?? base.defense.resistances),
      immunities: normalizeNamedList(parsedDefense.immunities ?? base.defense.immunities),
      conditionImmunities: normalizeNamedList(parsedDefense.conditionImmunities ?? base.defense.conditionImmunities),
      senses: normalizeNamedList(parsedDefense.senses ?? base.defense.senses),
      languages: normalizeNamedList(parsedDefense.languages ?? base.defense.languages),
      telepathy: String(parsedDefense.telepathy ?? base.defense.telepathy ?? ''),
    },
    combat: {
      ...base.combat,
      ...parsedCombat,
      traits: arrayOrEmpty(parsedCombat.traits).map((entry) => normalizeCombatFeatureEntry(entry, 'Trait')),
      actions: arrayOrEmpty(parsedCombat.actions).map((entry) => normalizeCombatFeatureEntry(entry, 'Action')),
      bonusActions: arrayOrEmpty(parsedCombat.bonusActions).map((entry) => normalizeCombatFeatureEntry(entry, 'Bonus Action')),
      reactions: arrayOrEmpty(parsedCombat.reactions).map((entry) => normalizeCombatFeatureEntry(entry, 'Reaction')),
      legendaryActions: arrayOrEmpty(parsedCombat.legendaryActions).map((entry) => normalizeCombatFeatureEntry(entry, 'Legendary')),
      lairActions: arrayOrEmpty(parsedCombat.lairActions).map((entry) => normalizeCombatFeatureEntry(entry, 'Lair')),
      mythic: arrayOrEmpty(parsedCombat.mythic).map((entry) => normalizeCombatFeatureEntry(entry, 'Mythic')),
      attacks: arrayOrEmpty(parsedCombat.attacks).map((entry) => normalizeAttackEntry(entry)),
      spellcasting: arrayOrEmpty(parsedCombat.spellcasting).map((entry) => normalizeSpellcastingEntry(entry)),
    },
    flavor: {
      ...base.flavor,
      ...(parsed.flavor || {}),
    },
    foundryHint: {
      ...base.foundryHint,
      ...(parsed.foundryHint || {}),
    },
  };
}

function normalizeCombatFeatureEntry(entry, fallbackCategory = 'Trait') {
  const item = entry && typeof entry === 'object' ? entry : {};
  return {
    name: String(item.name || ''),
    category: String(item.category || fallbackCategory),
    description: String(item.description || ''),
    saveDc: String(item.saveDc || ''),
    recharge: String(item.recharge || ''),
    usage: String(item.usage || ''),
    trigger: String(item.trigger || ''),
  };
}

function normalizeAttackEntry(entry) {
  const item = entry && typeof entry === 'object' ? entry : {};
  return {
    name: String(item.name || ''),
    kind: String(item.kind || 'Melee Weapon Attack'),
    theme: String(item.theme || ''),
    toHit: String(item.toHit || ''),
    range: String(item.range || ''),
    target: String(item.target || ''),
    hit: String(item.hit || ''),
    damage: String(item.damage || ''),
    damageType: String(item.damageType || ''),
    secondaryDamage: String(item.secondaryDamage || ''),
    save: String(item.save || ''),
    rider: String(item.rider || ''),
    styleNote: String(item.styleNote || ''),
    recharge: String(item.recharge || ''),
    multiattackGroup: String(item.multiattackGroup || ''),
  };
}

function normalizeSpellcastingEntry(entry) {
  const item = entry && typeof entry === 'object' ? entry : {};
  return {
    name: String(item.name || ''),
    description: String(item.description || ''),
  };
}

function setStatus(message, isError = false) {
  if (!statusEl) return;
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

if (hasDocument && document.body) {
  document.body.insertAdjacentHTML('beforeend', `<datalist id="attack-theme-list">${ATTACK_THEMES.map((theme) => `<option value="${theme}"></option>`).join('')}</datalist>`);
}
