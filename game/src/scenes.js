// Twin Tales — Spot the Difference: the five hand-painted scenes.
// One clear job: paint a scene on a canvas. Each painter takes `mods`, a Set
// of difference ids; the left panel calls it with an empty set, the right
// panel with the level's ids, so the two pictures differ only where a
// difference says so. All art is original procedural vector work.

import { circle, ellipse, rect, roundRect, poly, line, star, cloud, gull, pine, windowGlow } from './draw.js';
import { makeRng, range } from './random.js';

// ---------------------------------------------------------------- Harbor Dawn
export function paintHarbor(ctx, W, H, mods) {
  const sky = ctx.createLinearGradient(0, 0, 0, 260);
  sky.addColorStop(0, '#7ec8e3');
  sky.addColorStop(0.7, '#ffd9a0');
  sky.addColorStop(1, '#ffb27a');
  rect(ctx, 0, 0, W, 260, sky);
  // Sun with rays.
  circle(ctx, 92, 72, 34, '#ffdf5e');
  ctx.strokeStyle = '#ffdf5e';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    line(ctx, 92 + Math.cos(a) * 42, 72 + Math.sin(a) * 42, 92 + Math.cos(a) * 54, 72 + Math.sin(a) * 54, '#ffdf5e', 4);
  }
  cloud(ctx, 290, 62, 1, 'rgba(255,255,255,0.9)');
  cloud(ctx, 430, 118, 0.7, 'rgba(255,255,255,0.8)');
  gull(ctx, 205, 82, 1, '#33415c');
  gull(ctx, 335, 56, 1, '#33415c');
  if (mods.has('gull-extra')) gull(ctx, 438, 76, 1, '#33415c');
  // Sea.
  const sea = ctx.createLinearGradient(0, 250, 0, H);
  sea.addColorStop(0, '#3a86c8');
  sea.addColorStop(1, '#1d5c8f');
  rect(ctx, 0, 250, W, H - 250, sea);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  for (const [x, y, w] of [[40, 290, 60], [180, 320, 80], [330, 300, 70], [440, 350, 80], [90, 370, 70]]) {
    ctx.beginPath();
    ctx.arc(x, y, w / 2, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  }
  // Rocky lighthouse island, right side.
  poly(ctx, [[440, 252], [470, 190], [500, 190], [530, 252]], '#8d7d6b');
  // Lighthouse tower with stripes; one stripe changes colour in the variant.
  rect(ctx, 462, 118, 34, 76, '#f5f0e6');
  rect(ctx, 462, 140, 34, 14, mods.has('lighthouse-stripe') ? '#2fbf71' : '#e4572e');
  rect(ctx, 462, 168, 34, 14, '#e4572e');
  rect(ctx, 458, 104, 42, 16, '#33415c');
  circle(ctx, 479, 112, 12, '#ffe66d');
  line(ctx, 479, 104, 479, 92, '#33415c', 3);
  circle(ctx, 479, 90, 4, '#e4572e');
  // Wooden dock, left side, with crates; one crate vanishes in the variant.
  rect(ctx, 18, 296, 170, 12, '#8a5a33');
  rect(ctx, 30, 308, 8, 44, '#6e4525');
  rect(ctx, 168, 308, 8, 44, '#6e4525');
  rect(ctx, 52, 262, 34, 34, '#c98f4e');
  rect(ctx, 52, 262, 34, 6, '#a9713a');
  rect(ctx, 96, 268, 28, 28, '#b57a3e');
  if (!mods.has('crate-missing')) {
    rect(ctx, 138, 264, 32, 32, '#d9a05b');
    rect(ctx, 138, 264, 32, 6, '#b57a3e');
  }
  // Sailboat, centre.
  poly(ctx, [[238, 318], [318, 318], [306, 336], [250, 336]], '#7a3b2e');
  line(ctx, 278, 318, 278, 238, '#5b2d22', 5);
  poly(ctx, [[282, 244], [282, 312], [326, 312]], mods.has('sail-color') ? '#ff7f6b' : '#fff8e7');
  poly(ctx, [[274, 258], [274, 312], [240, 312]], '#ffe9b0');
  circle(ctx, 278, 234, 5, '#ffd76a');
  // A jumping fish; the variant adds a second one.
  ctx.strokeStyle = '#123';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(352, 268, 12, Math.PI, 0);
  ctx.fillStyle = '#9fd8ef';
  ctx.fill();
  poly(ctx, [[364, 262], [374, 256], [364, 270]], '#9fd8ef');
  if (mods.has('fish-jump')) {
    ctx.beginPath();
    ctx.arc(398, 282, 9, Math.PI, 0);
    ctx.fillStyle = '#9fd8ef';
    ctx.fill();
    poly(ctx, [[407, 278], [415, 273], [407, 284]], '#9fd8ef');
  }
}

