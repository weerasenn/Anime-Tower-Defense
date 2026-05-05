// ============================================================
// UNIT & BOSS DATA — Anime Tower Defense
// Anime character roster with rarities: rare → epic → legendary → mythic → secret
// ============================================================

export type UnitRarity = 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret' | 'divine';
export type UnitRole = 'swordsman' | 'tank' | 'fighter' | 'archer' | 'warrior' | 'assassin' | 'support' | 'vanguard' | 'mage' | 'beast';

export interface UnitAbility {
  name: string;
  description: string;
  cooldown: number;
  effectType: 'slash' | 'barrier' | 'dash' | 'explosion' | 'pierce' | 'chain' | 'void' | 'heal' | 'taunt' | 'nova' | 'freeze' | 'supernova';
  aoeRadius?: number;
  damageMultiplier: number;
}

export interface UnitStats {
  hp: number;
  atk: number;
  range: number;
  attackSpeed: number;
  defense: number;
}

export interface UnitData {
  id: string;
  name: string;
  title: string;
  rarity: UnitRarity;
  role: UnitRole;
  color: string;
  auraColor: string;
  trailColor: string;
  stats: UnitStats;
  ability: UnitAbility;
  evolvesTo?: string;
  evolutionMaterials?: number;
  description: string;
  deployCost: number;
  summonWeight: number;
}

