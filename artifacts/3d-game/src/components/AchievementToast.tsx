import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { ACHIEVEMENTS } from '../data/achievements';

interface ToastItem {
  id: string;
  achievementId: string;
  exiting: boolean;
}

export default function AchievementToast() {
  const newAchievements = useGameStore(s => s.newAchievements);
  const dismissAchievement = useGameStore(s => s.dismissAchievement);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (newAchievements.length === 0) return;
    const newest = newAchievements[newAchievements.length - 1];
    const toastId = `${newest}-${Date.now()}`;
    setToasts(prev => [...prev, { id: toastId, achievementId: newest, exiting: false }]);
    dismissAchievement(newest);

    const exitTimer = setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === toastId ? { ...t, exiting: true } : t));
    }, 3200);
    const removeTimer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toastId));
    }, 3700);
    return () => { clearTimeout(exitTimer); clearTimeout(removeTimer); };
  }, [newAchievements.length]);

  if (toasts.length === 0) return null;

  return (
    <div className="achievement-toasts">
      {toasts.map((toast, idx) => {
        const ach = ACHIEVEMENTS[toast.achievementId];
        if (!ach) return null;
        return (
          <div
            key={toast.id}
            className={`achievement-toast ${toast.exiting ? 'exiting' : 'entering'}`}
            style={{ bottom: `${20 + idx * 84}px`, borderColor: ach.color }}
          >
            <div className="ach-icon" style={{ background: ach.color + '22', borderColor: ach.color }}>
              {ach.icon}
            </div>
            <div className="ach-content">
              <div className="ach-label">Achievement Unlocked!</div>
              <div className="ach-title" style={{ color: ach.color }}>{ach.title}</div>
              <div className="ach-desc">{ach.description}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
