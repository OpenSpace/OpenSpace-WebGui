import { useState } from 'react';
import { Container, Group, SegmentedControl, Select, Text } from '@mantine/core';

import { Tooltip } from '@/components/Tooltip/Tooltip';

import { EarthPanel } from './AnchorPanels/EarthPanel';

export enum GeoInteraction {
  Fly = 'Fly To',
  Jump = 'Jump To',
  AddFocus = 'Add Focus'
}

type GeoInteractionKey = keyof typeof GeoInteraction;

export function GeoLocationPanel() {
  const [geoInteraction, setGeoInteraction] = useState(GeoInteraction.Fly);
  const [currentAnchorOption, setCurrentAnchorOption] = useState('Earth');
  const anchorOptions = ['Earth'];

  const segmentedControlData = Object.entries(GeoInteraction).map(
    ([key, labelValue]) => ({
      label: labelValue,
      value: key
    })
  );

  // SegmentedControl wants the data key and not value to display the selected choice
  const geoInteractionKey = Object.keys(GeoInteraction).find(
    (key) => GeoInteraction[key as GeoInteractionKey] === geoInteraction
  );

  function onSegmentedControlChange(value: string) {
    // The value we get back is one of the keys in `GeoInteraction`, we map the selected
    // value back to its corresonding enum value
    const selectedInteraction = value as GeoInteractionKey;
    const interaction = GeoInteraction[selectedInteraction];
    setGeoInteraction(interaction);
  }

  function anchorPanel() {
    switch (currentAnchorOption) {
      case 'Earth':
        return <EarthPanel currentAnchor={currentAnchorOption} />;
      default:
        return (
          <Text>Currently there is no data for locations on {currentAnchorOption}</Text>
        );
    }
  }

  return (
    <Container>
      <h2>Geo Location</h2>
      {/* <Group gap={'xs'}>
        <Group>
          <Text>Mode</Text>
          <Tooltip
            text={
              "'Fly to' will fly the camera to the position, " +
              "'Jump to' will place the camera at the position instantaneously and " +
              "'Add Focus' will add a scene graph node at the position."
            }
          />
        </Group>
        <SegmentedControl
          value={geoInteractionKey}
          onChange={onSegmentedControlChange}
          data={segmentedControlData}
          radius={'xl'}
          style={{ flexGrow: 1 }}
        />
      </Group> */}
      <Select
        data={anchorOptions}
        value={currentAnchorOption}
        onChange={(value) => setCurrentAnchorOption(value!)}
        allowDeselect={false}
        label={'Select an anchor'}
        w={'100%'}
      />
      {anchorPanel()}
    </Container>
  );
}
