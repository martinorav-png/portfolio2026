import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './ErrorBoundary';
import { AppPreferencesProvider } from './ThemeLanguageContext';
import '../styles.css';

try {
  const stored = localStorage.getItem('portfolio-theme');
  if (stored === 'dark' || stored === 'light') {
    document.documentElement.dataset.theme = stored;
  }
  const loc = localStorage.getItem('portfolio-locale');
  if (loc === 'et') {
    document.documentElement.lang = 'et';
  } else if (loc === 'en') {
    document.documentElement.lang = 'en';
  }
} catch {
  /* ignore */
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Missing #root element');
}

createRoot(rootEl).render(
  <ErrorBoundary>
    <AppPreferencesProvider>
      <App />
    </AppPreferencesProvider>
  </ErrorBoundary>
);