export const UNITS: Record<string, UnitData> = {

  // ================================================================
  // RARE — Blue (80%) — 3 characters × 3 stages
  // ================================================================

  // 1. The Orange Outcast — Naruto (base)
  'orange-outcast': {
    id: 'orange-outcast',
    name: 'The Orange Outcast',
    title: 'Knucklehead Ninja',
    rarity: 'rare',
    role: 'fighter',
    color: '#F97316',
    auraColor: '#FBBF24',
    trailColor: '#FED7AA',
    stats: { hp: 700, atk: 90, range: 1.8, attackSpeed: 1.3, defense: 25 },
    ability: { name: 'Shadow Clone Barrage', description: 'Summons shadow clones to blitz all nearby enemies', cooldown: 8, effectType: 'slash', aoeRadius: 2.5, damageMultiplier: 2.8 },
    evolvesTo: 'orange-outcast-2',
    evolutionMaterials: 30,
    description: 'Blue eyes and whiskers on his cheeks. Orange jumpsuit glows. Idle: rocks on heels, punches palm with a smoke puff.',
    deployCost: 100,
    summonWeight: 4,
  },
  'orange-outcast-2': {
    id: 'orange-outcast-2',
    name: 'The Orange Outcast II',
    title: 'Sage of Mount Myōboku',
    rarity: 'rare',
    role: 'fighter',
    color: '#DC2626',
    auraColor: '#F97316',
    trailColor: '#FCA5A5',
    stats: { hp: 1050, atk: 135, range: 2.0, attackSpeed: 1.4, defense: 38 },
    ability: { name: 'Sage Art: Massive Rasengan', description: 'Charges a giant Rasengan that obliterates enemies in a wide cone', cooldown: 9, effectType: 'explosion', aoeRadius: 3.5, damageMultiplier: 3.5 },
    evolvesTo: 'orange-outcast-3',
    evolutionMaterials: 60,
    description: 'Sage Mode: orange pigment around the eyes, toad-like markings. More powerful, calmer demeanor.',
    deployCost: 175,
    summonWeight: 0,
  },
  'orange-outcast-3': {
    id: 'orange-outcast-3',
    name: 'The Orange Outcast III',
    title: 'Baryon Mode',
    rarity: 'rare',
    role: 'fighter',
    color: '#FAFAFA',
    auraColor: '#FBBF24',
    trailColor: '#FEF3C7',
    stats: { hp: 1500, atk: 200, range: 2.2, attackSpeed: 1.6, defense: 55 },
    ability: { name: 'Baryon Burst', description: 'Converts chakra to energy — each hit erodes enemy lifeforce and drains their speed', cooldown: 10, effectType: 'nova', aoeRadius: 4.0, damageMultiplier: 4.5 },
    description: 'White/gold hair, sun-like aura. Body radiates burning golden particles. Fastest form.',
    deployCost: 275,
    summonWeight: 0,
  },

  // 2. The Green Trainee — Tanjiro (base)
  'green-trainee': {
    id: 'green-trainee',
    name: 'The Green Trainee',
    title: 'Pillar of Water',
    rarity: 'rare',
    role: 'swordsman',
    color: '#16A34A',
    auraColor: '#4ADE80',
    trailColor: '#BBF7D0',
    stats: { hp: 650, atk: 85, range: 1.7, attackSpeed: 1.2, defense: 28 },
    ability: { name: 'Total Concentration Breathing', description: 'Unleashes a spinning water-form slash that hits all enemies in arc', cooldown: 7, effectType: 'slash', aoeRadius: 2.0, damageMultiplier: 2.6 },
    evolvesTo: 'green-trainee-2',
    evolutionMaterials: 30,
    description: 'Forehead scar, checkered green-black haori. Idle: deep breathing with steam particles.',
    deployCost: 100,
    summonWeight: 4,
  },
  'green-trainee-2': {
    id: 'green-trainee-2',
    name: 'The Green Trainee II',
    title: 'Constant Breathing Slayer',
    rarity: 'rare',
    role: 'swordsman',
    color: '#15803D',
    auraColor: '#86EFAC',
    trailColor: '#D1FAE5',
    stats: { hp: 975, atk: 128, range: 1.9, attackSpeed: 1.3, defense: 42 },
    ability: { name: 'Hinokami Kagura', description: 'A scorching Sun Breathing dance that burns all enemies touched', cooldown: 9, effectType: 'explosion', aoeRadius: 3.0, damageMultiplier: 3.2 },
    evolvesTo: 'green-trainee-3',
    evolutionMaterials: 60,
    description: 'Eyes shift to reddish demon-slayer mark on cheek. More intense steam aura.',
    deployCost: 175,
    summonWeight: 0,
  },
  'green-trainee-3': {
    id: 'green-trainee-3',
    name: 'The Green Trainee III',
    title: 'Dance of the Fire God',
    rarity: 'rare',
    role: 'swordsman',
    color: '#F59E0B',
    auraColor: '#FDE68A',
    trailColor: '#FEF9C3',
    stats: { hp: 1400, atk: 188, range: 2.1, attackSpeed: 1.5, defense: 60 },
    ability: { name: 'Sun Breathing: Final Form', description: 'Executes all 13 sun breathing forms in a single explosive combo', cooldown: 12, effectType: 'supernova', aoeRadius: 5.0, damageMultiplier: 5.0 },
    description: 'Golden sun aura wraps entire body. Mark fully manifested, red flame haori.',
    deployCost: 275,
    summonWeight: 0,
  },

  // 3. The Rubber Captain — Luffy (base)
  'rubber-captain': {
    id: 'rubber-captain',
    name: 'The Rubber Captain',
    title: 'Captain of the Straw Hats',
    rarity: 'rare',
    role: 'fighter',
    color: '#EF4444',
    auraColor: '#FBBF24',
    trailColor: '#FCA5A5',
    stats: { hp: 750, atk: 95, range: 2.0, attackSpeed: 1.1, defense: 22 },
    ability: { name: 'Gum-Gum Gatling', description: 'Stretches arms to deliver rapid-fire punches across a wide area', cooldown: 7, effectType: 'chain', aoeRadius: 3.0, damageMultiplier: 2.4 },
    evolvesTo: 'rubber-captain-2',
    evolutionMaterials: 30,
    description: 'Straw hat, red vest, big grin. Idle: stretches neck to scan the horizon.',
    deployCost: 100,
    summonWeight: 4,
  },
  'rubber-captain-2': {
    id: 'rubber-captain-2',
    name: 'The Rubber Captain II',
    title: 'Boundman of Gear Fourth',
    rarity: 'rare',
    role: 'fighter',
    color: '#DC2626',
    auraColor: '#F97316',
    trailColor: '#FDBA74',
    stats: { hp: 1100, atk: 140, range: 2.4, attackSpeed: 1.3, defense: 35 },
    ability: { name: 'Kong Gun', description: 'Massive compressed Haki fist that sends enemies flying backward', cooldown: 9, effectType: 'explosion', aoeRadius: 2.5, damageMultiplier: 3.8 },
    evolvesTo: 'rubber-captain-3',
    evolutionMaterials: 60,
    description: 'Inflated muscular body covered in Haki patterns, steam wisping off skin.',
    deployCost: 175,
    summonWeight: 0,
  },
  'rubber-captain-3': {
    id: 'rubber-captain-3',
    name: 'The Rubber Captain III',
    title: 'Sun God Nika — Gear Fifth',
    rarity: 'rare',
    role: 'fighter',
    color: '#FAFAFA',
    auraColor: '#FCD34D',
    trailColor: '#FFFBEB',
    stats: { hp: 1600, atk: 210, range: 2.8, attackSpeed: 1.4, defense: 50 },
    ability: { name: 'Gum-Gum Giant', description: 'Inflates to titan size, slamming the entire field with cartoon-physics chaos', cooldown: 14, effectType: 'supernova', aoeRadius: 6.0, damageMultiplier: 5.5 },
    description: 'White hair, white cloud clothes. Bounces like a rubber ball and grabs air. Grins cartoonishly.',
    deployCost: 275,
    summonWeight: 0,
  },

  // ================================================================
  // EPIC — Purple (15%) — 3 characters × 3 stages
  // ================================================================

  // 4. The Reaper Commander — Ichigo
  'reaper-commander': {
    id: 'reaper-commander',
    name: 'The Reaper Commander',
    title: 'Substitute Soul Reaper',
    rarity: 'epic',
    role: 'vanguard',
    color: '#1E293B',
    auraColor: '#7C3AED',
    trailColor: '#C4B5FD',
    stats: { hp: 1500, atk: 180, range: 2.2, attackSpeed: 1.0, defense: 80 },
    ability: { name: 'Getsuga Tenshō', description: 'Fires a massive crescent of dark Reiatsu that tears through enemy lines', cooldown: 9, effectType: 'slash', aoeRadius: 3.5, damageMultiplier: 3.8 },
    evolvesTo: 'reaper-commander-2',
    evolutionMaterials: 50,
    description: 'Spiky orange hair, massive Zangetsu on his back. Idle: purple Spirit Pressure flickers when touching sword hilt.',
    deployCost: 280,
    summonWeight: 3,
  },
  'reaper-commander-2': {
    id: 'reaper-commander-2',
    name: 'The Reaper Commander II',
    title: 'Tensa Zangetsu — Bankai',
    rarity: 'epic',
    role: 'vanguard',
    color: '#0F172A',
    auraColor: '#4C1D95',
    trailColor: '#7C3AED',
    stats: { hp: 2250, atk: 270, range: 2.5, attackSpeed: 1.2, defense: 120 },
    ability: { name: 'Black Getsuga', description: 'Engulfs sword in pure darkness and fires a black moon arc that detonates on impact', cooldown: 11, effectType: 'void', aoeRadius: 4.5, damageMultiplier: 4.8 },
    evolvesTo: 'reaper-commander-3',
    evolutionMaterials: 80,
    description: 'Thin black blade, long black coat trails. Speed leaves afterimages.',
    deployCost: 450,
    summonWeight: 0,
  },
  'reaper-commander-3': {
    id: 'reaper-commander-3',
    name: 'The Reaper Commander III',
    title: 'True Zangetsu — Final Getsuga',
    rarity: 'epic',
    role: 'vanguard',
    color: '#1C1917',
    auraColor: '#2563EB',
    trailColor: '#93C5FD',
    stats: { hp: 3200, atk: 390, range: 3.0, attackSpeed: 1.4, defense: 170 },
    ability: { name: 'Mugetsu', description: 'Becomes the Getsuga itself — screen-clearing darkness that eliminates everything in range', cooldown: 15, effectType: 'supernova', aoeRadius: 7.0, damageMultiplier: 7.0 },
    description: 'Black spiked hair cascading down. Endless black energy shroud. Eyes glow blue.',
    deployCost: 650,
    summonWeight: 0,
  },

  // 5. The Prideful Warrior — Vegeta
  'prideful-warrior': {
    id: 'prideful-warrior',
    name: 'The Prideful Warrior',
    title: 'Prince of All Saiyans',
    rarity: 'epic',
    role: 'warrior',
    color: '#1D4ED8',
    auraColor: '#C084FC',
    trailColor: '#BFDBFE',
    stats: { hp: 1600, atk: 200, range: 2.0, attackSpeed: 1.1, defense: 90 },
    ability: { name: 'Galick Gun', description: 'Charges and fires a purple energy beam that pierces the entire enemy column', cooldown: 10, effectType: 'pierce', aoeRadius: 2.0, damageMultiplier: 4.0 },
    evolvesTo: 'prideful-warrior-2',
    evolutionMaterials: 50,
    description: 'Scowl, widow\'s peak, blue battle armor. Idle: powers up with crackling purple electricity.',
    deployCost: 300,
    summonWeight: 3,
  },
  'prideful-warrior-2': {
    id: 'prideful-warrior-2',
    name: 'The Prideful Warrior II',
    title: 'Super Saiyan Blue Evolved',
    rarity: 'epic',
    role: 'warrior',
    color: '#2563EB',
    auraColor: '#60A5FA',
    trailColor: '#DBEAFE',
    stats: { hp: 2400, atk: 300, range: 2.2, attackSpeed: 1.3, defense: 135 },
    ability: { name: 'Final Flash', description: 'Outstreches both arms and releases a devastating gold-blue energy wave', cooldown: 12, effectType: 'explosion', aoeRadius: 5.0, damageMultiplier: 5.5 },
    evolvesTo: 'prideful-warrior-3',
    evolutionMaterials: 80,
    description: 'Blue hair, blue divine aura with crackling lightning. Eyes glow blue-white.',
    deployCost: 480,
    summonWeight: 0,
  },
  'prideful-warrior-3': {
    id: 'prideful-warrior-3',
    name: 'The Prideful Warrior III',
    title: 'Ultra Ego — Destroyer\'s Pride',
    rarity: 'epic',
    role: 'warrior',
    color: '#7C3AED',
    auraColor: '#A855F7',
    trailColor: '#DDD6FE',
    stats: { hp: 3400, atk: 440, range: 2.4, attackSpeed: 1.5, defense: 190 },
    ability: { name: 'Hakai Infusion', description: 'Infuses attacks with Destroyer energy — enemies hit take increasing damage the more Vegeta is damaged', cooldown: 13, effectType: 'nova', aoeRadius: 4.0, damageMultiplier: 6.5 },
    description: 'Purple-haired, purple aura. Body crackles with Hakai energy that erases what it touches.',
    deployCost: 700,
    summonWeight: 0,
  },

  // 6. The Blindfolded Sensei — Gojo
  'blindfolded-sensei': {
    id: 'blindfolded-sensei',
    name: 'The Blindfolded Sensei',
    title: 'Strongest Jujutsu Sorcerer',
    rarity: 'epic',
    role: 'mage',
    color: '#F8FAFC',
    auraColor: '#818CF8',
    trailColor: '#E0E7FF',
    stats: { hp: 1400, atk: 220, range: 3.5, attackSpeed: 0.9, defense: 60 },
    ability: { name: 'Hollow Purple', description: 'Merges Infinity techniques into a purple sphere that obliterates all matter in its path', cooldown: 12, effectType: 'void', aoeRadius: 4.0, damageMultiplier: 5.0 },
    evolvesTo: 'blindfolded-sensei-2',
    evolutionMaterials: 50,
    description: 'Blindfold over Six Eyes, white hair, playful smirk. Floats cross-legged with a distortion Hollow orb spinning beside him.',
    deployCost: 320,
    summonWeight: 3,
  },
  'blindfolded-sensei-2': {
    id: 'blindfolded-sensei-2',
    name: 'The Blindfolded Sensei II',
    title: 'Six Eyes Unveiled',
    rarity: 'epic',
    role: 'mage',
    color: '#C7D2FE',
    auraColor: '#6366F1',
    trailColor: '#A5B4FC',
    stats: { hp: 2100, atk: 330, range: 4.0, attackSpeed: 1.1, defense: 90 },
    ability: { name: 'Unlimited Void', description: 'Opens Domain Expansion — enemies are paralyzed by infinite information overload', cooldown: 14, effectType: 'freeze', aoeRadius: 6.0, damageMultiplier: 4.0 },
    evolvesTo: 'blindfolded-sensei-3',
    evolutionMaterials: 80,
    description: 'Blindfold removed, six petal eyes glow blue. Infinity distorts the space around him.',
    deployCost: 520,
    summonWeight: 0,
  },
  'blindfolded-sensei-3': {
    id: 'blindfolded-sensei-3',
    name: 'The Blindfolded Sensei III',
    title: 'Infinity — The Strongest',
    rarity: 'epic',
    role: 'mage',
    color: '#4F46E5',
    auraColor: '#818CF8',
    trailColor: '#C7D2FE',
    stats: { hp: 3000, atk: 480, range: 5.0, attackSpeed: 1.3, defense: 130 },
    ability: { name: 'Blue: Reversal', description: 'Reverses cursed energy to pull and detonate all enemies simultaneously', cooldown: 13, effectType: 'supernova', aoeRadius: 7.0, damageMultiplier: 7.0 },
    description: 'Entire form encased in blue-violet Infinity ring. Every enemy attack is reflected back.',
    deployCost: 750,
    summonWeight: 0,
  },

  // ================================================================
  // LEGENDARY — Gold (4.45%) — 3 characters × 3 stages
  // ================================================================

  // 7. The Arisen King — Sung Jin-Woo
  'arisen-king': {
    id: 'arisen-king',
    name: 'The Arisen King',
    title: 'Shadow Monarch',
    rarity: 'legendary',
    role: 'vanguard',
    color: '#1E3A5F',
    auraColor: '#3B82F6',
    trailColor: '#93C5FD',
    stats: { hp: 3500, atk: 380, range: 2.8, attackSpeed: 1.2, defense: 200 },
    ability: { name: 'Shadow Summon', description: 'Rises shadow soldiers from the ground — each consumes an enemy for 3 seconds', cooldown: 12, effectType: 'void', aoeRadius: 4.0, damageMultiplier: 4.5 },
    evolvesTo: 'arisen-king-2',
    evolutionMaterials: 80,
    description: 'Dark trench coat, glowing blue eyes, shadow soldiers rise from his feet. Idle: soldiers bow continuously.',
    deployCost: 600,
    summonWeight: 2,
  },
  'arisen-king-2': {
    id: 'arisen-king-2',
    name: 'The Arisen King II',
    title: 'Monarch of the Shadow Realm',
    rarity: 'legendary',
    role: 'vanguard',
    color: '#0F172A',
    auraColor: '#1D4ED8',
    trailColor: '#60A5FA',
    stats: { hp: 5200, atk: 570, range: 3.2, attackSpeed: 1.4, defense: 300 },
    ability: { name: 'Ruler\'s Authority', description: 'Commands all summoned shadows to mass attack — multiplied force devastates groups', cooldown: 14, effectType: 'chain', aoeRadius: 6.0, damageMultiplier: 6.0 },
    evolvesTo: 'arisen-king-3',
    evolutionMaterials: 120,
    description: 'Ethereal black armor forms over the trench coat. Shadow army expands behind him.',
    deployCost: 950,
    summonWeight: 0,
  },
  'arisen-king-3': {
    id: 'arisen-king-3',
    name: 'The Arisen King III',
    title: 'Absolute Shadow — Dragon of Kamish',
    rarity: 'legendary',
    role: 'vanguard',
    color: '#172554',
    auraColor: '#2563EB',
    trailColor: '#BFDBFE',
    stats: { hp: 7500, atk: 820, range: 3.5, attackSpeed: 1.6, defense: 440 },
    ability: { name: 'Dragon\'s Breath of Kamish', description: 'Kamish the Shadow Dragon breathes annihilating frost that freezes all enemies in range', cooldown: 16, effectType: 'freeze', aoeRadius: 8.0, damageMultiplier: 9.0 },
    description: 'Giant shadow dragon coils behind him. Eyes burn white. Ground turns to void wherever he stands.',
    deployCost: 1400,
    summonWeight: 0,
  },

  // 8. The Golden Tyrant — Gilgamesh
  'golden-tyrant': {
    id: 'golden-tyrant',
    name: 'The Golden Tyrant',
    title: 'King of Heroes',
    rarity: 'legendary',
    role: 'archer',
    color: '#B45309',
    auraColor: '#F59E0B',
    trailColor: '#FDE68A',
    stats: { hp: 3200, atk: 420, range: 4.5, attackSpeed: 1.0, defense: 180 },
    ability: { name: 'Gate of Babylon', description: 'Opens golden ripple portals that fire unlimited Noble Phantasms at all enemies', cooldown: 10, effectType: 'pierce', aoeRadius: 5.0, damageMultiplier: 5.5 },
    evolvesTo: 'golden-tyrant-2',
    evolutionMaterials: 80,
    description: 'Gold reflective armor, crimson eyes. Idle: golden ripple portals open and close behind him.',
    deployCost: 650,
    summonWeight: 2,
  },
  'golden-tyrant-2': {
    id: 'golden-tyrant-2',
    name: 'The Golden Tyrant II',
    title: 'The Invincible King — Enuma Elish',
    rarity: 'legendary',
    role: 'archer',
    color: '#92400E',
    auraColor: '#D97706',
    trailColor: '#FCD34D',
    stats: { hp: 4800, atk: 630, range: 5.0, attackSpeed: 1.2, defense: 270 },
    ability: { name: 'Ea — Sword of Rupture', description: 'EA twists space-time, creating a vortex that pulls and destroys all in the field', cooldown: 13, effectType: 'supernova', aoeRadius: 7.0, damageMultiplier: 7.5 },
    evolvesTo: 'golden-tyrant-3',
    evolutionMaterials: 120,
    description: 'Additional armor plates materialize from portals. EA sword radiates space-time distortion.',
    deployCost: 1000,
    summonWeight: 0,
  },
  'golden-tyrant-3': {
    id: 'golden-tyrant-3',
    name: 'The Golden Tyrant III',
    title: 'Gilgamesh Ascended — True King',
    rarity: 'legendary',
    role: 'archer',
    color: '#78350F',
    auraColor: '#FBBF24',
    trailColor: '#FEF3C7',
    stats: { hp: 6800, atk: 900, range: 5.5, attackSpeed: 1.4, defense: 380 },
    ability: { name: 'Enuma Elish — True Form', description: 'The full power of the King of Heroes rends the world — complete obliteration', cooldown: 18, effectType: 'supernova', aoeRadius: 10.0, damageMultiplier: 12.0 },
    description: 'Bathed entirely in golden light. Hundreds of portals form a crown around him.',
    deployCost: 1600,
    summonWeight: 0,
  },

  // 9. The Crimson Alchemist — Alucard
  'crimson-alchemist': {
    id: 'crimson-alchemist',
    name: 'The Crimson Alchemist',
    title: 'No-Life King — Level 0',
    rarity: 'legendary',
    role: 'assassin',
    color: '#DC2626',
    auraColor: '#991B1B',
    trailColor: '#FCA5A5',
    stats: { hp: 4000, atk: 350, range: 3.0, attackSpeed: 1.5, defense: 150 },
    ability: { name: 'Cromwell Invocation', description: 'Dissolves into a flood of shadows and eyes, reforming through all enemies dealing massive damage', cooldown: 11, effectType: 'void', aoeRadius: 5.0, damageMultiplier: 5.0 },
    evolvesTo: 'crimson-alchemist-2',
    evolutionMaterials: 80,
    description: 'Red coat and hat, orange glasses, terrifying grin. Idle: dissolves into shadow-eyes and reforms.',
    deployCost: 700,
    summonWeight: 2,
  },
  'crimson-alchemist-2': {
    id: 'crimson-alchemist-2',
    name: 'The Crimson Alchemist II',
    title: 'Schrödinger — The Undying',
    rarity: 'legendary',
    role: 'assassin',
    color: '#B91C1C',
    auraColor: '#EF4444',
    trailColor: '#FECACA',
    stats: { hp: 6000, atk: 525, range: 3.5, attackSpeed: 1.7, defense: 225 },
    ability: { name: 'Hell Fire Shot', description: 'Fires silver hellfire bullets from his guns that each split into 12 on impact', cooldown: 12, effectType: 'explosion', aoeRadius: 4.0, damageMultiplier: 6.5 },
    evolvesTo: 'crimson-alchemist-3',
    evolutionMaterials: 120,
    description: 'Shadow flood leaks continuously from his coat. Third eye opens on forehead.',
    deployCost: 1100,
    summonWeight: 0,
  },
  'crimson-alchemist-3': {
    id: 'crimson-alchemist-3',
    name: 'The Crimson Alchemist III',
    title: 'True Nosferatu — Absolute Void',
    rarity: 'legendary',
    role: 'assassin',
    color: '#450A0A',
    auraColor: '#DC2626',
    trailColor: '#FECACA',
    stats: { hp: 8500, atk: 760, range: 4.0, attackSpeed: 2.0, defense: 320 },
    ability: { name: 'Level Zero — Release', description: 'Releases all 3 million absorbed souls as an apocalyptic crimson wave', cooldown: 18, effectType: 'supernova', aoeRadius: 12.0, damageMultiplier: 14.0 },
    description: 'Entire body is a void of eyes and shadows. The ground cracks under infinite accumulated power.',
    deployCost: 1800,
    summonWeight: 0,
  },

  // ================================================================
  // MYTHIC — Red (0.5%) — 3 characters × 3 stages
  // ================================================================

  // 10. The Hollow Mask — Vasto Lorde Ichigo
  'hollow-mask': {
    id: 'hollow-mask',
    name: 'The Hollow Mask',
    title: 'Vasto Lorde — True Hollow',
    rarity: 'mythic',
    role: 'vanguard',
    color: '#0F172A',
    auraColor: '#EF4444',
    trailColor: '#FECACA',
    stats: { hp: 9000, atk: 750, range: 3.5, attackSpeed: 1.8, defense: 400 },
    ability: { name: 'Cero Oscuras', description: 'Fires an enormous black-red Cero that erases enemy HP bars on contact', cooldown: 10, effectType: 'void', aoeRadius: 5.0, damageMultiplier: 7.0 },
    evolvesTo: 'hollow-mask-2',
    evolutionMaterials: 120,
    description: 'Bone mask with horns, hole in chest. Idle: hunches over, releases red shockwave with screen shake.',
    deployCost: 1200,
    summonWeight: 1,
  },
  'hollow-mask-2': {
    id: 'hollow-mask-2',
    name: 'The Hollow Mask II',
    title: 'Horn Removal — Full Release',
    rarity: 'mythic',
    role: 'vanguard',
    color: '#450A0A',
    auraColor: '#F87171',
    trailColor: '#FEE2E2',
    stats: { hp: 13500, atk: 1125, range: 4.0, attackSpeed: 2.0, defense: 600 },
    ability: { name: 'Gran Rey Cero: Metralleta', description: 'Fires a barrage of Gran Rey Ceros that carpet-bomb the entire field', cooldown: 13, effectType: 'explosion', aoeRadius: 8.0, damageMultiplier: 10.0 },
    evolvesTo: 'hollow-mask-3',
    evolutionMaterials: 180,
    description: 'Horns removed, full body Hollow form. Pressure cracks the ground around his feet.',
    deployCost: 1900,
    summonWeight: 0,
  },
  'hollow-mask-3': {
    id: 'hollow-mask-3',
    name: 'The Hollow Mask III',
    title: 'Merged Hollow — Perfect Form',
    rarity: 'mythic',
    role: 'vanguard',
    color: '#1C1917',
    auraColor: '#DC2626',
    trailColor: '#FECACA',
    stats: { hp: 20000, atk: 1620, range: 4.5, attackSpeed: 2.2, defense: 860 },
    ability: { name: 'Final Getsuga Oscuras', description: 'Merges the Final Getsuga and Cero Oscuras — screen-destroying dual-energy annihilation', cooldown: 18, effectType: 'supernova', aoeRadius: 14.0, damageMultiplier: 18.0 },
    description: 'Absolute void entity. Dual Hollow-Shinigami energy tears space itself.',
    deployCost: 2800,
    summonWeight: 0,
  },

  // 11. The God of Curses — Sukuna
  'god-of-curses': {
    id: 'god-of-curses',
    name: 'The God of Curses',
    title: 'King of Curses — Four Eyes',
    rarity: 'mythic',
    role: 'warrior',
    color: '#831843',
    auraColor: '#F43F5E',
    trailColor: '#FFE4E6',
    stats: { hp: 10000, atk: 820, range: 3.2, attackSpeed: 1.6, defense: 380 },
    ability: { name: 'Malevolent Shrine', description: 'Opens Domain Expansion — slash attacks multiply infinitely within the domain', cooldown: 14, effectType: 'slash', aoeRadius: 6.0, damageMultiplier: 8.0 },
    evolvesTo: 'god-of-curses-2',
    evolutionMaterials: 120,
    description: 'Four eyes, tattoos covering his body, pink kimono. Sits on a Throne of Skulls with red Domain aura.',
    deployCost: 1400,
    summonWeight: 1,
  },
  'god-of-curses-2': {
    id: 'god-of-curses-2',
    name: 'The God of Curses II',
    title: 'Sukuna — 15 Fingers',
    rarity: 'mythic',
    role: 'warrior',
    color: '#9F1239',
    auraColor: '#FB7185',
    trailColor: '#FECDD3',
    stats: { hp: 15000, atk: 1230, range: 3.8, attackSpeed: 1.8, defense: 570 },
    ability: { name: 'Cleave — World Slash', description: 'A single transcendental slash that divides the battlefield in two', cooldown: 15, effectType: 'pierce', aoeRadius: 5.0, damageMultiplier: 12.0 },
    evolvesTo: 'god-of-curses-3',
    evolutionMaterials: 180,
    description: 'Extra pair of arms manifest. Throne of Skulls levitates. Tattoos glow red.',
    deployCost: 2200,
    summonWeight: 0,
  },
  'god-of-curses-3': {
    id: 'god-of-curses-3',
    name: 'The God of Curses III',
    title: 'Ryomen Sukuna — True God Form',
    rarity: 'mythic',
    role: 'warrior',
    color: '#4C0519',
    auraColor: '#E11D48',
    trailColor: '#FFE4E6',
    stats: { hp: 22000, atk: 1780, range: 4.2, attackSpeed: 2.0, defense: 820 },
    ability: { name: 'Malevolent Shrine — Infinite', description: 'Permanent Domain — the entire battlefield becomes Sukuna\'s domain of infinite slashes', cooldown: 20, effectType: 'supernova', aoeRadius: 16.0, damageMultiplier: 22.0 },
    description: 'Full four-armed ancient demon god form. The world cracks under his gaze.',
    deployCost: 3200,
    summonWeight: 0,
  },

  // 12. The Solar Warrior — Gear 5 Luffy (mythic version)
  'solar-warrior': {
    id: 'solar-warrior',
    name: 'The Solar Warrior',
    title: 'Warrior of Liberation',
    rarity: 'mythic',
    role: 'fighter',
    color: '#FAFAFA',
    auraColor: '#FCD34D',
    trailColor: '#FFFBEB',
    stats: { hp: 8500, atk: 780, range: 3.8, attackSpeed: 2.0, defense: 300 },
    ability: { name: 'Giant Gum-Gum Smash', description: 'Expands to titan size and slams the entire map with cartoon-devastating fists', cooldown: 12, effectType: 'explosion', aoeRadius: 7.0, damageMultiplier: 8.0 },
    evolvesTo: 'solar-warrior-2',
    evolutionMaterials: 120,
    description: 'White hair and cloud-matter clothes, glowing white. Bounces like a rubber ball, grabs at the air playfully.',
    deployCost: 1300,
    summonWeight: 1,
  },
  'solar-warrior-2': {
    id: 'solar-warrior-2',
    name: 'The Solar Warrior II',
    title: 'Sun God Nika — Liberation',
    rarity: 'mythic',
    role: 'fighter',
    color: '#FEF3C7',
    auraColor: '#F59E0B',
    trailColor: '#FFFBEB',
    stats: { hp: 12750, atk: 1170, range: 4.5, attackSpeed: 2.2, defense: 450 },
    ability: { name: 'Drums of Liberation', description: 'Heartbeat shockwaves propagate across the entire field, bouncing enemies like rubber', cooldown: 14, effectType: 'chain', aoeRadius: 9.0, damageMultiplier: 11.0 },
    evolvesTo: 'solar-warrior-3',
    evolutionMaterials: 180,
    description: 'Body radiates sunlight. Cloud matter grows around him. Ground bounces like rubber.',
    deployCost: 2000,
    summonWeight: 0,
  },
  'solar-warrior-3': {
    id: 'solar-warrior-3',
    name: 'The Solar Warrior III',
    title: 'True Nika — Will of the Sun',
    rarity: 'mythic',
    role: 'fighter',
    color: '#FFF7ED',
    auraColor: '#FBBF24',
    trailColor: '#FFFBEB',
    stats: { hp: 18500, atk: 1690, range: 5.0, attackSpeed: 2.5, defense: 650 },
    ability: { name: 'Sun God: Final Liberation', description: 'The sun itself descends — total joy, total destruction, total freedom for all allies', cooldown: 20, effectType: 'supernova', aoeRadius: 18.0, damageMultiplier: 20.0 },
    description: 'The embodiment of the Sun God. Reality itself becomes flexible. Pure joy given form.',
    deployCost: 3000,
    summonWeight: 0,
  },

  // ================================================================
  // SECRET — Rainbow (0.05%) — 3 characters × 3 stages
  // ================================================================

  // 13. The Almighty Father — Yhwach
  'almighty-father': {
    id: 'almighty-father',
    name: 'The Almighty Father',
    title: 'The Almighty — Wandenreich Emperor',
    rarity: 'secret',
    role: 'mage',
    color: '#F8FAFC',
    auraColor: '#7C3AED',
    trailColor: '#C4B5FD',
    stats: { hp: 25000, atk: 2000, range: 5.5, attackSpeed: 1.2, defense: 800 },
    ability: { name: 'The Almighty — Future Sight', description: 'Sees and rewrites the future — inverts screen colors; all enemy attacks miss for 5 seconds', cooldown: 16, effectType: 'void', aoeRadius: 8.0, damageMultiplier: 10.0 },
    evolvesTo: 'almighty-father-2',
    evolutionMaterials: 200,
    description: 'White double-breasted trench coat, black cloak with nebula interior. Multi-pupil Almighty eyes. Sits on a Reishi Throne. Voice: "Everything in this world exists for my sake."',
    deployCost: 2800,
    summonWeight: 1,
  },
  'almighty-father-2': {
    id: 'almighty-father-2',
    name: 'The Almighty Father II',
    title: 'The Almighty Absorbed — World Rewritten',
    rarity: 'secret',
    role: 'mage',
    color: '#1E1B4B',
    auraColor: '#A78BFA',
    trailColor: '#DDD6FE',
    stats: { hp: 37500, atk: 3000, range: 6.5, attackSpeed: 1.4, defense: 1200 },
    ability: { name: 'Quincy: Vollständig — Auswhählen', description: 'Absorbs the power of all Sternritter — mass healing and damage that hits all enemies simultaneously', cooldown: 18, effectType: 'supernova', aoeRadius: 12.0, damageMultiplier: 14.0 },
    evolvesTo: 'almighty-father-3',
    evolutionMaterials: 300,
    description: 'Dark Vollständig wings of shadow span the field. Pupils multiply across his entire body.',
    deployCost: 4200,
    summonWeight: 0,
  },
  'almighty-father-3': {
    id: 'almighty-father-3',
    name: 'The Almighty Father III',
    title: 'A World Without Death — Eternal Yhwach',
    rarity: 'secret',
    role: 'mage',
    color: '#F5F3FF',
    auraColor: '#7C3AED',
    trailColor: '#EDE9FE',
    stats: { hp: 55000, atk: 4300, range: 8.0, attackSpeed: 1.6, defense: 1750 },
    ability: { name: 'Almighty Perfection — Death Rewrite', description: 'Rewrites death itself — fallen units revive at full HP, all enemies permanently weakened', cooldown: 25, effectType: 'heal', aoeRadius: 20.0, damageMultiplier: 20.0 },
    description: 'Existence itself bends to him. The field becomes his domain — his throne, his world.',
    deployCost: 6000,
    summonWeight: 0,
  },

  // 14. The Universe Destroyer — Beerus
  'universe-destroyer': {
    id: 'universe-destroyer',
    name: 'The Universe Destroyer',
    title: 'God of Destruction — Universe 7',
    rarity: 'secret',
    role: 'tank',
    color: '#7C3AED',
    auraColor: '#4C1D95',
    trailColor: '#DDD6FE',
    stats: { hp: 28000, atk: 1800, range: 4.5, attackSpeed: 1.5, defense: 1000 },
    ability: { name: 'Hakai — Obliteration', description: 'Hakai orb taps the floor grid — erases a section of the field and every enemy on it', cooldown: 13, effectType: 'void', aoeRadius: 6.0, damageMultiplier: 12.0 },
    evolvesTo: 'universe-destroyer-2',
    evolutionMaterials: 200,
    description: 'Purple cat with Egyptian collar, sleepy-dangerous expression. Idle: taps Hakai orb that erases the floor grid beneath it.',
    deployCost: 3000,
    summonWeight: 1,
  },
  'universe-destroyer-2': {
    id: 'universe-destroyer-2',
    name: 'The Universe Destroyer II',
    title: 'Beerus Awakened — Destruction Perfected',
    rarity: 'secret',
    role: 'tank',
    color: '#6D28D9',
    auraColor: '#8B5CF6',
    trailColor: '#EDE9FE',
    stats: { hp: 42000, atk: 2700, range: 5.5, attackSpeed: 1.7, defense: 1500 },
    ability: { name: 'Sphere of Destruction', description: 'Creates a miniature universe-destroying orb that expands and swallows the entire field', cooldown: 16, effectType: 'supernova', aoeRadius: 14.0, damageMultiplier: 16.0 },
    evolvesTo: 'universe-destroyer-3',
    evolutionMaterials: 300,
    description: 'Divine purple aura fully manifested. Egyptian regalia glows. Stars orbit his body.',
    deployCost: 4500,
    summonWeight: 0,
  },
  'universe-destroyer-3': {
    id: 'universe-destroyer-3',
    name: 'The Universe Destroyer III',
    title: 'True God of Destruction — Beerus Perfection',
    rarity: 'secret',
    role: 'tank',
    color: '#4C1D95',
    auraColor: '#A855F7',
    trailColor: '#F5F3FF',
    stats: { hp: 62000, atk: 3900, range: 7.0, attackSpeed: 2.0, defense: 2200 },
    ability: { name: 'Universal Hakai — Final', description: 'Destroys the concept of HP from all enemies — pure annihilation of existence', cooldown: 25, effectType: 'supernova', aoeRadius: 22.0, damageMultiplier: 25.0 },
    description: 'The fabric of reality warps around him. A universe collapses in miniature behind his throne.',
    deployCost: 6500,
    summonWeight: 0,
  },

  // 15. The Infinite Rival — Sasuke
  'infinite-rival': {
    id: 'infinite-rival',
    name: 'The Infinite Rival',
    title: 'Last Uchiha — Shadow Hokage',
    rarity: 'secret',
    role: 'assassin',
    color: '#1E293B',
    auraColor: '#7C3AED',
    trailColor: '#EDE9FE',
    stats: { hp: 22000, atk: 2200, range: 4.8, attackSpeed: 1.8, defense: 700 },
    ability: { name: 'Chidori Senbon', description: 'Fires thousands of lightning needles across the field from within the Susanoo ribcage', cooldown: 11, effectType: 'pierce', aoeRadius: 6.0, damageMultiplier: 9.0 },
    evolvesTo: 'infinite-rival-2',
    evolutionMaterials: 200,
    description: 'Rinnegan eye glowing purple, Susanoo ribcage protects him. Cold, focused expression.',
    deployCost: 2600,
    summonWeight: 1,
  },
  'infinite-rival-2': {
    id: 'infinite-rival-2',
    name: 'The Infinite Rival II',
    title: 'Perfect Susanoo — Eternal Mangekyō',
    rarity: 'secret',
    role: 'assassin',
    color: '#312E81',
    auraColor: '#6366F1',
    trailColor: '#C7D2FE',
    stats: { hp: 33000, atk: 3300, range: 5.8, attackSpeed: 2.0, defense: 1050 },
    ability: { name: 'Amaterasu: Flame Control', description: 'Black undying flames spread across the entire path, burning all enemies continuously', cooldown: 14, effectType: 'explosion', aoeRadius: 9.0, damageMultiplier: 13.0 },
    evolvesTo: 'infinite-rival-3',
    evolutionMaterials: 300,
    description: 'Full Perfect Susanoo armored samurai form towers over the field. Rinnegan grants 360° vision.',
    deployCost: 3900,
    summonWeight: 0,
  },
  'infinite-rival-3': {
    id: 'infinite-rival-3',
    name: 'The Infinite Rival III',
    title: 'Indra\'s Arrow — Universe-Shaker',
    rarity: 'secret',
    role: 'assassin',
    color: '#1E1B4B',
    auraColor: '#818CF8',
    trailColor: '#E0E7FF',
    stats: { hp: 48000, atk: 4700, range: 7.5, attackSpeed: 2.2, defense: 1520 },
    ability: { name: 'Indra\'s Arrow', description: 'Charges all bijuu chakra into a single transcendent arrow that one-shots boss enemies', cooldown: 25, effectType: 'supernova', aoeRadius: 20.0, damageMultiplier: 28.0 },
    description: 'Susanoo becomes a vessel containing all nine bijuu. The arrow rivals the Juubi in power.',
    deployCost: 5800,
    summonWeight: 0,
  },
};

