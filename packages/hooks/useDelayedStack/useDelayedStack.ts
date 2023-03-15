import { useRef, useEffect } from 'react';
import { useDelayedStackReturnType } from './types';

const useDelayedStack = <T>(
  callback: (data: T[]) => void,
  delay: number,
  initialValue: T[] = []
): useDelayedStackReturnType<T> => {
  const stackRef = useRef<T[]>(initialValue);
  const timerRef = useRef<NodeJS.Timeout | string | number | undefined>(
    undefined
  );
  const abortController = new AbortController();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (stackRef.current.length) {
        callback([...stackRef.current]);
        stackRef.current = [];
      }
    }, delay);

    abortController.signal.addEventListener('abort', () => {
      clearInterval(timerRef.current);
    });

    return () => {
      clearInterval(timerRef.current);
      abortController?.abort();
    };
  }, [callback, delay, abortController]);

  const pushToStack = (value: T) =>
    (stackRef.current = [...stackRef.current, value]);

  const cancel = () => {
    clearInterval(timerRef.current);
    abortController?.abort();
  };

  return [pushToStack, cancel];
};

export default useDelayedStack;
