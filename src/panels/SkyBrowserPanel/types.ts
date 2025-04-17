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
  data: number; // Radius value, range [0,1]
}

interface ColorMessage {
  event: 'set_background_color';
  data: [number, number, number]; // Color value, rgb [0,255]
}

interface AimMessage {
  event: 'center_on_coordinates';
  ra: number; // Right Ascension, degrees, [0, 360]
  dec: number; // Declination, degrees, [-90, 90]
  fov: number; // Vertical field of view, ]0, 70]
  roll: number; // Camera roll, degrees, [-180, 180]
  instant: true; // Should the camera move to this position instantly in the wwt app?
}

interface ImageMessage {
  event: 'image_layer_create';
  id: string;
  url: string;
  mode: 'preloaded'; // Preloaded - the image has been loaded before in an image collection
  goto: false; // Should the camera animate towards this image coordinate or not?
}

interface OpacityMessage {
  event: 'image_layer_set';
  id: string;
  setting: 'opacity';
  value: number;
}

interface RemoveImageMessage {
  event: 'image_layer_remove';
  id: string;
}

export type Messages =
  | HideChromeMessage
  | LoadCollectionMessage
  | BorderRadiusMessage
  | ColorMessage
  | AimMessage
  | ImageMessage
  | OpacityMessage
  | RemoveImageMessage;

export interface SkyBrowserImage {
  cartesianDirection: number[]; // The normalized direction vector of the image, in cartesian coordinates
  collection: string; // Name of the image collection
  credits: string; // Text for the image credits
  creditsUrl: string; // Url for the image credits
  dec: number; // Declination; degrees [-90, 90]
  fov: number; // Vertical field of view, ]0, 70]
  hasCelestialCoords: boolean; // If this image has a coordinate; else it is (probably) a sky survey
  identifier: string; // The image unique identifier
  key: string; // A unique key
  name: string; // Name of the image
  ra: number; // Right ascension, degrees, [0, 360]
  thumbnail: string; // Thumbnail image url
  url: string; // Url of image to load into WWT
}

export type Status =
  | 'LoadingWwt'
  | 'LoadingImageCollection'
  | 'CameraNotInSolarSystem'
  | 'Ok';
