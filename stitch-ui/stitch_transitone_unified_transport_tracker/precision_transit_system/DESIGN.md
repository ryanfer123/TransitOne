---
name: TransitOne Velocity
colors:
  surface: '#0e1417'
  surface-dim: '#0e1417'
  surface-bright: '#333a3d'
  surface-container-lowest: '#080f12'
  surface-container-low: '#161d1f'
  surface-container: '#1a2123'
  surface-container-high: '#242b2e'
  surface-container-highest: '#2f3639'
  on-surface: '#dde3e7'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#dde3e7'
  inverse-on-surface: '#2b3134'
  outline: '#859398'
  outline-variant: '#3c494e'
  surface-tint: '#3cd7ff'
  primary: '#a8e8ff'
  on-primary: '#003642'
  primary-container: '#00d4ff'
  on-primary-container: '#00586b'
  inverse-primary: '#00677e'
  secondary: '#b5c7ed'
  on-secondary: '#1e304f'
  secondary-container: '#354767'
  on-secondary-container: '#a4b5db'
  tertiary: '#ffd9a1'
  on-tertiary: '#432c00'
  tertiary-container: '#feb528'
  on-tertiary-container: '#6c4900'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b4ebff'
  primary-fixed-dim: '#3cd7ff'
  on-primary-fixed: '#001f27'
  on-primary-fixed-variant: '#004e5f'
  secondary-fixed: '#d7e3ff'
  secondary-fixed-dim: '#b5c7ed'
  on-secondary-fixed: '#061b39'
  on-secondary-fixed-variant: '#354767'
  tertiary-fixed: '#ffdeae'
  tertiary-fixed-dim: '#ffba3d'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#604100'
  background: '#0e1417'
  on-background: '#dde3e7'
  surface-variant: '#2f3639'
  background-deep: '#0F1F3D'
  surface-sheet: '#162947'
  border-accent: '#1E3A8A'
  status-live: '#00d4ff'
  status-delayed: '#feb528'
  metro-teal: '#a8e8ff'
  bus-amber: '#ffd9a1'
  train-indigo: '#b5c7ed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  metadata:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
  label-eta:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.0'
  label-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 12px
  margin-edge: 16px
  touch-target-min: 44px
  sheet-peek: 80px
  sheet-half: 50vh
---

## Brand & Style
TransitOne Velocity is a high-tech, data-driven transit platform designed for the urban commuter. The aesthetic is **Cyber-Symmetry**—a blend of **Glassmorphism** and **Corporate Modern** styles. It evokes a "Mission Control" feeling: technical, precise, and highly responsive. 

The brand personality is authoritative yet frictionless, utilizing dark mode to reduce eye strain in night-time or low-light urban environments. It relies on neon-inspired accents (cyan, amber, indigo) to distinguish between transit modes, set against a deep, layered navy background. Visual interest is maintained through micro-animations like pulsing "live" dots and spinning route rings that imply real-time movement and data vitality.

## Colors
The palette is rooted in a **Deep Navy Base** (#0F1F3D), moving away from pure black to maintain depth and sophisticated layering. 

- **Primary (Cyan):** Used for Metro lines, active navigation states, and primary actions. It often carries a glow effect to simulate light-emitting displays.
- **Secondary (Indigo/Steel):** Used for heavy rail and secondary interface elements like inactive nav items.
- **Tertiary (Amber):** Specifically reserved for Bus transit and warning/delay states to provide immediate visual contrast.
- **Surface Strategy:** Backgrounds use a hierarchy of navy shades. The bottom sheet and cards utilize a slightly lighter navy (#162947) with subtle borders to separate content from the map layer.

## Typography
The system uses a dual-font approach to balance readability with a technical aesthetic.

- **Inter (Sans-Serif):** Used for all primary UI elements, headlines, and body copy. It provides a clean, neutral foundation that ensures legibility in high-density information environments.
- **JetBrains Mono (Monospace):** Used for time-sensitive data (ETAs, platform numbers, route IDs) and the brand logo. The fixed-width character spacing reinforces the "data-feed" and "real-time" nature of the application.

**Scaling:** Use `display-lg` for primary headers on empty states, but favor `headline-md` for standard view titles. `label-data` is preferred for all uppercase status badges to ensure clear character differentiation.

## Layout & Spacing
The layout follows a **Hybrid Contextual Grid**. 

- **Mobile First:** Content is organized into "Bento" style cards or vertical lists within a persistent bottom sheet.
- **Map Viewport:** The top 50-55% of the screen is dedicated to the map canvas, providing spatial context.
- **Bottom Sheet:** A modal surface that anchors to the bottom, allowing for "Peek" (80px), "Half" (50vh), and "Full" (95vh) states.
- **Spacing Units:** A strict 4px baseline is used. Standard containers use a 16px side margin (`margin-edge`) to ensure content doesn't hit screen boundaries.
- **Alignment:** Information is grouped in logical clusters using 12px gutters between related cards or list items.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Material Translucency** rather than traditional heavy shadows.

- **Layer 0 (Background):** The underlying map, desaturated and darkened (brightness 50%, grayscale).
- **Layer 1 (Surfaces):** Floating search bars and the bottom sheet use a backdrop-blur (12px-16px) and 80% opacity to maintain a sense of place.
- **Layer 2 (Cards):** Cards within the sheet use a slightly lighter fill (`surface-container-high`) and a very thin, low-opacity outline (10% - 20%) to define boundaries.
- **Shadows:** Reserved for the Search Bar and Global Navigation to indicate they are the highest interactive layers (using `shadow-2xl` for search and `shadow-lg` for navigation).

## Shapes
The shape language is modern and approachable but maintains a structured edge.

- **Containers:** Large surfaces like the Bottom Sheet use a generous 24px top radius to feel integrated into the handset hardware.
- **Cards & Inputs:** Use a 12px (xl) or 16px (2xl) radius to provide a friendly, modern "bento" feel.
- **Buttons & Small Chips:** Use 4px to 8px radius for a more "tool-like" and precise appearance.
- **Interactive Indicators:** Live tracking rings and pulsing dots are perfectly circular (full) to denote movement and energy.

## Components
- **Arrival Cards:** Feature a leading 48x48 icon container with a 10% tinted background matching the transit mode. Use a trailing CTA area for "Live Tracking" status chips.
- **ETA Chips:** High-contrast containers using JetBrains Mono. They should feature a pulsing dot on the left to indicate live data.
- **Search Bar:** A floating, full-width input with a backdrop blur. It should feature a 1px border that glows (Primary Color) when focused.
- **Bottom Navigation:** A persistent bar with 4-5 items. Active items are highlighted with a low-opacity tinted background (10%) and the primary accent color.
- **Bento Widgets:** Two-column grid items for "Saved Routes." These combine an icon with a rotating status ring to show movement without requiring a full map interaction.