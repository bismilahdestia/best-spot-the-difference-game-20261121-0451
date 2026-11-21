// Twin Tales — Spot the Difference: everything the player sees.
// One clear job: draw the HUD, both scene panels, markers, particles and
// the overlay screens on the game's single canvas.

import { SCENE_W, SCENE_H, formatScore, formatTime, TIMER } from './config.js';
import { PANEL } from './input.js';
import { LEVELS } from './levels.js';

export const CANVAS_W = 1280;
export const CANVAS_H = 800;

const INK = '#f5efe0';
const INK_DIM = '#b8b0a0';
const ACCENT = '#ffd76a';
const GOOD = '#7dff9e';
const BAD = '#ff5d6c';

// Buttons the input router hit-tests, per screen.
export function layoutButtons(screen, state) {
  const buttons = {};
  if (screen === 'title') {
    buttons.start = { x: 490, y: 560, w: 300, h: 64, label: '▶  START THE HUNT' };
  } else if (screen === 'playing') {
    buttons.hint = { x: 1000, y: 92, w: 118, h: 36, label: `HINT  (${state.hintsLeft})  [H]` };
    buttons.pause = { x: 1128, y: 92, w: 48, h: 36, label: '❚❚' };
    buttons.mute = { x: 1186, y: 92, w: 70, h: 36, label: state.muted ? '✕' : '♪' };
  } else if (screen === 'levelClear') {
    buttons.next = { x: 490, y: 560, w: 300, h: 64, label: state.lastLevel ? 'SEE YOUR RANK' : 'NEXT LEVEL  ▶' };
  } else if (screen === 'timeUp') {
    buttons.retry = { x: 490, y: 560, w: 300, h: 64, label: '↻  TRY THIS LEVEL AGAIN' };
  } else if (screen === 'gameClear') {
    buttons.again = { x: 490, y: 560, w: 300, h: 64, label: '↻  PLAY AGAIN' };
  } else if (screen === 'paused') {
    buttons.resume = { x: 490, y: 460, w: 300, h: 64, label: '▶  RESUME' };
    buttons.restart = { x: 490, y: 544, w: 300, h: 56, label: 'RESTART LEVEL' };
  }
  return buttons;
}

function drawButton(ctx, button, enabled = true) {
  ctx.fillStyle = enabled ? ACCENT : '#5a5348';
  ctx.beginPath();
  ctx.roundRect(button.x, button.y, button.w, button.h, 12);
  ctx.fill();
  ctx.fillStyle = '#2b2b3a';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(button.label, button.x + button.w / 2, button.y + button.h / 2 + 1);
  ctx.textBaseline = 'alphabetic';
}

function drawPill(ctx, x, y, w, h, text, fill, ink) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fill();
  ctx.fillStyle = ink;
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
  ctx.textBaseline = 'alphabetic';
}

