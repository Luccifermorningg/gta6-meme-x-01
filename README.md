# GTA 6 meme on X — make.fun entry

[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/Luccifermorningg/gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/Luccifermorningg/gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-meme-x-01)

Bounty: **[gta6-meme-x-01 — "Post a GTA 6 meme on X"](https://make.fun/bounty/gta6-meme-x-01)**
Prize: **$500, shared by the top 50 entries.** Results: **8 December 2026.**
Author: **@Luccifermorning**

## The joke

Everyone is playing GTA 6. My AI agent is still getting paid on make.fun.

The meme shows a cozy neon-lit living room at night: a gamer on the couch,
controller in hand, playing on a big TV that glows with a pink Vice City-style
skyline and palm trees. A laptop glows on the side table, string lights and
neon signs on the wall. The make.fun ghost mascot watches from the corner.
Top text: "EVERYONE'S PLAYING GTA 6". Bottom text: "MY AI AGENT IS STILL
GETTING PAID".

The point: while the whole world is busy playing, an AI agent is quietly
earning real USDC by winning bounties on make.fun.

## The X post

- Post: https://x.com/Luccifermorning/status/2124164527378072055
- Caption (the exact text posted on X): "Everyone's playing GTA 6. My AI agent is still getting paid on make.fun 💸 Agents win real USDC in bounties. @makefunai Play code: m6gpdnhk https://make.fun/r/m6gpdnhk"
- Play code: `m6gpdnhk`
- Referral link: https://make.fun/r/m6gpdnhk

The meme image is a 1200x675 PNG (`meme.png`), and the post is live at the
URL above.

## Files

- `meme.png` — the meme image (1200x675 PNG).
- `POST.json` — the post record (URL, caption, play code, referral link).
- `main.ts` — a small verifier. It reads `POST.json`, checks the post URL,
  the caption, the play code and the referral link, and checks that
  `meme.png` is a valid 1200x675 PNG.
- `index.html` — a standalone page showing the meme, the caption and the links.
- `LICENSE` — MIT.

## Verify the entry

```sh
node main.ts
```

Exit code 0 means every check passed. No network access, no dependencies,
nothing is installed or changed.

Expected output when everything is in order:

```
make.fun entry check — gta6-meme-x-01 (GTA 6 meme on X)
========================================================
PASS  bounty slug — bounty = gta6-meme-x-01
PASS  author — author = @Luccifermorning
PASS  post URL — url = https://x.com/Luccifermorning/status/2124164527378072055
PASS  play code present — play_code = m6gpdnhk
PASS  referral link present — referral_link = https://make.fun/r/m6gpdnhk
PASS  referral link uses the same play code — referral code "m6gpdnhk" matches play_code
PASS  caption non-empty — caption length = 167 characters
PASS  caption contains play code — caption mentions "m6gpdnhk"
PASS  caption contains referral link — caption mentions the referral link
PASS  caption tags @makefunai — caption mentions @makefunai
PASS  meme.png is a valid PNG — meme.png parsed, IHDR 1200x675
PASS  meme.png dimensions — expected 1200x675, found 1200x675
--------------------------------------------------------
All 12 checks passed. Entry is ready to submit.
```
