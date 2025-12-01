# Product Requirements Document: Thomas TrackMaster Layout Designer

**Version:** 1.0
**Last Updated:** December 1, 2025
**Status:** Draft

---

## 1. Executive Summary

### 1.1 Product Overview
The Thomas TrackMaster Layout Designer is a web-based application that enables users to design physically accurate and valid track layouts for Thomas TrackMaster plastic train sets. The application provides an intuitive drag-and-drop interface with intelligent snapping and validation to ensure all designed layouts can be built in the real world.

### 1.2 Target Audience
- Parents planning track layouts before purchase
- Children (ages 6+) designing their own layouts
- Collectors optimizing their track piece usage
- Educators teaching spatial reasoning and planning

### 1.3 Product Goals
1. Enable users to create physically valid track layouts without trial and error
2. Reduce frustration from purchasing incompatible or insufficient track pieces
3. Provide an intuitive, visual design experience accessible to all ages
4. Ensure 100% physical accuracy with real TrackMaster components

---

## 2. Problem Statement

Current challenges faced by Thomas TrackMaster enthusiasts:
- **Physical Trial and Error**: Users must physically test layouts, which is time-consuming
- **Invalid Layouts**: Users often create designs that don't physically connect or fit in available space
- **Purchase Planning**: Difficulty determining which track pieces are needed for desired layouts
- **Space Constraints**: Hard to visualize if a layout fits in available space before building

---

## 3. Product Objectives

### 3.1 Primary Objectives
1. **Physical Accuracy**: All layouts created must be buildable with real TrackMaster pieces
2. **Ease of Use**: Intuitive interface requiring minimal learning curve
3. **Visual Feedback**: Clear indication of valid/invalid connections and layouts
4. **Flexibility**: Support for creative freedom within physical constraints

### 3.2 Success Metrics
- 95%+ of designed layouts are successfully built in real life
- Users can create their first valid layout within 5 minutes
- 80%+ user satisfaction rating
- Zero physically impossible layouts allowed to be saved

---

## 4. Core Features

### 4.1 Track Piece Library

#### 4.1.1 Physical Model
**Description**: Accurate digital representations of all standard TrackMaster track pieces with real-world dimensions and connection points.

**Requirements**:
- Each track piece must have:
  - Accurate physical dimensions (length, width, curve radius)
  - Defined connection points (male/female connectors)
  - Connector orientation and height
  - Visual representation matching real pieces
  - Metadata (name, SKU, availability)

**Initial Track Piece Set**:
- Straight tracks (short, medium, long)
- Curved tracks (standard curve, wide curve)
- Switch/turnout tracks (left, right, Y-junction)
- Bridge/riser pieces
- Cross-over/intersection pieces
- Terminal pieces (end caps, station connectors)

**Validation Rules**:
- Connection points must have matching male/female pairs
- Height differences must align with riser specifications
- Curve radii must be mathematically accurate
- Track gauge (width) must be consistent

#### 4.1.2 Track Piece Browser
**Description**: Searchable, categorized interface for browsing available track pieces.

**Requirements**:
- Grid or list view of all available pieces
- Category filters (straight, curved, special, etc.)
- Search by name or SKU
- Visual thumbnails of each piece
- Display piece metadata (dimensions, connection types)

---

### 4.2 Layout Canvas

#### 4.2.1 Drag-and-Drop Interface
**Description**: Users can drag track pieces from the library onto a canvas to build layouts.

**Requirements**:
- Smooth drag interaction with visual feedback
- Cursor changes to indicate draggable items
- Preview of piece follows cursor during drag
- Semi-transparent preview while dragging
- Cancel drag with ESC key or drag outside canvas
- Support for touch devices (mobile/tablet)

**User Flow**:
1. User selects track piece from library
2. User drags piece onto canvas
3. Piece appears as semi-transparent preview
4. User positions piece and releases
5. Piece is placed on canvas

#### 4.2.2 Smart Snapping
**Description**: Track pieces automatically snap to valid connection points on nearby pieces.

**Requirements**:
- **Snap Detection**:
  - Detect when dragged piece is within snap threshold (e.g., 50px) of connection point
  - Visual indicator (highlight, glow) shows snap target
  - Snap occurs when piece is released near valid connection point

- **Snap Validation**:
  - Only snap to compatible connection points (male to female)
  - Verify height compatibility (flat to flat, riser to riser)
  - Ensure no physical overlap with existing pieces
  - Validate angle alignment for curved pieces

- **Snap Feedback**:
  - Visual highlight on potential snap points
  - Color coding: green for valid, red for invalid, yellow for warning
  - Haptic feedback on touch devices
  - Audio cue on successful snap (optional, user preference)

