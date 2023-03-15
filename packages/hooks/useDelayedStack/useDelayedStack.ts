import { useRef, useEffect } from "react";
import { useDelayedStackReturnType } from "./types";

const useDelayedStack = <T>(
  callback: (data: T[]) => void,
  delay: number,
  initialValue: T[] = []
): useDelayedStackReturnType<T> => {
  const stackRef = useRef<T[]>(initialValue);
  const timerRef = useRef<NodeJS.Timeout | string | number | undefined>(
    undefined
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  const createAbortController = () => {
    abortControllerRef.current = new AbortController();
    abortControllerRef.current.signal.addEventListener("abort", () => {
      clearInterval(timerRef.current);
    });
  };

  createAbortController();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (stackRef.current.length) {
        callback([...stackRef.current]);
        stackRef.current = [];
      }
    }, delay);

    return () => {
      clearInterval(timerRef.current);
      abortControllerRef.current?.abort();
    };
  }, [callback, delay]);

  const pushToStack = (value: T) =>
    (stackRef.current = [...stackRef.current, value]);

  const cancel = () => {
    abortControllerRef.current?.abort();
    createAbortController();
  };

  return [pushToStack, cancel];
};

export default useDelayedStack;
