// ============================================================
// UNIT & BOSS DATA — Anime Tower Defense
// All original characters, not based on any existing anime
// ============================================================

export type UnitRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type UnitRole = 'swordsman' | 'tank' | 'fighter' | 'archer' | 'warrior' | 'assassin' | 'support' | 'vanguard';

export interface UnitAbility {
  name: string;
  description: string;
  cooldown: number; // seconds
  effectType: 'slash' | 'barrier' | 'dash' | 'explosion' | 'pierce' | 'chain' | 'void' | 'heal' | 'taunt' | 'nova' | 'freeze' | 'supernova';
  aoeRadius?: number;
  damageMultiplier: number;
}

export interface UnitStats {
  hp: number;
  atk: number;
  range: number;       // in grid units
  attackSpeed: number; // attacks per second
  defense: number;
}

export interface UnitData {
  id: string;
  name: string;
  title: string;
  rarity: UnitRarity;
  role: UnitRole;
  color: string;       // primary color hex
  auraColor: string;   // glow/aura color hex
  trailColor: string;  // particle trail color
  stats: UnitStats;
  ability: UnitAbility;
  evolvesTo?: string;  // id of next evolution
  evolutionMaterials?: number; // shards needed
  description: string;
  deployCost: number;  // gold cost to place on field
  summonWeight: number; // for gacha (higher = more common within rarity)
}

// ===================== COMMON UNITS =====================

