import { type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { AppProvider } from "@/lib/i18n/context";
import { ToastProvider } from "@/lib/toast/context";

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <ToastProvider>{children}</ToastProvider>
    </AppProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: Wrapper, ...options });
}
