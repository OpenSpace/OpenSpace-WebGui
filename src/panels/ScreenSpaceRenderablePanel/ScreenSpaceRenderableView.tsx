import { useTranslation } from 'react-i18next';
import { Box, Group, Tabs, Tooltip } from '@mantine/core';

import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { usePropertyValue } from '@/hooks/properties';
import { usePropertyOwner, usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';

import { ScreenSpacePlacementOwner } from './Placement/ScreenSpacePlacementOwner';
import { ScreenSpaceRenderableMoreMenu } from './ScreenSpaceRenderableMoreMenu';
import { ScreenSpaceRenderableTypeIcon } from './TypeIcon';

interface Props {
  uri: Uri;
}

export function ScreenSpaceRenderableView({ uri }: Props) {
  const { t } = useTranslation('panel-screenspacerenderable', {
    keyPrefix: 'renderable-view'
  });

  const propertyOwner = usePropertyOwner(uri);

  // Extract some custom propertyowners
  const placementOwner = usePropertyOwner(`${uri}.Placement`);
  const styleOwner = usePropertyOwner(`${uri}.Style`);
  const hideSubowners = ['Placement', 'Style'];

  const type = usePropertyValue('StringProperty', `${uri}.Type`);

  const { visibility, setVisibility } = usePropertyOwnerVisibility(uri);

  if (!propertyOwner) {
    return <></>;
  }

  if (!placementOwner || !styleOwner) {
    throw Error(`Missing placement or style property owner for uri: ${uri}`);
  }

  return (
    <>
      <Box>
        <ThreePartHeader
          title={propertyOwner.name}
          leftSection={
            <PropertyOwnerVisibilityCheckbox
              uri={uri}
              visibility={visibility}
              setVisibility={setVisibility}
            />
          }
          rightSection={
            <Group gap={'xs'}>
              <ScreenSpaceRenderableTypeIcon type={type} size={IconSize.sm} />
              <ScreenSpaceRenderableMoreMenu uri={uri} />
            </Group>
          }
        />
      </Box>
      <Tabs mt={5} defaultValue={'renderable'}>
        <Tabs.List>
          <Tooltip label={t('renderable-tab.tooltip')}>
            <Tabs.Tab value={'renderable'}>{t('renderable-tab.title')}</Tabs.Tab>
          </Tooltip>

          <Tooltip label={placementOwner.description}>
            <Tabs.Tab value={'placement'}>{t('placement-tab.title')}</Tabs.Tab>
          </Tooltip>

          <Tooltip label={styleOwner.description}>
            <Tabs.Tab value={'style'}>{t('style-tab.title')}</Tabs.Tab>
          </Tooltip>
        </Tabs.List>

        <Tabs.Panel value={'renderable'}>
          <PropertyOwner uri={uri} showOnlyChildren hideSubowners={hideSubowners} />
        </Tabs.Panel>

        <Tabs.Panel value={'placement'} mt={'xs'}>
          <ScreenSpacePlacementOwner uri={placementOwner.uri} />
        </Tabs.Panel>

        <Tabs.Panel value={'style'} mt={'xs'}>
          <PropertyOwner uri={styleOwner.uri} showOnlyChildren />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
