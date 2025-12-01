import { useEffect, useState } from 'react';
import { TrackCanvas } from './components/TrackCanvas';
import { loadAllTrackPieces } from './utils/trackLoader';
import type { TrackPiece } from './types/track';
import './App.css';

function App() {
  const [pieces, setPieces] = useState<TrackPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showConnections, setShowConnections] = useState(true);

  useEffect(() => {
    async function loadPieces() {
      try {
        setLoading(true);
        setError(null);
        const loadedPieces = await loadAllTrackPieces();
        setPieces(loadedPieces);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load track pieces');
        console.error('Error loading track pieces:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPieces();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Thomas TrackMaster Layout Designer</h1>
        <p>Rendering Prototype - Track Piece Visualization</p>
      </header>

      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          Show Grid
        </label>
        <label>
          <input
            type="checkbox"
            checked={showConnections}
            onChange={(e) => setShowConnections(e.target.checked)}
          />
          Show Connections
        </label>
      </div>

      <main className="app-main">
        {loading && (
          <div className="loading">
            <p>Loading track pieces...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>Error: {error}</p>
            <p>Make sure the data files are accessible in the public folder.</p>
          </div>
        )}

        {!loading && !error && pieces.length > 0 && (
          <div className="canvas-container">
            <TrackCanvas
              pieces={pieces}
              width={1000}
              height={800}
              showGrid={showGrid}
              showConnections={showConnections}
            />
            <div className="piece-count">
              Loaded {pieces.length} track piece{pieces.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {!loading && !error && pieces.length === 0 && (
          <div className="empty">
            <p>No track pieces found.</p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Track pieces: {pieces.map((p) => p.name).join(', ') || 'None loaded'}</p>
      </footer>
    </div>
  );
}

export default App;
