import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Group, Modal, Stack, Switch, Tabs, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { MaybeTooltip } from '@/components/MaybeTooltip/MaybeTooltip';
import {
  AddPhotoIcon,
  InsertPhotoIcon,
  OpenInBrowserIcon,
  PlusIcon,
  TextIcon,
  VideoIcon,
  WebIcon
} from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { useAddScreenSpaceRenderable } from './hooks';

export function AddModal() {
  const { t } = useTranslation('panel-screenspacerenderable', { keyPrefix: 'add-modal' });

  const [slideName, setSlideName] = useState<string>('');
  const [slideData, setSlideData] = useState<string>('');

  // Some video-specific options
  const [shouldLoop, setShouldLoop] = useState<boolean>(true);
  const [playAudio, setPlayAudio] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<string>('images');

  const [opened, { open, close }] = useDisclosure(false);

  const { addImage, addWebpage, addVideo, addText } = useAddScreenSpaceRenderable();

  const isAddButtonDisabled = !slideName || !slideData;

  function onTabChange(value: string | null) {
    if (value) {
      setActiveTab(value);
      setSlideData('');
    }
  }

  function onAdd() {
    const removeSurroundingQuotes = (value: string) =>
      value.replace(/^(['"])(.*)\1$/, '$2');

    const sanitizedName = removeSurroundingQuotes(slideName.trim());
    const sanitizedData = removeSurroundingQuotes(slideData.trim());

    switch (activeTab) {
      case 'images':
        addImage(sanitizedName, sanitizedData);
        break;
      case 'web':
        addWebpage(sanitizedName, sanitizedData);
        break;
      case 'video':
        addVideo(sanitizedName, sanitizedData, {
          shouldLoop: shouldLoop,
          playAudio: playAudio
        });
        break;
      case 'text':
        addText(sanitizedName, sanitizedData);
        break;
      default:
        throw new Error(`Unknown tab value: ${activeTab}`);
    }
    onClose();
  }

  function onClose() {
    setSlideName('');
    setSlideData('');
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
              <Tabs.Tab value={'video'} leftSection={<VideoIcon />}>
                {t('video.tab-title')}
              </Tabs.Tab>
              <Tabs.Tab value={'text'} leftSection={<TextIcon />}>
                {t('text.tab-title')}
              </Tabs.Tab>
            </Tabs.List>
            <Box>
              <Tabs.Panel value={'images'}>
                <TextInput
                  value={slideData}
                  onChange={(event) => setSlideData(event.currentTarget.value)}
                  placeholder={t('image.placeholder')}
                  label={t('image.title')}
                  required
                />
              </Tabs.Panel>

              <Tabs.Panel value={'web'}>
                <Group align={'flex-end'} gap={'xs'}>
                  <TextInput
                    value={slideData}
                    onChange={(event) => setSlideData(event.currentTarget.value)}
                    placeholder={t('website.placeholder')}
                    label={t('website.title')}
                    flex={1}
                    required
                  />
                  <Button
                    disabled={!slideData}
                    leftSection={<OpenInBrowserIcon />}
                    onClick={() =>
                      window.open(slideData, '_blank', 'noopener,noreferrer')
                    }
                    mt={'xs'}
                  >
                    Test link
                  </Button>
                </Group>
              </Tabs.Panel>

              <Tabs.Panel value={'video'}>
                <TextInput
                  value={slideData}
                  onChange={(event) => setSlideData(event.currentTarget.value)}
                  placeholder={t('video.placeholder')}
                  label={t('video.title')}
                  required
                />
                <Group>
                  <Switch
                    label={t('video.loop.label')}
                    checked={shouldLoop}
                    onChange={(event) => setShouldLoop(event.currentTarget.checked)}
                    mt={'xs'}
                  />
                  <Switch
                    label={t('video.play-audio.label')}
                    checked={playAudio}
                    onChange={(event) => setPlayAudio(event.currentTarget.checked)}
                    mt={'xs'}
                  />
                </Group>
              </Tabs.Panel>

              <Tabs.Panel value={'text'}>
                <TextInput
                  value={slideData}
                  onChange={(event) => setSlideData(event.currentTarget.value)}
                  placeholder={t('text.placeholder')}
                  label={t('text.title')}
                  required
                />
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
