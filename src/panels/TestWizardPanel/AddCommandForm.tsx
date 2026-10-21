import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput
} from '@mantine/core';

import { api } from '@/api/api';
import { useOpenSpaceApi } from '@/api/hooks';

import { NavigationStateValue, TestCommand, Vec3 } from './types';

const COMMAND_TYPES = [
  'navigationstate',
  'asset',
  'property',
  'wait',
  'script',
  'time',
  'pause',
  'deltatime',
  'action'
] as const;

type CommandType = (typeof COMMAND_TYPES)[number];

function isCommandType(value: string): value is CommandType {
  return (COMMAND_TYPES as readonly string[]).includes(value);
}

function parseVec3(s: string): Vec3 | null {
  const parts = s.split(',').map((p) => Number(p.trim()));
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return null;
  }
  const [x, y, z] = parts;
  if (x === undefined || y === undefined || z === undefined) {
    return null;
  }
  return [x, y, z];
}

interface NavState {
  Anchor: string;
  Position: Vec3;
  Aim?: string;
  Pitch?: number;
  ReferenceFrame?: string;
  Timestamp?: string;
  Up?: Vec3;
  Yaw?: number;
}

interface Action {
  Identifier: string;
  Name: string;
}

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function AddCommandForm({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });
  const luaApi = useOpenSpaceApi();

  const [type, setType] = useState<CommandType | null>(null);
  const [numValue, setNumValue] = useState<number | string>(0);
  const [strValue, setStrValue] = useState('');
  const [pauseValue, setPauseValue] = useState(true);
  const [propUri, setPropUri] = useState('');
  const [propRawValue, setPropRawValue] = useState('');
  const [navAnchor, setNavAnchor] = useState('');
  const [navPosition, setNavPosition] = useState('');
  const [navAim, setNavAim] = useState('');
  const [navPitch, setNavPitch] = useState<number | string>('');
  const [navRefFrame, setNavRefFrame] = useState('');
  const [navUp, setNavUp] = useState('');
  const [navYaw, setNavYaw] = useState<number | string>('');
  const [navTimestamp, setNavTimestamp] = useState('');
  const [navIncludeTimestamp, setNavIncludeTimestamp] = useState(false);

  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [assetOptions, setAssetOptions] = useState<string[]>([]);
  const [actionOptions, setActionOptions] = useState<{ value: string; label: string }[]>(
    []
  );

  async function runFetch(fetchFunction: () => Promise<void>) {
    setFetching(true);
    setFetchError(null);
    try {
      await fetchFunction();
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : t('fetch-failed'));
    } finally {
      setFetching(false);
    }
  }

  async function fetchNavState() {
    if (!luaApi) {
      return;
    }
    const navstate = (await luaApi.navigation.getNavigationState()) as NavState;
    setNavAnchor(navstate.Anchor);
    setNavPosition(navstate.Position.join(', '));
    if (navstate.Aim !== undefined) setNavAim(navstate.Aim);
    if (navstate.Pitch !== undefined) setNavPitch(navstate.Pitch);
    if (navstate.ReferenceFrame !== undefined) setNavRefFrame(navstate.ReferenceFrame);
    if (navstate.Up !== undefined) setNavUp(navstate.Up.join(', '));
    if (navstate.Yaw !== undefined) setNavYaw(navstate.Yaw);
    if (navstate.Timestamp !== undefined) {
      setNavTimestamp(navstate.Timestamp);
      setNavIncludeTimestamp(true);
    }
  }

  async function fetchTime() {
    if (!luaApi) {
      return;
    }
    setStrValue(await luaApi.time.UTC());
  }

  async function fetchDeltaTime() {
    if (!luaApi) {
      return;
    }
    setNumValue(await luaApi.time.deltaTime());
  }

  async function fetchPropertyValue() {
    if (!propUri) {
      return;
    }
    const result = (await api.getProperty(propUri)) as {
      type: string;
      value: { value: unknown };
    };
    if (result.type === 'property') {
      setPropRawValue(String(result.value.value));
    }
  }

  async function fetchAssets() {
    if (!luaApi) {
      return;
    }
    // eslint-disable-next-line no-template-curly-in-string
    const folder = await luaApi.absPath('${ASSETS}');
    const rawAssets = await luaApi.asset.rootAssets();
    const all = Object.values(rawAssets as Record<number, string>);
    const names = all
      .map((a) => {
        const relative = a.startsWith(folder) ? a.slice(folder.length + 1) : a;
        const dotIdx = relative.indexOf('.');
        return (dotIdx !== -1 ? relative.slice(0, dotIdx) : relative).replace(/\\/g, '/');
      })
      .sort();
    setAssetOptions(names);
    const [first] = names;
    if (first) {
      setStrValue(first);
    }
  }

  async function fetchActions() {
    if (!luaApi) {
      return;
    }
    const rawActions = await luaApi.action.actions();
    const actions = Object.values(rawActions as Record<number, Action>);
    const opts = actions.map((a) => ({
      value: a.Identifier,
      label: `${a.Name} (${a.Identifier})`
    }));
    setActionOptions(opts);
    const [first] = opts;
    if (first) {
      setStrValue(first.value);
    }
  }

  function buildCommand(): TestCommand | null {
    switch (type) {
      case 'wait':
        return { type: 'wait', value: Number(numValue) };
      case 'deltatime':
        return { type: 'deltatime', value: Number(numValue) };
      case 'asset':
        return strValue ? { type: 'asset', value: strValue } : null;
      case 'script':
        return strValue ? { type: 'script', value: strValue } : null;
      case 'time':
        return strValue ? { type: 'time', value: strValue } : null;
      case 'action':
        return strValue ? { type: 'action', value: strValue } : null;
      case 'pause':
        return { type: 'pause', value: pauseValue };
      case 'property': {
        if (!propUri) {
          return null;
        }
        let val: string | number | boolean = propRawValue;
        if (propRawValue.toLowerCase() === 'true') {
          val = true;
        } else if (propRawValue.toLowerCase() === 'false') {
          val = false;
        } else if (propRawValue !== '' && !Number.isNaN(Number(propRawValue))) {
          val = Number(propRawValue);
        }
        return { type: 'property', value: { property: propUri, value: val } };
      }
      case 'navigationstate': {
        const position = parseVec3(navPosition);
        if (!navAnchor || !position) {
          return null;
        }
        const value: NavigationStateValue = { anchor: navAnchor, position };
        if (navAim) value.aim = navAim;
        if (typeof navPitch === 'number') value.pitch = navPitch;
        if (navRefFrame) value.referenceFrame = navRefFrame;
        const up = navUp ? parseVec3(navUp) : null;
        if (up) value.up = up;
        if (typeof navYaw === 'number') value.yaw = navYaw;
        if (navIncludeTimestamp && navTimestamp) value.timestamp = navTimestamp;
        return { type: 'navigationstate', value };
      }
      default:
        return null;
    }
  }

  function resetForm() {
    setType(null);
    setStrValue('');
    setNumValue(0);
    setPropUri('');
    setPropRawValue('');
    setNavAnchor('');
    setNavPosition('');
    setNavAim('');
    setNavPitch('');
    setNavRefFrame('');
    setNavUp('');
    setNavYaw('');
    setNavTimestamp('');
    setNavIncludeTimestamp(false);
  }

  function handleAdd() {
    const cmd = buildCommand();
    if (!cmd) {
      return;
    }
    onAdd(cmd);
    resetForm();
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
      <Select
        label={t('type-label')}
        placeholder={t('type-placeholder')}
        data={COMMAND_TYPES.map((id) => ({ value: id, label: t(`types.${id}.label`) }))}
        value={type}
        onChange={(v) => {
          setType(v !== null && isCommandType(v) ? v : null);
          setStrValue('');
          setNumValue(0);
          setAssetOptions([]);
          setActionOptions([]);
        }}
        allowDeselect={false}
      />
      {type !== null && (
        <Text size={'sm'} c={'dimmed'}>
          {t(`types.${type}.description`)}
        </Text>
      )}

      {(type === 'wait' || type === 'deltatime') && (
        <Stack gap={'xs'}>
          <NumberInput
            label={type === 'wait' ? t('wait-seconds') : t('delta-time')}
            value={numValue}
            onChange={setNumValue}
            min={0}
            step={type === 'wait' ? 1 : 0.1}
          />
          {type === 'deltatime' && (
            <Button
              size={'xs'}
              variant={'light'}
              onClick={() => runFetch(fetchDeltaTime)}
              disabled={!luaApi}
              loading={fetching}
            >
              {t('fetch-from-openspace')}
            </Button>
          )}
        </Stack>
      )}

      {type === 'asset' && (
        <Stack gap={'xs'}>
          {assetOptions.length > 0 ? (
            <Select
              label={t('asset.select-label')}
              data={assetOptions}
              value={strValue}
              onChange={(v) => {
                if (v) {
                  setStrValue(v);
                }
              }}
              searchable
            />
          ) : (
            <TextInput
              label={t('asset.path-label')}
              placeholder={t('asset.path-placeholder')}
              value={strValue}
              onChange={(e) => setStrValue(e.currentTarget.value)}
            />
          )}
          <Button
            size={'xs'}
            variant={'light'}
            onClick={() => runFetch(fetchAssets)}
            disabled={!luaApi}
            loading={fetching}
          >
            {t('asset.load')}
          </Button>
        </Stack>
      )}

      {type === 'script' && (
        <Textarea
          label={t('script.label')}
          placeholder={t('script.placeholder')}
          value={strValue}
          onChange={(e) => setStrValue(e.currentTarget.value)}
          autosize
          minRows={2}
        />
      )}

      {type === 'time' && (
        <Stack gap={'xs'}>
          <TextInput
            label={t('time.label')}
            placeholder={t('time.placeholder')}
            value={strValue}
            onChange={(e) => setStrValue(e.currentTarget.value)}
          />
          <Button
            size={'xs'}
            variant={'light'}
            onClick={() => runFetch(fetchTime)}
            disabled={!luaApi}
            loading={fetching}
          >
            {t('fetch-from-openspace')}
          </Button>
        </Stack>
      )}

      {type === 'action' && (
        <Stack gap={'xs'}>
          {actionOptions.length > 0 ? (
            <Select
              label={t('action.select-label')}
              data={actionOptions}
              value={strValue}
              onChange={(v) => {
                if (v) {
                  setStrValue(v);
                }
              }}
              searchable
            />
          ) : (
            <TextInput
              label={t('action.identifier-label')}
              placeholder={t('action.identifier-placeholder')}
              value={strValue}
              onChange={(e) => setStrValue(e.currentTarget.value)}
            />
          )}
          <Button
            size={'xs'}
            variant={'light'}
            onClick={() => runFetch(fetchActions)}
            disabled={!luaApi}
            loading={fetching}
          >
            {t('action.load')}
          </Button>
        </Stack>
      )}

      {type === 'pause' && (
        <Switch
          label={t('pause')}
          checked={pauseValue}
          onChange={(e) => setPauseValue(e.currentTarget.checked)}
        />
      )}

      {type === 'property' && (
        <Stack gap={'xs'}>
          <TextInput
            label={t('property.uri-label')}
            placeholder={t('property.uri-placeholder')}
            value={propUri}
            onChange={(e) => setPropUri(e.currentTarget.value)}
          />
          <Group align={'flex-end'} gap={'xs'}>
            <TextInput
              style={{ flex: 1 }}
              label={t('property.value-label')}
              description={t('property.value-description')}
              placeholder={t('property.value-placeholder')}
              value={propRawValue}
              onChange={(e) => setPropRawValue(e.currentTarget.value)}
            />
            <Button
              size={'sm'}
              variant={'light'}
              onClick={() => runFetch(fetchPropertyValue)}
              disabled={!propUri}
              loading={fetching}
              mb={'xs'}
            >
              {t('property.fetch-value')}
            </Button>
          </Group>
        </Stack>
      )}

      {type === 'navigationstate' && (
        <Stack gap={'xs'}>
          <Button
            size={'xs'}
            variant={'light'}
            onClick={() => runFetch(fetchNavState)}
            disabled={!luaApi}
            loading={fetching}
          >
            {t('navigation-state.fetch')}
          </Button>
          <TextInput
            label={t('navigation-state.anchor.label')}
            placeholder={t('navigation-state.anchor.placeholder')}
            value={navAnchor}
            onChange={(e) => setNavAnchor(e.currentTarget.value)}
          />
          <TextInput
            label={t('navigation-state.position.label')}
            description={t('comma-separated')}
            placeholder={t('navigation-state.position.placeholder')}
            value={navPosition}
            onChange={(e) => setNavPosition(e.currentTarget.value)}
          />
          <TextInput
            label={t('navigation-state.aim.label')}
            placeholder={t('navigation-state.aim.placeholder')}
            value={navAim}
            onChange={(e) => setNavAim(e.currentTarget.value)}
          />
          <NumberInput
            label={t('navigation-state.pitch')}
            value={navPitch}
            onChange={setNavPitch}
          />
          <TextInput
            label={t('navigation-state.reference-frame')}
            value={navRefFrame}
            onChange={(e) => setNavRefFrame(e.currentTarget.value)}
          />
          <TextInput
            label={t('navigation-state.up.label')}
            description={t('comma-separated')}
            placeholder={t('navigation-state.up.placeholder')}
            value={navUp}
            onChange={(e) => setNavUp(e.currentTarget.value)}
          />
          <NumberInput
            label={t('navigation-state.yaw')}
            value={navYaw}
            onChange={setNavYaw}
          />
          <Checkbox
            label={t('navigation-state.include-timestamp')}
            checked={navIncludeTimestamp}
            onChange={(e) => setNavIncludeTimestamp(e.currentTarget.checked)}
          />
          {navIncludeTimestamp && (
            <TextInput
              label={t('navigation-state.timestamp.label')}
              placeholder={t('navigation-state.timestamp.placeholder')}
              value={navTimestamp}
              onChange={(e) => setNavTimestamp(e.currentTarget.value)}
            />
          )}
        </Stack>
      )}

      {type !== null && <Button onClick={handleAdd}>{t('submit')}</Button>}
    </Stack>
  );
}
