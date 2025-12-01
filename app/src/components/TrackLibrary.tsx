import type { TrackPiece } from '../types/track';
import './TrackLibrary.css';

interface TrackLibraryProps {
  pieces: TrackPiece[];
  onSelectPiece: (piece: TrackPiece) => void;
  selectedPieceId: string | null;
}

export function TrackLibrary({ pieces, onSelectPiece, selectedPieceId }: TrackLibraryProps) {
  // Group pieces by category
  const groupedPieces = pieces.reduce((acc, piece) => {
    if (!acc[piece.category]) {
      acc[piece.category] = [];
    }
    acc[piece.category].push(piece);
    return acc;
  }, {} as Record<string, TrackPiece[]>);

  const categories = Object.keys(groupedPieces).sort();

  return (
    <div className="track-library">
      <div className="library-header">
        <h2>Track Pieces</h2>
        <p className="library-subtitle">Click to select, then click canvas to place</p>
      </div>

      <div className="library-content">
        {categories.map((category) => (
          <div key={category} className="library-category">
            <h3 className="category-title">{category}</h3>
            <div className="library-pieces">
              {groupedPieces[category].map((piece) => (
                <button
                  key={piece.id}
                  className={`library-piece ${
                    selectedPieceId === piece.id ? 'selected' : ''
                  }`}
                  onClick={() => onSelectPiece(piece)}
                  title={piece.name}
                >
                  <div
                    className="piece-swatch"
                    style={{ backgroundColor: piece.visual.color }}
                  />
                  <span className="piece-name">{piece.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="library-footer">
        <div className="library-stats">
          {pieces.length} piece{pieces.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
}
