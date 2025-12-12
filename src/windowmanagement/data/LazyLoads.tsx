import { lazy } from 'react';

// Lazy load the panels to enable code splitting
export const ActionsPanel = lazy(() =>
  import('@/panels/ActionsPanel/ActionsPanel').then((module) => ({
    default: module.ActionsPanel
  }))
);
export const ExoplanetsPanel = lazy(() =>
  import('@/panels/ExoplanetsPanel/ExoplanetsPanel').then((module) => ({
    default: module.ExoplanetsPanel
  }))
);
export const FlightControlPanel = lazy(() =>
  import('@/panels/FlightControlPanel/FlightControlPanel').then((module) => ({
    default: module.FlightControlPanel
  }))
);
export const GeoLocationPanel = lazy(() =>
  import('@/panels/GeoLocationPanel/GeoLocationPanel').then((module) => ({
    default: module.GeoLocationPanel
  }))
);
export const KeybindsPanel = lazy(() =>
  import('@/panels/KeybindsPanel/KeybindsPanel').then((module) => ({
    default: module.KeybindsPanel
  }))
);
export const NightSkyPanel = lazy(() =>
  import('@/panels/NightSkyPanel/NightSkyPanel').then((module) => ({
    default: module.NightSkyPanel
  }))
);
export const MissionsPanel = lazy(() =>
  import('@/panels/MissionsPanel/MissionsPanel').then((module) => ({
    default: module.MissionsPanel
  }))
);
export const NavigationPanel = lazy(() =>
  import('@/panels/NavigationPanel/NavigationPanel').then((module) => ({
    default: module.NavigationPanel
  }))
);
export const Scene = lazy(() =>
  import('@/panels/Scene/Scene').then((module) => ({ default: module.Scene }))
);
export const ScreenSpaceRenderablePanel = lazy(() =>
  import('@/panels/ScreenSpaceRenderablePanel/ScreenSpaceRenderablePanel').then(
    (module) => ({ default: module.ScreenSpaceRenderablePanel })
  )
);
export const SessionRecordingPanel = lazy(() =>
  import('@/panels/SessionRecordingPanel/SessionRecordingPanel').then((module) => ({
    default: module.SessionRecordingPanel
  }))
);
export const SettingsPanel = lazy(() =>
  import('@/panels/SettingsPanel/SettingsPanel').then((module) => ({
    default: module.SettingsPanel
  }))
);
export const SkyBrowserPanel = lazy(() =>
  import('@/panels/SkyBrowserPanel/SkyBrowserPanel').then((module) => ({
    default: module.SkyBrowserPanel
  }))
);
export const TimePanel = lazy(() =>
  import('@/panels/TimePanel/TimePanel').then((module) => ({ default: module.TimePanel }))
);
export const UserPanelsPanel = lazy(() =>
  import('@/panels/UserPanelsPanel/UserPanelsPanel').then((module) => ({
    default: module.UserPanelsPanel
  }))
);
export const GettingStartedPanel = lazy(() =>
  import('@/panels/GettingStartedPanel/GettingStartedPanel').then((module) => ({
    default: module.GettingStartedPanel
  }))
);

export const ScriptLogPanel = lazy(() =>
  import('@/panels/LogPanel/ScriptLogPanel').then((module) => ({
    default: module.ScriptLogPanel
  }))
);

export const GlobeImageryBrowserPanel = lazy(() =>
  import('@/panels/GlobeImageryBrowserPanel/GlobeImageryBrowserPanel').then((module) => ({
    default: module.GlobeImageryBrowserPanel
  }))
);
