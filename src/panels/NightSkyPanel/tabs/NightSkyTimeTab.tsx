import { useState } from 'react';
import { useOpenSpaceApi } from '@/api/hooks';
import { useBoolProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { Stack, Group, Text, Image, Space, Divider, Button, Overlay, BackgroundImage, Box, Center, Card, Paper } from '@mantine/core';
import { AttachedToGroundKey } from '@/util/keys';
import { useSubscribeToTime } from '@/hooks/topicSubscriptions';
import { isDateValid } from '@/redux/time/util';
import { useEffect } from 'react';

import  * as GeoTZ  from "browser-geo-tz";

import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';

export function NightSkyTimeTab() {

    async function getAreas(lat: number, lon:number): Promise<String[]> {
        return await GeoTZ.find(lat,lon);
    }
    
    const luaApi = useOpenSpaceApi();
    const timeCapped = useSubscribeToTime();
    const date = new Date(timeCapped ?? '');
    const isValidDate = isDateValid(date);
    const timeLabel = isValidDate ? date.toUTCString() : 'Date out of range';
    const [localArea, setLocalArea] = useState<String>("UTC");
    const [localTimeString, setLocalTimeString] = useState<String>("UTC");

    const { latitude: currentLat, longitude: currentLong, altitude: currentAlt } = useAppSelector(
        (state) => {            
            return state.camera
        }
    );

    useEffect(() => {
        async function getAreas(lat: number, lon:number): Promise<String[]> {
            return await GeoTZ.find(lat,lon);
        }
        
        if (currentLat && currentLong) {
            getAreas(currentLat, currentLong) .then((value) => {
                console.log('SetLocalAreaTo: ' + value);
                setLocalArea(value[0]);
                setLocalTimeString(date.toLocaleTimeString('en-US',{timeZone: localArea as string}))
            })
            .catch((error) => {
                console.error('Promise rejected with error: ' + error);
            });
           
        }
    }, [currentLat, currentLong]);

    let localTimeLabel = 'Determining location';

    useEffect(() => { 
        console.log("update label", localArea)
        let la: string = localArea as string;
        localTimeLabel = isValidDate ? date.toLocaleTimeString('en-US',{timeZone: la})  : 'Date out of range';
    }, [localArea]);

    return (
        <>
                <Space h="lg"></Space>
                <Text style={{ flexGrow: 12}}>Current Simulation Time UTC: {timeLabel}</Text>
                <Text style={{ flexGrow: 12}}>Current Simulation Time Local: {localTimeString}</Text>
                <Text style={{ flexGrow: 12}}>area: {localArea}</Text>
                
                <Space h="lg"></Space>
                <Divider mt={5} />
                <Space h="lg"></Space>
                <Text style={{ flexGrow: 12, maxWidth: '100%' }}>Change Time/Date</Text>
                <Space h="lg"></Space>
                <Stack>
                    <Group gap={"xl"}>
                        <Group>
                            <Button
                                onClick={() => {
                                    luaApi?.action.triggerAction("os.time.siderealDayIncrease");
                                }}
                            >
                                + sidereal day
                            </Button>
                            <Button
                                onClick={() => {
                                    luaApi?.action.triggerAction("os.time.siderealDayDecrease");
                                }}
                            >
                                - sidereal day
                            </Button>
                        </Group>
                        <Group>
                            <Button
                                onClick={() => {
                                    luaApi?.action.triggerAction("os.time.SolarDayIncrease");
                                }}
                            >
                                + solar day
                            </Button>
                            <Button
                                onClick={() => {
                                    luaApi?.action.triggerAction("os.time.SolarDayDecrease");
                                }}
                            >
                                - solar day
                            </Button>
                        </Group>
                    </Group>
                    <Divider mt={5} />
                    <Text style={{ flexGrow: 12, maxWidth: '100%' }}>Change rate of time</Text>
                    <Group>
                        <Button>East 1 Degree</Button>
                        <Button>East 5 Degrees</Button>
                        <Button>East 10 Degrees</Button>
                    </Group>
                    <Group>
                        <Button>West 1 Degree</Button>
                        <Button>West 5 Degrees</Button>
                        <Button>West 10 Degrees</Button>
                    </Group>
                    <Space h="xs"></Space>
                    <Group>
                        <Button>Raise Altitude</Button>
                        <Button>Lower Altutude</Button>
                    </Group>
                </Stack>
                <Divider mt={5} />
                <Space h="lg"></Space>
                <Paper shadow="xs" p="xl">
                    <Text>Only some of the time controls are found here. For more control over time, use the time panel.</Text>
                </Paper>
        </>
    );
}