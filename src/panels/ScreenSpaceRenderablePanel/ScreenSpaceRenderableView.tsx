import { ActionIcon, Box, Group, Tabs, Tooltip } from '@mantine/core';

import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { PropertyOwnerVisibilityCheckbox } from '@/components/PropertyOwner/VisiblityCheckbox';
import { ThreePartHeader } from '@/components/ThreePartHeader/ThreePartHeader';
import { usePropertyValue } from '@/hooks/properties';
import { usePropertyOwner, usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { OpenWindowIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Uri } from '@/types/types';
import { useWindowLayoutProvider } from '@/windowmanagement/WindowLayout/hooks';

import { ScreenSpacePlacementOwner } from './Placement/ScreenSpacePlacementOwner';
import { ScreenSpaceRenderableTypeIcon } from './TypeIcon';

interface Props {
  uri: Uri;
}

export function ScreenSpaceRenderableView({ uri }: Props) {
  // const { t } = useTranslation('panel-scene', {
  //   keyPrefix: 'scene-graph-node.node-view'
  // });

  const propertyOwner = usePropertyOwner(uri);

  // Extract some custom propertyowners
  const placementOwner = usePropertyOwner(`${uri}.Placement`);
  const styleOwner = usePropertyOwner(`${uri}.Style`);

  const type = usePropertyValue('StringProperty', `${uri}.Type`);

  const { visibility, setVisibility } = usePropertyOwnerVisibility(uri);

  const { addWindow } = useWindowLayoutProvider();

  if (!propertyOwner) {
    return <Box m={'xs'}>{/* <Text c={'dimmed'}>{t('not-found-info')}</Text> */}</Box>;
  }

  if (!placementOwner || !styleOwner) {
    throw Error(`Missing placement or style property owner for uri: ${uri}`);
  }

  function openInNewWindow() {
    addWindow(<ScreenSpaceRenderableView uri={uri} />, {
      id: 'screenspace-' + uri,
      title: propertyOwner!.name,
      position: 'right'
    });
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
              <ActionIcon aria-label={'Pop out'} size={'sm'} onClick={openInNewWindow}>
                <OpenWindowIcon size={IconSize.xs} />
              </ActionIcon>
            </Group>
          }
        />
      </Box>
      <Tabs mt={5} defaultValue={'renderable'}>
        <Tabs.List>
          <Tooltip
            label={
              'Main properties of the screenspace renderable, including the ones for the specific type.'
            }
          >
            <Tabs.Tab value={'renderable'}>Renderable</Tabs.Tab>
          </Tooltip>

          <Tooltip label={placementOwner.description}>
            <Tabs.Tab value={'placement'}>Placement</Tabs.Tab>
          </Tooltip>

          <Tooltip label={styleOwner.description}>
            <Tabs.Tab value={'style'}>Style</Tabs.Tab>
          </Tooltip>
        </Tabs.List>

        <Tabs.Panel value={'renderable'}>
          <PropertyOwner
            uri={uri}
            showOnlyChildren
            hideSubowners={['Placement', 'Style']}
          />
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
