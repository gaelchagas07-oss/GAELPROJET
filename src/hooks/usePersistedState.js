import { useEffect, useState } from 'react';

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function usePersistedState(key, fallback) {
  const [state, setState] = useState(() => loadState(key, fallback));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage unavailable or full — ignore
    }
  }, [key, state]);

  return [state, setState];
}
