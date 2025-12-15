import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Group, TextInput } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { AddPhotoIcon } from '@/icons/icons';
import { useAppDispatch } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { IconSize, LogLevel } from '@/types/enums';
import { Identifier } from '@/types/types';

interface ScreenSpaceRenderable {
  Identifier: Identifier;
  Name: string;
  Type: 'ScreenSpaceImageLocal' | 'ScreenSpaceImageOnline';
  TexturePath?: string;
  URL?: string;
}

export function ImageTab() {
  const { t } = useTranslation('panel-screenspacerenderable');

  const [slideName, setSlideName] = useState('');
  const [slideURL, setSlideURL] = useState('');
  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();

  const isButtonDisabled = !slideName || !slideURL;

  async function addSlide() {
    const osIdentifier = (await luaApi?.makeIdentifier(slideName)) ?? slideName;

    const renderable: ScreenSpaceRenderable = {
      Identifier: osIdentifier,
      Name: slideName,
      Type: 'ScreenSpaceImageLocal'
    };

    let urlOrPath = slideURL;
    if (slideURL.startsWith('data:image/')) {
      let url = slideURL;
      // Someone tried to paste a base64 encoded image. It starts with the text:
      // data:image/{png/jpeg};base,
      // followed by the rest of the image data in base64 encoding
      url = url.substring('data:image/'.length);

      const filetype = url.substring(0, url.indexOf(';'));
      if (filetype !== 'png' && filetype !== 'jpeg') {
        dispatch(
          handleNotificationLogging(
            t('error.title'),
            t('error.description', { format: filetype }),
            LogLevel.Error
          )
        );
        return;
      }

      // Remove the remaining header information, at which point it becomes the data
      const data = url.substring(url.indexOf(',') + 1);

      // eslint-disable-next-line no-template-curly-in-string
      const tempPath = await luaApi?.absPath('${TEMPORARY}');
      const localPath = `${tempPath}/screenspace-slide-${slideName}.${filetype}`;
      await luaApi?.saveBase64File(localPath, data);
      urlOrPath = localPath;
    }

    const isHttpSlide = urlOrPath.indexOf('http') === 0;
    if (isHttpSlide) {
      renderable.Type = 'ScreenSpaceImageOnline';
      renderable.URL = urlOrPath;
    } else {
      renderable.Type = 'ScreenSpaceImageLocal';
      renderable.TexturePath = urlOrPath;
    }

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
        placeholder={t('image-input.placeholder')}
        label={t('image-input.title')}
      />
      <Button
        onClick={addSlide}
        leftSection={<AddPhotoIcon size={IconSize.sm} />}
        disabled={isButtonDisabled}
      >
        {t('image-input.button-label')}
      </Button>
    </Group>
  );
}
