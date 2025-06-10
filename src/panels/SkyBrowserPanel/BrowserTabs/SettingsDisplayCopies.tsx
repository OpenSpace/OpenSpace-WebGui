import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Box, Button, Group, InputLabel, Paper, Text, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { InfoBox } from '@/components/InfoBox/InfoBox';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { Property } from '@/components/Property/Property';
import { VectorDefaultView } from '@/components/Property/Types/VectorProperty/ViewOptions/VectorDefaultView';
import { SettingsPopout } from '@/components/SettingsPopout/SettingsPopout';
import { MinusIcon, PlusIcon } from '@/icons/icons';
import { useAppSelector } from '@/redux/hooks';

interface Props {
  id: string;
}
export function SettingsDisplayCopies({ id }: Props) {
  const [newPosition, setNewPosition] = useState<[number, number, number]>([0, 0, -2]);
  const [nCopies, setNCopies] = useState(1);
  const luaApi = useOpenSpaceApi();
  const displayCopies = useAppSelector(
    (state) => state.skybrowser.browsers[id]?.displayCopies
  );
  const { t } = useTranslation('panel-skybrowser', {
    keyPrefix: 'settings.display-copies'
  });
  return (
    <>
      <Title order={4} mb={'sm'}>
        {t('copies.title')}
      </Title>
      <Group grow preventGrowOverflow={false}>
        <Button
          onClick={() => luaApi?.skybrowser.addDisplayCopy(id, nCopies, newPosition)}
          leftSection={<PlusIcon />}
          flex={1}
        >
          {t('copies.add')}
        </Button>
        <Button
          onClick={() => luaApi?.skybrowser.removeDisplayCopy(id)}
          leftSection={<MinusIcon />}
          flex={1}
        >
          {t('copies.remove')}
        </Button>
        <SettingsPopout
          flex={0}
          popoverWidth={300}
          title={t('copies.display-copies-settings.title')}
        >
          <Box p={'sm'}>
            <Group>
              <InputLabel fw={'normal'}>
                <Text span size={'sm'}>
                  {t('copies.display-copies-settings.number-of-copies.label')}
                </Text>
              </InputLabel>
              <InfoBox>
                {t('copies.display-copies-settings.number-of-copies.tooltip')}
              </InfoBox>
            </Group>
            <NumericInput value={nCopies} onEnter={setNCopies} />
            <Group mt={'sm'}>
              <InputLabel fw={'normal'}>
                <Text span size={'sm'}>
                  {t('copies.display-copies-settings.position-for-copies.label')}
                </Text>
              </InputLabel>
              <InfoBox>
                {t('copies.display-copies-settings.position-for-copies.tooltip')}
              </InfoBox>
            </Group>
            <Box pb={'sm'}>
              <VectorDefaultView
                value={newPosition}
                setPropertyValue={(value) =>
                  setNewPosition(value as [number, number, number])
                }
                disabled={false}
                additionalData={{
                  min: [-10, -10, -10],
                  max: [10, 10, 10],
                  step: [1, 1, 1],
                  exponent: 1
                }}
              />
            </Box>
          </Box>
        </SettingsPopout>
      </Group>
      <Title order={4} mt={'md'} mb={'sm'}>
        {t('display-settings-title')}
      </Title>
      <Property uri={`ScreenSpace.${id}.Scale`} />
      <Property uri={`ScreenSpace.${id}.FaceCamera`} />
      <Property uri={`ScreenSpace.${id}.UseRadiusAzimuthElevation`} />
      <Property uri={`ScreenSpace.${id}.Reload`} />

      <Collapsable
        title={
          <Group>
            {t('added-copies')}
            <Badge variant={'default'}>{Object.keys(displayCopies).length}</Badge>
          </Group>
        }
      >
        {Object.keys(displayCopies).length === 0 && <Text>{t('no-copies')}</Text>}
        {Object.entries(displayCopies).map(([key, entry]) => (
          <Paper key={key} p={'sm'} mt={'sm'}>
            <Property uri={`ScreenSpace.${id}.${entry.idShowProperty}`} />
            <Property uri={`ScreenSpace.${id}.${key}`} />
          </Paper>
        ))}
      </Collapsable>
    </>
  );
}
