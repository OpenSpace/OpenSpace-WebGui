import { Update } from '@reduxjs/toolkit';

import { AnyProperty } from '@/types/Property/property';

// TODO: @ylvse (21/1/2026) - This is a class that batches property updates
// to avoid flooding the redux store with too many updates.
// This is better than throttling as we don't miss any values.
// However, a better approach would be to throttle in React instead of Redux, but I haven't been able
// to figure out a good way to do that.

/**
 * @class PropertyBatcher
 * @description A class that batches property updates to avoid flooding the Redux store with too many updates.
 *
 * @constructor
 * @param {number} [flushDelay=50] - The delay in milliseconds before flushing the updates to the Redux store.
 *
 * @method add
 * @param {Update<AnyProperty, string>} update - The property update to be added to the batch.
 * @param {function} dispatch - The Redux dispatch function used to send actions to the store.
 *
 * @method flush
 * @param {function} dispatch - The Redux dispatch function used to send actions to the store.
 * @returns {void}
 */
export class PropertyBatcher {
  private buffer = new Map<string, Update<AnyProperty, string>>();
  private timer: number | null = null;
  private flushDelay: number;
  private updateFunc: (updates: Update<AnyProperty, string>[]) => void;

  constructor(
    updateFunc: (updates: Update<AnyProperty, string>[]) => void,
    flushDelay = 50
  ) {
    this.flushDelay = flushDelay;
    this.updateFunc = updateFunc;
  }

  add(update: Update<AnyProperty, string>) {
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
