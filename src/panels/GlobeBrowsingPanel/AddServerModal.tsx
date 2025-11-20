import { useState } from 'react';
import { Button, Group, Modal, Stack } from '@mantine/core';

import { StringInput } from '@/components/Input/StringInput';

interface Props {
  opened: boolean;
  close: () => void;
  onAddServer: (name: string, url: string) => void;
}

export function AddServerModal({ opened, close, onAddServer }: Props) {
  const [serverName, setServerName] = useState('');
  const [serverUrl, setServerUrl] = useState('');

  function addServer() {
    if (serverName !== '' && serverUrl !== '') {
      onAddServer(serverName, serverUrl);
      setServerName('');
      setServerUrl('');
    }
  }

  function onClose() {
    setServerName('');
    setServerUrl('');
    close();
  }

  return (
    <Modal.Root opened={opened} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Add New Server</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Stack gap={'xs'}>
            <StringInput
              onEnter={setServerName}
              value={serverName}
              placeholder={'Server name'}
            />
            <StringInput
              onEnter={setServerUrl}
              value={serverUrl}
              placeholder={'Server Url'}
            />
            <Group>
              <Button onClick={addServer}>Add server</Button>
              <Button onClick={onClose}>Cancel</Button>
            </Group>
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
