"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { arTn } from "@/i18n/ar-tn";
import { en } from "@/i18n/en";
import { fr, type MsgKey } from "@/i18n/fr";

export const LOCALES = ["fr", "en", "ar-TN"] as const;
export type Locale = (typeof LOCALES)[number];

const STORAGE_KEY = "champs-lang";
const listeners = new Set<() => void>();

const DICTS = {
  fr,
  en,
  "ar-TN": arTn,
} as const;

type I18nContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (key: MsgKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ""));
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readLocale(): Locale {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved && isLocale(saved) ? saved : "fr";
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, () => "fr" as const);

  useEffect(() => {
    const dir = locale === "ar-TN" ? "rtl" : "ltr";
    document.documentElement.lang = locale === "ar-TN" ? "ar" : locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    emit();
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dir = locale === "ar-TN" ? "rtl" : "ltr";
    return {
      locale,
      dir,
      setLocale,
      t: (key, vars) => interpolate(DICTS[locale][key], vars),
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
