// Event types, these were manually typed from the event.cpp `toParameter`function:
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
  Node: string;
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
  Eclipsee: string;
  Eclipser: string;
};
export type InterpolationFinishedEvent = {
  Event: 'InterpolationFinished';
  Property: string;
};
export type FocusNodeChangedEvent = {
  Event: 'FocusNodeChanged';
  OldNode: string;
  NewNode: string;
};
export type PropertyTreeUpdatedEvent = {
  Event: 'PropertyTreeUpdated';
  Uri: string;
};
export type PropertyTreePrunedEvent = {
  Event: 'PropertyTreePruned';
  Uri: string;
};
export type ActionAddedEvent = {
  Event: 'ActionAdded';
  Uri: string;
};
export type ActionRemovedEvent = {
  Event: 'ActionRemoved';
  Uri: string;
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
  Node: string;
};
export type RenderableDisabledEvent = {
  Event: 'RenderableDisabled';
  Node: string;
};
export type CameraPathStartedEvent = {
  Event: 'CameraPathStarted';
  Origin: string;
  Destination: string;
};
export type CameraPathFinishedEvent = {
  Event: 'CameraPathFinished';
  Origin: string;
  Destination: string;
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
