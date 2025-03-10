import { OriginPanelMenuButton } from '@/panels/OriginPanel/OriginPanelMenuButton';
import { Title, Group, Kbd, Center, Text, Stack, List, Image } from '@mantine/core';
import { AltitudeMouse } from '../MouseDescriptions/AltitudeMouse';
import { Mouse } from '../MouseDescriptions/Mouse';
import { MouseWithModifier } from '../MouseDescriptions/MouseWithModifier';
import { NavigationMouse } from '../MouseDescriptions/NavigationMouse';
import { AltitudeTask } from '../Tasks/AltitudeTask';
import { ClearSkyButton } from '../Tasks/Components/ClearSkyButton';
import { CurrentAltitude } from '../Tasks/Components/CurrentAltitude';
import { CurrentFocus } from '../Tasks/Components/CurrentFocus';
import { CurrentLatLong } from '../Tasks/Components/CurrentLatLong';
import { FocusTask } from '../Tasks/FocusTask';
import { NavigationTask } from '../Tasks/NavigationTask';

export const NavigationSteps: React.JSX.Element[] = [
  <>
    <Title>Navigation</Title>
    In this chapter we will learn about navigating in OpenSpace.
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
    <List type="ordered" withPadding w={'100%'}>
      <List.Item>
        <Group justify={'space-between'}>
          <Text fs={'italic'} flex={1}>
            Scroll click and drag
          </Text>
          <Mouse mouseClick={'scroll'} arrowDir={'horizontal'} m={'lg'} />
        </Group>
      </List.Item>
      <List.Item>
        <Group>
          <Text flex={1} fs={'italic'}>
            Left click and drag + shift
          </Text>
          <MouseWithModifier
            mouseClick={'left'}
            arrowDir={'horizontal'}
            modifier={'shift'}
          />
        </Group>
      </List.Item>
    </List>
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
  <>
    Great! Now you now how to navigate in OpenSpace. Let's move on to changing the time!
  </>
];
