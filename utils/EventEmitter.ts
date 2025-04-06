import { EventEmitter, EventSubscription } from "expo-modules-core";

// Extend EventEmitter to include custom event types
type TypedEventEmitter = {
  emit(event: EventName, data?: any): void;
  addListener(
    event: EventName,
    callback: (data?: any) => void
  ): EventSubscription;
};

const eventEmitter: TypedEventEmitter = new EventEmitter() as TypedEventEmitter;

// Define event names as an enum for better type safety
enum EventName {
  UpdateTransactions = "updateTransactions",
  WalletChanged = "walletChanged",
}

// Helper functions for emitting and listening to events
const EventEmitterHelper = {
  emit: (event: EventName, data?: any) => {
    eventEmitter.emit(event, data);
  },
  listen: (event: EventName, callback: (data?: any) => void) => {
    return eventEmitter.addListener(event, callback);
  },
  remove: (subscription: any) => {
    subscription.remove();
  },
};

export { EventEmitterHelper, EventName };
