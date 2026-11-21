// Twin Tales — Spot the Difference: pointer and keyboard input.
// One clear job: turn clicks and keys into game actions. The game owns one
// canvas; buttons are canvas regions, so this module maps a click to either
// a button, a difference on one of the two panels, or a miss.

import { SCENE_W, SCENE_H } from './config.js';

// Panel geometry, shared with render.js.
export const PANEL = {
  left: { x: 40, y: 148 },
  right: { x: 680, y: 148 },
  w: SCENE_W,
  h: SCENE_H,
};

export function panelScenePoint(panel, clientX, clientY) {
  const x = clientX - panel.x;
  const y = clientY - panel.y;
  if (x < 0 || y < 0 || x > PANEL.w || y > PANEL.h) return null;
  return { x, y };
}

// Find the unfound difference under a scene point, or null.
export function hitDifference(level, found, point) {
  if (!point) return null;
  for (const diff of level.diffs) {
    if (found.has(diff.id)) continue;
    const dx = point.x - diff.x;
    const dy = point.y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}

export function pointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.w &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.h
  );
}

export class InputRouter {
  constructor(canvas, handlers) {
    this.canvas = canvas;
    this.handlers = handlers;
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('keydown', this.onKeyDown);
  }

  canvasPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * this.canvas.height,
    };
  }

  onPointerDown(event) {
    event.preventDefault();
    this.handlers.click(this.canvasPoint(event));
  }

  onKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key === 'h') this.handlers.hint();
    else if (key === 'p' || key === 'escape') this.handlers.pause();
    else if (key === 'm') this.handlers.mute();
    else if (key === 'enter' || key === ' ') this.handlers.confirm();
  }
}
