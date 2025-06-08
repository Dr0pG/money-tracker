import Toast from "@/components/Toast";
import { toast } from "@backpackapp-io/react-native-toast";

describe("ToastUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls toast.success with message", () => {
    Toast.showSuccess("Success!");
    expect(toast.success).toHaveBeenCalledWith("Success!", { duration: 2000 });
  });

  it("does not call toast.success if message is empty", () => {
    Toast.showSuccess("");
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("calls toast.error with message", () => {
    Toast.showError("Error!");
    expect(toast.error).toHaveBeenCalledWith("Error!", { duration: 2000 });
  });

  it("does not call toast.error if message is empty", () => {
    Toast.showError("");
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("calls toast for info message", () => {
    Toast.showInfo("Info");
    expect(toast).toHaveBeenCalledWith("Info", { duration: 2000 });
  });
});
