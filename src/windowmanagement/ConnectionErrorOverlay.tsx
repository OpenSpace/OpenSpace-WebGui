import { Button, Center, Loader, Modal, Text, Title } from '@mantine/core';

import { isConnecting, isDisconnected } from '@/redux/connection/connectionSlice';
import { useAppSelector } from '@/redux/hooks';

export function ConnectionErrorOverlay() {
  const connectionStatus = useAppSelector((state) => state.connection.connectionStatus);
  const connectionLost = isDisconnected(connectionStatus);
  const connecting = isConnecting(connectionStatus);

  return (
    <>
      {connecting && (
        <Modal.Root opened={true} onClose={() => {}} centered>
          <Modal.Overlay backgroundOpacity={0.55} blur={3} />
          <Modal.Content>
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
      {connectionLost && (
        <Modal.Root opened={true} onClose={() => {}} centered>
          <Modal.Overlay backgroundOpacity={0.55} blur={3} />
          <Modal.Content>
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
