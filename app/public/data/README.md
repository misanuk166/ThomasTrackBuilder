# Track Piece Data

This directory contains the track piece definitions for the Thomas TrackMaster Layout Designer.

## Structure

```
/data
  /tracks
    /straight      - Straight track pieces
    /curved        - Curved track pieces
    /switches      - Switch/turnout pieces
    /special       - Crossings, turntables, etc.
    /elevation     - Risers, bridges
    /accessories   - Stations, terminals
  track-catalog.json - Index of all pieces
  schema.json        - JSON Schema for validation
  README.md          - This file
```

## Current Track Pieces

### Straight Tracks (2)
- **straight-short** - Short Straight Track (107.5mm)
- **straight-medium** - Medium Straight Track (215mm)

### Curved Tracks (1)
- **curve-standard-45** - Standard Curve Track (45°, 180mm radius)

### Switches (2)
- **switch-left** - Left Switch Track
- **switch-right** - Right Switch Track

## Usage

### Loading Track Pieces

```javascript
// Load the catalog
import catalog from './data/track-catalog.json';

// Load individual pieces
import straightMedium from './data/tracks/straight/straight-medium.json';

// Get all piece IDs
const pieceIds = catalog.pieces.map(p => p.id);

// Load a piece dynamically
async function loadTrackPiece(id) {
  const pieceInfo = catalog.pieces.find(p => p.id === id);
  if (!pieceInfo) throw new Error(`Track piece ${id} not found`);

  const response = await fetch(`/data/${pieceInfo.file}`);
  return await response.json();
}
```

### Validating Track Pieces

Use the `schema.json` file to validate track piece data:

```javascript
import Ajv from 'ajv';
import schema from './data/schema.json';
import trackPiece from './data/tracks/straight/straight-medium.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

if (validate(trackPiece)) {
  console.log('Valid track piece!');
} else {
  console.error('Validation errors:', validate.errors);
}
```

## Adding New Track Pieces

1. **Measure the physical piece** following the guidelines in `/docs/TRACK_PIECE_SCHEMA.md`

2. **Create a JSON file** in the appropriate category directory:
   ```bash
   # Example: adding a long straight track
   touch data/tracks/straight/straight-long.json
   ```

3. **Define the piece** using the schema:
   ```json
   {
     "id": "straight-long",
     "name": "Long Straight Track",
     "category": "straight",
     "type": "straight-long",
     "dimensions": { ... },
     "connections": [ ... ],
     "geometry": { ... },
     "visual": { ... },
     "metadata": { ... }
   }
   ```

4. **Validate** the JSON against the schema

5. **Add to catalog** in `track-catalog.json`:
   ```json
   {
     "id": "straight-long",
     "file": "tracks/straight/straight-long.json",
     "category": "straight",
     "name": "Long Straight Track",
     "commonName": "Long Straight"
   }
   ```

6. **Update stats** in the catalog

## Coordinate System

- **Origin (0,0)**: Center of the first connection point
- **X-axis**: Positive to the right
- **Y-axis**: Positive upward
- **Angles**:
  - 0° = right
  - 90° = up
  - 180° = left
  - 270° = down
- **Rotation**: Counter-clockwise (mathematical convention)

## Connection Types

- **Male**: Protruding connector (plug)
- **Female**: Receiving connector (socket)

Connections must be male-to-female to be valid.

## Validation Rules

All track pieces must:
1. Have a unique `id` (kebab-case)
2. Include at least 1 connection point
3. Have valid geometry that connects the connection points
4. Use millimeters for all measurements
5. Have color in hex format (#RRGGBB)
6. Follow the JSON Schema specification

## Measurement Notes

**IMPORTANT**: The current measurements are **estimates** based on typical TrackMaster dimensions. For production use, these should be verified against actual physical pieces.

### Measurement TODO
- [ ] Verify straight track lengths with calipers
- [ ] Verify curve radius and angles
- [ ] Measure switch track dimensions
- [ ] Add more track piece variants
- [ ] Document connector dimensions

## Future Enhancements

- 3D model references
- Physics properties (mass, friction)
- Animation data for moving parts
- Sound effects
- User-submitted custom pieces
- Photo references
- Purchase links and pricing

## References

- Full schema documentation: `/docs/TRACK_PIECE_SCHEMA.md`
- Product Requirements: `/PRD.md`
- Official TrackMaster products: https://www.fisher-price.com/thomas

---

**Last Updated**: December 1, 2025
**Data Version**: 1.0.0
**Total Pieces**: 5
