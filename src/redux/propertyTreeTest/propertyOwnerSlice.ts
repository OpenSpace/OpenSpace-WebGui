import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { PropertyOwner } from '@/types/types';

import { RootState } from '../store';

// Property owners
export const propertyOwnerAdapter = createEntityAdapter({
  selectId: (o: PropertyOwner) => o.uri,
  // Keep the "all IDs" array sorted based on uri
  sortComparer: (a, b) => a.uri.localeCompare(b.uri)
});

const propertyOwners = createSlice({
  name: 'propertyOwners',
  initialState: propertyOwnerAdapter.getInitialState(),
  reducers: {
    upsertMany: propertyOwnerAdapter.upsertMany,
    upsertOne: propertyOwnerAdapter.upsertOne,
    removeOne: propertyOwnerAdapter.removeOne,
    reset: propertyOwnerAdapter.removeAll,
    updateOne: propertyOwnerAdapter.updateOne
  }
});

export const { upsertMany, upsertOne, removeOne, reset, updateOne } =
  propertyOwners.actions;
export const propertyOwnerReducer = propertyOwners.reducer;

export const propertyOwnerSelectors = propertyOwnerAdapter.getSelectors(
  (state: RootState) => state.propertyOwners
);
