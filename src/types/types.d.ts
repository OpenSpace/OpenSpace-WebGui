export interface Action {
  identifier: string;
  guiPath: string;
  name: string;
  synchronization: boolean;
  documentation: string;
}

export interface Keybind {
  action: string;
  key: string;
  modifiers: {
    alt: boolean;
    control: boolean;
    shift: boolean;
    super: boolean;
  };
}

export type ActionOrKeybind = Action | Keybind;

export interface ExoplanetData {
  name: string;
  identifier: string;
}

export interface PropertyMetaData {
  Group: string;
  ViewOptions: object; // specify this
  Visibility: string; // TODO specify this as developer  | user | noviceUser etc
  isReadOnly: boolean;
  needsConfirmation: boolean;
}

export type PropertyValue = string | number | number[] | boolean;
export interface Property {
  description: {
    additionalData: any;
    identifier: string;
    metaData: PropertyMetaData;
    name: string;
    type: string; // TODO: define these as property types i.e., boolproperty, stringproperty etc
    description: string;
  };
  value: PropertyValue; // TODO: investigate if these are all the values we can have
  uri: string;
}

export interface Properties {
  [key: string]: Property | undefined;
}

export interface PropertyOwner {
  description: string;
  name: string;
  identifier: string;
  properties: string[];
  subowners: string[];
  tags: string[];
  uri: string;
}

export interface PropertyOwners {
  [key: string]: PropertyOwner | undefined;
}

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

// Flightcontroller types
export type FlightControllerConnectCommand = {
  type: 'connect';
};
export type FlightControllerDisconnectCommand = {
  type: 'disconnect';
};
export type FlightControllerInputStateCommand = {
  type: 'inputState';
  // TODO: add additional properties
};

export interface FlightControllerUpdateViewCommand {
  type: 'updateView';
  focus: string;
  anchor: string;
  aim: string;
  resetVelocities: boolean;
  retargetAnchor: boolean;
  retargetAim: boolean;
}

export type FlightControllerData =
  | FlightControllerConnectCommand
  | FlightControllerDisconnectCommand
  | FlightControllerInputStateCommand
  | FlightControllerUpdateViewCommand;
