# Design

## The bar

Good enough to be featured on Awwwards, and still an honest tool that a nervous first-year can finish in ten minutes on a phone. When those two pull against each other, the phone wins.

## The idea

**A card being made.** The portal is a press for one collectible card. Every level adds a layer to it: the photo, the number, the archetype, the problem, the rarity finish and the stamp. The landing is the whole cohort's cards laid out as a wall. The reveal is the moment a card is struck. The team's response is a stamp pressed into it. Every choice below — material, motion, type — comes from that one physical metaphor. Nothing is decoration.

## Chosen direction: Matte, with Riso's pink

The owner chose on 2026-10-06: **A's matte world and type, with B's pink as the one accent.** Graphite ground, one soft light, Instrument Serif for display with Geist and Geist Mono, monochrome faces that come alive on touch. White carries the words; pink carries the moments (the primary action, the overprinted phrase in the hero, the live state). The three lab directions below are kept for the record.

## Three directions for `/lab`

Each lab route shows the same four things so they can be compared fairly:
- the landing hero, with a 40-face slice of the wall
- one problem card
- the archetype reveal
- a founder card in Epic and Mythic

The owner picks one direction. Elements can be borrowed from the others.

### A · Matte

This is the owner's starting point, done properly.

- **Ground:** graphite black `#0C0C0E` with a matte grain. Depth comes from layered shadows and a single soft overhead light that follows the pointer at 4% strength.
- **Type:**
  - **Instrument Serif** for display: characterful and editorial, with a beautiful italic.
  - **Geist** for UI.
  - **Geist Mono** for numbers and indexing.
- **Cards:** thick card stock with a bevelled edge. Legendary and Mythic get a real foil: a conic gradient driven by pointer tilt, clipped to a guilloché pattern.
- **Stamps:** a debossed ink impression in the rarity colour.
- **Feel:** a private gallery at night, quiet and expensive.

### B · Riso

A print shop instead of a screen.

- **Ground:** warm off-white paper `#F2EEE6` with ink in two spot colours.
- **Photos:** printed as halftone duotones. On hover the halftone resolves into the real photo.
- **Type:**
  - **Bricolage Grotesque**, condensed weights, set big for display.
  - **Inter Tight** for UI.
  - **JetBrains Mono** for numbers and indexing.
- **Cards:** die-cut paper cards with slight misregistration on the rarity ink.
- **Stamps:** rubber stamps, slightly rotated, with ink spread.
- **Feel:** a zine made by the class. It is the warmest of the three, and the most unexpected on Awwwards.

### C · Forge

Heat, metal and struck coins.

- **Ground:** near-black with ember light coming from below. The Mesa violet is cooled into the shadows, so the brand is present without being purple everywhere.
- **Type:**
  - **Big Shoulders** (an industrial condensed face) for display.
  - **Manrope** for UI, kept from the Mesa brand book.
  - **Geist Mono** for numbers and indexing.
- **Cards:** milled metal plates with an engraved rarity border.
- **Reveal:** the card is struck like a coin. A flash of heat, then it cools to its colour.
- **Feel:** the most game-like of the three, and closest to the ForgeX name.

All six fonts are free for commercial use: Google Fonts, or Geist via the `geist` package. All of them load with `next/font`, which self-hosts the files, subsets them, and uses `display: swap` with metric-matched fallbacks so there is no layout shift.

## System (filled in for the chosen direction in Phase 4)

### Tokens

Everything lives in `app/globals.css` under `@theme`. Components never use raw hex values.

- **Colour:**
  - `--ground`, `--surface-1..3`, `--line`, `--ink-1..3` (text, from strongest to weakest)
  - `--accent`, for primary actions only, at most about 5% of any screen
  - `--focus`
- **Rarity:**

  | Rarity | Base | Fill (`--{rarity}`) |
  | --- | --- | --- |
  | Rare | blue | yes |
  | Epic | violet | yes |
  | Legendary | amber | yes |
  | Mythic | red | yes |
  | Original | pearl | yes |

  - Each rarity also has `--{rarity}-ink`, the shade that passes AA as text on the ground.
  - Rarity colour is only ever an accent: borders, tags, foil, stamps. It is never the background behind long text.
- **Type scale:** fluid with `clamp()`, in six steps from `--text-xs` to `--text-display`. Body text is 16px minimum on mobile. Line length is capped at 65ch.
- **Space:** a 4px base with the steps 4, 8, 12, 16, 24, 32, 48, 64 and 96. The grid is 4 columns on mobile, 8 on tablet and 12 on desktop, with fixed gutters.
- **Radii:** a small number of named radii: control, card and sheet.
- **Elevation:** three shadow stacks, each pairing a soft ambient shadow with a tight contact shadow, plus one grain overlay at the root.

