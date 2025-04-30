import { Container, Divider, Tabs, Switch, Space } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { NightSkyMarkingsTab } from './tabs/NightSkyMarkingsTab';
import { NightSkyLocationTab } from './tabs/NightSkyLocationTab';
import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@/icons/icons';
import { useOpenSpaceApi } from '@/api/hooks';
import { NightSkyTimeTab } from './tabs/NightSkyTimeTab';


export function NightSkyPanel() {

  const { ref } = useElementSize();
  const [checked, setChecked] = useState(false);
  const luaApi = useOpenSpaceApi();

  function toggleAttached(attached: boolean) {
    setChecked(attached);
    if (attached) {
      luaApi?.action.triggerAction("os.nightsky.attachToGround");
    } else {
      luaApi?.action.triggerAction("os.nightsky.detachFromGround");
    }
  }

  return (
    <Container fluid>
      <Switch
        checked={checked}
        onChange={(event) => toggleAttached(event.currentTarget.checked)}
        color="teal"
        size="md"
        label="Attached to ground"
        thumbIcon={
          checked ? (
            <CheckCircleIcon size={12} color="var(--mantine-color-teal-6)" stroke={"3"} />
          ) : (
            <XCircleIcon size={12} color="var(--mantine-color-red-6)" stroke={"3"} />
          )
        }
      />

      <Space h="lg"></Space>
      <Divider></Divider>
      <Tabs variant={'outline'} radius={'md'} defaultValue={'location'}>
        <Tabs.List ref={ref}>
          <Tabs.Tab value={'markings'}>Markings</Tabs.Tab>
          <Tabs.Tab value={'location'}>Location</Tabs.Tab>
          <Tabs.Tab value={'looking'}>Looking</Tabs.Tab>
          <Tabs.Tab value={'stars'}>Stars</Tabs.Tab>
          <Tabs.Tab value={'time'}>Time</Tabs.Tab>
          <Tabs.Tab value={'solarsystem'}>Solar System</Tabs.Tab>
          <Tabs.Tab value={'panoramas'}>Panoramas</Tabs.Tab>
          <Tabs.Tab value={'sun'}>Sun</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={'markings'}><NightSkyMarkingsTab /></Tabs.Panel>
        <Tabs.Panel value={'location'}><NightSkyLocationTab /></Tabs.Panel>
        <Tabs.Panel value={'looking'}>Looking Buttons</Tabs.Panel>
        <Tabs.Panel value={'stars'}>Stars Buttons</Tabs.Panel>
        <Tabs.Panel value={'time'}><NightSkyTimeTab /></Tabs.Panel>
        <Tabs.Panel value={'solarsystem'}>Solar System Buttons</Tabs.Panel>
        <Tabs.Panel value={'panoramas'}>Panoramas Buttons</Tabs.Panel>
        <Tabs.Panel value={'sun'}>Sun Buttons</Tabs.Panel>
      </Tabs>
    </Container>
  );
}
