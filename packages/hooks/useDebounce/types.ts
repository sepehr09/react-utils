/**
 * Options that can be provided when making a function call.
 */
export interface CallOptions {
  /**
   * Determines if the function should be invoked immediately on the leading edge of the timeout.
   */
  leading?: boolean;
  /**
   * Determines if the function should be invoked on the trailing edge of the timeout.
   */
  trailing?: boolean;
}

/**
 * Additional options that can be extended from `CallOptions`. These options allow customizing
 * the behavior when invoking a function.
 */
export interface Options extends CallOptions {
  /**
   * The time the specified function is allowed to be delayed before it's invoked.
   */
  delay?: number;

  /**
   * The maximum time the specified function is allowed to be delayed before it's invoked.
   */
  maxWait?: number;
}

/**
 * Collection of control functions that can be used with the debounced function.
 */
export interface ControlFunctions {
  /**
   * Cancel any pending function invocations.
   */
  cancel: () => void;
  /**
   * Immediately invoke any pending function invocations.
   */
  flush: () => void;
  /**
   * Check if there are any pending function invocations.
   */
  isPending: () => boolean;
}

/**
 * Represents the state of a debounced function. When called, this function will invoke the
 * original function and return its result. Subsequent calls within the debouncing period
 * will return the result of the initial call.
 *
 * **Note:** If there are no previous invocations, calling this function will return `undefined`.
 * Ensure to handle this case in your code.
 */
export interface DebouncedState<T extends (...args: any) => ReturnType<T>>
  extends ControlFunctions {
  /**
   * Invoke the debounced function with the provided arguments.
   * @param {...Parameters<T>} args - The arguments to pass to the debounced function.
   * @returns {ReturnType<T> | undefined} The result of the debounced function's invocation.
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;
}
