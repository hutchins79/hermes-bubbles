# Changelog

## 1.2.0 — 2026-10-06

- New themes: **Grape**, **Sunset**, **Midnight**, **Bubblegum**, **Mint** and **Peach**.
- Pastel themes use dark text in your bubbles in light mode, and a deeper shade with white text in dark mode.
- **Bubbles** is now labeled **Bubbles Blue**. Its id is unchanged, so your theme selection carries over.
- Inline code, text selection and the edit caret in your bubbles follow the bubble's text color.

## 1.1.2 — 2026-10-06

- Fix: the reply tail no longer covers the first letter of the last line.
- README: install from a version tag, with a one-line check of what's installed. Screenshots updated to show tails.

## 1.1.1 — 2026-10-06

- Fix: bubble tails now cover the whole rounded corner, so there's no notch where the tail meets the bubble.

## 1.1.0 — 2026-10-06

- New: **Bubbles Graphite**, neutral grey sent bubbles in light and dark.
- New: bubble tails on sent bubbles and on text-only replies. Replies with code or tables keep a plain bubble.
- Inline code inside your messages gets a little padding and rounded corners.
- Replies containing a plain `pre` block now widen like code cards do.

## 1.0.1 — 2026-10-06

- Fix: on hover, the sent-message time and restore button no longer cover the end of your text. They now sit just below the bubble.

## 1.0.0 — 2026-10-06

- First release.
- **Bubbles**: blue sent bubbles, grey received bubbles, light and dark palettes.
- **Bubbles Green**: SMS-style green sent bubbles, light and dark palettes.
- Sent bubbles hug their text and sit on the right; replies sit in grey bubbles on the left. Tool activity stays outside the bubbles.
- System UI font stack (SF Pro on macOS, Segoe UI on Windows). Nothing is downloaded.
- Respects Settings → Appearance → Message Bubble transparency.
