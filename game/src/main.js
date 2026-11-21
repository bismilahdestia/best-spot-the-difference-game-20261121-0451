// Twin Tales — Spot the Difference: game state, loop and rules.
// One clear job: own the screens, the timer, the finds and the juice
// (shake, particles, floating scores), and wire input to scoring.

import { SCENE_W, SCENE_H, SCORE, TIMER, rankForScore } from './config.js';
import { LEVELS, totalDifferences } from './levels.js';
import { SoundBank } from './audio.js';
import { ScoreKeeper } from './scoring.js';
import { InputRouter, PANEL, panelScenePoint, hitDifference, pointInRect } from './input.js';
import {
  CANVAS_W,
  CANVAS_H,
  layoutButtons,
  drawScene,
  drawHud,
  drawParticles,
  drawFloatingTexts,
  drawMissFlashes,
  drawTitle,
  drawLevelClear,
  drawTimeUp,
  drawGameClear,
  drawPaused,
} from './render.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const sounds = new SoundBank();
const score = new ScoreKeeper();

const state = {
  screen: 'title', // title | playing | paused | levelClear | timeUp | gameClear
  levelIndex: 0,
  found: new Set(),
  markerAges: new Map(),
  timeLeft: 0,
  hintsLeft: SCORE.hintsPerLevel,
  muted: false,
  pausedFrom: null,
  now: 0,
  lastTickSecond: -1,
  toast: null,
  hint: { target: null, until: 0 },
  clearStars: 0,
  clearBonus: { timeBonus: 0, perfect: 0 },
  lastLevel: false,
  rankTitle: '',
  particles: [],
  floatingTexts: [],
  missFlashes: [],
  trauma: 0,
  shakeTime: 0,
};

function level() {
  return LEVELS[state.levelIndex];
}

function modSet() {
  return new Set(level().diffs.map((d) => d.id));
}

function showToast(text, good, seconds = 1.6) {
  state.toast = { text, good, until: state.now + seconds };
}

function addTrauma(amount) {
  state.trauma = Math.min(1, state.trauma + amount);
}

function shakeOffset() {
  const shake = state.trauma * state.trauma;
  if (shake <= 0) return { x: 0, y: 0 };
  const t = state.shakeTime * 30;
  return {
    x: 12 * shake * Math.sin(t * 1.7),
    y: 8 * shake * Math.sin(t * 2.3),
  };
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 40 + Math.random() * 120;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 30,
      size: 2 + Math.random() * 3.5,
      color,
      life: 0.6 + Math.random() * 0.3,
      maxLife: 0.9,
    });
  }
}

function floatText(x, y, text, color) {
  state.floatingTexts.push({ x, y, text, color, life: 1.1, maxLife: 1.1 });
}

function startLevel(index) {
  state.levelIndex = index;
  state.found = new Set();
  state.markerAges = new Map();
  state.timeLeft = level().timeSeconds;
  state.hintsLeft = SCORE.hintsPerLevel;
  state.hint = { target: null, until: 0 };
  state.lastTickSecond = -1;
  score.beginLevel();
  state.screen = 'playing';
  showToast(`${level().name} — find ${level().diffs.length} differences!`, true, 2.2);
}

function startGame() {
  score.total = 0;
  score.found = 0;
  score.misses = 0;
  score.bestCombo = 0;
  startLevel(0);
}

function onFind(diff) {
  state.found.add(diff.id);
  state.markerAges.set(diff.id, 0);
  const award = score.awardFind();
  sounds.pop(award.combo);
  addTrauma(0.25);
  const px = PANEL.left.x + diff.x;
  const py = PANEL.left.y + diff.y;
  burst(px, py, '#7dff9e', 14);
  burst(PANEL.right.x + diff.x, PANEL.right.y + diff.y, '#7dff9e', 14);
  floatText(px, py - 36, `+${award.points}`, '#7dff9e');
  showToast(`${diff.label}!  +${award.points}${award.combo >= 2 ? `  ·  combo ×${award.combo}` : ''}`, true);
  if (state.found.size === level().diffs.length) {
    levelCleared();
  }
}

