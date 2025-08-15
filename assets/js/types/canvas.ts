export interface BrushLine {
  // Make this more generic?
  tool: string;
  points: number[];
  color: string;
  width: number;
  opacity: number;
}