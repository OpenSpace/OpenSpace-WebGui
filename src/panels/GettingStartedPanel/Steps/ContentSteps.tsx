import { SceneIcon, FocusIcon } from '@/icons/icons';
import { IconSize } from '@/types/enums';
import { Group } from '@mantine/core';
import { AltitudeMouse } from '../MouseDescriptions/AltitudeMouse';
import { MouseWithModifier } from '../MouseDescriptions/MouseWithModifier';
import { AltitudeTask } from '../Tasks/AltitudeTask';
import { SetBoolPropertyTask } from '../Tasks/ChangePropertyTask';
import { FocusTask } from '../Tasks/FocusTask';
import { MarsTrailColorTask } from '../Tasks/MarsTrailColorTask';
import { Text } from '@mantine/core';

export const ContentSteps = [
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
  </>
];
