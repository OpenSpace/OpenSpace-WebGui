import { Update } from '@reduxjs/toolkit';

// This is a class that batches updates
// to avoid flooding the redux store with too many updates.
// This is better than throttling as we don't miss any values.
// TODO: @ylvse (21/1/2026) - However, a better approach would be to throttle in
// React instead of Redux, but I haven't been able to figure out a good way to do that.

/**
 * @class Batcher
 * @description A class that batches updates to avoid flooding the
 * Redux store with too many updates.
 *
 * @constructor
 * @param {number} [flushDelay=50] - The delay in milliseconds before
 * flushing the updates to the Redux store.
 *
 * @method add
 * @param {Update<T, string>} update - The update to be added to the batch.
 * @param {function} dispatch - The Redux dispatch function used to send actions to the store.
 *
 * @method flush
 * @param {function} dispatch - The Redux dispatch function used to send actions to the store.
 * @returns {void}
 */
export class Batcher<T> {
  private buffer = new Map<string, Update<T, string>>();
  private timer: number | null = null;
  private flushDelay: number;
  private updateFunc: (updates: Update<T, string>[]) => void;

  constructor(updateFunc: (updates: Update<T, string>[]) => void, flushDelay = 50) {
    this.flushDelay = flushDelay;
    this.updateFunc = updateFunc;
  }

  add(update: Update<T, string>) {
    this.buffer.set(update.id, update);

    if (this.timer !== null) return;

    this.timer = setTimeout(() => {
      this.flush();
    }, this.flushDelay);
  }

  flush() {
    if (this.buffer.size === 0) return;

    const updates = Array.from(this.buffer.values());
    this.updateFunc(updates);

    this.buffer.clear();
    this.timer = null;
  }
}
