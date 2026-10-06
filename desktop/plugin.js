// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Charles (@hutchins79)
//
// Hermes Bubbles — Messages-style chat bubbles for Hermes Desktop.
//
// Each theme ships a light palette (`colors`), a hand-tuned dark palette
// (`darkColors`), and `customCSS` that turns the transcript into chat
// bubbles. Hermes injects/removes `customCSS` itself when the theme is
// applied or switched away from, so nothing here touches the DOM directly.
import { THEMES_AREA } from '@hermes/plugin-sdk'

const ID = 'hermes-bubbles'
const VERSION = '1.2.0'

// System UI stack: SF Pro on macOS, Segoe UI Variable / Segoe UI on Windows.
// Nothing is bundled or downloaded (SF Pro can't be redistributed).
const TYPOGRAPHY = {
  fontSans:
    "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI Variable Text', 'Segoe UI', system-ui, " +
    "'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', emoji"
}

// ─── Shared neutral palettes ───────────────────────────────────────────────

const LIGHT_BASE = {
  background: '#FFFFFF',
  foreground: '#1D1D1F',
  card: '#FFFFFF',
  cardForeground: '#1D1D1F',
  muted: '#F2F2F7',
  mutedForeground: '#6E6E73',
  popover: '#FFFFFF',
  popoverForeground: '#1D1D1F',
  secondary: '#E9E9EB',
  secondaryForeground: '#1D1D1F',
  accentForeground: '#1D1D1F',
  border: '#D1D1D6',
  input: '#F2F2F7',
  destructive: '#FF3B30',
  destructiveForeground: '#FFFFFF',
  sidebarBackground: '#F2F2F7',
  sidebarBorder: '#D1D1D6'
}

const DARK_BASE = {
  background: '#000000',
  foreground: '#F5F5F7',
  card: '#1C1C1E',
  cardForeground: '#F5F5F7',
  muted: '#2C2C2E',
  mutedForeground: '#98989D',
  popover: '#1C1C1E',
  popoverForeground: '#F5F5F7',
  secondary: '#26252A',
  secondaryForeground: '#F5F5F7',
  accentForeground: '#F5F5F7',
  border: '#38383A',
  input: '#1C1C1E',
  destructive: '#FF453A',
  destructiveForeground: '#FFFFFF',
  sidebarBackground: '#1C1C1E',
  sidebarBorder: '#38383A'
}

// Received ("them") bubble greys, as in Messages.
const THEM_LIGHT = '#E9E9EB'
const THEM_DARK = '#26252A'

// ─── Bubble CSS ────────────────────────────────────────────────────────────
//
// Only selectors Hermes itself uses for the transcript:
//   .composer-human-message           your message bubble (and its edit composer)
//   [data-slot='composer-rich-input'] the inline editor, present while editing
//   [data-slot='aui_assistant-message-content'] .aui-md.prose
//                                     a reply's prose (tool rows sit outside it)
// `:root.dark` is toggled by Hermes when the dark palette is painted.

