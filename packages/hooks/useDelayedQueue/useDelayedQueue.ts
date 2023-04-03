import { QueueFn, UseQueueReturnType } from './types';

const useQueue = (timeout = 1000): UseQueueReturnType => {
  const queue: QueueFn[] = [];
  let notRunning = true;

  const runQueue = () => {
    if (queue.length > 0) {
      const fn = queue.shift();
      fn?.();
      setTimeout(runQueue, timeout);
    } else {
      notRunning = true;
    }
  };

  const addToQueue = (fn: QueueFn) => {
    queue.push(fn);
    if (notRunning) {
      notRunning = false;
      runQueue();
    }
  };

  return { addToQueue };
};

export default useQueue;
