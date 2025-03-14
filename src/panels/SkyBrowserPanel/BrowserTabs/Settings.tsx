import { ColorInput, Stack, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { Property } from '@/components/Property/Property';
import { useAppSelector } from '@/redux/hooks';
import {
  SkyBrowserAllowCameraRotationKey,
  SkyBrowserBrowserAnimationSpeedKey,
  SkyBrowserCameraRotationSpeedKey,
  SkyBrowserHideTargetsBrowsersWithGuiKey,
  SkyBrowserInverseZoomDirectionKey,
  SkyBrowserSpaceCraftAnimationTimeKey,
  SkyBrowserTargetAnimationSpeedKey
} from '@/util/keys';

import {
  useBrowserColorString,
  useBrowserCoords,
  useBrowserFov,
  useBrowserRadius
} from '../hooks';

import { SettingsDisplayCopies } from './SettingsDisplayCopies';

interface Props {
  id: string;
}

export function Settings({ id }: Props) {
  const luaApi = useOpenSpaceApi();
  const targetId = useAppSelector((state) => state.skybrowser.browsers[id]?.targetId);
  const color = useBrowserColorString(id);
  const fov = useBrowserFov(id);
  const radius = useBrowserRadius(id);
  const { ra, dec } = useBrowserCoords(id);

  function setColor(newColor: string) {
    const parsedColor = newColor.match(/\d+/g)?.map(Number);
    if (!parsedColor) {
      return;
    }
    const [r, g, b] = parsedColor;
    luaApi?.skybrowser.setBorderColor(id, r, g, b);
  }

  function setBorderRadius(newValue: number): void {
    luaApi?.skybrowser.setBorderRadius(id, newValue);
  }

  function setVerticalFov(newValue: number): void {
    luaApi?.skybrowser.setVerticalFov(id, newValue);
  }

  function setRightAscension(newValue: number): void {
    luaApi?.skybrowser.setEquatorialAim(id, newValue, dec);
  }

  function setDeclination(newValue: number): void {
    luaApi?.skybrowser.setEquatorialAim(id, ra, newValue);
  }

  return (
    <Stack gap={5} my={'lg'}>
      <Title order={2}>Settings</Title>
      <NumericInput
        value={radius}
        label={'Border Radius'}
        min={0}
        max={1}
        step={0.01}
        clampBehavior={'strict'}
        onEnter={setBorderRadius}
      />
      <ColorInput
        label={'Color'}
        placeholder={'Set browser color...'}
        format={'rgb'}
        defaultValue={color}
        onChange={setColor}
      />
      <NumericInput
        value={fov}
        label={'Vertical field of view'}
        min={0.01}
        max={70.0}
        clampBehavior={'strict'}
        onEnter={setVerticalFov}
      />
      <NumericInput
        value={ra}
        label={'Right Ascension'}
        min={0}
        max={360}
        clampBehavior={'strict'}
        onEnter={setRightAscension}
      />
      <NumericInput
        value={dec}
        label={'Declination'}
        min={-90}
        max={90}
        clampBehavior={'strict'}
        onEnter={setDeclination}
      />
      <Property uri={`Scene.${targetId}.Renderable.ApplyRoll`} />
      <Property uri={`ScreenSpace.${id}.PointSpacecraft`} />
      <Collapsable title={<Title order={3}>Display Copies</Title>}>
        <SettingsDisplayCopies id={id} />
      </Collapsable>
      <Collapsable title={<Title order={3}>General Settings</Title>}>
        <Property uri={SkyBrowserAllowCameraRotationKey} />
        <Property uri={SkyBrowserCameraRotationSpeedKey} />
        <Property uri={SkyBrowserTargetAnimationSpeedKey} />
        <Property uri={SkyBrowserBrowserAnimationSpeedKey} />
        <Property uri={SkyBrowserHideTargetsBrowsersWithGuiKey} />
        <Property uri={SkyBrowserInverseZoomDirectionKey} />
        <Property uri={SkyBrowserSpaceCraftAnimationTimeKey} />
      </Collapsable>
    </Stack>
  );
}
