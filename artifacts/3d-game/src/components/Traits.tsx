// ============================================================
// TRAITS — Trait index/glossary and management UI
// ============================================================

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TRAITS, TraitData, TraitRarity, TRAIT_RARITY_COLORS } from '../data/traits';

const RARITY_ORDER: TraitRarity[] = ['secret', 'mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'];

function TraitNameSpan({ trait }: { trait: TraitData }) {
  const cls = `trait-name-text trait-rarity-${trait.rarity}`;
  return <span className={cls}>{trait.name}</span>;
}

function TraitCard({
  trait,
  owned,
  active,
  onEquip,
  onUnequip,
}: {
  trait: TraitData;
  owned: boolean;
  active: boolean;
  onEquip: () => void;
  onUnequip: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      className={`trait-card ${owned ? 'trait-owned' : 'trait-locked'} ${active ? 'trait-active' : ''} trait-border-${trait.rarity}`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="trait-card-header">
        <div className="trait-icon-large">{trait.icon}</div>
        <div className="trait-card-info">
          <div className="trait-card-name">
            <TraitNameSpan trait={trait} />
          </div>
          <div className={`trait-rarity-badge trait-rarity-badge-${trait.rarity}`}>
            {trait.rarity.toUpperCase()}
          </div>
        </div>
        {active && <div className="trait-equipped-badge">ACTIVE</div>}
        {!owned && <div className="trait-locked-badge">LOCKED</div>}
      </div>

      <div className="trait-effect">
        <span className="trait-effect-label">Effect:</span> {trait.effect.description}
      </div>

      {showDetails && (
        <div className="trait-details-expanded">
          <div className="trait-description">{trait.description}</div>
          <div className="trait-lore">"{trait.lore}"</div>
          <div className="trait-obtain">
            Obtain from: {trait.obtainedFrom.map(s => s === 'daily' ? '📅 Daily' : s === 'challenge' ? '⚡ Challenge' : '🏪 Shop').join(' • ')}
          </div>
          {owned && !active && (
            <button className="trait-equip-btn" onClick={(e) => { e.stopPropagation(); onEquip(); }}>
              ✨ ACTIVATE
            </button>
          )}
          {active && (
            <button className="trait-unequip-btn" onClick={(e) => { e.stopPropagation(); onUnequip(); }}>
              ✕ DEACTIVATE
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Traits() {
  const { setScreen, ownedTraits, activeTraits, equipTrait, unequipTrait } = useGameStore();
  const [filterRarity, setFilterRarity] = useState<TraitRarity | 'all'>('all');
  const [filterOwned, setFilterOwned] = useState(false);

  const allTraits = Object.values(TRAITS).sort(
    (a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)
  );

  const displayTraits = allTraits.filter(t => {
    if (filterOwned && !ownedTraits.includes(t.id)) return false;
    if (filterRarity !== 'all' && t.rarity !== filterRarity) return false;
    return true;
  });

  const activeSlots = 3;

  return (
    <div className="traits-screen">
      <div className="traits-header">
        <button className="back-btn" onClick={() => setScreen('lobby')}>← Back</button>
        <h2 className="section-title">✨ TRAITS</h2>
        <div className="traits-owned-count">{ownedTraits.length} / {allTraits.length} Traits</div>
      </div>

      {/* Active trait slots */}
      <div className="active-traits-panel">
        <div className="active-traits-title">ACTIVE TRAITS ({activeTraits.length}/{activeSlots})</div>
        <div className="active-traits-slots">
          {Array.from({ length: activeSlots }).map((_, i) => {
            const traitId = activeTraits[i];
            const trait = traitId ? TRAITS[traitId] : null;
            return (
              <div key={i} className={`active-slot ${trait ? 'active-slot-filled' : 'active-slot-empty'}`}>
                {trait ? (
                  <>
                    <div className="active-slot-icon">{trait.icon}</div>
                    <div className="active-slot-name"><TraitNameSpan trait={trait} /></div>
                    <button className="active-slot-remove" onClick={() => unequipTrait(traitId!)}>✕</button>
                  </>
                ) : (
                  <div className="active-slot-placeholder">Empty Slot</div>
                )}
              </div>
            );
          })}
        </div>
        <div className="active-traits-hint">Active traits apply to ALL game modes</div>
      </div>

      {/* Filters */}
      <div className="traits-filters">
        <button
          className={`trait-filter-btn ${filterOwned ? 'active' : ''}`}
          onClick={() => setFilterOwned(!filterOwned)}
        >
          {filterOwned ? '⭐ Owned Only' : '📖 All Traits'}
        </button>
        <button
          className={`trait-filter-btn ${filterRarity === 'all' ? 'active' : ''}`}
          onClick={() => setFilterRarity('all')}
        >All</button>
        {RARITY_ORDER.map(r => (
          <button
            key={r}
            className={`trait-filter-btn ${filterRarity === r ? 'active' : ''}`}
            style={filterRarity === r ? { borderColor: r === 'secret' ? '#E879F9' : TRAIT_RARITY_COLORS[r], color: r === 'secret' ? '#E879F9' : TRAIT_RARITY_COLORS[r] } : {}}
            onClick={() => setFilterRarity(r)}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      {/* Trait list */}
      <div className="traits-list">
        {displayTraits.length === 0 && (
          <div className="traits-empty">
            <div className="traits-empty-icon">🔍</div>
            <div>No traits found with current filters</div>
          </div>
        )}
        {displayTraits.map(trait => (
          <TraitCard
            key={trait.id}
            trait={trait}
            owned={ownedTraits.includes(trait.id)}
            active={activeTraits.includes(trait.id)}
            onEquip={() => equipTrait(trait.id)}
            onUnequip={() => unequipTrait(trait.id)}
          />
        ))}
      </div>

      {/* How to obtain */}
      <div className="traits-how-to">
        <div className="htp-title">HOW TO GET TRAITS</div>
        <div className="traits-obtain-list">
          <div className="obtain-item">
            <span className="obtain-icon">📅</span>
            <div><strong>Daily Rewards</strong> — Days 2–7 reward traits up to Mythic rarity</div>
          </div>
          <div className="obtain-item">
            <span className="obtain-icon">⚡</span>
            <div><strong>Challenge Mode</strong> — Clear stages for Epic–Secret trait drops</div>
          </div>
          <div className="obtain-item">
            <span className="obtain-icon">👑</span>
            <div><strong>Omnipotence</strong> — The secret trait (0.1%). Only Challenge Mode drops it</div>
          </div>
        </div>
      </div>
    </div>
  );
}
