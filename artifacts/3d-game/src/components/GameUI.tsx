// ============================================================
// GAME UI — HUD overlay on top of the 3D canvas
// ============================================================

import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { UNITS, RARITY_COLORS, BOSSES } from '../data/units';

interface GameUIProps {
  selectedUnitId: string | null;
  onSelectUnit: (id: string | null) => void;
  equippedUnitIds: (string | null)[];
}

export default function GameUI({ selectedUnitId, onSelectUnit, equippedUnitIds }: GameUIProps) {
  const { game, startNextWave, togglePause, setSpeed, resetGame } = useGameStore();
  const bossEnemy = game.enemies.find(e => e.isBoss);
  const boss = bossEnemy ? BOSSES[bossEnemy.enemyId] : null;

  // Show wave-ready notification
  const waveReady = !game.isWaveActive && !game.isGameOver;

  return (
    <div className="game-hud">
      {/* Top bar */}
      <div className="hud-top">
        <div className="hud-top-left">
          {/* Lives */}
          <div className="hud-stat lives-stat">
            <span className="hud-stat-icon">❤️</span>
            <div className="hud-stat-bar">
              {Array.from({ length: Math.min(20, game.maxLives) }).map((_, i) => (
                <div key={i} className={`life-pip ${i < game.lives ? 'alive' : 'dead'}`} />
              ))}
            </div>
            <span className="hud-stat-value">{game.lives}</span>
          </div>

          {/* Gold */}
          <div className="hud-stat">
            <span className="hud-stat-icon">🪙</span>
            <span className="hud-stat-value gold-value">{game.gold}</span>
          </div>

          {/* Score */}
          <div className="hud-stat">
            <span className="hud-stat-icon">⭐</span>
            <span className="hud-stat-value">{game.score.toLocaleString()}</span>
          </div>
        </div>

        <div className="hud-top-center">
          <div className="wave-display">
            <div className="wave-number">WAVE {game.wave}</div>
            {game.isWaveActive && (
              <div className="enemies-remaining">
                {game.enemies.length + game.spawnQueue.length} enemies
              </div>
            )}
          </div>
        </div>

        <div className="hud-top-right">
          {/* Speed toggle */}
          <button
            className={`hud-btn speed-btn ${game.speed === 2 ? 'active' : ''}`}
            onClick={() => setSpeed(game.speed === 1 ? 2 : 1)}
          >
            {game.speed === 1 ? '▶ 1x' : '⏩ 2x'}
          </button>

          {/* Pause */}
          <button
            className={`hud-btn pause-btn ${game.isPaused ? 'active' : ''}`}
            onClick={togglePause}
          >
            {game.isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          {/* Quit */}
          <button className="hud-btn quit-btn" onClick={resetGame}>
            ✕ Quit
          </button>
        </div>
      </div>

      {/* Boss health bar */}
      {boss && bossEnemy && (
        <div className="boss-bar-container">
          <div className="boss-bar-label" style={{ color: bossEnemy.auraColor }}>
            ☠️ {boss.name}
            {bossEnemy.bossPhase === 2 && (
              <span className="boss-phase-2"> — PHASE 2 ⚡</span>
            )}
          </div>
          <div className="boss-bar-bg">
            <div
              className="boss-bar-fill"
              style={{
                width: `${(bossEnemy.hp / bossEnemy.maxHp) * 100}%`,
                background: bossEnemy.bossPhase === 2
                  ? 'linear-gradient(90deg, #EF4444, #F97316)'
                  : `linear-gradient(90deg, ${bossEnemy.auraColor}, ${bossEnemy.color})`,
              }}
            />
            <div className="boss-bar-hp">
              {Math.round(bossEnemy.hp).toLocaleString()} / {bossEnemy.maxHp.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Floating damage texts */}
      <div className="floating-texts">
        {game.floatingTexts.map(ft => (
          <FloatingText key={ft.id} text={ft.text} color={ft.color} created={ft.created} />
        ))}
      </div>

      {/* Pause overlay */}
      {game.isPaused && (
        <div className="pause-overlay">
          <div className="pause-card">
            <div className="pause-title">⏸ PAUSED</div>
            <button className="pause-resume-btn" onClick={togglePause}>▶ Resume</button>
            <button className="pause-quit-btn" onClick={resetGame}>✕ Quit Game</button>
          </div>
        </div>
      )}

      {/* Wave ready banner */}
      {waveReady && game.wave > 0 && (
        <div className="wave-clear-banner">
          <div className="wcb-text">✓ Wave {game.wave} Cleared!</div>
          <div className="wcb-bonus">+{game.wave * 20} bonus gold</div>
        </div>
      )}

      {/* Wave start button */}
      {waveReady && !game.isPaused && (
        <button className="wave-start-btn" onClick={startNextWave}>
          <span className="wsb-label">▶ Start Wave {game.wave + 1}</span>
          <span className="wsb-hint">Click to begin</span>
        </button>
      )}

      {/* Unit selector bar */}
      <div className="hud-unit-bar">
        <div className="unit-bar-label">DEPLOY (click field to place)</div>
        <div className="unit-bar-slots">
          {equippedUnitIds.map((unitId, i) => {
            if (!unitId) return (
              <div key={i} className="unit-bar-slot empty">
                <div className="ubs-empty">EMPTY</div>
              </div>
            );
            const data = UNITS[unitId];
            if (!data) return null;
            const rc = RARITY_COLORS[data.rarity];
            const isSelected = selectedUnitId === unitId;
            const canAfford = game.gold >= data.deployCost;
            return (
              <button
                key={i}
                className={`unit-bar-slot ${isSelected ? 'selected' : ''} ${!canAfford ? 'cant-afford' : ''}`}
                style={{ borderColor: isSelected ? rc : (canAfford ? rc + '66' : '#333') }}
                onClick={() => onSelectUnit(isSelected ? null : unitId)}
              >
                <div className="ubs-orb" style={{ background: data.color, boxShadow: `0 0 8px ${data.auraColor}` }} />
                <div className="ubs-name">{data.name.split(' ')[0]}</div>
                <div className="ubs-cost" style={{ color: canAfford ? '#FCD34D' : '#6B7280' }}>
                  🪙{data.deployCost}
                </div>
                {isSelected && <div className="ubs-selected-badge">SELECTED</div>}
              </button>
            );
          })}
        </div>
        {selectedUnitId && (
          <div className="unit-bar-hint">
            Click an empty cell on the battlefield to place {UNITS[selectedUnitId]?.name}
            <button className="unit-bar-cancel" onClick={() => onSelectUnit(null)}>✕ Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Floating damage number
function FloatingText({ text, color, created }: { text: string; color: string; created: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame: number;
    const animate = () => {
      const age = Date.now() / 1000 - created;
      if (ref.current) {
        ref.current.style.opacity = String(Math.max(0, 1 - age / 1.5));
        ref.current.style.transform = `translateY(${-age * 40}px)`;
      }
      if (age < 1.5) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [created]);

  return (
    <div
      ref={ref}
      className="floating-text"
      style={{ color, position: 'absolute', left: `${40 + Math.random() * 20}%`, top: `${30 + Math.random() * 20}%` }}
    >
      {text}
    </div>
  );
}