// --------------------------------------------------------------- Night Market
export function paintMarket(ctx, W, H, mods) {
  rect(ctx, 0, 0, W, H, '#1b1f3b');
  // Stars; one is missing in the variant.
  const rng = makeRng(77);
  for (let i = 0; i < 26; i++) {
    const x = range(rng, 12, W - 12);
    const y = range(rng, 10, 150);
    if (mods.has('star-missing') && i === 17) continue;
    star(ctx, x, y, range(rng, 2, 4.5), 'rgba(255,240,180,0.9)', 4);
  }
  // Moon.
  circle(ctx, 84, 62, 30, '#f4ead5');
  circle(ctx, 74, 54, 7, '#ddd0b2');
  circle(ctx, 94, 72, 5, '#ddd0b2');
  // String lights across the top.
  ctx.strokeStyle = '#0f1226';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(W / 2, 70, W, 28);
  ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const x = 30 + i * 60;
    const y = 30 + Math.sin((i / 8) * Math.PI) * 34;
    circle(ctx, x, y + 8, 7, ['#ff5d8f', '#ffd76a', '#5ec8ff', '#7dff9e'][i % 4]);
  }
  // Ground.
  rect(ctx, 0, 330, W, H - 330, '#3a2b4d');
  rect(ctx, 0, 330, W, 6, '#57406e');
  // Left stall: tea. Its awning loses a stripe in the variant.
  rect(ctx, 48, 210, 150, 120, '#5b3a6e');
  rect(ctx, 40, 190, 166, 22, '#e4572e');
  const stripes = mods.has('awning-stripes') ? 4 : 5;
  for (let i = 0; i < stripes; i++) {
    rect(ctx, 40 + i * (166 / 5), 190, 166 / 10, 22, '#fff3d6');
  }
  rect(ctx, 48, 300, 150, 12, '#3d2547');
  roundRect(ctx, 66, 240, 34, 30, 4, '#ffd76a');
  roundRect(ctx, 106, 240, 34, 30, 4, '#ff9e6b');
  roundRect(ctx, 146, 240, 34, 30, 4, '#7dff9e');
  // Tea sign: one letter changes in the variant.
  roundRect(ctx, 62, 158, 122, 26, 6, '#fff3d6');
  ctx.fillStyle = '#5b3a6e';
  ctx.font = 'bold 17px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(mods.has('sign-letter') ? 'MOON TEE' : 'MOON TEA', 123, 177);
  // Right stall: balloons.
  rect(ctx, 360, 210, 160, 120, '#274060');
  rect(ctx, 352, 190, 176, 22, '#2fbf71');
  for (let i = 0; i < 5; i++) rect(ctx, 352 + i * 35, 190, 17, 22, '#fff3d6');
  rect(ctx, 360, 300, 160, 12, '#1b2f47');
  roundRect(ctx, 380, 244, 40, 26, 4, '#ff5d8f');
  roundRect(ctx, 432, 244, 40, 26, 4, '#5ec8ff');
  // Balloon bunch; the variant adds one more.
  const balloons = mods.has('balloon-extra')
    ? [[500, 170, '#ff5d8f'], [522, 150, '#ffd76a'], [544, 172, '#5ec8ff'], [512, 128, '#7dff9e']]
    : [[500, 170, '#ff5d8f'], [522, 150, '#ffd76a'], [544, 172, '#5ec8ff']];
  for (const [bx, by, bc] of balloons) {
    ellipse(ctx, bx, by, 11, 14, bc);
    line(ctx, bx, by + 14, bx - 4, by + 34, 'rgba(255,255,255,0.6)', 1.5);
  }
  // Hanging lantern; its colour changes in the variant.
  line(ctx, 300, 70, 300, 96, '#0f1226', 3);
  ellipse(ctx, 300, 122, 22, 28, mods.has('lantern-color') ? '#2fbf71' : '#e4572e');
  rect(ctx, 288, 96, 24, 8, '#ffd76a');
  rect(ctx, 292, 148, 16, 6, '#ffd76a');
  ctx.fillStyle = '#fff3d6';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('福', 300, 128);
  // The market cat on a crate; gone in the variant.
  if (!mods.has('cat-missing')) {
    rect(ctx, 236, 306, 44, 24, '#8a5a33');
    ellipse(ctx, 258, 296, 20, 14, '#2e2e3a');
    circle(ctx, 272, 282, 11, '#2e2e3a');
    poly(ctx, [[264, 274], [266, 262], [271, 273]], '#2e2e3a');
    poly(ctx, [[276, 273], [280, 262], [282, 274]], '#2e2e3a');
    line(ctx, 240, 292, 228, 278, '#2e2e3a', 4);
    circle(ctx, 276, 280, 2, '#ffd76a');
  }
}

