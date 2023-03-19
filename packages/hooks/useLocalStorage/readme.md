# @reactutils/use-local-storage

[![NPM](https://img.shields.io/npm/v/@reactutils/use-local-storage.svg)][package-npm-link]
[![NPM](https://img.shields.io/bundlephobia/min/@reactutils/use-local-storage)][package-bundlephobia]

> A custom hook that provides a simple interface to the browser's local storage.

Store a key-value pair in the browser's local storage. The value will persist even after the browser is closed. Since the local storage API isn't available in server-rendering environments, we check that `typeof window !== "undefined"` to make SSR and SSG work properly.

## Installation

```sh
npm install @reactutils/use-local-storage

# or

yarn add @reactutils/use-local-storage
```


## Usage

```jsx
 function App() {
   // Similar to useState but first arg is key, and the second is the default value.
   const [name, setName] = useLocalStorage<string>("name", "Bob");
   
   return (
     <div>
       <input
         type="text"
         placeholder="Enter your name"
         value={name}
         onChange={(e) => setName(e.target.value)}
       />
     </div>
   );
 }
 ```
[package-npm-link]: https://www.npmjs.com/package/@reactutils/use-local-storage
[package-bundlephobia]: https://bundlephobia.com/package/@reactutils/use-local-storage