- **Snap Behavior**:
  - Auto-rotate piece to match connection angle
  - Precise positioning at connection point
  - Magnetic snap feel (piece "pulls" into place)
  - Override snap with modifier key (SHIFT) for manual placement

#### 4.2.3 Track Piece Manipulation
**Description**: Users can select, move, rotate, and delete placed track pieces.

**Requirements**:

**Selection**:
- Click to select individual piece
- Selected piece shows visual highlight/outline
- Selection info panel shows piece details
- Click canvas background to deselect
- Multi-select with CTRL/CMD + click (future enhancement)

**Movement**:
- Drag selected piece to new location
- Snap detection active during move
- Show connection validity while moving
- Undo move with ESC before release

**Rotation**:
- Rotate button in selection toolbar
- Keyboard shortcut: R key rotates 90° clockwise
- SHIFT + R rotates counter-clockwise
- Rotation increments: 90° for straight, 45° for curved pieces
- Visual rotation indicator (circular arrow)
- Rotation respects snap points if near connection

**Deletion**:
- Delete button in selection toolbar
- Keyboard shortcut: DELETE or BACKSPACE
- Confirmation for large deletions (>5 pieces)
- Undo support for deleted pieces

#### 4.2.4 Grid and Guides
**Description**: Optional grid overlay and alignment guides to help with layout organization.

**Requirements**:
- Toggle-able grid overlay
- Grid size matches standard track piece dimensions
- Snap-to-grid option (independent of piece snapping)
- Alignment guides when moving pieces (like design tools)
- Ruler/measurement tool showing real-world dimensions
- Origin point indicator

---

### 4.3 Layout Validation

#### 4.3.1 Real-Time Validation
**Description**: Continuous validation of layout physical validity as user builds.

**Requirements**:
- **Connection Validation**:
  - Verify all connections are compatible (male/female match)
  - Check connection height alignment
  - Validate connection angle alignment

- **Collision Detection**:
  - Detect overlapping track pieces
  - Check for physical impossibilities (pieces passing through each other)
  - Warn about tight clearances that might cause issues

- **Circuit Validation**:
  - Identify open circuits (unconnected ends)
  - Detect closed loops
  - Validate track continuity

- **Visual Feedback**:
  - Color-coded pieces: green (valid), yellow (warning), red (invalid)
  - Highlight problem areas
  - Tooltip explanations of issues

- **Validation Panel**:
  - List of current validation issues
  - Click issue to highlight affected pieces
  - Severity levels (error, warning, info)
  - Auto-refresh as layout changes

#### 4.3.2 Layout Analysis
**Description**: Tools to analyze and optimize layouts.

**Requirements**:
- Track piece count by type
- Total layout dimensions (length × width)
- Number of closed loops
- Identify missing pieces (open connections)
- Suggest pieces to complete circuits
- Cost estimate based on piece prices (future)

---

### 4.4 User Experience Features

#### 4.4.1 Undo/Redo
**Requirements**:
- Unlimited undo/redo history
- Keyboard shortcuts: CTRL/CMD + Z (undo), CTRL/CMD + SHIFT + Z (redo)
- Visual indicators in toolbar
- History panel showing recent actions (future)

#### 4.4.2 Save/Load Layouts
**Requirements**:
- Save layout to browser local storage
- Export layout as JSON file
- Import layout from JSON file
- Auto-save every 30 seconds
- Multiple saved layouts per user
- Layout naming and metadata (date created, last modified)

#### 4.4.3 Canvas Controls
**Requirements**:
- Pan: Click and drag background or middle mouse button
- Zoom: Mouse wheel, pinch gesture, or zoom controls
- Zoom to fit: Auto-scale canvas to show entire layout
- Reset view: Return to default zoom and position
- Minimap showing full layout overview (future)

#### 4.4.4 Accessibility
**Requirements**:
- Keyboard navigation for all features
- Screen reader support for UI elements
- High contrast mode option
- Adjustable UI scale
- Clear focus indicators
- ARIA labels on all interactive elements

---

## 5. Technical Requirements

### 5.1 Platform
- **Type**: Web application (Progressive Web App)
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Responsive Design**: Desktop, tablet, mobile
- **Offline Support**: Core functionality works offline after first load

### 5.2 Technology Stack (Proposed)

#### 5.2.1 Frontend
- **Framework**: React or Vue.js for UI components
- **Canvas Rendering**:
  - HTML5 Canvas for 2D rendering
  - Alternative: SVG for vector graphics
  - Consider: Three.js for future 3D view
- **State Management**: Redux, Zustand, or Context API
- **Drag-and-Drop**: react-dnd or native HTML5 drag-and-drop API
- **Styling**: CSS-in-JS (styled-components) or Tailwind CSS

