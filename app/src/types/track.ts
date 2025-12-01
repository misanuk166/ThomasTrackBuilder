// TypeScript types for TrackMaster track pieces
// Generated from JSON schema

export type TrackCategory = 'straight' | 'curved' | 'switch' | 'special' | 'elevation' | 'accessory';

export type TrackType =
  | 'straight-short'
  | 'straight-medium'
  | 'straight-long'
  | 'straight-standard'
  | 'curve-standard'
  | 'curve-wide'
  | 'curve-tight'
  | 'switch-left'
  | 'switch-right'
  | 'switch-y'
  | 'crossing'
  | 'turntable'
  | 'riser'
  | 'bridge'
  | 'station'
  | 'terminal';

export type ConnectionType = 'male' | 'female';

export type GeometryType = 'line' | 'arc' | 'composite';

export type RenderStyle = 'simple' | 'detailed' | 'realistic';

export type Availability = 'current' | 'retired' | 'rare' | 'common';

export interface Position {
  x: number;
  y: number;
}

export interface Connection {
  id: string;
  type: ConnectionType;
  position: Position;
  angle: number;
  height: number;
  compatible?: string[];
}

export interface Dimensions {
  length?: number;
  width?: number;
  radius?: number;
  angle?: number;
  arcLength?: number;
  height: number;
  clearanceHeight?: number;
  boundingBox?: {
    width: number;
    height: number;
  };
  unit: 'mm';
}

export interface LinePathDefinition {
  type: 'line';
  start: Position;
  end: Position;
}

export interface ArcPathDefinition {
  type: 'arc';
  center: Position;
  radius: number;
  startAngle: number;
  endAngle: number;
  clockwise: boolean;
}

export interface CompositePathDefinition {
  type: 'composite';
  segments: (LinePathDefinition | ArcPathDefinition)[];
}

export interface SVGPathDefinition {
  type: 'svg';
  d: string;
}

export type PathDefinition =
  | LinePathDefinition
  | ArcPathDefinition
  | CompositePathDefinition
  | SVGPathDefinition;

export interface Geometry {
  type: GeometryType;
  path: PathDefinition;
  collisionPath?: PathDefinition;
}

export interface VisualProperties {
  color: string;
  texture?: string;
  renderStyle: RenderStyle;
  icon?: string;
  modelUrl?: string;
}

export interface Metadata {
  sku?: string;
  manufacturer: string;
  productLine: string;
  availability: Availability;
  setIncludes?: string[];
  yearIntroduced?: number;
  discontinued?: boolean;
  notes?: string;
}

export interface TrackPiece {
  id: string;
  name: string;
  category: TrackCategory;
  type: TrackType;
  dimensions: Dimensions;
  connections: Connection[];
  geometry: Geometry;
  visual: VisualProperties;
  metadata: Metadata;
}

export interface TrackCatalogPiece {
  id: string;
  file: string;
  category: TrackCategory;
  name: string;
  commonName: string;
}

export interface TrackCatalogCategory {
  id: TrackCategory;
  name: string;
  description: string;
  icon: string;
  order: number;
}

export interface TrackCatalog {
  version: string;
  lastUpdated: string;
  description: string;
  pieces: TrackCatalogPiece[];
  categories: TrackCatalogCategory[];
  stats: {
    totalPieces: number;
    categoryCounts: Record<TrackCategory, number>;
  };
}
