# Mene brand kit

**Mark:** Quorum. Three witnesses, two lit and one not; the bars also form an M.
**Brand colour:** Amber `#F5B83D`.

## Colours
| Name | Hex | Use |
|---|---|---|
| Amber | `#F5B83D` | Brand: lit bars on dark, app icon tile, lit witness lamps |
| Deep amber | `#9A6A0A` | Lit bars on light backgrounds (amber is too pale on white) |
| Ink | `#0B0E17` | Dark background, text and mark on light, mark inside the amber tile |
| Light ink | `#E8EBF4` | Wordmark and unlit bar on dark |
| Threat red | `#D7261E` (light) / `#FF5C5C` (dark) | Active advisories and alarms only, never branding |

## Which file where
| Need | File |
|---|---|
| Site header on dark | `svg/mene-lockup-on-dark.svg` |
| Site header on light | `svg/mene-lockup-on-light.svg` |
| Mark only (nav on mobile, loaders) | `svg/mene-mark-on-dark.svg` / `-on-light.svg` |
| One-colour print, stamps, watermarks | `svg/*-mono-black.svg` / `*-mono-white.svg` |
| Favicons and PWA icons | everything in `favicon/` plus `head-snippet.html` |
| Devfolio project logo, avatars | `png/mene-app-icon-512.png` (or 1024) |
| README header on GitHub | `png/mene-lockup-on-light-800w.png` with a `<picture>` dark variant `png/mene-lockup-on-dark-800w.png` |
| Link previews (og:image) | `social/og-image-1200x630.png` |
| GitHub repo Settings, Social preview | `social/github-social-preview-1280x640.png` |
| Slides and video title card | `png/mene-lockup-on-dark-1600w.png` |

## Rules
- The wordmark is outlined Archivo (weight 750, width 118); no font is needed to render it.
- Keep clear space around the mark equal to the width of one bar.
- Never put the amber mark on white; use the `on-light` files.
- Never recolour the bars; the lit and unlit pair is the meaning.
- Minimum size: the mark at 16 px, the lockup at 96 px wide.
