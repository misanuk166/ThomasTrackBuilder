# Track Piece Data Schema

**Version:** 1.0
**Last Updated:** December 1, 2025

---

## Overview

This document defines the JSON schema for representing Thomas TrackMaster track pieces in the layout designer. Each track piece must have accurate physical dimensions and connection point specifications to ensure physically valid layouts.

---

## Schema Definition

### Root Track Piece Object

```typescript
interface TrackPiece {
  id: string;                    // Unique identifier (kebab-case)
  name: string;                  // Human-readable name
  category: TrackCategory;       // Category classification
  type: TrackType;              // Specific type within category
  dimensions: Dimensions;        // Physical dimensions
  connections: Connection[];     // Connection points (1-4 typically)
  geometry: Geometry;           // Shape/path definition
  visual: VisualProperties;     // Rendering properties
  metadata: Metadata;           // Additional information
}
```

### Track Categories and Types

```typescript
enum TrackCategory {
  STRAIGHT = "straight",
  CURVED = "curved",
  SWITCH = "switch",
  SPECIAL = "special",
  ELEVATION = "elevation",
  ACCESSORY = "accessory"
}

enum TrackType {
  // Straight types
  STRAIGHT_SHORT = "straight-short",
  STRAIGHT_MEDIUM = "straight-medium",
  STRAIGHT_LONG = "straight-long",

  // Curved types
  CURVE_STANDARD = "curve-standard",
  CURVE_WIDE = "curve-wide",
  CURVE_TIGHT = "curve-tight",

  // Switch types
  SWITCH_LEFT = "switch-left",
  SWITCH_RIGHT = "switch-right",
  SWITCH_Y = "switch-y",

  // Special types
  CROSSING = "crossing",
  TURNTABLE = "turntable",

  // Elevation types
  RISER = "riser",
  BRIDGE = "bridge",

  // Accessory types
  STATION = "station",
  TERMINAL = "terminal"
}
```

### Dimensions

```typescript
interface Dimensions {
  // For straight pieces
  length?: number;              // Length in mm
  width?: number;               // Width in mm

  // For curved pieces
  radius?: number;              // Curve radius in mm (measured to center line)
  angle?: number;               // Curve angle in degrees
  arcLength?: number;           // Actual arc length in mm

  // Common
  height: number;               // Height/thickness in mm
  clearanceHeight?: number;     // Height clearance needed above (for bridges/risers)

  // Bounding box (auto-calculated but can be specified)
  boundingBox?: {
    width: number;              // Total width of bounding box
    height: number;             // Total height of bounding box
  };

  unit: "mm";                   // Always millimeters
}
```

### Connection Points

```typescript
interface Connection {
  id: string;                   // Unique ID within this piece (e.g., "conn-1")
  type: ConnectionType;         // Male or female
  position: Position;           // Position relative to piece origin
  angle: number;                // Direction in degrees (0 = right, 90 = up)
  height: number;               // Height above ground in mm
  compatible: string[];         // Optional: specific compatible connection IDs
}

enum ConnectionType {
  MALE = "male",                // Protruding connector
  FEMALE = "female"             // Receiving connector
}

interface Position {
  x: number;                    // X coordinate in mm
  y: number;                    // Y coordinate in mm
}
```

### Geometry Definition

```typescript
interface Geometry {
  type: GeometryType;
  path: PathDefinition;
  collisionPath?: PathDefinition;  // Simplified path for collision detection
}

enum GeometryType {
  LINE = "line",                // Straight track
  ARC = "arc",                  // Curved track
  COMPOSITE = "composite"       // Complex shape (switches, crossings)
}

// Path can be defined using different formats
type PathDefinition =
  | LinePathDefinition
  | ArcPathDefinition
  | CompositePathDefinition
  | SVGPathDefinition;

interface LinePathDefinition {
  type: "line";
  start: Position;
  end: Position;
}

interface ArcPathDefinition {
  type: "arc";
  center: Position;
  radius: number;
  startAngle: number;           // In degrees
  endAngle: number;             // In degrees
  clockwise: boolean;
}

interface CompositePathDefinition {
  type: "composite";
  segments: (LinePathDefinition | ArcPathDefinition)[];
}

interface SVGPathDefinition {
  type: "svg";
  d: string;                    // SVG path string
}
```

### Visual Properties

```typescript
interface VisualProperties {
  color: string;                // Hex color for rendering
  texture?: string;             // Optional texture/pattern
  renderStyle: RenderStyle;     // How to render the piece
  icon?: string;                // Path to icon/thumbnail
  modelUrl?: string;            // Optional 3D model URL (future)
}

enum RenderStyle {
  SIMPLE = "simple",            // Simple colored shape
  DETAILED = "detailed",        // Detailed rendering with textures
  REALISTIC = "realistic"       // Photo-realistic (future)
}
```

### Metadata

