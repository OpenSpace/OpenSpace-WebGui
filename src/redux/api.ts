import { OpenSpaceApi } from 'openspace-api-js';

const api = OpenSpaceApi(
  import.meta.env.VITE_OPENSPACE_ADDRESS,
  import.meta.env.VITE_OPENSPACE_PORT
);