// ================================================================
// BOSS DATA
// ================================================================
export interface BossData {
  id: string;
  name: string;
  title: string;
  color: string;
  auraColor: string;
  phases: number;
  phase2Threshold: number;
  hp: number;
  speed: number;
  size: number;
  rewards: { coins: number; gems: number };
}

// ================================================================
// DIVINE RARITY — Yuhabana (0.01%) — Transcendent-tier
// ================================================================
// Yuhabana is added to the summoning pool but at an astronomically
// low weight so players feel the thrill of an impossible pull.

// ── Yuhabana is added inline to UNITS above this block ──
// (Defined here to keep divine units separate from the main roster)

export const DIVINE_UNITS: Record<string, UnitData> = {
  'yuhabana': {
    id: 'yuhabana',
    name: 'Yuhabana',
    title: 'The Absolute Void — Divine Incarnate',
    rarity: 'divine',
    role: 'vanguard',
    color: '#FFD700',
    auraColor: '#FFFFFF',
    trailColor: '#FFD700',
    stats: { hp: 99999, atk: 9999, range: 6.0, attackSpeed: 2.5, defense: 999 },
    ability: {
      name: 'Divine Erasure',
      description: 'Calls down a pillar of divine light, instantly erasing ALL enemies from existence. Resets after boss kill.',
      cooldown: 45,
      effectType: 'supernova',
      aoeRadius: 12,
      damageMultiplier: 500,
    },
    description: 'A transcendent being who exists beyond all known power systems. Its very presence causes reality to tremble. The only DIVINE-rarity unit in the entire game.',
    deployCost: 9999,
    summonWeight: 0.1,
  },
};

