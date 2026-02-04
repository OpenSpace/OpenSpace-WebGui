// window.OpenSpaceEnvironment is set by a http request to `./environment.js`.
// In production mode, this allows OpenSpace to serve a custom address and port through
// the backend nodejs application.

import OpenSpaceApi from 'openspace-api-js';

declare global {
  interface Window {
    OpenSpaceEnvironment?: {
      wsAddress?: string;
      wsPort?: number;
    };
  }
}

const address = window?.OpenSpaceEnvironment?.wsAddress || 'localhost';
const port = window?.OpenSpaceEnvironment?.wsPort || 4682;

export const api = OpenSpaceApi(address, port);
export { address };