function drawFoundMarker(ctx, x, y, age) {
  // Overshoot pop, then settle: the satisfying mark on every find.
  const pop = age < 0.22 ? 1 + 0.5 * Math.sin((age / 0.22) * Math.PI) : 1;
  const r = 26 * pop;
  ctx.strokeStyle = GOOD;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = GOOD;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.lineTo(x - 3, y + 9);
  ctx.lineTo(x + 12, y - 9);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

export function drawScene(ctx, level, mods, found, markerAges, hint, time, shake = { x: 0, y: 0 }) {
  ctx.save();
  ctx.translate(shake.x, shake.y);
  for (const [panel, label] of [[PANEL.left, 'ORIGINAL'], [PANEL.right, 'SPOT THE DIFFERENCES']]) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(panel.x, panel.y, PANEL.w, PANEL.h);
    ctx.clip();
    ctx.save();
    ctx.translate(panel.x, panel.y);
    const panelMods = panel === PANEL.left ? new Set() : mods;
    level.paint(ctx, SCENE_W, SCENE_H, panelMods);
    ctx.restore();
    ctx.restore();
    // Frame.
    ctx.strokeStyle = '#3d3a4e';
    ctx.lineWidth = 4;
    ctx.strokeRect(panel.x, panel.y, PANEL.w, PANEL.h);
    // Label.
    ctx.fillStyle = INK_DIM;
    ctx.font = 'bold 14px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, panel.x + PANEL.w / 2, panel.y - 12);
    // Found markers on both panels.
    for (const diff of level.diffs) {
      if (!found.has(diff.id)) continue;
      for (const p of [PANEL.left, PANEL.right]) {
        drawFoundMarker(ctx, p.x + diff.x, p.y + diff.y, markerAges.get(diff.id) ?? 1);
      }
    }
    // Hint pulse on both panels.
    if (hint.target && time < hint.until) {
      const pulse = 1 + 0.25 * Math.sin(time * 10);
      ctx.strokeStyle = ACCENT;
      ctx.setLineDash([8, 6]);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(panel.x + hint.target.x, panel.y + hint.target.y, 30 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  ctx.restore();
}

export function drawHud(ctx, state) {
  const level = LEVELS[state.levelIndex];
  // Header.
  ctx.fillStyle = INK;
  ctx.font = 'bold 26px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('TWIN TALES', 40, 44);
  ctx.fillStyle = INK_DIM;
  ctx.font = '15px Georgia, serif';
  ctx.fillText('spot the difference', 40, 66);
  // Level name, centre.
  ctx.fillStyle = INK;
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(`LEVEL ${state.levelIndex + 1} · ${level.name.toUpperCase()}`, 640, 40);
  ctx.fillStyle = INK_DIM;
  ctx.font = '14px Georgia, serif';
  ctx.fillText(level.subtitle, 640, 62);
  // Score, right, six digits.
  ctx.fillStyle = ACCENT;
  ctx.font = 'bold 30px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(formatScore(state.score.total), 1240, 46);
  ctx.fillStyle = INK_DIM;
  ctx.font = '13px Georgia, serif';
  ctx.fillText('SCORE', 1240, 66);
  // Timer bar (shortened so it never runs under the FOUND pill).
  const barX = 40;
  const barY = 84;
  const barW = 500;
  const barH = 16;
  const share = Math.max(0, state.timeLeft / level.timeSeconds);
  ctx.fillStyle = '#2b2b3a';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 8);
  ctx.fill();
  const danger = state.timeLeft <= TIMER.dangerSeconds;
  ctx.fillStyle = danger ? BAD : GOOD;
  if (share > 0) {
    ctx.beginPath();
    ctx.roundRect(barX, barY, Math.max(16, barW * share), barH, 8);
    ctx.fill();
  }
  ctx.fillStyle = danger ? BAD : INK;
  ctx.font = 'bold 18px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`⏱ ${formatTime(state.timeLeft)}`, barX, barY + barH + 22);
  // Found counter pill.
  const foundCount = state.found.size;
  const total = level.diffs.length;
  drawPill(ctx, 560, 92, 190, 36, `FOUND  ${foundCount} / ${total}`, '#2fbf71', '#ffffff');
  // Combo pill.
  if (state.score.combo >= 2) {
    drawPill(ctx, 770, 92, 150, 36, `COMBO ×${(1 + Math.min(state.score.combo - 1, 10) * 0.1).toFixed(1)}`, '#e4572e', '#ffffff');
  }
  // HUD buttons.
  const buttons = layoutButtons('playing', state);
  drawButton(ctx, buttons.hint, state.hintsLeft > 0);
  drawButton(ctx, buttons.pause);
  drawButton(ctx, buttons.mute);
  // Bottom hint line.
  ctx.fillStyle = INK_DIM;
  ctx.font = '15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Click a difference on either picture  ·  wrong clicks cost 250 points and 3 seconds  ·  H = hint,  P = pause,  M = sound', 640, 606);
  // Toast message.
  if (state.toast && state.toast.until > state.now) {
    ctx.globalAlpha = Math.min(1, (state.toast.until - state.now) / 0.4);
    ctx.fillStyle = state.toast.good ? GOOD : BAD;
    ctx.font = 'bold 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.toast.text, 640, 648);
    ctx.globalAlpha = 1;
  }
}

export function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawFloatingTexts(ctx, texts) {
  for (const t of texts) {
    ctx.globalAlpha = Math.max(0, t.life / t.maxLife);
    ctx.fillStyle = t.color;
    ctx.font = 'bold 24px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(t.text, t.x, t.y);
  }
  ctx.globalAlpha = 1;
}

export function drawMissFlashes(ctx, flashes) {
  for (const f of flashes) {
    ctx.globalAlpha = Math.max(0, f.life / f.maxLife);
    ctx.strokeStyle = BAD;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const s = 12;
    ctx.beginPath();
    ctx.moveTo(f.x - s, f.y - s);
    ctx.lineTo(f.x + s, f.y + s);
    ctx.moveTo(f.x + s, f.y - s);
    ctx.lineTo(f.x - s, f.y + s);
    ctx.stroke();
    ctx.lineCap = 'butt';
  }
  ctx.globalAlpha = 1;
}

function overlayCard(ctx, title, lines, accent) {
  ctx.fillStyle = 'rgba(20, 18, 32, 0.82)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#262338';
  ctx.beginPath();
  ctx.roundRect(290, 130, 700, 500, 20);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(290, 130, 700, 500, 20);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.font = 'bold 40px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 640, 210);
  ctx.fillStyle = INK;
  ctx.font = '19px Georgia, serif';
  let y = 268;
  for (const lineText of lines) {
    ctx.fillText(lineText, 640, y);
    y += 34;
  }
  return y;
}

export function drawTitle(ctx, state) {
  // Backdrop: the first scene, gently dimmed, so the title shows the game.
  const level = LEVELS[0];
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.translate(40, 148);
  level.paint(ctx, SCENE_W, SCENE_H, new Set());
  ctx.restore();
  ctx.save();
  ctx.translate(680, 148);
  level.paint(ctx, SCENE_W, SCENE_H, new Set(level.diffs.map((d) => d.id)));
  ctx.restore();
  ctx.fillStyle = 'rgba(20, 18, 32, 0.55)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = ACCENT;
  ctx.font = 'bold 64px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('TWIN TALES', 640, 150);
  ctx.fillStyle = INK;
  ctx.font = '26px Georgia, serif';
  ctx.fillText('— Spot the Difference —', 640, 196);
  ctx.font = '19px Georgia, serif';
  ctx.fillText('Two pictures. A handful of sneaky changes. Find them all before the clock runs out.', 640, 250);
  ctx.fillText('Five hand-painted scenes · 36 differences · hints, combos and a six-digit score', 640, 284);
  ctx.fillStyle = INK_DIM;
  ctx.font = '16px Georgia, serif';
  ctx.fillText('Click a difference on either picture  ·  H = hint   P = pause   M = sound   Enter = start', 640, 330);
  const buttons = layoutButtons('title', state);
  drawButton(ctx, buttons.start);
  ctx.fillStyle = INK_DIM;
  ctx.font = '14px Georgia, serif';
  ctx.fillText('An original game — every scene painted in code, no borrowed art.', 640, 680);
}

export function drawLevelClear(ctx, state) {
  const level = LEVELS[state.levelIndex];
  const stars = '★'.repeat(state.clearStars) + '☆'.repeat(3 - state.clearStars);
  const y = overlayCard(
    ctx,
    'LEVEL CLEAR!',
    [
      `${level.name} — all ${level.diffs.length} differences found`,
      `Time bonus  +${state.clearBonus.timeBonus}`,
      state.clearBonus.perfect > 0 ? `Perfect level  +${state.clearBonus.perfect}` : 'A few slips — no perfect bonus this time',
      `Score  ${formatScore(state.score.total)}`,
    ],
    GOOD,
  );
  ctx.fillStyle = ACCENT;
  ctx.font = '44px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(stars, 640, y + 46);
  const buttons = layoutButtons('levelClear', state);
  drawButton(ctx, buttons.next);
}

export function drawTimeUp(ctx, state) {
  const level = LEVELS[state.levelIndex];
  overlayCard(
    ctx,
    "TIME'S UP!",
    [
      `${level.name} — you found ${state.found.size} of ${level.diffs.length} differences`,
      'The clock beat you this time. The level restarts with',
      'your score kept from before it began.',
    ],
    BAD,
  );
  const buttons = layoutButtons('timeUp', state);
  drawButton(ctx, buttons.retry);
}

export function drawGameClear(ctx, state) {
  const y = overlayCard(
    ctx,
    'YOU FOUND THEM ALL!',
    [
      `All 5 scenes cleared · ${state.score.found} differences found`,
      `Best combo ×${state.score.bestCombo}  ·  ${state.score.misses} wrong clicks`,
      `Final score  ${formatScore(state.score.total)}`,
      `Rank: ${state.rankTitle}`,
    ],
    ACCENT,
  );
  ctx.fillStyle = INK_DIM;
  ctx.font = '16px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Thanks for playing Twin Tales — every scene was painted in code.', 640, y + 40);
  const buttons = layoutButtons('gameClear', state);
  drawButton(ctx, buttons.again);
}

export function drawPaused(ctx, state) {
  overlayCard(ctx, 'PAUSED', ['Take a breath. The clock is stopped.', 'P = resume   ·   M = sound'], INK_DIM);
  const buttons = layoutButtons('paused', state);
  drawButton(ctx, buttons.resume);
  drawButton(ctx, buttons.restart);
}
