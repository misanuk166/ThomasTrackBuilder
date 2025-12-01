import type { TrackPiece, TrackCatalog } from '../types/track';

/**
 * Load the track catalog
 */
export async function loadTrackCatalog(): Promise<TrackCatalog> {
  const response = await fetch('/data/track-catalog.json');
  if (!response.ok) {
    throw new Error(`Failed to load track catalog: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Load a specific track piece by ID
 */
export async function loadTrackPiece(id: string, catalog?: TrackCatalog): Promise<TrackPiece> {
  // Load catalog if not provided
  const trackCatalog = catalog || await loadTrackCatalog();

  // Find the piece in the catalog
  const pieceInfo = trackCatalog.pieces.find(p => p.id === id);
  if (!pieceInfo) {
    throw new Error(`Track piece '${id}' not found in catalog`);
  }

  // Load the actual piece data
  const response = await fetch(`/data/${pieceInfo.file}`);
  if (!response.ok) {
    throw new Error(`Failed to load track piece '${id}': ${response.statusText}`);
  }

  return response.json();
}

/**
 * Load all track pieces
 */
export async function loadAllTrackPieces(): Promise<TrackPiece[]> {
  const catalog = await loadTrackCatalog();

  // Load all pieces in parallel
  const pieces = await Promise.all(
    catalog.pieces.map(pieceInfo => loadTrackPiece(pieceInfo.id, catalog))
  );

  return pieces;
}

/**
 * Load track pieces by category
 */
export async function loadTrackPiecesByCategory(category: string): Promise<TrackPiece[]> {
  const catalog = await loadTrackCatalog();

  // Filter pieces by category
  const piecesInCategory = catalog.pieces.filter(p => p.category === category);

  // Load them in parallel
  const pieces = await Promise.all(
    piecesInCategory.map(pieceInfo => loadTrackPiece(pieceInfo.id, catalog))
  );

  return pieces;
}
