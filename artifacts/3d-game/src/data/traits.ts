// ============================================================
// TRAITS SYSTEM — Obtainable buffs from challenges and daily rewards
// 15 normal traits + 1 secret (rarest 0.1%)
// ============================================================

export type TraitRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret';

export interface TraitEffect {
  type: 'stat_boost' | 'economy' | 'ability' | 'passive' | 'special';
  target: string;
  value: number;
  description: string;
}

export interface TraitData {
  id: string;
  name: string;
  description: string;
  lore: string;
  icon: string;
  rarity: TraitRarity;
  effect: TraitEffect;
  obtainedFrom: ('daily' | 'challenge' | 'shop')[];
}

export const TRAIT_RARITY_COLORS: Record<TraitRarity, string> = {
  common: '#9CA3AF',
  uncommon: '#22C55E',
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
  mythic: '#EF4444',
  secret: 'rainbow',
};

export const TRAIT_RARITY_WEIGHTS: Record<TraitRarity, number> = {
  common: 0.40,
  uncommon: 0.25,
  rare: 0.20,
  epic: 0.10,
  legendary: 0.04,
  mythic: 0.009,
  secret: 0.001,
};

export const TRAITS: Record<string, TraitData> = {
  // ══════════════════════════════════════════════
  // COMMON (40%)
  // ══════════════════════════════════════════════
  'iron-will': {
    id: 'iron-will',
    name: 'Iron Will',
    description: 'All deployed units gain +10% max HP.',
    lore: 'A warrior\'s unbreakable resolve strengthens the body beyond its natural limits.',
    icon: '🛡️',
    rarity: 'common',
    effect: { type: 'stat_boost', target: 'hp', value: 0.10, description: '+10% HP to all units' },
    obtainedFrom: ['daily', 'challenge'],
  },
  'quick-step': {
    id: 'quick-step',
    name: 'Quick Step',
    description: 'All units gain +8% attack speed.',
    lore: 'The battlefield is won by those who strike first and fastest.',
    icon: '⚡',
    rarity: 'common',
    effect: { type: 'stat_boost', target: 'attackSpeed', value: 0.08, description: '+8% attack speed' },
    obtainedFrom: ['daily', 'challenge'],
  },
  'miser': {
    id: 'miser',
    name: 'Miser',
    description: 'Units cost 10% less gold to deploy.',
    lore: 'A coin saved is a warrior earned.',
    icon: '🪙',
    rarity: 'common',
    effect: { type: 'economy', target: 'deployCost', value: -0.10, description: '-10% deploy cost' },
    obtainedFrom: ['daily', 'challenge'],
  },

  // ══════════════════════════════════════════════
  // UNCOMMON (25%)
  // ══════════════════════════════════════════════
  'coin-collector': {
    id: 'coin-collector',
    name: 'Coin Collector',
    description: 'Earn 15% more gold from defeated enemies.',
    lore: 'Fallen foes leave richer spoils for the experienced hunter.',
    icon: '💰',
    rarity: 'uncommon',
    effect: { type: 'economy', target: 'goldDrop', value: 0.15, description: '+15% gold from kills' },
    obtainedFrom: ['daily', 'challenge'],
  },
  'veteran': {
    id: 'veteran',
    name: 'Veteran',
    description: 'All units start at +1 bonus level, gaining improved stats.',
    lore: 'Seasoned fighters enter battle with hard-won experience.',
    icon: '🎖️',
    rarity: 'uncommon',
    effect: { type: 'stat_boost', target: 'startLevel', value: 1, description: 'Units start +1 level' },
    obtainedFrom: ['daily', 'challenge'],
  },
  'life-tap': {
    id: 'life-tap',
    name: 'Life Tap',
    description: 'Gain +2 extra lives at the start of each run.',
    lore: 'There is always a second chance for those who fight with heart.',
    icon: '❤️',
    rarity: 'uncommon',
    effect: { type: 'passive', target: 'lives', value: 2, description: '+2 starting lives' },
    obtainedFrom: ['daily', 'challenge'],
  },

  // ══════════════════════════════════════════════
  // RARE (20%)
  // ══════════════════════════════════════════════
  'fortified': {
    id: 'fortified',
    name: 'Fortified',
    description: 'All units gain +20% defense, reducing damage taken.',
    lore: 'Ancient wards etched into armor deflect even the mightiest blows.',
    icon: '🏰',
    rarity: 'rare',
    effect: { type: 'stat_boost', target: 'defense', value: 0.20, description: '+20% defense' },
    obtainedFrom: ['daily', 'challenge'],
  },
  'battle-cry': {
    id: 'battle-cry',
    name: 'Battle Cry',
    description: 'Start every wave with 75 bonus gold.',
    lore: 'The rallying cry of a general commands both allies and fortune.',
    icon: '📣',
    rarity: 'rare',
    effect: { type: 'economy', target: 'waveStartGold', value: 75, description: '+75 gold per wave start' },
    obtainedFrom: ['challenge'],
  },
  'swift-strike': {
    id: 'swift-strike',
    name: 'Swift Strike',
    description: 'All units gain +18% attack speed.',
    lore: 'Strike before thought, act before hesitation.',
    icon: '🌪️',
    rarity: 'rare',
    effect: { type: 'stat_boost', target: 'attackSpeed', value: 0.18, description: '+18% attack speed' },
    obtainedFrom: ['challenge'],
  },

  // ══════════════════════════════════════════════
  // EPIC (10%)
  // ══════════════════════════════════════════════
  'arcane-boost': {
    id: 'arcane-boost',
    name: 'Arcane Boost',
    description: 'All unit abilities deal +30% bonus damage.',
    lore: 'Channeling elemental energy through a warrior amplifies their signature technique.',
    icon: '🔮',
    rarity: 'epic',
    effect: { type: 'ability', target: 'abilityDamage', value: 0.30, description: '+30% ability damage' },
    obtainedFrom: ['challenge'],
  },
  'double-down': {
    id: 'double-down',
    name: 'Double Down',
    description: 'Units have 18% chance to strike twice per attack.',
    lore: 'Twin shadows move as one — twice the strikes, twice the carnage.',
    icon: '⚔️',
    rarity: 'epic',
    effect: { type: 'passive', target: 'doubleStrike', value: 0.18, description: '18% double strike chance' },
    obtainedFrom: ['challenge'],
  },

  // ══════════════════════════════════════════════
  // LEGENDARY (4%)
  // ══════════════════════════════════════════════
  'titans-grip': {
    id: 'titans-grip',
    name: "Titan's Grip",
    description: 'Legendary+ rarity units gain +45% attack range.',
    lore: 'The reach of legends extends across the horizon itself.',
    icon: '🌟',
    rarity: 'legendary',
    effect: { type: 'stat_boost', target: 'rangeLegendaryPlus', value: 0.45, description: '+45% range (Legendary+)' },
    obtainedFrom: ['challenge'],
  },
  'bloodlust': {
    id: 'bloodlust',
    name: 'Bloodlust',
    description: 'Units gain stacking +3 ATK per 10 kills (max +60).',
    lore: 'Every slain enemy fuels an insatiable hunger for battle.',
    icon: '🩸',
    rarity: 'legendary',
    effect: { type: 'passive', target: 'killStack', value: 3, description: '+3 ATK per 10 kills (max +60)' },
    obtainedFrom: ['challenge'],
  },

  // ══════════════════════════════════════════════
  // MYTHIC (0.9%)
  // ══════════════════════════════════════════════
  'cosmic-resonance': {
    id: 'cosmic-resonance',
    name: 'Cosmic Resonance',
    description: 'All unit stats increased by +22% across the board.',
    lore: 'The cosmos itself bends to empower those worthy of its resonance.',
    icon: '🌌',
    rarity: 'mythic',
    effect: { type: 'stat_boost', target: 'allStats', value: 0.22, description: '+22% all unit stats' },
    obtainedFrom: ['challenge'],
  },
  'absolute-power': {
    id: 'absolute-power',
    name: 'Absolute Power',
    description: 'All units deal +65% damage during the first 5 waves.',
    lore: 'In the opening moments, the strongest reveal themselves as absolute.',
    icon: '💥',
    rarity: 'mythic',
    effect: { type: 'special', target: 'earlyWaveDamage', value: 0.65, description: '+65% dmg for waves 1–5' },
    obtainedFrom: ['challenge'],
  },

  // ══════════════════════════════════════════════
  // SECRET (0.1%) — RAREST TRAIT
  // ══════════════════════════════════════════════
  'omnipotence': {
    id: 'omnipotence',
    name: 'Omnipotence',
    description: 'All stats +55%. Abilities have no cooldown during Wave 1. Truly the rarest power.',
    lore: 'Beyond godhood. Beyond infinity. A force that was never meant to exist.',
    icon: '👑',
    rarity: 'secret',
    effect: { type: 'special', target: 'omnipotence', value: 0.55, description: '+55% all stats; no ability cooldown Wave 1' },
    obtainedFrom: ['challenge'],
  },
};

