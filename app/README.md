# Thomas TrackMaster Layout Designer - Web App

This is the web application for the Thomas TrackMaster Layout Designer.

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173/

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
/app
  /src
    /components      - React components
      TrackCanvas.tsx  - Canvas component for rendering track pieces
    /types           - TypeScript type definitions
      track.ts         - Track piece types from JSON schema
    /utils           - Utility functions
      trackLoader.ts   - Functions to load track piece data
      trackRenderer.ts - Canvas rendering engine
    App.tsx          - Main application component
    App.css          - Application styles
  /public
    /data            - Track piece data files (copied from ../data)
  package.json       - Dependencies and scripts
  vite.config.ts     - Vite configuration
```

## Features

### Current (Prototype)
- ✅ Load track piece data from JSON files
- ✅ Render track pieces on HTML5 Canvas
- ✅ Visualize straight and curved tracks
- ✅ Show connection points (male/female)
- ✅ Display grid for alignment
- ✅ Toggle grid and connections visibility

### Planned
- [ ] Drag-and-drop track piece placement
- [ ] Smart snapping between pieces
- [ ] Rotation controls
- [ ] Real-time validation
- [ ] Save/load layouts
- [ ] Multi-piece layouts
- [ ] Zoom and pan controls

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **HTML5 Canvas** - Rendering engine
- **Native APIs** - No heavy dependencies

## Track Piece Data

Track pieces are loaded from JSON files in the `/public/data` directory. See the parent directory's `data/README.md` for information about the data format and schema.

## Development Notes

- Canvas rendering uses the coordinate system defined in the data model
- Origin (0,0) is at the center of each piece's first connection point
- Angles: 0° = right, 90° = up (counter-clockwise)
- All measurements in millimeters, scaled for display

## Contributing

This is part of the Thomas TrackMaster Layout Designer project. See the main README in the parent directory for overall project information.
