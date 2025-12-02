import type {
  TrackPiece,
  LinePathDefinition,
  ArcPathDefinition,
  CompositePathDefinition,
  PathDefinition,
} from '../types/track';

export interface RenderOptions {
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  showConnections?: boolean;
  showGrid?: boolean;
  gridSize?: number;
}

const DEFAULT_OPTIONS: Required<RenderOptions> = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  showConnections: true,
  showGrid: false,
  gridSize: 50,
};

/**
 * Render a track piece on a canvas
 */
export function renderTrackPiece(
  ctx: CanvasRenderingContext2D,
  piece: TrackPiece,
  options: RenderOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  ctx.save();

  // Apply transformations
  ctx.translate(opts.offsetX, opts.offsetY);
  ctx.scale(opts.scale, opts.scale);

  // Render the track geometry
  renderGeometry(ctx, piece);

  // Render connections if enabled
  if (opts.showConnections) {
    renderConnections(ctx, piece);
  }

  ctx.restore();
}

/**
 * Render the main track geometry
 */
function renderGeometry(ctx: CanvasRenderingContext2D, piece: TrackPiece) {
  const path = piece.geometry.path;

  ctx.beginPath();
  ctx.lineWidth = piece.dimensions.width || 45;
  ctx.strokeStyle = piece.visual.color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  renderPath(ctx, path);

  ctx.stroke();
}

/**
 * Render a path definition
 */
function renderPath(ctx: CanvasRenderingContext2D, path: PathDefinition) {
  switch (path.type) {
    case 'line':
      renderLinePath(ctx, path as LinePathDefinition);
      break;
    case 'arc':
      renderArcPath(ctx, path as ArcPathDefinition);
      break;
    case 'composite':
      renderCompositePath(ctx, path as CompositePathDefinition);
      break;
    case 'svg':
      // SVG path rendering not implemented yet
      console.warn('SVG path rendering not yet implemented');
      break;
  }
}

/**
 * Render a line path
 */
function renderLinePath(ctx: CanvasRenderingContext2D, path: LinePathDefinition) {
  ctx.moveTo(path.start.x, path.start.y);
  ctx.lineTo(path.end.x, path.end.y);
}

/**
 * Render an arc path
 */
function renderArcPath(ctx: CanvasRenderingContext2D, path: ArcPathDefinition) {
  const startAngleRad = (path.startAngle * Math.PI) / 180;
  const endAngleRad = (path.endAngle * Math.PI) / 180;

  // Move to the start point of the arc
  const startX = path.center.x + path.radius * Math.cos(startAngleRad);
  const startY = path.center.y + path.radius * Math.sin(startAngleRad);
  ctx.moveTo(startX, startY);

  // Draw the arc
  ctx.arc(
    path.center.x,
    path.center.y,
    path.radius,
    startAngleRad,
    endAngleRad,
    !path.clockwise // Canvas uses counter-clockwise flag (opposite of our clockwise)
  );
}

/**
 * Render a composite path
 */
function renderCompositePath(ctx: CanvasRenderingContext2D, path: CompositePathDefinition) {
  for (const segment of path.segments) {
    renderPath(ctx, segment);
  }
}

/**
 * Render connection points
 */
function renderConnections(ctx: CanvasRenderingContext2D, piece: TrackPiece) {
  for (const connection of piece.connections) {
    ctx.save();

    // Move to connection position
    ctx.translate(connection.position.x, connection.position.y);

    // Draw connection point
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);

    if (connection.type === 'male') {
      ctx.fillStyle = '#4A90E2'; // Blue for male
    } else {
      ctx.fillStyle = '#E24A4A'; // Red for female
    }

    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw direction indicator
    const angleRad = (connection.angle * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angleRad) * 15, Math.sin(angleRad) * 15);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * Clear the entire canvas
 */
export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Render a grid for alignment
 */
export function renderGrid(
  ctx: CanvasRenderingContext2D,
  gridSize: number = 50,
  color: string = '#e0e0e0'
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Get the bounding box of a track piece
 */
export function getTrackPieceBounds(piece: TrackPiece) {
  if (piece.dimensions.boundingBox) {
    return piece.dimensions.boundingBox;
  }

  // Calculate from geometry if bounding box not specified
  // For now, use a simple estimation
  const path = piece.geometry.path;

  if (path.type === 'line') {
    const linePath = path as LinePathDefinition;
    return {
      width: Math.abs(linePath.end.x - linePath.start.x),
      height: Math.abs(linePath.end.y - linePath.start.y),
    };
  } else if (path.type === 'arc') {
    const arcPath = path as ArcPathDefinition;
    return {
      width: arcPath.radius * 2,
      height: arcPath.radius * 2,
    };
  }

  return { width: 200, height: 200 };
}
