import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('panel-globebrowsing', { keyPrefix: 'add-server-modal' });

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
          <Modal.Title>{t('title')}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          <Stack gap={'xs'}>
            <StringInput
              onEnter={setServerName}
              value={serverName}
              placeholder={t('placeholders.name')}
            />
            <StringInput
              onEnter={setServerUrl}
              value={serverUrl}
              placeholder={t('placeholders.url')}
            />
            <Group>
              <Button onClick={addServer}>{t('buttons.add')}</Button>
              <Button onClick={onClose}>{t('buttons.cancel')}</Button>
            </Group>
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
