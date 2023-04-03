# @reactutils/use-delayed-queue

[![NPM](https://img.shields.io/npm/v/@reactutils/use-delayed-queue.svg)][package-npm-link]
[![NPM](https://img.shields.io/bundlephobia/min/@reactutils/use-delayed-queue)][package-bundlephobia]

> A custom hook for queuing and executing functions in order with a specified timeout.


## Installation

```sh
npm install @reactutils/use-delayed-queue

# or

yarn add @reactutils/use-delayed-queue
```

## Usage:

```ts
import useQueue from '@reactutils/use-delayed-queue';

function MyComponent() {
  const { addToQueue } = useQueue();

  const fn1 = () => {
    console.log('Function 1 executed');
  };

  const fn2 = () => {
    console.log('Function 2 executed');
  };

  addToQueue(fn1);
  addToQueue(fn2);

  return <div>My Component</div>;
}
```

[package-npm-link]: https://www.npmjs.com/package/@reactutils/use-delayed-queue
[package-bundlephobia]: https://bundlephobia.com/package/@reactutils/use-delayed-queue
