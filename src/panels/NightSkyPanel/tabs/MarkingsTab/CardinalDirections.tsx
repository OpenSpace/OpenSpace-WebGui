import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbLetterA, TbLetterASmall } from 'react-icons/tb';
import {
  Box,
  Group,
  SegmentedControl,
  Skeleton,
  Stack,
  Switch,
  Text
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { useProperty } from '@/hooks/properties';
import { CompassSmallIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { SceneGraphNodeToggle } from './SceneGraphNodeToggle';

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

  const [toggleValue, setToggle] = useState<'small' | 'large' | undefined>(undefined);

  const luaApi = useOpenSpaceApi();

  const [texture] = useProperty(
    'StringProperty',
    'Scene.CardinalDirectionSphere.Renderable.Texture'
  );

  const isEnabled = useCallback(
    (variant: keyof typeof Data): boolean => {
      if (!texture) {
        return false;
      }
      return texture.includes(Data[variant].textureCheck);
    },
    [texture]
  );

  const currentToggle = useCallback((): 'small' | 'large' | undefined => {
    if (isEnabled('small')) {
      return 'small';
    }
    if (isEnabled('large')) {
      return 'large';
    }
    return undefined;
  }, [isEnabled]);

  useEffect(() => {
    if (texture) {
      setToggle(currentToggle());
    }
  }, [texture, setToggle, currentToggle]);

  function toggleLabel(text: string, icon: React.JSX.Element) {
    return (
      <Stack gap={0} py={2} align={'center'}>
        {icon}
        <Text>{text}</Text>
      </Stack>
    );
  }

  return (
    <Skeleton visible={!texture}>
      <Group>
        <Box w={100}>
          <SceneGraphNodeToggle
            title={'Directions'}
            icon={<CompassSmallIcon size={IconSize.sm} />}
            identifier={'CardinalDirectionSphere'}
          />
        </Box>

        <SegmentedControl
          onChange={(value: string) => {
            switch (value) {
              case 'small':
                luaApi?.action.triggerAction(Data['small'].showAction);
                if (isEnabled('marks')) {
                  // The action for showing the small letters also hides the marks, so we
                  // need to show them again if they were enabled before
                  luaApi?.action.triggerAction(Data['marks'].showAction);
                }
                setToggle('small');
                break;
              case 'large':
                luaApi?.action.triggerAction(Data['large'].showAction);
                if (isEnabled('marks')) {
                  // The action for showing the large letters also hides the marks, so we
                  // need to show them again if they were enabled before
                  luaApi?.action.triggerAction(Data['marks'].showAction);
                }
                setToggle('large');
                break;
              default:
                setToggle(undefined);
                break;
            }
          }}
          value={toggleValue}
          data={[
            {
              value: 'small',
              label: toggleLabel(
                t('buttons.small'),
                <TbLetterASmall size={IconSize.sm} />
              )
            },
            {
              value: 'large',
              label: toggleLabel(t('buttons.large'), <TbLetterA size={IconSize.sm} />)
            }
          ]}
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
        />
      </Group>
    </Skeleton>
  );
}
