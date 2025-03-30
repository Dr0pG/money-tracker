import { EventEmitter } from "expo-modules-core";

// Define event names as an enum for better type safety
enum EventName {
  UpdateTransactions = "updateTransactions",
  WalletChanged = "walletChanged",
}

// Create a global event emitter instance
const eventEmitter = new EventEmitter();

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