// -------------------------------------------------------------- Snowy Village
export function paintVillage(ctx, W, H, mods) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#8fb8dd');
  sky.addColorStop(1, '#dfeefc');
  rect(ctx, 0, 0, W, 300, sky);
  // Moon with craters; the variant adds one more crater.
  circle(ctx, 470, 66, 34, '#f7f3e3');
  circle(ctx, 458, 56, 7, '#ddd5b8');
  circle(ctx, 482, 76, 5, '#ddd5b8');
  if (mods.has('moon-crater')) circle(ctx, 470, 84, 6, '#ddd5b8');
  cloud(ctx, 120, 60, 0.9, 'rgba(255,255,255,0.95)');
  cloud(ctx, 300, 100, 0.6, 'rgba(255,255,255,0.85)');
  // Snow ground.
  rect(ctx, 0, 300, W, H - 300, '#f4f8ff');
  ellipse(ctx, 80, 330, 90, 16, '#e3edfa');
  ellipse(ctx, 480, 360, 110, 18, '#e3edfa');
  // Pines along the back; the variant grows one more.
  pine(ctx, 60, 300, 1.1, '#2e7d5b', '#6e4525');
  pine(ctx, 520, 296, 0.9, '#2e7d5b', '#6e4525');
  if (mods.has('pine-extra')) pine(ctx, 496, 308, 0.8, '#2e7d5b', '#6e4525');
  // House 1 (left): warm windows, one goes dark in the variant.
  rect(ctx, 96, 232, 110, 70, '#b5654a');
  poly(ctx, [[88, 232], [151, 188], [214, 232]], '#7a3b2e');
  rect(ctx, 196, 196, 12, 30, '#7a3b2e');
  windowGlow(ctx, 112, 252, 22, 22, !mods.has('window-lit'));
  windowGlow(ctx, 164, 252, 22, 22, true);
  rect(ctx, 140, 268, 20, 34, '#5b2d22');
  // Smoke from house 1's chimney; one puff fewer in the variant.
  const puffs = mods.has('smoke-puffs') ? 2 : 3;
  for (let i = 0; i < puffs; i++) {
    circle(ctx, 202 + i * 8, 186 - i * 14, 9 - i, 'rgba(255,255,255,0.9)');
  }
  // House 2 (right): its chimney appears only in the variant.
  rect(ctx, 360, 240, 120, 62, '#4a6b8a');
  poly(ctx, [[352, 240], [420, 200], [488, 240]], '#33415c');
  if (mods.has('chimney-count')) {
    rect(ctx, 452, 204, 12, 26, '#33415c');
    circle(ctx, 458, 196, 7, 'rgba(255,255,255,0.9)');
  }
  windowGlow(ctx, 376, 258, 22, 22, true);
  windowGlow(ctx, 428, 258, 22, 22, true);
  rect(ctx, 410, 272, 20, 30, '#2b2b3a');
  // Snowman, centre.
  circle(ctx, 286, 330, 26, '#ffffff');
  circle(ctx, 286, 292, 20, '#ffffff');
  circle(ctx, 286, 262, 15, '#ffffff');
  circle(ctx, 280, 258, 2.5, '#222');
  circle(ctx, 292, 258, 2.5, '#222');
  poly(ctx, [[286, 262], [304, 265], [286, 268]], '#e4572e');
  circle(ctx, 286, 290, 2.5, '#222');
  circle(ctx, 286, 300, 2.5, '#222');
  line(ctx, 268, 292, 248, 280, '#6e4525', 3);
  line(ctx, 304, 292, 324, 280, '#6e4525', 3);
  if (!mods.has('snowman-scarf')) {
    rect(ctx, 272, 274, 28, 8, '#e4572e');
    rect(ctx, 292, 280, 7, 18, '#e4572e');
  }
  // Sled leaning on house 1; gone in the variant.
  if (!mods.has('sled-missing')) {
    line(ctx, 226, 300, 246, 268, '#8a5a33', 5);
    line(ctx, 232, 296, 250, 296, '#8a5a33', 4);
    line(ctx, 228, 288, 246, 288, '#8a5a33', 4);
  }
  // Falling snowflakes, seeded so both panels match.
  const rng = makeRng(31);
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  for (let i = 0; i < 40; i++) {
    const x = range(rng, 8, W - 8);
    const y = range(rng, 8, 290);
    ctx.beginPath();
    ctx.arc(x, y, range(rng, 1.5, 3), 0, Math.PI * 2);
    ctx.fill();
  }
}

