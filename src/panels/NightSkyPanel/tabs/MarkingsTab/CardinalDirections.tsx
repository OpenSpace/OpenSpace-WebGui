import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SegmentedControl, Skeleton, Stack, Switch, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { usePropertyOwnerVisibility } from '@/hooks/propertyOwner';
import { CompassLargeIcon, CompassSmallIcon, EyeOffIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

// @TODO (2025-05-19, emmbr) These checks, especially against the parts of the texture
// file names, are fragile agains file name changes. Consider more robust solution
const Data = {
  small: {
    showAction: 'os.nightsky.ShowNeswLettersSmall',
    hideAction: 'os.nightsky.HideNesw',
    textureCheck: 'red_small.png'
  },
  large: {
    showAction: 'os.nightsky.ShowNeswLetters',
    hideAction: 'os.nightsky.HideNesw',
    textureCheck: 'red.png'
  },
  marks: {
    showAction: 'os.nightsky.AddNeswBandMarks',
    hideAction: 'os.nightsky.RemoveNeswBandMarks',
    textureCheck: '_lines_'
  }
};

// @TODO (2025-05-19, emmbr) This component needs logic for checking if the used actions
// exist. However, for this we need to be able to access the actions state using the
// identifier of the action, so leaving for now

export function CardinalDirections() {
  const { t } = useTranslation('panel-nightsky', {
    keyPrefix: 'markings.cardinal-directions'
  });

  const [toggleValue, setToggle] = useState('none');

  const luaApi = useOpenSpaceApi();

  const { isVisible } = usePropertyOwnerVisibility(
    'Scene.CardinalDirectionSphere.Renderable'
  );
  const [texture] = useProperty(
    'StringProperty',
    'Scene.CardinalDirectionSphere.Renderable.Texture'
  );

  const hasLoaded = isVisible !== undefined && texture !== undefined;

  const isEnabled = useCallback(
    (variant: keyof typeof Data): boolean => {
      if (!isVisible || !texture) {
        return false;
      }
      return texture.includes(Data[variant].textureCheck);
    },
    [isVisible, texture]
  );

  const currentToggle = useCallback((): string => {
    if (isEnabled('small')) {
      return 'small';
    }
    if (isEnabled('large')) {
      return 'large';
    }
    return 'none';
  }, [isEnabled]);

  useEffect(() => {
    if (hasLoaded) {
      setToggle(currentToggle());
    }
  }, [isVisible, texture, setToggle, currentToggle, hasLoaded]);

  function label(text: string, icon: React.JSX.Element) {
    return (
      <Stack gap={0} align={'center'}>
        {icon}
        <Text>{text}</Text>
      </Stack>
    );
  }

  return (
    <Skeleton visible={!hasLoaded}>
      <Stack>
        <SegmentedControl
          color={'blue'}
          onChange={(value: string) => {
            switch (value) {
              case 'none':
                luaApi?.action.triggerAction(Data['small'].hideAction);
                luaApi?.action.triggerAction(Data['large'].hideAction);
                break;
              case 'small':
                luaApi?.action.triggerAction(Data['small'].showAction);
                break;
              case 'large':
                luaApi?.action.triggerAction(Data['large'].showAction);
                break;
              default:
                break;
            }
            setToggle(value);
          }}
          value={toggleValue}
          data={[
            {
              value: 'none',
              label: label(t('buttons.none'), <EyeOffIcon size={IconSize.sm} />)
            },
            {
              value: 'small',
              label: label(t('buttons.small'), <CompassSmallIcon size={IconSize.sm} />)
            },
            {
              value: 'large',
              label: label(t('buttons.large'), <CompassLargeIcon size={IconSize.sm} />)
            }
          ]}
          size={'sm'}
        />
        <Switch
          checked={isEnabled('marks')}
          onChange={(event) =>
            luaApi?.action.triggerAction(
              event.target.checked ? Data['marks'].showAction : Data['marks'].hideAction
            )
          }
          label={t('buttons.marks')}
          aria-label={t('aria-labels.marks')}
          size={'sm'}
          disabled={!hasLoaded || (!isEnabled('small') && !isEnabled('large'))}
        />
      </Stack>
    </Skeleton>
  );
}
