import { useEffect, useRef } from 'react';
import type { TrackPiece } from '../types/track';
import { clearCanvas, renderGrid, renderTrackPiece } from '../utils/trackRenderer';

interface TrackCanvasProps {
  pieces: TrackPiece[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showConnections?: boolean;
}

export function TrackCanvas({
  pieces,
  width = 800,
  height = 600,
  showGrid = true,
  showConnections = true,
}: TrackCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    clearCanvas(ctx);

    // Render grid if enabled
    if (showGrid) {
      renderGrid(ctx, 50, '#f0f0f0');
    }

    // Render all track pieces
    pieces.forEach((piece, index) => {
      // Calculate offset for each piece (simple grid layout for demo)
      const offsetX = 100 + (index % 3) * 300;
      const offsetY = 100 + Math.floor(index / 3) * 250;

      renderTrackPiece(ctx, piece, {
        scale: 1,
        offsetX,
        offsetY,
        showConnections,
      });

      // Draw piece name
      ctx.save();
      ctx.fillStyle = '#333';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(piece.name, offsetX + 100, offsetY - 20);
      ctx.restore();
    });
  }, [pieces, showGrid, showConnections]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff',
      }}
    />
  );
}