### Core components (Phase 4)

| Component | Notes |
| --- | --- |
| `FounderCard` | Front and back, in four sizes: wall, corner, hero and export. There is one layout source for both the DOM version and the `next/og` PNG. |
| `ProblemCard` + `ProblemSheet` | The card, and the full problem in a sheet (bottom sheet on mobile, dialog on desktop). |
| `RarityTag`, `Foil`, `Stamp` | Rarity label, foil finish, and the pressed response stamp. |
| `Choice` (tap card), `Chip`, `ChipInput`, `Slider`, `OtherField` | The question controls. |
| `InlineField` | The profile's click-to-edit field, with its view, edit, saving and error states. |
| `Progress` | The founder card in the corner; see PRODUCT. |
| `Button` (primary, secondary, quiet), `Sheet`, `Toast`, `Skeleton` | General controls. |
| `Nudge` | The live writing guidance in Level 6. |

**Radix** supplies the dialog, popover, slider and toggle group. Everything else is hand-built.

**Icons** come from lucide-react at size 16 and stroke 1.5, and are used sparingly.

## Motion

Every animation must explain something: a transition, a reveal or a change of state. If it explains nothing, it goes.

| Kind | Duration | Easing | Where |
| --- | --- | --- | --- |
| Task feedback | 150–200ms | `--ease-out` | Hover, press, select, inline edit, nudge |
| Level change | 250ms | `--ease-out` | View Transitions API: the card in the corner is shared, so it stays put while the step slides |
| Cinematic | 600–1400ms | custom curves | Archetype reveal, card strike, rarity finish, landing intro |

- **Press:** controls travel 2px down on `:active` and come back up on release. That is what makes the portal feel like a game rather than a form.
- **The reveal** is one event, not a sequence of fades. A single `IMPACT` moment — the card landing — and every other element is timed off it.
- **Foil** follows pointer tilt on desktop and device orientation on mobile (only after a tap grants permission). Without tilt it plays a slow idle shimmer.
- **Landing:** GSAP drives the wall's intro and its idle drift. The page is one screen, so there is no Lenis and no scroll-jacking.
- **`prefers-reduced-motion`:** every transition becomes a short crossfade, foil is static, and the wall is still. Nothing that conveys information is lost.
- **Sound:** off by default. If added, there is one toggle for a soft stamp sound on the reveal and on the response, and nothing else.

## The founder wall

**Shipped:** the DOM mosaic only. Server-rendered buttons with one delegated listener for the flip, one drift on the whole grid, and card backs filled when flipped. On a throttled phone it scores 99 on Lighthouse. React Three Fiber earns its place in the archetype relics instead, where it loads after the reveal, once the browser is idle.

**Base layer:** a DOM/CSS mosaic. A CSS grid holds the 117 faces as 96px AVIF/WebP images, served from `next/image` with explicit sizes.
- The images are lazy, except the first row, which forms the LCP.
- Faces drift slowly with CSS transforms on the compositor thread.
- Hover, focus or tap raises a face and shows its name and archetype.
- Every face is a focusable button, and arrow keys walk the grid.

**WebGL layer (React Three Fiber):** loaded after LCP, only on capable devices (more than 4 cores, no `saveData`, not reduced motion).
- It adds parallax depth and light catching the card edges.
- It is kept only if the lab shows a visible gain within budget, about 150KB gzipped and loaded asynchronously.
- The DOM version is the fallback, and it is what the accessibility tree uses.

## Craft rules

- **Skeletons** are drawn in the final layout, with fixed aspect ratios on every image. CLS is 0.
- **Focus rings** are designed with as much care as hover: a 2px `--focus` ring, offset, that follows the radius of what it surrounds.
- **Mobile first:** every screen is designed at 360px and checked at 390, 1080 and 1440. Tap targets are at least 44px. Primary actions sit in thumb reach on mobile.
- **No quotation glyphs,** no decorative commas, and no ornamental punctuation.
- **Contrast:** WCAG 2.2 AA everywhere, checked with axe and by hand on the rarity inks.

## Self-review before showing any screen

1. Does every element earn its place?
2. Would a first-year know what to do next within three seconds?
3. Is any filler copy, decorative glyph or unnecessary label left?
4. Does it feel as good at 390px as at 1440px?
5. Does any animation exist without a reason?

The loop for every screen: screenshot it at 390, 1080 and 1440 with Playwright, critique it against the five questions above, fix what falls short, and repeat at least twice.
