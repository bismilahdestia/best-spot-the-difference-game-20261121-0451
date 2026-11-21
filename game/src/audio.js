// Twin Tales — Spot the Difference: synthesized sound effects.
// One clear job: every sound the game makes, built with WebAudio only —
// no audio files, no network, nothing to download.

export class SoundBank {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensure() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
    }
    if (this.context.state === 'suspended') void this.context.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  tone(freq, startAt, duration, type, volume) {
    if (this.muted || !this.context) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(startAt);
    osc.stop(startAt + duration + 0.05);
  }

  now() {
    return this.context ? this.context.currentTime : 0;
  }

  // Satisfying two-note pop when a difference is found.
  pop(combo) {
    this.ensure();
    const t = this.now();
    const lift = Math.min(combo, 10) * 24;
    this.tone(660 + lift, t, 0.12, 'sine', 0.22);
    this.tone(990 + lift, t + 0.07, 0.18, 'sine', 0.2);
  }

  // Low buzz for a wrong click.
  miss() {
    this.ensure();
    const t = this.now();
    this.tone(160, t, 0.16, 'sawtooth', 0.12);
    this.tone(110, t + 0.05, 0.2, 'sawtooth', 0.1);
  }

  // Soft chime for a hint.
  hint() {
    this.ensure();
    const t = this.now();
    this.tone(880, t, 0.14, 'triangle', 0.14);
    this.tone(1174, t + 0.09, 0.2, 'triangle', 0.12);
  }

  // Rising arpeggio for a cleared level.
  levelClear() {
    this.ensure();
    const t = this.now();
    [523, 659, 784, 1046].forEach((freq, i) => {
      this.tone(freq, t + i * 0.09, 0.22, 'triangle', 0.16);
    });
  }

  // Short tick when the timer enters the danger zone.
  tick() {
    this.ensure();
    this.tone(1200, this.now(), 0.05, 'square', 0.05);
  }

  // Single UI click.
  click() {
    this.ensure();
    this.tone(520, this.now(), 0.06, 'sine', 0.12);
  }
}