// ── Roll a random trait ──────────────────────────────────────
export function rollTrait(guaranteedMinRarity?: TraitRarity): TraitData {
  const rarityOrder: TraitRarity[] = ['secret', 'mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
  const minIndex = guaranteedMinRarity ? rarityOrder.indexOf(guaranteedMinRarity) : rarityOrder.length - 1;

  const eligibleRarities = rarityOrder.slice(0, minIndex + 1);
  const totalWeight = eligibleRarities.reduce((s, r) => s + TRAIT_RARITY_WEIGHTS[r], 0);
  let roll = Math.random() * totalWeight;

  for (const rarity of eligibleRarities) {
    roll -= TRAIT_RARITY_WEIGHTS[rarity];
    if (roll <= 0) {
      const pool = Object.values(TRAITS).filter(t => t.rarity === rarity);
      if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  const commonPool = Object.values(TRAITS).filter(t => t.rarity === 'common');
  return commonPool[Math.floor(Math.random() * commonPool.length)];
}

// Daily reward definitions (7-day cycle)
export interface DailyRewardData {
  day: number;
  coins: number;
  gems: number;
  traitRarity?: TraitRarity;
  label: string;
}

export const DAILY_REWARDS: DailyRewardData[] = [
  { day: 1, coins: 200, gems: 5, label: 'Day 1 Login' },
  { day: 2, coins: 400, gems: 10, traitRarity: 'common', label: 'Day 2 Loyalty' },
  { day: 3, coins: 600, gems: 20, traitRarity: 'uncommon', label: 'Day 3 Devotion' },
  { day: 4, coins: 800, gems: 35, traitRarity: 'rare', label: 'Day 4 Commitment' },
  { day: 5, coins: 1000, gems: 60, traitRarity: 'epic', label: 'Day 5 Dedication' },
  { day: 6, coins: 1500, gems: 100, traitRarity: 'legendary', label: 'Day 6 Mastery' },
  { day: 7, coins: 3000, gems: 200, traitRarity: 'mythic', label: 'Day 7 — GRAND REWARD' },
];
