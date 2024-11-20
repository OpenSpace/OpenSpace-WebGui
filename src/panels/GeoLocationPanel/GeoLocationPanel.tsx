import { useState } from 'react';
import { Container, Select, Text, Title } from '@mantine/core';

import { EarthPanel } from './AnchorPanels/EarthPanel';

export function GeoLocationPanel() {
  const [currentAnchorOption, setCurrentAnchorOption] = useState('Earth');
  const anchorOptions = ['Earth'];
  const anchorPanelContent = anchorPanel();

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
      <Title order={2}>Geo Location</Title>
      <Select
        data={anchorOptions}
        value={currentAnchorOption}
        onChange={(value) => setCurrentAnchorOption(value!)}
        allowDeselect={false}
        label={'Select an anchor'}
        w={'100%'}
      />
      {anchorPanelContent}
    </Container>
  );
}
