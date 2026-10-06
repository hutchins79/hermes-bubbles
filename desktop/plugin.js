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
const VERSION = '1.0.1'

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

function bubbleCSS({ meLight, meDark }) {
  return `
:root {
  --bubbles-me: ${meLight};
  --bubbles-me-fg: #FFFFFF;
  --bubbles-them: ${THEM_LIGHT};
  --bubbles-radius: 1.125rem;
  /* Keeps Settings -> Appearance -> Message Bubble transparency working. */
  --dt-user-bubble: color-mix(in srgb, var(--bubbles-me) var(--user-bubble-keep, 100%), transparent) !important;
}
:root.dark {
  --bubbles-me: ${meDark};
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
  background: color-mix(in srgb, #FFFFFF 20%, transparent) !important;
}
.composer-human-message a {
  text-decoration: underline !important;
}
.composer-human-message button {
  color: color-mix(in srgb, var(--bubbles-me-fg) 80%, transparent) !important;
}
.composer-human-message ::selection {
  background: color-mix(in srgb, #FFFFFF 35%, transparent);
  color: #FFFFFF;
}

/* Editing a sent message: give the editor the full width back. */
.composer-human-message:has([data-slot='composer-rich-input']) {
  width: 100% !important;
  max-width: 100% !important;
  caret-color: #FFFFFF;
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
[data-slot='aui_assistant-message-content'] .aui-md.prose:not(.aui-md .aui-md):has([data-slot='code-card'], [data-streamdown='code-block'], .aui-md-table) {
  width: 100% !important;
  max-width: 100% !important;
}

/* Code and tables sit on the page color inside the grey bubble. */
[data-slot='aui_assistant-message-content'] .aui-md.prose :is([data-slot='code-card'], .aui-md-table) {
  background-color: var(--dt-card, var(--ui-bg-editor));
}
`.trim()
}

// ─── Themes ────────────────────────────────────────────────────────────────

function makeTheme({ name, label, description, meLight, meDark, linkLight, linkDark, tintLight, tintDark }) {
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
    customCSS: bubbleCSS({ meLight, meDark })
  }
}

const THEMES = [
  makeTheme({
    name: 'bubbles',
    label: 'Bubbles',
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
