import { EventData } from '@/redux/events/types';

// All valid event names, inferred form the union of EventData
type EventType = EventData['Event'];

type EventPayload<E extends EventType> = Extract<EventData, { Event: E }>;

/**
 * This class can be used to subscribe to OpenSpace events in components. Corresponding
 * event data is passed to the subscribed callback functions when an event is emitted.
 */
class EventBus {
  private listeners: {
    [K in EventType]?: ((data: EventPayload<K>) => void)[];
  } = {};

  /**
   * Subscribes a callback function to a specific event, the function is called each time
   * the event is emitted.
   * 
   * @param event Event to subscribe to
   * @param callback The callback function to invoke when the event is emitted
   */
  subscribe<E extends EventType>(event: E, callback: (data: EventPayload<E>) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Removes a function callback from a specific event subcription.
   * 
   * @param event Event to unsubscribe from
   * @param callback The callback function handle to remove
   */
  unsubscribe<E extends EventType>(event: E, callback: (data: EventPayload<E>) => void) {
    const callbacks = this.listeners[event];
    if (!callbacks) {
      return;
    }
    // TODO (anden88, 2025-11-06): See if we can do some other type of casting here to
    // make typescript happy since the following:
    // this.listeners[event] = this.listeners[event]?.filter((h) => h !== handler) || [];
    // results in an error:
    // Type '((data: EventPayload<E>) => void)[]' is not assignable to type '{
    // ActionAdded?: ((data: ActionAddedEvent) => void)[] | undefined;
    // ActionRemoved?: ((data: ActionRemovedEvent) => void)[] | undefined; ... }
    this.listeners[event] = callbacks.filter((h) => h !== callback) as typeof callbacks;
  }

  /**
   * Emits an event to all subscribed listeners.
   * 
   * @param data The event data to emit
   */
  emit<E extends EventType>(data: EventPayload<E>) {
    this.listeners[data.Event]?.forEach((handler) => handler(data));
  }
}

export const eventBus = new EventBus();
