// ============================================================
// INVENTORY — Unit collection, equip, upgrade, evolve
// ============================================================

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { UNITS, RARITY_COLORS, UnitData } from '../data/units';

type SortMode = 'rarity' | 'name' | 'level';
type FilterRarity = 'all' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret';

export default function Inventory() {
  const { ownedUnits, equippedUnitIds, equipUnit, unequipUnit, upgradeUnit, evolveUnit, setScreen, profile } = useGameStore();
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>('rarity');
  const [filter, setFilter] = useState<FilterRarity>('all');

  const rarityOrder: Record<string, number> = { secret: 0, mythic: 1, legendary: 2, epic: 3, rare: 4 };

  const sortedOwned = [...ownedUnits]
    .filter(u => {
      if (filter === 'all') return true;
      return UNITS[u.unitId]?.rarity === filter;
    })
    .sort((a, b) => {
      const ua = UNITS[a.unitId];
      const ub = UNITS[b.unitId];
      if (!ua || !ub) return 0;
      if (sort === 'rarity') return rarityOrder[ua.rarity] - rarityOrder[ub.rarity];
      if (sort === 'name') return ua.name.localeCompare(ub.name);
      if (sort === 'level') return b.level - a.level;
      return 0;
    });

  const selectedOwned = selectedUnitId ? ownedUnits.find(u => u.unitId === selectedUnitId) : null;
  const selectedData: UnitData | undefined = selectedUnitId ? UNITS[selectedUnitId] : undefined;
  const isEquipped = selectedUnitId ? equippedUnitIds.includes(selectedUnitId) : false;
  const equippedSlot = selectedUnitId ? equippedUnitIds.indexOf(selectedUnitId) : -1;
  const nextEvolution = selectedData?.evolvesTo ? UNITS[selectedData.evolvesTo] : null;
  const canEvolve = selectedOwned && selectedData?.evolvesTo && selectedOwned.shards >= (selectedData.evolutionMaterials || 9999);

  function handleEquip() {
    if (!selectedUnitId) return;
    // Find first empty slot
    const emptySlot = equippedUnitIds.indexOf(null);
    if (emptySlot === -1) return; // all slots full
    equipUnit(selectedUnitId, emptySlot);
  }

  function handleUnequip() {
    if (equippedSlot === -1) return;
    unequipUnit(equippedSlot);
  }

  function handleUpgrade() {
    if (!selectedUnitId) return;
    upgradeUnit(selectedUnitId);
  }

  function handleEvolve() {
    if (!selectedUnitId) return;
    const ok = evolveUnit(selectedUnitId);
    if (ok && selectedData?.evolvesTo) {
      setSelectedUnitId(selectedData.evolvesTo);
    }
  }

  const upgradeCost = selectedOwned ? selectedOwned.level * 50 : 0;
  const canUpgrade = selectedOwned ? selectedOwned.level < 10 && profile.coins >= upgradeCost : false;

  return (
    <div className="inventory-screen">
      <div className="inventory-header">
        <button className="back-btn" onClick={() => setScreen('lobby')}>← Back</button>
        <h2 className="section-title">📦 UNIT COLLECTION</h2>
        <div className="inventory-count">{ownedUnits.length} units owned</div>
      </div>

      {/* Equipped bar */}
      <div className="equipped-bar">
        <div className="equipped-bar-label">SQUAD</div>
        {equippedUnitIds.map((uid, i) => {
          const data = uid ? UNITS[uid] : null;
          const rc = data ? RARITY_COLORS[data.rarity] : '#333';
          return (
            <button
              key={i}
              className={`equip-slot-btn ${uid ? 'filled' : 'empty'}`}
              style={{ borderColor: rc }}
              onClick={() => uid ? setSelectedUnitId(uid) : undefined}
            >
              {data ? (
                <>
                  <div className="equip-slot-dot" style={{ background: data.color, boxShadow: `0 0 8px ${data.auraColor}` }} />
                  <div className="equip-slot-name">{data.name.split(' ')[0]}</div>
                </>
              ) : (
                <div className="equip-slot-empty">EMPTY</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="inventory-body">
        {/* List panel */}
        <div className="inventory-list-panel">
          {/* Filters */}
          <div className="filter-row">
            {(['all', 'rare', 'epic', 'legendary', 'mythic', 'secret'] as FilterRarity[]).map(r => (
              <button
                key={r}
                className={`filter-btn ${filter === r ? 'active' : ''}`}
                style={filter === r && r !== 'all' ? { borderColor: RARITY_COLORS[r], color: RARITY_COLORS[r] } : {}}
                onClick={() => setFilter(r)}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="sort-row">
            {(['rarity', 'name', 'level'] as SortMode[]).map(s => (
              <button key={s} className={`sort-btn ${sort === s ? 'active' : ''}`} onClick={() => setSort(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Unit grid */}
          {sortedOwned.length === 0 ? (
            <div className="empty-collection">
              <div style={{ fontSize: 48 }}>📦</div>
              <div>No units yet!</div>
              <button className="nav-btn-highlight" onClick={() => setScreen('summon')} style={{ marginTop: 12, padding: '8px 20px' }}>
                Go Summon
              </button>
            </div>
          ) : (
            <div className="unit-grid">
              {sortedOwned.map(owned => {
                const data = UNITS[owned.unitId];
                if (!data) return null;
                const rc = RARITY_COLORS[data.rarity];
                const equipped = equippedUnitIds.includes(owned.unitId);
                return (
                  <button
                    key={owned.unitId}
                    className={`unit-card ${selectedUnitId === owned.unitId ? 'selected' : ''} ${equipped ? 'equipped' : ''}`}
                    style={{ borderColor: rc }}
                    onClick={() => setSelectedUnitId(owned.unitId)}
                  >
                    <div className="unit-card-orb" style={{ background: data.color, boxShadow: `0 0 12px ${data.auraColor}` }} />
                    <div className="unit-card-info">
                      <div className="unit-card-name">{data.name}</div>
                      <div className="unit-card-rarity" style={{ color: rc }}>{data.rarity.toUpperCase()}</div>
                    </div>
                    <div className="unit-card-level">LV {owned.level}</div>
                    {equipped && <div className="unit-card-equipped-badge">⚔️</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="inventory-detail-panel">
          {selectedData && selectedOwned ? (
            <UnitDetail
              data={selectedData}
              owned={selectedOwned}
              isEquipped={isEquipped}
              canEquip={!isEquipped && equippedUnitIds.filter(Boolean).length < 5}
              canUpgrade={canUpgrade}
              upgradeCost={upgradeCost}
              canEvolve={!!canEvolve}
              nextEvolution={nextEvolution}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
              onUpgrade={handleUpgrade}
              onEvolve={handleEvolve}
            />
          ) : (
            <div className="detail-empty">
              <div style={{ fontSize: 48, opacity: 0.3 }}>⚔️</div>
              <div style={{ opacity: 0.5 }}>Select a unit to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UnitDetail({ data, owned, isEquipped, canEquip, canUpgrade, upgradeCost, canEvolve, nextEvolution, onEquip, onUnequip, onUpgrade, onEvolve }: {
  data: UnitData;
  owned: { level: number; shards: number; experience: number };
  isEquipped: boolean;
  canEquip: boolean;
  canUpgrade: boolean;
  upgradeCost: number;
  canEvolve: boolean;
  nextEvolution: UnitData | null;
  onEquip: () => void;
  onUnequip: () => void;
  onUpgrade: () => void;
  onEvolve: () => void;
}) {
  const rc = RARITY_COLORS[data.rarity];
  const levelMult = 1 + (owned.level - 1) * 0.1;

  const rarityStars: Record<string, string> = {
    common: '★', rare: '★★', epic: '★★★', legendary: '★★★★',
  };

  return (
    <div className="unit-detail">
      {/* Header */}
      <div className="detail-header" style={{ borderColor: rc }}>
        <div className="detail-orb" style={{ background: data.color, boxShadow: `0 0 30px ${data.auraColor}, 0 0 60px ${data.auraColor}44` }}>
          <div className="detail-particles">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="detail-particle" style={{ background: data.trailColor, animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>
        <div className="detail-title-block">
          <div className="detail-rarity-stars" style={{ color: rc }}>{rarityStars[data.rarity]}</div>
          <div className="detail-name">{data.name}</div>
          <div className="detail-subtitle" style={{ color: rc }}>{data.title}</div>
          <div className="detail-role">{data.role.toUpperCase()}</div>
        </div>
      </div>

      {/* Level bar */}
      <div className="detail-level">
        <span>LEVEL {owned.level}</span>
        <div className="level-bar-bg">
          <div className="level-bar-fill" style={{ width: `${(owned.level / 10) * 100}%`, background: rc }} />
        </div>
        <span>MAX 10</span>
      </div>

      {/* Stats */}
      <div className="detail-stats">
        <StatRow label="HP" value={Math.round(data.stats.hp * levelMult)} color="#4ADE80" />
        <StatRow label="ATK" value={Math.round(data.stats.atk * levelMult)} color="#F87171" />
        <StatRow label="RANGE" value={data.stats.range} color="#60A5FA" />
        <StatRow label="ATK/S" value={data.stats.attackSpeed} color="#FBBF24" />
        <StatRow label="DEF" value={Math.round(data.stats.defense * levelMult)} color="#A78BFA" />
      </div>

      {/* Ability */}
      <div className="detail-ability" style={{ borderColor: rc + '66' }}>
        <div className="detail-ability-header">
          <div className="detail-ability-name">⚡ {data.ability.name}</div>
          <div className="detail-ability-cd">CD: {data.ability.cooldown}s</div>
        </div>
        <div className="detail-ability-desc">{data.ability.description}</div>
        <div className="detail-ability-stats">
          <span>DMG ×{data.ability.damageMultiplier}</span>
          {data.ability.aoeRadius && <span>AOE {data.ability.aoeRadius}</span>}
        </div>
      </div>

      {/* Shards & Evolution */}
      <div className="detail-shards">
        <div className="shards-bar">
          <span className="shards-label">🔮 {owned.shards} / {data.evolutionMaterials || '—'} shards</span>
          {data.evolutionMaterials && (
            <div className="shards-bg">
              <div className="shards-fill" style={{
                width: `${Math.min(100, (owned.shards / data.evolutionMaterials) * 100)}%`,
                background: rc,
              }} />
            </div>
          )}
        </div>
        {nextEvolution && (
          <div className="evolution-preview" style={{ borderColor: rc + '44' }}>
            <span>→ Evolves to: </span>
            <span style={{ color: rc, fontWeight: 700 }}>{nextEvolution.name}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="detail-actions">
        {isEquipped ? (
          <button className="action-btn action-btn-unequip" onClick={onUnequip}>
            Remove from Squad
          </button>
        ) : (
          <button className={`action-btn action-btn-equip ${!canEquip ? 'disabled' : ''}`} onClick={onEquip} disabled={!canEquip}>
            {canEquip ? '⚔️ Add to Squad' : 'Squad Full (5/5)'}
          </button>
        )}
        <button
          className={`action-btn action-btn-upgrade ${!canUpgrade ? 'disabled' : ''}`}
          onClick={onUpgrade}
          disabled={!canUpgrade}
        >
          {owned.level >= 10 ? 'MAX LEVEL' : `⬆ Upgrade (🪙${upgradeCost})`}
        </button>
        {data.evolvesTo && (
          <button
            className={`action-btn action-btn-evolve ${!canEvolve ? 'disabled' : ''}`}
            onClick={onEvolve}
            disabled={!canEvolve}
          >
            {canEvolve ? `🌟 Evolve!` : `🔮 Need ${data.evolutionMaterials} shards`}
          </button>
        )}
      </div>

      <div className="detail-description">{data.description}</div>
    </div>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="stat-row">
      <div className="stat-row-label">{label}</div>
      <div className="stat-row-bar-bg">
        <div className="stat-row-bar" style={{ width: `${Math.min(100, value / 20)}%`, background: color }} />
      </div>
      <div className="stat-row-value" style={{ color }}>{value}</div>
    </div>
  );
}