function levelCleared() {
  const bonus = score.awardLevelClear(state.timeLeft);
  state.clearBonus = bonus;
  state.clearStars = score.starsForLevel(state.timeLeft, level().timeSeconds, score.misses);
  state.lastLevel = state.levelIndex === LEVELS.length - 1;
  sounds.levelClear();
  addTrauma(0.4);
  state.screen = 'levelClear';
}

function onMiss(point) {
  const penalty = score.awardMiss();
  sounds.miss();
  addTrauma(0.7);
  state.timeLeft = Math.max(0, state.timeLeft - penalty.timeLoss);
  state.missFlashes.push({ x: point.x, y: point.y, life: 0.6, maxLife: 0.6 });
  showToast(`Not there!  ${penalty.points} points, −${penalty.timeLoss}s`, false);
  if (state.timeLeft <= 0) timeUp();
}

function timeUp() {
  score.rewindLevel();
  sounds.miss();
  state.screen = 'timeUp';
}

function useHint() {
  if (state.screen !== 'playing') return;
  if (state.hintsLeft <= 0) {
    showToast('No hints left on this level', false);
    return;
  }
  const remaining = level().diffs.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  const target = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintsLeft -= 1;
  score.spendHint();
  state.hint = { target, until: state.now + TIMER.hintPulseSeconds };
  sounds.hint();
  showToast(`Hint: look near the ${target.label.toLowerCase()}  (−${SCORE.hintCost} pts)`, true, 2.2);
}

function togglePause() {
  if (state.screen === 'playing') {
    state.screen = 'paused';
    state.pausedFrom = 'playing';
  } else if (state.screen === 'paused') {
    state.screen = 'playing';
  }
}

function toggleMute() {
  state.muted = sounds.toggleMute();
}

function confirm() {
  if (state.screen === 'title') startGame();
  else if (state.screen === 'levelClear') nextAfterClear();
  else if (state.screen === 'timeUp') startLevel(state.levelIndex);
  else if (state.screen === 'gameClear') startGame();
  else if (state.screen === 'paused') togglePause();
}

function nextAfterClear() {
  if (state.lastLevel) {
    state.rankTitle = rankForScore(score.total);
    state.screen = 'gameClear';
  } else {
    startLevel(state.levelIndex + 1);
  }
}

function handleClick(point) {
  sounds.ensure();
  const buttons = layoutButtons(state.screen, {
    ...state,
    score,
    muted: state.muted,
    lastLevel: state.lastLevel,
  });
  for (const key of Object.keys(buttons)) {
    if (pointInRect(point, buttons[key])) {
      sounds.click();
      if (key === 'start' || key === 'again') startGame();
      else if (key === 'next') nextAfterClear();
      else if (key === 'retry') startLevel(state.levelIndex);
      else if (key === 'hint') useHint();
      else if (key === 'pause') togglePause();
      else if (key === 'mute') toggleMute();
      else if (key === 'resume') togglePause();
      else if (key === 'restart') startLevel(state.levelIndex);
      return;
    }
  }
  if (state.screen !== 'playing') return;
  // Either panel counts; a click on a panel edge that hits no difference is a miss.
  for (const panel of [PANEL.left, PANEL.right]) {
    const scenePoint = panelScenePoint(panel, point.x, point.y);
    if (!scenePoint) continue;
    const diff = hitDifference(level(), state.found, scenePoint);
    if (diff) {
      onFind(diff);
    } else if (level().diffs.some((d) => {
      const dx = scenePoint.x - d.x;
      const dy = scenePoint.y - d.y;
      return dx * dx + dy * dy <= d.r * d.r;
    })) {
      // Clicking a difference already found: acknowledge, no penalty.
      sounds.click();
    } else {
      onMiss(point);
    }
    return;
  }
}

