# useDelayedStack

> a React hook used for batching real-time or periodic data processing by accumulating data in a stack and calling a callback function with a specified delay.

The purpose of the useDelayedStack hook is to allow for efficient handling of real-time or periodic data by accumulating it in a stack over time and calling a user-provided callback function after a specified delay. This allows for batching of data processing, resulting in improved performance over calling the callback function for each individual data point.


## Installation

```sh
npm install @react-utils/use-delayed-stack

# or

yarn add @react-utils/use-delayed-stack
```


This is a custom React hook named `useDelayedStack`. It takes in three arguments:

`callback`: A function that takes an array of type T as its argument and returns void. This function will be called whenever the stack is flushed.

`delay`: A number which represents the delay in milliseconds after which the stack is flushed.
initialValue: An optional argument which determines the initial value of the stack. If not provided, the initial value of the stack will be an empty array.
The hook returns an array of two values:

`pushToStack`: A function that takes a value of type T as its argument and adds it to the stack.

`cancel`: A function that aborts the current timer and creates a new abort controller.
The hook uses useRef to create references to the current stack, timer and abort controller. It also uses useEffect to create a new interval timer when the hook is called and to clear it up when it's unmounted.

Whenever the timer is triggered, it checks if the stack has any items, and if it does, it will call the provided callback and empty the stack. The cancel function aborts the current timer and creates a new one so that the stack will start accumulating new items again.


## Usage:

```ts
const [pushToStack, cancel] = useDelayedStack(callback, delay, initialValue);

// To push a value onto the stack
pushToStack(value);

// To stop the timer manually
cancel();
```