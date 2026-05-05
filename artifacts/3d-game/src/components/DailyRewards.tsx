// ============================================================
// DAILY REWARDS — 7-day calendar reward system
// ============================================================

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { DAILY_REWARDS, TRAIT_RARITY_COLORS } from '../data/traits';

export default function DailyRewards() {
  const { setScreen, profile, claimDailyReward, dailyRewardDay, lastDailyRewardClaim } = useGameStore();
  const [claimed, setClaimed] = useState(false);
  const [claimResult, setClaimResult] = useState<{ coins: number; gems: number; trait?: string } | null>(null);

  const now = Date.now();
  const lastClaim = lastDailyRewardClaim ?? 0;
  const MS_PER_DAY = 86400000;
  const canClaim = now - lastClaim >= MS_PER_DAY;
  const currentDay = ((dailyRewardDay ?? 1) - 1) % 7; // 0-indexed
  const todayReward = DAILY_REWARDS[currentDay];

  const msUntilNext = MS_PER_DAY - (now - lastClaim);
  const hoursLeft = Math.floor(msUntilNext / 3600000);
  const minsLeft = Math.floor((msUntilNext % 3600000) / 60000);

  function handleClaim() {
    const result = claimDailyReward();
    if (result) {
      setClaimed(true);
      setClaimResult(result);
    }
  }

  return (
    <div className="daily-screen">
      <div className="daily-header">
        <button className="back-btn" onClick={() => setScreen('lobby')}>← Back</button>
        <h2 className="section-title">📅 DAILY REWARDS</h2>
        <div className="daily-streak">
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{dailyRewardDay ?? 1} Day Streak</span>
        </div>
      </div>

      {/* Claim result flash */}
      {claimed && claimResult && (
        <div className="claim-flash">
          <div className="claim-flash-inner">
            <div className="claim-flash-title">🎉 REWARD CLAIMED!</div>
            <div className="claim-flash-rewards">
              {claimResult.coins > 0 && <div className="claim-reward-item">🪙 +{claimResult.coins.toLocaleString()} Coins</div>}
              {claimResult.gems > 0 && <div className="claim-reward-item">💎 +{claimResult.gems} Gems</div>}
              {claimResult.trait && (
                <div className="claim-reward-item" style={{ color: '#A855F7' }}>✨ Trait Unlocked!</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7-day calendar grid */}
      <div className="daily-calendar">
        {DAILY_REWARDS.map((reward, i) => {
          const dayNum = i + 1;
          const isPast = (dailyRewardDay ?? 1) > dayNum;
          const isCurrent = (dailyRewardDay ?? 1) === dayNum;
          const isFuture = (dailyRewardDay ?? 1) < dayNum;
          const isGrandDay = dayNum === 7;

          return (
            <div
              key={dayNum}
              className={`daily-day-card ${isPast ? 'day-past' : ''} ${isCurrent ? 'day-current' : ''} ${isFuture ? 'day-future' : ''} ${isGrandDay ? 'day-grand' : ''}`}
            >
              {isPast && <div className="day-check">✓</div>}
              <div className="day-num">Day {dayNum}</div>
              <div className="day-icon">{isGrandDay ? '🏆' : reward.traitRarity ? '✨' : '🎁'}</div>
              <div className="day-coins">🪙 {reward.coins.toLocaleString()}</div>
              <div className="day-gems">💎 {reward.gems}</div>
              {reward.traitRarity && (
                <div
                  className="day-trait"
                  style={{
                    color: reward.traitRarity === 'secret' ? '#E879F9' : TRAIT_RARITY_COLORS[reward.traitRarity],
                  }}
                >
                  {reward.traitRarity.toUpperCase()} TRAIT
                </div>
              )}
              {isCurrent && (
                <div className="day-today-badge">TODAY</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Today's reward highlight */}
      <div className="daily-today">
        <div className="today-title">TODAY'S REWARD — DAY {(dailyRewardDay ?? 1)}</div>
        <div className="today-details">
          <div className="today-reward">🪙 {todayReward.coins.toLocaleString()} Coins</div>
          <div className="today-reward">💎 {todayReward.gems} Gems</div>
          {todayReward.traitRarity && (
            <div
              className="today-reward today-trait"
              style={{
                color: TRAIT_RARITY_COLORS[todayReward.traitRarity],
              }}
            >
              ✨ {todayReward.traitRarity.toUpperCase()} TRAIT
            </div>
          )}
        </div>

        {canClaim && !claimed ? (
          <button className="claim-btn" onClick={handleClaim}>
            🎁 CLAIM REWARD
          </button>
        ) : claimed ? (
          <div className="claimed-badge">✓ CLAIMED TODAY</div>
        ) : (
          <div className="next-claim-timer">
            <div className="timer-label">Next reward in</div>
            <div className="timer-value">{hoursLeft}h {minsLeft}m</div>
          </div>
        )}
      </div>

      {/* Profile currencies */}
      <div className="daily-currencies">
        <div className="currency-badge coins">🪙 {profile.coins.toLocaleString()}</div>
        <div className="currency-badge gems">💎 {profile.gems.toLocaleString()}</div>
      </div>
    </div>
  );
}
