import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionIcon, Group, TextInput } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { DecoratedAddIcon } from '@/components/DecoratedIcon/DecoratedAddIcon';
import { MaybeTooltip } from '@/components/MaybeTooltip/MaybeTooltip';
import { WebIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Identifier } from '@/types/types';

interface ScreenSpaceBrowser {
  Identifier: Identifier;
  Name: string;
  Type: 'ScreenSpaceBrowser';
  Url: string;
}

export function WebpageTab() {
  const { t } = useTranslation('panel-screenspacerenderable');

  const [slideName, setSlideName] = useState('');
  const [slideURL, setSlideURL] = useState('');
  const luaApi = useOpenSpaceApi();

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
    <Group gap={'xs'} preventGrowOverflow={false} align={'end'}>
      <TextInput
        value={slideName}
        onChange={(event) => setSlideName(event.currentTarget.value)}
        placeholder={t('display-name-input.placeholder')}
        label={t('display-name-input.title')}
        flex={1}
      />
      <TextInput
        value={slideURL}
        onChange={(event) => setSlideURL(event.currentTarget.value)}
        placeholder={t('website-input.placeholder')}
        label={t('website-input.title')}
        flex={1}
      />
      <MaybeTooltip
        label={
          isAddButtonDisabled ? t('website-input.add-button-disabled-tooltip') : undefined
        }
        showTooltip={isAddButtonDisabled}
      >
        <ActionIcon
          size={'lg'}
          onClick={addSlide}
          disabled={isAddButtonDisabled}
          aria-label={t('website-input.add-button-aria-label')}
        >
          <DecoratedAddIcon size={'sm'} baseIcon={<WebIcon size={IconSize.sm} />} />
        </ActionIcon>
      </MaybeTooltip>
    </Group>
  );
}
