interface FlightControllerConnectCommand {
  type: 'connect';
}

interface FlightControllerDisconnectCommand {
  type: 'disconnect';
}

interface FlightControllerInputStateCommand {
  type: 'inputState';
  inputState: {
    values: {
      zoomIn?: number;
      orbitX?: number;
      orbitY?: number;
      panX?: number;
      panY?: number;
      localRollX?: number;
    };
  };
}

interface FlightControllerUpdateViewCommand {
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
