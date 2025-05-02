import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('exoplanetspanel', { keyPrefix: 'exoplanets-settings' });

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
        <Group>
          <Checkbox
            checked={showHabitableZone}
            onChange={toggleShowHabitableZone}
            onKeyDown={(event) => event.key === 'Enter' && toggleShowHabitableZone()}
            aria-label={t('show-habitable-zone.aria-label')}
            label={t('show-habitable-zone.label')}
          />
          <InfoBox>{t('show-habitable-zone.tooltip')}</InfoBox>
        </Group>
        <Group>
          <Checkbox
            checked={showOrbitUncertainty}
            onChange={toggleShowOrbitUncertainty}
            onKeyDown={(event) => event.key === 'Enter' && toggleShowOrbitUncertainty()}
            aria-label={t('show-orbit-uncertainty.aria-label')}
            label={t('show-orbit-uncertainty.label')}
          />
          <InfoBox>{t('show-orbit-uncertainty.tooltip')}</InfoBox>
        </Group>
        <Group>
          <Checkbox
            checked={show1AuRing}
            onChange={toggleShow1AuRing}
            onKeyDown={(event) => event.key === 'Enter' && toggleShow1AuRing()}
            aria-label={t('show-1-au-ring.aria-label')}
            label={t('show-1-au-ring.label')}
          />
          <InfoBox>{t('show-1-au-ring.tooltip')}</InfoBox>
        </Group>
      </Stack>
    </Collapsable>
  );
}
