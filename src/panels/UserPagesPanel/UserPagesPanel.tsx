import React, { useState } from 'react';
import { MdWeb } from 'react-icons/md';

import {
  addUserPanel,
  loadUserPanelData,
  setPopoverVisibility
} from '../../../api/Actions';

import { useOpenSpaceApi } from '@/api/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Button, Container, Divider, Group, Select, Text, TextInput, Title } from '@mantine/core';
import { UserPageIcon } from '@/icons/icons';

function UserControlPanel() {
  const [selectedPanel, setSelectedPanel] = useState('selectedPanel');
  const [panelURL, setPanelURL] = useState<string | undefined>(undefined);

  // const popoverVisible = useAppSelector(
  //   (state) => state.local.popovers.userControlPanel.visible
  // );
  const luaApi = useOpenSpaceApi();
  const isDataInitialized = useAppSelector((state) => state.userPanels.isInitialized);

  const panelList = useAppSelector((state) => state.userPanels.panels || []);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (luaApi && !isDataInitialized) {
      dispatch(loadUserPanelData(luaApi));
    }
  }, [dispatch]);

  function togglePopover() {
    // Todo MICAH this was to avoid creating a topic
    // Didnt feel right making a topic just for this
    // Thinking to adda a generic folder watching topic
    if (!popoverVisible) {
      dispatch(loadUserPanelData(luaApi));
    }
    dispatch(
      setPopoverVisibility({
        popover: 'userControlPanel',
        visible: !popoverVisible
      })
    );
  }

  function updatePanelSelection(selection) {
    setSelectedPanel(selection.value);
  }

  function addPanel() {
    dispatch(addUserPanel(selectedPanel));
  }

  function addWebPanel() {
    if (panelURL && panelURL.indexOf('http') !== 0) {
      dispatch(addUserPanel(`http://${panelURL}`));
    } else {
      dispatch(addUserPanel(panelURL));
    }
  }

  function updatePanelURL(evt: ) {
    setPanelURL(evt.target.value);
  }

    const placeholderText = 'Loading pages';
    const options = Object.values(panelList).map((panel) => ({
      value: panel.path,
      label: panel.name
    }));

    return (
      <Container>
          <Group>
            <Select
              placeholder={placeholderText}
              data={options}
              label="Select Panel"
              onChange={updatePanelSelection}
              value={selectedPanel}
            />

            <Group>
              <Button
                onClick={addPanel}
                title="Add panel"
                style={{ width: 90 }}
                disabled={!selectedPanel}
              >
                <UserPageIcon />
                <Text>Add Panel</Text>
              </Button>
            </Group>
          </Group>
          <Divider />
          <Group>
            <Title>Add via HTTP</Title>
            <div className="urlbox">
              <TextInput
                value={panelURL}
                label="URL"
                placeholder="URL"
                onChange={(evt) => updatePanelURL(evt)}
              />
            </div>
            <Group>
              <Button
                onClick={addWebPanel}
                title="Add panel"
                style={{ width: 90 }}
                disabled={!panelURL}
              >
                                <UserPageIcon />

                <Text>Add Panel</Text>
              </Button>
            </Group>
          </Group>
        </Container>
    );
}

export default UserControlPanel;