function bubbleCSS({ meLight, meDark, meFgLight, meFgDark }) {
  return `
:root {
  --bubbles-me: ${meLight};
  --bubbles-me-fg: ${meFgLight};
  --bubbles-them: ${THEM_LIGHT};
  --bubbles-radius: 1.125rem;
  /* Keeps Settings -> Appearance -> Message Bubble transparency working. */
  --dt-user-bubble: color-mix(in srgb, var(--bubbles-me) var(--user-bubble-keep, 100%), transparent) !important;
}
:root.dark {
  --bubbles-me: ${meDark};
  --bubbles-me-fg: ${meFgDark};
  --bubbles-them: ${THEM_DARK};
}

/* ── Sent: right-aligned colored bubble that hugs its text ── */
.composer-human-message {
  width: fit-content !important;
  max-width: min(78%, 42rem) !important;
  margin-left: auto !important;
  padding: 0.4375rem 0.875rem !important;
  border-color: transparent !important;
  border-radius: var(--bubbles-radius) !important;
  box-shadow: none !important;
  background-image: none !important;
  color: var(--bubbles-me-fg) !important;
}
.composer-human-message :where(p, span, li, a, strong, em, b, i, div, code, pre, blockquote, h1, h2, h3, h4) {
  color: inherit !important;
}
.composer-human-message :where(p) {
  margin-block: 0;
}
.composer-human-message :not(pre) > code {
  background: color-mix(in srgb, var(--bubbles-me-fg) 18%, transparent) !important;
  border-radius: 0.25rem;
  padding: 0.05em 0.3em;
}
.composer-human-message a {
  text-decoration: underline !important;
}
.composer-human-message button {
  color: color-mix(in srgb, var(--bubbles-me-fg) 80%, transparent) !important;
}
.composer-human-message ::selection {
  background: color-mix(in srgb, var(--bubbles-me-fg) 30%, transparent);
  color: var(--bubbles-me-fg);
}

/* Editing a sent message: give the editor the full width back. */
.composer-human-message:has([data-slot='composer-rich-input']) {
  width: 100% !important;
  max-width: 100% !important;
  caret-color: var(--bubbles-me-fg);
}

/* Sent: Hermes overlays the time/restore cluster on the bubble's last line.
   Hugging the text removes the room it reserves, so show it below the bubble
   instead (like "Delivered" in Messages). */
[data-slot='aui_user-bubble-actions'] .pointer-events-none.absolute.right-2.bottom-2 {
  bottom: -1.375rem !important;
  right: 0.25rem !important;
  background: transparent !important;
}

/* ── Received: left-aligned grey bubble around the reply text ── */
[data-slot='aui_assistant-message-content'] .aui-md.prose:not(.aui-md .aui-md) {
  width: fit-content !important;
  max-width: min(85%, 46rem) !important;
  padding: 0.5rem 0.875rem;
  border-radius: var(--bubbles-radius);
  background: var(--bubbles-them);
}

/* Replies with code or tables need the room; keep the bubble, drop the hug. */
[data-slot='aui_assistant-message-content'] .aui-md.prose:not(.aui-md .aui-md):has([data-slot='code-card'], [data-streamdown='code-block'], .aui-md-table, pre) {
  width: 100% !important;
  max-width: 100% !important;
}

/* Code and tables sit on the page color inside the grey bubble. */
[data-slot='aui_assistant-message-content'] .aui-md.prose :is([data-slot='code-card'], .aui-md-table) {
  background-color: var(--dt-card, var(--ui-bg-editor));
}

/* ── Tails ──
   Both bubbles clip their own overflow (Hermes needs that for long prompts
   and wide code), so a tail can't hang off the bubble itself.
   Sent: drawn by the bubble's full-width parent, whose right edge is the
   bubble's right edge. Received: only text-only replies get a tail; they
   can safely stop clipping because their text wraps. Wide replies (code,
   tables) keep Hermes' clip and go without a tail. */
:is(div, span):has(> .composer-human-message) {
  position: relative;
  isolation: isolate;
}
:is(div, span):has(> .composer-human-message)::after,
[data-slot='aui_assistant-message-content'] .aui-md.prose:not(.aui-md .aui-md):not(:has([data-slot='code-card'], [data-streamdown='code-block'], .aui-md-table, pre, img))::after {
  content: '';
  position: absolute;
  bottom: 0;
  /* Wide enough to cover the bubble's whole rounded corner (radius 18px),
     so the tail meets the flat bottom edge with no notch. */
  width: 1.5rem;
  height: 1.125rem;
  pointer-events: none;
  /* Behind the bubble's text; the parent isolates, so it stays above the page. */
  z-index: -1;
}
:is(div, span):has(> .composer-human-message)::after {
  right: -0.375rem;
  background: var(--dt-user-bubble);
  clip-path: path('M0 0 H18 C18 9 19.5 14.5 24 18 C19 18.6 12 18 0 18 Z');
}
[data-slot='aui_assistant-message-content'] .aui-md.prose:not(.aui-md .aui-md):not(:has([data-slot='code-card'], [data-streamdown='code-block'], .aui-md-table, pre, img)) {
  position: relative;
  overflow: visible;
  isolation: isolate;
}
[data-slot='aui_assistant-message-content'] .aui-md.prose:not(.aui-md .aui-md):not(:has([data-slot='code-card'], [data-streamdown='code-block'], .aui-md-table, pre, img))::after {
  left: -0.375rem;
  background: var(--bubbles-them);
  clip-path: path('M24 0 H6 C6 9 4.5 14.5 0 18 C5 18.6 12 18 24 18 Z');
}
/* No tail while editing a sent message, or in HUD mode. */
:is(div, span):has(> .composer-human-message:has([data-slot='composer-rich-input']))::after,
[data-hud-shell] :is(div, span):has(> .composer-human-message)::after,
[data-hud-shell] [data-slot='aui_assistant-message-content'] .aui-md.prose::after {
  content: none;
}
`.trim()
}

// ─── Themes ────────────────────────────────────────────────────────────────

// Sent-bubble text is white unless a theme says otherwise (pastels use dark
// text in light mode, where white would be unreadable).
const INK = '#1D1D1F'

function makeTheme({
  name, label, description, meLight, meDark, linkLight, linkDark, tintLight, tintDark,
  meFgLight = '#FFFFFF', meFgDark = '#FFFFFF'
}) {
  return {
    name,
    label,
    description,
    typography: TYPOGRAPHY,
    colors: {
      ...LIGHT_BASE,
      primary: linkLight,
      primaryForeground: '#FFFFFF',
      accent: tintLight,
      ring: linkLight,
      midground: linkLight,
      midgroundForeground: '#FFFFFF',
      composerRing: linkLight,
      userBubble: meLight,
      userBubbleBorder: meLight
    },
    darkColors: {
      ...DARK_BASE,
      primary: linkDark,
      primaryForeground: '#FFFFFF',
      accent: tintDark,
      ring: linkDark,
      midground: linkDark,
      midgroundForeground: '#FFFFFF',
      composerRing: linkDark,
      userBubble: meDark,
      userBubbleBorder: meDark
    },
    customCSS: bubbleCSS({ meLight, meDark, meFgLight, meFgDark })
  }
}

