// ============================================================
// GAME STORE — Zustand state management for the whole game
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UnitData, BossData, performSummon, BOSSES, UNITS } from '../data/units';
import { ENEMIES, generateWave, WaveData } from '../data/enemies';
import { rollTrait, DAILY_REWARDS } from '../data/traits';

// ------ Types ------

export type GameScreen = 'lobby' | 'summon' | 'inventory' | 'shop' | 'modes' | 'game' | 'summon-reveal' | 'traits' | 'daily-rewards';
export type GameMode = 'story' | 'infinite' | 'challenge';

export interface OwnedUnit {
  unitId: string;
  level: number;      // 1-10
  experience: number;
  shards: number;     // duplicate shards
  equipped: boolean;
  slotIndex?: number; // 0-4 if equipped
}

export interface PlayerProfile {
  name: string;
  level: number;
  experience: number;
  coins: number;
  gems: number;
  totalWaves: number;
  totalKills: number;
  highScore: number;
}

// Live game state (not persisted)
export interface LiveEnemy {
  id: string;
  enemyId: string;
  hp: number;
  maxHp: number;
  position: number; // 0..1 progress along path
  reward: number;
  hpMultiplier: number;
  speedMultiplier: number;
  isBoss?: boolean;
  bossPhase?: 1 | 2;
  size: number;
  color: string;
  auraColor: string;
  slowFactor?: number; // 0..1 speed reduction from freeze abilities
  slowTimer?: number;
}

export interface PlacedUnit {
  id: string;
  unitId: string;
  gridX: number;
  gridZ: number;
  lastAttackTime: number;
  lastAbilityTime: number;
  facing: number; // radians
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  z: number;
  created: number;
  color: string;
}

export interface ParticleEffect {
  id: string;
  type: string;
  x: number;
  z: number;
  color: string;
  created: number;
  radius?: number;
}

export interface GameState {
  lives: number;
  maxLives: number;
  gold: number;
  wave: number;
  score: number;
  killsThisWave: number;
  enemies: LiveEnemy[];
  placedUnits: PlacedUnit[];
  isWaveActive: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  spawnQueue: { enemyId: string; spawnTime: number; hpMult: number; speedMult: number; isBoss?: boolean; bossId?: string }[];
  currentWaveData: WaveData | null;
  waveStartTime: number;
  floatingTexts: FloatingText[];
  effects: ParticleEffect[];
  speed: number; // 1 or 2x
}

// ------ Store ------

interface GameStoreState {
  // UI
  screen: GameScreen;
  gameMode: GameMode | null;

  // Player
  profile: PlayerProfile;

  // Collection
  ownedUnits: OwnedUnit[];
  equippedUnitIds: (string | null)[]; // 5 slots

  // Summon reveal
  revealQueue: UnitData[];
  achievements: string[];
  newAchievements: string[];

  // Live game
  game: GameState;

  // Actions
  setScreen: (screen: GameScreen) => void;
  setGameMode: (mode: GameMode) => void;

  // Profile
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  spendGems: (amount: number) => boolean;

  // Collection
  addUnit: (unit: UnitData) => void;
  equipUnit: (unitId: string, slot: number) => void;
  unequipUnit: (slot: number) => void;
  upgradeUnit: (unitId: string) => boolean;
  evolveUnit: (unitId: string) => boolean;
  getEquippedUnits: () => (OwnedUnit | null)[];

  // Traits & Daily
  ownedTraits: string[];
  activeTraits: string[];
  dailyRewardDay: number;
  lastDailyRewardClaim: number;
  freeBundleClaimed: boolean;
  claimDailyReward: () => { coins: number; gems: number; trait?: string } | null;
  addTrait: (traitId: string) => void;
  equipTrait: (traitId: string) => void;
  unequipTrait: (traitId: string) => void;
  claimFreeBundle: () => void;

  // Achievements
  dismissAchievement: (id: string) => void;

