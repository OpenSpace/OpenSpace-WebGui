import { Identifier, Uri } from '@/types/types';

// Event types, these were manually typed from the event.cpp `toParameter`function:
// https://github.com/OpenSpace/OpenSpace/blob/6dd3dd8ab88653fddee0b2e480934faf53d3c0f8/src/events/event.cpp#L332
type ParallelConnectionEvent = {
  Event: 'ParallelConnection';
  State: 'Established' | 'Lost' | 'HostshipGained' | 'HostshipLost';
};

type ProfileLoadingFinishedEvent = {
  Event: 'ProfileLoadingFinished';
};

type AssetLoadingFinishedEvent = {
  Event: 'AssetLoadingFinished';
};

type ApplicationShutdownEvent = {
  Event: 'ApplicationShutdown';
  State: 'Started' | 'Aborted' | 'Finished';
};

type CameraFocusTransitionEvent = {
  Event: 'CameraFocusTransition';
  Node: Identifier;
  Transition: 'Approaching' | 'Reaching' | 'Receding' | 'Exiting';
};

type TimeOfInterestReachedEvent = {
  Event: 'TimeOfInterestReached';
};

type MissionEventReachedEvent = {
  Event: 'MissionEventReached';
};

type PlanetEclipsedEvent = {
  Event: 'PlanetEclipsed';
  Eclipsee: Identifier;
  Eclipser: Identifier;
};

type InterpolationFinishedEvent = {
  Event: 'InterpolationFinished';
  Property: Uri;
};

type FocusNodeChangedEvent = {
  Event: 'FocusNodeChanged';
  OldNode: Identifier;
  NewNode: Identifier;
};

type PropertyTreeUpdatedEvent = {
  Event: 'PropertyTreeUpdated';
  Uri: Uri;
};

type PropertyTreePrunedEvent = {
  Event: 'PropertyTreePruned';
  Uri: Uri;
};

type ActionAddedEvent = {
  Event: 'ActionAdded';
  Uri: Uri;
};

type ActionRemovedEvent = {
  Event: 'ActionRemoved';
  Uri: Uri;
};

type SessionRecordingPlaybackEvent = {
  Event: 'SessionRecordingPlayback';
  State: 'Started' | 'Paused' | 'Resumed' | 'Finished';
};

type PointSpacecraftEvent = {
  Event: 'PointSpacecraft';
};

type RenderableEnabledEvent = {
  Event: 'RenderableEnabled';
  Node: Identifier;
};

type RenderableDisabledEvent = {
  Event: 'RenderableDisabled';
  Node: Identifier;
};

type CameraPathStartedEvent = {
  Event: 'CameraPathStarted';
  Origin: Identifier;
  Destination: Identifier;
};

type CameraPathFinishedEvent = {
  Event: 'CameraPathFinished';
  Origin: Identifier;
  Destination: Identifier;
};

type CameraMovedPositionEvent = {
  Event: 'CameraMovedPosition';
};

type ScheduledScriptExecutedEvent = {
  Event: 'ScheduledScriptExecuted';
  Script: string;
};

type GuiTreeUpdatedEvent = {
  Event: 'GuiTreeUpdated';
};

type CustomEvent = {
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
