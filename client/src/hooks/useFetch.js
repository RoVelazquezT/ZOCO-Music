import { useEffect, useState } from 'react';

export function useFetch(fetcher, deps = []) {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setStatus('loading');
      setError(null);

      try {
        const result = await fetcher();
        if (cancelled) return;
        setData(result);
        setStatus('success');
      } catch (err) {
        if (cancelled) return;
        setError(err);
        setStatus('error');
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { status, data, error };
}