export const UNITS: Record<string, UnitData> = {

  // --- Kai Blade line ---
  'kai-blade': {
    id: 'kai-blade',
    name: 'Kai Blade',
    title: 'Swift Swordsman',
    rarity: 'common',
    role: 'swordsman',
    color: '#3B82F6',
    auraColor: '#60A5FA',
    trailColor: '#BFDBFE',
    stats: { hp: 600, atk: 80, range: 1.8, attackSpeed: 1.2, defense: 20 },
    ability: {
      name: 'Swift Slash',
      description: 'Unleashes a rapid multi-hit combo hitting all enemies in range',
      cooldown: 8,
      effectType: 'slash',
      damageMultiplier: 2.5,
    },
    evolvesTo: 'kai-ascended',
    evolutionMaterials: 30,
    description: 'A young fighter with a glowing energy sword. His blue energy trails blur with every strike.',
    deployCost: 100,
    summonWeight: 3,
  },

  'kai-ascended': {
    id: 'kai-ascended',
    name: 'Kai Ascended Blade',
    title: 'Awakened Swordsman',
    rarity: 'common',
    role: 'swordsman',
    color: '#2563EB',
    auraColor: '#93C5FD',
    trailColor: '#DBEAFE',
    stats: { hp: 900, atk: 130, range: 2.0, attackSpeed: 1.5, defense: 30 },
    ability: {
      name: 'Swift Slash+',
      description: 'Enhanced multi-hit combo with extended range',
      cooldown: 7,
      effectType: 'slash',
      damageMultiplier: 3.2,
    },
    evolvesTo: 'kai-infinity',
    evolutionMaterials: 80,
    description: 'Kai has awakened his true power. His blade now crackles with pure energy.',
    deployCost: 150,
    summonWeight: 1,
  },

  'kai-infinity': {
    id: 'kai-infinity',
    name: 'Kai Infinity Blade',
    title: 'Eternal Swordmaster',
    rarity: 'common',
    role: 'swordsman',
    color: '#1D4ED8',
    auraColor: '#A5B4FC',
    trailColor: '#E0E7FF',
    stats: { hp: 1400, atk: 220, range: 2.5, attackSpeed: 1.8, defense: 45 },
    ability: {
      name: 'Infinity Slash',
      description: 'Reality-cutting slash that deals massive damage to all enemies in a wide arc',
      cooldown: 6,
      effectType: 'slash',
      aoeRadius: 2.5,
      damageMultiplier: 5.0,
    },
    description: 'Kai transcended the limits of his body. His infinity blade can cut through dimensions.',
    deployCost: 200,
    summonWeight: 0.5,
  },

  // --- Mira Shieldheart line ---
  'mira-shieldheart': {
    id: 'mira-shieldheart',
    name: 'Mira Shieldheart',
    title: 'Guardian Knight',
    rarity: 'common',
    role: 'tank',
    color: '#F59E0B',
    auraColor: '#FCD34D',
    trailColor: '#FEF3C7',
    stats: { hp: 1200, atk: 50, range: 1.5, attackSpeed: 0.8, defense: 60 },
    ability: {
      name: 'Barrier Dome',
      description: 'Creates a golden barrier dome granting temporary damage immunity to nearby allies',
      cooldown: 12,
      effectType: 'barrier',
      aoeRadius: 2.0,
      damageMultiplier: 1.0,
    },
    evolvesTo: 'mira-radiant',
    evolutionMaterials: 30,
    description: 'An armored protector with a light-forged shield. Her golden barrier can stop any attack.',
    deployCost: 100,
    summonWeight: 3,
  },

  'mira-radiant': {
    id: 'mira-radiant',
    name: 'Mira Radiant Guard',
    title: 'Holy Sentinel',
    rarity: 'common',
    role: 'tank',
    color: '#D97706',
    auraColor: '#FDE68A',
    trailColor: '#FFFBEB',
    stats: { hp: 1800, atk: 80, range: 1.8, attackSpeed: 1.0, defense: 90 },
    ability: {
      name: 'Holy Barrier',
      description: 'Expanded barrier with healing aura for protected allies',
      cooldown: 10,
      effectType: 'barrier',
      aoeRadius: 2.5,
      damageMultiplier: 1.5,
    },
    evolvesTo: 'mira-divine',
    evolutionMaterials: 80,
    description: 'Mira\'s shield now radiates holy energy that heals nearby units.',
    deployCost: 150,
    summonWeight: 1,
  },

  'mira-divine': {
    id: 'mira-divine',
    name: 'Mira Divine Aegis',
    title: 'Goddess of Defense',
    rarity: 'common',
    role: 'tank',
    color: '#92400E',
    auraColor: '#FEF3C7',
    trailColor: '#FFFFF0',
    stats: { hp: 2800, atk: 120, range: 2.0, attackSpeed: 1.2, defense: 150 },
    ability: {
      name: 'Divine Sanctuary',
      description: 'Massive barrier covering the entire arena, healing all allies continuously',
      cooldown: 8,
      effectType: 'barrier',
      aoeRadius: 5.0,
      damageMultiplier: 2.0,
    },
    description: 'Mira ascended to godhood. Her divine shield is unbreakable.',
    deployCost: 200,
    summonWeight: 0.5,
  },

  // --- Ren Flashstep line ---
  'ren-flashstep': {
    id: 'ren-flashstep',
    name: 'Ren Flashstep',
    title: 'Speed Fighter',
    rarity: 'common',
    role: 'fighter',
    color: '#F8FAFC',
    auraColor: '#E2E8F0',
    trailColor: '#FFFFFF',
    stats: { hp: 500, atk: 90, range: 2.0, attackSpeed: 1.8, defense: 15 },
    ability: {
      name: 'Phantom Dash',
      description: 'Teleports between enemies in a chain strike sequence',
      cooldown: 9,
      effectType: 'dash',
      damageMultiplier: 2.0,
    },
    evolvesTo: 'ren-phantom',
    evolutionMaterials: 30,
    description: 'A ninja-style fighter whose speed blurs the air around him.',
    deployCost: 100,
    summonWeight: 3,
  },

  'ren-phantom': {
    id: 'ren-phantom',
    name: 'Ren Phantom Strike',
    title: 'Ghost Ninja',
    rarity: 'common',
    role: 'fighter',
    color: '#CBD5E1',
    auraColor: '#F1F5F9',
    trailColor: '#FFFFFF',
    stats: { hp: 800, atk: 150, range: 2.2, attackSpeed: 2.2, defense: 25 },
    ability: {
      name: 'Ghost Rush',
      description: 'Becomes intangible and strikes through multiple enemies',
      cooldown: 7,
      effectType: 'dash',
      damageMultiplier: 3.0,
    },
    evolvesTo: 'ren-sovereign',
    evolutionMaterials: 80,
    description: 'Ren mastered the art of phasing through reality itself.',
    deployCost: 150,
    summonWeight: 1,
  },

  'ren-sovereign': {
    id: 'ren-sovereign',
    name: 'Ren Speed Sovereign',
    title: 'Lord of Velocity',
    rarity: 'common',
    role: 'fighter',
    color: '#94A3B8',
    auraColor: '#FFFFFF',
    trailColor: '#F8FAFC',
    stats: { hp: 1200, atk: 260, range: 3.0, attackSpeed: 3.0, defense: 40 },
    ability: {
      name: 'Temporal Rush',
      description: 'Moves so fast he creates afterimages that each deal full damage',
      cooldown: 5,
      effectType: 'dash',
      aoeRadius: 3.0,
      damageMultiplier: 6.0,
    },
    description: 'Ren broke the sound barrier. His movement is faster than thought.',
    deployCost: 200,
    summonWeight: 0.5,
  },

  // ===================== RARE UNITS =====================

  'akira-emberstorm': {
    id: 'akira-emberstorm',
    name: 'Akira Emberstorm',
    title: 'Fire Manipulator',
    rarity: 'rare',
    role: 'warrior',
    color: '#EF4444',
    auraColor: '#F97316',
    trailColor: '#FED7AA',
    stats: { hp: 800, atk: 140, range: 2.5, attackSpeed: 1.0, defense: 25 },
    ability: {
      name: 'Inferno Burst',
      description: 'Releases a massive AOE fire explosion scorching all nearby enemies',
      cooldown: 10,
      effectType: 'explosion',
      aoeRadius: 3.0,
      damageMultiplier: 4.0,
    },
    evolvesTo: 'akira-infernal',
    evolutionMaterials: 50,
    description: 'Controls explosive fire energy. His core burns with the heat of a sun.',
    deployCost: 200,
    summonWeight: 3,
  },

  'akira-infernal': {
    id: 'akira-infernal',
    name: 'Akira Infernal Form',
    title: 'Flame Incarnate',
    rarity: 'rare',
    role: 'warrior',
    color: '#DC2626',
    auraColor: '#FB923C',
    trailColor: '#FFEDD5',
    stats: { hp: 1200, atk: 220, range: 2.8, attackSpeed: 1.2, defense: 40 },
    ability: {
      name: 'Hellfire Burst',
      description: 'Expanded inferno with burning aftereffect on enemies',
      cooldown: 8,
      effectType: 'explosion',
      aoeRadius: 4.0,
      damageMultiplier: 5.5,
    },
    evolvesTo: 'akira-phoenix',
    evolutionMaterials: 120,
    description: 'Akira merged with pure fire. His form flickers between human and flame.',
    deployCost: 280,
    summonWeight: 1,
  },

  'akira-phoenix': {
    id: 'akira-phoenix',
    name: 'Akira Phoenix Emperor',
    title: 'Eternal Flame',
    rarity: 'rare',
    role: 'warrior',
    color: '#B91C1C',
    auraColor: '#FDBA74',
    trailColor: '#FFF7ED',
    stats: { hp: 2000, atk: 380, range: 3.5, attackSpeed: 1.5, defense: 65 },
    ability: {
      name: 'Phoenix Nova',
      description: 'Transforms into a phoenix and detonates in a continent-shaking explosion',
      cooldown: 6,
      effectType: 'explosion',
      aoeRadius: 5.0,
      damageMultiplier: 9.0,
    },
    description: 'Akira became the Phoenix Emperor. He cannot die — he only burns brighter.',
    deployCost: 350,
    summonWeight: 0.5,
  },

  'sora-vantage': {
    id: 'sora-vantage',
    name: 'Sora Vantage',
    title: 'Precision Archer',
    rarity: 'rare',
    role: 'archer',
    color: '#06B6D4',
    auraColor: '#22D3EE',
    trailColor: '#CFFAFE',
    stats: { hp: 600, atk: 160, range: 4.0, attackSpeed: 0.8, defense: 15 },
    ability: {
      name: 'Piercing Light Shot',
      description: 'Fires a light-speed arrow that pierces through all enemies in its path',
      cooldown: 8,
      effectType: 'pierce',
      damageMultiplier: 5.0,
    },
    evolvesTo: 'sora-starfall',
    evolutionMaterials: 50,
    description: 'A calm ranged fighter with an energy bow. Her cyan glow marks every target.',
    deployCost: 200,
    summonWeight: 3,
  },

  'sora-starfall': {
    id: 'sora-starfall',
    name: 'Sora Starfall',
    title: 'Heaven\'s Archer',
    rarity: 'rare',
    role: 'archer',
    color: '#0891B2',
    auraColor: '#67E8F9',
    trailColor: '#ECFEFF',
    stats: { hp: 900, atk: 260, range: 5.0, attackSpeed: 1.1, defense: 25 },
    ability: {
      name: 'Heaven\'s Arrow',
      description: 'Rains light arrows from above hitting all enemies simultaneously',
      cooldown: 7,
      effectType: 'pierce',
      aoeRadius: 4.0,
      damageMultiplier: 7.0,
    },
    evolvesTo: 'sora-celestial',
    evolutionMaterials: 120,
    description: 'Sora learned to bend light itself. Her arrows never miss.',
    deployCost: 280,
    summonWeight: 1,
  },

  'sora-celestial': {
    id: 'sora-celestial',
    name: 'Sora Celestial Prime',
    title: 'Goddess of the Sky',
    rarity: 'rare',
    role: 'archer',
    color: '#164E63',
    auraColor: '#A5F3FC',
    trailColor: '#F0FDFF',
    stats: { hp: 1500, atk: 450, range: 6.0, attackSpeed: 1.5, defense: 40 },
    ability: {
      name: 'Superluminal Strike',
      description: 'Arrow moving faster than light obliterates all enemies on screen',
      cooldown: 5,
      effectType: 'pierce',
      aoeRadius: 8.0,
      damageMultiplier: 12.0,
    },
    description: 'Sora became light itself. She watches the battlefield from the heavens.',
    deployCost: 350,
    summonWeight: 0.5,
  },

  'ryu-voltclash': {
    id: 'ryu-voltclash',
    name: 'Ryu Voltclash',
    title: 'Lightning Warrior',
    rarity: 'rare',
    role: 'warrior',
    color: '#A855F7',
    auraColor: '#C084FC',
    trailColor: '#F3E8FF',
    stats: { hp: 700, atk: 130, range: 2.0, attackSpeed: 1.4, defense: 30 },
    ability: {
      name: 'Thunder Chain',
      description: 'Releases electric chains that arc between multiple enemies',
      cooldown: 9,
      effectType: 'chain',
      aoeRadius: 3.5,
      damageMultiplier: 3.5,
    },
    evolvesTo: 'ryu-stormking',
    evolutionMaterials: 50,
    description: 'Electric-based melee fighter. Purple lightning arcs from his body at all times.',
    deployCost: 200,
    summonWeight: 3,
  },

  'ryu-stormking': {
    id: 'ryu-stormking',
    name: 'Ryu Storm King',
    title: 'Thunder Sovereign',
    rarity: 'rare',
    role: 'warrior',
    color: '#9333EA',
    auraColor: '#D8B4FE',
    trailColor: '#FAF5FF',
    stats: { hp: 1100, atk: 210, range: 2.5, attackSpeed: 1.7, defense: 50 },
    ability: {
      name: 'Storm Judgment',
      description: 'Calls down a thunderstorm hitting all enemies with lightning simultaneously',
      cooldown: 7,
      effectType: 'chain',
      aoeRadius: 5.0,
      damageMultiplier: 5.0,
    },
    evolvesTo: 'ryu-thunder-god',
    evolutionMaterials: 120,
    description: 'Ryu commands storms. The sky darkens wherever he walks.',
    deployCost: 280,
    summonWeight: 1,
  },

  'ryu-thunder-god': {
    id: 'ryu-thunder-god',
    name: 'Ryu Thunder God',
    title: 'God of Lightning',
    rarity: 'rare',
    role: 'warrior',
    color: '#6D28D9',
    auraColor: '#E9D5FF',
    trailColor: '#F5F3FF',
    stats: { hp: 1800, atk: 370, range: 3.5, attackSpeed: 2.0, defense: 80 },
    ability: {
      name: 'Divine Thunder',
      description: 'Transforms into pure lightning and annihilates everything in range',
      cooldown: 5,
      effectType: 'chain',
      aoeRadius: 6.0,
      damageMultiplier: 10.0,
    },
    description: 'Ryu merged with the storm. He IS the lightning.',
    deployCost: 350,
    summonWeight: 0.5,
  },

  // ===================== EPIC UNITS =====================

  'kage-nullshade': {
    id: 'kage-nullshade',
    name: 'Kage Nullshade',
    title: 'Shadow Assassin',
    rarity: 'epic',
    role: 'assassin',
    color: '#1E293B',
    auraColor: '#475569',
    trailColor: '#334155',
    stats: { hp: 900, atk: 280, range: 2.5, attackSpeed: 1.5, defense: 20 },
    ability: {
      name: 'Void Step',
      description: 'Teleports through shadows and deals critical burst damage to a single target',
      cooldown: 8,
      effectType: 'void',
      damageMultiplier: 8.0,
    },
    evolvesTo: 'kage-voidlord',
    evolutionMaterials: 80,
    description: 'Stealth-based teleport assassin. His dark smoke form is barely visible.',
    deployCost: 350,
    summonWeight: 2,
  },

  'kage-voidlord': {
    id: 'kage-voidlord',
    name: 'Kage Void Lord',
    title: 'Master of Shadows',
    rarity: 'epic',
    role: 'assassin',
    color: '#0F172A',
    auraColor: '#64748B',
    trailColor: '#1E293B',
    stats: { hp: 1400, atk: 450, range: 3.0, attackSpeed: 1.8, defense: 35 },
    ability: {
      name: 'Shadow Realm',
      description: 'Pulls enemies into the shadow realm, dealing massive damage',
      cooldown: 7,
      effectType: 'void',
      aoeRadius: 3.0,
      damageMultiplier: 12.0,
    },
    evolvesTo: 'kage-eternal-void',
    evolutionMaterials: 200,
    description: 'Kage became the shadow itself. He exists between light and darkness.',
    deployCost: 500,
    summonWeight: 0.8,
  },

  'kage-eternal-void': {
    id: 'kage-eternal-void',
    name: 'Kage Eternal Void',
    title: 'Sovereign of Darkness',
    rarity: 'epic',
    role: 'assassin',
    color: '#020617',
    auraColor: '#94A3B8',
    trailColor: '#0F172A',
    stats: { hp: 2200, atk: 750, range: 4.0, attackSpeed: 2.2, defense: 55 },
    ability: {
      name: 'Void Annihilation',
      description: 'Opens a void portal obliterating everything within the zone',
      cooldown: 5,
      effectType: 'void',
      aoeRadius: 5.0,
      damageMultiplier: 20.0,
    },
    description: 'Kage achieved the eternal void. Reality collapses in his presence.',
    deployCost: 700,
    summonWeight: 0.3,
  },

  'hikari-radiance': {
    id: 'hikari-radiance',
    name: 'Hikari Radiance',
    title: 'Light Support Mage',
    rarity: 'epic',
    role: 'support',
    color: '#FAFAFA',
    auraColor: '#FFFFFF',
    trailColor: '#F8FAFC',
    stats: { hp: 700, atk: 100, range: 3.0, attackSpeed: 0.7, defense: 15 },
    ability: {
      name: 'Radiant Pulse',
      description: 'Emits a healing wave that buffs all nearby units and restores HP',
      cooldown: 10,
      effectType: 'heal',
      aoeRadius: 3.5,
      damageMultiplier: 1.5,
    },
    evolvesTo: 'hikari-divine-light',
    evolutionMaterials: 80,
    description: 'Healing and buffing character. Her white glow has cured countless wounds.',
    deployCost: 350,
    summonWeight: 2,
  },

  'hikari-divine-light': {
    id: 'hikari-divine-light',
    name: 'Hikari Divine Light',
    title: 'Angel of Restoration',
    rarity: 'epic',
    role: 'support',
    color: '#F9FAFB',
    auraColor: '#FEF9C3',
    trailColor: '#FFFFFF',
    stats: { hp: 1100, atk: 160, range: 4.0, attackSpeed: 1.0, defense: 25 },
    ability: {
      name: 'Divine Blessing',
      description: 'Full team HP restoration with damage boost aura',
      cooldown: 8,
      effectType: 'heal',
      aoeRadius: 5.0,
      damageMultiplier: 2.0,
    },
    evolvesTo: 'hikari-cosmic-goddess',
    evolutionMaterials: 200,
    description: 'Hikari ascended. Her light now reaches across the entire battlefield.',
    deployCost: 500,
    summonWeight: 0.8,
  },

  'hikari-cosmic-goddess': {
    id: 'hikari-cosmic-goddess',
    name: 'Hikari Cosmic Goddess',
    title: 'Goddess of Light',
    rarity: 'epic',
    role: 'support',
    color: '#F0F9FF',
    auraColor: '#FEF08A',
    trailColor: '#FFFFF0',
    stats: { hp: 1800, atk: 280, range: 6.0, attackSpeed: 1.5, defense: 40 },
    ability: {
      name: 'Cosmic Purification',
      description: 'Purifies the battlefield with holy light, destroying dark energy and healing all',
      cooldown: 6,
      effectType: 'heal',
      aoeRadius: 8.0,
      damageMultiplier: 4.0,
    },
    description: 'Hikari became the Cosmic Goddess. Her light banishes all darkness.',
    deployCost: 700,
    summonWeight: 0.3,
  },

  'tetsu-ironcore': {
    id: 'tetsu-ironcore',
    name: 'Tetsu Ironcore',
    title: 'Heavy Vanguard',
    rarity: 'epic',
    role: 'vanguard',
    color: '#6B7280',
    auraColor: '#9CA3AF',
    trailColor: '#D1D5DB',
    stats: { hp: 2500, atk: 120, range: 1.5, attackSpeed: 0.6, defense: 120 },
    ability: {
      name: 'Fortress Mode',
      description: 'Activates full armor mode with massive damage reduction and enemy taunt',
      cooldown: 12,
      effectType: 'taunt',
      aoeRadius: 3.0,
      damageMultiplier: 2.0,
    },
    evolvesTo: 'tetsu-adamant',
    evolutionMaterials: 80,
    description: 'Massive armored frontline unit. His metallic energy field deflects most attacks.',
    deployCost: 350,
    summonWeight: 2,
  },

  'tetsu-adamant': {
    id: 'tetsu-adamant',
    name: 'Tetsu Adamant Core',
    title: 'Unbreakable Fortress',
    rarity: 'epic',
    role: 'vanguard',
    color: '#4B5563',
    auraColor: '#D1D5DB',
    trailColor: '#E5E7EB',
    stats: { hp: 4000, atk: 200, range: 1.8, attackSpeed: 0.8, defense: 200 },
    ability: {
      name: 'Iron Fortress',
      description: 'Creates an impenetrable zone that blocks enemy movement',
      cooldown: 10,
      effectType: 'taunt',
      aoeRadius: 4.0,
      damageMultiplier: 3.0,
    },
    evolvesTo: 'tetsu-eternal-iron',
    evolutionMaterials: 200,
    description: 'Tetsu\'s armor merged with his body. He is now living metal.',
    deployCost: 500,
    summonWeight: 0.8,
  },

  'tetsu-eternal-iron': {
    id: 'tetsu-eternal-iron',
    name: 'Tetsu Eternal Iron',
    title: 'Living Mountain',
    rarity: 'epic',
    role: 'vanguard',
    color: '#374151',
    auraColor: '#E5E7EB',
    trailColor: '#F3F4F6',
    stats: { hp: 7000, atk: 350, range: 2.0, attackSpeed: 1.0, defense: 380 },
    ability: {
      name: 'Absolute Fortress',
      description: 'Becomes invulnerable and deals reflected damage to all attackers',
      cooldown: 8,
      effectType: 'taunt',
      aoeRadius: 5.0,
      damageMultiplier: 5.0,
    },
    description: 'Tetsu is now an immovable object. Even planetary forces cannot budge him.',
    deployCost: 700,
    summonWeight: 0.3,
  },

  // ===================== LEGENDARY UNITS =====================

  'drakon-pyroclast': {
    id: 'drakon-pyroclast',
    name: 'Drakon Pyroclast',
    title: 'Dragon Flame Warrior',
    rarity: 'legendary',
    role: 'warrior',
    color: '#DC2626',
    auraColor: '#F97316',
    trailColor: '#FED7AA',
    stats: { hp: 2000, atk: 450, range: 3.0, attackSpeed: 1.2, defense: 80 },
    ability: {
      name: 'Dragon Nova',
      description: 'Breathes dragon fire in a massive nova explosion covering the battlefield',
      cooldown: 10,
      effectType: 'nova',
      aoeRadius: 5.0,
      damageMultiplier: 10.0,
    },
    evolvesTo: 'drakon-awakened',
    evolutionMaterials: 150,
    description: 'Dragon-powered energy fighter. Burning dragon wings trail behind every move.',
    deployCost: 600,
    summonWeight: 2,
  },

  'drakon-awakened': {
    id: 'drakon-awakened',
    name: 'Drakon Awakened',
    title: 'Ancient Dragon Lord',
    rarity: 'legendary',
    role: 'warrior',
    color: '#B91C1C',
    auraColor: '#FDBA74',
    trailColor: '#FFF7ED',
    stats: { hp: 3200, atk: 720, range: 4.0, attackSpeed: 1.4, defense: 130 },
    ability: {
      name: 'Ancient Dragon Storm',
      description: 'Summons an ancient dragon storm obliterating all in its path',
      cooldown: 8,
      effectType: 'nova',
      aoeRadius: 7.0,
      damageMultiplier: 16.0,
    },
    evolvesTo: 'drakon-eternal',
    evolutionMaterials: 300,
    description: 'Drakon awakened his true dragon soul. The ground scorches beneath his feet.',
    deployCost: 850,
    summonWeight: 0.8,
  },

  'drakon-eternal': {
    id: 'drakon-eternal',
    name: 'Drakon Eternal Sovereign',
    title: 'God of Dragons',
    rarity: 'legendary',
    role: 'warrior',
    color: '#7F1D1D',
    auraColor: '#FBBF24',
    trailColor: '#FEF3C7',
    stats: { hp: 5500, atk: 1200, range: 5.0, attackSpeed: 1.7, defense: 220 },
    ability: {
      name: 'Eternal Dragon Apocalypse',
      description: 'Becomes the eternal dragon and triggers apocalyptic destruction across the entire map',
      cooldown: 6,
      effectType: 'nova',
      aoeRadius: 10.0,
      damageMultiplier: 30.0,
    },
    description: 'Drakon achieved eternal sovereignty. He IS the dragon god.',
    deployCost: 1200,
    summonWeight: 0.3,
  },

  'chrona-eclipse': {
    id: 'chrona-eclipse',
    name: 'Chrona Eclipse',
    title: 'Time Manipulator',
    rarity: 'legendary',
    role: 'mage',
    color: '#7C3AED',
    auraColor: '#A78BFA',
    trailColor: '#EDE9FE',
    stats: { hp: 1500, atk: 350, range: 4.0, attackSpeed: 0.9, defense: 50 },
    ability: {
      name: 'Temporal Freeze',
      description: 'Distorts time globally slowing all enemies to a crawl',
      cooldown: 12,
      effectType: 'freeze',
      aoeRadius: 10.0,
      damageMultiplier: 3.0,
    },
    evolvesTo: 'chrona-paradox',
    evolutionMaterials: 150,
    description: 'Controls time distortion fields. Clock-like particles orbit her at all times.',
    deployCost: 600,
    summonWeight: 2,
  },

  'chrona-paradox': {
    id: 'chrona-paradox',
    name: 'Chrona Paradox',
    title: 'Master of Timespace',
    rarity: 'legendary',
    role: 'mage',
    color: '#6D28D9',
    auraColor: '#C4B5FD',
    trailColor: '#F5F3FF',
    stats: { hp: 2400, atk: 560, range: 5.0, attackSpeed: 1.2, defense: 80 },
    ability: {
      name: 'Time Paradox',
      description: 'Creates a time loop trapping enemies in damage cycles',
      cooldown: 10,
      effectType: 'freeze',
      aoeRadius: 10.0,
      damageMultiplier: 6.0,
    },
    evolvesTo: 'chrona-eternal',
    evolutionMaterials: 300,
    description: 'Chrona can now rewind and fast-forward events in battle.',
    deployCost: 850,
    summonWeight: 0.8,
  },

  'chrona-eternal': {
    id: 'chrona-eternal',
    name: 'Chrona Eternal Clock',
    title: 'Sovereign of Time',
    rarity: 'legendary',
    role: 'mage',
    color: '#4C1D95',
    auraColor: '#DDD6FE',
    trailColor: '#FAF5FF',
    stats: { hp: 4000, atk: 950, range: 8.0, attackSpeed: 1.5, defense: 130 },
    ability: {
      name: 'Chrono Erasure',
      description: 'Erases enemies from the timeline — instant kill on non-boss enemies',
      cooldown: 8,
      effectType: 'freeze',
      aoeRadius: 12.0,
      damageMultiplier: 50.0,
    },
    description: 'Chrona became the Eternal Clock. She controls all timelines simultaneously.',
    deployCost: 1200,
    summonWeight: 0.3,
  },

  'astra-celestia': {
    id: 'astra-celestia',
    name: 'Astra Celestia',
    title: 'Cosmic Entity Warrior',
    rarity: 'legendary',
    role: 'mage',
    color: '#0EA5E9',
    auraColor: '#38BDF8',
    trailColor: '#BAE6FD',
    stats: { hp: 1800, atk: 500, range: 5.0, attackSpeed: 1.0, defense: 60 },
    ability: {
      name: 'Supernova Collapse',
      description: 'Triggers a screen-wide supernova destroying all enemies simultaneously',
      cooldown: 15,
      effectType: 'supernova',
      aoeRadius: 12.0,
      damageMultiplier: 25.0,
    },
    evolvesTo: 'astra-nebula',
    evolutionMaterials: 150,
    description: 'Celestial space-powered fighter. A starfield of particles orbits her form.',
    deployCost: 600,
    summonWeight: 2,
  },

  'astra-nebula': {
    id: 'astra-nebula',
    name: 'Astra Nebula Prime',
    title: 'Galaxy\'s Champion',
    rarity: 'legendary',
    role: 'mage',
    color: '#0284C7',
    auraColor: '#7DD3FC',
    trailColor: '#E0F2FE',
    stats: { hp: 2900, atk: 800, range: 6.0, attackSpeed: 1.2, defense: 95 },
    ability: {
      name: 'Galactic Collapse',
      description: 'Creates a black hole that pulls in and annihilates all enemies',
      cooldown: 12,
      effectType: 'supernova',
      aoeRadius: 14.0,
      damageMultiplier: 40.0,
    },
    evolvesTo: 'astra-universal',
    evolutionMaterials: 300,
    description: 'Astra expanded to nebula scale. Stars form and die in her wake.',
    deployCost: 850,
    summonWeight: 0.8,
  },

  'astra-universal': {
    id: 'astra-universal',
    name: 'Astra Universal Deity',
    title: 'God of the Cosmos',
    rarity: 'legendary',
    role: 'mage',
    color: '#075985',
    auraColor: '#BAE6FD',
    trailColor: '#F0F9FF',
    stats: { hp: 5000, atk: 1400, range: 10.0, attackSpeed: 1.5, defense: 160 },
    ability: {
      name: 'Universal Big Bang',
      description: 'Recreates the Big Bang — annihilates EVERYTHING on the map',
      cooldown: 10,
      effectType: 'supernova',
      aoeRadius: 20.0,
      damageMultiplier: 100.0,
    },
    description: 'Astra became the Universal Deity. She contains entire galaxies within her form.',
    deployCost: 1200,
    summonWeight: 0.3,
  },
};

