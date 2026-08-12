import { useTranslation } from 'react-i18next';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { handleNotificationLogging } from '@/redux/logging/loggingMiddleware';
import { NotificationLevel } from '@/types/enums';
import { Identifier } from '@/types/types';

interface ScreenSpaceRenderable {
  Identifier: Identifier;
  Name: string;
}

interface ScreenSpaceImage extends ScreenSpaceRenderable {
  Type: 'ScreenSpaceImageLocal' | 'ScreenSpaceImageOnline';
  TexturePath?: string;
  URL?: string;
}

interface ScreenSpaceBrowser extends ScreenSpaceRenderable {
  Type: 'ScreenSpaceBrowser';
  Url: string;
}

export function useAddScreenSpaceRenderable() {
  const { t } = useTranslation('panel-screenspacerenderable', { keyPrefix: 'add-modal' });

  const luaApi = useOpenSpaceApi();
  const dispatch = useAppDispatch();

  async function addImage(name: string, slideURL: string) {
    const osIdentifier = (await luaApi?.makeIdentifier(name)) ?? name;

    const renderable: ScreenSpaceImage = {
      Identifier: osIdentifier,
      Name: name,
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
            t('image.error.title'),
            t('image.error.description', { format: filetype }),
            NotificationLevel.Error
          )
        );
        return;
      }

      // Remove the remaining header information, at which point it becomes the data
      const data = url.substring(url.indexOf(',') + 1);

      // eslint-disable-next-line no-template-curly-in-string
      const tempPath = await luaApi?.absPath('${TEMPORARY}');
      const localPath = `${tempPath}/screenspace-slide-${name}.${filetype}`;
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
  }

  async function addWebpage(name: string, slideURL: string) {
    const osIdentifier = (await luaApi?.makeIdentifier(name)) ?? name;

    const renderable: ScreenSpaceBrowser = {
      Identifier: osIdentifier,
      Name: name,
      Type: 'ScreenSpaceBrowser',
      Url: slideURL
    };

    luaApi?.addScreenSpaceRenderable(renderable);
  }

  return { addImage, addWebpage };
}
