import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('panel-exoplanets', { keyPrefix: 'exoplanets-settings' });

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
    <Collapsable title={t('section-title')}>
      <Stack gap={'xs'}>
        <BoolInput
          label={t('show-habitable-zone.label')}
          aria-label={t('show-habitable-zone.aria-label')}
          value={showHabitableZone || false}
          onChange={toggleShowHabitableZone}
          info={t('show-habitable-zone.tooltip')}
        />
        <BoolInput
          label={t('show-orbit-uncertainty.label')}
          aria-label={t('show-orbit-uncertainty.aria-label')}
          value={showOrbitUncertainty || false}
          onChange={toggleShowOrbitUncertainty}
          info={t('show-orbit-uncertainty.tooltip')}
        />
        <BoolInput
          label={t('show-1-au-ring.label')}
          aria-label={t('show-1-au-ring.aria-label')}
          value={show1AuRing || false}
          onChange={toggleShow1AuRing}
          info={t('show-1-au-ring.tooltip')}
        />
      </Stack>
    </Collapsable>
  );
}
