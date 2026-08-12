import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Group, Modal, Stack, Tabs, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { MaybeTooltip } from '@/components/MaybeTooltip/MaybeTooltip';
import {
  AddPhotoIcon,
  InsertPhotoIcon,
  OpenInBrowserIcon,
  PlusIcon,
  WebIcon
} from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { useAddScreenSpaceRenderable } from './hooks';

export function AddModal() {
  const { t } = useTranslation('panel-screenspacerenderable', { keyPrefix: 'add-modal' });

  const [slideName, setSlideName] = useState('');
  const [slideUrl, setSlideUrl] = useState('');
  const [activeTab, setActiveTab] = useState<string>('images');

  const [opened, { open, close }] = useDisclosure(false);

  const { addImage, addWebpage } = useAddScreenSpaceRenderable();

  const isAddButtonDisabled = !slideName || !slideUrl;

  function onTabChange(value: string | null) {
    if (value) {
      setActiveTab(value);
      setSlideUrl('');
    }
  }

  function onAdd() {
    switch (activeTab) {
      case 'images':
        addImage(slideName, slideUrl);
        break;
      case 'web':
        addWebpage(slideName, slideUrl);
        break;
      default:
        throw new Error(`Unknown tab value: ${activeTab}`);
    }
    onClose();
  }

  function onClose() {
    setSlideName('');
    setSlideUrl('');
    close();
  }

  return (
    <>
      <Button leftSection={<AddPhotoIcon />} onClick={open} size={'xs'}>
        {t('button-label')}
      </Button>

      <Modal
        opened={opened}
        onClose={onClose}
        title={
          <Group gap={'xs'} align={'center'}>
            <AddPhotoIcon size={IconSize.sm} /> {t('title')}
          </Group>
        }
        centered
      >
        <Stack gap={'xs'}>
          <TextInput
            value={slideName}
            onChange={(event) => setSlideName(event.currentTarget.value)}
            placeholder={t('name-input.placeholder')}
            label={t('name-input.title')}
            required
          />
          <Tabs value={activeTab} onChange={onTabChange} flex={1}>
            <Tabs.List>
              <Tabs.Tab value={'images'} leftSection={<InsertPhotoIcon />}>
                {t('image.tab-title')}
              </Tabs.Tab>
              <Tabs.Tab value={'web'} leftSection={<WebIcon />}>
                {t('website.tab-title')}
              </Tabs.Tab>
            </Tabs.List>
            <Box>
              <Tabs.Panel value={'images'}>
                <TextInput
                  value={slideUrl}
                  onChange={(event) => setSlideUrl(event.currentTarget.value)}
                  placeholder={t('image.placeholder')}
                  label={t('image.title')}
                  flex={1}
                  required
                />
              </Tabs.Panel>

              <Tabs.Panel value={'web'}>
                <Group align={'flex-end'} gap={'xs'}>
                  <TextInput
                    value={slideUrl}
                    onChange={(event) => setSlideUrl(event.currentTarget.value)}
                    placeholder={t('website.placeholder')}
                    label={t('website.title')}
                    flex={1}
                    required
                  />
                  <Button
                    disabled={!slideUrl}
                    leftSection={<OpenInBrowserIcon />}
                    onClick={() => window.open(slideUrl, '_blank', 'noopener,noreferrer')}
                    mt={'xs'}
                  >
                    Test link
                  </Button>
                </Group>
              </Tabs.Panel>
            </Box>
          </Tabs>
          <MaybeTooltip
            label={t('add-button.disabled-tooltip')}
            showTooltip={isAddButtonDisabled}
          >
            <Button
              leftSection={<PlusIcon />}
              variant={'filled'}
              onClick={onAdd}
              disabled={isAddButtonDisabled}
              mt={'md'}
            >
              {t('add-button.label')}
            </Button>
          </MaybeTooltip>
        </Stack>
      </Modal>
    </>
  );
}
