import { Trans, useTranslation } from 'react-i18next';
import { ActionIcon, Group, Text, Title } from '@mantine/core';

import { FastForwardIcon, FastRewindIcon, PauseIcon } from '@/icons/icons';
import { TimePanelMenuButtonContent } from '@/panels/TimePanel/MenuButton/TimePanelMenuButtonContent';
import { TimeIncrementInput } from '@/panels/TimePanel/TimeInput/TimeIncrementInput';
import { IconSize } from '@/types/enums';

import { AltitudeTask } from '../Tasks/AltitudeTask';
import { ChangeDeltaTimeTask } from '../Tasks/ChangeDeltaTimeTask';
import { ChangeYearTask } from '../Tasks/ChangeYearTask';
import { CurrentAltitude } from '../Tasks/Components/CurrentAltitude';
import { CurrentFocus } from '../Tasks/Components/CurrentFocus';
import { CurrentLatLong } from '../Tasks/Components/CurrentLatLong';
import { FocusTask } from '../Tasks/FocusTask';
import { NavigationTask } from '../Tasks/NavigationTask';
import { PauseTimeTask } from '../Tasks/PauseTimeTask';

import { ClickBlocker } from './ClickBlocker';

export function useTimeSteps(): React.ReactNode[] {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'steps.time'
  });

  return [
    <>
      <Title>{t('intro.title')}</Title>
      <Text>{t('intro.text')}</Text>
    </>,
    <>
      <Text>{t('view-solar-system.intro')}</Text>
      <FocusTask anchor={'Sun'} />
      {/* @TODO (2025-06-11) translate altitude unit */}
      <AltitudeTask anchor={'Sun'} altitude={1} unit={'Lighthours'} compare={'higher'} />
      <NavigationTask anchor={'Sun'} lat={{ value: 80, min: 60, max: 100 }} />
      <CurrentFocus />
      <CurrentAltitude />
      <CurrentLatLong />
    </>,
    <>
      <Text>{t('change-time.intro')}</Text>
      <ChangeYearTask />
      <Text>{t('change-time.task.tip-time-panel')}:</Text>
      <ClickBlocker p={'xs'} withBorder>
        <TimePanelMenuButtonContent />
      </ClickBlocker>
      <Group>
        <Text>{t('change-time.task.tip-year-input')}:</Text>
        <ClickBlocker>
          <TimeIncrementInput
            value={new Date().getFullYear()}
            onInputChange={() => {}}
            onInputChangeStep={() => {}}
            onInputEnter={() => {}}
            w={65}
          />
        </ClickBlocker>
      </Group>
      <Text c={'dimmed'} fs={'italic'}>
        {t('change-time.hint-reset-time')}
      </Text>
    </>,
    <>
      <Text>
        <Trans t={t} i18nKey={'change-speed.intro'} components={{ italic: <i /> }} />
      </Text>
      <ChangeDeltaTimeTask />
      <Group>
        <Text>{t('change-speed.task.tip')}:</Text>
        <ActionIcon
          size={'lg'}
          style={{ pointerEvents: 'none' }}
          aria-label={t('change-speed.task.rewind-aria-label')}
          aria-disabled
        >
          <FastRewindIcon size={IconSize.md} />
        </ActionIcon>
        <ActionIcon
          size={'lg'}
          style={{ pointerEvents: 'none' }}
          aria-label={t('change-speed.task.forward-aria-label')}
          aria-disabled
        >
          <FastForwardIcon size={IconSize.md} />
        </ActionIcon>
      </Group>
      <Text c={'dimmed'} fs={'italic'}>
        {t('change-speed.hint-reset-speed')}
      </Text>
    </>,
    <>
      <Text>{t('pause-time.intro')}</Text>
      <PauseTimeTask />
      <Text>
        <Trans
          t={t}
          i18nKey={'pause-time.task.tip'}
          components={{
            pauseButton: (
              <ActionIcon
                size={IconSize.lg}
                style={{ pointerEvents: 'none' }}
                aria-label={'Pause time'}
                aria-disabled
              >
                <PauseIcon />
              </ActionIcon>
            )
          }}
        />
      </Text>
      <Text c={'dimmed'} fs={'italic'}>
        {t('pause-time.hint-speed-not-zero')}
      </Text>
    </>,
    <>
      <Text>{t('conclusion.intro')}</Text>
      <Text>{t('conclusion.next-step')}</Text>
    </>
  ];
}
