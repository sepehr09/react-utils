import { useRef, useEffect, useMemo } from 'react';
import type { DebouncedState, Options } from './types';

/**
 * @example
 *```ts
 *import React, { useState } from 'react';
 *import { useDelayedFn } from '@reactutils/useDebounce';
 *
 *function Input({ defaultValue }) {
 *  const [value, setValue] = useState(defaultValue);
 *  const debouncedCallback = useDelayedFn(
 *    (value) => {
 *      setValue(value);
 *    },
 *    { delay, maxWait: 2000 }
 *  );
 *
 *  return (
 *    <div>
 *      <input
 *        defaultValue={defaultValue}
 *        onChange={(e) => debouncedCallback(e.target.value)}
 *      />
 *      <p>Debounced value: {value}</p>
 *      <button onClick={debouncedCallback.cancel}>Cancel Debounce cycle</button>
 *    </div>
 *  );
 *}
 *```
 */

export function useDelayedFn<T extends (...args: any) => ReturnType<T>>(
  func: T,
  options?: Options
): DebouncedState<T> {
  let { delay } = options || {};
  /* ----------- Track the timing and state of the debounce process ----------- */
  const lastCallTimeRef = useRef<number | null>(null);
  const lastInvokeTimeRef = useRef<number>(0);
  const timerIdRef = useRef<number | null>(null);
  const lastArgsRef = useRef<unknown[] | null>([]);
  const lastThisRef = useRef<unknown>();
  const resultRef = useRef<ReturnType<T>>();
  const funcRef = useRef(func);
  const mountedRef = useRef(true);

  /* ------ Update the reference to the original function when it changes ----- */
  useEffect(() => {
    funcRef.current = func;
  }, [func]);

  /* ------- Determine whether to use requestAnimationFrame for waiting ------- */
  const shouldUseRequestAnimationFrame =
    !delay && delay !== 0 && typeof window !== 'undefined';

  /* --------------------- Validate the provided function --------------------- */
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  /* --------- Convert delay to a positive number or use default value --------- */
  delay = delay ? +delay : 0;
  options = options || {};

  /* ----------------------------- Extract options ---------------------------- */
  const leading = !!options.leading;
  const trailing = 'trailing' in options ? !!options.trailing : true; // Default: true
  const maxing = 'maxWait' in options;
  const maxWait = maxing
    ? Math.max(options.maxWait ? +options.maxWait : 0, delay)
    : null;

  /* ----------------- Update the mounted status in the effect ---------------- */
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* --------------- Define the debounced function using useMemo -------------- */
  const debounced = useMemo(() => {
    const invokeFunc = (time: number) => {
      const args = lastArgsRef.current;
      const thisArg = lastThisRef.current;

      lastArgsRef.current = lastThisRef.current = null;
      lastInvokeTimeRef.current = time;
      return (resultRef.current = funcRef.current.apply(thisArg, args as any));
    };

    const initializeDebounceTimer = (
      pendingFunc: () => void,
      delay: number
    ) => {
      if (shouldUseRequestAnimationFrame)
        cancelAnimationFrame(timerIdRef.current!);
      timerIdRef.current = shouldUseRequestAnimationFrame
        ? requestAnimationFrame(pendingFunc)
        : (setTimeout(pendingFunc, delay) as unknown as number);
    };

    const shouldExecuteDebounce = (time: number) => {
      if (!mountedRef.current) return false;

      const timeSinceLastCall = time - (lastCallTimeRef.current || 0);
      const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

      return (
        !lastCallTimeRef.current ||
        timeSinceLastCall >= (delay ?? 0) ||
        timeSinceLastCall < 0 ||
        (maxing && timeSinceLastInvoke >= maxWait!)
      );
    };

    const trailingEdge = (time: number) => {
      timerIdRef.current = null;

      if (trailing && lastArgsRef.current) {
        return invokeFunc(time);
      }

      lastArgsRef.current = lastThisRef.current = null;
      return resultRef.current;
    };

    const timerExpired = () => {
      const time = Date.now();
      if (shouldExecuteDebounce(time)) {
        return trailingEdge(time);
      }

      if (!mountedRef.current) {
        return;
      }

      const timeSinceLastCall = time - (lastCallTimeRef.current || 0);
      const timeSinceLastInvoke = time - lastInvokeTimeRef.current;
      const timeWaiting = delay ?? 0 - timeSinceLastCall;
      const remainingWait = maxing
        ? Math.min(timeWaiting, maxWait! - timeSinceLastInvoke)
        : timeWaiting;

      initializeDebounceTimer(timerExpired, remainingWait);
    };

    const debouncedFunc: DebouncedState<T> = (
      ...args: Parameters<T>
    ): ReturnType<T> | undefined => {
      const time = Date.now();
      const isInvoking = shouldExecuteDebounce(time);

      lastArgsRef.current = args;
      // @ts-ignore
      lastThisRef.current = this;
      lastCallTimeRef.current = time;

      if (isInvoking) {
        if (!timerIdRef.current && mountedRef.current) {
          lastInvokeTimeRef.current = lastCallTimeRef.current;
          initializeDebounceTimer(timerExpired, delay ?? 0);
          return leading
            ? invokeFunc(lastCallTimeRef.current)
            : resultRef.current;
        }

        if (maxing) {
          initializeDebounceTimer(timerExpired, delay ?? 0);
          return invokeFunc(lastCallTimeRef.current);
        }
      }

      if (!timerIdRef.current) {
        initializeDebounceTimer(timerExpired, delay ?? 0);
      }

      return resultRef.current;
    };

    /* ------------- Add control functions to the debounced function ------------ */
    debouncedFunc.cancel = () => {
      if (timerIdRef.current) {
        shouldUseRequestAnimationFrame
          ? cancelAnimationFrame(timerIdRef.current)
          : clearTimeout(timerIdRef.current);
      }
      lastInvokeTimeRef.current = 0;
      lastArgsRef.current =
        lastCallTimeRef.current =
        lastThisRef.current =
        timerIdRef.current =
          null;
    };

    debouncedFunc.isPending = () => {
      return !!timerIdRef.current;
    };

    debouncedFunc.flush = () => {
      return !timerIdRef.current ? resultRef.current : trailingEdge(Date.now());
    };

    return debouncedFunc;
  }, [
    leading,
    maxing,
    delay,
    maxWait,
    trailing,
    shouldUseRequestAnimationFrame,
  ]);

  return debounced;
}
