// Twin Tales — Spot the Difference: score, combo and stars.
// One clear job: turn finds, misses and leftover time into numbers.

import { SCORE } from './config.js';

export class ScoreKeeper {
  constructor() {
    this.total = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.found = 0;
    this.misses = 0;
    this.levelStartScore = 0;
  }

  beginLevel() {
    this.levelStartScore = this.total;
    this.combo = 0;
    this.misses = 0;
  }

  // Called on a correct find. Returns the points awarded.
  awardFind() {
    this.combo += 1;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.found += 1;
    const multiplier = 1 + Math.min(this.combo - 1, 10) * SCORE.comboStep;
    const points = Math.round(SCORE.findBase * multiplier);
    this.total += points;
    return { points, combo: this.combo, multiplier };
  }

  // Called on a wrong click. Returns the penalty applied.
  awardMiss() {
    this.combo = 0;
    this.misses += 1;
    this.total = Math.max(0, this.total + SCORE.missPoints);
    return { points: SCORE.missPoints, timeLoss: SCORE.missTimeSeconds };
  }

  spendHint() {
    this.total = Math.max(0, this.total - SCORE.hintCost);
    return SCORE.hintCost;
  }

  // Called on level clear. Returns the bonus breakdown.
  awardLevelClear(secondsLeft) {
    const timeBonus = Math.round(secondsLeft) * SCORE.timeBonusPerSecond;
    const perfect = this.misses === 0 ? SCORE.perfectBonus : 0;
    this.total += timeBonus + perfect;
    return { timeBonus, perfect, total: this.total };
  }

  // Roll back to the score the level started with (retry after time-up).
  rewindLevel() {
    this.total = this.levelStartScore;
    this.combo = 0;
    this.misses = 0;
  }

  starsForLevel(secondsLeft, levelSeconds, misses) {
    const timeShare = secondsLeft / levelSeconds;
    if (misses === 0 && timeShare >= 0.3) return 3;
    if (misses <= 2 && timeShare >= 0.15) return 2;
    return 1;
  }
}
