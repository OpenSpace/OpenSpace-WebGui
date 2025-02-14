export interface Milestone {
  date: string; // Date as an UTC ISO8601 string
  name: string;
  description?: string;
  image?: string;
  link?: string;
  actions?: string[];
}

export interface Phase {
  name: string;
  description: string;
  actions: string[];
  timerange: { start: string; end: string }; // Dates as an UTC ISO8601 string
  phases: Phase[];
  image: string;
  link: string;
  milestones: Milestone[];
  capturetimes: string[];
}

export type DisplayedPhase =
  | { type: DisplayType.Phase; data: Phase }
  | { type: DisplayType.Overview; data: Phase }
  | { type: DisplayType.Milestone; data: Milestone }
  | { type: undefined; data: undefined };

export enum DisplayType {
  Phase = 'Phase',
  Milestone = 'Milestone',
  Overview = 'Overview'
}
