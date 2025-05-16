import { useOpenSpaceApi } from '@/api/hooks';
import { BoolInput } from '@/components/Input/BoolInput';
import { MoonPerformShadingKey } from '@/util/keys';
import { Group, Text, Button } from '@mantine/core';
import { useProperty } from '@/hooks/properties';

export function NightSkySolarSystemTab() {

    const luaApi = useOpenSpaceApi();

    const [performShading, setPerformShading] = useProperty('BoolProperty', MoonPerformShadingKey);
    const [moonScale, setMoonScale] = useProperty('DoubleProperty', "Scene.Moon.Scale.Scale");
    
    function action(identifier: string):void {
        luaApi?.action.triggerAction(identifier);
    }

    return (
        <>
            <Text size='xl' my={'md'}>Trails</Text>
            <Group mb='md'>
                <Button onClick={()=> {action('os.FadeDownTrails')}}>Hide ALL Trails</Button>
                <Button onClick={()=> {
                    luaApi?.fadeIn("{planetTrail_solarSystem}")
                    luaApi?.fadeOut("Scene.EarthTrail.Renderable")
                }}>Show Planet Trails</Button>
            </Group>

            <Text size='xl' my={'md'}>Labels</Text>
            <Group>
                <Button onClick={()=> {
                    luaApi?.fadeIn('{solarsystem_labels}.Renderable')
                }}>Show Labels</Button>
                <Button onClick={()=> {
                    luaApi?.fadeOut('{solarsystem_labels}.Renderable')
                }}>Hide Labels</Button>
            </Group>

            <Text size='xl' my={'md'}>Planets</Text>
            <Group>
                <Button onClick={()=> {action('os.nightsky.ShowNightSkyPlanets')}}>Show Night Sky Planets</Button>
                <Button onClick={()=> {action('os.nightsky.HideNightSkyPlanets')}}>Hide Night Sky Planets</Button>
            </Group>

            <Text size='xl' my={'md'}>Moon</Text>
            <Group>
            <Button onClick={()=> {
                    setMoonScale(1.0)
                }}>Default Scale Moon (1x)</Button>
                <Button onClick={()=> {
                    setMoonScale(2.0)
                }}>Enlarge Moon (2x)</Button>
                <Button onClick={()=> {
                    setMoonScale(4.0)
                }}>Enlarge Moon (4x)</Button>
                <Button onClick={()=> {
                    if (moonScale) {
                        setMoonScale(moonScale + 0.5)
                    }
                }}>+</Button>
                <Button onClick={()=> {
                    if (moonScale) {
                        setMoonScale(moonScale - 0.5)
                    }
                }}>-</Button>
                <BoolInput
                    label={'Show Phase'}
                    info={'Uncheck this to show the full moon always. This is equivalent to the "Perform Shading" property on the Moon.'}
                    value={performShading || false}
                    onChange={ setPerformShading }
                />
            </Group>

        </>
    );
}