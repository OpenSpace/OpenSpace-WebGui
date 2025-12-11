import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Select,
  Stack,
  Text,
  Tooltip
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';

import { useOpenSpaceApi } from '@/api/hooks';
import { FilterList } from '@/components/FilterList/FilterList';
import { generateMatcherFunctionByKeys } from '@/components/FilterList/util';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { Layout } from '@/components/Layout/Layout';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
import { useProperty } from '@/hooks/properties';
import { DeleteIcon, FocusIcon, ServerIcon, VerticalDotsIcon } from '@/icons/icons';
import styles from '@/theme/global.module.css';
import { IconSize } from '@/types/enums';
import { LayerType, layerTypes } from '@/types/globeLayers';
import { NavigationAnchorKey } from '@/util/keys';
import { makeIdentifier } from '@/util/text';

import { AddServerModal } from './AddServerModal';
import { CapabilityEntry } from './CapabilityEntry';
import {
  useAddedLayers,
  useCapabilities,
  useGlobeWMSInfo,
  useRenderableGlobes
} from './hooks';
import { Capability } from './types';

export function GlobeBrowsingPanel() {
  // Default to Earth WMS
  const { t } = useTranslation('panel-globebrowsing');
  const [selectedGlobe, setSelectedGlobe] = useState<string | null>(null);
  const [selectedWMS, setSelectedWMS] = useState<string | null>(null);

  const { globeBrowsingNodes, refresh: refreshGlobeBrowsingNodes } =
    useRenderableGlobes();
  const { globeWMS, refresh: refreshWMSInfo } = useGlobeWMSInfo(selectedGlobe);
  const capabilities = useCapabilities(selectedWMS);
  const { addedLayers, refresh: refreshAddedLayers } = useAddedLayers(selectedGlobe);

  const [currentAnchor] = useProperty('StringProperty', NavigationAnchorKey);
  const [opened, { open, close }] = useDisclosure(false);
  const luaApi = useOpenSpaceApi();

  const isAnchorRenderableGlobe =
    currentAnchor !== undefined &&
    globeBrowsingNodes?.identifiers.includes(currentAnchor);

  // Select a default available WMS server for a specific globe
  useEffect(() => {
    // Don't update if the selected WMS server still exists
    if (selectedWMS !== null && globeWMS.find((info) => info.name === selectedWMS)) {
      return;
    }

    // Default select the first WMS server in the list whenever we get a new server info
    if (globeWMS.length > 0) {
      setSelectedWMS(globeWMS[0].name);
    } else {
      setSelectedWMS(null);
      refreshGlobeBrowsingNodes();
    }
  }, [globeWMS, selectedWMS, refreshGlobeBrowsingNodes]);

  // Sets default selected globe node
  useEffect(() => {
    if (!globeBrowsingNodes || selectedGlobe) {
      return;
    }
    // Set Earth as default selected if it is loaded in the scene
    const selectGlobe = globeBrowsingNodes.identifiers.includes('Earth')
      ? 'Earth'
      : globeBrowsingNodes.identifiers[0];

    setSelectedGlobe(selectGlobe);
  }, [globeBrowsingNodes, selectedGlobe]);

  async function addLayer(cap: Capability, layerType: LayerType) {
    if (!selectedGlobe) {
      return;
    }

    const layerName = makeIdentifier(cap.Name);

    await luaApi?.globebrowsing.addLayer(selectedGlobe, layerType, {
      Identifier: layerName,
      Name: cap.Name,
      FilePath: cap.URL,
      Enabled: true
    });
    refreshAddedLayers();
  }

  async function removeLayer(name: string) {
    if (!selectedGlobe) {
      return;
    }

    const layerName = makeIdentifier(name);
    for (const layerType of layerTypes) {
      if (addedLayers[layerType].includes(layerName)) {
        await luaApi?.globebrowsing.deleteLayer(selectedGlobe, layerType, layerName);
      }
    }

    refreshAddedLayers();
  }

  async function onAddServer(name: string, url: string) {
    if (!selectedGlobe) {
      return;
    }
    await luaApi?.globebrowsing.loadWMSCapabilities(name, selectedGlobe, url);
    refreshWMSInfo();
    setSelectedWMS(name);
    refreshGlobeBrowsingNodes();
    close();
  }

  function removeServerModal() {
    if (!selectedWMS) {
      return;
    }
    modals.openConfirmModal({
      title: t('remove-server-modal.title'),
      children: (
        <Text>{t('remove-server-modal.description', { serverName: selectedWMS })}</Text>
      ),
      labels: {
        confirm: t('remove-server-modal.confirm'),
        cancel: t('remove-server-modal.cancel')
      },
      onConfirm: async () => {
        await luaApi?.globebrowsing.removeWMSServer(selectedWMS);
        refreshWMSInfo();
      },
      confirmProps: { color: 'red', variant: 'filled' }
    });
  }

  if (!globeBrowsingNodes) {
    return <LoadingBlocks />;
  }

  return (
    <>
      <AddServerModal opened={opened} close={close} onAddServer={onAddServer} />
      <Layout>
        <Layout.FixedSection>
          <Stack gap={'xs'} mb={'xs'}>
            <Group gap={'xs'}>
              <Select
                value={selectedGlobe}
                data={[
                  {
                    group: '',
                    items: globeBrowsingNodes.identifiers.slice(
                      0,
                      globeBrowsingNodes.firstIndexWithoutUrl
                    )
                  },
                  {
                    group: t('select-globe.no-server-group'),
                    items: globeBrowsingNodes.identifiers.slice(
                      globeBrowsingNodes.firstIndexWithoutUrl
                    )
                  }
                ]}
                onChange={(value) => setSelectedGlobe(value)}
                allowDeselect={false}
                flex={1}
              />
              <Tooltip
                label={
                  isAnchorRenderableGlobe
                    ? t('select-globe.tooltips.valid-focus')
                    : t('select-globe.tooltips.invalid-focus')
                }
              >
                <Button
                  onClick={() => {
                    if (isAnchorRenderableGlobe) {
                      setSelectedGlobe(currentAnchor);
                    }
                  }}
                  disabled={!isAnchorRenderableGlobe}
                  leftSection={<FocusIcon size={IconSize.xs} />}
                  px={'xs'}
                >
                  {t('button-labels.from-focus')}
                </Button>
              </Tooltip>
            </Group>
            <Group gap={'xs'}>
              <Select
                value={selectedWMS}
                data={globeWMS.map((info) => info.name)}
                onChange={(value) => setSelectedWMS(value)}
                allowDeselect={false}
                flex={1}
              />
              <InfoBox>
                <Text>{t('server-info')}</Text>
                <Text className={styles.selectable} style={{ wordBreak: 'break-word' }}>
                  {globeWMS.find((info) => info.name === selectedWMS)?.url}
                </Text>
              </InfoBox>
              <Menu position={'right-start'}>
                <Menu.Target>
                  <ActionIcon>
                    <VerticalDotsIcon />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Stack gap={'xs'}>
                    <Button onClick={open} leftSection={<ServerIcon />}>
                      {t('button-labels.add-server')}
                    </Button>
                    <Button onClick={removeServerModal} leftSection={<DeleteIcon />}>
                      {t('button-labels.remove-server')}
                    </Button>
                  </Stack>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Stack>
        </Layout.FixedSection>
        <Layout.GrowingSection>
          <FilterList>
            <FilterList.InputField placeHolderSearchText={t('filter-list-placeholder')} />
            <FilterList.SearchResults
              data={capabilities}
              renderElement={(capability) => (
                <CapabilityEntry
                  capability={capability}
                  onAdd={addLayer}
                  onRemove={removeLayer}
                  addedLayers={addedLayers}
                  key={capability.URL}
                />
              )}
              matcherFunc={generateMatcherFunctionByKeys(['Name'])}
            >
              <FilterList.SearchResults.VirtualList gap={3} />
            </FilterList.SearchResults>
          </FilterList>
        </Layout.GrowingSection>
      </Layout>
    </>
  );
}
