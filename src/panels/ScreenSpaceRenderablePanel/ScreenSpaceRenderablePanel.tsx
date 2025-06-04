import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Box, Button, Divider, Group, Text, TextInput } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { usePropertyOwner } from '@/hooks/propertyOwner';
import { AddPhotoIcon, MinusIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Identifier, Uri } from '@/types/types';
import { ScreenSpaceKey } from '@/util/keys';

interface ScreenSpaceRenderable {
  Identifier: Identifier;
  Name: string;
  Type: 'ScreenSpaceImageLocal' | 'ScreenSpaceImageOnline';
  TexturePath?: string;
  URL?: string;
}

export function ScreenSpaceRenderablePanel() {
  const [slideName, setSlideName] = useState('');
  const [slideURL, setSlideURL] = useState('');
  const luaApi = useOpenSpaceApi();
  const screenSpacePropertyOwner = usePropertyOwner(ScreenSpaceKey);
  const { t } = useTranslation('panel-screenspacerenderable');

  const renderables = screenSpacePropertyOwner?.subowners ?? [];
  const isButtonDisabled = !slideName || !slideURL;

  async function addSlide() {
    const osIdentifier = (await luaApi?.makeIdentifier(slideName)) ?? slideName;

    const renderable: ScreenSpaceRenderable = {
      Identifier: osIdentifier,
      Name: slideName,
      Type: 'ScreenSpaceImageLocal'
    };

    const isHttpSlide = slideURL.indexOf('http') === 0;
    if (isHttpSlide) {
      renderable.Type = 'ScreenSpaceImageOnline';
      renderable.URL = slideURL;
    } else {
      renderable.Type = 'ScreenSpaceImageLocal';
      renderable.TexturePath = slideURL;
    }

    luaApi?.addScreenSpaceRenderable(renderable);
    setSlideName('');
    setSlideURL('');
  }

  function removeSlide(uri: Uri) {
    const identifier = uri.split('.').pop();

    if (!identifier) {
      return;
    }

    luaApi?.removeScreenSpaceRenderable(identifier);
  }

  return (
    <>
      <Group gap={'xs'} grow preventGrowOverflow={false} align={'end'}>
        <TextInput
          value={slideName}
          onChange={(event) => setSlideName(event.currentTarget.value)}
          placeholder={t('display-name-input.placeholder')}
          label={t('display-name-input.title')}
        />
        <TextInput
          value={slideURL}
          onChange={(event) => setSlideURL(event.currentTarget.value)}
          placeholder={t('slide-path-input.placeholder')}
          label={t('slide-path-input.title')}
        />
        <Button
          onClick={addSlide}
          leftSection={<AddPhotoIcon size={IconSize.sm} />}
          disabled={isButtonDisabled}
        >
          {t('slide-path-input.button-label')}
        </Button>
      </Group>
      <Divider my={'xs'} />
      {renderables.length === 0 ? (
        <Text>{t('added-slides.empty-slides')}</Text>
      ) : (
        renderables.map((uri) => (
          <Group
            key={uri}
            gap={'xs'}
            my={'xs'}
            justify={'space-between'}
            wrap={'nowrap'}
            align={'top'}
          >
            <Box flex={1}>
              <PropertyOwner uri={uri} />
            </Box>
            <ActionIcon
              onClick={() => removeSlide(uri)}
              color={'red'}
              variant={'outline'}
              aria-label={`${t('added-slides.remove-slide-aria-label')}: ${uri})`}
            >
              <MinusIcon />
            </ActionIcon>
          </Group>
        ))
      )}
    </>
  );
}
