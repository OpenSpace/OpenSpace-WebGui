import { Stack } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { BoolInput } from '@/components/Input/BoolInput';
import { useProperty } from '@/hooks/properties';

interface Props {
  hasAddedExoplanets: boolean;
}

export function ExoplanetsSettings({ hasAddedExoplanets }: Props) {
  const luaApi = useOpenSpaceApi();

  const [showHabitableZone, setShowHabitableZone] = useProperty(
    'BoolProperty',
    'Modules.Exoplanets.ShowHabitableZone'
  );
  const [showOrbitUncertainty, setShowOrbitUncertainty] = useProperty(
    'BoolProperty',
    'Modules.Exoplanets.ShowOrbitUncertainty'
  );
  const [show1AuRing, setShow1AuRing] = useProperty(
    'BoolProperty',
    'Modules.Exoplanets.ShowComparisonCircle'
  );

  const Tags = {
    UncertaintyDisc: 'exoplanet_uncertainty_disc',
    HabitableZone: 'exoplanet_habitable_zone',
    Size1AuRing: 'exoplanet_1au_ring'
  };

  function toggleShowHabitableZone() {
    const shouldShow = !showHabitableZone;
    setShowHabitableZone(shouldShow);
    // Also disable all previously enabled exoplanet habitable zones
    if (hasAddedExoplanets) {
      luaApi?.setPropertyValue(`{${Tags.HabitableZone}}.Renderable.Enabled`, shouldShow);
    }
  }

  function toggleShowOrbitUncertainty() {
    const shouldShow = !showOrbitUncertainty;
    setShowOrbitUncertainty(shouldShow);
    // Also disable all previously enabled exoplanet orbit uncertainty discs
    if (hasAddedExoplanets) {
      luaApi?.setPropertyValue(
        `{${Tags.UncertaintyDisc}}.Renderable.Enabled`,
        shouldShow
      );
    }
  }

  function toggleShow1AuRing() {
    const shouldShow = !show1AuRing;
    setShow1AuRing(shouldShow);
    // Also disable all previously enabled exoplanet orbit uncertainty discs
    if (hasAddedExoplanets) {
      luaApi?.setPropertyValue(`{${Tags.Size1AuRing}}.Renderable.Enabled`, shouldShow);
    }
  }

  return (
    <Collapsable title={'Settings'}>
      <Stack gap={'xs'}>
        <BoolInput
          label={'Show Habitable Zone'}
          value={showHabitableZone}
          setValue={toggleShowHabitableZone}
          info={`Show/Hide the habitable zone visualizations. Setting the value automatically
            updates the visibility for all added exoplanet systems.`}
        />
        <BoolInput
          label={'Show Orbit Uncertainty'}
          value={showOrbitUncertainty}
          setValue={toggleShowOrbitUncertainty}
          info={`Show/Hide disc visualization of the uncertainty of the planetary orbits.
            Setting the value automatically updates the visibility for all added exoplanet
            systems.`}
        />
        <BoolInput
          label={'1 AU Size Ring'}
          value={show1AuRing}
          setValue={toggleShow1AuRing}
          info={`If true, show a ring with the radius 1 AU around the host star of each system,
            to use for size comparison. Setting the value automatically updates the
            visibility for all added exoplanet systems.`}
        />
      </Stack>
    </Collapsable>
  );
}