// ----------------------------------------------------------------- Star Garden
export function paintGarden(ctx, W, H, mods) {
  const sky = ctx.createLinearGradient(0, 0, 0, 200);
  sky.addColorStop(0, '#aee3ff');
  sky.addColorStop(1, '#e8f9d8');
  rect(ctx, 0, 0, W, 200, sky);
  // Sun; the variant shortens its rays.
  circle(ctx, 70, 60, 28, '#ffd93b');
  ctx.strokeStyle = '#ffd93b';
  ctx.lineWidth = 4;
  const rays = mods.has('sun-rays') ? 6 : 8;
  for (let i = 0; i < rays; i++) {
    const a = (i * Math.PI * 2) / rays;
    line(ctx, 70 + Math.cos(a) * 36, 60 + Math.sin(a) * 36, 70 + Math.cos(a) * 48, 60 + Math.sin(a) * 48, '#ffd93b', 4);
  }
  cloud(ctx, 330, 50, 0.9, '#ffffff');
  cloud(ctx, 460, 96, 0.7, '#ffffff');
  // Grass.
  rect(ctx, 0, 200, W, H - 200, '#7cc46a');
  rect(ctx, 0, 200, W, 8, '#5da34e');
  // Picket fence along the back; one picket missing in the variant.
  rect(ctx, 0, 176, W, 8, '#f5efe0');
  for (let x = 14; x < W; x += 30) {
    if (mods.has('fence-picket') && x === 374) continue;
    poly(ctx, [[x, 184], [x + 8, 172], [x + 16, 184]], '#f5efe0');
    rect(ctx, x, 184, 16, 14, '#f5efe0');
  }
  // Pond, bottom right, with a frog that hops away in the variant.
  ellipse(ctx, 448, 352, 92, 46, '#5ec8e8');
  ellipse(ctx, 448, 352, 74, 34, '#7fd4ef');
  ellipse(ctx, 420, 344, 30, 12, '#2fbf71');
  ellipse(ctx, 470, 360, 26, 10, '#2fbf71');
  if (!mods.has('frog-missing')) {
    ellipse(ctx, 420, 336, 16, 11, '#4caf50');
    circle(ctx, 412, 326, 6, '#4caf50');
    circle(ctx, 428, 326, 6, '#4caf50');
    circle(ctx, 412, 324, 2.5, '#1b2f47');
    circle(ctx, 428, 324, 2.5, '#1b2f47');
  }
  // Mushrooms; one loses a spot in the variant.
  function mushroom(mx, my, s, spots) {
    rect(ctx, mx - 5 * s, my, 10 * s, 16 * s, '#fff3d6');
    poly(ctx, [[mx - 20 * s, my + 2], [mx, my - 20 * s], [mx + 20 * s, my + 2]], '#e4572e');
    for (let i = 0; i < spots; i++) {
      circle(ctx, mx - 10 * s + i * 10 * s, my - 8 * s + (i % 2) * 5, 3 * s, '#fff3d6');
    }
  }
  mushroom(120, 320, 1, 3);
  mushroom(500, 260, 0.8, mods.has('mushroom-spots') ? 2 : 3);
  // Flowers; one changes colour in the variant.
  function flower(fx, fy, petal) {
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      circle(ctx, fx + Math.cos(a) * 11, fy + Math.sin(a) * 11, 8, petal);
    }
    circle(ctx, fx, fy, 7, '#ffd76a');
    line(ctx, fx, fy + 8, fx, fy + 34, '#2e7d5b', 3);
  }
  flower(96, 268, mods.has('flower-color') ? '#b388ff' : '#ff7fb0');
  flower(180, 300, '#ff9e6b');
  flower(330, 268, '#ff7fb0');
  flower(380, 330, '#fff3d6');
  flower(250, 350, '#7fb0ff');
  // Butterfly; its wings change colour in the variant.
  const wing = mods.has('butterfly-wings') ? '#5ec8ff' : '#ff9e2e';
  ellipse(ctx, 296, 116, 14, 10, wing);
  ellipse(ctx, 320, 116, 14, 10, wing);
  ellipse(ctx, 298, 132, 10, 8, wing);
  ellipse(ctx, 318, 132, 10, 8, wing);
  line(ctx, 308, 108, 308, 140, '#33415c', 3);
  circle(ctx, 308, 106, 4, '#33415c');
  // A bee; the variant adds a second one.
  function bee(bx, by) {
    ellipse(ctx, bx, by, 10, 7, '#ffd93b');
    line(ctx, bx - 3, by - 6, bx - 3, by + 6, '#33415c', 2);
    line(ctx, bx + 3, by - 6, bx + 3, by + 6, '#33415c', 2);
    ellipse(ctx, bx - 2, by - 10, 6, 3, 'rgba(255,255,255,0.8)');
  }
  bee(150, 150);
  if (mods.has('bee-extra')) bee(452, 148);
  // Watering can; its spout flips in the variant.
  const spoutLeft = mods.has('can-spout');
  rect(ctx, 196, 330, 46, 34, '#5ec8ff');
  poly(ctx, [[196, 330], [242, 330], [242, 322], [196, 322]], '#4aa8d8');
  if (spoutLeft) poly(ctx, [[196, 340], [176, 332], [176, 344], [196, 348]], '#4aa8d8');
  else poly(ctx, [[242, 340], [262, 332], [262, 344], [242, 348]], '#4aa8d8');
  line(ctx, 206, 322, 206, 306, '#4aa8d8', 5);
  line(ctx, 206, 306, 232, 306, '#4aa8d8', 5);
}

