import { EventData } from '@/redux/events/types';

type EventHandler = () => void;
type EventType = EventData['Event'];

/**
 * This class can be used to subscribe to OpenSpace events in components. For now, it does
 * not get any data with the event, but rather just a notification that it happened
 */
class EventBus {
  private listeners: Partial<Record<EventType, EventHandler[]>> = {};

  /**
   * Subscribes a callback function to a specific event, the function is called each time
   * the event is emitted
   * @param event
   * @param handler
   */
  subscribe(event: EventType, handler: EventHandler) {
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
  unsubscribe(event: EventType, handler: EventHandler) {
    this.listeners[event] = this.listeners[event]?.filter((h) => h !== handler) || [];
  }

  // @TODO (anden88 2025-10-09): Do we want to pass the event payload to the handler?
  /**
   * Emits an event to all subscribed listeners
   * @param event
   */
  emit(event: EventType) {
    this.listeners[event]?.forEach((handler) => handler());
  }
}

export const eventBus = new EventBus();
