import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'food-ordering-auth';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const useAuth = () => {
  const [authState, setAuthState] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? safeParse(raw) : null;

    if (!parsed?.token || !parsed?.user) {
      return { token: null, user: null };
    }

    return parsed;
  });

  useEffect(() => {
    if (!authState.token || !authState.user) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  const setSession = (token, user) => {
    setAuthState({ token, user });
  };

  const clearSession = () => {
    setAuthState({ token: null, user: null });
  };

  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      isAuthenticated: Boolean(authState.token && authState.user),
      setSession,
      clearSession
    }),
    [authState]
  );

  return value;
};
