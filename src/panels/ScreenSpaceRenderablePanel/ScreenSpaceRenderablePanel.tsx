import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  Text,
  TextInput
} from '@mantine/core';

import { useGetPropertyOwner, useOpenSpaceApi } from '@/api/hooks';
import { PropertyOwner } from '@/components/PropertyOwner/PropertyOwner';
import { AddPhotoIcon, MinusIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { stringToOpenSpaceIdentifier } from '@/util/functions';
import { ScreenSpaceKey } from '@/util/keys';

interface ScreenSpaceRenderable {
  Identifier: string;
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
  const isButtonDisable = !slideName || !slideURL;

  function addSlide() {
    const renderable: ScreenSpaceRenderable = {
      Identifier: stringToOpenSpaceIdentifier(slideName),
      Name: slideName,
      Type: 'ScreenSpaceImageLocal'
    };

    if (slideURL.indexOf('http') !== 0) {
      renderable.Type = 'ScreenSpaceImageLocal';
      renderable.TexturePath = slideURL;
    } else {
      renderable.Type = 'ScreenSpaceImageOnline';
      renderable.URL = slideURL;
    }

    luaApi?.addScreenSpaceRenderable(renderable);
  }

  function removeSlide(uri: string) {
    // We need to remove the 'ScreenSpaceKey.' part from the URI which has the format:
    // `ScreenSpaceKey.{identifier}`
    const index = uri.indexOf(ScreenSpaceKey);
    if (index === -1) {
      return;
    }
    // + 1 for the '.' following the ScreenSpaceKey
    const identifier = uri.substring(index + ScreenSpaceKey.length + 1);
    luaApi?.removeScreenSpaceRenderable(identifier);
  }

  return (
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
          disabled={isButtonDisable}
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
  );
}
