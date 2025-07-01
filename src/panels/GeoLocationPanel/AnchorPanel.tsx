import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EarthPanel } from './AnchorPanels/EarthPanel/EarthPanel';
import { Divider, Select, Text } from '@mantine/core';

export function AnchorPanel() {
  const [currentAnchorOption, setCurrentAnchorOption] = useState('Earth');
  const { t } = useTranslation('panel-geolocation');
  const anchorOptions = ['Earth'];
  const anchorPanelContent = anchorPanel();

  function anchorPanel() {
    switch (currentAnchorOption) {
      case 'Earth':
        return <EarthPanel />;
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
