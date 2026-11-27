# Design System: NC Travel Guide

## 1. Product and visual direction

NC Travel Guide is a public-facing North Carolina visitor and heritage reference. The interface must make statewide information easy to scan, verify, and act on. It serves travelers first, while also functioning as a source-conscious research portfolio.

**Primary mode:** Read + Operate. Visitors read destination and history content, then use maps, county navigation, itinerary tools, and live travel modules.

**Visual direction:** Clear, welcoming, map-room utility with a distinctive North Carolina identity. Preserve the existing NC Travel Guide logo and recognizable blue/white travel palette. Do not replace the brand mark or make the whole site dark.

**Archive sub-world:** History and county History Vault pages use a separate dark archive treatment: charcoal surfaces, parchment text, restrained antique-gold accents, and a distinctive editorial serif for archive headings. This theme is scoped to history routes; travel-planning routes remain in the primary theme.

## 2. Color tokens

### Primary travel experience

| Token | Value | Role |
|---|---|---|
| Sky Canvas | `#4B9CD3` | Existing primary page background |
| White Surface | `#FFFFFF` | Main navigation, cards, and footer surfaces |
| Ink | `#0F172A` | Primary text |
| Slate | `#334155` | Secondary text |
| Muted Slate | `#64748B` | Metadata and tertiary copy |
| Amber | `#F59E0B` | Primary action and editorial emphasis |
| Amber Light | `#FBBF24` | Active/highlight text |
| Blue | `#3B82F6` | Supporting information state |
| Teal | `#14B8A6` | Live-data identity |
| Emerald | `#10B981` | Positive/complete state |
| Crimson | `#EF4444` | Warning/closure state |

Use amber as the primary brand accent. Blue, teal, emerald, and crimson are semantic data/status colors, not competing decorative accents. Do not use them all as equal-weight decoration in one component.

### Dark archive experience

| Token | Value | Role |
|---|---|---|
| Archive Canvas | `#1A1A1A` | History page background |
| Archive Surface | `#27231D` | Panels and cards |
| Archive Hover | `#302A20` | Hovered archive card |
| Parchment | `#F3EAD8` | Primary archive text |
| Aged Parchment | `#D2C4AA` | Secondary archive text |
| Archive Muted | `#A99A80` | Metadata and captions |
| Antique Gold | `#C9A66B` | Primary archive accent |
| Gold Highlight | `#E3C58E` | Active links and emphasis |
| Archive Border | `rgba(205,176,123,0.32)` | Structural borders |

Archive contrast must remain readable. Gold is an accent, never the only way to communicate status.

## 3. Typography

- **Primary display:** Outfit, bold and compact, for travel landing headings and major navigation.
- **Primary body:** Inter, 16px minimum for normal body copy, relaxed line-height around 1.6.
- **Archive display:** Playfair Display for history and History Vault headings, with Georgia as a system fallback. This serif is intentionally limited to heritage/editorial content.
- **Metadata:** Existing body sans-serif with tabular numerals for timestamps, tide heights, counts, and travel measurements.
- **Reading width:** Keep long-form history paragraphs near 65–75 characters per line where layout permits.
- **Hierarchy:** Establish structure through size, weight, spacing, and color. Avoid all-caps body copy and excessive gradient text.

## 4. Layout and responsive rules

- Main content uses a centered container with a 1280px maximum width and 24px horizontal padding.
- Use CSS Grid for multi-column content. Collapse to a single column on narrow screens.
- Keep the county navigation and itinerary actions reachable on mobile; mobile navigation is a drawer, not a compressed desktop menu.
- Long archival captions, county names, road names, and external source labels must wrap rather than force horizontal scrolling.
- Embedded maps use a responsive width, a bounded height, a descriptive iframe title, lazy loading, and a direct official-site fallback link.
- Tables must remain horizontally scrollable within their own container on narrow screens; page-level horizontal overflow is prohibited.

## 5. Component rules

### Navigation
- Sticky header with clear brand lockup and strong contrast.
- Active route is indicated by both color and a visible background/border treatment.
- Archive routes switch the header to the charcoal/gold archive treatment without changing the logo.

### Cards and panels
- Use the existing `glass-card` and `glass-panel` patterns where grouping improves comprehension.
- Cards have a 14px base radius; avoid nested card-within-card stacks.
- Archive cards use charcoal surfaces and restrained gold borders.
- Hover effects are subtle and must not be the only indication that something is interactive.

### Buttons and links
- Primary actions use amber with dark text.
- Secondary actions remain clearly outlined or filled against the current surface.
- External links identify the destination or institution and open in a new tab with safe rel attributes.
- Keyboard focus must be visible. Interactive targets should be approximately 44px high where practical.

### Live data
- Display source, observation/update time, and refresh cadence near live information.
- Distinguish real-time incident records from predictions and schedules.
- A failed feed must show an honest unavailable state and preserve a working official fallback link.
- Do not infer severity or closure status from a field the source does not provide.

### History Vault
- Each entry has a date/period, concise summary, named source, and a direct source link.
- Archival media includes descriptive alt text, caption, collection/holding institution, and rights/reuse note when known.
- Missing county history is an explicit research-in-progress state, not fabricated placeholder history.
- Indigenous history must be source-reviewed and community-aware. Do not infer identity, continuity, or affiliation from colonial labels alone.

## 6. Motion and interaction

- Keep motion restrained on the statewide visitor interface. Existing fade-in and small hover transitions are sufficient for most surfaces.
- Animate only transform and opacity where possible.
- Honor `prefers-reduced-motion`; never make navigation, reading, or live-data access depend on animation.
- Avoid scroll hijacking, forced horizontal scroll, autoplaying media, or perpetual animation in informational sections.

## 7. Accessibility and resilience

- Use semantic landmarks, a logical heading hierarchy, descriptive link text, and meaningful image alt text.
- Every interactive control must be keyboard-operable with a visible focus state.
- Maintain readable contrast in both travel and archive themes.
- Support 200% zoom, long translated labels, special characters, and small screens without clipping.
- Announce asynchronous live-data state changes accessibly when practical.
- Handle empty feeds, API failures, timeouts, and partial NOAA station responses independently so one failing source does not hide the other data.
- Keep all essential history and travel content readable without requiring an embedded third-party map to load.

## 8. Search and structured content

- Every indexable route has a unique, truthful title and description.
- County tab routes canonicalize to the county overview URL while keeping their own human-readable page title.
- JSON-LD must describe the actual site, creator, and page content; never use unsupported professional titles, certifications, or institutional affiliations.
- County History Vault entries remain data-driven in `src/data/county-history.json`.
- Keep `sitemap.xml`, `robots.txt`, `llms.txt`, and `ai-index.json` consistent with public routes and actual content.

## 9. Anti-patterns

- Do not replace the existing NC Travel Guide logo with an invented logo.
- Do not make the whole site dark just because the History section has an archive theme.
- Do not claim every county has a complete history collection when only some have reviewed records.
- Do not publish unsourced Indigenous-history summaries.
- Do not call tide predictions live water-level observations.
- Do not label an incident high/medium/low impact unless the queried source actually returns a valid severity value.
- Do not use tiny low-contrast text, inaccessible color-only status, nested card stacks, or fixed-width layouts that break on mobile.
- Do not add heavy motion dependencies to informational pages without a demonstrated user benefit.
