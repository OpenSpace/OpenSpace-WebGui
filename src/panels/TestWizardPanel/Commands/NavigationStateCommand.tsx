import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Checkbox, NumberInput, Stack, TextInput } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { RefreshIcon } from '@/icons/icons';

import { ResettableField } from '../ResettableField';
import { SaveCancelButtons } from '../SaveCancelButtons';
import { NavigationStateValue, NavState, TestCommand } from '../types';
import { parseVec3 } from '../util';

interface Props {
  onAdd: (command: TestCommand) => void;
  onCancel: () => void;
}

export function NavigationStateCommand({ onAdd, onCancel }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const [anchor, setAnchor] = useState('');
  const [position, setPosition] = useState('');
  const [aim, setAim] = useState('');
  const [pitch, setPitch] = useState<number | string>('');
  const [refFrame, setRefFrame] = useState('');
  const [up, setUp] = useState('');
  const [yaw, setYaw] = useState<number | string>('');
  const [timestamp, setTimestamp] = useState('');
  const [includeTimestamp, setIncludeTimestamp] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const luaApi = useOpenSpaceApi();

  const disabled = !luaApi;
  const command = buildCommand();
  const labels = {
    anchor: t('navigationstate.anchor.label'),
    position: t('navigationstate.position.label'),
    aim: t('navigationstate.aim.label'),
    pitch: t('navigationstate.pitch.label'),
    refFrame: t('navigationstate.reference-frame.label'),
    up: t('navigationstate.up.label'),
    yaw: t('navigationstate.yaw.label'),
    timestamp: t('navigationstate.timestamp.label')
  };

  const resetFromCurrent = useCallback(
    async (apply: (navState: NavState) => void) => {
      if (!luaApi) {
        return;
      }
      setFetchError(null);
      try {
        apply((await luaApi.navigation.getNavigationState()) as NavState);
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : t('fetch-failed'));
      }
    },
    [luaApi, t]
  );

  const resetAll = useCallback(() => {
    resetFromCurrent((navState) => {
      setAnchor(navState.Anchor);
      setPosition(navState.Position.join(', '));
      setAim(navState.Aim ?? '');
      setPitch(navState.Pitch ?? '');
      setRefFrame(navState.ReferenceFrame ?? '');
      setUp(navState.Up?.join(', ') ?? '');
      setYaw(navState.Yaw ?? '');
      setTimestamp(navState.Timestamp ?? '');
      setIncludeTimestamp(navState.Timestamp !== undefined);
    });
  }, [resetFromCurrent]);

  // Start from the current navigation state
  useEffect(() => {
    resetAll();
  }, [resetAll]);

  function buildCommand(): TestCommand | null {
    const parsedPosition = parseVec3(position);
    if (!anchor || !parsedPosition) {
      return null;
    }
    const value: NavigationStateValue = { anchor, position: parsedPosition };
    if (aim) {
      value.aim = aim;
    }
    if (typeof pitch === 'number') {
      value.pitch = pitch;
    }
    if (refFrame) {
      value.referenceFrame = refFrame;
    }
    const parsedUp = up ? parseVec3(up) : null;
    if (parsedUp) {
      value.up = parsedUp;
    }
    if (typeof yaw === 'number') {
      value.yaw = yaw;
    }
    if (includeTimestamp && timestamp) {
      value.timestamp = timestamp;
    }
    return { type: 'navigationstate', value };
  }

  return (
    <Stack gap={'sm'}>
      {fetchError !== null && (
        <Alert
          color={'red'}
          variant={'light'}
          withCloseButton
          onClose={() => setFetchError(null)}
        >
          {fetchError}
        </Alert>
      )}
      <Stack gap={'xs'}>
        <Button
          size={'xs'}
          variant={'light'}
          leftSection={<RefreshIcon />}
          onClick={resetAll}
          disabled={disabled}
        >
          {t('navigationstate.reset-all')}
        </Button>
        <Checkbox
          label={t('navigationstate.include-timestamp.label')}
          checked={includeTimestamp}
          onChange={(event) => setIncludeTimestamp(event.currentTarget.checked)}
        />
        {includeTimestamp && (
          <ResettableField
            label={labels.timestamp}
            onReset={() =>
              resetFromCurrent((navState) => setTimestamp(navState.Timestamp ?? ''))
            }
            disabled={disabled}
          >
            <TextInput
              label={labels.timestamp}
              placeholder={t('navigationstate.timestamp.placeholder')}
              value={timestamp}
              onChange={(event) => setTimestamp(event.currentTarget.value)}
            />
          </ResettableField>
        )}
        <ResettableField
          label={labels.anchor}
          onReset={() => resetFromCurrent((navState) => setAnchor(navState.Anchor))}
          disabled={disabled}
        >
          <TextInput
            label={labels.anchor}
            placeholder={t('navigationstate.anchor.placeholder')}
            value={anchor}
            onChange={(event) => setAnchor(event.currentTarget.value)}
          />
        </ResettableField>
        <ResettableField
          label={labels.position}
          onReset={() =>
            resetFromCurrent((navState) => setPosition(navState.Position.join(', ')))
          }
          disabled={disabled}
        >
          <TextInput
            label={labels.position}
            description={t('comma-separated')}
            placeholder={t('navigationstate.position.placeholder')}
            value={position}
            onChange={(event) => setPosition(event.currentTarget.value)}
          />
        </ResettableField>
        <Collapsable title={t('navigationstate.optional.title')}>
          <Stack gap={'xs'}>
            <ResettableField
              label={labels.aim}
              onReset={() => resetFromCurrent((navState) => setAim(navState.Aim ?? ''))}
              disabled={disabled}
            >
              <TextInput
                label={labels.aim}
                placeholder={t('navigationstate.aim.placeholder')}
                value={aim}
                onChange={(event) => setAim(event.currentTarget.value)}
              />
            </ResettableField>
            <ResettableField
              label={labels.refFrame}
              onReset={() =>
                resetFromCurrent((navState) => setRefFrame(navState.ReferenceFrame ?? ''))
              }
              disabled={disabled}
            >
              <TextInput
                label={labels.refFrame}
                value={refFrame}
                onChange={(event) => setRefFrame(event.currentTarget.value)}
              />
            </ResettableField>
            <ResettableField
              label={labels.up}
              onReset={() =>
                resetFromCurrent((navState) => setUp(navState.Up?.join(', ') ?? ''))
              }
              disabled={disabled}
            >
              <TextInput
                label={labels.up}
                description={t('comma-separated')}
                placeholder={t('navigationstate.up.placeholder')}
                value={up}
                onChange={(event) => setUp(event.currentTarget.value)}
              />
            </ResettableField>
            <ResettableField
              label={labels.pitch}
              onReset={() =>
                resetFromCurrent((navState) => setPitch(navState.Pitch ?? ''))
              }
              disabled={disabled}
            >
              <NumberInput label={labels.pitch} value={pitch} onChange={setPitch} />
            </ResettableField>
            <ResettableField
              label={labels.yaw}
              onReset={() => resetFromCurrent((navState) => setYaw(navState.Yaw ?? ''))}
              disabled={disabled}
            >
              <NumberInput label={labels.yaw} value={yaw} onChange={setYaw} />
            </ResettableField>
          </Stack>
        </Collapsable>
      </Stack>
      <SaveCancelButtons
        onSave={() => command && onAdd(command)}
        onCancel={onCancel}
        saveLabel={'add'}
        saveDisabled={command === null}
      />
    </Stack>
  );
}
