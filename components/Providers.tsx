'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { useThemeStore } from '@/stores/themeStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme, setResolvedTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const applyTheme = () => {
      let isDark = false;
      if (theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = theme === 'dark';
      }

      const activeResolved = isDark ? 'dark' : 'light';
      setResolvedTheme(activeResolved);

      document.documentElement.classList.toggle('dark', isDark);
      document.body.classList.toggle('dark', isDark);
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, setResolvedTheme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        theme={resolvedTheme}
      />
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer>{children}</ThemeInitializer>
    </QueryClientProvider>
  );
}
