# Thomas TrackMaster Layout Designer

A web-based application for designing physically accurate track layouts for Thomas TrackMaster train sets.

## Project Overview

Enable users to design valid track layouts using drag-and-drop, with smart snapping and real-time validation to ensure all layouts can actually be built with real TrackMaster pieces.

## Key Features

- 🎯 **Physical Accuracy** - All track pieces modeled with real-world dimensions
- 🖱️ **Drag-and-Drop** - Intuitive layout building interface
- 🧲 **Smart Snapping** - Automatic connection detection with visual feedback
- 🔄 **Easy Rotation** - Simple piece manipulation (R key to rotate)
- ✅ **Real-Time Validation** - Ensures layouts are physically buildable
- 💾 **Save/Load** - Persist your designs locally

## Project Status

**Current Phase**: Data Model & Schema Definition ✅

- [x] Product Requirements Document (PRD)
- [x] Track piece data schema
- [x] Initial track piece library (5 pieces)
- [x] JSON Schema validation
- [ ] Project scaffolding (React/Vite)
- [ ] Canvas rendering engine
- [ ] Drag-and-drop implementation
- [ ] Snapping logic
- [ ] Validation engine

## Documentation

- **[PRD.md](PRD.md)** - Full product requirements and specifications
- **[docs/TRACK_PIECE_SCHEMA.md](docs/TRACK_PIECE_SCHEMA.md)** - Complete data schema documentation
- **[docs/DATA_MODEL_SUMMARY.md](docs/DATA_MODEL_SUMMARY.md)** - Data model overview and decisions
- **[data/README.md](data/README.md)** - Track piece data usage guide

## Project Structure

```
/ThomasTrackBuilder
  /data                    # Track piece definitions
    /tracks
      /straight            # Straight track pieces
      /curved              # Curved track pieces
      /switches            # Switch/turnout pieces
      /special             # Crossings, turntables, etc.
      /elevation           # Risers, bridges
      /accessories         # Stations, terminals
    track-catalog.json     # Index of all pieces
    schema.json            # JSON Schema for validation
  /docs                    # Documentation
    TRACK_PIECE_SCHEMA.md  # Schema specification
    DATA_MODEL_SUMMARY.md  # Data model overview
  PRD.md                   # Product Requirements Document
  README.md                # This file
```

## Track Pieces

Currently defined track pieces (5):

**Straight Tracks**
- Short Straight (107.5mm)
- Medium Straight (215mm)

**Curved Tracks**
- Standard Curve 45° (180mm radius)

**Switches**
- Left Switch
- Right Switch

See [data/track-catalog.json](data/track-catalog.json) for the complete catalog.

## Data Model

Each track piece is defined with:
- **Dimensions** - Length, width, height, radius, angles
- **Connections** - Male/female connectors with positions and angles
- **Geometry** - Path definitions for rendering
- **Visual** - Colors and rendering styles
- **Metadata** - Manufacturer, availability, SKU

Example:
```json
{
  "id": "straight-medium",
  "name": "Medium Straight Track",
  "dimensions": { "length": 215, "width": 45, "height": 12, "unit": "mm" },
  "connections": [...],
  "geometry": {...},
  "visual": {...},
  "metadata": {...}
}
```

See [docs/TRACK_PIECE_SCHEMA.md](docs/TRACK_PIECE_SCHEMA.md) for full details.

## Development Roadmap

### Phase 1: Foundation (Current) ✅
- [x] PRD and requirements
- [x] Data model and schema
- [x] Initial track piece library

### Phase 2: Prototype (Next)
- [ ] Project setup (React + Vite)
- [ ] Canvas rendering
- [ ] Basic piece visualization
- [ ] Simple drag-and-drop

### Phase 3: Core Features
- [ ] Smart snapping logic
- [ ] Rotation controls
- [ ] Validation engine
- [ ] Save/load functionality

### Phase 4: Polish
- [ ] UI/UX refinements
- [ ] Additional track pieces
- [ ] Testing and bug fixes
- [ ] Documentation

## Contributing

This project is currently in early development. Contribution guidelines will be added soon.

### Adding Track Pieces

To add a new track piece:
1. Measure the physical piece (see [measurement guidelines](docs/TRACK_PIECE_SCHEMA.md#measurement-guidelines))
2. Create a JSON file in `/data/tracks/{category}/`
3. Validate against the schema
4. Add to `track-catalog.json`

## Tech Stack (Planned)

- **Frontend**: React or Vue.js
- **Rendering**: HTML5 Canvas or SVG
- **State**: Redux/Zustand or Context API
- **Drag-and-Drop**: react-dnd or native API
- **Styling**: Tailwind CSS or styled-components
- **Validation**: Custom physics/validation engine

## License

TBD

## Contact

Project maintainer: TBD

---

**Status**: Early Development
**Last Updated**: December 1, 2025
