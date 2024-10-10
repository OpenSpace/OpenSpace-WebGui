import { useAppSelector } from '@/redux/hooks';
//import { useLocation } from 'react-router-dom';
import { Overlay, Button, Modal } from '@mantine/core';

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
    console.log('Reload');
  }

  return (
    connectionLost && (
      <Overlay>
        <Modal opened={true} onClose={() => {}} title={'Oh no'}>
          <h2>{header}</h2>
          <p>{line1}</p>
          <p>{line2}</p>
          <Button onClick={reloadGui}>{line3}</Button>
        </Modal>
      </Overlay>
    )
  );
}
