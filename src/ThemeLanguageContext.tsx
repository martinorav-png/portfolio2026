import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale, MessageKey } from './messages';
import { messages } from './messages';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'portfolio-theme';
const LOCALE_KEY = 'portfolio-locale';

function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {
    /* ignore */
  }
  return 'light';
}

function readStoredLocale(): Locale {
  try {
    const v = localStorage.getItem(LOCALE_KEY);
    if (v === 'en' || v === 'et') return v;
  } catch {
    /* ignore */
  }
  return 'en';
}

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: MessageKey) => string;
};

const AppPreferencesContext = createContext<Ctx | null>(null);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme());
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* ignore */
    }
    document.documentElement.dataset.theme = t;
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_KEY, l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l === 'et' ? 'et' : 'en';
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale === 'et' ? 'et' : 'en';
  }, [locale]);

  const t = useCallback(
    (key: MessageKey) => messages[locale][key] ?? messages.en[key] ?? String(key),
    [locale],
  );

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, locale, setLocale, t }),
    [theme, setTheme, toggleTheme, locale, setLocale, t],
  );

  return <AppPreferencesContext.Provider value={value}>{children}</AppPreferencesContext.Provider>;
}

export function useAppPreferences() {
  const ctx = useContext(AppPreferencesContext);
  if (!ctx) throw new Error('useAppPreferences must be used within AppPreferencesProvider');
  return ctx;
}
