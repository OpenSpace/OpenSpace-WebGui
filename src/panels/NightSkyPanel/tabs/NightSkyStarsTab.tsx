import { useOpenSpaceApi } from '@/api/hooks';
import { Group, Text, Space, Divider, Button, Paper } from '@mantine/core';
import { BoolInput } from '@/components/Input/BoolInput';
import { useProperty } from '@/hooks/properties';
import { StarsDimInAtmosphereKey, StarsRenderableKey, StarLabelsRenderableKey, StarLabelsAlternateRenderableKey } from '@/util/keys';

export function NightSkyStarsTab() {

    const luaApi = useOpenSpaceApi();

    const [starsDimInAtm, setStarsDimInAtm] = useProperty('BoolProperty', StarsDimInAtmosphereKey);
    const [starsEnabled] = useProperty('BoolProperty', StarsRenderableKey + ".Enabled");
    const [starsLabelsEnabled] = useProperty('BoolProperty', StarLabelsRenderableKey + ".Enabled");
    const [starsLabelsAltEnabled] = useProperty('BoolProperty', StarLabelsAlternateRenderableKey + ".Enabled");

    return (
        <>
            <Space h={'xl'}></Space>
            <Group>
                <Text size='xl'>Visibility</Text>
                <Space h={'lg'}></Space>
                <Group>
                    <BoolInput
                        label={'Show During day'}
                        info={'Check this box to show the stars during the daytime'}
                        value={!starsDimInAtm || false}
                        onChange={ () => {setStarsDimInAtm(!starsDimInAtm)} }
                    />
                    <BoolInput
                        label={'Hide always'}
                        info={'Check this box to never see the stars, even at night or in space.'}
                        value={!starsEnabled || false}
                        onChange={ () => {
                            if (starsEnabled) {
                                luaApi?.fadeOut(StarsRenderableKey)
                            } else {
                                luaApi?.fadeIn(StarsRenderableKey)
                            }
                        } }
                    />
                </Group>
            </Group>
            <Space h={'lg'}></Space>
            <Group>
                <Text size='xl'>Labels</Text>
                <Space h={'lg'}></Space>
                <Group>
                <BoolInput
                        label={'Show Labels'}
                        info={''}
                        value={starsLabelsEnabled || false}
                        onChange={ () => {
                            if (starsLabelsEnabled) {
                                luaApi?.fadeOut(StarLabelsRenderableKey)
                            } else {
                                luaApi?.fadeIn(StarLabelsRenderableKey)
                            }
                        } }
                />
                <BoolInput
                        label={'Show Alternate Labels'}
                        info={''}
                        value={starsLabelsAltEnabled || false}
                        onChange={ () => {
                            if (starsLabelsAltEnabled) {
                                luaApi?.fadeOut(StarLabelsAlternateRenderableKey)
                            } else {
                                luaApi?.fadeIn(StarLabelsAlternateRenderableKey)
                            }
                        } }
                />

                </Group>
            </Group>
            <Divider my={'md'}></Divider>
            <Group>
                <Group my={'xl'}>
                    <Paper shadow="xs" p="xl" mb={'md'}>Note: The buttons below only work in the 'nightsky' profile. Use the profile editor to edit the actions and ajust the values for your dome.</Paper>
                    <Text size='xl'>Appearance</Text>
                    <Button onClick={()=> {luaApi?.action.triggerAction('os.nightsky.DefaultStars')}}>Default settings</Button>
                    <Button onClick={()=> {luaApi?.action.triggerAction('os.nightsky.PointlikeStars')}}>More point like</Button>
                </Group>
            </Group>
        </>
    );
}