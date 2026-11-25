# Resume upload step — Figma restoration (frontend task)

A pixel-oriented rebuild of the Figma design
[`前端工程师（实习）`, frame `0:1`](https://www.figma.com/design/D0jjN7Twkq0DGm3ZJvQabz/?node-id=0-1)
using plain HTML + CSS + vanilla JavaScript (no build step, no dependencies).

## How to open

```powershell
# option 1 — just open the file
start index.html

# option 2 — any static server, e.g.
python -m http.server 5173
# then visit http://127.0.0.1:5173
```

Verified in Chrome 130+ / Edge 130+ at 1440×900, 1024×768, 414×896.

## What is implemented

| Area | Notes |
| --- | --- |
| Layout | Two columns: copy + illustration on the left, upload card on the right; collapses to one column below 960 px. |
| Drop zone | 2 px dashed border `#6E9BFF`, tinted fill, rounded 16 px, centred cloud-upload icon and two-line hint. |
| Buttons | `Last step` (`#75ACFF`) and `Finish` (`#1B5AFF`) with hover / active / focus-visible / disabled states. |
| Stepper | Three nodes: two completed checks + current step `3`, on a light blue rail. |
| File picking | Click opens the native file dialog; drag & drop over the zone also works and highlights the zone while a file is hovering. |
| File feedback | Selected file name + size are shown with a `Remove` action; sizes are formatted (B / KB / MB). |
| Finish | Validates that a file was chosen, then runs a short "uploading" state and reports success. |
| Keyboard | The drop zone is a real `<button>`; all controls are reachable by Tab, with visible focus rings. |
| Motion | Colour/transform transitions only; `prefers-reduced-motion` disables them. |

## Design tokens

Tokens were sampled from the rendered design rather than guessed:

| Token | Value | Where |
| --- | --- | --- |
| Page background | `#F8FBF9` | behind both columns |
| Card surface | `#FFFFFF` | upload card |
| Primary blue | `#1B5AFF` | `Finish`, stepper nodes, active dot |
| Secondary blue | `#75ACFF` | `Last step` |
| Stepper rail | `#C9D8FF` | connector lines |
| Field fill | `#F3F8FF` | drop zone |
| Field border | `#6E9BFF` | dashed border |
| Muted text | `#98A2B3` | hint, lede |
| Card radius / shadow | `24 px` / `0 20px 60px rgba(16,24,40,.08)` | upload card |

Sizes are expressed with `clamp()` against viewport width so the two-column
composition keeps its proportions between ~960 px and 1920 px instead of
snapping at a single breakpoint.

## Structure

```text
index.html     semantic markup: <main>, <section>, <h1>/<h2>, <button>, labelled file input
styles.css     design tokens in :root, BEM-ish class names, responsive rules at the bottom
app.js         ~130 lines: file dialog, drag & drop, name formatting, button states
assets/
  illustration.png   illustration cropped from the design render (see "Deviations")
```

## Deviations from the Figma file (and why)

1. **Illustration** — the Figma file is view-only for anonymous visitors, so the
   vector/bitmap assets cannot be exported. The illustration was cropped at 3×
   from the rendered frame and shipped as a PNG (1100×726, background
   `#F8FBF9` so it blends with the page). Icons (cloud upload, checks) are
   redrawn as inline SVG so they stay crisp at any size.
2. **Comment pin** — a Figma comment marker (`1 朱`) overlays the design's lede
   in the shared file; it is a collaboration artefact, not design, and is not
   reproduced.
3. **Fonts** — the file does not expose its font stack; the page uses an
   `Inter → Segoe UI → system-ui` stack that matches the design's metrics.
4. **Stepper semantics** — the design shows steps 1–2 done and step 3 active;
   the markup marks the third node with `aria-current="step"`.

## Accessibility notes

- The drop zone is a `<button>` with `aria-describedby` pointing at the hint,
  so it is keyboard-activatable and announced as a button.
- The file input is visually hidden but labelled and focusable through the
  drop zone; it is the single source of truth for the selection.
- Status updates use `role="status"` + `aria-live="polite"`.
- The illustration has a descriptive `alt`; decorative icons are `aria-hidden`.

## Not included (intentionally)

No upload backend call, no analytics, no framework. The step is a UI/UX
exercise; wiring it to a real API would be a separate, ten-line change in
`app.js`.
