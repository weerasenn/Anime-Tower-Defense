// ============================================================
// ENEMY DATA — Anime Tower Defense
// Enemies spawn in waves and travel the path
// ============================================================

export interface EnemyData {
  id: string;
  name: string;
  hp: number;       // base HP (scales per wave)
  speed: number;    // units per second along path
  atk: number;      // damage dealt to base if it reaches end
  reward: number;   // gold dropped on kill
  color: string;    // 3D color
  auraColor: string;
  size: number;     // scale multiplier
  description: string;
}

export const ENEMIES: Record<string, EnemyData> = {
  'grunt': {
    id: 'grunt',
    name: 'Shadow Grunt',
    hp: 200,
    speed: 2.0,
    atk: 1,
    reward: 10,
    color: '#374151',
    auraColor: '#6B7280',
    size: 0.5,
    description: 'Basic enemy unit.',
  },
  'runner': {
    id: 'runner',
    name: 'Void Runner',
    hp: 120,
    speed: 3.5,
    atk: 1,
    reward: 15,
    color: '#1E293B',
    auraColor: '#475569',
    size: 0.4,
    description: 'Fast but fragile.',
  },
  'brute': {
    id: 'brute',
    name: 'Iron Brute',
    hp: 800,
    speed: 1.2,
    atk: 2,
    reward: 30,
    color: '#78716C',
    auraColor: '#A8A29E',
    size: 0.8,
    description: 'Slow heavy enemy.',
  },
  'mage-enemy': {
    id: 'mage-enemy',
    name: 'Abyss Mage',
    hp: 400,
    speed: 1.8,
    atk: 2,
    reward: 25,
    color: '#4C1D95',
    auraColor: '#7C3AED',
    size: 0.55,
    description: 'Casts dark spells.',
  },
  'armored': {
    id: 'armored',
    name: 'Void Knight',
    hp: 1500,
    speed: 1.0,
    atk: 3,
    reward: 50,
    color: '#1C1917',
    auraColor: '#44403C',
    size: 0.9,
    description: 'Heavily armored warrior.',
  },
  'elite': {
    id: 'elite',
    name: 'Elite Shadow',
    hp: 2500,
    speed: 1.5,
    atk: 4,
    reward: 80,
    color: '#0F172A',
    auraColor: '#1E293B',
    size: 1.0,
    description: 'Elite enemy unit.',
  },
};

// Wave compositions — list of enemy spawns per wave
export interface WaveEnemy {
  enemyId: string;
  count: number;
  spawnInterval: number; // seconds between spawns
  hpMultiplier: number;
  speedMultiplier: number;
}

export interface WaveData {
  waveNumber: number;
  enemies: WaveEnemy[];
  bossId?: string;       // boss spawns at end of wave
  goldBonus: number;
  description: string;
}

export function generateWave(waveNumber: number): WaveData {
  const scaling = 1 + (waveNumber - 1) * 0.15;
  const isBossWave = waveNumber % 5 === 0;
  const bossIds = ['goliath-prime', 'nyx-void', 'infernal-rex'];

  const enemies: WaveEnemy[] = [];

  if (waveNumber <= 3) {
    // Tutorial waves — just grunts
    enemies.push({ enemyId: 'grunt', count: 5 + waveNumber * 2, spawnInterval: 1.0, hpMultiplier: scaling, speedMultiplier: 1 });
  } else if (waveNumber <= 7) {
    enemies.push({ enemyId: 'grunt', count: 6, spawnInterval: 0.8, hpMultiplier: scaling, speedMultiplier: 1 });
    enemies.push({ enemyId: 'runner', count: 4, spawnInterval: 0.6, hpMultiplier: scaling, speedMultiplier: 1 });
  } else if (waveNumber <= 12) {
    enemies.push({ enemyId: 'grunt', count: 8, spawnInterval: 0.7, hpMultiplier: scaling, speedMultiplier: 1 });
    enemies.push({ enemyId: 'runner', count: 5, spawnInterval: 0.5, hpMultiplier: scaling, speedMultiplier: 1 });
    enemies.push({ enemyId: 'brute', count: 2, spawnInterval: 2.0, hpMultiplier: scaling, speedMultiplier: 1 });
  } else if (waveNumber <= 20) {
    enemies.push({ enemyId: 'grunt', count: 10, spawnInterval: 0.6, hpMultiplier: scaling, speedMultiplier: 1 });
    enemies.push({ enemyId: 'runner', count: 6, spawnInterval: 0.4, hpMultiplier: scaling, speedMultiplier: 1 });
    enemies.push({ enemyId: 'brute', count: 3, spawnInterval: 1.5, hpMultiplier: scaling, speedMultiplier: 1 });
    enemies.push({ enemyId: 'mage-enemy', count: 3, spawnInterval: 1.2, hpMultiplier: scaling, speedMultiplier: 1 });
  } else {
    enemies.push({ enemyId: 'grunt', count: 12, spawnInterval: 0.5, hpMultiplier: scaling, speedMultiplier: 1.1 });
    enemies.push({ enemyId: 'runner', count: 8, spawnInterval: 0.3, hpMultiplier: scaling, speedMultiplier: 1.2 });
    enemies.push({ enemyId: 'brute', count: 4, spawnInterval: 1.2, hpMultiplier: scaling, speedMultiplier: 1 });
    enemies.push({ enemyId: 'armored', count: 2, spawnInterval: 2.0, hpMultiplier: scaling, speedMultiplier: 1 });
    enemies.push({ enemyId: 'elite', count: 1, spawnInterval: 3.0, hpMultiplier: scaling, speedMultiplier: 1 });
  }

  return {
    waveNumber,
    enemies,
    bossId: isBossWave ? bossIds[(Math.floor(waveNumber / 5) - 1) % 3] : undefined,
    goldBonus: waveNumber * 20,
    description: isBossWave ? `BOSS WAVE ${waveNumber}!` : `Wave ${waveNumber}`,
  };
}
