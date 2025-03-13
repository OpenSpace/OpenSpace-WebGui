import { useState } from 'react';
import { Button, Group, Title } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { Property } from '@/components/Property/Property';
import { ValueList } from '@/components/Property/Types/VectorProperty/ViewOptions/DefaultValueList';
import { useAppSelector } from '@/redux/hooks';

interface Props {
  id: string;
}
export function SettingsDisplayCopies({ id }: Props) {
  const [newPosition, setNewPosition] = useState<[number, number, number]>([0, 0, -2]);
  const [noOfCopies, setNoOfCopies] = useState(1);
  const luaApi = useOpenSpaceApi();
  const displayCopies = useAppSelector(
    (state) => state.skybrowser.browsers[id]?.displayCopies
  );

  return (
    <>
      <Property uri={`ScreenSpace.${id}.Scale`} />
      <Property uri={`ScreenSpace.${id}.FaceCamera`} />
      <Property uri={`ScreenSpace.${id}.UseRadiusAzimuthElevation`} />
      <Collapsable title={'Add New Display Copy Settings'}>
        <NumericInput value={noOfCopies} onEnter={setNoOfCopies} />
        <ValueList
          value={newPosition}
          setPropertyValue={(value) => setNewPosition(value as [number, number, number])}
          name={'Position for first copy'}
          description={
            'This sets the position of the first copy. The additional copies will be evenly spread out on the Azimuth, if isUsingRadiusAzimuthElevation is enabled, otherwise it will spread on the Y axis.'
          }
          disabled={false}
          additionalData={{
            MinimumValue: [-10, -10, -10],
            MaximumValue: [10, 10, 10],
            SteppingValue: [1, 1, 1],
            Exponent: 1
          }}
          viewOptions={{}}
        />
      </Collapsable>
      <Group w={'100%'}>
        <Button
          onClick={() => {
            luaApi?.skybrowser.addDisplayCopy(id, noOfCopies, newPosition);
          }}
          flex={1}
        >
          Add
        </Button>
        <Button
          onClick={() => {
            luaApi?.skybrowser.removeDisplayCopy(id);
          }}
          flex={1}
        >
          Remove
        </Button>
      </Group>
      <Title order={2} mt={'md'} mb={'sm'}>
        Added Display Copies
      </Title>
      {Object.entries(displayCopies).map(([key, entry]) => (
        <>
          <Property uri={`ScreenSpace.${id}.${entry.idShowProperty}`} />
          <Property uri={`ScreenSpace.${id}.${key}`} />
        </>
      ))}
    </>
  );
}
