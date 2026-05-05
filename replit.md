# Anime Tower Defense — Roblox-Style 3D Game

## Overview
A Roblox-inspired 3D anime tower defense game built with React + Vite + React Three Fiber. Players walk around a 3D sci-fi lobby ("Vanguard Hall"), interact with NPCs to summon characters, evolve units, and enter boss raids.

## Architecture

### Stack
- **Frontend**: React 19 + Vite + TypeScript
- **3D Engine**: @react-three/fiber, @react-three/drei, three.js
- **State**: Zustand with persist middleware
- **Styling**: CSS custom properties, Orbitron + Rajdhani fonts

### Project Structure
```
artifacts/3d-game/
├── src/
│   ├── App.tsx                  # Screen router (lobby → summon → inventory → game)
│   ├── index.css                # Full dark anime theme + 3D lobby UI styles
│   ├── data/
│   │   ├── units.ts             # 15 anime chars × 3 stages = 45 units, 5 rarities
│   │   └── enemies.ts           # Enemy waves + boss data
│   ├── store/
│   │   └── gameStore.ts         # Zustand store: profile, collection, live game, summon pity
│   └── components/
│       ├── Lobby3D.tsx          # 3D walkable lobby (Vanguard Hall)
│       ├── Summon.tsx           # Gacha summon screen + reveal animation
│       ├── Inventory.tsx        # Unit collection, equip, upgrade, evolve
│       ├── Shop.tsx             # Daily bonus, coin/gem exchange
│       ├── Modes.tsx            # Story / Infinite / Challenge mode select
│       ├── GameView.tsx         # 3D tower defense battlefield (R3F)
│       └── GameUI.tsx           # In-game HUD overlay
│       └── CharacterModel.tsx    # Shared improved character body (used in reveal canvas)
```

## 3D Lobby — Vanguard Hall
- Full 3D walkable scene (React Three Fiber Canvas)
- **Player**: LeBron James character (Lakers purple #552583 + gold #FDB927), tall humanoid with bald head, beard, walking leg/arm animation driven by movement detection. WASD/Arrow Keys on desktop, virtual joystick on mobile
- **Third-person camera**: Follows player with lerp smoothing
- **Proximity detection**: Walk within 4.5 units of an NPC → [E] Interact button appears

### NPCs & Locations
| NPC | Position | Screen |
|-----|----------|--------|
| Naruto Six Paths (Summon) | North (z=-16) | Summon/Gacha |
| Evolution Dojo | East (x=9, z=-2) | Inventory |
| Raid Tower | West (x=-9, z=-2) | Modes |

### Lobby Visuals (matching reference image)
- Dark sci-fi corridor with angled chevron wall panels
- Purple neon strips along walls (emissive materials)
- Blue glowing floor path strips
- Central purple portal orb at Summon Temple
- Decorative plants in alcoves
- Point lights at 4–7 intensity (much brighter than before), colored purple, blue, gold, red, cyan
- Ambient light increased to 1.1 + hemisphere at 1.3 for bright, readable environment
- Fog pulled back to z=38–70 for better visibility
- Camera angle lowered (player+5.5 height, +9 depth) for closer 3rd-person follow

## Unit Roster (15 Characters × 3 Stages = 45 Total)
### Rarities & Rates
| Rarity | Rate | Characters |
|--------|------|------------|
| Rare (Blue) | 80% | Naruto, Tanjiro, Luffy |
| Epic (Purple) | 15% | Ichigo, Vegeta, Gojo |
| Legendary (Gold) | 4.45% | Sung Jin-Woo, Gilgamesh, Alucard |
| Mythic (Red) | 0.5% | Vasto Lorde Ichigo, Sukuna, Gear 5 Luffy |
| Secret (Rainbow) | 0.05% | Yhwach, Beerus, Sasuke |

### Pity System
- Pity counter tracked per profile (`summonPity`)
- Guaranteed Mythic pull at **250 summons**
- Counter resets on any Mythic or Secret pull

## Gacha / Summon
- 3 pull types: Coin ×1 (100 coins), Gem ×1 (10 gems), Multi ×10 (90 gems)
- Reveal screen with animated card flip, rarity flare stars, aura particles
- Secret pulls trigger rainbow flash effect + special header
- Pity progress tracked in store

## Tower Defense (Game Screen)
- 10×10 grid battlefield, R3F 3D scene
- Serpentine enemy path with 8 waypoints
- Place units on grid (click cell while unit selected)
- Enemies move along path, units auto-attack in range
- Wave scaling: HP × wave × mode multiplier
- Boss waves every 5 waves with Phase 2 transition
- Speed ×1/×2 toggle, pause, gold economy

## Boss Roster
- Kaido the Beast King (wave 5, 12k HP)
- Madara Uchiha (wave 10, 18k HP)
- Doomsday (wave 20, 30k HP)

## Achievement System
- 11 achievements tracked in persisted store: `first-summon`, `multi-summon`, `mythic-pull`, `secret-pull`, `collector-5`, `collector-10`, `wave-5`, `wave-10`, `wave-20`, `first-boss`, `auto-equip`
- Toast notifications slide in from bottom-right when unlocked (`AchievementToast.tsx`)
- `achievements: string[]` persisted to localStorage; `newAchievements: string[]` is transient queue for toasts

## New Features (latest batch)
- **Boss wave cinematic**: 3.5s animated overlay announces boss name/color when a boss wave starts
- **Wave preview panel**: Tap "Wave N" button between waves to see next wave composition (enemy types, counts, boss)
- **Kill counter**: Live 💀 counter in HUD showing kills this wave
- **3× speed toggle**: Speed cycles 1× → 2× → 3× (3× shows red styling)
- **Auto-equip**: New units from summon auto-fill first empty squad slot
- **Improved enemy models**: Each enemy type has a distinct 3D silhouette (grunt/runner/brute/mage-enemy/armored/elite); bosses are full humanoid with shoulder spikes
- **Enemy HP bars**: Per-enemy HP bar floats above each non-boss enemy in 3D
- **Game over screen**: Defeat card shows waves survived, final score, kills; "Play Again" restarts same mode

## Controls
- **Desktop**: WASD / Arrow Keys to move, E to interact
- **Mobile**: Virtual joystick (bottom-left), tap interact button (appears near NPCs)

## Workflows
- `artifacts/3d-game: web` — Vite dev server on port 24982 (previewed at `/`)
