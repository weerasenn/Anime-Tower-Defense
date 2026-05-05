# Anime Tower Defense — Roblox-Style 3D Game

## Run & Operate
- `pnpm --filter @workspace/3d-game run dev` — Vite dev server (workflow: `artifacts/3d-game: web`)
- `pnpm --filter @workspace/3d-game run typecheck` — TypeScript check (no errors)
- No env vars required for the game itself. `SESSION_SECRET` exists for the API server.

## Stack
- **Frontend**: React 19 + Vite 7 + TypeScript
- **3D Engine**: @react-three/fiber, @react-three/drei, three.js
- **State**: Zustand with `persist` middleware (localStorage key: `anime-td-save`)
- **Styling**: CSS custom properties in `index.css` (~2400 lines), Orbitron + Rajdhani fonts

## Where Things Live
```
artifacts/3d-game/src/
├── App.tsx              # Screen router (9 screens total)
├── index.css            # Full dark anime theme + all feature CSS
├── data/
│   ├── units.ts         # 15 chars × 3 stages + Yuhabana divine; GACHA_RATES; performSummon
│   ├── enemies.ts       # Enemy wave data + boss definitions
│   └── traits.ts        # 16 traits across 7 rarities; DAILY_REWARDS calendar; rollTrait
├── store/
│   └── gameStore.ts     # Zustand store — profile, collection, game, traits, daily, pity
└── components/
    ├── Lobby3D.tsx      # 3D walkable lobby (Vanguard Hall) + basketball + area modal
    ├── Summon.tsx       # Gacha summon + card reveal animation
    ├── Inventory.tsx    # Unit collection, equip, upgrade, evolve
    ├── Shop.tsx         # Free bundle, daily rewards link, gem/coin packs
    ├── Modes.tsx        # Story / Infinite / Challenge mode select
    ├── GameView.tsx     # 3D tower defense battlefield (R3F) + camera toggle
    ├── GameUI.tsx       # In-game HUD overlay
    ├── Traits.tsx       # Trait glossary + equip/unequip (3 active slots)
    ├── DailyRewards.tsx # 7-day calendar reward system
    ├── AchievementToast.tsx  # Toast notification for achievements
    └── CharacterModel.tsx    # Shared 3D character body
```

## Architecture Decisions
- **No solid ceiling** in Lobby3D — removed the y=7.5 blocking mesh; neon strips are decorative at y=13 to prevent vision-blocking near NPCs.
- **Zustand persist is partial** — only persists profile, ownedUnits, equippedUnitIds, achievements, traits, dailyRewardDay, lastDailyRewardClaim, freeBundleClaimed. Live game state is transient.
- **Divine rarity** is separate from UNITS pool — lives in `DIVINE_UNITS` dict in units.ts; performSummon checks it first before the base pool.
- **Camera toggle** in GameView uses a `topDown: boolean` prop fed down into CameraSetup. Top-down sets position to (0,18,0.01) looking at origin.
- **Traits are additive buffs** — stored as `ownedTraits: string[]` and `activeTraits: string[]` (max 3 active). Effects are descriptive for now; hook into game logic in future.

## Product
- **Lobby**: Walk 3D Vanguard Hall as LeBron James (basketball physics). Press WASD/joystick, E to interact with NPCs. HUD shows squad, currencies, Traits, Daily, Areas (M key) buttons.
- **Summon**: Gacha with pity, rainbow secret flash, divine pull possibility (0.01%), card flip reveal
- **Inventory**: Collect/upgrade/evolve 45 units across 6 rarities (Common → Divine)
- **Tower Defense**: 10×10 grid, serpentine path, boss waves, camera toggle (3rd-person ↔ top-down)
- **Traits**: 16 traits across 7 rarities; 3 active slots; obtained from daily rewards + challenge mode
- **Daily Rewards**: 7-day calendar; Days 2–7 include traits up to Mythic rarity
- **Shop**: Free Starter Bundle (2000 coins + 100 gems, one-time), gem/coin packs, daily redirect
- **Areas**: M key or HUD button opens area map modal (Vanguard Hall active; 3 areas coming soon)

## User Preferences
- Roblox-style 3D lobby feel with neon sci-fi aesthetic
- LeBron James as player character (Lakers colors #552583 + #FDB927, basketball physics)
- Massive feature batches — implement everything in one session

## Gotchas
- WebGL errors in Replit sandbox preview are expected (no GPU). App works correctly in real browsers.
- `getAllBaseUnits()` in units.ts has a dead `normal` variable — non-breaking lint warning only.
- Traits data structure: `TraitData.effect.description` + `.statBonus` (optional). CSS class `trait-rarity-{rarity}` applies animated name styles.
- Daily reward cooldown is `MS_PER_DAY = 86400000` — stored as Unix timestamp in `lastDailyRewardClaim`.

## Pointers
- Lobby3D ceiling fix: search `LobbyCeiling` — solid mesh removed, neon strips at y=13
- Basketball component: search `PlayerBall` in Lobby3D.tsx
- Area tab: `AreaTabModal` component + `showAreaTab` state in Lobby3D main export
- Divine units: `DIVINE_UNITS` in units.ts; Yuhabana is the only one
- Top-down toggle: `topDown` state in GameView.tsx passed to `CameraSetup`
