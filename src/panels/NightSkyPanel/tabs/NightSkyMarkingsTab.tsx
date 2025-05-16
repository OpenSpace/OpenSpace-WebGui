import { Text, Grid, Title, Space, Button, Affix } from '@mantine/core';

import { IconLabelButton } from "../components/IconLabelButton";
import { useOpenSpaceApi } from '@/api/hooks';

export function NightSkyMarkingsTab() {
    const openspace = useOpenSpaceApi();
    
  return (
    <>
    <Button mb={'lg'} fullWidth onClick={()=>{
        openspace?.action.triggerAction("os.nightsky.HideAllMarkings")
    }}>HIDE ALL</Button>
    <Text my={'md'}>Alt/Az</Text> 
    <Grid columns={16} gutter={'sm'}>
        <Grid.Col span={4}><IconLabelButton title="Grid" icon="grid" identifier="AltAzGrid"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Meridian" icon="line" identifier="MeridianPlane"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Labels" icon="text" identifier="AltAzGridLabels"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Zenith" icon="dot" identifier="ZenithDot"/></Grid.Col>
    </Grid>
    <Text my={'md'}>Ecliptic</Text> 
    <Grid columns={16} gutter={'sm'}>
        <Grid.Col span={4}><IconLabelButton title="Grid" icon="grid" identifier="EclipticSphere"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Line" icon="line" identifier="EclipticLine"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Labels" icon="text" identifier="EclipticSphereLabels"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Band" icon="band" identifier="EclipticBand"/></Grid.Col>
    </Grid>
    <Text my={'md'}>Equatorial</Text> 
    <Grid columns={16} gutter={'sm'}>
        <Grid.Col span={4}><IconLabelButton title="Grid" icon="grid" identifier="EquatorialSphere"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Line" icon="line" identifier="EquatorialLine"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Labels" icon="text" identifier="EquatorialSphereLabels"/></Grid.Col>
    </Grid>
    <Text my={'md'}>Constellations</Text> 
    <Grid columns={16} gutter={'sm'}>
        <Grid.Col span={4}><IconLabelButton title="Grid" icon="grid" identifier="ConstellationBounds"/></Grid.Col>
        <Grid.Col span={4}>
            <IconLabelButton 
                title="Lines" 
                icon="pencil" 
                identifier="Constellations" 
                onAction="os.nightsky.ShowConstellationElements" 
                offAction="os.nightsky.HideConstellationElements"
                boolProp="Scene.Constellations.Renderable.DrawElements"
            />
        </Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Art" icon="paint" identifier='ImageConstellation-Ori' onAction="os.constellation_art.ShowArt" offAction="os.constellation_art.HideArt"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton title="Labels" icon="text" identifier='Scene.Constellations.Renderable.Labels' onAction="os.nightsky.FadeInConstalltionLabels" offAction="os.nightsky.FadeOutConstalltionLabels"/></Grid.Col>
    </Grid>
    <Text my={'md'}>Cardinal Directions</Text> 
    <Grid columns={16} gutter={'sm'}>
        <Grid.Col span={4}>
            <IconLabelButton 
                title="Small" 
                icon="compasssmall" 
                onAction="os.nightsky.ShowNeswLettersSmall" 
                offAction="os.nightsky.HideNesw"
                directionCheck="red_small.png"
                />
            </Grid.Col>
        <Grid.Col span={4}><IconLabelButton directionCheck="red.png" title="Large" icon="compasslarge" onAction="os.nightsky.ShowNeswLetters" offAction="os.nightsky.HideNesw"/></Grid.Col>
        <Grid.Col span={4}><IconLabelButton directionCheck="_lines_" title="Marks" icon="compassmarks" onAction="os.nightsky.AddNeswBandMarks" offAction="os.nightsky.RemoveNeswBandMarks"/></Grid.Col>
    </Grid>
    </>
);
}