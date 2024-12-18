// Event types, these were manually typed from the event.cpp `toParameter`function:

import { Identifier } from './types';

// https://github.com/OpenSpace/OpenSpace/blob/6dd3dd8ab88653fddee0b2e480934faf53d3c0f8/src/events/event.cpp#L332
export type ParallelConnectionEvent = {
  Event: 'ParallelConnection';
  State: 'Established' | 'Lost' | 'HostshipGained' | 'HostshipLost';
};
export type ProfileLoadingFinishedEvent = {
  Event: 'ProfileLoadingFinished';
};
export type AssetLoadingFinishedEvent = {
  Event: 'AssetLoadingFinished';
};
export type ApplicationShutdownEvent = {
  Event: 'ApplicationShutdown';
  State: 'Started' | 'Aborted' | 'Finished';
};
export type CameraFocusTransitionEvent = {
  Event: 'CameraFocusTransition';
  Node: Identifer;
  Transition: 'Approaching' | 'Reaching' | 'Receding' | 'Exiting';
};
export type TimeOfInterestReachedEvent = {
  Event: 'TimeOfInterestReached';
};
export type MissionEventReachedEvent = {
  Event: 'MissionEventReached';
};
export type PlanetEclipsedEvent = {
  Event: 'PlanetEclipsed';
  Eclipsee: Identifier;
  Eclipser: Identifier;
};
export type InterpolationFinishedEvent = {
  Event: 'InterpolationFinished';
  Property: Uri;
};
export type FocusNodeChangedEvent = {
  Event: 'FocusNodeChanged';
  OldNode: Identifier;
  NewNode: Identifier;
};
export type PropertyTreeUpdatedEvent = {
  Event: 'PropertyTreeUpdated';
  Uri: Uri;
};
export type PropertyTreePrunedEvent = {
  Event: 'PropertyTreePruned';
  Uri: Uri;
};
export type ActionAddedEvent = {
  Event: 'ActionAdded';
  Uri: Uri;
};
export type ActionRemovedEvent = {
  Event: 'ActionRemoved';
  Uri: Uri;
};
export type SessionRecordingPlaybackEvent = {
  Event: 'SessionRecordingPlayback';
  State: 'Started' | 'Paused' | 'Resumed' | 'Finished';
};
export type PointSpacecraftEvent = {
  Event: 'PointSpacecraft';
};
export type RenderableEnabledEvent = {
  Event: 'RenderableEnabled';
  Node: Identifier;
};
export type RenderableDisabledEvent = {
  Event: 'RenderableDisabled';
  Node: Identifier;
};
export type CameraPathStartedEvent = {
  Event: 'CameraPathStarted';
  Origin: Identifier;
  Destination: Identifier;
};
export type CameraPathFinishedEvent = {
  Event: 'CameraPathFinished';
  Origin: Identifier;
  Destination: Identifier;
};
export type CameraMovedPositionEvent = {
  Event: 'CameraMovedPosition';
};
export type ScheduledScriptExecutedEvent = {
  Event: 'ScheduledScriptExecuted';
  Script: string;
};
export type GuiTreeUpdatedEvent = {
  Event: 'GuiTreeUpdated';
};
export type CustomEvent = {
  Event: 'Custom';
  Subtype: string;
  Payload: string;
};

export type EventData =
  | ParallelConnectionEvent
  | ProfileLoadingFinishedEvent
  | AssetLoadingFinishedEvent
  | ApplicationShutdownEvent
  | CameraFocusTransitionEvent
  | TimeOfInterestReachedEvent
  | MissionEventReachedEvent
  | PlanetEclipsedEvent
  | InterpolationFinishedEvent
  | FocusNodeChangedEvent
  | PropertyTreeUpdatedEvent
  | PropertyTreePrunedEvent
  | ActionAddedEvent
  | ActionRemovedEvent
  | SessionRecordingPlaybackEvent
  | PointSpacecraftEvent
  | RenderableEnabledEvent
  | RenderableDisabledEvent
  | CameraPathStartedEvent
  | CameraPathFinishedEvent
  | CameraMovedPositionEvent
  | ScheduledScriptExecutedEvent
  | GuiTreeUpdatedEvent
  | CustomEvent;
