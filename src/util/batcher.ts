// This is a class that batches updates to avoid flooding the redux store with too many
// updates. This is better than throttling, as we don't miss any values.
// @TODO: (ylvse, 21-01-2026) However, a better approach would be to throttle in React
// instead of Redux, but I haven't been able to figure out a good way to do that.
/**
 * Collects updates and flushes them in batches after a delay.
 *
 * Buffers multiple updates and executes them together to reduce the frequency of update
 * function calls. Updates with the same ID will overwrite previous updates.
 *
 * @typeParam T - The type of data contained in the updates
 *
 * @example
 * ```typescript
 * const batcher = new Batcher<MyType>((updates) => {
 *   console.log('Processing', Object.keys(updates).length, 'updates');
 * }, 100);
 *
 * batcher.add({'item1': someData});
 * batcher.add({'item2': otherData});
 * batcher.add({'item3': thirdData, 'item4': fourthData});
 * // Updates are flushed after 50ms
 * ```
 */
export class Batcher<T extends object> {
  /**
   * @param updateFunc - Callback invoked with the buffered updates on each flush
   * @param flushDelay - Milliseconds to wait before flushing the buffer (default: 50)
   */
  constructor(updateFunc: (updates: Partial<T>) => void, flushDelay = 50) {
    this.flushDelay = flushDelay;
    this.updateFunc = updateFunc;
  }

  /**
   * Merges the given update into the buffer and schedules a flush if one is not
   * already pending. If multiple updates share the same key, the latest value wins.
   *
   * @param update - Partial update to buffer
   */
  add(update: Partial<T>) {
    Object.assign(this.buffer, update);
    if (this.timer !== null) return;
    this.timer = setTimeout(() => {
      this.flush();
    }, this.flushDelay);
  }

  /**
   * Immediately invokes the update function with all buffered updates and clears
   * the buffer and pending timer. Nothing happens if the buffer is empty.
   */
  flush() {
    if (Object.keys(this.buffer).length === 0) return;
    // Make a copy of the buffer so we don't risk any async
    // issues with a cleared reference
    const snapshot = { ...this.buffer };
    this.buffer = {};
    this.timer = null;
    this.updateFunc(snapshot);
  }

  /** Accumulated updates waiting to be flushed */
  private buffer: Partial<T> = {};
  /** Handle for the pending flush timeout, or null if no flush is scheduled */
  private timer: number | null = null;
  /** Milliseconds to wait before flushing the buffer */
  private flushDelay: number;
  /** Callback invoked with the buffered updates on each flush */
  private updateFunc: (updates: Partial<T>) => void;
}