  // Summon
  summonUnit: (type: 'coin' | 'gem' | 'multi') => boolean;
  clearRevealQueue: () => void;

  // Game
  startGame: (mode: GameMode) => void;
  resetGame: () => void;
  startNextWave: () => void;
  updateGame: (delta: number, currentTime: number) => void;
  placeUnit: (unitId: string, gridX: number, gridZ: number) => boolean;
  removeUnit: (placedId: string) => void;
  useAbility: (placedId: string, currentTime: number) => void;
  togglePause: () => void;
  setSpeed: (speed: number) => void;
  addGold: (amount: number) => void;
  testSummonSecret: () => void;
}

// ---- PATH DEFINITION (world coords) ----
// The game map is 10x10 grid. Path is a series of waypoints enemies follow.
export const PATH_WAYPOINTS: [number, number][] = [
  [-4.5, 4.5],
  [4.5, 4.5],
  [4.5, 1.5],
  [-4.5, 1.5],
  [-4.5, -1.5],
  [4.5, -1.5],
  [4.5, -4.5],
  [-4.5, -4.5],
];

// Get total path length
function getPathLength(): number {
  let len = 0;
  for (let i = 1; i < PATH_WAYPOINTS.length; i++) {
    const dx = PATH_WAYPOINTS[i][0] - PATH_WAYPOINTS[i - 1][0];
    const dz = PATH_WAYPOINTS[i][1] - PATH_WAYPOINTS[i - 1][1];
    len += Math.sqrt(dx * dx + dz * dz);
  }
  return len;
}

export const PATH_LENGTH = getPathLength();

// Get world position from path progress (0..1)
export function getPositionOnPath(progress: number): [number, number] {
  const targetDist = progress * PATH_LENGTH;
  let dist = 0;
  for (let i = 1; i < PATH_WAYPOINTS.length; i++) {
    const dx = PATH_WAYPOINTS[i][0] - PATH_WAYPOINTS[i - 1][0];
    const dz = PATH_WAYPOINTS[i][1] - PATH_WAYPOINTS[i - 1][1];
    const segLen = Math.sqrt(dx * dx + dz * dz);
    if (dist + segLen >= targetDist) {
      const t = (targetDist - dist) / segLen;
      return [
        PATH_WAYPOINTS[i - 1][0] + dx * t,
        PATH_WAYPOINTS[i - 1][1] + dz * t,
      ];
    }
    dist += segLen;
  }
  return PATH_WAYPOINTS[PATH_WAYPOINTS.length - 1];
}

// Check if grid cell is on or adjacent to path
export function isOnPath(gridX: number, gridZ: number): boolean {
  const wx = gridX;
  const wz = gridZ;
  // Check proximity to any path segment
  for (let i = 1; i < PATH_WAYPOINTS.length; i++) {
    const [ax, az] = PATH_WAYPOINTS[i - 1];
    const [bx, bz] = PATH_WAYPOINTS[i];
    const dx = bx - ax;
    const dz = bz - az;
    const len2 = dx * dx + dz * dz;
    let t = ((wx - ax) * dx + (wz - az) * dz) / len2;
    t = Math.max(0, Math.min(1, t));
    const closestX = ax + t * dx;
    const closestZ = az + t * dz;
    const distSq = (wx - closestX) ** 2 + (wz - closestZ) ** 2;
    if (distSq < 0.6 * 0.6) return true;
  }
  return false;
}

let _enemyIdCounter = 0;
let _effectIdCounter = 0;
let _textIdCounter = 0;

