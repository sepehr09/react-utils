# @reactutils/use-previous

[![NPM](https://img.shields.io/npm/v/@reactutils/use-previous.svg)][package-npm-link]
[![NPM](https://img.shields.io/bundlephobia/min/@reactutils/use-previous)][package-bundlephobia]

> A custom hook that uses the useRef hook internally for storing the previous value.

## Installation

```sh
npm install @reactutils/use-previous

# or

yarn add @reactutils/use-previous
```


## Usage

```jsx
import usePrevious from '@reactutils/use-previous';

function App() {
  // State value and setter for our example
  const [count, setCount] = useState<number>(0);

  // Get the previous value (was passed into hook on last render)
  const prevCount: number = usePrevious<number>(count);
  
  // Display both current and previous count value
  return (
    <div>
      <h1>
        Now: {count}, before: {prevCount}
      </h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

```

[package-npm-link]: https://www.npmjs.com/package/@reactutils/use-previous
[package-bundlephobia]: https://bundlephobia.com/package/@reactutils/use-previous