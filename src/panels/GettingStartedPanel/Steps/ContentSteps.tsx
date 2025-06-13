import { Trans, useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Group,
  List,
  Stack,
  Text,
  Title
} from '@mantine/core';

import { FolderPath } from '@/components/FolderPath/FolderPath';
import { FocusIcon, SceneIcon } from '@/icons/icons';
import { SceneGraphNodeHeader } from '@/panels/Scene/SceneGraphNode/SceneGraphNodeHeader';
import { IconSize } from '@/types/enums';

import { AltitudeMouse } from '../MouseDescriptions/AltitudeMouse';
import { MouseWithModifier } from '../MouseDescriptions/MouseWithModifier';
import { AltitudeTask } from '../Tasks/AltitudeTask';
import { ChangePropertyTask } from '../Tasks/ChangePropertyTask';
import { FocusTask } from '../Tasks/FocusTask';
import { SetPropertyTask } from '../Tasks/SetPropertyTask';

import { ClickBlocker } from './ClickBlocker';

export function useContentSteps(): React.ReactNode[] {
  const { t } = useTranslation('panel-gettingstartedtour', {
    keyPrefix: 'steps.content'
  });

  return [
    <>
      <Title>{t('intro.title')}</Title>
      {t('intro.text')}
    </>,
    <Stack gap={'md'}>
      <Group>
        <Text>{t('scene-menu.intro')}:</Text>
        <ClickBlocker withBorder>
          <Button
            variant={'menubar'}
            leftSection={<SceneIcon size={IconSize.lg} />}
            p={'sm'}
            size={'lg'}
            // TODO: Use component for Scene button
          >
            Scene
          </Button>
        </ClickBlocker>
      </Group>
      <Text>{t('scene-menu.search')}:</Text>
      <ClickBlocker withBorder w={300} p={'xs'}>
        <SceneGraphNodeHeader uri={'Scene.Earth'} />
      </ClickBlocker>
      <Group>
        <Text>{t('scene-menu.focus-tip')}:</Text>
        <ActionIcon
          size={'sm'}
          style={{ pointerEvents: 'none' }}
          aria-label={t('scene-menu.focus-button-aria-label')}
          aria-disabled
        >
          <FocusIcon size={IconSize.xs} />
        </ActionIcon>
      </Group>
      <Group>
        <Text>{t('scene-menu.checkbox-tip')}:</Text>{' '}
        <Checkbox checked readOnly style={{ pointerEvents: 'none' }} />
      </Group>
    </Stack>,
    <>
      <Text>{t('visibility.intro')}</Text>
      <SetPropertyTask
        uri={'Scene.EarthTrail.Renderable.Enabled'}
        propertyType={'BoolProperty'}
        finalValue={false}
        label={t('visibility.task.label')}
      />
      <Group>
        <Text>{t('visibility.task.tip')}:</Text>
        <Checkbox checked readOnly style={{ pointerEvents: 'none' }} />
      </Group>
    </>,
    <>
      <Text>
        <Trans t={t} i18nKey={'appearance.intro'} components={{ italic: <i /> }} />
      </Text>

      <ChangePropertyTask
        // @TODO (2025-06-11, emmbr): This task autocompletes immediately
        uri={'Scene.MarsTrail.Renderable.Appearance.Color'}
        propertyType={'Vec3Property'}
        label={'Change the color of the trail of Mars'}
      />
      <Text>{t('appearance.task.tip')}</Text>
      <FolderPath
        path={[
          <>
            <SceneIcon size={IconSize.sm} />
            <Text ml={'xs'}>Scene</Text>
          </>,
          'Mars Trail',
          'Renderable',
          'Appearance',
          'Color'
        ]}
      />
    </>,
    <>
      <Text>{t('surfaces.intro')}</Text>
      <FocusTask anchor={'Mars'} />
      {/* @TODO (2025-06-11, emmbr): Localize unit */}
      <AltitudeTask anchor={'Mars'} altitude={10000} unit={'km'} compare={'lower'} />
      <AltitudeMouse />
    </>,
    <>
      <Text fw={'bold'}>{t('globebrowsing.title')}</Text>
      <Text>
        <Trans t={t} i18nKey={'globebrowsing.intro'} components={{ italic: <i /> }} />
      </Text>
      <Text>{t('globebrowsing.about-maps')}</Text>
      <Text>{t('globebrowsing.about-layer-servers')}</Text>
    </>,
    <>
      <Text>{t('layers.intro')}</Text>
      <FolderPath
        path={[
          <>
            <SceneIcon size={IconSize.sm} />
            <Text ml={'xs'}>Scene</Text>
          </>,
          'Mars',
          'Renderable',
          'Layers',
          'Color Layers'
        ]}
      />
      <Text>{t('layers.intro-layer-ordering')}</Text>
      <FocusTask anchor={'Mars'} />
      <SetPropertyTask
        uri={'Scene.Mars.Renderable.Layers.ColorLayers.CTX_Mosaic_Sweden.Enabled'}
        propertyType={'BoolProperty'}
        finalValue={true}
        label={t('layers.task.label', { layerName: 'CTX Mosaic [Sweden]' })}
      />
      <Text c={'dimmed'} fs={'italic'}>
        {t('layers.task.tip')}
      </Text>
    </>,
    <>
      <Text>{t('explore-constellations.intro')}</Text>
      <SetPropertyTask
        uri={'Scene.Constellations.Renderable.Enabled'}
        propertyType={'BoolProperty'}
        finalValue={true}
        label={t('explore-constellations.task.label')}
      />
      <Text>{t('explore-constellations.look-around')}</Text>
      <Group>
        <Text flex={1} c={'dimmed'} fs={'italic'}>
          {t('explore-constellations.look-around-mouse-hint')}
        </Text>
        <MouseWithModifier
          mouseClick={'left'}
          arrowDir={'horizontal'}
          modifier={'ctrl'}
        />
      </Group>
    </>,
    <>
      <Text>{t('conclusion.intro')}</Text>
      <List>
        {t('conclusion.ideas', { returnObjects: true }).map((idea, index) => (
          <List.Item key={index}>{idea}</List.Item>
        ))}
      </List>
      <Text>
        <Trans
          t={t}
          i18nKey={'conclusion.links'}
          components={{
            tutorialsLink: (
              <Anchor
                href={
                  'https://www.youtube.com/playlist?list=PLzXWit_1TXsu23I8Nh2WZhN9msWG_ZbnV'
                }
                target={'_blank'}
              />
            ),
            docsLink: (
              <Anchor href={'https://docs.openspaceproject.com/'} target={'_blank'} />
            )
          }}
        />
      </Text>
      <Text>{t('conclusion.happy-exploring')}</Text>
    </>
  ];
}
