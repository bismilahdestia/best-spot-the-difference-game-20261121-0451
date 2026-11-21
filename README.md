[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bismilahdestia/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bismilahdestia/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

# Twin Tales — Spot the Difference

A complete, original spot-the-difference game that plays offline in a desktop
browser from static files. Two near-identical hand-painted scenes sit side by
side; find every sneaky change before the clock runs out.

## Play

```sh
node serve.ts
# open http://localhost:8080
```

Click a difference on either picture to mark it — a green ring and a check
appear on both panels. Wrong clicks cost 250 points and 3 seconds. `H` spends
a hint, `P` pauses, `M` toggles sound, `Enter` starts.

## The hunt

Five hand-painted scenes, 36 differences in all, with named progression and
rising difficulty:

| Level | Scene | Differences | Time |
|------:|-------|------------:|-----:|
| 1 | Harbor Dawn | 5 | 120s |
| 2 | Night Market | 6 | 110s |
| 3 | Snowy Village | 7 | 100s |
| 4 | Star Garden | 8 | 90s |
| 5 | Clockwork City | 10 | 90s |

Scoring: 1000 points per find, a combo multiplier up to ×2, a time bonus of
50 points per second left, and a 1500-point perfect-level bonus. The score is
shown as six digits; clearing all five scenes earns a rank from Rookie
Spotter to Grand Master of Differences.

## How it is built

Pure static files under `game/` — no build step, no network request, no
vendored library. Every scene is painted in code on canvas, so the two panels
agree on everything except the differences themselves.

- `game/index.html` — page shell
- `game/styles.css` — page chrome around the canvas
- `game/src/main.js` — state machine, timer, juice (shake, particles, pops)
- `game/src/scenes.js` — the five scene painters
- `game/src/levels.js` — level names, timers and difference hit-circles
- `game/src/render.js` — HUD, panels, markers and overlay screens
- `game/src/input.js` — pointer and keyboard routing, hit testing
- `game/src/scoring.js` — score, combo, stars
- `game/src/audio.js` — synthesized WebAudio sound effects
- `game/src/config.js` — tuning constants and score formatting
- `game/src/random.js` — seeded random generator
- `game/src/draw.js` — reusable canvas shapes

`main.ts` hands the game in with the vendored `vendor/makefun-game.ts`
library, as the kit requires. Screenshots in `screenshots/` are real renders
of the game's own code (`shots.json` lists the shot states).

## License

MIT — see [LICENSE](LICENSE).
