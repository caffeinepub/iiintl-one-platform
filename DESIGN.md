# Design Brief: IIIntl One Platform — Civic Governance + Decentralized Trust + DAO Token

## Purpose
A sovereign, multi-lingual civic governance platform enabling independent international collaboration on-chain. Three new modules extend core capabilities: public proposals feed (democratic participation), decentralized credentials (trust layer), DAO governance token (participation rewards).

## Aesthetic Direction
**Professional, authoritative, trustworthy.** Deep blue foundation (#0f172a / `0.13 0.03 255`), cyan civic accents, verdant credentials trust, governance gold authority. Dark mode optimized. Signature details: verification seals, badge motifs, token sparkle animations.

## Color Palette

| Token | OKLCH (L C H) | Purpose |
|---|---|---|
| background | `0.13 0.03 255` | Deep blue canvas |
| foreground | `0.92 0.01 240` | High-contrast text |
| primary | `0.65 0.18 255` | Civic blue CTAs |
| secondary | `0.24 0.05 255` | Muted secondary actions |
| muted | `0.22 0.04 255` | Disabled, hints |
| accent | `0.28 0.06 255` | Cyan civic highlights |
| credentials | `0.68 0.2 165` | Verdant trust/verification |
| token | `0.75 0.14 85` | Governance authority gold |
| destructive | `0.55 0.22 25` | Red danger/rejection |
| border | `0.28 0.05 255` | Subtle dividers |
| card | `0.17 0.04 255` | Elevated surface |
| sidebar | `0.16 0.05 255` | Deep navy nav |

## Typography
- **Display**: Bricolage Grotesque (200–800 weight) — bold, distinctive, civic authority
- **Body**: General Sans (200–700 weight) — warm, readable, professional
- **Mono**: (fallback system) — code/transactions

## Structural Zones

| Zone | Treatment | Purpose |
|---|---|---|
| Header/Topbar | `bg-card` + `border-b border-border` | Navigation, search, auth |
| Sidebar | `bg-sidebar` + deep navy accent | Persistent nav, org context |
| Content | `bg-background` — default | Primary content area |
| Card surfaces | `bg-card` + `shadow-md` | Proposals, credentials, tokens |
| Elevated panels | `bg-card` + `credential-glow` / `token-glow` | DAO pricing, verified badges |
| Footer | `bg-muted/20` + `border-t` | Legal, socials, secondary links |

## Component Patterns
- **Proposals**: Title + preview, status badge (draft/open/enacted), sponsor count, voting mechanism icon, debate thread toggle
- **Credentials**: Badge icon (seal, checkmark, star), verified/pending/active status, issuer, expiry, public verify link
- **DAO Token**: Holdings display, governance power bar, token economics card, delegation UI, voting history

## Spacing & Rhythm
- **Padding**: 16px (card), 24px (section), 32px (page)
- **Gap**: 8px (inline), 12px (grid row), 16px (block sections)
- **Breakpoints**: mobile-first `sm: 640px`, `md: 768px`, `lg: 1024px`

## Motion & Interaction
- **Transitions**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` for interactive elements
- **Hover**: `shadow-card-hover` lift + slight scale (0.5% nudge)
- **Credential badges**: `verify-pulse` animation (2s loop, 0.7–1.0 opacity)
- **DAO token**: `token-shimmer` animation (3s loop, background position sweep)

## Differentiation
**Verification seals as signature:** Every credential displays a unique, tamper-proof seal. Credentials module is visually distinctive from proposals and token modules — verdant accent, badge-centric layout, public verification endpoints. **DAO token transparency:** Live on-chain tallies, governance power distribution, fractal FSU mechanics visible in real time.

## Layout Approach
- **Public Proposals**: Parliamentary chamber metaphor — debate threads organized chronologically, live tally visible, sponsor signatures
- **Credentials**: Trust layer dashboard — issued credentials as cards with seals, pending approvals, public verification mode
- **DAO Token**: Financial dashboard — holdings, governance power, token economics, delegation UI, voting history

## Constraints
- All interactive elements use semantic tokens (no `#` hex, no `rgb()`, no arbitrary Tailwind colors)
- Credentials and token sections use dedicated accent colors to establish visual hierarchy
- Dark mode only (light mode not implemented)
- Motion is subtle and purposeful; no gratuitous animations
- Menu items use high-contrast foreground for visibility on dark backgrounds
