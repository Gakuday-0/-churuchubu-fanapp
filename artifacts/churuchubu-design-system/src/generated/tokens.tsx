/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#fafafa",
      "foreground": "#171717",
      "border": "#e5e5e5",
      "card": "#ffffff",
      "cardForeground": "#171717",
      "popover": "#ffffff",
      "popoverForeground": "#171717",
      "primary": "#171717",
      "primaryForeground": "#fafafa",
      "secondary": "#f5f5f5",
      "secondaryForeground": "#171717",
      "muted": "#f5f5f5",
      "mutedForeground": "#737373",
      "accent": "#e955a8",
      "accentForeground": "#ffffff",
      "destructive": "#ef4444",
      "destructiveForeground": "#fafafa",
      "input": "#e5e5e5",
      "ring": "#171717",
      "chart1": "#e955a8",
      "chart2": "#171717",
      "chart3": "#737373",
      "chart4": "#a3a3a3",
      "chart5": "#c02675",
      "sidebar": "#fafafa",
      "sidebarForeground": "#404040",
      "sidebarBorder": "#e5e5e5",
      "sidebarPrimary": "#171717",
      "sidebarPrimaryForeground": "#fafafa",
      "sidebarAccent": "#f5f5f5",
      "sidebarAccentForeground": "#171717",
      "sidebarRing": "#171717"
    },
    "dark": {
      "background": "#111111",
      "foreground": "#f5f5f5",
      "border": "#262626",
      "card": "#171717",
      "cardForeground": "#f5f5f5",
      "popover": "#171717",
      "popoverForeground": "#f5f5f5",
      "primary": "#f5f5f5",
      "primaryForeground": "#171717",
      "secondary": "#262626",
      "secondaryForeground": "#f5f5f5",
      "muted": "#262626",
      "mutedForeground": "#a3a3a3",
      "accent": "#f26bb8",
      "accentForeground": "#171717",
      "destructive": "#7f1d1d",
      "destructiveForeground": "#fafafa",
      "input": "#262626",
      "ring": "#d4d4d4",
      "chart1": "#f26bb8",
      "chart2": "#f5f5f5",
      "chart3": "#a3a3a3",
      "chart4": "#737373",
      "chart5": "#c02675",
      "sidebar": "#171717",
      "sidebarForeground": "#f5f5f5",
      "sidebarBorder": "#262626",
      "sidebarPrimary": "#3b6fe0",
      "sidebarPrimaryForeground": "#ffffff",
      "sidebarAccent": "#262626",
      "sidebarAccentForeground": "#f5f5f5",
      "sidebarRing": "#d4d4d4"
    }
  },
  "fontFamily": {
    "sans": [
      "Inter",
      "sans-serif"
    ],
    "serif": [
      "Georgia",
      "serif"
    ],
    "mono": [
      "Menlo",
      "monospace"
    ]
  },
  "radius": "0.5rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