new InputRouter(canvas, {
  click: handleClick,
  hint: useHint,
  pause: togglePause,
  mute: toggleMute,
  confirm,
});

// ------------------------------------------------------------ screenshot hooks
// ?shot=start  → title screen
// ?shot=play   → level 3 mid-hunt: 3 found (marked), 4 still hidden, counter live
// ?shot=end    → level-clear card for level 3
function applyShotParam() {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (shot === 'play' || shot === 'end') {
    startLevel(2);
    const village = LEVELS[2];
    const preFound = village.diffs.slice(0, 3);
    for (const diff of preFound) {
      state.found.add(diff.id);
      state.markerAges.set(diff.id, 1);
    }
    score.total = 3300; // 1000 + 1100 + 1200: three finds with combo.
    score.combo = 3;
    score.found = 3;
    state.timeLeft = 64;
    state.toast = null;
    if (shot === 'end') {
      score.total = 6440; // 3300 + 3200 time bonus, one slip so no perfect bonus.
      score.misses = 1;
      state.clearBonus = { timeBonus: 64 * SCORE.timeBonusPerSecond, perfect: 0 };
      state.clearStars = 2;
      state.lastLevel = false;
      state.screen = 'levelClear';
    }
  }
}

// --------------------------------------------------------------------- loop
let lastTimestamp = 0;

function frame(timestamp) {
  const dt = Math.min(0.1, (timestamp - lastTimestamp) / 1000 || 0);
  lastTimestamp = timestamp;
  state.now = timestamp / 1000;
  state.shakeTime += dt;
  state.trauma = Math.max(0, state.trauma - 1.4 * dt);

  if (state.screen === 'playing') {
    state.timeLeft -= dt;
    const whole = Math.ceil(state.timeLeft);
    if (state.timeLeft <= TIMER.dangerSeconds && whole !== state.lastTickSecond && state.timeLeft > 0) {
      state.lastTickSecond = whole;
      sounds.tick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      timeUp();
    }
  }

  for (const [id, age] of state.markerAges) state.markerAges.set(id, age + dt);
  for (const p of state.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 160 * dt;
    p.life -= dt;
  }
  state.particles = state.particles.filter((p) => p.life > 0);
  for (const t of state.floatingTexts) {
    t.y -= 34 * dt;
    t.life -= dt;
  }
  state.floatingTexts = state.floatingTexts.filter((t) => t.life > 0);
  for (const f of state.missFlashes) f.life -= dt;
  state.missFlashes = state.missFlashes.filter((f) => f.life > 0);

  // ---- draw
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#1b1930';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  if (state.screen === 'title') {
    drawTitle(ctx, state);
  } else {
    drawScene(ctx, level(), modSet(), state.found, state.markerAges, state.hint, state.now, shakeOffset());
    drawHud(ctx, { ...state, score });
    drawParticles(ctx, state.particles);
    drawFloatingTexts(ctx, state.floatingTexts);
    drawMissFlashes(ctx, state.missFlashes);
    if (state.screen === 'levelClear') drawLevelClear(ctx, { ...state, score });
    else if (state.screen === 'timeUp') drawTimeUp(ctx, { ...state, score });
    else if (state.screen === 'gameClear') drawGameClear(ctx, { ...state, score });
    else if (state.screen === 'paused') drawPaused(ctx, state);
  }

  if (!window.__shotReady) window.__shotReady = true;
  requestAnimationFrame(frame);
}

// Read-only debug hook for automated playtests (and curious players).
window.__twinTales = {
  get screen() { return state.screen; },
  get level() { return state.levelIndex + 1; },
  get found() { return state.found.size; },
  get total() { return level().diffs.length; },
  get score() { return score.total; },
  get combo() { return score.combo; },
  get hintsLeft() { return state.hintsLeft; },
  get timeLeft() { return Math.ceil(state.timeLeft); },
  get misses() { return score.misses; },
};

applyShotParam();
requestAnimationFrame(frame);
