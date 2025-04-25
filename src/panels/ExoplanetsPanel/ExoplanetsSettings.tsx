import { Checkbox, Group, Stack } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { InfoBox } from '@/components/InfoBox/InfoBox';
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
        <Group>
          <Checkbox
            checked={showHabitableZone}
            onChange={toggleShowHabitableZone}
            onKeyDown={(event) => event.key === 'Enter' && toggleShowHabitableZone()}
            aria-label={`Toggle Show Habitable Zone`}
            label={'Show Habitable Zone'}
          />
          <InfoBox>
            Show/Hide the habitable zone visualizations. Setting the value automatically
            updates the visibility for all added exoplanet systems.
          </InfoBox>
        </Group>
        <Group>
          <Checkbox
            checked={showOrbitUncertainty}
            onChange={toggleShowOrbitUncertainty}
            onKeyDown={(event) => event.key === 'Enter' && toggleShowOrbitUncertainty()}
            aria-label={`Toggle Show Orbit Uncertainty`}
            label={'Show Orbit Uncertainty'}
          />
          <InfoBox>
            Show/Hide disc visualization of the uncertainty of the planetary orbits.
            Setting the value automatically updates the visibility for all added exoplanet
            systems.
          </InfoBox>
        </Group>
        <Group>
          <Checkbox
            checked={show1AuRing}
            onChange={toggleShow1AuRing}
            onKeyDown={(event) => event.key === 'Enter' && toggleShow1AuRing()}
            aria-label={`Toggle Show 1 AU Size Ring`}
            label={'Show 1 AU Size Ring'}
          />
          <InfoBox>
            If true, show a ring with the radius 1 AU around the host star of each system,
            to use for size comparison. Setting the value automatically updates the
            visibility for all added exoplanet systems.
          </InfoBox>
        </Group>
      </Stack>
    </Collapsable>
  );
}
