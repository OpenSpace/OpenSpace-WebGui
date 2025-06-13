import { Trans, useTranslation } from 'react-i18next';
import { Center, Group, Kbd, List, Space, Text, Title } from '@mantine/core';

import { NavigationPanelMenuButtonContent } from '@/panels/NavigationPanel/MenuButton/NavigationPanelMenuButtonContent';

import { AltitudeMouse } from '../MouseDescriptions/AltitudeMouse';
import { Mouse } from '../MouseDescriptions/Mouse';
import { MouseWithModifier } from '../MouseDescriptions/MouseWithModifier';
import { NavigationMouse } from '../MouseDescriptions/NavigationMouse';
import { AltitudeTask } from '../Tasks/AltitudeTask';
import { ClearSkyButton } from '../Tasks/Components/ClearSkyButton';
import { CurrentAltitude } from '../Tasks/Components/CurrentAltitude';
import { CurrentFocus } from '../Tasks/Components/CurrentFocus';
import { CurrentLatLong } from '../Tasks/Components/CurrentLatLong';
import { FocusTask } from '../Tasks/FocusTask';
import { NavigationTask } from '../Tasks/NavigationTask';

import { ClickBlocker } from './ClickBlocker';

export function useNavigationSteps(): React.ReactNode[] {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'steps.navigation'
  });

  return [
    <>
      <Title>{t('intro.title')}</Title>
      <Text>{t('intro.text')}</Text>
    </>,
    <>
      <Text>{t('zoom-in.intro')}</Text>
      {/* @TODO (2025-06-11) translate altitude unit */}
      <AltitudeTask anchor={'Earth'} altitude={3500} unit={'km'} compare={'lower'} />
      <CurrentAltitude />
      <AltitudeMouse />
    </>,
    <>
      <Text>{t('go-to-greenland.intro')}</Text>
      <NavigationTask
        anchor={'Earth'}
        lat={{ value: 72, min: 55, max: 110 }}
        long={{ value: -44, min: -70, max: -20 }}
      />
      <CurrentLatLong />
      <NavigationMouse />
      <Space mt={'sm'} />
      <ClearSkyButton />
    </>,
    <>
      <Text>{t('roll-camera.intro')}:</Text>
      <List type={'ordered'} withPadding w={'100%'}>
        <List.Item>
          <Group justify={'space-between'}>
            <Text fs={'italic'} flex={1}>
              {t('roll-camera.option-scroll-wheel')}
            </Text>
            <Mouse mouseClick={'scroll'} arrowDir={'horizontal'} m={'lg'} />
          </Group>
        </List.Item>
        <List.Item>
          <Group>
            <Text flex={1} fs={'italic'}>
              {t('roll-camera.option-shift')}
            </Text>
            <MouseWithModifier
              mouseClick={'left'}
              arrowDir={'horizontal'}
              modifier={'shift'}
            />
          </Group>
        </List.Item>
      </List>
    </>,
    <>
      <Text>
        <Trans
          t={t}
          i18nKey={'look-around.intro'}
          components={{ keybind: <Kbd mx={'xs'} /> }}
        />
        :
      </Text>
      <Center>
        <MouseWithModifier
          mouseClick={'left'}
          arrowDir={'horizontal'}
          modifier={'ctrl'}
        />
      </Center>
    </>,
    <>
      <Text>{t('change-focus.intro')}</Text>
      <FocusTask anchor={'Moon'} />
      <CurrentFocus />
      <Text>{t('change-focus.task.tip')}:</Text>
      <ClickBlocker p={'xs'} withBorder>
        <NavigationPanelMenuButtonContent />
      </ClickBlocker>
    </>,
    <>
      <Text>{t('move-closer.intro')}</Text>
      {/* @TODO (2025-06-11) translate altitude unit */}
      <AltitudeTask anchor={'Moon'} altitude={3500} unit={'km'} compare={'lower'} />
      <CurrentFocus />
      <CurrentAltitude />
    </>,
    <>
      <Text>{t('conclusion.intro')}</Text>
      <Text>{t('conclusion.next-step')}</Text>
    </>
  ];
}
