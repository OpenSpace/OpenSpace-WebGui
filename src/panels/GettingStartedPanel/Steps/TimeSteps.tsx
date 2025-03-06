import { AltitudeTask } from '../Tasks/AltitudeTask';
import { ChangeDeltaTimeTask } from '../Tasks/ChangeDeltaTimeTask';
import { ChangeYearTask } from '../Tasks/ChangeYearTask';
import { CurrentAltitude } from '../Tasks/Components/CurrentAltitude';
import { CurrentFocus } from '../Tasks/Components/CurrentFocus';
import { CurrentLatLong } from '../Tasks/Components/CurrentLatLong';
import { FocusTask } from '../Tasks/FocusTask';
import { NavigationTask } from '../Tasks/NavigationTask';
import { PauseTimeTask } from '../Tasks/PauseTimeTask';
import { Text } from '@mantine/core';

export const TimeSteps = [
  <>
    <Text>Let's take a look at the Solar System from above.</Text>
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
    <Text c={'dimmed'} fs={'italic'}>
      You can reset the time by pressing "Now"
    </Text>
  </>,
  <>
    <Text>You can also change how fast time is playing.</Text>
    <ChangeDeltaTimeTask />
    <Text c={'dimmed'} fs={'italic'}>
      You can reset the simulation speed by pressing "Real Time"
    </Text>
  </>,
  <>
    <Text>You can pause the time.</Text>
    <PauseTimeTask />
    <Text c={'dimmed'} fs={'italic'}>
      Note: simulation speed is not set to 0 when you pause.
    </Text>
  </>
];
