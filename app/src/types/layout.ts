import type { TrackPiece, Connection } from './track';

/**
 * A placed track piece in the layout
 */
export interface PlacedPiece {
  id: string; // Unique instance ID
  pieceId: string; // Reference to TrackPiece.id
  piece: TrackPiece; // The actual track piece data
  position: { x: number; y: number }; // Position on canvas
  rotation: number; // Rotation in degrees (0, 90, 180, 270)
}

/**
 * Snap candidate - a potential snap position
 */
export interface SnapCandidate {
  placedPiece: PlacedPiece;
  placedConnection: Connection;
  newPieceConnection: Connection;
  snapPosition: { x: number; y: number };
  snapRotation: number;
  distance: number;
}

/**
 * Layout state
 */
export interface Layout {
  pieces: PlacedPiece[];
  selectedPieceId: string | null;
}

/**
 * Snap settings
 */
export interface SnapSettings {
  enabled: boolean;
  threshold: number; // Distance in pixels to trigger snap
  showIndicators: boolean; // Show snap target highlights
}
