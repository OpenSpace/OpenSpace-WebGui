import { ActionIcon, Group, NumberFormatter, Stack, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { FastForwardIcon, FastRewindIcon, PauseIcon, PlayIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';
import { IconSize, TimePart } from '@/types/enums';

import { Decimals, StepSizes } from './util';

interface DeltaTimeStepsControlProps {
  stepSize: TimePart;
}

export function DeltaTimeStepsControl({ stepSize }: DeltaTimeStepsControlProps) {
  const luaApi = useOpenSpaceApi();
  const nextDeltaTimeStep =
    (useAppSelector((state) => state.time.nextDeltaTimeStep) ?? 0) / StepSizes[stepSize];
  const prevDeltaTimeStep =
    (useAppSelector((state) => state.time.prevDeltaTimeStep) ?? 0) / StepSizes[stepSize];
  const isPaused = useAppSelector((state) => state.time.isPaused);

  const hasNextDeltaTimeStep = useAppSelector((state) => state.time.hasNextDeltaTimeStep);
  const hasPrevDeltaTimeStep = useAppSelector((state) => state.time.hasPrevDeltaTimeStep);

  const nextLabel = ` ${stepSize} / second`;
  const prevLabel = ` ${stepSize} / second`;

  function setPrevDeltaTimeStep(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.setPreviousDeltaTimeStep();
    }
    {
      luaApi?.time.interpolatePreviousDeltaTimeStep();
    }
  }

  function setNextDeltaTimeStep(event: React.MouseEvent<HTMLElement>) {
    if (event.shiftKey) {
      luaApi?.time.setNextDeltaTimeStep();
    }
    {
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
      <Group grow gap={'xs'} align="flex-start">
        <Stack gap={0} maw={'100%'} flex={3}>
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
              <>
                <NumberFormatter
                  value={prevDeltaTimeStep}
                  decimalScale={Decimals[stepSize]}
                />
                {prevLabel}
              </>
            ) : (
              'None'
            )}
          </Text>
        </Stack>

        <ActionIcon onClick={togglePause} size={'lg'} flex={2}>
          {isPaused ? <PlayIcon size={IconSize.md} /> : <PauseIcon size={IconSize.md} />}
        </ActionIcon>

        <Stack gap={0} maw={'100%'} flex={3}>
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
              <>
                <NumberFormatter
                  value={nextDeltaTimeStep}
                  decimalScale={Decimals[stepSize]}
                />
                {nextLabel}
              </>
            ) : (
              'None'
            )}
          </Text>
        </Stack>
      </Group>
    </Stack>
  );
}