#### 5.2.2 Data Model
- **Track Pieces**: JSON schema defining all physical properties
- **Layout State**: Graph structure representing connected pieces
- **Validation Engine**: Rule-based system for physical validation

#### 5.2.3 Physics/Math
- **Coordinate System**: Cartesian 2D grid
- **Rotation**: Transformation matrices for piece rotation
- **Collision Detection**: Bounding box and polygon intersection algorithms
- **Snap Detection**: Distance calculation with threshold tolerance
- **Curve Mathematics**: Bezier curves or arc segments for curved tracks

### 5.3 Performance Requirements
- Layout rendering: 60 FPS during interactions
- Snap detection latency: <16ms (imperceptible)
- Support layouts with 100+ track pieces
- Initial load time: <3 seconds
- Canvas interactions feel instant (<100ms response)

### 5.4 Data Storage
- **Local Storage**: Browser localStorage for saved layouts
- **Export Format**: JSON with schema version
- **Future**: Cloud sync with user accounts

---

## 6. User Stories

### 6.1 Core User Flows

#### Story 1: First-Time User Creates Simple Layout
**As a** parent planning a track layout
**I want to** quickly create a simple oval track
**So that** I can see what pieces I need to buy

**Acceptance Criteria**:
- User can find straight and curved pieces in library
- User can drag pieces onto canvas
- Pieces automatically snap together when close
- User can see if layout forms complete loop
- User can see list of required pieces

#### Story 2: Experienced User Designs Complex Layout
**As an** experienced TrackMaster user
**I want to** design a complex layout with multiple loops and switches
**So that** I can maximize the use of my existing track pieces

**Acceptance Criteria**:
- User can add 50+ pieces to layout
- User can rotate pieces to create custom configurations
- User can see validation errors for invalid connections
- User can save and reload their layout
- User can zoom and pan to view entire layout

#### Story 3: User Fixes Invalid Connections
**As a** user designing a layout
**I want to** see clearly which connections are invalid
**So that** I can fix them and create a buildable layout

**Acceptance Criteria**:
- Invalid connections are highlighted in red
- Tooltip explains why connection is invalid
- User can easily rotate or reposition pieces to fix
- Validation updates in real-time as user makes changes

#### Story 4: User Rotates Track Piece
**As a** user placing track pieces
**I want to** easily rotate pieces to the correct orientation
**So that** I can connect them to my layout

**Acceptance Criteria**:
- User can rotate piece with button click
- User can rotate piece with keyboard shortcut (R)
- Piece rotates in sensible increments (90° or 45°)
- Rotation is smooth and visually clear
- Rotation respects nearby snap points

### 6.2 Edge Cases

#### Story 5: User Attempts Invalid Placement
**As a** user
**I want to** be prevented from creating physically impossible layouts
**So that** I don't waste time designing something I can't build

**Acceptance Criteria**:
- System prevents overlapping track pieces
- System warns about incompatible connections
- System shows why placement is invalid
- User can easily correct the issue

#### Story 6: User Works on Mobile Device
**As a** mobile user
**I want to** design layouts on my phone or tablet
**So that** I can work anywhere

**Acceptance Criteria**:
- Touch drag-and-drop works smoothly
- UI elements are touch-friendly (44px minimum)
- Pinch-to-zoom works on canvas
- Layout is responsive to screen size

---

## 7. Design Specifications

### 7.1 Layout Structure
```
┌─────────────────────────────────────────────────────┐
│ Header: Logo | Save | Load | Undo | Redo | Help    │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  Track Piece │                                      │
│  Library     │         Canvas Area                  │
│  [Grid/List  │      (Drag-and-drop layout)         │
│   of pieces] │                                      │
│              │                                      │
│  Categories: │                                      │
│  - Straight  │                                      │
│  - Curved    │                                      │
│  - Special   │                                      │
│              │                                      │
├──────────────┼──────────────────────────────────────┤
│ Piece Info   │  Validation Status | Piece Count    │
└──────────────┴──────────────────────────────────────┘
```

### 7.2 Visual Design Principles
- **Colors**: Match TrackMaster branding (blue, red, yellow accents)
- **Track Pieces**: Realistic rendering matching physical pieces
- **Feedback**: Clear visual states (hover, active, selected, invalid)
- **Consistency**: Familiar UI patterns (toolbar, panels, canvas)
- **Clarity**: High contrast, clear labels, intuitive icons

