# Joaia Demo

An AI tour guide app made with expo. Hardcoded for Zurich :)

## Quick Start

### 1. Clone & Install Dependencies

```bash
# Install packages using Bun
bun install
```

### 2. Configure Environment Variables

Create a .env file in the root directory

```bash
EXPO_PUBLIC_BACKEND_URL=YOUR_KEY
ANDROID_GOOGLE_MAPS_API_KEY=YOUR_KEY
```

### 1. Clone & Install Dependencies

```bash
# Install packages using Bun
bun start
```

## Architecture overview

### Map & Spatial Engine (react-native-maps)

- Uses native react-native-maps components (Polyline paths, custom MapMarker states, bounds, padding)
- Zustand Map Store: Holds spatial data (itinerary plan, routing paths, explore items, search results, viewfinder
  coordinates)
- Camera Control (useMapController): Hook that managed automated panning, zooming of map

### Conversational Experience

- Typed Message Unions: Uses rigid discriminated union payloads with conditional rendering to map complex server
  structures into custom message UI blocks.
- CTA Chips (Quick Actions): appends proactive response chips to the end of every message, ensuring continuous
  engagement without text entry.
- Resiliency States: Built-in error handling with explicit loading cues, empty state layouts, and a dedicated message
  retry pipeline.

### Bottom Sheets Layout

Coordinates multiple contextual sheets overlaying the map canvas for a smooth and fun experience:

- figureSheet: historical background on figures who shaped the city.
- placeDetailSheet: Live information (reviews, hours, price levels) with direct add-to-plan links.
- planSheet: The current live itinerary, showing stop sequence orders and personal route notes.
- searchResultSheet: Lists active local queries with direct interaction gateways back into place cards.