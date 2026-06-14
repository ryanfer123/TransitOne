---
name: Neo-Crystalline System
colors:
  surface: '#0e1417'
  surface-dim: '#0e1417'
  surface-bright: '#343a3d'
  surface-container-lowest: '#090f12'
  surface-container-low: '#161c20'
  surface-container: '#1a2024'
  surface-container-high: '#252b2e'
  surface-container-highest: '#303639'
  on-surface: '#dee3e7'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#dee3e7'
  inverse-on-surface: '#2b3135'
  outline: '#859398'
  outline-variant: '#3c494e'
  surface-tint: '#3cd7ff'
  primary: '#a8e8ff'
  on-primary: '#003642'
  primary-container: '#00d4ff'
  on-primary-container: '#00586b'
  inverse-primary: '#00677e'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#6cf4e0'
  on-tertiary: '#003731'
  tertiary-container: '#4ad7c4'
  on-tertiary-container: '#005a51'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b4ebff'
  primary-fixed-dim: '#3cd7ff'
  on-primary-fixed: '#001f27'
  on-primary-fixed-variant: '#004e5f'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#0e1417'
  on-background: '#dee3e7'
  surface-variant: '#303639'
typography:
  display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system occupies the intersection of **Neobrutalism** and **Glassmorphism**, creating a high-energy, high-contrast environment designed for technical products, data visualization, or forward-thinking developer tools. 

The aesthetic is characterized by "hard-shell" elements—thick borders and non-diffused shadows—containing "soft-core" interiors—semi-transparent, blurred surfaces. The goal is to evoke a sense of structural integrity mixed with digital sophistication. It is unapologetically bold, favoring high-density information layouts over excessive whitespace.

## Colors
The palette is rooted in a deep charcoal foundation, providing a "void" that allows vibrant, high-saturation accents to glow. 

- **Backgrounds:** Primarily #0E1417. Surface containers use the same hex with variable alpha (70-85%) to achieve the glass effect.
- **Accents:** Electric Cyan is the primary action color. Amber, Teal, and Indigo serve as semantic or categorical identifiers.
- **Borders:** Pure black (#000000) is used exclusively for structural borders to maintain the Neobrutalist edge.
- **Glass Tinting:** Glass surfaces should have a 1px inner stroke of white at 10% opacity on the top and left edges to simulate a light catch.

## Typography
The typography strategy pairs the aggressive weight of **Inter** for structural hierarchy with the technical precision of **JetBrains Mono** for data and metadata.

Headlines should be set with tight tracking and heavy weights (800+) to command attention. Use JetBrains Mono for any numerical data, status labels, or "system-speak" to reinforce the technical nature of the design system. Maintain high contrast between text and background—white or high-brightness accents only.

## Layout & Spacing
The layout follows a strict 4px baseline grid. Information density is high, meaning margins are kept functional rather than aesthetic.

- **Grid:** 12-column fluid grid for desktop with 16px gutters.
- **Neobrutalist Offset:** Elements should often "break" the grid slightly through their 4px hard shadows, which do not contribute to the element's actual layout box.
- **Density:** Favor "Stack" layouts for data. Use 8px spacing between related items and 16px between distinct sections.

## Elevation & Depth
Depth is not communicated through realism or soft shadows, but through **Shadow Offsets** and **Backdrop Blurs**.

1.  **Level 0 (Base):** Deep charcoal #0E1417.
2.  **Level 1 (Cards):** Glass surface (80% opacity) with a 20px backdrop blur. 2px black border. 4px hard shadow (Black, 100% opacity, no blur).
3.  **Level 2 (Active/Hover):** The element shifts -2px on X and Y axes, while the shadow expands to 6px, creating a "popping" effect.
4.  **Level 3 (Modals):** 4px black border, 8px hard shadow. Backdrop is darkened with a 40% black overlay.

## Shapes
This design system utilizes **Sharp (0px)** corners for all primary structural elements (Cards, Buttons, Inputs). This reinforces the "Brutalist" aspect of the narrative. In rare cases where a softer touch is required for accessibility or nested tags, a maximum radius of 2px may be used, but the default is always square.

## Components

### Buttons
- **Primary:** Electric Cyan fill, 2px black border, 4px black hard shadow. Text is bold and black.
- **Secondary:** Transparent glass fill (20px blur), 2px black border, 4px black hard shadow. Text is Electric Cyan.
- **Interaction:** On click, the button moves 4px down and right, hiding the shadow to simulate a physical press.

### Cards & Containers
- Glassmorphic panels with `backdrop-filter: blur(20px)`.
- Always framed with a 2px to 4px black border.
- Headlines within cards should be flush to the top-left, often separated by a 2px horizontal black rule.

### Input Fields
- Background is a darker tint of the neutral base (#050708).
- 2px black border.
- On focus, the border changes to Electric Cyan and the 4px hard shadow appears.

### Chips & Data Tags
- Use JetBrains Mono.
- Solid fills using the accent palette (Teal, Indigo, Amber) with black text.
- No shadows for small tags to maintain legibility.

### Progress Bars
- Background: Black.
- Fill: Electric Cyan or Teal. 
- No rounded ends; strictly rectangular.