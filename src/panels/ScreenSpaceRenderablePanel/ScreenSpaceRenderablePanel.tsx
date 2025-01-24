import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  ScrollArea,
  Text,
  TextInput
} from '@mantine/core';

import { useGetPropertyOwner, useOpenSpaceApi } from '@/api/hooks';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
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
  const screenSpacePropertyOwner = useGetPropertyOwner(ScreenSpaceKey);

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
    <ScrollArea h={'100%'}>
      <Container my={'xs'}>
        <Group gap={'xs'} grow preventGrowOverflow={false} align={'end'}>
          <TextInput
            value={slideName}
            onChange={(event) => setSlideName(event.currentTarget.value)}
            placeholder={'Slide name'}
            label={'Display name'}
          />
          <TextInput
            value={slideURL}
            onChange={(event) => setSlideURL(event.currentTarget.value)}
            placeholder={'Path / URL'}
            label={'Path or URL to slide'}
          />
          <Button
            onClick={addSlide}
            leftSection={<AddPhotoIcon size={IconSize.sm} />}
            disabled={isButtonDisabled}
          >
            Add Slide
          </Button>
        </Group>
        <Divider my={'xs'} />
        {renderables.length === 0 ? (
          <Text>No active slides</Text>
        ) : (
          renderables.map((uri) => (
            <Group key={uri} gap={'xs'} my={'xs'}>
              <ActionIcon
                onClick={() => removeSlide(uri)}
                color={'red'}
                aria-label={'Remove slide'}
              >
                <MinusIcon />
              </ActionIcon>
              <PropertyOwner uri={uri} />
            </Group>
          ))
        )}
      </Container>
    </ScrollArea>
  );
}
