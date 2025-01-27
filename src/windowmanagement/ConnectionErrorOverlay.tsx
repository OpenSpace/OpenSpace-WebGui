import { Button, Group, Modal, Skeleton } from '@mantine/core';

import { isConnecting, isDisconnected } from '@/redux/connection/connectionSlice';
import { useAppSelector } from '@/redux/hooks';

export function ConnectionErrorOverlay() {
  const connectionStatus = useAppSelector((state) => state.connection.connectionStatus);
  const connectionLost = isDisconnected(connectionStatus);
  const connecting = isConnecting(connectionStatus);

  const header = "Houston, we've had a...";
  const line1 = '...disconnection between the user interface and OpenSpace.';
  const line2 = 'Trying to reconnect automatically, but you may want to...';
  const line3 = 'Reload the user interface';

  return (
    <>
      {connecting && (
        <Modal.Root opened={true} onClose={() => {}} centered>
          <Modal.Overlay backgroundOpacity={0.55} blur={3} />
          <Modal.Content>
            <Modal.Header>
              <h2>Houston, we are ready to connect...</h2>
            </Modal.Header>
            <Modal.Body>
              <p style={{ margin: 0 }}>Connecting to OpenSpace...</p>
              <Group gap={1} align={'baseline'}>
                <p style={{ margin: 0 }}>Please wait</p>
                <Skeleton height={6} circle />
                <Skeleton height={6} circle />
                <Skeleton height={6} circle />
              </Group>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}
      {connectionLost && (
        <Modal.Root opened={true} onClose={() => {}} centered>
          <Modal.Overlay backgroundOpacity={0.55} blur={3} />
          <Modal.Content>
            <Modal.Header>
              <h2>{header}</h2>
            </Modal.Header>
            <Modal.Body>
              <p>{line1}</p>
              <p>{line2}</p>
              <Button data-autofocus onClick={() => window.location.reload()}>
                {line3}
              </Button>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      )}
    </>
  );
}
