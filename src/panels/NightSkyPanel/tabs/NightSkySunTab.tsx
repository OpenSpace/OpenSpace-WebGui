import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { MoonPerformShadingKey } from '@/util/keys';
import { Stack, Group, Text, Image, Space, Divider, Button, BackgroundImage, Paper, Title } from '@mantine/core';
import { useProperty } from '@/hooks/properties';
import { DatePickerInput } from '@mantine/dates'
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { SceneGraphNodeHeader } from '@/panels/Scene/SceneGraphNode/SceneGraphNodeHeader';
import { sgnUri } from '@/util/propertyTreeHelpers';
import { useState } from 'react';
import { CalendarIcon } from '@/icons/icons';
import { size } from 'lodash';

export function NightSkySunTab() {

    const openspace = useOpenSpaceApi();

    const propertyOwners = useAppSelector((state) => state.propertyOwners.propertyOwners);
    
    const addedTrails = Object.values(propertyOwners).filter((owner) =>
        owner!.tags.includes('sun_trail')
    );
    
    let AngularSizeKey = "Scene.EarthAtmosphere.Renderable.SunAngularSize";
    const [angularSize, setAngularSize] = useProperty('FloatProperty', AngularSizeKey);
    
    const [trailDate, setTrailDate] = useState<Date | null>(null);

    function addTrail(date: string):void {
        openspace?.action.triggerAction('os.nightsky.AddSunTrail', {Date: date});
    }


    return (
        <>
            <Text size={'xl'} mb={'xl'}>Glare</Text>
            <Group>
                <Button onClick={()=> {openspace?.fadeIn("Scene.SunGlare.Renderable")}}>Show Glare</Button>
                <Button onClick={()=> {openspace?.fadeOut("Scene.SunGlare.Renderable")}}>Hide Glare</Button>
            </Group>
            <Text size='xl' my={'xl'}>Size</Text>
            <Group>
                <Button onClick={()=> {
                    openspace?.setPropertyValueSingle(AngularSizeKey, 0.300000)
                }}>Default Angular Size</Button>
                <Button onClick={()=> {
                    openspace?.setPropertyValueSingle(AngularSizeKey, 0.600000)
                }}>Large Angular Size</Button>
                <Button onClick={()=> {
                    openspace?.setPropertyValueSingle(AngularSizeKey, 0.800000)
                }}>Extra Large Angular Size</Button>
                <Button onClick={ async () => {
                    if (angularSize) {
                        setAngularSize(angularSize + 0.1)
                    }
                }}>+</Button>
                <Button onClick={()=> {
                    if (angularSize) {
                        setAngularSize(angularSize - 0.1)
                    }
                }}>-</Button>
            </Group>
            <Divider mt={'xl'} mb={'md'}></Divider>
            <Text my={'md'} size='xl'>Trails</Text>
            <Group my={'md'}>
                <Button onClick={()=> {addTrail('NOW')}}>Add trail for simulation date</Button>
                <Button onClick={()=> {addTrail('UTC')}}>Add trail for today </Button>
            </Group>

            <DatePickerInput
                leftSection={<CalendarIcon size={18} />}
                leftSectionPointerEvents="none"
                label="Choose date"
                placeholder=""
                value={trailDate}
                onChange={setTrailDate}
                my={'md'}
            />
            <Button onClick={()=> {
                if (trailDate) {
                    addTrail(trailDate.toISOString())
                }
            }}>Add Trail</Button>

            <Group mt={'xl'}>
                <Title order={3}>Added Sun Trails</Title> 
                <Button size={'compact-md'} onClick={()=>{
                    openspace?.fadeOut("{sun_trail}")
                }}>Hide All</Button>
            </Group>
            <Space h={'lg'}></Space>
            {addedTrails.length === 0 ? (
                <Text>No sun trails</Text>
            ) : (
            addedTrails.map(
                (trail) =>
                trail && (
                    <SceneGraphNodeHeader
                    key={trail.identifier}
                    uri={sgnUri(trail.identifier)}
                    />
                )
            )
            )}


        </>
    );
}