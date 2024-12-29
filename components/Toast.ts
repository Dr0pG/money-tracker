import { toast } from "@backpackapp-io/react-native-toast";

const showSuccess = (message: string, duration: number = 2000) => {
  if (!message) return;
  toast.success(message, {
    duration: duration,
  });
};

const showError = (message: string, duration: number = 2000) => {
  if (!message) return;
  toast.error(message, {
    duration: duration,
  });
};

const showInfo = (message: string, duration: number = 2000) => {
  toast(message, {
    duration: duration,
  });
};

export default { showSuccess, showError, showInfo };
