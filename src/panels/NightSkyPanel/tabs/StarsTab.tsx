import { useTranslation } from 'react-i18next';
import { Alert, Button, Divider, Group, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { useProperty } from '@/hooks/properties';

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function StarsTab() {
  const { t } = useTranslation('panel-nightsky', { keyPrefix: 'stars' });

  const luaApi = useOpenSpaceApi();

  const [starsDimInAtm, setStarsDimInAtm] = useProperty(
    'BoolProperty',
    'Scene.Stars.Renderable.DimInAtmosphere'
  );

  if (!luaApi) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <Group mb={'sm'}>
        <Title order={2}>{t('visibility.title')}</Title>
        <Group>
          <PropertyOwnerVisibilityCheckbox
            uri={'Scene.Stars.Renderable'}
            label={t('visibility.input.show-stars')}
          />
          <BoolInput
            label={t('visibility.input.show-during-day.label')}
            info={t('visibility.input.show-during-day.tooltip')}
            value={!starsDimInAtm || false}
            onChange={() => setStarsDimInAtm(!starsDimInAtm)}
          />
        </Group>
      </Group>
      <Group>
        <Title order={2}>{t('labels.title')}</Title>
        <Group>
          <PropertyOwnerVisibilityCheckbox
            uri={'Scene.StarsLabels.Renderable'}
            label={t('labels.input.show-labels')}
          />
          <PropertyOwnerVisibilityCheckbox
            uri={'Scene.StarLabelsAlternate.Renderable'}
            label={t('labels.input.show-alternate-labels')}
          />
        </Group>
      </Group>
      <Divider my={'md'} />
      <Group>
        <Title order={2}>{t('appearance.title')}</Title>
        <Alert title={t('appearance.warning.title')}>
          {t('appearance.warning.description')}
        </Alert>
        <Button onClick={() => luaApi.action.triggerAction('os.nightsky.DefaultStars')}>
          {t('appearance.buttons.default-settings')}
        </Button>
        <Button onClick={() => luaApi.action.triggerAction('os.nightsky.PointlikeStars')}>
          {t('appearance.buttons.point-like-stars')}
        </Button>
      </Group>
    </>
  );
}
