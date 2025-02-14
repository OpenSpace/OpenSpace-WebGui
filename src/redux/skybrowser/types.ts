export interface SkyBrowserBrowser {
  id: string; // Identifier of the browser
  name: string; // Name of the browser
  targetId: string; // Identifier of the coupled sky target
  borderRadius: number; // Radius of the border of the WWT window
  color: [number, number, number]; // Color of the border [0, 255], rgb
  ra: number; // Right ascension, degrees, [0, 360]
  dec: number; // Declination, degrees, [-90, 90]
  fov: number; // Vertical field of view of the wwt view
  roll: number; // Roll of the camera, degrees, [-180, 180]
  cartesianDirection: number[]; // The normalized direction vector of the view, in cartesian coordinates
  selectedImages: number[]; // Indices of the selected images in the image list
  opacities: number[]; // Opacities of the selected images
  ratio: number; // Ratio of the browser. Computed width / height. [0, 1]
  displayCopies: object; // The information about the sky browser screenspace renderables
  isFacingCamera: boolean; // Are the sky browser screenspace renderables facing the camera?
  isUsingRae: boolean; // Are the sky browser screenspace renderables using RAE?
  scale: number; // Scale of the screenspace renderables
}
