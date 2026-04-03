"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import translations, { type Locale, type TranslationKeys } from "./translations";

interface AppContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: TranslationKeys;
}

const AppContext = createContext<AppContextValue | null>(null);

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("supertest-locale");
  if (stored === "en" || stored === "ja") return stored;
  return "en";
}

function subscribeToStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initialLocale = useSyncExternalStore(
    subscribeToStorage,
    getStoredLocale,
    () => "en" as Locale
  );

  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem("supertest-locale", locale);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const t = translations[locale];

  return (
    <AppContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
