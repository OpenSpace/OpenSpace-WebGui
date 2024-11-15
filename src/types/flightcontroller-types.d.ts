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