export const BOSSES: Record<string, BossData> = {
  'boss-orochi': {
    id: 'boss-orochi',
    name: 'Kaido the Beast King',
    title: 'Strongest Creature',
    color: '#4C1D95',
    auraColor: '#7C3AED',
    phases: 2,
    phase2Threshold: 0.5,
    hp: 12000,
    speed: 0.6,
    size: 2.2,
    rewards: { coins: 800, gems: 5 },
  },
  'boss-madara': {
    id: 'boss-madara',
    name: 'Madara Uchiha',
    title: 'Sage of Six Paths Reborn',
    color: '#0F172A',
    auraColor: '#EF4444',
    phases: 2,
    phase2Threshold: 0.4,
    hp: 18000,
    speed: 0.5,
    size: 2.0,
    rewards: { coins: 1200, gems: 8 },
  },
  'boss-doomsday': {
    id: 'boss-doomsday',
    name: 'Doomsday — The Infinite',
    title: 'Galaxy-Eater',
    color: '#1C1917',
    auraColor: '#F59E0B',
    phases: 2,
    phase2Threshold: 0.3,
    hp: 30000,
    speed: 0.4,
    size: 2.8,
    rewards: { coins: 2000, gems: 15 },
  },
};

// ================================================================
// GACHA CONFIG
// ================================================================
export const GACHA_RATES = {
  rare: 0.7949,
  epic: 0.15,
  legendary: 0.0445,
  mythic: 0.005,
  secret: 0.0005,
  divine: 0.0001,
};

