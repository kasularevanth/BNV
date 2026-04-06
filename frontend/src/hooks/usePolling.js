import { useEffect, useRef } from 'react';

/**
 * Calls `fn` immediately and then every `interval` ms.
 * Cleans up on unmount or when dependencies change.
 */
const usePolling = (fn, interval = 10000) => {
  const savedFn = useRef(fn);

  useEffect(() => {
    savedFn.current = fn;
  }, [fn]);

  useEffect(() => {
    savedFn.current();
    const id = setInterval(() => savedFn.current(), interval);
    return () => clearInterval(id);
  }, [interval]);
};

export default usePolling;
