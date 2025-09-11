import { api } from "@/api/api";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Topic } from "openspace-api-js";
import { AppStartListening } from "../listenerMiddleware";
import { onCloseConnection, onOpenConnection } from "../connection/connectionSlice";
import { ConnectionStatus } from "@/types/enums";

export const subscribeToDownloadEvent = createAction<void>('downloadEvent/subscribe');
export const unsubscribeToDownloadEvent = createAction<void>('downloadEvent/unsubscribe');

let topic: Topic | null = null;
let nSubscribers = 0;


export const setupSubscription = createAsyncThunk(
    'downloadEvent/setupSubscription',
    async (_, thunkApi) => {
        topic = api.startTopic('downloadEvent', {
            event: 'start_subscription',
        });

        (async () => {
            for await (const data of topic.iterator()) {
                console.log(data);
            }
        })()
    }
)

function unsubscribe() {
    if(!topic) {
        return;
    }

    topic.talk({
        event: 'stop_subscription',
    });
    topic.cancel();
    topic = null;
}

export const addDownloadEventListener = (startListening: AppStartListening) => {
    startListening({
        actionCreator: onOpenConnection,
        effect: async (_, listenerApi) => {
            if(nSubscribers > 0) {
                listenerApi.dispatch(setupSubscription());
            }
        }
    });

    startListening({
        actionCreator: subscribeToDownloadEvent,
        effect: async (_, listenerApi) => {
           ++nSubscribers;
           const { connectionStatus } = listenerApi.getState().connection;
            if(nSubscribers === 1 && connectionStatus === ConnectionStatus.Connected) {
                listenerApi.dispatch(setupSubscription());
            }
        }
    });

    startListening({
        actionCreator: unsubscribeToDownloadEvent,
        effect: async ()=> {
            --nSubscribers;
            if(nSubscribers === 0) {
                unsubscribe();
            }
        }
    });
};