export const SUMMON_COSTS = {
  coin: { coins: 100, gems: 0 },
  gem: { coins: 0, gems: 10 },
  multi: { coins: 0, gems: 90 },
};

export const RARITY_COLORS: Record<string, string> = {
  rare: '#3B82F6',
  epic: '#A855F7',
  legendary: '#F59E0B',
  mythic: '#EF4444',
  secret: '#E879F9',
  divine: '#FFD700',
};

export const RARITY_GLOW: Record<string, string> = {
  rare: '#3B82F644',
  epic: '#A855F744',
  legendary: '#F59E0B44',
  mythic: '#EF444444',
  secret: '#E879F944',
  divine: '#FFD70066',
};

// Helper: get all base units by rarity (no evolutions)
export function getBaseUnitsByRarity(rarity: UnitRarity): UnitData[] {
  return Object.values(UNITS).filter(u => u.rarity === rarity && u.summonWeight > 0);
}

// Helper: get all units including divine
export function getAllBaseUnits(): UnitData[] {
  const normal = Object.values(UNITS).filter(u => u.summonWeight > 0 && !u.evolvesTo?.startsWith('evo') && u.id.split('-').length <= 2);
  const divine = Object.values(DIVINE_UNITS).filter(u => u.summonWeight > 0);
  // Actually, filter by not having a number suffix (no stage 2/3)
  const baseNormal = Object.values(UNITS).filter(u => u.summonWeight > 0 && !u.id.endsWith('-2') && !u.id.endsWith('-3'));
  return [...baseNormal, ...divine];
}

