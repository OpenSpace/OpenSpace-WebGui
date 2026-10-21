import { useMemo, useState } from 'react';
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

import { useOpenSpaceApi } from '@/api/hooks';
import { useSubscribeToAssetTree, useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { useRootPaths } from '@/panels/AssetsPanel/hooks';
import { useAppSelector } from '@/redux/hooks';
import { propertySelectors } from '@/redux/propertytree/propertySlice';
import { dateToOpenSpaceTimeString } from '@/util/time';

import {
  COMMAND_TYPES,
  CommandType,
  NavigationStateValue,
  NavState,
  TestCommand
} from './types';
import { assetNameFromPath, isCommandType, parseVec3 } from './util';

interface Props {
  onAdd: (command: TestCommand) => void;
}

export function AddCommandForm({ onAdd }: Props) {
  const { t } = useTranslation('panel-testwizard', { keyPrefix: 'add-command-form' });

  const targetDeltaTime = useAppSelector((state) => state.time.targetDeltaTime);
  const rootAssets = useAppSelector((state) => state.assetTree.rootAssets);
  const actions = useAppSelector((state) => state.actions.actions);

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

  // Derived from `propUri`, so it comes after the state
  const currentPropertyValue = useAppSelector(
    (state) => propertySelectors.selectById(state, propUri)?.value
  );

  const luaApi = useOpenSpaceApi();
  const assetRoots = useRootPaths();
  const currentTime = useSubscribeToTime();
  useSubscribeToAssetTree();

  const assetOptions = useMemo(
    () =>
      assetRoots
        ? rootAssets.map((a) => assetNameFromPath(a, assetRoots.data)).sort()
        : [],
    [rootAssets, assetRoots]
  );
  const actionOptions = useMemo(
    () =>
      actions.map((a) => ({ value: a.identifier, label: `${a.name} (${a.identifier})` })),
    [actions]
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

  function applyCurrentTime() {
    if (currentTime !== undefined) {
      setStrValue(dateToOpenSpaceTimeString(new Date(currentTime)));
    }
  }

  function applyCurrentDeltaTime() {
    if (targetDeltaTime !== undefined) {
      setNumValue(targetDeltaTime);
    }
  }

  function applyCurrentPropertyValue() {
    if (currentPropertyValue !== undefined) {
      setPropRawValue(String(currentPropertyValue));
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
              onClick={applyCurrentDeltaTime}
              disabled={targetDeltaTime === undefined}
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
            onClick={applyCurrentTime}
            disabled={currentTime === undefined}
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
              onClick={applyCurrentPropertyValue}
              disabled={currentPropertyValue === undefined}
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
