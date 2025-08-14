interface Entry {
  Timestamp: number;
  SimulationTime: number;
  selected?: boolean;
}

interface CameraEntry extends Entry {
  Camera: {
    Position: [number, number, number];
    Rotation: [number, number, number, number];
    FocusNode: string;
    Scale: number;
    FollowFocusNode: boolean;
  };
}

interface ScriptEntry extends Entry {
  Script: string;
}

export type KeyframeEntry = CameraEntry | ScriptEntry;

export function isCameraEntry(entry: KeyframeEntry): entry is CameraEntry {
  return 'Camera' in entry;
}