// ===================== BOSS DATA =====================

export interface BossData {
  id: string;
  name: string;
  title: string;
  color: string;
  auraColor: string;
  hp: number;
  atk: number;
  speed: number;
  size: number;
  phase2Threshold: number; // HP percentage for phase 2
  phase2SpeedMultiplier: number;
  phase2AtkMultiplier: number;
  ability: {
    name: string;
    description: string;
    cooldown: number;
    effectType: string;
    aoeRadius: number;
    damage: number;
  };
  rewards: { coins: number; gems: number; shards: number };
  description: string;
}

export const BOSSES: Record<string, BossData> = {
  'goliath-prime': {
    id: 'goliath-prime',
    name: 'Goliath Prime Titan',
    title: 'The Iron Colossus',
    color: '#78716C',
    auraColor: '#A8A29E',
    hp: 50000,
    atk: 500,
    speed: 0.4,
    size: 2.0,
    phase2Threshold: 0.5,
    phase2SpeedMultiplier: 1.5,
    phase2AtkMultiplier: 2.0,
    ability: {
      name: 'Shockwave Slam',
      description: 'Slams the ground causing a massive shockwave that stuns all units in range',
      cooldown: 8,
      effectType: 'explosion',
      aoeRadius: 5.0,
      damage: 800,
    },
    rewards: { coins: 2000, gems: 5, shards: 20 },
    description: 'A giant armored machine. Each step shakes the ground for miles.',
  },

  'nyx-void': {
    id: 'nyx-void',
    name: 'Nyx Void Empress',
    title: 'Queen of the Abyss',
    color: '#1E1B4B',
    auraColor: '#6D28D9',
    hp: 60000,
    atk: 600,
    speed: 0.6,
    size: 1.6,
    phase2Threshold: 0.4,
    phase2SpeedMultiplier: 1.8,
    phase2AtkMultiplier: 2.5,
    ability: {
      name: 'Abyss Storm',
      description: 'Summons a void storm that corrupts and deals continuous dark damage',
      cooldown: 7,
      effectType: 'void',
      aoeRadius: 7.0,
      damage: 1000,
    },
    rewards: { coins: 2500, gems: 7, shards: 30 },
    description: 'Dark energy boss who controls shadows. Her presence drains light from the world.',
  },

  'infernal-rex': {
    id: 'infernal-rex',
    name: 'Infernal Beast King Rex',
    title: 'The Lava Dragon',
    color: '#7F1D1D',
    auraColor: '#EF4444',
    hp: 80000,
    atk: 800,
    speed: 0.5,
    size: 2.5,
    phase2Threshold: 0.3,
    phase2SpeedMultiplier: 2.0,
    phase2AtkMultiplier: 3.0,
    ability: {
      name: 'Volcano Eruption',
      description: 'Triggers a volcanic eruption raining molten rock across the entire battlefield',
      cooldown: 6,
      effectType: 'explosion',
      aoeRadius: 10.0,
      damage: 1500,
    },
    rewards: { coins: 3500, gems: 10, shards: 50 },
    description: 'Lava dragon-like creature. Wherever it walks, the earth melts.',
  },
};

