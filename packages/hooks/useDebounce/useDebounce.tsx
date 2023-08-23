import { useCallback, useRef, useState, Dispatch } from 'react';

import { useDelayedFn } from './useDelayedFn';
import type { DebouncedState } from './types';

/**
 * Checks whether two values are equal.
 *
 * @template T - The type of the values being compared.
 * @param {T} left - The first value to compare.
 * @param {T} right - The second value to compare.
 * @returns {boolean} - `true` if the values are equal, otherwise `false`.
 */
function isEqualValues<T>(left: T, right: T): boolean {
  return left === right;
}

/**
 * Adjusts a value to ensure it's a valid state or state updater function for `setState`.
 *
 * @template T - The type of the value to adjust.
 * @param {T | (() => T)} value - The value or updater function to adjust.
 * @returns {T | (() => T)} - The adjusted value or updater function.
 */
function normalizeStateUpdateValue<T>(value: T): T | (() => T) {
  return typeof value === 'function' ? () => value : value;
}

/**
 * A hook that provides a state and a dispatch function that ignores callbacks during state updates.
 *
 * @template T - The type of the state.
 * @param {T} initialState - The initial state value.
 * @returns {[T, Dispatch<T>]} - A tuple containing the state and the dispatch function.
 */
function useOptimizedStateUpdater<T>(initialState: T): [T, Dispatch<T>] {
  const [state, setState] = useState(
    normalizeStateUpdateValue(initialState)
  );

  // Create a dispatch function that ensures callback functions are ignored.
  const dispatchOptimizedStateUpdater = useCallback(
    (value: T) => setState(normalizeStateUpdateValue(value)),
    []
  );

  return [state, dispatchOptimizedStateUpdater];
}

/**
 * A hook that provides a debounced state and a debounced dispatch function for a value.
 *
 * @template T - The type of the value.
 * @param {T} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @param {Object} [options] - Additional options for debouncing.
 * @param {number} [options.maxWait] - The maximum time to wait between updates.
 * @param {boolean} [options.leading] - Whether to trigger the function on the leading edge.
 * @param {boolean} [options.trailing] - Whether to trigger the function on the trailing edge.
 * @param {(left: T, right: T) => boolean} [options.equalityFn] - A custom equality function for value comparison.
 * @returns {[T, DebouncedState<(value: T) => void>]} - A tuple containing the debounced state and debounced dispatch.
 */
export default function useDebounce<T>(
  value: T,
  options?: {
    delay: number;
    maxWait?: number;
    leading?: boolean;
    trailing?: boolean;
    equalityFn?: (left: T, right: T) => boolean;
  }
): [T, DebouncedState<(value: T) => void>] {
  const eq = (options && options.equalityFn) || isEqualValues;

  /* -- Get the initial state and a dispatch function that ignores callbacks. - */
  const [state, dispatch] = useOptimizedStateUpdater(value);

  /* ---- Create a debounced dispatch function using the provided options. ---- */
  const debounced = useDelayedFn(
    useCallback((value: T) => dispatch(value), [dispatch]),
    options
  );

  // Keep track of the previous value to detect changes for triggering debounced updates.
  const previousValue = useRef(value);

  // If the value has changed, trigger the debounced update and update the previous value.
  if (!eq(previousValue.current, value)) {
    debounced(value);
    previousValue.current = value;
  }

  return [state, debounced];
}
