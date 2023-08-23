import { useCallback, useRef, useState, Dispatch } from 'react';

import { useDelayedFn } from './useDelayedFn';
import type { DebouncedState } from './types';


function isEqualValues<T>(left: T, right: T): boolean {
  return left === right;
}

function normalizeStateUpdateValue<T>(value: T): T | (() => T) {
  return typeof value === 'function' ? () => value : value;
}

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
 * @example
 *```ts
 *import React, { useState } from 'react';
 *import useDebounce from '@reactutils/use-debounce';
 *
 *export default function Input() {
 *  const [text, setText] = useState('Hello');
 *  const [debouncedValue] = useDebounce(text, { delay: 1000 });
 *
 *  return (
 *    <div>
 *      <input
 *        defaultValue={'Hello'}
 *        onChange={(e) => {
 *          setText(e.target.value);
 *        }}
 *      />
 *      <p>Actual value: {text}</p>
 *      <p>Debounced value: {debouncedValue}</p>
 *    </div>
 *  );
 *}
 *```
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
