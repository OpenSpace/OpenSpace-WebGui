import { createSlice } from '@reduxjs/toolkit';

import { getContributors } from './contributorsMiddleware';

export interface GitHubContributor {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
}

export interface ContributorsState {
  contributors: GitHubContributor[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ContributorsState = {
  contributors: [],
  status: 'idle'
};

export const contributorsSlice = createSlice({
  name: 'contributors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getContributors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getContributors.fulfilled, (state, action) => {
        state.contributors = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getContributors.rejected, (state) => {
        state.status = 'failed';
      });
  }
});

export const contributorsReducer = contributorsSlice.reducer;
