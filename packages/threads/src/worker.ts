import {isMainThread, parentPort} from "worker_threads";

if (isMainThread) {
  throw "This is not a worker thread";
} else {
  if (parentPort) {
    // Listen for messages from the main thread
    parentPort.on('message', (data) => {
      const result = fibonacci(data.number);
      parentPort?.postMessage(result);
      process.exit();
    });
  }
}

// A naive recursive (slow) fibonacci implementation
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