// ------------------------------------------------------------- Clockwork City
export function paintCity(ctx, W, H, mods) {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#2b2b4a');
  sky.addColorStop(1, '#6b4a8a');
  rect(ctx, 0, 0, W, H, sky);
  // Stars.
  const rng = makeRng(55);
  for (let i = 0; i < 22; i++) {
    star(ctx, range(rng, 10, W - 10), range(rng, 10, 120), range(rng, 1.5, 3.5), 'rgba(255,240,180,0.85)', 4);
  }
  // Moon.
  circle(ctx, 500, 56, 24, '#f4ead5');
  // Gears turning in the sky; one loses a tooth, one changes metal.
  function gear(gx, gy, r, teeth, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const a = (i * Math.PI) / teeth;
      const rad = i % 2 === 0 ? r : r * 0.78;
      const px = gx + Math.cos(a) * rad;
      const py = gy + Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    circle(ctx, gx, gy, r * 0.4, '#2b2b4a');
  }
  gear(110, 110, 34, mods.has('gear-teeth') ? 7 : 8, '#c9a227');
  gear(180, 70, 22, 6, mods.has('gear-color') ? '#b87333' : '#c9a227');
  gear(70, 190, 18, 6, '#c9a227');
  // Clock tower, centre.
  rect(ctx, 250, 120, 70, 210, '#8a7d8f');
  poly(ctx, [[244, 120], [285, 82], [326, 120]], '#5b4a6e');
  circle(ctx, 285, 152, 30, '#fff8e7');
  circle(ctx, 285, 152, 30, 'rgba(0,0,0,0)');
  ctx.strokeStyle = '#33415c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(285, 152, 30, 0, Math.PI * 2);
  ctx.stroke();
  // Clock hands: 3 o'clock vs 4 o'clock in the variant.
  line(ctx, 285, 152, 285, 132, '#33415c', 4);
  if (mods.has('clock-hands')) line(ctx, 285, 152, 299, 168, '#e4572e', 4);
  else line(ctx, 285, 152, 305, 152, '#e4572e', 4);
  circle(ctx, 285, 152, 4, '#33415c');
  windowGlow(ctx, 268, 210, 18, 18, true);
  windowGlow(ctx, 296, 210, 18, 18, !mods.has('window-lit'));
  windowGlow(ctx, 268, 250, 18, 18, true);
  windowGlow(ctx, 296, 250, 18, 18, true);
  rect(ctx, 272, 300, 26, 30, '#5b4a6e');
  // Rooftop star light; off in the variant.
  line(ctx, 285, 82, 285, 66, '#c9a227', 3);
  if (!mods.has('star-light')) star(ctx, 285, 58, 10, '#ffd76a');
  // Robot on the left roof; its antenna light changes colour.
  rect(ctx, 60, 300, 90, 30, '#4a4a6e');
  rect(ctx, 84, 262, 44, 40, '#9aa5b1');
  rect(ctx, 92, 240, 28, 24, '#9aa5b1');
  circle(ctx, 100, 252, 4, '#1b2f47');
  circle(ctx, 112, 252, 4, '#1b2f47');
  line(ctx, 106, 240, 106, 224, '#c9a227', 3);
  circle(ctx, 106, 220, 6, mods.has('robot-antenna') ? '#2fbf71' : '#e4572e');
  line(ctx, 84, 280, 66, 296, '#9aa5b1', 5);
  line(ctx, 128, 280, 146, 296, '#9aa5b1', 5);
  // Pipes on the right; the valve wheel vanishes in the variant.
  rect(ctx, 420, 240, 20, 90, '#7a7a8f');
  rect(ctx, 420, 240, 100, 20, '#7a7a8f');
  circle(ctx, 500, 250, 12, '#5b5b6e');
  if (!mods.has('pipe-valve')) {
    circle(ctx, 460, 230, 12, 'rgba(0,0,0,0)');
    ctx.strokeStyle = '#e4572e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(460, 230, 11, 0, Math.PI * 2);
    ctx.stroke();
    line(ctx, 460, 219, 460, 241, '#e4572e', 3);
    line(ctx, 449, 230, 471, 230, '#e4572e', 3);
  }
  // Balloon drifting; its colour changes in the variant.
  ellipse(ctx, 400, 130, 16, 20, mods.has('balloon-color') ? '#5ec8ff' : '#ff5d8f');
  poly(ctx, [[392, 148], [408, 148], [400, 158]], mods.has('balloon-color') ? '#5ec8ff' : '#ff5d8f');
  line(ctx, 400, 158, 400, 182, 'rgba(255,255,255,0.6)', 1.5);
  // The rooftop cat; its tail flips in the variant.
  ellipse(ctx, 360, 322, 18, 10, '#2e2e3a');
  circle(ctx, 374, 310, 9, '#2e2e3a');
  poly(ctx, [[368, 304], [370, 294], [374, 303]], '#2e2e3a');
  poly(ctx, [[376, 303], [380, 294], [381, 304]], '#2e2e3a');
  if (mods.has('cat-tail')) line(ctx, 344, 318, 330, 302, '#2e2e3a', 4);
  else line(ctx, 344, 318, 330, 330, '#2e2e3a', 4);
  // Chimney smoke on the right building; gone in the variant.
  rect(ctx, 470, 300, 60, 30, '#4a4a6e');
  rect(ctx, 516, 272, 12, 30, '#5b5b6e');
  if (!mods.has('chimney-smoke')) {
    circle(ctx, 522, 262, 8, 'rgba(255,255,255,0.85)');
    circle(ctx, 528, 246, 10, 'rgba(255,255,255,0.75)');
  }
  // Ground.
  rect(ctx, 0, 330, W, 6, '#1b1b2e');
  rect(ctx, 0, 336, W, H - 336, '#3a3a5c');
}
