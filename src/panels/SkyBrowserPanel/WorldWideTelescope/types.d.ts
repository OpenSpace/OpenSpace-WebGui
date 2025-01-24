interface HideChromeMessage {
  event: 'modify_settings';
  settings: [['hideAllChrome', true]];
  target: 'app';
}

interface LoadCollectionMessage {
  event: 'load_image_collection';
  url: string;
  loadChildFolders: true;
}

interface BorderRadiusMessage {
  event: 'set_border_radius';
  data: number;
}

interface ColorMessage {
  event: 'set_background_color';
  data: number[];
}

interface AimMessage {
  event: 'center_on_coordinates';
  ra: number;
  dec: number;
  fov: number;
  roll: number;
  instant: true;
}

export type Messages =
  | HideChromeMessage
  | LoadCollectionMessage
  | BorderRadiusMessage
  | ColorMessage
  | AimMessage;
