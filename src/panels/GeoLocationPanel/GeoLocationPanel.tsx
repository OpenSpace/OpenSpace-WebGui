import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Select, Text } from '@mantine/core';

import { EarthPanel } from './AnchorPanels/EarthPanel/EarthPanel';

export function GeoLocationPanel() {
  const [currentAnchorOption, setCurrentAnchorOption] = useState('Earth');
  const { t } = useTranslation('panel-geolocation');
  const anchorOptions = ['Earth'];
  const anchorPanelContent = anchorPanel();

  function anchorPanel() {
    switch (currentAnchorOption) {
      case 'Earth':
        return <EarthPanel currentAnchor={currentAnchorOption} />;
      default:
        return <Text>{t('no-anchor-panel', { currentAnchorOption })}</Text>;
    }
  }

  return (
    <>
      <Select
        data={anchorOptions}
        value={currentAnchorOption}
        onChange={(value) => setCurrentAnchorOption(value!)}
        allowDeselect={false}
        label={t('select-anchor-label')}
        w={'100%'}
      />
      <Divider my={'xs'} />
      {anchorPanelContent}
    </>
  );
}
