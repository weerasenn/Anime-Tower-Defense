// ============================================================
// SHOP — Buy coins, gems, and resources
// ============================================================

import { useGameStore } from '../store/gameStore';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  costType: 'coins' | 'gems' | 'real';
  cost: number;
  reward: { coins?: number; gems?: number };
  tag?: string;
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'gems-sm', name: 'Crystal Shard', description: '10 Gems', icon: '💎', costType: 'coins', cost: 500, reward: { gems: 10 } },
  { id: 'gems-md', name: 'Crystal Bundle', description: '50 Gems', icon: '💎', costType: 'coins', cost: 2000, reward: { gems: 50 }, tag: 'POPULAR' },
  { id: 'gems-lg', name: 'Crystal Cache', description: '150 Gems', icon: '💎', costType: 'coins', cost: 5000, reward: { gems: 150 }, tag: 'BEST VALUE' },
  { id: 'coins-sm', name: 'Gold Pouch', description: '500 Coins', icon: '🪙', costType: 'gems', cost: 5, reward: { coins: 500 } },
  { id: 'coins-md', name: 'Gold Chest', description: '2000 Coins', icon: '🪙', costType: 'gems', cost: 15, reward: { coins: 2000 }, tag: 'VALUE' },
  { id: 'coins-lg', name: 'Gold Vault', description: '10000 Coins', icon: '🪙', costType: 'gems', cost: 60, reward: { coins: 10000 }, tag: 'BEST' },
];

const DAILY_BONUS = 200; // coins

export default function Shop() {
  const { profile, setScreen, addCoins, addGems, spendCoins, spendGems } = useGameStore();

  function handleBuy(item: ShopItem) {
    let success = false;
    if (item.costType === 'coins') success = spendCoins(item.cost);
    else if (item.costType === 'gems') success = spendGems(item.cost);
    else success = true; // real money — simulate for demo

    if (success) {
      if (item.reward.coins) addCoins(item.reward.coins);
      if (item.reward.gems) addGems(item.reward.gems);
    }
  }

  function handleDailyBonus() {
    addCoins(DAILY_BONUS);
    addGems(2);
  }

  return (
    <div className="shop-screen">
      <div className="shop-header">
        <button className="back-btn" onClick={() => setScreen('lobby')}>← Back</button>
        <h2 className="section-title">🏪 SHOP</h2>
        <div className="shop-currency">
          <div className="currency-badge coins">🪙 {profile.coins.toLocaleString()}</div>
          <div className="currency-badge gems">💎 {profile.gems.toLocaleString()}</div>
        </div>
      </div>

      {/* Daily bonus */}
      <div className="daily-bonus-card">
        <div className="daily-bonus-icon">🎁</div>
        <div className="daily-bonus-text">
          <div className="daily-bonus-title">DAILY BONUS</div>
          <div className="daily-bonus-desc">Claim 200 Coins + 2 Gems free!</div>
        </div>
        <button className="daily-bonus-btn" onClick={handleDailyBonus}>
          CLAIM
        </button>
      </div>

      <div className="shop-sections">
        {/* Gem packs */}
        <div className="shop-section">
          <div className="shop-section-title">💎 GEM PACKS</div>
          <div className="shop-items-grid">
            {SHOP_ITEMS.filter(i => i.reward.gems).map(item => (
              <ShopCard key={item.id} item={item} canAfford={
                item.costType === 'coins' ? profile.coins >= item.cost : profile.gems >= item.cost
              } onBuy={() => handleBuy(item)} />
            ))}
          </div>
        </div>

        {/* Coin packs */}
        <div className="shop-section">
          <div className="shop-section-title">🪙 COIN PACKS</div>
          <div className="shop-items-grid">
            {SHOP_ITEMS.filter(i => i.reward.coins).map(item => (
              <ShopCard key={item.id} item={item} canAfford={
                item.costType === 'coins' ? profile.coins >= item.cost : profile.gems >= item.cost
              } onBuy={() => handleBuy(item)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopCard({ item, canAfford, onBuy }: { item: ShopItem; canAfford: boolean; onBuy: () => void }) {
  const costIcon = item.costType === 'coins' ? '🪙' : '💎';
  return (
    <div className={`shop-card ${!canAfford ? 'shop-card-disabled' : ''}`}>
      {item.tag && <div className="shop-card-tag">{item.tag}</div>}
      <div className="shop-card-icon">{item.icon}</div>
      <div className="shop-card-name">{item.name}</div>
      <div className="shop-card-desc">{item.description}</div>
      <button
        className={`shop-card-btn ${!canAfford ? 'disabled' : ''}`}
        onClick={onBuy}
        disabled={!canAfford}
      >
        {costIcon} {item.cost.toLocaleString()}
      </button>
    </div>
  );
}
