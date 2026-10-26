import { AnyProperty } from 'openspace-api-js/types';

export type Vec3 = [number, number, number];

export interface NavigationStateValue {
  anchor: string;
  position: Vec3;
  aim?: string;
  pitch?: number;
  referenceFrame?: string;
  up?: Vec3;
  yaw?: number;
  timestamp?: string;
}

export interface PropertyCommandValue {
  property: string;
  value: AnyProperty['value'];
}

export type TestCommand =
  | { type: 'navigationstate'; value: NavigationStateValue }
  | { type: 'asset'; value: string }
  | { type: 'property'; value: PropertyCommandValue }
  | { type: 'wait'; value: number }
  | { type: 'script'; value: string }
  | { type: 'time'; value: string }
  | { type: 'pause'; value: boolean }
  | { type: 'deltatime'; value: number }
  | { type: 'action'; value: string }
  | { type: 'screenshot' };

export interface CommandEntry {
  id: string;
  cmd: TestCommand;
}

export interface OsTest {
  profile: string;
  commands: TestCommand[];
}

export const COMMAND_TYPES = [
  'navigationstate',
  'asset',
  'property',
  'wait',
  'script',
  'time',
  'pause',
  'deltatime',
  'action'
] as const;

export type CommandType = (typeof COMMAND_TYPES)[number];

// The navigation state as returned by OpenSpace
export interface NavState {
  Anchor: string;
  Position: Vec3;
  Aim?: string;
  Pitch?: number;
  ReferenceFrame?: string;
  Timestamp?: string;
  Up?: Vec3;
  Yaw?: number;
}
