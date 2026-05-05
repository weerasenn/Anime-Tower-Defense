// ============================================================
// GAME UI — HUD overlay on top of the 3D canvas
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { UNITS, RARITY_COLORS, BOSSES } from '../data/units';
import { ENEMIES, generateWave } from '../data/enemies';

interface GameUIProps {
  selectedUnitId: string | null;
  onSelectUnit: (id: string | null) => void;
  equippedUnitIds: (string | null)[];
}

export default function GameUI({ selectedUnitId, onSelectUnit, equippedUnitIds }: GameUIProps) {
  const { game, startNextWave, togglePause, setSpeed, resetGame, startGame, gameMode } = useGameStore();
  const bossEnemy = game.enemies.find(e => e.isBoss);
  const boss = bossEnemy ? BOSSES[bossEnemy.enemyId] : null;
  const waveReady = !game.isWaveActive && !game.isGameOver;

  // Boss wave cinematic intro
  const prevWaveRef = useRef(0);
  const [bossIntro, setBossIntro] = useState<{ name: string; color: string; wave: number } | null>(null);
  const [showWavePreview, setShowWavePreview] = useState(false);

  useEffect(() => {
    const prevWave = prevWaveRef.current;
    prevWaveRef.current = game.wave;
    if (!game.isWaveActive || game.wave <= prevWave || !game.currentWaveData?.bossId) return;

    const bossId = game.currentWaveData.bossId;
    const b = BOSSES[bossId];
    setBossIntro({
      name: b?.name ?? bossId.replace(/-/g, ' ').toUpperCase(),
      color: b?.auraColor ?? '#EF4444',
      wave: game.wave,
    });
    const t = setTimeout(() => setBossIntro(null), 3500);
    return () => clearTimeout(t);
  }, [game.wave, game.isWaveActive]);

  // Pre-compute next wave data for preview
  const nextWaveData = generateWave(game.wave + 1);

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

          {/* Kills this wave */}
          {game.isWaveActive && (
            <div className="hud-stat">
              <span className="hud-stat-icon">💀</span>
              <span className="hud-stat-value kills-stat-value">{game.killsThisWave}</span>
            </div>
          )}
        </div>

        <div className="hud-top-center">
          <div className="wave-display">
            <div className="wave-number">WAVE {game.wave}</div>
            {game.isWaveActive && (
              <div className="enemies-remaining">
                {game.enemies.length + game.spawnQueue.length} enemies
              </div>
            )}
            {!game.isWaveActive && !game.isGameOver && game.wave >= 0 && (
              <button
                className={`wave-preview-btn ${showWavePreview ? 'active' : ''}`}
                onClick={() => setShowWavePreview(v => !v)}
              >
                {showWavePreview ? '▼ Hide' : '🔍 Wave ' + (game.wave + 1)}
              </button>
            )}
          </div>
        </div>

        <div className="hud-top-right">
          {/* Speed toggle: 1x → 2x → 3x */}
          <button
            className={`hud-btn speed-btn ${game.speed > 1 ? 'active' : ''} ${game.speed === 3 ? 'speed-3x' : ''}`}
            onClick={() => setSpeed(game.speed === 1 ? 2 : game.speed === 2 ? 3 : 1)}
          >
            {game.speed === 1 ? '▶ 1×' : game.speed === 2 ? '⏩ 2×' : '⚡ 3×'}
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

      {/* Boss wave cinematic */}
      {bossIntro && (
        <div className="boss-cinematic">
          <div className="boss-cinematic-card">
            <div className="boss-cine-warning">⚠ Boss Wave {bossIntro.wave} ⚠</div>
            <div className="boss-cine-vs">— VS —</div>
            <div className="boss-cine-name" style={{ color: bossIntro.color }}>
              {bossIntro.name}
            </div>
            <div className="boss-cine-wave">PREPARE FOR BATTLE</div>
            <div className="boss-cine-bars">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="boss-cine-bar"
                  style={{
                    background: bossIntro.color,
                    height: `${20 + Math.abs(3 - i) * 8}px`,
                    opacity: 0.6 + (i % 2) * 0.4,
                    animationDelay: `${i * 0.06}s`,
                    animation: `bossCineBar 0.5s ${i * 0.06}s ease-out both`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wave preview panel */}
      {showWavePreview && !game.isWaveActive && (
        <div className="wave-preview-panel">
          <div className="wave-preview-title">
            <span>WAVE {game.wave + 1} PREVIEW</span>
            <button className="wave-preview-close" onClick={() => setShowWavePreview(false)}>✕</button>
          </div>
          <div className="wave-preview-desc">{nextWaveData.description}</div>
          <div className="wave-preview-enemies">
            {nextWaveData.enemies.map((we, i) => {
              const enemy = ENEMIES[we.enemyId];
              if (!enemy) return null;
              return (
                <div key={i} className="wpe-row">
                  <div className="wpe-dot" style={{ background: enemy.color, boxShadow: `0 0 6px ${enemy.auraColor}` }} />
                  <span className="wpe-name">{enemy.name}</span>
                  <span className="wpe-count">×{we.count}</span>
                </div>
              );
            })}
            {nextWaveData.bossId && (() => {
              const b = BOSSES[nextWaveData.bossId!];
              return (
                <div className="wpe-boss-row">
                  <span className="wpe-boss-icon">☠️</span>
                  <span className="wpe-boss-name">{b?.name ?? nextWaveData.bossId}</span>
                </div>
              );
            })()}
          </div>
        </div>
      )}

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

      {/* Wave clear banner */}
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

      {/* Game over screen */}
      {game.isGameOver && (
        <div className="gameover-overlay">
          <div className="gameover-card">
            <div className="gameover-skull">💀</div>
            <div className="gameover-title">DEFEATED</div>
            <div className="gameover-subtitle">Your base was destroyed</div>
            <div className="gameover-stats">
              <div className="go-stat">
                <span className="go-stat-icon">🌊</span>
                <span className="go-stat-label">Waves Survived</span>
                <span className="go-stat-value">{game.wave}</span>
              </div>
              <div className="go-stat">
                <span className="go-stat-icon">⭐</span>
                <span className="go-stat-label">Final Score</span>
                <span className="go-stat-value">{game.score.toLocaleString()}</span>
              </div>
              <div className="go-stat">
                <span className="go-stat-icon">💀</span>
                <span className="go-stat-label">Total Kills</span>
                <span className="go-stat-value">{game.killsThisWave}</span>
              </div>
            </div>
            <div className="gameover-actions">
              <button className="gameover-retry-btn" onClick={() => gameMode && startGame(gameMode)}>
                ⚡ Play Again
              </button>
              <button className="gameover-quit-btn" onClick={resetGame}>
                ✕ Exit
              </button>
            </div>
          </div>
        </div>
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
