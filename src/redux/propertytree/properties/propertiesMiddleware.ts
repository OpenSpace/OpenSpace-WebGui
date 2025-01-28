import { createAction, Dispatch, UnknownAction } from '@reduxjs/toolkit';
import { throttle } from 'lodash';
import { Topic } from 'openspace-api-js';

import { api } from '@/api/api';
import { onCloseConnection } from '@/redux/connection/connectionSlice';
import { AppStartListening } from '@/redux/listenerMiddleware';
import { RootState } from '@/redux/store';
import { ConnectionStatus } from '@/types/enums';
import { PropertyValue, Uri } from '@/types/types';

import { addProperties, setPropertyValue, updatePropertyValue } from './propertiesSlice';

// The middleware also supports subscribing and setting properties
// regardless of whether they are present in the redux store or not.
// However, for values to propagate to the subscribing client,
// the property needs to exist in the tree.
// React components retrieve property values from the property tree by using
// react-redux `connect`.
//
// When subscribing to and setting a property, there are four cases:
// 1) We're connected to the backend. Property exists in the property tree:
//      This is the happy path.
//      Subscribing: The subscription is registered and
//      the subscriber will get updates through redux.
//      Setting: The data is sent to the backend.
//
// 2) We're not connected to backend. Property exists in the property tree:
//      This means that OpenSpace was once connected but lost connection.
//      Subscribing: Subscriptions are then stored as `pending`, so they can be
//      resumed once the connection is established again.
//      Setting: Properties are considered read-only in disconnected state.
//      The property will not be set.
//
// 3) We're connected to backend. Property does not exist in the property tree:
//      Subscribing: We are trying to subscribe a property that is not yet loaded
//      into the frontend, or the property does not exist at all.
//      There is no way for the frontend to know which of the two cases are true,
//      so the subscription is stored as `orphan`, and will kick in as soon as the
//      property can be located in the redux state.
//      Setting: We will send the update to the backend, which will accept the
//      setting if the property exists.
//
// 4) We're not connected to backend and the property does not exist in the property tree:
//      Subscribing: We store the subscription as `pending` and will try to promote it to
//      an active subscription when we are connected.
//      If it still does not exist, it will be marked `orphan` as in case 3.
//      Setting: We are not connected, so the property tree is considered read-only.
//      The property will not be set.

// At this point, we do not support addition and removal
// of properties in the backend at runtime.

export const subscribeToProperty = createAction<{ uri: Uri }>('subscribeToProperty');
export const unsubscribeToProperty = createAction<{ uri: Uri }>('unsubscribeToProperty');

enum SubscriptionState {
  Pending = 0,
  Orphan = 1,
  Active = 2
}

type SubscriptionInfo = {
  state: SubscriptionState;
  nSubscribers: number;
  subscription?: Topic;
};

const subscriptionInfos: { [key: Uri]: SubscriptionInfo } = {};

function handleUpdatedValues(
  dispatch: Dispatch<UnknownAction>,
  uri: Uri,
  value: PropertyValue
) {
  // Update the value in the redux property tree, based on the
  // value from the backend.
  dispatch(updatePropertyValue({ uri, value }));

  // "Lazy unsubscribe":
  // Cancel the subscription whenever there is an update from the
  // server, and there are no more active subscibers on the client.
  // (As opposed to cancelling the subscription immediately when the
  //  number of subscribers hits zero)
  const subscriptionInfo = subscriptionInfos[uri];
  if (
    subscriptionInfo &&
    subscriptionInfo.state === SubscriptionState.Active &&
    subscriptionInfo.nSubscribers < 1
  ) {
    if (subscriptionInfo.subscription) {
      subscriptionInfo.subscription.cancel();
    }
    delete subscriptionInfos[uri];
  }
}

function setupSubscription(dispatch: Dispatch<UnknownAction>, uri: Uri) {
  const subscription = api.subscribeToProperty(uri);
  const handleUpdates = (value: PropertyValue) =>
    handleUpdatedValues(dispatch, uri, value);
  const throttleHandleUpdates = throttle(handleUpdates, 200);

  (async () => {
    for await (const data of subscription.iterator()) {
      throttleHandleUpdates(data.Value as PropertyValue);
    }
  })();
  return subscription;
}

function tryPromoteSubscription(
  dispatch: Dispatch<UnknownAction>,
  state: RootState,
  uri: Uri
) {
  const subscriptionInfo = subscriptionInfos[uri];

  if (state.connection.connectionStatus !== ConnectionStatus.Connected) {
    return;
  }

  if (subscriptionInfo.state === SubscriptionState.Pending) {
    subscriptionInfo.state = SubscriptionState.Orphan;
  }

  // True if property exists, false otherwise
  const propertyInTree = !!state.properties.properties[uri];

  if (subscriptionInfo.state === SubscriptionState.Orphan && propertyInTree) {
    subscriptionInfo.subscription = setupSubscription(dispatch, uri);
    subscriptionInfo.state = SubscriptionState.Active;
  }
}

function promoteSubscriptions(dispatch: Dispatch<UnknownAction>, state: RootState) {
  // The added properteis may include properties whose
  // uri is marked as a `pending`/`orphan` subscription, so
  // we check if any subscriptions can be promoted to `active`.
  Object.keys(subscriptionInfos).forEach((uri: Uri) => {
    tryPromoteSubscription(dispatch, state, uri);
  });
}

function markAllSubscriptionsAsPending() {
  Object.keys(subscriptionInfos).forEach((uri: Uri) => {
    subscriptionInfos[uri].state = SubscriptionState.Pending;
  });
}

export const addPropertiesListener = (startListening: AppStartListening) => {
  startListening({
    actionCreator: onCloseConnection,
    effect: () => {
      markAllSubscriptionsAsPending();
    }
  });

  startListening({
    actionCreator: addProperties,
    effect: (_, listenerApi) => {
      promoteSubscriptions(listenerApi.dispatch, listenerApi.getState());
    }
  });

  startListening({
    actionCreator: setPropertyValue,
    effect: (action) => {
      api.setProperty(action.payload.uri, action.payload.value);
    }
  });

  startListening({
    actionCreator: subscribeToProperty,
    effect: (action, listenerApi) => {
      const { uri } = action.payload;
      const subscriptionInfo = subscriptionInfos[uri];
      if (subscriptionInfo) {
        ++subscriptionInfo.nSubscribers;
      } else {
        subscriptionInfos[uri] = {
          state: SubscriptionState.Pending,
          nSubscribers: 1
        };
      }

      tryPromoteSubscription(listenerApi.dispatch, listenerApi.getState(), uri);
    }
  });

  startListening({
    actionCreator: unsubscribeToProperty,
    effect: (action) => {
      const { uri } = action.payload;
      const subscriptionInfo = subscriptionInfos[uri];
      if (subscriptionInfo) {
        --subscriptionInfo.nSubscribers;
      }
    }
  });
};
