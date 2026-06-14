# TransitOne Design System
## VISUAL IDENTITY
App name: TransitOne
Color palette:
- Deep navy #0F1F3D (background)
- Electric cyan #00D4FF (live-data accent)
- Surface cards #162947
- Bus = amber #F59E0B
- Metro = teal #14B8A6
- Train = indigo #6366F1
Typography: geometric sans-serif for UI, monospaced for ETAs and platform numbers.
Brand feel: precision control room — always live, always trustworthy.

## HOME DASHBOARD
Persistent map view (top 55% of screen) with animated, color-coded vehicle dots moving in real time. A scrollable drawer below shows "Near You" — next 3 arrivals across all modes, unified by walking time. Global search bar accepts stop names, route numbers, and destinations.

## MULTI-MODAL JOURNEY PLANNER
Route planner combining bus + metro + train legs. Each route card shows: total travel time, fare estimate, number of interchanges, live delay status per leg, and a step-by-step timeline with mode icons. Sort by fastest, cheapest, or fewest transfers.

## LIVE VEHICLE TRACKER
Bus: real-time GPS position on route map, occupancy level, next 3 stops with ETA, "Get off alert" toggle. Metro: platform-level data — which train is at which platform, doors status, next departure countdowns per line. Train: coach availability, platform number, live on-time percentage.

## SMART ALERTS
Commute alerts: notify 10 min before usual departure if delay detected. Last-ride alerts: warn when a route's last service is within 30 min. Disruption banners inline in map and journey results for strikes, breakdowns, or route suspensions. Delivery via push notification and in-app toast.

## SAVED ROUTES & COMMUTES
Users save Home and Work addresses plus up to 5 custom routes. Commute widget auto-activates on weekday mornings. Saved routes display a live status ring (green = on time, amber = minor delay, red = disrupted) without tapping in.

## MAP LAYER
Mapbox GL with custom dark transit style. Three toggleable layers: bus routes (amber polylines), metro lines (teal), train corridors (indigo). Vehicle icons pulse when data is fresh (<15s) and fade to grey when stale. Tap any vehicle to open a side sheet with live details.

## UX ARCHITECTURE
Bottom-sheet architecture: map always visible behind interactions. Sheets snap to three heights — peek, half, full. 4-tab bottom bar: Home · Explore · Journeys · Alerts. All primary actions within thumb reach for one-handed use.

## LIVE ETA CHIP
Reusable LiveETA badge: monospaced countdown with animated progress arc. Color: cyan → amber (under 3 min) → red (under 1 min). Used in arrival cards, saved route widgets, and push notifications.
