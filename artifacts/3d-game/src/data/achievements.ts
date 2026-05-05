export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  'first-summon': {
    id: 'first-summon',
    title: 'First Steps',
    description: 'Performed your first summon',
    icon: '🎴',
    color: '#60A5FA',
  },
  'multi-summon': {
    id: 'multi-summon',
    title: 'Big Spender',
    description: 'Performed a 10× multi-summon',
    icon: '💎',
    color: '#06B6D4',
  },
  'mythic-pull': {
    id: 'mythic-pull',
    title: 'Mythic Hunter',
    description: 'Pulled a Mythic rarity unit',
    icon: '🔥',
    color: '#F97316',
  },
  'secret-pull': {
    id: 'secret-pull',
    title: 'Secret Keeper',
    description: 'Pulled a Secret rarity unit',
    icon: '🌈',
    color: '#A855F7',
  },
  'collector-5': {
    id: 'collector-5',
    title: 'Collector',
    description: 'Own 5 different units',
    icon: '📦',
    color: '#34D399',
  },
  'collector-10': {
    id: 'collector-10',
    title: 'Master Collector',
    description: 'Own 10 different units',
    icon: '🏆',
    color: '#F59E0B',
  },
  'wave-5': {
    id: 'wave-5',
    title: 'Survivor',
    description: 'Completed Wave 5',
    icon: '⚔️',
    color: '#60A5FA',
  },
  'wave-10': {
    id: 'wave-10',
    title: 'Veteran',
    description: 'Completed Wave 10',
    icon: '🛡️',
    color: '#A855F7',
  },
  'wave-20': {
    id: 'wave-20',
    title: 'War Hero',
    description: 'Completed Wave 20',
    icon: '👑',
    color: '#F59E0B',
  },
  'first-boss': {
    id: 'first-boss',
    title: 'Boss Slayer',
    description: 'Defeated a wave boss',
    icon: '💀',
    color: '#EF4444',
  },
  'auto-equip': {
    id: 'auto-equip',
    title: 'Ready to Fight',
    description: 'Auto-equipped your first unit',
    icon: '⚡',
    color: '#34D399',
  },
};
