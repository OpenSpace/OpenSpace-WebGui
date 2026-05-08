import { FlightControllerInputStateCommand } from 'openspace-api-js/generated';

import { sendFlightControl } from '@/redux/flightcontroller/flightControllerMiddleware';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export function FlightController() {
  const dispatch = useAppDispatch();
  const isControllerEnabled = useAppSelector((state) => state.flightController.isEnabled);
  const inputScaleFactor = useAppSelector(
    (state) => state.flightController.inputScaleFactor
  );

  const inputSensitivity = 1500;
  let mouseIsDown = false;
  let xStart = 0.0;
  let yStart = 0.0;

  const identityState: FlightControllerInputStateCommand = {
    event: 'inputState',
    inputState: {
      zoomIn: 0.0,
      orbitX: 0.0,
      orbitY: 0.0,
      panX: 0.0,
      panY: 0.0,
      localRollX: 0.0
    }
  };

  function sendFlightControlInput(input: FlightControllerInputStateCommand) {
    dispatch(sendFlightControl(input));
  }

  // The mouse events will fire on touch as well, however, we don't get the touch list
  // on pointer events which forces us to duplicate the events and handle mouse and touch
  // events separately.
  function mouseDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') {
      return;
    }
    mouseIsDown = true;
    xStart = event.clientX;
    yStart = event.clientY;
  }

  function mouseUp() {
    if (!mouseIsDown) {
      return;
    }
    mouseIsDown = false;
    sendFlightControlInput(identityState);
  }

  function mouseMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!mouseIsDown) {
      return;
    }

    const xPos = event.clientX;
    const yPos = event.clientY;
    const scaleFactor = (1.0 / inputSensitivity) * inputScaleFactor;

    const deltaX = (xStart - xPos) * scaleFactor;
    const deltaY = (yStart - yPos) * scaleFactor;

    const input: FlightControllerInputStateCommand = {
      event: 'inputState',
      inputState: {}
    };

    if (event.shiftKey) {
      input.inputState.zoomIn = deltaY;
      input.inputState.localRollX = deltaX;
    } else if (event.ctrlKey) {
      input.inputState.panX = deltaX;
      input.inputState.panY = deltaY;
    } else {
      input.inputState.orbitX = deltaX;
      input.inputState.orbitY = deltaY;
    }

    sendFlightControlInput(input);
  }

  function touchDown(event: React.TouchEvent<HTMLDivElement>) {
    xStart = event.touches[0].clientX;
    yStart = event.touches[0].clientY;
  }

  function touchUp() {
    sendFlightControlInput(identityState);
  }

  function touchMove(event: React.TouchEvent<HTMLDivElement>) {
    event.stopPropagation();
    const xPos = event.touches[0].clientX;
    const yPos = event.touches[0].clientY;

    const scaleFactor = (1.0 / inputSensitivity) * inputScaleFactor;

    const deltaX = (xStart - xPos) * scaleFactor;
    const deltaY = (yStart - yPos) * scaleFactor;

    const input: FlightControllerInputStateCommand = {
      event: 'inputState',
      inputState: {}
    };

    if (event.touches.length === 1) {
      input.inputState.orbitX = deltaX;
      input.inputState.orbitY = deltaY;
    } else if (event.touches.length === 2) {
      input.inputState.panX = deltaX;
      input.inputState.panY = deltaY;
    } else if (event.touches.length === 3) {
      input.inputState.localRollX = -deltaX;
      input.inputState.zoomIn = deltaY;
    }

    sendFlightControlInput(input);
  }
  return (
    <>
      {isControllerEnabled && (
        <div
          style={{
            height: '100%',
            width: '100%',
            border: 'var(--openspace-border-active)'
          }}
          onPointerDown={mouseDown}
          onPointerUp={mouseUp}
          onPointerCancel={mouseUp}
          onPointerLeave={mouseUp}
          onLostPointerCapture={mouseUp}
          onPointerMove={mouseMove}
          onTouchStart={touchDown}
          onTouchEnd={touchUp}
          onTouchCancel={touchUp}
          onTouchMove={touchMove}
        />
      )}
    </>
  );
}