```typescript
interface Metadata {
  sku?: string;                 // Product SKU if available
  manufacturer: string;         // "Fisher-Price", "Mattel", etc.
  productLine: string;          // "TrackMaster", "TrackMaster Revolution", etc.
  availability: Availability;   // Current availability
  setIncludes?: string[];       // Sets that include this piece
  yearIntroduced?: number;      // Year first released
  discontinued?: boolean;       // Whether still in production
  notes?: string;               // Additional notes
}

enum Availability {
  CURRENT = "current",          // Currently in production
  RETIRED = "retired",          // No longer produced
  RARE = "rare",                // Hard to find
  COMMON = "common"             // Widely available
}
```

---

## Coordinate System

### Origin Point
- The **origin (0, 0)** of each track piece is at the **center of the first connection point**
- This makes rotation and positioning more intuitive
- All other measurements are relative to this origin

### Angle Convention
- **0 degrees** = pointing right (positive X direction)
- **90 degrees** = pointing up (positive Y direction)
- **180 degrees** = pointing left (negative X direction)
- **270 degrees** = pointing down (negative Y direction)
- Rotation is **counter-clockwise** (mathematical convention)

### Connection Point Angles
- Connection angles indicate the **direction the track extends** from that point
- For male connectors: the direction the connector points
- For female connectors: the direction a male connector would point when inserted

---

## Measurement Guidelines

### How to Measure Physical Pieces

1. **Length**: Measure from center of one connection to center of the other
2. **Width**: Measure the actual track width (rail to rail outer edges)
3. **Curve Radius**: Measure from curve center to the **center line** of the track
4. **Curve Angle**: Use a protractor or calculate from chord length and radius
5. **Height**: Measure the thickness of the track piece itself
6. **Connection Position**: Measure from the reference origin point

### Tools Needed
- Digital calipers (for precision)
- Ruler/tape measure
- Protractor or angle finder
- Graph paper (helpful for complex pieces)

### Measurement Precision
- Use **millimeters** for all measurements
- Round to nearest **0.5mm** for most dimensions
- Critical dimensions (connection points) should be within **±0.5mm** tolerance
- Document any approximations in metadata notes

---

## Validation Rules

### Required Fields
- Every track piece MUST have: `id`, `name`, `category`, `type`, `dimensions`, `connections`, `geometry`, `visual`, `metadata`
- Minimum 1 connection point, maximum 4 (typical)
- At least one dimension specification (length OR radius)

### Connection Rules
1. **Male/Female Balance**: Most pieces should have equal male and female connectors (or all same type for special pieces)
2. **Height Consistency**: Connections at same height level must match within ±1mm
3. **Angle Alignment**: Connection angles must align with geometry
4. **Position Accuracy**: Connection positions must be at geometry endpoints

### Geometry Rules
1. **Closed Path**: Geometry path must connect connection points
2. **No Self-Intersection**: Path should not cross itself
3. **Bounding Box**: Must contain entire geometry
4. **Collision Path**: If not specified, uses main path

### Physical Constraints
1. **Minimum Radius**: Curved tracks have minimum radius of ~100mm
2. **Standard Width**: Track width typically 40-50mm
3. **Standard Height**: Base track height typically 10-15mm
4. **Connection Compatibility**: Male/female must be compatible sizes

---

## Example Track Pieces

### Example 1: Medium Straight Track

```json
{
  "id": "straight-medium",
  "name": "Medium Straight Track",
  "category": "straight",
  "type": "straight-medium",
  "dimensions": {
    "length": 215,
    "width": 45,
    "height": 12,
    "unit": "mm"
  },
  "connections": [
    {
      "id": "conn-1",
      "type": "male",
      "position": { "x": 0, "y": 0 },
      "angle": 180,
      "height": 12
    },
    {
      "id": "conn-2",
      "type": "female",
      "position": { "x": 215, "y": 0 },
      "angle": 0,
      "height": 12
    }
  ],
  "geometry": {
    "type": "line",
    "path": {
      "type": "line",
      "start": { "x": 0, "y": 0 },
      "end": { "x": 215, "y": 0 }
    }
  },
  "visual": {
    "color": "#4A90E2",
    "renderStyle": "simple"
  },
  "metadata": {
    "manufacturer": "Fisher-Price",
    "productLine": "TrackMaster",
    "availability": "current",
    "notes": "Standard medium straight track, most common piece"
  }
}
```

### Example 2: Standard Curved Track (45°)

```json
{
  "id": "curve-standard-45",
  "name": "Standard Curve Track (45°)",
  "category": "curved",
  "type": "curve-standard",
  "dimensions": {
    "radius": 180,
    "angle": 45,
    "arcLength": 141.4,
    "width": 45,
    "height": 12,
    "boundingBox": {
      "width": 127.3,
      "height": 127.3
    },
    "unit": "mm"
  },
  "connections": [
    {
      "id": "conn-1",
      "type": "male",
      "position": { "x": 0, "y": 0 },
      "angle": 180,
      "height": 12
    },
    {
      "id": "conn-2",
      "type": "female",
      "position": { "x": 127.3, "y": 52.7 },
      "angle": 135,
      "height": 12
    }
  ],
  "geometry": {
    "type": "arc",
    "path": {
      "type": "arc",
      "center": { "x": 0, "y": -180 },
      "radius": 180,
      "startAngle": 90,
      "endAngle": 135,
      "clockwise": false
    }
  },
  "visual": {
    "color": "#4A90E2",
    "renderStyle": "simple"
  },
  "metadata": {
    "manufacturer": "Fisher-Price",
    "productLine": "TrackMaster",
    "availability": "current",
    "notes": "Eight pieces form a complete circle (8 × 45° = 360°)"
  }
}
```

