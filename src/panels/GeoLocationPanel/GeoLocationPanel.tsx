import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Divider, ScrollArea, Select, Text, Title } from '@mantine/core';

import { EarthPanel } from './AnchorPanels/EarthPanel/EarthPanel';

export function GeoLocationPanel() {
  const [currentAnchorOption, setCurrentAnchorOption] = useState('Earth');
  const { t } = useTranslation('geolocationPanel');
  const anchorOptions = ['Earth'];
  const anchorPanelContent = anchorPanel();

  function anchorPanel() {
    switch (currentAnchorOption) {
      case 'Earth':
        return <EarthPanel currentAnchor={currentAnchorOption} />;
      default:
        return <Text>{t('noPanelAvailable', { anchor: currentAnchorOption })}</Text>;
    }
  }

  return (
    <ScrollArea h={'100%'}>
      <Container>
        <Title order={2}>Geo Location</Title>
        <Select
          data={anchorOptions}
          value={currentAnchorOption}
          onChange={(value) => setCurrentAnchorOption(value!)}
          allowDeselect={false}
          label={t('selectAnchor')}
          w={'100%'}
          my={'xs'}
        />
        <Divider my={'xs'} />
        {anchorPanelContent}
      </Container>
    </ScrollArea>
  );
}
