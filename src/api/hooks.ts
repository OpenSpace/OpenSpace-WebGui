import { useAppSelector } from '@/redux/hooks';

// Hook to make it easier to get the api
export function useOpenSpaceApi() {
  const api = useAppSelector((state) => state.luaApi);
  return api;
}
