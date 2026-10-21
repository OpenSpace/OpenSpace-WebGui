import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Checkbox, NumberInput, Stack, TextInput } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';

import { NavigationStateValue, NavState, TestCommand } from '../types';
import { parseVec3 } from '../util';

import { AddCommandButton } from './AddCommandButton';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function NavigationStateCommand({ onAdd }: Props) {
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
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const luaApi = useOpenSpaceApi();

  const command = buildCommand();

  async function fetchNavState() {
    if (!luaApi) {
      return;
    }
    setFetching(true);
    setFetchError(null);
    try {
      const navstate = (await luaApi.navigation.getNavigationState()) as NavState;
      setAnchor(navstate.Anchor);
      setPosition(navstate.Position.join(', '));
      if (navstate.Aim !== undefined) setAim(navstate.Aim);
      if (navstate.Pitch !== undefined) setPitch(navstate.Pitch);
      if (navstate.ReferenceFrame !== undefined) setRefFrame(navstate.ReferenceFrame);
      if (navstate.Up !== undefined) setUp(navstate.Up.join(', '));
      if (navstate.Yaw !== undefined) setYaw(navstate.Yaw);
      if (navstate.Timestamp !== undefined) {
        setTimestamp(navstate.Timestamp);
        setIncludeTimestamp(true);
      }
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : t('fetch-failed'));
    } finally {
      setFetching(false);
    }
  }

  function buildCommand(): TestCommand | null {
    const parsedPosition = parseVec3(position);
    if (!anchor || !parsedPosition) {
      return null;
    }
    const value: NavigationStateValue = { anchor, position: parsedPosition };
    if (aim) value.aim = aim;
    if (typeof pitch === 'number') value.pitch = pitch;
    if (refFrame) value.referenceFrame = refFrame;
    const parsedUp = up ? parseVec3(up) : null;
    if (parsedUp) value.up = parsedUp;
    if (typeof yaw === 'number') value.yaw = yaw;
    if (includeTimestamp && timestamp) value.timestamp = timestamp;
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
          onClick={fetchNavState}
          disabled={!luaApi}
          loading={fetching}
        >
          {t('navigation-state.fetch')}
        </Button>
        <TextInput
          label={t('navigation-state.anchor.label')}
          placeholder={t('navigation-state.anchor.placeholder')}
          value={anchor}
          onChange={(event) => setAnchor(event.currentTarget.value)}
        />
        <TextInput
          label={t('navigation-state.position.label')}
          description={t('comma-separated')}
          placeholder={t('navigation-state.position.placeholder')}
          value={position}
          onChange={(event) => setPosition(event.currentTarget.value)}
        />
        <TextInput
          label={t('navigation-state.aim.label')}
          placeholder={t('navigation-state.aim.placeholder')}
          value={aim}
          onChange={(event) => setAim(event.currentTarget.value)}
        />
        <NumberInput
          label={t('navigation-state.pitch')}
          value={pitch}
          onChange={setPitch}
        />
        <TextInput
          label={t('navigation-state.reference-frame')}
          value={refFrame}
          onChange={(event) => setRefFrame(event.currentTarget.value)}
        />
        <TextInput
          label={t('navigation-state.up.label')}
          description={t('comma-separated')}
          placeholder={t('navigation-state.up.placeholder')}
          value={up}
          onChange={(event) => setUp(event.currentTarget.value)}
        />
        <NumberInput label={t('navigation-state.yaw')} value={yaw} onChange={setYaw} />
        <Checkbox
          label={t('navigation-state.include-timestamp')}
          checked={includeTimestamp}
          onChange={(event) => setIncludeTimestamp(event.currentTarget.checked)}
        />
        {includeTimestamp && (
          <TextInput
            label={t('navigation-state.timestamp.label')}
            placeholder={t('navigation-state.timestamp.placeholder')}
            value={timestamp}
            onChange={(event) => setTimestamp(event.currentTarget.value)}
          />
        )}
      </Stack>
      <AddCommandButton
        onClick={() => command && onAdd(command)}
        disabled={command === null}
      />
    </Stack>
  );
}
