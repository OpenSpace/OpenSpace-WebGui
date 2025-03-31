import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Group,
  List,
  Paper,
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
import { SetBoolPropertyTask } from '../Tasks/ChangePropertyTask';
import { FocusTask } from '../Tasks/FocusTask';
import { MarsTrailColorTask } from '../Tasks/MarsTrailColorTask';

export const ContentSteps = [
  <>
    <Title>Content</Title>
    In this chapter we will learn about the objects we can see in OpenSpace.
  </>,
  <Stack gap={'md'}>
    <Group>
      <Text>All the content in OpenSpace can be found in the Scene menu:</Text>
      <Button
        variant={'menubar'}
        leftSection={<SceneIcon size={IconSize.lg} />}
        style={{ pointerEvents: 'none' }}
        px={'sm'}
        size={'lg'}
      >
        Scene
      </Button>
    </Group>
    <Text>
      You can search for objects in the top search bar. The results are going to look like
      this:
    </Text>
    <Paper maw={300} withBorder bg={'transparent'} p={'xs'}>
      <SceneGraphNodeHeader uri={'Scene.Earth'} />
    </Paper>
    <Group>
      <Text>You can focus on objects by clicking the focus icon: </Text>
      <ActionIcon size={'sm'} style={{ pointerEvents: 'none' }}>
        <FocusIcon size={IconSize.xs} />
      </ActionIcon>
    </Group>
    <Group>
      <Text>To toggle the visibility, click on the checkmark:</Text>{' '}
      <Checkbox checked readOnly style={{ pointerEvents: 'none' }} />
    </Group>
  </Stack>,
  <>
    <Text>
      You can turn on and off content by checking and unchecking their corresponding
      checkboxes.
    </Text>
    <SetBoolPropertyTask
      uri={'Scene.EarthTrail.Renderable.Enabled'}
      finalValue={false}
      label={'Turn off the trail of Earth'}
    />
    <Group>
      <Text>To toggle the visibility, click on the checkmark:</Text>
      <Checkbox checked readOnly style={{ pointerEvents: 'none' }} />
    </Group>
  </>,
  <>
    <Text>
      All objects have <span style={{ fontStyle: 'italic' }}>properties</span>, which make
      it possible to alter the behavior or appearance of an object. These properties can
      include size, color, opacity, etc.
    </Text>
    <MarsTrailColorTask />
    <Text>Go to:</Text>
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
    <Text>to change the color of the trail.</Text>
  </>,
  <>
    <Text>Let's take a look at the surface of Mars.</Text>
    <FocusTask anchor={'Mars'} />
    <AltitudeTask anchor={'Mars'} altitude={10000} unit={'km'} compare={'lower'} />
    <AltitudeMouse />
  </>,
  <>
    <Text fw={'bold'}>GlobeBrowsing</Text>
    <Text>
      The feature that enables us to look at maps on planets is called{' '}
      <span style={{ fontStyle: 'italic' }}>GlobeBrowsing</span>.
    </Text>
    <Text>
      Planets can have multiple maps which show different data. Planets also have height
      maps, which show elevation. Different maps can have different resolutions.
    </Text>
    <Text>
      The default layers in OpenSpace are generally named after the satellite or
      instrument on a satellite that captured the map. The name [Utah] or [Sweden] states
      on which server the map is located. It is usually faster to choose the server
      closest to you.
    </Text>
  </>,
  <>
    <Text>Go to the Mars layers:</Text>
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
    <Text>
      The layers are ordered, and the layer furthest down in the menu is shown at the top
      of the globe.
    </Text>
    <FocusTask anchor={'Mars'} />
    <SetBoolPropertyTask
      uri={'Scene.Mars.Renderable.Layers.ColorLayers.CTX_Mosaic_Sweden.Enabled'}
      finalValue={true}
      label={"Turn on the ColorLayer 'CTX Mosaic [Sweden]'"}
    />

    <Text c={'dimmed'} fs={'italic'}>
      You need access to the internet to display the maps. They might need a few seconds
      to load.
    </Text>
  </>,
  <>
    <Text>
      All content is not turned on by default. Explore the menus and see what you can
      find!
    </Text>
    <SetBoolPropertyTask
      uri={'Scene.Constellations.Renderable.Enabled'}
      finalValue={true}
      label={'Turn on Constellation Lines'}
    />
    <Text>You might want to take a look around to look at the constellations!</Text>
    <Group>
      <Text flex={1} c={'dimmed'} fs={'italic'}>
        Left click and drag + ctrl to look around freely
      </Text>
      <MouseWithModifier mouseClick={'left'} arrowDir={'horizontal'} modifier={'ctrl'} />
    </Group>
  </>,
  <>
    <Text>
      Well done! Now you are ready to explore the Universe on your own. Some ideas to get
      you started:
    </Text>
    <List>
      <List.Item>Go to your home town</List.Item>
      <List.Item>Go to the end of the Universe</List.Item>
      <List.Item>Turn on the Sun's orbit in the Milky Way</List.Item>
    </List>
    <Text>
      You can also browser more in-depth tutorials{' '}
      <Anchor
        href={'https://www.youtube.com/playlist?list=PLzXWit_1TXsu23I8Nh2WZhN9msWG_ZbnV'}
        target={'_blank'}
      >
        here
      </Anchor>{' '}
      and view the documentation{' '}
      <Anchor href={'https://docs.openspaceproject.com/'} target={'_blank'}>
        here
      </Anchor>
      .
    </Text>
    <Text>Happy exploring!</Text>
  </>
];
