import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Select, Text, Title } from '@mantine/core';

import { EarthPanel } from './AnchorPanels/EarthPanel/EarthPanel';

export function GeoLocationPanel() {
  const [currentAnchorOption, setCurrentAnchorOption] = useState('Earth');
  const { t } = useTranslation('geolocationpanel');
  const anchorOptions = ['Earth'];
  const anchorPanelContent = anchorPanel();

  function anchorPanel() {
    switch (currentAnchorOption) {
      case 'Earth':
        return <EarthPanel currentAnchor={currentAnchorOption} />;
      default:
        return (
          <Text>{t('geolocation.no-anchor-panel', { anchor: currentAnchorOption })}</Text>
        );
    }
  }

  return (
    <>
      <Title order={2}>{t('geolocation.title')}</Title>
      <Select
        data={anchorOptions}
        value={currentAnchorOption}
        onChange={(value) => setCurrentAnchorOption(value!)}
        allowDeselect={false}
        label={t('geolocation.select-anchor-label')}
        w={'100%'}
        my={'xs'}
      />
      <Divider my={'xs'} />
      {anchorPanelContent}
    </>
  );
}
