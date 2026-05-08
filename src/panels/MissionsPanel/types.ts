import { Milestone, MissionPhase } from 'openspace-api-js/generated';

export type DisplayedPhase =
  | { type: DisplayType.Phase; data: MissionPhase }
  | { type: DisplayType.Overview; data: MissionPhase }
  | { type: DisplayType.Milestone; data: Milestone }
  | { type: undefined; data: undefined };

export enum DisplayType {
  Phase = 'Phase',
  Milestone = 'Milestone',
  Overview = 'Overview'
}
