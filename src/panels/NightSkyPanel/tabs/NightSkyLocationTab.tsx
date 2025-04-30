import { useOpenSpaceApi } from '@/api/hooks';
import { useBoolProperty } from '@/hooks/properties';
import { useAppSelector } from '@/redux/hooks';
import { Stack, Group, Text, Image, Space, Divider, Button, Overlay, BackgroundImage, Box, Center } from '@mantine/core';
import { AttachedToGroundKey } from '@/util/keys';
import { useSubscribeToCamera } from '@/hooks/topicSubscriptions';
import { map } from 'd3';

export function NightSkyLocationTab() {

    useSubscribeToCamera();
    const [attachedToGround, setAttachedToGround] = useBoolProperty(AttachedToGroundKey);
    
    function dotPosition() {
        //x = (longitude + 180) * (mapWidth / 360)
        //y = (90 - latitude) * (mapHeight / 180)
    }

    const { latitude: currentLat, longitude: currentLong, altitude: currentAlt } = useAppSelector(
        (state) => {
            if (attachedToGround) {
                return {
                    latitude: state.properties.properties["Scene.NightSkyGround.Translation.Latitude"]?.value as Number,
                    longitude: state.properties.properties["Scene.NightSkyGround.Translation.Longitude"]?.value as Number,
                    altitude: state.properties.properties["Scene.NightSkyGround.Translation.Altitude"]?.value as Number,
                }
            } else {
                return state.camera
            }
        }
    );

    return (
        <>
                <Space h="lg"></Space>
                Globe position - Latitude: {currentLat?.toFixed(2)}, Longitude: {currentLong?.toFixed(2)}, Altitude: {currentAlt?.toFixed(2)}m
                <Space h="lg"></Space>
                <Box maw={300} mx="auto">
                    <BackgroundImage src='worldmap-gray.png' radius={'lg'} />
                    <Center p="md">
                        <Image src={'worldmap-gray.png'} mah={800} maw={800} />
                        <Image src={'openspace-logo.png'} mah={10} maw={10} mb={'lg'} />
                    </Center>
                </Box>
                <Divider mt={5} />
                <Space h="lg"></Space>
                <Text style={{ flexGrow: 12, maxWidth: '100%' }}>Movement Buttons (only when attached to ground)</Text>
                <Space h="lg"></Space>
                <Stack>
                    <Group>
                        <Button>North 1 Degree</Button>
                        <Button>North 5 Degrees</Button>
                        <Button>North 10 Degrees</Button>
                        <Button>North to Equator</Button>
                        <Button>North to pole</Button>
                    </Group>
                    <Group>
                        <Button>South 1 Degree</Button>
                        <Button>South 5 Degrees</Button>
                        <Button>South 10 Degrees</Button>
                        <Button>South to Equator</Button>
                        <Button>South to pole</Button>
                    </Group>
                    <Space h="xs"></Space>
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
        </>
    );
}