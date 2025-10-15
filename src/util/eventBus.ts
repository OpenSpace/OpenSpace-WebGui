import { EventData } from '@/redux/events/types';

type EventHandler = () => void;
type EventType = EventData['Event'];

/**
 * This class can be used to subscribe to OpenSpace events in components. For now, it does
 * not get any data with the event, but rather just a notification that it happened
 */
class EventBus {
  private listeners: Partial<Record<EventType, EventHandler[]>> = {};

  on(event: EventType, handler: EventHandler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }

  off(event: EventType, handler: EventHandler) {
    this.listeners[event] = this.listeners[event]?.filter((h) => h !== handler) || [];
  }

  // @TODO (anden88 2025-10-09): Do we want to pass the event payload to the handler?
  emit(event: EventType) {
    this.listeners[event]?.forEach((handler) => handler());
  }
}

export const eventBus = new EventBus();
