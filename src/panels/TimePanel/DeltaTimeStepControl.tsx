import { ActionIcon, Group, NumberFormatter, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FastForwardIcon, FastRewindIcon, PauseIcon, PlayIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize } from '@/types/enums';

import { formatDeltaTime } from './util';

export function DeltaTimeStepsControl() {
  const luaApi = useOpenSpaceApi();
  const nextDeltaTimeStep = useAppSelector((state) => state.time.nextDeltaTimeStep) ?? 0;
  const prevDeltaTimeStep = useAppSelector((state) => state.time.prevDeltaTimeStep) ?? 0;
  const isPaused = useAppSelector((state) => state.time.isPaused);

  const hasNextDeltaTimeStep = useAppSelector((state) => state.time.hasNextDeltaTimeStep);
  const hasPrevDeltaTimeStep = useAppSelector((state) => state.time.hasPrevDeltaTimeStep);

  const {
    increment: nextIncrement,
    unit: nextUnit,
    sign: nextSign
  } = formatDeltaTime(nextDeltaTimeStep);
  const {
    increment: nextDecrement,
    unit: prevUnit,
    sign: prevSign
  } = formatDeltaTime(prevDeltaTimeStep);

  const nextLabel = ` ${nextUnit} / second`;
  const prevLabel = ` ${prevUnit} / second`;

  function setPrevDeltaTimeStep(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.setPreviousDeltaTimeStep();
    } else {
      luaApi?.time.interpolatePreviousDeltaTimeStep();
    }
  }

  function setNextDeltaTimeStep(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.setNextDeltaTimeStep();
    } else {
      luaApi?.time.interpolateNextDeltaTimeStep();
    }
  }

  function togglePause(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.togglePause();
    } else {
      luaApi?.time.interpolateTogglePause();
    }
  }

  return (
    <Stack>
      <Group grow gap={'xs'} align={'flex-start'}>
        <Stack gap={0} flex={3}>
          <ActionIcon
            onClick={setPrevDeltaTimeStep}
            disabled={!hasPrevDeltaTimeStep}
            size={'lg'}
            style={{ width: '100%' }}
          >
            <FastRewindIcon size={IconSize.md} />
          </ActionIcon>
          <Text c={'dimmed'}>
            {hasPrevDeltaTimeStep ? (
              <NumberFormatter
                value={nextDecrement}
                prefix={prevSign}
                suffix={prevLabel}
                decimalScale={0}
                allowNegative={false}
              />
            ) : (
              'None'
            )}
          </Text>
        </Stack>

        <ActionIcon
          onClick={togglePause}
          size={'lg'}
          flex={2}
          aria-label={isPaused ? 'play' : 'pause'}
        >
          {isPaused ? <PlayIcon size={IconSize.md} /> : <PauseIcon size={IconSize.md} />}
        </ActionIcon>

        <Stack gap={0} flex={3}>
          <ActionIcon
            onClick={setNextDeltaTimeStep}
            disabled={!hasNextDeltaTimeStep}
            size={'lg'}
            style={{ width: '100%' }}
          >
            <FastForwardIcon size={IconSize.md} />
          </ActionIcon>
          <Text c={'dimmed'}>
            {hasNextDeltaTimeStep ? (
              <NumberFormatter
                value={nextIncrement}
                prefix={nextSign}
                suffix={nextLabel}
                decimalScale={0}
                allowNegative={false}
              />
            ) : (
              'None'
            )}
          </Text>
        </Stack>
      </Group>
    </Stack>
  );
}
