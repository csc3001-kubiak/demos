import { Worker, isMainThread } from "worker_threads";

const WORKER_FILE = "./dist/philo_worker.js"; // <-- Note: Must be JS file
const WORKER_COUNT = 5;

if (isMainThread) {
  // Create a shared buffer that can be accessed by all threads
  const sharedBuffer = new SharedArrayBuffer(5 /* bytes */);
  const chopsticks = new Uint8Array(sharedBuffer);
  let workers: Worker[] = [];

  while (workers.length < WORKER_COUNT) {
    const number = workers.length;

    // Start a worker
    const worker = new Worker(WORKER_FILE, {
      workerData: {
        number,
        sharedBuffer
      }
    });
    workers.push(worker);

    // Listen for messages from the worker
    worker.on('message', (result) => {
      const using = chopsticks.filter((byte) => byte !== 0).length;
      console.log(`Worker ${number} message:`, result);
      console.log('Chopsticks in use: ', using);
    });

    // Handle worker errors
    worker.on('error', (error) => {
      console.error(`Worker ${number} error:`, error);
    });

    // Handle worker completion
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker ${number} stopped with exit code ${code}`);
      }
    });
  }

  // Start the philosophers eating
  workers.forEach((w, i) => {
    w.postMessage({ start: true });
    console.log("Started worker ", i);
  });

} else {
  throw "This is not the main thread";
}
