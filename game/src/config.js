// Twin Tales — Spot the Difference: tuning constants and scoring rules.
// One clear job: every number the game balances on lives here.

export const SCENE_W = 560;
export const SCENE_H = 420;

export const SCORE = {
  // Base points for each difference found.
  findBase: 1000,
  // Combo step: each consecutive find without a miss adds 10% (cap +100%).
  comboStep: 0.1,
  comboCap: 1.0,
  // Wrong click penalty.
  missPoints: -250,
  missTimeSeconds: 3,
  // Hint costs points and is limited per level.
  hintCost: 300,
  hintsPerLevel: 3,
  // Time bonus at level clear: points per second left.
  timeBonusPerSecond: 50,
  // Perfect-level bonus (no misses in the level).
  perfectBonus: 1500,
};

export const TIMER = {
  // Seconds under which the bar turns red and the tick sound starts.
  dangerSeconds: 20,
  // Seconds a hint pulse stays visible.
  hintPulseSeconds: 2,
};

export const RANKS = [
  { min: 60000, title: 'GRAND MASTER OF DIFFERENCES' },
  { min: 40000, title: 'EAGLE EYE' },
  { min: 25000, title: 'SHARP EYE' },
  { min: 12000, title: 'KEEN SPOTTER' },
  { min: 0, title: 'ROOKIE SPOTTER' },
];

export function rankForScore(score) {
  for (const rank of RANKS) {
    if (score >= rank.min) return rank.title;
  }
  return RANKS[RANKS.length - 1].title;
}

// Six-digit score display, e.g. 012340.
export function formatScore(score) {
  const clamped = Math.max(0, Math.floor(score));
  return String(clamped).padStart(6, '0');
}

export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}
