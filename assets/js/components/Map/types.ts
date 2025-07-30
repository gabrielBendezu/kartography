export interface BrushConfig {
  width: number;
  color: string;
  opacity: number;
}

export interface BrushSettingsProps {
  settings: BrushConfig;
  onChange: (field: keyof BrushConfig, value: number | string) => void;
}
