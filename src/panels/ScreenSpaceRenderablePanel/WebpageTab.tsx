import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, TextInput } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { AddBrowserIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Identifier } from '@/types/types';

interface ScreenSpaceBrowser {
  Identifier: Identifier;
  Name: string;
  Type: 'ScreenSpaceBrowser';
  Url: string;
}

export function WebpageTab() {
  const [slideName, setSlideName] = useState('');
  const [slideURL, setSlideURL] = useState('');
  const luaApi = useOpenSpaceApi();
  const { t } = useTranslation('panel-screenspacerenderable');

  const isAddButtonDisabled = !slideName || !slideURL;

  async function addSlide() {
    const osIdentifier = (await luaApi?.makeIdentifier(slideName)) ?? slideName;

    const renderable: ScreenSpaceBrowser = {
      Identifier: osIdentifier,
      Name: slideName,
      Type: 'ScreenSpaceBrowser',
      Url: slideURL
    };

    luaApi?.addScreenSpaceRenderable(renderable);
    setSlideName('');
    setSlideURL('');
  }

  return (
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
        placeholder={t('website-input.placeholder')}
        label={t('website-input.title')}
      />
      <Button
        onClick={addSlide}
        leftSection={<AddBrowserIcon size={IconSize.sm} />}
        disabled={isAddButtonDisabled}
      >
        {t('website-input.button-label')}
      </Button>
    </Group>
  );
}
