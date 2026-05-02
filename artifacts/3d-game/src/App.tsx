// ============================================================
// APP — Main router between lobby, summon, inventory, game
// ============================================================

import Lobby3D from './components/Lobby3D';
import Summon from './components/Summon';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import Modes from './components/Modes';
import GameView from './components/GameView';
import { useGameStore } from './store/gameStore';

export default function App() {
  const { screen } = useGameStore();

  return (
    <div className="app-root">
      {screen === 'lobby' && <Lobby3D />}
      {screen === 'summon' && <Summon />}
      {screen === 'inventory' && <Inventory />}
      {screen === 'shop' && <Shop />}
      {screen === 'modes' && <Modes />}
      {screen === 'game' && <GameView />}
    </div>
  );
}
