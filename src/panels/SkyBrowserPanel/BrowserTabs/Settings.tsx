import { useTranslation } from 'react-i18next';
import {
  AngleSlider,
  Box,
  Center,
  ColorInput,
  Group,
  InputLabel,
  Tabs,
  Title,
  Tooltip
} from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { NumericSlider } from '@/components/Input/NumericInput/NumericSlider/NumericSlider';
import { LoadingBlocks } from '@/components/LoadingBlocks/LoadingBlocks';
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
  const { t } = useTranslation('panel-skybrowser', { keyPrefix: 'settings' });

  const imageList = useAppSelector((state) => state.skybrowser.imageList);
  const targetId = useAppSelector((state) => state.skybrowser.browsers[id]?.targetId);

  const luaApi = useOpenSpaceApi();

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

  if (!imageList) {
    return <LoadingBlocks mt={'md'} />;
  }

  return (
    <Box py={'xs'}>
      <Title order={2}>{t('title')}</Title>
      <Tabs defaultValue={'Settings'}>
        <Tabs.List>
          <Tooltip label={t('this-browser.tooltip')}>
            <Tabs.Tab value={'Settings'}>{t('this-browser.tab-title')}</Tabs.Tab>
          </Tooltip>
          <Tooltip label={t('display-copies.tooltip')}>
            <Tabs.Tab value={'Display'}>{t('display-copies.tab-title')}</Tabs.Tab>
          </Tooltip>
          <Tooltip label={t('general.tooltip')}>
            <Tabs.Tab value={'General'}>{t('general.tab-title')}</Tabs.Tab>
          </Tooltip>
        </Tabs.List>
        <Box py={'sm'}>
          <Tabs.Panel value={'Settings'}>
            <InputLabel>{t('this-browser.border-radius-input')}</InputLabel>
            <Group grow>
              <NumericSlider
                disabled={false}
                value={radius}
                min={0}
                max={1}
                step={0.1}
                onInput={setBorderRadius}
                flex={2}
              />
              <NumericInput
                value={radius}
                min={0}
                max={1}
                step={0.1}
                clampBehavior={'strict'}
                onEnter={setBorderRadius}
                decimalScale={3}
              />
            </Group>
            <ColorInput
              label={t('this-browser.color-input.label')}
              placeholder={t('this-browser.color-input.placeholder')}
              format={'rgb'}
              defaultValue={color}
              onChange={setColor}
              withEyeDropper={false}
            />
            <InputLabel>{t('this-browser.fov-input')}</InputLabel>
            <Group grow>
              <NumericSlider
                disabled={false}
                value={fov}
                min={1}
                max={70.0}
                step={1}
                onInput={setVerticalFov}
                flex={2}
              />
              <NumericInput
                value={fov}
                min={0.01}
                max={70.0}
                clampBehavior={'strict'}
                onEnter={setVerticalFov}
                flex={1}
                decimalScale={3}
              />
            </Group>

            <InputLabel>{t('this-browser.right-ascension-input')}</InputLabel>
            <Group grow my={'xs'} align={'top'}>
              <Center>
                <AngleSlider
                  aria-label={t('this-browser.right-ascension-input')}
                  size={40}
                  thumbSize={8}
                  value={parseFloat(ra.toPrecision(3))}
                  onChange={setRightAscension}
                />
              </Center>
              <NumericInput
                value={ra}
                min={0}
                max={359}
                clampBehavior={'strict'}
                onEnter={setRightAscension}
                decimalScale={3}
              />
            </Group>
            <InputLabel>{t('this-browser.declination-input')}</InputLabel>
            <Group grow>
              <NumericSlider
                disabled={false}
                value={dec}
                min={-89}
                max={89}
                step={1}
                onInput={setDeclination}
              />
              <NumericInput
                value={dec}
                min={-90}
                max={90}
                clampBehavior={'strict'}
                onEnter={setDeclination}
                decimalScale={3}
              />
            </Group>
            <Property uri={`Scene.${targetId}.Renderable.ApplyRoll`} />
            <Property uri={`ScreenSpace.${id}.PointSpacecraft`} />
          </Tabs.Panel>
          <Tabs.Panel value={'Display'}>
            <SettingsDisplayCopies id={id} />
          </Tabs.Panel>
          <Tabs.Panel value={'General'}>
            <Property uri={SkyBrowserAllowCameraRotationKey} />
            <Property uri={SkyBrowserCameraRotationSpeedKey} />
            <Property uri={SkyBrowserTargetAnimationSpeedKey} />
            <Property uri={SkyBrowserBrowserAnimationSpeedKey} />
            <Property uri={SkyBrowserHideTargetsBrowsersWithGuiKey} />
            <Property uri={SkyBrowserInverseZoomDirectionKey} />
            <Property uri={SkyBrowserSpaceCraftAnimationTimeKey} />
          </Tabs.Panel>
        </Box>
      </Tabs>
    </Box>
  );
}
