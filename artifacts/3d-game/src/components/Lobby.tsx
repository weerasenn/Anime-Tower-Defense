// ============================================================
// LOBBY — Main lobby screen with player profile & navigation
// ============================================================

import { useGameStore } from '../store/gameStore';
import { UNITS, RARITY_COLORS } from '../data/units';

export default function Lobby() {
  const { profile, screen, setScreen, ownedUnits, equippedUnitIds } = useGameStore();
  const equippedCount = equippedUnitIds.filter(Boolean).length;

  return (
    <div className="lobby-screen">
      {/* Animated background */}
      <div className="lobby-bg" />

      {/* Header */}
      <div className="lobby-header">
        <div className="profile-card">
          <div className="profile-avatar">
            <span style={{ fontSize: 32 }}>⚔️</span>
          </div>
          <div className="profile-info">
            <div className="profile-name">{profile.name}</div>
            <div className="profile-level">LVL {profile.level}</div>
            <div className="xp-bar-container">
              <div className="xp-bar" style={{ width: `${(profile.experience % 100)}%` }} />
            </div>
          </div>
          <div className="profile-currencies">
            <div className="currency-badge coins">
              <span className="currency-icon">🪙</span>
              <span>{profile.coins.toLocaleString()}</span>
            </div>
            <div className="currency-badge gems">
              <span className="currency-icon">💎</span>
              <span>{profile.gems.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-chip">
            <div className="stat-value">{profile.totalWaves}</div>
            <div className="stat-label">Waves Cleared</div>
          </div>
          <div className="stat-chip">
            <div className="stat-value">{profile.totalKills.toLocaleString()}</div>
            <div className="stat-label">Total Kills</div>
          </div>
          <div className="stat-chip">
            <div className="stat-value">{profile.highScore.toLocaleString()}</div>
            <div className="stat-label">High Score</div>
          </div>
          <div className="stat-chip">
            <div className="stat-value">{ownedUnits.length}</div>
            <div className="stat-label">Units Owned</div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="lobby-title">
        <h1 className="game-title">ANIME TOWER DEFENSE</h1>
        <p className="game-subtitle">Summon. Evolve. Defend.</p>
      </div>

      {/* Equipped preview */}
      <div className="equipped-preview">
        <div className="equipped-label">ACTIVE SQUAD ({equippedCount}/5)</div>
        <div className="equipped-slots">
          {equippedUnitIds.map((unitId, i) => (
            <div key={i} className={`equipped-slot ${unitId ? 'filled' : 'empty'}`}>
              {unitId ? (
                <div className="equipped-unit-dot" style={{
                  background: getUnitColor(unitId),
                  boxShadow: `0 0 12px ${getUnitColor(unitId)}`,
                }} />
              ) : (
                <div className="empty-slot-icon">+</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="lobby-nav">
        <NavButton
          icon="⚔️"
          label="PLAY"
          description="Enter battle"
          highlight
          onClick={() => setScreen('modes')}
        />
        <NavButton
          icon="📦"
          label="UNITS"
          description={`${ownedUnits.length} collected`}
          onClick={() => setScreen('inventory')}
        />
        <NavButton
          icon="✨"
          label="SUMMON"
          description="Draw characters"
          onClick={() => setScreen('summon')}
        />
        <NavButton
          icon="🏪"
          label="SHOP"
          description="Buy resources"
          onClick={() => setScreen('shop')}
        />
        <NavButton
          icon="🎮"
          label="MODES"
          description="Choose mode"
          onClick={() => setScreen('modes')}
        />
      </nav>

      {/* Scrolling unit banner */}
      <div className="unit-banner">
        <div className="unit-banner-track">
          {UNIT_NAMES.concat(UNIT_NAMES).map((u, i) => (
            <div key={i} className="banner-unit" style={{ color: u.color }}>
              <span className="banner-dot" style={{ background: u.color, boxShadow: `0 0 8px ${u.color}` }} />
              {u.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper: get color for unit by id
function getUnitColor(unitId: string): string {
  const u = UNITS[unitId];
  if (!u) return '#888';
  return RARITY_COLORS[u.rarity];
}

function NavButton({ icon, label, description, highlight, onClick }: {
  icon: string; label: string; description: string; highlight?: boolean; onClick: () => void;
}) {
  return (
    <button className={`nav-btn ${highlight ? 'nav-btn-highlight' : ''}`} onClick={onClick}>
      <span className="nav-btn-icon">{icon}</span>
      <div className="nav-btn-text">
        <div className="nav-btn-label">{label}</div>
        <div className="nav-btn-desc">{description}</div>
      </div>
    </button>
  );
}

const UNIT_NAMES = [
  { name: 'Kai Blade', color: '#60A5FA' },
  { name: 'Mira Shieldheart', color: '#FCD34D' },
  { name: 'Ren Flashstep', color: '#E2E8F0' },
  { name: 'Akira Emberstorm', color: '#F97316' },
  { name: 'Sora Vantage', color: '#22D3EE' },
  { name: 'Ryu Voltclash', color: '#C084FC' },
  { name: 'Kage Nullshade', color: '#475569' },
  { name: 'Hikari Radiance', color: '#FAFAFA' },
  { name: 'Tetsu Ironcore', color: '#9CA3AF' },
  { name: 'Drakon Pyroclast', color: '#F97316' },
  { name: 'Chrona Eclipse', color: '#A78BFA' },
  { name: 'Astra Celestia', color: '#38BDF8' },
];