### Example 3: Left Switch/Turnout

```json
{
  "id": "switch-left",
  "name": "Left Switch Track",
  "category": "switch",
  "type": "switch-left",
  "dimensions": {
    "length": 215,
    "width": 90,
    "height": 12,
    "unit": "mm"
  },
  "connections": [
    {
      "id": "conn-input",
      "type": "male",
      "position": { "x": 0, "y": 0 },
      "angle": 180,
      "height": 12
    },
    {
      "id": "conn-straight",
      "type": "female",
      "position": { "x": 215, "y": 0 },
      "angle": 0,
      "height": 12
    },
    {
      "id": "conn-diverge",
      "type": "female",
      "position": { "x": 170, "y": 45 },
      "angle": 45,
      "height": 12
    }
  ],
  "geometry": {
    "type": "composite",
    "path": {
      "type": "composite",
      "segments": [
        {
          "type": "line",
          "start": { "x": 0, "y": 0 },
          "end": { "x": 215, "y": 0 }
        },
        {
          "type": "arc",
          "center": { "x": 100, "y": -100 },
          "radius": 112,
          "startAngle": 90,
          "endAngle": 135,
          "clockwise": false
        }
      ]
    }
  },
  "visual": {
    "color": "#E24A4A",
    "renderStyle": "simple"
  },
  "metadata": {
    "manufacturer": "Fisher-Price",
    "productLine": "TrackMaster",
    "availability": "current",
    "notes": "Allows branching to left, mechanical switch operation"
  }
}
```

---

## Data File Organization

### Recommended Directory Structure

```
/data
  /tracks
    /straight
      - straight-short.json
      - straight-medium.json
      - straight-long.json
    /curved
      - curve-standard-45.json
      - curve-wide-45.json
      - curve-tight-30.json
    /switches
      - switch-left.json
      - switch-right.json
      - switch-y.json
    /special
      - crossing.json
      - turntable.json
    /elevation
      - riser-single.json
      - bridge-short.json
    /accessories
      - station-platform.json
      - terminal-bumper.json
  - track-catalog.json  (index of all pieces)
  - schema.json         (JSON Schema definition)
```

### Track Catalog Format

```json
{
  "version": "1.0",
  "lastUpdated": "2025-12-01",
  "pieces": [
    {
      "id": "straight-medium",
      "file": "tracks/straight/straight-medium.json",
      "category": "straight",
      "name": "Medium Straight Track"
    }
  ],
  "categories": [
    {
      "id": "straight",
      "name": "Straight Tracks",
      "description": "Standard straight track pieces",
      "icon": "icons/straight.svg"
    }
  ]
}
```

---

## JSON Schema Validation

A formal JSON Schema file should be created to validate track piece data files. Key validations:

1. Required fields are present
2. Numeric values are positive (where applicable)
3. Angles are 0-360 degrees
4. Connection IDs are unique within piece
5. Geometry type matches path definition type
6. Color codes are valid hex format

---

## Future Enhancements

### Version 2.0 Considerations
- **3D Geometry**: Add vertex/face definitions for 3D rendering
- **Physics Properties**: Mass, friction coefficients
- **Animation**: Moving parts (switches, turntables)
- **Sound**: Audio files for piece-specific sounds
- **Compatibility Matrix**: Explicit compatibility between pieces
- **Variants**: Support for different color schemes, wear patterns

### Additional Metadata
- Historical information (release dates, retired pieces)
- Rarity ratings for collectors
- Price information and shopping links
- User ratings and reviews
- Community-uploaded custom pieces

---

## Measurement TODO List

### Priority 1: Core Pieces (Measure First)
- [ ] Straight - Short
- [ ] Straight - Medium
- [ ] Straight - Long
- [ ] Curve - Standard 45°
- [ ] Curve - Wide 45°

### Priority 2: Common Pieces
- [ ] Switch - Left
- [ ] Switch - Right
- [ ] Crossing
- [ ] Riser - Single
- [ ] Riser - Double

### Priority 3: Special Pieces
- [ ] Y-Junction
- [ ] Turntable
- [ ] Bridge pieces
- [ ] Station platforms
- [ ] Terminal/bumpers

---

## References

### Resources for Measurements
- Physical TrackMaster sets (most accurate)
- Product packaging dimensions
- Official Mattel specifications (if available)
- Community measurements (verify accuracy)
- Online retailers product descriptions

### Tools and Templates
- Measurement template (PDF download)
- Digital caliper guide
- Photo measurement guide
- Community contribution form

---

**Document Status:** Draft
**Next Steps:**
1. Acquire physical track pieces for measurement
2. Create measurement templates
3. Build initial dataset with 5-10 core pieces
4. Validate schema with real data
