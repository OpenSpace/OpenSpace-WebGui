import { ActionIcon, Group, Text, Title } from '@mantine/core';

import { FastForwardIcon, FastRewindIcon, PauseIcon } from '@/icons/icons';
import { TimeIncrementInput } from '@/panels/TimePanel/TimeInput/TimeIncrementInput';
import { TimePanelMenuButton } from '@/panels/TimePanel/TimePanelMenuButton';
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

export const TimeSteps = [
  <>
    <Title>Time</Title>
    In this chapter we will learn how to change the time OpenSpace.
  </>,
  <>
    <Text>
      But first, let's go to a good viewing point. Let's take a look at the Solar System
      from above.
    </Text>
    <FocusTask anchor={'Sun'} />
    <AltitudeTask anchor={'Sun'} altitude={1} unit={'Lighthours'} compare={'higher'} />
    <NavigationTask anchor={'Sun'} lat={{ value: 80, min: 60, max: 100 }} />
    <CurrentFocus />
    <CurrentAltitude />
    <CurrentLatLong />
    <Text c={'dimmed'} fs={'italic'}>
      The order of magnitue is km {'<'} AU {'<'} Lighthours
    </Text>
  </>,
  <>
    <Text>You can view the past as well as the future.</Text>
    <ChangeYearTask />
    <Text>To open the Time Panel, click on the following icon in the taskbar:</Text>
    <TimePanelMenuButton onClick={() => {}} />
    <Group>
      <Text>Change the year by changing the value of the year in the time input:</Text>
      <TimeIncrementInput
        value={new Date().getFullYear()}
        onInputChange={() => {}}
        onInputChangeStep={() => {}}
        onInputEnter={() => {}}
        w={65}
      />
    </Group>
    <Text c={'dimmed'} fs={'italic'}>
      You can reset the time by pressing "Now"
    </Text>
  </>,
  <>
    <Text>
      You can also change how fast time is playing. This is known as the{' '}
      <Text fs={'italic'} span>
        simulation speed{' '}
      </Text>
      of the application, and the time increment is called the{' '}
      <Text fs={'italic'} span>
        delta time
      </Text>
      .
    </Text>
    <ChangeDeltaTimeTask />
    <Text>In the Time Panel:</Text>
    <Group>
      <Text>Click on the buttons that adjust the delta time:</Text>
      <ActionIcon size={'lg'}>
        <FastRewindIcon size={IconSize.md} />
      </ActionIcon>
      <ActionIcon size={'lg'}>
        <FastForwardIcon size={IconSize.md} />
      </ActionIcon>
    </Group>
    <Text c={'dimmed'} fs={'italic'}>
      You can reset the simulation speed by pressing "Real Time"
    </Text>
  </>,
  <>
    <Text>You can also pause the time.</Text>
    <PauseTimeTask />
    <Text>
      In the time panel, click on the pause icon:{' '}
      <ActionIcon size={IconSize.lg}>
        <PauseIcon />
      </ActionIcon>{' '}
      to pause time.
    </Text>
    <Text c={'dimmed'} fs={'italic'}>
      Note: simulation speed is not set to 0 when you pause.
    </Text>
  </>,
  <Text>
    Fantastic! Now you can move around in both space and time. Let's look at some content!
  </Text>
];
