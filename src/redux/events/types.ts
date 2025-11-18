import { Identifier, Uri } from '@/types/types';

// Event types, these were manually typed from the event.cpp `toParameter`function:
// https://github.com/OpenSpace/OpenSpace/blob/6dd3dd8ab88653fddee0b2e480934faf53d3c0f8/src/events/event.cpp#L332
type ActionAddedEvent = {
  Event: 'ActionAdded';
  Uri: Uri;
};

type ActionRemovedEvent = {
  Event: 'ActionRemoved';
  Uri: Uri;
};

type ApplicationShutdownEvent = {
  Event: 'ApplicationShutdown';
  State: 'Started' | 'Aborted' | 'Finished';
};

export type AssetLoadingFinishedEvent = {
  Event: 'AssetLoadingFinished';
  AssetPath: string;
};

export type AssetLoadingErrorEvent = {
  Event: 'AssetLoadingError';
  AssetPath: string;
};

export type AssetUnloadingFinishedEvent = {
  Event: 'AssetUnloadingFinished';
  AssetPath: string;
};

type CameraFocusTransitionEvent = {
  Event: 'CameraFocusTransition';
  Node: Identifier;
  Transition: 'Approaching' | 'Reaching' | 'Receding' | 'Exiting';
};

type CameraMovedPositionEvent = {
  Event: 'CameraMovedPosition';
};

type CameraPathFinishedEvent = {
  Event: 'CameraPathFinished';
  Origin: Identifier;
  Destination: Identifier;
};

type CameraPathStartedEvent = {
  Event: 'CameraPathStarted';
  Origin: Identifier;
  Destination: Identifier;
};

type CustomEvent = {
  Event: 'Custom';
  Subtype: string;
  Payload: string;
};

type FocusNodeChangedEvent = {
  Event: 'FocusNodeChanged';
  OldNode: Identifier;
  NewNode: Identifier;
};

type GuiTreeUpdatedEvent = {
  Event: 'GuiTreeUpdated';
};

type InterpolationFinishedEvent = {
  Event: 'InterpolationFinished';
  Property: Uri;
};

type MissionAddedEvent = {
  Event: 'MissionAdded';
  MissionName: string;
};

type MissionEventReachedEvent = {
  Event: 'MissionEventReached';
};

type MissionRemovedEvent = {
  Event: 'MissionRemoved';
  MissionName: string;
};

type ParallelConnectionEvent = {
  Event: 'ParallelConnection';
  State: 'Established' | 'Lost' | 'HostshipGained' | 'HostshipLost';
};

type PlanetEclipsedEvent = {
  Event: 'PlanetEclipsed';
  Eclipsee: Identifier;
  Eclipser: Identifier;
};

type PointSpacecraftEvent = {
  Event: 'PointSpacecraft';
};

type ProfileLoadingFinishedEvent = {
  Event: 'ProfileLoadingFinished';
};

type PropertyTreePrunedEvent = {
  Event: 'PropertyTreePruned';
  Uri: Uri;
};

type PropertyTreeUpdatedEvent = {
  Event: 'PropertyTreeUpdated';
  Uri: Uri;
};

type RenderableDisabledEvent = {
  Event: 'RenderableDisabled';
  Node: Identifier;
};

type RenderableEnabledEvent = {
  Event: 'RenderableEnabled';
  Node: Identifier;
};

type ScheduledScriptExecutedEvent = {
  Event: 'ScheduledScriptExecuted';
  Script: string;
};

export type SessionRecordingPlaybackEvent = {
  Event: 'SessionRecordingPlayback';
  State: 'Started' | 'Paused' | 'Resumed' | 'Finished';
};

type TimeOfInterestReachedEvent = {
  Event: 'TimeOfInterestReached';
};

export type EventData =
  | ActionAddedEvent
  | ActionRemovedEvent
  | ApplicationShutdownEvent
  | AssetLoadingFinishedEvent
  | AssetLoadingErrorEvent
  | AssetUnloadingFinishedEvent
  | CameraFocusTransitionEvent
  | CameraMovedPositionEvent
  | CameraPathFinishedEvent
  | CameraPathStartedEvent
  | CustomEvent
  | FocusNodeChangedEvent
  | GuiTreeUpdatedEvent
  | InterpolationFinishedEvent
  | MissionAddedEvent
  | MissionEventReachedEvent
  | MissionRemovedEvent
  | ParallelConnectionEvent
  | PlanetEclipsedEvent
  | PointSpacecraftEvent
  | ProfileLoadingFinishedEvent
  | PropertyTreePrunedEvent
  | PropertyTreeUpdatedEvent
  | RenderableDisabledEvent
  | RenderableEnabledEvent
  | ScheduledScriptExecutedEvent
  | SessionRecordingPlaybackEvent
  | TimeOfInterestReachedEvent;
