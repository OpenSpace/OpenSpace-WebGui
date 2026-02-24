import { Update } from '@reduxjs/toolkit';

// This is a class that batches updates
// to avoid flooding the redux store with too many updates.
// This is better than throttling as we don't miss any values.
// TODO: @ylvse (21/1/2026) - However, a better approach would be to throttle in
// React instead of Redux, but I haven't been able to figure out a good way to do that.


/**
 * A batching utility that collects updates and flushes them in batches after a delay.
 *
 * This class buffers multiple updates and executes them together to reduce the frequency
 * of update function calls. Updates with the same ID will overwrite previous updates.
 *
 * @template T - The type of data contained in the updates
 *
 * @example
 * ```typescript
 * const batcher = new Batcher((updates) => {
 *   console.log('Processing', updates.length, 'updates');
 * }, 100);
 *
 * batcher.add({ id: 'item1', data: someData });
 * batcher.add({ id: 'item2', data: otherData });
 * // Updates are flushed after 100ms
 * ```
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