### 7.3 Interaction Patterns
- **Drag Source**: Track piece library items
- **Drop Target**: Canvas area
- **Snap Threshold**: 50 pixels from connection point
- **Snap Animation**: Smooth 200ms transition to snapped position
- **Selection**: Single-click selection with outline highlight
- **Context**: Right-click menu for piece actions (future)

---

## 8. Non-Functional Requirements

### 8.1 Usability
- New users can create their first layout within 5 minutes
- No tutorial required for basic operations
- All features accessible via keyboard
- Responsive design works on screens 320px+

### 8.2 Reliability
- No data loss (auto-save every 30 seconds)
- Graceful handling of browser crashes (recover last state)
- Validation engine has 99.9% accuracy
- No false positives in validation

### 8.3 Performance
- Handle layouts with 200+ pieces
- Smooth 60 FPS rendering during interactions
- Snap detection <16ms response time
- Initial app load <3 seconds on 3G connection

### 8.4 Maintainability
- Modular code architecture
- Track piece definitions in separate JSON files
- Easy to add new track pieces
- Comprehensive unit test coverage (>80%)
- Clear documentation for developers

### 8.5 Scalability
- Support for future 3D view
- Extensible to other track systems (Brio, Chuggington)
- Cloud sync ready architecture
- Multi-user collaboration support (future)

---

## 9. Future Enhancements

### Phase 2 Features
- 3D view of layout
- Animated train preview running on track
- Share layouts with community
- Import photos to design layout around room constraints
- Piece shopping list with links to purchase
- Layout templates and inspiration gallery

### Phase 3 Features
- User accounts and cloud sync
- Multi-user collaborative editing
- Mobile app (native iOS/Android)
- AR view to visualize layout in real space
- Integration with TrackMaster online store
- Community ratings and comments on layouts

---

## 10. Open Questions

1. **Track Piece Data**: Where can we obtain accurate dimensions for all TrackMaster pieces?
2. **Licensing**: Do we need permission from Mattel to use TrackMaster branding?
3. **Monetization**: Will this be free, freemium, or paid?
4. **Physics Engine**: Do we need a formal physics engine or custom validation logic?
5. **Track Variants**: How do we handle different TrackMaster versions (original vs. Revolution)?

---

## 11. Success Criteria

### MVP Launch Criteria
- [ ] Support for 20+ core track pieces
- [ ] Drag-and-drop placement working
- [ ] Smart snapping implemented
- [ ] Rotation functionality (90° increments)
- [ ] Real-time validation showing errors
- [ ] Save/load layouts locally
- [ ] Works on desktop browsers
- [ ] No physically invalid layouts can be saved
- [ ] 5 beta testers successfully create layouts

### Post-Launch Metrics (Month 1)
- 1,000+ unique users
- 500+ layouts created
- 4+ star average rating
- <5% reported layouts that couldn't be built
- 60%+ user retention (return visit)

---

## 12. Timeline (Proposed)

### Phase 1: MVP (8-12 weeks)
- Week 1-2: Architecture design and setup
- Week 3-4: Track piece data model and library
- Week 5-6: Canvas and drag-and-drop
- Week 7-8: Snap logic and rotation
- Week 9-10: Validation engine
- Week 11-12: Polish, testing, bug fixes

### Phase 2: Beta (4 weeks)
- Week 13-14: Beta testing with users
- Week 15-16: Bug fixes and refinements

### Phase 3: Launch (2 weeks)
- Week 17: Final testing and documentation
- Week 18: Public launch

---

## Appendix A: Track Piece Specifications (Example)

### Standard Straight Track
```json
{
  "id": "straight-medium",
  "name": "Medium Straight Track",
  "category": "straight",
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
      "angle": 0,
      "height": 12
    },
    {
      "id": "conn-2",
      "type": "female",
      "position": { "x": 215, "y": 0 },
      "angle": 180,
      "height": 12
    }
  ],
  "color": "#3b82f6",
  "sku": "TM-ST-001"
}
```

### Standard Curved Track
```json
{
  "id": "curve-standard",
  "name": "Standard Curve Track",
  "category": "curved",
  "dimensions": {
    "radius": 180,
    "angle": 45,
    "width": 45,
    "height": 12,
    "unit": "mm"
  },
  "connections": [
    {
      "id": "conn-1",
      "type": "male",
      "position": { "x": 0, "y": 0 },
      "angle": 0,
      "height": 12
    },
    {
      "id": "conn-2",
      "type": "female",
      "position": { "x": 127, "y": 127 },
      "angle": 135,
      "height": 12
    }
  ],
  "color": "#3b82f6",
  "sku": "TM-CV-001"
}
```

---

**Document Prepared By:** Thomas TrackBuilder Team
**Review Status:** Awaiting approval
**Next Steps:** Technical architecture design and feasibility analysis
