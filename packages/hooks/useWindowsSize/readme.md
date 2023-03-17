# @reactutils/use-windows-size

[![NPM](https://img.shields.io/npm/v/@reactutils/use-windows-size.svg)][package-npm-link]
[![NPM](https://img.shields.io/bundlephobia/min/@reactutils/use-windows-size)][package-bundlephobia]

> this hook returns an object containing the window's width and height. If executed server-side (no window object) the value of width and height will be undefined.

## Installation

```sh
npm install @reactutils/use-windows-size

# or

yarn add @reactutils/use-windows-size
```


## Usage

```jsx
import useWindowSize from '@reactutils/use-windows-size';

// Usage
function App() {
  const size = useWindowSize();
  
  return (
    <div>
      {size.width}px / {size.height}px
    </div>
  );
}
```

[package-npm-link]: https://www.npmjs.com/package/@reactutils/use-windows-size
[package-bundlephobia]: https://bundlephobia.com/package/@reactutils/use-windows-size