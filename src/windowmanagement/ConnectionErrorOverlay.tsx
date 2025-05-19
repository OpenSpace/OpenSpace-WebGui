import { Button, Center, Loader, Modal, Text, Title } from '@mantine/core';

import { useIsConnectionStatus } from '@/hooks/util';
import { ConnectionStatus } from '@/types/enums';

export function ConnectionErrorOverlay() {
  const connectionLost = useIsConnectionStatus(ConnectionStatus.Disconnected);
  const connecting = useIsConnectionStatus(ConnectionStatus.Connecting);

  return (
    <>
      {false && connecting && (
        <Modal.Root opened={true} onClose={() => {}} centered>
          <Modal.Overlay backgroundOpacity={0.55} blur={3} />
          <Modal.Content title={'Connecting to OpenSpace'}>
            <Modal.Header>
              <Title order={2}>Houston, we are ready to connect...</Title>
            </Modal.Header>
            <Modal.Body>
              <Text>Connecting to OpenSpace... Please wait</Text>
              <Center>
                <Loader m={'lg'} />
              </Center>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}
      {false && connectionLost && (
        <Modal.Root opened={true} onClose={() => {}} centered>
          <Modal.Overlay backgroundOpacity={0.55} blur={3} />
          <Modal.Content title={'Reconnecting to OpenSpace'}>
            <Modal.Header>
              <Title order={2}>Houston, we've had a...</Title>
            </Modal.Header>
            <Modal.Body>
              <Text mb={'md'}>
                ...disconnection between the user interface and OpenSpace.
              </Text>
              <Text mb={'md'}>
                Trying to reconnect automatically, but you may want to...
              </Text>
              <Button data-autofocus onClick={() => window.location.reload()}>
                Reload the user interface
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}
    </>
  );
}
