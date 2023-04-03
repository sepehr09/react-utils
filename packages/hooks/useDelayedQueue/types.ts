export type QueueFn = (args?: any) => void;

export type UseQueueReturnType = {
  addToQueue: (fn: QueueFn) => void;
};
