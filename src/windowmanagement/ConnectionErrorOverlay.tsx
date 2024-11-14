//import { useLocation } from 'react-router-dom';
import { Button, Modal } from '@mantine/core';

import { useAppSelector } from '@/redux/hooks';

export function ConnectionErrorOverlay() {
  const connectionLost = useAppSelector((state) => state.connection.connectionLost);
  //const location = useLocation();

  const header = "Houston, we've had a...";
  const line1 = '...disconnection between the user interface and OpenSpace.';
  const line2 = 'Trying to reconnect automatically, but you may want to...';
  const line3 = 'Reload the user interface';

  function reloadGui() {
    //if (location.reload) {
    //  location.reload();
    //}
    console.log('TODO: Reload');
  }

  return (
    connectionLost && (
      <Modal.Root opened={true} onClose={() => {}} centered>
        <Modal.Overlay backgroundOpacity={0.55} blur={3} />
        <Modal.Content>
          <Modal.Header>
            <h2>{header}</h2>
          </Modal.Header>
          <Modal.Body>
            <p>{line1}</p>
            <p>{line2}</p>
            <Button data-autofocus onClick={reloadGui}>
              {line3}
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    )
  );
}
