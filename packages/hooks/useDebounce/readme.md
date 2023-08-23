# `@reactutils/useDebounce` Documentation

[![NPM](https://img.shields.io/npm/v/@reactutils/useDebounce.svg)][package-npm-link]
[![NPM](https://img.shields.io/bundlephobia/min/@reactutils/useDebounce)][package-bundlephobia]


## Installation

You can install the `@reactutils/useDebounce` package using either npm or Yarn:

```sh
npm install @reactutils/useDebounce

# or

yarn add @reactutils/useDebounce
```

## Overview

The `@reactutils/useDebounce` package provides two main hooks for managing debounce behavior in React applications: `useDebounce` and `useDelayedFn`. These hooks are designed to assist in scenarios where you need to limit the frequency of function calls or updates based on a certain time delay.

## Usage of `useDebounce`

The `useDebounce` hook allows you to debounce the changes to a value within a specified time frame. It's useful when you want to delay an action until the user has finished inputting data, such as in search or autocomplete components.

```jsx
import React, { useState } from 'react';
import useDebounce from '@reactutils/useDebounce';

export default function Input() {
  const [text, setText] = useState('Hello');
  const [debouncedValue] = useDebounce(text, { delay: 1000 });

  return (
    <div>
      <input
        defaultValue={'Hello'}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <p>Actual value: {text}</p>
      <p>Debounced value: {debouncedValue}</p>
    </div>
  );
}
```

## Usage of `useDelayedFn`

The `useDelayedFn` hook is suitable for situations where you want to debounce the execution of a callback function.

```jsx
import React, { useState } from 'react';
import { useDelayedFn } from '@reactutils/useDebounce';

function Input({ defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  const debouncedCallback = useDelayedFn(
    (value) => {
      setValue(value);
    },
    // The maximum time the function is allowed to be delayed before it's invoked:
    { delay, maxWait: 2000 }
  );

  return (
    <div>
      <input
        defaultValue={defaultValue}
        onChange={(e) => debouncedCallback(e.target.value)}
      />
      <p>Debounced value: {value}</p>
      <button onClick={debouncedCallback.cancel}>Cancel Debounce cycle</button>
    </div>
  );
}
```


## Debounce Options for `useDebounce` and `useDelayedFn`

Both the `useDebounce` and `useDelayedFn` hooks offer the ability to provide additional options as a third argument. These options allow you to customize the behavior of the debouncing process according to your requirements.

Of course, here's the modified document without the example column:

---

## Debounce Options for `useDebounce` and `useDebouncedCallback`

Both the `useDebounce` and `useDebouncedCallback` hooks offer the ability to provide additional options as a third argument. These options allow you to customize the behavior of the debouncing process according to your requirements.

### Common Options

| Option     | Default | Description                                                                                           |
|------------|---------|-------------------------------------------------------------------------------------------------------|
| maxWait    | -       | Specifies the maximum time the function (`func`) is allowed to be delayed before it's invoked.     |
| leading    | -       | When this parameter is enabled, the function will be executed once immediately when called. Subsequent calls will be debounced until the timeout expires. |
| trailing   | true    | If enabled, this parameter executes the function after the debounce timeout.                        |
| equalityFn | (prev, next) => prev === next | *(Only for `useDebounce`)* A comparator function that determines whether the timeout should be started. |


#### `maxWait` Option

The `maxWait` option defines the maximum time period that the `func` is allowed to be delayed before it is invoked. This can be particularly useful in scenarios where you want to ensure that the function is eventually executed even if the debounce process continues for an extended time.

#### `leading` and `trailing` Options

The `leading` option, when enabled, causes the function to execute once immediately when called. Subsequent calls to the function during the debounce timeout will be debounced, ensuring that the function is only executed once the timeout expires.

The `trailing` option, if set to `true` (which is the default), executes the function after the debounce timeout.


#### `equalityFn` Option *(Only for `useDebounce`)*

The `equalityFn` option is exclusive to the `useDebounce` hook. It allows you to provide a custom comparator function that determines whether the timeout for debouncing should be started. This is useful in scenarios where you want more control over when the debounce process should occur.

### Examples

#### Using `maxWait`

```jsx
const debouncedFunction = useDebounce(myFunction, 300, { maxWait: 1000 });
```

In this example, `myFunction` will be invoked either when the debounce timeout of 300ms expires or after a maximum of 1000ms, whichever happens sooner.

#### Using `leading` and `trailing`

```jsx
const debouncedFunction = useDelayedFn(myFunction, 300, { leading: true, trailing: false });
```

With the `leading` option enabled and `trailing` option disabled, the `myFunction` will execute immediately upon being called, and subsequent calls during the debounce timeout will not trigger additional executions.


[package-npm-link]: https://www.npmjs.com/package/@reactutils/useDebounce
[package-bundlephobia]: https://bundlephobia.com/package/@reactutils/useDebounce
