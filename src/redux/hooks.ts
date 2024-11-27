import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, AppThunkDispatch, RootState } from './store';

// We'll use these instead of plain `useDispatch`and `useSelector` to get the type info
export const useAppDispatch = useDispatch.withTypes<AppThunkDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
