import { EventData } from '@/redux/events/types';

// All valid event names, inferred form the union of EventData
type EventType = EventData['Event'];

type EventPayload<E extends EventType> = Extract<EventData, { Event: E }>;

/**
 * This class can be used to subscribe to OpenSpace events in components. For now, it does
 * not get any data with the event, but rather just a notification that it happened
 */
class EventBus {
  private listeners: {
    [K in EventType]?: ((data: EventPayload<K>) => void)[];
  } = {};

  /**
   * Subscribes a callback function to a specific event, the function is called each time
   * the event is emitted
   * @param event
   * @param handler
   */
  subscribe<E extends EventType>(event: E, handler: (data: EventPayload<E>) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  /**
   * Removes a function callback from a specific event subcription
   * @param event Event to unsubscribe from
   * @param handler The callback function handler to remove
   */
  unsubscribe<E extends EventType>(event: E, handler: (data: EventPayload<E>) => void) {
    const handlers = this.listeners[event];
    if (!handlers) {
      return;
    }
    // TODO (anden88, 2025-11-06): See if we can do some other type of casting here to
    // make typescript happy since the following:
    // this.listeners[event] = this.listeners[event]?.filter((h) => h !== handler) || [];
    // results in an error:
    // Type '((data: EventPayload<E>) => void)[]' is not assignable to type '{
    // ActionAdded?: ((data: ActionAddedEvent) => void)[] | undefined;
    // ActionRemoved?: ((data: ActionRemovedEvent) => void)[] | undefined; ... }
    this.listeners[event] = handlers.filter((h) => h !== handler) as typeof handlers;
  }

  // @TODO (anden88 2025-10-09): Do we want to pass the event payload to the handler?
  /**
   * Emits an event to all subscribed listeners
   * @param event
   */
  emit<E extends EventType>(data: EventPayload<E>) {
    this.listeners[data.Event]?.forEach((handler) => handler(data));
  }
}

export const eventBus = new EventBus();
