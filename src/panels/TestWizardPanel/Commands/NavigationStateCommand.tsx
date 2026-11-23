import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Checkbox, NumberInput, Stack, TextInput } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { Layout } from '@/components/Layout/Layout';
import { UseCurrentValueIcon } from '@/icons/icons';

import { ResettableField } from '../ResettableField';
import { SaveCancelButtons } from '../SaveCancelButtons';
import { NavigationStateValue, NavState, TestCommand } from '../types';
import { parseVec3 } from '../util';

interface Props {
  onSubmit: (command: TestCommand) => void;
  onCancel: () => void;
  initialValue?: NavigationStateValue;
}

interface Fields {
  anchor: string;
  position: string;
  aim: string;
  pitch: number | string;
  refFrame: string;
  up: string;
  yaw: number | string;
  timestamp: string;
  includeTimestamp: boolean;
}

export function NavigationStateCommand({ onSubmit, onCancel, initialValue }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'command-form' });
  const [fields, setFields] = useState<Fields>(() => ({
    anchor: initialValue?.anchor ?? '',
    position: initialValue?.position.join(', ') ?? '',
    aim: initialValue?.aim ?? '',
    pitch: initialValue?.pitch ?? '',
    refFrame: initialValue?.referenceFrame ?? '',
    up: initialValue?.up?.join(', ') ?? '',
    yaw: initialValue?.yaw ?? '',
    timestamp: initialValue?.timestamp ?? '',
    includeTimestamp: initialValue?.timestamp !== undefined
  }));
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { anchor, position, aim, pitch, refFrame, up, yaw, timestamp, includeTimestamp } =
    fields;

  function setField<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

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

  // Fetches the current navigation state and passes it to `applyNavState`
  const resetFromCurrent = useCallback(
    async (applyNavState: (navState: NavState) => void) => {
      if (!luaApi) {
        return;
      }
      setFetchError(null);
      try {
        const currentNavState =
          (await luaApi.navigation.getNavigationState()) as NavState;
        applyNavState(currentNavState);
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : t('fetch-failed'));
      }
    },
    [luaApi, t]
  );

  const resetAll = useCallback(() => {
    resetFromCurrent((navState) =>
      setFields({
        anchor: navState.Anchor,
        position: navState.Position.join(', '),
        aim: navState.Aim ?? '',
        pitch: navState.Pitch ?? '',
        refFrame: navState.ReferenceFrame ?? '',
        up: navState.Up?.join(', ') ?? '',
        yaw: navState.Yaw ?? '',
        timestamp: navState.Timestamp ?? '',
        includeTimestamp: navState.Timestamp !== undefined
      })
    );
  }, [resetFromCurrent]);

  // Start from the current navigation state, unless editing an existing command
  useEffect(() => {
    if (initialValue === undefined) {
      resetAll();
    }
  }, [resetAll, initialValue]);

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
    <>
      <Layout.GrowingSection>
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
              leftSection={<UseCurrentValueIcon />}
              onClick={resetAll}
              disabled={disabled}
            >
              {t('navigationstate.reset-all')}
            </Button>
            <Checkbox
              label={t('navigationstate.include-timestamp.label')}
              checked={includeTimestamp}
              onChange={(event) =>
                setField('includeTimestamp', event.currentTarget.checked)
              }
            />
            {includeTimestamp && (
              <ResettableField
                label={labels.timestamp}
                onReset={() =>
                  resetFromCurrent((navState) =>
                    setField('timestamp', navState.Timestamp ?? '')
                  )
                }
                disabled={disabled}
              >
                <TextInput
                  label={labels.timestamp}
                  placeholder={t('navigationstate.timestamp.placeholder')}
                  value={timestamp}
                  onChange={(event) => setField('timestamp', event.currentTarget.value)}
                />
              </ResettableField>
            )}
            <ResettableField
              label={labels.anchor}
              onReset={() =>
                resetFromCurrent((navState) => setField('anchor', navState.Anchor))
              }
              disabled={disabled}
            >
              <TextInput
                label={labels.anchor}
                placeholder={t('navigationstate.anchor.placeholder')}
                value={anchor}
                onChange={(event) => setField('anchor', event.currentTarget.value)}
              />
            </ResettableField>
            <ResettableField
              label={labels.position}
              onReset={() =>
                resetFromCurrent((navState) =>
                  setField('position', navState.Position.join(', '))
                )
              }
              disabled={disabled}
            >
              <TextInput
                label={labels.position}
                description={t('comma-separated')}
                placeholder={t('navigationstate.position.placeholder')}
                value={position}
                onChange={(event) => setField('position', event.currentTarget.value)}
              />
            </ResettableField>
            <Collapsable title={t('navigationstate.optional.title')}>
              <Stack gap={'xs'}>
                <ResettableField
                  label={labels.aim}
                  onReset={() =>
                    resetFromCurrent((navState) => setField('aim', navState.Aim ?? ''))
                  }
                  disabled={disabled}
                >
                  <TextInput
                    label={labels.aim}
                    placeholder={t('navigationstate.aim.placeholder')}
                    value={aim}
                    onChange={(event) => setField('aim', event.currentTarget.value)}
                  />
                </ResettableField>
                <ResettableField
                  label={labels.refFrame}
                  onReset={() =>
                    resetFromCurrent((navState) =>
                      setField('refFrame', navState.ReferenceFrame ?? '')
                    )
                  }
                  disabled={disabled}
                >
                  <TextInput
                    label={labels.refFrame}
                    value={refFrame}
                    onChange={(event) => setField('refFrame', event.currentTarget.value)}
                  />
                </ResettableField>
                <ResettableField
                  label={labels.up}
                  onReset={() =>
                    resetFromCurrent((navState) =>
                      setField('up', navState.Up?.join(', ') ?? '')
                    )
                  }
                  disabled={disabled}
                >
                  <TextInput
                    label={labels.up}
                    description={t('comma-separated')}
                    placeholder={t('navigationstate.up.placeholder')}
                    value={up}
                    onChange={(event) => setField('up', event.currentTarget.value)}
                  />
                </ResettableField>
                <ResettableField
                  label={labels.pitch}
                  onReset={() =>
                    resetFromCurrent((navState) =>
                      setField('pitch', navState.Pitch ?? '')
                    )
                  }
                  disabled={disabled}
                >
                  <NumberInput
                    label={labels.pitch}
                    value={pitch}
                    onChange={(value) => setField('pitch', value)}
                  />
                </ResettableField>
                <ResettableField
                  label={labels.yaw}
                  onReset={() =>
                    resetFromCurrent((navState) => setField('yaw', navState.Yaw ?? ''))
                  }
                  disabled={disabled}
                >
                  <NumberInput
                    label={labels.yaw}
                    value={yaw}
                    onChange={(value) => setField('yaw', value)}
                  />
                </ResettableField>
              </Stack>
            </Collapsable>
          </Stack>
        </Stack>
      </Layout.GrowingSection>
      <Layout.FixedSection>
        <SaveCancelButtons
          onSave={() => command && onSubmit(command)}
          onCancel={onCancel}
          saveLabel={initialValue === undefined ? 'add' : 'save'}
          saveDisabled={command === null}
        />
      </Layout.FixedSection>
    </>
  );
}
