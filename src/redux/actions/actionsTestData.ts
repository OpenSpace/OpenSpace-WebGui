export const actionsTestData = [
  {
    documentation: 'Enables global illumination for all globes',
    guiPath: '/Solar System',
    identifier: 'os.AllGlobesGlobalIllumination',
    name: 'All globes global illumination',
    synchronization: true
  },
  {
    documentation: 'Disables global illumination for all globes',
    guiPath: '/Solar System',
    identifier: 'os.AllGlobesStandardIllumination',
    name: 'All globes standard illumination',
    synchronization: true
  },
  {
    documentation: 'Disable constellation artwork',
    guiPath: '/Constellations/Art',
    identifier: 'os.constellation_art.DisableArt',
    name: 'Disable all',
    synchronization: true
  },
  {
    documentation:
      'Sets items like the stars and constellations to be shown during the day',
    guiPath: '/Night Sky/Daytime',
    identifier: 'os.nightsky.DisableDimming',
    name: 'Disable atmosphere dimming',
    synchronization: true
  },
  {
    documentation: 'Enables global illumination forEarth',
    guiPath: '/Solar System/Earth',
    identifier: 'os.earth_global_illumination',
    name: 'Earth global illumination',
    synchronization: true
  },
  {
    documentation: 'Enables standard illumination forEarth',
    guiPath: '/Solar System/Earth',
    identifier: 'os.earth_standard_illumination',
    name: 'Earth standard illumination',
    synchronization: true
  },
  {
    documentation:
      'Sets items like the stars and constellations to be hidden during the day',
    guiPath: '/Night Sky/Daytime',
    identifier: 'os.nightsky.EnableDimming',
    name: 'Enable atmosphere dimming',
    synchronization: true
  },
  {
    documentation:
      'Toggles the fade to black within 3 seconds or shows the rendering\n    after 3 seconds',
    guiPath: '/Rendering',
    identifier: 'os.FadeToBlack',
    name: 'Fade to/from black',
    synchronization: true
  },
  {
    documentation: 'Set camera focus on the Earth',
    guiPath: '/Solar System/Earth',
    identifier: 'os.solarsystem.FocusEarth',
    name: 'Focus on Earth',
    synchronization: true
  },
  {
    documentation: 'Refocuses the camera on the ISS',
    guiPath: '/Solar System/Earth',
    identifier: 'os.solarsystem.FocusIss',
    name: 'Focus on ISS',
    synchronization: true
  },
  {
    documentation: 'Set camera focus on the Moon',
    guiPath: '/Solar System/Earth/Moon',
    identifier: 'os.earth.FocusMoon',
    name: 'Focus on Moon',
    synchronization: true
  },
  {
    documentation: 'Hides the local Altitude/Azimuth grid centered around your position',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.HideAltaz',
    name: 'Hide Alt/Az grid',
    synchronization: true
  },
  {
    documentation: 'Fades out constellation artwork',
    guiPath: '/Constellations/Art',
    identifier: 'os.constellation_art.HideArt',
    name: 'Hide all',
    synchronization: true
  },
  {
    documentation: 'Hides all the constellations lines',
    guiPath: '/Constellations/Lines',
    identifier: 'os.constellations.HideConstellations',
    name: 'Hide all',
    synchronization: true
  },
  {
    documentation: 'Fade down all enabled trails in the Scene',
    guiPath: '/Trails',
    identifier: 'os.FadeDownTrails',
    name: 'Hide all trails',
    synchronization: true
  },
  {
    documentation: 'Hides the cardinal directions',
    guiPath: '/Night Sky/Directions',
    identifier: 'os.nightsky.HideNesw',
    name: 'Hide cardinal directions',
    synchronization: true
  },
  {
    documentation: 'Hides the ecliptic band',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.HideEclipticBand',
    name: 'Hide ecliptic band',
    synchronization: true
  },
  {
    documentation: 'Hides the ecliptic line',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.HideEclipticLine',
    name: 'Hide ecliptic line',
    synchronization: true
  },
  {
    documentation: 'Hides the equatorial line',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.HideEquatorialLine',
    name: 'Hide equatorial line',
    synchronization: true
  },
  {
    documentation: 'Hides the galactic band',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.HideGalacticBand',
    name: 'Hide galactic band',
    synchronization: true
  },
  {
    documentation: 'Hides the line for the local meridian',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.HideMeridian',
    name: 'Hide local meridian',
    synchronization: true
  },
  {
    documentation: 'Hides the dot for the local zenith',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.HideZenith',
    name: 'Hide local zenith',
    synchronization: true
  },
  {
    documentation: 'Hides night sky versions of the planets',
    guiPath: '/Night Sky/Planets',
    identifier: 'os.nightsky.HideNightSkyPlanets',
    name: 'Hide night sky planets',
    synchronization: true
  },
  {
    documentation: 'Fade down all planet and moon trails in the Scene',
    guiPath: '/Trails',
    identifier: 'os.planetsmoons.FadeDownTrails',
    name: 'Hide planet and moon trails',
    synchronization: true
  },
  {
    documentation: 'Fades down zodiac art work',
    guiPath: '/Constellations/Art',
    identifier: 'os.constellation_art.HideZodiacArt',
    name: 'Hide zodiac',
    synchronization: true
  },
  {
    documentation: 'Levels the view to the horizon.',
    guiPath: '/Night Sky/View',
    identifier: 'os.nightsky.LevelHorizonPitch',
    name: 'Level Horizon Pitch',
    synchronization: true
  },
  {
    documentation: 'Levels the horizon horizontally.',
    guiPath: '/Night Sky/View',
    identifier: 'os.nightsky.LevelHorizonYaw',
    name: 'Level Horizon Yaw',
    synchronization: true
  },
  {
    documentation: 'Sets the view to be looking at the zenith',
    guiPath: '/Night Sky/View',
    identifier: 'os.nightsky.LookUp',
    name: 'Look up',
    synchronization: true
  },
  {
    documentation: 'Sets the view for a horizon looking North.',
    guiPath: '/Night Sky/View',
    identifier: 'os.nightsky.LookingNorth',
    name: 'Looking North',
    synchronization: true
  },
  {
    documentation: 'Sets the view for a horizon looking South.',
    guiPath: '/Night Sky/View',
    identifier: 'os.nightsky.LookingSouth',
    name: 'Looking South',
    synchronization: true
  },
  {
    documentation: 'Enables global illumination forMars',
    guiPath: '/Solar System/Mars',
    identifier: 'os.mars_global_illumination',
    name: 'Mars global illumination',
    synchronization: true
  },
  {
    documentation: 'Enables standard illumination forMars',
    guiPath: '/Solar System/Mars',
    identifier: 'os.mars_standard_illumination',
    name: 'Mars standard illumination',
    synchronization: true
  },
  {
    documentation:
      'Immediately set the simulation speed to the next simulation time step,\n    if one exists',
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.NextDeltaStepImmediate',
    name: 'Next simulation time step (immediate)',
    synchronization: false
  },
  {
    documentation:
      'Smoothly interpolates the simulation speed to the next simulation time\n    step, if one exists',
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.NextDeltaStepInterpolate',
    name: 'Next simulation time step (interpolate)',
    synchronization: false
  },
  {
    documentation:
      'Immediately set the simulation speed to the previous simulation time\n    step, if one exists',
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.PreviousDeltaStepImmediate',
    name: 'Previous simulation time step (immediate)',
    synchronization: false
  },
  {
    documentation:
      'Smoothly interpolates the simulation speed to the previous simulation\n      time step, if one exists',
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.PreviousDeltaStepInterpolate',
    name: 'Previous simulation time step (interpolate)',
    synchronization: false
  },
  {
    documentation: 'Reloads the GUI',
    guiPath: '/System/GUI',
    identifier: 'os.ReloadGui',
    name: 'Reload GUI',
    synchronization: false
  },
  {
    documentation: 'Immediately set the simulation speed to match real-time speed',
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.RealTimeDeltaStepImmediate',
    name: 'Reset the simulation time to realtime (immediate)',
    synchronization: false
  },
  {
    documentation: 'Smoothly interpolate the simulation speed to match real-time speed',
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.RealTimeDeltaStepInterpolate',
    name: 'Reset the simulation time to realtime (interpolate)',
    synchronization: false
  },
  {
    documentation: 'Enables global illumination forSaturn',
    guiPath: '/Solar System/Saturn',
    identifier: 'os.saturn_global_illumination',
    name: 'Saturn global illumination',
    synchronization: true
  },
  {
    documentation: 'Enables standard illumination forSaturn',
    guiPath: '/Solar System/Saturn',
    identifier: 'os.saturn_standard_illumination',
    name: 'Saturn standard illumination',
    synchronization: true
  },
  {
    documentation:
      'Adds a light pollution sphere and lowers the level of the stars by 0.1',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.SetLightPollutionLevel1',
    name: 'Set light pollution level 1',
    synchronization: true
  },
  {
    documentation:
      'Adds a light pollution sphere and lowers the level of the stars by 0.2',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.SetLightPollutionLevel2',
    name: 'Set light pollution level 2',
    synchronization: true
  },
  {
    documentation:
      'Adds a light pollution sphere and lowers the level of the stars by 0.3',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.SetLightPollutionLevel3',
    name: 'Set light pollution level 3',
    synchronization: true
  },
  {
    documentation:
      'Adds a light pollution sphere and lowers the level of the stars by 0.4',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.SetLightPollutionLevel4',
    name: 'Set light pollution level 4',
    synchronization: true
  },
  {
    documentation:
      'Adds a light pollution sphere and lowers the level of the stars by 0.5',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.SetLightPollutionLevel5',
    name: 'Set light pollution level 5',
    synchronization: true
  },
  {
    documentation:
      'Adds a light pollution sphere and lowers the level of the stars by 0.6',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.SetLightPollutionLevel6',
    name: 'Set light pollution level 6',
    synchronization: true
  },
  {
    documentation:
      'Adds a light pollution sphere and lowers the level of the stars by 0.7',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.SetLightPollutionLevel7',
    name: 'Set light pollution level 7',
    synchronization: true
  },
  {
    documentation:
      'Adds a light pollution sphere and lowers the level of the stars by 0.8',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.SetLightPollutionLevel8',
    name: 'Set light pollution level 8',
    synchronization: true
  },
  {
    documentation:
      'Adds a light pollution sphere and lowers the level of the stars by 0.9',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.SetLightPollutionLevel9',
    name: 'Set light pollution level 9',
    synchronization: true
  },
  {
    documentation: "Smoothly interpolate the current in-game time to the 'now' time",
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.DateToNowImmediate',
    name: 'Set the in-game time to now (immediate)',
    synchronization: false
  },
  {
    documentation: "Immediately set the current in-game time to the 'now' time",
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.DateToNowInterpolate',
    name: 'Set the in-game time to now (interpolate)',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -1 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-1',
    name: 'Set: -1',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -1209600 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-1209600',
    name: 'Set: -1209600',
    synchronization: false
  },
  {
    documentation:
      'Setting the simulation speed to -15552000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-15552000',
    name: 'Set: -15552000',
    synchronization: false
  },
  {
    documentation:
      'Setting the simulation speed to -157680000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-157680000',
    name: 'Set: -157680000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -1800 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-1800',
    name: 'Set: -1800',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -2592000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-2592000',
    name: 'Set: -2592000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -30 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-30',
    name: 'Set: -30',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -300 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-300',
    name: 'Set: -300',
    synchronization: false
  },
  {
    documentation:
      'Setting the simulation speed to -31536000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-31536000',
    name: 'Set: -31536000',
    synchronization: false
  },
  {
    documentation:
      'Setting the simulation speed to -315360000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-315360000',
    name: 'Set: -315360000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -3600 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-3600',
    name: 'Set: -3600',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -43200 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-43200',
    name: 'Set: -43200',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -5 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-5',
    name: 'Set: -5',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -5184000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-5184000',
    name: 'Set: -5184000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -60 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-60',
    name: 'Set: -60',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -604800 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-604800',
    name: 'Set: -604800',
    synchronization: false
  },
  {
    documentation:
      'Setting the simulation speed to -63072000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-63072000',
    name: 'Set: -63072000',
    synchronization: false
  },
  {
    documentation:
      'Setting the simulation speed to -630720000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-630720000',
    name: 'Set: -630720000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -7776000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-7776000',
    name: 'Set: -7776000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to -86400 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.-86400',
    name: 'Set: -86400',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 1 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.1',
    name: 'Set: 1',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 1209600 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.1209600',
    name: 'Set: 1209600',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 15552000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.15552000',
    name: 'Set: 15552000',
    synchronization: false
  },
  {
    documentation:
      'Setting the simulation speed to 157680000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.157680000',
    name: 'Set: 157680000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 1800 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.1800',
    name: 'Set: 1800',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 2592000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.2592000',
    name: 'Set: 2592000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 30 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.30',
    name: 'Set: 30',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 300 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.300',
    name: 'Set: 300',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 31536000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.31536000',
    name: 'Set: 31536000',
    synchronization: false
  },
  {
    documentation:
      'Setting the simulation speed to 315360000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.315360000',
    name: 'Set: 315360000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 3600 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.3600',
    name: 'Set: 3600',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 43200 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.43200',
    name: 'Set: 43200',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 5 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.5',
    name: 'Set: 5',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 5184000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.5184000',
    name: 'Set: 5184000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 60 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.60',
    name: 'Set: 60',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 604800 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.604800',
    name: 'Set: 604800',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 63072000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.63072000',
    name: 'Set: 63072000',
    synchronization: false
  },
  {
    documentation:
      'Setting the simulation speed to 630720000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.630720000',
    name: 'Set: 630720000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 7776000 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.7776000',
    name: 'Set: 7776000',
    synchronization: false
  },
  {
    documentation: 'Setting the simulation speed to 86400 seconds per realtime second',
    guiPath: '/Time/Simulation Speed/Steps',
    identifier: 'core.time.delta_time.86400',
    name: 'Set: 86400',
    synchronization: false
  },
  {
    documentation: 'Shows a local Altitude/Azimuth grid centered around your position',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.ShowAltaz',
    name: 'Show Alt/Az grid',
    synchronization: true
  },
  {
    documentation: 'Enables and fades up constellation art work',
    guiPath: '/Constellations/Art',
    identifier: 'os.constellation_art.ShowArt',
    name: 'Show all',
    synchronization: true
  },
  {
    documentation: 'Shows all the constellations lines',
    guiPath: '/Constellations/Lines',
    identifier: 'os.constellations.ShowConstellations',
    name: 'Show all',
    synchronization: true
  },
  {
    documentation: 'Fade up all enabled trails in the Scene',
    guiPath: '/Trails',
    identifier: 'os.FadeUpTrails',
    name: 'Show all trails',
    synchronization: true
  },
  {
    documentation: 'Shows the cardinal direction sphere with letters only',
    guiPath: '/Night Sky/Directions',
    identifier: 'os.nightsky.ShowNeswLetters',
    name: 'Show cardinal directions (letters only)',
    synchronization: true
  },
  {
    documentation: 'Shows the cardinal direction sphere with small letters only',
    guiPath: '/Night Sky/Directions',
    identifier: 'os.nightsky.ShowNeswLettersSmall',
    name: 'Show cardinal directions (small letters only)',
    synchronization: true
  },
  {
    documentation:
      'Shows the cardinal direction sphere with small letters and a circle with tick marks',
    guiPath: '/Night Sky/Directions',
    identifier: 'os.nightsky.ShowNeswBandSmall',
    name: 'Show cardinal directions (small with lines)',
    synchronization: true
  },
  {
    documentation:
      'Shows the cardinal direction sphere with letters and a circle with tick marks',
    guiPath: '/Night Sky/Directions',
    identifier: 'os.nightsky.ShowNeswBand',
    name: 'Show cardinal directions (with lines)',
    synchronization: true
  },
  {
    documentation: 'Shows the ecliptic band',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.ShowEclipticBand',
    name: 'Show ecliptic band',
    synchronization: true
  },
  {
    documentation: 'Shows the ecliptic line',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.ShowEclipticLine',
    name: 'Show ecliptic line',
    synchronization: true
  },
  {
    documentation: 'Shows the equatorial line',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.ShowEquatorialLine',
    name: 'Show equatorial line',
    synchronization: true
  },
  {
    documentation: 'Shows the galactic band',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.ShowGalacticBand',
    name: 'Show galactic band',
    synchronization: true
  },
  {
    documentation: 'Shows a line for the local meridian',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.ShowMeridian',
    name: 'Show local meridian',
    synchronization: true
  },
  {
    documentation: 'Shows a dot for the local zenith',
    guiPath: '/Night Sky/Lines and Grids/Show and Hide',
    identifier: 'os.nightsky.ShowZenith',
    name: 'Show local zenith',
    synchronization: true
  },
  {
    documentation: 'Shows or hides the native UI',
    guiPath: '/System/GUI',
    identifier: 'os.ToggleNativeUi',
    name: 'Show native GUI',
    synchronization: false
  },
  {
    documentation:
      'Show night sky versions of the planets (Note: Increases the scale of the Moon)',
    guiPath: '/Night Sky/Planets',
    identifier: 'os.nightsky.ShowNightSkyPlanets',
    name: 'Show night sky planets',
    synchronization: true
  },
  {
    documentation: 'Fade up all planet and moon trails in the Scene',
    guiPath: '/Trails',
    identifier: 'os.planetsmoons.FadeUpTrails',
    name: 'Show planet and moon trails',
    synchronization: true
  },
  {
    documentation: 'Enables and fades up zodiac art work',
    guiPath: '/Constellations/Art',
    identifier: 'os.constellation_art.ShowZodiacArt',
    name: 'Show zodiac',
    synchronization: true
  },
  {
    documentation: 'Shows the zodiac constellations lines',
    guiPath: '/Constellations/Lines',
    identifier: 'os.constellation.ShowZodiacs',
    name: 'Show zodiac',
    synchronization: true
  },
  {
    documentation:
      'Saves the contents of the screen to a file in the ${SCREENSHOTS}\n    directory',
    guiPath: '/System/Rendering',
    identifier: 'os.TakeScreenshot',
    name: 'Take screenshot',
    synchronization: false
  },
  {
    documentation: 'Enables global illumination forTitan',
    guiPath: '/Solar System/Titan',
    identifier: 'os.titan_global_illumination',
    name: 'Titan global illumination',
    synchronization: true
  },
  {
    documentation: 'Enables standard illumination forTitan',
    guiPath: '/Solar System/Titan',
    identifier: 'os.titan_standard_illumination',
    name: 'Titan standard illumination',
    synchronization: true
  },
  {
    documentation:
      'Toggles the local Altitude/Azimuth grid centered around your position',
    guiPath: '/Night Sky/Lines and Grids',
    identifier: 'os.nightsky.ToggleAltaz',
    name: 'Toggle Alt/Az grid',
    synchronization: true
  },
  {
    documentation: 'Toggles the shading of the Moon',
    guiPath: '/Solar System/Earth/Moon',
    identifier: 'os.earth.ToggleMoonShading',
    name: 'Toggle Moon shading',
    synchronization: true
  },
  {
    documentation:
      'Toggles the visibility of the Sun glare and the Sun globe when the\n    camera is approaching either so that from far away the Sun Glare is rendered and when\n    close up, the globe is rendered instead',
    guiPath: '/Solar System/Sun',
    identifier: 'os.ToggleSun',
    name: 'Toggle Sun',
    synchronization: true
  },
  {
    documentation: 'Toggle fade for all trails in the Scene',
    guiPath: '/Trails',
    identifier: 'os.ToggleTrails',
    name: 'Toggle all trails',
    synchronization: true
  },
  {
    documentation: 'Toggle fade instantly for all trails in the Scene',
    guiPath: '/Trails',
    identifier: 'os.ToggleTrailsInstant',
    name: 'Toggle all trails instantly',
    synchronization: true
  },
  {
    documentation: 'Toggles the dashboard and overlays',
    guiPath: '/System/GUI',
    identifier: 'os.ToggleOverlays',
    name: 'Toggle dashboard and overlays',
    synchronization: false
  },
  {
    documentation: 'Toggles the ecliptic band visibilty',
    guiPath: '/Night Sky/Lines and Grids',
    identifier: 'os.nightsky.ToggleEclipticBand',
    name: 'Toggle ecliptic band',
    synchronization: true
  },
  {
    documentation: 'Toggles the ecliptic line visibilty',
    guiPath: '/Night Sky/Lines and Grids',
    identifier: 'os.nightsky.ToggleEclipticLine',
    name: 'Toggle ecliptic line',
    synchronization: true
  },
  {
    documentation: 'Toggles the equatorial line visibilty',
    guiPath: '/Night Sky/Lines and Grids',
    identifier: 'os.nightsky.ToggleEquatorialLine',
    name: 'Toggle equatorial line',
    synchronization: true
  },
  {
    documentation: 'Toggles the line for the local meridian',
    guiPath: '/Night Sky/Lines and Grids',
    identifier: 'os.nightsky.ToggleMeridian',
    name: 'Toggle local meridian',
    synchronization: true
  },
  {
    documentation: 'Toggles the dot for the local zenith',
    guiPath: '/Night Sky/Lines and Grids',
    identifier: 'os.nightsky.ToggleZenith',
    name: 'Toggle local zenith',
    synchronization: true
  },
  {
    documentation: 'Toggles the main GUI',
    guiPath: '/System/GUI',
    identifier: 'os.ToggleMainGui',
    name: 'Toggle main GUI',
    synchronization: false
  },
  {
    documentation: 'Toggle on/off minor moon trails for all planets in the solar system',
    guiPath: '/Trails',
    identifier: 'os.ToggleMinorMoonTrails',
    name: 'Toggle minor moon trails',
    synchronization: true
  },
  {
    documentation:
      'Toggles visibility of the night sky versions of the planets (Note: Increases the scale of the Moon)',
    guiPath: '/Night Sky/Planets',
    identifier: 'os.nightsky.ToggleNightSkyPlanets',
    name: 'Toggle night sky planets',
    synchronization: true
  },
  {
    documentation: 'Immediately starts and stops the simulation time',
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.TogglePauseImmediate',
    name: 'Toggle pause (immediate)',
    synchronization: false
  },
  {
    documentation: 'Smoothly starts and stops the simulation time',
    guiPath: '/Time/Simulation Speed',
    identifier: 'os.TogglePauseInterpolated',
    name: 'Toggle pause (interpolate)',
    synchronization: false
  },
  {
    documentation: 'Toggle fade for planet and moon trails in the Scene',
    guiPath: '/Trails',
    identifier: 'os.planetsmoons.ToggleTrails',
    name: 'Toggle planet and moon trails',
    synchronization: true
  },
  {
    documentation: 'Turns on visibility for all solar system labels',
    guiPath: '/Solar System',
    identifier: 'os_default.TogglePlanetLabels',
    name: 'Toggle planet labels',
    synchronization: true
  },
  {
    documentation: 'Toggles the rendering on master',
    guiPath: '/System/Rendering',
    identifier: 'os.ToggleMasterRendering',
    name: 'Toggle rendering on master',
    synchronization: false
  },
  {
    documentation:
      'Toggles the roll friction of the camera. If it is disabled, the camera\n    rolls around its own axis indefinitely',
    guiPath: '/Navigation',
    identifier: 'os.ToggleRollFriction',
    name: 'Toggle roll friction',
    synchronization: false
  },
  {
    documentation:
      'Toggles the rotational friction of the camera. If it is disabled, the\n    camera rotates around the focus object indefinitely',
    guiPath: '/Navigation',
    identifier: 'os.ToggleRotationFriction',
    name: 'Toggle rotation friction',
    synchronization: false
  },
  {
    documentation: 'Toggle trails on or off for satellites around Earth',
    guiPath: '/Solar System/Earth',
    identifier: 'os.solarsystem.ToggleSatelliteTrails',
    name: 'Toggle satellite trails',
    synchronization: true
  },
  {
    documentation:
      '    Toggles the shutdown that will stop OpenSpace after a grace period. Press again to\n    cancel the shutdown during this period',
    guiPath: '/System',
    identifier: 'os.ToggleShutdown',
    name: 'Toggle shutdown',
    synchronization: false
  },
  {
    documentation:
      'Toggles the zoom friction of the camera. If it is disabled, the camera\n    rises up from or closes in towards the focus object indefinitely',
    guiPath: '/Navigation',
    identifier: 'os.ToggleZoomFriction',
    name: 'Toggle zoom friction',
    synchronization: false
  },
  {
    documentation: "Turn OFF Uranus's major moons and their trails",
    guiPath: '/Solar System/Uranus',
    identifier: 'os.solarsystem.UranusMajorMoonsOff',
    name: 'Turn OFF majors moon and trails',
    synchronization: true
  },
  {
    documentation: "Turn OFF Jupiter's major moons and their trails",
    guiPath: '/Solar System/Jupiter',
    identifier: 'os.solarsystem.JupiterMajorMoonsOff',
    name: 'Turn OFF majors moon and trails',
    synchronization: true
  },
  {
    documentation: "Turn OFF Saturn's major moons and their trails",
    guiPath: '/Solar System/Saturn',
    identifier: 'os.solarsystem.SaturnMajorMoonsOff',
    name: 'Turn OFF majors moon and trails',
    synchronization: true
  },
  {
    documentation: "Turn ON Uranus's major moons and their trails",
    guiPath: '/Solar System/Uranus',
    identifier: 'os.solarsystem.UranusMajorMoonsOn',
    name: 'Turn ON major moons and trails',
    synchronization: true
  },
  {
    documentation: "Turn ON Jupiter's major moons and their trails",
    guiPath: '/Solar System/Jupiter',
    identifier: 'os.solarsystem.JupiterMajorMoonsOn',
    name: 'Turn ON major moons and trails',
    synchronization: true
  },
  {
    documentation: "Turn ON Saturn's major moons and their trails",
    guiPath: '/Solar System/Saturn',
    identifier: 'os.solarsystem.SaturnMajorMoonsOn',
    name: 'Turn ON major moons and trails',
    synchronization: true
  },
  {
    documentation: "Turn OFF Neptune's major moons and their trails",
    guiPath: '/Solar System/Neptune',
    identifier: 'os.solarsystem.NeptuneMajorMoonsOff',
    name: 'Turn off majors moon and trails',
    synchronization: true
  },
  {
    documentation:
      'Turn OFF minor moons and their trails for all planets in the solar system',
    guiPath: '/Solar System/Minor Moons',
    identifier: 'os.MinorMoonsOff',
    name: 'Turn off minor moons and trails',
    synchronization: true
  },
  {
    documentation: "Turn ON Neptune's major moons and their trails",
    guiPath: '/Solar System/Neptune',
    identifier: 'os.solarsystem.NeptuneMajorMoonsOn',
    name: 'Turn on major moons and trails',
    synchronization: true
  },
  {
    documentation:
      'Turn ON minor moons and their trails for all planets in the solar system',
    guiPath: '/Solar System/Minor Moons',
    identifier: 'os.MinorMoonsOn',
    name: 'Turn on minor moons and trails',
    synchronization: true
  },
  {
    documentation:
      "Sets the 'Fade' value of all renderables to 1. This internal values\n    is managed by events",
    guiPath: '/System/Rendering',
    identifier: 'os.UndoEventFade',
    name: 'Undo all event fading',
    synchronization: true
  },
  {
    documentation: 'Hides the light pollution sphere and resets the stars',
    guiPath: '/Night Sky/Light Pollution',
    identifier: 'os.nightsky.UndoLightPollution',
    name: 'Undo light pollution',
    synchronization: true
  },
  {
    documentation: 'Enables global illumination forVenus',
    guiPath: '/Solar System/Venus',
    identifier: 'os.venus_global_illumination',
    name: 'Venus global illumination',
    synchronization: true
  },
  {
    documentation: 'Enables standard illumination forVenus',
    guiPath: '/Solar System/Venus',
    identifier: 'os.venus_standard_illumination',
    name: 'Venus standard illumination',
    synchronization: true
  }
];
