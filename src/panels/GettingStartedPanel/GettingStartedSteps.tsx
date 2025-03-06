import React from 'react';
import {
  Anchor,
  Center,
  Group,
  Image,
  Kbd,
  List,
  Stack,
  Text,
  Title
} from '@mantine/core';

import { FocusIcon, SceneIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';

import { OriginPanelMenuButton } from '../OriginPanel/OriginPanelMenuButton';

import { AltitudeMouse } from './MouseDescriptions/AltitudeMouse';
import { Mouse } from './MouseDescriptions/Mouse';
import { MouseWithModifier } from './MouseDescriptions/MouseWithModifier';
import { NavigationMouse } from './MouseDescriptions/NavigationMouse';
import { AltitudeTask } from './Tasks/AltitudeTask';
import { ChangeDeltaTimeTask } from './Tasks/ChangeDeltaTimeTask';
import { SetBoolPropertyTask } from './Tasks/ChangePropertyTask';
import { ChangeYearTask } from './Tasks/ChangeYearTask';
import { ClearSkyButton } from './Tasks/Components/ClearSkyButton';
import { CurrentAltitude } from './Tasks/Components/CurrentAltitude';
import { CurrentFocus } from './Tasks/Components/CurrentFocus';
import { CurrentLatLong } from './Tasks/Components/CurrentLatLong';
import { FocusTask } from './Tasks/FocusTask';
import { MarsTrailColorTask } from './Tasks/MarsTrailColorTask';
import { NavigationTask } from './Tasks/NavigationTask';
import { PauseTimeTask } from './Tasks/PauseTimeTask';

export const GettingStartedSteps: React.JSX.Element[] = [
  <Stack align={'center'}>
    <Image src={'openspace-logo.png'} w={200} my={'lg'} />
    <Text size={'lg'}>Let's get started with exploring the observable Universe!</Text>
  </Stack>,
  <>
    <Text>In this tutorial we will cover the following topics:</Text>
    <List>
      <List.Item>Navigation</List.Item>
      <List.Item>Time</List.Item>
      <List.Item>Content</List.Item>
    </List>
  </>,
  <>
    <Title order={2}>Let's go closer to Earth!</Title>
    <AltitudeTask anchor={'Earth'} altitude={3500} unit={'km'} compare={'lower'} />
    <CurrentAltitude />
    <AltitudeMouse />
  </>,
  <>
    <Title order={2}>Let's go to Greenland!</Title>
    <NavigationTask
      anchor={'Earth'}
      lat={{ value: 72, min: 55, max: 110 }}
      long={{ value: -44, min: -70, max: -20 }}
    />
    <CurrentLatLong />
    <ClearSkyButton />
    <NavigationMouse />
  </>,
  <>
    <Text>You have two options for rolling the camera:</Text>
    <Group justify={'space-between'}>
      <Text c={'dimmed'} fs={'italic'}>
        Scroll click and drag
      </Text>
      <Mouse mouseClick={'scroll'} arrowDir={'horizontal'} m={'lg'} />
    </Group>
    <Group>
      <Text flex={1} c={'dimmed'} fs={'italic'}>
        Left click and drag + shift
      </Text>
      <MouseWithModifier mouseClick={'left'} arrowDir={'horizontal'} modifier={'shift'} />
    </Group>
  </>,
  <>
    <Text>
      To look around freely, press <Kbd mx={'xs'}>ctrl</Kbd> and left click drag:
    </Text>
    <Center>
      <MouseWithModifier mouseClick={'left'} arrowDir={'horizontal'} modifier={'ctrl'} />
    </Center>
  </>,
  <>
    <Title order={2}>Now it's time to look around in space!</Title>
    <FocusTask anchor={'Moon'} />
    <CurrentFocus />
    <Text>
      Open the navigation menu and click on the "Focus" button to focus on the Moon. The
      navigation menu can be found in the bottom bar:
      <OriginPanelMenuButton onClick={() => {}} />
    </Text>
  </>,
  <>
    <Title order={2}>Let's go closer to the Moon!</Title>
    <AltitudeTask anchor={'Moon'} altitude={3500} unit={'km'} compare={'lower'} />
    <CurrentFocus />
    <CurrentAltitude />
  </>,
  <Text>
    Great! Now you know the basics of navigation. Let's start changing the time!
  </Text>,
  <>
    <Text>Let's take a look at the Solar System from above.</Text>
    <FocusTask anchor={'Sun'} />
    <AltitudeTask anchor={'Sun'} altitude={1} unit={'Lighthours'} compare={'higher'} />
    <NavigationTask anchor={'Sun'} lat={{ value: 80, min: 60, max: 100 }} />
    <CurrentFocus />
    <CurrentAltitude />
    <CurrentLatLong />
    <Text c={'dimmed'} fs={'italic'}>
      The order of magnitue is km {'<'} AU {'<'} Lighthours
    </Text>
  </>,
  <>
    <Text>You can view the past as well as the future.</Text>
    <ChangeYearTask />
    <Text c={'dimmed'} fs={'italic'}>
      You can reset the time by pressing "Now"
    </Text>
  </>,
  <>
    <Text>You can also change how fast time is playing.</Text>
    <ChangeDeltaTimeTask />
    <Text c={'dimmed'} fs={'italic'}>
      You can reset the simulation speed by pressing "Real Time"
    </Text>
  </>,
  <>
    <Text>You can pause the time.</Text>
    <PauseTimeTask />
    <Text c={'dimmed'} fs={'italic'}>
      Note: simulation speed is not set to 0 when you pause.
    </Text>
  </>,
  <>
    <Text>
      Fantastic! Now you can move around in both space and time. Let's look at some
      content!
    </Text>
  </>,
  <>
    <Text>All the content in OpenSpace can be found in the Scene menu.</Text>
    <Group>
      <SceneIcon size={IconSize.lg} /> Scene
    </Group>
    <Text>
      You can search for objects in the top search bar and focus on objects by clicking
      the focus icon <FocusIcon />.
    </Text>
  </>,
  <>
    You can turn on and off content by checking and unchecking their corresponding
    checkboxes.
    <SetBoolPropertyTask
      uri={'Scene.EarthTrail.Renderable.Enabled'}
      finalValue={false}
      label={'Turn off the trail of Earth'}
    />
  </>,
  <>
    All objects have properties, which make it possible to alter the behavior or
    appearance of an object.
    <MarsTrailColorTask />
  </>,
  <>
    <Text>Let's take a look at the surface of Mars.</Text>
    <FocusTask anchor={'Mars'} />
    <AltitudeTask anchor={'Mars'} altitude={10000} unit={'km'} compare={'lower'} />
    <AltitudeMouse />
  </>,
  <>
    <Text>
      Planets can have multiple maps which show different data. Planets also have height
      maps, which show elevation. Different maps can have different resolutions.
    </Text>
    <Text>
      All the default layers in OpenSpace are usually named after the satellite or
      instrument on a satellite that captured the map. The name [Utah] or [Sweden] states
      on which server the map is located. It is usually faster to choose the server
      closest to you.
    </Text>
  </>,
  <>
    <Text>
      The layers are ordered, and the layer furthest down in the menu is shown at the top.
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
      Click{' '}
      <Anchor
        href={'https://www.youtube.com/playlist?list=PLzXWit_1TXsu23I8Nh2WZhN9msWG_ZbnV'}
        target={'_blank'}
      >
        here
      </Anchor>{' '}
      for more in-depth tutorials.
    </Text>
  </>
];
