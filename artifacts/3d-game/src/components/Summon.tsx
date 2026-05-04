// ============================================================
// SUMMON — Gacha summoning screen with reveal animation
// ============================================================

import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { UnitData, GACHA_RATES, RARITY_COLORS, UNITS } from '../data/units';

export default function Summon() {
  const { profile, setScreen, summonUnit, revealQueue, clearRevealQueue, testSummonSecret } = useGameStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealedUnits, setRevealedUnits] = useState<UnitData[]>([]);
  const [revealIndex, setRevealIndex] = useState(0);

  // When revealQueue is populated, show reveal screen
  useEffect(() => {
    if (revealQueue.length > 0 && !showReveal) {
      setRevealedUnits(revealQueue);
      setRevealIndex(0);
      setShowReveal(true);
      setIsAnimating(false);
    }
  }, [revealQueue]);

  function handleSummon(type: 'coin' | 'gem' | 'multi') {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      const ok = summonUnit(type);
      if (!ok) {
        setIsAnimating(false);
        // Not enough currency - flash effect
      }
    }, 400);
  }

  function handleRevealNext() {
    if (revealIndex < revealedUnits.length - 1) {
      setRevealIndex(i => i + 1);
    } else {
      setShowReveal(false);
      clearRevealQueue();
      setIsAnimating(false);
    }
  }

  function handleRevealAll() {
    setRevealIndex(revealedUnits.length - 1);
  }

  if (showReveal && revealedUnits.length > 0) {
    const current = revealedUnits[revealIndex];
    const rColor = RARITY_COLORS[current.rarity];
    const isLast = revealIndex === revealedUnits.length - 1;
    return (
      <SummonReveal
        unit={current}
        rColor={rColor}
        index={revealIndex}
        total={revealedUnits.length}
        isLast={isLast}
        onNext={handleRevealNext}
        onRevealAll={handleRevealAll}
      />
    );
  }

  return (
    <div className="summon-screen">
      <div className="summon-bg" />

      {/* Back button */}
      <button className="back-btn" onClick={() => setScreen('lobby')}>
        ← Back
      </button>

      <h2 className="summon-title">✨ SUMMON PORTAL ✨</h2>
      <p className="summon-subtitle">Awaken legendary warriors from the void</p>

      {/* Rate display */}
      <div className="rate-display">
        {Object.entries(GACHA_RATES).map(([rarity, rate]) => (
          <div key={rarity} className="rate-badge" style={{ borderColor: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] }}>
            <div className="rate-name" style={{ color: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] }}>
              {rarity.toUpperCase()}
            </div>
            <div className="rate-pct">{(rate * 100).toFixed(0)}%</div>
          </div>
        ))}
      </div>

      {/* Summon portal visual */}
      <div className={`summon-portal ${isAnimating ? 'animating' : ''}`}>
        <div className="portal-ring outer" />
        <div className="portal-ring middle" />
        <div className="portal-ring inner" />
        <div className="portal-core">
          {isAnimating ? '⚡' : '✨'}
        </div>
      </div>

      {/* Summon buttons */}
      <div className="summon-buttons">
        <button
          className="summon-btn summon-btn-test"
          onClick={() => { if (!isAnimating) { setIsAnimating(true); setTimeout(() => { testSummonSecret(); setIsAnimating(false); }, 400); } }}
          disabled={isAnimating}
          title="Dev: Force a Secret pull"
        >
          <div className="summon-btn-label">🧪 TEST</div>
          <div className="summon-btn-sub" style={{ fontSize: 14 }}>SECRET</div>
          <div className="summon-btn-cost" style={{ color: '#E879F9' }}>FREE</div>
        </button>
        <SummonButton
          label="COIN SUMMON"
          sublabel="×1"
          costIcon="🪙"
          cost={100}
          available={profile.coins >= 100}
          onClick={() => handleSummon('coin')}
          disabled={isAnimating}
        />
        <SummonButton
          label="GEM SUMMON"
          sublabel="×1"
          costIcon="💎"
          cost={10}
          available={profile.gems >= 10}
          onClick={() => handleSummon('gem')}
          disabled={isAnimating}
          highlight
        />
        <SummonButton
          label="MULTI SUMMON"
          sublabel="×10"
          costIcon="💎"
          cost={90}
          available={profile.gems >= 90}
          onClick={() => handleSummon('multi')}
          disabled={isAnimating}
          special
        />
      </div>

      {/* Currency display */}
      <div className="summon-currency">
        <div className="currency-badge coins">🪙 {profile.coins.toLocaleString()}</div>
        <div className="currency-badge gems">💎 {profile.gems.toLocaleString()}</div>
      </div>

      {/* Recent pool preview */}
      <div className="pool-preview">
        <div className="pool-title">CHARACTER POOL</div>
        <div className="pool-grid">
          {Object.values(UNITS).slice(0, 12).map(u => (
            <div key={u.id} className="pool-card" style={{ borderColor: RARITY_COLORS[u.rarity] }}>
              <div className="pool-card-dot" style={{ background: u.color, boxShadow: `0 0 8px ${u.auraColor}` }} />
              <div className="pool-card-name">{u.name}</div>
              <div className="pool-card-rarity" style={{ color: RARITY_COLORS[u.rarity] }}>
                {u.rarity.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummonButton({ label, sublabel, costIcon, cost, available, onClick, disabled, highlight, special }: {
  label: string; sublabel: string; costIcon: string; cost: number;
  available: boolean; onClick: () => void; disabled?: boolean; highlight?: boolean; special?: boolean;
}) {
  return (
    <button
      className={`summon-btn ${highlight ? 'summon-btn-highlight' : ''} ${special ? 'summon-btn-special' : ''} ${!available ? 'summon-btn-disabled' : ''}`}
      onClick={onClick}
      disabled={disabled || !available}
    >
      <div className="summon-btn-label">{label}</div>
      <div className="summon-btn-sub">{sublabel}</div>
      <div className="summon-btn-cost">
        {costIcon} {cost.toLocaleString()}
      </div>
    </button>
  );
}

function SummonReveal({ unit, rColor, index, total, isLast, onNext, onRevealAll }: {
  unit: UnitData; rColor: string; index: number; total: number;
  isLast: boolean; onNext: () => void; onRevealAll: () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, [unit.id, index]);

  const rarityLabels: Record<string, string> = {
    rare: '★★ RARE',
    epic: '★★★ EPIC',
    legendary: '★★★★ LEGENDARY',
    mythic: '★★★★★ MYTHIC',
    secret: '🌈 SECRET',
  };

  return (
    <div className="reveal-screen" style={{ '--rarity-color': rColor } as React.CSSProperties}>
      <div className="reveal-bg" style={{ background: `radial-gradient(circle at center, ${rColor}22 0%, #000 70%)` }} />

      {/* Rarity flare */}
      {(unit.rarity === 'legendary' || unit.rarity === 'mythic' || unit.rarity === 'secret') && (
        <div className="legendary-flare">
          {'★'.repeat(8).split('').map((s, i) => (
            <div key={i} className="flare-star" style={{ animationDelay: `${i * 0.1}s`, transform: `rotate(${i * 45}deg) translateY(-80px)`, color: unit.rarity === 'secret' ? '#E879F9' : unit.rarity === 'mythic' ? '#EF4444' : '#F59E0B' }}>{s}</div>
          ))}
        </div>
      )}
      {unit.rarity === 'secret' && (
        <div className="secret-flash" />
      )}

      <div className={`reveal-card ${visible ? 'reveal-card-visible' : ''}`} style={{ borderColor: rColor, boxShadow: `0 0 40px ${rColor}66` }}>
        {/* Unit visual */}
        <div className="reveal-unit-visual">
          <div className="reveal-orb" style={{ background: unit.color, boxShadow: `0 0 60px ${unit.auraColor}, 0 0 120px ${unit.auraColor}44` }} />
          <div className="reveal-aura" style={{ background: `radial-gradient(circle, ${unit.auraColor}66, transparent 70%)` }} />
          <div className="reveal-particles">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="reveal-particle" style={{
                background: unit.trailColor,
                animationDelay: `${i * 0.15}s`,
                transform: `rotate(${i * 45}deg) translateY(-60px)`,
              }} />
            ))}
          </div>
        </div>

        {/* Rarity */}
        <div className="reveal-rarity" style={{ color: rColor }}>
          {rarityLabels[unit.rarity]}
        </div>

        {/* Name */}
        <div className="reveal-name" style={{ textShadow: `0 0 20px ${rColor}` }}>
          {unit.name}
        </div>
        <div className="reveal-title" style={{ color: rColor }}>{unit.title}</div>

        {/* Ability */}
        <div className="reveal-ability">
          <div className="reveal-ability-name">⚡ {unit.ability.name}</div>
          <div className="reveal-ability-desc">{unit.ability.description}</div>
        </div>

        {/* Stats */}
        <div className="reveal-stats">
          <div className="reveal-stat"><span>HP</span><strong>{unit.stats.hp}</strong></div>
          <div className="reveal-stat"><span>ATK</span><strong>{unit.stats.atk}</strong></div>
          <div className="reveal-stat"><span>RNG</span><strong>{unit.stats.range}</strong></div>
          <div className="reveal-stat"><span>SPD</span><strong>{unit.stats.attackSpeed}/s</strong></div>
        </div>

        {/* Counter */}
        {total > 1 && (
          <div className="reveal-counter">{index + 1} / {total}</div>
        )}
      </div>

      {/* Buttons */}
      <div className="reveal-actions">
        {!isLast && total > 1 && (
          <button className="reveal-btn-all" onClick={onRevealAll}>
            Show All
          </button>
        )}
        <button
          className="reveal-btn-next"
          style={{ background: rColor }}
          onClick={onNext}
        >
          {isLast ? 'Done ✓' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