const THEMES = [
  makeTheme({
    name: 'bubbles',
    // id stays 'bubbles' so anyone already using it keeps their selection.
    label: 'Bubbles Blue',
    description: 'Messages-style blue bubbles, light and dark',
    meLight: '#007AFF',
    meDark: '#0A84FF',
    linkLight: '#007AFF',
    linkDark: '#0A84FF',
    tintLight: '#EAF3FF',
    tintDark: '#0F2340'
  }),
  makeTheme({
    name: 'bubbles-green',
    label: 'Bubbles Green',
    description: 'SMS-style green bubbles, light and dark',
    // A shade deeper than the stock SMS green (#34C759) so white bubble text
    // stays readable; buttons use Apple's accessible green (#248A3D).
    meLight: '#259A42',
    meDark: '#259A42',
    linkLight: '#248A3D',
    linkDark: '#259A42',
    tintLight: '#EAF8EE',
    tintDark: '#0E2A17'
  }),
  makeTheme({
    name: 'bubbles-graphite',
    label: 'Bubbles Graphite',
    description: 'Neutral graphite sent bubbles, light and dark',
    // Light: dark grey against the light-grey replies. Dark: a lighter grey
    // so sent and received stay distinct; white text is 9:1 and 6:1.
    meLight: '#48484A',
    meDark: '#636366',
    linkLight: '#007AFF',
    linkDark: '#0A84FF',
    tintLight: '#F2F2F7',
    tintDark: '#2C2C2E'
  }),

  // ── Bold colors: white text in both modes ──
  makeTheme({
    name: 'bubbles-grape',
    label: 'Bubbles Grape',
    description: 'Rich purple bubbles, light and dark',
    meLight: '#7B3FD1', // white text 6.0:1
    meDark: '#8A55DB', //  white text 4.8:1
    linkLight: '#7B3FD1',
    linkDark: '#B08CF0',
    tintLight: '#F3ECFD',
    tintDark: '#241638'
  }),
  makeTheme({
    name: 'bubbles-sunset',
    label: 'Bubbles Sunset',
    description: 'Burnt-orange bubbles, light and dark',
    meLight: '#C8430B', // white text 4.9:1
    meDark: '#D9480F', //  white text 4.3:1
    linkLight: '#C2410C',
    linkDark: '#FF8A50',
    tintLight: '#FFF0E8',
    tintDark: '#331709'
  }),
  makeTheme({
    name: 'bubbles-midnight',
    label: 'Bubbles Midnight',
    description: 'Deep navy bubbles, light and dark',
    meLight: '#1E3A8A', // white text 10.4:1
    meDark: '#2E4FB8', //  lifted off the black background; white text 7.2:1
    linkLight: '#1E40AF',
    linkDark: '#7A9CFF',
    tintLight: '#EAF0FF',
    tintDark: '#111C3D'
  }),

  // ── Pastels: dark text on a pastel bubble in light mode; a deeper shade
  //    with white text in dark mode, where pastels would glare. ──
  makeTheme({
    name: 'bubbles-bubblegum',
    label: 'Bubbles Bubblegum',
    description: 'Pastel pink bubbles, light and dark',
    meLight: '#F7B8D2', // dark text 10:1
    meDark: '#C2185B', //  white text 5.9:1
    meFgLight: INK,
    linkLight: '#C2185B',
    linkDark: '#F06292',
    tintLight: '#FDEEF4',
    tintDark: '#3A0F21'
  }),
  makeTheme({
    name: 'bubbles-mint',
    label: 'Bubbles Mint',
    description: 'Pastel mint bubbles, light and dark',
    meLight: '#A8E6C9', // dark text 11:1
    meDark: '#1A7F5A', //  white text 5.0:1
    meFgLight: INK,
    linkLight: '#0F7A55',
    linkDark: '#5FD3A5',
    tintLight: '#EAF9F1',
    tintDark: '#0D2A1F'
  }),
  makeTheme({
    name: 'bubbles-peach',
    label: 'Bubbles Peach',
    description: 'Pastel peach bubbles, light and dark',
    meLight: '#FFC9A8', // dark text 11:1
    meDark: '#B4532A', //  white text 5.0:1
    meFgLight: INK,
    linkLight: '#B4532A',
    linkDark: '#FFAD80',
    tintLight: '#FFF3EC',
    tintDark: '#35190C'
  })
]

export default {
  id: ID,
  name: 'Hermes Bubbles',
  version: VERSION,
  description: 'Messages-style chat bubbles for Hermes Desktop, in light and dark.',
  register(ctx) {
    for (const theme of THEMES) {
      ctx.register({ id: theme.name, area: THEMES_AREA, data: theme })
    }
  }
}
