import { Group, Grid, Title, Space } from '@mantine/core';

import { IconLabelButton } from "../components/IconLabelButton";

export function NightSkyMarkingsTab() {
  return (
    <>
    <Space h="md"></Space>
    <Grid>
        <Grid.Col span={2}>Altitude/Azmouth</Grid.Col> 
        <Grid.Col span={1}><IconLabelButton title="Grid" icon="grid" identifier="AltAzGrid"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Meridian" icon="line" identifier="MeridianPlane"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Labels" icon="text" identifier="AltAzGrid"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Zenith" icon="dot" identifier="ZenithDot"/></Grid.Col>
    </Grid>
    <Space h="xl"></Space>
    <Grid>
        <Grid.Col span={2}>Ecliptic</Grid.Col> 
        <Grid.Col span={1}><IconLabelButton title="Grid" icon="grid" identifier="EclipticSphere"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Line" icon="line" identifier="EclipticLine"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Labels" icon="text" identifier="EclipticSphereLabels"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Band" icon="band" identifier="EclipticBand"/></Grid.Col>
    </Grid>
    <Space h="xl"></Space>
    <Grid>
        <Grid.Col span={2}>Equator</Grid.Col> 
        <Grid.Col span={1}><IconLabelButton title="Grid" icon="grid" identifier="EquatorialSphere"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Line" icon="line" identifier="EquatorialLine"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Labels" icon="text" identifier="EquatorialSphereLabels"/></Grid.Col>
    </Grid>
    <Space h="xl"></Space>
    <Grid>
        <Grid.Col span={2}>Constellations</Grid.Col> 
        <Grid.Col span={1}><IconLabelButton title="Lines" icon="stickfigures" identifier="Constellations"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Art" icon="art" onAction="os.constellation_art.ShowArt" offAction="os.constellation_art.HideArt"/></Grid.Col>
        <Grid.Col span={1}><IconLabelButton title="Labels" icon="text" onAction="os.nightsky.FadeInConstalltionLabels" offAction="os.nightsky.FadeOutConstalltionLabels"/></Grid.Col>
    </Grid>
    </>
);
}