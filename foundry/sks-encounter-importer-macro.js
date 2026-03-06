/**
 * SKS Encounter Importer Macro
 * Compatible with Foundry VTT v13 (Build 351+) and dnd5e 5.2.x
 */

async function selectEncounterFile() {
  return Dialog.wait({
    title: 'Import SKS Encounter JSON',
    content: `
      <form>
        <div class="form-group">
          <label for="sks-encounter-file">Choose sks-encounter.json</label>
          <input id="sks-encounter-file" type="file" accept="application/json,.json" />
        </div>
      </form>
    `,
    buttons: {
      import: {
        label: 'Import',
        callback: (html) => html.find('#sks-encounter-file')[0]?.files?.[0] ?? null
      },
      cancel: {
        label: 'Cancel',
        callback: () => null
      }
    },
    default: 'import'
  });
}

function ensureEncounterShape(data) {
  if (!data?.encounter || !Array.isArray(data?.monsters) || (!data?.journal && !data?.journalEntry)) {
    throw new Error('Invalid file format. Expected sks-encounter.json export structure.');
  }
}

async function ensureFolder(name, type) {
  const existing = game.folders.find((folder) => folder.type === type && folder.name === name);
  if (existing) return existing;
  return Folder.create({ name, type, color: '#7cc7ff' });
}

function buildMonsterActorData(monster, actorFolderId) {
  return {
    name: monster.name,
    type: 'npc',
    img: 'icons/svg/mystery-man.svg',
    folder: actorFolderId,
    system: {
      details: {
        cr: monster.cr
      },
      attributes: {
        hp: {
          value: monster.hp,
          max: monster.hp
        },
        ac: {
          value: monster.ac
        },
        init: {
          value: monster.init
        }
      }
    },
    prototypeToken: {
      name: monster.name,
      disposition: -1,
      actorLink: false,
      randomImg: false
    }
  };
}

function toList(items) {
  if (!Array.isArray(items) || !items.length) return '<li>None provided.</li>';
  return items.map((item) => `<li>${item}</li>`).join('');
}

function buildJournalHtml(payload) {
  if (payload?.journalEntry?.pages?.[0]?.type === 'text' && payload?.journalEntry?.pages?.[0]?.text?.content) {
    return payload.journalEntry.pages[0].text.content;
  }

  return `
    <h1>${payload.encounter.name}</h1>
    <p><strong>Difficulty:</strong> ${String(payload.encounter.difficulty || '').toUpperCase()}</p>
    <p><strong>Environment:</strong> ${payload.encounter.environment || 'any'}</p>
    <p><strong>Adjusted XP:</strong> ${(payload.encounter.adjustedXp || 0).toLocaleString()}</p>

    <h2>Treasure Ideas</h2>
    <ul>${toList(payload.journal.treasure)}</ul>

    <h2>Narrative Hooks</h2>
    <ul>${toList(payload.journal.narrativeHooks)}</ul>

    <h2>Boss Behavior</h2>
    <p>${payload.journal.bossBehavior || 'None provided.'}</p>

    <h2>Boss Phases</h2>
    <ul>${toList(payload.journal.bossPhases)}</ul>

    <h2>Lair Actions</h2>
    <ul>${toList(payload.journal.lairActions)}</ul>

    <h2>Environmental Hazards</h2>
    <ul>${toList(payload.journal.environmentHazards)}</ul>
  `;
}

(async () => {
  const file = await selectEncounterFile();
  if (!file) {
    ui.notifications.warn('Encounter import canceled.');
    return;
  }

  const raw = await file.text();
  const payload = JSON.parse(raw);
  ensureEncounterShape(payload);

  const actorFolder = await ensureFolder('SKS Encounters', 'Actor');
  const journalFolder = await ensureFolder('SKS Encounters', 'JournalEntry');

  const monsterActors = [];
  for (const monster of payload.monsters) {
    const actor = await Actor.create(buildMonsterActorData(monster, actorFolder.id));
    monsterActors.push({ actor, count: Number(monster.count) || 1, init: Number(monster.init) || 0 });
  }

  let scene = canvas?.scene || game.scenes.current || game.scenes.active;
  if (!scene) {
    scene = await Scene.create({
      name: payload.encounter.name,
      width: 3000,
      height: 2000,
      grid: {
        size: 100,
        type: 1
      }
    });
    await scene.activate();
  }

  const tokenCreateData = [];
  let index = 0;
  for (const monster of monsterActors) {
    for (let i = 0; i < monster.count; i += 1) {
      tokenCreateData.push({
        name: monster.count > 1 ? `${monster.actor.name} ${i + 1}` : monster.actor.name,
        actorId: monster.actor.id,
        x: 400 + (index % 6) * 160,
        y: 400 + Math.floor(index / 6) * 160,
        disposition: -1,
        actorLink: false
      });
      index += 1;
    }
  }

  const createdTokens = await scene.createEmbeddedDocuments('Token', tokenCreateData);

  let combat = game.combats.find((entry) => entry.scene?.id === scene.id && !entry.ended);
  if (!combat) {
    combat = await Combat.create({ scene: scene.id, active: true });
  }

  const tokenToMonster = createdTokens.map((token) => {
    const source = monsterActors.find((monster) => monster.actor.id === token.actorId);
    return {
      token,
      init: source?.init ?? 0
    };
  });

  const combatants = await combat.createEmbeddedDocuments(
    'Combatant',
    tokenToMonster.map(({ token }) => ({
      tokenId: token.id,
      actorId: token.actorId
    }))
  );

  for (const combatant of combatants) {
    const tokenInfo = tokenToMonster.find(({ token }) => token.id === combatant.tokenId);
    const initBonus = tokenInfo?.init ?? 0;
    const roll = await new Roll(`1d20 + ${initBonus}`).evaluate();
    await combat.setInitiative(combatant.id, roll.total ?? 0);
  }

  await JournalEntry.create({
    name: payload?.journalEntry?.name || `${payload.encounter.name} - Encounter Brief`,
    folder: journalFolder.id,
    pages: payload?.journalEntry?.pages?.length
      ? payload.journalEntry.pages
      : [
          {
            name: 'Encounter Brief',
            type: 'text',
            text: {
              format: 1,
              content: buildJournalHtml(payload)
            }
          }
        ]
  });

  ui.notifications.info('SKS encounter imported: actors, scene tokens, combatants, initiative, and journal entry are ready.');
})();
