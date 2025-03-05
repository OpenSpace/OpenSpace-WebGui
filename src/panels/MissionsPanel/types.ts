import { Identifier } from '@/types/types';

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
  identifier: Identifier; // TOOD anden88 2025-03-03: The identifier only exists on the outermost
  // phase object, refactor the phase Object into a Mission type that includes the phases and captureTimes?
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
