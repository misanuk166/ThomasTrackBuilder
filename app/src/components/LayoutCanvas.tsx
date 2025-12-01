import { useEffect, useRef, useState, useCallback } from 'react';
import type { TrackPiece } from '../types/track';
import type { PlacedPiece, SnapCandidate } from '../types/layout';
import { clearCanvas, renderGrid, renderTrackPiece } from '../utils/trackRenderer';
import { findSnapCandidate, getAbsoluteConnectionPosition, DEFAULT_SNAP_SETTINGS } from '../utils/snapDetection';

interface LayoutCanvasProps {
  width?: number;
  height?: number;
  showGrid?: boolean;
  placedPieces: PlacedPiece[];
  selectedPiece: TrackPiece | null;
  onPlacePiece: (position: { x: number; y: number }, rotation: number) => void;
  onSelectPlacedPiece: (id: string | null) => void;
  selectedPlacedPieceId: string | null;
}

export function LayoutCanvas({
  width = 1200,
  height = 800,
  showGrid = true,
  placedPieces,
  selectedPiece,
  onPlacePiece,
  onSelectPlacedPiece,
  selectedPlacedPieceId,
}: LayoutCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [previewRotation, setPreviewRotation] = useState(0);
  const [snapCandidate, setSnapCandidate] = useState<SnapCandidate | null>(null);

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      // Find snap candidate if we have a selected piece
      if (selectedPiece) {
        const candidate = findSnapCandidate(
          selectedPiece,
          { x, y },
          previewRotation,
          placedPieces,
          DEFAULT_SNAP_SETTINGS
        );
        setSnapCandidate(candidate);
      }
    },
    [selectedPiece, previewRotation, placedPieces]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
    setSnapCandidate(null);
  }, []);

  // Handle click to place
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!selectedPiece) {
        // No piece selected, check if clicking on a placed piece
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Find clicked piece (simple distance check)
        let clickedPieceId: string | null = null;
        let minDist = 100; // Click threshold

        for (const piece of placedPieces) {
          const dx = piece.position.x - x;
          const dy = piece.position.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < minDist) {
            minDist = dist;
            clickedPieceId = piece.id;
          }
        }

        onSelectPlacedPiece(clickedPieceId);
        return;
      }

      // Place the selected piece
      if (snapCandidate) {
        // Snap to the candidate position and rotation
        onPlacePiece(snapCandidate.snapPosition, snapCandidate.snapRotation);
      } else if (mousePos) {
        // Place at mouse position with current rotation
        onPlacePiece(mousePos, previewRotation);
      }

      setSnapCandidate(null);
    },
    [selectedPiece, snapCandidate, mousePos, previewRotation, onPlacePiece, placedPieces, onSelectPlacedPiece]
  );

  // Handle rotation with R key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        setPreviewRotation((prev) => (prev + 90) % 360);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Render the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    clearCanvas(ctx);

    // Render grid
    if (showGrid) {
      renderGrid(ctx, 50, '#f0f0f0');
    }

    // Render placed pieces
    for (const placedPiece of placedPieces) {
      ctx.save();
      ctx.translate(placedPiece.position.x, placedPiece.position.y);
      ctx.rotate((placedPiece.rotation * Math.PI) / 180);
      ctx.translate(-placedPiece.position.x, -placedPiece.position.y);

      renderTrackPiece(ctx, placedPiece.piece, {
        offsetX: placedPiece.position.x,
        offsetY: placedPiece.position.y,
        showConnections: true,
      });

      ctx.restore();

      // Highlight selected piece
      if (placedPiece.id === selectedPlacedPieceId) {
        ctx.save();
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        const bounds = placedPiece.piece.dimensions.boundingBox || { width: 200, height: 50 };
        ctx.rect(
          placedPiece.position.x - bounds.width / 2,
          placedPiece.position.y - bounds.height / 2,
          bounds.width,
          bounds.height
        );
        ctx.stroke();
        ctx.restore();
      }
    }

    // Render snap indicators
    if (snapCandidate && DEFAULT_SNAP_SETTINGS.showIndicators) {
      // Highlight the snap target connection
      const snapTargetPos = getAbsoluteConnectionPosition(
        snapCandidate.placedPiece,
        snapCandidate.placedConnection
      );

      ctx.save();
      ctx.fillStyle = 'rgba(74, 226, 164, 0.3)';
      ctx.strokeStyle = '#4AE2A4';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(snapTargetPos.x, snapTargetPos.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Render preview piece
    if (selectedPiece && mousePos) {
      const previewPos = snapCandidate ? snapCandidate.snapPosition : mousePos;
      const previewRot = snapCandidate ? snapCandidate.snapRotation : previewRotation;

      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.translate(previewPos.x, previewPos.y);
      ctx.rotate((previewRot * Math.PI) / 180);
      ctx.translate(-previewPos.x, -previewPos.y);

      renderTrackPiece(ctx, selectedPiece, {
        offsetX: previewPos.x,
        offsetY: previewPos.y,
        showConnections: true,
      });

      ctx.restore();
    }
  }, [placedPieces, selectedPiece, mousePos, previewRotation, snapCandidate, showGrid, selectedPlacedPieceId]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        border: '1px solid #ddd',
        cursor: selectedPiece ? 'crosshair' : 'default',
        backgroundColor: '#fff',
      }}
    />
  );
}
