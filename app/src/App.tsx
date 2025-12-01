import { useEffect, useState } from 'react';
import { TrackLibrary } from './components/TrackLibrary';
import { LayoutCanvas } from './components/LayoutCanvas';
import { loadAllTrackPieces } from './utils/trackLoader';
import type { TrackPiece } from './types/track';
import type { PlacedPiece } from './types/layout';
import './App.css';

function App() {
  const [availablePieces, setAvailablePieces] = useState<TrackPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Layout state
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<TrackPiece | null>(null);
  const [selectedPlacedPieceId, setSelectedPlacedPieceId] = useState<string | null>(null);

  // UI state
  const [showGrid, setShowGrid] = useState(true);
  const [pieceCounter, setPieceCounter] = useState(0);

  // Load available track pieces
  useEffect(() => {
    async function loadPieces() {
      try {
        setLoading(true);
        setError(null);
        const loadedPieces = await loadAllTrackPieces();
        setAvailablePieces(loadedPieces);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load track pieces');
        console.error('Error loading track pieces:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPieces();
  }, []);

  // Handle selecting a piece from the library
  const handleSelectPiece = (piece: TrackPiece) => {
    setSelectedPiece(piece);
    setSelectedPlacedPieceId(null);
  };

  // Handle placing a piece on the canvas
  const handlePlacePiece = (position: { x: number; y: number }, rotation: number) => {
    if (!selectedPiece) return;

    const newPiece: PlacedPiece = {
      id: `piece-${pieceCounter}`,
      pieceId: selectedPiece.id,
      piece: selectedPiece,
      position,
      rotation,
    };

    setPlacedPieces((prev) => [...prev, newPiece]);
    setPieceCounter((prev) => prev + 1);

    // Keep the piece selected for placing more
    // setSelectedPiece(null);
  };

  // Handle selecting a placed piece
  const handleSelectPlacedPiece = (id: string | null) => {
    setSelectedPlacedPieceId(id);
    if (id) {
      setSelectedPiece(null);
    }
  };

  // Handle deleting selected piece
  const handleDeleteSelected = () => {
    if (selectedPlacedPieceId) {
      setPlacedPieces((prev) => prev.filter((p) => p.id !== selectedPlacedPieceId));
      setSelectedPlacedPieceId(null);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPlacedPieceId) {
        e.preventDefault();
        handleDeleteSelected();
      } else if (e.key === 'Escape') {
        setSelectedPiece(null);
        setSelectedPlacedPieceId(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPlacedPieceId]);

  // Handle clear all
  const handleClearAll = () => {
    if (placedPieces.length === 0) return;
    if (confirm(`Clear all ${placedPieces.length} pieces from the layout?`)) {
      setPlacedPieces([]);
      setSelectedPlacedPieceId(null);
      setPieceCounter(0);
    }
  };

  return (
    <div className="app-layout">
      <header className="app-header-layout">
        <div className="header-content">
          <h1>Thomas TrackMaster Layout Designer</h1>
          <p className="header-subtitle">Build physically accurate track layouts</p>
        </div>
        <div className="header-controls">
          <label className="control-checkbox">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            Show Grid
          </label>
          <button
            className="btn btn-secondary"
            onClick={handleClearAll}
            disabled={placedPieces.length === 0}
          >
            Clear All
          </button>
        </div>
      </header>

      {loading && (
        <div className="loading-overlay">
          <p>Loading track pieces...</p>
        </div>
      )}

      {error && (
        <div className="error-overlay">
          <p>Error: {error}</p>
          <p>Make sure the data files are accessible.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="app-main-layout">
          <TrackLibrary
            pieces={availablePieces}
            onSelectPiece={handleSelectPiece}
            selectedPieceId={selectedPiece?.id || null}
          />

          <div className="canvas-area">
            <LayoutCanvas
              width={1200}
              height={800}
              showGrid={showGrid}
              placedPieces={placedPieces}
              selectedPiece={selectedPiece}
              onPlacePiece={handlePlacePiece}
              onSelectPlacedPiece={handleSelectPlacedPiece}
              selectedPlacedPieceId={selectedPlacedPieceId}
            />

            <div className="canvas-status">
              <div className="status-item">
                <strong>{placedPieces.length}</strong> piece{placedPieces.length !== 1 ? 's' : ''} placed
              </div>
              {selectedPiece && (
                <div className="status-item status-selected">
                  Selected: <strong>{selectedPiece.name}</strong> (Click to place, R to rotate)
                </div>
              )}
              {selectedPlacedPieceId && (
                <div className="status-item status-editing">
                  Editing piece (Delete to remove, Esc to deselect)
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
