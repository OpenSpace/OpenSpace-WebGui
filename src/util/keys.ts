export const NavigationAnchorKey = 'NavigationHandler.OrbitalNavigator.Anchor';
export const NavigationAimKey = 'NavigationHandler.OrbitalNavigator.Aim';
export const RetargetAnchorKey = 'NavigationHandler.OrbitalNavigator.RetargetAnchor';
export const RetargetAimKey = 'NavigationHandler.OrbitalNavigator.RetargetAim';
export const RotationalFrictionKey =
  'NavigationHandler.OrbitalNavigator.Friction.RotationalFriction';
export const ZoomFrictionKey = 'NavigationHandler.OrbitalNavigator.Friction.ZoomFriction';
export const RollFrictionKey = 'NavigationHandler.OrbitalNavigator.Friction.RollFriction';
// Navigation panel settings
export const ApplyIdleBehaviorOnPathFinishKey =
  'NavigationHandler.PathNavigator.ApplyIdleBehaviorOnFinish';
export const CameraPathArrivalDistanceFactorKey =
  'NavigationHandler.PathNavigator.ArrivalDistanceFactor';
export const CameraPathSpeedFactorKey = 'NavigationHandler.PathNavigator.SpeedScale';
export const JumpToFadeDurationKey = 'NavigationHandler.JumpToFadeDuration';

// To get any scene graph node you need ScenePrefix+NodeIdentifier
export const ScenePrefixKey = 'Scene.';

// @TODO (2024-04-07, emmbr): Remove this key here and from engine - it is no longer used
// export const InterestingTagKey = 'GUI.Interesting';

export const rootOwnerKey = '__rootOwner';
export const GeoLocationGroupKey = '/GeoLocation';

// OpenSpace engine
export const EnginePropertyVisibilityKey = 'OpenSpaceEngine.PropertyVisibility';

// OpenSpace folders
// eslint-disable-next-line no-template-curly-in-string
export const UserPanelsFolderKey = '${USER}/webpanels';
// eslint-disable-next-line no-template-curly-in-string
export const RecordingsFolderKey = '${RECORDINGS}/';

export const WindowsKey = 'Windows';
export const ScreenSpaceKey = 'ScreenSpace';
export const RenderableKey = 'Renderable';
export const ScaleKey = 'Scale';
export const TranslationKey = 'Translation';
export const RotationKey = 'Rotation';

// Sky browser properties
export const SkyBrowserAllowCameraRotationKey = 'Modules.SkyBrowser.AllowCameraRotation';
export const SkyBrowserCameraRotationSpeedKey = 'Modules.SkyBrowser.CameraRotationSpeed';
export const SkyBrowserTargetAnimationSpeedKey =
  'Modules.SkyBrowser.TargetAnimationSpeed';
export const SkyBrowserBrowserAnimationSpeedKey =
  'Modules.SkyBrowser.BrowserAnimationSpeed';
export const SkyBrowserHideTargetsBrowsersWithGuiKey =
  'Modules.SkyBrowser.HideTargetsBrowsersWithGui';
export const SkyBrowserInverseZoomDirectionKey =
  'Modules.SkyBrowser.InverseZoomDirection';
export const SkyBrowserSpaceCraftAnimationTimeKey =
  'Modules.SkyBrowser.SpaceCraftAnimationTime';
