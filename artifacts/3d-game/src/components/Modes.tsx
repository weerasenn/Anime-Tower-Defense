// ============================================================
// MODES — Game mode selection screen
// ============================================================

import { useGameStore, GameMode } from '../store/gameStore';

interface ModeInfo {
  id: GameMode;
  name: string;
  icon: string;
  description: string;
  details: string[];
  color: string;
  difficulty: string;
}

const MODES: ModeInfo[] = [
  {
    id: 'story',
    name: 'STORY MODE',
    icon: '📖',
    description: 'Journey through progressive levels with increasing difficulty.',
    details: [
      '20 lives to defend your base',
      'Boss battles every 5 waves',
      'Story-driven wave composition',
      'Earn coins & gems for progression',
    ],
    color: '#3B82F6',
    difficulty: 'NORMAL',
  },
  {
    id: 'infinite',
    name: 'INFINITE MODE',
    icon: '∞',
    description: 'Endless scaling waves. How long can you survive?',
    details: [
      'Waves scale infinitely',
      'Increasing enemy difficulty',
      'High score leaderboard',
      'Special rare drops at milestones',
    ],
    color: '#A855F7',
    difficulty: 'HARD',
  },
  {
    id: 'challenge',
    name: 'CHALLENGE MODE',
    icon: '⚡',
    description: 'Special modifiers make every run unique and brutal.',
    details: [
      'Half starting gold (150)',
      'Enemies move 50% faster',
      'Only 10 lives',
      'Triple gem rewards on clear',
    ],
    color: '#EF4444',
    difficulty: 'EXTREME',
  },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  NORMAL: '#4ADE80',
  HARD: '#F59E0B',
  EXTREME: '#EF4444',
};

export default function Modes() {
  const { setScreen, startGame, equippedUnitIds } = useGameStore();
  const equippedCount = equippedUnitIds.filter(Boolean).length;
  const canPlay = equippedCount > 0;

  return (
    <div className="modes-screen">
      <div className="modes-header">
        <button className="back-btn" onClick={() => setScreen('lobby')}>← Back</button>
        <h2 className="section-title">🎮 GAME MODES</h2>
      </div>

      {!canPlay && (
        <div className="no-units-warning">
          ⚠️ Equip at least 1 unit before playing!{' '}
          <button onClick={() => setScreen('inventory')} style={{ color: '#F59E0B', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
            Go to Inventory
          </button>
          {' '}or{' '}
          <button onClick={() => setScreen('summon')} style={{ color: '#A855F7', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
            Summon Units
          </button>
        </div>
      )}

      <div className="modes-grid">
        {MODES.map(mode => (
          <div key={mode.id} className="mode-card" style={{ borderColor: mode.color + '66' }}>
            <div className="mode-card-header" style={{ background: `linear-gradient(135deg, ${mode.color}22, transparent)` }}>
              <div className="mode-icon" style={{ color: mode.color }}>{mode.icon}</div>
              <div className="mode-info">
                <div className="mode-name" style={{ color: mode.color }}>{mode.name}</div>
                <div className="mode-difficulty" style={{ color: DIFFICULTY_COLORS[mode.difficulty] }}>
                  {mode.difficulty}
                </div>
              </div>
            </div>
            <div className="mode-description">{mode.description}</div>
            <ul className="mode-details">
              {mode.details.map((d, i) => (
                <li key={i} style={{ color: '#94A3B8' }}>
                  <span style={{ color: mode.color }}>•</span> {d}
                </li>
              ))}
            </ul>
            <button
              className={`mode-play-btn ${!canPlay ? 'disabled' : ''}`}
              style={canPlay ? { background: mode.color, boxShadow: `0 4px 20px ${mode.color}66` } : {}}
              onClick={() => canPlay && startGame(mode.id)}
              disabled={!canPlay}
            >
              {canPlay ? `▶ PLAY ${mode.name}` : 'Equip Units First'}
            </button>
          </div>
        ))}
      </div>

      {/* How to play */}
      <div className="how-to-play">
        <div className="htp-title">HOW TO PLAY</div>
        <div className="htp-steps">
          <div className="htp-step"><span className="htp-num">1</span> Click on the battlefield to place a unit</div>
          <div className="htp-step"><span className="htp-num">2</span> Units auto-attack enemies in range</div>
          <div className="htp-step"><span className="htp-num">3</span> Click a placed unit to use its ability</div>
          <div className="htp-step"><span className="htp-num">4</span> Earn gold by defeating enemies</div>
          <div className="htp-step"><span className="htp-num">5</span> Survive all waves to win!</div>
        </div>
      </div>
    </div>
  );
}
