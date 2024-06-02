import Toast, {
  BaseToast,
  ErrorToast,
  SuccessToast,
  ToastConfig,
} from "react-native-toast-message";
import { useColorScheme } from "~/lib/useColorScheme";

export function ToastProvider() {
  const { isDarkColorScheme } = useColorScheme();

  const toastConfig: ToastConfig = {
    base: (props) => (
      <BaseToast
        {...props}
        style={{
          backgroundColor: isDarkColorScheme ? "#09090b" : "white",
        }}
        text1Style={{
          color: isDarkColorScheme ? "white" : "#09090b",
          fontSize: 16,
        }}
        text2Style={{
          color: isDarkColorScheme ? "white" : "#09090b",
          fontSize: 13,
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          backgroundColor: "#dc2626",
          borderLeftColor: "#dc2626",
        }}
        text1Style={{
          color: "white",
          fontSize: 16,
        }}
        text2Style={{
          color: "white",
          fontSize: 13,
        }}
      />
    ),
    success: (props) => (
      <SuccessToast
        {...props}
        style={{
          backgroundColor: "#16a34a",
          borderLeftColor: "#16a34a",
        }}
        text2Style={{
          color: "white",
          fontSize: 16,
        }}
      />
    ),
  };

  return <Toast config={toastConfig} />;
}