// Helper: perform a gacha pull (returns a UnitData)
export function performSummon(forceMythic = false): UnitData {
  let rarity: UnitRarity;

  if (forceMythic) {
    rarity = 'mythic';
  } else {
    const roll = Math.random();
    const { rare, epic, legendary, mythic, secret, divine } = GACHA_RATES;
    if (roll < divine) rarity = 'divine';
    else if (roll < divine + secret) rarity = 'secret';
    else if (roll < divine + secret + mythic) rarity = 'mythic';
    else if (roll < divine + secret + mythic + legendary) rarity = 'legendary';
    else if (roll < divine + secret + mythic + legendary + epic) rarity = 'epic';
    else rarity = 'rare';
  }

  // Check divine pool first
  if (rarity === 'divine') {
    const divinePool = Object.values(DIVINE_UNITS);
    if (divinePool.length > 0) return divinePool[Math.floor(Math.random() * divinePool.length)];
  }

  const pool = getBaseUnitsByRarity(rarity);
  if (pool.length === 0) {
    const fallback = getBaseUnitsByRarity('rare');
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  const totalWeight = pool.reduce((s, u) => s + u.summonWeight, 0);
  let w = Math.random() * totalWeight;
  for (const unit of pool) {
    w -= unit.summonWeight;
    if (w <= 0) return unit;
  }
  return pool[pool.length - 1];
}
