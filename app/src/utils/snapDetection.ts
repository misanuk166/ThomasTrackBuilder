import type { PlacedPiece, SnapCandidate, SnapSettings } from '../types/layout';
import type { TrackPiece, Connection, Position } from '../types/track';

/**
 * Default snap settings
 */
export const DEFAULT_SNAP_SETTINGS: SnapSettings = {
  enabled: true,
  threshold: 50, // 50 pixels
  showIndicators: true,
};

/**
 * Rotate a point around origin
 */
function rotatePoint(point: Position, degrees: number): Position {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  };
}

/**
 * Get the absolute position of a connection point for a placed piece
 */
export function getAbsoluteConnectionPosition(
  piece: PlacedPiece,
  connection: Connection
): Position {
  // Rotate the connection point
  const rotated = rotatePoint(connection.position, piece.rotation);

  // Add piece position offset
  return {
    x: piece.position.x + rotated.x,
    y: piece.position.y + rotated.y,
  };
}

/**
 * Get the absolute angle of a connection for a placed piece
 */
export function getAbsoluteConnectionAngle(
  piece: PlacedPiece,
  connection: Connection
): number {
  return (connection.angle + piece.rotation) % 360;
}

/**
 * Calculate distance between two points
 */
function distance(p1: Position, p2: Position): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if two connections are compatible (can connect)
 */
function areConnectionsCompatible(conn1: Connection, conn2: Connection): boolean {
  // Must be opposite types (male to female or female to male)
  if (conn1.type === conn2.type) {
    return false;
  }

  // Heights must match (within 1mm tolerance)
  if (Math.abs(conn1.height - conn2.height) > 1) {
    return false;
  }

  return true;
}

/**
 * Check if two connection angles are opposite (within tolerance)
 */
function areAnglesOpposite(angle1: number, angle2: number, tolerance: number = 15): boolean {
  // Normalize angles to 0-360
  const a1 = ((angle1 % 360) + 360) % 360;
  const a2 = ((angle2 % 360) + 360) % 360;

  // Calculate difference
  let diff = Math.abs(a1 - a2);
  if (diff > 180) {
    diff = 360 - diff;
  }

  // Should be ~180 degrees apart (opposite directions)
  return Math.abs(diff - 180) < tolerance;
}

/**
 * Calculate the required rotation for a new piece to snap to an existing piece
 */
function calculateSnapRotation(
  placedConnection: Connection,
  placedRotation: number,
  newConnection: Connection
): number {
  const placedAbsoluteAngle = (placedConnection.angle + placedRotation) % 360;
  const requiredAngle = (placedAbsoluteAngle + 180) % 360;
  const currentAngle = newConnection.angle;

  // Calculate rotation needed
  let rotation = requiredAngle - currentAngle;

  // Normalize to nearest 90-degree increment
  rotation = Math.round(rotation / 90) * 90;

  return ((rotation % 360) + 360) % 360;
}

/**
 * Calculate the position where a new piece should be placed to snap
 */
function calculateSnapPosition(
  placedPiece: PlacedPiece,
  placedConnection: Connection,
  newPiece: TrackPiece,
  newConnection: Connection,
  snapRotation: number
): Position {
  // Get absolute position of the placed connection
  const placedAbsPos = getAbsoluteConnectionPosition(placedPiece, placedConnection);

  // Rotate the new connection point according to snap rotation
  const rotatedNewConn = rotatePoint(newConnection.position, snapRotation);

  // Calculate where the new piece origin should be
  return {
    x: placedAbsPos.x - rotatedNewConn.x,
    y: placedAbsPos.y - rotatedNewConn.y,
  };
}

/**
 * Find the best snap candidate for a new piece being placed
 */
export function findSnapCandidate(
  newPiece: TrackPiece,
  newPosition: Position,
  newRotation: number,
  placedPieces: PlacedPiece[],
  settings: SnapSettings = DEFAULT_SNAP_SETTINGS
): SnapCandidate | null {
  if (!settings.enabled || placedPieces.length === 0) {
    return null;
  }

  const candidates: SnapCandidate[] = [];

  // Check each connection on the new piece
  for (const newConnection of newPiece.connections) {
    // Get absolute position of this connection on the new piece
    const rotatedNewConn = rotatePoint(newConnection.position, newRotation);
    const newConnAbsPos = {
      x: newPosition.x + rotatedNewConn.x,
      y: newPosition.y + rotatedNewConn.y,
    };
    const newConnAbsAngle = (newConnection.angle + newRotation) % 360;

    // Check against all placed pieces
    for (const placedPiece of placedPieces) {
      // Check each connection on the placed piece
      for (const placedConnection of placedPiece.piece.connections) {
        // Check if connections are compatible
        if (!areConnectionsCompatible(newConnection, placedConnection)) {
          continue;
        }

        // Get absolute position and angle of placed connection
        const placedConnAbsPos = getAbsoluteConnectionPosition(placedPiece, placedConnection);
        const placedConnAbsAngle = getAbsoluteConnectionAngle(placedPiece, placedConnection);

        // Calculate distance
        const dist = distance(newConnAbsPos, placedConnAbsPos);

        // Check if within snap threshold
        if (dist > settings.threshold) {
          continue;
        }

        // Check if angles are opposite
        if (!areAnglesOpposite(newConnAbsAngle, placedConnAbsAngle)) {
          continue;
        }

        // Calculate snap rotation and position
        const snapRotation = calculateSnapRotation(
          placedConnection,
          placedPiece.rotation,
          newConnection
        );

        const snapPosition = calculateSnapPosition(
          placedPiece,
          placedConnection,
          newPiece,
          newConnection,
          snapRotation
        );

        candidates.push({
          placedPiece,
          placedConnection,
          newPieceConnection: newConnection,
          snapPosition,
          snapRotation,
          distance: dist,
        });
      }
    }
  }

  // Return the closest candidate
  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => a.distance - b.distance);
  return candidates[0];
}

/**
 * Check if a position would cause a collision with existing pieces
 */
export function checkCollision(
  newPiece: TrackPiece,
  newPosition: Position,
  newRotation: number,
  placedPieces: PlacedPiece[]
): boolean {
  // Simple bounding box collision for now
  // TODO: Implement more accurate collision detection using geometry paths

  const newBounds = newPiece.dimensions.boundingBox || {
    width: newPiece.dimensions.length || 200,
    height: newPiece.dimensions.width || 50,
  };

  for (const placed of placedPieces) {
    const placedBounds = placed.piece.dimensions.boundingBox || {
      width: placed.piece.dimensions.length || 200,
      height: placed.piece.dimensions.width || 50,
    };

    // Simple AABB collision (not perfect but good enough for now)
    const dist = distance(newPosition, placed.position);
    const minDist = (newBounds.width + placedBounds.width) / 2;

    if (dist < minDist * 0.5) {
      // Significantly overlapping
      return true;
    }
  }

  return false;
}