function generateInitialGame(): GameState {
  return {
    lives: 20,
    maxLives: 20,
    gold: 300,
    wave: 0,
    score: 0,
    killsThisWave: 0,
    enemies: [],
    placedUnits: [],
    isWaveActive: false,
    isGameOver: false,
    isPaused: false,
    spawnQueue: [],
    currentWaveData: null,
    waveStartTime: 0,
    floatingTexts: [],
    effects: [],
    speed: 1,
  };
}

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      screen: 'lobby',
      gameMode: null,

      profile: {
        name: 'Player',
        level: 1,
        experience: 0,
        coins: 500,
        gems: 30,
        totalWaves: 0,
        totalKills: 0,
        highScore: 0,
      },

      ownedUnits: [],
      equippedUnitIds: [null, null, null, null, null],
      revealQueue: [],
      achievements: [],
      newAchievements: [],
      ownedTraits: [],
      activeTraits: [],
      dailyRewardDay: 1,
      lastDailyRewardClaim: 0,
      freeBundleClaimed: false,

      game: generateInitialGame(),

      // ------- UI -------
      setScreen: (screen) => set({ screen }),
      setGameMode: (mode) => set({ gameMode: mode }),

      // ------- Currency -------
      addCoins: (amount) => set(s => ({ profile: { ...s.profile, coins: s.profile.coins + amount } })),
      addGems: (amount) => set(s => ({ profile: { ...s.profile, gems: s.profile.gems + amount } })),
      spendCoins: (amount) => {
        const { profile } = get();
        if (profile.coins < amount) return false;
        set(s => ({ profile: { ...s.profile, coins: s.profile.coins - amount } }));
        return true;
      },
      spendGems: (amount) => {
        const { profile } = get();
        if (profile.gems < amount) return false;
        set(s => ({ profile: { ...s.profile, gems: s.profile.gems - amount } }));
        return true;
      },

      // ------- Collection -------
      addUnit: (unit) => {
        set(s => {
          const existing = s.ownedUnits.find(u => u.unitId === unit.id);
          if (existing) {
            // Give shards as duplicate
            return {
              ownedUnits: s.ownedUnits.map(u =>
                u.unitId === unit.id ? { ...u, shards: u.shards + 5 } : u
              ),
            };
          }
          const emptySlot = s.equippedUnitIds.indexOf(null);
          return {
            ownedUnits: [
              ...s.ownedUnits,
              { unitId: unit.id, level: 1, experience: 0, shards: 0, equipped: emptySlot !== -1 },
            ],
            equippedUnitIds: emptySlot !== -1
              ? s.equippedUnitIds.map((id, i) => i === emptySlot ? unit.id : id)
              : s.equippedUnitIds,
          };
        });
      },

      equipUnit: (unitId, slot) => {
        set(s => {
          const newEquipped = [...s.equippedUnitIds];
          // Remove from old slot
          const oldSlot = newEquipped.indexOf(unitId);
          if (oldSlot !== -1) newEquipped[oldSlot] = null;
          newEquipped[slot] = unitId;
          return { equippedUnitIds: newEquipped };
        });
      },

      unequipUnit: (slot) => {
        set(s => {
          const newEquipped = [...s.equippedUnitIds];
          newEquipped[slot] = null;
          return { equippedUnitIds: newEquipped };
        });
      },

      upgradeUnit: (unitId) => {
        const { ownedUnits, spendCoins } = get();
        const unit = ownedUnits.find(u => u.unitId === unitId);
        if (!unit || unit.level >= 10) return false;
        const cost = unit.level * 50;
        if (!spendCoins(cost)) return false;
        set(s => ({
          ownedUnits: s.ownedUnits.map(u =>
            u.unitId === unitId ? { ...u, level: u.level + 1 } : u
          ),
        }));
        return true;
      },

      evolveUnit: (unitId) => {
        const { ownedUnits } = get();
        const unit = ownedUnits.find(u => u.unitId === unitId);
        const unitData = UNITS[unitId];
        if (!unit || !unitData?.evolvesTo) return false;
        if (unit.shards < (unitData.evolutionMaterials || 999)) return false;

        set(s => {
          const newUnits = s.ownedUnits
            .filter(u => u.unitId !== unitId)
            .concat([{ unitId: unitData.evolvesTo!, level: unit.level, experience: unit.experience, shards: unit.shards - unitData.evolutionMaterials!, equipped: false }]);
          // Update equipped
          const newEquipped = s.equippedUnitIds.map(id => id === unitId ? unitData.evolvesTo! : id);
          return { ownedUnits: newUnits, equippedUnitIds: newEquipped };
        });
        return true;
      },

      getEquippedUnits: () => {
        const { equippedUnitIds, ownedUnits } = get();
        return equippedUnitIds.map(id => id ? ownedUnits.find(u => u.unitId === id) || null : null);
      },

      // ------- Summon -------
      summonUnit: (type) => {
        const { spendCoins, spendGems, addUnit, profile } = get();
        let count = 1;
        let success = false;

        if (type === 'coin') success = spendCoins(100);
        else if (type === 'gem') success = spendGems(10);
        else { success = spendGems(90); count = 10; }

        if (!success) return false;

        const results: UnitData[] = [];
        let pity = (profile as any).summonPity ?? 0;

        for (let i = 0; i < count; i++) {
          pity++;
          const forceMythic = pity >= 250;
          const pulled = performSummon(forceMythic);
          if (pulled.rarity === 'mythic' || pulled.rarity === 'secret') {
            pity = 0;
          }
          results.push(pulled);
          addUnit(pulled);
        }

        const currentAchievements = get().achievements;
        const ownedCount = get().ownedUnits.length;
        const toUnlockSummon: string[] = [];
        if (!currentAchievements.includes('first-summon')) toUnlockSummon.push('first-summon');
        if (type === 'multi' && !currentAchievements.includes('multi-summon')) toUnlockSummon.push('multi-summon');
        if (results.some(r => r.rarity === 'mythic') && !currentAchievements.includes('mythic-pull')) toUnlockSummon.push('mythic-pull');
        if (results.some(r => r.rarity === 'secret') && !currentAchievements.includes('secret-pull')) toUnlockSummon.push('secret-pull');
        if (ownedCount >= 5 && !currentAchievements.includes('collector-5')) toUnlockSummon.push('collector-5');
        if (ownedCount >= 10 && !currentAchievements.includes('collector-10')) toUnlockSummon.push('collector-10');

        set(s => ({
          revealQueue: results,
          profile: { ...s.profile, summonPity: pity } as any,
          ...(toUnlockSummon.length > 0 ? {
            achievements: [...s.achievements, ...toUnlockSummon],
            newAchievements: [...s.newAchievements, ...toUnlockSummon],
          } : {}),
        }));
        return true;
      },

      clearRevealQueue: () => set({ revealQueue: [] }),

      dismissAchievement: (id) => {
        set(s => ({ newAchievements: s.newAchievements.filter(a => a !== id) }));
      },

      // ------- Traits & Daily Rewards -------
      addTrait: (traitId) => {
        set(s => {
          if (s.ownedTraits.includes(traitId)) return s;
          return { ownedTraits: [...s.ownedTraits, traitId] };
        });
      },

      equipTrait: (traitId) => {
        set(s => {
          if (!s.ownedTraits.includes(traitId)) return s;
          if (s.activeTraits.includes(traitId)) return s;
          if (s.activeTraits.length >= 3) return s;
          return { activeTraits: [...s.activeTraits, traitId] };
        });
      },

      unequipTrait: (traitId) => {
        set(s => ({ activeTraits: s.activeTraits.filter(t => t !== traitId) }));
      },

      claimDailyReward: () => {
        const state = get();
        const now = Date.now();
        const MS_PER_DAY = 86400000;
        if (now - (state.lastDailyRewardClaim ?? 0) < MS_PER_DAY) return null;

        const day = ((state.dailyRewardDay ?? 1) - 1) % 7;
        const reward = DAILY_REWARDS[day];
        let traitId: string | undefined;

        if (reward.traitRarity) {
          const trait = rollTrait(reward.traitRarity);
          traitId = trait.id;
          get().addTrait(trait.id);
        }

        set(s => ({
          profile: {
            ...s.profile,
            coins: s.profile.coins + reward.coins,
            gems: s.profile.gems + reward.gems,
          },
          dailyRewardDay: (s.dailyRewardDay ?? 1) + 1,
          lastDailyRewardClaim: now,
        }));

        return { coins: reward.coins, gems: reward.gems, trait: traitId };
      },

      claimFreeBundle: () => {
        const state = get();
        if (state.freeBundleClaimed) return;
        set(s => ({
          profile: { ...s.profile, coins: s.profile.coins + 2000, gems: s.profile.gems + 100 },
          freeBundleClaimed: true,
        }));
      },

      testSummonSecret: () => {
        const { addUnit } = get();
        const secretPool = Object.values(UNITS).filter(u => u.rarity === 'secret' && u.summonWeight > 0);
        if (secretPool.length === 0) return;
        const picked = secretPool[Math.floor(Math.random() * secretPool.length)];
        addUnit(picked);
        set({ revealQueue: [picked] });
      },

      // ------- Game -------
      startGame: (mode) => {
        set({
          gameMode: mode,
          screen: 'game',
          game: {
            ...generateInitialGame(),
            gold: mode === 'challenge' ? 150 : 300,
          },
        });
      },

      resetGame: () => {
        set({ screen: 'modes', game: generateInitialGame() });
      },

      startNextWave: () => {
        const { game } = get();
        if (game.isWaveActive || game.isGameOver) return;

        const nextWave = game.wave + 1;
        const waveData = generateWave(nextWave);
        const now = Date.now() / 1000;

        // Build spawn queue
        const spawnQueue: GameState['spawnQueue'] = [];
        let time = 0;
        for (const we of waveData.enemies) {
          for (let i = 0; i < we.count; i++) {
            spawnQueue.push({
              enemyId: we.enemyId,
              spawnTime: now + time,
              hpMult: we.hpMultiplier,
              speedMult: we.speedMultiplier,
            });
            time += we.spawnInterval;
          }
        }

        // Add boss at end if boss wave
        if (waveData.bossId) {
          spawnQueue.push({
            enemyId: waveData.bossId,
            spawnTime: now + time + 2,
            hpMult: 1,
            speedMult: 1,
            isBoss: true,
            bossId: waveData.bossId,
          });
        }

        set(s => ({
          game: {
            ...s.game,
            wave: nextWave,
            isWaveActive: true,
            spawnQueue,
            currentWaveData: waveData,
            waveStartTime: now,
          },
        }));
      },

      updateGame: (delta: number, currentTime: number) => {
        const { game, equippedUnitIds, ownedUnits } = get();
        if (game.isPaused || game.isGameOver) return;

        const speed = game.speed;
        const dt = delta * speed;

        // ---- Spawn enemies ----
        let newEnemies = [...game.enemies];
        let newSpawnQueue = game.spawnQueue.filter(sq => {
          if (sq.spawnTime <= currentTime) {
            // Spawn this enemy
            let enemy: LiveEnemy;
            if (sq.isBoss && sq.bossId) {
              const boss = BOSSES[sq.bossId];
              enemy = {
                id: `e${_enemyIdCounter++}`,
                enemyId: sq.bossId,
                hp: boss.hp,
                maxHp: boss.hp,
                position: 0,
                reward: boss.rewards.coins,
                hpMultiplier: sq.hpMult,
                speedMultiplier: sq.speedMult,
                isBoss: true,
                bossPhase: 1,
                size: boss.size,
                color: boss.color,
                auraColor: boss.auraColor,
              };
            } else {
              const enemyData = ENEMIES[sq.enemyId];
              if (!enemyData) return true; // skip
              enemy = {
                id: `e${_enemyIdCounter++}`,
                enemyId: sq.enemyId,
                hp: enemyData.hp * sq.hpMult,
                maxHp: enemyData.hp * sq.hpMult,
                position: 0,
                reward: enemyData.reward,
                hpMultiplier: sq.hpMult,
                speedMultiplier: sq.speedMult,
                size: enemyData.size,
                color: enemyData.color,
                auraColor: enemyData.auraColor,
              };
            }
            newEnemies.push(enemy);
            return false; // remove from queue
          }
          return true; // keep
        });

        // ---- Move enemies ----
        let livesLost = 0;
        const newEffects = [...game.effects];
        const newTexts = [...game.floatingTexts];
        let scoreGained = 0;
        let goldGained = 0;

        newEnemies = newEnemies.map(e => {
          const baseSpeed = e.isBoss
            ? (BOSSES[e.enemyId]?.speed || 0.5)
            : (ENEMIES[e.enemyId]?.speed || 2.0);
          const actualSpeed = baseSpeed * e.speedMultiplier * (1 - (e.slowFactor || 0));
          const newPos = e.position + (actualSpeed * dt) / PATH_LENGTH;
          const newSlowTimer = e.slowTimer ? Math.max(0, e.slowTimer - dt) : 0;
          const newSlowFactor = newSlowTimer > 0 ? (e.slowFactor || 0) : 0;

          // Check phase change for bosses
          let newPhase = e.bossPhase;
          if (e.isBoss && newPhase === 1) {
            const boss = BOSSES[e.enemyId];
            if (boss && e.hp / e.maxHp < boss.phase2Threshold) {
              newPhase = 2;
              newEffects.push({
                id: `eff${_effectIdCounter++}`,
                type: 'phase-change',
                x: 0, z: 0,
                color: e.auraColor,
                created: currentTime,
                radius: 5,
              });
            }
          }

          return { ...e, position: newPos, bossPhase: newPhase, slowFactor: newSlowFactor, slowTimer: newSlowTimer };
        });

        // Remove enemies that reached the end
        const survivedEnemies = newEnemies.filter(e => {
          if (e.position >= 1.0) {
            const dmg = e.isBoss ? 5 : 1;
            livesLost += dmg;
            return false;
          }
          return true;
        });

        // ---- Units attack enemies ----
        let updatedEnemies = [...survivedEnemies];
        const updatedPlacedUnits = game.placedUnits.map(pu => {
          const unitId = pu.unitId;
          const unitData = UNITS[unitId];
          if (!unitData) return pu;

          const owned = ownedUnits.find(u => u.unitId === unitId);
          const levelMult = 1 + ((owned?.level || 1) - 1) * 0.1;
          const atk = unitData.stats.atk * levelMult;
          const range = unitData.stats.range;
          const atkInterval = 1 / unitData.stats.attackSpeed;

          const [ux, uz] = [pu.gridX, pu.gridZ];

          if (currentTime - pu.lastAttackTime < atkInterval) return pu;

          // Find nearest enemy in range
          let nearestEnemy: LiveEnemy | null = null;
          let nearestDist = Infinity;
          for (const e of updatedEnemies) {
            const [ex, ez] = getPositionOnPath(e.position);
            const dist = Math.sqrt((ex - ux) ** 2 + (ez - uz) ** 2);
            if (dist <= range && dist < nearestDist) {
              nearestDist = dist;
              nearestEnemy = e;
            }
          }

          if (!nearestEnemy) return pu;

          // Deal damage
          const finalAtk = atk;
          updatedEnemies = updatedEnemies.map(e => {
            if (e.id !== nearestEnemy!.id) return e;
            const newHp = e.hp - finalAtk;
            if (newHp <= 0) {
              goldGained += e.reward;
              scoreGained += Math.round(e.reward * 10);
              newTexts.push({
                id: `t${_textIdCounter++}`,
                text: `+${e.reward}g`,
                x: e.id ? getPositionOnPath(e.position)[0] : 0,
                z: e.id ? getPositionOnPath(e.position)[1] : 0,
                created: currentTime,
                color: '#FCD34D',
              });
              return { ...e, hp: 0 };
            }
            return { ...e, hp: newHp };
          });

          // Add attack effect
          if (nearestEnemy) {
            const [ex, ez] = getPositionOnPath(nearestEnemy.position);
            newEffects.push({
              id: `eff${_effectIdCounter++}`,
              type: 'attack',
              x: (ux + ex) / 2,
              z: (uz + ez) / 2,
              color: unitData.auraColor,
              created: currentTime,
            });
          }

          return { ...pu, lastAttackTime: currentTime };
        });

        // Remove dead enemies — count kills
        const killedThisFrame = updatedEnemies.filter(e => e.hp <= 0);
        const killsGained = killedThisFrame.length;
        const bossKilledThisFrame = killedThisFrame.some(e => e.isBoss);
        const aliveEnemies = updatedEnemies.filter(e => e.hp > 0);

        // Clean old effects (> 0.5s)
        const liveEffects = newEffects.filter(ef => currentTime - ef.created < 0.5);
        const liveTexts = newTexts.filter(t => currentTime - t.created < 1.5);

        // Check wave end
        const waveEnded = game.isWaveActive &&
          newSpawnQueue.length === 0 &&
          aliveEnemies.length === 0;

        const newLives = Math.max(0, game.lives - livesLost);
        const isGameOver = newLives <= 0;

        // Achievement checks
        const curAch = get().achievements;
        const toUnlockGame: string[] = [];
        if (waveEnded) {
          const w = game.wave;
          if (w >= 5 && !curAch.includes('wave-5')) toUnlockGame.push('wave-5');
          if (w >= 10 && !curAch.includes('wave-10')) toUnlockGame.push('wave-10');
          if (w >= 20 && !curAch.includes('wave-20')) toUnlockGame.push('wave-20');
        }
        if (bossKilledThisFrame && !curAch.includes('first-boss')) toUnlockGame.push('first-boss');

        set(s => {
          const profileUpdates = (waveEnded || isGameOver) ? {
            totalWaves: s.profile.totalWaves + (waveEnded ? 1 : 0),
            totalKills: (s.profile.totalKills || 0) + killsGained,
            highScore: Math.max(s.profile.highScore, s.game.score + scoreGained),
          } : {};
          return {
            game: {
              ...s.game,
              enemies: aliveEnemies,
              placedUnits: updatedPlacedUnits,
              spawnQueue: newSpawnQueue,
              lives: newLives,
              gold: s.game.gold + goldGained,
              score: s.game.score + scoreGained,
              killsThisWave: waveEnded ? 0 : s.game.killsThisWave + killsGained,
              isWaveActive: waveEnded ? false : s.game.isWaveActive,
              isGameOver,
              effects: liveEffects,
              floatingTexts: liveTexts,
            },
            profile: {
              ...s.profile,
              coins: s.profile.coins + Math.floor(goldGained * 0.1),
              ...profileUpdates,
            },
            ...(toUnlockGame.length > 0 ? {
              achievements: [...s.achievements, ...toUnlockGame],
              newAchievements: [...s.newAchievements, ...toUnlockGame],
            } : {}),
          };
        });
      },

      placeUnit: (unitId, gridX, gridZ) => {
        const { game, equippedUnitIds, ownedUnits } = get();
        const unitData = UNITS[unitId];
        if (!unitData) return false;

        // Check if equipped
        if (!equippedUnitIds.includes(unitId)) return false;

        // Check if cell is on path
        if (isOnPath(gridX, gridZ)) return false;

        // Check if cell is already occupied
        const occupied = game.placedUnits.some(pu => pu.gridX === gridX && pu.gridZ === gridZ);
        if (occupied) return false;

        // Check gold
        if (game.gold < unitData.deployCost) return false;

        const newUnit: PlacedUnit = {
          id: `pu${Date.now()}`,
          unitId,
          gridX,
          gridZ,
          lastAttackTime: 0,
          lastAbilityTime: 0,
          facing: 0,
        };

        set(s => ({
          game: {
            ...s.game,
            gold: s.game.gold - unitData.deployCost,
            placedUnits: [...s.game.placedUnits, newUnit],
          },
        }));
        return true;
      },

      removeUnit: (placedId) => {
        const { game } = get();
        const unit = game.placedUnits.find(pu => pu.id === placedId);
        if (!unit) return;
        const refund = Math.floor((UNITS[unit.unitId]?.deployCost || 0) * 0.5);
        set(s => ({
          game: {
            ...s.game,
            gold: s.game.gold + refund,
            placedUnits: s.game.placedUnits.filter(pu => pu.id !== placedId),
          },
        }));
      },

      useAbility: (placedId, currentTime) => {
        const { game } = get();
        const pu = game.placedUnits.find(p => p.id === placedId);
        if (!pu) return;
        const unitData = UNITS[pu.unitId];
        if (!unitData) return;
        const cooldown = unitData.ability.cooldown;
        if (currentTime - pu.lastAbilityTime < cooldown) return;

        const [ux, uz] = [pu.gridX, pu.gridZ];
        const aoeRadius = unitData.ability.aoeRadius || unitData.stats.range;
        const dmgMult = unitData.ability.damageMultiplier;
        const abilityDmg = unitData.stats.atk * dmgMult;

        const newEffects = [...game.effects, {
          id: `eff${_effectIdCounter++}`,
          type: unitData.ability.effectType,
          x: ux, z: uz,
          color: unitData.auraColor,
          created: currentTime,
          radius: aoeRadius,
        }];

        let goldGained = 0;
        let scoreGained = 0;
        const newTexts = [...game.floatingTexts];

        const newEnemies = game.enemies.map(e => {
          const [ex, ez] = getPositionOnPath(e.position);
          const dist = Math.sqrt((ex - ux) ** 2 + (ez - uz) ** 2);
          if (dist > aoeRadius) return e;

          let newHp = e.hp - abilityDmg;

          // Special effects by type
          if (unitData.ability.effectType === 'freeze') {
            return { ...e, hp: Math.max(0, newHp), slowFactor: 0.7, slowTimer: 4.0 };
          }
          if (unitData.ability.effectType === 'heal') {
            // Heal effect — doesn't damage
            return e;
          }

          if (newHp <= 0) {
            goldGained += e.reward;
            scoreGained += e.reward * 10;
            newTexts.push({
              id: `t${_textIdCounter++}`,
              text: `💥 ${Math.round(abilityDmg)}`,
              x: ex, z: ez,
              created: currentTime,
              color: '#F87171',
            });
          }
          return { ...e, hp: Math.max(0, newHp) };
        }).filter(e => e.hp > 0);

        set(s => ({
          game: {
            ...s.game,
            enemies: newEnemies,
            effects: newEffects,
            floatingTexts: newTexts,
            gold: s.game.gold + goldGained,
            score: s.game.score + scoreGained,
            placedUnits: s.game.placedUnits.map(p =>
              p.id === placedId ? { ...p, lastAbilityTime: currentTime } : p
            ),
          },
        }));
      },

      togglePause: () => {
        set(s => ({ game: { ...s.game, isPaused: !s.game.isPaused } }));
      },

      setSpeed: (speed) => {
        set(s => ({ game: { ...s.game, speed } }));
      },

      addGold: (amount) => {
        set(s => ({ game: { ...s.game, gold: s.game.gold + amount } }));
      },
    }),
    {
      name: 'anime-td-save',
      partialize: (state) => ({
        profile: state.profile,
        ownedUnits: state.ownedUnits,
        equippedUnitIds: state.equippedUnitIds,
        achievements: state.achievements,
        ownedTraits: state.ownedTraits,
        activeTraits: state.activeTraits,
        dailyRewardDay: state.dailyRewardDay,
        lastDailyRewardClaim: state.lastDailyRewardClaim,
        freeBundleClaimed: state.freeBundleClaimed,
      }),
    }
  )
);