// ===================== GACHA CONFIG =====================

export const GACHA_RATES = {
  common: 0.60,
  rare: 0.25,
  epic: 0.10,
  legendary: 0.05,
};

export const SUMMON_COSTS = {
  coin: { coins: 100, gems: 0 },
  gem: { coins: 0, gems: 10 },
  multi: { coins: 0, gems: 90 }, // 10x pull
};

// Helper: get all units by rarity
export function getUnitsByRarity(rarity: UnitRarity): UnitData[] {
  return Object.values(UNITS).filter(u => u.rarity === rarity);
}

// Helper: perform a gacha pull
export function performSummon(): UnitData {
  const roll = Math.random();
  let rarity: UnitRarity;
  if (roll < GACHA_RATES.legendary) rarity = 'legendary';
  else if (roll < GACHA_RATES.legendary + GACHA_RATES.epic) rarity = 'epic';
  else if (roll < GACHA_RATES.legendary + GACHA_RATES.epic + GACHA_RATES.rare) rarity = 'rare';
  else rarity = 'common';

  const pool = getUnitsByRarity(rarity);
  // Weight-based selection
  const totalWeight = pool.reduce((s, u) => s + u.summonWeight, 0);
  let weightRoll = Math.random() * totalWeight;
  for (const unit of pool) {
    weightRoll -= unit.summonWeight;
    if (weightRoll <= 0) return unit;
  }
  return pool[pool.length - 1];
}

export const RARITY_COLORS = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
};

export const RARITY_GLOW = {
  common: 'shadow-gray-400',
  rare: 'shadow-blue-500',
  epic: 'shadow-purple-500',
  legendary: 'shadow-amber-400',
};
