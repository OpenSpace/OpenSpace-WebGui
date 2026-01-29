import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { AnyProperty } from '@/types/Property/property';

import { RootState } from '../store';

// Properties
export const propertyAdapter = createEntityAdapter({
  selectId: (p: AnyProperty) => p.uri,
  // Keep the "all IDs" array sorted based on uri
  sortComparer: (a, b) => a.uri.localeCompare(b.uri)
});

const properties = createSlice({
  name: 'properties',
  initialState: propertyAdapter.getInitialState(),
  reducers: {
    upsertMany: propertyAdapter.upsertMany,
    upsertOne: propertyAdapter.upsertOne,
    removeOne: propertyAdapter.removeOne,
    removeMany: propertyAdapter.removeMany,
    reset: propertyAdapter.removeAll,
    updateOne: propertyAdapter.updateOne,
    updateMany: propertyAdapter.updateMany
  }
});

export const {
  upsertMany,
  upsertOne,
  removeOne,
  removeMany,
  reset,
  updateOne,
  updateMany
} = properties.actions;
export const propertyReducer = properties.reducer;

export const propertySelectors = propertyAdapter.getSelectors(
  (state: RootState) => state.properties
);
