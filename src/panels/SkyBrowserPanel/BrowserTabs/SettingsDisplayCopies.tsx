import { Fragment, useState } from 'react';
import { Button, Group, Title, Text } from '@mantine/core';

import { useOpenSpaceApi } from '@/api/hooks';
import { Collapsable } from '@/components/Collapsable/Collapsable';
import { NumericInput } from '@/components/Input/NumericInput/NumericInput';
import { Property } from '@/components/Property/Property';
import { ValueList } from '@/components/Property/Types/VectorProperty/ViewOptions/DefaultValueList';
import { useAppSelector } from '@/redux/hooks';
import { MinusIcon, PlusIcon } from '@/icons/icons';

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
      <Collapsable
        title={<Title order={4}>Add New Display Copy Settings</Title>}
        my={'md'}
      >
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
      <Group grow>
        <Button
          onClick={() => {
            luaApi?.skybrowser.addDisplayCopy(id, noOfCopies, newPosition);
          }}
          leftSection={<PlusIcon />}
        >
          Add
        </Button>
        <Button
          onClick={() => {
            luaApi?.skybrowser.removeDisplayCopy(id);
          }}
          leftSection={<MinusIcon />}
        >
          Remove
        </Button>
      </Group>
      <Title order={4} mt={'md'} mb={'sm'}>
        Added Display Copies
      </Title>
      {Object.keys(displayCopies).length === 0 && <Text>No copies added</Text>}
      {Object.entries(displayCopies).map(([key, entry]) => (
        <Fragment key={key}>
          <Property uri={`ScreenSpace.${id}.${entry.idShowProperty}`} />
          <Property uri={`ScreenSpace.${id}.${key}`} />
        </Fragment>
      ))}
    </>
  );
}
